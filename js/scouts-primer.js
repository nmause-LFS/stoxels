let primerQuestion = null;   // the question currently shown in the primer modal.
let primerStreak = 0;        // how many questions answered correctly so far
const PRIMER_MAX = 5;        // maximum questions in a chain






//------------------------------------------------------------------------
//------------PICK RANDOM BONUS QUIZ OR MATH GATE QUESTION----------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// getPrimerQuestion — picks randomly from the combined pool of:
//   - all QUIZ_QUESTIONS (quiz.js)
//   - all MATH_GATE_POOLS questions flattened (mathgate.js)
// Returns a normalised { q, opts, isMultiChoice } object.
// Math gate questions are converted to free-text mode.

function getPrimerQuestion() {
    // Flatten all math gate questions across worlds
    const gateQs = Object.values(MATH_GATE_POOLS).flat();

    // Decide: 50% chance quiz question, 50% math gate question
    if (Math.random() < 0.5 && BONUS_QUIZ_POOLS.length) {
        const raw = BONUS_QUIZ_POOLS[Math.floor(Math.random() * BONUS_QUIZ_POOLS.length)];
        const q = (LANG === 'de' && raw.qDE) ? raw.qDE : raw.q;
        const opts = (LANG === 'de' && raw.optsDE) ? raw.optsDE : raw.opts;
        const optsWithFlag = opts.map((o, i) => ({ text: o, isCorrect: i === raw.correct }));
        shuffle(optsWithFlag);
        return { q, opts: optsWithFlag, isMultiChoice: true };
    } else {
        const raw = gateQs[Math.floor(Math.random() * gateQs.length)];
        const q = (LANG === 'de' && raw.qDE) ? raw.qDE : raw.q;
        return {
            q,
            answer: raw.answer,
            tolerance: raw.tolerance,
            unit: raw.unit || '',
            hintEn: raw.hintEn,
            hintDE: raw.hintDE,
            isMultiChoice: false
        };
    }
}





//------------------------------------------------------------------------
//------------------SHOW SCOUTS PRIMER MODAL------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// showPrimerModal — builds and injects a one-off modal into the DOM,
//   then shows it. The modal is removed from the DOM when dismissed.
function showPrimerModal(streak = 0) {
    pauseTimer();
    primerStreak = streak;
    primerQuestion = getPrimerQuestion();

    const overlay = document.createElement('div');
    overlay.id = 'primer-overlay';
    overlay.className = 'modal-bg show';
    overlay.style.cssText = 'z-index:3000;';

    const q = primerQuestion.q;
    const isMulti = primerQuestion.isMultiChoice;

    // Progress indicator: show e.g. "Question 1 / 5"
    const progressLabel = LANG === 'de'
        ? `Frage ${streak + 1} von ${PRIMER_MAX} — Bei richtiger Antwort: +1 Zeile & +1 Spalte vorgelöst`
        : `Question ${streak + 1} of ${PRIMER_MAX} — On correct answer: +1 row & +1 column pre-solved`;

    // Dots showing streak so far
    const dots = Array.from({ length: PRIMER_MAX }, (_, i) =>
        `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;margin:0 3px;background:${i < streak ? 'var(--green)' : 'var(--border2)'}"></span>`
    ).join('');

    let answerHtml = '';
    if (isMulti) {
        answerHtml = `<div class="quiz-opts" id="primer-opts" style="margin-top:14px;"></div>`;
    } else {
        const unitLabel = primerQuestion.unit
            ? `<span style="font-family:var(--PX);font-size:11px;color:#888;margin-left:6px;">${primerQuestion.unit}</span>`
            : '';
        answerHtml = `
            <div class="mg-answer-row" style="margin-top:14px;">
                <input type="text" id="primer-input" class="mg-input"
                    placeholder="${LANG === 'de' ? 'deine Antwort' : 'your answer'}" autocomplete="off" />
                ${unitLabel}
                <button class="mg-submit-btn" onclick="submitPrimerAnswer()">${LANG === 'de' ? 'PRÜFEN ▶' : 'CHECK ▶'}</button>
            </div>`;
    }

    overlay.innerHTML = `
        <div class="modal-box mg-box" style="border-left-color:var(--purple);">
            <div class="mg-world-badge" style="background:var(--purple);color:#fff;">
                📜 ${LANG === 'de' ? "PFADFINDER-KOMPASS — BONUSFRAGEN" : "SCOUT'S PRIMER — BONUS QUESTIONS"}
            </div>
            <div style="margin-top:10px;text-align:center;">${dots}</div>
            <div class="mg-instruction" style="margin-top:8px;font-size:10px;opacity:0.75;">
                ${progressLabel}
            </div>
            <div class="mg-question" id="primer-question-text" style="margin-top:10px;">${q}</div>
            ${answerHtml}
            <div class="mg-feedback" id="primer-feedback"></div>
            <div class="mg-hint-box" id="primer-hint" style="display:none;"></div>
            <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
                <button class="mg-submit-btn" id="primer-skip-btn" onclick="skipPrimer()"
                    style="background:transparent;border-color:#555;color:#777;">
                    ${LANG === 'de' ? 'ÜBERSPRINGEN (kein weiterer Vorsprung)' : 'SKIP (no further headstart)'}
                </button>
                <button class="mg-submit-btn" id="primer-tutor-btn" onclick="primerUseTutor()" style="display:none;">
                    🎓
                </button>
            </div>
            <div class="mg-footer">
                ${streak === 0
            ? (LANG === 'de'
                ? 'Richtig: nächste Frage erscheint. Bis zu 5 Zeilen + 5 Spalten möglich!'
                : 'Correct: next question appears. Up to 5 rows + 5 columns possible!')
            : (LANG === 'de'
                ? `Bisher richtig: ${streak} — weiter für mehr Vorsprung!`
                : `Correct so far: ${streak} — keep going for more headstart!`)
        }
            </div>
        </div>`;

    document.body.appendChild(overlay);

    if (isMulti) {
        const optsEl = document.getElementById('primer-opts');
        primerQuestion.opts.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt';
            btn.textContent = opt.text;
            if (opt.isCorrect) btn.dataset.isCorrect = '1';
            btn.onclick = () => submitPrimerMCQ(opt.isCorrect, optsEl, btn);
            optsEl.appendChild(btn);
        });

        // Passive tree: chance to auto-remove one wrong answer
        const elimChance = _quizCalcEliminationChance();
        if (elimChance > 0 && Math.random() < elimChance) {
            questStat_mcWrongAnswerEliminated();
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

    setTimeout(() => {
        const inp = document.getElementById('primer-input');
        if (inp) {
            inp.focus();
            inp.addEventListener('keydown', e => { if (e.key === 'Enter') submitPrimerAnswer(); });
        }
    }, 100);

    _primerRefreshTutorButton();
}






//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// submitPrimerMCQ — handles a multiple-choice answer in the primer modal.
function submitPrimerMCQ(correct, optsEl, clickedBtn) {
    Array.from(optsEl.children).forEach(btn => btn.onclick = null);
    Array.from(optsEl.children).forEach(btn => {
        if (btn.dataset.isCorrect === '1') btn.classList.add('correct');
        else if (btn === clickedBtn && !correct) btn.classList.add('wrong');
    });
    showPrimerResult(correct);
}







//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// submitPrimerAnswer — handles a free-text answer in the primer modal.
function submitPrimerAnswer() {
    const raw = (document.getElementById('primer-input').value || '').trim().replace(',', '.');
    const entered = parseFloat(raw);
    const fb = document.getElementById('primer-feedback');
    if (isNaN(entered)) {
        fb.className = 'mg-feedback mg-bad';
        fb.textContent = LANG === 'de' ? '⚠ Bitte eine Zahl eingeben.' : '⚠ Please enter a number.';
        return;
    }
    const correct = Math.abs(entered - primerQuestion.answer) <= primerQuestion.tolerance;
    if (!correct) {
        // Hints only available if the player has wisdom_through_failure,
        // and the primer only ever shows one attempt so threshold must be 1
        const hintThreshold = mgCalcHintThreshold();
        if (hintThreshold !== null && hintThreshold <= 1) {
            const hintBox = document.getElementById('primer-hint');
            const hint = (LANG === 'de' && primerQuestion.hintDE) ? primerQuestion.hintDE : primerQuestion.hintEn;
            hintBox.innerHTML = '💡 ' + hint;
            hintBox.style.display = 'block';
        }
    }
    showPrimerResult(correct);
}







//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function showPrimerResult(correct) {
    const fb = document.getElementById('primer-feedback');
    const skipBtn = document.getElementById('primer-skip-btn');
    if (skipBtn) skipBtn.style.display = 'none';

    if (correct) {
        const newStreak = primerStreak + 1;
        fb.className = 'mg-feedback mg-ok';

        // Passive tree bonus item rolls (MC and input nodes both apply)
        if (primerQuestion.isMultiChoice) {
            _quizRollMcBonusItemReward();
        } else {
            mgRollBonusItemRewards();
        }

        if (newStreak >= PRIMER_MAX) {
            // Answered all 5 correctly
            fb.textContent = LANG === 'de'
                ? `✓ Perfekt! ${newStreak}/${PRIMER_MAX} richtig — maximaler Vorsprung!`
                : `✓ Perfect! ${newStreak}/${PRIMER_MAX} correct — maximum headstart!`;
            Audio_Manager.playSFX('quizCorrect');
            trackAchStat('primerCorrect');
            updateQuestStats('questionCorrect', { source: 'primer' });
            setTimeout(() => {
                closePrimerModal();
                setTimeout(() => applyPerfectPrimerReveal(), 50);
            }, 1000);
        } else {
            // Correct but more questions remain
            fb.textContent = LANG === 'de'
                ? `✓ Richtig! ${newStreak}/${PRIMER_MAX} — nächste Frage…`
                : `✓ Correct! ${newStreak}/${PRIMER_MAX} — next question…`;
            Audio_Manager.playSFX('quizCorrect');
            trackAchStat('primerCorrect');
            updateQuestStats('questionCorrect', { source: 'primer' });
            setTimeout(() => {
                closePrimerModal();
                showPrimerModal(newStreak); // chain: open next question
            }, 900);
        }
    } else {
        // Wrong answer — apply whatever streak was built up
        fb.className = 'mg-feedback mg-bad';
        Audio_Manager.playSFX('quizWrong');
        if (primerStreak > 0) {
            fb.textContent = LANG === 'de'
                ? `✗ Falsch. Vorsprung für ${primerStreak} richtige Antwort(en) wird angewendet…`
                : `✗ Wrong. Applying headstart for ${primerStreak} correct answer(s)…`;
            setTimeout(() => {
                closePrimerModal();
                applyPrimerHeadstart(primerStreak);
            }, 1800);
        } else {
            fb.textContent = LANG === 'de'
                ? '✗ Falsch. Kein Vorsprung — viel Erfolg!'
                : '✗ Wrong. No headstart — good luck!';
            setTimeout(closePrimerModal, 1800);
        }
    }
}








//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function skipPrimer() {
    if (primerStreak > 0) {
        closePrimerModal();
        applyPrimerHeadstart(primerStreak);
    } else {
        closePrimerModal();
    }
}






//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// closePrimerModal — removes the primer overlay from the DOM.
function closePrimerModal() {
    const el = document.getElementById('primer-overlay');
    if (el) el.remove();
    primerQuestion = null;
    if (typeof timerInterval !== 'undefined' && !dead) resumeTimer();
}







//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Rolls bonus extra rows from passive tree nodes (each rolls independently).
function _primerCalcBonusRows() {
    let bonus = 0;
    if (PT.hasSkill('expanding_front') && Math.random() < 0.50) bonus += 1;
    if (PT.hasSkill('widened_formation') && Math.random() < 0.25) bonus += 2;
    if (PT.hasSkill('extended_horizon') && Math.random() < 0.125) bonus += 3;
    if (PT.hasSkill('total_coverage') && Math.random() < 0.05) bonus += 4;
    return bonus;
}

// Rolls bonus extra columns from passive tree nodes (each rolls independently).
function _primerCalcBonusCols() {
    let bonus = 0;
    if (PT.hasSkill('vertical_insight') && Math.random() < 0.50) bonus += 1;
    if (PT.hasSkill('rising_structure') && Math.random() < 0.25) bonus += 2;
    if (PT.hasSkill('elevated_scope') && Math.random() < 0.125) bonus += 3;
    if (PT.hasSkill('total_survey') && Math.random() < 0.05) bonus += 4;
    return bonus;
}


function applyPrimerHeadstart(count) {
    if (!cur || count <= 0) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // Base count + passive tree bonus rolls
    let totalRows = count + _primerCalcBonusRows();
    let totalCols = count + _primerCalcBonusCols();

    // Primed Scout: double everything
    if (PT.hasSkill('primed_scout')) {
        totalRows *= 2;
        totalCols *= 2;
    }

    // Clamp to grid size
    totalRows = Math.min(totalRows, rows);
    totalCols = Math.min(totalCols, cols);

    const rowIdxs = shuffle(Array.from({ length: rows }, (_, i) => i)).slice(0, totalRows);
    const colIdxs = shuffle(Array.from({ length: cols }, (_, i) => i)).slice(0, totalCols);

    // Tiered colour palette: 1=blue, 2=teal, 3=orange, 4=pink, 5+=gold (perfect path)
    const tierColours = ['#4fc3f7', '#26c6a6', '#ffa040', '#e040fb', '#ffd700'];
    const colour = tierColours[Math.min(count, tierColours.length) - 1];

    // ── Update game state (instant, silent) ──────────────────────────────
    rowIdxs.forEach(r => {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 1) { revealedGrid[r][c] = true; userGrid[r][c] = 1; }
            else if (userGrid[r][c] === 0) { userGrid[r][c] = 2; }
            renderCell(r, c);
            updClues(r, c);
        }
    });
    colIdxs.forEach(c => {
        for (let r = 0; r < rows; r++) {
            if (sol[r][c] === 1) { revealedGrid[r][c] = true; userGrid[r][c] = 1; }
            else if (userGrid[r][c] === 0) { userGrid[r][c] = 2; }
            renderCell(r, c);
            updClues(r, c);
        }
    });

    // ── Visual sweep over revealed cells (after state is already applied) ─
    const cellDelay = count <= 1 ? 60 : count <= 2 ? 50 : count <= 3 ? 40 : 30;

    let visualDelay = 0;

    // getBoundingClientRect() is called INSIDE the setTimeout so the grid is
    // already on screen and the element has real pixel dimensions.
    const spawnFlare = (r, c, extraClass) => {
        const cellEl = document.getElementById(`g-${r}-${c}`);
        if (!cellEl) return;
        const rect = cellEl.getBoundingClientRect();
        if (!rect || rect.width === 0) return;
        const flare = document.createElement('div');
        flare.className = 'scout-ping-flare ' + extraClass;
        flare.style.cssText = `
            position:fixed;
            top:${rect.top}px;
            left:${rect.left}px;
            width:${rect.width}px;
            height:${rect.height}px;
            --flare-colour:${colour};
            pointer-events:none;
            z-index:99999;
        `;
        document.body.appendChild(flare);
        setTimeout(() => flare.remove(), 900);
    };

    rowIdxs.forEach((r, ri) => {
        for (let c = 0; c < cols; c++) {
            const localDelay = visualDelay + c * 18;
            setTimeout(() => spawnFlare(r, c, 'scout-flare-row'), localDelay);
        }
        visualDelay += cellDelay;
        if (ri % 2 === 0) setTimeout(() =>
            typeof Audio_Manager !== 'undefined' && Audio_Manager.playSFX('tick'),
            visualDelay);
    });

    colIdxs.forEach((c, ci) => {
        for (let r = 0; r < rows; r++) {
            const localDelay = visualDelay + r * 18;
            setTimeout(() => spawnFlare(r, c, 'scout-flare-col'), localDelay);
        }
        visualDelay += cellDelay;
        if (ci % 2 === 0) setTimeout(() =>
            typeof Audio_Manager !== 'undefined' && Audio_Manager.playSFX('tick'),
            visualDelay);
    });

    // ── Board-level glow scaled to streak ────────────────────────────────
    const boardEl = document.querySelector('.grid-container') ||
        document.getElementById('grid') ||
        document.querySelector('.board') ||
        document.body;

    const glowClass = count >= 4 ? 'primer-glow-strong'
        : count >= 2 ? 'primer-glow-mid'
            : 'primer-glow-soft';
    boardEl.style.setProperty('--primer-glow-colour', colour);
    boardEl.classList.add(glowClass);
    setTimeout(() => boardEl.classList.remove(glowClass), 1800);

    // ── Toast ─────────────────────────────────────────────────────────────
    setTimeout(() => {
        const msg = LANG === 'de'
            ? `📜 ${totalRows} Zeile(n) + ${totalCols} Spalte(n) vorgelöst!`
            : `📜 ${totalRows} row(s) + ${totalCols} column(s) pre-solved!`;
        showToast(msg);
        questStat_primerRowsColsRevealed(rowIdxs.length, colIdxs.length);
        checkWin();
        if (dead) trackAchStat('primerSolvedAll');
        if (dead) updateQuestStats('primerFullSolve', {});
    }, visualDelay + 100);
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
//--------------------TUTOR FEATURE (PASSIVE TREE)------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Shows or hides the Tutor button in the primer modal.
function _primerRefreshTutorButton() {
    const btn = document.getElementById('primer-tutor-btn');
    if (!btn) return;

    const hasTutorSkill = PT.hasSkill('tutor_enable');
    const tutorCount = STATE.inventory.filter(i =>
        i.defId === 'mistakeEraser' ||
        i.defId === 'mistakeEraser4' ||
        i.defId === 'mistakeEraser6' ||
        i.defId === 'mistakeEraserAll'
    ).length;

    if (hasTutorSkill && tutorCount > 0) {
        btn.style.display = 'inline-block';
        btn.textContent = LANG === 'de'
            ? `🎓 Tutor um Hilfe bitten (${tutorCount})`
            : `🎓 Ask Tutor for Help (${tutorCount})`;
    } else {
        btn.style.display = 'none';
    }
}

// Called when the player clicks the Tutor button in the primer modal.
// Reuses the same chance/no-consume mechanics as the math gate and quiz tutors.
function primerUseTutor() {
    if (!primerQuestion) return;

    const TUTOR_TIER_ORDER = ['mistakeEraser', 'mistakeEraser4', 'mistakeEraser6', 'mistakeEraserAll'];
    const tutorItem = TUTOR_TIER_ORDER
        .flatMap(id => STATE.inventory.filter(i => i.defId === id))
        .find(Boolean);
    if (!tutorItem) return;

    // Build success chance from passive tree (same nodes as quiz/gate)
    let chance = 0.10;
    if (PT.hasSkill('stochastics_tutor')) chance += 0.10;
    if (PT.hasSkill('statistics_tutor')) chance += 0.10;
    if (PT.hasSkill('maths_tutor')) chance += 0.10;
    if (PT.hasSkill('professor_tutor')) chance += 0.20;

    // Build no-consume chance (same nodes as quiz/gate)
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
    const btn = document.getElementById('primer-tutor-btn');
    if (btn) btn.style.display = 'none';

    const fb = document.getElementById('primer-feedback');

    if (Math.random() < chance) {
        // ── Tutor succeeds ────────────────────────────────────────────────
        questStat_tutorAnsweredCorrect();
        Audio_Manager.playSFX('tutorSuccess');
        fb.className = 'mg-feedback mg-ok';
        fb.textContent = LANG === 'de' ? '🎓 Tutor hat die Frage gelöst!' : '🎓 Tutor solved it!';

        if (primerQuestion.isMultiChoice) {
            // Highlight the correct MC option and lock all buttons
            const optsEl = document.getElementById('primer-opts');
            if (optsEl) {
                Array.from(optsEl.children).forEach(b => {
                    b.onclick = null;
                    if (b.dataset.isCorrect === '1') b.classList.add('correct');
                });
            }
        } else {
            // Disable the input and submit button for numeric questions
            const inp = document.getElementById('primer-input');
            if (inp) inp.disabled = true;
            // The submit button is inline onclick, so just disable it visually
            const submitBtns = document.querySelectorAll('#primer-overlay .mg-submit-btn:not(#primer-skip-btn):not(#primer-tutor-btn)');
            submitBtns.forEach(b => b.disabled = true);
        }

        showPrimerResult(true);

    } else {
        // ── Tutor fails ───────────────────────────────────────────────────
        Audio_Manager.playSFX('tutorFail');
        fb.className = 'mg-feedback mg-bad';
        fb.textContent = LANG === 'de'
            ? '🎓 Tutor konnte die Frage nicht lösen…'
            : '🎓 Tutor couldn\'t solve it…';
        Audio_Manager.playSFX('tutorFail');
        // Leave the question active so the player can still answer manually
    }
}










// (helper removed — callers use document.getElementById(`g-${r}-${c}`) directly)


/**
 * Cinematic reveal for achieving a perfect 5/5 streak on the Scout's Primer.
 *
 * FIX NOTES vs old version:
 *  - State update (renderCell) now runs FIRST, synchronously.
 *  - Flare overlays are scheduled with per-cell stagger AFTER state is applied,
 *    so they are never immediately painted over by renderCell in the same frame.
 *  - Each cell in a row/col gets its own small offset (20ms apart) for a real
 *    left-to-right / top-to-bottom sweep feel.
 */
function applyPerfectPrimerReveal() {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length;
    const cols = sol[0].length;

    let totalRows = PRIMER_MAX + _primerCalcBonusRows();
    let totalCols = PRIMER_MAX + _primerCalcBonusCols();

    if (PT.hasSkill('primed_scout')) {
        totalRows *= 2;
        totalCols *= 2;
    }

    totalRows = Math.min(totalRows, rows);
    totalCols = Math.min(totalCols, cols);

    const rowIdxs = shuffle(Array.from({ length: rows }, (_, i) => i)).slice(0, totalRows);
    const colIdxs = shuffle(Array.from({ length: cols }, (_, i) => i)).slice(0, totalCols);

    // ── 1. Apply all state changes IMMEDIATELY (no visual yet) ────────────
    rowIdxs.forEach(r => {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 1) { revealedGrid[r][c] = true; userGrid[r][c] = 1; }
            else if (userGrid[r][c] === 0) { userGrid[r][c] = 2; }
            renderCell(r, c);
            updClues(r, c);
        }
    });
    colIdxs.forEach(c => {
        for (let r = 0; r < rows; r++) {
            if (sol[r][c] === 1) { revealedGrid[r][c] = true; userGrid[r][c] = 1; }
            else if (userGrid[r][c] === 0) { userGrid[r][c] = 2; }
            renderCell(r, c);
            updClues(r, c);
        }
    });

    // ── 2. Board glow & toast (immediate) ────────────────────────────────
    const msg = LANG === 'de'
        ? `📜 MEISTER-KARTOGRAFIE: ${totalRows} Zeilen & ${totalCols} Spalten werden kartografiert!`
        : `📜 MASTER CARTOGRAPHY: Mapping ${totalRows} rows & ${totalCols} columns!`;
    showToast(msg);

    const boardEl = document.querySelector('.grid-container') ||
        document.getElementById('grid') ||
        document.querySelector('.board') ||
        document.body;

    boardEl.style.setProperty('--primer-glow-colour', '#ffd700');
    boardEl.classList.add('primer-perfect-glow');
    setTimeout(() => boardEl.classList.remove('primer-perfect-glow'), 2800);

    // ── 3. Schedule gold flare overlays AFTER state is rendered ──────────
    //    Each cell gets a fixed-position overlay that animates independently.
    //    We use a staggered delay so rows sweep left→right and cols top→bottom.
    let delay = 60; // small head-start so the board glow is visible first

    const spawnGoldFlare = (r, c) => {
        // Read position at fire-time (inside setTimeout) so the grid is on screen
        const cellEl = document.getElementById(`g-${r}-${c}`);
        if (!cellEl) return;
        const rect = cellEl.getBoundingClientRect();
        if (!rect || rect.width === 0) return;

        const flare = document.createElement('div');
        flare.className = 'scout-ping-flare scout-flare-perfect';
        flare.style.cssText = `
            position:fixed;
            top:${rect.top}px;
            left:${rect.left}px;
            width:${rect.width}px;
            height:${rect.height}px;
            --flare-colour:#ffd700;
            pointer-events:none;
            z-index:99999;
        `;
        document.body.appendChild(flare);
        setTimeout(() => flare.remove(), 1000);
    };

    // Sweep rows
    rowIdxs.forEach((r, ri) => {
        for (let c = 0; c < cols; c++) {
            setTimeout(() => spawnGoldFlare(r, c), delay + c * 20);
        }
        if (ri % 2 === 0) {
            setTimeout(() =>
                typeof Audio_Manager !== 'undefined' && Audio_Manager.playSFX('tick'),
                delay);
        }
        delay += 80;
    });

    // Sweep cols
    colIdxs.forEach((c, ci) => {
        for (let r = 0; r < rows; r++) {
            setTimeout(() => spawnGoldFlare(r, c), delay + r * 20);
        }
        if (ci % 2 === 0) {
            setTimeout(() =>
                typeof Audio_Manager !== 'undefined' && Audio_Manager.playSFX('tick'),
                delay);
        }
        delay += 80;
    });

    // ── 4. Win check after all animations complete ────────────────────────
    setTimeout(() => {
        questStat_primerRowsColsRevealed(rowIdxs.length, colIdxs.length);
        checkWin();
        if (dead) trackAchStat('primerSolvedAll');
        if (dead) updateQuestStats('primerFullSolve', {});
    }, delay + 300);
}

(function injectPrimerStyles() {
    if (document.getElementById('primer-animation-styles')) return;

    const style = document.createElement('style');
    style.id = 'primer-animation-styles';
    style.textContent = `

        /* ── Board-level glows (scaled by streak tier) ──────────────────── */
        @keyframes primerGlowSoft {
            0%   { box-shadow: 0 0 0px transparent; }
            30%  { box-shadow: 0 0 18px var(--primer-glow-colour, #4fc3f7); }
            100% { box-shadow: 0 0 0px transparent; }
        }
        @keyframes primerGlowMid {
            0%   { box-shadow: 0 0 0px transparent; filter: brightness(1); }
            25%  { box-shadow: 0 0 30px var(--primer-glow-colour, #ffa040); filter: brightness(1.06); }
            100% { box-shadow: 0 0 0px transparent; filter: brightness(1); }
        }
        @keyframes primerGlowStrong {
            0%   { box-shadow: 0 0 0px transparent; filter: brightness(1); }
            20%  { box-shadow: 0 0 42px var(--primer-glow-colour, #e040fb); filter: brightness(1.09) contrast(1.04); }
            100% { box-shadow: 0 0 0px transparent; filter: brightness(1); }
        }
        @keyframes primerBoardGlow {
            0%   { box-shadow: 0 0 0px transparent; filter: brightness(1); }
            15%  { box-shadow: 0 0 55px #ffd700, 0 0 20px #fff6a0; filter: brightness(1.12) contrast(1.06) saturate(1.2); }
            60%  { box-shadow: 0 0 30px #ffd700; filter: brightness(1.05); }
            100% { box-shadow: 0 0 0px transparent; filter: brightness(1); }
        }

        .primer-glow-soft   { animation: primerGlowSoft   1.4s ease-in-out !important; }
        .primer-glow-mid    { animation: primerGlowMid    1.6s ease-in-out !important; }
        .primer-glow-strong { animation: primerGlowStrong 1.8s ease-in-out !important; }
        .primer-perfect-glow { animation: primerBoardGlow 2.8s ease-in-out !important; }


        /* ── Per-cell flare — shared base ───────────────────────────────── */
        @keyframes scoutFlareBase {
            0%   { transform: scale(0.3); opacity: 1;   border-radius: 3px; }
            40%  { transform: scale(1.25); opacity: 0.85; }
            100% { transform: scale(1.0); opacity: 0;   }
        }

        /* Tier 1 – blue (1 correct) */
        @keyframes scoutFlareRow1 {
            0%   { transform: scale(0.3); opacity: 1;
                   background: #4fc3f7; box-shadow: 0 0 10px #4fc3f7; }
            40%  { transform: scale(1.2); opacity: 0.8;
                   background: #b3e5fc; }
            100% { transform: scale(1.0); opacity: 0; }
        }
        /* Tier 2 – teal (2 correct) */
        @keyframes scoutFlareRow2 {
            0%   { transform: scale(0.3); opacity: 1;
                   background: #26c6a6; box-shadow: 0 0 12px #26c6a6; }
            40%  { transform: scale(1.25); opacity: 0.85; background: #b2dfdb; }
            100% { transform: scale(1.0); opacity: 0; }
        }
        /* Tier 3 – orange (3 correct) */
        @keyframes scoutFlareRow3 {
            0%   { transform: scale(0.3); opacity: 1;
                   background: #ffa040; box-shadow: 0 0 14px #ffa040; }
            40%  { transform: scale(1.3); opacity: 0.9; background: #ffe0b2; }
            100% { transform: scale(1.0); opacity: 0; }
        }
        /* Tier 4 – pink/purple (4 correct) */
        @keyframes scoutFlareRow4 {
            0%   { transform: scale(0.3); opacity: 1;
                   background: #e040fb; box-shadow: 0 0 16px #e040fb; }
            40%  { transform: scale(1.35); opacity: 0.9; background: #f8bbd0; }
            100% { transform: scale(1.0); opacity: 0; }
        }
        /* Tier 5 – gold/perfect (5 correct) */
        @keyframes scoutFlarePerfect {
            0%   { transform: scale(0.25); opacity: 1;
                   background: #ffd700;
                   box-shadow: 0 0 22px #ffd700, inset 0 0 10px #fffde7; }
            30%  { transform: scale(1.5); opacity: 1;
                   background: #fff9c4;
                   box-shadow: 0 0 35px #ffd700; }
            70%  { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1.0); opacity: 0; box-shadow: none; }
        }

        /* Map CSS class to animation based on --flare-colour custom prop.
           We use separate classes per tier so the animation keyframe name differs. */
        .scout-ping-flare {
            border-radius: 3px;
            will-change: transform, opacity;
        }
        /* The .scout-flare-row / .scout-flare-col classes are set dynamically;
           we use the --flare-colour var to pick the right named animation via
           a data attribute approach — simpler: we set the animation inline. */

        /* Fallback: any flare without a specific tier class uses the base */
        .scout-ping-flare:not(.scout-flare-perfect) {
            animation: scoutFlareBase 0.8s cubic-bezier(0.1, 0.8, 0.25, 1) forwards !important;
            background: var(--flare-colour, #4fc3f7);
            box-shadow: 0 0 12px var(--flare-colour, #4fc3f7);
        }
        .scout-flare-perfect {
            animation: scoutFlarePerfect 0.95s cubic-bezier(0.1, 0.8, 0.25, 1) forwards !important;
        }
    `;
    document.head.appendChild(style);
})();