//------------------------------------------------------------------------
//----------------------CLUE CALCULATION----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// clues(line) — converts a single row or column of solution values into
//   the nonogram clue array for that line.
//   A "clue" is the count of each consecutive run of filled cells (1s).
//   Example:  [0,1,1,0,1]  →  [2, 1]
//             [0,0,0,0,0]  →  [0]   (empty line always returns [0])
//
//   Algorithm: iterate through the values keeping a running counter (c).
//     - When a 1 is encountered, increment c.
//     - When a 0 follows a run (c > 0), push c to results and reset.
//     - After the loop, push any trailing run.
//   Called for every row (to build RC) and every column (to build CC)
//   inside buildGrid().


function clues(line) {
    const r = []; // result array of run lengths
    let c = 0;    // current run counter
    for (const v of line) {
        if (v === 1) {
            c++; // extend current run
        } else if (c > 0) {
            r.push(c); // end of a run — record it
            c = 0;
        }
    }
    if (c > 0) r.push(c); // don't forget a run that ends at the last cell
    return r.length ? r : [0]; // empty line -> [0] so the clue cell renders "0"
}








//------------------------------------------------------------------------
//--------------------MAIN GRID BUILDER FUNCTION--------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function buildGrid() {
    resetZoom();

    const sol = cur.grid;
    const rows = sol.length;
    const cols = sol[0].length;
    const maxDim = Math.max(rows, cols);

    const csz = maxDim <= 5 ? 52 :
        maxDim <= 10 ? 40 :
            maxDim <= 15 ? 32 :
                maxDim <= 20 ? 26 :
                    Math.max(18, Math.floor(700 / maxDim));

    const fs = maxDim <= 5 ? 17 :
        maxDim <= 10 ? 15 :
            maxDim <= 15 ? 13 :
                maxDim <= 20 ? 12 : 10;

    const tbl = document.getElementById('ptable');

    const RC = sol.map(row => clues(row));
    const CC = Array.from({ length: cols }, (_, c) => clues(sol.map(r => r[c])));

    const mcd = Math.max(...CC.map(c => c.length));
    const mrw = Math.max(...RC.map(r => r.length));

    const isAdjMatrix = ptHasSkill('adjacency_matrix');

    // In adjacency matrix mode we suppress all row/col clue columns and header rows
    let h = `<colgroup>`;
    if (!isAdjMatrix) {
        h += Array(mrw).fill(`<col style="width:${fs + 7}px">`).join('');
    }
    h += Array(cols).fill(`<col style="width:${csz}px">`).join('');
    h += `</colgroup><tbody>`;

    // Column clue header rows — hidden in adjacency matrix mode
    if (!isAdjMatrix) {
        for (let d = 0; d < mcd; d++) {
            h += `<tr>${Array(mrw).fill(`<td class="corner"></td>`).join('')}`;
            for (let col = 0; col < cols; col++) {
                const cl = CC[col];
                const off = mcd - cl.length;
                const num = d >= off ? cl[d - off] : null;
                const isTop = (d === 0);
                h += `<td class="cch cch-${col}" ${isTop ? `id="cchtop-${col}"` : ''} style="height:${fs + 3}px">`;
                if (num !== null) {
                    h += `<div class="ccinner"><span id="cn-${col}-${d}" style="font-size:${fs}px">${num}</span></div>`;
                }
                h += `</td>`;
            }
            h += `</tr>`;
        }
    }

    // Puzzle rows
    for (let row = 0; row < rows; row++) {
        h += `<tr>`;

        // Row clue sticky cells — hidden in adjacency matrix mode
        if (!isAdjMatrix) {
            const rc = RC[row];
            const pad = mrw - rc.length;
            for (let i = 0; i < pad; i++) h += `<td class="corner" style="position:sticky;left:${i * (fs + 7)}px;background:var(--bg);z-index:11"></td>`;
            for (let i = 0; i < rc.length; i++) {
                h += `<td class="rct rct-${row}" id="rct-${row}-${i}" style="font-size:${fs}px;position:sticky;left:${(pad + i) * (fs + 7)}px;background:var(--bg);z-index:10">` +
                    `<div class="rcinner"><span id="rn-${row}-${i}" style="font-size:${fs}px">${rc[i]}</span></div>` +
                    `</td>`;
            }
        }

        for (let col = 0; col < cols; col++) {
            const br = (col + 1) % 5 === 0 && col < cols - 1 ? ' br' : '';
            const bb = (row + 1) % 5 === 0 && row < rows - 1 ? ' bb' : '';
            h += `<td><div class="gc${br}${bb}" id="g-${row}-${col}"
                     style="width:${csz}px;height:${csz}px;font-size:${csz}px"
                     onmousedown="cd(event,${row},${col})"
                     onmouseenter="onHover(event,${row},${col})"
                     onmouseleave="onHoverOut(${row},${col})"
                     onmouseup="sp()"></div></td>`;
        }
        h += `</tr>`;
    }
    h += `</tbody>`;

    tbl.innerHTML = h;

    requestAnimationFrame(() => requestAnimationFrame(scalePuzzle));
}



// getSolvedClueFlags — returns a boolean array, one entry per clue number,
// indicating whether that specific run has already been correctly filled.
// Greedily matches player-filled correct runs (left-to-right) against clues.
function getSolvedClueFlags(clueNums, userRow, solRow) {
    const len = solRow.length;
    const n = clueNums.length;

    // Step 1: Find the earliest and latest position each clue can START,
    // based purely on the solution layout (not the player's fills).
    // earliest[ci] = leftmost cell index where clue ci could begin
    // latest[ci]   = rightmost cell index where clue ci could begin
    const earliest = new Array(n).fill(0);
    const latest = new Array(n).fill(0);

    // Forward pass: place each clue as far left as possible
    let pos = 0;
    for (let ci = 0; ci < n; ci++) {
        // Advance pos until we find a run of clueNums[ci] filled solution cells
        while (pos <= len - clueNums[ci]) {
            let fits = true;
            for (let k = 0; k < clueNums[ci]; k++) {
                if (solRow[pos + k] !== 1) { fits = false; break; }
            }
            if (fits) break;
            pos++;
        }
        earliest[ci] = pos;
        pos += clueNums[ci] + 1; // +1 for mandatory gap
    }

    // Backward pass: place each clue as far right as possible
    pos = len - 1;
    for (let ci = n - 1; ci >= 0; ci--) {
        // Advance pos (leftward) until a run of clueNums[ci] fits ending at pos
        while (pos - clueNums[ci] + 1 >= 0) {
            let fits = true;
            for (let k = 0; k < clueNums[ci]; k++) {
                if (solRow[pos - clueNums[ci] + 1 + k] !== 1) { fits = false; break; }
            }
            if (fits) break;
            pos--;
        }
        latest[ci] = pos - clueNums[ci] + 1;
        pos -= clueNums[ci] + 1; // +1 for mandatory gap
    }

    // Step 2: Collect the player's correctly-filled runs with their start positions
    // A run only counts if every cell the player filled also matches the solution
    const playerRuns = []; // [{start, size}]
    let i = 0;
    while (i < len) {
        if (userRow[i] === 1 && solRow[i] === 1) {
            const start = i;
            while (i < len && userRow[i] === 1 && solRow[i] === 1) i++;
            playerRuns.push({ start, size: i - start });
        } else {
            i++;
        }
    }

    // Step 3: For each clue, check whether there is exactly one player run
    // that fits within the clue's exclusive positional window AND matches its size.
    // "Exclusive" means the window [earliest[ci], latest[ci]] does not overlap
    // with the window of any adjacent clue — if windows overlap, the run is
    // ambiguous and we don't strike anything through.
    const solved = new Array(n).fill(false);
    for (let ci = 0; ci < n; ci++) {
        const e = earliest[ci];
        const l = latest[ci];
        const sz = clueNums[ci];

        // Check for overlap with neighbours — if the window is ambiguous, skip
        const overlapPrev = ci > 0 && latest[ci - 1] + clueNums[ci - 1] > e;
        const overlapNext = ci < n - 1 && l + sz > earliest[ci + 1];
        if (overlapPrev || overlapNext) continue;

        // Look for a player run that exactly matches: correct size, starts within [e, l]
        const match = playerRuns.find(r => r.size === sz && r.start >= e && r.start <= l);
        if (match) solved[ci] = true;
    }

    return solved;
}




//------------------------------------------------------------------------
// Function to add a visual strike through the row / column clue numbers 
// when a row / column is fully filled
//------------------------------------------------------------------------


// updClues(row, col) — called after every cell change.
//   Checks whether the affected row and column are now fully solved
//   (all correct cells filled, no wrong marks on correct cells) and
//   toggles the CSS class 'clue-done' (strikethrough) on the clue
//   number spans accordingly.


function updClues(row, col, isInitial = false) {
    if (!cur) return;

    // Bypass rewards if this is an automated start-of-level reveal ---
    if (isInitial) return;

    const sol = cur.grid;
    const rows = sol.length;
    const cols = sol[0].length;

    // keystone_dead_reckoning (264): check if 25% threshold reached
    if (typeof _deadReckoningCheckUnlock === 'function') _deadReckoningCheckUnlock();

    // Check the affected row 
    // A row is "done" when every cell that should be filled (sol === 1)
    // is currently filled by the player (userGrid === 1 or revealedGrid)
    // AND has no wrong mark on it.
    const rowDone = sol[row].every((v, c) => {
        if (v !== 1) return true;                          // empty-solution cell: irrelevant
        if (wrongGrid[row][c]) return false;               // wrong mark on a correct cell
        return userGrid[row][c] === 1 || revealedGrid[row][c]; // must be filled
    });

    // Apply or remove strikethrough on every row clue span for this row
    // Span ids: rn-{row}-{i}  (one per clue number in the row)
    const RC = sol.map(r => clues(r));
    const rowFlags = getSolvedClueFlags(RC[row], userGrid[row], sol[row]);
    RC[row].forEach((_, i) => {
        const span = document.getElementById(`rn-${row}-${i}`);
        if (span) span.classList.toggle('clue-done', rowDone || rowFlags[i]);
    });

    if (rowDone && userGrid[row][col] === 1 && !revealedGrid[row][col]) _sparsePriorOnLineComplete(row, true);

    // Check the affected column 
    const colDone = sol.every((r, ro) => {
        if (r[col] !== 1) return true;
        if (wrongGrid[ro][col]) return false;
        return userGrid[ro][col] === 1 || revealedGrid[ro][col];
    });

    // Apply or remove strikethrough on every column clue span for this col.
    const CC = Array.from({ length: sol[0].length }, (_, c) => clues(sol.map(r => r[c])));
    const colUserLine = userGrid.map(r => r[col]);
    const colSolLine = sol.map(r => r[col]);
    const colFlags = getSolvedClueFlags(CC[col], colUserLine, colSolLine);
    document.querySelectorAll(`[id^="cn-${col}-"]`).forEach((span, i) => {
        span.classList.toggle('clue-done', colDone || colFlags[i]);
    });

    if (colDone && userGrid[row][col] === 1 && !revealedGrid[row][col]) _sparsePriorOnLineComplete(col, false);

    // keystone_asymptotic_mastery (266): count newly completed lines to reduce future penalties
    if (ptHasSkill('keystone_asymptotic_mastery')) {
        const cellJustFilledForAsymptote = (sol[row][col] === 1) && (userGrid[row][col] === 1 || revealedGrid[row][col]);
        if (cellJustFilledForAsymptote) {
            if (rowDone) window._asymptoticLinesCompleted = (window._asymptoticLinesCompleted || 0) + 1;
            if (colDone) window._asymptoticLinesCompleted = (window._asymptoticLinesCompleted || 0) + 1;
        }
    }

    _signalToNoiseCheckRestore();
    if (sol[row][col] === 1 && (userGrid[row][col] === 1 || revealedGrid[row][col])) {
        _entropyDrainUpdateProgress(row, col);
    }




    // regression_reward (225-227): only award when this specific cell was the final piece.
    // _regressionRewardedLines tracks rows ('r0', 'r1'...) and cols ('c0', 'c1'...)
    // that have already paid out, so overmark-then-reveal exploits don't double-dip.
    if (ptHasSkill('regression_reward_1') || ptHasSkill('regression_reward_2') || ptHasSkill('regression_reward_3')) {
        let bonus = 0;
        if (ptHasSkill('regression_reward_1')) bonus += 5;
        if (ptHasSkill('regression_reward_2')) bonus += 5;
        if (ptHasSkill('regression_reward_3')) bonus += 5;

        if (!window._regressionRewardedLines) window._regressionRewardedLines = new Set();

        const sol = cur.grid;
        const cellJustFilled = (sol[row][col] === 1) && (userGrid[row][col] === 1) && !revealedGrid[row][col];
        if (!cellJustFilled) return; // only trigger on a genuine player fill, not revealed cells or erasure

        if (cellJustFilled && rowDone && bonus > 0 && !window._regressionRewardedLines.has(`r${row}`)) {
            window._regressionRewardedLines.add(`r${row}`);
            timerSecs += bonus;
            updTimer();
            showToast(`📉 ${LANG === 'de' ? `+${bonus}s (Regressions-Belohnung)` : `+${bonus}s (Regression Reward)`}`);
        }
        if (cellJustFilled && colDone && bonus > 0 && !window._regressionRewardedLines.has(`c${col}`)) {
            window._regressionRewardedLines.add(`c${col}`);
            timerSecs += bonus;
            updTimer();
            showToast(`📉 ${LANG === 'de' ? `+${bonus}s (Regressions-Belohnung)` : `+${bonus}s (Regression Reward)`}`);
        }
    }

    // residual_analysis (249-251): when a row/col is completed, roll a chance to auto-mark 
    // exactly 1 wrong empty cell in an adjacent row/col. Chance scales with nodes (max 40%).
    if (!window._oracleActive && !ptHasSkill('keystone_ergodic_field') && (ptHasSkill('residual_analysis_1') || ptHasSkill('residual_analysis_2') || ptHasSkill('residual_analysis_3'))) {
        let activationChance = 0;

        if (ptHasSkill('residual_analysis_1')) activationChance += 0.25; // Node 1: 25% base
        if (ptHasSkill('residual_analysis_2')) activationChance += 0.05; // Node 2: +5%
        if (ptHasSkill('residual_analysis_3')) activationChance += 0.10; // Node 3: +10%

        const cellJustFilled = (sol[row][col] === 1) && (userGrid[row][col] === 1 || revealedGrid[row][col]);
        if (!cellJustFilled) return; // only trigger on a correct fill, not on erasure/undo

        if (!window._residualAnalysisRewardedLines) window._residualAnalysisRewardedLines = new Set();

        // Process Row Completion
        if (rowDone && !window._residualAnalysisRewardedLines.has(`r${row}`)) {
            window._residualAnalysisRewardedLines.add(`r${row}`);

            // Single RNG check based on the combined total chance
            if (Math.random() < activationChance) {
                const adjRows = [row - 1, row + 1].filter(r => r >= 0 && r < rows);
                if (adjRows.length > 1 && Math.random() < 0.5) adjRows.reverse();
                for (const adjR of adjRows) {
                    const cands = [];
                    for (let c = 0; c < cols; c++)
                        if (sol[adjR][c] === 0 && (userGrid[adjR][c] === 0 || userGrid[adjR][c] === 3) && !wrongGrid[adjR][c])
                            cands.push([adjR, c]);
                    if (cands.length > 0) {
                        // Grab exactly 1 random cell from the candidates
                        const [r, c] = cands[Math.floor(Math.random() * cands.length)];
                        userGrid[r][c] = 2;
                        renderCell(r, c);

                        if (_getBayesianBonus() > 0 && Math.random() < _getBayesianBonus()) {
                            _resetBayesianBonus();
                            markWrongTiles(1);
                        }
                        break; // only use one adjacent row
                    }
                }
            }
        }

        // Process Column Completion
        if (colDone && !window._residualAnalysisRewardedLines.has(`c${col}`)) {
            window._residualAnalysisRewardedLines.add(`c${col}`);

            // Single RNG check based on the combined total chance
            if (Math.random() < activationChance) {
                const adjCols = [col - 1, col + 1].filter(c => c >= 0 && c < cols);
                if (adjCols.length > 1 && Math.random() < 0.5) adjCols.reverse();
                for (const adjC of adjCols) {
                    const cands = [];
                    for (let r = 0; r < rows; r++)
                        if (sol[r][adjC] === 0 && (userGrid[r][adjC] === 0 || userGrid[r][adjC] === 3) && !wrongGrid[r][adjC])
                            cands.push([r, adjC]);
                    if (cands.length > 0) {
                        // Grab exactly 1 random cell from the candidates
                        const [r, c] = cands[Math.floor(Math.random() * cands.length)];
                        userGrid[r][c] = 2;
                        renderCell(r, c);

                        if (_getBayesianBonus() > 0 && Math.random() < _getBayesianBonus()) {
                            _resetBayesianBonus();
                            markWrongTiles(1);
                        }
                        break; // only use one adjacent column
                    }
                }
            }
        }
    }    
}








//------------------------------------------------------------------------
//-------------------------CELL RENDERER----------------------------------
//-------------updates grid cells based on their status-------------------
//------------------------------------------------------------------------


// renderCell(row, col) — updates the visual CSS classes of a single grid
//   cell to reflect its current state in userGrid / wrongGrid / revealedGrid.
//
//   Priority order (highest wins):
//     1. wrongGrid[row][col] = true  → 'wrong-mark'  (red ✕, ignores userGrid)
//     2. revealedGrid[row][col] = true → 'filled' + 'revealed'  (green fill)
//     3. userGrid = 1                → 'filled'      (cyan fill)
//     4. userGrid = 2                → 'marked'      (grey ✕)
//     5. userGrid = 0                → no class      (empty cell)
//
//   All four state classes are removed first so there's never a combination
//   of conflicting classes on the same element.
function renderCell(row, col) {
    const el = document.getElementById(`g-${row}-${col}`);
    if (!el) return; // safety guard — cell might not exist yet

    // Clear all state classes before re-applying the correct one
    el.classList.remove('filled', 'marked', 'wrong-mark', 'revealed', 'questioned', 'cell-lucky');

    // DoF reverted style: re-apply if this cell is in the reverted set and still empty/unfilled
    const _dofWasReverted = window._dofRevertedCells && window._dofRevertedCells.has(`${row}-${col}`);
    // (will be re-added below at the end of renderCell if still eligible)
    el.classList.remove('dof-reverted');

    // Priority 1: wrong fill (red ✕) — overrides everything else
    if (wrongGrid[row][col]) {
        el.classList.add('wrong-mark');
        return;
    }

    // Priority 2: item-revealed cell (green fill, slightly different shade)
    if (revealedGrid[row][col]) {
        el.classList.add('filled', 'revealed');
        return;
    }

    // Priority 3 & 4: normal player-controlled state
    const v = userGrid[row][col];
    if (v === 1) el.classList.add('filled');
    else if (v === 2) el.classList.add('marked');
    else if (v === 3) el.classList.add('questioned');
    // v === 0: empty — check if this is a lucky tile (subtle shimmer hint)
    if (v === 0 && luckyTiles && luckyTiles.has(`${row}-${col}`)) {
        el.classList.add('cell-lucky');
    }

    // adjacency_matrix (302): refresh this cell's overlay AND all neighbours,
    // because filling one cell changes the count shown on surrounding cells.
    if (ptHasSkill('adjacency_matrix')) {
        _adjacencyMatrixUpdateOverlay(row, col);
        if (cur) {
            const rows = cur.grid.length, cols = cur.grid[0].length;
            for (let dr = -1; dr <= 1; dr++)
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr === 0 && dc === 0) continue;
                    const nr = row + dr, nc = col + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols)
                        _adjacencyMatrixUpdateOverlay(nr, nc);
                }
        }
    }

    // Re-apply DoF reverted ghost if this cell is tracked and still empty/uncorrected
    if (_dofWasReverted && userGrid[row][col] === 0 && !wrongGrid[row][col] && !revealedGrid[row][col]) {
        el.classList.add('dof-reverted');
    } else if (_dofWasReverted) {
        // Cell was filled or corrected — remove from tracking
        window._dofRevertedCells.delete(`${row}-${col}`);
    }


}



//------------------------------------------------------------------------
//-------------------REVEAL MINI GRID IN WIN OVERLAY----------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function buildReveal() {
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const ct = document.getElementById('ov-reveal');

    // Base size on the viewport's smaller dimension, with some padding
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxSize = Math.min(vw, vh) * 0.92;

    // Keep cells square: divide the max size by the larger dimension
    const maxDim = Math.max(rows, cols);
    const cellSize = Math.floor(maxSize / maxDim);

    const gridW = cellSize * cols + (cols - 1) * 3; // 3px = gap
    const gridH = cellSize * rows + (rows - 1) * 3;

    ct.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
    ct.style.gridTemplateRows = `repeat(${rows}, ${cellSize}px)`;
    ct.style.width = `${gridW}px`;
    ct.style.height = `${gridH}px`;
    ct.innerHTML = '';

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const d = document.createElement('div');
            d.className = 'ov-reveal-cell' + (sol[r][c] === 1 ? ' f' : '');
            ct.appendChild(d);
        }
    }
}




//------------------------------------------------------------------------
// adjacency_matrix (302): Minesweeper-style neighbour count overlays.
// Each empty cell shows how many of its 8 surrounding cells are solution
// cells (sol === 1) that have not yet been correctly filled by the player.
// Row/column clue headers are hidden when this node is active (see buildGrid).
//------------------------------------------------------------------------

// Returns the count of unfilled solution-cells surrounding (row, col).
// "Unfilled solution cell" = sol[r][c] === 1 AND not yet player-filled/revealed.
function _adjacencyMatrixCount(row, col) {
    if (!cur) return 0;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const r = row + dr, c = col + dc;
            if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
            if (sol[r][c] === 1 && userGrid[r][c] !== 1 && !revealedGrid[r][c]) count++;
        }
    }
    return count;
}

// Writes (or removes) the adjacency count overlay span inside a single cell.
// Shows on unfilled cells (userGrid !== 1, not revealed, not wrong).
// Count 0 is shown as blank to reduce noise.
function _adjacencyMatrixUpdateOverlay(row, col) {
    const el = document.getElementById(`g-${row}-${col}`);
    if (!el) return;

    // Remove any existing overlay first
    const old = el.querySelector('.adj-count');
    if (old) old.remove();

    // Only show the overlay on cells the player hasn't filled/flagged yet
    const isFilled = userGrid[row][col] === 1 || revealedGrid[row][col];
    const isWrong = wrongGrid[row][col];
    if (isFilled || isWrong) return;

    const count = _adjacencyMatrixCount(row, col);
    if (count === 0) return; // blank for 0, like Minesweeper

    const span = document.createElement('span');
    span.className = `adj-count adj-count-${count}`;
    span.textContent = count;
    el.appendChild(span);
}

// Refreshes adjacency overlays for all cells on the board.
// Called at level start (after grid DOM is ready) and after bulk reveals.
function _adjacencyMatrixRefreshAll() {
    if (!ptHasSkill('adjacency_matrix') || !cur) return;
    const rows = cur.grid.length, cols = cur.grid[0].length;
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            _adjacencyMatrixUpdateOverlay(r, c);
}