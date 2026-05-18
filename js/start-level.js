




//------------------------------------------------------------------------
//--------------INITIATE LEVEL DATA---------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Sets cur to the puzzle object and tracks replays
function _initLevelData(gi) {
    cur = ALL[gi]; // current level object

    if (STATE.done.includes(gi)) {
        trackAchStat('levelsReplayed');
    }
}


//------------------------------------------------------------------------
//-----------------INITIATE GRIDS-----------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Creates fresh userGrid, wrongGrid, revealedGrid sized to the puzzle dimensions
function _initGrids() {
    const rows = cur.grid.length;
    const cols = cur.grid[0].length;

    userGrid = Array.from({ length: rows }, () => Array(cols).fill(0));
    wrongGrid = Array.from({ length: rows }, () => Array(cols).fill(false));
    revealedGrid = Array.from({ length: rows }, () => Array(cols).fill(false));
}


//------------------------------------------------------------------------
//---------------RESET ALL PER-LEVEL COUNTERS AND FLAGS-------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _resetLevelState() {
    mistakeCount = 0;
    absorbedMistakes = 0;
    levelStartTime = Date.now();
    itemsUsedThisLevel = 0;
    dead = false;
    painting = false;
    hoverRow = -1;
    hoverCol = -1;
    shieldActive = false;
    timerFrozen = false;
    quizAnsweredCorrectly = false;
}



//------------------------------------------------------------------------
//-----------------------LUCKY TILES--------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Picks a handful of wrong cells as lucky tiles.
// Right-clicking a lucky tile to mark ✕ awards a free random item (once per level).
// Scale: 0 tiles for ≤25 cells, up to 1/2/3 for larger grids (randomised).
function _initLuckyTiles() {
    luckyTiles = new Set();
    luckyRewardClaimed = false;

    const rows = cur.grid.length;
    const cols = cur.grid[0].length;
    const cellCount = rows * cols;
    const maxTiles = cellCount <= 25 ? 0 : cellCount <= 75 ? 1 : cellCount <= 200 ? 2 : 3;
    const tileCount = maxTiles === 0 ? 0 : Math.floor(Math.random() * (maxTiles + 1));

    if (tileCount === 0) return;

    const pool = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (cur.grid[r][c] !== 1) pool.push(`${r}-${c}`);
        }
    }
    shuffle(pool);
    for (let i = 0; i < Math.min(tileCount, pool.length); i++) {
        luckyTiles.add(pool[i]);
    }
}



//------------------------------------------------------------------------
//-----------------------INITIATE TIMER-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Calculates and sets timerSecs.
// Time Trial mode halves the base time; otherwise uses the difficulty/level default.
function _initTimer() {
    const cfg = DIFF_CFG[curDiff];
    const baseTimer = cur.timer || cfg.timerStart;
    timerSecs = curMods.timetrial ? Math.round(baseTimer * 0.5) : baseTimer;
}



//------------------------------------------------------------------------
//-------------------CLOSE LEFTOVER OVERLAYS------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Hides any win/lose overlays and closes the quiz left over from a previous level.
function _closeLeftoverOverlays() {
    hideOv();    // hides win and lose overlays if they are still up from a previous level
    closeQuiz(); 
}


//------------------------------------------------------------------------
//--------------------UPDATE HUD ELEMENTS---------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Updates the bonus sidebar hint text.
// Appends an "items recommended" note on large (≥200 cell) unseen levels.
function _updateBonusSidebar() {
    const el = document.getElementById('bonus-sidebar-hint');
    el.textContent = (lvText(cur, 'bonusHint') || '');
}


// Renders the modifier and difficulty tags below the timer.
function _updateModTags() {
    const mt = document.getElementById('mod-tags');
    mt.innerHTML = '';
    if (curMods.timetrial) mt.innerHTML += `<span class="mod-tag tt">${t('mod_tt')}</span>`;
    if (curMods.hardcore) mt.innerHTML += `<span class="mod-tag hc">${t('mod_hc')}</span>`;
    if (curMods.ironman) mt.innerHTML += `<span class="mod-tag im">${t('mod_im')}</span>`;
    mt.innerHTML += `<span class="mod-tag diff">${t('diff_' + curDiff)}</span>`;
}




// Updates all HUD elements: level id, hint, score, penalty, bonus sidebar, mod tags.
function _updateHUD() {
    const rows = cur.grid.length;
    const cols = cur.grid[0].length;

    document.getElementById('top-id').textContent = `${t('lvl_prefix')} ${cur.world}-${cur.li}`;
    document.getElementById('top-hint').textContent = lvText(cur, 'hint');
    document.getElementById('sc-disp').textContent = STATE.totalScore;
    document.getElementById('pen-info').textContent = '';

    const mc = document.getElementById('mistake-counter');
    if (mc) mc.textContent = `${LANG === 'de' ? 'Fehler' : 'Mistakes'}: 0`;

    _updateBonusSidebar()
    _updateModTags();
}



//------------------------------------------------------------------------
//--------START TIMER AND RENDER GRID AND INVENTORY-----------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _startSystems() {
    updTimer();           // timer.js — show initial time before first tick
    startTimer();         // timer.js — begin the countdown
    buildGrid();          // grid.js  — render the puzzle table
    buildInventoryPanel(); // inventory.js — render current items
}


//------------------------------------------------------------------------
//-----------------CHECK FOR SCOUTS PRIMER--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// If a Scout's Primer was activated in a previous level, shows the question modal now
function _checkPrimerPending() {
    if (!STATE.primerPending) return;
    STATE.primerPending = false;
    save();
    showPrimerModal();
}




//------------------------------------------------------------------------
//------------------------CLASSES-----------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Resets cooldown, applies passive effects, and rebuilds the class HUD panel
function _initClassSystems() {
    resetActiveCooldown();           
    applyClassPassiveOnLevelStart(); 
    buildClassHUD();                 
}


//------------------------------------------------------------------------
//--------------------SWITCH SCREEN TO GAMEPLAY---------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Pushes level select to the navigation history and switches to the game screen
function _navigateToGameScreen() {
    screenHistory.push('screen-levels');
    ss('screen-game'); 
}




//------------------------------------------------------------------------
//-----------------------DO START LEVEL-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function _doStartLevel(gi) {
    _initLevelData(gi);
    _initGrids();
    _resetLevelState();
    _initLuckyTiles();
    _initTimer();
    _closeLeftoverOverlays();
    _updateHUD();
    _startSystems();
    _checkPrimerPending();
    _initClassSystems();
    _navigateToGameScreen();
}


//------------------------------------------------------------------------
//----------------------START LEVEL-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



function startLevel(gi) {
    if (isGatedLevel(gi) && !isMathGatePassed(gi)) {
        tryStartGatedLevel(gi, () => _doStartLevel(gi));
        return;
    }
    _doStartLevel(gi);
}




































