'use client';

import { useEffect, useState, useCallback } from 'react';
import { io, type Socket } from 'socket.io-client';
import {
  CLIENT_EVENTS,
  SERVER_EVENTS,
  type RoomUpdatePayload,
  type GameStatePayload,
  type ActionErrorPayload,
  type GameActionPayload,
  type RoomCreatedPayload,
  type RoomJoinedPayload,
} from '@/lib/game-protocol';
import type { GemColor, GemType } from '@/lib/game-engine/types';

function getServerUrl(): string {
  if (typeof window === 'undefined') return '';
  const env = process.env.NEXT_PUBLIC_GAME_SERVER_URL;
  if (env) return env;
  const { hostname, port } = window.location;
  const gamePort = '3001';
  return `${window.location.protocol}//${hostname}:${gamePort}`;
}

const SOCKET_GLOBAL_KEY = '__SPLENDOR_SOCKET__';

declare global {
  interface Window {
    [SOCKET_GLOBAL_KEY]?: Socket;
  }
}

function getSocket(): Socket | null {
  if (typeof window === 'undefined') return null;
  let socket = window[SOCKET_GLOBAL_KEY];
  if (!socket) {
    const url = getServerUrl();
    socket = io(url, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
      timeout: 20000,
    });
    window[SOCKET_GLOBAL_KEY] = socket;
  }
  return socket;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export function useSocket() {
  const socket = getSocket();
  const [status, setStatus] = useState<ConnectionStatus>(() =>
    socket?.connected ? 'connected' : 'disconnected',
  );

  useEffect(() => {
    if (!socket) return;
    setStatus(socket.connected ? 'connected' : 'connecting');
    const onConnect = () => {
      setStatus('connected');
      try {
        const stored = typeof window !== 'undefined' ? sessionStorage.getItem('splendor_room') : null;
        if (stored) {
          const { roomCode, playerId } = JSON.parse(stored) as { roomCode: string; playerId: string };
          socket.emit(CLIENT_EVENTS.rejoinRoom, { roomCode, playerId });
        }
      } catch (_) {}
    };
    socket.on('connect', onConnect);
    socket.on('disconnect', () => setStatus('disconnected'));
    socket.on('connect_error', () => setStatus('disconnected'));
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, [socket]);

  return { socket, status };
}

export interface RoomState {
  roomCode: string | null;
  hostId: string | null;
  players: RoomUpdatePayload['players'];
  canStart: boolean;
  myPlayerId: string | null;
}

export function useRoom() {
  const { socket } = useSocket();
  const [room, setRoom] = useState<RoomState>({
    roomCode: null,
    hostId: null,
    players: [],
    canStart: false,
    myPlayerId: null,
  });

  useEffect(() => {
    if (!socket) return;

    const onRoomCreated = (data: RoomCreatedPayload) => {
      setRoom((prev) => ({
        ...prev,
        roomCode: data.roomCode,
        myPlayerId: data.playerId,
      }));
    };

    const onRoomJoined = (data: RoomJoinedPayload) => {
      setRoom((prev) => ({
        ...prev,
        roomCode: data.roomCode,
        myPlayerId: data.playerId,
      }));
    };

    const onRoomUpdate = (payload: RoomUpdatePayload) => {
      setRoom((prev) => ({
        ...prev,
        roomCode: payload.roomCode,
        hostId: payload.hostId,
        players: payload.players,
        canStart: payload.canStart,
      }));
    };

    const onRoomClosed = () => {
      setRoom({
        roomCode: null,
        hostId: null,
        players: [],
        canStart: false,
        myPlayerId: null,
      });
    };

    socket.on(SERVER_EVENTS.roomCreated, onRoomCreated);
    socket.on(SERVER_EVENTS.roomJoined, onRoomJoined);
    socket.on(SERVER_EVENTS.roomUpdate, onRoomUpdate);
    socket.on(SERVER_EVENTS.roomClosed, onRoomClosed);

    return () => {
      socket.off(SERVER_EVENTS.roomCreated, onRoomCreated);
      socket.off(SERVER_EVENTS.roomJoined, onRoomJoined);
      socket.off(SERVER_EVENTS.roomUpdate, onRoomUpdate);
      socket.off(SERVER_EVENTS.roomClosed, onRoomClosed);
    };
  }, [socket]);

  const createRoom = useCallback(
    (playerName: string) => {
      socket?.emit(CLIENT_EVENTS.createRoom, { playerName });
    },
    [socket],
  );

  const joinRoom = useCallback(
    (roomCode: string, playerName: string) => {
      socket?.emit(CLIENT_EVENTS.joinRoom, { roomCode: roomCode.toUpperCase().trim(), playerName });
    },
    [socket],
  );

  const leaveRoom = useCallback(() => {
    try {
      if (typeof window !== 'undefined') sessionStorage.removeItem('splendor_room');
    } catch (_) {}
    socket?.emit(CLIENT_EVENTS.leaveRoom);
    setRoom({
      roomCode: null,
      hostId: null,
      players: [],
      canStart: false,
      myPlayerId: null,
    });
  }, [socket]);

  const addAI = useCallback(
    (difficulty: 'easy' | 'medium' | 'hard') => {
      socket?.emit(CLIENT_EVENTS.addAI, { difficulty });
    },
    [socket],
  );

  const startGame = useCallback(() => {
    socket?.emit(CLIENT_EVENTS.startGame);
  }, [socket]);

  return {
    room,
    createRoom,
    joinRoom,
    leaveRoom,
    addAI,
    startGame,
  };
}

export function useOnlineGame(onGameState: (payload: GameStatePayload) => void, onActionError: (message: string) => void) {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    const onState = (payload: GameStatePayload) => onGameState(payload);
    const onError = (payload: ActionErrorPayload) => onActionError(payload.message);
    socket.on(SERVER_EVENTS.gameState, onState);
    socket.on(SERVER_EVENTS.actionError, onError);
    return () => {
      socket.off(SERVER_EVENTS.gameState, onState);
      socket.off(SERVER_EVENTS.actionError, onError);
    };
  }, [socket, onGameState, onActionError]);

  const sendAction = useCallback(
    (payload: GameActionPayload) => {
      socket?.emit(CLIENT_EVENTS.action, payload);
    },
    [socket],
  );

  const takeThreeTokens = useCallback(
    (colors: GemColor[]) => {
      sendAction({ type: 'takeThreeTokens', payload: { colors } });
    },
    [sendAction],
  );

  const takeTwoTokens = useCallback(
    (color: GemColor) => {
      sendAction({ type: 'takeTwoTokens', payload: { color } });
    },
    [sendAction],
  );

  const purchaseCard = useCallback(
    (cardId: string) => {
      sendAction({ type: 'purchaseCard', payload: { cardId } });
    },
    [sendAction],
  );

  const reserveCard = useCallback(
    (cardId: string) => {
      sendAction({ type: 'reserveCard', payload: { cardId } });
    },
    [sendAction],
  );

  const reserveFromDeck = useCallback(
    (tier: 1 | 2 | 3) => {
      sendAction({ type: 'reserveFromDeck', payload: { tier } });
    },
    [sendAction],
  );

  const discardTokens = useCallback(
    (tokens: Partial<Record<GemType, number>>) => {
      sendAction({ type: 'discardTokens', payload: { tokens } });
    },
    [sendAction],
  );

  const claimNoble = useCallback(
    (nobleId: string) => {
      sendAction({ type: 'claimNoble', payload: { nobleId } });
    },
    [sendAction],
  );

  return {
    takeThreeTokens,
    takeTwoTokens,
    purchaseCard,
    reserveCard,
    reserveFromDeck,
    discardTokens,
    claimNoble,
  };
}
