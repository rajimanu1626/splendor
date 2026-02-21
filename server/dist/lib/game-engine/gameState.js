"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGameStore = void 0;
const zustand_1 = require("zustand");
const immer_1 = require("zustand/middleware/immer");
const types_1 = require("./types");
const cardData_1 = require("./cardData");
const rules_1 = require("./rules");
const initialState = {
    phase: 'setup',
    players: [],
    currentPlayerIndex: 0,
    board: {
        tier1: { visible: [], deck: [] },
        tier2: { visible: [], deck: [] },
        tier3: { visible: [], deck: [] },
        nobles: [],
        tokens: (0, types_1.emptyGems)(),
    },
    round: 0,
    lastRound: false,
    winner: null,
    turnLog: [],
    pendingAction: null,
    previousState: null,
};
function saveSnapshot(state) {
    const { previousState: _, ...rest } = state;
    return JSON.parse(JSON.stringify(rest));
}
function drawCard(deck) {
    return deck.length > 0 ? deck.pop() : null;
}
function refillSlot(visible, deck, index) {
    visible[index] = drawCard(deck);
}
function addLog(state, message) {
    state.turnLog = [message, ...state.turnLog].slice(0, 20);
}
function checkDiscardNeeded(state) {
    const player = state.players[state.currentPlayerIndex];
    const total = (0, rules_1.getTokenCount)(player);
    if (total > 10) {
        state.phase = 'discardTokens';
        state.pendingAction = { type: 'discard', tokensToDiscard: total - 10 };
        return true;
    }
    return false;
}
function checkNobles(state) {
    const player = state.players[state.currentPlayerIndex];
    const claimable = (0, rules_1.getClaimableNobles)(player, state.board.nobles);
    if (claimable.length === 0)
        return false;
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
function advanceTurn(state) {
    const reachedEnd = state.players.some((p) => p.prestige >= 15);
    if (reachedEnd)
        state.lastRound = true;
    state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    if (state.currentPlayerIndex === 0) {
        state.round++;
        if (state.lastRound) {
            state.phase = 'ended';
            state.winner = (0, rules_1.determineWinner)(state.players);
            addLog(state, state.winner ? `${state.winner.name} wins!` : 'Game ended in a tie!');
            return;
        }
    }
    state.phase = 'playing';
    state.pendingAction = null;
}
function normalizeBoard(board) {
    const getDeck = (t) => {
        const d = board[t].deck;
        if (Array.isArray(d))
            return { deck: d, count: d.length };
        return { deck: [], count: d.count };
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
exports.useGameStore = (0, zustand_1.create)()((0, immer_1.immer)((set, get) => ({
    ...initialState,
    mode: 'local',
    yourPlayerId: null,
    deckCounts: null,
    setMode: (mode) => {
        set((state) => {
            state.mode = mode;
            if (mode === 'local') {
                state.yourPlayerId = null;
                state.deckCounts = null;
            }
        });
    },
    setOnlineContext: (playerId) => {
        set((state) => {
            state.yourPlayerId = playerId;
        });
    },
    syncState: (payload) => {
        set((state) => {
            const { gameState, yourPlayerId } = payload;
            const { board, deckCounts } = normalizeBoard(gameState.board);
            state.phase = gameState.phase;
            state.players = JSON.parse(JSON.stringify(gameState.players));
            state.currentPlayerIndex = gameState.currentPlayerIndex;
            state.board = board;
            state.deckCounts = deckCounts;
            state.round = gameState.round;
            state.lastRound = gameState.lastRound;
            state.winner = gameState.winner ? { ...gameState.winner } : null;
            state.turnLog = [...gameState.turnLog];
            state.pendingAction = gameState.pendingAction;
            state.previousState = null;
            state.yourPlayerId = yourPlayerId;
            state.mode = 'online';
        });
    },
    initGame: (setupPlayers) => {
        set((state) => {
            state.mode = 'local';
            state.yourPlayerId = null;
            state.deckCounts = null;
            const players = setupPlayers.map((sp, i) => (0, types_1.createPlayer)(`p-${i}`, sp.name, sp.isAI, sp.aiDifficulty));
            const tier1Deck = (0, rules_1.shuffleDeck)([...cardData_1.TIER1_CARDS]);
            const tier2Deck = (0, rules_1.shuffleDeck)([...cardData_1.TIER2_CARDS]);
            const tier3Deck = (0, rules_1.shuffleDeck)([...cardData_1.TIER3_CARDS]);
            const tier1Visible = [];
            const tier2Visible = [];
            const tier3Visible = [];
            for (let i = 0; i < 4; i++) {
                tier1Visible.push(drawCard(tier1Deck));
                tier2Visible.push(drawCard(tier2Deck));
                tier3Visible.push(drawCard(tier3Deck));
            }
            const nobleCount = (0, rules_1.getNobleCount)(players.length);
            const nobles = (0, rules_1.shuffleDeck)([...cardData_1.ALL_NOBLES]).slice(0, nobleCount);
            const tokens = (0, rules_1.getInitialTokens)(players.length);
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
            state.winner = null;
            state.turnLog = ['Game started!'];
            state.pendingAction = null;
            state.previousState = null;
        });
    },
    takeThreeTokens: (colors) => {
        if (get().mode === 'online')
            return;
        set((state) => {
            if (state.phase !== 'playing')
                return;
            if (!(0, rules_1.canTakeThreeTokens)(colors, state.board.tokens))
                return;
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
    takeTwoTokens: (color) => {
        if (get().mode === 'online')
            return;
        set((state) => {
            if (state.phase !== 'playing')
                return;
            if (!(0, rules_1.canTakeTwoTokens)(color, state.board.tokens))
                return;
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
    purchaseCard: (cardId) => {
        if (get().mode === 'online')
            return;
        set((state) => {
            if (state.phase !== 'playing')
                return;
            const player = state.players[state.currentPlayerIndex];
            let card = null;
            let source = 'board';
            let boardLocation = null;
            let reservedIndex = -1;
            boardLocation = (0, rules_1.findCardOnBoard)(state.board, cardId);
            if (boardLocation) {
                card = state.board[boardLocation.tier].visible[boardLocation.index];
                source = 'board';
            }
            else {
                reservedIndex = (0, rules_1.findCardInReserved)(player, cardId);
                if (reservedIndex !== -1) {
                    const reservedCard = player.reservedCards[reservedIndex];
                    if (!('hidden' in reservedCard)) {
                        card = reservedCard;
                        source = 'reserved';
                    }
                }
            }
            if (!card || !(0, rules_1.canPurchaseCard)(player, card))
                return;
            state.previousState = saveSnapshot(state);
            const payment = (0, rules_1.calculateGemPayment)(player, card);
            for (const gemType of [...types_1.GEM_COLORS, 'gold']) {
                player.gems[gemType] -= payment[gemType];
                state.board.tokens[gemType] += payment[gemType];
            }
            player.purchasedCards.push(card);
            player.bonuses[card.bonus]++;
            player.prestige += card.prestige;
            if (source === 'board' && boardLocation) {
                refillSlot(state.board[boardLocation.tier].visible, state.board[boardLocation.tier].deck, boardLocation.index);
            }
            else if (source === 'reserved') {
                player.reservedCards.splice(reservedIndex, 1);
            }
            addLog(state, `${player.name} purchased ${card.bonus} card (${card.prestige}pts)`);
            if (!checkNobles(state)) {
                advanceTurn(state);
            }
        });
    },
    reserveCard: (cardId) => {
        if (get().mode === 'online')
            return;
        set((state) => {
            if (state.phase !== 'playing')
                return;
            const player = state.players[state.currentPlayerIndex];
            if (!(0, rules_1.canReserveCard)(player))
                return;
            const boardLocation = (0, rules_1.findCardOnBoard)(state.board, cardId);
            if (!boardLocation)
                return;
            const card = state.board[boardLocation.tier].visible[boardLocation.index];
            if (!card)
                return;
            state.previousState = saveSnapshot(state);
            player.reservedCards.push(card);
            refillSlot(state.board[boardLocation.tier].visible, state.board[boardLocation.tier].deck, boardLocation.index);
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
    reserveFromDeck: (tier) => {
        if (get().mode === 'online')
            return;
        set((state) => {
            if (state.phase !== 'playing')
                return;
            const player = state.players[state.currentPlayerIndex];
            if (!(0, rules_1.canReserveCard)(player))
                return;
            const tierKey = `tier${tier}`;
            const deck = state.board[tierKey].deck;
            if (deck.length === 0)
                return;
            state.previousState = saveSnapshot(state);
            const card = deck.pop();
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
    discardTokens: (tokens) => {
        if (get().mode === 'online')
            return;
        set((state) => {
            if (state.phase !== 'discardTokens')
                return;
            const player = state.players[state.currentPlayerIndex];
            let totalDiscarded = 0;
            for (const [gem, count] of Object.entries(tokens)) {
                const g = gem;
                const c = count || 0;
                if (c > player.gems[g])
                    return;
                totalDiscarded += c;
            }
            if (state.pendingAction?.type !== 'discard')
                return;
            if (totalDiscarded !== state.pendingAction.tokensToDiscard)
                return;
            for (const [gem, count] of Object.entries(tokens)) {
                const g = gem;
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
    claimNoble: (nobleId) => {
        if (get().mode === 'online')
            return;
        set((state) => {
            if (state.phase !== 'nobleChoice')
                return;
            const player = state.players[state.currentPlayerIndex];
            const noble = state.board.nobles.find((n) => n.id === nobleId);
            if (!noble)
                return;
            player.nobles.push(noble);
            player.prestige += noble.prestige;
            state.board.nobles = state.board.nobles.filter((n) => n.id !== nobleId);
            state.pendingAction = null;
            addLog(state, `${player.name} claimed noble ${nobleId}`);
            advanceTurn(state);
        });
    },
    endTurn: () => {
        if (get().mode === 'online')
            return;
        set((state) => {
            if (state.phase !== 'playing')
                return;
            advanceTurn(state);
        });
    },
    undo: () => {
        if (get().mode === 'online')
            return;
        const prev = get().previousState;
        if (!prev)
            return;
        set(() => ({ ...prev, previousState: null }));
    },
    executeAITurn: () => {
        // Placeholder - actual AI logic imported dynamically to avoid circular deps
    },
})));
