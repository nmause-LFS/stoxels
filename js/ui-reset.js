
//------------------------------------------------------------------------
//----------------------------RESET---------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Removes the persisted save from localStorage
function wipeSaveData() {
    localStorage.removeItem('stoxels');
}

// Returns a fresh default STATE object with all fields zeroed out.
// Class-related fields are set explicitly here even though initState()
// also covers them, so this function is safe to call in isolation.
function buildDefaultState() {
    return {
        totalScore: 0,
        levelHS: {},
        inventory: [],
        unlockedCodes: [],
        done: [],
        bonusDone: [],
        mathGatePassed: [],
        questStats: {},
        questsClaimed: [],
        questsNotified: [],
        playerClass: null,
        classPassiveLevel: 1,
        classActiveLevel: 1,
        classUpgradesAvailable: 0,
        classWorldsCompleted: [],
    };
}

// Triggered when the player confirms a full game reset.
// Closes the modal, wipes the save, rebuilds a blank STATE,
// then returns to the title screen with a confirmation toast.
function confirmReset() {
    hideModal('reset-modal');
    wipeSaveData();
    STATE = buildDefaultState();
    showTitle();
    showToast(t('toast_reset'));
}



