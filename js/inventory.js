// ═══════════════════════════════════════════════
//  INVENTORY  (inventory.js)
//  Renders the inventory strip during gameplay and
//  handles all item interactions: using, selling,
//  and the helper effects (reveal tiles, mark wrong
//  tiles). Also contains the shuffle utility and
//  the toast notification used across the codebase.
// ═══════════════════════════════════════════════


// ═══════════════════════════════════════════════
//  INVENTORY PANEL
// ═══════════════════════════════════════════════

// buildInventoryPanel — rebuilds the entire inventory strip from scratch.
//   Called whenever the inventory changes (item used, sold, or earned) and
//   once per second at the cursed-item unlock threshold (timer.js).
//
//   For each item in STATE.inventory:
//   - Looks up its definition in ITEM_DEFS (items.js).
//   - Determines its lock state:
//       ironman-lock   — Ironman modifier is active; no items allowed
//       cursed-locked  — cursed item and not enough time has elapsed yet
//                        (3 min normally, 1 min in Time Trial)
//   - Builds the card HTML with: icon, rarity badge, name, description,
//     an optional lock warning, and the discard footer.
//   - Attaches a click handler for useItem() only on unlocked items.
//     The discard button has its own onclick that calls sellItem() and uses
//     stopPropagation() so clicking it doesn't also trigger useItem().
function buildInventoryPanel() {
    const list = document.getElementById('inv-list');
    list.innerHTML = ''; // clear previous render

    // Empty state message
    if (!STATE.inventory.length) {
        list.innerHTML = `<div class="inv-empty-msg">${t('inv_empty').replace(/\n/g, '<br>')}</div>`;
        return;
    }

    // How many seconds have elapsed since the level started
    const elapsed = (cur ? (cur.timer || DIFF_CFG[curDiff].timerStart) : DIFF_CFG[curDiff].timerStart) - timerSecs;
    // Cursed items unlock after 3 min normally, 1 min in Time Trial
    const cursedMinElapsed = curMods.timetrial ? 60 : 180;

    STATE.inventory.forEach(item => {
        const def = ITEM_DEFS[item.defId];
        if (!def) return; // skip if definition is missing (shouldn't happen)

        const isCursed = def.rarity === 'cursed';
        const cursedStillLocked = isCursed && elapsed < cursedMinElapsed;
        const isLocked = curMods.ironman; // Ironman locks ALL items

        // Build the CSS class string for the card
        let cls = 'inv-item';
        if (isLocked) cls += ' ironman-lock';
        else if (cursedStillLocked) cls += ' cursed-locked';

        const el = document.createElement('div');
        el.className = cls;
        el.dataset.uid = item.uid; // store uid for event handlers

        // Show a countdown label on cursed items that are still locked
        const cursedWarning = cursedStillLocked
            ? `<div class="inv-cursed-warning">${t('inv_cursed_locked_label').replace('{n}', Math.ceil((cursedMinElapsed - elapsed) / 60))}</div>`
            : '';

        el.innerHTML = `
            <span class="inv-item-icon">${def.icon}</span>
            <div class="inv-item-name ${def.rarity}">${itemName(def)}</div>
            <div class="inv-item-desc">${itemDesc(def)}</div>
            ${cursedWarning}
            <div class="inv-item-val">
                <button class="inv-sell-btn" onclick="sellItem('${item.uid}', event)">
                    ${t('item_sell_btn')}
                </button>
            </div>`;

        // Only attach the use-handler if the item is actually usable right now
        if (!isLocked && !cursedStillLocked) {
            el.onclick = (e) => {
                // Guard: don't fire useItem if the discard button was clicked
                if (!e.target.classList.contains('inv-sell-btn')) useItem(item.uid);
            };
        }

        list.appendChild(el);
    });
}


// ═══════════════════════════════════════════════
//  CLUE BLACKOUT HELPERS
//  Used by cursed items to hide clue numbers
//  temporarily as a negative trade-off effect.
// ═══════════════════════════════════════════════

// applyCursedBlackout — blacks out a random half of rows AND columns for 30–60 s.
function applyCursedBlackout() {
    if (!cur) return;
    const rows = cur.grid.length;
    const cols = cur.grid[0].length;
    const duration = (30 + Math.floor(Math.random() * 31)) * 1000; // 30–60s in ms

    // Pick roughly half the rows and half the columns to black out
    const affectedRows = [];
    for (let r = 0; r < rows; r++) {
        if (Math.random() < 0.5) affectedRows.push(r);
    }
    const affectedCols = [];
    for (let c = 0; c < cols; c++) {
        if (Math.random() < 0.5) affectedCols.push(c);
    }

    // Apply blackout class to row clue cells
    affectedRows.forEach(r => {
        document.querySelectorAll(`.rct-${r}`)
            .forEach(el => el.classList.add('clue-blackout'));
    });

    // Apply blackout class to column clue cells
    affectedCols.forEach(c => {
        document.querySelectorAll(`.cch-${c}`)
            .forEach(el => el.classList.add('clue-blackout'));
    });

    // Lift the blackout after the duration
    setTimeout(() => {
        document.querySelectorAll('.clue-blackout')
            .forEach(el => el.classList.remove('clue-blackout'));
    }, duration);
}

// applyCursedRowBlackout — blacks out ALL row clues for 30 s (fixed duration).
//   Used as the negative effect for cursedShield.
function applyCursedRowBlackout() {
    if (!cur) return;
    const rows = cur.grid.length;
    for (let r = 0; r < rows; r++) {
        document.querySelectorAll(`.rct-${r}`)
            .forEach(el => el.classList.add('clue-blackout'));
    }
    setTimeout(() => {
        document.querySelectorAll('.clue-blackout')
            .forEach(el => el.classList.remove('clue-blackout'));
    }, 30000);
}

// applyCursedColBlackout — blacks out ALL column clues for a given duration (ms).
//   Used as the negative effect for cursedRowCol.
function applyCursedColBlackout(durationMs) {
    if (!cur) return;
    const cols = cur.grid[0].length;
    for (let c = 0; c < cols; c++) {
        document.querySelectorAll(`.cch-${c}`)
            .forEach(el => el.classList.add('clue-blackout'));
    }
    setTimeout(() => {
        document.querySelectorAll('.clue-blackout')
            .forEach(el => el.classList.remove('clue-blackout'));
    }, durationMs);
}


// ═══════════════════════════════════════════════
//  USE ITEM
// ═══════════════════════════════════════════════

// useItem(uid) — activates an item from the inventory by its unique id.
//   Guards (returns early) if:
//     - the game is over (dead) or Ironman mode is on
//     - the item uid can't be found in STATE.inventory
//     - the item definition doesn't exist in ITEM_DEFS
//     - the item is cursed and the unlock time hasn't been reached yet
//
//   Item dispatch uses prefix/exact matching on def.id:
//     'reveal*'        → revealTiles()
//     'markWrong*'     → markWrongTiles()
//     'addTime*'       → add seconds to timer
//     'freeze'         → timerFrozen for 30 s
//     'shield'         → shieldActive = true
//     'rowSolve'       → solveRows(1)
//     'colSolve'       → solveCols(1)
//     'mistakeEraser'  → reduce mistakeCount by 2
//     'artifactComplete' → solve entire puzzle
//
//   CURSED ITEMS — always trigger BOTH effects simultaneously:
//     'cursedReveal'   → ✅ reveal 6 tiles  +  ⚠️ clear all ✕ marks
//     'cursedTime'     → ✅ +5 min           +  ⚠️ −2 min immediately
//     'cursedShield'   → ✅ shield + 2 tiles  +  ⚠️ row clue blackout 30s
//     'cursedRowSolve' → ✅ reveal 2 rows     +  ⚠️ erase 1 row
//     'cursedColSolve' → ✅ reveal 2 cols     +  ⚠️ erase 1 col
//     'cursedRowCol'   → ✅ reveal 3 rows + 2 cols  +  ⚠️ col clue blackout 45s
//
//   After dispatching:
//   - Removes the item from STATE.inventory (consumed on use).
//   - Increments itemsUsedThisLevel (tracked for the 'noitem' bonus).
//   - Saves state, shows a toast, and rebuilds the panel.
function useItem(uid) {
    if (dead || curMods.ironman) return;

    const idx = STATE.inventory.findIndex(i => i.uid === uid);
    if (idx < 0) return; // uid not found

    const item = STATE.inventory[idx];
    const def = ITEM_DEFS[item.defId];
    if (!def) return;

    // Enforce cursed-item time lock
    const isCursed = def.rarity === 'cursed';
    const timerStart = cur ? (cur.timer || DIFF_CFG[curDiff].timerStart) : DIFF_CFG[curDiff].timerStart;
    const elapsed = timerStart - timerSecs;
    const cursedMinElapsed = curMods.timetrial ? 60 : 180;
    if (isCursed && elapsed < cursedMinElapsed) {
        showToast(t('item_cursed_locked').replace('{n}', Math.ceil((cursedMinElapsed - elapsed) / 60)));
        return;
    }

    let msg = ''; // toast message built per item type below
    const id = def.id;

    // ── REVEAL items (reveal1–4) ──────────────────────────────────────────
    if (id.startsWith('reveal') && id !== 'cursedReveal') {
        // Parse the tile count from the id suffix (e.g. 'reveal3' → 3)
        const count = parseInt(id.replace('reveal', '')) || 1;
        revealTiles(count);
        msg = `${def.icon} ${count > 1 ? t('item_revealed_pl').replace('{n}', count) : t('item_revealed').replace('{n}', count)}`;

        // ── MARK-WRONG items (markWrong2–8) ───────────────────────────────────
    } else if (id.startsWith('markWrong')) {
        const count = parseInt(id.replace('markWrong', '')) || 2;
        markWrongTiles(count);
        msg = `${def.icon} ${t('item_marked').replace('{n}', count)}`;

        // ── ADD-TIME items (addTime30–180) ────────────────────────────────────
    } else if (id.startsWith('addTime')) {
        const secs = parseInt(id.replace('addTime', '')) || 30;
        timerSecs += secs;
        updTimer();
        msg = `${def.icon} ${t('item_time_added').replace('{n}', secs)}`;

        // ── FREEZE ────────────────────────────────────────────────────────────
    } else if (id === 'freeze') {
        timerFrozen = true;
        msg = `${def.icon} ${t('item_freeze_msg')}`;
        // Automatically unfreeze after 30 seconds
        setTimeout(() => { timerFrozen = false; updTimer(); }, 30000);

        // ── SHIELD ────────────────────────────────────────────────────────────
    } else if (id === 'shield') {
        shieldActive = true; // consumed in input.js ac() on next wrong fill
        msg = `${def.icon} ${t('item_shield_msg')}`;

        // ── ROW-SOLVE ─────────────────────────────────────────────────────────
    } else if (id === 'rowSolve') {
        const n = solveRows(1);
        msg = n > 0 ? `${def.icon} ${t('item_row_solved')}` : `${def.icon} ${t('item_row_solved_none')}`;
        if (n > 0) checkWin();

        // ── COL-SOLVE ─────────────────────────────────────────────────────────
    } else if (id === 'colSolve') {
        const n = solveCols(1);
        msg = n > 0 ? `${def.icon} ${t('item_col_solved')}` : `${def.icon} ${t('item_col_solved_none')}`;
        if (n > 0) checkWin();

        // ── MISTAKE-ERASER ────────────────────────────────────────────────────
    } else if (id === 'mistakeEraser') {
        const before = mistakeCount;
        mistakeCount = Math.max(0, mistakeCount - 2);
        const removed = before - mistakeCount;
        msg = removed > 0
            ? `${def.icon} ${t('item_mistake_erased').replace('{n}', removed)}`
            : `${def.icon} ${t('item_mistake_erased_none')}`;

        // ── ARTIFACT COMPLETE ─────────────────────────────────────────────────
    } else if (id === 'artifactComplete') {
        const sol = cur.grid, rows = sol.length, cols = sol[0].length;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (sol[r][c] === 1 && userGrid[r][c] !== 1) {
                    revealedGrid[r][c] = true;
                    userGrid[r][c] = 1;
                    renderCell(r, c);
                    updClues(r, c);
                }
            }
        }
        msg = `🌟 ${t('item_artifact_complete')}`;
        checkWin();

        // ═══════════════════════════════════════════
        //  CURSED ITEMS
        //  Every cursed item ALWAYS triggers both its
        //  positive effect AND its negative effect.
        //  There is no randomness on whether each
        //  effect fires — both are guaranteed.
        //  This makes them a deliberate trade-off
        //  rather than a gamble.
        // ═══════════════════════════════════════════

        // ── CURSED REVEAL ─────────────────────────────────────────────────────
        //   ✅ Positive : reveals 6 correct tiles (green, permanent)
        //   ⚠️ Negative : clears every right-click ✕ mark the player has placed
    } else if (id === 'cursedReveal') {
        // Positive effect first
        revealTiles(6);
        // Negative effect: wipe all player ✕ marks (userGrid === 2) back to 0
        const rows = cur.grid.length, cols = cur.grid[0].length;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (userGrid[r][c] === 2) {
                    userGrid[r][c] = 0;
                    renderCell(r, c);
                }
            }
        }
        msg = `☠️ ${t('item_cursed_reveal_both')}`;

        // ── CURSED TIME ───────────────────────────────────────────────────────
        //   ✅ Positive : +5 minutes added to the timer
        //   ⚠️ Negative : −2 minutes deducted immediately (net gain: +3 min)
    } else if (id === 'cursedTime') {
        // Apply negative first so the display shows the net result
        timerSecs = Math.max(0, timerSecs - 120); // −2 min
        timerSecs += 300;                          // +5 min
        updTimer();
        msg = `💀 ${t('item_cursed_time_both')}`;

        // ── CURSED SHIELD ─────────────────────────────────────────────────────
        //   ✅ Positive : activates the shield AND reveals 2 correct tiles
        //   ⚠️ Negative : blacks out all row clues for 30 seconds
    } else if (id === 'cursedShield') {
        // Positive effects
        shieldActive = true;
        revealTiles(2);
        // Negative effect
        applyCursedRowBlackout(); // 30s fixed duration (defined above)
        msg = `👁️ ${t('item_cursed_shield_both')}`;

        // ── CURSED ROW-SOLVE ──────────────────────────────────────────────────
        //   ✅ Positive : fully reveals 2 random unsolved rows
        //   ⚠️ Negative : erases progress in 1 random already-solved row
    } else if (id === 'cursedRowSolve') {
        // Positive effect
        const revealed = solveRows(2);
        // Negative effect — runs after so it cannot erase what was just revealed
        const erased = unsolveRows(1);
        msg = `🌊 ${t('item_cursed_row_both').replace('{r}', revealed).replace('{e}', erased)}`;
        if (revealed > 0) checkWin();

        // ── CURSED COL-SOLVE ──────────────────────────────────────────────────
        //   ✅ Positive : fully reveals 2 random unsolved columns
        //   ⚠️ Negative : erases progress in 1 random already-solved column
    } else if (id === 'cursedColSolve') {
        // Positive effect
        const revealed = solveCols(2);
        // Negative effect — runs after so it cannot erase what was just revealed
        const erased = unsolveCols(1);
        msg = `🌪️ ${t('item_cursed_col_both').replace('{r}', revealed).replace('{e}', erased)}`;
        if (revealed > 0) checkWin();

        // ── CURSED ROW+COL ────────────────────────────────────────────────────
        //   ✅ Positive : fully reveals 3 random unsolved rows + 2 unsolved columns
        //   ⚠️ Negative : blacks out ALL column clues for 45 seconds
    } else if (id === 'cursedRowCol') {
        // Positive effects
        const r = solveRows(3);
        const c = solveCols(2);
        // Negative effect: blackout all column clues for 45s
        applyCursedColBlackout(45000);
        msg = `💥 ${t('item_cursed_rowcol_both').replace('{r}', r).replace('{c}', c)}`;
        checkWin();
    }


    // ── Consume item ──────────────────────────────────────────────────────
    STATE.inventory.splice(idx, 1); // remove from inventory
    itemsUsedThisLevel++;            // tracked for 'noitem' bonus objective

    save();
    showToast(msg);
    buildInventoryPanel(); // rebuild so the used item disappears
}


// ═══════════════════════════════════════════════
//  SELL ITEM
// ═══════════════════════════════════════════════

// sellItem(uid, e) — discards an item without using it.
//   e.stopPropagation() prevents the click from bubbling up to the parent
//   inv-item div and accidentally triggering useItem() at the same time.
//   The item is removed from STATE.inventory and the panel is rebuilt.
function sellItem(uid, e) {
    e.stopPropagation(); // don't trigger useItem on the parent card

    const idx = STATE.inventory.findIndex(i => i.uid === uid);
    if (idx < 0) return;

    const def = ITEM_DEFS[STATE.inventory[idx].defId];
    STATE.inventory.splice(idx, 1);

    save();
    buildInventoryPanel();
    showToast(`${def.icon} ${t('item_discarded')}`);
}


// ═══════════════════════════════════════════════
//  TILE HELPERS  (used by useItem)
// ═══════════════════════════════════════════════

// revealTiles(count) — randomly reveals 'count' correct unfilled tiles.
//   Builds a candidate list of cells that:
//     - are filled in the solution (sol[r][c] === 1)
//     - haven't been filled by the player yet (userGrid !== 1)
//     - haven't already been revealed by a previous item
//   Shuffles the list, takes the first 'count' entries, marks them as
//   revealed, updates userGrid to 1, and re-renders each cell.
//   Calls checkWin() afterwards in case revealing these tiles completes
//   the puzzle (e.g. the player was one tile away).
function revealTiles(count) {
    const sol = cur.grid, rows = sol.length, cols = sol[0].length;
    const cands = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 1 && userGrid[r][c] !== 1 && !revealedGrid[r][c]) {
                cands.push([r, c]); // eligible unfilled correct tile
            }
        }
    }

    shuffle(cands).slice(0, count).forEach(([r, c]) => {
        revealedGrid[r][c] = true; // mark as item-revealed (green, can't erase)
        userGrid[r][c] = 1;        // count as filled for win-check purposes
        renderCell(r, c);          // grid.js — redraw the cell
        updClues(r, c);            // grid.js — refresh clue colours
    });

    checkWin(); // scoring.js — the reveal may have completed the puzzle
}

// markWrongTiles(count) — places a ✕ mark on 'count' cells that should
//   stay empty (solution = 0) and haven't been touched yet.
//   Builds candidates: empty in solution, not yet marked (userGrid === 0),
//   and not already flagged as wrong.
//   Does NOT call checkWin() because marking empty cells can't complete
//   the puzzle — only filling correct cells can.
function markWrongTiles(count) {
    const sol = cur.grid, rows = sol.length, cols = sol[0].length;
    const cands = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // Only mark cells that: are empty in solution, untouched, not wrong
            if (sol[r][c] === 0 && userGrid[r][c] === 0 && !wrongGrid[r][c]) {
                cands.push([r, c]);
            }
        }
    }

    shuffle(cands).slice(0, count).forEach(([r, c]) => {
        userGrid[r][c] = 2; // 2 = right-click mark (✕)
        renderCell(r, c);   // grid.js
    });
}


// ═══════════════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════════════

// shuffle(a) — Fisher-Yates in-place shuffle.
//   Iterates from the last element down to index 1, swapping each element
//   with a randomly chosen element at or before it.
//   Returns the same array (mutated) for chaining convenience.
//   Used by: revealTiles, markWrongTiles, getQuizQuestion (quiz.js).
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]; // ES6 destructuring swap
    }
    return a;
}

// showToast(msg) — displays a brief notification banner at the top of
//   the screen for 2.5 seconds. Used for item-use confirmations, sell
//   confirmations, and error messages throughout the codebase.
//   Adding the 'show' class makes it visible (CSS: display:block + animation).
//   The timeout removes the class to hide it again.
function showToast(msg) {
    const el = document.getElementById('item-toast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 2500);
}


// ═══════════════════════════════════════════════
//  ROW / COLUMN SOLVE & UNSOLVE HELPERS
//  Used by cursed items and row/col-solve items.
// ═══════════════════════════════════════════════

// unsolveRows(count) — erases 'count' random rows of player progress.
//   Clears both player-filled and item-revealed correct cells in those rows,
//   resetting them to empty. Wrong marks are left untouched.
//   Returns the number of rows actually affected.
function unsolveRows(count) {
    const sol = cur.grid, rows = sol.length, cols = sol[0].length;
    // Only target rows that have at least one filled correct cell to erase
    const candidates = [];
    for (let r = 0; r < rows; r++) {
        const hasFilled = sol[r].some((v, c) => v === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c]));
        if (hasFilled) candidates.push(r);
    }
    shuffle(candidates);
    const targets = candidates.slice(0, count);
    targets.forEach(r => {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])) {
                userGrid[r][c] = 0;
                revealedGrid[r][c] = false;
                renderCell(r, c);
            }
        }
    });
    return targets.length;
}

// unsolveCols(count) — same as unsolveRows but operates on columns.
function unsolveCols(count) {
    const sol = cur.grid, rows = sol.length, cols = sol[0].length;
    const candidates = [];
    for (let c = 0; c < cols; c++) {
        const hasFilled = sol.some((row, r) => row[c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c]));
        if (hasFilled) candidates.push(c);
    }
    shuffle(candidates);
    const targets = candidates.slice(0, count);
    targets.forEach(c => {
        for (let r = 0; r < rows; r++) {
            if (sol[r][c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])) {
                userGrid[r][c] = 0;
                revealedGrid[r][c] = false;
                renderCell(r, c);
            }
        }
    });
    return targets.length;
}

// solveRows(count) — reveals 'count' random unsolved rows fully.
//   Returns the number of rows actually revealed.
function solveRows(count) {
    const sol = cur.grid, rows = sol.length, cols = sol[0].length;
    const unsolved = [];
    for (let r = 0; r < rows; r++) {
        const done = sol[r].every((v, c) => v === 0 || userGrid[r][c] === 1 || revealedGrid[r][c]);
        if (!done) unsolved.push(r);
    }
    shuffle(unsolved);
    unsolved.slice(0, count).forEach(r => {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 1 && userGrid[r][c] !== 1) {
                revealedGrid[r][c] = true;
                userGrid[r][c] = 1;
                renderCell(r, c);
                updClues(r, c);
            }
        }
    });
    return Math.min(count, unsolved.length);
}

// solveCols(count) — same as solveRows but for columns.
function solveCols(count) {
    const sol = cur.grid, rows = sol.length, cols = sol[0].length;
    const unsolved = [];
    for (let c = 0; c < cols; c++) {
        const done = sol.every((row, r) => row[c] === 0 || userGrid[r][c] === 1 || revealedGrid[r][c]);
        if (!done) unsolved.push(c);
    }
    shuffle(unsolved);
    unsolved.slice(0, count).forEach(c => {
        for (let r = 0; r < rows; r++) {
            if (sol[r][c] === 1 && userGrid[r][c] !== 1) {
                revealedGrid[r][c] = true;
                userGrid[r][c] = 1;
                renderCell(r, c);
                updClues(r, c);
            }
        }
    });
    return Math.min(count, unsolved.length);
}