// mouse-over.js
// Handles all mouse interaction with the nonogram grid:
//   - crosshair highlight when hovering over a cell
//   - drag-painting strokes across multiple cells
//   - drag-counter overlays shown during a stroke


//------------------------------------------------------------------------
//-------------------STATE VARIABLES--------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// True while the player holds the mouse button and drags across cells.
let painting = false;

// The row/column index of the cell currently under the cursor.
// Both are -1 when the cursor is outside the grid.
let hoverRow = -1;
let hoverCol = -1;


//------------------------------------------------------------------------
//-------------------CROSSHAIR HIGHLIGHT - HELPERS------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Adds the highlight class to all row-clue cells that belong to this row.
function _highlightRowClue(row) {
    document.querySelectorAll(`.rct-${row}`)
        .forEach(el => el.classList.add('hov-row'));
}

// Adds the highlight class to all column-header cells that belong to this column.
// (A column can have multiple stacked header cells for multi-number clues.)
function _highlightColClue(col) {
    document.querySelectorAll(`.cch-${col}`)
        .forEach(el => el.classList.add('hov-col'));
}

// Adds the row-tint class to every grid cell in the given row.
function _highlightRowCells(row) {
    const cols = cur.grid[0].length;
    for (let c = 0; c < cols; c++) {
        const cell = document.getElementById(`g-${row}-${c}`);
        if (cell) cell.classList.add('hov-r');
    }
}

// Adds the column-tint class to every grid cell in the given column.
function _highlightColCells(col) {
    const rows = cur.grid.length;
    for (let r = 0; r < rows; r++) {
        const cell = document.getElementById(`g-${r}-${col}`);
        if (cell) cell.classList.add('hov-c');
    }
}

// Removes the highlight class from all row-clue cells that belong to this row.
function _clearRowClue(row) {
    document.querySelectorAll(`.rct-${row}`)
        .forEach(el => el.classList.remove('hov-row'));
}

// Removes the highlight class from all column-header cells that belong to this column.
function _clearColClue(col) {
    document.querySelectorAll(`.cch-${col}`)
        .forEach(el => el.classList.remove('hov-col'));
}

// Removes the row-tint class from every grid cell in the given row.
function _clearRowCells(row) {
    const cols = cur.grid[0].length;
    for (let c = 0; c < cols; c++) {
        const cell = document.getElementById(`g-${row}-${c}`);
        if (cell) cell.classList.remove('hov-r');
    }
}

// Removes the column-tint class from every grid cell in the given column.
function _clearColCells(col) {
    const rows = cur.grid.length;
    for (let r = 0; r < rows; r++) {
        const cell = document.getElementById(`g-${r}-${col}`);
        if (cell) cell.classList.remove('hov-c');
    }
}


//------------------------------------------------------------------------
//-------------------CROSSHAIR HIGHLIGHT - MAIN---------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// applyHover — draws the crosshair highlight on the row and column
//   that pass through (row, col): tints the clue cells and all grid cells
//   along both axes.
function applyHover(row, col) {
    if (!cur) return;
    _highlightRowClue(row);
    _highlightColClue(col);
    _highlightRowCells(row);
    _highlightColCells(col);
}

// clearHover — removes the crosshair highlight from the row and column
//   that were previously highlighted.
//   Early-exits if nothing is currently hovered or there is no active puzzle.
function clearHover() {
    if (hoverRow < 0 || !cur) return;
    _clearRowClue(hoverRow);
    _clearColClue(hoverCol);
    _clearRowCells(hoverRow);
    _clearColCells(hoverCol);
}


//------------------------------------------------------------------------
//-------------------DRAG PAINTING - HELPERS------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns true if the given cell is reachable under the current axis-lock rules.
// When axisLockEnabled is off, every cell is always reachable.
// When it is on, only cells on the locked axis (row or column) are reachable.
function _isDragCellAllowed(row, col) {
    if (!axisLockEnabled) return true;

    // Determine the axis on the first movement away from the drag-start cell.
    if (dragAxis === null && (row !== dragStartRow || col !== dragStartCol)) {
        if (row === dragStartRow) dragAxis = 'row';
        else if (col === dragStartCol) dragAxis = 'col';
        else dragAxis = 'row';   // diagonal: default to row
    }

    // No axis locked yet (cursor hasn't moved) — allow the cell.
    if (dragAxis === null) return true;
    if (dragAxis === 'row' && row === dragStartRow) return true;
    if (dragAxis === 'col' && col === dragStartCol) return true;
    return false;
}


//------------------------------------------------------------------------
//-------------------DRAG PAINTING - MAIN---------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// onHover — fired by onmouseenter on every grid cell.
//   Moves the crosshair to the newly entered cell and, when the player is
//   mid-drag, applies the current paint stroke to the cell (respecting
//   axis-lock if it is enabled).
function onHover(e, row, col) {
    const movedToNewCell = (row !== hoverRow || col !== hoverCol);
    if (movedToNewCell) {
        clearHover();
        hoverRow = row;
        hoverCol = col;
        applyHover(row, col);
    }

    if (painting && !dead && _isDragCellAllowed(row, col)) {
        applyCell(row, col);
    }
}

// onHoverOut — fired by onmouseleave on every grid cell.
//   Clears the crosshair only when the cell being left is the one that is
//   currently highlighted. This guards against stale clears caused by the
//   browser firing leave/enter events in an unexpected order.
function onHoverOut(row, col) {
    const leavingHighlightedCell = (row === hoverRow && col === hoverCol);
    if (leavingHighlightedCell) {
        clearHover();
        hoverRow = -1;
        hoverCol = -1;
    }
}


//------------------------------------------------------------------------
//-------------------DRAG COUNTER OVERLAY---------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// _getOrCreateCounterOverlay — returns the overlay <span> inside a cell,
//   creating and appending it first if it does not already exist.
function _getOrCreateCounterOverlay(cellEl) {
    let overlay = cellEl.querySelector('.drag-count-overlay');
    if (!overlay) {
        overlay = document.createElement('span');
        overlay.className = 'drag-count-overlay';
        cellEl.appendChild(overlay);
    }
    return overlay;
}

// dragCounterApply — sets the stroke-count number shown on a cell
//   during a drag so the player can see how many cells they have painted.
function dragCounterApply(row, col, count) {
    const cellEl = document.getElementById(`g-${row}-${col}`);
    if (!cellEl) return;
    const overlay = _getOrCreateCounterOverlay(cellEl);
    overlay.textContent = count;
}

// dragCounterClear — removes all stroke-count overlays from the entire board,
//   called when a drag stroke ends.
function dragCounterClear() {
    document.querySelectorAll('.drag-count-overlay').forEach(el => el.remove());
}