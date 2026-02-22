import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { GameState, GemColor, GemType, Player, SetupPlayer, DevelopmentCard } from './types';
import { GEM_COLORS, createPlayer, emptyGems } from './types';
import { TIER1_CARDS, TIER2_CARDS, TIER3_CARDS, ALL_NOBLES } from './cardData';
import {
  getInitialTokens,
  getNobleCount,
  getTokenCount,
  canTakeThreeTokens,
  canTakeTwoTokens,
  canPurchaseCard,
  canReserveCard,
  calculateGemPayment,
  getClaimableNobles,
  shuffleDeck,
  findCardOnBoard,
  findCardInReserved,
  determineWinner,
} from './rules';

export type GameMode = 'local' | 'online';

export interface DeckCounts {
  tier1: number;
  tier2: number;
  tier3: number;
}

interface GameActions {
  initGame: (setupPlayers: SetupPlayer[]) => void;
  takeThreeTokens: (colors: GemColor[]) => void;
  takeTwoTokens: (color: GemColor) => void;
  purchaseCard: (cardId: string) => void;
  reserveCard: (cardId: string) => void;
  reserveFromDeck: (tier: 1 | 2 | 3) => void;
  discardTokens: (tokens: Partial<Record<GemType, number>>) => void;
  claimNoble: (nobleId: string) => void;
  endTurn: () => void;
  undo: () => void;
  executeAITurn: () => void;
  syncState: (payload: { gameState: GameState; yourPlayerId: string }) => void;
  setOnlineContext: (playerId: string) => void;
  setMode: (mode: GameMode) => void;
}

type GameStore = GameState & {
  mode: GameMode;
  yourPlayerId: string | null;
  deckCounts: DeckCounts | null;
} & GameActions;

const initialState: GameState = {
  phase: 'setup',
  players: [],
  currentPlayerIndex: 0,
  board: {
    tier1: { visible: [], deck: [] },
    tier2: { visible: [], deck: [] },
    tier3: { visible: [], deck: [] },
    nobles: [],
    tokens: emptyGems(),
  },
  round: 0,
  lastRound: false,
  lastRoundStartedBy: null,
  winner: null,
  turnLog: [],
  pendingAction: null,
  previousState: null,
};

function saveSnapshot(state: GameState): GameState {
  const { previousState: _, ...rest } = state;
  return JSON.parse(JSON.stringify(rest)) as GameState;
}

function drawCard(deck: DevelopmentCard[]): DevelopmentCard | null {
  return deck.length > 0 ? deck.pop()! : null;
}

function refillSlot(
  visible: (DevelopmentCard | null)[],
  deck: DevelopmentCard[],
  index: number,
) {
  visible[index] = drawCard(deck);
}

function addLog(state: GameState, message: string) {
  state.turnLog = [message, ...state.turnLog].slice(0, 20);
}

function checkDiscardNeeded(state: GameState): boolean {
  const player = state.players[state.currentPlayerIndex];
  const total = getTokenCount(player);
  if (total > 10) {
    state.phase = 'discardTokens';
    state.pendingAction = { type: 'discard', tokensToDiscard: total - 10 };
    return true;
  }
  return false;
}

function checkNobles(state: GameState): boolean {
  const player = state.players[state.currentPlayerIndex];
  const claimable = getClaimableNobles(player, state.board.nobles);
  if (claimable.length === 0) return false;
  if (claimable.length === 1) {
    const noble = claimable[0];
    player.nobles.push(noble);
    player.prestige += noble.prestige;
    state.board.nobles = state.board.nobles.filter((n) => n.id !== noble.id);
    addLog(state, `${player.name} claimed noble ${noble.id}`);
    return false;
  }
  state.phase = 'nobleChoice';
  state.pendingAction = { type: 'nobleChoice', nobleIds: claimable.map((n) => n.id) };
  return true;
}

function advanceTurn(state: GameState) {
  const reachedEnd = state.players.some((p) => p.prestige >= 15);
  if (reachedEnd && !state.lastRound) {
    state.lastRound = true;
    state.lastRoundStartedBy = state.currentPlayerIndex;
  }

  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  if (state.currentPlayerIndex === 0) state.round++;

  if (state.lastRound && state.lastRoundStartedBy !== null && state.currentPlayerIndex === state.lastRoundStartedBy) {
    state.phase = 'ended';
    state.winner = determineWinner(state.players);
    addLog(state, state.winner ? `${state.winner.name} wins!` : 'Game ended in a tie!');
    return;
  }

  state.phase = 'playing';
  state.pendingAction = null;
}

type ServerBoard = {
  tier1: { visible: (DevelopmentCard | null)[]; deck: DevelopmentCard[] | { count: number } };
  tier2: { visible: (DevelopmentCard | null)[]; deck: DevelopmentCard[] | { count: number } };
  tier3: { visible: (DevelopmentCard | null)[]; deck: DevelopmentCard[] | { count: number } };
  nobles: GameState['board']['nobles'];
  tokens: GameState['board']['tokens'];
};

function normalizeBoard(board: ServerBoard): { board: GameState['board']; deckCounts: DeckCounts | null } {
  const getDeck = (t: 'tier1' | 'tier2' | 'tier3') => {
    const d = board[t].deck;
    if (Array.isArray(d)) return { deck: d, count: d.length };
    return { deck: [] as DevelopmentCard[], count: (d as { count: number }).count };
  };
  const t1 = getDeck('tier1');
  const t2 = getDeck('tier2');
  const t3 = getDeck('tier3');
  const hasCounts = !Array.isArray(board.tier1.deck);
  return {
    board: {
      tier1: { visible: [...board.tier1.visible], deck: t1.deck },
      tier2: { visible: [...board.tier2.visible], deck: t2.deck },
      tier3: { visible: [...board.tier3.visible], deck: t3.deck },
      nobles: [...board.nobles],
      tokens: { ...board.tokens },
    },
    deckCounts: hasCounts ? { tier1: t1.count, tier2: t2.count, tier3: t3.count } : null,
  };
}

export const useGameStore = create<GameStore>()(
  immer((set, get) => ({
    ...initialState,
    mode: 'local',
    yourPlayerId: null,
    deckCounts: null,

    setMode: (mode: GameMode) => {
      set((state) => {
        state.mode = mode;
        if (mode === 'local') {
          state.yourPlayerId = null;
          state.deckCounts = null;
        }
      });
    },

    setOnlineContext: (playerId: string) => {
      set((state) => {
        state.yourPlayerId = playerId;
      });
    },

    syncState: (payload: { gameState: GameState; yourPlayerId: string }) => {
      set((state) => {
        const { gameState, yourPlayerId } = payload;
        const { board, deckCounts } = normalizeBoard(gameState.board as ServerBoard);
        state.phase = gameState.phase;
        state.players = JSON.parse(JSON.stringify(gameState.players));
        state.currentPlayerIndex = gameState.currentPlayerIndex;
        state.board = board;
        state.deckCounts = deckCounts;
        state.round = gameState.round;
        state.lastRound = gameState.lastRound;
        state.lastRoundStartedBy = gameState.lastRoundStartedBy ?? null;
        state.winner = gameState.winner ? { ...gameState.winner } : null;
        state.turnLog = [...gameState.turnLog];
        state.pendingAction = gameState.pendingAction;
        state.previousState = null;
        state.yourPlayerId = yourPlayerId;
        state.mode = 'online';
      });
    },

    initGame: (setupPlayers: SetupPlayer[]) => {
      set((state) => {
        state.mode = 'local';
        state.yourPlayerId = null;
        state.deckCounts = null;
        let players = setupPlayers.map((sp, i) =>
          createPlayer(`p-${i}`, sp.name, sp.isAI, sp.aiDifficulty),
        );
        players = shuffleDeck(players);

        const tier1Deck = shuffleDeck([...TIER1_CARDS]);
        const tier2Deck = shuffleDeck([...TIER2_CARDS]);
        const tier3Deck = shuffleDeck([...TIER3_CARDS]);

        const tier1Visible: (DevelopmentCard | null)[] = [];
        const tier2Visible: (DevelopmentCard | null)[] = [];
        const tier3Visible: (DevelopmentCard | null)[] = [];

        for (let i = 0; i < 4; i++) {
          tier1Visible.push(drawCard(tier1Deck));
          tier2Visible.push(drawCard(tier2Deck));
          tier3Visible.push(drawCard(tier3Deck));
        }

        const nobleCount = getNobleCount(players.length);
        const nobles = shuffleDeck([...ALL_NOBLES]).slice(0, nobleCount);
        const tokens = getInitialTokens(players.length);

        state.phase = 'playing';
        state.players = players;
        state.currentPlayerIndex = 0;
        state.board = {
          tier1: { visible: tier1Visible, deck: tier1Deck },
          tier2: { visible: tier2Visible, deck: tier2Deck },
          tier3: { visible: tier3Visible, deck: tier3Deck },
          nobles,
          tokens,
        };
        state.round = 1;
        state.lastRound = false;
        state.lastRoundStartedBy = null;
        state.winner = null;
        state.turnLog = ['Game started!'];
        state.pendingAction = null;
        state.previousState = null;
      });
    },

    takeThreeTokens: (colors: GemColor[]) => {
      if (get().mode === 'online') return;
      set((state) => {
        if (state.phase !== 'playing') return;
        if (!canTakeThreeTokens(colors, state.board.tokens)) return;

        state.previousState = saveSnapshot(state);
        const player = state.players[state.currentPlayerIndex];

        for (const color of colors) {
          state.board.tokens[color]--;
          player.gems[color]++;
        }

        addLog(state, `${player.name} took ${colors.length} tokens: ${colors.join(', ')}`);

        if (!checkDiscardNeeded(state)) {
          if (!checkNobles(state)) {
            advanceTurn(state);
          }
        }
      });
    },

    takeTwoTokens: (color: GemColor) => {
      if (get().mode === 'online') return;
      set((state) => {
        if (state.phase !== 'playing') return;
        if (!canTakeTwoTokens(color, state.board.tokens)) return;

        state.previousState = saveSnapshot(state);
        const player = state.players[state.currentPlayerIndex];

        state.board.tokens[color] -= 2;
        player.gems[color] += 2;

        addLog(state, `${player.name} took 2 ${color} tokens`);

        if (!checkDiscardNeeded(state)) {
          if (!checkNobles(state)) {
            advanceTurn(state);
          }
        }
      });
    },

    purchaseCard: (cardId: string) => {
      if (get().mode === 'online') return;
      set((state) => {
        if (state.phase !== 'playing') return;
        const player = state.players[state.currentPlayerIndex];

        let card: DevelopmentCard | null = null;
        let source: 'board' | 'reserved' = 'board';
        let boardLocation: { tier: 'tier1' | 'tier2' | 'tier3'; index: number } | null = null;
        let reservedIndex = -1;

        boardLocation = findCardOnBoard(state.board, cardId);
        if (boardLocation) {
          card = state.board[boardLocation.tier].visible[boardLocation.index];
          source = 'board';
        } else {
          reservedIndex = findCardInReserved(player, cardId);
          if (reservedIndex !== -1) {
            const reservedCard = player.reservedCards[reservedIndex];
            if (!('hidden' in reservedCard)) {
              card = reservedCard;
              source = 'reserved';
            }
          }
        }

        if (!card || !canPurchaseCard(player, card)) return;

        state.previousState = saveSnapshot(state);
        const payment = calculateGemPayment(player, card);

        for (const gemType of [...GEM_COLORS, 'gold'] as GemType[]) {
          player.gems[gemType] -= payment[gemType];
          state.board.tokens[gemType] += payment[gemType];
        }

        player.purchasedCards.push(card);
        player.bonuses[card.bonus]++;
        player.prestige += card.prestige;

        if (source === 'board' && boardLocation) {
          refillSlot(
            state.board[boardLocation.tier].visible,
            state.board[boardLocation.tier].deck,
            boardLocation.index,
          );
        } else if (source === 'reserved') {
          player.reservedCards.splice(reservedIndex, 1);
        }

        addLog(
          state,
          `${player.name} purchased ${card.bonus} card (${card.prestige}pts)`,
        );

        if (!checkNobles(state)) {
          advanceTurn(state);
        }
      });
    },

    reserveCard: (cardId: string) => {
      if (get().mode === 'online') return;
      set((state) => {
        if (state.phase !== 'playing') return;
        const player = state.players[state.currentPlayerIndex];
        if (!canReserveCard(player)) return;

        const boardLocation = findCardOnBoard(state.board, cardId);
        if (!boardLocation) return;

        const card = state.board[boardLocation.tier].visible[boardLocation.index];
        if (!card) return;

        state.previousState = saveSnapshot(state);

        player.reservedCards.push(card);
        refillSlot(
          state.board[boardLocation.tier].visible,
          state.board[boardLocation.tier].deck,
          boardLocation.index,
        );

        if (state.board.tokens.gold > 0) {
          state.board.tokens.gold--;
          player.gems.gold++;
        }

        addLog(state, `${player.name} reserved a card`);

        if (!checkDiscardNeeded(state)) {
          if (!checkNobles(state)) {
            advanceTurn(state);
          }
        }
      });
    },

    reserveFromDeck: (tier: 1 | 2 | 3) => {
      if (get().mode === 'online') return;
      set((state) => {
        if (state.phase !== 'playing') return;
        const player = state.players[state.currentPlayerIndex];
        if (!canReserveCard(player)) return;

        const tierKey = `tier${tier}` as 'tier1' | 'tier2' | 'tier3';
        const deck = state.board[tierKey].deck;
        if (deck.length === 0) return;

        state.previousState = saveSnapshot(state);

        const card = deck.pop()!;
        player.reservedCards.push(card);

        if (state.board.tokens.gold > 0) {
          state.board.tokens.gold--;
          player.gems.gold++;
        }

        addLog(state, `${player.name} reserved from tier ${tier} deck`);

        if (!checkDiscardNeeded(state)) {
          if (!checkNobles(state)) {
            advanceTurn(state);
          }
        }
      });
    },

    discardTokens: (tokens: Partial<Record<GemType, number>>) => {
      if (get().mode === 'online') return;
      set((state) => {
        if (state.phase !== 'discardTokens') return;
        const player = state.players[state.currentPlayerIndex];

        let totalDiscarded = 0;
        for (const [gem, count] of Object.entries(tokens)) {
          const g = gem as GemType;
          const c = count || 0;
          if (c > player.gems[g]) return;
          totalDiscarded += c;
        }

        if (state.pendingAction?.type !== 'discard') return;
        if (totalDiscarded !== state.pendingAction.tokensToDiscard) return;

        for (const [gem, count] of Object.entries(tokens)) {
          const g = gem as GemType;
          const c = count || 0;
          player.gems[g] -= c;
          state.board.tokens[g] += c;
        }

        state.pendingAction = null;
        addLog(state, `${player.name} discarded ${totalDiscarded} tokens`);

        if (!checkNobles(state)) {
          advanceTurn(state);
        }
      });
    },

    claimNoble: (nobleId: string) => {
      if (get().mode === 'online') return;
      set((state) => {
        if (state.phase !== 'nobleChoice') return;
        const player = state.players[state.currentPlayerIndex];
        const noble = state.board.nobles.find((n) => n.id === nobleId);
        if (!noble) return;

        player.nobles.push(noble);
        player.prestige += noble.prestige;
        state.board.nobles = state.board.nobles.filter((n) => n.id !== nobleId);
        state.pendingAction = null;

        addLog(state, `${player.name} claimed noble ${nobleId}`);
        advanceTurn(state);
      });
    },

    endTurn: () => {
      if (get().mode === 'online') return;
      set((state) => {
        if (state.phase !== 'playing') return;
        advanceTurn(state);
      });
    },

    undo: () => {
      if (get().mode === 'online') return;
      const prev = get().previousState;
      if (!prev) return;
      set(() => ({ ...prev, previousState: null }));
    },

    executeAITurn: () => {
      // Placeholder - actual AI logic imported dynamically to avoid circular deps
    },
  })),
);
