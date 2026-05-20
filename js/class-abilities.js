let correctFillStreak = 0;
let nextPenaltyHalved = false;



//------------------------------------------------------------------------
//---------------------------SHARED HELPERS-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// _resolveCell — reveals a filled solution cell or marks an empty one.
//   Returns the cell id string if the cell was actually changed, otherwise null.
function _resolveCell(r, c, sol) {
    if (sol[r][c] === 1) {
        if (!revealedGrid[r][c] && userGrid[r][c] !== 1) {
            revealedGrid[r][c] = true;
            userGrid[r][c] = 1;
            renderCell(r, c);
            updClues(r, c);
            return `g-${r}-${c}`;
        }
    } else {
        if (userGrid[r][c] === 0) {
            userGrid[r][c] = 2;
            renderCell(r, c);
            return `g-${r}-${c}`;
        }
    }
    return null;
}

// _filterRevealedIds — returns only the ids that correspond to filled solution cells.
function _filterRevealedIds(ids, sol) {
    return ids.filter(id => {
        const [, r, c] = id.split('-').map(Number);
        return sol[r][c] === 1;
    });
}

// _filterMarkedIds — returns only the ids that correspond to empty solution cells.
function _filterMarkedIds(ids, sol) {
    return ids.filter(id => {
        const [, r, c] = id.split('-').map(Number);
        return sol[r][c] === 0;
    });
}

// _getActiveAbilityData — resolves the level index and effect for the given ability slot.
function _getActiveAbilityData(def, activeKey) {
    const level = activeKey === 'active1'
        ? (STATE.classActive1Level || 1)
        : (STATE.classActive2Level || 1);
    return def[activeKey].levels[level - 1];
}

// _getPassiveEffect — resolves the current passive effect for the active class.
function _getPassiveEffect() {
    const def = CLASS_DEFS[STATE.playerClass];
    const passLv = STATE.classPassiveLevel || 1;
    return def.passive.levels[passLv - 1].effect;
}

// _setAbilityMode — arms or disarms activeAbilityMode and updates the puzzle cursor.
function _setAbilityMode(armed) {
    activeAbilityMode = armed;
    const wrap = document.getElementById('puzzle-scaler-wrap');
    if (wrap) wrap.style.cursor = armed ? 'crosshair' : '';
}






//------------------------------------------------------------------------
//---------------ACTIVE ABILITY TOGGLE & EXECUTION------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// toggleActiveAbility — arms or disarms the active ability.
//   slot: 'active1' or 'active2' — which ability to arm.
//   When armed, clicking a grid cell triggers executeActiveAbility().
function toggleActiveAbility(slot) {
    const newSlot = slot || 'active1';
    const cd = cooldownState[newSlot];

    if (dead || cd.remaining > 0) return;

    // If clicking the already-armed slot, cancel it; otherwise arm it
    const isAlreadyArmed = activeAbilityMode && STATE.classActiveChoice === newSlot;
    if (isAlreadyArmed) {
        _setAbilityMode(false);
    } else {
        STATE.classActiveChoice = newSlot;
        _setAbilityMode(true);
        _showAbilityArmToast(newSlot);
    }

    buildClassHUD();
}

// _showAbilityArmToast — shows the cursor hint toast for the given ability slot.
function _showAbilityArmToast(slot) {
    const def = CLASS_DEFS[STATE.playerClass];
    const activeData = def[slot];
    if (!activeData) return;
    const msg = LANG === 'de' ? activeData.descCursorDE : activeData.descCursorEn;
    showToast(`🎯 ${msg}`);
}

// executeActiveAbility — called when the player clicks a grid cell
//   while activeAbilityMode is true. Dispatches to the correct class ability.
function executeActiveAbility(row, col) {
    if (!activeAbilityMode || !STATE.playerClass || dead) return;

    _setAbilityMode(false);

    const def = CLASS_DEFS[STATE.playerClass];
    const activeKey = STATE.classActiveChoice || 'active1';
    const actData = _getActiveAbilityData(def, activeKey);
    const effect = actData.effect;

    _dispatchActiveAbility(activeKey, STATE.playerClass, row, col, effect);

    const cdSeconds = getEffectiveCooldown(activeKey, def[activeKey].cooldownSeconds);
    startSlotCooldown(activeKey, cdSeconds);
    buildClassHUD();
}

// _dispatchActiveAbility — routes to the correct ability function and tracks achievement stats.
function _dispatchActiveAbility(activeKey, playerClass, row, col, effect) {
    if (activeKey === 'active1') {
        switch (playerClass) {
            case 'mathmagician':
                _executeArcaneReveal(row, col, effect.radius);
                trackAchStat('skillArcaneRevealUsed');
                break;
            case 'statistician':
                _executeDataStrike(effect.solveCount);
                trackAchStat('skillDataStrikeUsed');
                break;
            case 'probabilist':
                _executePrecisionMark(row, col, effect.extraLines);
                trackAchStat('skillPrecisionMarkUsed');
                break;
        }
    } else {
        switch (playerClass) {
            case 'mathmagician':
                _executeArcaneFreeze(effect.freezeDuration);
                trackAchStat('skillAbsoluteZeroUsed');
                break;
            case 'statistician':
                _executeDiagonalStrike(row, col, effect.diagonals);
                trackAchStat('skillDiagonalStrikeUsed');
                break;
            case 'probabilist':
                _executeFieldScan(effect.scanSize, effect.scanDuration);
                trackAchStat('skillFieldScanUsed');
                break;
        }
    }
}





//------------------------------------------------------------------------
//-----------------STATISTICIAN-------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Data Strike


// _executeDataStrike — shows a choice popup so the player can pick rows or columns,
//   then solves N random unsolved lines of that type.
function _executeDataStrike(count) {
    _dataStrikeShowOverlay(count);
    window._dataStrikePendingCount = count;
}

// _dataStrikeShowOverlay — builds and appends the rows/cols choice modal.
function _dataStrikeShowOverlay(count) {
    const overlay = document.createElement('div');
    overlay.id = 'data-strike-overlay';
    overlay.className = 'modal-bg show';
    overlay.style.cssText = 'z-index:3000;';
    overlay.innerHTML = _dataStrikeOverlayHTML(count);
    document.body.appendChild(overlay);
}

// _dataStrikeOverlayHTML — returns the inner HTML string for the Data Strike modal.
function _dataStrikeOverlayHTML(count) {
    const title = LANG === 'de' ? 'DATENHIEB' : 'DATA STRIKE';
    const prompt = LANG === 'de'
        ? `Wähle: ${count} zufällige Zeile(n) oder Spalte(n) sofort lösen?`
        : `Choose: solve ${count} random row(s) or column(s)?`;
    const rowLabel = LANG === 'de' ? '▶ ZEILEN' : '▶ ROWS';
    const colLabel = LANG === 'de' ? '▶ SPALTEN' : '▶ COLS';
    const cancelLabel = LANG === 'de' ? 'ABBRECHEN' : 'CANCEL';

    return `
        <div class="modal-box" style="text-align:center; border-left: 4px solid #e74c3c; max-width: 320px;">
            <div style="font-family:var(--PX); font-size:13px; color:#e74c3c; letter-spacing:2px; margin-bottom:12px;">
                ⚔️ ${title}
            </div>
            <div style="font-family:var(--PX); font-size:10px; color:var(--accent2); margin-bottom:18px; line-height:1.8;">
                ${prompt}
            </div>
            <div style="display:flex; gap:12px; justify-content:center;">
                <button onclick="_dataStrikeResolve('rows')" style="font-family:var(--PX); font-size:10px; background:transparent; border:1px solid #e74c3c; color:#e74c3c; padding:8px 18px; cursor:pointer; letter-spacing:1px;">
                    ${rowLabel}
                </button>
                <button onclick="_dataStrikeResolve('cols')" style="font-family:var(--PX); font-size:10px; background:transparent; border:1px solid #e74c3c; color:#e74c3c; padding:8px 18px; cursor:pointer; letter-spacing:1px;">
                    ${colLabel}
                </button>
            </div>
            <div style="margin-top:12px;">
                <button onclick="_dataStrikeCancel()" style="font-family:var(--PX); font-size:9px; background:transparent; border:1px solid #444; color:#555; padding:5px 14px; cursor:pointer; letter-spacing:1px;">
                    ${cancelLabel}
                </button>
            </div>
        </div>`;
}

// _dataStrikeRemoveOverlay — removes the Data Strike modal from the DOM.
function _dataStrikeRemoveOverlay() {
    const overlay = document.getElementById('data-strike-overlay');
    if (overlay) overlay.remove();
}

// _dataStrikeResolve — called by modal buttons; solves the chosen line type.
// Respects passive tree nodes: monte_carlo, correlation_matrix,
// advanced_data_strike, god_of_statistics.
function _dataStrikeResolve(type) {
    _dataStrikeRemoveOverlay();

    let count = window._dataStrikePendingCount || 1;
    window._dataStrikePendingCount = null;

    // god_of_statistics: each Data Strike beyond the first this level gets +1 extra solve
    if (ptHasSkill('god_of_statistics')) {
        const uses = window._dataStrikeUsesThisLevel || 0;
        if (uses > 0) count += uses;
    }
    window._dataStrikeUsesThisLevel = (window._dataStrikeUsesThisLevel || 0) + 1;

    // Each node below gives an independent 25% chance at one extra solve
    let extraChances = 0;
    if (ptHasSkill('monte_carlo')) extraChances++;
    if (ptHasSkill('correlation_matrix')) extraChances++;
    if (ptHasSkill('advanced_data_strike')) extraChances++;
    // god_of_statistics contributes an effective 50% (= two independent 25% rolls)
    if (ptHasSkill('god_of_statistics')) extraChances += 2;
    for (let i = 0; i < extraChances; i++) {
        if (Math.random() < 0.25) count++;
    }

    const solved = type === 'rows' ? solveRows(count) : solveCols(count);
    const typeName = type === 'rows'
        ? (LANG === 'de' ? 'Zeile(n)' : 'row(s)')
        : (LANG === 'de' ? 'Spalte(n)' : 'col(s)');

    _playSlashEffect(type === 'cols');
    showToast(`⚔️ ${solved} ${typeName} ${LANG === 'de' ? 'gelöst!' : 'solved!'}`);
    if (solved > 0) checkWin();
}

// _dataStrikeCancel — called by the Cancel button; closes modal and refunds cooldown.
function _dataStrikeCancel() {
    _dataStrikeRemoveOverlay();
    window._dataStrikePendingCount = null;

    _setAbilityMode(false);
    STATE.classActiveChoice = 'active1';

    // Refund the cooldown — it was started in executeActiveAbility before the modal opened
    const cd = cooldownState['active1'];
    if (cd.interval) { clearInterval(cd.interval); cd.interval = null; }
    cd.remaining = 0;

    buildClassHUD();
    showToast(LANG === 'de' ? '⚔️ Abgebrochen.' : '⚔️ Cancelled.');
}



// Diagonal Strike


// _executeDiagonalStrike — resolves cells along diagonal directions through (row, col).
// Respects passive tree nodes: diagonally_wrong, random_diagonal,
// diagonal_witch, god_of_statistics.
function _executeDiagonalStrike(row, col, diagonalCount) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const affected = [];

    _diagonalStrikeWalkDiagonals(row, col, diagonalCount, rows, cols, sol, affected);
    _diagonalStrikeProcessCell(row, col, sol, affected);

    if (diagonalCount >= 4) {
        _diagonalStrikeProcessRow(row, cols, sol, affected);
        _diagonalStrikeProcessCol(col, rows, sol, affected);
    }

    // diagonally_wrong: mark incorrectly-filled cells along the strike path
    if (ptHasSkill('diagonally_wrong')) {
        _diagonalStrikeMarkWrong(affected, sol);
    }

    _playDiagonalSlashEffect(row, col, diagonalCount);
    _applyCellEffect(affected, 'reveal');

    const diagRevealed = _filterRevealedIds(affected, sol).length;
    if (diagRevealed > 0) trackAchStat('tilesRevealed', diagRevealed);

    showToast(`⚔️ Diagonal Strike! ${affected.length} cell(s) affected.`);

    // Repeat chances — each node is an independent 25% roll
    // god_of_statistics gives 50% effective = two independent 25% rolls
    let repeatChances = 0;
    if (ptHasSkill('random_diagonal')) repeatChances++;
    if (ptHasSkill('diagonal_witch')) repeatChances++;
    if (ptHasSkill('god_of_statistics')) repeatChances += 2;
    for (let i = 0; i < repeatChances; i++) {
        if (Math.random() < 0.25) {
            _diagonalStrikeBonusRepeat(diagonalCount, rows, cols, sol);
        }
    }

    checkWin();
}

// _diagonalStrikeWalkDiagonals — walks all diagonal directions and resolves each cell.
function _diagonalStrikeWalkDiagonals(row, col, diagonalCount, rows, cols, sol, affected) {
    const allDirs = [
        [[1, 1], [-1, -1]],   // main diagonal ↘↖
        [[1, -1], [-1, 1]],   // anti-diagonal ↙↗
    ];
    const dirs = allDirs.slice(0, Math.min(diagonalCount, 2));

    dirs.forEach(pair => {
        pair.forEach(([dr, dc]) => {
            let r = row + dr, c = col + dc;
            while (r >= 0 && r < rows && c >= 0 && c < cols) {
                const id = _resolveCell(r, c, sol);
                if (id) affected.push(id);
                r += dr; c += dc;
            }
        });
    });
}

// _diagonalStrikeProcessCell — resolves the originally clicked cell itself.
function _diagonalStrikeProcessCell(row, col, sol, affected) {
    const id = _resolveCell(row, col, sol);
    if (id) affected.push(id);
}

// _diagonalStrikeProcessRow — resolves all cells in the given row (rank 3 bonus).
function _diagonalStrikeProcessRow(row, cols, sol, affected) {
    for (let c = 0; c < cols; c++) {
        const id = _resolveCell(row, c, sol);
        if (id) affected.push(id);
    }
}


// _diagonalStrikeProcessCol — resolves all cells in the given column (rank 3 bonus).
function _diagonalStrikeProcessCol(col, rows, sol, affected) {
    for (let r = 0; r < rows; r++) {
        const id = _resolveCell(r, col, sol);
        if (id) affected.push(id);
    }
}



// _diagonalStrikeMarkWrong — marks wrongly-filled cells (user filled but should be empty)
// along the already-computed affected path. Used by the 'diagonally_wrong' node.
function _diagonalStrikeMarkWrong(affected, sol) {
    affected.forEach(id => {
        const [, r, c] = id.split('-').map(Number);
        if (sol[r][c] === 0 && userGrid[r][c] === 1) {
            userGrid[r][c] = 3; // wrong-mark state
            renderCell(r, c);
        }
    });
}

// _diagonalStrikeBonusRepeat — fires a Diagonal Strike on a random unrevealed filled cell.
// Used by random_diagonal / diagonal_witch / god_of_statistics.
function _diagonalStrikeBonusRepeat(diagonalCount, rows, cols, sol) {
    const candidates = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 1 && !revealedGrid[r][c]) candidates.push([r, c]);
        }
    }
    if (!candidates.length) return;
    const [r, c] = candidates[Math.floor(Math.random() * candidates.length)];

    const bonusAffected = [];
    _diagonalStrikeWalkDiagonals(r, c, diagonalCount, rows, cols, sol, bonusAffected);
    _diagonalStrikeProcessCell(r, c, sol, bonusAffected);
    if (diagonalCount >= 4) {
        _diagonalStrikeProcessRow(r, cols, sol, bonusAffected);
        _diagonalStrikeProcessCol(c, rows, sol, bonusAffected);
    }

    if (ptHasSkill('diagonally_wrong')) _diagonalStrikeMarkWrong(bonusAffected, sol);

    _applyCellEffect(bonusAffected, 'reveal');
    showToast(`⚔️ Bonus Strike! ${bonusAffected.length} more cell(s)!`);
}






//------------------------------------------------------------------------
//----------------------MATHMAGICIAN SKILLS-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Arcane Reveal

// _executeArcaneReveal — reveals correct/wrong state for all cells within
//   'radius' steps of (row, col), including diagonal. Works at borders.
function _executeArcaneReveal(row, col, radius) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // god_of_math increases radius by 1
    const effectiveRadius = radius + (ptHasSkill('god_of_math') ? 1 : 0);

    const affected = _arcaneRevealCollectCells(row, col, effectiveRadius, rows, cols, sol);

    // arcane_exposure: also mark empty cells in the area as ✕
    if (ptHasSkill('arcane_exposure')) {
        _filterMarkedIds(affected, sol).forEach(id => {
            const [, r, c] = id.split('-').map(Number);
            if (userGrid[r][c] === 0) {
                userGrid[r][c] = 2;
                renderCell(r, c);
            }
        });
    }

    _applyCellEffect(_filterRevealedIds(affected, sol), 'reveal');
    _applyCellEffect(_filterMarkedIds(affected, sol), 'mark');

    const revealedIds = _filterRevealedIds(affected, sol);
    if (revealedIds.length > 0) trackAchStat('tilesRevealed', revealedIds.length);

    // arcane_echo and resonant_reveal: each is an independent 25% chance at 1 bonus reveal
    ['arcane_echo', 'resonant_reveal'].forEach(skill => {
        if (ptHasSkill(skill) && Math.random() < 0.25) {
            _arcaneRevealBonusCell(sol, rows, cols);
        }
    });

    checkWin();
    _spawnArcaneSparkles(revealedIds);
}

// _arcaneRevealCollectCells — iterates the radius area and resolves each cell.
//   Returns the list of affected cell id strings.
function _arcaneRevealCollectCells(row, col, radius, rows, cols, sol) {
    const affected = [];
    for (let r = Math.max(0, row - radius); r <= Math.min(rows - 1, row + radius); r++) {
        for (let c = Math.max(0, col - radius); c <= Math.min(cols - 1, col + radius); c++) {
            const id = _resolveCell(r, c, sol);
            if (id) affected.push(id);
        }
    }
    return affected;
}


// _arcaneRevealBonusCell — reveals 1 random unrevealed filled cell (used by arcane_echo / resonant_reveal)
function _arcaneRevealBonusCell(sol, rows, cols) {
    const candidates = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 1 && !revealedGrid[r][c] && userGrid[r][c] !== 1) {
                candidates.push([r, c]);
            }
        }
    }
    if (!candidates.length) return;
    const [r, c] = candidates[Math.floor(Math.random() * candidates.length)];
    revealedGrid[r][c] = true;
    userGrid[r][c] = 1;
    renderCell(r, c);
    updClues(r, c);
    trackAchStat('tilesRevealed', 1);
    showToast('🔮 Arcane Echo! Bonus cell revealed!');
}







// Absolute Zero

// _executeArcaneFreeze — freezes the timer for durationMs.
//   During the window, wrong fills cost zero time (window._freezeActive flag).
function _executeArcaneFreeze(durationMs) {
    // prolonged_frost and deep_freeze each add 500ms
    let effectiveDuration = durationMs;
    if (ptHasSkill('prolonged_frost')) effectiveDuration += 500;
    if (ptHasSkill('deep_freeze')) effectiveDuration += 500;

    timerFrozen = true;
    window._freezeActive = true;
    window._freezeCorrFills = 0;   // for frozen_resilience tracking
    _startBlizzardEffect(effectiveDuration);
    updTimer();

    const secs = Math.ceil(effectiveDuration / 1000);
    showToast(`🔮 Absolute Zero! ${secs}s!`);

    const tick = _arcaneFreezeStartCountdown(secs);
    setTimeout(() => _arcaneFreezeEnd(tick), effectiveDuration);
}

// _arcaneFreezeStartCountdown — ticks the freeze timer display every second.
//   Returns the interval handle so it can be cleared on expiry.
function _arcaneFreezeStartCountdown(totalSecs) {
    let remaining = totalSecs;
    return setInterval(() => {
        remaining--;
        const el = document.getElementById('timer-val');
        if (el) el.textContent = `❄️ ${remaining}s`;
        if (remaining <= 0) clearInterval(tick); // safety: also cleared in _arcaneFreezeEnd
    }, 1000);
}

// _arcaneFreezeEnd — restores normal timer state after the freeze expires.
function _arcaneFreezeEnd(tick) {
    timerFrozen = false;
    window._freezeActive = false;
    clearInterval(tick);
    updTimer();
    showToast('🔮 Absolute Zero ended!');
    buildClassHUD();
}






//------------------------------------------------------------------------
//-----------------------PROBABILIST------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Precision Mark


// _executePrecisionMark — marks all empty cells in the target row+col
//   plus 'extraLines' additional adjacent rows and columns.
function _executePrecisionMark(row, col, extraLines) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    const { targetRows, targetCols } = _precisionMarkBuildTargets(row, col, extraLines, rows, cols);
    const affected = _precisionMarkApply(targetRows, targetCols, rows, cols, sol);

    // probabilistic_sweep, expanded_inference, god_of_probabilities:
    // each is an independent 25% chance to mark one additional random row or column
    const sweepSkills = ['probabilistic_sweep', 'expanded_inference'];
    if (ptHasSkill('god_of_probabilities')) sweepSkills.push('god_of_probabilities');
    sweepSkills.forEach(skill => {
        if (ptHasSkill(skill) && Math.random() < 0.25) {
            _precisionMarkBonusLine(rows, cols, sol, affected);
        }
    });

    _playPrecisionMarkEffect(row, col);
    _applyCellEffect(affected, 'mark');
    showToast(`🎯 ${affected.length} ${LANG === 'de' ? 'Zellen markiert!' : 'cells marked!'}`);

    // momentum_of_certainty: +3 min if a cell in the affected area is correctly filled within 10s
    if (ptHasSkill('momentum_of_certainty') && affected.length > 0) {
        _precisionMarkStartMomentumWindow(affected);
    }
}

// _precisionMarkBuildTargets — computes the set of rows and columns to mark.
function _precisionMarkBuildTargets(row, col, extraLines, rows, cols) {
    const targetRows = new Set([row]);
    const targetCols = new Set([col]);
    for (let i = 1; i <= extraLines; i++) {
        if (row - i >= 0) targetRows.add(row - i);
        if (row + i < rows) targetRows.add(row + i);
        if (col - i >= 0) targetCols.add(col - i);
        if (col + i < cols) targetCols.add(col + i);
    }
    return { targetRows, targetCols };
}

// _precisionMarkApply — marks empty solution cells for all target rows and columns.
//   Returns the list of affected cell id strings.
function _precisionMarkApply(targetRows, targetCols, rows, cols, sol) {
    const affected = [];
    targetRows.forEach(r => {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 0 && userGrid[r][c] === 0) {
                userGrid[r][c] = 2;
                renderCell(r, c);
                affected.push(`g-${r}-${c}`);
            }
        }
    });
    targetCols.forEach(c => {
        for (let r = 0; r < rows; r++) {
            if (sol[r][c] === 0 && userGrid[r][c] === 0) {
                userGrid[r][c] = 2;
                renderCell(r, c);
                affected.push(`g-${r}-${c}`);
            }
        }
    });
    return affected;
}


// _precisionMarkBonusLine — marks all empty cells in a random unsolved row or column.
function _precisionMarkBonusLine(rows, cols, sol, affected) {
    // Collect rows and cols that still have unmarked empty cells
    const unsolvedRows = [], unsolvedCols = [];
    for (let r = 0; r < rows; r++) {
        if ([...Array(cols).keys()].some(c => sol[r][c] === 0 && userGrid[r][c] === 0))
            unsolvedRows.push(r);
    }
    for (let c = 0; c < cols; c++) {
        if ([...Array(rows).keys()].some(r => sol[r][c] === 0 && userGrid[r][c] === 0))
            unsolvedCols.push(c);
    }
    const pool = [...unsolvedRows.map(r => ({ type: 'row', idx: r })),
    ...unsolvedCols.map(c => ({ type: 'col', idx: c }))];
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick.type === 'row') {
        for (let c = 0; c < cols; c++) {
            if (sol[pick.idx][c] === 0 && userGrid[pick.idx][c] === 0) {
                userGrid[pick.idx][c] = 2;
                renderCell(pick.idx, c);
                affected.push(`g-${pick.idx}-${c}`);
            }
        }
    } else {
        for (let r = 0; r < rows; r++) {
            if (sol[r][pick.idx] === 0 && userGrid[r][pick.idx] === 0) {
                userGrid[r][pick.idx] = 2;
                renderCell(r, pick.idx);
                affected.push(`g-${r}-${pick.idx}`);
            }
        }
    }
    showToast(`🎯 ${LANG === 'de' ? 'Bonus-Linie markiert!' : 'Bonus line marked!'}`);
}

// _precisionMarkStartMomentumWindow — sets a 10s window where the next correct fill
// in the affected cells grants +3 minutes. Clears itself after the window expires.
function _precisionMarkStartMomentumWindow(affected) {
    const affectedSet = new Set(affected);
    window._pmMomentumActive = true;
    window._pmMomentumSet = affectedSet;
    window._pmMomentumTimeout = setTimeout(() => {
        window._pmMomentumActive = false;
        window._pmMomentumSet = null;
    }, 10000);
}



// Field Scan

// _executeFieldScan — temporarily reveals a random region of the grid for durationMs.
//   Cells revert to their actual state after the timer expires.
function _executeFieldScan(scanSize, durationMs) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // wider_lens and panoramic_view each add 1 to scan size
    let effectiveSize = scanSize;
    if (ptHasSkill('wider_lens')) effectiveSize += 1;
    if (ptHasSkill('panoramic_view')) effectiveSize += 1;

    // photographic_memory adds 5s to the scan duration
    let effectiveDuration = durationMs;
    if (ptHasSkill('photographic_memory')) effectiveDuration += 5000;

    const { startRow, startCol } = _fieldScanPickOrigin(effectiveSize, rows, cols);
    const { scanned, prevStates } = _fieldScanRevealRegion(startRow, startCol, effectiveSize, rows, cols, sol);

    _playScanBeamEffect(startRow, startCol, effectiveSize, effectiveDuration);
    showToast(`🎯 Field Scan! Memorize the ${effectiveSize}×${effectiveSize} region!`);
    _fieldScanCheckBigScanAchievement(prevStates, sol);

    setTimeout(() => _fieldScanRestore(scanned, prevStates), effectiveDuration);
}

// _fieldScanPickOrigin — picks a random top-left corner that keeps the region in bounds.
function _fieldScanPickOrigin(scanSize, rows, cols) {
    const maxRow = Math.max(0, rows - scanSize);
    const maxCol = Math.max(0, cols - scanSize);
    return {
        startRow: Math.floor(Math.random() * (maxRow + 1)),
        startCol: Math.floor(Math.random() * (maxCol + 1)),
    };
}

// _fieldScanRevealRegion — applies temporary scan classes to unrevealed cells in the region.
//   Returns the scanned elements and previous states for later restoration.
function _fieldScanRevealRegion(startRow, startCol, scanSize, rows, cols, sol) {
    const scanned = [];
    const prevStates = [];

    for (let r = startRow; r < Math.min(startRow + scanSize, rows); r++) {
        for (let c = startCol; c < Math.min(startCol + scanSize, cols); c++) {
            if (userGrid[r][c] === 1 || revealedGrid[r][c]) continue;

            const el = document.getElementById(`g-${r}-${c}`);
            if (!el) continue;

            prevStates.push({ r, c });
            el.classList.remove('filled', 'marked', 'wrong-mark', 'revealed', 'questioned');
            el.classList.add(sol[r][c] === 1 ? 'filled' : 'marked', 'scan-reveal');
            scanned.push(el);
        }
    }

    return { scanned, prevStates };
}

// _fieldScanCheckBigScanAchievement — tracks the achievement for scanning ≥20 correct cells.
function _fieldScanCheckBigScanAchievement(prevStates, sol) {
    const correctInScan = prevStates.filter(({ r, c }) => sol[r][c] === 1).length;
    if (correctInScan >= 20) trackAchStat('probabilistBigScan');
}

// _fieldScanRestore — restores all scanned cells to their real state after the timer expires.
function _fieldScanRestore(scanned, prevStates) {
    prevStates.forEach(({ r, c }) => {
        // god_of_probabilities: if the cell was filled during the scan, keep it revealed
        if (ptHasSkill('god_of_probabilities') && userGrid[r][c] === 1 && !revealedGrid[r][c]) {
            revealedGrid[r][c] = true;
            updClues(r, c);
            trackAchStat('tilesRevealed', 1);
            // don't re-render to default; leave as filled
        } else {
            renderCell(r, c);
        }
    });
    scanned.forEach(el => el.classList.remove('scan-reveal'));
    showToast('🎯 Scan faded — play from memory!');
    buildClassHUD();
}








//------------------------------------------------------------------------
//---------------------------CLASS PASSIVES-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------




// _bayesianRevealOneCell — reveals 1 random unrevealed filled cell at level start.
// Used by confirmed_hypothesis and god_of_probabilities.
function _bayesianRevealOneCell() {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const candidates = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 1 && !revealedGrid[r][c] && userGrid[r][c] !== 1) {
                candidates.push([r, c]);
            }
        }
    }
    if (!candidates.length) return;
    const [r, c] = candidates[Math.floor(Math.random() * candidates.length)];
    revealedGrid[r][c] = true;
    userGrid[r][c] = 1;
    renderCell(r, c);
    updClues(r, c);
    trackAchStat('tilesRevealed', 1);
}






// applyClassPassiveOnLevelStart — called at the start of each level
//   to apply the passive effect before play begins.
function applyClassPassiveOnLevelStart() {
    correctFillStreak = 0;
    nextPenaltyHalved = false;
    window._momentumThisLevel = 0;
    window._dataStrikeUsesThisLevel = 0;
    window._veiled_cursedUsed = false;
    window._goldenClockActive = false;
    window._goldenClockMistakesLeft = null;
    window._cursedImmune = false;
    window._shieldExtraCharges = 0;

    if (!STATE.playerClass) return;
    const effect = _getPassiveEffect();

    if (STATE.playerClass === 'mathmagician') {
        let freeMistakes = effect.freeMistakes || 0;
        if (ptHasSkill('reinforced_shield')) freeMistakes += 1;
        if (ptHasSkill('fortified_shield')) freeMistakes += 1;
        window._classFreeMistakes = freeMistakes;
    }

    if (STATE.playerClass === 'probabilist' && effect.autoMarkCount) {
        setTimeout(() => {
            let markCount = effect.autoMarkCount;
            if (ptHasSkill('prior_knowledge')) markCount += 2;
            if (ptHasSkill('updated_beliefs')) markCount += 2;
            if (ptHasSkill('posterior_insight')) markCount += 2;
            if (ptHasSkill('convergent_evidence')) markCount += 2;
            markWrongTiles(markCount);

            // confirmed_hypothesis and god_of_probabilities each reveal 1 correct filled cell
            let bonusReveals = 0;
            if (ptHasSkill('confirmed_hypothesis')) bonusReveals += 1;
            if (ptHasSkill('god_of_probabilities')) bonusReveals += 1;
            for (let i = 0; i < bonusReveals; i++) {
                _bayesianRevealOneCell();
            }
        }, 300);
    }
}

// getClassPenaltyMultiplier — returns the penalty time multiplier for this mistake.
//   Called from applyPenalty() in input.js.
//   Returns 0.0 if the Mathmagician has free mistakes remaining (no penalty).
function getClassPenaltyMultiplier() {
    if (!STATE.playerClass) return 1.0;

    if (STATE.playerClass === 'mathmagician' && window._classFreeMistakes > 0) {
        window._classFreeMistakes--;
        absorbedMistakes++;
        trackAchStat('mistakesAbsorbed');

        // Bonus time for absorbed mistakes
        let bonus = 0;
        if (ptHasSkill('calculated_error') && Math.random() < 0.50) bonus += 5;
        if (ptHasSkill('error_dividend') && Math.random() < 0.25) bonus += 3;
        if (ptHasSkill('lucky_lapse') && Math.random() < 0.25) bonus += 3;

        // god_of_math doubles the absorbed-mistake timer bonuses
        if (ptHasSkill('god_of_math') && bonus > 0) bonus *= 2;

        if (bonus > 0) {
            timerSecs = Math.min(timerSecs + bonus, 3600);
            updTimer();
            showToast(`🔮 Absorbed! +${bonus}s`);
            trackAchStat('timeAdded', bonus);
        }

        return 0.0;
    }

    return 1.0;
}

// onCorrectFill — called from ac() in mouse-button-handlers.js when a correct cell is filled.
//   Tracks the Statistician fill streak and awards bonus time on threshold.
function onCorrectFill(row, col) {
    if (STATE.playerClass !== 'statistician') return;
    const effect = _getPassiveEffect();

    // frozen_resilience: every 5 correct fills during Absolute Zero → +1 free mistake
    // god_of_math: each correct fill during AZ reduces Arcane Reveal cooldown by 1s
    if (STATE.playerClass === 'mathmagician' && window._freezeActive) {
        if (ptHasSkill('frozen_resilience')) {
            window._freezeCorrFills = (window._freezeCorrFills || 0) + 1;
            if (window._freezeCorrFills % 5 === 0) {
                window._classFreeMistakes = (window._classFreeMistakes || 0) + 1;
                showToast('🔮 Frozen Resilience! +1 shield charge!');
            }
        }
        if (ptHasSkill('god_of_math')) {
            const cd = cooldownState['active1'];
            if (cd.remaining > 0) {
                cd.remaining = Math.max(0, cd.remaining - 1);
                _patchCooldownButton('active1');
            }
        }
    }


    // momentum_of_certainty: +3 min if this fill is in the Precision Mark window
    if (STATE.playerClass === 'probabilist' && window._pmMomentumActive && window._pmMomentumSet) {
        const id = `g-${arguments[0]}-${arguments[1]}`; // see note below
        if (window._pmMomentumSet.has(id)) {
            window._pmMomentumActive = false;
            clearTimeout(window._pmMomentumTimeout);
            window._pmMomentumSet = null;
            timerSecs = Math.min(timerSecs + 180, 3600);
            updTimer();
            showToast(LANG === 'de' ? '🎯 Schwung der Gewissheit! +3 Min!' : '🎯 Momentum of Certainty! +3 min!');
            trackAchStat('timeAdded', 180);
        }
    }



    correctFillStreak++;
    if (correctFillStreak >= effect.streakForBonus) {
        _statisticianTriggerMomentum(effect.bonusSeconds);
    }
}

// _statisticianTriggerMomentum — awards bonus time and tracks momentum achievements.
// Respects passive tree nodes: chain_reaction, precise_momentum,
// exponential_growth, god_of_statistics.
function _statisticianTriggerMomentum(bonusSeconds) {
    correctFillStreak = 0;

    let bonus = bonusSeconds;
    if (ptHasSkill('chain_reaction')) bonus += 2;
    if (ptHasSkill('precise_momentum')) bonus += 3;

    // exponential_growth: each prior Momentum this level adds +1s
    if (ptHasSkill('exponential_growth')) {
        bonus += (window._momentumThisLevel || 0);
    }

    // god_of_statistics doubles the total Momentum bonus
    if (ptHasSkill('god_of_statistics')) bonus *= 2;

    timerSecs = Math.min(timerSecs + bonus, 3600);
    updTimer();
    showToast(`⚔️ Momentum! +${bonus}s`);
    trackAchStat('timeAdded', bonus);
    trackAchStat('momentumTriggered');

    window._momentumThisLevel = (window._momentumThisLevel || 0) + 1;
    if (window._momentumThisLevel === 3) trackAchStat('statistician3MomentumOneLevel');
}

// onMistake — called on any wrong fill.
// Resets or reduces the Statistician streak depending on passive tree nodes.
function onMistake() {
    if (STATE.playerClass === 'statistician') {
        let reduction = 0;
        if (ptHasSkill('learning_from_mistakes')) reduction += 3;
        if (ptHasSkill('mistakes_no_matter')) reduction += 3;
        if (reduction > 0) {
            correctFillStreak = Math.max(0, correctFillStreak - reduction);
            return;
        }
    }
    correctFillStreak = 0;
}





//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------






