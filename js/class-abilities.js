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

    const cdSeconds = def[activeKey].cooldownSeconds;
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
function _dataStrikeResolve(type) {
    _dataStrikeRemoveOverlay();

    const count = window._dataStrikePendingCount || 1;
    window._dataStrikePendingCount = null;

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
//   At rank 3 (diagonalCount >= 4), also covers the full row and column.
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

    _playDiagonalSlashEffect(row, col, diagonalCount);
    _applyCellEffect(affected, 'reveal');

    const diagRevealed = _filterRevealedIds(affected, sol).length;
    if (diagRevealed > 0) trackAchStat('tilesRevealed', diagRevealed);

    showToast(`⚔️ Diagonal Strike! ${affected.length} cell(s) affected.`);
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

    const affected = _arcaneRevealCollectCells(row, col, radius, rows, cols, sol);

    _applyCellEffect(_filterRevealedIds(affected, sol), 'reveal');
    _applyCellEffect(_filterMarkedIds(affected, sol), 'mark');

    const revealedIds = _filterRevealedIds(affected, sol);
    if (revealedIds.length > 0) trackAchStat('tilesRevealed', revealedIds.length);

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


// Absolute Zero

// _executeArcaneFreeze — freezes the timer for durationMs.
//   During the window, wrong fills cost zero time (window._freezeActive flag).
function _executeArcaneFreeze(durationMs) {
    timerFrozen = true;
    window._freezeActive = true;
    _startBlizzardEffect(durationMs);
    updTimer();

    const secs = Math.ceil(durationMs / 1000);
    showToast(`🔮 Absolute Zero! ${secs}s!`);

    const tick = _arcaneFreezeStartCountdown(secs);

    setTimeout(() => _arcaneFreezeEnd(tick), durationMs);
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

    _playPrecisionMarkEffect(row, col);
    _applyCellEffect(affected, 'mark');
    showToast(`🎯 ${affected.length} ${LANG === 'de' ? 'Zellen markiert!' : 'cells marked!'}`);
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


// Field Scan

// _executeFieldScan — temporarily reveals a random region of the grid for durationMs.
//   Cells revert to their actual state after the timer expires.
function _executeFieldScan(scanSize, durationMs) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    const { startRow, startCol } = _fieldScanPickOrigin(scanSize, rows, cols);
    const { scanned, prevStates } = _fieldScanRevealRegion(startRow, startCol, scanSize, rows, cols, sol);

    _playScanBeamEffect(startRow, startCol, scanSize, durationMs);
    showToast(`🎯 Field Scan! Memorize the ${scanSize}×${scanSize} region!`);
    _fieldScanCheckBigScanAchievement(prevStates, sol);

    setTimeout(() => _fieldScanRestore(scanned, prevStates), durationMs);
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
    prevStates.forEach(({ r, c }) => renderCell(r, c));
    scanned.forEach(el => el.classList.remove('scan-reveal'));
    showToast('🎯 Scan faded — play from memory!');
    buildClassHUD();
}








//------------------------------------------------------------------------
//---------------------------CLASS PASSIVES-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// applyClassPassiveOnLevelStart — called at the start of each level
//   to apply the passive effect before play begins.
function applyClassPassiveOnLevelStart() {
    correctFillStreak = 0;
    nextPenaltyHalved = false;
    window._momentumThisLevel = 0;

    if (!STATE.playerClass) return;
    const effect = _getPassiveEffect();

    if (STATE.playerClass === 'mathmagician') {
        window._classFreeMistakes = effect.freeMistakes || 0;
    }

    if (STATE.playerClass === 'probabilist' && effect.autoMarkCount) {
        // Delay until the grid DOM is ready
        setTimeout(() => markWrongTiles(effect.autoMarkCount), 300);
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
        return 0.0;
    }

    return 1.0;
}

// onCorrectFill — called from ac() in input.js when a correct cell is filled.
//   Tracks the Statistician fill streak and awards bonus time on threshold.
function onCorrectFill() {
    if (STATE.playerClass !== 'statistician') return;
    const effect = _getPassiveEffect();

    correctFillStreak++;
    if (correctFillStreak >= effect.streakForBonus) {
        _statisticianTriggerMomentum(effect.bonusSeconds);
    }
}

// _statisticianTriggerMomentum — awards bonus time and tracks momentum achievements.
function _statisticianTriggerMomentum(bonusSeconds) {
    correctFillStreak = 0;
    timerSecs = Math.min(timerSecs + bonusSeconds, 3600);
    updTimer();
    showToast(`⚔️ Momentum! +${bonusSeconds}s`);
    trackAchStat('timeAdded', bonusSeconds);
    trackAchStat('momentumTriggered');

    window._momentumThisLevel = (window._momentumThisLevel || 0) + 1;
    if (window._momentumThisLevel === 3) trackAchStat('statistician3MomentumOneLevel');
}

// onMistake — called on any wrong fill; resets the Statistician streak.
function onMistake() {
    correctFillStreak = 0;
}





//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------






