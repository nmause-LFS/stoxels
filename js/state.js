//------------------------------------------------------------------------
// ----------------GAME STATE VARIABLES-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// State variables that describe whats happening in the current level, reset at the start of each level

let cur = null;         // set to the current level's puzzle object when a level starts; see startLevel() in screens.js

let userGrid = [];      // built as an empty grid at the start of each level, then updated with the player's fills and marks as they interact with the puzzle
// (e.g. userGrid[3][5] === 2 means the cell at row 3, column 5 is currently marked with an ✕ by the player)

let wrongGrid = [];     // built as an empty grid at the start of each level, then updated with true values for any cells the player fills incorrectly;
// used to show red ✕ marks and apply time penalties

let revealedGrid = [];  // built as an empty grid at the start of each level, then updated with true values for any cells revealed by items and classes;
// (shown in green, counts as correct, cannot be un-filled)


let mistakeCount = 0;           // amount of wrong fills the player has made this level; used to calculate score penalties and track progress towards Hardcore mode failure

let absorbedMistakes = 0;       // amount of wrong fills that were absorbed by the shield item or a class passive ability; these do not count towards the mistakeCount or trigger penalties, 
// but are tracked separately so they can be used for achievements

let itemsUsedThisLevel = 0;     // counts how many items the player has used this level, used for achievements


let dead = false;               // set to true when the timer hits 0 or a Hardcore mistake occurs; prevents further input and stops the timer


let levelStartTime = 0;         // Date.now() timestamp when the level begins, used for accurate elapsed-time display on the win overlay regardless of item time changes


let shieldActive = false;   // when true, the next mistake will be absorbed by the shield instead of counting towards the mistakeCount or triggering penalties; 
// resets to false after absorbing one mistake

let timerFrozen = false;    // when true, the timer is paused and will not count down; set to true by the Freeze item or Absolute Zero class skill, 
// and reset to false when the freeze duration expires

let quizAnsweredCorrectly = false;  // set to true if the player answers the quiz correctly, false if they skip or answer incorrectly;
// read by scoring.js to determine whether to award the bonus reward


let luckyTiles = new Set();         // e.g. if the tile at row 3, column 5 is lucky, luckyTiles will contain the string "3-5"

let luckyRewardClaimed = 0;     // This is used to ensure the player can only get the lucky item reward once per level, even if they fill multiple lucky tiles



let screenHistory = [];     // a stack of screen IDs representing the player's navigation history, used for back navigation with the Escape key or Back button;
// push screen IDs when navigating forward, pop when going back


let consecutiveCorrectFills = 0;  // sample_efficiency: resets on time-costing mistake, increments on correct fill
let _lawOfLargeNumbersNext = null; // keystone_law_of_large_numbers: timestamp of next auto-reveal tick

let _confidenceIntervalActive = false; // confidence_interval: true during the grace window after a mistake
let _confidenceIntervalUsed = false;  // confidence_interval: true if the CI window was just consumed (prevents back-to-back activations)

let _streakBonusFills = 0;             // streak_bonus: consecutive correct fills since last mistake

let axisLockEnabled = false;   // when true, drag strokes are locked to the row or column of the starting cell





//------------------------------------------------------------------------
//------------------------GAME PERSISTENCE----------- --------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// loadState — reads the JSON string from localStorage and parses it.
//             Returns null if nothing is saved yet or the data is corrupt.
function loadState() {
    try {
        return JSON.parse(localStorage.getItem('stoxels') || 'null');
    } catch {
        return null; // corrupted data — fall back to a fresh state
    }
}


// initState — called once at startup.
//             If saved data exists it is returned (with a safety-net that
//             adds various arrays in case this is an older save that
//             predates these fields).
//             If no save exists a brand-new empty STATE object is returned.
function initState() {
    const s = loadState();
    if (s) {
        // Migration guard for older saves
        if (!s.bonusDone) s.bonusDone = [];
        if (s.tutorialDone === undefined) s.tutorialDone = false;
        if (!s.mathGatePassed) s.mathGatePassed = [];
        if (s.primerPending === undefined) s.primerPending = false;
        if (!s.classWorldsCompleted) s.classWorldsCompleted = [];
        if (s.playerClass === undefined) s.playerClass = null;
        if (!s.classPassiveLevel) s.classPassiveLevel = 1;
        if (!s.classActiveLevel) s.classActiveLevel = 1;
        if (!s.classActive1Level) s.classActive1Level = s.classActiveLevel || 1;
        if (!s.classActive2Level) s.classActive2Level = s.classActiveLevel || 1;
        if (s.classUpgradesAvailable === undefined) s.classUpgradesAvailable = 0;
        if (!s.classActiveChoice || typeof s.classActiveChoice === 'number') s.classActiveChoice = 'active1';
        if (!s.achStats) s.achStats = {};
        if (!s.convergenceDone) s.convergenceDone = [];
        if (s.passiveTreePoints === undefined) s.passiveTreePoints = 0;
        // Ascendency migration guards
        if (s.playerAscendency === undefined) s.playerAscendency = null;
        if (!s.ascendencySkill1Level) s.ascendencySkill1Level = 1;
        if (!s.ascendencySkill2Level) s.ascendencySkill2Level = 1;
        if (!s.ascendencyWorldsCompleted) s.ascendencyWorldsCompleted = [];
        if (!s.passiveTreeAllocated || !Array.isArray(s.passiveTreeAllocated)) {
            s.passiveTreeAllocated = new Set();
        } else {
            s.passiveTreeAllocated = new Set(s.passiveTreeAllocated);
        }
        migrateQuestState(s);
        return s;
    }
    // Fresh save structure 
    return {
        totalScore: 0,
        levelHS: {},
        inventory: [],
        unlockedCodes: [],
        done: [],
        bonusDone: [],
        tutorialDone: false,
        mathGatePassed: [],
        primerPending: false,
        playerClass: null,
        classPassiveLevel: 1,
        classActiveLevel: 1,
        classActive1Level: 1,
        classActive2Level: 1,
        classUpgradesAvailable: 0,
        classWorldsCompleted: [],
        classActiveChoice: 'active1',
        convergenceDone: [],
        passiveTreePoints: 0,
        passiveTreeAllocated: new Set(),
        questStats: {},
        questsClaimed: [],
        questsNotified: [],
        playerAscendency: null,
        ascendencySkill1Level: 1,
        ascendencySkill2Level: 1,
        ascendencyWorldsCompleted: [],
    };
}

// STATE is the single source of truth for all persistent progress.
// Every screen that reads scores, inventory, or completion status reads from here.
let STATE = initState();

// save — serialises STATE to localStorage.
//        Called whenever STATE changes (after completing a level,
//        using/selling an item, unlocking a code, etc.).
function save() {
    const toSave = { ...STATE };
    if (STATE.passiveTreeAllocated instanceof Set) {
        toSave.passiveTreeAllocated = [...STATE.passiveTreeAllocated];
    }
    localStorage.setItem('stoxels', JSON.stringify(toSave));
}





//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------