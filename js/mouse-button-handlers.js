// Handles mouse interactions with the grid


let pval = 0;               // the value being painted during a drag stroke: 0 = erase, 1 = fill (left-click), 2 = mark-empty (right-click)

let mbtn = 0;               // which mouse button started the current stroke (0 = left, 2 = right)







//------------------------------------------------------------------------
//--------------------------APPLY CELL------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// core logic that actually changes a cell's state.
// Called by cd() on click and by onHover() while dragging.

function ac(row, col) {

    if (activeAbilityMode) {
        if (pval === 1 || mbtn === 0) {
            executeActiveAbility(row, col); // class skill
        }
        return;
    }

    // No-op: cell already has the desired value
    if (userGrid[row][col] === pval) return;

    // Cannot erase a cell that was revealed by an item
    if (revealedGrid[row][col] && pval === 0) return;

    // Left-click fill: check against the solution
    if (mbtn === 0 && pval === 1) {
        if (cur.grid[row][col] !== 1) {
            if (window._freezeActive) {
                // During freeze: mistake is cosmetically marked but costs zero time
                wrongGrid[row][col] = true;
                renderCell(row, col);
                showToast('❄️ Frozen! No penalty.');
                return;
            }
            if (shieldActive) {
                shieldActive = false;
                absorbedMistakes++;
                showToast(t('pen_shield'));
                return;
            }

            // Check whether a class passive (e.g. Mathmagician free mistakes) would
            // absorb this penalty entirely — if so, skip the hardcore kill too.
            const penMult = getClassPenaltyMultiplier();
            if (penMult === 0) {
                // Fully absorbed by class passive — mark wrong visually but no
                // time cost, no mistake count, and no hardcore game-over.
                wrongGrid[row][col] = true;
                renderCell(row, col);
                absorbedMistakes++;
                showToast(t('pen_shield'));
                return;
            }

            // Mark the cell wrong and apply the time penalty
            wrongGrid[row][col] = true;
            renderCell(row, col);   // show the red ✕ 
            applyPenalty();         // deduct time, show flash

            // Hardcore mode: one mistake = instant game over
            if (curMods.hardcore) {
                dead = true;
                stopTimer();

                // bounceback achievement: record this as a failed level
                window._lastFailedGi = cur.gIdx;

                document.getElementById('lose-title').textContent = t('hc_fail_title');
                document.getElementById('lose-sub').textContent = t('hc_fail_sub');
                document.getElementById('ov-lose').classList.add('show');
            }
            return; 
        }
    }

    // Valid move: update the data, refresh the display, and check for a win
    // Lucky tile check: right-clicking to mark ✕ on an unspent lucky tile
    if (pval === 2 && !luckyRewardClaimed && luckyTiles && luckyTiles.has(`${row}-${col}`)) {
        luckyRewardClaimed = true;
        trackAchStat('luckyTilesFound');
        luckyTiles.delete(`${row}-${col}`);

        const _wonItemId = pickLuckyItem(); // This returns the string ID (e.g., 'shield')

        // Construct the object the inventory expects
        const _newItem = {
            uid: `item_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            defId: _wonItemId
        };

        STATE.inventory.push(_newItem);
        save();
        buildInventoryPanel();

        // Update the toast to use the defId from our new object
        const _def = ITEM_DEFS[_newItem.defId];
        showToast(`🍀 Lucky Tile! You found: ${_def.icon} ${itemName(_def)}`, 3500);
    }

    userGrid[row][col] = pval;
    if (pval === 1 && cur.grid[row][col] === 1) onCorrectFill(); // class.js
    renderCell(row, col);   // re-draws the cell visual
    updClues(row, col);     // refreshes clue number colours
    checkWin();             // tests whether the puzzle is solved
}








//------------------------------------------------------------------------
//--------------------------CELL DOWN-------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Handles mousedown on a grid cell

function cd(e, row, col) {
    e.preventDefault();     // Prevents the context menu from appearing on right-click.
    if (dead) return;

    mbtn = e.button;        // 0 = left button, 2 = right button
    painting = true;

    // Decide what value to paint for the duration of this drag stroke
    if (mbtn === 0) {   // left-click: toggle fill / erase (but cannot fill revealed cells, so no toggle)
        pval = userGrid[row][col] === 1 ? 0 : 1; // left: fill or erase
    } else {    // right-click: mark or erase (cannot mark revealed cells, so no toggle)
        if (userGrid[row][col] === 2) {
            pval = 3; // red cross gets switched to yellow question mark
        } else if (userGrid[row][col] === 3) {
            pval = 0; // yellow question mark gets switched to empty
        } else {
            pval = 2; // empty gets switched to red cross
        }
    }

    ac(row, col); // apply immediately to the cell that was clicked
}






//------------------------------------------------------------------------
//-------------------------STOP PAINTING----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function sp() {
    painting = false;
}






//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------








