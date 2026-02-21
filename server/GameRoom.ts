import type {
  GameState,
  GamePhase,
  GemColor,
  GemType,
  Player,
  DevelopmentCard,
  PendingAction,
} from '../lib/game-engine/types';
import {
  GEM_COLORS,
  createPlayer,
  emptyGems,
} from '../lib/game-engine/types';
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
} from '../lib/game-engine/rules';
import { TIER1_CARDS, TIER2_CARDS, TIER3_CARDS, ALL_NOBLES } from '../lib/game-engine/cardData';
import { getAIAction, getAIDiscardTokens } from '../lib/game-engine/aiLogic';
import type { Room } from './RoomManager';
import type { GameActionPayload } from './protocol';

function drawCard(deck: DevelopmentCard[]): DevelopmentCard | null {
  return deck.length > 0 ? deck.pop()! : null;
}

function refillSlot(
  visible: (DevelopmentCard | null)[],
  deck: DevelopmentCard[],
  index: number,
): void {
  visible[index] = drawCard(deck);
}

function addLog(state: GameState, message: string): void {
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

function advanceTurn(state: GameState): void {
  const reachedEnd = state.players.some((p) => p.prestige >= 15);
  if (reachedEnd) state.lastRound = true;

  state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
  if (state.currentPlayerIndex === 0) {
    state.round++;
    if (state.lastRound) {
      state.phase = 'ended';
      state.winner = determineWinner(state.players);
      addLog(state, state.winner ? `${state.winner.name} wins!` : 'Game ended in a tie!');
      return;
    }
  }

  state.phase = 'playing';
  state.pendingAction = null;
}

export class GameRoomLogic {
  state: GameState;
  onStateChange: (() => void) | null = null;

  constructor(room: Room) {
    const setupPlayers = room.players.map((p) => ({
      name: p.playerName,
      isAI: p.isAI,
      aiDifficulty: p.aiDifficulty,
    }));
    const players = setupPlayers.map((sp, i) =>
      createPlayer(room.players[i].playerId, sp.name, sp.isAI, sp.aiDifficulty),
    );

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

    this.state = {
      phase: 'playing',
      players,
      currentPlayerIndex: 0,
      board: {
        tier1: { visible: tier1Visible, deck: tier1Deck },
        tier2: { visible: tier2Visible, deck: tier2Deck },
        tier3: { visible: tier3Visible, deck: tier3Deck },
        nobles,
        tokens,
      },
      round: 1,
      lastRound: false,
      winner: null,
      turnLog: ['Game started!'],
      pendingAction: null,
      previousState: null,
    };
  }

  getState(): GameState {
    return this.state;
  }

  private postAction(): void {
    const state = this.state;
    if (!checkDiscardNeeded(state)) {
      if (!checkNobles(state)) {
        advanceTurn(state);
        this.maybeRunAI();
      }
    }
    this.onStateChange?.();
  }

  private maybeRunAI(): void {
    const state = this.state;
    if (state.phase === 'ended') return;
    const current = state.players[state.currentPlayerIndex];
    if (!current.isAI) return;
    setTimeout(() => this.runAITurn(), 800 + Math.random() * 700);
  }

  runAITurn(): void {
    const state = this.state;
    const player = state.players[state.currentPlayerIndex];
    if (!player.isAI) return;

    if (state.phase === 'discardTokens' && state.pendingAction?.type === 'discard') {
      const toDiscard = getAIDiscardTokens(player, state.pendingAction.tokensToDiscard);
      this.applyDiscardTokens(toDiscard);
      this.onStateChange?.();
      return;
    }
    if (state.phase === 'nobleChoice' && state.pendingAction?.type === 'nobleChoice') {
      this.applyClaimNoble(state.pendingAction.nobleIds[0]);
      this.onStateChange?.();
      return;
    }
    if (state.phase === 'playing') {
      const aiAction = getAIAction(player, state);
      const payload = this.aiActionToPayload(aiAction);
      if (payload) this.applyAction(payload);
    }
  }

  private aiActionToPayload(aiAction: import('../lib/game-engine/aiLogic').AIAction): GameActionPayload | null {
    switch (aiAction.type) {
      case 'takeThree':
        return { type: 'takeThreeTokens', payload: { colors: aiAction.colors } };
      case 'takeTwo':
        return { type: 'takeTwoTokens', payload: { color: aiAction.color } };
      case 'purchase':
        return { type: 'purchaseCard', payload: { cardId: aiAction.cardId } };
      case 'reserve':
        return { type: 'reserveCard', payload: { cardId: aiAction.cardId } };
      case 'reserveDeck':
        return { type: 'reserveFromDeck', payload: { tier: aiAction.tier } };
      default:
        return null;
    }
  }

  private applyAction(payload: GameActionPayload): void {
    switch (payload.type) {
      case 'takeThreeTokens':
        this.applyTakeThreeTokens(payload.payload.colors);
        break;
      case 'takeTwoTokens':
        this.applyTakeTwoTokens(payload.payload.color);
        break;
      case 'purchaseCard':
        this.applyPurchaseCard(payload.payload.cardId);
        break;
      case 'reserveCard':
        this.applyReserveCard(payload.payload.cardId);
        break;
      case 'reserveFromDeck':
        this.applyReserveFromDeck(payload.payload.tier);
        break;
      case 'discardTokens':
        this.applyDiscardTokens(payload.payload.tokens);
        break;
      case 'claimNoble':
        this.applyClaimNoble(payload.payload.nobleId);
        break;
    }
  }

  private applyTakeThreeTokens(colors: GemColor[]): void {
    const state = this.state;
    if (state.phase !== 'playing' || !canTakeThreeTokens(colors, state.board.tokens)) return;
    const player = state.players[state.currentPlayerIndex];
    for (const color of colors) {
      state.board.tokens[color]--;
      player.gems[color]++;
    }
    addLog(state, `${player.name} took ${colors.length} tokens: ${colors.join(', ')}`);
    this.postAction();
  }

  private applyTakeTwoTokens(color: GemColor): void {
    const state = this.state;
    if (state.phase !== 'playing' || !canTakeTwoTokens(color, state.board.tokens)) return;
    const player = state.players[state.currentPlayerIndex];
    state.board.tokens[color] -= 2;
    player.gems[color] += 2;
    addLog(state, `${player.name} took 2 ${color} tokens`);
    this.postAction();
  }

  private applyPurchaseCard(cardId: string): void {
    const state = this.state;
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
    addLog(state, `${player.name} purchased ${card.bonus} card (${card.prestige}pts)`);
    if (!checkNobles(state)) {
      advanceTurn(state);
      this.maybeRunAI();
    }
    this.onStateChange?.();
  }

  private applyReserveCard(cardId: string): void {
    const state = this.state;
    if (state.phase !== 'playing') return;
    const player = state.players[state.currentPlayerIndex];
    if (!canReserveCard(player)) return;
    const boardLocation = findCardOnBoard(state.board, cardId);
    if (!boardLocation) return;
    const card = state.board[boardLocation.tier].visible[boardLocation.index];
    if (!card) return;

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
    this.postAction();
  }

  private applyReserveFromDeck(tier: 1 | 2 | 3): void {
    const state = this.state;
    if (state.phase !== 'playing') return;
    const player = state.players[state.currentPlayerIndex];
    if (!canReserveCard(player)) return;
    const tierKey = `tier${tier}` as 'tier1' | 'tier2' | 'tier3';
    const deck = state.board[tierKey].deck;
    if (deck.length === 0) return;

    const card = deck.pop()!;
    player.reservedCards.push(card);
    if (state.board.tokens.gold > 0) {
      state.board.tokens.gold--;
      player.gems.gold++;
    }
    addLog(state, `${player.name} reserved from tier ${tier} deck`);
    this.postAction();
  }

  private applyDiscardTokens(tokens: Partial<Record<GemType, number>>): void {
    const state = this.state;
    if (state.phase !== 'discardTokens') return;
    const player = state.players[state.currentPlayerIndex];
    let totalDiscarded = 0;
    for (const [gem, count] of Object.entries(tokens)) {
      const g = gem as GemType;
      const c = count ?? 0;
      if (c > player.gems[g]) return;
      totalDiscarded += c;
    }
    if (state.pendingAction?.type !== 'discard') return;
    if (totalDiscarded !== state.pendingAction.tokensToDiscard) return;

    for (const [gem, count] of Object.entries(tokens)) {
      const g = gem as GemType;
      const c = count ?? 0;
      player.gems[g] -= c;
      state.board.tokens[g] += c;
    }
    state.pendingAction = null;
    addLog(state, `${player.name} discarded ${totalDiscarded} tokens`);
    if (!checkNobles(state)) {
      advanceTurn(state);
      this.maybeRunAI();
    }
  }

  private applyClaimNoble(nobleId: string): void {
    const state = this.state;
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
    this.maybeRunAI();
    this.onStateChange?.();
  }

  /** Replace a human player with AI (medium); if it's their turn, AI will run. */
  replacePlayerWithAI(playerId: string): void {
    const player = this.state.players.find((p) => p.id === playerId);
    if (!player || player.isAI) return;
    player.isAI = true;
    player.aiDifficulty = 'medium';
    player.name = 'AI (medium)';
    this.onStateChange?.();
    const current = this.state.players[this.state.currentPlayerIndex];
    if (current?.id === playerId && current.isAI) {
      this.runAITurn();
    }
  }

  handleAction(playerId: string, payload: GameActionPayload): string | null {
    const state = this.state;
    const current = state.players[state.currentPlayerIndex];
    if (current.id !== playerId) return 'Not your turn';

    switch (payload.type) {
      case 'takeThreeTokens':
        if (state.phase !== 'playing') return 'Invalid phase';
        if (!canTakeThreeTokens(payload.payload.colors, state.board.tokens)) return 'Invalid token selection';
        this.applyTakeThreeTokens(payload.payload.colors);
        break;
      case 'takeTwoTokens':
        if (state.phase !== 'playing') return 'Invalid phase';
        if (!canTakeTwoTokens(payload.payload.color, state.board.tokens)) return 'Cannot take 2 of that color';
        this.applyTakeTwoTokens(payload.payload.color);
        break;
      case 'purchaseCard':
        if (state.phase !== 'playing') return 'Invalid phase';
        this.applyPurchaseCard(payload.payload.cardId);
        break;
      case 'reserveCard':
        if (state.phase !== 'playing') return 'Invalid phase';
        this.applyReserveCard(payload.payload.cardId);
        break;
      case 'reserveFromDeck':
        if (state.phase !== 'playing') return 'Invalid phase';
        this.applyReserveFromDeck(payload.payload.tier);
        break;
      case 'discardTokens':
        if (state.phase !== 'discardTokens') return 'Invalid phase';
        this.applyDiscardTokens(payload.payload.tokens);
        break;
      case 'claimNoble':
        if (state.phase !== 'nobleChoice') return 'Invalid phase';
        this.applyClaimNoble(payload.payload.nobleId);
        break;
      default:
        return 'Unknown action';
    }
    return null;
  }
}
