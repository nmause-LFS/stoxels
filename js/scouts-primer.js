
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
    }

    setTimeout(() => {
        const inp = document.getElementById('primer-input');
        if (inp) {
            inp.focus();
            inp.addEventListener('keydown', e => { if (e.key === 'Enter') submitPrimerAnswer(); });
        }
    }, 100);
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
        const hintBox = document.getElementById('primer-hint');
        const hint = (LANG === 'de' && primerQuestion.hintDE) ? primerQuestion.hintDE : primerQuestion.hintEn;
        hintBox.innerHTML = '💡 ' + hint;
        hintBox.style.display = 'block';
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

        if (newStreak >= PRIMER_MAX) {
            // Answered all 5 correctly
            fb.textContent = LANG === 'de'
                ? `✓ Perfekt! ${newStreak}/${PRIMER_MAX} richtig — maximaler Vorsprung!`
                : `✓ Perfect! ${newStreak}/${PRIMER_MAX} correct — maximum headstart!`;
            trackAchStat('primerCorrect');
            setTimeout(() => {
                closePrimerModal();
                applyPrimerHeadstart(newStreak);
            }, 1000);
        } else {
            // Correct but more questions remain
            fb.textContent = LANG === 'de'
                ? `✓ Richtig! ${newStreak}/${PRIMER_MAX} — nächste Frage…`
                : `✓ Correct! ${newStreak}/${PRIMER_MAX} — next question…`;
            trackAchStat('primerCorrect');
            setTimeout(() => {
                closePrimerModal();
                showPrimerModal(newStreak); // chain: open next question
            }, 900);
        }
    } else {
        // Wrong answer — apply whatever streak was built up
        fb.className = 'mg-feedback mg-bad';
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
}







//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function applyPrimerHeadstart(count) {
    if (!cur || count <= 0) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    const rowIdxs = shuffle(Array.from({ length: rows }, (_, i) => i)).slice(0, count);
    rowIdxs.forEach(r => {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 1) {
                revealedGrid[r][c] = true;
                userGrid[r][c] = 1;
            } else if (userGrid[r][c] === 0) {
                userGrid[r][c] = 2;
            }
            renderCell(r, c);
            updClues(r, c);
        }
    });

    const colIdxs = shuffle(Array.from({ length: cols }, (_, i) => i)).slice(0, count);
    colIdxs.forEach(c => {
        for (let r = 0; r < rows; r++) {
            if (sol[r][c] === 1) {
                revealedGrid[r][c] = true;
                userGrid[r][c] = 1;
            } else if (userGrid[r][c] === 0) {
                userGrid[r][c] = 2;
            }
            renderCell(r, c);
            updClues(r, c);
        }
    });

    const msg = LANG === 'de'
        ? `📜 ${count} Zeile(n) + ${count} Spalte(n) vorgelöst!`
        : `📜 ${count} row(s) + ${count} column(s) pre-solved!`;
    showToast(msg);
    checkWin();

    if (dead) trackAchStat('primerSolvedAll');
}



//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------




//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------





























