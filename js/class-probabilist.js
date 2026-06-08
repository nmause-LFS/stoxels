//------------------------------------------------------------------------
//------------------------PROBABILIST-------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// This file handles all ability logic and visual effects for the Probabilist class.
// Abilities covered:
//   - Precision Mark  : marks empty cells in target rows/cols, fires arrow VFX
//   - Field Scan      : temporarily reveals a region of the grid with a beam sweep VFX
//   - Bayesian Insight: auto-marks cells with a crossbow-pull VFX
//   - Bayesian Reveal : permanently reveals a cell with a golden-orb descend VFX


//------------------------------------------------------------------------
//------------------------PRECISION MARK — LOGIC--------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Computes the maximum number of cells Precision Mark is allowed to mark,
// based on the player's class level and any relevant passive skills.
function _precisionMarkComputeMarkCap() {
    const level = STATE.classActive1Level || 1;
    let markCap = 3 + (level * 2); // lv1→5, lv2→7, lv3→9
    if (ptHasSkill('probabilistic_sweep')) markCap += 1;
    if (ptHasSkill('expanded_inference')) markCap += 1;
    if (ptHasSkill('god_of_probabilities')) markCap += 2;
    return markCap;
}

// Computes the set of rows and columns that Precision Mark should target,
// starting from the clicked cell and expanding outward by extraLines.
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

// Shuffles an array in-place using Fisher-Yates (used when randomly selecting
// which cells in a line get marked when the markCap is reached).
function _shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// Marks up to `markCap - affected.length` random empty cells from a single line
// (row or column). Mutates affected in place.
function _precisionMarkLine(cells, sol, markCap, affected) {
    const remaining = markCap - affected.length;
    if (remaining <= 0) return;
    const eligible = cells.filter(([r, c]) => sol[r][c] === 0 && userGrid[r][c] === 0);
    _shuffleArray(eligible);
    eligible.slice(0, remaining).forEach(([r, c]) => {
        userGrid[r][c] = 2;
        renderCell(r, c);
        affected.push(`g-${r}-${c}`);
    });
}

// Applies Precision Mark to all target rows and columns.
// Returns the list of affected cell id strings.
function _precisionMarkApply(targetRows, targetCols, rows, cols, sol, markCap) {
    const affected = [];

    targetRows.forEach(r => {
        const cells = [];
        for (let c = 0; c < cols; c++) cells.push([r, c]);
        _precisionMarkLine(cells, sol, markCap, affected);
    });
    targetCols.forEach(c => {
        const cells = [];
        for (let r = 0; r < rows; r++) cells.push([r, c]);
        _precisionMarkLine(cells, sol, markCap, affected);
    });

    questStat_classMarkUsed(affected.length);
    return affected;
}

// Collects all filled but not yet player-filled cells within the Precision Mark
// target area, used by the momentum_of_certainty skill to start a bonus window.
function _precisionMarkCollectMomentumCells(targetRows, targetCols, rows, cols, sol) {
    const momentumCells = [];
    targetRows.forEach(r => {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 1 && userGrid[r][c] !== 1) momentumCells.push(`g-${r}-${c}`);
        }
    });
    targetCols.forEach(c => {
        for (let r = 0; r < rows; r++) {
            // Skip rows already added via targetRows to avoid duplicates
            if (sol[r][c] === 1 && userGrid[r][c] !== 1 && !targetRows.has(r)) {
                momentumCells.push(`g-${r}-${c}`);
            }
        }
    });
    return momentumCells;
}

// Sets a 5-second window during which the next correct fill in any of the
// affected cells grants +3 minutes (momentum_of_certainty skill perk).
function _precisionMarkStartMomentumWindow(affected) {
    const affectedSet = new Set(affected);
    window._pmMomentumActive = true;
    window._pmMomentumSet = affectedSet;
    window._pmMomentumTimeout = setTimeout(() => {
        window._pmMomentumActive = false;
        window._pmMomentumSet = null;
    }, 5000);
}

// Builds a pool of all rows and columns that still contain unmarked empty cells,
// used by _precisionMarkBonusLine to pick a random unsolved line.
function _precisionMarkBuildUnsolvedPool(rows, cols, sol) {
    const unsolvedRows = [];
    const unsolvedCols = [];

    for (let r = 0; r < rows; r++) {
        if ([...Array(cols).keys()].some(c => sol[r][c] === 0 && userGrid[r][c] === 0)) {
            unsolvedRows.push(r);
        }
    }
    for (let c = 0; c < cols; c++) {
        if ([...Array(rows).keys()].some(r => sol[r][c] === 0 && userGrid[r][c] === 0)) {
            unsolvedCols.push(c);
        }
    }

    return [
        ...unsolvedRows.map(r => ({ type: 'row', idx: r })),
        ...unsolvedCols.map(c => ({ type: 'col', idx: c })),
    ];
}

// Marks all remaining empty cells in a single randomly chosen unsolved row or column.
// Used as a bonus effect when a relevant skill proc fires.
function _precisionMarkBonusLine(rows, cols, sol, affected) {
    const pool = _precisionMarkBuildUnsolvedPool(rows, cols, sol);
    if (!pool.length) return;

    const pick = pool[Math.floor(Math.random() * pool.length)];

    if (pick.type === 'row') {
        for (let c = 0; c < cols; c++) {
            if (sol[pick.idx][c] === 0 && userGrid[pick.idx][c] === 0) {
                userGrid[pick.idx][c] = 2;
                renderCell(pick.idx, c);
                questStat_classMarkUsed(1);
                trackAchStat('tilesMarkedWrong', 1);
                affected.push(`g-${pick.idx}-${c}`);
            }
        }
    } else {
        for (let r = 0; r < rows; r++) {
            if (sol[r][pick.idx] === 0 && userGrid[r][pick.idx] === 0) {
                userGrid[r][pick.idx] = 2;
                renderCell(r, pick.idx);
                questStat_classMarkUsed(1);
                trackAchStat('tilesMarkedWrong', 1);
                affected.push(`g-${r}-${pick.idx}`);
            }
        }
    }

    showToast(`🎯 ${LANG === 'de' ? 'Bonus-Linie markiert!' : 'Bonus line marked!'}`);
}

// Main entry point for the Precision Mark ability.
// Marks empty cells in the target row/col and adjacent lines, then fires VFX.
function _executePrecisionMark(row, col, extraLines) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length;
    const cols = sol[0].length;

    const markCap = _precisionMarkComputeMarkCap();
    const { targetRows, targetCols } = _precisionMarkBuildTargets(row, col, extraLines, rows, cols);
    const affected = _precisionMarkApply(targetRows, targetCols, rows, cols, sol, markCap);

    _playPrecisionMarkEffect(row, col, affected);
    _applyCellEffect(affected, 'mark');
    showToast(`🎯 ${affected.length} ${LANG === 'de' ? 'Zellen markiert!' : 'cells marked!'}`);

    Audio_Manager.playSFX('precisionMark');
    trackAchStat('tilesMarkedWrong', affected.length);

    // momentum_of_certainty skill: start a 5s window where the next correct fill
    // in the target area grants bonus time. Uses ALL filled cells in the target
    // area, not just the marked empty ones.
    if (ptHasSkill('momentum_of_certainty')) {
        const momentumCells = _precisionMarkCollectMomentumCells(targetRows, targetCols, rows, cols, sol);
        if (momentumCells.length > 0) _precisionMarkStartMomentumWindow(momentumCells);
    }
}


//------------------------------------------------------------------------
//--------------------PRECISION MARK — VFX--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Builds the four bow spawn positions around the edges of the grid rect.
function _precisionMarkBuildBowPositions(gridRect) {
    return [
        { x: gridRect.left + gridRect.width * 0.5, y: gridRect.top - 48, angle: 90 }, // top
        { x: gridRect.left + gridRect.width * 0.5, y: gridRect.bottom + 48, angle: 270 }, // bottom
        { x: gridRect.left - 48, y: gridRect.top + gridRect.height * 0.5, angle: 0 }, // left
        { x: gridRect.right + 48, y: gridRect.top + gridRect.height * 0.5, angle: 180 }, // right
    ];
}

// Creates and appends a single bow emoji element at the given position.
function _precisionMarkSpawnBow(pos) {
    const bow = document.createElement('div');
    bow.className = 'pm-bow';
    bow.textContent = '🏹';
    bow.style.cssText = `
        position: fixed;
        left: ${pos.x}px;
        top: ${pos.y}px;
        transform: translate(-50%, -50%) rotate(${pos.angle}deg);
        font-size: 28px;
        z-index: 9000;
        pointer-events: none;
        filter: drop-shadow(0 0 6px #00ff88);
        animation: pm-bow-appear 0.35s cubic-bezier(0.2, 1.4, 0.4, 1) forwards;
    `;
    document.body.appendChild(bow);
    return bow;
}

// Spawns all four bows and returns them as an array of { el, x, y } objects.
function _precisionMarkSpawnBows(gridRect) {
    return _precisionMarkBuildBowPositions(gridRect).map(pos => ({
        el: _precisionMarkSpawnBow(pos),
        ...pos,
    }));
}

// Finds the closest bow to the given (tx, ty) target position.
function _precisionMarkFindClosestBow(bowEls, tx, ty) {
    let best = bowEls[0], bestDist = Infinity;
    bowEls.forEach(b => {
        const d = Math.hypot(b.x - tx, b.y - ty);
        if (d < bestDist) { bestDist = d; best = b; }
    });
    return best;
}

// Fires arrows at every target cell with staggered timing.
// Each arrow originates from the closest of the four bows.
function _precisionMarkFireArrowsAtTargets(targets, bowEls) {
    targets.forEach((targetEl, i) => {
        setTimeout(() => {
            const targetRect = targetEl.getBoundingClientRect();
            const tx = targetRect.left + targetRect.width / 2;
            const ty = targetRect.top + targetRect.height / 2;
            const best = _precisionMarkFindClosestBow(bowEls, tx, ty);
            _firePrecisionArrow(best.x, best.y, tx, ty);
        }, 120 + i * 80);
    });
}

// Schedules the bow elements to fade out after all arrows have been fired.
function _precisionMarkScheduleBowRemoval(bowEls, targetCount) {
    const totalDur = 120 + targetCount * 80 + 900;
    setTimeout(() => {
        bowEls.forEach(b => {
            b.el.style.animation = 'pm-bow-disappear 0.25s ease-in forwards';
            setTimeout(() => b.el.remove(), 260);
        });
    }, totalDur);
}

// Spawns bows around the grid that fire arrows into each marked cell,
// with a green impact wave on landing.
function _playPrecisionMarkEffect(clickRow, clickCol, affectedIds) {
    const gridEl = document.getElementById('puzzle-grid')
        || document.querySelector('.grid-wrap')
        || document.querySelector('table');
    if (!gridEl) return;

    const targets = affectedIds
        .map(id => document.getElementById(id))
        .filter(Boolean);
    if (!targets.length) return;

    const gridRect = gridEl.getBoundingClientRect();
    const bowEls = _precisionMarkSpawnBows(gridRect);

    _precisionMarkFireArrowsAtTargets(targets, bowEls);
    _precisionMarkScheduleBowRemoval(bowEls, targets.length);
}

// Creates an arrow element and animates it flying from (sx, sy) to (tx, ty).
// Speed is ~420px/s, clamped between 0.18s and 0.7s flight time.
function _firePrecisionArrow(sx, sy, tx, ty) {
    const dx = tx - sx, dy = ty - sy;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const duration = Math.min(Math.max(dist / 420, 0.18), 0.7);

    const arrow = document.createElement('div');
    arrow.className = 'pm-arrow';
    arrow.textContent = '➤';
    arrow.style.cssText = `
        position: fixed;
        left: ${sx}px;
        top: ${sy}px;
        transform: translate(-50%, -50%) rotate(${angle}deg);
        font-size: 16px;
        color: #00ff88;
        text-shadow: 0 0 8px #00ff88, 0 0 16px #00cc66;
        z-index: 9001;
        pointer-events: none;
        transition: left ${duration}s linear, top ${duration}s linear;
        will-change: left, top;
    `;
    document.body.appendChild(arrow);

    // Defer position update by one frame so the CSS transition picks it up
    requestAnimationFrame(() => requestAnimationFrame(() => {
        arrow.style.left = `${tx}px`;
        arrow.style.top = `${ty}px`;
    }));

    setTimeout(() => {
        arrow.remove();
        _playArrowImpact(tx, ty);
    }, duration * 1000 + 30);
}

// Plays a green ripple ring and radial flash at the arrow impact point.
function _playArrowImpact(x, y) {
    // Expanding ring
    const ring = document.createElement('div');
    ring.className = 'pm-impact-ring';
    ring.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        z-index: 9002;
        pointer-events: none;
        animation: pm-impact 0.55s ease-out forwards;
    `;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 580);

    // Small radial flash on the cell
    const flash = document.createElement('div');
    flash.className = 'pm-impact-flash';
    flash.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, rgba(0,255,136,0.7) 0%, rgba(0,204,102,0) 70%);
        z-index: 9002;
        pointer-events: none;
        animation: pm-flash 0.4s ease-out forwards;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 420);
}


//------------------------------------------------------------------------
//------------------------FIELD SCAN — LOGIC------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Applies passive skill modifiers to the base scan size and duration.
// wider_lens and panoramic_view each add 1 to scan size.
// photographic_memory adds 1 second to the duration.
function _fieldScanComputeEffectiveParams(scanSize, durationMs) {
    let effectiveSize = scanSize;
    let effectiveDuration = durationMs;
    if (ptHasSkill('wider_lens')) effectiveSize += 1;
    if (ptHasSkill('panoramic_view')) effectiveSize += 1;
    if (ptHasSkill('photographic_memory')) effectiveDuration += 1000;
    return { effectiveSize, effectiveDuration };
}

// Picks a random top-left corner so the scan region stays fully within grid bounds.
function _fieldScanPickOrigin(scanSize, rows, cols) {
    const maxRow = Math.max(0, rows - scanSize);
    const maxCol = Math.max(0, cols - scanSize);
    return {
        startRow: Math.floor(Math.random() * (maxRow + 1)),
        startCol: Math.floor(Math.random() * (maxCol + 1)),
    };
}

// Temporarily reveals all unrevealed cells in the scan region by adding CSS classes.
// Returns the DOM elements and their previous state for later restoration.
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
            questStat_fieldScanCellRevealed(1);
        }
    }

    return { scanned, prevStates };
}

// Tracks the achievement for scanning 20 or more correct (filled) cells at once.
function _fieldScanCheckBigScanAchievement(prevStates, sol) {
    const correctInScan = prevStates.filter(({ r, c }) => sol[r][c] === 1).length;
    if (correctInScan >= 20) trackAchStat('probabilistBigScan');
}

// Handles the god_of_probabilities skill perk during scan restore:
// permanently reveals up to 3 random filled cells from the scan region.
function _fieldScanRestoreGodOfProbabilities(prevStates) {
    const filledInScan = prevStates.filter(({ r, c }) =>
        cur.grid[r][c] === 1 && !revealedGrid[r][c] && userGrid[r][c] !== 1
    );

    _shuffleArray(filledInScan);
    filledInScan.slice(0, 3).forEach(({ r, c }) => {
        revealedGrid[r][c] = true;
        userGrid[r][c] = 1;
        updClues(r, c);
        trackAchStat('tilesRevealed', 1);
        questStat_classRevealUsed(1);
        updateQuestStats('classAbilityUsedThisLevel', {});
    });

    _playDivineProcEffect();
}

// Fades out the scan-reveal cells one by one with a randomized stagger,
// then re-renders each cell to its actual state.
function _fieldScanFadeOutCells(scanned) {
    scanned.forEach(el => {
        setTimeout(() => {
            el.style.transition = 'opacity 0.25s ease-out, filter 0.25s ease-out';
            el.style.opacity = '0.3';
            el.style.filter = 'brightness(2) saturate(0)';
            setTimeout(() => {
                el.classList.remove('scan-reveal');
                el.style.transition = '';
                el.style.opacity = '';
                el.style.filter = '';
            }, 260);
        }, Math.random() * 180);
    });
}

// Restores all scanned cells to their real state after the scan timer expires.
// If god_of_probabilities is active, permanently keeps up to 3 filled cells first.
function _fieldScanRestore(scanned, prevStates) {
    if (ptHasSkill('god_of_probabilities')) {
        _fieldScanRestoreGodOfProbabilities(prevStates);
    }

    // Re-render all cells (correctly handles both kept and restored cells)
    prevStates.forEach(({ r, c }) => renderCell(r, c));

    _fieldScanFadeOutCells(scanned);
    showToast('🎯 Scan faded');
    buildClassHUD();
}

// Main entry point for the Field Scan ability.
// Temporarily reveals a random grid region and schedules its restoration.
function _executeFieldScan(scanSize, durationMs) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length;
    const cols = sol[0].length;

    const { effectiveSize, effectiveDuration } = _fieldScanComputeEffectiveParams(scanSize, durationMs);
    const { startRow, startCol } = _fieldScanPickOrigin(effectiveSize, rows, cols);
    const { scanned, prevStates } = _fieldScanRevealRegion(startRow, startCol, effectiveSize, rows, cols, sol);

    _playScanBeamEffect(startRow, startCol, effectiveSize, effectiveDuration);
    showToast(`🎯 Field Scan!`);
    _fieldScanCheckBigScanAchievement(prevStates, sol);
    Audio_Manager.playSFX('fieldScan');

    setTimeout(() => _fieldScanRestore(scanned, prevStates), effectiveDuration);
}


//------------------------------------------------------------------------
//---------------------FIELD SCAN — VFX----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Removes any leftover scan VFX elements from a previous ability cast.
function _scanBeamCleanupPreviousCast() {
    ['ability-scan-beam', 'ability-scan-outline', 'ability-scan-bar', 'scan-beam-style'].forEach(id => {
        document.getElementById(id)?.remove();
    });
}

// Computes the pixel bounds of the scan region within the puzzle scaler element,
// accounting for the current zoom level.
function _scanBeamBuildRegionBounds(startRow, startCol, scanSize, wrap) {
    const rows = cur?.grid?.length || 99;
    const cols = cur?.grid?.[0]?.length || 99;
    const endRow = Math.min(startRow + scanSize - 1, rows - 1);
    const endCol = Math.min(startCol + scanSize - 1, cols - 1);

    const topCellEl = document.getElementById(`g-${startRow}-${startCol}`);
    const botCellEl = document.getElementById(`g-${endRow}-${startCol}`);
    const rightCellEl = document.getElementById(`g-${startRow}-${endCol}`);
    if (!topCellEl || !botCellEl || !rightCellEl) return null;

    const wrapRect = wrap.getBoundingClientRect();
    const zoom = currentZoom || 1;
    const topRect = topCellEl.getBoundingClientRect();
    const botRect = botCellEl.getBoundingClientRect();
    const rightRect = rightCellEl.getBoundingClientRect();

    const regionTop = (topRect.top - wrapRect.top) / zoom;
    const regionLeft = (topRect.left - wrapRect.left) / zoom;
    const regionBottom = (botRect.bottom - wrapRect.top) / zoom;
    const regionRight = (rightRect.right - wrapRect.left) / zoom;

    return {
        regionTop,
        regionLeft,
        regionBottom,
        regionRight,
        regionWidth: regionRight - regionLeft,
        regionHeight: regionBottom - regionTop,
    };
}

// Injects the CSS keyframe animations needed for the scan beam effect.
// Returns the inserted style tag so it can be removed during cleanup.
function _scanBeamInjectKeyframes(durationMs, regionTop, regionHeight, beamH) {
    const travelDist = Math.max(0, regionHeight - beamH);
    const styleTag = document.createElement('style');
    styleTag.id = 'scan-beam-style';
    styleTag.textContent = `
        @keyframes scan-beam-move-dynamic {
            0%   { opacity: 0;   top: ${regionTop}px; }
            4%   { opacity: 1; }
            95%  { opacity: 1; }
            100% { opacity: 0;   top: ${regionTop + travelDist}px; }
        }
        @keyframes scan-outline-in {
            from { opacity: 0; clip-path: inset(0 100% 100% 0); }
            to   { opacity: 1; clip-path: inset(0 0% 0% 0); }
        }
        @keyframes scan-bar-deplete {
            from { transform: scaleX(1); }
            to   { transform: scaleX(0); }
        }
        @keyframes scan-cell-flash {
            0%   { background: rgba(74,222,128,0.55); }
            60%  { background: rgba(74,222,128,0.08); }
            100% { background: transparent; }
        }
        @keyframes scan-outline-fade {
            from { opacity: 1; }
            to   { opacity: 0; box-shadow: 0 0 24px 4px rgba(74,222,128,0.15); }
        }
    `;
    document.head.appendChild(styleTag);
    return styleTag;
}

// Creates and appends the animated green border outline for the scan region.
function _scanBeamCreateOutline(wrap, regionLeft, regionTop, regionWidth, regionHeight) {
    const outline = document.createElement('div');
    outline.id = 'ability-scan-outline';
    outline.style.cssText = `
        position: absolute;
        left: ${regionLeft}px;
        top: ${regionTop}px;
        width: ${regionWidth}px;
        height: ${regionHeight}px;
        pointer-events: none;
        z-index: 309;
        border: 1.5px solid rgba(74,222,128,0.85);
        box-shadow: 0 0 10px 1px rgba(74,222,128,0.35), inset 0 0 8px rgba(74,222,128,0.08);
        animation: scan-outline-in 0.35s cubic-bezier(0.22,1,0.36,1) forwards;
    `;
    wrap.appendChild(outline);
    return outline;
}

// Creates and appends the animated green beam that sweeps top-to-bottom.
function _scanBeamCreateBeam(wrap, regionLeft, regionTop, regionWidth, beamH, durationMs) {
    const beam = document.createElement('div');
    beam.id = 'ability-scan-beam';
    beam.style.cssText = `
        position: absolute;
        left: ${regionLeft}px;
        width: ${regionWidth}px;
        height: ${beamH}px;
        top: ${regionTop}px;
        pointer-events: none;
        z-index: 310;
        background: linear-gradient(180deg,
            rgba(74,222,128,0) 0%,
            rgba(74,222,128,0.18) 25%,
            rgba(74,222,128,0.55) 60%,
            rgba(150,255,200,1) 75%,
            rgba(200,255,230,0.9) 82%,
            rgba(74,222,128,0.15) 95%,
            rgba(74,222,128,0) 100%
        );
        box-shadow: 0 2px 18px 3px rgba(74,222,128,0.5), 0 0 6px 1px rgba(200,255,230,0.7);
        animation: scan-beam-move-dynamic ${durationMs}ms linear forwards;
    `;
    wrap.appendChild(beam);
    return beam;
}

// Creates and appends the countdown bar at the bottom of the scan region.
function _scanBeamCreateCountdownBar(wrap, regionLeft, regionBottom, regionWidth, durationMs) {
    const bar = document.createElement('div');
    bar.id = 'ability-scan-bar';
    bar.style.cssText = `
        position: absolute;
        left: ${regionLeft}px;
        top: ${regionBottom - 3}px;
        width: ${regionWidth}px;
        height: 3px;
        pointer-events: none;
        z-index: 312;
        background: linear-gradient(90deg, rgba(74,222,128,0.9), rgba(150,255,200,0.6));
        transform-origin: left center;
        box-shadow: 0 0 6px 1px rgba(74,222,128,0.6);
        animation: scan-bar-deplete ${durationMs}ms linear forwards;
        animation-delay: 200ms;
    `;
    wrap.appendChild(bar);
    return bar;
}

// Schedules a brief cell flash on each row of the scan region as the beam passes over it.
function _scanBeamScheduleRowFlashes(startRow, endRow, startCol, endCol, durationMs) {
    const rowCount = endRow - startRow + 1;
    for (let ri = 0; ri < rowCount; ri++) {
        const r = startRow + ri;
        const rowFraction = ri / Math.max(rowCount - 1, 1);
        const delay = rowFraction * (durationMs * 0.88);

        setTimeout(() => {
            for (let c = startCol; c <= endCol; c++) {
                const el = document.getElementById(`g-${r}-${c}`);
                if (!el) continue;
                const flashEl = document.createElement('div');
                flashEl.style.cssText = `
                    position: absolute; inset: 0; pointer-events: none;
                    z-index: 311; animation: scan-cell-flash 0.45s ease-out forwards;
                `;
                el.style.position = 'relative';
                el.appendChild(flashEl);
                setTimeout(() => flashEl.remove(), 480);
            }
        }, delay);
    }
}

// Plays the full Field Scan visual effect:
// a sweeping green beam across the scan region with a border outline, countdown bar,
// per-row cell flashes, and a clean fade-out at the end.
function _playScanBeamEffect(startRow, startCol, scanSize, durationMs) {
    const wrap = document.getElementById('puzzle-scaler');
    if (!wrap) return;

    if (!wrap.style.position || wrap.style.position === 'static') wrap.style.position = 'relative';

    _scanBeamCleanupPreviousCast();

    const bounds = _scanBeamBuildRegionBounds(startRow, startCol, scanSize, wrap);
    if (!bounds) return;

    const { regionTop, regionLeft, regionBottom, regionWidth, regionHeight } = bounds;
    const rows = cur?.grid?.length || 99;
    const endRow = Math.min(startRow + scanSize - 1, rows - 1);
    const endCol = Math.min(startCol + scanSize - 1, (cur?.grid?.[0]?.length || 99) - 1);
    const beamH = 28;

    const styleTag = _scanBeamInjectKeyframes(durationMs, regionTop, regionHeight, beamH);
    const outline = _scanBeamCreateOutline(wrap, regionLeft, regionTop, regionWidth, regionHeight);
    const beam = _scanBeamCreateBeam(wrap, regionLeft, regionTop, regionWidth, beamH, durationMs);
    const bar = _scanBeamCreateCountdownBar(wrap, regionLeft, regionBottom, regionWidth, durationMs);

    _scanBeamScheduleRowFlashes(startRow, endRow, startCol, endCol, durationMs);

    // Clean up beam and bar, fade out outline
    setTimeout(() => {
        beam.remove();
        bar.remove();
        outline.style.animation = 'scan-outline-fade 0.5s ease-out forwards';
        setTimeout(() => { outline.remove(); styleTag.remove(); }, 550);
    }, durationMs + 100);
}


//------------------------------------------------------------------------
//----------------LEGACY SCAN BEAM (kept for reference)-------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Old simpler scan beam — a single glowing band that sweeps top-to-bottom.
// Kept here in case it is useful for other scan-like effects in the future.

/*
function _playScanBeamEffect_legacy(startRow, startCol, scanSize, durationMs) {
    const wrap = document.getElementById('puzzle-scaler');
    if (!wrap) return;

    const prevPosition = wrap.style.position;
    if (!prevPosition || prevPosition === 'static') wrap.style.position = 'relative';

    const rows = cur?.grid?.length || 99;
    const endRow = Math.min(startRow + scanSize - 1, rows - 1);

    const topCellEl = document.getElementById(`g-${startRow}-${startCol}`);
    const botCellEl = document.getElementById(`g-${endRow}-${startCol}`);
    if (!topCellEl || !botCellEl) return;

    const wrapRect = wrap.getBoundingClientRect();
    const topRect  = topCellEl.getBoundingClientRect();
    const botRect  = botCellEl.getBoundingClientRect();
    const zoom     = currentZoom || 1;

    const regionTop    = (topRect.top    - wrapRect.top) / zoom;
    const regionBottom = (botRect.bottom - wrapRect.top) / zoom;
    const regionHeight = regionBottom - regionTop;
    const beamH        = 40;

    document.getElementById('ability-scan-beam')?.remove();
    document.getElementById('scan-beam-style')?.remove();

    const styleTag = document.createElement('style');
    styleTag.id    = 'scan-beam-style';
    styleTag.textContent = `
        @keyframes scan-beam-move-dynamic {
            0%   { opacity: 0;   top: ${regionTop}px; }
            6%   { opacity: 1; }
            94%  { opacity: 1; }
            100% { opacity: 0;   top: ${regionTop + Math.max(0, regionHeight - beamH)}px; }
        }
    `;
    document.head.appendChild(styleTag);

    const beam = document.createElement('div');
    beam.id    = 'ability-scan-beam';
    beam.style.cssText = `
        position: absolute;
        left: 0; right: 0;
        height: ${beamH}px;
        top: ${regionTop}px;
        pointer-events: none;
        z-index: 308;
        background: linear-gradient(180deg,
            rgba(39,174,96,0) 0%,
            rgba(39,174,96,0.55) 40%,
            rgba(150,255,200,0.85) 50%,
            rgba(39,174,96,0.55) 60%,
            rgba(39,174,96,0) 100%
        );
        box-shadow: 0 0 24px 6px rgba(39,174,96,0.4);
        animation: scan-beam-move-dynamic ${durationMs}ms linear forwards;
    `;

    wrap.appendChild(beam);
    setTimeout(() => { beam.remove(); styleTag.remove(); }, durationMs + 150);
}
*/


//------------------------------------------------------------------------
//--------------------BAYESIAN INSIGHT — VFX------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Spawns the given number of crossbow emojis spread evenly along the bottom
// of the screen. Returns an array of { el, x, y } objects.
function _bayesianInsightSpawnCrossbows(count) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const crossbows = [];

    for (let i = 0; i < count; i++) {
        const xPos = vw * (0.2 + (i / Math.max(count - 1, 1)) * 0.6);
        const yPos = vh - 32;

        const cb = document.createElement('div');
        cb.className = 'bayesian-crossbow';
        cb.textContent = '🏹';
        // Rotated -90° so the bow faces upward toward the grid
        cb.style.cssText = `
            left: ${xPos}px;
            top: ${yPos}px;
            transform: translate(-50%, -50%) rotate(-90deg);
            animation-delay: ${i * 60}ms;
        `;
        document.body.appendChild(cb);
        crossbows.push({ el: cb, x: xPos, y: yPos });
    }

    return crossbows;
}

// Finds the nearest crossbow to a given (cellX, cellY) screen position.
function _bayesianInsightFindNearestCrossbow(crossbows, cellX, cellY) {
    let nearest = crossbows[0], nearestDist = Infinity;
    crossbows.forEach(cb => {
        const d = Math.hypot(cb.x - cellX, cb.y - cellY);
        if (d < nearestDist) { nearestDist = d; nearest = cb; }
    });
    return nearest;
}

// Draws a chain line from (cellX, cellY) toward a crossbow at (cbX, cbY).
function _bayesianInsightDrawChain(cellX, cellY, cbX, cbY, duration) {
    const dx = cbX - cellX;
    const dy = cbY - cellY;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    const chain = document.createElement('div');
    chain.className = 'bi-chain';
    chain.style.cssText = `
        left: ${cellX}px;
        top: ${cellY}px;
        width: ${dist}px;
        transform: rotate(${angle}deg);
        animation-duration: ${duration + 0.2}s;
    `;
    document.body.appendChild(chain);
    setTimeout(() => chain.remove(), (duration + 0.25) * 1000);
}

// Spawns an X mark at the cell and animates it flying toward the crossbow.
// On arrival, removes itself and plays the impact effect.
function _bayesianInsightFireXMark(cellX, cellY, cbX, cbY, duration) {
    const xMark = document.createElement('div');
    xMark.className = 'bi-x-mark';
    xMark.textContent = '✕';
    xMark.style.cssText = `
        left: ${cellX}px;
        top: ${cellY}px;
        transition: left ${duration}s linear, top ${duration}s linear;
        animation-duration: ${duration + 0.15}s;
        will-change: left, top;
    `;
    document.body.appendChild(xMark);

    requestAnimationFrame(() => requestAnimationFrame(() => {
        xMark.style.left = `${cbX}px`;
        xMark.style.top = `${cbY}px`;
    }));

    setTimeout(() => {
        xMark.remove();
        _playBayesianImpact(cbX, cbY);
    }, duration * 1000 + 30);
}

// Fires the full chain-pull animation: draws the chain, then flies the X mark
// from the cell position to the crossbow position.
function _fireBayesianChainPull(cellX, cellY, cbX, cbY) {
    const dist = Math.hypot(cbX - cellX, cbY - cellY);
    const duration = Math.min(Math.max(dist / 180, 0.45), 1.4);

    _bayesianInsightDrawChain(cellX, cellY, cbX, cbY, duration);
    _bayesianInsightFireXMark(cellX, cellY, cbX, cbY, duration);
}

// Plays a purple ripple ring where the X mark arrives at the crossbow.
function _playBayesianImpact(x, y) {
    const ring = document.createElement('div');
    ring.className = 'bi-impact';
    ring.style.cssText = `left: ${x}px; top: ${y}px;`;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 480);
}

// Schedules the crossbow elements to disappear after all chain-pull animations finish.
function _bayesianInsightScheduleCrossbowRemoval(crossbows, cellCount) {
    const totalDur = 80 + cellCount * 55 + 900;
    setTimeout(() => {
        crossbows.forEach(cb => {
            cb.el.style.animation = 'crossbow-disappear 0.3s ease-in forwards';
            setTimeout(() => cb.el.remove(), 320);
        });
    }, totalDur);
}

// Plays the Bayesian Insight VFX: spawns crossbows along the bottom of the screen
// and fires chain-pull animations toward each auto-marked cell.
function _playBayesianInsightAnimation(markedCellIds) {
    if (!markedCellIds || !markedCellIds.length) return;

    const crossbowCount = Math.min(3, markedCellIds.length);
    const crossbows = _bayesianInsightSpawnCrossbows(crossbowCount);

    markedCellIds.forEach((id, idx) => {
        const cellEl = document.getElementById(id);
        if (!cellEl) return;

        const rect = cellEl.getBoundingClientRect();
        const cellX = rect.left + rect.width / 2;
        const cellY = rect.top + rect.height / 2;
        const nearest = _bayesianInsightFindNearestCrossbow(crossbows, cellX, cellY);

        setTimeout(() => _fireBayesianChainPull(cellX, cellY, nearest.x, nearest.y), 80 + idx * 55);
    });

    _bayesianInsightScheduleCrossbowRemoval(crossbows, markedCellIds.length);
}


//------------------------------------------------------------------------
//---------------------BAYESIAN REVEAL — VFX------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Spawns a trail of small gold particles above the orb's starting position.
// Particles fade out before the orb lands.
function _bayesianRevealSpawnTrailParticles(sx, sy) {
    for (let i = 0; i < 5; i++) {
        const trail = document.createElement('div');
        const offsetX = (Math.random() - 0.5) * 10;
        const trailY = sy + i * 18;
        trail.style.cssText = `
            position: fixed;
            left: ${sx + offsetX}px;
            top: ${trailY}px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 220, 80, 0.7);
            box-shadow: 0 0 6px 2px rgba(255, 200, 0, 0.5);
            z-index: 9199;
            pointer-events: none;
            animation: bi-reveal-trail ${0.4 + i * 0.06}s ease-out ${i * 0.04}s forwards;
        `;
        document.body.appendChild(trail);
        setTimeout(() => trail.remove(), 600);
    }
}

// Creates and animates a golden orb descending from above the viewport
// to the target cell position.
function _bayesianRevealDropOrb(sx, sy, tx, ty, duration) {
    const orb = document.createElement('div');
    orb.className = 'bi-reveal-orb';
    orb.style.cssText = `
        position: fixed;
        left: ${sx}px;
        top: ${sy}px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, #fff8c0 0%, #ffd700 45%, #f39c12 100%);
        box-shadow: 0 0 10px 4px rgba(255, 215, 0, 0.8), 0 0 22px 8px rgba(255, 165, 0, 0.4);
        z-index: 9200;
        pointer-events: none;
        transition: left ${duration}s cubic-bezier(0.4, 0, 0.6, 1),
                    top  ${duration}s cubic-bezier(0.4, 0, 1, 1);
        will-change: left, top;
    `;
    document.body.appendChild(orb);

    requestAnimationFrame(() => requestAnimationFrame(() => {
        orb.style.left = `${tx}px`;
        orb.style.top = `${ty}px`;
    }));

    setTimeout(() => {
        orb.remove();
        _playBayesianRevealImpact(tx, ty);
    }, duration * 1000 + 30);
}

// Plays the Bayesian Reveal VFX: a golden orb drops from above the viewport
// and lands on the revealed cell, followed by a warm golden burst.
function _playBayesianRevealEffect(cellEl) {
    const rect = cellEl.getBoundingClientRect();
    const tx = rect.left + rect.width / 2;
    const ty = rect.top + rect.height / 2;
    const sx = tx;
    const sy = -32; // start above the visible viewport
    const duration = Math.min(Math.max(Math.abs(ty - sy) / 600, 0.35), 0.9);

    _bayesianRevealSpawnTrailParticles(sx, sy);
    _bayesianRevealDropOrb(sx, sy, tx, ty, duration);
}

// Injects a per-spark keyframe animation if it hasn't been added yet.
function _bayesianRevealInjectSparkKeyframe(index, rad, dist) {
    const styleId = `bi-reveal-spark-style-${index}`;
    if (document.getElementById(styleId)) return;

    const s = document.createElement('style');
    s.id = styleId;
    s.textContent = `
        @keyframes bi-reveal-spark-${index} {
            0%   { opacity: 1; transform: translate(-50%,-50%) translate(0,0) scale(1); }
            100% { opacity: 0; transform: translate(-50%,-50%)
                   translate(${Math.cos(rad) * dist}px, ${Math.sin(rad) * dist}px) scale(0.3); }
        }
    `;
    document.head.appendChild(s);
}

// Spawns the six star sparks that radiate outward from the golden impact point.
function _bayesianRevealImpactSparks(x, y) {
    const angles = [0, 60, 120, 180, 240, 300];
    angles.forEach((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const dist = 22 + Math.random() * 12;

        _bayesianRevealInjectSparkKeyframe(i, rad, dist);

        const spark = document.createElement('div');
        spark.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            background: #ffd700;
            box-shadow: 0 0 5px 2px rgba(255, 200, 0, 0.7);
            z-index: 9202;
            pointer-events: none;
            animation: bi-reveal-spark-${i} 0.5s ease-out forwards;
        `;
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 540);
    });
}

// Plays the warm golden burst impact when the reveal orb lands:
// an expanding ring, a radial flash, and six radiating sparks.
function _playBayesianRevealImpact(x, y) {
    // Expanding ring
    const ring = document.createElement('div');
    ring.className = 'bi-reveal-ring';
    ring.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        z-index: 9201;
        pointer-events: none;
        animation: bi-reveal-ring-anim 0.6s ease-out forwards;
    `;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 640);

    // Warm radial flash
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, rgba(255,240,100,0.85) 0%, rgba(255,165,0,0.4) 45%, rgba(255,165,0,0) 70%);
        z-index: 9201;
        pointer-events: none;
        animation: bi-reveal-flash 0.45s ease-out forwards;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 480);

    _bayesianRevealImpactSparks(x, y);
}