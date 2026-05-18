

//------------------------------------------------------------------------
//--------------CHECK INVENTORY RELATED ACHIEVEMENTS----------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Checks hoarder + collector achievements after every inventory change
function _checkInventoryAchievements() {
    // item_hoarder: track the highest inventory size ever reached
    if (STATE.inventory.length >= 10) {
        if (!window._lastInventoryHoarderSize || window._lastInventoryHoarderSize < STATE.inventory.length) {
            trackAchStat('maxInventoryReached');
        }
    }
    window._lastInventoryHoarderSize = STATE.inventory.length;

    // collector: check if every rarity tier is held simultaneously
    const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'cursed', 'artifact'];
    const raritiesPresent = new Set(
        STATE.inventory.map(item => ITEM_DEFS[item.defId]?.rarity).filter(Boolean)
    );
    if (RARITIES.every(r => raritiesPresent.has(r))) {
        if (!window._collectorTriggeredThisSession) {
            window._collectorTriggeredThisSession = true;
            trackAchStat('collectorAllRarities');
        }
    } else {
        window._collectorTriggeredThisSession = false;
    }
}


//------------------------------------------------------------------------
//----------------SCROLL WHEEL FUNCTIONALITY FOR INVENTORY----------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


document.addEventListener('wheel', (e) => {
    // Only act when the cursor is over the inventory strip (not Ctrl+wheel zoom)
    if (e.ctrlKey) return;
    const strip = e.target.closest('#inv-list');
    if (!strip) return;
    e.preventDefault();
    // Scroll speed: 120px per notch 
    strip.scrollLeft += e.deltaY > 0 ? 120 : -120;
}, { passive: false });




//------------------------------------------------------------------------
//------------------------ITEM DISCARDING---------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function discardItem(uid, e) {
    e.stopPropagation(); // don't trigger useItem on the parent card

    const idx = STATE.inventory.findIndex(i => i.uid === uid);
    if (idx < 0) return;

    const def = ITEM_DEFS[STATE.inventory[idx].defId];
    STATE.inventory.splice(idx, 1);

    trackAchStat('itemsSold');

    save();
    buildInventoryPanel();
    showToast(`${def.icon} ${t('item_discarded')}`);
}



//------------------------------------------------------------------------
//------------------NOTIFICATIONS TOAST-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function showToast(msg) {
    const el = document.getElementById('item-toast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2500);
}



//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------




