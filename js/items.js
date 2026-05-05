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


// Weighted draw from all items that have weight > 0
function pickRandomItem() {
    const pool = Object.values(ITEM_DEFS).filter(d => d.weight > 0);
    const total = pool.reduce((sum, d) => sum + d.weight, 0);
    let roll = Math.random() * total;
    for (const d of pool) {
        roll -= d.weight;
        if (roll <= 0) return d.id;
    }
    return pool[pool.length - 1].id; // fallback
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
        epic: 'EPIC',
        legendary: 'LEGENDARY',
        cursed: 'CURSED',
        artifact: 'ARTIFACT'
    };
    return m[r] || r.toUpperCase();
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
        id: 'reveal1', icon: '🕯️',
        nameEn: 'Candle', nameDE: 'Kerze',
        descEn: 'Reveals 1 correct cell', descDE: 'Enthüllt eine richtige Zelle ',
        scoreCost: 15, sellVal: 8, rarity: 'common', weight: 10
    },
    reveal2: {
        id: 'reveal2', icon: '🔍',
        nameEn: 'Magnifier', nameDE: 'Lupe',
        descEn: 'Reveals 2 correct cell', descDE: 'Enthüllt 2 richtige Zellen',
        scoreCost: 30, sellVal: 18, rarity: 'uncommon', weight: 8
    },
    reveal3: {
        id: 'reveal3', icon: '🔭',
        nameEn: 'Spyglass', nameDE: 'Fernglas',
        descEn: 'Reveals 3 correct cell', descDE: 'Enthüllt 3 richtige Zellen',
        scoreCost: 55, sellVal: 35, rarity: 'rare', weight: 5
    },
    reveal4: {
        id: 'reveal4', icon: '📡',
        nameEn: 'Scanner', nameDE: 'Scanner',
        descEn: 'Reveals 4 correct cell', descDE: 'Enthüllt 4 richtige Zellen',
        scoreCost: 90, sellVal: 60, rarity: 'epic', weight: 3
    },

    // ── MARK-WRONG items — place a ✕ on N empty-but-wrong cells ──────────
    // Helps the player eliminate impossible cells without guessing.
    markWrong2: {
        id: 'markWrong2', icon: '✏️',
        nameEn: 'Eraser', nameDE: 'Radierer',
        descEn: 'Marks 2 wrong empty tiles', descDE: 'Markiert 2 leere Felder',
        scoreCost: 20, sellVal: 12, rarity: 'common', weight: 10
    },
    markWrong4: {
        id: 'markWrong4', icon: '🧹',
        nameEn: 'Sweeper', nameDE: 'Besen',
        descEn: 'Marks 4 wrong empty tiles', descDE: 'Markiert 4 leere Felder',
        scoreCost: 40, sellVal: 25, rarity: 'uncommon', weight: 8
    },
    markWrong6: {
        id: 'markWrong6', icon: '🧲',
        nameEn: 'Error Magnet', nameDE: 'Fehlermagnet',
        descEn: 'Marks 6 wrong empty tiles', descDE: 'Markiert 6 leere Felder',
        scoreCost: 65, sellVal: 42, rarity: 'rare', weight: 5
    },
    markWrong8: {
        id: 'markWrong8', icon: '💎',
        nameEn: 'Error Gem', nameDE: 'Fehlerstein',
        descEn: 'Marks 8 wrong empty tiles', descDE: 'Markiert 8 leere Felder',
        scoreCost: 100, sellVal: 70, rarity: 'epic', weight: 3
    },

    // ── ADD-TIME items — extend the countdown by N seconds ───────────────
    addTime60: {
        id: 'addTime60', icon: '⏳',
        nameEn: 'Hourglass', nameDE: 'Sanduhr',
        descEn: 'Adds 60 seconds', descDE: 'Fügt 60 Sek. hinzu',
        scoreCost: 25, sellVal: 15, rarity: 'common', weight: 10
    },
    addTime300: {
        id: 'addTime300', icon: '⏱️', 
        nameEn: 'Stopwatch', nameDE: 'Stoppuhr',
        descEn: 'Adds 5 minutes', descDE: 'Fügt 5 Min. hinzu',
        scoreCost: 45, sellVal: 28, rarity: 'uncommon', weight: 8
    },
    addTime600: {
        id: 'addTime600', icon: '🕰️',
        nameEn: 'Clock', nameDE: 'Uhr',
        descEn: 'Adds 10 minutes', descDE: 'Fügt 10 Min. hinzu',
        scoreCost: 70, sellVal: 45, rarity: 'rare', weight: 5
    },
    addTime900: {
        id: 'addTime900', icon: '⚡',
        nameEn: 'Chronobolt', nameDE: 'Chronoblitz',
        descEn: 'Adds 15 minutes', descDE: 'Fügt 15 Min. hinzu',
        scoreCost: 120, sellVal: 80, rarity: 'epic', weight: 3
    },

    // ── UTILITY items ─────────────────────────────────────────────────────
    freeze: {
        id: 'freeze', icon: '❄️',
        nameEn: 'Time Freeze', nameDE: 'Zeitfrieren',
        descEn: 'Pauses timer for 5 min', descDE: 'Friert die Zeit für 5 Min. ein',
        scoreCost: 80, sellVal: 50, rarity: 'epic', weight: 3
    },
    shield: {
        id: 'shield', icon: '🛡️',
        nameEn: 'Shield', nameDE: 'Schild',
        descEn: 'Negates next mistake', descDE: 'Negiert nächsten Fehler',
        scoreCost: 70, sellVal: 45, rarity: 'epic', weight: 3
    },
    // ── ROW-SOLVE ─────────────────────────────────────────────────────────
    rowSolve: {
        id: 'rowSolve', icon: '📐',
        nameEn: 'Set Square', nameDE: 'Geodreieck',
        descEn: 'Reveals a full random unsolved row', descDE: 'Enthüllt eine zufällige ungelöste Zeile',
        scoreCost: 110, sellVal: 70, rarity: 'legendary', weight: 4
    },

    // ── COL-SOLVE ─────────────────────────────────────────────────────────
    colSolve: {
        id: 'colSolve', icon: '📏',
        nameEn: 'Ruler', nameDE: 'Lineal',
        descEn: 'Reveals a full random unsolved column', descDE: 'Enthüllt eine zufällige ungelöste Spalte',
        scoreCost: 110, sellVal: 70, rarity: 'legendary', weight: 4
    },

    // ── MISTAKE-ERASER ────────────────────────────────────────────────────
    mistakeEraser: {
        id: 'mistakeEraser', icon: '🎓',
        nameEn: 'Tutor', nameDE: 'Tutor',
        descEn: 'Reduces your mistake count by 2', descDE: 'Reduziert deine Fehleranzahl um 2',
        scoreCost: 60, sellVal: 35, rarity: 'rare', weight: 5
    },

    // --- ARTIFACT
    artifactComplete: {
        id: 'artifactComplete', icon: '🌟',
        nameEn: 'Codex of Completion', nameDE: 'Kodex der Fertigstellung',
        descEn: 'Instantly solves the entire puzzle.',
        descDE: 'Löst das gesamte Puzzle sofort.',
        scoreCost: 0, sellVal: 500, rarity: 'artifact', weight: 1
    },

    scoutPrimer: {
        id: 'scoutPrimer', icon: '📜',
        nameEn: "Scout's Primer", nameDE: 'Pfadfinder-Kompass',
        descEn: 'Activates now. On your next level start, answer a question — A correct answer gives you 2 pre-solved rows & columns as a headstart!',
        descDE: 'Aktiviert sofort. Beim nächsten Level-Start: Beantworte eine Frage — Eine richtige Antwort gibt dir 2 vorgelöste Zeilen & Spalten!',
        scoreCost: 0, sellVal: 40, rarity: 'epic', weight: 4
    },




    // ── CURSED items — powerful but risky; locked for the first 3 minutes ─
    // scoreCost is 0 for all cursed items (they are free to use — the risk
    // IS the cost). They are also excluded from the noitem bonus check.
    cursedReveal: {
        id: 'cursedReveal', icon: '☠️',
        nameEn: 'Cursed Lens', nameDE: 'Verfluchte Linse',
        descEn: '✅ Reveals 6 cells  ·  ⚠️ Resets all wrong marks',
        descDE: '✅ Enthüllt 6 Zellen  ·  ⚠️ Setzt alle ✕-Markierungen zurück',
        scoreCost: 0, sellVal: 20, rarity: 'cursed', weight: 4
    },
    cursedTime: {
        id: 'cursedTime', icon: '💀',
        nameEn: 'Cursed Clock', nameDE: 'Verfluchte Uhr',
        descEn: '✅ +5 minutes  ·  ⚠️ Blackouts row & column clues for 30s',
        descDE: '✅ +5 Minuten  ·  ⚠️ Versteckt Zeilen - und Spaltenhinweise für 30s',
        scoreCost: 0, sellVal: 20, rarity: 'cursed', weight: 4
    },
    cursedShield: {
        id: 'cursedShield', icon: '👁️',
        nameEn: 'Demon Eye', nameDE: 'Dämonenauge',
        descEn: '✅ Shield + reveals 2 cells  ·  ⚠️ Blackouts row clues 30s',
        descDE: '✅ Schild + enthüllt 2 Zellen  ·  ⚠️ Versteckt Zeilenhinweise 30s',
        scoreCost: 0, sellVal: 20, rarity: 'cursed', weight: 4
    },
    cursedRowSolve: {
        id: 'cursedRowSolve', icon: '🌊',
        nameEn: 'Tidal Wave', nameDE: 'Flutwelle',
        descEn: '✅ Reveals 3 rows · ⚠️ Erases 1 other row',
        descDE: '✅ 3 Zeilen enthüllen  ·  ⚠️ 1 andere Zeile löschen',
        scoreCost: 0, sellVal: 25, rarity: 'cursed', weight: 3
    },
    cursedColSolve: {
        id: 'cursedColSolve', icon: '🌪️',
        nameEn: 'Column Vortex', nameDE: 'Wirbelwind',
        descEn: '✅ Reveals 3 columns · ⚠️ Erases 1 other column',
        descDE: '✅ 3 Spalten enthüllen  ·  ⚠️ 1 andere Spalte löschen',
        scoreCost: 0, sellVal: 25, rarity: 'cursed', weight: 3
    },
    cursedRowCol: {
        id: 'cursedRowCol', icon: '💥',
        nameEn: 'Chaos Grid', nameDE: 'Chaos-Gitter',
        descEn: '✅ Reveals 4 rows + 4 cols  ·  ⚠️ Blackouts all col clues 45s',
        descDE: '✅ 4 Zeilen + 4 Spalten enthüllen  ·  ⚠️ Alle Spaltenhinweise 45s ausgeblendet',
        scoreCost: 0, sellVal: 30, rarity: 'cursed', weight: 2
    },


};






// Lucky drops: same pool but with a small artifact chance on top
function pickLuckyItem() {
    if (Math.random() < 0.05) return 'artifactComplete';
    return pickRandomItem();
}











