//------------------------------------------------------------------------
//-------------------CONSTANTS & DATA DEFINITIONS-------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Pickup spawner timing 
const EG_PICKUP_SPAWN_INTERVAL_MIN = 8000;  // ms minimum between spawn attempts
const EG_PICKUP_SPAWN_INTERVAL_MAX = 18000; // ms maximum between spawn attempts
const EG_PICKUP_MAX_ON_BOARD = 1;     // hard cap on simultaneous pickups
const EG_PICKUP_LIFETIME_MS = 20000; // ms before an uncollected pickup disappears










// Pickup definitions
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


// Plays a broken-heart burst animation over the cell when a pickup is discarded via wrong input.
function _egAnimatePickupDiscard(row, col, def) {
    const el = document.getElementById(`g-${row}-${col}`);
    if (!el) return;
    const centre = _egGetElementCentre(el);

    // Left shard
    const left = document.createElement('div');
    left.className = 'eg-pickup-broken-shard eg-pickup-broken-left';
    left.textContent = def.emoji;
    left.style.left = `${centre.x}px`;
    left.style.top = `${centre.y}px`;
    document.body.appendChild(left);

    // Right shard
    const right = document.createElement('div');
    right.className = 'eg-pickup-broken-shard eg-pickup-broken-right';
    right.textContent = def.emoji;
    right.style.left = `${centre.x}px`;
    right.style.top = `${centre.y}px`;
    document.body.appendChild(right);

    setTimeout(() => { left.remove(); right.remove(); }, 700);
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

// Called when the player makes the CORRECT action on a cell.
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





// Called when the player makes the WRONG action on a cell that has a pickup.
// (correct cell + right-click, or wrong cell + left-click)
// Silently discards the pickup — no reward, no animation.
function _egDiscardPickup(row, col) {
    if (!_egIsActive()) return;
    const key = `${row}-${col}`;
    if (!_egPickups.has(key)) return;
    const def = _egPickups.get(key);   // capture def before deleting
    _egPickups.delete(key);
    _egRemovePickupOverlay(key);
    _egAnimatePickupDiscard(row, col, def); 
}

