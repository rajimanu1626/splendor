import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import { RoomManager } from './RoomManager';
import { GameRoomLogic } from './GameRoom';
import { sanitizeForPlayer } from './sanitize';
import { CLIENT_EVENTS, SERVER_EVENTS } from './protocol';
import type { CreateRoomPayload, JoinRoomPayload, AddAIPayload, RejoinRoomPayload, GameActionPayload } from './protocol';
import type { RematchUpdatePayload } from './protocol';

const PORT = process.env.GAME_SERVER_PORT ? parseInt(process.env.GAME_SERVER_PORT, 10) : 3001;
const CORS_ORIGINS = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((s) => s.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://172.17.121.16:3000'];

const app = express();
const httpServer = createServer(app);

const DISCONNECT_GRACE_MS = 15000;

const io = new Server(httpServer, {
  pingTimeout: 60000,
  pingInterval: 25000,
  cors: {
    origin: (origin, cb) => {
      if (!origin || CORS_ORIGINS.includes(origin)) return cb(null, true);
      if (!process.env.CORS_ORIGIN && /^https?:\/\/[^/]+:3000\/?$/.test(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
  },
});

const pendingDisconnects = new Map<
  string,
  { socketId: string; roomCode: string; playerId: string; playerName: string; timer: ReturnType<typeof setTimeout> }
>();

const gameRooms = new Map<string, GameRoomLogic>();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'splendor-game-server' });
});

function broadcastRoomUpdate(roomCode: string): void {
  const room = RoomManager.getRoom(roomCode);
  if (!room) return;
  const payload = RoomManager.toRoomUpdatePayload(room);
  const socketIds = RoomManager.getSocketIdsInRoom(room);
  for (const id of socketIds) {
    io.to(id).emit(SERVER_EVENTS.roomUpdate, payload);
  }
}

function broadcastGameState(roomCode: string): void {
  const game = gameRooms.get(roomCode);
  const room = RoomManager.getRoom(roomCode);
  if (!game || !room) return;
  const state = game.getState();
  const socketIds = RoomManager.getSocketIdsInRoom(room);
  for (const rp of room.players) {
    if (rp.socketId) {
      const sanitized = sanitizeForPlayer(state, rp.playerId);
      io.to(rp.socketId).emit(SERVER_EVENTS.gameState, { gameState: sanitized, yourPlayerId: rp.playerId });
    }
  }
}

io.on('connection', (socket) => {
  socket.on(CLIENT_EVENTS.createRoom, (payload: CreateRoomPayload) => {
    const result = RoomManager.createRoom(socket.id, payload.playerName.trim() || 'Player');
    if (!result) {
      socket.emit(SERVER_EVENTS.actionError, { message: 'Failed to create room' });
      return;
    }
    socket.join(result.roomCode);
    socket.emit(SERVER_EVENTS.roomCreated, { roomCode: result.roomCode, playerId: result.playerId });
    broadcastRoomUpdate(result.roomCode);
  });

  socket.on(CLIENT_EVENTS.joinRoom, (payload: JoinRoomPayload) => {
    const result = RoomManager.joinRoom(payload.roomCode, socket.id, payload.playerName.trim() || 'Player');
    if (!result) {
      socket.emit(SERVER_EVENTS.actionError, { message: 'Room not found, full, or game already started' });
      return;
    }
    socket.join(payload.roomCode.toUpperCase().trim());
    socket.emit(SERVER_EVENTS.roomJoined, { roomCode: payload.roomCode.toUpperCase().trim(), playerId: result.playerId });
    broadcastRoomUpdate(payload.roomCode.toUpperCase().trim());
  });

  socket.on(CLIENT_EVENTS.leaveRoom, () => {
    const result = RoomManager.leaveRoom(socket.id);
    if (result) {
      socket.leave(result.roomCode);
      broadcastRoomUpdate(result.roomCode);
    }
  });

  socket.on(CLIENT_EVENTS.addAI, (payload: AddAIPayload) => {
    const info = RoomManager.getRoomBySocket(socket.id);
    if (!info) return;
    const ok = RoomManager.addAI(info.room.roomCode, socket.id, payload.difficulty);
    if (ok) broadcastRoomUpdate(info.room.roomCode);
  });

  socket.on(CLIENT_EVENTS.rejoinRoom, (payload: RejoinRoomPayload) => {
    const pending = pendingDisconnects.get(payload.playerId);
    if (pending) {
      clearTimeout(pending.timer);
      pendingDisconnects.delete(payload.playerId);
    }
    const ok = RoomManager.rejoinRoom(payload.roomCode, payload.playerId, socket.id);
    if (!ok) {
      socket.emit(SERVER_EVENTS.actionError, { message: 'Could not rejoin room' });
      return;
    }
    const code = payload.roomCode.toUpperCase().trim();
    const room = RoomManager.getRoom(code);
    if (room) {
      socket.join(room.roomCode);
      const payloadUpdate = RoomManager.toRoomUpdatePayload(room);
      socket.emit(SERVER_EVENTS.roomUpdate, payloadUpdate);
      const game = gameRooms.get(room.roomCode);
      if (game) {
        const sanitized = sanitizeForPlayer(game.getState(), payload.playerId);
        socket.emit(SERVER_EVENTS.gameState, { gameState: sanitized, yourPlayerId: payload.playerId });
      }
      io.to(room.roomCode).emit(SERVER_EVENTS.playerReconnected, { playerId: payload.playerId });
      broadcastRoomUpdate(code);
    }
  });

  socket.on(CLIENT_EVENTS.startGame, () => {
    const info = RoomManager.getRoomBySocket(socket.id);
    if (!info) return;
    const { room } = info;
    if (room.hostId !== info.playerId) return;
    if (room.gameStarted) return;
    if (room.players.length < 2 || room.players.length > 4) return;

    RoomManager.setGameStarted(room.roomCode);
    const game = new GameRoomLogic(room);
    game.onStateChange = () => broadcastGameState(room.roomCode);
    gameRooms.set(room.roomCode, game);
    broadcastGameState(room.roomCode);
    const currentPlayer = game.getState().players[game.getState().currentPlayerIndex];
    if (currentPlayer?.isAI) {
      game.runAITurn();
    }
  });

  socket.on(CLIENT_EVENTS.action, (payload: GameActionPayload) => {
    const info = RoomManager.getRoomBySocket(socket.id);
    if (!info) return;
    const game = gameRooms.get(info.room.roomCode);
    if (!game) return;
    const err = game.handleAction(info.playerId, payload);
    if (err) {
      socket.emit(SERVER_EVENTS.actionError, { message: err });
      return;
    }
    broadcastGameState(info.room.roomCode);
  });

  socket.on(CLIENT_EVENTS.requestRematch, () => {
    const info = RoomManager.getRoomBySocket(socket.id);
    if (!info) return;
    const game = gameRooms.get(info.room.roomCode);
    const room = RoomManager.getRoom(info.room.roomCode);
    if (!game || !room || game.getState().phase !== 'ended') return;
    const allVoted = game.voteRematch(info.playerId);
    const payload: RematchUpdatePayload = game.getRematchVotes();
    const socketIds = RoomManager.getSocketIdsInRoom(room);
    for (const id of socketIds) {
      io.to(id).emit(SERVER_EVENTS.rematchUpdate, payload);
    }
    if (allVoted) {
      game.restart(room);
      for (const id of socketIds) {
        io.to(id).emit(SERVER_EVENTS.rematchStarted);
      }
      broadcastGameState(info.room.roomCode);
    }
  });

  socket.on(CLIENT_EVENTS.quitAndReplaceWithAI, () => {
    const info = RoomManager.getRoomBySocket(socket.id);
    if (!info) {
      socket.emit(SERVER_EVENTS.actionError, { message: 'Cannot quit (not in a started game)' });
      return;
    }
    const { room, playerId } = info;
    if (!room.gameStarted) {
      socket.emit(SERVER_EVENTS.actionError, { message: 'Cannot quit (game not started)' });
      return;
    }
    const quittingPlayer = room.players.find((p) => p.playerId === playerId);
    const playerName = quittingPlayer?.playerName ?? 'A player';

    const result = RoomManager.replacePlayerWithAIBySocket(socket.id);
    if (!result) {
      socket.emit(SERVER_EVENTS.actionError, { message: 'Cannot quit (not in a started game)' });
      return;
    }
    const game = gameRooms.get(result.roomCode);
    if (game) game.replacePlayerWithAI(result.playerId);
    socket.leave(result.roomCode);

    const roomAfter = RoomManager.getRoom(result.roomCode);
    const noHumansLeft = roomAfter?.players.every((p) => p.isAI) ?? false;
    if (noHumansLeft) {
      gameRooms.delete(result.roomCode);
      RoomManager.removeRoom(result.roomCode);
    } else {
      io.to(result.roomCode).emit(SERVER_EVENTS.playerQuit, { playerName });
      broadcastGameState(result.roomCode);
    }

    socket.emit(SERVER_EVENTS.quitAccepted);
  });

  socket.on('disconnect', () => {
    const info = RoomManager.getRoomBySocket(socket.id);
    if (!info) return;
    const { room, playerId } = info;
    const player = room.players.find((p) => p.playerId === playerId);
    if (!player || player.isAI) return;
    const roomCode = room.roomCode;
    const playerName = player.playerName;
    const oldSocketId = socket.id;
    socket.leave(roomCode);
    RoomManager.setPlayerDisconnected(oldSocketId);
    broadcastRoomUpdate(roomCode);
    const timer = setTimeout(() => {
      pendingDisconnects.delete(playerId);
      io.to(roomCode).emit(SERVER_EVENTS.playerDisconnected, {
        playerId,
        playerName,
      });
    }, DISCONNECT_GRACE_MS);
    pendingDisconnects.set(playerId, {
      socketId: oldSocketId,
      roomCode,
      playerId,
      playerName,
      timer,
    });
  });
});

httpServer.listen(PORT, () => {
  console.log(`Splendor game server listening on port ${PORT}`);
  console.log(`CORS origins: ${CORS_ORIGINS.join(', ')}`);
});
