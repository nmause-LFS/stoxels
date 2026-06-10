//------------------------------------------------------------------------//
//-------------------ENDGAME HUB SCREEN-----------------------------------//
//------------------------------------------------------------------------//
// Handles the Endgame Hub UI: map device slot, Character panel,
// and dedicated endgame stash system.
//------------------------------------------------------------------------//

//------------------------------------------------------------------------//
//-------------------CONSTANTS--------------------------------------------//
//------------------------------------------------------------------------//
const EG_EQUIP_SLOTS = [
    // Left column (top → bottom)
    { id: 'head', label: 'Head', col: 'left' },
    { id: 'amulet', label: 'Amulet', col: 'left' },
    { id: 'shoulders', label: 'Shoulders', col: 'left' },
    { id: 'cloak', label: 'Cloak', col: 'left' },
    { id: 'chest', label: 'Chest', col: 'left' },
    { id: 'bracers', label: 'Bracers', col: 'left' },


    // Right column (top → bottom)
    { id: 'gloves', label: 'Gloves', col: 'right' },
    { id: 'belt', label: 'Belt', col: 'right' },
    { id: 'pants', label: 'Pants', col: 'right' },
    { id: 'boots', label: 'Boots', col: 'right' },
    { id: 'ring1', label: 'Ring', col: 'right' },
    { id: 'ring2', label: 'Ring', col: 'right' },
    { id: 'trinket1', label: 'Trinket', col: 'right' },
    { id: 'trinket2', label: 'Trinket', col: 'right' },


    // Bottom row
    { id: 'weapon1', label: 'Weapon', col: 'bottom' },
    { id: 'weapon2', label: 'Off-Hand', col: 'bottom' },
    { id: 'ranged', label: 'Ranged', col: 'bottom' },
];

const EG_INV_ROWS = 5;
const EG_INV_COLS = 16;

const EG_CURRENCY_ROWS = 8;
const EG_CURRENCY_COLS = 4;

const EG_MAP_STASH_ROWS = 8;
const EG_MAP_STASH_COLS = 2;

//------------------------------------------------------------------------//
//-------------------STATE CHANNELS---------------------------------------//
//------------------------------------------------------------------------//
let _egInventory = Array.from({ length: EG_INV_ROWS }, () => Array(EG_INV_COLS).fill(null));
let _egEquipped = {};
let _egMapSlotItem = null;
let _egCurrencyStash = Array.from({ length: EG_CURRENCY_ROWS }, () => Array(EG_CURRENCY_COLS).fill(null));
let _egMapStash = Array.from({ length: EG_MAP_STASH_ROWS }, () => Array(EG_MAP_STASH_COLS).fill(null));

// Drag and drop tracking
let _egDragSource = null; // { type: 'inv'|'equip'|'map', row?, col?, slotId? }
let _egDragItem = null; // Item context payload

//------------------------------------------------------------------------//
//-------------------SCREEN BOOTSTRAP------------------------------------//
//------------------------------------------------------------------------//
function ensureEndgameHubScreen() {
    if (document.getElementById('screen-endgame-hub')) return;

    const screen = document.createElement('div');
    screen.id = 'screen-endgame-hub';
    screen.className = 'screen';
    screen.innerHTML = buildEndgameHubHTML();
    document.body.appendChild(screen);

    _egBindEvents();
}

function showEndgameHub() {
    ensureEndgameHubScreen();

    // Fallback if global engine state management wrapper doesn't exist yet
    if (typeof switchScreen === 'function') {
        switchScreen('screen-endgame-hub');
    } else {
        document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
        document.getElementById('screen-endgame-hub').style.display = 'block';
    }

    _egRenderAll();
}

// Safely handle exit routes
function safeGoToLevelSelect() {
    if (typeof goToLevelSelect === 'function') {
        goToLevelSelect();
    } else {
        console.warn("[EG] goToLevelSelect() is not declared. Redirecting to console fallback.");
        alert("Returning to level selection screen...");
    }
}

//------------------------------------------------------------------------//
//-------------------HTML GENERATORS--------------------------------------//
//------------------------------------------------------------------------//
function buildEndgameHubHTML() {
    return `
<div class="eg-hub-layout">
    <div class="eg-topbar">
        <button class="eg-back-btn" onclick="safeGoToLevelSelect()">◀ BACK</button>
        <span class="eg-topbar-title">⚔ ENDGAME HUB</span>
        <span class="eg-topbar-sub">World 13 · The Atlas</span>
    </div>

    <div class="eg-body">
        <div class="eg-body-top">

            <!-- LEFT: CHARACTER PANEL -->
            <div class="eg-panel eg-panel-char">
                <div class="eg-panel-label">CHARACTER</div>
                <div class="eg-char-panel">
                    <div class="eg-equip-col eg-equip-left" id="eg-equip-left">
                        ${buildEquipColHTML('left')}
                    </div>
                    <div class="eg-char-model-wrap">
                        <div class="eg-char-model" id="eg-char-model">
                            <div class="eg-char-silhouette">
                                <svg viewBox="0 0 80 160" xmlns="http://www.w3.org/2000/svg" class="eg-silhouette-svg">
                                    <circle cx="40" cy="18" r="12" fill="none" stroke="var(--eg-silhouette)" stroke-width="1.5"/>
                                    <line x1="40" y1="30" x2="40" y2="36" stroke="var(--eg-silhouette)" stroke-width="1.5"/>
                                    <path d="M16 44 Q40 36 64 44" fill="none" stroke="var(--eg-silhouette)" stroke-width="1.5"/>
                                    <path d="M16 44 L14 90 L30 90 L30 80 L50 80 L50 90 L66 90 L64 44 Z" fill="none" stroke="var(--eg-silhouette)" stroke-width="1.5"/>
                                    <path d="M16 44 L8 72 L16 76" fill="none" stroke="var(--eg-silhouette)" stroke-width="1.5"/>
                                    <path d="M64 44 L72 72 L64 76" fill="none" stroke="var(--eg-silhouette)" stroke-width="1.5"/>
                                    <path d="M30 90 L26 140 L34 140" fill="none" stroke="var(--eg-silhouette)" stroke-width="1.5"/>
                                    <path d="M50 90 L54 140 L46 140" fill="none" stroke="var(--eg-silhouette)" stroke-width="1.5"/>
                                    <path d="M14 90 Q40 100 66 90" fill="none" stroke="var(--eg-silhouette)" stroke-width="1" stroke-dasharray="3,2"/>
                                </svg>
                            </div>
                            <div class="eg-char-scanline"></div>
                        </div>
                        <div class="eg-equip-bottom-row" id="eg-equip-bottom">
                            ${buildEquipBottomHTML()}
                        </div>
                    </div>
                    <div class="eg-equip-col eg-equip-right" id="eg-equip-right">
                        ${buildEquipColHTML('right')}
                    </div>
                </div>
            </div>

            <!-- CENTER: CURRENCY STASH -->
            <div class="eg-panel eg-panel-currency">
                <div class="eg-panel-label">CURRENCY</div>
                <div class="eg-currency-grid" id="eg-currency-grid">
                    ${buildCurrencyGridHTML()}
                </div>
            </div>

            <!-- RIGHT: MAP DEVICE + MAP STASH -->
            <div class="eg-panel eg-panel-map">
                <div class="eg-panel-label">MAP DEVICE</div>
                <div class="eg-map-device">
                    <div class="eg-map-device-frame">
                        <div class="eg-map-orb-ring">
                            <div class="eg-map-orb-rune eg-rune-top">✦</div>
                            <div class="eg-map-orb-rune eg-rune-right">✦</div>
                            <div class="eg-map-orb-rune eg-rune-bottom">✦</div>
                            <div class="eg-map-orb-rune eg-rune-left">✦</div>
                        </div>
                        <div class="eg-map-slot"
                             id="eg-map-slot"
                             data-eg-dropzone="map"
                             ondragover="egDragOver(event)"
                             ondrop="egDropOnMap(event)"
                             ondragleave="egDragLeave(event)">
                            <div class="eg-map-slot-inner" id="eg-map-slot-inner">
                                <span class="eg-map-slot-empty-text">DROP MAP</span>
                            </div>
                        </div>
                    </div>
                    <div class="eg-map-socket-row">
                        <div class="eg-map-socket eg-socket-red"></div>
                        <div class="eg-map-socket eg-socket-green"></div>
                        <div class="eg-map-socket eg-socket-blue"></div>
                        <div class="eg-map-socket eg-socket-white"></div>
                    </div>
                    <div class="eg-map-info" id="eg-map-info">
                        <span class="eg-map-info-text">Insert a map to begin</span>
                    </div>
                    <button class="eg-activate-btn" id="eg-activate-btn" disabled onclick="egActivateMap()">
                        ▶ ACTIVATE MAP
                    </button>
                </div>
                <div class="eg-map-stash-section">
                    <div class="eg-panel-label">MAP STASH</div>
                    <div class="eg-map-stash-grid" id="eg-map-stash-grid">
                        ${buildMapStashGridHTML()}
                    </div>
                </div>
            </div>

        </div><!-- /.eg-body-top -->

        <!-- BOTTOM: EQUIPMENT STASH (full width) -->
        <div class="eg-panel eg-panel-inv">
            <div class="eg-panel-label">STASH</div>
            <div class="eg-inv-header">
                <span class="eg-inv-sub">Equipment &amp; Items</span>
                <span class="eg-inv-count" id="eg-inv-count">0 / ${EG_INV_ROWS * EG_INV_COLS}</span>
            </div>
            <div class="eg-inv-grid" id="eg-inv-grid" style="grid-template-columns: repeat(${EG_INV_COLS}, 1fr);">
                ${buildInventoryGridHTML()}
            </div>
            <div class="eg-inv-legend">
                <span class="eg-legend-dot eg-legend-equip"></span><span>Equipment</span>
            </div>
        </div>

    </div><!-- /.eg-body -->
</div>`;
}

function buildEquipColHTML(col) {
    return EG_EQUIP_SLOTS.filter(s => s.col === col).map(s => buildEquipSlotHTML(s)).join('');
}

function buildEquipBottomHTML() {
    return EG_EQUIP_SLOTS.filter(s => s.col === 'bottom').map(s => buildEquipSlotHTML(s)).join('');
}

function buildEquipSlotHTML(slot) {
    return `
<div class="eg-equip-slot" id="eg-equip-slot-${slot.id}" 
     data-slot-id="${slot.id}" 
     data-eg-dropzone="equip"
     ondragover="egDragOver(event)" 
     ondrop="egDropOnEquip(event, '${slot.id}')" 
     ondragleave="egDragLeave(event)">
    <div class="eg-equip-slot-label">${slot.label}</div>
    <div class="eg-equip-slot-item" id="eg-equip-item-${slot.id}"></div>
</div>`;
}

function buildInventoryGridHTML() {
    let html = '';
    for (let r = 0; r < EG_INV_ROWS; r++) {
        for (let c = 0; c < EG_INV_COLS; c++) {
            html += `
<div class="eg-inv-cell" 
     id="eg-inv-cell-${r}-${c}" 
     data-row="${r}" data-col="${c}" 
     data-eg-dropzone="inv"
     ondragover="egDragOver(event)" 
     ondrop="egDropOnInv(event, ${r}, ${c})" 
     ondragleave="egDragLeave(event)">
</div>`;
        }
    }
    return html;
}


function buildCurrencyGridHTML() {
    let html = '';
    for (let r = 0; r < EG_CURRENCY_ROWS; r++) {
        for (let c = 0; c < EG_CURRENCY_COLS; c++) {
            html += `
<div class="eg-inv-cell eg-currency-cell"
     id="eg-currency-cell-${r}-${c}"
     data-row="${r}" data-col="${c}"
     data-eg-dropzone="currency"
     ondragover="egDragOver(event)"
     ondrop="egDropOnCurrency(event, ${r}, ${c})"
     ondragleave="egDragLeave(event)">
</div>`;
        }
    }
    return html;
}

function buildMapStashGridHTML() {
    let html = '';
    for (let r = 0; r < EG_MAP_STASH_ROWS; r++) {
        for (let c = 0; c < EG_MAP_STASH_COLS; c++) {
            html += `
<div class="eg-inv-cell eg-map-stash-cell"
     id="eg-map-stash-cell-${r}-${c}"
     data-row="${r}" data-col="${c}"
     data-eg-dropzone="mapstash"
     ondragover="egDragOver(event)"
     ondrop="egDropOnMapStash(event, ${r}, ${c})"
     ondragleave="egDragLeave(event)">
</div>`;
        }
    }
    return html;
}

function buildItemChipHTML(item, size = 'normal') {
    const rarityClass = item.rarity ? `eg-rarity-${item.rarity}` : '';
    const sizeClass = size === 'large' ? 'eg-item-chip-large' : '';
    // Ensuring draggable="true" is bundled directly into the layout template
    return `
<div class="eg-item-chip ${rarityClass} ${sizeClass}" title="${item.name || ''}" draggable="true">
    <span class="eg-item-chip-icon">${item.icon || '📦'}</span>
    <span class="eg-item-chip-name">${item.name || '???'}</span>
</div>`;
}

//------------------------------------------------------------------------//
//-------------------RENDER CONTROLLERS-----------------------------------//
//------------------------------------------------------------------------//
function _egRenderAll() {
    _egRenderEquipSlots();
    _egRenderInventory();
    _egRenderMapSlot();
    _egRenderCurrencyStash();   // add this
    _egRenderMapStash();        // add this
    _egUpdateInvCount();
}

function _egRenderEquipSlots() {
    EG_EQUIP_SLOTS.forEach(slot => {
        const el = document.getElementById(`eg-equip-item-${slot.id}`);
        if (!el) return;
        const item = _egEquipped[slot.id] || null;
        el.innerHTML = item ? buildItemChipHTML(item) : '';
    });
}

function _egRenderInventory() {
    for (let r = 0; r < EG_INV_ROWS; r++) {
        for (let c = 0; c < EG_INV_COLS; c++) {
            const cell = document.getElementById(`eg-inv-cell-${r}-${c}`);
            if (!cell) continue;
            const item = _egInventory[r][c];
            cell.innerHTML = item ? buildItemChipHTML(item) : '';
        }
    }
}

function _egRenderCurrencyStash() {
    for (let r = 0; r < EG_CURRENCY_ROWS; r++) {
        for (let c = 0; c < EG_CURRENCY_COLS; c++) {
            const cell = document.getElementById(`eg-currency-cell-${r}-${c}`);
            if (!cell) continue;
            const item = _egCurrencyStash[r][c];
            cell.innerHTML = item ? buildItemChipHTML(item) : '';
        }
    }
}

function _egRenderMapStash() {
    for (let r = 0; r < EG_MAP_STASH_ROWS; r++) {
        for (let c = 0; c < EG_MAP_STASH_COLS; c++) {
            const cell = document.getElementById(`eg-map-stash-cell-${r}-${c}`);
            if (!cell) continue;
            const item = _egMapStash[r][c];
            cell.innerHTML = item ? buildItemChipHTML(item) : '';
        }
    }
}

function _egRenderMapSlot() {
    const inner = document.getElementById('eg-map-slot-inner');
    const btn = document.getElementById('eg-activate-btn');
    const info = document.getElementById('eg-map-info');
    if (!inner) return;

    if (_egMapSlotItem) {
        inner.innerHTML = buildItemChipHTML(_egMapSlotItem, 'large');
        if (btn) btn.disabled = false;
        if (info) info.querySelector('.eg-map-info-text').textContent = _egMapSlotItem.name || 'Map ready';
    } else {
        inner.innerHTML = '<span class="eg-map-slot-empty-text">DROP MAP</span>';
        if (btn) btn.disabled = true;
        if (info) info.querySelector('.eg-map-info-text').textContent = 'Insert a map to begin';
    }
}

function _egUpdateInvCount() {
    const el = document.getElementById('eg-inv-count');
    if (!el) return;
    let used = 0;
    _egInventory.forEach(row => row.forEach(cell => { if (cell) used++; }));
    el.textContent = `${used} / ${EG_INV_ROWS * EG_INV_COLS}`;
}

//------------------------------------------------------------------------//
//-------------------DRAG & DROP ROUTINES---------------------------------//
//------------------------------------------------------------------------//
function egDragStartFromInv(e, row, col) {
    _egDragSource = { type: 'inv', row, col };
    _egDragItem = _egInventory[row][col];
    e.dataTransfer.effectAllowed = 'move';
}

function egDragStartFromEquip(e, slotId) {
    _egDragSource = { type: 'equip', slotId };
    _egDragItem = _egEquipped[slotId] || null;
    e.dataTransfer.effectAllowed = 'move';
}

function egDragStartFromMap(e) {
    _egDragSource = { type: 'map' };
    _egDragItem = _egMapSlotItem;
    e.dataTransfer.effectAllowed = 'move';
}

function egDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('eg-dragover');
}

function egDragLeave(e) {
    e.currentTarget.classList.remove('eg-dragover');
}

function egDropOnInv(e, row, col) {
    e.currentTarget.classList.remove('eg-dragover');
    if (!_egDragItem) return;

    const existingItem = _egInventory[row][col];
    _egClearSource();
    _egInventory[row][col] = _egDragItem;

    if (existingItem && _egDragSource) {
        _egPlaceItemAtSource(existingItem);
    }

    _egResetDragState();
}

function egDropOnEquip(e, slotId) {
    e.currentTarget.classList.remove('eg-dragover');
    if (!_egDragItem) return;

    const existingItem = _egEquipped[slotId] || null;
    _egClearSource();
    _egEquipped[slotId] = _egDragItem;

    if (existingItem) {
        _egPlaceItemAtSource(existingItem);
    }

    _egResetDragState();
}

function egDropOnMap(e) {
    e.currentTarget.classList.remove('eg-dragover');
    if (!_egDragItem) return;

    const existingItem = _egMapSlotItem;
    _egClearSource();
    _egMapSlotItem = _egDragItem;

    if (existingItem) {
        _egPlaceItemAtSource(existingItem);
    }

    _egResetDragState();
}

function egDropOnCurrency(e, row, col) {
    e.currentTarget.classList.remove('eg-dragover');
    if (!_egDragItem) return;
    const existingItem = _egCurrencyStash[row][col];
    _egClearSource();
    _egCurrencyStash[row][col] = _egDragItem;
    if (existingItem) _egPlaceItemAtSource(existingItem);
    _egResetDragState();
}

function egDropOnMapStash(e, row, col) {
    e.currentTarget.classList.remove('eg-dragover');
    if (!_egDragItem) return;
    const existingItem = _egMapStash[row][col];
    _egClearSource();
    _egMapStash[row][col] = _egDragItem;
    if (existingItem) _egPlaceItemAtSource(existingItem);
    _egResetDragState();
}


function _egClearSource() {
    if (!_egDragSource) return;
    if (_egDragSource.type === 'inv') {
        _egInventory[_egDragSource.row][_egDragSource.col] = null;
    } else if (_egDragSource.type === 'equip') {
        delete _egEquipped[_egDragSource.slotId];
    } else if (_egDragSource.type === 'map') {
        _egMapSlotItem = null;
    } else if (_egDragSource.type === 'currency') {
        _egCurrencyStash[_egDragSource.row][_egDragSource.col] = null;
    } else if (_egDragSource.type === 'mapstash') {
    _egMapStash[_egDragSource.row][_egDragSource.col] = null;
    }
}

function _egPlaceItemAtSource(item) {
    if (!_egDragSource) {
        _egPlaceItemInFirstFreeSlot(item);
        return;
    }
    if (_egDragSource.type === 'inv') {
        _egInventory[_egDragSource.row][_egDragSource.col] = item;
    } else if (_egDragSource.type === 'equip') {
        _egEquipped[_egDragSource.slotId] = item;
    } else if (_egDragSource.type === 'map') {
        _egMapSlotItem = item;
    } else if (_egDragSource.type === 'currency') {
        _egCurrencyStash[_egDragSource.row][_egDragSource.col] = item;
    } else if (_egDragSource.type === 'mapstash') {
        _egMapStash[_egDragSource.row][_egDragSource.col] = item;
    }
}

function _egPlaceItemInFirstFreeSlot(item) {
    for (let r = 0; r < EG_INV_ROWS; r++) {
        for (let c = 0; c < EG_INV_COLS; c++) {
            if (!_egInventory[r][c]) {
                _egInventory[r][c] = item;
                return;
            }
        }
    }
}

function _egResetDragState() {
    _egDragSource = null;
    _egDragItem = null;
    _egRenderAll();
}

//------------------------------------------------------------------------//
//-------------------MAP ACTIVATION PIPELINE------------------------------//
//------------------------------------------------------------------------//
function egActivateMap() {
    if (!_egMapSlotItem) return;

    console.log('[EG] Map Device processing run sequence with config:', _egMapSlotItem);

    if (typeof showModal === 'function') {
        showModal(`Map Hub Warning`, `Activating portal coordinates for: ${_egMapSlotItem.name}`);
    } else {
        alert(`🔮 Map Sequence Engaged: "${_egMapSlotItem.name}" activated! (Atlas systems standing by)`);
    }
}

//------------------------------------------------------------------------//
//-------------------GLOBAL DELEGATED EVENT BINDING-----------------------//
//------------------------------------------------------------------------//

function egDragStartFromCurrency(e, row, col) {
    _egDragSource = { type: 'currency', row, col };
    _egDragItem = _egCurrencyStash[row][col];
    e.dataTransfer.effectAllowed = 'move';
}

function egDragStartFromMapStash(e, row, col) {
    _egDragSource = { type: 'mapstash', row, col };
    _egDragItem = _egMapStash[row][col];
    e.dataTransfer.effectAllowed = 'move';
}
function _egBindEvents() {
    const rootContainer = document.getElementById('screen-endgame-hub');
    if (!rootContainer) return;

    // Single delegated 'dragstart' engine instead of messy iterative attachments
    rootContainer.addEventListener('dragstart', e => {
        const chip = e.target.closest('.eg-item-chip');
        if (!chip) return;

        const cell = chip.closest('.eg-inv-cell');
        const equipSlot = chip.closest('.eg-equip-slot');
        const mapSlot = chip.closest('#eg-map-slot');
        const currencyCell = chip.closest('.eg-currency-cell');
        const mapStashCell = chip.closest('.eg-map-stash-cell');

        if (cell) {
            const r = parseInt(cell.dataset.row, 10);
            const c = parseInt(cell.dataset.col, 10);
            egDragStartFromInv(e, r, c);
        } else if (equipSlot) {
            const slotId = equipSlot.dataset.slotId;
            egDragStartFromEquip(e, slotId);
        } else if (mapSlot) {
            egDragStartFromMap(e);
        }
    });
}

//------------------------------------------------------------------------//
//-------------------DEVELOPMENT VISUAL DEBUGGERS-------------------------//
//------------------------------------------------------------------------//
function egAddTestItems() {
    const testItems = [
        { id: 'map_tier1', name: 'Forge Vault (T1 Map)', icon: '🗺', rarity: 'common', type: 'map' },
        { id: 'map_tier5', name: 'Core Nexus (T5 Map)', icon: '🗺', rarity: 'uncommon', type: 'map' },
        { id: 'helm_01', name: 'Destroyer Greathelm', icon: '⛑', rarity: 'common', type: 'equip' },
        { id: 'chest_01', name: 'Chrono-Weaved Regalia', icon: '👘', rarity: 'rare', type: 'equip' },
        { id: 'ring_01', name: 'Loop of Eternity', icon: '💍', rarity: 'uncommon', type: 'equip' },
        { id: 'currency_1', name: 'Temporal Catalyst', icon: '🔮', rarity: 'currency', type: 'currency' },
        { id: 'currency_2', name: 'Fractured Shard', icon: '💠', rarity: 'currency', type: 'currency' },
        { id: 'weapon_01', name: 'Singularity Spire Staff', icon: '🔱', rarity: 'rare', type: 'equip' },
    ];

    testItems.forEach((item, i) => {
        const r = Math.floor(i / EG_INV_COLS);
        const c = i % EG_INV_COLS;
        if (r < EG_INV_ROWS) {
            _egInventory[r][c] = item;
        }
    });

    _egRenderAll();
    console.log('[EG] Stash populated with mock endgame assets for sandbox evaluation.');
}