import type { AIDifficulty } from '../lib/game-engine/types';
import type { RoomPlayerInfo, RoomUpdatePayload } from './protocol';

const ROOM_CODE_LENGTH = 4;
const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I, O to avoid confusion

export interface RoomPlayer {
  playerId: string;
  playerName: string;
  isAI: boolean;
  aiDifficulty?: AIDifficulty;
  socketId: string | null;
}

export interface Room {
  roomCode: string;
  hostId: string;
  players: RoomPlayer[];
  gameStarted: boolean;
}

export interface SocketRoomInfo {
  roomCode: string;
  playerId: string;
}

function generateId(): string {
  return 'p-' + Math.random().toString(36).slice(2, 10);
}

function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}

class RoomManagerClass {
  private rooms = new Map<string, Room>();
  private socketToRoom = new Map<string, SocketRoomInfo>();

  createRoom(socketId: string, playerName: string): { roomCode: string; playerId: string } | null {
    const playerId = generateId();
    let roomCode = generateRoomCode();
    while (this.rooms.has(roomCode)) {
      roomCode = generateRoomCode();
    }
    const room: Room = {
      roomCode,
      hostId: playerId,
      players: [
        { playerId, playerName, isAI: false, socketId },
      ],
      gameStarted: false,
    };
    this.rooms.set(roomCode, room);
    this.socketToRoom.set(socketId, { roomCode, playerId });
    return { roomCode, playerId };
  }

  joinRoom(roomCode: string, socketId: string, playerName: string): { playerId: string } | null {
    const code = roomCode.toUpperCase().trim();
    const room = this.rooms.get(code);
    if (!room || room.gameStarted || room.players.length >= 4) return null;
    const alreadyJoined = room.players.some((p) => p.socketId === socketId);
    if (alreadyJoined) return null;

    const playerId = generateId();
    room.players.push({ playerId, playerName, isAI: false, socketId });
    this.socketToRoom.set(socketId, { roomCode: code, playerId });
    return { playerId };
  }

  leaveRoom(socketId: string): { roomCode: string; room: Room } | null {
    const info = this.socketToRoom.get(socketId);
    if (!info) return null;

    const room = this.rooms.get(info.roomCode);
    if (!room) {
      this.socketToRoom.delete(socketId);
      return null;
    }

    const index = room.players.findIndex((p) => p.playerId === info.playerId);
    if (index === -1) {
      this.socketToRoom.delete(socketId);
      return null;
    }

    room.players.splice(index, 1);
    this.socketToRoom.delete(socketId);

    if (room.players.length === 0) {
      this.rooms.delete(info.roomCode);
      return null;
    }

    // If host left, assign new host (first human player)
    if (room.hostId === info.playerId) {
      const newHost = room.players.find((p) => !p.isAI) ?? room.players[0];
      room.hostId = newHost.playerId;
    }

    return { roomCode: info.roomCode, room };
  }

  addAI(roomCode: string, socketId: string, difficulty: AIDifficulty): boolean {
    const info = this.socketToRoom.get(socketId);
    if (!info || info.roomCode !== roomCode) return false;

    const room = this.rooms.get(roomCode);
    if (!room || room.gameStarted || room.hostId !== info.playerId) return false;
    if (room.players.length >= 4) return false;

    const playerId = generateId();
    room.players.push({
      playerId,
      playerName: `AI (${difficulty})`,
      isAI: true,
      aiDifficulty: difficulty,
      socketId: null,
    });
    return true;
  }

  getRoom(roomCode: string): Room | null {
    return this.rooms.get(roomCode.toUpperCase().trim()) ?? null;
  }

  getRoomBySocket(socketId: string): { room: Room; playerId: string } | null {
    const info = this.socketToRoom.get(socketId);
    if (!info) return null;
    const room = this.rooms.get(info.roomCode) ?? null;
    if (!room) return null;
    return { room, playerId: info.playerId };
  }

  /** Set player's socketId to null and remove from socketToRoom. Use on disconnect so UI shows disconnected; rejoin can restore. */
  setPlayerDisconnected(socketId: string): string | null {
    const info = this.socketToRoom.get(socketId);
    if (!info) return null;
    this.socketToRoom.delete(socketId);
    const room = this.rooms.get(info.roomCode) ?? null;
    if (!room) return null;
    const player = room.players.find((p) => p.playerId === info.playerId);
    if (player && !player.isAI) player.socketId = null;
    return info.roomCode;
  }

  /** Mark player as disconnected (socketId -> null). Does not remove from room. */
  markDisconnected(socketId: string): { roomCode: string; room: Room; disconnectedPlayerId?: string; disconnectedPlayerName?: string } | null {
    const info = this.socketToRoom.get(socketId);
    if (!info) return null;
    const room = this.rooms.get(info.roomCode) ?? null;
    if (!room) {
      this.socketToRoom.delete(socketId);
      return null;
    }
    const player = room.players.find((p) => p.playerId === info.playerId);
    const disconnectedPlayerId = player && !player.isAI ? player.playerId : undefined;
    const disconnectedPlayerName = player && !player.isAI ? player.playerName : undefined;
    if (player && !player.isAI) {
      player.socketId = null;
    }
    this.socketToRoom.delete(socketId);
    return { roomCode: info.roomCode, room, disconnectedPlayerId, disconnectedPlayerName };
  }

  rejoinRoom(roomCode: string, playerId: string, socketId: string): boolean {
    const code = roomCode.toUpperCase().trim();
    const room = this.rooms.get(code);
    if (!room) return false;
    const player = room.players.find((p) => p.playerId === playerId);
    if (!player || player.isAI) return false;
    player.socketId = socketId;
    this.socketToRoom.set(socketId, { roomCode: code, playerId });
    return true;
  }

  /** During a game, replace the player identified by socket with AI (medium). Returns roomCode and playerId or null. */
  replacePlayerWithAIBySocket(socketId: string): { roomCode: string; playerId: string } | null {
    const info = this.socketToRoom.get(socketId);
    if (!info) return null;
    const room = this.rooms.get(info.roomCode);
    if (!room || !room.gameStarted) return null;
    const player = room.players.find((p) => p.playerId === info.playerId);
    if (!player || player.isAI) return null;
    player.isAI = true;
    player.aiDifficulty = 'medium';
    player.playerName = 'AI (medium)';
    player.socketId = null;
    this.socketToRoom.delete(socketId);
    return { roomCode: info.roomCode, playerId: info.playerId };
  }

  setGameStarted(roomCode: string): void {
    const room = this.rooms.get(roomCode);
    if (room) room.gameStarted = true;
  }

  toRoomUpdatePayload(room: Room): RoomUpdatePayload {
    const players: RoomPlayerInfo[] = room.players.map((p) => ({
      playerId: p.playerId,
      playerName: p.playerName,
      isAI: p.isAI,
      aiDifficulty: p.aiDifficulty,
      socketId: p.socketId,
      isConnected: p.isAI || p.socketId != null,
    }));
    return {
      roomCode: room.roomCode,
      hostId: room.hostId,
      players,
      canStart: room.players.length >= 2 && room.players.length <= 4 && !room.gameStarted,
    };
  }

  getSocketIdsInRoom(room: Room): string[] {
    return room.players.filter((p): p is RoomPlayer & { socketId: string } => p.socketId != null).map((p) => p.socketId);
  }

  removeRoom(roomCode: string): void {
    const room = this.rooms.get(roomCode.toUpperCase().trim());
    if (room) {
      for (const p of room.players) {
        if (p.socketId) this.socketToRoom.delete(p.socketId);
      }
      this.rooms.delete(roomCode.toUpperCase().trim());
    }
  }
}

export const RoomManager = new RoomManagerClass();
