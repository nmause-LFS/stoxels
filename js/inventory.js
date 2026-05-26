

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
//------------------NOTIFICATIONS TOAST-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function showToast(msg) {
    const el = document.getElementById('item-toast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2500);

    //Audio_Manager.playSFX('showtoast');
}



//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------




