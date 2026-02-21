"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAIAction = getAIAction;
exports.getAIDiscardTokens = getAIDiscardTokens;
exports.executeAIAction = executeAIAction;
const types_1 = require("./types");
const rules_1 = require("./rules");
const gameState_1 = require("./gameState");
function getAllVisibleCards(state) {
    return [
        ...state.board.tier1.visible,
        ...state.board.tier2.visible,
        ...state.board.tier3.visible,
    ].filter(Boolean);
}
function getReservedAsCards(player) {
    return player.reservedCards.filter((c) => !('hidden' in c));
}
function getPurchasableCards(player, state) {
    const visible = getAllVisibleCards(state);
    const reserved = getReservedAsCards(player);
    return [...visible, ...reserved].filter((c) => (0, rules_1.canPurchaseCard)(player, c));
}
function getValidTokenActions(state) {
    const actions = [];
    const available = (0, rules_1.getAvailableTokenColors)(state.board.tokens);
    for (const color of types_1.GEM_COLORS) {
        if ((0, rules_1.canTakeTwoTokens)(color, state.board.tokens)) {
            actions.push({ type: 'takeTwo', color });
        }
    }
    if (available.length >= 3) {
        for (let i = 0; i < available.length - 2; i++) {
            for (let j = i + 1; j < available.length - 1; j++) {
                for (let k = j + 1; k < available.length; k++) {
                    actions.push({ type: 'takeThree', colors: [available[i], available[j], available[k]] });
                }
            }
        }
    }
    else if (available.length === 2) {
        actions.push({ type: 'takeThree', colors: [available[0], available[1]] });
    }
    else if (available.length === 1) {
        actions.push({ type: 'takeThree', colors: [available[0]] });
    }
    return actions;
}
function getAllValidActions(player, state) {
    const actions = [];
    const purchasable = getPurchasableCards(player, state);
    for (const card of purchasable) {
        actions.push({ type: 'purchase', cardId: card.id });
    }
    if ((0, rules_1.canReserveCard)(player)) {
        const visible = getAllVisibleCards(state);
        for (const card of visible) {
            actions.push({ type: 'reserve', cardId: card.id });
        }
        for (const tier of [1, 2, 3]) {
            const tierKey = `tier${tier}`;
            if (state.board[tierKey].deck.length > 0) {
                actions.push({ type: 'reserveDeck', tier });
            }
        }
    }
    actions.push(...getValidTokenActions(state));
    return actions;
}
function turnsToAfford(player, card) {
    let deficit = 0;
    for (const color of types_1.GEM_COLORS) {
        const cost = card.cost[color] || 0;
        const have = player.gems[color] + player.bonuses[color];
        if (cost > have)
            deficit += cost - have;
    }
    return Math.ceil(deficit / 3);
}
function nobleProgress(player, noble) {
    let total = 0;
    let met = 0;
    for (const color of types_1.GEM_COLORS) {
        const req = noble.requirements[color] || 0;
        if (req > 0) {
            total += req;
            met += Math.min(player.bonuses[color], req);
        }
    }
    return total === 0 ? 0 : met / total;
}
function cardAdvancesNoble(card, nobles) {
    let best = 0;
    for (const noble of nobles) {
        const req = noble.requirements[card.bonus] || 0;
        if (req > 0)
            best = Math.max(best, 1);
    }
    return best;
}
// ─── EASY AI ──────────────────────────────────────────────────────────
function easyAI(player, state) {
    const actions = getAllValidActions(player, state);
    if (actions.length === 0) {
        const available = (0, rules_1.getAvailableTokenColors)(state.board.tokens);
        if (available.length > 0) {
            return { type: 'takeThree', colors: available.slice(0, Math.min(3, available.length)) };
        }
        return { type: 'reserveDeck', tier: 1 };
    }
    const purchases = actions.filter((a) => a.type === 'purchase');
    if (purchases.length > 0 && Math.random() < 0.6) {
        return purchases[Math.floor(Math.random() * purchases.length)];
    }
    return actions[Math.floor(Math.random() * actions.length)];
}
// ─── MEDIUM AI ────────────────────────────────────────────────────────
function mediumAI(player, state) {
    const actions = getAllValidActions(player, state);
    if (actions.length === 0) {
        const available = (0, rules_1.getAvailableTokenColors)(state.board.tokens);
        return { type: 'takeThree', colors: available.slice(0, Math.min(3, available.length)) };
    }
    const scored = actions.map((action) => {
        let score = 0;
        if (action.type === 'purchase') {
            const card = [...getAllVisibleCards(state), ...getReservedAsCards(player)]
                .find((c) => c.id === action.cardId);
            if (card) {
                score += card.prestige * 20;
                score += cardAdvancesNoble(card, state.board.nobles) * 15;
                score += 10;
            }
        }
        if (action.type === 'takeThree' || action.type === 'takeTwo') {
            const allCards = getAllVisibleCards(state);
            const cheapest = allCards
                .filter((c) => !(0, rules_1.canPurchaseCard)(player, c))
                .sort((a, b) => turnsToAfford(player, a) - turnsToAfford(player, b));
            if (cheapest.length > 0) {
                const target = cheapest[0];
                if (action.type === 'takeThree') {
                    for (const color of action.colors) {
                        if ((target.cost[color] || 0) > player.gems[color] + player.bonuses[color]) {
                            score += 3;
                        }
                    }
                }
                else {
                    if ((target.cost[action.color] || 0) > player.gems[action.color] + player.bonuses[action.color]) {
                        score += 5;
                    }
                }
            }
            score += 2;
        }
        if (action.type === 'reserve') {
            const card = getAllVisibleCards(state).find((c) => c.id === action.cardId);
            if (card && turnsToAfford(player, card) <= 2) {
                score += card.prestige * 5 + 5;
            }
            else {
                score += 1;
            }
        }
        if (action.type === 'reserveDeck') {
            score += 1;
        }
        return { action, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored[0].action;
}
// ─── HARD AI ──────────────────────────────────────────────────────────
function evaluatePosition(player, nobles) {
    let score = player.prestige * 10;
    for (const noble of nobles) {
        score += nobleProgress(player, noble) * 5;
    }
    for (const color of types_1.GEM_COLORS) {
        score += player.bonuses[color] * 3;
    }
    return score;
}
function hardAI(player, state) {
    const actions = getAllValidActions(player, state);
    if (actions.length === 0) {
        const available = (0, rules_1.getAvailableTokenColors)(state.board.tokens);
        return { type: 'takeThree', colors: available.slice(0, Math.min(3, available.length)) };
    }
    const purchases = actions.filter((a) => a.type === 'purchase');
    if (purchases.length > 0) {
        let bestPurchase = purchases[0];
        let bestScore = -Infinity;
        for (const action of purchases) {
            const card = [...getAllVisibleCards(state), ...getReservedAsCards(player)]
                .find((c) => c.id === action.cardId);
            if (!card)
                continue;
            let score = card.prestige * 20;
            score += cardAdvancesNoble(card, state.board.nobles) * 15;
            const claimableAfter = (0, rules_1.getClaimableNobles)({
                ...player,
                bonuses: { ...player.bonuses, [card.bonus]: player.bonuses[card.bonus] + 1 },
                prestige: player.prestige + card.prestige,
            }, state.board.nobles);
            score += claimableAfter.length * 30;
            if (score > bestScore) {
                bestScore = score;
                bestPurchase = action;
            }
        }
        return bestPurchase;
    }
    const opponents = state.players.filter((p) => p.id !== player.id);
    const opponentTargetColors = new Set();
    for (const opp of opponents) {
        for (const color of types_1.GEM_COLORS) {
            if (opp.gems[color] >= 3)
                opponentTargetColors.add(color);
        }
    }
    const reserveActions = actions.filter((a) => a.type === 'reserve');
    if (reserveActions.length > 0 && player.reservedCards.length < 2) {
        const visible = getAllVisibleCards(state);
        const highValue = visible
            .filter((c) => c.prestige >= 3 && turnsToAfford(player, c) <= 2)
            .sort((a, b) => b.prestige - a.prestige);
        if (highValue.length > 0) {
            return { type: 'reserve', cardId: highValue[0].id };
        }
        for (const opp of opponents) {
            if (opp.prestige >= 12) {
                const oppPurchasable = visible.filter((c) => (0, rules_1.canPurchaseCard)(opp, c) && c.prestige >= 2);
                if (oppPurchasable.length > 0) {
                    return { type: 'reserve', cardId: oppPurchasable[0].id };
                }
            }
        }
    }
    const tokenActions = actions.filter((a) => a.type === 'takeThree' || a.type === 'takeTwo');
    if (tokenActions.length > 0) {
        const allCards = [...getAllVisibleCards(state), ...getReservedAsCards(player)];
        const nearPurchase = allCards
            .sort((a, b) => {
            const scoreA = a.prestige * 3 + cardAdvancesNoble(a, state.board.nobles) * 2 - turnsToAfford(player, a);
            const scoreB = b.prestige * 3 + cardAdvancesNoble(b, state.board.nobles) * 2 - turnsToAfford(player, b);
            return scoreB - scoreA;
        });
        const target = nearPurchase[0];
        if (target) {
            const neededColors = [];
            for (const color of types_1.GEM_COLORS) {
                const cost = target.cost[color] || 0;
                const have = player.gems[color] + player.bonuses[color];
                if (cost > have)
                    neededColors.push(color);
            }
            const takeThreeMatch = tokenActions.filter((a) => {
                if (a.type !== 'takeThree')
                    return false;
                return a.colors.some((c) => neededColors.includes(c));
            });
            if (takeThreeMatch.length > 0) {
                takeThreeMatch.sort((a, b) => {
                    if (a.type !== 'takeThree' || b.type !== 'takeThree')
                        return 0;
                    const aMatch = a.colors.filter((c) => neededColors.includes(c)).length;
                    const bMatch = b.colors.filter((c) => neededColors.includes(c)).length;
                    return bMatch - aMatch;
                });
                return takeThreeMatch[0];
            }
            const takeTwoMatch = tokenActions.filter((a) => a.type === 'takeTwo' && neededColors.includes(a.color));
            if (takeTwoMatch.length > 0)
                return takeTwoMatch[0];
        }
        return tokenActions[0];
    }
    return actions[0];
}
// ─── PUBLIC API ───────────────────────────────────────────────────────
function getAIAction(player, state) {
    switch (player.aiDifficulty) {
        case 'easy': return easyAI(player, state);
        case 'medium': return mediumAI(player, state);
        case 'hard': return hardAI(player, state);
        default: return easyAI(player, state);
    }
}
function getAIDiscardTokens(player, tokensToDiscard) {
    const discard = {};
    let remaining = tokensToDiscard;
    const priority = ['onyx', 'ruby', 'emerald', 'sapphire', 'diamond', 'gold'];
    for (const color of priority) {
        if (remaining <= 0)
            break;
        const available = player.gems[color];
        if (available > 0) {
            const take = Math.min(available, remaining);
            discard[color] = take;
            remaining -= take;
        }
    }
    return discard;
}
function executeAIAction(action) {
    const store = gameState_1.useGameStore.getState();
    switch (action.type) {
        case 'takeThree': {
            const validColors = action.colors.filter((c) => store.board.tokens[c] > 0).slice(0, 3);
            if (validColors.length > 0) {
                store.takeThreeTokens(validColors);
            }
            break;
        }
        case 'takeTwo':
            store.takeTwoTokens(action.color);
            break;
        case 'purchase':
            store.purchaseCard(action.cardId);
            break;
        case 'reserve':
            store.reserveCard(action.cardId);
            break;
        case 'reserveDeck':
            store.reserveFromDeck(action.tier);
            break;
    }
}
