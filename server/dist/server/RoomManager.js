const ROOM_CODE_LENGTH = 4;
const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I, O to avoid confusion
function generateId() {
    return 'p-' + Math.random().toString(36).slice(2, 10);
}
function generateRoomCode() {
    let code = '';
    for (let i = 0; i < ROOM_CODE_LENGTH; i++) {
        code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
    }
    return code;
}
class RoomManagerClass {
    rooms = new Map();
    socketToRoom = new Map();
    createRoom(socketId, playerName) {
        const playerId = generateId();
        let roomCode = generateRoomCode();
        while (this.rooms.has(roomCode)) {
            roomCode = generateRoomCode();
        }
        const room = {
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
    joinRoom(roomCode, socketId, playerName) {
        const code = roomCode.toUpperCase().trim();
        const room = this.rooms.get(code);
        if (!room || room.gameStarted || room.players.length >= 4)
            return null;
        const alreadyJoined = room.players.some((p) => p.socketId === socketId);
        if (alreadyJoined)
            return null;
        const playerId = generateId();
        room.players.push({ playerId, playerName, isAI: false, socketId });
        this.socketToRoom.set(socketId, { roomCode: code, playerId });
        return { playerId };
    }
    leaveRoom(socketId) {
        const info = this.socketToRoom.get(socketId);
        if (!info)
            return null;
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
    addAI(roomCode, socketId, difficulty) {
        const info = this.socketToRoom.get(socketId);
        if (!info || info.roomCode !== roomCode)
            return false;
        const room = this.rooms.get(roomCode);
        if (!room || room.gameStarted || room.hostId !== info.playerId)
            return false;
        if (room.players.length >= 4)
            return false;
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
    getRoom(roomCode) {
        return this.rooms.get(roomCode.toUpperCase().trim()) ?? null;
    }
    getRoomBySocket(socketId) {
        const info = this.socketToRoom.get(socketId);
        if (!info)
            return null;
        const room = this.rooms.get(info.roomCode) ?? null;
        if (!room)
            return null;
        return { room, playerId: info.playerId };
    }
    /** Mark player as disconnected (socketId -> null). Does not remove from room. */
    markDisconnected(socketId) {
        const info = this.socketToRoom.get(socketId);
        if (!info)
            return null;
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
    rejoinRoom(roomCode, playerId, socketId) {
        const code = roomCode.toUpperCase().trim();
        const room = this.rooms.get(code);
        if (!room)
            return false;
        const player = room.players.find((p) => p.playerId === playerId);
        if (!player || player.isAI)
            return false;
        player.socketId = socketId;
        this.socketToRoom.set(socketId, { roomCode: code, playerId });
        return true;
    }
    setGameStarted(roomCode) {
        const room = this.rooms.get(roomCode);
        if (room)
            room.gameStarted = true;
    }
    toRoomUpdatePayload(room) {
        const players = room.players.map((p) => ({
            playerId: p.playerId,
            playerName: p.playerName,
            isAI: p.isAI,
            aiDifficulty: p.aiDifficulty,
            socketId: p.socketId,
            isConnected: true,
        }));
        return {
            roomCode: room.roomCode,
            hostId: room.hostId,
            players,
            canStart: room.players.length >= 2 && room.players.length <= 4 && !room.gameStarted,
        };
    }
    getSocketIdsInRoom(room) {
        return room.players.filter((p) => p.socketId != null).map((p) => p.socketId);
    }
}
export const RoomManager = new RoomManagerClass();
