// ═══════════════════════════════════════════════
//  SCORING  (scoring.js)
//  Handles everything that happens the moment a
//  puzzle is completed: win detection, score
//  calculation, bonus objective evaluation, item
//  rewards, the statistics quiz flow, and the
//  mini reveal-grid shown on the win overlay.
// ═══════════════════════════════════════════════

// Track current points during the active level
let currentRunScore = 0;

// rarityColors — maps a rarity key to { border, color } CSS values.
//   Used by all item-reward divs on the win overlay so the box visually
//   matches the item's tier instead of always showing purple.
function rarityColors(rarity) {
    const map = {
        common: { border: '#7a7a7a', color: '#b0b0b0' },
        uncommon: { border: '#2ecc71', color: '#2ecc71' },
        rare: { border: '#3498db', color: '#3498db' },
        epic: { border: '#9b59b6', color: '#c39bd3' },
        legendary: { border: '#f39c12', color: '#f5b642' },
        cursed: { border: '#e74c3c', color: '#e74c3c' },
        artifact: { border: '#f1c40f', color: '#f1c40f' },
    };
    return map[rarity] || { border: 'var(--border2)', color: 'var(--accent2)' };
}


// ═══════════════════════════════════════════════
//  WIN CHECK
// ═══════════════════════════════════════════════

// checkWin — called after every valid cell change (in input.js ac()).
//   Scans the entire grid to see if the player's current state matches
//   the solution exactly. A cell counts as "filled" if either:
//     - the player filled it (userGrid = 1), OR
//     - an item revealed it (revealedGrid = true).
//   Returns immediately (early exit) the moment any mismatch is found,
//   keeping the function cheap to call on every move.
//
//   When the puzzle IS complete:
//   1.  Sets dead = true and stops the timer so no more input is accepted.
//   2.  Marks the level as done in STATE.done (if not already there).
//   3.  Calculates the score:
//         baseScore     = 100 + (rows + cols) * 2  (rewards bigger grids)
//         timeBonus     = remaining seconds ÷ 10   (rewards finishing fast)
//         mistakePenalty= mistakes × 20            (punishes errors)
//         rawScore      = max(10, base + time - penalty)  (floor of 10)
//         pts           = round(rawScore × scoreMultiplier())
//   4.  Adds pts to STATE.totalScore and updates the high score for this
//       level if the new score beats the stored best.
//   5.  Evaluates the bonus objective (see bonus type table below).
//   6.  Builds the reveal mini-grid, fills the overlay text, and shows
//       either the quiz (if bonus type is 'quiz' and bonus was met) or
//       the win overlay directly.
function checkWin() {
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // Scan every cell — return early if anything doesn't match
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const effective = userGrid[r][c] === 1 || revealedGrid[r][c];
            if (effective !== (sol[r][c] === 1)) return; // not complete yet
        }
    }

    // ── Puzzle complete ───────────────────────────────────────────────────
    dead = true;
    stopTimer(); // timer.js

    const gi = cur.gIdx;
    if (!STATE.done.includes(gi)) STATE.done.push(gi); // mark level as completed

    // ── Score calculation ─────────────────────────────────────────────────
    const baseScore = 100 + (rows + cols) * 2;
    const timeBonus = Math.floor(timerSecs / 10);
    const mistakePenalty = mistakeCount * 20;
    const rawScore = Math.max(10, baseScore + timeBonus - mistakePenalty);
    const mult = scoreMultiplier(); // config.js
    const pts = Math.round(rawScore * mult);

    // Only award the improvement over the player's previous best for this level.
    // If this run scores lower than or equal to the stored best, award 0.
    // This prevents farming the same level for unlimited points.
    const hs = STATE.levelHS[gi];
    const prevBest = hs ? hs.score : 0;
    const ptsAwarded = Math.max(0, pts - prevBest);
    STATE.totalScore += ptsAwarded;

    // Update high score for this level if this run beats the previous best
    if (!hs || pts > hs.score) {
        STATE.levelHS[gi] = {
            score: pts,
            diff: curDiff,
            time: timerSecs,
            mods: { ...curMods } // snapshot so mods can't change retroactively
        };
    }
    save();
    document.getElementById('sc-disp').textContent = STATE.totalScore;

    // ── Bonus objective evaluation ────────────────────────────────────────
    // elapsed = how many seconds the player actually spent on this level.
    // In Time Trial mode the timer starts at half the intended timer instead of the normal
    // timerStart value, so elapsed is calculated differently.
    const baseTimer = cur.timer || DIFF_CFG[curDiff].timerStart;
    const elapsed = Math.round(baseTimer * (curMods.timetrial ? 0.5 : 1)) - timerSecs;

    // Bonus type reference:
    //   'fast'    — finish in ≤ bonusParam seconds elapsed
    //   'nomiss'  — finish with exactly 0 mistakes
    //   'lowmiss' — finish with ≤ bonusParam mistakes (lenient version of nomiss)
    //   'noitem'  — finish without using any item this level
    //   'quiz'    — always met on completion; actual bonus comes from answering correctly
    //   'combo'   — finish in ≤ bonusParam seconds AND 0 mistakes (hardest)
    const bt = cur.bonusType || 'nomiss';
    const bp = cur.bonusParam !== undefined ? cur.bonusParam : 0;

    let bonusMet = false;
    if (bt === 'fast') bonusMet = elapsed <= bp;
    else if (bt === 'nomiss') bonusMet = mistakeCount === 0;
    else if (bt === 'lowmiss') bonusMet = mistakeCount <= bp;
    else if (bt === 'noitem') bonusMet = itemsUsedThisLevel === 0;
    else if (bt === 'quiz') bonusMet = true; // quiz determines the actual reward
    else if (bt === 'combo') bonusMet = elapsed <= bp && mistakeCount === 0;
    // Combined no-item variants — no items used AND the secondary condition:
    else if (bt === 'noitem_nomiss') bonusMet = itemsUsedThisLevel === 0 && mistakeCount === 0;
    else if (bt === 'noitem_fast') bonusMet = itemsUsedThisLevel === 0 && elapsed <= bp;

    // ── Build win overlay content ─────────────────────────────────────────
    buildReveal(); // render the mini solution grid (bottom of this file)

    const mins = Math.floor(timerSecs / 60);
    const secs = timerSecs % 60;
    const elapsedMins = Math.floor(elapsed / 60);
    const elapsedSecs = elapsed % 60;
    const gainNote = ptsAwarded < pts
        ? ` (+${ptsAwarded} ${t('ov_win_new')} — ${t('ov_win_best_was')} ${prevBest})`
        : ` (+${ptsAwarded})`;
    document.getElementById('ov-sub').innerHTML =
        `<div class="ov-sub-line ov-sub-reveal">"${lvText(cur, 'reveal')}"</div>` +
        `<div class="ov-sub-line ov-sub-pts">${pts} ${t('ov_win_pts')} (×${mult.toFixed(2)})${gainNote}</div>` +
        `<div class="ov-sub-line ov-sub-time">⏱ ${mins}:${String(secs).padStart(2, '0')} ${t('ov_win_left')} · ${t('ov_win_solved_in')} ${elapsedMins}:${String(elapsedSecs).padStart(2, '0')}</div>` +
        `<div class="ov-sub-line ${mistakeCount === 0 ? 'ov-sub-miss-ok' : 'ov-sub-miss'}">✗ ${mistakeCount} ${mistakeCount !== 1 ? t('ov_win_mistakes') : t('ov_win_mistake')}</div>`;

    // Bonus badge — green if met, grey if missed; shows the hint if missed
    const bl = document.getElementById('bonus-list');
    bl.innerHTML = `<span class="bonus-badge ${bonusMet ? 'earned' : 'missed'}">
        ${bonusMet ? t('ov_bonus_met') : '🎯 ' + lvText(cur, 'bonusHint')}
    </span>`;

    // ── Item reward ───────────────────────────────────────────────────────
    // Award one random item if: bonus was met AND Ironman is off AND this
    // level's bonus hasn't been claimed before (no duplicate rewards).
    // EXCEPTION: quiz bonus types skip the item award here — the quiz flow
    // (answerQuiz) is the sole item/points gatekeeper for those levels,
    // preventing a double-item situation.
    const irz = document.getElementById('item-reward-zone');
    irz.innerHTML = '';
    const bonusAlreadyDone = STATE.bonusDone.includes(gi);
    const isQuizBonus = (bt === 'quiz');

    if (bonusMet && !curMods.ironman && !bonusAlreadyDone && !isQuizBonus) {
        const defId = pickRandomItem(); // items.js
        const def = ITEM_DEFS[defId];
        if (def) {
            const item = { defId, uid: Date.now() + Math.random().toString(36).slice(2) };
            STATE.inventory.push(item);
            STATE.bonusDone.push(gi);
            save();
            const rc1 = rarityColors(def.rarity);
            irz.innerHTML = `<div class="item-reward" style="border-color:${rc1.border};color:${rc1.color};">
                ${t('ov_item_earned')}: ${def.icon} <strong>${itemName(def)}</strong>
            </div>`;
        }
    } else if (bonusMet && bonusAlreadyDone && !curMods.ironman && !isQuizBonus) {
        irz.innerHTML = `<div class="item-reward" style="border-color:var(--border2);color:#666;">
            ${t('ov_bonus_claimed_note')}
        </div>`;

        if (Math.random() < 0.5) {
            const defId = pickLuckyItem();
            const def = ITEM_DEFS[defId];
            if (def) {
                STATE.inventory.push({ defId, uid: Date.now() + Math.random().toString(36).slice(2) });
                save();
                const rc2 = rarityColors(def.rarity);
                irz.innerHTML += `<div class="item-reward" style="border-color:${rc2.border};color:${rc2.color};">
                    ${t('ov_lucky_drop')} ${def.icon} <strong>${itemName(def)}</strong>
                </div>`;
            }
        }
    } else if (!bonusMet && !curMods.ironman && !isQuizBonus) {
        // Bonus missed — small consolation lucky drop chance
        if (Math.random() < 0.5) {
            const defId = pickLuckyItem();
            const def = ITEM_DEFS[defId];
            if (def) {
                STATE.inventory.push({ defId, uid: Date.now() + Math.random().toString(36).slice(2) });
                save();
                const rc3 = rarityColors(def.rarity);
                irz.innerHTML = `<div class="item-reward" style="border-color:${rc3.border};color:${rc3.color};">
                    ${t('ov_lucky_drop')} ${def.icon} <strong>${itemName(def)}</strong>
                </div>`;
            }
        }
    }

    // Check if completing this level finished a whole World → unlock a Moodle code
    checkWorldCodes(); // codes.js

    // ── Show quiz or win overlay ──────────────────────────────────────────
    // If this level's bonus type is 'quiz' AND the bonus was met, show the
    // quiz after a short pause (so the player can read the overlay first).
    // Otherwise, show the win overlay directly after a shorter pause.
    if (bonusMet && cur.bonusType === 'quiz') {
        setTimeout(() => showQuiz(), 1500);
    } else {
        setTimeout(() => document.getElementById('ov-win').classList.add('show'), 600);
    }
}


// ═══════════════════════════════════════════════
//  QUIZ FLOW
//  showQuiz → player clicks → answerQuiz →
//  player clicks Continue → finishQuiz
//  (or player clicks Skip → skipQuiz)
// ═══════════════════════════════════════════════

// showQuiz — renders the quiz overlay with a freshly picked question.
//   1. Gets a randomised question from quiz.js via getQuizQuestion().
//   2. Stores the correct answer text in a data attribute so answerQuiz()
//      can highlight it without needing to re-derive it.
//   3. Clears any previous result text and hides the Continue button.
//   4. Creates one <button class="quiz-opt"> per answer option, marks the
//      correct one with data-isCorrect="1" for later highlighting, and
//      attaches the answerQuiz() handler.
//   5. Shows the overlay.
function showQuiz() {
    const q = getQuizQuestion(); // quiz.js

    // Cache the correct answer text so answerQuiz can always highlight it
    const correctText = q.opts.find(o => o.isCorrect).text;
    document.getElementById('quiz-q').textContent = q.q;
    document.getElementById('quiz-q').dataset.correctText = correctText;
    document.getElementById('quiz-result').textContent = '';
    document.getElementById('quiz-continue').style.display = 'none';

    const optsEl = document.getElementById('quiz-opts');
    optsEl.innerHTML = '';

    q.opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt';
        btn.textContent = opt.text;
        if (opt.isCorrect) btn.dataset.isCorrect = '1'; // flag for green highlight
        btn.onclick = () => answerQuiz(opt.isCorrect, optsEl, btn);
        optsEl.appendChild(btn);
    });

    document.getElementById('quiz-overlay').classList.add('show');
}

// answerQuiz(correct, optsEl, clickedBtn) — handles the player's answer.
//   correct    — boolean: did the player click the right button?
//   optsEl     — the container of all answer buttons (used for highlighting)
//   clickedBtn — the specific button the player clicked
//
//   Steps:
//   1. Records the result in quizAnsweredCorrectly (state.js).
//   2. Disables all buttons (sets onclick to null) so the player can't
//      change their answer after clicking.
//   3. Highlights the correct button green regardless of whether the
//      player was right. If they were wrong, also highlights their
//      chosen button red so they can see their mistake.
//   4. If correct: awards +50 pts, updates the score display, and
//      (unless Ironman) grants a bonus item which is appended to the
//      item-reward-zone below the win overlay.
//   5. If wrong: shows an error message, no score or item awarded.
//   6. Reveals the Continue button so the player can proceed.
function answerQuiz(correct, optsEl, clickedBtn) {
    quizAnsweredCorrectly = correct; // state.js — readable by other systems if needed

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
                    const rcq1 = rarityColors(def.rarity);
                    irz.innerHTML += `<div class="item-reward" style="border-color:${rcq1.border};color:${rcq1.color};margin-top:4px;">
                        ${t('ov_lucky_drop')} ${def.icon} <strong>${itemName(def)}</strong>
                    </div>`;
                }
            }
        } else {
            resEl.className = 'quiz-result ok';
            resEl.textContent = t('quiz_correct');

            STATE.totalScore += 50;
            document.getElementById('sc-disp').textContent = STATE.totalScore;

            if (!curMods.ironman) {
                const defId = pickRandomItem();
                const def = ITEM_DEFS[defId];
                if (def) {
                    STATE.inventory.push({ defId, uid: Date.now() + Math.random().toString(36).slice(2) });
                    STATE.bonusDone.push(cur.gIdx);
                    save();
                    const irz = document.getElementById('item-reward-zone');
                    const rcq2 = rarityColors(def.rarity);
                    irz.innerHTML +=
                        `<div class="item-reward" style="border-color:${rcq2.border};color:${rcq2.color};margin-top:4px;">${t('ov_quiz_reward')}: ` +
                        `${def.icon} <strong>${itemName(def)}</strong></div>`;
                }
            }
        }
    } else {
        resEl.className = 'quiz-result bad';
        resEl.textContent = t('quiz_wrong');
    }

    // Show the continue button now that the answer has been processed
    document.getElementById('quiz-continue').style.display = 'block';
}

// finishQuiz — called when the player clicks "CONTINUE" after answering.
//   Re-checks world codes (in case the quiz answer tipped something over),
//   saves, then shows the win overlay.
function finishQuiz() {
    closeQuiz();
    checkWorldCodes(); // codes.js — re-check in case this was the last level
    save();
    setTimeout(() => document.getElementById('ov-win').classList.add('show'), 300);
}

// skipQuiz — called when the player clicks "SKIP" or presses Escape.
//   No points or items are awarded. Shows the win overlay immediately.
function skipQuiz() {
    closeQuiz();
    setTimeout(() => document.getElementById('ov-win').classList.add('show'), 300);
}

// closeQuiz — removes the 'show' class from the quiz overlay, hiding it.
//   Called by finishQuiz(), skipQuiz(), and the Escape handler in main.js.
function closeQuiz() {
    document.getElementById('quiz-overlay').classList.remove('show');
}


// ═══════════════════════════════════════════════
//  REVEAL MINI-GRID
// ═══════════════════════════════════════════════

// buildReveal — renders a small thumbnail of the solved puzzle on the
//   win overlay so the player can see the symbol they just completed.
//   Cell size is calculated to keep the whole thumbnail within ~120 px,
//   clamped between 4 px (minimum readable) and 14 px (maximum).
//   Filled cells (solution value = 1) get the class 'f' which colours
//   them with the accent colour via CSS.
function buildReveal() {
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // Scale cell size so the longest dimension fits in ~120 px
    const csz = Math.max(4, Math.min(14, Math.floor(120 / Math.max(rows, cols))));

    const ct = document.getElementById('ov-reveal');
    ct.style.gridTemplateColumns = `repeat(${cols}, ${csz}px)`;
    ct.innerHTML = ''; // clear any previous reveal

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const d = document.createElement('div');
            d.className = 'ov-reveal-cell' + (sol[r][c] === 1 ? ' f' : '');
            d.style.cssText = `width:${csz}px; height:${csz}px;`;
            ct.appendChild(d);
        }
    }
}