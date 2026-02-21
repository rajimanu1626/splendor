import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import { RoomManager } from './RoomManager';
import { GameRoomLogic } from './GameRoom';
import { sanitizeForPlayer } from './sanitize';
import { CLIENT_EVENTS, SERVER_EVENTS } from './protocol';
const PORT = process.env.GAME_SERVER_PORT ? parseInt(process.env.GAME_SERVER_PORT, 10) : 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: CORS_ORIGIN,
        methods: ['GET', 'POST'],
    },
});
const gameRooms = new Map();
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'splendor-game-server' });
});
function broadcastRoomUpdate(roomCode) {
    const room = RoomManager.getRoom(roomCode);
    if (!room)
        return;
    const payload = RoomManager.toRoomUpdatePayload(room);
    const socketIds = RoomManager.getSocketIdsInRoom(room);
    for (const id of socketIds) {
        io.to(id).emit(SERVER_EVENTS.roomUpdate, payload);
    }
}
function broadcastGameState(roomCode) {
    const game = gameRooms.get(roomCode);
    const room = RoomManager.getRoom(roomCode);
    if (!game || !room)
        return;
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
    socket.on(CLIENT_EVENTS.createRoom, (payload) => {
        const result = RoomManager.createRoom(socket.id, payload.playerName.trim() || 'Player');
        if (!result) {
            socket.emit(SERVER_EVENTS.actionError, { message: 'Failed to create room' });
            return;
        }
        socket.join(result.roomCode);
        socket.emit(SERVER_EVENTS.roomCreated, { roomCode: result.roomCode, playerId: result.playerId });
        broadcastRoomUpdate(result.roomCode);
    });
    socket.on(CLIENT_EVENTS.joinRoom, (payload) => {
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
    socket.on(CLIENT_EVENTS.addAI, (payload) => {
        const info = RoomManager.getRoomBySocket(socket.id);
        if (!info)
            return;
        const ok = RoomManager.addAI(info.room.roomCode, socket.id, payload.difficulty);
        if (ok)
            broadcastRoomUpdate(info.room.roomCode);
    });
    socket.on(CLIENT_EVENTS.rejoinRoom, (payload) => {
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
        }
    });
    socket.on(CLIENT_EVENTS.startGame, () => {
        const info = RoomManager.getRoomBySocket(socket.id);
        if (!info)
            return;
        const { room } = info;
        if (room.hostId !== info.playerId)
            return;
        if (room.gameStarted)
            return;
        if (room.players.length < 2 || room.players.length > 4)
            return;
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
    socket.on(CLIENT_EVENTS.action, (payload) => {
        const info = RoomManager.getRoomBySocket(socket.id);
        if (!info)
            return;
        const game = gameRooms.get(info.room.roomCode);
        if (!game)
            return;
        const err = game.handleAction(info.playerId, payload);
        if (err) {
            socket.emit(SERVER_EVENTS.actionError, { message: err });
            return;
        }
        broadcastGameState(info.room.roomCode);
    });
    socket.on('disconnect', () => {
        const result = RoomManager.markDisconnected(socket.id);
        if (result) {
            socket.leave(result.roomCode);
            broadcastRoomUpdate(result.roomCode);
            if (result.disconnectedPlayerId && result.disconnectedPlayerName) {
                io.to(result.roomCode).emit(SERVER_EVENTS.playerDisconnected, {
                    playerId: result.disconnectedPlayerId,
                    playerName: result.disconnectedPlayerName,
                });
            }
        }
    });
});
httpServer.listen(PORT, () => {
    console.log(`Splendor game server listening on port ${PORT}`);
    console.log(`CORS origin: ${CORS_ORIGIN}`);
});
