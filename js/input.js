// ═══════════════════════════════════════════════
//  INPUT  (input.js)
//  Handles all mouse interaction with the puzzle
//  grid: clicking, dragging, hovering, and the
//  resulting penalty when a wrong cell is filled.
// ═══════════════════════════════════════════════

// painting — true while the player is holding the mouse button down and
//            dragging across cells (paint mode). Set to true on mousedown,
//            reset to false on mouseup (sp() called from main.js).
// pval     — the value being painted during a drag stroke:
//              0 = erase, 1 = fill (left-click), 2 = mark-empty (right-click)
//            Determined once on mousedown and kept constant for the whole stroke
//            so dragging toggles consistently (e.g. dragging over filled cells
//            erases them all rather than toggling each one individually).
// mbtn     — which mouse button started the current stroke (0 = left, 2 = right)
let painting = false, pval = 0, mbtn = 0;


// ═══════════════════════════════════════════════
//  CROSSHAIR / HOVER HIGHLIGHT
//  When the cursor is over a cell, the entire row
//  and column are tinted to help the player track
//  which clues belong to the current cell.
// ═══════════════════════════════════════════════

// hoverRow / hoverCol — the grid coordinates of the cell currently under
//   the cursor. Both are -1 when the cursor is outside the grid.
let hoverRow = -1, hoverCol = -1;

// onHover(e, row, col) — fired by onmouseenter on every grid cell.
//   1. If the cursor moved to a different cell, clears the old crosshair
//      and draws a new one at (row, col).
//   2. If the player is mid-drag (painting), also applies the stroke to
//      this cell so painting works smoothly across multiple cells.
function onHover(e, row, col) {
    if (row !== hoverRow || col !== hoverCol) {
        clearHover();           // remove highlight from the old cell
        hoverRow = row;
        hoverCol = col;
        applyHover(row, col);   // apply highlight to the new cell
    }
    // Continue painting if the mouse button is still held
    if (painting && !dead) ac(row, col);
}

// onHoverOut(row, col) — fired by onmouseleave on every grid cell.
//   Only clears the crosshair if the cell being left is the one that is
//   currently highlighted. This prevents a stale clear when the browser
//   fires leave/enter events in a different order than expected.
function onHoverOut(row, col) {
    if (row === hoverRow && col === hoverCol) {
        clearHover();
        hoverRow = -1;
        hoverCol = -1;
    }
}

// clearHover — removes all crosshair CSS classes from the current row/column.
//   Touches four groups of elements:
//     - the row clue <td> on the left  (class: hov-row)
//     - all column header <td>s above  (class: hov-col)
//     - every grid cell in the row     (class: hov-r)
//     - every grid cell in the column  (class: hov-c)
//   Guard: returns immediately if hoverRow is -1 (nothing highlighted)
//   or if cur is null (no level loaded).
function clearHover() {
    if (hoverRow < 0 || !cur) return;
    const rows = cur.grid.length, cols = cur.grid[0].length;

    // Remove highlight from the row clue cell
    const rct = document.getElementById(`rct-${hoverRow}`);
    if (rct) rct.classList.remove('hov-row');

    // Remove highlight from all column header cells in this column
    // (there can be multiple stacked header rows for multi-number clues)
    document.querySelectorAll(`.cch-${hoverCol}`)
        .forEach(el => el.classList.remove('hov-col'));

    // Remove row tint from every cell in the hovered row
    for (let c = 0; c < cols; c++) {
        const g = document.getElementById(`g-${hoverRow}-${c}`);
        if (g) g.classList.remove('hov-r');
    }

    // Remove column tint from every cell in the hovered column
    for (let r = 0; r < rows; r++) {
        const g = document.getElementById(`g-${r}-${hoverCol}`);
        if (g) g.classList.remove('hov-c');
    }
}

// applyHover(row, col) — adds crosshair CSS classes to the new row/column.
//   Mirror image of clearHover: adds the same four groups of classes.
//   The CSS rules in styles.css turn these into a faint tint that forms a
//   cross, with a brighter highlight at the intersecting (hovered) cell.
function applyHover(row, col) {
    if (!cur) return;
    const rows = cur.grid.length, cols = cur.grid[0].length;

    // Highlight the row clue cell
    const rct = document.getElementById(`rct-${row}`);
    if (rct) rct.classList.add('hov-row');

    // Highlight all column header cells in this column
    document.querySelectorAll(`.cch-${col}`)
        .forEach(el => el.classList.add('hov-col'));

    // Tint every cell in the row
    for (let c = 0; c < cols; c++) {
        const g = document.getElementById(`g-${row}-${c}`);
        if (g) g.classList.add('hov-r');
    }

    // Tint every cell in the column
    for (let r = 0; r < rows; r++) {
        const g = document.getElementById(`g-${r}-${col}`);
        if (g) g.classList.add('hov-c');
    }
}


// ═══════════════════════════════════════════════
//  MOUSE BUTTON HANDLERS
// ═══════════════════════════════════════════════

// cd (cell-down) — fires on mousedown on a grid cell.
//   1. Prevents the context menu from appearing on right-click.
//   2. Bails out immediately if the game is over (dead).
//   3. Records which button was pressed and sets painting = true.
//   4. Determines pval (what the drag should do):
//        Left-click  (mbtn 0): toggle between filled (1) and empty (0)
//        Right-click (mbtn 2): toggle between marked (2) and empty (0)
//      The toggle logic means clicking an already-filled cell will erase it,
//      and the same value is applied to every cell during the drag.
//   5. Immediately applies the action to the clicked cell via ac().
function cd(e, row, col) {
    e.preventDefault();
    if (dead) return;

    mbtn = e.button;
    painting = true;

    // Decide what value to paint for the duration of this drag stroke
    if (mbtn === 0) {
        pval = userGrid[row][col] === 1 ? 0 : 1; // left: fill or erase
    } else {
        // Cycle: 0 → 2 → 3 → 0
        if (userGrid[row][col] === 2) {
            pval = 3; // red cross → yellow question mark
        } else if (userGrid[row][col] === 3) {
            pval = 0; // yellow question mark → empty
        } else {
            pval = 2; // empty → red cross
        }
    }

    ac(row, col); // apply immediately to the cell that was clicked
}

// ce (cell-enter) — fires on mouseenter during a drag (legacy inline handler,
//   now superseded by the onHover path which also calls ac()).
//   Kept for safety but functionally redundant with the onHover + painting check.
function ce(e, row, col) {
    if (!painting || dead) return;
    ac(row, col);
}

// sp (stop-painting) — resets the painting flag.
//   Called by the global mouseup listener in main.js so releasing the mouse
//   button anywhere on the page ends the stroke, not just over the grid.
function sp() {
    painting = false;
}

// ac (apply-cell) — the core logic that actually changes a cell's state.
//   Called by cd() on click and by onHover() while dragging.
//   Decision tree:
//   1. Skip if the cell already has the target value (no-op on re-entry).
//   2. Skip if the cell was revealed by an item and we're trying to erase it.
//   3. If it's a left-click fill (pval === 1) AND the cell should be empty
//      in the solution (cur.grid[row][col] !== 1):
//        a. If the shield is active, consume it and show a toast instead.
//        b. Otherwise, mark the cell as wrong, render it, apply a time
//           penalty, and (in Hardcore mode) trigger an immediate game over.
//        c. Return — wrong fills do NOT update userGrid or check for a win.
//   4. For all valid moves (correct fill, erase, or right-click mark):
//      update userGrid, re-render the cell, refresh clue colours, and
//      check whether the puzzle is now complete.
function ac(row, col) {
    // No-op: cell already has the desired value
    if (userGrid[row][col] === pval) return;

    // Cannot erase a cell that was revealed by an item
    if (revealedGrid[row][col] && pval === 0) return;

    // Left-click fill: check against the solution
    if (mbtn === 0 && pval === 1) {
        if (cur.grid[row][col] !== 1) {
            // Wrong fill — check for shield before applying penalty
            if (shieldActive) {
                shieldActive = false;
                showToast(t('pen_shield'));
                return; // shield blocks the mistake entirely
            }

            // Mark the cell wrong and apply the time penalty
            wrongGrid[row][col] = true;
            renderCell(row, col);   // show the red ✕ (grid.js)
            applyPenalty();         // deduct time, show flash (below)

            // Hardcore mode: one mistake = instant game over
            if (curMods.hardcore) {
                dead = true;
                stopTimer();
                trackEvent('level_failed', {        
                    level_id: `${cur.world}-${cur.li}`,
                    world: cur.world,
                    level_index: cur.li,
                    difficulty: curDiff,
                    reason: 'hardcore_mistake',
                    mistakes: mistakeCount,
                });




                document.getElementById('lose-title').textContent = t('hc_fail_title');
                document.getElementById('lose-sub').textContent = t('hc_fail_sub');
                document.getElementById('ov-lose').classList.add('show');
            }
            return; // do not proceed to the normal update path
        }
    }

    // Valid move: update the data, refresh the display, and check for a win
    userGrid[row][col] = pval;
    renderCell(row, col);   // grid.js — re-draws the cell visual
    updClues(row, col);     // grid.js — refreshes clue number colours
    checkWin();             // scoring.js — tests whether the puzzle is solved
}


// ═══════════════════════════════════════════════
//  PENALTY
// ═══════════════════════════════════════════════

// applyPenalty — called every time the player makes a wrong fill.
//   1. Increments mistakeCount (used for bonus evaluation and score penalty).
//   2. Looks up the time penalty for this mistake number from DIFF_CFG.pens.
//      The array is capped: mistakes beyond the last index all use the
//      highest penalty value (e.g. in Hard mode, mistake 5+ all cost 180 s).
//   3. Subtracts the penalty from timerSecs (clamped to 0) and refreshes
//      the timer display.
//   4. Shows the penalty amount in the #pen-info element for 2.2 seconds,
//      with a stored timeout ID (pi._t) so rapid mistakes don't stack
//      multiple fadeout timers.
//   5. Triggers a brief red screen-flash (#pen-flash) for visual feedback.
//   6. If the timer has reached 0 after the penalty, triggers the loss screen.
function applyPenalty() {
    mistakeCount++;

    // Pick the penalty for this mistake (clamp to last array entry)
    const pens = DIFF_CFG[curDiff].pens;
    const pen = pens[Math.min(mistakeCount - 1, pens.length - 1)];

    // Deduct penalty seconds and refresh the clock display
    timerSecs = Math.max(0, timerSecs - pen);
    updTimer();

    // Show the penalty amount in the HUD, then clear it after 2.2 s
    const pi = document.getElementById('pen-info');
    pi.textContent = `−${pen}s (#${mistakeCount})`;
    const mc = document.getElementById('mistake-counter');
    if (mc) mc.textContent = `✗ ${mistakeCount}`;
    clearTimeout(pi._t); // cancel any previous hide timer
    pi._t = setTimeout(() => pi.textContent = '', 2200);

    // Brief red screen flash for visual feedback
    const fl = document.getElementById('pen-flash');
    fl.classList.add('show');
    setTimeout(() => fl.classList.remove('show'), 350);

    // If time ran out from this penalty, end the game immediately
    if (timerSecs <= 0) {
        dead = true;
        stopTimer();
        timesUp(); // timer.js
    }
}





