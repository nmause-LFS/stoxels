// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────

/**
 * Passive-tree nodes whose level-completion count is tracked individually.
 * Each active node increments levelsWithPTNode_<nodeId> on every level won.
 */
const _PT_TRACKED_NODES = [
    'lucky_drops',
    'tutor_enable',
    'keystone_apex_collector',
    'keystone_curse_embrace',
    'keystone_iron_doctrine',
    'keystone_countdown_crisis',
];

/**
 * Nodes that qualify a level as a "replay" level for the Markov Chain category.
 * levelsWithReplayNode is incremented if any of these is active.
 */
const _PT_REPLAY_NODES = ['lucky_drops'];

/**
 * Item defIds that count as "tutor" items (the mistake-eraser family).
 * Tracked for the Regression to the Mean category.
 */
const _TUTOR_ITEM_IDS = new Set([
    'mistakeEraser',
    'mistakeEraser4',
    'mistakeEraser6',
    'mistakeEraserAll',
]);


// ─────────────────────────────────────────────────────────────
//  MODULE-LEVEL HELPERS
//  These are set up inside updateQuestStats and reused by all
//  sub-handlers to avoid threading qs/inc as parameters.
// ─────────────────────────────────────────────────────────────

/** @type {Object} - Shorthand reference to STATE.questStats, set in updateQuestStats. */
let _qs = null;

/**
 * Increments a questStats counter by `by` (default 1).
 * Initialises the key to 0 if it doesn't exist yet.
 * Only valid to call while _qs is set (i.e. inside updateQuestStats).
 * @param {string} key
 * @param {number} [by=1]
 */
function _inc(key, by = 1) {
    _qs[key] = (_qs[key] || 0) + by;
}

// ─────────────────────────────────────────────────────────────
//  COMBO CONDITION CHECKER
//
//  Evaluates a declarative list of conditions against a
//  levelComplete payload and increments a named counter if
//  ALL conditions pass.
//
//  Usage (call from _questStats_onLevelComplete):
//    _checkComboConditions(payload, 'myStatKey', [
//        { type: 'ptNode',      node: 'lucky_drops' },
//        { type: 'maxMistakes', value: 0 },
//        { type: 'gridSize',    size: 'large' },
//    ]);
//
//  Grid size buckets (match _initLuckyTiles thresholds):
//    'small'   — < 100 cells
//    'medium'  — 100–199 cells
//    'large'   — 200–399 cells
//    'massive' — 400+ cells
//    'large+'  — large OR massive (convenience alias)
//
//  Condition types:
//    { type: 'ptNode',      node: string }          — node must be allocated
//    { type: 'ptNodes',     nodes: string[] }        — ALL listed nodes allocated
//    { type: 'ptAnyNode',   nodes: string[] }        — AT LEAST ONE node allocated
//    { type: 'maxMistakes', value: number }          — mistakeCount <= value
//    { type: 'exactMistakes', value: number }        — mistakeCount === value
//    { type: 'gridSize',    size: string }           — grid matches bucket name
//    { type: 'minGridSize', size: string }           — grid is at least this bucket
//    { type: 'diff',        diff: string }           — 'easy'|'normal'|'hard'
//    { type: 'mod',         mod: string }            — modifier key is truthy
//    { type: 'noItems' }                             — no items used this level
//    { type: 'noMistakes' }                          — shorthand for maxMistakes 0
// ─────────────────────────────────────────────────────────────

/** Maps size name → minimum cell count for that bucket. */
const _GRID_SIZE_THRESHOLDS = {
    small: 0,
    medium: 100,
    large: 200,
    massive: 400,
};

/**
 * Returns the grid-size bucket name for a given cell count.
 * @param {number} cells
 * @returns {'small'|'medium'|'large'|'massive'}
 */
function _gridSizeBucket(cells) {
    if (cells >= 400) return 'massive';
    if (cells >= 200) return 'large';
    if (cells >= 100) return 'medium';
    return 'small';
}

/**
 * Returns true if `bucket` meets or exceeds `minBucket` in the size ordering.
 */
function _gridSizeAtLeast(bucket, minBucket) {
    const order = ['small', 'medium', 'large', 'massive'];
    return order.indexOf(bucket) >= order.indexOf(minBucket);
}

/**
 * Evaluates every condition in the array against the payload.
 * Returns true only if ALL conditions pass.
 *
 * @param {Object}   payload    - The levelComplete payload
 * @param {Object[]} conditions - Array of condition descriptors
 * @returns {boolean}
 */
function _allComboConditionsMet(payload, conditions) {
    const rows = cur ? cur.grid.length : 0;
    const cols = cur ? cur.grid[0].length : 0;
    const cells = rows * cols;
    const bucket = _gridSizeBucket(cells);
    const mods = payload.mods || {};

    for (const cond of conditions) {
        switch (cond.type) {

            case 'ptNode':
                if (typeof ptHasSkill !== 'function' || !ptHasSkill(cond.node)) return false;
                break;

            case 'ptNodes':
                if (typeof ptHasSkill !== 'function') return false;
                if (!cond.nodes.every(n => ptHasSkill(n))) return false;
                break;

            case 'ptAnyNode':
                if (typeof ptHasSkill !== 'function') return false;
                if (!cond.nodes.some(n => ptHasSkill(n))) return false;
                break;

            case 'maxMistakes':
                if (payload.mistakeCount > cond.value) return false;
                break;

            case 'exactMistakes':
                if (payload.mistakeCount !== cond.value) return false;
                break;

            case 'noMistakes':
                if (payload.mistakeCount !== 0) return false;
                break;

            case 'noItems':
                if (payload.itemsUsed !== 0) return false;
                break;

            case 'gridSize':
                // 'large+' is a convenience alias meaning large or massive
                if (cond.size === 'large+') {
                    if (bucket !== 'large' && bucket !== 'massive') return false;
                } else {
                    if (bucket !== cond.size) return false;
                }
                break;

            case 'minGridSize':
                if (!_gridSizeAtLeast(bucket, cond.size)) return false;
                break;

            case 'diff':
                if (payload.diff !== cond.diff) return false;
                break;

            case 'mod':
                if (!mods[cond.mod]) return false;
                break;

            case 'minMistakes':
                if ((payload.mistakeCount || 0) < cond.value) return false;
                break;

            default:
                console.warn(`[quests] Unknown combo condition type: "${cond.type}"`);
        }
    }
    return true;
}

/**
 * If all conditions pass, increments STATE.questStats[statKey] by 1.
 * Call this from _questStats_onLevelComplete for each combo quest.
 *
 * @param {Object}   payload    - The levelComplete payload
 * @param {string}   statKey    - The questStats counter to increment
 * @param {Object[]} conditions - Array of condition descriptors
 */
function _checkComboConditions(payload, statKey, conditions) {
    if (_allComboConditionsMet(payload, conditions)) _inc(statKey);
}


























// ─────────────────────────────────────────────────────────────
//  STATE MIGRATION  —  called once when a save is loaded
// ─────────────────────────────────────────────────────────────

/**
 * Ensures the required quest sub-objects exist on the save state.
 * Safe to call on both fresh saves and existing saves.
 * @param {Object} s - The full STATE object.
 */
function migrateQuestState(s) {
    if (!s.questStats) s.questStats = {};
    if (!s.questsClaimed) s.questsClaimed = [];
    if (!s.questsNotified) s.questsNotified = [];
}


// ─────────────────────────────────────────────────────────────
//  PASSIVE-TREE HELPER
// ─────────────────────────────────────────────────────────────

/**
 * Returns how many passive-tree points the player has actually spent.
 * The origin/start node is always free, so we subtract 1 from the allocated set size.
 * Returns 0 if the passive tree isn't initialised yet.
 * @returns {number}
 */
function _ptCurrentSpentCount() {
    const allocated = (typeof _ptAllocated === 'function') ? _ptAllocated() : new Set();
    return Math.max(0, allocated.size - 1);
}


function _questStats_onClassAbilityThisLevel() {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats._ql_classAbilitiesThisLevel =
        (STATE.questStats._ql_classAbilitiesThisLevel || 0) + 1;
}


// ─────────────────────────────────────────────────────────────
//  updateQuestStats  —  single public entry point
//
//  All other modules call this with an event string and an optional
//  payload object. Each event delegates to a focused private handler.
//  After handling, we check for newly completed milestones, save, and
//  refresh the badge.
// ─────────────────────────────────────────────────────────────

/**
 * Records a game event and updates the relevant quest statistics.
 * This is the only function other modules should call.
 *
 * @param {string} event   - Event name (see switch cases below)
 * @param {Object} [payload={}]  - Event-specific data
 */
function updateQuestStats(event, payload = {}) {
    // Ensure questStats exists (safety net alongside migrateQuestState)
    if (!STATE.questStats) STATE.questStats = {};

    // Set module-level shorthand so sub-handlers can call _inc() directly
    _qs = STATE.questStats;

    switch (event) {
        case 'levelComplete': _questStats_onLevelComplete(payload); break;
        case 'questionCorrect': _questStats_onQuestionCorrect(payload); break;
        case 'primerFullSolve': _inc('primerFullSolves'); break;
        case 'itemUsed': _questStats_onItemUsed(payload); break;
        case 'classAbilityUsed': _inc('classAbilitiesUsed'); break;
        case 'momentumTriggered': _inc('momentumTriggers'); break;
        case 'tilesRevealed': _inc('tilesRevealedByAbility', payload.count || 1); break;
        case 'luckyDrop': _inc('luckyDropsClaimed'); break;
        case 'classChosen': _questStats_onClassChosen(); break;
        case 'classUpgradeApplied': _inc('classUpgradesApplied'); break;
        case 'ascendencyChosen': _questStats_onAscendencyChosen(); break;
        case 'ascendencyUpgradeApplied': _inc('ascendencyUpgradesApplied'); break;
        case 'passivePointSpent': _inc('passivePointsSpent'); break;
        case 'achievementUnlocked': _inc('achievementsUnlocked'); break;
        case 'cursedUnderImmunityUsed': _inc('_cursedUnderImmunityThisLevel'); break;
        case 'classAbilityUsedThisLevel': _questStats_onClassAbilityThisLevel(); break;
    }

    _questStats_checkNewlyCompleted();

    save();
    _refreshQuestBadge();

    // Clear the module-level shorthand to prevent accidental use outside this call
    _qs = null;
}




// ─────────────────────────────────────────────────────────────
//  PER-LEVEL COUNTERS FOR COMBO QUESTS
//  All keys prefixed with _ql_ (quest-level) live in STATE.questStats
//  but are treated as ephemeral — they are reset at level start via
//  resetQuestLevelCounters() and committed (or discarded) at level end.
// ─────────────────────────────────────────────────────────────

/**
 * Resets all per-level quest counters.
 * Called from _resetLevelState() in start-level.js at the start of every level.
 */
function resetQuestLevelCounters() {
    if (!STATE.questStats) STATE.questStats = {};
    const qs = STATE.questStats;
    qs._ql_mistakesRemovedThisLevel = 0;
    qs._ql_cursesBlockedThisLevel = 0;
    qs._ql_timerItemsUsedThisLevel = 0;
    qs._ql_classAbilitiesThisLevel = 0;
    qs._ql_revealItemsThisLevel = 0;
    qs._ql_shadowSealUsedAt = null;  // timestamp or null
    qs._ql_erasedRowsThisLevel = 0;
    qs._ql_tutorQuestCorrectThisLevel = 0;
    qs._ql_tutorAllFiveThisLevel = 0;
    qs._ql_mcWrongRemovedThisLevel = 0;
    qs._ql_primerHintsThisLevel = 0;
    qs._ql_primerRowsThisLevel = 0;
    qs._ql_primerColsThisLevel = 0;
    qs._ql_sampleEffRevThisLevel = 0;
    qs._ql_gamblersTimeAddedThisLevel = 0;
    qs._ql_fieldScanRevThisLevel = 0;
    qs._ql_abilityRevealsThisLevel = 0;
    qs._ql_abilityMarksThisLevel = 0;
    qs._ql_confIntIgnoredThisLevel = 0;
    qs._ql_classAbilityRevThisLevel = 0;   // tiles revealed via class ability (oracle check)
    qs._ql_hasUsedManualReveal = false;
    qs._ql_hasUsedClassReveal = false;
    qs._ql_hasManuallyFilledCell = false;
}


// ─────────────────────────────────────────────────────────────
//  MID-LEVEL QUEST STAT EVENTS
//  These are called from various game systems (not just level-complete).
//  Each handler increments a per-level or global counter and then
//  runs the standard newly-completed check.
// ─────────────────────────────────────────────────────────────

/** Called from _useMistakeEraser when mistakes are actually removed. */
function questStat_mistakesRemoved(count) {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats._ql_mistakesRemovedThisLevel =
        (STATE.questStats._ql_mistakesRemovedThisLevel || 0) + count;
}

/** Called when a curse downside is blocked (shield, witch immunity, ward, etc.). */
function questStat_curseBlocked() {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats._ql_cursesBlockedThisLevel =
        (STATE.questStats._ql_cursesBlockedThisLevel || 0) + 1;
}

/** Called from _useAddTime when a timer item is consumed (regardless of +/-). */
function questStat_timerItemUsed() {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats._ql_timerItemsUsedThisLevel =
        (STATE.questStats._ql_timerItemsUsedThisLevel || 0) + 1;
}

/** Called when a reveal item (not cursedReveal) is used. */
function questStat_revealItemUsed() {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats._ql_revealItemsThisLevel =
        (STATE.questStats._ql_revealItemsThisLevel || 0) + 1;
    STATE.questStats._ql_hasUsedManualReveal = true;
}

/** Called from a class ability when it reveals cells. */
function questStat_classRevealUsed(count) {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats._ql_abilityRevealsThisLevel =
        (STATE.questStats._ql_abilityRevealsThisLevel || 0) + (count || 1);
    STATE.questStats._ql_hasUsedClassReveal = true;
}

/** Called from a class ability when it marks wrong cells. */
function questStat_classMarkUsed(count) {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats._ql_abilityMarksThisLevel =
        (STATE.questStats._ql_abilityMarksThisLevel || 0) + (count || 1);
}

/** Called when Shadow Seal is used (records the timestamp for the 10-second window check). */
function questStat_shadowSealUsed() {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats._ql_shadowSealUsedAt = Date.now();
}

/** Called when a cursed row/col erasure happens (unsolveRows / unsolveCols). */
function questStat_rowsErased(count) {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats._ql_erasedRowsThisLevel =
        (STATE.questStats._ql_erasedRowsThisLevel || 0) + count;
    // Also track the global total for the quest
    STATE.questStats.totalRowsErased =
        (STATE.questStats.totalRowsErased || 0) + count;
}

/** Called when a tutor answers a question correctly (gate, quiz, or primer). */
function questStat_tutorAnsweredCorrect() {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats.tutorQuestCorrect =
        (STATE.questStats.tutorQuestCorrect || 0) + 1;
    STATE.questStats._ql_tutorQuestCorrectThisLevel =
        (STATE.questStats._ql_tutorQuestCorrectThisLevel || 0) + 1;

    if ((STATE.questStats._ql_tutorQuestCorrectThisLevel || 0) >= 5) {
        STATE.questStats.primerTutorAllFive = (STATE.questStats.primerTutorAllFive || 0) + 1;
        STATE.questStats._ql_tutorQuestCorrectThisLevel = 0; // reset for next chain
    }
}

/** Called when a MC question is shown with a wrong answer already eliminated. */
function questStat_mcWrongAnswerEliminated() {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats.mcWrongAnswersEliminated =
        (STATE.questStats.mcWrongAnswersEliminated || 0) + 1;
    STATE.questStats._ql_mcWrongRemovedThisLevel =
        (STATE.questStats._ql_mcWrongRemovedThisLevel || 0) + 1;
}

/** Called when a primer hint appears (wrong attempt with wisdom_through_failure). */
function questStat_primerHintShown() {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats.primerHintsTotal =
        (STATE.questStats.primerHintsTotal || 0) + 1;
}

/** Called at end of primer with total rows + cols revealed. */
function questStat_primerRowsColsRevealed(rows, cols) {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats.primerTotalRowsRevealed =
        (STATE.questStats.primerTotalRowsRevealed || 0) + rows;
    STATE.questStats.primerTotalColsRevealed =
        (STATE.questStats.primerTotalColsRevealed || 0) + cols;
}

/** Called from Sample Efficiency node when a cell is auto-revealed by the streak. */
function questStat_sampleEfficiencyReveal() {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats._ql_sampleEffRevThisLevel =
        (STATE.questStats._ql_sampleEffRevThisLevel || 0) + 1;
    STATE.questStats.sampleEfficiencyRevealsTotal =
        (STATE.questStats.sampleEfficiencyRevealsTotal || 0) + 1;
}

/** Called when Gambler's Ruin adds time from a correct fill. */
function questStat_gamblersRuinTimeAdded(secs) {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats.gamblersRuinTotalTimeAdded =
        (STATE.questStats.gamblersRuinTotalTimeAdded || 0) + secs;
    STATE.questStats._ql_gamblersTimeAddedThisLevel =
        (STATE.questStats._ql_gamblersTimeAddedThisLevel || 0) + secs;
}

/** Called when a field scan reveals a correct cell. */
function questStat_fieldScanCellRevealed(count) {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats.fieldScanCorrectReveals =
        (STATE.questStats.fieldScanCorrectReveals || 0) + (count || 1);
    STATE.questStats._ql_fieldScanRevThisLevel =
        (STATE.questStats._ql_fieldScanRevThisLevel || 0) + (count || 1);
}

/** Called when the Confidence Interval node ignores a mistake. */
function questStat_confidenceIntervalIgnored() {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats.confidenceIntervalIgnored =
        (STATE.questStats.confidenceIntervalIgnored || 0) + 1;
    STATE.questStats._ql_confIntIgnoredThisLevel =
        (STATE.questStats._ql_confIntIgnoredThisLevel || 0) + 1;
}
















// ─────────────────────────────────────────────────────────────
//  LEVEL-COMPLETE HANDLER  —  split into focused sub-functions
//
//  Expected payload shape:
//    { gi, world, diff, mods, mistakeCount, itemsUsed,
//      isConvergence, worldJustCompleted, luckyDropTriggered,
//      isLargeAdjMatrix, elapsed, timerSecs, pts }
// ─────────────────────────────────────────────────────────────

/**
 * Master handler for the 'levelComplete' event.
 * Delegates each concern to a dedicated sub-handler.
 * @param {Object} payload
 */
function _questStats_onLevelComplete(payload) {
    _inc('levelsCompleted');

    _questStats_trackBasicFlags(payload);
    _questStats_trackModifierFlags(payload.mods || {});
    _questStats_trackTripleModifier(payload);
    _questStats_trackPerLevelReplay(payload.gi);
    _questStats_trackActivePTNodes();
    _questStats_trackSpecialLevelTypes(payload);
    _questStats_commitWitchImmunity();
    _questStats_trackComboQuests(payload);
}

/**
 * Tracks basic per-level outcome flags: no-miss, no-item, hard difficulty.
 * @param {Object} payload
 */
function _questStats_trackBasicFlags(payload) {
    if (payload.mistakeCount === 0) _inc('levelsNomiss');
    if (payload.itemsUsed === 0) _inc('levelsNoitem');
    if (payload.diff === 'hard') _inc('levelsHard');
}

/**
 * Tracks which optional modifiers (Hardcore, Time Trial, Ironman) were active.
 * @param {Object} mods - The mods sub-object from the payload.
 */
function _questStats_trackModifierFlags(mods) {
    if (mods.hardcore) _inc('levelsHardcore');
    if (mods.timetrial) _inc('levelsTimetrial');
    if (mods.ironman) _inc('levelsIronman');
    if (mods.classless) _inc('levelsClassless');
    if (mods.treeless) _inc('levelsTreeless');
}

/**
 * Tracks the Triple-Modifier stat: Hard difficulty with all three modifiers active simultaneously.
 * Required for the Monte Carlo Method category.
 * @param {Object} payload
 */
function _questStats_trackTripleModifier(payload) {
    const mods = payload.mods || {};
    if (payload.diff === 'hard' && mods.hardcore && mods.timetrial && mods.ironman && mods.classless && mods.treeless) {
        _inc('levelsTripleModifier');
    }
}

/**
 * Increments the per-level replay counter for the specific level index.
 * Used to detect replaying levels with the Lucky Drops node active.
 * @param {number|undefined} gi - Level grid index, may be undefined for special levels.
 */
function _questStats_trackPerLevelReplay(gi) {
    if (gi !== undefined) _inc(`levelReplays_${gi}`);
}

/**
 * Tracks which passive-tree nodes were active when a level was completed.
 * Does nothing if ptHasSkill is not available (passive tree not loaded).
 */
function _questStats_trackActivePTNodes() {
    if (typeof ptHasSkill !== 'function') return;

    // Increment a per-node counter for every tracked node that is currently allocated
    _PT_TRACKED_NODES.forEach(node => {
        if (ptHasSkill(node)) _inc(`levelsWithPTNode_${node}`);
    });

    // levelsWithReplayNode is used by the Markov Chain category
    if (_PT_REPLAY_NODES.some(n => ptHasSkill(n))) {
        _inc('levelsWithReplayNode');
    }
}

/**
 * Tracks special level type completions: Convergence levels, world clears,
 * Lucky Drop triggers on completion, and large-grid Adjacency Matrix levels.
 * @param {Object} payload
 */
function _questStats_trackSpecialLevelTypes(payload) {
    if (payload.isConvergence) _inc('convergenceLevels');
    if (payload.worldJustCompleted) {
        _inc('worldsCompleted');
        // Record the world index so replays never re-trigger this
        if (!_qs._worldsCountedList) _qs._worldsCountedList = [];
        if (payload.worldIndex !== undefined && !_qs._worldsCountedList.includes(payload.worldIndex)) {
            _qs._worldsCountedList.push(payload.worldIndex);
        }
    }
    if (payload.luckyDropTriggered) _inc('luckyDropsClaimed');
    if (payload.isLargeAdjMatrix) _inc('levelsLargeAdjMatrix');
}

/**
 * Commits the per-level Witch Immunity counter to the persistent total.
 * The per-level counter (_cursedUnderImmunityThisLevel) is only added to
 * cursedUnderImmunityWon on a successfully completed level — not on loss or quit.
 * Resets the per-level counter to zero afterwards.
 */
function _questStats_commitWitchImmunity() {
    const witchCount = _qs._cursedUnderImmunityThisLevel || 0;
    if (witchCount > 0) {
        _inc('cursedUnderImmunityWon', witchCount);
        _qs._cursedUnderImmunityThisLevel = 0;
    }
}


/**
 * Evaluates all combo quests at level-complete time.
 * Per-level counters are read here and committed to permanent stats or discarded.
 */
function _questStats_trackComboQuests(payload) {
    const qs = _qs;  // shorthand already set by updateQuestStats
    const rows = cur ? cur.grid.length : 0;
    const cols = cur ? cur.grid[0].length : 0;
    const cells = rows * cols;
    const isMassive = cells >= 400;
    const isLarge = cells >= 200;
    const mods = payload.mods || {};
    const elapsed = payload.elapsed || 0;

    // ── Quest 1: Remove 50 mistakes in a single level ─────────────────────
    if ((qs._ql_mistakesRemovedThisLevel || 0) >= 50) {
        _inc('levelsRemovedFiftyMistakes');
    }

    // ── Quest 2: Block 15 curses in a single level ────────────────────────
    if ((qs._ql_cursesBlockedThisLevel || 0) >= 15) {
        _inc('levelsBlockedFifteenCurses');
    }

    // ── Quest 3: Countdown Crisis — 30 timer items + finish in last 30 s ──
    const countdownCrisisActive = typeof ptHasSkill === 'function' && ptHasSkill('keystone_countdown_crisis');
    if (countdownCrisisActive &&
        (qs._ql_timerItemsUsedThisLevel || 0) >= 30 &&
        (payload.timerSecsAtWin !== undefined ? payload.timerSecsAtWin <= 30 : false)) {
        _inc('countdownCrisisFinishes');
    }

    // ── Quest 4: Use 30 class abilities in a single level ─────────────────
    if ((qs._ql_classAbilitiesThisLevel || 0) >= 30) {
        _inc('levelsThirtyClassAbilities');
    }

    // ── Quest 5: Finish massive grid using only reveal items — no manual fills, no ability reveals
    if (isMassive &&
        (qs._ql_revealItemsThisLevel || 0) > 0 &&
        !qs._ql_hasManuallyFilledCell &&
        !qs._ql_hasUsedClassReveal) {
        _inc('massiveGridPureItemReveal');
    }

    // ── Quest 6: Massive grid — Shadow Seal used within first 10 seconds ──
    if (isMassive && qs._ql_shadowSealUsedAt !== null) {
        const secsIntoLevel = (qs._ql_shadowSealUsedAt - (levelStartTime || qs._ql_shadowSealUsedAt)) / 1000;
        if (secsIntoLevel <= 10) {
            _inc('massiveGridShadowSealEarly');
        }
    }

    // ── Quest 7: Erase 10+ filled rows/cols (cursed items) ───────────────
    // Global counter tracked in questStat_rowsErased, milestones use totalRowsErased

    // ── Quest 13: Complete large grid with overfitting + ≥25 mistakes ─────
    _checkComboConditions(payload, 'levelsOverfitHighMistakes', [
        { type: 'ptNode', node: 'keystone_overfitting' },
        { type: 'minGridSize', size: 'large' },
        { type: 'minMistakes', value: 25 },
    ]);

    // ── Quest 15: Complete level while completion text visible ────────────
    _checkComboConditions(payload, 'levelsWithGlimpseVisible', [
        { type: 'ptNode', node: 'completion_glimpse_1' },
    ]);

    // ── Quest 16: Massive grid with Signal to Noise active ────────────────
    _checkComboConditions(payload, 'massiveGridsSignalToNoise', [
        { type: 'ptNode', node: 'keystone_signal_to_noise' },
        { type: 'gridSize', size: 'massive' },
    ]);

    // ── Quest 17: Massive grid with The Oracle active ─────────────────────
    _checkComboConditions(payload, 'massiveGridsOracle', [
        { type: 'ptNode', node: 'keystone_the_oracle' },
        { type: 'gridSize', size: 'massive' },
    ]);

    // ── Quest 18: Large grid with Degrees of Freedom ──────────────────────
    _checkComboConditions(payload, 'largeGridsDegreesOfFreedom', [
        { type: 'ptNode', node: 'keystone_degrees_of_freedom' },
        { type: 'minGridSize', size: 'large' },
    ]);

    // ── Quest 19: Large grid with Random Walk ─────────────────────────────
    _checkComboConditions(payload, 'largeGridsRandomWalk', [
        { type: 'ptNode', node: 'keystone_random_walk' },
        { type: 'minGridSize', size: 'large' },
    ]);

    // ── Quest 20: Emergency scan triggered on massive grid ────────────────
    if (isMassive && window._emergencyScanFired) {
        _inc('massiveGridsEmergencyScan');
    }

    // ── Quest 22: Entropy Drain + massive grid ────────────────────────────
    _checkComboConditions(payload, 'massiveGridsEntropyDrain', [
        { type: 'ptNode', node: 'keystone_entropy_drain' },
        { type: 'gridSize', size: 'massive' },
    ]);

    // ── Quest 23: Dead Reckoning levels ───────────────────────────────────
    _checkComboConditions(payload, 'levelsDeadReckoning', [
        { type: 'ptNode', node: 'keystone_dead_reckoning' },
    ]);

    // ── Quest 24: Massive grid with Frequentist's Burden ─────────────────
    _checkComboConditions(payload, 'massiveGridsFrequentistsBurden', [
        { type: 'ptNode', node: 'keystone_frequentists_burden' },
        { type: 'gridSize', size: 'massive' },
    ]);

    // ── Quest 27: Massive grid with Sparse Prior ──────────────────────────
    _checkComboConditions(payload, 'massiveGridsSparsePrior', [
        { type: 'ptNode', node: 'keystone_sparse_prior' },
        { type: 'gridSize', size: 'massive' },
    ]);

    // ── Quest 29: Level with Adjacency Matrix active ──────────────────────
    _checkComboConditions(payload, 'levelsAdjacencyMatrix', [
        { type: 'ptNode', node: 'adjacency_matrix' },
    ]);

    // Flawless large grid (200+ cells, 0 mistakes)
    _checkComboConditions(payload, 'precisionOnLargeGrids', [
        { type: 'minGridSize', size: 'large' },
        { type: 'noMistakes' },
    ]);
}


// ─────────────────────────────────────────────────────────────
//  OTHER EVENT HANDLERS
// ─────────────────────────────────────────────────────────────

/**
 * Handles a correct answer event.
 * Increments the global correct-answer counter plus the source-specific counter.
 * @param {Object} payload - { source: 'quiz' | 'gate' | 'primer' | undefined }
 */
function _questStats_onQuestionCorrect(payload) {
    _inc('questionsCorrect');
    if (payload.source === 'quiz') _inc('quizCorrect');
    if (payload.source === 'gate') _inc('gatesPassed');
    if (payload.source === 'primer') _inc('primerCorrect');
}

/**
 * Handles an item-used event.
 * Increments the total items counter plus category-specific counters.
 * @param {Object} payload - { defId: string, rarity: string }
 */
function _questStats_onItemUsed(payload) {
    _inc('itemsUsedTotal');

    if (payload.rarity === 'cursed') {
        _inc('cursedItemsUsed');
    }

    const id = payload.defId;
    if (!id) return;

    // Reveal items: all 'reveal*' ids except the cursed variant
    if (id.startsWith('reveal') && id !== 'cursedReveal') {
        _inc('revealItemsUsed');
    }

    // Tutor items: the full mistake-eraser family
    if (_TUTOR_ITEM_IDS.has(id)) {
        _inc('tutorItemsUsed');
    }

    // Scout's Primer item
    if (id === 'scoutPrimer') {
        _inc('primerItemsUsed');
    }
}

/**
 * Handles the 'classChosen' event.
 * Only sets the flag once — subsequent class changes don't re-trigger it.
 */
function _questStats_onClassChosen() {
    if (!_qs.classChosen) _qs.classChosen = 1;
}

/**
 * Handles the 'ascendencyChosen' event.
 * Only sets the flag once.
 */
function _questStats_onAscendencyChosen() {
    if (!_qs.ascendencyChosen) _qs.ascendencyChosen = 1;
}


// ─────────────────────────────────────────────────────────────
//  MILESTONE COMPLETION CHECK
// ─────────────────────────────────────────────────────────────

/**
 * Scans all milestones and fires a toast notification for any that have
 * just become complete (complete but not yet notified).
 * Called at the end of every updateQuestStats() call.
 */
function _questStats_checkNewlyCompleted() {
    if (!STATE.questsNotified) STATE.questsNotified = [];

    for (const msId in _MILESTONE_MAP) {
        const { milestone, category } = _MILESTONE_MAP[msId];

        const alreadyNotified = STATE.questsNotified.includes(msId);
        if (!alreadyNotified && _milestone_isComplete(milestone)) {
            STATE.questsNotified.push(msId);
            showQuestToast(milestone, category);
        }
    }
}


// ─────────────────────────────────────────────────────────────
//  LEVEL-START RESET
// ─────────────────────────────────────────────────────────────

/**
 * Resets the per-level Witch Immunity counter at the start of each new level.
 * Must be called by the game when a level begins so we never carry stale counts
 * from an abandoned level into the next one.
 */
function resetWitchImmunityLevelCounter() {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats._cursedUnderImmunityThisLevel = 0;
}