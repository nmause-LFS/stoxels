//------------------------------------------------------------------------
//--------------------ASCENDENCY SKILL IMPLEMENTATIONS--------------------
//-------------------------------ACTUARY CLASS----------------------------
//------------------------------------------------------------------------
//
// ACTIVE 1 — Regression to Prior
//   Corrects N most-recent mistake cells and recovers a % of those penalties.
//   Requires a mistake history log: window._mistakeLog[]
//   Each entry: { r, c, penaltySecs }
//
// ACTIVE 2 — Significance Threshold
//   The player clicks a row or column header (or any cell in that line).
//   That line is shielded: the next wrong fill there auto-corrects instead
//   of counting as a mistake, optionally revealing 1 correct cell (rank 3).
//   Protected lines are stored in window._sigThresholdProtected (Set of
//   strings like "row:3" or "col:7").
//
// INTEGRATION HOOKS NEEDED in other files
// ─────────────────────────────────────────
//
// 1. class-abilities.js — applyClassPassiveOnLevelStart()
//    Add inside the reset block:
//      window._mistakeLog = [];
//      window._sigThresholdProtected = new Set();
//
// 2. Wherever applyPenalty() lives (input.js / game.js)
//    After the penalty is applied and if the multiplier was > 0, push:
//      if (window._mistakeLog !== undefined && penaltySecs > 0) {
//          window._mistakeLog.push({ r: row, c: col, penaltySecs });
//          if (window._mistakeLog.length > 10) window._mistakeLog.shift();
//      }
//    NOTE: If the Mathmagician absorbs a mistake (multiplier === 0)
//    do NOT push it — there was no penalty to recover.
//
// 3. Wherever a wrong-fill is about to be committed (before userGrid changes)
//    in input.js, add a Significance Threshold intercept:
//      if (_sigThresholdIntercept(row, col)) return; // blocked — no mistake
//
//------------------------------------------------------------------------


// ─── MISTAKE LOG ──────────────────────────────────────────────────────

// Called by applyPenalty() after a real penalty is deducted.
// Keeps only the 10 most recent entries so memory stays bounded.
function actuaryLogMistake(r, c, penaltySecs) {
    if (!window._mistakeLog) window._mistakeLog = [];
    window._mistakeLog.push({ r, c, penaltySecs });
    if (window._mistakeLog.length > 10) window._mistakeLog.shift();
}


// ─── ACTIVE 1: REGRESSION TO PRIOR ────────────────────────────────────


function _executeRegressionToPrior(correctCount, recoverPct) {
    if (!cur) return;
    const log = window._mistakeLog || [];

    if (log.length === 0) {
        showToast(LANG === 'de'
            ? '🛡️ Keine Fehler zum Korrigieren!'
            : '🛡️ No mistakes to correct!');
        _regressionCancel(true);
        return;
    }

    // Initialize the reverted cells tracker if it doesn't exist yet
    if (!window._dofRevertedCells) window._dofRevertedCells = new Set();

    // Take up to correctCount most-recent entries
    const toCorrect = log.splice(-correctCount, correctCount);

    let recovered = 0;
    const affected = [];

    toCorrect.forEach(({ r, c, penaltySecs }) => {
        // 1. Clear the mistake flag so the red ✕ disappears!
        wrongGrid[r][c] = false;

        // 2. Reset the cell state to empty (0)
        userGrid[r][c] = 0;

        // 3. Add to the reverted set so grid.js applies the 'dof-reverted' class
        window._dofRevertedCells.add(`${r}-${c}`);

        // 4. Trigger the holy explosion visual effect
        const el = document.getElementById(`g-${r}-${c}`);
        if (el) {
            el.classList.add('holy-explosion');
            // Remove the explosion class after the animation finishes
            setTimeout(() => el.classList.remove('holy-explosion'), 800);
        }

        // 5. Update the cell visuals (this applies the DoF class)
        renderCell(r, c);
        affected.push(`g-${r}-${c}`);

        // 6. Accumulate recovered time
        recovered += Math.round(penaltySecs * recoverPct);
    });

    // Recover time
    if (recovered > 0) {
        timerSecs = Math.min(timerSecs + recovered, 3600);
        updTimer();
    }

    const pct = Math.round(recoverPct * 100);
    showToast(`🛡️ ${LANG === 'de'
        ? `Regression: ${toCorrect.length} Fehler korrigiert, +${recovered}s zurück`
        : `Regression: ${toCorrect.length} mistake(s) corrected, +${recovered}s recovered`}`);

    if (window.Audio_Manager) Audio_Manager.playSFX('varianceShield');

    checkWin();
    buildClassHUD();
}


/*

function _executeRegressionToPrior(correctCount, recoverPct) {
    if (!cur) return;
    const log = window._mistakeLog || [];

    if (log.length === 0) {
        showToast(LANG === 'de'
            ? '🛡️ Keine Fehler zum Korrigieren!'
            : '🛡️ No mistakes to correct!');
        _regressionCancel(true);
        return;
    }

    // Take up to correctCount most-recent entries (end of array = most recent)
    const toCorrect = log.splice(-correctCount, correctCount);

    let recovered = 0;
    const affected = [];

    toCorrect.forEach(({ r, c, penaltySecs }) => {
        // Only act on cells that are still in the wrong state (userGrid === 1
        // but solution is 0, i.e. the player clicked a filled cell incorrectly).
        // userGrid value for a wrong fill is typically the ✕-mark (value 2),
        // OR still 1 if the game keeps the fill. We clear whatever state is there
        // and restore the cell to unmarked/unfilled.
        if (cur.grid[r][c] === 0) {
            // Cell should be empty — player wrongly filled it. Reset to blank.
            if (userGrid[r][c] !== 0) {
                userGrid[r][c] = 0;
                renderCell(r, c);
                affected.push(`g-${r}-${c}`);
            }
        }
        // Whether or not we could visually undo (cell may already be re-corrected
        // by other means), always recover the time fraction.
        recovered += Math.round(penaltySecs * recoverPct);
    });

    // Recover time
    if (recovered > 0) {
        timerSecs = Math.min(timerSecs + recovered, 3600);
        updTimer();
    }

    _applyCellEffect(affected, 'reveal');

    const pct = Math.round(recoverPct * 100);
    showToast(`🛡️ ${LANG === 'de'
        ? `Regression: ${toCorrect.length} Fehler korrigiert, +${recovered}s zurück`
        : `Regression: ${toCorrect.length} mistake(s) corrected, +${recovered}s recovered`}`);

    if (window.Audio_Manager) Audio_Manager.playSFX('varianceShield');

    checkWin();
    buildClassHUD();
}


*/

function _regressionCancel(noOverlayToRemove = false) {
    _setAbilityMode(false);
    STATE.classActiveChoice = 'active3';

    const cd = cooldownState['active3'];
    if (cd && cd.interval) { clearInterval(cd.interval); cd.interval = null; }
    if (cd) cd.remaining = 0;

    buildClassHUD();
    if (!noOverlayToRemove) {
        showToast(LANG === 'de' ? '🛡️ Abgebrochen.' : '🛡️ Cancelled.');
    }
}


// ─── ACTIVE 2: SIGNIFICANCE THRESHOLD ────────────────────────────────

// _executeSignificanceThreshold — arms the ability.
//   The player then clicks a cell; we protect its row AND column
//   (up to protectCount total lines, tracked across clicks).
//   Since the ability requires picking lines interactively we open
//   a line-picker modal showing row/col buttons for the clicked cell.

/*

function _executeSignificanceThreshold(protectCount, bonusReveal) {
    if (!cur) return;

    // Store params for the click handler
    window._sigThreshData = { protectCount, bonusReveal, chosen: [] };

    showToast(LANG === 'de'
        ? `🛡️ Klicke bis zu ${protectCount} Zeile(n)/Spalte(n) zum Schützen.`
        : `🛡️ Click up to ${protectCount} row(s)/col(s) to protect.`);

    // Keep armed — each cell click calls _sigThreshPickFromCell(row, col)
    // which opens a small row/col chooser modal.
    window._sigThreshArmed = true;
}

*/



function _executeSignificanceThreshold(protectCount, bonusReveal) {
    if (!cur) return;
    window._sigThreshData = { protectCount, bonusReveal, chosen: [] };
    window._sigThreshBonusReveal = bonusReveal;

    // Show the line-picker modal immediately — no intermediate grid click needed
    _sigThreshShowLinePicker(protectCount);
}



function _sigThreshShowLinePicker(protectCount) {
    if (!cur) return;
    document.getElementById('sig-thresh-picker')?.remove();

    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const remaining = protectCount - (window._sigThreshData?.chosen?.length || 0);

    const title = LANG === 'de' ? 'SIGNIFIKANZSCHWELLE' : 'SIGNIFICANCE THRESHOLD';
    const prompt = LANG === 'de'
        ? `Wähle bis zu ${remaining} Zeile(n) oder Spalte(n) zum Schützen:`
        : `Choose up to ${remaining} row(s) or column(s) to protect:`;
    const doneLabel = LANG === 'de' ? 'FERTIG' : 'DONE';
    const cancelLabel = LANG === 'de' ? 'ABBRECHEN' : 'CANCEL';

    // Build row buttons
    let rowBtns = '';
    for (let r = 0; r < rows; r++) {
        const label = LANG === 'de' ? `Zeile ${r + 1}` : `Row ${r + 1}`;
        rowBtns += `<button onclick="_sigThreshProtectLine('row', ${r})"
            style="font-family:var(--PX); font-size:9px; background:transparent;
                   border:1px solid #e67e22; color:#e67e22; padding:4px 10px;
                   cursor:pointer; letter-spacing:1px; margin:2px;">
            ${label}
        </button>`;
    }

    // Build col buttons
    let colBtns = '';
    for (let c = 0; c < cols; c++) {
        const label = LANG === 'de' ? `Spalte ${c + 1}` : `Col ${c + 1}`;
        colBtns += `<button onclick="_sigThreshProtectLine('col', ${c})"
            style="font-family:var(--PX); font-size:9px; background:transparent;
                   border:1px solid #e67e22; color:#e67e22; padding:4px 10px;
                   cursor:pointer; letter-spacing:1px; margin:2px;">
            ${label}
        </button>`;
    }

    const overlay = document.createElement('div');
    overlay.id = 'sig-thresh-picker';
    overlay.className = 'modal-bg show';
    overlay.style.cssText = 'z-index:3000;';
    overlay.innerHTML = `
        <div class="modal-box" style="text-align:center; border-left: 4px solid #e67e22;
             max-width: 480px; max-height: 80vh; overflow-y: auto;">
            <div style="font-family:var(--PX); font-size:13px; color:#e67e22;
                        letter-spacing:2px; margin-bottom:12px;">
                🛡️ ${title}
            </div>
            <div style="font-family:var(--PX); font-size:10px; color:var(--accent2);
                        margin-bottom:14px; line-height:1.8;">
                ${prompt}
            </div>
            <div style="margin-bottom:10px;">
                <div style="font-family:var(--PX); font-size:9px; color:#aaa;
                            margin-bottom:6px; letter-spacing:1px;">
                    ${LANG === 'de' ? 'ZEILEN' : 'ROWS'}
                </div>
                <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:4px;">
                    ${rowBtns}
                </div>
            </div>
            <div style="margin-bottom:14px;">
                <div style="font-family:var(--PX); font-size:9px; color:#aaa;
                            margin-bottom:6px; letter-spacing:1px;">
                    ${LANG === 'de' ? 'SPALTEN' : 'COLUMNS'}
                </div>
                <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:4px;">
                    ${colBtns}
                </div>
            </div>
            <div id="sig-thresh-chosen-display" style="font-family:var(--PX); font-size:9px;
                 color:#27ae60; min-height:16px; margin-bottom:10px;"></div>
            <div style="display:flex; gap:10px; justify-content:center;">
                <button onclick="_sigThreshDone()"
                    style="font-family:var(--PX); font-size:9px; background:transparent;
                           border:1px solid #27ae60; color:#27ae60; padding:5px 14px;
                           cursor:pointer; letter-spacing:1px;">
                    ${doneLabel}
                </button>
                <button onclick="_sigThreshCancel()"
                    style="font-family:var(--PX); font-size:9px; background:transparent;
                           border:1px solid #444; color:#555; padding:5px 14px;
                           cursor:pointer; letter-spacing:1px;">
                    ${cancelLabel}
                </button>
            </div>
        </div>`;
    document.body.appendChild(overlay);
}



// _sigThreshPickFromCell — called when the player clicks a cell while
//   Significance Threshold is armed. Shows a mini modal to pick row or col.
function _sigThreshPickFromCell(row, col) {
    if (!window._sigThreshArmed || !window._sigThreshData) return;

    // Remove any existing picker
    document.getElementById('sig-thresh-picker')?.remove();

    const data = window._sigThreshData;
    const remaining = data.protectCount - data.chosen.length;

    const overlay = document.createElement('div');
    overlay.id = 'sig-thresh-picker';
    overlay.className = 'modal-bg show';
    overlay.style.cssText = 'z-index:3000;';
    overlay.innerHTML = _sigThreshPickerHTML(row, col, remaining);
    document.body.appendChild(overlay);
}


function _sigThreshPickerHTML(row, col, remaining) {
    const title = LANG === 'de' ? 'SIGNIFIKANZSCHWELLE' : 'SIGNIFICANCE THRESHOLD';
    const prompt = LANG === 'de'
        ? `Zeile ${row + 1} oder Spalte ${col + 1} schützen? (${remaining} verbleibend)`
        : `Protect Row ${row + 1} or Column ${col + 1}? (${remaining} remaining)`;
    const rowLabel = LANG === 'de' ? `▶ ZEILE ${row + 1}` : `▶ ROW ${row + 1}`;
    const colLabel = LANG === 'de' ? `▶ SPALTE ${col + 1}` : `▶ COL ${col + 1}`;
    const doneLabel = LANG === 'de' ? 'FERTIG' : 'DONE';
    const cancelLabel = LANG === 'de' ? 'ABBRECHEN' : 'CANCEL';

    return `
        <div class="modal-box" style="text-align:center; border-left: 4px solid #e67e22; max-width: 320px;">
            <div style="font-family:var(--PX); font-size:13px; color:#e67e22; letter-spacing:2px; margin-bottom:12px;">
                🛡️ ${title}
            </div>
            <div style="font-family:var(--PX); font-size:10px; color:var(--accent2); margin-bottom:18px; line-height:1.8;">
                ${prompt}
            </div>
            <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
                <button onclick="_sigThreshProtectLine('row', ${row})"
                        style="font-family:var(--PX); font-size:10px; background:transparent; border:1px solid #e67e22; color:#e67e22; padding:8px 18px; cursor:pointer; letter-spacing:1px;">
                    ${rowLabel}
                </button>
                <button onclick="_sigThreshProtectLine('col', ${col})"
                        style="font-family:var(--PX); font-size:10px; background:transparent; border:1px solid #e67e22; color:#e67e22; padding:8px 18px; cursor:pointer; letter-spacing:1px;">
                    ${colLabel}
                </button>
            </div>
            <div style="margin-top:12px; display:flex; gap:10px; justify-content:center;">
                <button onclick="_sigThreshDone()"
                        style="font-family:var(--PX); font-size:9px; background:transparent; border:1px solid #27ae60; color:#27ae60; padding:5px 14px; cursor:pointer; letter-spacing:1px;">
                    ${doneLabel}
                </button>
                <button onclick="_sigThreshCancel()"
                        style="font-family:var(--PX); font-size:9px; background:transparent; border:1px solid #444; color:#555; padding:5px 14px; cursor:pointer; letter-spacing:1px;">
                    ${cancelLabel}
                </button>
            </div>
        </div>`;
}


// _sigThreshProtectLine — adds a line to the protected set, triggers visual,
//   and closes the picker. If more charges remain, stays armed.


/*

function _sigThreshProtectLine(type, idx) {
    document.getElementById('sig-thresh-picker')?.remove();

    const data = window._sigThreshData;
    if (!data) return;

    const key = `${type}:${idx}`;
    if (!window._sigThresholdProtected) window._sigThresholdProtected = new Set();

    if (!window._sigThresholdProtected.has(key)) {
        window._sigThresholdProtected.add(key);
        data.chosen.push(key);
        _sigThreshApplyVisual(type, idx);

        const name = type === 'row'
            ? (LANG === 'de' ? `Zeile ${idx + 1}` : `Row ${idx + 1}`)
            : (LANG === 'de' ? `Spalte ${idx + 1}` : `Col ${idx + 1}`);
        showToast(`🛡️ ${name} ${LANG === 'de' ? 'geschützt!' : 'protected!'}`);
    }

    const remaining = data.protectCount - data.chosen.length;
    if (remaining <= 0) {
        // Used all charges — disarm
        _sigThreshDone();
    }
    // Otherwise stay armed for more picks — player clicks next cell
}

*/


// AFTER a line is chosen, instead of staying "armed" for another cell click,
// re-open the picker if charges remain. Replace the last part of _sigThreshProtectLine:

function _sigThreshProtectLine(type, idx) {
    document.getElementById('sig-thresh-picker')?.remove();

    const data = window._sigThreshData;
    if (!data) return;

    const key = `${type}:${idx}`;
    if (!window._sigThresholdProtected) window._sigThresholdProtected = new Set();

    if (!window._sigThresholdProtected.has(key)) {
        window._sigThresholdProtected.add(key);
        data.chosen.push(key);
        _sigThreshApplyVisual(type, idx);

        const name = type === 'row'
            ? (LANG === 'de' ? `Zeile ${idx + 1}` : `Row ${idx + 1}`)
            : (LANG === 'de' ? `Spalte ${idx + 1}` : `Col ${idx + 1}`);
        showToast(`🛡️ ${name} ${LANG === 'de' ? 'geschützt!' : 'protected!'}`);
    }

    const remaining = data.protectCount - data.chosen.length;
    if (remaining <= 0) {
        _sigThreshDone();
    } else {
        // Re-open the picker with updated remaining count
        _sigThreshShowLinePicker(data.protectCount);
    }
}


// _sigThreshApplyVisual — adds a subtle shield highlight to all cells in the line.
function _sigThreshApplyVisual(type, idx) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    const cells = [];
    if (type === 'row') {
        for (let c = 0; c < cols; c++) cells.push(`g-${idx}-${c}`);
    } else {
        for (let r = 0; r < rows; r++) cells.push(`g-${r}-${idx}`);
    }

    cells.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('sig-thresh-protected');
    });
}


// _sigThreshRemoveVisual — removes shield highlight from a line after it triggers.
function _sigThreshRemoveVisual(type, idx) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    if (type === 'row') {
        for (let c = 0; c < cols; c++) {
            document.getElementById(`g-${idx}-${c}`)?.classList.remove('sig-thresh-protected');
        }
    } else {
        for (let r = 0; r < rows; r++) {
            document.getElementById(`g-${r}-${idx}`)?.classList.remove('sig-thresh-protected');
        }
    }
}


// _sigThreshDone — called when player is done picking lines (or all charges used).

function _sigThreshDone() {
    document.getElementById('sig-thresh-picker')?.remove();
    window._sigThreshArmed = false; // kept for safety, no longer used

    _setAbilityMode(false);

    const chosen = window._sigThreshData?.chosen?.length || 0;
    if (chosen === 0) {
        const cd = cooldownState['active4'];
        if (cd && cd.interval) { clearInterval(cd.interval); cd.interval = null; }
        if (cd) cd.remaining = 0;
        showToast(LANG === 'de' ? '🛡️ Keine Linie ausgewählt.' : '🛡️ No line selected.');
    } else {
        showToast(LANG === 'de'
            ? `🛡️ ${chosen} Linie(n) geschützt!`
            : `🛡️ ${chosen} line(s) protected!`);
    }

    window._sigThreshData = null;
    buildClassHUD();
}


/*


function _sigThreshDone() {
    document.getElementById('sig-thresh-picker')?.remove();
    window._sigThreshArmed = false;

    _setAbilityMode(false);

    const chosen = window._sigThreshData?.chosen?.length || 0;
    if (chosen === 0) {
        // No lines picked — refund cooldown
        const cd = cooldownState['active4'];
        if (cd && cd.interval) { clearInterval(cd.interval); cd.interval = null; }
        if (cd) cd.remaining = 0;
        showToast(LANG === 'de' ? '🛡️ Keine Linie ausgewählt.' : '🛡️ No line selected.');
    } else {
        showToast(LANG === 'de'
            ? `🛡️ ${chosen} Linie(n) geschützt!`
            : `🛡️ ${chosen} line(s) protected!`);
    }

    window._sigThreshData = null;
    buildClassHUD();
}

*/


// _sigThreshCancel — cancels before picking any line; refunds cooldown.
function _sigThreshCancel() {
    document.getElementById('sig-thresh-picker')?.remove();
    window._sigThreshArmed = false;
    window._sigThreshData = null;

    _setAbilityMode(false);
    STATE.classActiveChoice = 'active4';

    const cd = cooldownState['active4'];
    if (cd && cd.interval) { clearInterval(cd.interval); cd.interval = null; }
    if (cd) cd.remaining = 0;

    buildClassHUD();
    showToast(LANG === 'de' ? '🛡️ Abgebrochen.' : '🛡️ Cancelled.');
}


// _sigThresholdIntercept — called BEFORE a wrong fill is committed.
//   Returns true if the shield intercepted (caller should return early — no mistake).
//   Returns false if no shield applies.
//
//   Call this from your input handler right before registering a wrong fill:
//     if (_sigThresholdIntercept(row, col)) return;
//
function _sigThresholdIntercept(row, col) {
    const protected_ = window._sigThresholdProtected;
    if (!protected_ || protected_.size === 0) return false;

    const rowKey = `row:${row}`;
    const colKey = `col:${col}`;
    const matchKey = protected_.has(rowKey) ? rowKey : protected_.has(colKey) ? colKey : null;
    if (!matchKey) return false;

    // Shield triggers — auto-mark the cell as ✕ instead of a mistake
    if (userGrid[row][col] === 0) {
        userGrid[row][col] = 2; // ✕ mark
        renderCell(row, col);
    }

    // Consume this shield charge
    protected_.delete(matchKey);
    const [type, idxStr] = matchKey.split(':');
    const idx = parseInt(idxStr, 10);
    _sigThreshRemoveVisual(type, idx);

    // Rank 3 bonus: reveal 1 correct cell in the same line
    const data_bonusReveal = window._sigThreshBonusReveal;
    if (data_bonusReveal) {
        _sigThreshBonusRevealInLine(type, idx);
    }

    showToast(LANG === 'de'
        ? `🛡️ Schwelle ausgelöst! Fehler blockiert in ${type === 'row' ? 'Zeile' : 'Spalte'} ${idx + 1}.`
        : `🛡️ Threshold triggered! Mistake blocked in ${type} ${idx + 1}.`);

    if (window.Audio_Manager) Audio_Manager.playSFX('varianceShield');

    return true; // intercepted — caller should not count this as a mistake
}


// _sigThreshBonusRevealInLine — reveals 1 random unrevealed filled cell
//   in the given row or column (rank 3 bonus).
function _sigThreshBonusRevealInLine(type, idx) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    const candidates = [];
    if (type === 'row') {
        for (let c = 0; c < cols; c++) {
            if (sol[idx][c] === 1 && !revealedGrid[idx][c] && userGrid[idx][c] !== 1)
                candidates.push([idx, c]);
        }
    } else {
        for (let r = 0; r < rows; r++) {
            if (sol[r][idx] === 1 && !revealedGrid[r][idx] && userGrid[r][idx] !== 1)
                candidates.push([r, idx]);
        }
    }

    if (!candidates.length) return;
    const [r, c] = candidates[Math.floor(Math.random() * candidates.length)];
    revealedGrid[r][c] = true;
    userGrid[r][c] = 1;
    renderCell(r, c);
    updClues(r, c);
    trackAchStat('tilesRevealed', 1);
    _applyCellEffect([`g-${r}-${c}`], 'reveal');
    showToast(LANG === 'de'
        ? '🛡️ Schwellen-Bonus: 1 Zelle enthüllt!'
        : '🛡️ Threshold bonus: 1 cell revealed!');
    checkWin();
}


//------------------------------------------------------------------------
// INTEGRATION NOTE — executeActiveAbility() in class-abilities.js
//------------------------------------------------------------------------
// The Significance Threshold ability arms a mode where clicks go to
// _sigThreshPickFromCell() rather than the normal grid handler.
// Add this to executeActiveAbility():
//
//   if (activeKey === 'active4' && window._sigThreshArmed) {
//       _sigThreshPickFromCell(row, col);
//       return; // don't disarm or start cooldown again
//   }
//
// And update _dispatchAscendencyAbility() case 'actuary':
//   if (ascSlot === 'active1') {
//       _executeRegressionToPrior(effect.correctCount, effect.recoverPct);
//   } else {
//       _executeSignificanceThreshold(effect.protectCount, effect.bonusReveal);
//       // Store bonusReveal flag for intercept to read
//       window._sigThreshBonusReveal = effect.bonusReveal;
//   }
//------------------------------------------------------------------------


//------------------------------------------------------------------------
// CSS TO ADD (in your CSS file)
//------------------------------------------------------------------------
// .sig-thresh-protected {
//     outline: 1px solid rgba(230, 126, 34, 0.55) !important;
//     background-color: rgba(230, 126, 34, 0.07) !important;
// }
//------------------------------------------------------------------------