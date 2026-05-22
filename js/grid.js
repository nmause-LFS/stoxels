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
    manualZoomActive = false;

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

    let h = `<colgroup>` +
        Array(mrw).fill(`<col style="width:${fs + 7}px">`).join('') +
        Array(cols).fill(`<col style="width:${csz}px">`).join('') +
        `</colgroup><tbody>`;

    // Column clue header rows
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

    // Puzzle rows
    for (let row = 0; row < rows; row++) {
        h += `<tr>`;

        const rc = RC[row];
        const pad = mrw - rc.length;

        for (let i = 0; i < pad; i++) h += `<td class="corner"></td>`;

        for (let i = 0; i < rc.length; i++) {
            // Fixed: unique id per cell (rct-{row}-{i}) instead of duplicate id="rct-{row}"
            h += `<td class="rct rct-${row}" id="rct-${row}-${i}" style="font-size:${fs}px">` +
                `<div class="rcinner"><span id="rn-${row}-${i}" style="font-size:${fs}px">${rc[i]}</span></div>` +
                `</td>`;
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






//------------------------------------------------------------------------
// Function to add a visual strike through the row / column clue numbers 
// when a row / column is fully filled
//------------------------------------------------------------------------


// updClues(row, col) — called after every cell change.
//   Checks whether the affected row and column are now fully solved
//   (all correct cells filled, no wrong marks on correct cells) and
//   toggles the CSS class 'clue-done' (strikethrough) on the clue
//   number spans accordingly.


function updClues(row, col) {
    if (!cur) return;
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
    RC[row].forEach((_, i) => {
        const span = document.getElementById(`rn-${row}-${i}`);
        if (span) span.classList.toggle('clue-done', rowDone);
    });

    _sparsePriorOnLineComplete(row, true);

    // Check the affected column 
    const colDone = sol.every((r, ro) => {
        if (r[col] !== 1) return true;
        if (wrongGrid[ro][col]) return false;
        return userGrid[ro][col] === 1 || revealedGrid[ro][col];
    });

    // Apply or remove strikethrough on every column clue span for this col.
    document.querySelectorAll(`[id^="cn-${col}-"]`).forEach(span => {
        span.classList.toggle('clue-done', colDone);
    });

    _sparsePriorOnLineComplete(col, false);

    // keystone_asymptotic_mastery (266): count newly completed lines to reduce future penalties
    if (ptHasSkill('keystone_asymptotic_mastery')) {
        const cellJustFilledForAsymptote = (sol[row][col] === 1) && (userGrid[row][col] === 1 || revealedGrid[row][col]);
        if (cellJustFilledForAsymptote) {
            if (rowDone) window._asymptoticLinesCompleted = (window._asymptoticLinesCompleted || 0) + 1;
            if (colDone) window._asymptoticLinesCompleted = (window._asymptoticLinesCompleted || 0) + 1;
        }
    }

    _signalToNoiseCheckRestore();
    _entropyDrainUpdateProgress(row, col);

    // regression_reward (225-227): only award when this specific cell was the final piece.
    if (ptHasSkill('regression_reward_1') || ptHasSkill('regression_reward_2') || ptHasSkill('regression_reward_3')) {
        let bonus = 0;
        if (ptHasSkill('regression_reward_1')) bonus += 5;
        if (ptHasSkill('regression_reward_2')) bonus += 10;
        if (ptHasSkill('regression_reward_3')) bonus += 15;

        // A line was "just completed by this cell" only if this cell is solution=1
        // and the line is now done. We verify the cell is the trigger (sol===1, now filled).
        const sol = cur.grid;
        const cellJustFilled = (sol[row][col] === 1) && (userGrid[row][col] === 1 || revealedGrid[row][col]);

        if (cellJustFilled && rowDone && bonus > 0) {
            timerSecs += bonus;
            updTimer();
            showToast(`📉 ${LANG === 'de' ? `+${bonus}s (Regressions-Belohnung)` : `+${bonus}s (Regression Reward)`}`);
        }
        if (cellJustFilled && colDone && bonus > 0) {
            timerSecs += bonus;
            updTimer();
            showToast(`📉 ${LANG === 'de' ? `+${bonus}s (Regressions-Belohnung)` : `+${bonus}s (Regression Reward)`}`);
        }
    }

    // residual_analysis (249-251): when a row/col is completed, mark wrong empty cells
    // in an adjacent row/col. 1 cell per node (1, 2, or 3 total).
    if (ptHasSkill('residual_analysis_1') || ptHasSkill('residual_analysis_2') || ptHasSkill('residual_analysis_3')) {
        let markCount = 0;
        if (ptHasSkill('residual_analysis_1')) markCount++;
        if (ptHasSkill('residual_analysis_2')) markCount++;
        if (ptHasSkill('residual_analysis_3')) markCount++;

        const cellJustFilled = (sol[row][col] === 1) && (userGrid[row][col] === 1 || revealedGrid[row][col]);
        if (!cellJustFilled) return; // only trigger on a correct fill, not on erasure/undo

        if (rowDone) {
            // Pick an adjacent row (row-1 or row+1) that exists and is not done
            const adjRows = [row - 1, row + 1].filter(r => r >= 0 && r < rows);
            // Shuffle so we don't always prefer the same direction
            if (adjRows.length > 1 && Math.random() < 0.5) adjRows.reverse();
            for (const adjR of adjRows) {
                const cands = [];
                for (let c = 0; c < cols; c++)
                    if (sol[adjR][c] === 0 && (userGrid[adjR][c] === 0 || userGrid[adjR][c] === 3) && !wrongGrid[adjR][c])
                        cands.push([adjR, c]);
                if (cands.length > 0) {
                    // shuffle and take up to markCount
                    for (let i = cands.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [cands[i], cands[j]] = [cands[j], cands[i]];
                    }
                    cands.slice(0, markCount).forEach(([r, c]) => {
                        userGrid[r][c] = 2;
                        renderCell(r, c);
                    });
                    break; // only use one adjacent row
                }
            }
        }

        if (colDone) {
            const adjCols = [col - 1, col + 1].filter(c => c >= 0 && c < cols);
            if (adjCols.length > 1 && Math.random() < 0.5) adjCols.reverse();
            for (const adjC of adjCols) {
                const cands = [];
                for (let r = 0; r < rows; r++)
                    if (sol[r][adjC] === 0 && (userGrid[r][adjC] === 0 || userGrid[r][adjC] === 3) && !wrongGrid[r][adjC])
                        cands.push([r, adjC]);
                if (cands.length > 0) {
                    for (let i = cands.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [cands[i], cands[j]] = [cands[j], cands[i]];
                    }
                    cands.slice(0, markCount).forEach(([r, c]) => {
                        userGrid[r][c] = 2;
                        renderCell(r, c);
                    });
                    break;
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



/*

function buildReveal() {
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    const ct = document.getElementById('ov-reveal');

    // Fill the viewport: subtract padding (60px each side) and use fr units
    ct.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    ct.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    ct.innerHTML = '';

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const d = document.createElement('div');
            d.className = 'ov-reveal-cell' + (sol[r][c] === 1 ? ' f' : '');
            ct.appendChild(d);
        }
    }
}

*/