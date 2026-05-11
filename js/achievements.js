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

    // ── PRIMER CORRECT ───────────────────────────
    {
        id: 'primer_correct',
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
function checkAchievements() {
    let anyNew = false;
    ACHIEVEMENT_DEFS.forEach(def => {
        const val = ACH_STATE.stats[def.stat] || 0;
        def.tiers.forEach((tier, ti) => {
            const key = `${def.id}__${ti}`;
            if (!ACH_STATE.unlocked.includes(key) && val >= tier.threshold) {
                ACH_STATE.unlocked.push(key);
                anyNew = true;
                // Queue toast — slight delay so it doesn't fire mid-action
                setTimeout(() => showAchievementToast(def, tier), 600);
            }
        });
    });
    if (anyNew) saveAchState();
}


// ════════════════════════════════════════════════
//  TOAST NOTIFICATION
// ════════════════════════════════════════════════

// showAchievementToast — displays a brief achievement-unlock banner.
function showAchievementToast(def, tier) {
    // Remove any existing ach-toast first
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

    // Animate in, hold, animate out
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => {
        el.classList.remove('show');
        setTimeout(() => el.remove(), 500);
    }, 3500);
}


// ════════════════════════════════════════════════
//  ACHIEVEMENT SCREEN BUILDER
// ════════════════════════════════════════════════

// buildAchievementsScreen — renders all achievements into #ach-body.
function buildAchievementsScreen() {
    const body = document.getElementById('ach-body');
    if (!body) return;

    // Count totals
    const totalTiers = ACHIEVEMENT_DEFS.reduce((s, d) => s + d.tiers.length, 0);
    const unlockedCount = ACH_STATE.unlocked.length;
    const pct = Math.round((unlockedCount / totalTiers) * 100);

    let html = `
        <div class="ach-header">
            <div class="ach-progress-line">
                <span class="ach-progress-text">${unlockedCount} / ${totalTiers} unlocked &nbsp;(${pct}%)</span>
                <div class="ach-progress-bar-outer">
                    <div class="ach-progress-bar-inner" style="width:${pct}%"></div>
                </div>
            </div>
        </div>
        <div class="ach-grid">`;

    ACHIEVEMENT_DEFS.forEach(def => {
        const val = ACH_STATE.stats[def.stat] || 0;
        const name = (typeof LANG !== 'undefined' && LANG === 'de') ? def.nameDE : def.nameEn;
        const desc = (typeof LANG !== 'undefined' && LANG === 'de') ? def.descDE : def.descEn;

        // Find the highest unlocked tier index (-1 = none)
        let highestUnlocked = -1;
        def.tiers.forEach((tier, ti) => {
            const key = `${def.id}__${ti}`;
            if (ACH_STATE.unlocked.includes(key)) highestUnlocked = ti;
        });

        // Next tier info
        const nextTierIdx = highestUnlocked + 1;
        const nextTier = def.tiers[nextTierIdx];
        const isComplete = highestUnlocked === def.tiers.length - 1;

        // Progress toward next tier
        let progressHtml = '';
        if (nextTier) {
            const pctNext = Math.min(100, Math.round((val / nextTier.threshold) * 100));
            const progressLabel = (typeof LANG !== 'undefined' && LANG === 'de')
                ? nextTier.labelDE : nextTier.labelEn;
            progressHtml = `
                <div class="ach-card-progress">
                    <div class="ach-card-progress-bar-outer">
                        <div class="ach-card-progress-bar-inner" style="width:${pctNext}%"></div>
                    </div>
                    <span class="ach-card-progress-label">${val.toLocaleString()} / ${nextTier.threshold.toLocaleString()} — <em>${progressLabel}</em></span>
                </div>`;
        }

        // Tier dots
        const dotsHtml = def.tiers.map((tier, ti) => {
            const key = `${def.id}__${ti}`;
            const unlocked = ACH_STATE.unlocked.includes(key);
            const tierLabel = (typeof LANG !== 'undefined' && LANG === 'de') ? tier.labelDE : tier.labelEn;
            return `<span class="ach-tier-dot ${unlocked ? 'earned' : 'locked'}" title="${tierLabel}">●</span>`;
        }).join('');

        // Highest earned label
        let earnedLabel = '';
        if (highestUnlocked >= 0) {
            const t = def.tiers[highestUnlocked];
            earnedLabel = (typeof LANG !== 'undefined' && LANG === 'de') ? t.labelDE : t.labelEn;
        }

        const cardClass = isComplete ? 'ach-card complete' :
            highestUnlocked >= 0 ? 'ach-card partial' : 'ach-card locked';

        html += `
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
    });

    html += `</div>`;
    body.innerHTML = html;
}


// ════════════════════════════════════════════════
//  CONVENIENCE: called from other modules
// ════════════════════════════════════════════════

// Call after a level completes — pass the context object for class/diff/mod checks.
function onLevelCompleteAch(ctx) {
    // ctx: { mistakes, itemsUsed, diff, mods, playerClass, absorbedMistakes,
    //        bonusMet, bonusType, world, gi }

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
