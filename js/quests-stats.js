// ═══════════════════════════════════════════════════════════════════════════════
//
//  quests-stats.js  —  State migration + stat tracking
//
//  Depends on: (global) STATE, save()
//  Depends on: quests-logic.js  (_refreshQuestBadge)
//
//  Public API:
//    migrateQuestState(s)
//    updateQuestStats(event, payload)
//
// ═══════════════════════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────
//  STATE MIGRATION  —  called once when a save is loaded
// ─────────────────────────────────────────────────────────────

function migrateQuestState(s) {
    if (!s.questStats) s.questStats = {};
    if (!s.questsClaimed) s.questsClaimed = [];
    if (!s.questsNotified) s.questsNotified = [];
}


// ─────────────────────────────────────────────────────────────
//  PASSIVE-TREE HELPER
//  Returns the number of points the player has actually spent
//  (start node is always free, so subtract 1).
// ─────────────────────────────────────────────────────────────

function _ptCurrentSpentCount() {
    const allocated = (typeof _ptAllocated === 'function') ? _ptAllocated() : new Set();
    return Math.max(0, allocated.size - 1);
}


// ─────────────────────────────────────────────────────────────
//  updateQuestStats  —  single entry point for all other modules
//
//  Each case delegates to a focused helper so the switch stays slim.
// ─────────────────────────────────────────────────────────────

function updateQuestStats(event, payload = {}) {
    if (!STATE.questStats) STATE.questStats = {};

    const qs = STATE.questStats;
    const inc = (key, by = 1) => { qs[key] = (qs[key] || 0) + by; };

    switch (event) {
        case 'levelComplete': _questStats_onLevelComplete(qs, inc, payload); break;
        case 'questionCorrect': _questStats_onQuestionCorrect(inc, payload); break;
        case 'primerFullSolve': inc('primerFullSolves'); break;
        case 'itemUsed': _questStats_onItemUsed(inc, payload); break;
        case 'classAbilityUsed': inc('classAbilitiesUsed'); break;
        case 'momentumTriggered': inc('momentumTriggers'); break;
        case 'tilesRevealed': inc('tilesRevealedByAbility', payload.count || 1); break;
        case 'luckyDrop': inc('luckyDropsClaimed'); break;
        case 'classChosen': if (!qs.classChosen) qs.classChosen = 1; break;
        case 'classUpgradeApplied': inc('classUpgradesApplied'); break;
        case 'passivePointSpent': inc('passivePointsSpent'); break;
        case 'achievementUnlocked': inc('achievementsUnlocked'); break;
        case 'cursedUnderImmunityUsed': inc('_cursedUnderImmunityThisLevel'); break;
    }
    _checkNewlyCompletedQuests();

    save();
    _refreshQuestBadge();
}


// ─────────────────────────────────────────────────────────────
//  EVENT HANDLERS  (private — only called from updateQuestStats)
// ─────────────────────────────────────────────────────────────

// payload: { gi, world, diff, mods, mistakeCount, itemsUsed,
//            isConvergence, worldJustCompleted, luckyDropTriggered,
//            elapsed, timerSecs, pts }
function _questStats_onLevelComplete(qs, inc, payload) {
    inc('levelsCompleted');

    // Basic completion flags
    if (payload.mistakeCount === 0) inc('levelsNomiss');
    if (payload.itemsUsed === 0) inc('levelsNoitem');
    if (payload.diff === 'hard') inc('levelsHard');

    // Active modifier flags
    const mods = payload.mods || {};
    if (mods.hardcore) inc('levelsHardcore');
    if (mods.timetrial) inc('levelsTimetrial');
    if (mods.ironman) inc('levelsIronman');

    // Triple-modifier: hard difficulty + all three modifiers at once
    if (payload.diff === 'hard' && mods.hardcore && mods.timetrial && mods.ironman) {
        inc('levelsTripleModifier');
    }

    // Per-level replay counter
    if (payload.gi !== undefined) inc(`levelReplays_${payload.gi}`);

    // Passive-tree node tracking
    _questStats_trackActivePTNodes(inc);

    // Special level types
    if (payload.isConvergence) inc('convergenceLevels');
    if (payload.worldJustCompleted) inc('worldsCompleted');
    if (payload.luckyDropTriggered) inc('luckyDropsClaimed');

    // Witch immunity quest: commit this level's count only on a won level
    const witchCount = qs._cursedUnderImmunityThisLevel || 0;
    if (witchCount > 0) {
        inc('cursedUnderImmunityWon', witchCount);
        qs._cursedUnderImmunityThisLevel = 0;
    }

    if (payload.isLargeAdjMatrix) inc('levelsLargeAdjMatrix');


}

// Track levels completed while specific passive-tree nodes are allocated
function _questStats_trackActivePTNodes(inc) {
    const hasPTSkill = typeof ptHasSkill === 'function';
    if (!hasPTSkill) return;

    const trackedNodes = [
        'lucky_drops', 'tutor_enable', 'celerity',
        'keystone_apex_collector', 'keystone_curse_embrace',
        'keystone_iron_doctrine', 'keystone_countdown_crisis',
    ];
    trackedNodes.forEach(node => {
        if (ptHasSkill(node)) inc(`levelsWithPTNode_${node}`);
    });

    const replayNodes = ['lucky_drops'];
    if (replayNodes.some(n => ptHasSkill(n))) inc('levelsWithReplayNode');
}

function _questStats_onQuestionCorrect(inc, payload) {
    inc('questionsCorrect');
    if (payload.source === 'quiz') inc('quizCorrect');
    if (payload.source === 'gate') inc('gatesPassed');
    if (payload.source === 'primer') inc('primerCorrect');
}

// Tutor item ids — all variants of the mistake-eraser family
const _TUTOR_ITEM_IDS = new Set([
    'mistakeEraser', 'mistakeEraser4', 'mistakeEraser6', 'mistakeEraserAll',
]);

function _questStats_onItemUsed(inc, payload) {
    inc('itemsUsedTotal');

    if (payload.rarity === 'cursed') inc('cursedItemsUsed');

    const id = payload.defId;
    if (id) {
        if (id.startsWith('reveal') && id !== 'cursedReveal') inc('revealItemsUsed');
        if (_TUTOR_ITEM_IDS.has(id)) inc('tutorItemsUsed');
        if (id === 'scoutPrimer') inc('primerItemsUsed');
    }
}




function _checkNewlyCompletedQuests() {
    if (!STATE.questsNotified) STATE.questsNotified = [];

    // Loop through all existing milestones in our O(1) map
    for (const msId in _MILESTONE_MAP) {
        const { milestone, category } = _MILESTONE_MAP[msId];

        // If it's complete but hasn't been notified yet...
        if (!STATE.questsNotified.includes(msId) && _milestone_isComplete(milestone)) {
            STATE.questsNotified.push(msId);       // Mark as notified
            showQuestToast(milestone, category);   // Push to the queue
        }
    }
}


// Called by the game when a new level starts — clears the witch-immunity per-level counter
function resetWitchImmunityLevelCounter() {
    if (!STATE.questStats) STATE.questStats = {};
    STATE.questStats._cursedUnderImmunityThisLevel = 0;
}