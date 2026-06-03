

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

    // Base cap: level 1 = 5, level 2 = 7, level 3 = 9
    // Each of probabilistic_sweep and expanded_inference adds +1 to the cap
    const level = STATE.classActive1Level || 1;
    let markCap = 3 + (level * 2); // lv1→5, lv2→7, lv3→9
    if (ptHasSkill('probabilistic_sweep')) markCap += 1;
    if (ptHasSkill('expanded_inference')) markCap += 1;
    if (ptHasSkill('god_of_probabilities')) markCap += 2;

    const { targetRows, targetCols } = _precisionMarkBuildTargets(row, col, extraLines, rows, cols);
    const affected = _precisionMarkApply(targetRows, targetCols, rows, cols, sol, markCap);

    _playPrecisionMarkEffect(row, col);
    _applyCellEffect(affected, 'mark');
    showToast(`🎯 ${affected.length} ${LANG === 'de' ? 'Zellen markiert!' : 'cells marked!'}`);

    Audio_Manager.playSFX('precisionMark');
    trackAchStat('tilesMarkedWrong', affected.length);

    // momentum_of_certainty: build the window from ALL filled cells in the target rows/cols,
    // not just the marked empty ones — affected only contains sol===0 cells.
    if (ptHasSkill('momentum_of_certainty')) {
        const momentumCells = [];
        targetRows.forEach(r => {
            for (let c = 0; c < cols; c++) {
                if (sol[r][c] === 1 && userGrid[r][c] !== 1) momentumCells.push(`g-${r}-${c}`);
            }
        });
        targetCols.forEach(c => {
            for (let r = 0; r < rows; r++) {
                if (sol[r][c] === 1 && userGrid[r][c] !== 1 && !targetRows.has(r)) momentumCells.push(`g-${r}-${c}`);
            }
        });
        if (momentumCells.length > 0) _precisionMarkStartMomentumWindow(momentumCells);
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
function _precisionMarkApply(targetRows, targetCols, rows, cols, sol, markCap) {
    const affected = [];

    // Helper: pick up to `remaining` random eligible cells from a line and mark them
    function markLine(cells) {
        const remaining = markCap - affected.length;
        if (remaining <= 0) return;
        // Shuffle so the cap cuts randomly rather than always from the top-left
        const eligible = cells.filter(([r, c]) => sol[r][c] === 0 && userGrid[r][c] === 0);
        for (let i = eligible.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
        }
        eligible.slice(0, remaining).forEach(([r, c]) => {
            userGrid[r][c] = 2;
            renderCell(r, c);
            affected.push(`g-${r}-${c}`);
        });
    }

    targetRows.forEach(r => {
        const cells = [];
        for (let c = 0; c < cols; c++) cells.push([r, c]);
        markLine(cells);
    });
    targetCols.forEach(c => {
        const cells = [];
        for (let r = 0; r < rows; r++) cells.push([r, c]);
        markLine(cells);
    });

    questStat_classMarkUsed(affected.length);

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

// _precisionMarkStartMomentumWindow — sets a 5s window where the next correct fill
// in the affected cells grants +3 minutes. Clears itself after the window expires.
function _precisionMarkStartMomentumWindow(affected) {
    const affectedSet = new Set(affected);
    window._pmMomentumActive = true;
    window._pmMomentumSet = affectedSet;
    window._pmMomentumTimeout = setTimeout(() => {
        window._pmMomentumActive = false;
        window._pmMomentumSet = null;
    }, 5000);
}



// _playPrecisionMarkEffect — spawns bows around the grid that fire arrows
//   into each marked cell, with a green impact wave on landing.
function _playPrecisionMarkEffect(clickRow, clickCol) {
    const gridEl = document.getElementById('puzzle-grid') || document.querySelector('.grid-wrap') || document.querySelector('table');
    if (!gridEl) return;

    const gridRect = gridEl.getBoundingClientRect();

    // Collect all freshly-marked cells (userGrid === 2, just set by _precisionMarkApply)
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const targets = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (userGrid[r][c] === 2) {
                const el = document.getElementById(`g-${r}-${c}`);
                if (el) targets.push(el);
            }
        }
    }
    if (!targets.length) return;

    // Four bow spawn positions around the grid (top, bottom, left, right)
    const bowPositions = [
        { x: gridRect.left + gridRect.width * 0.5, y: gridRect.top - 48, angle: 90 },  // top
        { x: gridRect.left + gridRect.width * 0.5, y: gridRect.bottom + 48, angle: 270 }, // bottom
        { x: gridRect.left - 48, y: gridRect.top + gridRect.height * 0.5, angle: 0 }, // left
        { x: gridRect.right + 48, y: gridRect.top + gridRect.height * 0.5, angle: 180 }, // right
    ];

    // Spawn bows
    const bowEls = bowPositions.map(pos => {
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
        return { el: bow, ...pos };
    });

    // Fire arrows at each target with staggered timing
    targets.forEach((targetEl, i) => {
        setTimeout(() => {
            const targetRect = targetEl.getBoundingClientRect();
            const tx = targetRect.left + targetRect.width / 2;
            const ty = targetRect.top + targetRect.height / 2;

            // Pick the closest bow as the origin
            let best = bowEls[0], bestDist = Infinity;
            bowEls.forEach(b => {
                const d = Math.hypot(b.x - tx, b.y - ty);
                if (d < bestDist) { bestDist = d; best = b; }
            });

            _firePrecisionArrow(best.x, best.y, tx, ty, targetEl);
        }, 120 + i * 80); // stagger per cell
    });

    // Remove bows after all arrows have fired + a bit
    const totalDur = 120 + targets.length * 80 + 900;
    setTimeout(() => {
        bowEls.forEach(b => {
            b.el.style.animation = 'pm-bow-disappear 0.25s ease-in forwards';
            setTimeout(() => b.el.remove(), 260);
        });
    }, totalDur);
}

// _firePrecisionArrow — animates a single arrow from (sx,sy) to (tx,ty),
//   then triggers the green impact wave on the target cell.
function _firePrecisionArrow(sx, sy, tx, ty) {
    const dx = tx - sx, dy = ty - sy;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    // Speed: ~420px/s — not too fast, visible flight
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

    // Trigger flight on next frame
    requestAnimationFrame(() => requestAnimationFrame(() => {
        arrow.style.left = `${tx}px`;
        arrow.style.top = `${ty}px`;
    }));

    // On arrival: remove arrow, play impact
    setTimeout(() => {
        arrow.remove();
        _playArrowImpact(tx, ty);
    }, duration * 1000 + 30);
}

// _playArrowImpact — green ripple wave at the impact point.
function _playArrowImpact(x, y) {
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

    // Small green flash on the cell itself
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
    if (ptHasSkill('photographic_memory')) effectiveDuration += 1000;

    const { startRow, startCol } = _fieldScanPickOrigin(effectiveSize, rows, cols);
    const { scanned, prevStates } = _fieldScanRevealRegion(startRow, startCol, effectiveSize, rows, cols, sol);

    _playScanBeamEffect(startRow, startCol, effectiveSize, effectiveDuration);
    showToast(`🎯 Field Scan!`);
    _fieldScanCheckBigScanAchievement(prevStates, sol);

    Audio_Manager.playSFX('fieldScan');

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
            questStat_fieldScanCellRevealed(1);
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
    // god_of_probabilities: permanently reveal up to 3 random filled cells from the scan region
    const keptSet = new Set();
    if (ptHasSkill('god_of_probabilities')) {
        const filledInScan = prevStates.filter(({ r, c }) =>
            cur.grid[r][c] === 1 && !revealedGrid[r][c] && userGrid[r][c] !== 1
        );
        // Shuffle and pick up to 3
        for (let i = filledInScan.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [filledInScan[i], filledInScan[j]] = [filledInScan[j], filledInScan[i]];
        }
        filledInScan.slice(0, 3).forEach(({ r, c }) => {
            revealedGrid[r][c] = true;
            userGrid[r][c] = 1;
            updClues(r, c);
            trackAchStat('tilesRevealed', 1);
            questStat_classRevealUsed(1);
            updateQuestStats('classAbilityUsedThisLevel', {});
            keptSet.add(`${r}-${c}`);
        });

        _playDivineProcEffect();
    }

    prevStates.forEach(({ r, c }) => {
        renderCell(r, c); // renders correctly for both kept and restored cells
    });

    //scanned.forEach(el => el.classList.remove('scan-reveal'));
    scanned.forEach((el, i) => {
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

    showToast('🎯 Scan faded');
    buildClassHUD();
}




// _playScanBeamEffect — modernized scanner: region outline, sharp beam with leading edge,
//   per-row cell flash-in as beam passes, and a countdown bar at the bottom.
function _playScanBeamEffect(startRow, startCol, scanSize, durationMs) {
    const wrap = document.getElementById('puzzle-scaler');
    if (!wrap) return;

    if (!wrap.style.position || wrap.style.position === 'static') wrap.style.position = 'relative';

    const rows = cur?.grid?.length || 99;
    const cols = cur?.grid?.[0]?.length || 99;
    const endRow = Math.min(startRow + scanSize - 1, rows - 1);
    const endCol = Math.min(startCol + scanSize - 1, cols - 1);

    const topCellEl = document.getElementById(`g-${startRow}-${startCol}`);
    const botCellEl = document.getElementById(`g-${endRow}-${startCol}`);
    const rightCellEl = document.getElementById(`g-${startRow}-${endCol}`);
    if (!topCellEl || !botCellEl || !rightCellEl) return;

    const wrapRect = wrap.getBoundingClientRect();
    const zoom = currentZoom || 1;

    const topRect = topCellEl.getBoundingClientRect();
    const botRect = botCellEl.getBoundingClientRect();
    const rightRect = rightCellEl.getBoundingClientRect();

    const regionTop = (topRect.top - wrapRect.top) / zoom;
    const regionLeft = (topRect.left - wrapRect.left) / zoom;
    const regionBottom = (botRect.bottom - wrapRect.top) / zoom;
    const regionRight = (rightRect.right - wrapRect.left) / zoom;
    const regionWidth = regionRight - regionLeft;
    const regionHeight = regionBottom - regionTop;

    // Clean up any leftover from a previous cast
    ['ability-scan-beam', 'ability-scan-outline', 'ability-scan-bar', 'scan-beam-style'].forEach(id => {
        document.getElementById(id)?.remove();
    });

    // ── 1. Region outline (draws in from top-left, corners first) ──────────────
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

    // ── 2. Animated scan beam ──────────────────────────────────────────────────
    const beamH = 28;
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

    // ── 3. Per-row cell flash as beam passes ───────────────────────────────────
    const rowCount = endRow - startRow + 1;
    for (let ri = 0; ri < rowCount; ri++) {
        const r = startRow + ri;
        const rowFraction = ri / Math.max(rowCount - 1, 1);
        const delay = rowFraction * (durationMs * 0.88); // beam reaches row at this point
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

    // ── 4. Countdown bar at bottom of region ──────────────────────────────────
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

    // ── 5. Clean up — outline fades, beam & bar removed ───────────────────────
    setTimeout(() => {
        beam.remove();
        bar.remove();
        outline.style.animation = `scan-outline-fade 0.5s ease-out forwards`;
        setTimeout(() => { outline.remove(); styleTag.remove(); }, 550);
    }, durationMs + 100);
}




// old scan beam effect, maybe keep and use for other scan effects

/*


// _playScanBeamEffect — a glowing green beam sweeps over the scan region top-to-bottom.
function _playScanBeamEffect(startRow, startCol, scanSize, durationMs) {
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
    const topRect = topCellEl.getBoundingClientRect();
    const botRect = botCellEl.getBoundingClientRect();
    const zoom = currentZoom || 1;

    // Convert to logical pixels inside the scaler
    const regionTop = (topRect.top - wrapRect.top) / zoom;
    const regionBottom = (botRect.bottom - wrapRect.top) / zoom;
    const regionHeight = regionBottom - regionTop;

    const beamH = 40; // px, logical

    // Remove any leftover beam + style from a previous cast
    document.getElementById('ability-scan-beam')?.remove();
    document.getElementById('scan-beam-style')?.remove();

    // Inject a fresh keyframe that travels exactly from top to bottom of region
    const styleTag = document.createElement('style');
    styleTag.id = 'scan-beam-style';
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
    beam.id = 'ability-scan-beam';
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









// _playBayesianInsightAnimation — spawns crossbows along the bottom of the screen.
// Each auto-marked cell gets a chain attached, and the X mark is yanked toward the crossbow.
function _playBayesianInsightAnimation(markedCellIds) {
    if (!markedCellIds || !markedCellIds.length) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Spread 1–3 crossbows evenly along the bottom edge
    const crossbowCount = Math.min(3, markedCellIds.length);
    const crossbows = [];

    for (let i = 0; i < crossbowCount; i++) {
        const xPos = vw * (0.2 + (i / Math.max(crossbowCount - 1, 1)) * 0.6);
        const yPos = vh - 32;

        const cb = document.createElement('div');
        cb.className = 'bayesian-crossbow';
        cb.textContent = '🏹';
        // Mirror it to face upward (rotate -90deg so it points up at the grid)
        cb.style.cssText = `
            left: ${xPos}px;
            top: ${yPos}px;
            transform: translate(-50%, -50%) rotate(-90deg);
            animation-delay: ${i * 60}ms;
        `;
        document.body.appendChild(cb);
        crossbows.push({ el: cb, x: xPos, y: yPos });
    }

    // For each marked cell, fire the X-pull after a short stagger
    markedCellIds.forEach((id, idx) => {
        const cellEl = document.getElementById(id);
        if (!cellEl) return;

        const rect = cellEl.getBoundingClientRect();
        const cellX = rect.left + rect.width / 2;
        const cellY = rect.top + rect.height / 2;

        // Assign to the nearest crossbow
        let nearest = crossbows[0];
        let nearestDist = Infinity;
        crossbows.forEach(cb => {
            const d = Math.hypot(cb.x - cellX, cb.y - cellY);
            if (d < nearestDist) { nearestDist = d; nearest = cb; }
        });

        // Stagger each cell's animation
        const delay = 80 + idx * 55;
        setTimeout(() => {
            _fireBayesianChainPull(cellX, cellY, nearest.x, nearest.y);
        }, delay);
    });

    // Remove crossbows after all animations finish
    const totalDur = 80 + markedCellIds.length * 55 + 900;
    setTimeout(() => {
        crossbows.forEach(cb => {
            cb.el.style.animation = 'crossbow-disappear 0.3s ease-in forwards';
            setTimeout(() => cb.el.remove(), 320);
        });
    }, totalDur);
}


// _fireBayesianChainPull — draws a chain from crossbow to cell, then animates
// the X mark flying from the cell toward the crossbow.
function _fireBayesianChainPull(cellX, cellY, cbX, cbY) {
    const dx = cbX - cellX;
    const dy = cbY - cellY;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    // Travel duration
    const duration = Math.min(Math.max(dist / 180, 0.45), 1.4);

    // 1. Draw the chain line from cell toward crossbow
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

    // 2. Spawn the X mark at the cell and animate it flying to the crossbow
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

    // Trigger flight on the next frame
    requestAnimationFrame(() => requestAnimationFrame(() => {
        xMark.style.left = `${cbX}px`;
        xMark.style.top = `${cbY}px`;
    }));

    // 3. On arrival: remove X mark, spawn impact ring
    setTimeout(() => {
        xMark.remove();
        _playBayesianImpact(cbX, cbY);
    }, duration * 1000 + 30);
}


// _playBayesianImpact — purple ripple ring where the X mark lands at the crossbow.
function _playBayesianImpact(x, y) {
    const ring = document.createElement('div');
    ring.className = 'bi-impact';
    ring.style.cssText = `left: ${x}px; top: ${y}px;`;
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 480);
}









// _playBayesianRevealEffect — a golden orb descends from above and "plants"
// the revealed cell. Visually distinct from the purple crossbow-pull effect:
// warm gold, arriving downward toward the cell rather than extracting from it.
function _playBayesianRevealEffect(cellEl) {
    const rect = cellEl.getBoundingClientRect();
    const tx = rect.left + rect.width / 2;
    const ty = rect.top + rect.height / 2;

    // Spawn the orb above the viewport, roughly above the target cell
    const sx = tx;
    const sy = -32;

    const dy = ty - sy;
    const duration = Math.min(Math.max(Math.abs(dy) / 600, 0.35), 0.9);

    // 1. The descending orb
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
                    top ${duration}s cubic-bezier(0.4, 0, 1, 1);
        will-change: left, top;
    `;
    document.body.appendChild(orb);

    // Trail: a few fading particles that linger above as the orb falls
    for (let i = 0; i < 5; i++) {
        const trail = document.createElement('div');
        const offsetX = (Math.random() - 0.5) * 10;
        const trailStartY = sy + i * 18;
        trail.style.cssText = `
            position: fixed;
            left: ${sx + offsetX}px;
            top: ${trailStartY}px;
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

    // Trigger flight on next frame
    requestAnimationFrame(() => requestAnimationFrame(() => {
        orb.style.left = `${tx}px`;
        orb.style.top = `${ty}px`;
    }));

    // On landing: remove orb, play golden impact
    setTimeout(() => {
        orb.remove();
        _playBayesianRevealImpact(tx, ty);
    }, duration * 1000 + 30);
}

// _playBayesianRevealImpact — warm golden burst ring and cell flash on landing.
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

    // A few star sparks radiating outward
    const angles = [0, 60, 120, 180, 240, 300];
    angles.forEach((angle, i) => {
        const spark = document.createElement('div');
        const rad = (angle * Math.PI) / 180;
        const dist = 22 + Math.random() * 12;
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
        // Inject per-spark keyframe
        const styleId = `bi-reveal-spark-style-${i}`;
        if (!document.getElementById(styleId)) {
            const s = document.createElement('style');
            s.id = styleId;
            s.textContent = `
                @keyframes bi-reveal-spark-${i} {
                    0%   { opacity: 1; transform: translate(-50%,-50%) translate(0,0) scale(1); }
                    100% { opacity: 0; transform: translate(-50%,-50%) translate(${Math.cos(rad) * dist}px, ${Math.sin(rad) * dist}px) scale(0.3); }
                }
            `;
            document.head.appendChild(s);
        }
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 540);
    });
}