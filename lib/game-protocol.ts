import type { GameState } from '@/lib/game-engine/types';
import type { AIDifficulty, GemColor, GemType } from '@/lib/game-engine/types';

export interface CreateRoomPayload {
  playerName: string;
}

export interface JoinRoomPayload {
  roomCode: string;
  playerName: string;
}

export interface AddAIPayload {
  difficulty: AIDifficulty;
}

export interface RejoinRoomPayload {
  roomCode: string;
  playerId: string;
}

export interface RoomPlayerInfo {
  playerId: string;
  playerName: string;
  isAI: boolean;
  aiDifficulty?: AIDifficulty;
  socketId: string | null;
  isConnected: boolean;
}

export interface RoomUpdatePayload {
  roomCode: string;
  hostId: string;
  players: RoomPlayerInfo[];
  canStart: boolean;
}

export interface RoomCreatedPayload {
  roomCode: string;
  playerId: string;
}

export interface RoomJoinedPayload {
  roomCode: string;
  playerId: string;
}

export interface RoomClosedPayload {
  reason: string;
}

export interface TakeThreeTokensPayload {
  colors: GemColor[];
}

export interface TakeTwoTokensPayload {
  color: GemColor;
}

export interface PurchaseCardPayload {
  cardId: string;
}

export interface ReserveCardPayload {
  cardId: string;
}

export interface ReserveFromDeckPayload {
  tier: 1 | 2 | 3;
}

export interface DiscardTokensPayload {
  tokens: Partial<Record<GemType, number>>;
}

export interface ClaimNoblePayload {
  nobleId: string;
}

export type GameActionPayload =
  | { type: 'takeThreeTokens'; payload: TakeThreeTokensPayload }
  | { type: 'takeTwoTokens'; payload: TakeTwoTokensPayload }
  | { type: 'purchaseCard'; payload: PurchaseCardPayload }
  | { type: 'reserveCard'; payload: ReserveCardPayload }
  | { type: 'reserveFromDeck'; payload: ReserveFromDeckPayload }
  | { type: 'discardTokens'; payload: DiscardTokensPayload }
  | { type: 'claimNoble'; payload: ClaimNoblePayload };

export interface GameStatePayload {
  gameState: GameState;
  yourPlayerId: string;
}

export interface ActionErrorPayload {
  message: string;
}

export interface PlayerDisconnectedPayload {
  playerId: string;
  playerName: string;
}

export interface PlayerReconnectedPayload {
  playerId: string;
}

export const CLIENT_EVENTS = {
  createRoom: 'createRoom',
  joinRoom: 'joinRoom',
  leaveRoom: 'leaveRoom',
  addAI: 'addAI',
  startGame: 'startGame',
  action: 'action',
  rejoinRoom: 'rejoinRoom',
} as const;

export const SERVER_EVENTS = {
  roomCreated: 'roomCreated',
  roomJoined: 'roomJoined',
  roomUpdate: 'roomUpdate',
  roomClosed: 'roomClosed',
  gameState: 'gameState',
  actionError: 'actionError',
  playerDisconnected: 'playerDisconnected',
  playerReconnected: 'playerReconnected',
} as const;
