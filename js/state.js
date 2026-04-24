// ═══════════════════════════════════════════════
//  GAME STATE  (state.js)
//  Holds every variable that describes what is
//  happening RIGHT NOW in an active puzzle session.
//  These are reset each time a new level starts
//  (see startLevel() in screens.js).
// ═══════════════════════════════════════════════

// cur         — the full puzzle object for the level currently being played
//               (one entry from the ALL array defined in levels.js)
// userGrid    — 2-D array mirroring the puzzle grid; each cell stores:
//               0 = untouched, 1 = filled by the player, 2 = marked empty (✕)
// wrongGrid   — 2-D boolean array; true means the player filled that cell
//               incorrectly (it gets a red ✕ and a time penalty is applied)
// revealedGrid— 2-D boolean array; true means the cell was revealed by an
//               item (shown in green, counts as correct, cannot be un-filled)
let cur = null, userGrid = [], wrongGrid = [], revealedGrid = [];

// mistakeCount      — how many wrong fills the player has made this level
// itemsUsedThisLevel— tracks item usage so the "noitem" bonus can be checked
// dead              — set to true when the timer hits 0 or a Hardcore mistake
//                     occurs; prevents further input and stops the timer
let mistakeCount = 0, itemsUsedThisLevel = 0, dead = false;

// shieldActive  — true while a Shield item is protecting the next mistake
// timerFrozen   — true while a Freeze item has paused the countdown
// quizAnsweredCorrectly — records the quiz result so other code can read it
let shieldActive = false, timerFrozen = false;
let quizAnsweredCorrectly = false;

// screenHistory — a stack of screen IDs; push when navigating forward so
//                 the Escape key / Back button can pop back to the right screen
let screenHistory = [];


// ═══════════════════════════════════════════════
//  PERSIST  — save & load progress via localStorage
//  The save key is 'stoxels'. 
// ═══════════════════════════════════════════════

// loadState — reads the JSON string from localStorage and parses it.
//             Returns null if nothing is saved yet or the data is corrupt.
function loadState() {
    try {
        return JSON.parse(localStorage.getItem('stoxels') || 'null');
    } catch {
        return null; // corrupted data — fall back to a fresh state
    }
}

// initState — called once at startup.
//             If saved data exists it is returned (with a safety-net that
//             adds the 'bonusDone' array in case this is an older save that
//             predates that field).
//             If no save exists a brand-new empty STATE object is returned.
function initState() {
    const s = loadState();
    if (s) {
        // Migration guard: older saves won't have bonusDone
        if (!s.bonusDone) s.bonusDone = [];
        if (s.tutorialDone === undefined) s.tutorialDone = false;
        return s;
    }
    // Fresh save structure — add new persistent fields here in the future
    return {
        totalScore: 0,      // running total across all sessions
        levelHS: {},         // best score per level  { gIdx: { score, diff, time, mods } }
        inventory: [],       // items the player currently owns  [ { defId, uid } ]
        unlockedCodes: [],   // Moodle codes already shown to the player
        done: [],            // gIdx values of completed levels
        bonusDone: [],        // gIdx values where the bonus reward was already claimed
        tutorialDone: false
    };
}

// STATE is the single source of truth for all persistent progress.
// Every screen that reads scores, inventory, or completion status reads from here.
let STATE = initState();

// save — serialises STATE to localStorage.
//        Call this whenever STATE changes (after completing a level,
//        using/selling an item, unlocking a code, etc.).
function save() {
    localStorage.setItem('stoxels', JSON.stringify(STATE));
}
