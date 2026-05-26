




//------------------------------------------------------------------------
//------------------------SCREEN SWITCH FUNCTION--------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

//sets previous screen to inactive and new screen to active based on id

function ss(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}



//------------------------------------------------------------------------
//------------------------SCREEN NAVIGATION FUNCTIONS---------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function showTitle() {
    Audio_Manager.playBGM('title');
    stopTimer();
    screenHistory = [];
    ss('screen-title');
}

function showSetup() {
    stopTimer();
    screenHistory.push('screen-title'); 
    updDiffDesc();
    updModDesc();
    ss('screen-setup');
}


function startSetup() {
    buildLS();
    screenHistory.push('screen-setup'); 
    ss('screen-levels');
}



//------------------------------------------------------------------------
//-----FUNCTION TO RETURN TO LEVEL SELECT FROM GAMEPLAY SCREEN------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function goLevels() {
    hideOv();
    closeQuiz();
    const proceed = () => {
        if (typeof triggerClassEventIfPending === 'function') {
            if (triggerClassEventIfPending(() => { buildLS(); ss('screen-levels'); })) return;
        }
        buildLS();
        ss('screen-levels');
    };
    _maybeShowConvergenceModal(proceed);
}


//------------------------------------------------------------------------
//---------------GO BACK TO PREVIOUS SCREEN-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function goBack() {
    const openModal = document.querySelector('.modal-bg.show');
    if (openModal) {
        openModal.classList.remove('show');
        return;
    }

    if (screenHistory.length) {
        const prev = screenHistory.pop();
        if (prev === 'screen-game') {
            goLevels();
            return;
        }
        stopTimer();
        if (prev === 'screen-levels') {
            buildLS(); // ← rebuild so completion state is fresh
        }
        ss(prev);
    } else {
        showTitle();
    }
}



//------------------------------------------------------------------------
//---------------------HIDE OVERLAY---------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


//hides both the win and lose overlays by removing 'show' class from each.

function hideOv() {
    document.getElementById('ov-win').classList.remove('show');
    document.getElementById('ov-lose').classList.remove('show');
}


//------------------------------------------------------------------------
//-----------------SWITCH TO NEXT LEVEL-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function nextLvl() {
    hideOv();
    const n = cur.gIdx + 1;
    const proceed = () => {
        if (n < ALL.length) startLevel(n);
        else goLevels();
    };
    const afterConvergence = () => {
        if (triggerClassEventIfPending(proceed)) return;
        proceed();
    };
    _maybeShowConvergenceModal(afterConvergence);
}











//------------------------------------------------------------------------
//---------------------REPLAY LEVEL---------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function replayLvl() {
    hideOv();
    const gi = cur.gIdx;
    const proceed = () => startLevel(gi);
    const afterConvergence = () => {
        if (triggerClassEventIfPending(proceed)) return;
        proceed();
    };
    _maybeShowConvergenceModal(afterConvergence);
}






//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------





function showConvergenceModal() {
    const modal = document.getElementById('convergence-modal');
    if (modal) modal.classList.add('show');

    Audio_Manager.playSFX('convergence');
}

function hideConvergenceModal() {
    const modal = document.getElementById('convergence-modal');
    if (modal) modal.classList.remove('show');
}



// Helper: if a convergence point is pending, show the modal first,
// then run the callback when the player dismisses it.
function _maybeShowConvergenceModal(proceed) {
    if (!window._pendingConvergenceModal) { proceed(); return; }
    window._pendingConvergenceModal = false;

    // Wire up each button in the convergence modal to close it and then run
    // the intended navigation (overrides the inline onclick attributes).
    const modal = document.getElementById('convergence-modal');
    const treeBtn = modal.querySelector('.convergence-btn-tree');
    const nextBtn = modal.querySelector('.convergence-btn-next');
    const levelsBtn = modal.querySelector('.convergence-btn-levels');

    const finish = (extraAction) => () => {
        hideConvergenceModal();
        if (extraAction) extraAction();
        else proceed();
    };

    // Tree button keeps its original behaviour (open tree), then the player
    // navigates from there — so we just show the tree.
    treeBtn.onclick = finish(() => { hideOv(); showPassiveTree(); });
    nextBtn.onclick = finish(proceed);
    levelsBtn.onclick = finish(proceed);

    showConvergenceModal();
}
