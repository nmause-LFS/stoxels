//------------------------------------------------------------------------
//-------------------RUNTIME STATE----------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// ── Encounter state ──────────────────────────────────────────────────────────
let _egMonsters = [];    // live monster objects currently in the encounter
let _egTargetId = null;  // id of the monster the player is currently targeting
let _egEncounterActive = false; // true while a monster encounter is running
let _egTickInterval = null;  // handle for the 10Hz combat loop interval

// ── Spawn timers ─────────────────────────────────────────────────────────────
// Kept so we can cancel staggered spawns if the encounter ends early.
let _egSpawnTimers = [];

// ── Pickup state ─────────────────────────────────────────────────────────────
let _egPickups = new Map(); // key:"row-col" → pickupDef
let _egPickupTimers = [];        // expiry timers, cancelled on encounter stop
let _egPickupSpawnTimer = null;      // recurring spawn-attempt timer

// ── Boss state ───────────────────────────────────────────────────────────────
let _egBossTimers = {};      // monsterId → array of mechanic timer handles
let _egBossCorrupted = new Map(); // key:"row-col" → { timer } for Corrupt Cells
let _egVeilActive = false;   // true while the Grid Veil overlay is showing
let _egBlackoutActive = false;  // true while the Clue Blackout is active

let _egVoidSurgeActive = false;  // true while a Void Surge safe-zone is on screen
let _egVoidSurgePollInterval = null; // handle for the HUD-position poll during Void Surge

// ── Prior Bomb fill tracker ──────────────────────────────────────────────────
// Circular buffer of [row, col] for recently correctly-filled cells.
let _egRecentFills = [];

// Snapshot of the original map-level def, captured at _egStartEncounter.
// Used to read boss/requiredKills config after cur has been replaced by chained puzzles.
let _egMapDef = null;







//------------------------------------------------------------------------
//-------------------ENCOUNTER GUARD--------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Central guard used before every combat operation.
// Returns true only when an endgame encounter is actually running.
function _egIsActive() {
    return _egEncounterActive
        && typeof cur !== 'undefined' && cur
        && (cur.isMonsterLevel === true);  // check if this level is assigned as a level that contains monsters
}