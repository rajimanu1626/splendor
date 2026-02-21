export type GemType = 'diamond' | 'sapphire' | 'emerald' | 'ruby' | 'onyx' | 'gold';
export type GemColor = Exclude<GemType, 'gold'>;

export const GEM_COLORS: GemColor[] = ['diamond', 'sapphire', 'emerald', 'ruby', 'onyx'];
export const ALL_GEM_TYPES: GemType[] = [...GEM_COLORS, 'gold'];

export interface DevelopmentCard {
  id: string;
  tier: 1 | 2 | 3;
  bonus: GemColor;
  prestige: number;
  cost: Partial<Record<GemColor, number>>;
}

/** Used in online mode for other players' reserved cards (hidden). */
export interface HiddenReservedCard {
  id: string;
  tier: 1 | 2 | 3;
  hidden: true;
}

export interface NobleCard {
  id: string;
  prestige: 3;
  requirements: Partial<Record<GemColor, number>>;
}

export type AIDifficulty = 'easy' | 'medium' | 'hard';

export interface Player {
  id: string;
  name: string;
  isAI: boolean;
  aiDifficulty?: AIDifficulty;
  gems: Record<GemType, number>;
  bonuses: Record<GemColor, number>;
  purchasedCards: DevelopmentCard[];
  reservedCards: (DevelopmentCard | HiddenReservedCard)[];
  nobles: NobleCard[];
  prestige: number;
}

export type GamePhase = 'setup' | 'playing' | 'discardTokens' | 'nobleChoice' | 'ended';

export interface BoardState {
  tier1: { visible: (DevelopmentCard | null)[]; deck: DevelopmentCard[] };
  tier2: { visible: (DevelopmentCard | null)[]; deck: DevelopmentCard[] };
  tier3: { visible: (DevelopmentCard | null)[]; deck: DevelopmentCard[] };
  nobles: NobleCard[];
  tokens: Record<GemType, number>;
}

export type PendingAction =
  | { type: 'discard'; tokensToDiscard: number }
  | { type: 'nobleChoice'; nobleIds: string[] }
  | null;

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  board: BoardState;
  round: number;
  lastRound: boolean;
  winner: Player | null;
  turnLog: string[];
  pendingAction: PendingAction;
  previousState: GameState | null;
}

export interface SetupPlayer {
  name: string;
  isAI: boolean;
  aiDifficulty?: AIDifficulty;
}

export function emptyGems(): Record<GemType, number> {
  return { diamond: 0, sapphire: 0, emerald: 0, ruby: 0, onyx: 0, gold: 0 };
}

export function emptyBonuses(): Record<GemColor, number> {
  return { diamond: 0, sapphire: 0, emerald: 0, ruby: 0, onyx: 0 };
}

export function createPlayer(id: string, name: string, isAI: boolean, aiDifficulty?: AIDifficulty): Player {
  return {
    id,
    name,
    isAI,
    aiDifficulty,
    gems: emptyGems(),
    bonuses: emptyBonuses(),
    purchasedCards: [],
    reservedCards: [],
    nobles: [],
    prestige: 0,
  };
}
