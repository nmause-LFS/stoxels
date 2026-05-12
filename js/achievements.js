// ═══════════════════════════════════════════════
//  ACHIEVEMENTS  (achievements.js)
//  A persistent cross-playthrough achievement
//  system. Progress is stored in a separate
//  localStorage key ('stoxels_ach') so it is
//  never wiped by the main game reset.
//
//  HOW IT WORKS
//  ─────────────
//  • ACHIEVEMENT_DEFS — the master list of all
//    achievements, each with id, tiers, and a
//    type that maps to a tracked stat counter.
//  • ACH_STATE — loaded from / saved to its own
//    key: { stats: {}, unlocked: [] }
//  • trackAchStat(stat, amount) — the single call
//    other modules use to report anything. Call it
//    whenever something happens (mistake made,
//    tile revealed, etc.).
//  • checkAchievements() — scans every def and
//    unlocks any tiers whose thresholds are now met.
//  • showAchievementToast(def, tier) — pops a
//    brief overlay notification.
//  • buildAchievementsScreen() — renders the full
//    achievement screen for the menu tab.
// ═══════════════════════════════════════════════


// ── Persistence key (separate from main save) ──
const ACH_SAVE_KEY = 'stoxels_ach';

// ── Load / save helpers ─────────────────────────

function loadAchState() {
    try {
        const raw = localStorage.getItem(ACH_SAVE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch { return null; }
}

function saveAchState() {
    localStorage.setItem(ACH_SAVE_KEY, JSON.stringify(ACH_STATE));
}

function initAchState() {
    const s = loadAchState();
    if (s) {
        if (!s.stats) s.stats = {};
        if (!s.unlocked) s.unlocked = [];
        return s;
    }
    return { stats: {}, unlocked: [] };
}

let ACH_STATE = initAchState();


// ════════════════════════════════════════════════
//  ACHIEVEMENT DEFINITIONS
//  Each entry:
//    id          — unique string key
//    icon        — emoji shown in UI
//    nameEn/DE   — display name
//    descEn/DE   — flavour description
//    stat        — which stat counter this tracks
//    tiers       — array of { threshold, labelEn, labelDE }
//                  sorted ascending; each tier is a separate unlock
// ════════════════════════════════════════════════

const ACHIEVEMENT_DEFS = [

    // ── MISTAKES ────────────────────────────────
    {
        id: 'mistakes_made',
        category: 'mistakes',
        icon: '💥',
        nameEn: 'Oops!',
        nameDE: 'Hoppla!',
        descEn: 'Make mistakes while filling the puzzle.',
        descDE: 'Mache Fehler beim Ausfüllen des Puzzles.',
        stat: 'mistakesMade',
        tiers: [
            { threshold: 10, labelEn: 'First Blood', labelDE: 'Erste Fehler' },
            { threshold: 100, labelEn: 'Learning Curve', labelDE: 'Lernkurve' },
            { threshold: 500, labelEn: 'Serial Wrongdoer', labelDE: 'Serientäter' },
            { threshold: 1000, labelEn: 'Mistake Machine', labelDE: 'Fehlermaschine' },
            { threshold: 5000, labelEn: 'Chaos Agent', labelDE: 'Chaos-Agent' },
        ]
    },

    // ── TILES REVEALED (items / skills) ─────────
    {
        id: 'tiles_revealed',
        category: 'items',
        icon: '🔦',
        nameEn: 'Illuminator',
        nameDE: 'Erheller',
        descEn: 'Reveal correct tiles using items or class skills.',
        descDE: 'Enthülle richtige Felder mit Items oder Fähigkeiten.',
        stat: 'tilesRevealed',
        tiers: [
            { threshold: 100, labelEn: 'First Light', labelDE: 'Erstes Licht' },
            { threshold: 500, labelEn: 'Torch Bearer', labelDE: 'Fackelträger' },
            { threshold: 2000, labelEn: 'Floodlight', labelDE: 'Flutlicht' },
            { threshold: 5000, labelEn: 'Oracle', labelDE: 'Orakel' },
            { threshold: 10000, labelEn: 'All-Seeing', labelDE: 'Allsehend' },
        ]
    },

    // ── WRONG TILES MARKED (✕) ──────────────────
    {
        id: 'tiles_marked',
        category: 'grid',
        icon: '✕',
        nameEn: 'Process of Elimination',
        nameDE: 'Ausschlussverfahren',
        descEn: 'Mark incorrect empty cells with ✕.',
        descDE: 'Markiere leere Felder mit ✕.',
        stat: 'tilesMarked',
        tiers: [
            { threshold: 100, labelEn: 'First Cross', labelDE: 'Erstes Kreuz' },
            { threshold: 1000, labelEn: 'Crossword Fan', labelDE: 'Kreuzworträtsel-Fan' },
            { threshold: 5000, labelEn: 'Eliminator', labelDE: 'Eliminator' },
            { threshold: 20000, labelEn: 'Master Deducer', labelDE: 'Meisterdetektiv' },
        ]
    },

    // ── LEVELS COMPLETED ────────────────────────
    {
        id: 'levels_completed',
        category: 'completion',
        icon: '🏁',
        nameEn: 'Finisher',
        nameDE: 'Abschließer',
        descEn: 'Complete levels.',
        descDE: 'Schließe Levels ab.',
        stat: 'levelsCompleted',
        tiers: [
            { threshold: 1, labelEn: 'First Step', labelDE: 'Erster Schritt' },
            { threshold: 10, labelEn: 'Getting Started', labelDE: 'Am Anfang' },
            { threshold: 50, labelEn: 'Puzzle Enthusiast', labelDE: 'Rätsel-Enthusiast' },
            { threshold: 100, labelEn: 'Dedicated Solver', labelDE: 'Engagierter Löser' },
            { threshold: 250, labelEn: 'Puzzle Veteran', labelDE: 'Rätsel-Veteran' },
        ]
    },

    // ── LEVELS COMPLETED NO-MISTAKE ─────────────
    {
        id: 'perfect_levels',
        category: 'completion',
        icon: '⭐',
        nameEn: 'Perfectionist',
        nameDE: 'Perfektionist',
        descEn: 'Complete levels without making a single mistake.',
        descDE: 'Schließe Level ohne einen einzigen Fehler ab.',
        stat: 'perfectLevels',
        tiers: [
            { threshold: 10, labelEn: 'Clean Slate', labelDE: 'Reiner Tisch' },
            { threshold: 30, labelEn: 'Flawless', labelDE: 'Makellos' },
            { threshold: 60, labelEn: 'Untouchable', labelDE: 'Unberührbar' },
            { threshold: 100, labelEn: 'Diamond Mind', labelDE: 'Diamantgeist' },
        ]
    },

    // ── LEVELS COMPLETED NO-ITEM ─────────────────
    {
        id: 'noitem_levels',
        category: 'completion',
        icon: '🎒',
        nameEn: 'Self-Reliant',
        nameDE: 'Selbstständig',
        descEn: 'Complete levels without using any items.',
        descDE: 'Schließe Level ohne den Einsatz von Items ab.',
        stat: 'noItemLevels',
        tiers: [
            { threshold: 10, labelEn: 'Going Solo', labelDE: 'Alleingang' },
            { threshold: 30, labelEn: 'Minimalist', labelDE: 'Minimalist' },
            { threshold: 60, labelEn: 'Ironclad', labelDE: 'Eisenhart' },
            { threshold: 100, labelEn: 'True Purist', labelDE: 'Echter Purist' },
        ]
    },

    // ── LEVELS COMPLETED NO-ITEM AND NO-MISTAKE ──
    {
        id: 'pure_levels',
        category: 'completion',
        icon: '💎',
        nameEn: 'Pure Logic',
        nameDE: 'Reine Logik',
        descEn: 'Complete levels without any mistakes AND without using items.',
        descDE: 'Schließe Level ohne Fehler UND ohne Items ab.',
        stat: 'pureLevels',
        tiers: [
            { threshold: 10, labelEn: 'Crystal Clear', labelDE: 'Glasklar' },
            { threshold: 50, labelEn: 'Unassisted', labelDE: 'Ohne Hilfe' },
            { threshold: 100, labelEn: 'Logical Ascendant', labelDE: 'Logischer Aufsteiger' },
        ]
    },

    // ── QUIZ / MATHGATE ANSWERED CORRECTLY ───────
    {
        id: 'questions_correct',
        category: 'quiz',
        icon: '🧠',
        nameEn: 'Know-It-All',
        nameDE: 'Alleswisser',
        descEn: 'Answer bonus quiz and probability gate questions correctly.',
        descDE: 'Beantworte Bonusfragen und Wahrscheinlichkeitstor-Fragen richtig.',
        stat: 'questionsCorrect',
        tiers: [
            { threshold: 5, labelEn: 'First Answer', labelDE: 'Erste Antwort' },
            { threshold: 20, labelEn: 'Sharp Mind', labelDE: 'Scharfer Verstand' },
            { threshold: 50, labelEn: 'Scholar', labelDE: 'Gelehrter' },
            { threshold: 100, labelEn: 'Professor', labelDE: 'Professor' },
            { threshold: 200, labelEn: 'Stochastic Sage', labelDE: 'Stochastischer Weise' },
        ]
    },

    // ── ITEMS USED (total) ───────────────────────
    {
        id: 'items_used',
        category: 'items',
        icon: '🎁',
        nameEn: 'Item Hoarder',
        nameDE: 'Gegenstands-Sammler',
        descEn: 'Use items from your inventory.',
        descDE: 'Nutze Items aus deinem Inventar.',
        stat: 'itemsUsed',
        tiers: [
            { threshold: 10, labelEn: 'First Use', labelDE: 'Erste Nutzung' },
            { threshold: 50, labelEn: 'Resourceful', labelDE: 'Einfallsreich' },
            { threshold: 200, labelEn: 'Power User', labelDE: 'Powernutzer' },
            { threshold: 500, labelEn: 'Item Addict', labelDE: 'Item-Süchtiger' },
        ]
    },

    // ── CURSED ITEMS USED ────────────────────────
    {
        id: 'cursed_items_used',
        category: 'items',
        icon: '☠️',
        nameEn: 'Cursed',
        nameDE: 'Verflucht',
        descEn: 'Use cursed items.',
        descDE: 'Nutze verfluchte Items.',
        stat: 'cursedItemsUsed',
        tiers: [
            { threshold: 10, labelEn: 'Tempted', labelDE: 'Versucht' },
            { threshold: 50, labelEn: 'Risk Taker', labelDE: 'Draufgänger' },
            { threshold: 100, labelEn: 'Demonologist', labelDE: 'Dämonologe' },
            { threshold: 150, labelEn: 'Pact of Darkness', labelDE: 'Pakt der Dunkelheit' },
        ]
    },

    // ── SHIELD ITEMS USED ────────────────────────
    {
        id: 'shields_used',
        category: 'items',
        icon: '🛡️',
        nameEn: 'Guardian',
        nameDE: 'Wächter',
        descEn: 'Use Shield items to block mistakes.',
        descDE: 'Nutze Schild-Items um Fehler abzublocken.',
        stat: 'shieldsUsed',
        tiers: [
            { threshold: 5, labelEn: 'Shielded', labelDE: 'Abgeschirmt' },
            { threshold: 25, labelEn: 'Fortified', labelDE: 'Befestigt' },
            { threshold: 50, labelEn: 'Impenetrable', labelDE: 'Undurchdringlich' },
        ]
    },

    // ── ROW / COL SOLVE ITEMS USED ───────────────
    {
        id: 'rowcol_solved',
        category: 'items',
        icon: '📐',
        nameEn: 'Line Reader',
        nameDE: 'Zeilenleser',
        descEn: 'Use row-solve or column-solve items.',
        descDE: 'Nutze Zeilen- oder Spalten-Löse-Items.',
        stat: 'rowColSolved',
        tiers: [
            { threshold: 10, labelEn: 'Shortcut Taker', labelDE: 'Abkürzer' },
            { threshold: 35, labelEn: 'Line Breaker', labelDE: 'Zeilenbrecher' },
            { threshold: 75, labelEn: 'Grid Surgeon', labelDE: 'Gitter-Chirurg' },
        ]
    },

    // ── TIME ADDED THROUGH ITEMS / SKILLS ────────
    {
        id: 'time_added',
        category: 'time',
        icon: '⏳',
        nameEn: 'Time Lord',
        nameDE: 'Zeitherr',
        descEn: 'Add seconds to the timer using items or class skills.',
        descDE: 'Füge dem Timer Sekunden durch Items oder Fähigkeiten hinzu.',
        stat: 'timeAdded',  // in seconds
        tiers: [
            { threshold: 600, labelEn: 'Extra Minutes', labelDE: 'Extra Minuten' },
            { threshold: 2500, labelEn: 'Time Stretcher', labelDE: 'Zeitstrecker' },
            { threshold: 5000, labelEn: 'Quarter-Hour', labelDE: 'Viertelstunde' },
            { threshold: 10000, labelEn: 'Chronomancer', labelDE: 'Chronomant' },
        ]
    },

    // ── HARD DIFFICULTY LEVELS COMPLETED ─────────
    {
        id: 'hard_levels',
        category: 'difficulty',
        icon: '🔥',
        nameEn: 'Hard Boiled',
        nameDE: 'Hartgekocht',
        descEn: 'Complete levels on Hard difficulty.',
        descDE: 'Schließe Level auf Schwer ab.',
        stat: 'hardLevels',
        tiers: [
            { threshold: 5, labelEn: 'Hard Starter', labelDE: 'Schwer-Einsteiger' },
            { threshold: 15, labelEn: 'Hard Gainer', labelDE: 'Schwer-Aufsteiger' },
            { threshold: 30, labelEn: 'Masochist', labelDE: 'Masochist' },
            { threshold: 45, labelEn: 'Glutton for Pain', labelDE: 'Schmerzenssucher' },
        ]
    },

    // ── HARDCORE MODE LEVELS COMPLETED ───────────
    {
        id: 'hardcore_levels',
        category: 'difficulty',
        icon: '💀',
        nameEn: 'No Second Chances',
        nameDE: 'Keine zweite Chance',
        descEn: 'Complete levels in Hardcore mode.',
        descDE: 'Schließe Level im Hardcore-Modus ab.',
        stat: 'hardcoreLevels',
        tiers: [
            { threshold: 5, labelEn: 'Daredevil', labelDE: 'Draufgänger' },
            { threshold: 25, labelEn: 'Fearless', labelDE: 'Furchtlos' },
            { threshold: 45, labelEn: 'Immortal', labelDE: 'Unsterblich' },
        ]
    },

    // ── TIME TRIAL LEVELS COMPLETED ──────────────
    {
        id: 'timetrial_levels',
        category: 'difficulty',
        icon: '⚡',
        nameEn: 'Speed Runner',
        nameDE: 'Speed Runner',
        descEn: 'Complete levels in Time Trial mode.',
        descDE: 'Schließe Level im Time Trial Modus ab.',
        stat: 'timeTrialLevels',
        tiers: [
            { threshold: 5, labelEn: 'Against the Clock', labelDE: 'Gegen die Uhr' },
            { threshold: 25, labelEn: 'Quick Fingers', labelDE: 'Schnelle Finger' },
            { threshold: 45, labelEn: 'Lightning Solver', labelDE: 'Blitz-Löser' },
        ]
    },

    // ── CLASS: LEVELS AS MATHMAGICIAN ────────────
    {
        id: 'class_mathmagician',
        category: 'class',
        icon: '🔮',
        nameEn: 'Mathmagician\'s Path',
        nameDE: 'Weg des Mathemagiers',
        descEn: 'Complete levels while playing as the Mathmagician class.',
        descDE: 'Schließe Level als Mathemagier ab.',
        stat: 'levelsAsMathmagician',
        tiers: [
            { threshold: 5, labelEn: 'Apprentice Mage', labelDE: 'Lehrlings-Magier' },
            { threshold: 15, labelEn: 'Arcane Student', labelDE: 'Arkaner Schüler' },
            { threshold: 30, labelEn: 'Spellweaver', labelDE: 'Zauberwirker' },
            { threshold: 45, labelEn: 'Grand Mathmagician', labelDE: 'Großer Mathemagier' },
        ]
    },

    // ── CLASS: LEVELS AS STATISTICIAN ────────────
    {
        id: 'class_statistician',
        category: 'class',
        icon: '⚔️',
        nameEn: 'Statistician\'s Path',
        nameDE: 'Weg des Statistikers',
        descEn: 'Complete levels while playing as the Statistician class.',
        descDE: 'Schließe Level als Statistiker ab.',
        stat: 'levelsAsStatistician',
        tiers: [
            { threshold: 5, labelEn: 'Data Recruit', labelDE: 'Daten-Rekrut' },
            { threshold: 15, labelEn: 'Sample Warrior', labelDE: 'Stichproben-Krieger' },
            { threshold: 30, labelEn: 'Distribution Knight', labelDE: 'Verteilungsritter' },
            { threshold: 45, labelEn: 'Grand Statistician', labelDE: 'Großer Statistiker' },
        ]
    },

    // ── CLASS: LEVELS AS PROBABILIST ─────────────
    {
        id: 'class_probabilist',
        category: 'class',
        icon: '🎯',
        nameEn: 'Probabilist\'s Path',
        nameDE: 'Weg des Probabilisten',
        descEn: 'Complete levels while playing as the Probabilist class.',
        descDE: 'Schließe Level als Probabilist ab.',
        stat: 'levelsAsProbabilist',
        tiers: [
            { threshold: 5, labelEn: 'Probability Novice', labelDE: 'Wahrscheinlichkeits-Novize' },
            { threshold: 15, labelEn: 'Bayesian Scout', labelDE: 'Bayesianischer Scout' },
            { threshold: 30, labelEn: 'Field Ranger', labelDE: 'Feld-Ranger' },
            { threshold: 45, labelEn: 'Grand Probabilist', labelDE: 'Großer Probabilist' },
        ]
    },

    // ── CLASS SKILL: ARCANE REVEAL USED ──────────
    {
        id: 'skill_arcane_reveal',
        category: 'class',
        icon: '✨',
        nameEn: 'Arcane Revealer',
        nameDE: 'Arkaner Enthüller',
        descEn: 'Use the Arcane Reveal class skill.',
        descDE: 'Nutze die Arkane-Enthüllung-Fähigkeit.',
        stat: 'skillArcaneRevealUsed',
        tiers: [
            { threshold: 10, labelEn: 'First Reveals', labelDE: 'Erste Enthüllungen' },
            { threshold: 50, labelEn: 'Seer', labelDE: 'Seher' },
            { threshold: 100, labelEn: 'All is Known', labelDE: 'Alles ist bekannt' },
        ]
    },

    // ── CLASS SKILL: ABSOLUTE ZERO USED ──────────
    {
        id: 'skill_absolute_zero',
        category: 'class',
        icon: '❄️',
        nameEn: 'Frozen Moment',
        nameDE: 'Gefrorener Moment',
        descEn: 'Use the Absolute Zero class skill.',
        descDE: 'Nutze die Absoluter-Nullpunkt-Fähigkeit.',
        stat: 'skillAbsoluteZeroUsed',
        tiers: [
            { threshold: 10, labelEn: 'First Freeze', labelDE: 'Erstes Einfrieren' },
            { threshold: 50, labelEn: 'Cryomancer', labelDE: 'Kryomant' },
            { threshold: 100, labelEn: 'Permafrost', labelDE: 'Permafrost' },
        ]
    },

    // ── CLASS SKILL: DATA STRIKE USED ────────────
    {
        id: 'skill_data_strike',
        category: 'class',
        icon: '⚔️',
        nameEn: 'Data Striker',
        nameDE: 'Datenhauer',
        descEn: 'Use the Data Strike class skill.',
        descDE: 'Nutze die Datenhieb-Fähigkeit.',
        stat: 'skillDataStrikeUsed',
        tiers: [
            { threshold: 10, labelEn: 'First Strike', labelDE: 'Erster Hieb' },
            { threshold: 50, labelEn: 'Assault Mode', labelDE: 'Angriffsmodus' },
            { threshold: 100, labelEn: 'Data Berserker', labelDE: 'Daten-Berserker' },
        ]
    },

    // ── CLASS SKILL: DIAGONAL STRIKE USED ────────
    {
        id: 'skill_diagonal_strike',
        category: 'class',
        icon: '✂️',
        nameEn: 'Diagonal Cutter',
        nameDE: 'Diagonal-Schneider',
        descEn: 'Use the Diagonal Strike class skill.',
        descDE: 'Nutze die Diagonalschlag-Fähigkeit.',
        stat: 'skillDiagonalStrikeUsed',
        tiers: [
            { threshold: 10, labelEn: 'Cross-Cutter', labelDE: 'Kreuzschneider' },
            { threshold: 50, labelEn: 'Slash Artist', labelDE: 'Schnitt-Künstler' },
            { threshold: 100, labelEn: 'X-Factor', labelDE: 'X-Faktor' },
        ]
    },

    // ── CLASS SKILL: PRECISION MARK USED ─────────
    {
        id: 'skill_precision_mark',
        category: 'class',
        icon: '🎯',
        nameEn: 'Precision Striker',
        nameDE: 'Präzisionsmarkierer',
        descEn: 'Use the Precision Mark class skill.',
        descDE: 'Nutze die Präzisionsmarkierung-Fähigkeit.',
        stat: 'skillPrecisionMarkUsed',
        tiers: [
            { threshold: 10, labelEn: 'Marked', labelDE: 'Markiert' },
            { threshold: 50, labelEn: 'Sharpshooter', labelDE: 'Scharfschütze' },
            { threshold: 100, labelEn: 'Dead Eye', labelDE: 'Scharfes Auge' },
        ]
    },

    // ── CLASS SKILL: FIELD SCAN USED ─────────────
    {
        id: 'skill_field_scan',
        category: 'class',
        icon: '📡',
        nameEn: 'Scanner',
        nameDE: 'Scanner',
        descEn: 'Use the Field Scan class skill.',
        descDE: 'Nutze die Feldscan-Fähigkeit.',
        stat: 'skillFieldScanUsed',
        tiers: [
            { threshold: 10, labelEn: 'Radar Ping', labelDE: 'Radar-Ping' },
            { threshold: 50, labelEn: 'Sonar Expert', labelDE: 'Sonar-Experte' },
            { threshold: 100, labelEn: 'Full Sweep', labelDE: 'Vollständiger Scan' },
        ]
    },

    // ── FREE MISTAKES ABSORBED (Mathmagician passive) ─
    {
        id: 'mistakes_absorbed',
        category: 'class',
        icon: '🌀',
        nameEn: 'Variance Shield',
        nameDE: 'Varianzschild',
        descEn: 'Have mistakes absorbed by the Variance Shield passive.',
        descDE: 'Lass Fehler vom Varianzschild absorbieren.',
        stat: 'mistakesAbsorbed',
        tiers: [
            { threshold: 10, labelEn: 'Cushioned', labelDE: 'Abgepuffert' },
            { threshold: 50, labelEn: 'Protected', labelDE: 'Geschützt' },
            { threshold: 100, labelEn: 'Teflon', labelDE: 'Teflon' },
        ]
    },

    // ── MOMENTUM BONUS TRIGGERED (Statistician) ───
    {
        id: 'momentum_triggered',
        category: 'class',
        icon: '💨',
        nameEn: 'On a Roll',
        nameDE: 'Im Schwung',
        descEn: 'Trigger the Momentum time bonus streak.',
        descDE: 'Löse den Momentum-Zeitbonus aus.',
        stat: 'momentumTriggered',
        tiers: [
            { threshold: 10, labelEn: 'Snowball', labelDE: 'Schneeball' },
            { threshold: 50, labelEn: 'Avalanche', labelDE: 'Lawine' },
            { threshold: 100, labelEn: 'Perpetual Motion', labelDE: 'Perpetuum Mobile' },
        ]
    },

    // ── ARTIFACT (CODEX) USED ────────────────────
    {
        id: 'artifact_used',
        category: 'meta',
        icon: '🌟',
        nameEn: 'Divine Intervention',
        nameDE: 'Göttliche Intervention',
        descEn: 'Use the Codex of Completion artifact to instantly solve a puzzle.',
        descDE: 'Nutze den Kodex der Fertigstellung um ein Rätsel sofort zu lösen.',
        stat: 'artifactUsed',
        tiers: [
            { threshold: 1, labelEn: 'Miracle Worker', labelDE: 'Wundertäter' },
            { threshold: 3, labelEn: 'Godlike', labelDE: 'Gottgleich' },
        ]
    },

    // ── TOTAL SCORE ──────────────────────────────
    {
        id: 'total_score',
        category: 'score',
        icon: '💰',
        nameEn: 'High Scorer',
        nameDE: 'Punktesammler',
        descEn: 'Accumulate total score across all playthroughs.',
        descDE: 'Sammle Gesamtpunkte über alle Spielläufe.',
        stat: 'totalScoreEarned',
        tiers: [
            { threshold: 1000, labelEn: 'Thousand Points', labelDE: 'Tausend Punkte' },
            { threshold: 10000, labelEn: 'Ten Thousand', labelDE: 'Zehntausend' },
            { threshold: 50000, labelEn: 'Fifty Grand', labelDE: 'Fünfzigtausend' },
            { threshold: 100000, labelEn: 'Century', labelDE: 'Jahrhundert' },
        ]
    },

    // ── WORLD 1 ALL LEVELS COMPLETED ─────────────
    {
        id: 'world1_complete',
        category: 'completion',
        icon: '🌍',
        nameEn: 'World 1 Complete',
        nameDE: 'Welt 1 Abgeschlossen',
        descEn: 'Complete all levels in World 1.',
        descDE: 'Schließe alle Level in Welt 1 ab.',
        stat: 'world1Complete',
        tiers: [
            { threshold: 1, labelEn: 'Probability Pioneer', labelDE: 'Wahrscheinlichkeits-Pionier' },
        ]
    },
    {
        id: 'world2_complete',
        category: 'completion',
        icon: '🌍',
        nameEn: 'World 2 Complete',
        nameDE: 'Welt 2 Abgeschlossen',
        descEn: 'Complete all levels in World 2.',
        descDE: 'Schließe alle Level in Welt 2 ab.',
        stat: 'world2Complete',
        tiers: [
            { threshold: 1, labelEn: 'Combinatorics Conqueror', labelDE: 'Kombinatorik-Bezwinger' },
        ]
    },
    {
        id: 'world3_complete',
        category: 'completion',
        icon: '🌍',
        nameEn: 'World 3 Complete',
        nameDE: 'Welt 3 Abgeschlossen',
        descEn: 'Complete all levels in World 3.',
        descDE: 'Schließe alle Level in Welt 3 ab.',
        stat: 'world3Complete',
        tiers: [
            { threshold: 1, labelEn: 'Random Variable Ranger', labelDE: 'Zufallsvariablen-Ranger' },
        ]
    },
    {
        id: 'world4_complete',
        category: 'completion',
        icon: '🌍',
        nameEn: 'World 4 Complete',
        nameDE: 'Welt 4 Abgeschlossen',
        descEn: 'Complete all levels in World 4.',
        descDE: 'Schließe alle Level in Welt 4 ab.',
        stat: 'world4Complete',
        tiers: [
            { threshold: 1, labelEn: 'Expected Value Expert', labelDE: 'Erwartungswert-Experte' },
        ]
    },

       {
        id: 'world5_complete',
        category: 'completion',
        icon: '🌍',
        nameEn: 'World 5 Complete',
        nameDE: 'Welt 5 Abgeschlossen',
        descEn: 'Complete all levels in World 5.',
        descDE: 'Schließe alle Level in Welt 5 ab.',
        stat: 'world5Complete',
        tiers: [
            { threshold: 1, labelEn: 'Distribution Expert', labelDE: 'Verteilungs-Experte' },
        ]
    }, 

    // ── PRIMER CORRECT ───────────────────────────
    {
        id: 'primer_correct',
        category: 'quiz',
        icon: '📜',
        nameEn: 'Scout\'s Honor',
        nameDE: 'Pfadfinder-Ehre',
        descEn: 'Answer a Scout\'s Primer question correctly to earn a headstart.',
        descDE: 'Beantworte eine Pfadfinder-Kompass-Frage richtig.',
        stat: 'primerCorrect',
        tiers: [
            { threshold: 5, labelEn: 'Prepared', labelDE: 'Vorbereitet' },
            { threshold: 25, labelEn: 'Always Ready', labelDE: 'Immer bereit' },
            { threshold: 50, labelEn: 'Eagle Scout', labelDE: 'Adlerpfadfinder' },
        ]
    },

    // ── CLASS UPGRADES APPLIED ───────────────────
    {
        id: 'class_upgrades',
        category: 'meta',
        icon: '⬆️',
        nameEn: 'Power Up',
        nameDE: 'Stärker werden',
        descEn: 'Apply class ability upgrades by completing Ascension levels.',
        descDE: 'Wende Klassenverbesserungen durch Aufstiegs-Level an.',
        stat: 'classUpgradesApplied',
        tiers: [
            { threshold: 1, labelEn: 'Rank Up', labelDE: 'Aufgestiegen' },
            { threshold: 3, labelEn: 'Power Surge', labelDE: 'Energiestoß' },
            { threshold: 6, labelEn: 'Fully Upgraded', labelDE: 'Voll ausgerüstet' },
        ]
    },

    // ── TOTAL CELLS FILLED CORRECTLY ─────────────
    {
        id: 'cells_filled',
        category: 'grid',
        icon: '🔲',
        nameEn: 'Cell Filler',
        nameDE: 'Zellen-Füllen',
        descEn: 'Fill correct cells in puzzles.',
        descDE: 'Fülle richtige Zellen im Puzzle.',
        stat: 'cellsFilled',
        tiers: [
            { threshold: 100, labelEn: 'First Hundred', labelDE: 'Erste Hundert' },
            { threshold: 500, labelEn: 'Builder', labelDE: 'Erbauer' },
            { threshold: 2000, labelEn: 'Architect', labelDE: 'Architekt' },
            { threshold: 10000, labelEn: 'Master Builder', labelDE: 'Meister-Erbauer' },
        ]
    },

    // ── DIFFERENT WORLDS PLAYED ───────────────────
    {
        id: 'worlds_played',
        category: 'completion',
        icon: '🗺️',
        nameEn: 'Explorer',
        nameDE: 'Entdecker',
        descEn: 'Complete at least one level in different worlds.',
        descDE: 'Schließe mindestens ein Level in verschiedenen Welten ab.',
        stat: 'worldsPlayed',
        tiers: [
            { threshold: 1, labelEn: 'First World', labelDE: 'Erste Welt' },
            { threshold: 2, labelEn: 'Explorer', labelDE: 'Entdecker' },
            { threshold: 3, labelEn: 'Adventurer', labelDE: 'Abenteurer' },
            { threshold: 4, labelEn: 'World Traveller', labelDE: 'Weltreisender' },
        ]
    },

    // ════════════════════════════════════════════════
    //  NEW ACHIEVEMENTS
    // ════════════════════════════════════════════════

    // ── SPEED / TIME ─────────────────────────────
    {
        id: 'clutch_win',
        category: 'time',
        icon: '⏰',
        nameEn: 'Clutch',
        nameDE: 'Auf den letzten Drücker',
        descEn: 'Win a level with 10 seconds or less remaining on the clock.',
        descDE: 'Gewinne ein Level mit 10 oder weniger Sekunden auf der Uhr.',
        stat: 'clutchWins',
        tiers: [
            { threshold: 1,  labelEn: 'Photo Finish',    labelDE: 'Fotofinish' },
            { threshold: 5,  labelEn: 'Last Second Hero', labelDE: 'Held in letzter Sekunde' },
            { threshold: 15, labelEn: 'Adrenaline Junkie', labelDE: 'Adrenalinjunkie' },
        ]
    },
    {
        id: 'fast_clear',
        category: 'time',
        icon: '⚡',
        nameEn: 'Lightning Clear',
        nameDE: 'Blitzlösung',
        descEn: 'Complete a level in under 30 seconds.',
        descDE: 'Schließe ein Level in unter 30 Sekunden ab.',
        stat: 'fastClears',
        tiers: [
            { threshold: 10,  labelEn: 'Speed Demon',    labelDE: 'Speedläufer' },
            { threshold: 50,  labelEn: 'Blink and Miss', labelDE: 'Im Nu vorbei' },
            { threshold: 150, labelEn: 'Flash Solver',   labelDE: 'Blitzlöser' },
        ]
    },
    {
        id: 'big_time_left',
        category: 'time',
        icon: '🕰️',
        nameEn: 'Time to Spare',
        nameDE: 'Noch Zeit übrig',
        descEn: 'Win a level with 5 or more minutes still on the clock.',
        descDE: 'Gewinne ein Level mit noch 5 oder mehr Minuten auf der Uhr.',
        stat: 'bigTimeLeftWins',
        tiers: [
            { threshold: 50,  labelEn: 'Early Bird',    labelDE: 'Frühaufsteher' },
            { threshold: 100,  labelEn: 'Ahead of Time', labelDE: 'Zeitvorsprung' },
            { threshold: 200, labelEn: 'No Sweat',      labelDE: 'Kein Problem' },
        ]
    },
    {
        id: 'freeze_clutch',
        category: 'time',
        icon: '🧊',
        nameEn: 'Frozen Clutch',
        nameDE: 'Eiskalte Rettung',
        descEn: 'Use a Time Freeze item while at 10 seconds or less on the clock.',
        descDE: 'Nutze ein Zeitfrieren-Item mit höchstens 10 Sekunden auf der Uhr.',
        stat: 'freezeClutches',
        tiers: [
            { threshold: 5,  labelEn: 'Ice Cold',       labelDE: 'Eiskalt' },
            { threshold: 15,  labelEn: 'Cryogenic',      labelDE: 'Kryogenisch' },
            { threshold: 30, labelEn: 'Absolute Zero',  labelDE: 'Absoluter Nullpunkt' },
        ]
    },

    // ── MISTAKE / COMEBACK ────────────────────────
    {
        id: 'comeback_win',
        category: 'mistakes',
        icon: '🔥',
        nameEn: 'Comeback King',
        nameDE: 'Comeback-König',
        descEn: 'Win a level despite making 3 or more mistakes.',
        descDE: 'Gewinne ein Level trotz 3 oder mehr Fehlern.',
        stat: 'comebackWins',
        tiers: [
            { threshold: 10,  labelEn: 'Never Give Up', labelDE: 'Niemals aufgeben' },
            { threshold: 50, labelEn: 'Resilient',     labelDE: 'Belastbar' },
            { threshold: 100, labelEn: 'Unbreakable',   labelDE: 'Unzerstörbar' },
        ]
    },
    {
        id: 'penalty_clutch',
        category: 'mistakes',
        icon: '💸',
        nameEn: 'Penalty Survivor',
        nameDE: 'Strafen-Überleber',
        descEn: 'Have a penalty drop your timer below 60 seconds and still win the level.',
        descDE: 'Lass eine Strafe deinen Timer unter 60 Sekunden fallen und gewinne trotzdem.',
        stat: 'penaltyClutwins',
        tiers: [
            { threshold: 5,  labelEn: 'Lucky Escape',    labelDE: 'Glückliche Flucht' },
            { threshold: 15,  labelEn: 'Danger Zone Pro', labelDE: 'Profi der Gefahrenzone' },
            { threshold: 30, labelEn: 'Indestructible',  labelDE: 'Unzerstörbar' },
        ]
    },
    {
        id: 'bounceback',
        category: 'mistakes',
        icon: '🏀',
        nameEn: 'Bounceback',
        nameDE: 'Zurückschlagen',
        descEn: 'Immediately replay and win a level you just failed.',
        descDE: 'Wiederhole und gewinne sofort ein Level, das du gerade verloren hast.',
        stat: 'bouncebackWins',
        tiers: [
            { threshold: 5,  labelEn: 'Back on Track',  labelDE: 'Wieder auf Kurs' },
            { threshold: 15,  labelEn: 'Determined',     labelDE: 'Entschlossen' },
            { threshold: 30, labelEn: 'Relentless',     labelDE: 'Unerbittlich' },
        ]
    },
    {
        id: 'world_no_mistake',
        category: 'mistakes',
        icon: '🌟',
        nameEn: 'Flawless World',
        nameDE: 'Fehlerfreie Welt',
        descEn: 'Complete all levels of an entire world without making a single mistake across them.',
        descDE: 'Schließe alle Level einer Welt ab, ohne einen einzigen Fehler über alle Level zu machen.',
        stat: 'flawlessWorlds',
        tiers: [
            { threshold: 1, labelEn: 'Perfect World',     labelDE: 'Perfekte Welt' },
            { threshold: 3, labelEn: 'Double Perfection',  labelDE: 'Doppelte Perfektion' },
            { threshold: 5, labelEn: 'Transcendent',       labelDE: 'Transzendent' },
        ]
    },

    // ── ITEMS / INVENTORY ─────────────────────────
    {
        id: 'item_hoarder',
        category: 'items',
        icon: '📦',
        nameEn: 'Hoarder',
        nameDE: 'Hamsterer',
        descEn: 'Have 10 or more items in your inventory at the same time.',
        descDE: 'Habe 10 oder mehr Items gleichzeitig in deinem Inventar.',
        stat: 'maxInventoryReached',
        tiers: [
            { threshold: 5,  labelEn: 'Pack Rat',    labelDE: 'Messi' },
            { threshold: 15,  labelEn: 'Stockpiler',  labelDE: 'Vorrätesammler' },
            { threshold: 30,  labelEn: 'Warehouse',   labelDE: 'Lagerhaus' },
        ]
    },
    {
        id: 'three_items_level',
        category: 'items',
        icon: '🎒',
        nameEn: 'Item Spree',
        nameDE: 'Item-Kaufrausch',
        descEn: 'Use 3 or more items in a single level.',
        descDE: 'Nutze 3 oder mehr Items in einem einzigen Level.',
        stat: 'threeItemsOneLevelCount',
        tiers: [
            { threshold: 20,  labelEn: 'Spendthrift',   labelDE: 'Verschwender' },
            { threshold: 50,  labelEn: 'Power Shopper', labelDE: 'Power-Shopper' },
            { threshold: 100, labelEn: 'Item Addict',   labelDE: 'Item-Süchtig' },
        ]
    },
    {
        id: 'cursed_first',
        category: 'items',
        icon: '💀',
        nameEn: 'Reckless',
        nameDE: 'Draufgänger',
        descEn: 'Use a cursed item on your very first attempt at a level.',
        descDE: 'Nutze ein verfluchtes Item beim allerersten Versuch eines Levels.',
        stat: 'cursedFirstAttempts',
        tiers: [
            { threshold: 1,  labelEn: 'Risk Taker',  labelDE: 'Risikobereiter' },
            { threshold: 5,  labelEn: 'Daredevil',   labelDE: 'Draufgänger' },
            { threshold: 15, labelEn: 'Chaos Agent', labelDE: 'Chaos-Agent' },
        ]
    },
    {
        id: 'merchant',
        category: 'items',
        icon: '💰',
        nameEn: 'Merchant',
        nameDE: 'Händler',
        descEn: 'Sell items from your inventory.',
        descDE: 'Verkaufe Items aus deinem Inventar.',
        stat: 'itemsSold',
        tiers: [
            { threshold: 5,   labelEn: 'Bargain Hunter', labelDE: 'Schnäppchenjäger' },
            { threshold: 20,  labelEn: 'Trader',         labelDE: 'Händler' },
            { threshold: 50,  labelEn: 'Merchant',       labelDE: 'Kaufmann' },
            { threshold: 100, labelEn: 'Tycoon',         labelDE: 'Tycoon' },
        ]
    },
    {
        id: 'collector',
        category: 'items',
        icon: '🎨',
        nameEn: 'Collector',
        nameDE: 'Sammler',
        descEn: 'Own at least one item of every rarity tier at the same time.',
        descDE: 'Besitze gleichzeitig mindestens ein Item jeder Seltenheitsstufe.',
        stat: 'collectorAllRarities',
        tiers: [
            { threshold: 10, labelEn: 'Full Collection', labelDE: 'Vollständige Sammlung' },
            { threshold: 50, labelEn: 'Curator',         labelDE: 'Kurator' },
            { threshold: 100, labelEn: 'Connoisseur',     labelDE: 'Kenner' },
        ]
    },

    // ── SCORE ─────────────────────────────────────
    {
        id: 'high_score_level',
        category: 'score',
        icon: '🏅',
        nameEn: 'High Scorer',
        nameDE: 'Punkterekord',
        descEn: 'Earn 500 or more points on a single level.',
        descDE: 'Verdiene 500 oder mehr Punkte in einem einzigen Level.',
        stat: 'highScoreLevels',
        tiers: [
            { threshold: 10,  labelEn: 'Big Points',    labelDE: 'Viele Punkte' },
            { threshold: 30,  labelEn: 'Point Machine', labelDE: 'Punktemaschine' },
            { threshold: 50, labelEn: 'Overachiever',  labelDE: 'Überflieger' },
        ]
    },
    {
        id: 'personal_best',
        category: 'score',
        icon: '📈',
        nameEn: 'Personal Best',
        nameDE: 'Persönlicher Rekord',
        descEn: 'Beat your own high score on a level you have completed before.',
        descDE: 'Übertreffe deinen eigenen Rekord in einem bereits abgeschlossenen Level.',
        stat: 'personalBestsBroken',
        tiers: [
            { threshold: 10,  labelEn: 'New Record',    labelDE: 'Neuer Rekord' },
            { threshold: 30, labelEn: 'Record Breaker', labelDE: 'Rekordbrechter' },
            { threshold: 50, labelEn: 'Self-Improver', labelDE: 'Selbstoptimierer' },
        ]
    },
    {
        id: 'high_multiplier',
        category: 'score',
        icon: '✖️',
        nameEn: 'Multiplier Master',
        nameDE: 'Multiplikator-Meister',
        descEn: 'Complete a level with a score multiplier of 2.0× or higher.',
        descDE: 'Schließe ein Level mit einem Punktemultiplikator von 2,0× oder mehr ab.',
        stat: 'highMultiplierWins',
        tiers: [
            { threshold: 10,  labelEn: 'Double Trouble', labelDE: 'Doppelter Ertrag' },
            { threshold: 30,  labelEn: 'Stacked',        labelDE: 'Gestapelt' },
            { threshold: 50, labelEn: 'Max Power',      labelDE: 'Volle Kraft' },
        ]
    },

    // ── PUZZLE SIZE / GRID ────────────────────────
    {
        id: 'large_grid',
        category: 'grid',
        icon: '🗺️',
        nameEn: 'Big Picture',
        nameDE: 'Großes Bild',
        descEn: 'Complete a puzzle with 400 or more cells.',
        descDE: 'Schließe ein Puzzle mit 400 oder mehr Zellen ab.',
        stat: 'largeGridClears',
        tiers: [
            { threshold: 10,  labelEn: 'Ambitious',    labelDE: 'Ehrgeizig' },
            { threshold: 30,  labelEn: 'Grid Walker',  labelDE: 'Gitter-Wanderer' },
            { threshold: 50, labelEn: 'Colossus',     labelDE: 'Koloss' },
        ]
    },
    {
        id: 'small_perfect',
        category: 'grid',
        icon: '🎯',
        nameEn: 'Tiny Perfection',
        nameDE: 'Kleine Perfektion',
        descEn: 'Complete a 5×5 puzzle with 0 mistakes and 0 items used.',
        descDE: 'Schließe ein 5×5-Puzzle ohne Fehler und ohne Items ab.',
        stat: 'smallPerfectClears',
        tiers: [
            { threshold: 10,  labelEn: 'Perfect Starter', labelDE: 'Perfekter Start' },
            { threshold: 30,  labelEn: 'Mini Master',     labelDE: 'Mini-Meister' },
            { threshold: 50, labelEn: 'Pure and Simple', labelDE: 'Schlicht und einfach' },
        ]
    },
    {
        id: 'dense_grid',
        category: 'grid',
        icon: '⬛',
        nameEn: 'Dense Grid',
        nameDE: 'Dichtes Gitter',
        descEn: 'Complete a level where more than half the cells need to be filled.',
        descDE: 'Schließe ein Level ab, bei dem mehr als die Hälfte der Zellen gefüllt werden muss.',
        stat: 'denseGridClears',
        tiers: [
            { threshold: 10,  labelEn: 'Packed',       labelDE: 'Vollgepackt' },
            { threshold: 30,  labelEn: 'Dense',        labelDE: 'Dicht' },
            { threshold: 50, labelEn: 'Solid Block',  labelDE: 'Massiv' },
        ]
    },

    // ── META / QUIRKY ─────────────────────────────
    {
        id: 'level_replayed',
        category: 'meta',
        icon: '🔁',
        nameEn: 'Persistent',
        nameDE: 'Beharrlich',
        descEn: 'Replay the same level multiple times.',
        descDE: 'Wiederhole dasselbe Level mehrfach.',
        stat: 'levelsReplayed',
        tiers: [
            { threshold: 5,  labelEn: 'Try Again',    labelDE: 'Nochmal versuchen' },
            { threshold: 20, labelEn: 'Stubborn',     labelDE: 'Stur' },
            { threshold: 50, labelEn: 'Obsessed',     labelDE: 'Besessen' },
        ]
    },
    {
        id: 'gate_rejected',
        category: 'quiz',
        icon: '🚫',
        nameEn: 'Stubborn Student',
        nameDE: 'Sturrer Schüler',
        descEn: 'Get rejected by a Math Gate 3 or more times before passing.',
        descDE: 'Werde 3 oder mehr Mal vom Mathe-Tor abgewiesen, bevor du es passierst.',
        stat: 'gateRejections',
        tiers: [
            { threshold: 5,  labelEn: 'Wrong Answer', labelDE: 'Falsche Antwort' },
            { threshold: 15, labelEn: 'Persistent',   labelDE: 'Ausdauernd' },
            { threshold: 30, labelEn: 'Never Gives Up', labelDE: 'Gibt nie auf' },
        ]
    },
    {
        id: 'primer_solved_all',
        category: 'quiz',
        icon: '🎁',
        nameEn: 'Lucky Start',
        nameDE: 'Glücklicher Start',
        descEn: "Have the Scout's Primer headstart solve the entire puzzle for you.",
        descDE: 'Lass den Pfadfinder-Kompass-Vorsprung das gesamte Puzzle für dich lösen.',
        stat: 'primerSolvedAll',
        tiers: [
            { threshold: 1, labelEn: 'Blessed',      labelDE: 'Gesegnet' },
            { threshold: 3, labelEn: 'Fortune Favours', labelDE: 'Glück begünstigt' },
        ]
    },
    {
        id: 'world_all_bonus',
        category: 'meta',
        icon: '🏆',
        nameEn: 'Completionist',
        nameDE: 'Perfektionist',
        descEn: 'Claim all bonus objectives in an entire world.',
        descDE: 'Erfülle alle Bonusziele in einer gesamten Welt.',
        stat: 'worldAllBonusClaimed',
        tiers: [
            { threshold: 1, labelEn: 'World Champion',    labelDE: 'Weltmeister' },
            { threshold: 3, labelEn: 'Double Champion',   labelDE: 'Doppelweltmeister' },
            { threshold: 5, labelEn: 'Grand Completionist', labelDE: 'Groß-Perfektionist' },
        ]
    },

    // ── CLASS-SPECIFIC FLAVOUR ────────────────────
    {
        id: 'mathmagician_absorb_level',
        category: 'class',
        icon: '🔮',
        nameEn: 'Variance Fortress',
        nameDE: 'Varianz-Festung',
        descEn: 'As Mathmagician, absorb 3 or more mistakes with Variance Shield in a single level.',
        descDE: 'Als Mathemagier: Absorbiere 3 oder mehr Fehler mit dem Varianzschild in einem Level.',
        stat: 'mathmagician3AbsorbOneLevel',
        tiers: [
            { threshold: 1,  labelEn: 'Shielded Master',  labelDE: 'Schild-Meister' },
            { threshold: 5,  labelEn: 'Fortress',         labelDE: 'Festung' },
            { threshold: 10, labelEn: 'Untouchable Mage', labelDE: 'Unberührbarer Magier' },
        ]
    },
    {
        id: 'statistician_momentum_level',
        category: 'class',
        icon: '⚔️',
        nameEn: 'Momentum Machine',
        nameDE: 'Schwung-Maschine',
        descEn: 'As Statistician, trigger Momentum 3 or more times in a single level.',
        descDE: 'Als Statistiker: Löse Schwung 3 oder mehr Mal in einem Level aus.',
        stat: 'statistician3MomentumOneLevel',
        tiers: [
            { threshold: 10,  labelEn: 'On a Roll',        labelDE: 'Im Schwung' },
            { threshold: 50,  labelEn: 'Unstoppable',      labelDE: 'Unaufhaltbar' },
            { threshold: 100, labelEn: 'Perpetual Motion', labelDE: 'Perpetuum Mobile' },
        ]
    },
    {
        id: 'probabilist_big_scan',
        category: 'class',
        icon: '🎯',
        nameEn: 'Eagle Eye',
        nameDE: 'Adlerauge',
        descEn: 'As Probabilist, have a single Field Scan reveal 20 or more correct cells.',
        descDE: 'Als Probabilist: Enthülle mit einem einzigen Feldscan 20 oder mehr richtige Zellen.',
        stat: 'probabilistBigScan',
        tiers: [
            { threshold: 5,  labelEn: 'Sharp Vision',  labelDE: 'Scharfe Sicht' },
            { threshold: 25,  labelEn: 'Hawk Eye',      labelDE: 'Habichtauge' },
            { threshold: 50,  labelEn: 'Omniscient',    labelDE: 'Allwissend' },
        ]
    },
];


// ════════════════════════════════════════════════
//  STAT TRACKING
// ════════════════════════════════════════════════

// trackAchStat(stat, amount) — increment a stat counter by amount (default 1).
//   This is the ONLY function other modules need to call.
//   After incrementing, it calls checkAchievements() to see if anything unlocked.
function trackAchStat(stat, amount = 1) {
    if (!ACH_STATE.stats[stat]) ACH_STATE.stats[stat] = 0;
    ACH_STATE.stats[stat] += amount;
    saveAchState();
    checkAchievements();
}

// setAchStat(stat, value) — force-set a stat to a value (for world-complete flags).
function setAchStat(stat, value) {
    ACH_STATE.stats[stat] = value;
    saveAchState();
    checkAchievements();
}


// ════════════════════════════════════════════════
//  UNLOCK CHECK
// ════════════════════════════════════════════════

// checkAchievements — scans every def/tier and unlocks anything newly met.
//   Newly unlocked toasts are pushed into a queue so they display one after
//   another instead of all firing at the same moment and overwriting each other.
function checkAchievements() {
    let anyNew = false;
    ACHIEVEMENT_DEFS.forEach(def => {
        const val = ACH_STATE.stats[def.stat] || 0;
        def.tiers.forEach((tier, ti) => {
            const key = `${def.id}__${ti}`;
            if (!ACH_STATE.unlocked.includes(key) && val >= tier.threshold) {
                ACH_STATE.unlocked.push(key);
                anyNew = true;
                _achToastQueue.push({ def, tier });
            }
        });
    });
    if (anyNew) {
        saveAchState();
        // Start draining the queue after a brief delay so it doesn't fire mid-action
        setTimeout(_drainAchToastQueue, 600);
    }
}


// ════════════════════════════════════════════════
//  TOAST NOTIFICATION  (queued)
// ════════════════════════════════════════════════

// _achToastQueue — pending toasts waiting to be shown one at a time.
// _achToastBusy  — true while a toast is currently visible; prevents overlap.
let _achToastQueue = [];
let _achToastBusy = false;

// _drainAchToastQueue — shows the next queued toast if none is currently visible.
function _drainAchToastQueue() {
    if (_achToastBusy || !_achToastQueue.length) return;
    const { def, tier } = _achToastQueue.shift();
    _showAchToast(def, tier);
}

// _showAchToast — renders and animates a single achievement toast, then
//   calls _drainAchToastQueue again once it has finished so the next one
//   in the queue appears automatically.
//   Each toast is visible for ~3.5 s with 0.5 s fade-out, then a short
//   gap before the next one slides in.
function _showAchToast(def, tier) {
    _achToastBusy = true;

    // Remove any leftover element (safety net)
    document.getElementById('ach-toast')?.remove();

    const label = (typeof LANG !== 'undefined' && LANG === 'de')
        ? tier.labelDE : tier.labelEn;
    const name = (typeof LANG !== 'undefined' && LANG === 'de')
        ? def.nameDE : def.nameEn;

    const el = document.createElement('div');
    el.id = 'ach-toast';
    el.innerHTML = `
        <div class="ach-toast-inner">
            <span class="ach-toast-icon">${def.icon}</span>
            <div class="ach-toast-text">
                <div class="ach-toast-title">🏆 Achievement Unlocked!</div>
                <div class="ach-toast-name">${name}: <em>${label}</em></div>
            </div>
        </div>`;
    document.body.appendChild(el);

    // Animate in
    requestAnimationFrame(() => el.classList.add('show'));

    // After display time: animate out, then show next queued toast
    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => {
            el.remove();
            _achToastBusy = false;
            // Small gap between consecutive toasts so they feel distinct
            setTimeout(_drainAchToastQueue, 300);
        }, 500); // matches CSS transition-out duration
    }, 3500);
}

// Keep the old public name as an alias so any external calls still work.
function showAchievementToast(def, tier) {
    _achToastQueue.push({ def, tier });
    setTimeout(_drainAchToastQueue, 0);
}


// ════════════════════════════════════════════════
//  ACHIEVEMENT SCREEN BUILDER
// ════════════════════════════════════════════════
function buildAchievementsScreen() {
    const body = document.getElementById('ach-body');
    if (!body) return;

    const totalTiers = ACHIEVEMENT_DEFS.reduce((s, d) => s + d.tiers.length, 0);
    const unlockedCount = ACH_STATE.unlocked.length;
    const pct = Math.round((unlockedCount / totalTiers) * 100);

    // ── Category definitions (order + labels) ──
    const CATEGORIES = [
        { key: 'completion',  icon: '🏁', labelEn: 'Completion',          labelDE: 'Abschluss' },
        { key: 'mistakes',    icon: '💥', labelEn: 'Mistakes & Comebacks', labelDE: 'Fehler & Comebacks' },
        { key: 'items',       icon: '🎁', labelEn: 'Items & Inventory',    labelDE: 'Items & Inventar' },
        { key: 'time',        icon: '⏱', labelEn: 'Time & Speed',         labelDE: 'Zeit & Geschwindigkeit' },
        { key: 'score',       icon: '💰', labelEn: 'Score',                labelDE: 'Punkte' },
        { key: 'grid',        icon: '🔲', labelEn: 'Grid & Puzzles',       labelDE: 'Gitter & Rätsel' },
        { key: 'class',       icon: '🔮', labelEn: 'Classes & Skills',     labelDE: 'Klassen & Fähigkeiten' },
        { key: 'difficulty',  icon: '🔥', labelEn: 'Difficulty',           labelDE: 'Schwierigkeit' },
        { key: 'quiz',        icon: '🧠', labelEn: 'Quiz & Gates',         labelDE: 'Quiz & Tore' },
        { key: 'meta',        icon: '🗺️', labelEn: 'Meta & Exploration',   labelDE: 'Meta & Erkundung' },
    ];

    const lang = (typeof LANG !== 'undefined' && LANG === 'de') ? 'de' : 'en';

    // ── Helper: render a single achievement card ──
    function renderCard(def) {
        const val = ACH_STATE.stats[def.stat] || 0;
        const name = lang === 'de' ? def.nameDE : def.nameEn;
        const desc = lang === 'de' ? def.descDE : def.descEn;

        let highestUnlocked = -1;
        def.tiers.forEach((tier, ti) => {
            if (ACH_STATE.unlocked.includes(`${def.id}__${ti}`)) highestUnlocked = ti;
        });

        const nextTierIdx = highestUnlocked + 1;
        const nextTier = def.tiers[nextTierIdx];
        const isComplete = highestUnlocked === def.tiers.length - 1;

        let progressHtml = '';
        if (nextTier) {
            const pctNext = Math.min(100, Math.round((val / nextTier.threshold) * 100));
            const progressLabel = lang === 'de' ? nextTier.labelDE : nextTier.labelEn;
            progressHtml = `
                <div class="ach-card-progress">
                    <div class="ach-card-progress-bar-outer">
                        <div class="ach-card-progress-bar-inner" style="width:${pctNext}%"></div>
                    </div>
                    <span class="ach-card-progress-label">${val.toLocaleString()} / ${nextTier.threshold.toLocaleString()} — <em>${progressLabel}</em></span>
                </div>`;
        }

        const dotsHtml = def.tiers.map((tier, ti) => {
            const unlocked = ACH_STATE.unlocked.includes(`${def.id}__${ti}`);
            const tierLabel = lang === 'de' ? tier.labelDE : tier.labelEn;
            return `<span class="ach-tier-dot ${unlocked ? 'earned' : 'locked'}" title="${tierLabel}">●</span>`;
        }).join('');

        let earnedLabel = '';
        if (highestUnlocked >= 0) {
            const t = def.tiers[highestUnlocked];
            earnedLabel = lang === 'de' ? t.labelDE : t.labelEn;
        }

        const cardClass = isComplete ? 'ach-card complete' :
            highestUnlocked >= 0 ? 'ach-card partial' : 'ach-card locked';

        return `
            <div class="${cardClass}">
                <div class="ach-card-top">
                    <span class="ach-card-icon">${def.icon}</span>
                    <div class="ach-card-info">
                        <div class="ach-card-name">${name}</div>
                        <div class="ach-card-desc">${desc}</div>
                        ${earnedLabel ? `<div class="ach-card-earned">✓ ${earnedLabel}</div>` : ''}
                    </div>
                </div>
                <div class="ach-tier-dots">${dotsHtml}</div>
                ${progressHtml}
            </div>`;
    }

    // ── Group defs by category ──
    const grouped = {};
    ACHIEVEMENT_DEFS.forEach(def => {
        const cat = def.category || 'meta';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(def);
    });

    let html = `
        <div class="ach-header">
            <div class="ach-progress-line">
                <span class="ach-progress-text">${unlockedCount} / ${totalTiers} unlocked &nbsp;(${pct}%)</span>
                <div class="ach-progress-bar-outer">
                    <div class="ach-progress-bar-inner" style="width:${pct}%"></div>
                </div>
            </div>
        </div>`;

    CATEGORIES.forEach(cat => {
        const defs = grouped[cat.key];
        if (!defs || !defs.length) return;

        const catLabel = lang === 'de' ? cat.labelDE : cat.labelEn;
        const catTotal  = defs.reduce((s, d) => s + d.tiers.length, 0);
        const catUnlocked = defs.reduce((s, d) =>
            s + d.tiers.filter((_, ti) => ACH_STATE.unlocked.includes(`${d.id}__${ti}`)).length, 0);

        html += `
            <div class="ach-category">
                <div class="ach-category-header">
                    <span class="ach-category-icon">${cat.icon}</span>
                    <span class="ach-category-name">${catLabel}</span>
                    <span class="ach-category-count">${catUnlocked} / ${catTotal}</span>
                </div>
                <div class="ach-grid">
                    ${defs.map(renderCard).join('')}
                </div>
            </div>`;
    });

    body.innerHTML = html;
}


// ════════════════════════════════════════════════
//  CONVENIENCE: called from other modules
// ════════════════════════════════════════════════

// Call after a level completes — pass the context object for class/diff/mod checks.
function onLevelCompleteAch(ctx) {
    // ctx: { mistakes, itemsUsed, diff, mods, playerClass, absorbedMistakes,
    //        bonusMet, bonusType, world, gi, cellsFilled, totalCells,
    //        elapsed, timerSecs, pts, prevBest, mult, isFirstClear }

    trackAchStat('levelsCompleted');
    trackAchStat('cellsFilled', ctx.cellsFilled || 0);

    if (ctx.mistakes === 0) trackAchStat('perfectLevels');
    if (ctx.itemsUsed === 0) trackAchStat('noItemLevels');
    if (ctx.mistakes === 0 && ctx.itemsUsed === 0) trackAchStat('pureLevels');
    if (ctx.diff === 'hard') trackAchStat('hardLevels');
    if (ctx.mods && ctx.mods.hardcore) trackAchStat('hardcoreLevels');
    if (ctx.mods && ctx.mods.timetrial) trackAchStat('timeTrialLevels');
    if (ctx.playerClass === 'mathmagician') trackAchStat('levelsAsMathmagician');
    if (ctx.playerClass === 'statistician') trackAchStat('levelsAsStatistician');
    if (ctx.playerClass === 'probabilist') trackAchStat('levelsAsProbabilist');
    if (ctx.scoreEarned) trackAchStat('totalScoreEarned', ctx.scoreEarned);

    // Track worlds played (unique worlds)
    const worldsSeen = new Set();
    if (typeof ALL !== 'undefined') {
        (typeof STATE !== 'undefined' ? STATE.done : []).forEach(gi => {
            if (ALL[gi]) worldsSeen.add(ALL[gi].world);
        });
    }
    setAchStat('worldsPlayed', worldsSeen.size);

    // ── NEW ACHIEVEMENT TRACKING ──────────────────────────────────────────

    // Speed / time-based
    if (ctx.elapsed !== undefined && ctx.elapsed <= 30) trackAchStat('fastClears');
    if (ctx.timerSecs !== undefined && ctx.timerSecs >= 300) trackAchStat('bigTimeLeftWins');
    if (ctx.timerSecs !== undefined && ctx.timerSecs <= 10) trackAchStat('clutchWins');

    // Mistake / comeback
    if (ctx.mistakes >= 3) trackAchStat('comebackWins');

    // Score
    if (ctx.pts !== undefined && ctx.pts >= 500) trackAchStat('highScoreLevels');
    if (ctx.pts !== undefined && ctx.prevBest !== undefined && ctx.prevBest > 0 && ctx.pts > ctx.prevBest) {
        trackAchStat('personalBestsBroken');
    }
    if (ctx.mult !== undefined && ctx.mult >= 2.0) trackAchStat('highMultiplierWins');

    // Grid size
    if (ctx.totalCells !== undefined && ctx.totalCells >= 400) trackAchStat('largeGridClears');
    if (ctx.rows === 5 && ctx.cols === 5 && ctx.mistakes === 0 && ctx.itemsUsed === 0) {
        trackAchStat('smallPerfectClears');
    }
    if (ctx.totalCells !== undefined && ctx.cellsFilled !== undefined &&
        ctx.cellsFilled > ctx.totalCells / 2) {
        trackAchStat('denseGridClears');
    }

    // Items used in one level
    if (ctx.itemsUsed >= 3) trackAchStat('threeItemsOneLevelCount');

    // Bounceback: won immediately after a flagged loss on the same gi
    if (ctx.isBouncebackWin) trackAchStat('bouncebackWins');

    // Penalty clutch: penalty pushed timer below 60s but player still won
    if (ctx.hadPenaltyClutwch) trackAchStat('penaltyClutwins');

    // Class-specific: Mathmagician absorbed 3+ in one level
    if (ctx.playerClass === 'mathmagician' && ctx.absorbedThisLevel >= 3) {
        trackAchStat('mathmagician3AbsorbOneLevel');
    }
}

// Check world-complete achievements — call after updating STATE.done
function checkWorldCompleteAch() {
    if (typeof WORLDS === 'undefined' || typeof WORLD_START_GI === 'undefined') return;
    WORLDS.forEach((w, wi) => {
        if (!w.data.length) return;
        const start = WORLD_START_GI[wi];
        const end = start + w.data.length - 1;
        const allDone = typeof STATE !== 'undefined' &&
            Array.from({ length: w.data.length }, (_, i) => start + i)
                .every(gi => STATE.done.includes(gi));
        if (allDone) setAchStat(`world${wi + 1}Complete`, 1);

        // Flawless world: all levels in world done with 0 total mistakes across them.
        // We store per-level mistake counts in STATE.levelMistakes (set from checkWin).
        if (allDone && typeof STATE.levelMistakes !== 'undefined') {
            const worldMistakes = Array.from({ length: w.data.length }, (_, i) => start + i)
                .reduce((sum, gi) => sum + (STATE.levelMistakes[gi] || 999), 0);
            if (worldMistakes === 0) {
                // Count how many worlds are fully flawless
                let flawlessCount = 0;
                WORLDS.forEach((w2, wi2) => {
                    if (!w2.data.length) return;
                    const s2 = WORLD_START_GI[wi2];
                    const allDone2 = Array.from({ length: w2.data.length }, (_, i) => s2 + i)
                        .every(gi => STATE.done.includes(gi));
                    if (!allDone2) return;
                    const wm2 = Array.from({ length: w2.data.length }, (_, i) => s2 + i)
                        .reduce((sum, gi) => sum + (STATE.levelMistakes[gi] || 999), 0);
                    if (wm2 === 0) flawlessCount++;
                });
                setAchStat('flawlessWorlds', flawlessCount);
            }
        }

        // World all bonus: every level in this world has its bonus claimed.
        if (allDone && typeof STATE !== 'undefined') {
            const allBonusClaimed = Array.from({ length: w.data.length }, (_, i) => start + i)
                .every(gi => STATE.bonusDone.includes(gi));
            if (allBonusClaimed) {
                // Count how many worlds have all bonuses claimed
                let bonusWorldCount = 0;
                WORLDS.forEach((w2, wi2) => {
                    if (!w2.data.length) return;
                    const s2 = WORLD_START_GI[wi2];
                    const allDone2 = Array.from({ length: w2.data.length }, (_, i) => s2 + i)
                        .every(gi => STATE.done.includes(gi));
                    if (!allDone2) return;
                    const allBonus2 = Array.from({ length: w2.data.length }, (_, i) => s2 + i)
                        .every(gi => STATE.bonusDone.includes(gi));
                    if (allBonus2) bonusWorldCount++;
                });
                setAchStat('worldAllBonusClaimed', bonusWorldCount);
            }
        }
    });
}


// resetAchievements — Developer tool to wipe all achievement data.
//   1. Clears the specific localStorage key for achievements.
//   2. Resets the in-memory ACH_STATE object.
//   3. Re-saves to ensure the file is initialized correctly.
//   4. Rebuilds the UI immediately to show 0% progress.
function resetAchievements() {
    if (confirm("Are you sure you want to wipe ALL achievement progress? This cannot be undone.")) {
        // Remove the persistent save
        localStorage.removeItem(ACH_SAVE_KEY);

        // Reset the runtime state to factory defaults
        ACH_STATE = { stats: {}, unlocked: [] };

        // Save the empty state and refresh the screen
        saveAchState();
        buildAchievementsScreen();

        // Optional: show a toast to confirm
        if (typeof showToast === 'function') {
            showToast("Achievements Cleared!");
        }
    }
}