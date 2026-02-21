import type { GameState, Player, DevelopmentCard, BoardState } from '../lib/game-engine/types';

/** Sanitized view: deck is only count; other players' reserved cards are hidden stubs. */
export interface SanitizedBoardState {
  tier1: { visible: (DevelopmentCard | null)[]; deck: { count: number } };
  tier2: { visible: (DevelopmentCard | null)[]; deck: { count: number } };
  tier3: { visible: (DevelopmentCard | null)[]; deck: { count: number } };
  nobles: GameState['board']['nobles'];
  tokens: GameState['board']['tokens'];
}

export interface HiddenReservedCard {
  id: string;
  tier: 1 | 2 | 3;
  hidden: true;
}

export interface SanitizedPlayer extends Omit<Player, 'reservedCards'> {
  reservedCards: (DevelopmentCard | HiddenReservedCard)[];
}

export interface SanitizedGameState extends Omit<GameState, 'players' | 'board'> {
  players: SanitizedPlayer[];
  board: SanitizedBoardState;
}

export function sanitizeForPlayer(state: GameState, playerId: string): SanitizedGameState {
  const players: SanitizedPlayer[] = state.players.map((p) => {
    const base = { ...p, gems: { ...p.gems }, bonuses: { ...p.bonuses } };
    if (p.id === playerId) {
      return { ...base, purchasedCards: [...p.purchasedCards], reservedCards: [...p.reservedCards], nobles: [...p.nobles] };
    }
    const hiddenReserved: HiddenReservedCard[] = p.reservedCards.map((_, i) => ({
      id: `hidden-${p.id}-${i}`,
      tier: 1,
      hidden: true as const,
    }));
    return { ...base, purchasedCards: [...p.purchasedCards], reservedCards: hiddenReserved, nobles: [...p.nobles] };
  });

  const board: SanitizedBoardState = {
    tier1: { visible: [...state.board.tier1.visible], deck: { count: state.board.tier1.deck.length } },
    tier2: { visible: [...state.board.tier2.visible], deck: { count: state.board.tier2.deck.length } },
    tier3: { visible: [...state.board.tier3.visible], deck: { count: state.board.tier3.deck.length } },
    nobles: [...state.board.nobles],
    tokens: { ...state.board.tokens },
  };

  return {
    phase: state.phase,
    players,
    currentPlayerIndex: state.currentPlayerIndex,
    board,
    round: state.round,
    lastRound: state.lastRound,
    winner: state.winner ? { ...state.winner, reservedCards: [] } : null,
    turnLog: [...state.turnLog],
    pendingAction: state.pendingAction,
    previousState: null,
  };
}
