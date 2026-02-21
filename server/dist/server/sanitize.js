export function sanitizeForPlayer(state, playerId) {
    const players = state.players.map((p) => {
        const base = { ...p, gems: { ...p.gems }, bonuses: { ...p.bonuses } };
        if (p.id === playerId) {
            return { ...base, purchasedCards: [...p.purchasedCards], reservedCards: [...p.reservedCards], nobles: [...p.nobles] };
        }
        const hiddenReserved = p.reservedCards.map((_, i) => ({
            id: `hidden-${p.id}-${i}`,
            tier: 1,
            hidden: true,
        }));
        return { ...base, purchasedCards: [...p.purchasedCards], reservedCards: hiddenReserved, nobles: [...p.nobles] };
    });
    const board = {
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
