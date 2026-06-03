

//------------------------------------------------------------------------
//--------------CHECK INVENTORY RELATED ACHIEVEMENTS----------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Checks hoarder + collector achievements after every inventory change, only once per level
function _checkInventoryAchievements() {
    if (!window._maxInventoryTrackedThisLevel && STATE.inventory.length >= 10) {
        window._maxInventoryTrackedThisLevel = true;
        trackAchStat('maxInventoryReached');
    }

    // collector: check if every rarity tier is held simultaneously,only once per level
    if (!window._collectorTrackedThisLevel) {
        const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'cursed', 'artifact'];
        const raritiesPresent = new Set(
            STATE.inventory.map(item => ITEM_DEFS[item.defId]?.rarity).filter(Boolean)
        );
        if (RARITIES.every(r => raritiesPresent.has(r))) {
            window._collectorTrackedThisLevel = true;
            trackAchStat('collectorAllRarities');
        }
    }
}






//------------------------------------------------------------------------
//------------------NOTIFICATIONS TOAST-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
// Keep track of pending messages and current state
const toastQueue = [];
let isToastShowing = false;
let currentToastMsg = null; // Track what's currently on screen

function showToast(msg) {
    // If this exact message is currently on screen, swallow it entirely
    if (isToastShowing && currentToastMsg === msg) return;

    // If this exact message is already the last item waiting in the queue, swallow it too
    if (toastQueue.length > 0 && toastQueue[toastQueue.length - 1] === msg) return;

    toastQueue.push(msg);

    if (isToastShowing) return;

    _processToastQueue();
}

function _processToastQueue() {
    if (toastQueue.length === 0) {
        isToastShowing = false;
        currentToastMsg = null;
        return;
    }

    isToastShowing = true;

    const nextMsg = toastQueue.shift();
    currentToastMsg = nextMsg; // Remember what's showing

    const el = document.getElementById('item-toast');
    el.textContent = nextMsg;
    el.classList.add('show');

    setTimeout(() => {
        el.classList.remove('show');

        setTimeout(() => {
            _processToastQueue();
        }, 300);

    }, 2500);
}

function resetToastQueue() {
    toastQueue.length = 0;
    isToastShowing = false;
    currentToastMsg = null;

    const el = document.getElementById('item-toast');
    if (el) el.classList.remove('show');
}




//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------




