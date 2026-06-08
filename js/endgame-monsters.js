// endgame-monsters.js
// ─────────────────────────────────────────────────────────────────────────────
// Self-contained monster + pickup system for the endgame sandbox.
// Activated ONLY when cur.isEndgameSandbox === true OR cur.isMonsterLevel === true.
// All public names are prefixed _eg_ to avoid collision with campaign code.
//
// EXTERNAL CALLS INTO THIS FILE (from mouse-button-handlers.js and others):
//   _egOnCorrectCell(row, col)      — call on every correct cell fill
//   _egCheckPickupClaim(row, col)   — call before crediting a correct action
//   _egDiscardPickup(row, col)      — call on a wrong action that had a pickup
//   _egDispelCorruption(row, col)   — call when player clicks a corrupted cell
//   _egIsCellCorrupted(row, col)    — returns true if cell is boss-corrupted
//   _egStartEncounter()             — call when a monster level begins
//   _egStopEncounter()              — call when leaving a monster level
//   _egSelectTarget(monsterId)      — called by onclick on monster cards
// ─────────────────────────────────────────────────────────────────────────────


//------------------------------------------------------------------------
//-------------------CONSTANTS & DATA DEFINITIONS-------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// ── Player base stats ────────────────────────────────────────────────────────
// These are the level-1 values before any equipment or passive bonuses apply.
// Future expansion: add critChance, critMultiplier, fireDamage, coldDamage, etc.
const EG_PLAYER_STATS = {
    baseHP: 10000, // Starting HP for all monster levels
    baseDamage: 100, // Damage dealt per correct cell fill
    chargePushback: 1.5, // Seconds removed from a monster's charge bar on hit
};

// ── Monster level scaling ────────────────────────────────────────────────────
// Applied per level above 1. Tune once you have balance data.
const EG_LEVEL_HP_SCALE = 0.20; // +20% HP per level above 1
const EG_LEVEL_DAMAGE_SCALE = 0.10; // +10% damage per level above 1

// ── Pickup spawner timing ────────────────────────────────────────────────────
const EG_PICKUP_SPAWN_INTERVAL_MIN = 8000;  // ms minimum between spawn attempts
const EG_PICKUP_SPAWN_INTERVAL_MAX = 18000; // ms maximum between spawn attempts
const EG_PICKUP_MAX_ON_BOARD = 3;     // hard cap on simultaneous pickups
const EG_PICKUP_LIFETIME_MS = 20000; // ms before an uncollected pickup disappears

// ── Monster definitions ──────────────────────────────────────────────────────
// baseHP / baseDamage are level-1 values.
// chargeMax (seconds to fill the attack bar) does NOT scale with level.
// isBoss: true entries are only spawned via cur.hasBoss / cur.bosses.
// To add a new monster, add an entry here — it becomes available immediately.
const EG_MONSTER_DEFS = {

    // TIER 1 — Weak / fast
    slime: {
        id: 'slime', name: 'Probability Slime', emoji: '🟢',
        baseHP: 30, baseDamage: 5, chargeMax: 10, isBoss: false,
    },
    ghost: {
        id: 'ghost', name: 'Variance Ghost', emoji: '👻',
        baseHP: 50, baseDamage: 1, chargeMax: 6, isBoss: false,
    },
    bat: {
        id: 'bat', name: 'Outlier Bat', emoji: '🦇',
        baseHP: 25, baseDamage: 3, chargeMax: 5,  // very fast attacker, low damage
        isBoss: false,
    },
    rat: {
        id: 'rat', name: 'Sample Rat', emoji: '🐀',
        baseHP: 20, baseDamage: 2, chargeMax: 4,  // swarm-tier: frail but relentless
        isBoss: false,
    },

    // TIER 2 — Medium / balanced
    crab: {
        id: 'crab', name: 'Correlation Crab', emoji: '🦀',
        baseHP: 65, baseDamage: 7, chargeMax: 12, isBoss: false,
    },
    snake: {
        id: 'snake', name: 'Regression Snake', emoji: '🐍',
        baseHP: 55, baseDamage: 9, chargeMax: 14, isBoss: false,
    },
    skull: {
        id: 'skull', name: 'Null Hypothesis Skull', emoji: '💀',
        baseHP: 70, baseDamage: 6, chargeMax: 9, isBoss: false,
    },

    // TIER 3 — Tanky / hard-hitting
    golem: {
        id: 'golem', name: 'Sigma Golem', emoji: '🗿',
        baseHP: 80, baseDamage: 10, chargeMax: 20, isBoss: false,
    },
    dragon: {
        id: 'dragon', name: 'Bayes Dragon', emoji: '🐉',
        baseHP: 120, baseDamage: 14, chargeMax: 18, isBoss: false,
    },
    demon: {
        id: 'demon', name: 'P-Value Demon', emoji: '😈',
        baseHP: 100, baseDamage: 18, chargeMax: 22, // hits very hard but slow
        isBoss: false,
    },
    golem_iron: {
        id: 'golem_iron', name: 'Iron Golem', emoji: '🤖',
        baseHP: 150, baseDamage: 8, chargeMax: 16,  // extremely tanky, moderate damage
        isBoss: false,
    },
    werewolf: {
        id: 'werewolf', name: 'Stochastic Wolf', emoji: '🐺',
        baseHP: 90, baseDamage: 12, chargeMax: 11,  // balanced bruiser
        isBoss: false,
    },
    ogre: {
        id: 'ogre', name: 'Chi-Square Ogre', emoji: '👹',
        baseHP: 110, baseDamage: 16, chargeMax: 25, // slowest attacker, highest single hit
        isBoss: false,
    },

    // BOSSES — spawned only via cur.hasBoss / cur.bosses
    boss_null: {
        id: 'boss_null', name: 'The Null Hypothesis', emoji: '🧿',
        baseHP: 600, baseDamage: 20, chargeMax: 15, isBoss: true,
    },
    boss_bayes: {
        id: 'boss_bayes', name: 'The Grand Prior', emoji: '🔮',
        baseHP: 800, baseDamage: 15, chargeMax: 12, isBoss: true,
    },
};

// ── Class projectile visuals ─────────────────────────────────────────────────
// Maps playerClass → the visual appearance of the outgoing player projectile.
// Add new classes here as you implement them.
// _default is used when the player's class is null or unrecognised.
const EG_CLASS_PROJECTILES = {
    probabilist: { emoji: '➤', cssClass: 'eg-proj-arrow', duration: 1000, easing: 'linear' },
    mathmagician: { emoji: '🔥', cssClass: 'eg-proj-fireball', duration: 1000, easing: 'ease-in' },
    statistician: { emoji: '🗡️', cssClass: 'eg-proj-sword', duration: 1000, easing: 'ease-out' },
    _default: { emoji: '⚡', cssClass: 'eg-proj-default', duration: 400, easing: 'ease-in' },
};

// ── Pickup definitions ───────────────────────────────────────────────────────
// Each entry describes one pickup type that can appear on grid tiles.
//   id        — unique key, referenced by EG_PICKUP_WEIGHTS
//   emoji     — shown on the tile overlay and in the claim toast
//   label     — human-readable name (for future UI use)
//   rarity    — 'common' | 'uncommon' | 'rare'  (controls glow CSS class)
//   onPickup  — called with (row, col) when the player claims the pickup
//
// To add new pickup types (items, currency, etc.) add an entry here and a
// corresponding weight entry in EG_PICKUP_WEIGHTS. No other code needs changing.
const EG_PICKUP_DEFS = {
    heart_small: {
        id: 'heart_small', emoji: '💛', label: 'Small Heart', rarity: 'common',
        onPickup(row, col) {
            const heal = 10;
            playerCurrentHP = Math.min(playerMaxHP, playerCurrentHP + heal);
            _renderPlayerHealth();
            showToast(`💛 Small Heart! +${heal} HP`);
        },
    },
    heart_medium: {
        id: 'heart_medium', emoji: '🧡', label: 'Heart', rarity: 'uncommon',
        onPickup(row, col) {
            const heal = 25;
            playerCurrentHP = Math.min(playerMaxHP, playerCurrentHP + heal);
            _renderPlayerHealth();
            showToast(`🧡 Heart! +${heal} HP`);
        },
    },
    heart_large: {
        id: 'heart_large', emoji: '❤️', label: 'Large Heart', rarity: 'rare',
        onPickup(row, col) {
            const heal = 50;
            playerCurrentHP = Math.min(playerMaxHP, playerCurrentHP + heal);
            _renderPlayerHealth();
            showToast(`❤️ Large Heart! +${heal} HP`);
        },
    },
    // Future pickup types go here:
    // item_pickup: {
    //     id: 'item_pickup', emoji: '📦', label: 'Item', rarity: 'uncommon',
    //     onPickup(row, col) { /* grant random item to inventory */ },
    // },
};

// Weighted table for pickup type selection.
// Increase a weight value to make that pickup more common.
const EG_PICKUP_WEIGHTS = [
    { id: 'heart_small', weight: 60 },
    { id: 'heart_medium', weight: 30 },
    { id: 'heart_large', weight: 10 },
];

// ── Boss mechanic definitions ────────────────────────────────────────────────
// Each boss listed in EG_MONSTER_DEFS with isBoss:true can have an entry here.
// When a boss spawns, _egBossInit() reads its entry to set up phases and mechanics.
//
// phases[]       — ordered list of phase thresholds (HP% at which the phase begins),
//                  plus the stat changes that take effect. Phase 1 = full HP.
// immunityDuration — ms the boss is invulnerable during a phase transition.
// mechanics[]    — abilities the boss uses on recurring timers.
//   name            — identifier (for debugging)
//   intervalBase    — base ms between activations
//   intervalVariance — ± random ms variance applied to each interval
//   handler         — name of the global function to call (as a string)
//   phase2Only      — if true, only schedules once the boss reaches phase 2+
const EG_BOSS_MECHANICS = {

    // boss_null — "The Null Hypothesis"
    // Phase 1 (100% → 66%): normal attacks + Corrupt Cells + Clue Blackout
    // Phase 2 ( 66% → 33%): immune window, faster charge, Corrupt Cells worsens
    // Phase 3 (  33% →  0%): enrage — very fast charge, massive damage, both mechanics
    boss_null: {
        phases: [
            { threshold: 1.00, chargeMax: 15, damageMultiplier: 1.0 }, // Phase 1
            { threshold: 0.66, chargeMax: 10, damageMultiplier: 1.4 }, // Phase 2
            { threshold: 0.33, chargeMax: 6, damageMultiplier: 2.0 }, // Phase 3 — ENRAGE
        ],
        immunityDuration: 2500,
        mechanics: [
            { name: 'corrupt_cells', intervalBase: 12000, intervalVariance: 4000, handler: '_egMechCorruptCells' },
            { name: 'clue_blackout', intervalBase: 22000, intervalVariance: 6000, handler: '_egMechClueBlackout' },
        ],
    },

    // boss_bayes — "The Grand Prior"
    // Phase 1 (100% → 50%): normal + Probability Shift + Prior Bomb
    // Phase 2 (  50% →  0%): immune window, Grid Veil activates, all mechanics intensify
    boss_bayes: {
        phases: [
            { threshold: 1.00, chargeMax: 12, damageMultiplier: 1.0 }, // Phase 1
            { threshold: 0.50, chargeMax: 8, damageMultiplier: 1.6 }, // Phase 2 — VEIL
        ],
        immunityDuration: 3000,
        mechanics: [
            { name: 'probability_shift', intervalBase: 14000, intervalVariance: 4000, handler: '_egMechProbabilityShift' },
            { name: 'prior_bomb', intervalBase: 18000, intervalVariance: 5000, handler: '_egMechPriorBomb' },
            // grid_veil fires once on phase 2 activation; intervalBase is set
            // absurdly high so it never self-reschedules after that first trigger.
            { name: 'grid_veil', intervalBase: 999999999, intervalVariance: 0, handler: '_egMechGridVeil', phase2Only: true },
        ],
    },
};

// ── Phase display names (indexed by phase number) ────────────────────────────
// Index 0 is unused. Add entries here as you add more phases to any boss.
const EG_BOSS_PHASE_NAMES = ['', 'Phase I', 'Phase II — ENRAGE', 'Phase III — FURY'];

// ── Recent fill tracker capacity ─────────────────────────────────────────────
// Used by the Prior Bomb mechanic. Increase if you want it to reach further back.
const EG_RECENT_FILLS_CAPACITY = 20;

// ── Corrupt cell expiry time ─────────────────────────────────────────────────
const EG_CORRUPT_CELL_LIFETIME_MS = 15000; // ms before corruption auto-expires


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

// ── Prior Bomb fill tracker ──────────────────────────────────────────────────
// Circular buffer of [row, col] for recently correctly-filled cells.
let _egRecentFills = [];


//------------------------------------------------------------------------
//-------------------ENCOUNTER GUARD--------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Central guard used before every combat operation.
// Returns true only when an endgame encounter is actually running.
function _egIsActive() {
    return _egEncounterActive
        && typeof cur !== 'undefined' && cur
        && (cur.isEndgameSandbox === true || cur.isMonsterLevel === true);
}


//------------------------------------------------------------------------
//-------------------PLAYER DAMAGE CALCULATION----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Central function for all outgoing player damage.
// Add equipment bonuses, crits, and buff stacks here when the time comes.
function _egCalcPlayerDamage() {
    let dmg = EG_PLAYER_STATS.baseDamage;
    // TODO: dmg += _egGetEquipmentBonus('damage');
    // TODO: if (Math.random() < _egGetCritChance()) dmg = Math.floor(dmg * 2);
    return Math.max(1, Math.round(dmg));
}


//------------------------------------------------------------------------
//-------------------MONSTER FACTORY--------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns the scaled stats for a monster at the given level.
// Accepts either a string id (looks up EG_MONSTER_DEFS) or a def object directly.
function _egBuildMonster(defOrId, level = 1) {
    const def = (typeof defOrId === 'string') ? EG_MONSTER_DEFS[defOrId] : defOrId;
    if (!def) { console.warn('[EG] Unknown monster id:', defOrId); return null; }

    const lvl = Math.max(1, level);
    const hpScale = 1 + EG_LEVEL_HP_SCALE * (lvl - 1);
    const dmgScale = 1 + EG_LEVEL_DAMAGE_SCALE * (lvl - 1);

    const maxHP = Math.round(def.baseHP * hpScale);
    const damage = Math.round(def.baseDamage * dmgScale);

    return {
        id: def.id,
        name: def.name,
        emoji: def.emoji,
        level: lvl,
        maxHP,
        currentHP: maxHP,
        chargeMax: def.chargeMax,
        currentCharge: 0,
        isBoss: def.isBoss,
        damageValue: damage,
    };
}


//------------------------------------------------------------------------
//-------------------PROJECTILE HELPERS-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns the projectile definition for the player's current class.
// Falls back to _default when class is null or unrecognised.
function _egGetProjectileDef() {
    const cls = (typeof STATE !== 'undefined' && STATE.playerClass)
        ? STATE.playerClass.toLowerCase()
        : '_default';
    return EG_CLASS_PROJECTILES[cls] || EG_CLASS_PROJECTILES._default;
}

// Returns the screen-centre coordinates of a DOM element as { x, y }.
function _egGetElementCentre(el) {
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

// Creates, animates, and auto-removes a projectile div travelling from start to end.
// onArrive() is called when the animation completes (i.e. on impact).
function _egFireProjectile(emoji, cssClass, start, end, duration, easing, onArrive) {
    const proj = document.createElement('div');
    proj.className = `eg-projectile ${cssClass}`;
    proj.textContent = emoji;
    proj.style.left = '0px';
    proj.style.top = '0px';
    document.body.appendChild(proj);

    const anim = proj.animate([
        { transform: `translate(${start.x}px, ${start.y}px) scale(1.5)` },
        { transform: `translate(${end.x}px,   ${end.y}px)   scale(0.5)` },
    ], { duration, easing });

    anim.onfinish = () => { proj.remove(); onArrive(); };
}


//------------------------------------------------------------------------
//-------------------PICKUP HELPERS---------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns a random pickup def selected by weighted random from EG_PICKUP_WEIGHTS.
function _egPickRandomPickup() {
    const total = EG_PICKUP_WEIGHTS.reduce((sum, e) => sum + e.weight, 0);
    let roll = Math.random() * total;
    for (const entry of EG_PICKUP_WEIGHTS) {
        roll -= entry.weight;
        if (roll <= 0) return EG_PICKUP_DEFS[entry.id];
    }
    return EG_PICKUP_DEFS['heart_small']; // fallback — should never be reached
}

// Returns true if the cell at (row, col) is eligible to host a pickup.
// A cell is eligible when it is untouched, unrevealed, error-free, and not a lucky tile.
function _egIsCellPickupEligible(row, col) {
    const key = `${row}-${col}`;
    if (_egPickups.has(key)) return false; // already has a pickup
    if (userGrid[row][col] !== 0) return false; // player has touched this cell
    if (revealedGrid[row][col]) return false; // item-revealed
    if (wrongGrid[row][col]) return false; // mistake-marked
    if (luckyTiles && luckyTiles.has(key)) return false; // lucky tile
    return true;
}

// Builds the full list of pickup-eligible cells and returns it as [[row, col], ...].
function _egBuildPickupEligiblePool() {
    if (!cur || !cur.grid) return [];
    const sol = cur.grid;
    const rows = sol.length;
    const cols = sol[0].length;
    const pool = [];
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (_egIsCellPickupEligible(r, c)) pool.push([r, c]);
    return pool;
}

// Injects the pickup emoji overlay span into the cell's DOM element.
function _egRenderPickupOverlay(row, col, def) {
    const el = document.getElementById(`g-${row}-${col}`);
    if (!el) return;
    const span = document.createElement('span');
    span.className = `eg-pickup-overlay eg-pickup-rarity-${def.rarity}`;
    span.id = `eg-pickup-${row}-${col}`;
    span.textContent = def.emoji;
    el.appendChild(span);
}

// Removes the pickup overlay span from the DOM for the given key "row-col".
function _egRemovePickupOverlay(key) {
    const [r, c] = key.split('-').map(Number);
    const span = document.getElementById(`eg-pickup-${r}-${c}`);
    if (span) span.remove();
}

// Plays the floating emoji animation when a pickup is claimed.
function _egAnimatePickupClaim(row, col, def) {
    const el = document.getElementById(`g-${row}-${col}`);
    if (!el) return;
    const centre = _egGetElementCentre(el);

    const floater = document.createElement('div');
    floater.className = 'eg-pickup-floater';
    floater.textContent = def.emoji;
    floater.style.left = `${centre.x}px`;
    floater.style.top = `${centre.y}px`;
    document.body.appendChild(floater);
    setTimeout(() => floater.remove(), 800);
}

// Schedules the auto-expiry timer for a placed pickup.
// Removes both the state entry and the DOM overlay when it fires.
function _egSchedulePickupExpiry(key, def) {
    const timer = setTimeout(() => {
        // Only remove if this exact def is still sitting on the key
        // (prevents a race where the pickup was already claimed).
        if (_egPickups.get(key) === def) {
            _egPickups.delete(key);
            _egRemovePickupOverlay(key);
        }
    }, EG_PICKUP_LIFETIME_MS);
    _egPickupTimers.push(timer);
}


//------------------------------------------------------------------------
//-------------------PICKUP SPAWN SYSTEM----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Schedules the next pickup spawn attempt with a random delay in the configured range.
// Recursively reschedules itself so pickups continue to appear throughout the encounter.
function _egScheduleNextPickupSpawn() {
    const delay = EG_PICKUP_SPAWN_INTERVAL_MIN
        + Math.random() * (EG_PICKUP_SPAWN_INTERVAL_MAX - EG_PICKUP_SPAWN_INTERVAL_MIN);

    _egPickupSpawnTimer = setTimeout(() => {
        if (_egIsActive()) {
            _egSpawnPickup();
            _egScheduleNextPickupSpawn();
        }
    }, delay);
}

// Attempts to place one pickup on a random eligible grid tile.
// Does nothing if the board is already at max pickups or no eligible cells exist.
function _egSpawnPickup() {
    if (_egPickups.size >= EG_PICKUP_MAX_ON_BOARD) return;

    const pool = _egBuildPickupEligiblePool();
    if (pool.length === 0) return;

    const [r, c] = pool[Math.floor(Math.random() * pool.length)];
    const def = _egPickRandomPickup();
    const key = `${r}-${c}`;

    _egPickups.set(key, def);
    _egRenderPickupOverlay(r, c, def);
    _egSchedulePickupExpiry(key, def);
}

// Starts the recurring pickup spawn loop.
function _egStartPickupSpawner() {
    _egScheduleNextPickupSpawn();
}

// Cancels all pickup timers and clears every pickup from the board.
// Called on encounter stop or level exit.
function _egStopPickupSpawner() {
    if (_egPickupSpawnTimer) {
        clearTimeout(_egPickupSpawnTimer);
        _egPickupSpawnTimer = null;
    }
    _egPickupTimers.forEach(t => clearTimeout(t));
    _egPickupTimers = [];

    _egPickups.forEach((def, key) => _egRemovePickupOverlay(key));
    _egPickups.clear();
}


//------------------------------------------------------------------------
//-------------------PICKUP INTERACTION-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Call this when the player makes the CORRECT action on a cell.
// (correct cell + left-click fill, or wrong cell + right-click mark)
// If a pickup sits on that cell, claims it and triggers its onPickup effect.
// Returns true if a pickup was present and claimed.
function _egCheckPickupClaim(row, col) {
    if (!_egIsActive()) return false;
    const key = `${row}-${col}`;
    const def = _egPickups.get(key);
    if (!def) return false;

    _egPickups.delete(key);
    _egRemovePickupOverlay(key);
    _egAnimatePickupClaim(row, col, def);
    def.onPickup(row, col);
    return true;
}

// Call this when the player makes the WRONG action on a cell that has a pickup.
// (correct cell + right-click, or wrong cell + left-click)
// Silently discards the pickup — no reward, no animation.
function _egDiscardPickup(row, col) {
    if (!_egIsActive()) return;
    const key = `${row}-${col}`;
    if (!_egPickups.has(key)) return;
    _egPickups.delete(key);
    _egRemovePickupOverlay(key);
}


//------------------------------------------------------------------------
//-------------------ENCOUNTER SPAWN LIST BUILDERS------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns the base level for this encounter, with ±2 random variance applied.
// Variance keeps a wave from feeling perfectly uniform.
function _egRollMonsterLevel(baseLevel) {
    return Math.max(1, baseLevel + Math.floor(Math.random() * 5) - 2);
}

// Builds the normal (non-boss) part of the spawn list for this encounter.
// Uses cur.monsters if provided; otherwise picks a random subset of all non-boss defs.
// cur.maxMonsters caps the total count (0 = no normal monsters, boss-only encounter).
function _egBuildNormalSpawnList(baseLevel) {
    const cap = (cur.maxMonsters != null && cur.maxMonsters >= 0) ? cur.maxMonsters : Infinity;
    if (cap === 0) return [];

    // Explicit list provided by the level definition
    if (cur.monsters && cur.monsters.length > 0) {
        return cur.monsters.slice(0, cap).map(entry => ({
            id: entry.id,
            level: entry.level != null ? entry.level : _egRollMonsterLevel(baseLevel),
        }));
    }

    // No list — pick a random subset of all non-boss monster defs
    const allNonBoss = Object.values(EG_MONSTER_DEFS).filter(d => !d.isBoss);
    if (allNonBoss.length === 0) return [];

    const shuffled = [...allNonBoss].sort(() => Math.random() - 0.5);
    const maxCount = Math.min(cap, shuffled.length);
    const count = 1 + Math.floor(Math.random() * maxCount);
    return shuffled.slice(0, count).map(d => ({ id: d.id, level: _egRollMonsterLevel(baseLevel) }));
}

// Builds the boss part of the spawn list for this encounter.
// Uses cur.bosses (explicit list) or picks one random boss if cur.hasBoss is true.
// cur.maxBosses caps the count (defaults to 1).
function _egBuildBossSpawnList(baseLevel) {
    const hasBossFlag = cur.hasBoss;
    const explicitBosses = cur.bosses && cur.bosses.length > 0;
    if (!hasBossFlag && !explicitBosses) return [];

    const bossCap = (cur.maxBosses != null && cur.maxBosses > 0) ? cur.maxBosses : 1;

    if (explicitBosses) {
        return cur.bosses.slice(0, bossCap).map(entry => ({
            id: entry.id,
            level: entry.level != null ? entry.level : _egRollMonsterLevel(baseLevel),
            isBossSpawn: true,
        }));
    }

    // hasBoss = true but no explicit list — pick one random boss def
    const allBossDefs = Object.values(EG_MONSTER_DEFS).filter(d => d.isBoss);
    if (allBossDefs.length === 0) return [];

    const picked = allBossDefs[Math.floor(Math.random() * allBossDefs.length)];
    return [{ id: picked.id, level: _egRollMonsterLevel(baseLevel), isBossSpawn: true }];
}

// Returns the full ordered spawn list for this encounter:
// normal monsters first (in order), then bosses appended at the end.
function _egBuildSpawnList() {
    const baseLevel = (cur.monsterLevel != null && cur.monsterLevel > 0) ? cur.monsterLevel : 1;
    const normalList = _egBuildNormalSpawnList(baseLevel);
    const bossList = _egBuildBossSpawnList(baseLevel);
    return [...normalList, ...bossList];
}


//------------------------------------------------------------------------
//-------------------ENCOUNTER LIFECYCLE----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Queues all monsters in spawnList with staggered appearance delays.
// The first 1–2 entries appear almost immediately; the rest are spread
// 4–10 seconds apart so the encounter ramps up gradually.
function _egScheduleMonsterSpawns(spawnList) {
    if (spawnList.length === 0) return;

    const immediateCount = Math.min(spawnList.length, 1 + Math.floor(Math.random() * 2));
    let cumulativeDelay = 0;

    spawnList.forEach((entry, i) => {
        let delay;
        if (i < immediateCount) {
            // Tiny stagger so the first batch doesn't all land simultaneously
            delay = 500 + i * 200;
        } else {
            cumulativeDelay += 4000 + Math.random() * 6000;
            delay = cumulativeDelay;
        }

        const t = setTimeout(() => {
            if (_egIsActive()) _egSpawnMonster(entry.id, entry.level || 1);
        }, delay);
        _egSpawnTimers.push(t);
    });
}

// Hides the monster panel and resets it to an empty state.
function _egHideMonsterPanel() {
    const panel = document.getElementById('eg-monster-panel');
    const wrapper = document.getElementById('eg-monster-wrapper');
    if (panel) panel.innerHTML = '';
    if (wrapper) wrapper.classList.add('eg-hidden');
}

// Initialises and begins a full monster encounter for the current level.
// Called from start-level.js or equivalent when cur.isMonsterLevel is true.
function _egStartEncounter() {
    _egEncounterActive = true;
    _egTargetId = null;
    _egMonsters = [];

    _egRenderPanel();

    if (_egTickInterval) clearInterval(_egTickInterval);
    _egTickInterval = setInterval(_egTickLoop, 100);

    _egStartPickupSpawner();
    _egScheduleMonsterSpawns(_egBuildSpawnList());
}

// Tears down a running encounter and cleans up all state and DOM.
// Safe to call even if no encounter is active.
function _egStopEncounter() {
    _egEncounterActive = false;
    _egMonsters = [];
    _egTargetId = null;

    if (_egTickInterval) { clearInterval(_egTickInterval); _egTickInterval = null; }

    _egSpawnTimers.forEach(t => clearTimeout(t));
    _egSpawnTimers = [];

    _egStopPickupSpawner();
    _egBossCleanupAll();
    _egHideMonsterPanel();
}


//------------------------------------------------------------------------
//-------------------COMBAT TICK LOOP-------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Runs at 10Hz. Advances every monster's charge bar and fires their attack
// when the bar fills. Also calls _egBossTick for any future per-tick boss logic.
function _egTickLoop() {
    if (!_egIsActive()) return;
    if (typeof dead !== 'undefined' && dead) return;
    if (typeof _gamePaused !== 'undefined' && _gamePaused) return;

    _egBossTick();

    _egMonsters.forEach(m => {
        m.currentCharge += 0.1; // 0.1 seconds per tick at 10Hz
        if (m.currentCharge >= m.chargeMax) {
            m.currentCharge = 0;
            _egFireMonsterAttack(m);
        }
    });

    _egUpdateBars();
}


//------------------------------------------------------------------------
//-------------------MONSTER ATTACKS (Monster → Player)-------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Flashes the monster's card to signal it is attacking.
function _egFlashMonsterAttackCard(monster) {
    const card = document.getElementById(`eg-card-${monster.id}`);
    if (!card) return;
    card.classList.remove('eg-flash-attack');
    void card.offsetWidth; // force reflow so the CSS animation restarts
    card.classList.add('eg-flash-attack');
}

// Applies hit-feedback to the player HUD on projectile impact:
// shows a floating damage number and briefly squishes + red-glows the HUD element.
function _egApplyPlayerHitFeedback(damageValue) {
    const hud = document.getElementById('class-hud-drag-handle');
    if (!hud) return;

    const dmgLabel = document.createElement('div');
    dmgLabel.className = 'eg-player-damage';
    dmgLabel.textContent = `-${damageValue}`;
    hud.appendChild(dmgLabel);
    setTimeout(() => dmgLabel.remove(), 500);

    hud.style.transform = 'scale(0.95)';
    hud.style.boxShadow = 'inset 0 0 15px rgba(255,0,0,0.8), 0 0 15px rgba(255,0,0,0.8)';
    setTimeout(() => { hud.style.transform = ''; hud.style.boxShadow = ''; }, 150);
}

// Fires the monster's attack: card flash + projectile animation → player damage on impact.
function _egFireMonsterAttack(monster) {
    _egFlashMonsterAttackCard(monster);
    _egAnimateMonsterProjectile(monster);
}

// Launches a projectile from the monster's card to the player HUD.
// Damage and hit-feedback are applied when the projectile arrives.
function _egAnimateMonsterProjectile(monster) {
    const sourceCard = document.getElementById(`eg-card-${monster.id}`);
    const targetHud = document.getElementById('class-hud-drag-handle');
    if (!sourceCard || !targetHud) return;

    const start = _egGetElementCentre(sourceCard);
    const end = _egGetElementCentre(targetHud);

    _egFireProjectile(monster.emoji, 'eg-proj-monster', start, end, 400, 'ease-in', () => {
        _egPlayerTakeDamage(monster.damageValue);
        _egApplyPlayerHitFeedback(monster.damageValue);
    });
}


//------------------------------------------------------------------------
//-------------------PLAYER ATTACKS (Player → Monster)--------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Tracks a correctly filled cell in the recent-fills circular buffer.
// Used by the Prior Bomb mechanic to undo recent progress.
function _egTrackRecentFill(row, col) {
    _egRecentFills.push([row, col]);
    if (_egRecentFills.length > EG_RECENT_FILLS_CAPACITY) _egRecentFills.shift();
}

// Entry point called from mouse-button-handlers.js on every correct cell fill.
// Calculates damage, snapshots the current target (so mid-flight target changes
// don't redirect the projectile), then launches the player's projectile.
function _egOnCorrectCell(row, col) {
    if (!_egIsActive()) return;

    if (row !== undefined && col !== undefined) _egTrackRecentFill(row, col);

    const damage = _egCalcPlayerDamage();
    const targetIdAtFire = _egTargetId; // snapshot before animation completes
    _egAnimatePlayerProjectile(damage, targetIdAtFire);
}

// Launches a projectile from the player HUD to the targeted monster card.
// If the target card is not visible (e.g. monster not yet rendered), damage
// is applied immediately without animation so no hits are lost.
function _egAnimatePlayerProjectile(damage, targetId) {
    const sourceHud = document.getElementById('class-hud-drag-handle');
    const targetCard = targetId ? document.getElementById(`eg-card-${targetId}`) : null;

    if (!sourceHud || !targetCard) {
        // No visual target — apply damage instantly
        if (damage != null) _egDamageTargetById(targetId, damage);
        return;
    }

    const start = _egGetElementCentre(sourceHud);
    const end = _egGetElementCentre(targetCard);
    const projDef = _egGetProjectileDef();

    _egFireProjectile(projDef.emoji, projDef.cssClass, start, end, projDef.duration, projDef.easing, () => {
        _egDamageTargetById(targetId, damage);
    });
}


//------------------------------------------------------------------------
//-------------------TARGETING--------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns the currently targeted monster object, or null if none.
function _egGetTarget() {
    if (!_egTargetId) return null;
    return _egMonsters.find(m => m.id === _egTargetId) || null;
}

// Sets the player's target to the given monster id and refreshes the panel.
// Called by onclick on the monster cards in the rendered panel HTML.
function _egSelectTarget(monsterId) {
    if (!_egIsActive()) return;
    _egTargetId = monsterId;
    _egRenderPanel();
}

// Convenience wrapper — damages the currently selected target.
// Kept for any legacy callers that don't pass an explicit id.
function _egDamageTarget(amount) {
    _egDamageTargetById(_egTargetId, amount);
}


//------------------------------------------------------------------------
//-------------------DAMAGE APPLICATION-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Applies incoming player damage to a specific monster by id.
// Handles boss immunity, charge pushback, phase transition checks, and kill detection.
// Called by the projectile onfinish callback so the impact moment matches visually.
function _egDamageTargetById(monsterId, amount) {
    if (!_egIsActive()) return;

    const target = _egMonsters.find(m => m.id === monsterId);
    if (!target) return;

    // Boss immunity window — ignore damage and show the immune flash
    if (target.bossImmune) {
        _egFlashImmune(target.id);
        return;
    }

    // Apply damage and charge pushback
    target.currentHP = Math.max(0, target.currentHP - amount);
    target.currentCharge = Math.max(0, target.currentCharge - EG_PLAYER_STATS.chargePushback);

    _egShowDamageNumber(target.id, amount);
    _egFlashDamageCard(target.id);

    // Check for boss phase transition before checking death
    if (target.isBoss) _egBossCheckPhase(target);

    if (target.currentHP <= 0) {
        _egKillMonster(target.id);
        return;
    }
    _egUpdateBars();
}

// Applies incoming monster damage to the player.
// Triggers the game-over sequence if the player's HP reaches zero.
function _egPlayerTakeDamage(amount) {
    if (!_egIsActive()) return;
    playerCurrentHP = Math.max(0, playerCurrentHP - amount);
    _renderPlayerHealth();
    if (playerCurrentHP <= 0) _egGameOver();
}


//------------------------------------------------------------------------
//-------------------MONSTER LIFECYCLE------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Removes a monster from the encounter after its death animation fires.
// If more monsters remain, auto-targets the first one.
// If none remain, triggers the wave-clear sequence.
function _egKillMonster(monsterId) {
    _egBossCleanup(monsterId);
    _egFlashKillCard(monsterId);
    _egMonsters = _egMonsters.filter(m => m.id !== monsterId);

    if (_egMonsters.length > 0) {
        _egTargetId = _egMonsters[0].id;
    } else {
        _egTargetId = null;
        _egOnAllMonstersDead();
    }

    // Small delay so the death flash is visible before the card disappears
    setTimeout(() => _egRenderPanel(), 350);
}

// Called when the last monster in the encounter is killed.
function _egOnAllMonstersDead() {
    if (typeof showToast === 'function') {
        showToast('⚔️ All monsters defeated! Wave cleared.');
    }
}

// Triggers the game-over sequence when the player's HP reaches zero.
function _egGameOver() {
    _egStopEncounter();
    dead = true;
    stopTimer();
    document.getElementById('lose-title').textContent = 'Game Over';
    document.getElementById('lose-sub').textContent = 'The monsters overwhelmed you!';
    document.getElementById('ov-lose').classList.add('show');
}

// Adds a monster to the live encounter and notifies the player.
// Handles boss-specific initialisation if the spawned monster is a boss.
function _egSpawnMonster(defId, level) {
    const monster = _egBuildMonster(defId, level);
    if (!monster) return;

    _egMonsters.push(monster);
    if (!_egTargetId) _egTargetId = monster.id; // auto-target first monster to arrive
    _egRenderPanel();

    if (typeof showToast !== 'function') return;

    if (monster.isBoss) {
        showToast(`💀 BOSS: ${monster.name} has arrived!`);
        _egBossInit(monster);
    } else {
        showToast(`⚠️ ${monster.name} appeared!`);
    }
}


//------------------------------------------------------------------------
//-------------------VISUAL EFFECTS---------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Appends a floating "-N" damage number to the monster's card that fades out.
function _egShowDamageNumber(monsterId, amount) {
    const card = document.getElementById(`eg-card-${monsterId}`);
    if (!card) return;

    const dmgText = document.createElement('div');
    dmgText.className = 'eg-damage-number';
    dmgText.textContent = `-${amount}`;
    card.appendChild(dmgText);
    setTimeout(() => dmgText.remove(), 600);
}

// Triggers the damage flash CSS animation on the monster's card.
// The class is removed and re-added to restart the animation every hit.
function _egFlashDamageCard(monsterId) {
    const card = document.getElementById(`eg-card-${monsterId}`);
    if (!card) return;
    card.classList.remove('eg-flash-damage');
    void card.offsetWidth; // force reflow to restart the animation
    card.classList.add('eg-flash-damage');
}

// Adds the kill flash class to the monster's card (plays the death animation).
function _egFlashKillCard(monsterId) {
    const card = document.getElementById(`eg-card-${monsterId}`);
    if (card) card.classList.add('eg-flash-kill');
}

// Shows the IMMUNE label and flashes the immunity animation on the monster's card.
function _egFlashImmune(monsterId) {
    const card = document.getElementById(`eg-card-${monsterId}`);
    if (!card) return;

    card.classList.remove('eg-flash-immune');
    void card.offsetWidth;
    card.classList.add('eg-flash-immune');
    setTimeout(() => card.classList.remove('eg-flash-immune'), 400);

    const label = document.createElement('div');
    label.className = 'eg-damage-number eg-immune-label';
    label.textContent = 'IMMUNE';
    card.appendChild(label);
    setTimeout(() => label.remove(), 700);
}


//------------------------------------------------------------------------
//-------------------RENDER-----------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns the CSS class for an HP bar based on the percentage remaining.
function _egHpBarClass(hpPct) {
    if (hpPct > 60) return 'eg-hp-high';
    if (hpPct > 30) return 'eg-hp-mid';
    return 'eg-hp-low';
}

// Builds the badge HTML for a monster's name row (level, boss phase, immune, target).
function _egBuildMonsterBadgesHTML(m, isTarget) {
    let html = `<span class="eg-level-badge">Lv ${m.level}</span>`;
    if (m.isBoss && m.bossPhase)
        html += `<span class="eg-boss-phase-badge eg-boss-phase-${m.bossPhase}">Phase ${m.bossPhase}</span>`;
    if (m.bossImmune)
        html += `<span class="eg-boss-immune-badge">IMMUNE</span>`;
    if (isTarget)
        html += `<span class="eg-target-badge">TARGET</span>`;
    return html;
}

// Builds the full HTML string for one monster card in the panel.
function _egBuildMonsterCardHTML(m) {
    const hpPct = Math.max(0, Math.round((m.currentHP / m.maxHP) * 100));
    const chargePct = Math.min(100, Math.max(0, (m.currentCharge / m.chargeMax) * 100));
    const isTarget = (m.id === _egTargetId);
    const barClass = _egHpBarClass(hpPct);
    const badges = _egBuildMonsterBadgesHTML(m, isTarget);

    return `
    <div class="eg-monster-card ${isTarget ? 'eg-targeted' : ''}"
         id="eg-card-${m.id}"
         onclick="_egSelectTarget('${m.id}')">

        <div class="eg-monster-top">
            <span class="eg-monster-emoji">${m.emoji}</span>
            <div class="eg-monster-info">
                <div class="eg-monster-name">${m.name} ${badges}</div>
                <div class="eg-hp-label" id="eg-hp-label-${m.id}">${m.currentHP} / ${m.maxHP} HP</div>
            </div>
        </div>

        <div class="eg-hp-track">
            <div class="eg-hp-bar ${barClass}" id="eg-hp-bar-${m.id}" style="width:${hpPct}%"></div>
        </div>

        <div class="eg-charge-track">
            <div class="eg-charge-bar" id="eg-charge-bar-${m.id}" style="width:${chargePct}%"></div>
        </div>

    </div>`;
}

// High-frequency bar update (10Hz). Only touches bar widths and HP text —
// no DOM rebuilds. Keeps the tick loop cheap.
function _egUpdateBars() {
    if (!_egIsActive()) return;
    _egMonsters.forEach(m => {
        const hpPct = Math.max(0, Math.round((m.currentHP / m.maxHP) * 100));
        const chargePct = Math.min(100, Math.max(0, (m.currentCharge / m.chargeMax) * 100));

        const hpBar = document.getElementById(`eg-hp-bar-${m.id}`);
        const chargeBar = document.getElementById(`eg-charge-bar-${m.id}`);
        const hpLabel = document.getElementById(`eg-hp-label-${m.id}`);

        if (hpBar) { hpBar.style.width = hpPct + '%'; hpBar.className = `eg-hp-bar ${_egHpBarClass(hpPct)}`; }
        if (chargeBar) chargeBar.style.width = chargePct + '%';
        if (hpLabel) hpLabel.textContent = `${m.currentHP} / ${m.maxHP} HP`;
    });
}

// Full panel rebuild. Only called on spawn, death, or target change —
// never from the tick loop.
function _egRenderPanel() {
    const panel = document.getElementById('eg-monster-panel');
    const wrapper = document.getElementById('eg-monster-wrapper');
    if (!panel || !wrapper) return;

    if (!_egIsActive() || _egMonsters.length === 0) {
        wrapper.classList.add('eg-hidden');
        panel.innerHTML = '';
        return;
    }

    wrapper.classList.remove('eg-hidden');
    panel.innerHTML = _egMonsters.map(_egBuildMonsterCardHTML).join('');
}


//------------------------------------------------------------------------
//-------------------BOSS ENGINE------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Hook called from _egTickLoop every 10Hz.
// Currently a no-op — exists as an extension point for future per-tick boss logic.
function _egBossTick() {
    // Nothing needed here yet.
}

// Attaches boss runtime state to a newly spawned boss monster object
// and kicks off its phase 1 mechanics.
function _egBossInit(monster) {
    const def = EG_BOSS_MECHANICS[monster.id];
    if (!def) return; // not all bosses need special mechanics

    monster.bossPhase = 1;
    monster.bossImmune = false;
    monster.bossDef = def;
    monster.bossBaseDamage = monster.damageValue; // store base so phases can scale it

    _egBossTimers[monster.id] = [];
    _egBossScheduleMechanics(monster, 1);
}

// Cancels all mechanic timers for a specific boss and cleans up any
// active field effects it created (corrupted cells, veil, blackout).
function _egBossCleanup(monsterId) {
    const timers = _egBossTimers[monsterId];
    if (timers) {
        timers.forEach(t => { clearTimeout(t); clearInterval(t); });
        delete _egBossTimers[monsterId];
    }
    _egClearAllCorruptedCells();
    _egRemoveVeil();
    _egRemoveBlackout();
}

// Cleans up all tracked bosses at once. Called on encounter stop.
function _egBossCleanupAll() {
    Object.keys(_egBossTimers).forEach(id => _egBossCleanup(id));
}


//------------------------------------------------------------------------
//-------------------BOSS PHASE TRANSITIONS-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Determines which phase the boss should be in based on current HP%.
// Returns the target phase number (1-indexed).
function _egBossCalcTargetPhase(monster) {
    const hpPct = monster.currentHP / monster.maxHP;
    const phases = monster.bossDef.phases;
    let targetPhase = 1;
    for (let i = phases.length - 1; i >= 0; i--) {
        if (hpPct <= phases[i].threshold && i > 0) {
            targetPhase = i + 1;
            break;
        }
    }
    return targetPhase;
}

// Applies the stat changes for a new boss phase to the monster object.
// (chargeMax, damageValue). Does not touch timers or UI.
function _egBossApplyPhaseStats(monster, newPhase) {
    const phaseData = monster.bossDef.phases[newPhase - 1];
    monster.bossPhase = newPhase;
    monster.bossImmune = true;
    monster.chargeMax = phaseData.chargeMax;
    monster.damageValue = Math.round(monster.bossBaseDamage * phaseData.damageMultiplier);
}

// Cancels existing mechanic timers for a boss so they can be rescheduled
// at the new phase's speed when the immunity window expires.
function _egBossClearMechanicTimers(monster) {
    const timers = _egBossTimers[monster.id] || [];
    timers.forEach(t => { clearTimeout(t); clearInterval(t); });
    _egBossTimers[monster.id] = [];
}

// Shows the phase transition toast and triggers the transition CSS animation on the card.
function _egBossPlayTransitionFeedback(monster, newPhase) {
    const label = EG_BOSS_PHASE_NAMES[newPhase] || `Phase ${newPhase}`;
    showToast(`⚡ ${monster.name}: ${label}!`);

    const card = document.getElementById(`eg-card-${monster.id}`);
    if (card) {
        card.classList.add('eg-boss-transition');
        setTimeout(() => card.classList.remove('eg-boss-transition'), 1500);
    }
}

// Orchestrates a full boss phase transition:
//   1. Applies stat changes
//   2. Cancels old mechanic timers
//   3. Plays feedback (toast + card flash)
//   4. Waits for the immunity window, then re-schedules mechanics at new phase speed
function _egBossTransition(monster, newPhase) {
    _egBossApplyPhaseStats(monster, newPhase);
    _egBossClearMechanicTimers(monster);
    _egBossPlayTransitionFeedback(monster, newPhase);
    _egRenderPanel();

    setTimeout(() => {
        monster.bossImmune = false;
        _egBossScheduleMechanics(monster, newPhase);
        _egRenderPanel();
    }, monster.bossDef.immunityDuration);
}

// Checks whether a damage hit should trigger a phase transition and, if so, fires it.
// Called after every hit on a boss. No-op during existing immunity windows.
function _egBossCheckPhase(monster) {
    if (!monster.bossDef || monster.bossImmune) return;

    const targetPhase = _egBossCalcTargetPhase(monster);
    if (targetPhase > monster.bossPhase) {
        _egBossTransition(monster, targetPhase);
    }
}


//------------------------------------------------------------------------
//-------------------BOSS MECHANIC SCHEDULING-----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns the delay (ms) for the next trigger of a mechanic at the given phase.
// Higher phases reduce the interval by 20% per phase above 1, capped at 5s minimum.
function _egCalcMechanicInterval(mech, phase) {
    const speedFactor = 1 - (phase - 1) * 0.20;
    const rawInterval = mech.intervalBase
        + (Math.random() * mech.intervalVariance - mech.intervalVariance / 2);
    return Math.max(5000, rawInterval * speedFactor);
}

// Schedules a single mechanic for the given boss at the given phase.
// Self-reschedules after each trigger so the mechanic keeps firing until the boss dies.
function _egBossScheduleSingleMechanic(monster, mech, phase) {
    // phase2Only mechanics are skipped unless we're already in phase 2 or later
    if (mech.phase2Only && phase < 2) return;

    const scheduleNext = () => {
        // Bail out if the encounter ended or this boss is already dead
        if (!_egIsActive() || !_egMonsters.find(m => m.id === monster.id)) return;

        const interval = _egCalcMechanicInterval(mech, phase);
        const t = setTimeout(() => {
            const stillAlive = _egIsActive() && _egMonsters.find(m => m.id === monster.id);
            if (stillAlive && !monster.bossImmune) {
                const fn = window[mech.handler];
                if (typeof fn === 'function') fn(monster, phase);
            }
            scheduleNext();
        }, interval);

        if (_egBossTimers[monster.id]) _egBossTimers[monster.id].push(t);
    };

    // Stagger the very first trigger so all mechanics don't fire simultaneously on spawn
    const initialDelay = 4000 + Math.random() * 8000;
    const t0 = setTimeout(scheduleNext, initialDelay);
    if (_egBossTimers[monster.id]) _egBossTimers[monster.id].push(t0);
}

// Schedules all mechanics defined for a boss at the given phase.
// Called on boss spawn (phase 1) and again after each phase transition.
function _egBossScheduleMechanics(monster, phase) {
    const def = monster.bossDef;
    if (!def) return;
    def.mechanics.forEach(mech => _egBossScheduleSingleMechanic(monster, mech, phase));
}


//------------------------------------------------------------------------
//-------------------BOSS MECHANIC: CORRUPT CELLS-------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
// Selects 2 (phase 1) or 3 (phase 2+) random correct unfilled cells and
// covers them with a 🚫 corruption overlay. The player must click the cell
// once to dispel it before they can fill it. Corrupted cells auto-expire.

// Returns all grid cells that are valid targets for the Corrupt Cells mechanic.
// Only targets correct cells (sol=1) that the player hasn't already filled or revealed.
function _egBuildCorruptibleCellPool() {
    if (!cur || !cur.grid) return [];
    const sol = cur.grid;
    const rows = sol.length;
    const cols = sol[0].length;
    const pool = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] !== 1) continue; // only corrupt correct cells
            if (userGrid[r][c] === 1 || revealedGrid[r][c]) continue; // already filled
            if (_egBossCorrupted.has(`${r}-${c}`)) continue; // already corrupted
            pool.push([r, c]);
        }
    }
    return pool;
}

// Places the 🚫 corruption overlay on a cell and registers its expiry timer.
function _egApplyCellCorruption(r, c) {
    const key = `${r}-${c}`;
    const el = document.getElementById(`g-${r}-${c}`);
    if (!el) return;

    const overlay = document.createElement('span');
    overlay.className = 'eg-corrupt-overlay';
    overlay.id = `eg-corrupt-${r}-${c}`;
    overlay.textContent = '🚫';
    el.appendChild(overlay);

    const expireTimer = setTimeout(() => _egRemoveCellCorruption(key), EG_CORRUPT_CELL_LIFETIME_MS);
    _egBossCorrupted.set(key, { timer: expireTimer });
}

// Removes the corruption overlay from the DOM and clears its state entry.
function _egRemoveCellCorruption(key) {
    const [r, c] = key.split('-').map(Number);
    const span = document.getElementById(`eg-corrupt-${r}-${c}`);
    if (span) span.remove();
    _egBossCorrupted.delete(key);
}

// Removes all currently active corrupted cells.
// Called on boss death or encounter stop to avoid leaving orphaned overlays.
function _egClearAllCorruptedCells() {
    _egBossCorrupted.forEach((data, key) => {
        clearTimeout(data.timer);
        _egRemoveCellCorruption(key);
    });
    _egBossCorrupted.clear();
}

// Returns true if the cell at (row, col) currently has an active corruption overlay.
// Called from mouse-button-handlers.js before allowing a cell fill.
function _egIsCellCorrupted(row, col) {
    return _egBossCorrupted.has(`${row}-${col}`);
}

// Dispels the corruption on a cell when the player clicks it.
// Returns true if the cell was corrupted (caller should block the normal fill action
// and require a second click to actually fill).
function _egDispelCorruption(row, col) {
    const key = `${row}-${col}`;
    if (!_egBossCorrupted.has(key)) return false;

    clearTimeout(_egBossCorrupted.get(key).timer);
    _egRemoveCellCorruption(key);
    showToast('✨ Corruption dispelled!');
    return true;
}

// Boss mechanic handler — called by the boss mechanic scheduler.
// Corrupts 2 (phase 1) or 3 (phase 2+) random eligible cells.
function _egMechCorruptCells(monster, phase) {
    const pool = _egBuildCorruptibleCellPool();
    if (pool.length === 0) return;

    const count = phase >= 2 ? 3 : 2;
    const targets = pool.sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));

    showToast(`🧿 Null Hypothesis: Corrupted ${targets.length} cell(s)!`);
    targets.forEach(([r, c]) => _egApplyCellCorruption(r, c));
}


//------------------------------------------------------------------------
//-------------------BOSS MECHANIC: CLUE BLACKOUT-------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
// Hides all row and column clue numbers for 8s (phases 1–2) or 12s (phase 3).
// The puzzle remains fully playable — only the clue numbers are obscured.

// Hides all clue spans and stores their original text so it can be restored.
function _egApplyBlackout() {
    document.querySelectorAll('[id^="rn-"], [id^="cn-"]').forEach(span => {
        span.dataset.origText = span.textContent;
        span.textContent = '?';
        span.classList.add('eg-blackout-clue');
    });
}

// Restores all clue spans to their original text and removes the blackout styling.
function _egRemoveBlackout() {
    if (!_egBlackoutActive) return;
    _egBlackoutActive = false;
    document.querySelectorAll('[id^="rn-"], [id^="cn-"]').forEach(span => {
        if (span.dataset.origText !== undefined) {
            span.textContent = span.dataset.origText;
            delete span.dataset.origText;
        }
        span.classList.remove('eg-blackout-clue');
    });
}

// Boss mechanic handler — activates the Clue Blackout for the appropriate duration.
// Silently exits if a blackout is already in progress (prevent stacking).
function _egMechClueBlackout(monster, phase) {
    if (_egBlackoutActive) return;
    _egBlackoutActive = true;

    const duration = phase >= 3 ? 12000 : 8000;
    showToast(`🧿 Null Hypothesis: Clue Blackout! (${duration / 1000}s)`);
    _egApplyBlackout();
    setTimeout(() => _egRemoveBlackout(), duration);
}


//------------------------------------------------------------------------
//-------------------BOSS MECHANIC: PROBABILITY SHIFT---------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
// Randomly un-marks 2 (phase 1) or 3 (phase 2+) cells the player has
// correctly marked as ✕, removing that completed work.

// Returns all cells the player has correctly marked as ✕ (userGrid=2, sol=0).
function _egBuildProbabilityShiftPool() {
    if (!cur || !cur.grid) return [];
    const sol = cur.grid;
    const rows = sol.length;
    const cols = sol[0].length;
    const pool = [];
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (sol[r][c] === 0 && userGrid[r][c] === 2 && !wrongGrid[r][c])
                pool.push([r, c]);
    return pool;
}

// Boss mechanic handler — erases 2 or 3 player marks from the grid.
function _egMechProbabilityShift(monster, phase) {
    const pool = _egBuildProbabilityShiftPool();
    if (pool.length === 0) return;

    const count = phase >= 2 ? 3 : 2;
    const targets = pool.sort(() => Math.random() - 0.5).slice(0, Math.min(count, pool.length));

    showToast(`🔮 Grand Prior: Probability Shift! ${targets.length} mark(s) erased!`);
    targets.forEach(([r, c]) => {
        userGrid[r][c] = 0;
        renderCell(r, c);
    });
}


//------------------------------------------------------------------------
//-------------------BOSS MECHANIC: PRIOR BOMB----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
// Un-fills 1 (phase 1) or 2 (phase 2+) recently filled correct cells,
// forcing the player to re-fill them. Picks the most recently filled cells first.

// Removes a specific [row, col] entry from the recent-fills tracker.
function _egRemoveFromRecentFills(row, col) {
    const idx = _egRecentFills.findIndex(([fr, fc]) => fr === row && fc === col);
    if (idx !== -1) _egRecentFills.splice(idx, 1);
}

// Plays the burst visual on a cell unfilled by Prior Bomb.
function _egFlashPriorBombCell(row, col) {
    const el = document.getElementById(`g-${row}-${col}`);
    if (!el) return;
    el.classList.add('eg-prior-bomb-flash');
    setTimeout(() => el.classList.remove('eg-prior-bomb-flash'), 600);
}

// Unfills a single cell and removes it from the recent-fills tracker.
function _egUnfillCell(row, col) {
    userGrid[row][col] = 0;
    _egRemoveFromRecentFills(row, col);
    renderCell(row, col);
    updClues(row, col);
    _egFlashPriorBombCell(row, col);
}

// Boss mechanic handler — unfills 1 or 2 of the most recently filled cells.
function _egMechPriorBomb(monster, phase) {
    if (!cur || !cur.grid) return;
    const sol = cur.grid;

    // Build pool from most-recent fills, filtering cells already cleared
    const pool = [..._egRecentFills].reverse().filter(([r, c]) =>
        userGrid[r][c] === 1 && !revealedGrid[r][c] && sol[r][c] === 1
    );
    if (pool.length === 0) return;

    const count = phase >= 2 ? 2 : 1;
    const targets = pool.slice(0, Math.min(count, pool.length));

    showToast(`🔮 Grand Prior: Prior Bomb! ${targets.length} cell(s) unfilled!`);
    targets.forEach(([r, c]) => _egUnfillCell(r, c));
}


//------------------------------------------------------------------------
//-------------------BOSS MECHANIC: GRID VEIL-----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
// Activates on boss_bayes phase 2. Overlays the puzzle grid with a
// translucent animated veil. The puzzle remains fully playable.

// Creates and shows the veil overlay element over the puzzle table.
function _egActivateVeil() {
    _egVeilActive = true;
    const tbl = document.getElementById('ptable');
    if (!tbl) return;
    const parent = tbl.parentElement;
    if (!parent) return;

    let veil = document.getElementById('eg-grid-veil');
    if (!veil) {
        veil = document.createElement('div');
        veil.id = 'eg-grid-veil';
        veil.className = 'eg-grid-veil';
        parent.style.position = 'relative';
        parent.appendChild(veil);
    }
    veil.classList.remove('eg-hidden');
    showToast('🔮 Grand Prior: The Veil descends…');
}

// Removes the veil overlay element entirely.
function _egRemoveVeil() {
    _egVeilActive = false;
    const veil = document.getElementById('eg-grid-veil');
    if (veil) veil.remove();
}

// Boss mechanic handler — activates the Grid Veil if it isn't already active.
function _egMechGridVeil(monster, phase) {
    if (_egVeilActive) return;
    _egActivateVeil();
}