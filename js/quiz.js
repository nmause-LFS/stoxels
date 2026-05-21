
let currentQuizQuestion = null; //current question object for the active quiz, set by showQuiz() and read by answerQuizInput()

let _quizAutoFinishTimer = null;







//------------------------------------------------------------------------
// Function to draw a random quiz question from the pool of world-specific
// quiz-questions (BONUS_QUIZ_POOLS) and math gate questions (MATH_GATE_POOLS)
//------------------------------------------------------------------------


function getQuizQuestion(worldNum) {
    const pool = [];

    // World-specific MC questions
    if (worldNum && BONUS_QUIZ_POOLS[worldNum]) {
        BONUS_QUIZ_POOLS[worldNum].forEach(raw => pool.push({ _src: 'mc_world', raw }));
    }

    // World-specific input questions (from math gate pool)
    if (worldNum && MATH_GATE_POOLS[worldNum]) {
        MATH_GATE_POOLS[worldNum].forEach(raw => pool.push({ _src: 'input', raw }));
    }

    if (!pool.length) {
        // Absolute fallback — should never happen
        return { type: 'mc', q: '?', opts: [{ text: '?', isCorrect: true }] };
    }

    const entry = pool[Math.floor(Math.random() * pool.length)];

    // ── Input question ────────────────────────────────────────────────────
    if (entry._src === 'input') {
        const raw = entry.raw;
        return {
            type: 'input',
            q: (LANG === 'de' && raw.qDE) ? raw.qDE : raw.q,
            answer: raw.answer,
            tolerance: raw.tolerance ?? 0,
            unit: raw.unit || '',
            hintEn: raw.hintEn || '',
            hintDE: raw.hintDE || '',
        };
    }

    // ── Multiple-choice question ──────────────────────────────────────────
    const raw = entry.raw;
    const q = (LANG === 'de' && raw.qDE) ? raw.qDE : raw.q;
    const opts = (LANG === 'de' && raw.optsDE) ? raw.optsDE : raw.opts;
    const optsWithFlag = opts.map((o, i) => ({ text: o, isCorrect: i === raw.correct }));
    shuffle(optsWithFlag);
    return { type: 'mc', q, opts: optsWithFlag };
}





//------------------------------------------------------------------------
//------------------RENDER QUIZ OVERLAY WITH QUIZ QUESTION----------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Returns the total chance of auto-removing a wrong answer (stacks additively).
function _quizCalcEliminationChance() {
    let chance = 0;
    if (PT.hasSkill('predictive_intelligence')) chance += 0.10;
    if (PT.hasSkill('elimination_clue')) chance += 0.10;
    if (PT.hasSkill('narrowed_options')) chance += 0.20;
    if (PT.hasSkill('logical_deductions')) chance += 0.20;
    if (PT.hasSkill('multiple_choice_mastery')) chance += 0.40;
    return chance;
}

// Returns the total bonus item chance on a correct MC answer (stacks additively).
function _quizCalcMcBonusItemChance() {
    let chance = 0;
    if (PT.hasSkill('predictive_intelligence')) chance += 0.10;
    if (PT.hasSkill('bonus_acquisition')) chance += 0.10;
    if (PT.hasSkill('enhanced_rewards')) chance += 0.10;
    if (PT.hasSkill('overflowing_spoils')) chance += 0.10;
    if (PT.hasSkill('multiple_choice_mastery')) chance += 0.10;
    return chance;
}




function showQuiz(worldNum) {
    const q = getQuizQuestion(worldNum);
    currentQuizQuestion = q;

    document.getElementById('quiz-q').textContent = q.q;
    document.getElementById('quiz-result').textContent = '';
    document.getElementById('quiz-continue').style.display = 'none';

    const optsEl = document.getElementById('quiz-opts');
    optsEl.innerHTML = '';

    // Hide/show the input row depending on question type
    const inputRow = document.getElementById('quiz-input-row');
    const inputEl = document.getElementById('quiz-input');
    const unitEl = document.getElementById('quiz-input-unit');
    const hintBox = document.getElementById('quiz-input-hint');

    if (q.type === 'input') {
        // ── Numeric-input question ────────────────────────────────────────
        inputRow.style.display = 'flex';
        inputEl.value = '';
        inputEl.disabled = false;
        unitEl.textContent = q.unit || '';
        unitEl.style.display = q.unit ? 'inline' : 'none';
        hintBox.style.display = 'none';
        hintBox.textContent = '';

        // Submit on Enter key
        inputEl.onkeydown = e => { if (e.key === 'Enter') answerQuizInput(); };
        const submitBtn = document.getElementById('quiz-input-submit');
        submitBtn.style.display = 'inline-block';
        submitBtn.disabled = false;
        submitBtn.onclick = answerQuizInput;

    } else {
        // ── Multiple-choice question ──────────────────────────────────────
        if (inputRow) inputRow.style.display = 'none';
        hintBox.style.display = 'none';
        hintBox.textContent = '';

        q.opts.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt';
            btn.textContent = opt.text;
            if (opt.isCorrect) btn.dataset.isCorrect = '1';
            btn.onclick = () => answerQuiz(opt.isCorrect, optsEl, btn);
            optsEl.appendChild(btn);
        });

        // Passive tree: chance to auto-remove one wrong answer
        const elimChance = _quizCalcEliminationChance();
        if (elimChance > 0 && Math.random() < elimChance) {
            const wrongBtns = Array.from(optsEl.children).filter(b => b.dataset.isCorrect !== '1');
            if (wrongBtns.length > 0) {
                const toRemove = wrongBtns[Math.floor(Math.random() * wrongBtns.length)];
                toRemove.disabled = true;
                toRemove.style.opacity = '0.35';
                toRemove.style.textDecoration = 'line-through';
                toRemove.onclick = null;
            }
        }
    }

    document.getElementById('quiz-overlay').classList.add('show');
    if (q.type === 'input') setTimeout(() => inputEl && inputEl.focus(), 120);

    _quizRefreshTutorButton();
}




//------------------------------------------------------------------------
//-----------QUIZ ANSWERING FOR MC AND INPUT QUESTIONS--------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Multiple Choice Quiz Questions

function answerQuiz(correct, optsEl, clickedBtn) {
    // Lock all buttons immediately to prevent second clicks
    Array.from(optsEl.children).forEach(btn => btn.onclick = null);

    // Always reveal the correct answer; also mark the wrong click if applicable
    Array.from(optsEl.children).forEach(btn => {
        if (btn.dataset.isCorrect === '1') {
            btn.classList.add('correct'); // green
        } else if (btn === clickedBtn && !correct) {
            btn.classList.add('wrong');   // red — only the button the player clicked
        }
    });

    _resolveQuizAnswer(correct);
}

// Numeric Input Quiz Questions

function answerQuizInput() {
    if (!currentQuizQuestion || currentQuizQuestion.type !== 'input') return;

    const inputEl = document.getElementById('quiz-input');
    const raw = (inputEl.value || '').trim().replace(',', '.');
    const entered = parseFloat(raw);
    const resEl = document.getElementById('quiz-result');

    if (isNaN(entered)) {
        resEl.className = 'quiz-result bad';
        resEl.textContent = LANG === 'de' ? '⚠ Bitte eine Zahl eingeben.' : '⚠ Please enter a number.';
        return;
    }

    inputEl.disabled = true;
    document.getElementById('quiz-input-submit').disabled = true;

    const correct = Math.abs(entered - currentQuizQuestion.answer) <= currentQuizQuestion.tolerance;

    // Show hint if wrong
    if (!correct) {
        const hint = (LANG === 'de' && currentQuizQuestion.hintDE)
            ? currentQuizQuestion.hintDE
            : currentQuizQuestion.hintEn;
        if (hint) {
            const hintBox = document.getElementById('quiz-input-hint');
            hintBox.textContent = '💡 ' + hint;
            hintBox.style.display = 'block';
        }
    }

    _resolveQuizAnswer(correct);
}



//------------------------------------------------------------------------
//-------REWARD & PENALTY LOGIC FOR QUIZ ANSWERS--------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Rolls the passive-tree bonus item chance after a correct MC answer.
function _quizRollMcBonusItemReward() {
    if (curMods && curMods.ironman) return;

    const chance = _quizCalcMcBonusItemChance();
    if (chance <= 0) return;

    if (Math.random() < chance) {
        const defId = pickRandomItem();
        const def = ITEM_DEFS[defId];
        if (!def) return;

        STATE.inventory.push({
            uid: `item_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            defId,
        });
        save();
        buildInventoryPanel();

        const name = LANG === 'de' ? def.nameDE : def.nameEn;
        const irz = document.getElementById('item-reward-zone');
        const rc = rarityColors(def.rarity);
        if (irz) {
            irz.innerHTML += `<div class="item-reward" style="border-color:${rc.border};color:${rc.color};margin-top:4px;">
                🎁 ${def.icon} <strong>${name}</strong>
            </div>`;
        }
    }
}





function _resolveQuizAnswer(correct) {


    quizAnsweredCorrectly = correct;
    const resEl = document.getElementById('quiz-result');
    const quizAlreadyClaimed = STATE.bonusDone.includes(cur.gIdx);

    if (correct) {
        if (quizAlreadyClaimed) {
            resEl.className = 'quiz-result ok';
            resEl.textContent = t('quiz_correct_claimed');
            if (!curMods.ironman && Math.random() < 0.15) {
                const defId = pickRandomItem();
                const def = ITEM_DEFS[defId];
                if (def) {
                    STATE.inventory.push({ defId, uid: Date.now() + Math.random().toString(36).slice(2) });
                    save();
                    const irz = document.getElementById('item-reward-zone');
                    const rc = rarityColors(def.rarity);
                    irz.innerHTML += `<div class="item-reward" style="border-color:${rc.border};color:${rc.color};margin-top:4px;">
                        ${t('ov_lucky_drop')} ${def.icon} <strong>${itemName(def)}</strong>
                    </div>`;
                }
            }
        } else {
            resEl.className = 'quiz-result ok';
            resEl.textContent = t('quiz_correct');
            STATE.totalScore += 50;
            trackAchStat('questionsCorrect');
            updateQuestStats('questionCorrect', { source: 'quiz' });
            document.getElementById('sc-disp').textContent = STATE.totalScore;
            // Always mark the bonus as claimed on a correct first-time answer,
            // regardless of Ironman mode or whether an item reward is available.
            STATE.bonusDone.push(cur.gIdx);
            if (!curMods.ironman) {
                const defId = pickRandomItem();
                const def = ITEM_DEFS[defId];
                if (def) {
                    STATE.inventory.push({ defId, uid: Date.now() + Math.random().toString(36).slice(2) });
                    const irz = document.getElementById('item-reward-zone');
                    const rc = rarityColors(def.rarity);
                    irz.innerHTML += `<div class="item-reward" style="border-color:${rc.border};color:${rc.color};margin-top:4px;">${t('ov_quiz_reward')}: ${def.icon} <strong>${itemName(def)}</strong></div>`;
                }
            }
            save();
        }
        _quizRollMcBonusItemReward();
    } else {
        resEl.className = 'quiz-result bad';
        resEl.textContent = t('quiz_wrong');
    }

    document.getElementById('quiz-continue').style.display = 'block';

    // Hide the skip button — question already answered
    document.getElementById('btn-skip-quiz').style.display = 'none';

    // Auto-finish after 3 seconds
    _quizAutoFinishTimer = setTimeout(() => finishQuiz(), 2500);
}






//------------------------------------------------------------------------
//-----------------FINISH QUIZ--------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// either called from the "CONTINUE" button or auto-triggered after 3 seconds answering a question

function finishQuiz() {
    closeQuiz();
    checkWorldCodes(); // check if the 50 points from this quiz just unlocked a world code
    checkWorldCompletion(); // check if this quiz just completed the world (e.g. for the achievement)
    save();
    setTimeout(() => document.getElementById('ov-win').classList.add('show'), 300);
}





//------------------------------------------------------------------------
//---------------------------SKIP QUIZ------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Called when the player clicks "SKIP" or presses Escape.
// No points or items are awarded. Shows the win overlay immediately.
function skipQuiz() {
    closeQuiz();
    setTimeout(() => document.getElementById('ov-win').classList.add('show'), 300);
}




//------------------------------------------------------------------------
//--------------------------CLOSE QUIZ------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Removes the 'show' class from the quiz overlay, hiding it.
//   Called by finishQuiz(), skipQuiz(), and the Escape handler in main.js.
function closeQuiz() {
    document.getElementById('quiz-overlay').classList.remove('show');
    currentQuizQuestion = null;

    //cancel the time out if player has manually clicked on continue
    if (_quizAutoFinishTimer) {
        clearTimeout(_quizAutoFinishTimer);
        _quizAutoFinishTimer = null;
    }
}






//------------------------------------------------------------------------
//------------------TUTOR PASSIVE SKILL-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------





function _quizRefreshTutorButton() {
    const btn = document.getElementById('quiz-tutor-btn');
    if (!btn) return;
    const hasTutorSkill = PT.hasSkill('tutor_enable');
    const tutorItem = STATE.inventory.find(i => i.defId.startsWith('mistakeEraser'));
    btn.style.display = (hasTutorSkill && tutorItem) ? 'inline-block' : 'none';
}

function quizUseTutor() {
    const TUTOR_TIER_ORDER = ['mistakeEraser', 'mistakeEraser4', 'mistakeEraser6', 'mistakeEraserAll'];
    const tutorItem = TUTOR_TIER_ORDER
        .flatMap(id => STATE.inventory.filter(i => i.defId === id))
        .find(Boolean);
    if (!tutorItem) return;

    // Build success chance from passive tree
    let chance = 0.10;
    if (PT.hasSkill('stochastics_tutor')) chance += 0.10;
    if (PT.hasSkill('statistics_tutor')) chance += 0.10;
    if (PT.hasSkill('maths_tutor')) chance += 0.10;
    if (PT.hasSkill('professor_tutor')) chance += 0.20;

    // Build no-consume chance
    let noConsumeChance = 0;
    if (PT.hasSkill('careful_study')) noConsumeChance += 0.10;
    if (PT.hasSkill('efficient_tutoring')) noConsumeChance += 0.15;
    if (PT.hasSkill('endless_instructions')) noConsumeChance += 0.20;
    if (PT.hasSkill('professor_tutor')) noConsumeChance += 0.20;

    const consumed = Math.random() >= noConsumeChance;
    if (consumed) {
        STATE.inventory = STATE.inventory.filter(i => i.uid !== tutorItem.uid);
        save();
        buildInventoryPanel();
    }

    // Hide button regardless of outcome
    document.getElementById('quiz-tutor-btn').style.display = 'none';

    const resEl = document.getElementById('quiz-result');

    if (Math.random() < chance) {
        // ── Tutor succeeds ────────────────────────────────────────────────
        resEl.textContent = LANG === 'de' ? '🎓 Tutor hat die Frage gelöst!' : '🎓 Tutor solved it!';
        resEl.className = 'quiz-result ok';

        if (currentQuizQuestion.type === 'mc') {
            // Lock all buttons and highlight the correct one
            const optsEl = document.getElementById('quiz-opts');
            Array.from(optsEl.children).forEach(btn => {
                btn.onclick = null;
                if (btn.dataset.isCorrect === '1') btn.classList.add('correct');
            });
        } else {
            // Input question — disable the input and submit
            document.getElementById('quiz-input').disabled = true;
            document.getElementById('quiz-input-submit').disabled = true;
        }

        _resolveQuizAnswer(true);

    } else {
        // ── Tutor fails ───────────────────────────────────────────────────
        resEl.textContent = LANG === 'de' ? '🎓 Tutor konnte die Frage nicht lösen…' : '🎓 Tutor couldn\'t solve it…';
        resEl.className = 'quiz-result bad';
        // Leave the question active so the player can still answer
    }
}










//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------









//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------






















//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------











//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


















