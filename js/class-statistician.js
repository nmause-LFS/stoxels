//------------------------------------------------------------------------
//-----------------STATISTICIAN-------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// _solveLinesCapped — like solveRows/solveCols but reveals at most `cap` cells per line.
function _solveLinesCapped(type, count, cap) {
    if (!cur) return 0;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    let solved = 0;

    if (type === 'rows') {
        // Collect unsolved rows (rows with any unrevealed filled cell)
        const candidates = [];
        for (let r = 0; r < rows; r++) {
            const unrevealed = [];
            for (let c = 0; c < cols; c++) {
                if (sol[r][c] === 1 && !revealedGrid[r][c] && userGrid[r][c] !== 1) unrevealed.push(c);
            }
            if (unrevealed.length > 0) candidates.push({ r, unrevealed });
        }
        // Shuffle and pick `count` rows
        candidates.sort(() => Math.random() - 0.5);
        const picked = candidates.slice(0, count);
        picked.forEach(({ r, unrevealed }) => {
            // Shuffle unrevealed cells and reveal up to `cap`
            unrevealed.sort(() => Math.random() - 0.5);
            unrevealed.slice(0, cap).forEach(c => {
                revealedGrid[r][c] = true;
                userGrid[r][c] = 1;
                renderCell(r, c);
                updClues(r, c);
            });
            solved++;
        });
    } else {
        // Collect unsolved cols
        const candidates = [];
        for (let c = 0; c < cols; c++) {
            const unrevealed = [];
            for (let r = 0; r < rows; r++) {
                if (sol[r][c] === 1 && !revealedGrid[r][c] && userGrid[r][c] !== 1) unrevealed.push(r);
            }
            if (unrevealed.length > 0) candidates.push({ c, unrevealed });
        }
        candidates.sort(() => Math.random() - 0.5);
        const picked = candidates.slice(0, count);
        picked.forEach(({ c, unrevealed }) => {
            unrevealed.sort(() => Math.random() - 0.5);
            unrevealed.slice(0, cap).forEach(r => {
                revealedGrid[r][c] = true;
                userGrid[r][c] = 1;
                renderCell(r, c);
                updClues(r, c);
            });
            solved++;
        });
    }

    return solved;
}















// Data Strike


// _executeDataStrike — shows a choice popup so the player can pick rows or columns,
//   then solves N random unsolved lines of that type.
function _executeDataStrike(count, revealCap) {
    _dataStrikeShowOverlay(count);
    window._dataStrikePendingCount = count;
    window._dataStrikeRevealCap = revealCap || 5;
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

    Audio_Manager.playSFX('dataStrike');
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
    if (ptHasSkill('advanced_data_strike')) extraChances++;
    // god_of_statistics contributes an effective 50% (= two independent 25% rolls)
    if (ptHasSkill('god_of_statistics')) extraChances += 2;
    for (let i = 0; i < extraChances; i++) {
        if (Math.random() < 0.25) count++;
        _playDivineProcEffect();
    }

    let cap = window._dataStrikeRevealCap || 5;
    if (ptHasSkill('monte_carlo')) cap += 1;
    if (ptHasSkill('correlation_matrix')) cap += 1;
    window._dataStrikeRevealCap = null;

    const solved = _solveLinesCapped(type, count, cap);
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


// _executeDiagonalStrike — resolves cells along diagonal directions through (row, col),
// limited to 3 steps per direction.
// Respects passive tree nodes: diagonally_wrong, random_diagonal,
// diagonal_witch, god_of_statistics.
// random_diagonal / diagonal_witch: each +1 to reveal cap (and mark cap if diagonally_wrong).
// god_of_statistics: +2 to reveal cap (and mark cap if diagonally_wrong).

function _executeDiagonalStrike(row, col, diagonalCount, revealCap) {
    Audio_Manager.playSFX('diagonalStrike');

    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const affected = [];

    // Diagonal walk is limited to 3 steps in each direction
    const MAX_STEPS = 3;

    _diagonalStrikeWalkDiagonals(row, col, diagonalCount, rows, cols, sol, affected, MAX_STEPS);
    _diagonalStrikeProcessCell(row, col, sol, affected);

    if (diagonalCount >= 4) {
        _diagonalStrikeProcessRow(row, cols, sol, affected);
        _diagonalStrikeProcessCol(col, rows, sol, affected);
    }

    // Compute reveal cap: base (from ability def) + passive bonuses
    let REVEAL_CAP = revealCap || 3;
    if (ptHasSkill('random_diagonal')) REVEAL_CAP += 1;
    if (ptHasSkill('diagonal_witch')) REVEAL_CAP += 1;
    if (ptHasSkill('god_of_statistics')) REVEAL_CAP += 2;

    // Compute mark cap (only relevant when diagonally_wrong is active)
    let MARK_CAP = 3;
    if (ptHasSkill('random_diagonal')) MARK_CAP += 1;
    if (ptHasSkill('diagonal_witch')) MARK_CAP += 1;
    if (ptHasSkill('god_of_statistics')) MARK_CAP += 2;

    // Cap reveals: keep only up to REVEAL_CAP filled-cell reveals, re-hide the rest
    const revealedIds = _filterRevealedIds(affected, sol);
    if (revealedIds.length > REVEAL_CAP) {
        // Un-reveal the excess (shuffle so kept cells are random, not just the first found)
        revealedIds.sort(() => Math.random() - 0.5);
        revealedIds.slice(REVEAL_CAP).forEach(id => {
            const [, r, c] = id.split('-').map(Number);
            revealedGrid[r][c] = false;
            userGrid[r][c] = 0;
            renderCell(r, c);
            updClues(r, c);
        });
        // Rebuild affected to only include the capped reveals + any marks
        const keptReveals = new Set(revealedIds.slice(0, REVEAL_CAP));
        const markedIds = new Set(_filterMarkedIds(affected, sol));
        affected.length = 0;
        keptReveals.forEach(id => affected.push(id));
        markedIds.forEach(id => affected.push(id));
    }

    // Cap marks: keep only up to MARK_CAP empty-cell marks, un-mark the rest
    if (ptHasSkill('diagonally_wrong')) {
        const markedIds = _filterMarkedIds(affected, sol);
        if (markedIds.length > MARK_CAP) {
            markedIds.sort(() => Math.random() - 0.5);
            markedIds.slice(MARK_CAP).forEach(id => {
                const [, r, c] = id.split('-').map(Number);
                if (userGrid[r][c] === 2) {
                    userGrid[r][c] = 0;
                    renderCell(r, c);
                    questStat_classMarkUsed(1);
                }
                const idx = affected.indexOf(id);
                if (idx !== -1) affected.splice(idx, 1);
            });
        }
    }

    // diagonally_wrong: mark incorrectly-filled cells along the strike path
    if (ptHasSkill('diagonally_wrong')) {
        _diagonalStrikeMarkWrong(affected, sol);
    }

    _playDiagonalSlashEffect(row, col, diagonalCount);
    _applyCellEffect(affected, 'reveal');
    if (ptHasSkill('adjacency_matrix')) _adjacencyMatrixRefreshAll();

    const diagRevealed = _filterRevealedIds(affected, sol).length;
    if (diagRevealed > 0) trackAchStat('tilesRevealed', diagRevealed);

    showToast(`⚔️ Diagonal Strike! ${diagRevealed} cell(s) revealed.`);

    // god_of_statistics: 50% chance to repeat the strike on a random cell
    if (ptHasSkill('god_of_statistics')) {
        for (let i = 0; i < 1; i++) {
            if (Math.random() < 0.50) {
                _diagonalStrikeBonusRepeat(diagonalCount, REVEAL_CAP, MARK_CAP, rows, cols, sol);
                Audio_Manager.playSFX('diagonalStrikeRepeat'); 
                _playDivineProcEffect();
            }
        }
    }

    questStat_classRevealUsed(diagRevealed);
    updateQuestStats('classAbilityUsedThisLevel', {});

    checkWin();
}




// _diagonalStrikeWalkDiagonals — walks all diagonal directions and resolves each cell,
// stopping after maxSteps steps per direction.
function _diagonalStrikeWalkDiagonals(row, col, diagonalCount, rows, cols, sol, affected, maxSteps) {
    const allDirs = [
        [[1, 1], [-1, -1]],
        [[1, -1], [-1, 1]],
    ];
    const dirs = allDirs.slice(0, Math.min(diagonalCount, 2));
    const resolver = ptHasSkill('diagonally_wrong') ? _resolveCell : _revealFilledCell;
    const limit = maxSteps || 3;

    dirs.forEach(pair => {
        pair.forEach(([dr, dc]) => {
            let r = row + dr, c = col + dc;
            let steps = 0;
            while (r >= 0 && r < rows && c >= 0 && c < cols && steps < limit) {
                const id = resolver(r, c, sol);
                if (id) affected.push(id);
                r += dr; c += dc;
                steps++;
            }
        });
    });
}

// _diagonalStrikeProcessCell — resolves the originally clicked cell itself.
function _diagonalStrikeProcessCell(row, col, sol, affected) {
    const resolver = ptHasSkill('diagonally_wrong') ? _resolveCell : _revealFilledCell;
    const id = resolver(row, col, sol);
    if (id) affected.push(id);
}

function _diagonalStrikeProcessRow(row, cols, sol, affected) {
    const resolver = ptHasSkill('diagonally_wrong') ? _resolveCell : _revealFilledCell;
    for (let c = 0; c < cols; c++) {
        const id = resolver(row, c, sol);
        if (id) affected.push(id);
    }
}

function _diagonalStrikeProcessCol(col, rows, sol, affected) {
    const resolver = ptHasSkill('diagonally_wrong') ? _resolveCell : _revealFilledCell;
    for (let r = 0; r < rows; r++) {
        const id = resolver(r, col, sol);
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
            trackAchStat('tilesMarkedWrong', 1);
        }
    });
}

// _diagonalStrikeBonusRepeat — fires a Diagonal Strike on a random unrevealed filled cell.
// Used by god_of_statistics (two independent 25% chances).
// Respects the same MAX_STEPS limit and the caller's REVEAL_CAP / MARK_CAP.
function _diagonalStrikeBonusRepeat(diagonalCount, revealCap, markCap, rows, cols, sol) {
    const candidates = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 1 && !revealedGrid[r][c]) candidates.push([r, c]);
        }
    }
    if (!candidates.length) return;

    // Pick the random target cell immediately so the state represents the moment of the proc
    const [targetR, targetC] = candidates[Math.floor(Math.random() * candidates.length)];

    // Delay the entire 2nd animation and reveal effect by 0.5 seconds
    setTimeout(() => {
        const bonusAffected = [];
        _diagonalStrikeWalkDiagonals(targetR, targetC, diagonalCount, rows, cols, sol, bonusAffected, 3);
        _diagonalStrikeProcessCell(targetR, targetC, sol, bonusAffected);

        if (diagonalCount >= 4) {
            _diagonalStrikeProcessRow(targetR, cols, sol, bonusAffected);
            _diagonalStrikeProcessCol(targetC, rows, sol, bonusAffected);
        }

        // Cap reveals
        const REVEAL_CAP = revealCap || 3;
        const revealedIds = _filterRevealedIds(bonusAffected, sol);
        if (revealedIds.length > REVEAL_CAP) {
            revealedIds.sort(() => Math.random() - 0.5);
            revealedIds.slice(REVEAL_CAP).forEach(id => {
                const [, br, bc] = id.split('-').map(Number);
                revealedGrid[br][bc] = false;
                userGrid[br][bc] = 0;
                renderCell(br, bc);
                updClues(br, bc);
            });
            const keptReveals = new Set(revealedIds.slice(0, REVEAL_CAP));
            const markedIds = new Set(_filterMarkedIds(bonusAffected, sol));
            bonusAffected.length = 0;
            keptReveals.forEach(id => bonusAffected.push(id));
            markedIds.forEach(id => bonusAffected.push(id));
        }

        // Cap marks
        if (ptHasSkill('diagonally_wrong')) {
            const MARK_CAP = markCap || 3;
            const markedIds = _filterMarkedIds(bonusAffected, sol);
            if (markedIds.length > MARK_CAP) {
                markedIds.sort(() => Math.random() - 0.5);
                markedIds.slice(MARK_CAP).forEach(id => {
                    const [, br, bc] = id.split('-').map(Number);
                    if (userGrid[br][bc] === 2) { userGrid[br][bc] = 0; renderCell(br, bc); }
                    const idx = bonusAffected.indexOf(id);
                    if (idx !== -1) bonusAffected.splice(idx, 1);
                });
            }
            _diagonalStrikeMarkWrong(bonusAffected, sol);
        }

        // PLAY EFFECTS OVER THE NEW RANDOM TARGET CELL COORDS
        Audio_Manager.playSFX('diagonalStrike');
        _playDiagonalSlashEffect(targetR, targetC, diagonalCount);
        _applyCellEffect(bonusAffected, 'reveal');

        if (ptHasSkill('adjacency_matrix')) _adjacencyMatrixRefreshAll();

        const bonusRevealed = _filterRevealedIds(bonusAffected, sol).length;
        showToast(`⚔️ Bonus Strike! ${bonusRevealed} more cell(s)!`);

        questStat_classRevealUsed(bonusRevealed);
        updateQuestStats('classAbilityUsedThisLevel', {});

        // Check win condition again in case the bonus cells complete the puzzle
        checkWin();

    }, 1000); // 1s delay
}







// _statisticianTriggerMomentum — awards bonus time and tracks momentum achievements.
// Respects passive tree nodes: chain_reaction, precise_momentum,
// exponential_growth, god_of_statistics.
function _statisticianTriggerMomentum(bonusSeconds) {
    correctFillStreak = 0;

    let bonus = bonusSeconds;
    if (ptHasSkill('chain_reaction')) bonus += 1;
    if (ptHasSkill('precise_momentum')) bonus += 2;

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
    updateQuestStats('momentumTriggered', {});

    window._momentumThisLevel = (window._momentumThisLevel || 0) + 1;
    if (window._momentumThisLevel === 10) trackAchStat('statistician3MomentumOneLevel');

    Audio_Manager.playSFX('momentum');
    updateMomentumBar(0, 15); // reset bar after momentum fires
}










/**
* Fires the glorious divine animation overlay over the board
* and applies a holy screen rumble.
*/
function _playDivineProcEffect() {
    // 1. Play your thematic holy audio if available
    if (typeof Audio_Manager !== 'undefined' && Audio_Manager.playSFX) {
        // Fallback to momentum chime if a specific god audio isn't registered yet
        try { Audio_Manager.playSFX('momentum'); } catch (e) { }
    }

    // 2. Add an environmental rumble to the board layout container
    const board = document.getElementById('ptable') || document.body;
    board.classList.remove('divine-shake');
    void board.offsetWidth; // Force CSS reflow
    board.classList.add('divine-shake');
    setTimeout(() => board.classList.remove('divine-shake'), 400);

    // 3. Construct overlay container
    const container = document.createElement('div');
    container.className = 'divine-intervention-container';

    const flash = document.createElement('div');
    flash.className = 'divine-flash';
    container.appendChild(flash);

    const beam = document.createElement('div');
    beam.className = 'divine-beam';
    container.appendChild(beam);

    // 4. Spawn beautiful floating cross/star particles randomly near the center
    const glyphs = ['✨', '✦', '☀️', '🌟', '✟'];
    for (let i = 0; i < 16; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'divine-sparkle';
        sparkle.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];

        // Spread around central focus area
        sparkle.style.left = `${40 + Math.random() * 20}%`;
        sparkle.style.top = `${30 + Math.random() * 40}%`;
        sparkle.style.animationDelay = `${Math.random() * 0.35}s`;

        container.appendChild(sparkle);
    }

    document.body.appendChild(container);

    // Auto cleanup once animation lifecycle finishes
    setTimeout(() => {
        container.remove();
    }, 1500);
}