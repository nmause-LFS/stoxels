// Handles mouse interactions with the grid


let painting = false;       // true while the player is dragging across cells with the mouse button held down

let hoverRow = -1;          // row currently hovered by the mouse, -1 if none

let hoverCol = -1;          // column currently hovered by the mouse, -1 if none





//------------------------------------------------------------------------
//---------------MOUSEOVER ROW/COLUMN HIGHLIGHT---------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function applyHover(row, col) {
    if (!cur) return;
    const rows = cur.grid.length, cols = cur.grid[0].length;

    // Highlight the row clue cell
    document.querySelectorAll(`.rct-${row}`)
        .forEach(el => el.classList.add('hov-row'));

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



// clearHover — removes all crosshair CSS classes from the current row/column.

function clearHover() {
    if (hoverRow < 0 || !cur) return;
    const rows = cur.grid.length, cols = cur.grid[0].length;

    // Remove highlight from the row clue cell
    document.querySelectorAll(`.rct-${hoverRow}`)
        .forEach(el => el.classList.remove('hov-row'));

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


// onHover fired by onmouseenter on every grid cell.
// If the cursor moved to a different cell, clears the old crosshair
//      and draws a new one at (row, col).
// If the player is mid-drag (painting), also applies the stroke to
//      this cell so painting works smoothly across multiple cells.
function onHover(e, row, col) {
    if (row !== hoverRow || col !== hoverCol) {
        clearHover();
        hoverRow = row;
        hoverCol = col;
        applyHover(row, col);
    }

    if (painting && !dead) {
        if (axisLockEnabled) {
            if (dragAxis === null && (row !== dragStartRow || col !== dragStartCol)) {
                if (row === dragStartRow) dragAxis = 'row';
                else if (col === dragStartCol) dragAxis = 'col';
                else dragAxis = 'row';
            }
            const allowed = dragAxis === null
                || (dragAxis === 'row' && row === dragStartRow)
                || (dragAxis === 'col' && col === dragStartCol);
            if (allowed) ac(row, col);
        } else {
            ac(row, col);
        }
    }
}


// onHoverOut fired by onmouseleave on every grid cell.
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












//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// _dragCounterApply — adds a stroke-count overlay number to a cell during a drag.
function _dragCounterApply(row, col, count) {
    const el = document.getElementById(`g-${row}-${col}`);
    if (!el) return;
    let overlay = el.querySelector('.drag-count-overlay');
    if (!overlay) {
        overlay = document.createElement('span');
        overlay.className = 'drag-count-overlay';
        el.appendChild(overlay);
    }
    overlay.textContent = count;
}

// _dragCounterClear — removes all stroke-count overlays from the board.
function _dragCounterClear() {
    document.querySelectorAll('.drag-count-overlay').forEach(el => el.remove());
}




//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------









//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------





