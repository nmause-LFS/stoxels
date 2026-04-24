// ═══════════════════════════════════════════════
//  GRID  (grid.js)
//  Responsible for everything visual about the
//  puzzle grid itself:
//    - Computing clue numbers from a solution row/column
//    - Building the full <table> HTML for a puzzle
//    - Scaling and zooming the puzzle to fit the viewport
//    - Re-rendering individual cells when their state changes
//
//  LAYOUT OVERVIEW:
//  The puzzle lives inside a CSS transform wrapper:
//    #puzzle-scaler-wrap   — outer div; its height/width are set
//                            explicitly in JS so the page scrolls
//                            correctly when zoomed in
//      #puzzle-scaler      — inner div; transform:scale() is applied here
//        #ptable           — the actual <table> with clue rows/cols + grid
// ═══════════════════════════════════════════════


// ═══════════════════════════════════════════════
//  CLUE CALCULATION
// ═══════════════════════════════════════════════

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
    return r.length ? r : [0]; // empty line → [0] so the clue cell renders "0"
}


// ═══════════════════════════════════════════════
//  SCALE & ZOOM CONSTANTS
//  Adjust these three values to control how the
//  puzzle fits in the browser window.
// ═══════════════════════════════════════════════

// SCALE_FILL_W — fraction of the viewport WIDTH the puzzle should occupy.
//   0.90 means the puzzle can use up to 90 % of the window width.
//   Lower = narrower / smaller puzzle.
const SCALE_FILL_W = 0.90;

// SCALE_FILL_H — fraction of the viewport HEIGHT the puzzle may use.
//   0.72 leaves room for the meta-bar above and inventory strip below.
//   Lower = shorter / smaller puzzle.
const SCALE_FILL_H = 0.72;

// SCALE_MAX — hard upper ceiling on the auto-scale factor.
//   Prevents tiny 5×5 puzzles from becoming enormous on large monitors.
const SCALE_MAX = 2.4;

// currentZoom     — the scale factor currently applied to #puzzle-scaler.
//                   Updated by scalePuzzle() (auto) or the Ctrl+Wheel handler (manual).
// manualZoomActive— true once the player has used Ctrl+Wheel to zoom manually.
//                   While true, scalePuzzle() will NOT override their chosen zoom.
//                   Reset to false when a new level loads (buildGrid).
let currentZoom = 1;
let manualZoomActive = false;


// ═══════════════════════════════════════════════
//  AUTO-SCALE
// ═══════════════════════════════════════════════

// scalePuzzle — calculates and applies the best-fit scale for the current
//   puzzle grid relative to the viewport.
//   Steps:
//   1. Temporarily resets the transform to scale(1) so we can measure the
//      element's natural (unscaled) pixel dimensions.
//   2. Calculates the maximum scale that fits within SCALE_FILL_W/H of the
//      viewport, capped at SCALE_MAX.
//   3. Only updates currentZoom if the player hasn't manually zoomed —
//      this preserves manual zoom across e.g. window resize events.
//   4. Calls applyZoom() to write the transform and fix wrapper dimensions.
//   Called by: buildGrid() (after DOM paint), the resize listener (main.js),
//   and the Ctrl+Wheel handler resets zoom via applyZoom() directly.
function scalePuzzle() {
    const scaler = document.getElementById('puzzle-scaler');
    if (!scaler) return;

    // Measure natural size with no transform applied
    scaler.style.transform = 'scale(1)';
    const naturalW = scaler.offsetWidth;
    const naturalH = scaler.offsetHeight;

    const availW = window.innerWidth * SCALE_FILL_W;
    const availH = window.innerHeight * SCALE_FILL_H;

    // Use the smaller of width-fit and height-fit so nothing overflows
    const autoScale = Math.min(availW / naturalW, availH / naturalH, SCALE_MAX);

    // Respect manual zoom — only overwrite if the player hasn't zoomed
    if (!manualZoomActive) {
        currentZoom = autoScale;
    }

    applyZoom();
}

// applyZoom — writes currentZoom to the CSS transform and resizes the
//   wrapper div so the browser's scrollbars appear correctly when zoomed in.
//   Why resize the wrapper?  CSS transform does NOT affect layout flow —
//   the element keeps its original footprint in the document even after
//   scaling. By explicitly setting the wrapper's height and minWidth to
//   the post-scale dimensions, we force the page to scroll properly when
//   the player has zoomed in beyond the viewport bounds.
function applyZoom() {
    const scaler = document.getElementById('puzzle-scaler');
    const wrap = document.getElementById('puzzle-scaler-wrap');
    if (!scaler || !wrap) return;

    scaler.style.transform = `scale(${currentZoom})`;

    // Make the wrapper occupy the actual rendered footprint of the scaled content
    wrap.style.height = (scaler.offsetHeight * currentZoom) + 'px';
    wrap.style.minWidth = (scaler.offsetWidth * currentZoom) + 'px';
}


// ═══════════════════════════════════════════════
//  CTRL+WHEEL MANUAL ZOOM
//  Allows the player to zoom in/out on the puzzle
//  by holding Ctrl (or Cmd on Mac) and scrolling.
//  Only activates when the cursor is inside the
//  puzzle wrapper — scrolling elsewhere on the
//  page behaves normally.
// ═══════════════════════════════════════════════
document.addEventListener('wheel', (e) => {
    // Only intercept if Ctrl/Cmd is held
    if (!e.ctrlKey) return;

    // Only intercept if the cursor is inside the puzzle wrapper
    const wrap = e.target.closest('#puzzle-scaler-wrap');
    if (!wrap) return;

    e.preventDefault(); // block the browser's own Ctrl+Wheel page-zoom

    manualZoomActive = true; // flag so scalePuzzle() stops overriding zoom

    const zoomSpeed = 0.15; // scale units changed per scroll tick
    if (e.deltaY < 0) {
        currentZoom += zoomSpeed; // scroll up = zoom in
    } else {
        currentZoom -= zoomSpeed; // scroll down = zoom out
    }

    // Clamp: 0.3 prevents flipping to negative scale; 5.0 is a sensible max
    currentZoom = Math.max(0.3, Math.min(currentZoom, 5.0));
    applyZoom();
}, { passive: false }); // passive:false is required to allow e.preventDefault()


// ═══════════════════════════════════════════════
//  BUILD GRID
// ═══════════════════════════════════════════════

// buildGrid — constructs the entire puzzle <table> as an HTML string and
//   injects it into #ptable, then triggers auto-scaling.
//   Called once per level from startLevel() (screens.js).
//
//   TABLE STRUCTURE:
//   The table has two logical zones:
//
//   ┌──────────────┬─────────────────────────────┐
//   │ corner cells │  column clue header rows     │  ← mcd rows
//   ├──────────────┼─────────────────────────────┤
//   │ row clue tds │  playable grid cells (gc)   │  ← rows rows
//   └──────────────┴─────────────────────────────┘
//     ← mrw cols →  ←        cols cols          →
//
//   mcd = max column clue depth  (tallest column clue stack)
//   mrw = max row clue width     (widest row clue, i.e. most numbers)
//
//   CELL SIZING:
//   csz (cell size in px) and fs (font size in px) are chosen based on
//   the largest puzzle dimension so that all puzzle sizes look good at
//   their natural size before scaling shrinks them down to fit.
//
//   GROUP DIVIDERS:
//   Every 5th column gets class 'br' (border-right) and every 5th row
//   gets class 'bb' (border-bottom) — these are the faint cyan lines
//   that divide the grid into 5×5 blocks, making large puzzles easier
//   to navigate. The last row/column is excluded to avoid a border on
//   the outer edge.
//
//   DOUBLE rAF DELAY:
//   scalePuzzle() is called inside two nested requestAnimationFrame calls.
//   One rAF would fire before the browser has finished painting the new
//   table; two rAFs guarantees the layout is fully settled so offsetWidth
//   and offsetHeight return accurate values.
function buildGrid() {
    manualZoomActive = false; // reset manual zoom so auto-scale takes over for the new level

    const sol = cur.grid;
    const rows = sol.length;
    const cols = sol[0].length;
    const maxDim = Math.max(rows, cols);

    // Cell and font sizes chosen by puzzle dimension bracket:
    //   ≤5  → large cells (5×5 beginner puzzles)
    //   ≤10 → medium-large
    //   ≤15 → medium
    //   ≤20 → smaller
    //   >20 → dynamic minimum (for very large non-square grids)
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

    // Compute all row clues (RC) and column clues (CC)
    const RC = sol.map(row => clues(row));                                 // one clue array per row
    const CC = Array.from({ length: cols }, (_, c) => clues(sol.map(r => r[c]))); // one per column

    const mcd = Math.max(...CC.map(c => c.length)); // max depth of column clue stacks
    const mrw = Math.max(...RC.map(r => r.length)); // max width of row clue lists

    // ── <colgroup> ─────────────────────────────────────────────────────────
    // Defines pixel widths for all columns:
    //   First mrw columns  = clue columns (narrower, font-size based)
    //   Remaining cols     = grid columns (cell-size based)
    let h = `<colgroup>` +
        Array(mrw).fill(`<col style="width:${fs + 7}px">`).join('') +
        Array(cols).fill(`<col style="width:${csz}px">`).join('') +
        `</colgroup><tbody>`;

    // ── Column clue header rows ────────────────────────────────────────────
    // One <tr> per depth level (d = 0 is the top row of clue numbers).
    // For each column, a clue number is only shown if this depth row
    // corresponds to an actual number for that column's clue array.
    // The offset calculation bottom-aligns shorter clue stacks:
    //   off = mcd - cl.length  (how many empty rows sit above this column's clues)
    //   num = only show if d >= off (i.e. we've reached this column's first number)
    for (let d = 0; d < mcd; d++) {
        // Corner cells fill the top-left intersection of clue rows × clue cols
        h += `<tr>${Array(mrw).fill(`<td class="corner"></td>`).join('')}`;

        for (let col = 0; col < cols; col++) {
            const cl = CC[col];
            const off = mcd - cl.length;            // blank rows above this column's clues
            const num = d >= off ? cl[d - off] : null; // null = empty cell for this slot

            // The very first row (d===0) gets an id for potential arrow/tooltip anchoring
            const isTop = (d === 0);
            h += `<td class="cch cch-${col}" ${isTop ? `id="cchtop-${col}"` : ''} style="height:${fs + 3}px">`;

            if (num !== null) {
                h += `<div class="ccinner"><span id="cn-${col}-${d}" style="font-size:${fs}px">${num}</span></div>`;
            }
            h += `</td>`;
        }
        h += `</tr>`;
    }

    // ── Puzzle rows (row clues + playable cells) ───────────────────────────
    for (let row = 0; row < rows; row++) {
        h += `<tr>`;

        const rc = RC[row];
        const pad = mrw - rc.length; // empty corner cells to right-align shorter clue lists

        // Pad with empty corner cells so shorter clue lists are right-aligned
        for (let i = 0; i < pad; i++) h += `<td class="corner"></td>`;

        // Row clue cells (one <td> per number in this row's clue)
        // All share the same id (rct-{row}) so the hover highlight can target the whole row header
        for (let i = 0; i < rc.length; i++) {
            h += `<td class="rct rct-${row}" id="rct-${row}" style="font-size:${fs}px">` +
                `<div class="rcinner"><span id="rn-${row}-${i}" style="font-size:${fs}px">${rc[i]}</span></div>` +
                `</td>`;
        }

        // Playable grid cells
        for (let col = 0; col < cols; col++) {
            // Group divider classes — faint lines every 5 cells to aid navigation
            const br = (col + 1) % 5 === 0 && col < cols - 1 ? ' br' : ''; // right border
            const bb = (row + 1) % 5 === 0 && row < rows - 1 ? ' bb' : ''; // bottom border

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

    tbl.innerHTML = h; // write the entire table in one DOM operation (fast)

    // Wait two animation frames so the browser has finished painting before
    // measuring natural dimensions for the scale calculation
    requestAnimationFrame(() => requestAnimationFrame(scalePuzzle));
}


// ═══════════════════════════════════════════════
//  CLUE COLOUR HELPERS
//  lstat() computes whether a row/column's current
//  fill state matches, exceeds, or is still pending
//  its clue. updClues() is the hook called after
//  every cell change — currently a no-op because
//  clue colouring is disabled, but the function
//  is kept so the call sites in input.js and
//  inventory.js don't need to change if you want
//  to re-enable it in the future.
// ═══════════════════════════════════════════════

// lstat(line, clue) — computes the status of one row or column line.
//   line  — the current userGrid values for that line (array of 0/1/2)
//   clue  — the target clue array (e.g. [3, 1])
//   Returns:
//     'd' (done)    — the filled cells exactly match the clue
//     'o' (over)    — at least one run exceeds its corresponding clue number
//     'p' (pending) — still in progress, nothing overflowed
//   Note: only filled cells (value 1) are considered; marks (value 2) are
//   treated as empty for clue-checking purposes.
function lstat(line, clue) {
    // Convert to binary (1/0) treating marks as empty, then compute runs
    const a = clues(line.map(v => v === 1 ? 1 : 0));
    if (JSON.stringify(a) === JSON.stringify(clue)) return 'd'; // exact match
    for (let i = 0; i < a.length; i++) {
        if (a[i] > (clue[i] || 0)) return 'o'; // any run is too long
    }
    return 'p'; // still valid, keep going
}

// updClues(row, col) — hook called after every cell change.
//   Currently a no-op: clue number colouring (green when done, red when
//   over) is disabled in this version to keep the UI clean.
//   To re-enable it: add logic here that calls lstat() for the affected
//   row and column and applies CSS classes to the clue <span> elements
//   (ids: rn-{row}-{i} for row clues, cn-{col}-{d} for column clues).
function updClues(row, col) {
    // Intentionally empty — clue colours are static in the current build
}


// ═══════════════════════════════════════════════
//  CELL RENDERER
// ═══════════════════════════════════════════════

// renderCell(row, col) — updates the visual CSS classes of a single grid
//   cell to reflect its current state in userGrid / wrongGrid / revealedGrid.
//   Called by: ac() in input.js (on every cell change), revealTiles() and
//   markWrongTiles() in inventory.js, and the board-reset in cursedReveal.
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
    el.classList.remove('filled', 'marked', 'wrong-mark', 'revealed');

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
    if (v === 1) el.classList.add('filled');  // left-click fill
    else if (v === 2) el.classList.add('marked');  // right-click mark (✕)
    // v === 0: empty — no class needed (default appearance)
}
