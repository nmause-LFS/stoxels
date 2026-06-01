

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

// Keep track of pending messages and current state
const toastQueue = [];
let isToastShowing = false;

function showToast(msg) {
    // Push the new message into the queue
    toastQueue.push(msg);

    //    If a toast is already active, do nothing else. 
    //    The queue will handle this message when it's ready.
    if (isToastShowing) return;

    // If no toast is showing, start processing the queue
    _processToastQueue();
}

function _processToastQueue() {
    // If the queue is empty, reset the state and stop
    if (toastQueue.length === 0) {
        isToastShowing = false;
        return;
    }

    // Mark that we are now displaying a toast
    isToastShowing = true;

    // Get the next message in line (removes it from the front of the array)
    const nextMsg = toastQueue.shift();

    const el = document.getElementById('item-toast');
    el.textContent = nextMsg;
    el.classList.add('show');

    // Optional: Audio_Manager.playSFX('showtoast');

    // Wait 2.5 seconds for the toast to show, then hide it and check for the next one
    setTimeout(() => {
        el.classList.remove('show');

        // Wait a brief moment (e.g., 300ms) for the CSS fade-out animation 
        // to finish before showing the next toast in the queue.
        setTimeout(() => {
            _processToastQueue();
        }, 300);

    }, 2500);
}



function resetToastQueue() {
    toastQueue.length = 0; // Clears the array safely
    isToastShowing = false;

    // Optional: Hide the element immediately if it's currently fading out
    const el = document.getElementById('item-toast');
    if (el) el.classList.remove('show');
}





//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------




