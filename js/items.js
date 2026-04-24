// ═══════════════════════════════════════════════
//  ITEMS  (items.js)
//  Defines every collectable item in the game:
//  their stats, display strings, rarity tier, and
//  the weighted pool used when awarding a random
//  item for completing a bonus objective.
//
//  HOW TO ADD A NEW ITEM:
//    1. Add an entry to ITEM_DEFS with a unique id.
//       Follow the naming convention so useItem()
//       in inventory.js recognises it automatically:
//         reveal#      — reveals # correct tiles
//         markWrong#   — marks # empty tiles with ✕
//         addTime#     — adds # seconds to the timer
//         freeze       — pauses the timer
//         shield       — blocks the next mistake
//         cursed*      — cursed variant (handled individually in useItem)
//    2. Add the id string to ITEM_POOL (as many times
//       as you want it to appear — more copies = higher
//       drop chance).
// ═══════════════════════════════════════════════


// pickRandomItem — draws one item id at random from ITEM_POOL.
//   Because ITEM_POOL contains duplicate entries for common items and
//   fewer entries for rare ones, the distribution is already weighted —
//   no separate probability table is needed.
//   Returns a defId string (e.g. 'reveal2') that can be looked up in ITEM_DEFS.
//   Called from: checkWin() and answerQuiz() in scoring.js.
function pickRandomItem() {
    return ITEM_POOL[Math.floor(Math.random() * ITEM_POOL.length)];
}

// itemName(def) — returns the item's display name in the active language.
//   def is an ITEM_DEFS entry object.
function itemName(def) {
    return LANG === 'de' ? def.nameDE : def.nameEn;
}

// itemDesc(def) — returns the item's description in the active language.
function itemDesc(def) {
    return LANG === 'de' ? def.descDE : def.descEn;
}

// rarityLabel(r) — converts a rarity key to its uppercase display label.
//   Falls back to the raw key string if an unknown rarity is passed,
//   making it safe to add new rarities without breaking the UI.
function rarityLabel(r) {
    const m = {
        common: 'COMMON',
        uncommon: 'UNCOMMON',
        rare: 'RARE',
        legendary: 'LEGENDARY',
        cursed: 'CURSED'
    };
    return m[r] || r;
}


// ═══════════════════════════════════════════════
//  ITEM DEFINITIONS
//  Each entry is keyed by its id string (same as
//  the id field inside the object — kept both ways
//  for easy lookup and for self-describing objects).
//
//  Fields per item:
//    id        — unique string; also drives useItem() logic via prefix matching
//    icon      — emoji shown in the inventory card and toast messages
//    nameEn/DE — display name in English / German
//    descEn/DE — one-line description shown on the card
//    scoreCost — points deducted from totalScore when the item is used
//                (0 = free to use; cursed items are always free)
//    sellVal   — points added to totalScore when the item is sold instead
//    rarity    — 'common' | 'uncommon' | 'rare' | 'legendary' | 'cursed'
//                Controls the colour of the rarity badge in the inventory.
// ═══════════════════════════════════════════════
const ITEM_DEFS = {

    // ── REVEAL items — show N correct (unfilled) tiles in green ──────────
    reveal1: {
        id: 'reveal1', icon: '🔦',
        nameEn: 'Candle', nameDE: 'Kerze',
        descEn: 'Reveals 1 correct tile', descDE: 'Enthüllt 1 Feld',
        scoreCost: 15, sellVal: 8, rarity: 'common'
    },
    reveal2: {
        id: 'reveal2', icon: '🔍',
        nameEn: 'Magnifier', nameDE: 'Lupe',
        descEn: 'Reveals 2 correct tiles', descDE: 'Enthüllt 2 Felder',
        scoreCost: 30, sellVal: 18, rarity: 'uncommon'
    },
    reveal3: {
        id: 'reveal3', icon: '🔭',
        nameEn: 'Spyglass', nameDE: 'Fernglas',
        descEn: 'Reveals 3 correct tiles', descDE: 'Enthüllt 3 Felder',
        scoreCost: 55, sellVal: 35, rarity: 'rare'
    },
    reveal4: {
        id: 'reveal4', icon: '🛸',
        nameEn: 'Scanner', nameDE: 'Scanner',
        descEn: 'Reveals 4 correct tiles', descDE: 'Enthüllt 4 Felder',
        scoreCost: 90, sellVal: 60, rarity: 'legendary'
    },

    // ── MARK-WRONG items — place a ✕ on N empty-but-wrong cells ──────────
    // Helps the player eliminate impossible cells without guessing.
    markWrong2: {
        id: 'markWrong2', icon: '🚫',
        nameEn: 'Eraser', nameDE: 'Radierer',
        descEn: 'Marks 2 wrong empty tiles', descDE: 'Markiert 2 leere Felder',
        scoreCost: 20, sellVal: 12, rarity: 'common'
    },
    markWrong4: {
        id: 'markWrong4', icon: '🧹',
        nameEn: 'Sweeper', nameDE: 'Besen',
        descEn: 'Marks 4 wrong empty tiles', descDE: 'Markiert 4 leere Felder',
        scoreCost: 40, sellVal: 25, rarity: 'uncommon'
    },
    markWrong6: {
        id: 'markWrong6', icon: '🧲',
        nameEn: 'Error Magnet', nameDE: 'Fehlermagnet',
        descEn: 'Marks 6 wrong empty tiles', descDE: 'Markiert 6 leere Felder',
        scoreCost: 65, sellVal: 42, rarity: 'rare'
    },
    markWrong8: {
        id: 'markWrong8', icon: '💎',
        nameEn: 'Perfect Filter', nameDE: 'Perfektfilter',
        descEn: 'Marks 8 wrong empty tiles', descDE: 'Markiert 8 leere Felder',
        scoreCost: 100, sellVal: 70, rarity: 'legendary'
    },

    // ── ADD-TIME items — extend the countdown by N seconds ───────────────
    addTime30: {
        id: 'addTime30', icon: '⏳',
        nameEn: '+30s Hourglass', nameDE: '+30s Sanduhr',
        descEn: 'Adds 30 seconds', descDE: 'Fügt 30 Sek. hinzu',
        scoreCost: 25, sellVal: 15, rarity: 'common'
    },
    addTime60: {
        id: 'addTime60', icon: '⌛',
        nameEn: '+60s Hourglass', nameDE: '+60s Sanduhr',
        descEn: 'Adds 60 seconds', descDE: 'Fügt 60 Sek. hinzu',
        scoreCost: 45, sellVal: 28, rarity: 'uncommon'
    },
    addTime90: {
        id: 'addTime90', icon: '🕰️',
        nameEn: '+90s Clock', nameDE: '+90s Uhr',
        descEn: 'Adds 90 seconds', descDE: 'Fügt 90 Sek. hinzu',
        scoreCost: 70, sellVal: 45, rarity: 'rare'
    },
    addTime180: {
        id: 'addTime180', icon: '⚡',
        nameEn: '+3min Turbo', nameDE: '+3min Turbo',
        descEn: 'Adds 3 minutes', descDE: 'Fügt 3 Min. hinzu',
        scoreCost: 120, sellVal: 80, rarity: 'legendary'
    },

    // ── UTILITY items ─────────────────────────────────────────────────────
    freeze: {
        id: 'freeze', icon: '❄️',
        nameEn: 'Time Freeze', nameDE: 'Zeitfrieren',
        descEn: 'Pauses timer 30 sec', descDE: 'Stoppt Timer 30 Sek.',
        scoreCost: 80, sellVal: 50, rarity: 'rare'
    },
    shield: {
        id: 'shield', icon: '🛡️',
        nameEn: 'Shield', nameDE: 'Schild',
        descEn: 'Negates next mistake', descDE: 'Negiert nächsten Fehler',
        scoreCost: 70, sellVal: 45, rarity: 'uncommon'
    },

    // ── CURSED items — powerful but risky; locked for the first 3 minutes ─
    // scoreCost is 0 for all cursed items (they are free to use — the risk
    // IS the cost). They are also excluded from the noitem bonus check.
    cursedReveal: {
        id: 'cursedReveal', icon: '☠️',
        nameEn: 'Cursed Lens', nameDE: 'Verfluchte Linse',
        descEn: 'Reveals 6 tiles BUT 50% chance: reset board!',
        descDE: 'Enthüllt 6 Felder, ABER 50% Reset-Chance!',
        scoreCost: 0, sellVal: 20, rarity: 'cursed'
    },
    cursedTime: {
        id: 'cursedTime', icon: '💀',
        nameEn: 'Cursed Clock', nameDE: 'Verfluchte Uhr',
        descEn: '+5 min BUT 40% chance: lose 4 min!',
        descDE: '+5 Min., ABER 40% Chance: −4 Min.!',
        scoreCost: 0, sellVal: 20, rarity: 'cursed'
    },
    cursedShield: {
        id: 'cursedShield', icon: '👁️',
        nameEn: 'Demon Eye', nameDE: 'Dämonenauge',
        descEn: 'Shield active BUT 30% chance: instant fail!',
        descDE: 'Schild aktiv, ABER 30% sofort verloren!',
        scoreCost: 0, sellVal: 20, rarity: 'cursed'
    },
};


// ═══════════════════════════════════════════════
//  ITEM POOL  (weighted drop table)
//  Each string is a defId from ITEM_DEFS.
//  Duplicate entries increase the probability of
//  that item being awarded. Current weights:
//    common    × 5  →  ~33 % total
//    uncommon  × 4  →  ~27 % total
//    rare      × 3  →  ~20 % total
//    legendary × 2  →  ~13 % total
//    cursed    × 2  →  ~13 % total
//  (15 entries total; each entry = 1/15 ≈ 6.7 %)
//
//  To change drop rates: add or remove duplicate
//  entries. To add a new item: add its defId here.
// ═══════════════════════════════════════════════
const ITEM_POOL = [
    // common × 5
    'reveal1', 'reveal1', 'markWrong2', 'markWrong2', 'addTime30',
    // uncommon × 4
    'reveal2', 'markWrong4', 'addTime60', 'shield',
    // rare × 3
    'reveal3', 'markWrong6', 'addTime90',
    // legendary × 2
    'reveal4', 'addTime180',
    // cursed × 2
    'cursedReveal', 'cursedTime',
];














