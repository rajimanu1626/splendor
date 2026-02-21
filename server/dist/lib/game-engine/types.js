"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_GEM_TYPES = exports.GEM_COLORS = void 0;
exports.emptyGems = emptyGems;
exports.emptyBonuses = emptyBonuses;
exports.createPlayer = createPlayer;
exports.GEM_COLORS = ['diamond', 'sapphire', 'emerald', 'ruby', 'onyx'];
exports.ALL_GEM_TYPES = [...exports.GEM_COLORS, 'gold'];
function emptyGems() {
    return { diamond: 0, sapphire: 0, emerald: 0, ruby: 0, onyx: 0, gold: 0 };
}
function emptyBonuses() {
    return { diamond: 0, sapphire: 0, emerald: 0, ruby: 0, onyx: 0 };
}
function createPlayer(id, name, isAI, aiDifficulty) {
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
