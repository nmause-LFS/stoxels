




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
    if (typeof triggerClassEventIfPending === 'function') {
        if (triggerClassEventIfPending(() => { buildLS(); ss('screen-levels'); })) return;
    }
    buildLS();
    ss('screen-levels');
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
    if (triggerClassEventIfPending(proceed)) return;
    proceed();
}











//------------------------------------------------------------------------
//---------------------REPLAY LEVEL---------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function replayLvl() {
    hideOv();
    const gi = cur.gIdx;
    if (triggerClassEventIfPending(() => startLevel(gi))) return;
    startLevel(gi);
}






//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------





function showConvergenceModal() {
    const modal = document.getElementById('convergence-modal');
    if (modal) modal.classList.add('show');
}

function hideConvergenceModal() {
    const modal = document.getElementById('convergence-modal');
    if (modal) modal.classList.remove('show');
}




