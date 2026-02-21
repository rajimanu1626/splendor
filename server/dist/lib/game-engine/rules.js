"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitialTokens = getInitialTokens;
exports.getNobleCount = getNobleCount;
exports.getTokenCount = getTokenCount;
exports.canTakeThreeTokens = canTakeThreeTokens;
exports.canTakeTwoTokens = canTakeTwoTokens;
exports.getAvailableTokenColors = getAvailableTokenColors;
exports.getEffectivePurchasePower = getEffectivePurchasePower;
exports.canPurchaseCard = canPurchaseCard;
exports.calculateGemPayment = calculateGemPayment;
exports.canReserveCard = canReserveCard;
exports.getClaimableNobles = getClaimableNobles;
exports.shuffleDeck = shuffleDeck;
exports.findCardOnBoard = findCardOnBoard;
exports.findCardInReserved = findCardInReserved;
exports.determineWinner = determineWinner;
exports.hasValidTokenAction = hasValidTokenAction;
const types_1 = require("./types");
function getInitialTokens(playerCount) {
    const gemCount = playerCount === 2 ? 4 : playerCount === 3 ? 5 : 7;
    return {
        diamond: gemCount,
        sapphire: gemCount,
        emerald: gemCount,
        ruby: gemCount,
        onyx: gemCount,
        gold: 5,
    };
}
function getNobleCount(playerCount) {
    return playerCount + 1;
}
function getTokenCount(player) {
    return Object.values(player.gems).reduce((sum, n) => sum + n, 0);
}
function canTakeThreeTokens(selected, bankTokens) {
    if (selected.length === 0 || selected.length > 3)
        return false;
    const unique = new Set(selected);
    if (unique.size !== selected.length)
        return false;
    if (!selected.every((color) => bankTokens[color] >= 1))
        return false;
    const availableColors = types_1.GEM_COLORS.filter((c) => bankTokens[c] > 0);
    if (availableColors.length >= 3 && selected.length < 3)
        return false;
    if (availableColors.length < 3 && selected.length !== Math.min(availableColors.length, 3))
        return false;
    return true;
}
function canTakeTwoTokens(color, bankTokens) {
    return bankTokens[color] >= 4;
}
function getAvailableTokenColors(bankTokens) {
    return types_1.GEM_COLORS.filter((c) => bankTokens[c] > 0);
}
function getEffectivePurchasePower(player, color) {
    return player.gems[color] + player.bonuses[color];
}
function canPurchaseCard(player, card) {
    let goldNeeded = 0;
    for (const color of types_1.GEM_COLORS) {
        const cost = card.cost[color] || 0;
        const power = getEffectivePurchasePower(player, color);
        if (cost > power) {
            goldNeeded += cost - power;
        }
    }
    return player.gems.gold >= goldNeeded;
}
function calculateGemPayment(player, card) {
    const payment = {
        diamond: 0, sapphire: 0, emerald: 0, ruby: 0, onyx: 0, gold: 0,
    };
    for (const color of types_1.GEM_COLORS) {
        const cost = card.cost[color] || 0;
        const bonusDiscount = player.bonuses[color];
        const netCost = Math.max(0, cost - bonusDiscount);
        const gemsAvailable = player.gems[color];
        if (gemsAvailable >= netCost) {
            payment[color] = netCost;
        }
        else {
            payment[color] = gemsAvailable;
            payment.gold += netCost - gemsAvailable;
        }
    }
    return payment;
}
function canReserveCard(player) {
    return player.reservedCards.length < 3;
}
function getClaimableNobles(player, nobles) {
    return nobles.filter((noble) => {
        for (const color of types_1.GEM_COLORS) {
            const req = noble.requirements[color] || 0;
            if (player.bonuses[color] < req)
                return false;
        }
        return true;
    });
}
function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
function findCardOnBoard(board, cardId) {
    for (const tierKey of ['tier1', 'tier2', 'tier3']) {
        const idx = board[tierKey].visible.findIndex((c) => c?.id === cardId);
        if (idx !== -1)
            return { tier: tierKey, index: idx };
    }
    return null;
}
function findCardInReserved(player, cardId) {
    return player.reservedCards.findIndex((c) => c.id === cardId);
}
function determineWinner(players) {
    const maxPrestige = Math.max(...players.map((p) => p.prestige));
    if (maxPrestige < 15)
        return null;
    const candidates = players.filter((p) => p.prestige === maxPrestige);
    if (candidates.length === 1)
        return candidates[0];
    const minCards = Math.min(...candidates.map((p) => p.purchasedCards.length));
    const winners = candidates.filter((p) => p.purchasedCards.length === minCards);
    return winners[0];
}
function hasValidTokenAction(bankTokens) {
    const available = getAvailableTokenColors(bankTokens);
    if (available.length >= 1)
        return true;
    return false;
}
