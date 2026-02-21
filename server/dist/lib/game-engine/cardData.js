"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_CARDS = exports.ALL_NOBLES = exports.TIER3_CARDS = exports.TIER2_CARDS = exports.TIER1_CARDS = void 0;
// CSV mapping: white->diamond, blue->sapphire, green->emerald, red->ruby, black->onyx
// type column: white->diamond, blue->sapphire, green->emerald, red->ruby, black->onyx
function c(id, tier, bonus, prestige, diamond, sapphire, emerald, ruby, onyx) {
    const cost = {};
    if (diamond)
        cost.diamond = diamond;
    if (sapphire)
        cost.sapphire = sapphire;
    if (emerald)
        cost.emerald = emerald;
    if (ruby)
        cost.ruby = ruby;
    if (onyx)
        cost.onyx = onyx;
    return { id, tier, bonus, prestige, cost };
}
// ─── TIER 1 (40 cards) ───────────────────────────────────────────────
exports.TIER1_CARDS = [
    // Diamond (white) bonus — 8 cards
    c('t1-01', 1, 'diamond', 0, 0, 3, 0, 0, 0),
    c('t1-02', 1, 'diamond', 0, 0, 0, 0, 2, 1),
    c('t1-03', 1, 'diamond', 0, 0, 1, 1, 1, 1),
    c('t1-04', 1, 'diamond', 0, 0, 2, 0, 0, 2),
    c('t1-05', 1, 'diamond', 1, 0, 0, 4, 0, 0),
    c('t1-06', 1, 'diamond', 0, 0, 1, 2, 1, 1),
    c('t1-07', 1, 'diamond', 0, 0, 2, 2, 0, 1),
    c('t1-08', 1, 'diamond', 0, 3, 1, 0, 0, 1),
    // Sapphire (blue) bonus — 8 cards
    c('t1-09', 1, 'sapphire', 0, 1, 0, 0, 0, 2),
    c('t1-10', 1, 'sapphire', 0, 0, 0, 0, 0, 3),
    c('t1-11', 1, 'sapphire', 0, 1, 0, 1, 1, 1),
    c('t1-12', 1, 'sapphire', 0, 0, 0, 2, 0, 2),
    c('t1-13', 1, 'sapphire', 1, 0, 0, 0, 4, 0),
    c('t1-14', 1, 'sapphire', 0, 1, 0, 1, 2, 1),
    c('t1-15', 1, 'sapphire', 0, 1, 0, 2, 2, 0),
    c('t1-16', 1, 'sapphire', 0, 0, 1, 3, 1, 0),
    // Emerald (green) bonus — 8 cards
    c('t1-17', 1, 'emerald', 0, 2, 1, 0, 0, 0),
    c('t1-18', 1, 'emerald', 0, 0, 0, 0, 3, 0),
    c('t1-19', 1, 'emerald', 0, 1, 1, 0, 1, 1),
    c('t1-20', 1, 'emerald', 0, 0, 2, 0, 2, 0),
    c('t1-21', 1, 'emerald', 1, 0, 0, 0, 0, 4),
    c('t1-22', 1, 'emerald', 0, 1, 1, 0, 1, 2),
    c('t1-23', 1, 'emerald', 0, 0, 1, 0, 2, 2),
    c('t1-24', 1, 'emerald', 0, 1, 3, 1, 0, 0),
    // Ruby (red) bonus — 8 cards
    c('t1-25', 1, 'ruby', 0, 0, 2, 1, 0, 0),
    c('t1-26', 1, 'ruby', 0, 3, 0, 0, 0, 0),
    c('t1-27', 1, 'ruby', 0, 1, 1, 1, 0, 1),
    c('t1-28', 1, 'ruby', 0, 2, 0, 0, 2, 0),
    c('t1-29', 1, 'ruby', 1, 4, 0, 0, 0, 0),
    c('t1-30', 1, 'ruby', 0, 2, 1, 1, 0, 1),
    c('t1-31', 1, 'ruby', 0, 2, 0, 1, 0, 2),
    c('t1-32', 1, 'ruby', 0, 1, 0, 0, 1, 3),
    // Onyx (black) bonus — 8 cards
    c('t1-33', 1, 'onyx', 0, 0, 0, 2, 1, 0),
    c('t1-34', 1, 'onyx', 0, 0, 0, 3, 0, 0),
    c('t1-35', 1, 'onyx', 0, 1, 1, 1, 1, 0),
    c('t1-36', 1, 'onyx', 0, 2, 0, 2, 0, 0),
    c('t1-37', 1, 'onyx', 1, 0, 4, 0, 0, 0),
    c('t1-38', 1, 'onyx', 0, 1, 2, 1, 1, 0),
    c('t1-39', 1, 'onyx', 0, 2, 2, 0, 1, 0),
    c('t1-40', 1, 'onyx', 0, 0, 0, 1, 3, 1),
];
// ─── TIER 2 (30 cards) ───────────────────────────────────────────────
exports.TIER2_CARDS = [
    // Diamond bonus — 6 cards
    c('t2-01', 2, 'diamond', 2, 0, 0, 0, 5, 0),
    c('t2-02', 2, 'diamond', 3, 6, 0, 0, 0, 0),
    c('t2-03', 2, 'diamond', 1, 0, 0, 3, 2, 2),
    c('t2-04', 2, 'diamond', 2, 0, 0, 1, 4, 2),
    c('t2-05', 2, 'diamond', 1, 2, 3, 0, 3, 0),
    c('t2-06', 2, 'diamond', 2, 0, 0, 0, 5, 3),
    // Sapphire bonus — 6 cards
    c('t2-07', 2, 'sapphire', 2, 0, 0, 5, 0, 0),
    c('t2-08', 2, 'sapphire', 3, 0, 0, 6, 0, 0),
    c('t2-09', 2, 'sapphire', 1, 2, 3, 0, 0, 2),
    c('t2-10', 2, 'sapphire', 1, 3, 0, 2, 3, 0),
    c('t2-11', 2, 'sapphire', 2, 4, 2, 0, 0, 1),
    c('t2-12', 2, 'sapphire', 2, 0, 5, 3, 0, 0),
    // Emerald bonus — 6 cards
    c('t2-13', 2, 'emerald', 2, 0, 0, 5, 0, 0),
    c('t2-14', 2, 'emerald', 3, 0, 0, 6, 0, 0),
    c('t2-15', 2, 'emerald', 1, 2, 3, 0, 0, 2),
    c('t2-16', 2, 'emerald', 1, 3, 0, 2, 3, 0),
    c('t2-17', 2, 'emerald', 2, 4, 2, 0, 0, 1),
    c('t2-18', 2, 'emerald', 2, 0, 5, 3, 0, 0),
    // Ruby bonus — 6 cards
    c('t2-19', 2, 'ruby', 2, 0, 0, 0, 0, 5),
    c('t2-20', 2, 'ruby', 3, 0, 0, 0, 6, 0),
    c('t2-21', 2, 'ruby', 1, 2, 0, 0, 2, 3),
    c('t2-22', 2, 'ruby', 2, 1, 4, 2, 0, 0),
    c('t2-23', 2, 'ruby', 1, 0, 3, 0, 2, 3),
    c('t2-24', 2, 'ruby', 2, 3, 0, 0, 0, 5),
    // Onyx bonus — 6 cards
    c('t2-25', 2, 'onyx', 2, 0, 0, 0, 0, 5),
    c('t2-26', 2, 'onyx', 3, 0, 0, 0, 0, 6),
    c('t2-27', 2, 'onyx', 1, 3, 2, 2, 0, 0),
    c('t2-28', 2, 'onyx', 2, 0, 1, 4, 2, 0),
    c('t2-29', 2, 'onyx', 1, 3, 0, 3, 0, 2),
    c('t2-30', 2, 'onyx', 2, 0, 0, 5, 3, 0),
];
// ─── TIER 3 (20 cards) ───────────────────────────────────────────────
exports.TIER3_CARDS = [
    // Diamond bonus — 4 cards
    c('t3-01', 3, 'diamond', 4, 0, 0, 0, 0, 7),
    c('t3-02', 3, 'diamond', 5, 3, 0, 0, 0, 7),
    c('t3-03', 3, 'diamond', 4, 3, 0, 0, 3, 6),
    c('t3-04', 3, 'diamond', 3, 0, 3, 3, 5, 3),
    // Sapphire bonus — 4 cards
    c('t3-05', 3, 'sapphire', 4, 7, 0, 0, 0, 0),
    c('t3-06', 3, 'sapphire', 5, 7, 3, 0, 0, 0),
    c('t3-07', 3, 'sapphire', 4, 6, 3, 0, 0, 3),
    c('t3-08', 3, 'sapphire', 3, 3, 0, 3, 3, 5),
    // Emerald bonus — 4 cards
    c('t3-09', 3, 'emerald', 4, 0, 7, 0, 0, 0),
    c('t3-10', 3, 'emerald', 5, 0, 7, 3, 0, 0),
    c('t3-11', 3, 'emerald', 4, 3, 6, 3, 0, 0),
    c('t3-12', 3, 'emerald', 3, 5, 3, 0, 3, 3),
    // Ruby bonus — 4 cards
    c('t3-13', 3, 'ruby', 4, 0, 0, 7, 0, 0),
    c('t3-14', 3, 'ruby', 5, 0, 0, 7, 3, 0),
    c('t3-15', 3, 'ruby', 4, 0, 3, 6, 3, 0),
    c('t3-16', 3, 'ruby', 3, 3, 5, 3, 0, 3),
    // Onyx bonus — 4 cards
    c('t3-17', 3, 'onyx', 4, 0, 0, 0, 7, 0),
    c('t3-18', 3, 'onyx', 5, 0, 0, 0, 7, 3),
    c('t3-19', 3, 'onyx', 4, 0, 0, 3, 6, 3),
    c('t3-20', 3, 'onyx', 3, 3, 3, 5, 3, 0),
];
// ─── NOBLES (10 tiles) ───────────────────────────────────────────────
function n(id, diamond, sapphire, emerald, ruby, onyx) {
    const requirements = {};
    if (diamond)
        requirements.diamond = diamond;
    if (sapphire)
        requirements.sapphire = sapphire;
    if (emerald)
        requirements.emerald = emerald;
    if (ruby)
        requirements.ruby = ruby;
    if (onyx)
        requirements.onyx = onyx;
    return { id, prestige: 3, requirements };
}
exports.ALL_NOBLES = [
    n('n-01', 3, 3, 0, 0, 3),
    n('n-02', 0, 3, 3, 3, 0),
    n('n-03', 3, 0, 0, 3, 3),
    n('n-04', 0, 0, 4, 4, 0),
    n('n-05', 0, 4, 4, 0, 0),
    n('n-06', 0, 0, 0, 4, 4),
    n('n-07', 4, 0, 0, 0, 4),
    n('n-08', 3, 3, 3, 0, 0),
    n('n-09', 0, 0, 3, 3, 3),
    n('n-10', 4, 4, 0, 0, 0),
];
exports.ALL_CARDS = [...exports.TIER1_CARDS, ...exports.TIER2_CARDS, ...exports.TIER3_CARDS];
