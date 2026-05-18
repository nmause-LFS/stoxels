


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

    // Check the affected column 
    const colDone = sol.every((r, ro) => {
        if (r[col] !== 1) return true;
        if (wrongGrid[ro][col]) return false;
        return userGrid[ro][col] === 1 || revealedGrid[ro][col];
    });

    // Apply or remove strikethrough on every column clue span for this col.
    // Column clue spans have ids: cn-{col}-{d}
    // We don't know mcd here so we just query all matching spans.
    document.querySelectorAll(`[id^="cn-${col}-"]`).forEach(span => {
        span.classList.toggle('clue-done', colDone);
    });
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

    // Scale cell size so the longest dimension fits in ~120 px
    const csz = Math.max(4, Math.min(22, Math.floor(120 / Math.max(rows, cols))));

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




