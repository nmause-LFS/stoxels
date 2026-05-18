

// The gi waiting to be launched after a correct answer.
let pendingGateGi = null;

// The question object currently shown in the modal.
let currentGateQuestion = null;

// Number of wrong tries on the current question.
let gateAttempts = 0;


// Levels that are locked behind the Probability Gate
const MATH_GATE_LEVELS = [
    { world: 1, level: 6 },   
    { world: 2, level: 1 },   
    { world: 2, level: 6 },   
    { world: 3, level: 1 },   
    { world: 3, level: 4 },   
    { world: 3, level: 7 },   
    { world: 4, level: 1 },   
    { world: 4, level: 3 },   
    { world: 4, level: 5 },   
    { world: 4, level: 7 },   
    { world: 4, level: 9 },   
    { world: 5, level: 1 },   
    { world: 5, level: 4 },
    { world: 5, level: 8 },
    { world: 5, level: 10 },
];




//------------------------------------------------------------------------
//-------------------GENERAL MATH GATE FUNCTIONS--------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Builds the Set of gated gi values at runtime, skipping entries whose
// world or level doesn't exist yet.
function buildMathGateSet() {
    const s = new Set();
    MATH_GATE_LEVELS.forEach(({ world, level }) => {
        const wi = world - 1;          // convert to 0-based world index
        const worldData = WORLDS[wi];
        if (!worldData) return; // world doesn't exist
        if (level > worldData.data.length) return; // level doesn't exist yet
        const gi = WORLD_START_GI[wi] + (level - 1);
        s.add(gi);
    });
    return s;
}

let MATH_GATE_GI = buildMathGateSet();

// Returns true if this level requires passing a math gate.
function isGatedLevel(gi) {
    return MATH_GATE_GI.has(gi);
}

// Returns true if the player has already passed the gate for this gi.
function isMathGatePassed(gi) {
    return STATE.mathGatePassed && STATE.mathGatePassed.includes(gi);
}

// Returns which world (1-based) a gi belongs to, used to pick the right
// question pool.
function worldOfGi(gi) {
    for (let wi = WORLDS.length - 1; wi >= 0; wi--) {
        if (WORLDS[wi].data.length > 0 && gi >= WORLD_START_GI[wi]) return wi + 1;
    }
    return 1;
}



//------------------------------------------------------------------------
//---------------START GATED LEVEL ON LEVEL START-------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Called by startLevel() instead of launching directly.
// If the gate is already passed (or not gated), launches immediately.
// Otherwise shows the math gate modal.
function tryStartGatedLevel(gi, launchFn) {
    if (!isGatedLevel(gi) || isMathGatePassed(gi)) {
        launchFn();
        return;
    }
    pendingGateGi = gi;
    showMathGate(gi, launchFn);
}







//------------------------------------------------------------------------
//---------------------QUESTION HELPERS------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Returns a random question from the given pool
function mgPickRandomQuestion(pool) {
    return pool[Math.floor(Math.random() * pool.length)];
}

// Returns a random question from the pool that is different from the current
// one (to avoid showing the same question twice in a row)
function mgPickDifferentQuestion(pool) {
    let newQ;
    do {
        newQ = mgPickRandomQuestion(pool);
    } while (newQ === currentGateQuestion && pool.length > 1);
    return newQ;
}

// Returns the localized question text for the given question object
function mgGetLocalizedQuestion(question) {
    return (LANG === 'de' && question.qDE) ? question.qDE : question.q;
}

// Returns the localized hint text for the given question object
function mgGetLocalizedHint(question) {
    return (LANG === 'de' && question.hintDE) ? question.hintDE : question.hintEn;
}




//------------------------------------------------------------------------
//------------------ANSWER PARSING & CHECKING-----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Parses the raw input string into a number.
// Accepts both '.' and ',' as decimal separator.
// Returns NaN if the input is not a valid number.
function mgParseAnswer(rawInput) {
    const normalized = rawInput.trim().replace(',', '.');
    return parseFloat(normalized);
}

// Returns true if the entered number is within the question's tolerance.
function mgIsAnswerCorrect(entered, question) {
    return Math.abs(entered - question.answer) <= question.tolerance;
}



//------------------------------------------------------------------------
//------------------STATE - MARK GATE AS PASSED---------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Persists the gate pass to STATE and saves.
// Safe to call even if the gate was already marked passed.
function mgMarkGatePassed(gi) {
    if (!STATE.mathGatePassed) STATE.mathGatePassed = [];
    if (!STATE.mathGatePassed.includes(gi)) {
        STATE.mathGatePassed.push(gi);
        save();
    }
}



//------------------------------------------------------------------------
//--------------------------------REWARDS---------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Awards a random item to the player for passing the gate for the first time.
// Saves state and rebuilds the inventory panel.
function mgGrantGateReward(gi) {
    const rewardId = pickLuckyItem();
    const def = ITEM_DEFS[rewardId];

    STATE.inventory.push({
        uid: `item_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        defId: rewardId,
    });

    save();
    buildInventoryPanel();

    const itemName = LANG === 'de' ? def.nameDE : def.nameEn;
    const feedbackMsg = `${t('mg_correct')} + ${def.icon} ${itemName}!`;
    showMgFeedback(feedbackMsg, true);

    setTimeout(() => showToast('Probability Gate passed, Item reward received!'), 1000);
}



//------------------------------------------------------------------------
//---------------------CORRECT / WRONG ANSWER FLOWS-----------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Handles everything that should happen when the player gives a correct answer.
function mgHandleCorrectAnswer() {
    const gi = pendingGateGi;

    // Grant item reward on first-time pass, then mark the gate as passed.
    const isFirstPass = !isMathGatePassed(gi);
    if (isFirstPass) mgGrantGateReward(gi);
    mgMarkGatePassed(gi);

    // Show plain correct feedback if we didn't already show the reward message.
    if (!isFirstPass) showMgFeedback(t('mg_correct'), true);

    document.getElementById('mg-submit-btn').disabled = true;
    trackAchStat('questionsCorrect');

    // Brief celebration, then close the modal and launch the level.
    setTimeout(() => {
        hideMathGate();
        startLevel(gi);
    }, 1500);
}

// Handles everything that should happen when the player gives a wrong answer.
function mgHandleWrongAnswer() {
    gateAttempts++;
    trackAchStat('gateRejections');
    showMgFeedback(t('mg_wrong').replace('{n}', gateAttempts), false);

    if (gateAttempts >= 2) mgShowHint();
    if (gateAttempts >= 3) mgShowNewQuestionButton();
}

// Reveals the hint for the current question.
function mgShowHint() {
    const hint = mgGetLocalizedHint(currentGateQuestion);
    document.getElementById('mg-hint-text').textContent = '💡 ' + hint;
    document.getElementById('mg-hint-box').style.display = 'block';
}

// Reveals the "try a different question" button.
function mgShowNewQuestionButton() {
    document.getElementById('mg-new-q-btn').style.display = 'inline-block';
}




//------------------------------------------------------------------------
//-------------------------MODAL SHOW / HIDE------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Resets all input-area DOM elements to a clean state.
// Called both when opening the modal and when loading a new question.
function mgResetModalInputState() {
    document.getElementById('mg-answer-input').value = '';
    document.getElementById('mg-feedback').textContent = '';
    document.getElementById('mg-feedback').className = 'mg-feedback';
    document.getElementById('mg-hint-box').style.display = 'none';
    document.getElementById('mg-hint-text').textContent = '';
    document.getElementById('mg-new-q-btn').style.display = 'none';
    document.getElementById('mg-submit-btn').disabled = false;
}

// Updates the unit label next to the answer input.
function mgSetUnitLabel(question) {
    const unitEl = document.getElementById('mg-unit');
    unitEl.textContent = question.unit || '';
    unitEl.style.display = question.unit ? 'inline' : 'none';
}

// Opens the math gate modal for the given gi and picks a question.
function showMathGate(gi, launchFn) {
    const world = worldOfGi(gi);
    const pool = MATH_GATE_POOLS[world] || MATH_GATE_POOLS[1];

    currentGateQuestion = mgPickRandomQuestion(pool);
    gateAttempts = 0;

    // Populate the header badge.
    document.getElementById('mg-world-badge').textContent =
        `🔐 ${LANG === 'de' ? 'WELT' : 'WORLD'} ${world} — ${t('mg_gate_badge')}`;

    // Populate the question text.
    document.getElementById('mg-question').textContent =
        mgGetLocalizedQuestion(currentGateQuestion);

    // Store gi on the modal element (used by submit to know what to launch).
    document.getElementById('mg-modal').dataset.launchGi = gi;

    mgResetModalInputState();
    mgSetUnitLabel(currentGateQuestion);
    showModal('mg-modal');
    _mgRefreshTutorButton();

    // Focus the answer input after the modal open animation completes.
    setTimeout(() => {
        const inp = document.getElementById('mg-answer-input');
        if (inp) inp.focus();
    }, 120);
}

// Closes the modal and clears module state.
function hideMathGate() {
    hideModal('mg-modal');
    currentGateQuestion = null;
    pendingGateGi = null;
}




//------------------------------------------------------------------------
//----------------------SUBMIT & NEW QUESTION-----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Called when the player submits an answer.
// Parses the input and delegates to the correct/wrong flow.
function submitMathGate() {
    if (!currentGateQuestion) return;

    const entered = mgParseAnswer(document.getElementById('mg-answer-input').value);

    if (isNaN(entered)) {
        showMgFeedback(t('mg_not_a_number'), false);
        return;
    }

    if (mgIsAnswerCorrect(entered, currentGateQuestion)) {
        mgHandleCorrectAnswer();
    } else {
        mgHandleWrongAnswer();
    }
}

// Updates the feedback element with a success or error style.
function showMgFeedback(msg, ok) {
    const el = document.getElementById('mg-feedback');
    el.textContent = msg;
    el.className = 'mg-feedback ' + (ok ? 'mg-ok' : 'mg-bad');
}

// Loads a fresh (different) question from the pool.
// Available to the player after 3 failed attempts.
function mgNewQuestion() {
    const world = worldOfGi(pendingGateGi);
    const pool = MATH_GATE_POOLS[world] || MATH_GATE_POOLS[1];

    currentGateQuestion = mgPickDifferentQuestion(pool);
    gateAttempts = 0;

    document.getElementById('mg-question').textContent =
        mgGetLocalizedQuestion(currentGateQuestion);

    mgResetModalInputState();
    mgSetUnitLabel(currentGateQuestion);
    document.getElementById('mg-answer-input').focus();
}

// Allow pressing Enter in the answer input to submit.
document.addEventListener('DOMContentLoaded', () => {
    const inp = document.getElementById('mg-answer-input');
    if (inp) inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') submitMathGate();
    });
});




//------------------------------------------------------------------------
//--------------------TUTOR FEATURE (PASSIVE TREE)------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Shows or hides the Tutor button depending on whether the player has both
// the passive skill and the required item.
function _mgRefreshTutorButton() {
    const btn = document.getElementById('mg-tutor-btn');
    if (!btn) return;

    const hasTutorSkill = PT.hasSkill('tutor_enable');
    const hasTutorItem = !!STATE.inventory.find(i => i.defId === 'mistakeEraser');

    btn.style.display = (hasTutorSkill && hasTutorItem) ? 'inline-block' : 'none';
}

// Calculates the tutor's base success chance from passive skill nodes.
function mgCalcTutorChance() {
    let chance = 0.10;
    if (PT.hasSkill('tutor_chance_10')) chance += 0.10;
    if (PT.hasSkill('tutor_chance_20')) chance += 0.10;
    if (PT.hasSkill('tutor_chance_30')) chance += 0.10;
    if (PT.hasSkill('tutor_professor')) chance += 0.20;
    return chance;
}

// Calculates the chance that the tutor item is NOT consumed after use.
function mgCalcNoConsumeChance() {
    let chance = 0;
    if (PT.hasSkill('tutor_no_consume_1')) chance += 0.10;
    if (PT.hasSkill('tutor_no_consume_2')) chance += 0.10;
    if (PT.hasSkill('tutor_no_consume_3')) chance += 0.10;
    if (PT.hasSkill('tutor_professor')) chance += 0.20;
    return chance;
}

// Removes the tutor item from inventory if it was consumed.
function mgConsumeTutorItem(tutorItem) {
    STATE.inventory = STATE.inventory.filter(i => i.uid !== tutorItem.uid);
    save();
    buildInventoryPanel();
}

// Handles the path where the tutor succeeds in solving the question.
function mgHandleTutorSuccess() {
    const gi = pendingGateGi;
    const msg = LANG === 'de' ? '🎓 Tutor hat die Frage gelöst!' : '🎓 Tutor solved it!';

    showMgFeedback(msg, true);
    document.getElementById('mg-tutor-btn').style.display = 'none';
    document.getElementById('mg-submit-btn').disabled = true;

    mgMarkGatePassed(gi);

    setTimeout(() => { hideMathGate(); startLevel(gi); }, 1200);
}

// Handles the path where the tutor fails to solve the question.
function mgHandleTutorFailure() {
    const msg = LANG === 'de'
        ? '🎓 Tutor konnte die Frage nicht lösen…'
        : '🎓 Tutor couldn\'t solve it…';

    showMgFeedback(msg, false);
    document.getElementById('mg-tutor-btn').style.display = 'none';
}

// Entry point for the Tutor button click.
// Resolves chances, optionally consumes the item, then delegates to success
// or failure.
function mgUseTutor() {
    if (!currentGateQuestion) return;

    const tutorItem = STATE.inventory.find(i => i.defId === 'mistakeEraser');
    if (!tutorItem) return;

    const tutorChance = mgCalcTutorChance();
    const noConsumeChance = mgCalcNoConsumeChance();

    const isConsumed = Math.random() >= noConsumeChance;
    if (isConsumed) mgConsumeTutorItem(tutorItem);

    if (Math.random() < tutorChance) {
        mgHandleTutorSuccess();
    } else {
        mgHandleTutorFailure();
    }
}


//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
























