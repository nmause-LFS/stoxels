// ideas for more achievements: many mistakes in a single level, erase many mistakes in a single level by using tutor items, add 60 minutes to the timer in a level


const ACH_SAVE_KEY = 'stoxels_ach';     //  Persistence key (separate from main save, so achievements can persist through multiple playthroughs)



//------------------------------------------------------------------------
//----------------------------PERSISTENCE---------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function loadAchState() {
    try {
        const raw = localStorage.getItem(ACH_SAVE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch { return null; }
}

function saveAchState() {
    localStorage.setItem(ACH_SAVE_KEY, JSON.stringify(ACH_STATE));
}

// Ensures the loaded state always has the expected shape before use.
function migrateAchState(s) {
    if (!s.stats) s.stats = {};
    if (!s.unlocked) s.unlocked = [];
    return s;
}

function initAchState() {
    const saved = loadAchState();
    return saved ? migrateAchState(saved) : { stats: {}, unlocked: [] };
}

let ACH_STATE = initAchState();






//------------------------------------------------------------------------
//----------------------------STAT TRACKING-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// trackAchStat — increment a stat counter by amount (default 1).
//   This is the ONLY function other modules need to call.
//   After incrementing, it runs the unlock check automatically.
function trackAchStat(stat, amount = 1) {
    if (!ACH_STATE.stats[stat]) ACH_STATE.stats[stat] = 0;
    ACH_STATE.stats[stat] += amount;
    saveAchState();
    checkAchievements();
}

// setAchStat — force-set a stat to an exact value (used for world-complete flags).
function setAchStat(stat, value) {
    ACH_STATE.stats[stat] = value;
    saveAchState();
    checkAchievements();
}








//------------------------------------------------------------------------
//---------------------------UNLOCK CHECK---------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Checks a single achievement definition against the current stat value
// and pushes any newly-met tiers into the toast queue.
function checkSingleAchievementDef(def) {
    const currentValue = ACH_STATE.stats[def.stat] || 0;
    let anyNewTier = false;
    def.tiers.forEach((tier, tierIndex) => {
        const unlockKey = `${def.id}__${tierIndex}`;
        const alreadyUnlocked = ACH_STATE.unlocked.includes(unlockKey);
        const thresholdMet = currentValue >= tier.threshold;
        if (!alreadyUnlocked && thresholdMet) {
            ACH_STATE.unlocked.push(unlockKey);
            _achToastQueue.push({ def, tier });
            anyNewTier = true;
            if (typeof updateQuestStats === 'function') updateQuestStats('achievementUnlocked', {});
        }
    });
    return anyNewTier;
}

// checkAchievements — scans every def and unlocks anything newly met.
//   Toasts are queued so they display one after another instead of
//   all firing at the same moment and overwriting each other.
function checkAchievements() {
    const anyNew = ACHIEVEMENT_DEFS.reduce((found, def) => {
        return checkSingleAchievementDef(def) || found;
    }, false);

    if (anyNew) {
        saveAchState();
        // Delay slightly so the toast doesn't fire mid-action
        setTimeout(_drainAchToastQueue, 600);
    }
}






//------------------------------------------------------------------------
//-----------------LEVEL - COMPLETE TRACKING (HELPERS)--------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


//  Each helper handles one logical group of stats.
//  All are called by onLevelCompleteAch().

function trackBaseCompletionStats(ctx) {
    trackAchStat('levelsCompleted');
    trackAchStat('cellsFilled', ctx.cellsFilled || 0);
}

function trackAccuracyStats(ctx) {
    if (ctx.mistakes === 0) trackAchStat('perfectLevels');
    if (ctx.itemsUsed === 0) trackAchStat('noItemLevels');
    if (ctx.mistakes === 0 && ctx.itemsUsed === 0) trackAchStat('pureLevels');
    if (ctx.mistakes >= 3) trackAchStat('comebackWins');
    if (ctx.itemsUsed >= 3) trackAchStat('threeItemsOneLevelCount');
    if (ctx.isBouncebackWin) trackAchStat('bouncebackWins');
    if (ctx.hadPenaltyClutwch) trackAchStat('penaltyClutwins');
}

function trackDifficultyAndModStats(ctx) {
    if (ctx.diff === 'hard') trackAchStat('hardLevels');
    if (ctx.mods && ctx.mods.hardcore) trackAchStat('hardcoreLevels');
    if (ctx.mods && ctx.mods.timetrial) trackAchStat('timeTrialLevels');
}

function trackClassStats(ctx) {
    if (ctx.playerClass === 'mathmagician') trackAchStat('levelsAsMathmagician');
    if (ctx.playerClass === 'statistician') trackAchStat('levelsAsStatistician');
    if (ctx.playerClass === 'probabilist') trackAchStat('levelsAsProbabilist');

    // NEW: Ascendency Level Completion Tracking
    if (ctx.playerAscendency) {
        // Capitalizes the first letter (e.g. 'actuary' -> 'levelsAsActuary')
        const ascKey = 'levelsAs' + ctx.playerAscendency.charAt(0).toUpperCase() + ctx.playerAscendency.slice(1);
        trackAchStat(ascKey);
    }

    // Mathmagician absorb streak in a single level
    if (ctx.playerClass === 'mathmagician' && ctx.absorbedThisLevel >= 3) {
        trackAchStat('mathmagician3AbsorbOneLevel');
    }
}

function trackTimeStats(ctx) {
    if (ctx.elapsed !== undefined && ctx.elapsed <= 30) trackAchStat('fastClears');
    if (ctx.timerSecs !== undefined && ctx.timerSecs >= 300) trackAchStat('bigTimeLeftWins');
    if (ctx.timerSecs !== undefined && ctx.timerSecs <= 10) trackAchStat('clutchWins');
}

function trackScoreStats(ctx) {
    if (ctx.scoreEarned) trackAchStat('totalScoreEarned', ctx.scoreEarned);
    if (ctx.pts !== undefined && ctx.pts >= 500) trackAchStat('highScoreLevels');
    if (ctx.mult !== undefined && ctx.mult >= 2.0) trackAchStat('highMultiplierWins');

    const isNewPersonalBest = ctx.pts !== undefined &&
        ctx.prevBest !== undefined &&
        ctx.prevBest > 0 &&
        ctx.pts > ctx.prevBest;
    if (isNewPersonalBest) trackAchStat('personalBestsBroken');
}

function trackGridStats(ctx) {
    if (ctx.totalCells !== undefined && ctx.totalCells >= 400) trackAchStat('largeGridClears');

    const isSmallPerfectClear = ctx.rows === 5 && ctx.cols === 5 &&
        ctx.mistakes === 0 && ctx.itemsUsed === 0;
    if (isSmallPerfectClear) trackAchStat('smallPerfectClears');

    const isDenseGrid = ctx.totalCells !== undefined &&
        ctx.cellsFilled !== undefined &&
        ctx.cellsFilled > ctx.totalCells / 2;
    if (isDenseGrid) trackAchStat('denseGridClears');
}

// Counts how many unique worlds the player has completed at least one level in.
function countUniqueWorldsPlayed() {
    const worldsSeen = new Set();
    if (typeof ALL !== 'undefined') {
        const doneLevels = (typeof STATE !== 'undefined') ? STATE.done : [];
        doneLevels.forEach(gi => {
            if (ALL[gi]) worldsSeen.add(ALL[gi].world);
        });
    }
    return worldsSeen.size;
}



//------------------------------------------------------------------------
//-------------------LEVEL-COMPLETE ENTRY POINT---------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// onLevelCompleteAch — call after a level completes, passing the context object.
// ctx shape: { mistakes, itemsUsed, diff, mods, playerClass, absorbedThisLevel,
//              bonusMet, bonusType, world, gi, cellsFilled, totalCells, rows, cols,
//              elapsed, timerSecs, pts, prevBest, mult, scoreEarned,
//              isFirstClear, isBouncebackWin, hadPenaltyClutwch }
function onLevelCompleteAch(ctx) {
    trackBaseCompletionStats(ctx);
    trackAccuracyStats(ctx);
    trackDifficultyAndModStats(ctx);
    trackClassStats(ctx);
    trackTimeStats(ctx);
    trackScoreStats(ctx);
    trackGridStats(ctx);
    setAchStat('worldsPlayed', countUniqueWorldsPlayed());
}


//------------------------------------------------------------------------
//------------------ WORLD-COMPLETE TRACKING  (helpers)-------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

//  Each helper handles one concern for a single world.
//  All are called by checkWorldCompleteAch().

// Returns an array of all global level indices (gi) belonging to a world.
function getLevelIndicesForWorld(worldIndex) {
    const start = WORLD_START_GI[worldIndex];
    return Array.from({ length: WORLDS[worldIndex].data.length }, (_, i) => start + i);
}

// Returns true if every level in the given index list has been completed.
function areAllLevelsCompleted(levelIndices) {
    return typeof STATE !== 'undefined' &&
        levelIndices.every(gi => STATE.done.includes(gi));
}

// Returns true if every level in the given index list was completed with zero mistakes.
function areAllLevelsFlawless(levelIndices) {
    if (typeof STATE.levelMistakes === 'undefined') return false;
    const totalMistakes = levelIndices.reduce(
        (sum, gi) => sum + (STATE.levelMistakes[gi] || 999), 0
    );
    return totalMistakes === 0;
}

// Returns true if every level in the given index list has had its bonus claimed.
function areAllBonusesClaimed(levelIndices) {
    return levelIndices.every(gi => STATE.bonusDone.includes(gi));
}

// Counts how many worlds have been fully completed (all levels done).
function countFullyCompletedWorlds() {
    return WORLDS.filter((w, wi) => {
        if (!w.data.length) return false;
        return areAllLevelsCompleted(getLevelIndicesForWorld(wi));
    }).length;
}

// Counts how many worlds have been completed without a single mistake.
function countFlawlessWorlds() {
    return WORLDS.filter((w, wi) => {
        if (!w.data.length) return false;
        const indices = getLevelIndicesForWorld(wi);
        return areAllLevelsCompleted(indices) && areAllLevelsFlawless(indices);
    }).length;
}

// Counts how many fully-completed worlds also have every bonus claimed.
function countWorldsWithAllBonusesClaimed() {
    return WORLDS.filter((w, wi) => {
        if (!w.data.length) return false;
        const indices = getLevelIndicesForWorld(wi);
        return areAllLevelsCompleted(indices) && areAllBonusesClaimed(indices);
    }).length;
}




//------------------------------------------------------------------------
//------------------WORLD-COMPLETE ENTRY POINT----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// checkWorldCompleteAch — call after updating STATE.done to check world-level milestones.
function checkWorldCompleteAch() {
    if (typeof WORLDS === 'undefined' || typeof WORLD_START_GI === 'undefined') return;

    WORLDS.forEach((w, wi) => {
        if (!w.data.length) return;

        const levelIndices = getLevelIndicesForWorld(wi);
        const worldIsComplete = areAllLevelsCompleted(levelIndices);

        if (worldIsComplete) {
            setAchStat(`world${wi + 1}Complete`, 1);
        }
    });

    // These counts span all worlds, so we compute them once after the loop.
    setAchStat('flawlessWorlds', countFlawlessWorlds());
    setAchStat('worldAllBonusClaimed', countWorldsWithAllBonusesClaimed());
}




//------------------------------------------------------------------------
//------------------------RESET ACHIEVEMENTS------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// resetAchievements — wipes all achievement progress from storage and memory,
//   then rebuilds the UI to reflect the cleared state.
function resetAchievements() {
    showAchResetModal();
}


function _doResetAchievements() {
    localStorage.removeItem(ACH_SAVE_KEY);
    ACH_STATE = { stats: {}, unlocked: [] };
    saveAchState();
    buildAchievementsScreen();
    if (typeof showToast === 'function') showToast("Achievements Cleared!");
}










