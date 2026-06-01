//------------------------------------------------------------------------
//--------------------INVENTORY SLOT CATEGORIES---------------------------
//------------------------------------------------------------------------
// Defines the grouped slot layout for the new fixed-panel inventory.
// Each entry is one visible slot. Order = display order within group.
//------------------------------------------------------------------------

const INV_SLOT_GROUPS = [
    {
        label: 'Reveal',
        slots: ['reveal1', 'reveal2', 'reveal3', 'reveal4']
    },
    {
        label: 'Mark',
        slots: ['markWrong2', 'markWrong4', 'markWrong6', 'markWrong8']
    },
    {
        label: 'Time',
        slots: ['addTime60', 'addTime300', 'addTime600', 'addTime900']
    },
    {
        label: 'Utility',
        slots: ['shield', 'freeze', 'mistakeEraser', 'mistakeEraser4', 'mistakeEraser6', 'mistakeEraserAll', 'scoutPrimer']
    },
    {
        label: 'Power',
        slots: ['rowSolve', 'colSolve', 'artifactComplete']
    },
    {
        label: 'Cursed',
        slots: ['cursedReveal', 'cursedTime', 'cursedShield', 'cursedRowSolve', 'cursedColSolve', 'cursedRowCol']
    },
    {
        label: 'Special',
        slots: ['pearlOfHaste', 'pearlOfSwiftness', 'grandPearl', 'theWitch', 'goldenClock', 'shadowSeal']
    },
];


//------------------------------------------------------------------------
//--------------------TOOLTIP SHOW / HIDE---------------------------------
//------------------------------------------------------------------------

let _invTooltipEl = null;

function _ensureTooltip() {
    if (_invTooltipEl) return _invTooltipEl;
    _invTooltipEl = document.createElement('div');
    _invTooltipEl.id = 'inv-slot-tooltip';
    document.body.appendChild(_invTooltipEl);
    return _invTooltipEl;
}

function _showSlotTooltip(def, count, anchorEl) {
    const tip = _ensureTooltip();
    const rc = rarityColors(def.rarity);
    tip.innerHTML = `
        <div class="inv-tip-name" style="color:${rc.color}">${def.icon} ${itemName(def)}</div>
        <div class="inv-tip-rarity" style="color:${rc.color}">${def.rarity.toUpperCase()}</div>
        <div class="inv-tip-desc">${itemDesc(def)}</div>
        <div class="inv-tip-stack">Stack: <b>${count}</b></div>
        <div class="inv-tip-hint">Left-click: Use &nbsp;|&nbsp; Right-click: Reshuffle &nbsp;|&nbsp; Alt+click: Discard</div>`;
    tip.classList.add('visible');
    _positionTooltip(tip, anchorEl);
}

function _hideSlotTooltip() {
    if (_invTooltipEl) _invTooltipEl.classList.remove('visible');
}

function _positionTooltip(tip, anchor) {
    // Place above the anchor slot, centred; flip below if too close to top
    const ar = anchor.getBoundingClientRect();
    tip.style.left = '0px';
    tip.style.top = '0px';
    const tw = tip.offsetWidth || 220;
    const th = tip.offsetHeight || 80;
    let left = ar.left + ar.width / 2 - tw / 2;
    let top = ar.top - th - 8;
    if (top < 6) top = ar.bottom + 8;
    left = Math.max(6, Math.min(left, window.innerWidth - tw - 6));
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
}


//------------------------------------------------------------------------
//--------------------BUILD ONE SLOT--------------------------------------
//------------------------------------------------------------------------

function _buildInvSlot(defId) {
    const def = ITEM_DEFS[defId];
    if (!def) return null;

    const count = STATE.inventory.filter(i => i.defId === defId).length;
    const isEmpty = count === 0;
    const isLocked = curMods.ironman;

    const el = document.createElement('div');
    el.className = 'inv-slot' + (isEmpty ? ' inv-slot-empty' : '') + (isLocked ? ' ironman-lock' : '');
    el.dataset.defId = defId;

    // Rarity border tint
    const rc = rarityColors(def.rarity);
    if (!isEmpty) el.style.borderColor = rc.border;

    el.innerHTML = `
        <span class="inv-slot-icon">${def.icon}</span>
        ${count > 0 ? `<span class="inv-slot-count">${count}</span>` : ''}`;

    if (!isLocked) {
        // Left-click → use one
        el.addEventListener('click', (e) => {
            _hideSlotTooltip();
            if (isEmpty) return;
            if (e.altKey) {
                // Alt+click → discard one
                _discardOneByDefId(defId);
                return;
            }
            _useOneByDefId(defId);
        });

        // Right-click → reshuffle one
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            _hideSlotTooltip();
            if (dead || isEmpty) return;
            _reshuffleOneByDefId(defId);
        });
    }

    // Tooltip
    el.addEventListener('mouseenter', () => _showSlotTooltip(def, count, el));
    el.addEventListener('mouseleave', _hideSlotTooltip);

    return el;
}


//------------------------------------------------------------------------
//--------------------BUILD INVENTORY PANEL-------------------------------
//------------------------------------------------------------------------

function buildInventoryPanel() {
    _hideSlotTooltip();
    const panel = document.getElementById('inv-panel');
    if (!panel) return;

    panel.innerHTML = '';

    // Reshuffle counter row at the top
    const topRow = document.createElement('div');
    topRow.className = 'inv-panel-toprow';
    topRow.innerHTML = `<span class="inv-panel-label">INVENTORY</span><span id="reshuffle-counter">♻ ${reshuffleCount}/${RESHUFFLE_GOAL}</span>`;
    panel.appendChild(topRow);

    // Slot groups
    INV_SLOT_GROUPS.forEach(group => {
        // Only render a group if at least one of its items is defined
        const defsExist = group.slots.some(id => ITEM_DEFS[id]);
        if (!defsExist) return;

        const groupEl = document.createElement('div');
        groupEl.className = 'inv-group';

        const labelEl = document.createElement('div');
        labelEl.className = 'inv-group-label';
        labelEl.textContent = group.label;
        groupEl.appendChild(labelEl);

        const slotsEl = document.createElement('div');
        slotsEl.className = 'inv-group-slots';

        group.slots.forEach(defId => {
            const slot = _buildInvSlot(defId);
            if (slot) slotsEl.appendChild(slot);
        });

        groupEl.appendChild(slotsEl);
        panel.appendChild(groupEl);
    });

    _checkInventoryAchievements();
    updateReshuffleCounter();
}


//------------------------------------------------------------------------
//--------------------HELPER: USE / RESHUFFLE / DISCARD BY DEFID----------
//------------------------------------------------------------------------

// Uses one item of this defId (finds the first matching UID)
function _useOneByDefId(defId) {
    const item = STATE.inventory.find(i => i.defId === defId);
    if (!item) return;
    useItem(item.uid);
}

// Reshuffles one item of this defId
function _reshuffleOneByDefId(defId) {
    const item = STATE.inventory.find(i => i.defId === defId);
    if (!item) return;
    reshuffleRightClickItem(item.uid);
}

// Discards one item of this defId (alt+click)
function _discardOneByDefId(defId) {
    const idx = STATE.inventory.findIndex(i => i.defId === defId);
    if (idx < 0) return;
    const def = ITEM_DEFS[defId];
    STATE.inventory.splice(idx, 1);
    trackAchStat('itemsSold');
    save();
    buildInventoryPanel();
    showToast(`${def.icon} ${t('item_discarded')}`);
}



// After the grid is drawn, push the inv-panel right if it overlaps the grid

/*
function _repositionInvPanel() {
    const grid = document.getElementById('ptable'); 
    const panel = document.getElementById('inv-panel');
    if (!grid || !panel) return;
    const gr = grid.getBoundingClientRect();
    const minLeft = gr.right + 10;
    panel.style.left = Math.max(16, Math.min(minLeft, window.innerWidth - 226)) + 'px';
}


*/




function _repositionInvPanel() {
    const grid = document.getElementById('ptable');
    const panel = document.getElementById('inv-panel');
    if (!grid || !panel) return;

    const gr = grid.getBoundingClientRect();
    const minLeft = gr.right + 20; // Added a bit more breathing room

    // Check if we have enough screen width to place it on the right
    if (minLeft + 226 < window.innerWidth) {
        // Place it to the right of the grid
        panel.style.left = minLeft + 'px';
        panel.style.top = gr.top + 'px'; // Align tops
    } else {
        // Screen is too narrow! Place it BELOW the grid instead.
        panel.style.left = '16px'; // Or whatever left alignment looks good
        panel.style.top = (gr.bottom + 20) + 'px';
    }
}



// -----------------------------------------------------------------------
// PUBLIC HELPER — attach an inventory-style tooltip to any DOM element
// that represents a reward item (win overlay, gate reward, etc.)
// Call after the element is inserted into the DOM.
// -----------------------------------------------------------------------
function attachItemTooltip(el, defId) {
    const def = ITEM_DEFS[defId];
    if (!def || !el) return;
    el.addEventListener('mouseenter', () => {
        const tip = _ensureTooltip();
        const rc = rarityColors(def.rarity);
        tip.innerHTML = `
            <div class="inv-tip-name" style="color:${rc.color}">${def.icon} ${itemName(def)}</div>
            <div class="inv-tip-desc">${itemDesc(def)}</div>`;
        tip.classList.add('visible');
        _positionTooltip(tip, el);
    });
    el.addEventListener('mouseleave', _hideSlotTooltip);
}