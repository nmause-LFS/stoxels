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
        updateReshuffleCounter();
        return;
    }

    STATE.inventory.forEach(item => {
        const def = ITEM_DEFS[item.defId];
        if (!def) return; // skip if definition is missing (shouldn't happen)

        const isLocked = curMods.ironman; // Ironman locks ALL items

        // Build the CSS class string for the card
        let cls = 'inv-item';
        if (isLocked) cls += ' ironman-lock';

        const el = document.createElement('div');
        el.className = cls;
        el.dataset.uid = item.uid; // store uid for event handlers

        el.innerHTML = `
            <span class="inv-item-icon">${def.icon}</span>
            <div class="inv-item-name ${def.rarity}">${itemName(def)}</div>
            <div class="inv-item-desc">${itemDesc(def)}</div>
            <div class="inv-item-val">
                <button class="inv-sell-btn" onclick="sellItem('${item.uid}', event)">
                    ${t('item_sell_btn')}
                </button>
            </div>`;

        // Only attach the use-handler if the item is actually usable right now
        if (!isLocked) {
            el.onclick = (e) => {
                // Guard: don't fire useItem if the discard button was clicked
                if (!e.target.classList.contains('inv-sell-btn')) useItem(item.uid);
            };
        }

        // Right-click → reshuffle contribution
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (dead || curMods.ironman) return;
            reshuffleRightClickItem(item.uid);
        });        

        list.appendChild(el);


    });

    // item_hoarder: track if the player has ever held 10+ items at once.
    // buildInventoryPanel runs after every inventory change, making it the
    // single reliable place to catch the high-water mark.
    if (STATE.inventory.length >= 10) {
        // We use a one-time counter rather than a boolean so the achievement
        // tiers (1, 3, 7 times reaching 10+) can accumulate properly.
        // Guard with a flag so rapid redraws don't spam-increment the stat.
        if (!window._lastInventoryHoarderSize || window._lastInventoryHoarderSize < STATE.inventory.length) {
            trackAchStat('maxInventoryReached');
        }
    }
    window._lastInventoryHoarderSize = STATE.inventory.length;

    // collector: check if inventory currently contains at least one item of
    // every rarity tier simultaneously. Only fires when the count is new.
    const RARITIES = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'cursed', 'artifact'];
    const raritiesPresent = new Set(
        STATE.inventory.map(item => ITEM_DEFS[item.defId]?.rarity).filter(Boolean)
    );
    if (RARITIES.every(r => raritiesPresent.has(r))) {
        // Use a session flag so this only increments once per time all rarities
        // are held simultaneously, not on every panel rebuild.
        if (!window._collectorTriggeredThisSession) {
            window._collectorTriggeredThisSession = true;
            trackAchStat('collectorAllRarities');
        }
    } else {
        // Reset the flag so it can fire again if the player rebuilds the set
        window._collectorTriggeredThisSession = false;
    }

    updateReshuffleCounter();
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

// applyCursedRowBlackout — blacks out ALL row clues for the given duration (ms).
//   Defaults to 30 000 ms (30 s) when called without an argument.
//   Used as the negative effect for cursedShield and cursedTime.
function applyCursedRowBlackout(durationMs = 30000) {
    if (!cur) return;
    const rows = cur.grid.length;
    for (let r = 0; r < rows; r++) {
        document.querySelectorAll(`.rct-${r}`)
            .forEach(el => el.classList.add('clue-blackout'));
    }
    setTimeout(() => {
        document.querySelectorAll('.clue-blackout')
            .forEach(el => el.classList.remove('clue-blackout'));
    }, durationMs);
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
        const FREEZE_DURATION = 2000; // 2 seconds in ms
        timerFrozen = true;
        shieldActive = true; // reuse shield flag to block penalty cost during freeze
        window._freezeActive = true;
        updTimer();
        msg = `${def.icon} ${t('item_freeze_msg')}`;

        // freeze_clutch: used a freeze with 10 seconds or less on the clock
        if (timerSecs <= 10) trackAchStat('freezeClutches');
        // Visual countdown on the timer element
        let remaining = 2;
        const freezeTick = setInterval(() => {
            remaining--;
            const el = document.getElementById('timer-val');
            if (el) el.textContent = `❄️ ${remaining}s`;
            if (remaining <= 0) clearInterval(freezeTick);
        }, 1000);

        setTimeout(() => {
            timerFrozen = false;
            window._freezeActive = false;
            shieldActive = false;
            clearInterval(freezeTick);
            updTimer();
            showToast(t('item_freeze_ended'));
        }, FREEZE_DURATION);

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
        const mcEl = document.getElementById('mistake-counter');
        if (mcEl) mcEl.textContent = `✗ ${mistakeCount}`;
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

        // ── SCOUT'S PRIMER ────────────────────────────────────────────────────────
        //   Marks a pending "primer" in STATE. The next time the player starts or
        //   replays any level, a random question fires before play begins.
        //   Correct answer → 2 rows + 2 cols pre-solved as a headstart.
    } else if (id === 'scoutPrimer') {
        STATE.primerPending = true;
        save();
        msg = `📜 ${t('item_primer_activated')}`;

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
        const unmarked = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (userGrid[r][c] === 2) {
                    userGrid[r][c] = 0;
                    renderCell(r, c);
                    unmarked.push(`g-${r}-${c}`);
                }
            }
        }
        _applyCellEffect(unmarked, 'unmark');
        msg = `☠️ ${t('item_cursed_reveal_both')}`;

        // ── CURSED TIME ───────────────────────────────────────────────────────
        //   ✅ Positive : +10 minutes added to the timer
        //   ⚠️ Negative : Row and Column blackout for 30 seconds
    } else if (id === 'cursedTime') {
        timerSecs += 1200;                          // +10 min
        updTimer();
        applyCursedRowBlackout(30000);
        applyCursedColBlackout(30000);

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

        // ── CURSED ROW-SOLVE ──────────────────────────────────────────────
        //   ✅ Positive : fully reveals 3 random unsolved rows
        //   ⚠️ Negative : erases progress in 1 random DIFFERENT already-solved row
    } else if (id === 'cursedRowSolve') {
        // Snapshot which rows had ANY filled correct cells before we reveal
        const preFilledRows = new Set();
        {
            const s = cur.grid, rows = s.length, cols = s[0].length;
            for (let r = 0; r < rows; r++)
                for (let c = 0; c < cols; c++)
                    if (s[r][c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])) { preFilledRows.add(r); break; }
        }
        // Positive effect
        const revealed = solveRows(3);
        // Negative effect — only erase rows that existed BEFORE the reveal
        const erased = unsolveRowsExcluding(1, preFilledRows);
        msg = `🌊 ${t('item_cursed_row_both').replace('{r}', revealed).replace('{e}', erased)}`;
        if (revealed > 0) checkWin();

        // ── CURSED COL-SOLVE ──────────────────────────────────────────────────
        //   ✅ Positive : fully reveals 3 random unsolved columns
        //   ⚠️ Negative : erases progress in 1 random DIFFERENT already-solved column
    } else if (id === 'cursedColSolve') {
        // Snapshot which cols had ANY filled correct cells before we reveal
        const preFilledCols = new Set();
        {
            const s = cur.grid, rows = s.length, cols = s[0].length;
            for (let c = 0; c < cols; c++)
                for (let r = 0; r < rows; r++)
                    if (s[r][c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])) { preFilledCols.add(c); break; }
        }
        // Positive effect
        const revealed = solveCols(3);
        // Negative effect — only erase cols that existed BEFORE the reveal
        const erased = unsolveColsExcluding(1, preFilledCols);
        msg = `🌪️ ${t('item_cursed_col_both').replace('{r}', revealed).replace('{e}', erased)}`;
        if (revealed > 0) checkWin();

        // ── CURSED ROW+COL ────────────────────────────────────────────────────
        //   ✅ Positive : fully reveals 3 random unsolved rows + 2 unsolved columns
        //   ⚠️ Negative : blacks out ALL column clues for 45 seconds
    } else if (id === 'cursedRowCol') {
        // Positive effects
        const r = solveRows(4);
        const c = solveCols(4);
        // Negative effect: blackout all column clues for 45s
        applyCursedColBlackout(45000);
        msg = `💥 ${t('item_cursed_rowcol_both').replace('{r}', r).replace('{c}', c)}`;
        checkWin();
    }


    // ── Consume item ──────────────────────────────────────────────────────
    STATE.inventory.splice(idx, 1); // remove from inventory
    itemsUsedThisLevel++;            // tracked for 'noitem' bonus objective


    // ── Achievement tracking ─────────────────────────────────────────────
    trackAchStat('itemsUsed');
    if (def.rarity === 'cursed') trackAchStat('cursedItemsUsed');
    if (id === 'shield') trackAchStat('shieldsUsed');
    if (id === 'rowSolve' || id === 'colSolve'
        || id.startsWith('cursedRow') || id.startsWith('cursedCol')
        || id === 'cursedRowCol') trackAchStat('rowColSolved');
    if (id === 'artifactComplete') trackAchStat('artifactUsed');
    // addTime items: track seconds added
    if (id.startsWith('addTime')) {
        const secs = parseInt(id.replace('addTime', '')) || 0;
        if (secs > 0) trackAchStat('timeAdded', secs);
    }
    if (id === 'cursedTime') trackAchStat('timeAdded', 1200); // +20 min

    // three_items_level: fire once the moment the 3rd item is used this level
    if (itemsUsedThisLevel === 3) trackAchStat('threeItemsOneLevelCount');

    // cursed_first: used a cursed item on the very first attempt at this level
    if (def.rarity === 'cursed' && !STATE.done.includes(cur.gIdx)) {
        trackAchStat('cursedFirstAttempts');
    }

    // item_hoarder: check if current inventory size (post-use) still qualifies,
    // but we also check on add — the real trigger is reaching 10 while holding.
    // Re-check here in case an item was just used to drop below threshold and
    // back up; the actual high-water check happens in buildInventoryPanel.
    // ────────────────────────────────────────────────────────────────────



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

    // ── Achievement tracking ─────────────────────────────────────────────
    trackAchStat('itemsSold');
    // ────────────────────────────────────────────────────────────────────

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

    const affected = [];
    shuffle(cands).slice(0, count).forEach(([r, c]) => {
        revealedGrid[r][c] = true; // mark as item-revealed (green, can't erase)
        userGrid[r][c] = 1;        // count as filled for win-check purposes
        renderCell(r, c);          // grid.js — redraw the cell
        updClues(r, c);            // grid.js — refresh clue colours
        affected.push(`g-${r}-${c}`);
    });
    _applyCellEffect(affected, 'reveal');

    trackAchStat('tilesRevealed', affected.length);
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
            if (sol[r][c] === 0 && (userGrid[r][c] === 0 || userGrid[r][c] === 3) && !wrongGrid[r][c]) {
                cands.push([r, c]);
            }
        }
    }

    const affected = [];
    shuffle(cands).slice(0, count).forEach(([r, c]) => {
        userGrid[r][c] = 2; // 2 = right-click mark (✕)
        renderCell(r, c);   // grid.js
        affected.push(`g-${r}-${c}`);
    });
    _applyCellEffect(affected, 'mark');
    trackAchStat('tilesMarked', affected.length);
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
    const affected = [];
    unsolved.slice(0, count).forEach(r => {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 1 && userGrid[r][c] !== 1) {
                revealedGrid[r][c] = true;
                userGrid[r][c] = 1;
                renderCell(r, c);
                updClues(r, c);
                affected.push(`g-${r}-${c}`);
            }
        }
    });
    _applyCellEffect(affected, 'reveal');
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
    const affected = [];
    unsolved.slice(0, count).forEach(c => {
        for (let r = 0; r < rows; r++) {
            if (sol[r][c] === 1 && userGrid[r][c] !== 1) {
                revealedGrid[r][c] = true;
                userGrid[r][c] = 1;
                renderCell(r, c);
                updClues(r, c);
                affected.push(`g-${r}-${c}`);
            }
        }
    });
    _applyCellEffect(affected, 'reveal');
    return Math.min(count, unsolved.length);
}

// ═══════════════════════════════════════════════
//  EXCLUDING VARIANTS — for cursed row/col solve
//  These only erase rows/cols that were already
//  filled BEFORE the current item was used, so
//  the positive reveal and the negative erase
//  always affect different rows/columns.
// ═══════════════════════════════════════════════

// unsolveRowsExcluding(count, allowedSet) — like unsolveRows but only
//   considers rows whose index is in allowedSet (pre-filled before use).
//   If allowedSet is empty (board was blank), picks any filled row instead.
function unsolveRowsExcluding(count, allowedSet) {
    const sol = cur.grid, rows = sol.length, cols = sol[0].length;
    let candidates = [];
    for (let r = 0; r < rows; r++) {
        if (!allowedSet.has(r)) continue;
        const hasFilled = sol[r].some((v, c) => v === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c]));
        if (hasFilled) candidates.push(r);
    }
    // Fallback: if no pre-existing filled rows, erase any filled row
    if (!candidates.length) {
        for (let r = 0; r < rows; r++) {
            const hasFilled = sol[r].some((v, c) => v === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c]));
            if (hasFilled) candidates.push(r);
        }
    }
    shuffle(candidates);
    const targets = candidates.slice(0, count);
    const erasedCells = [];
    targets.forEach(r => {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])) {
                userGrid[r][c] = 0;
                revealedGrid[r][c] = false;
                renderCell(r, c);
                erasedCells.push(`g-${r}-${c}`);
            }
        }
    });
    // Lingering red shimmer so the player clearly sees what was erased
    _applyCellEffect(erasedCells, 'erase');
    return targets.length;
}

// unsolveColsExcluding(count, allowedSet) — same as above but for columns.
function unsolveColsExcluding(count, allowedSet) {
    const sol = cur.grid, rows = sol.length, cols = sol[0].length;
    let candidates = [];
    for (let c = 0; c < cols; c++) {
        if (!allowedSet.has(c)) continue;
        const hasFilled = sol.some((row, r) => row[c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c]));
        if (hasFilled) candidates.push(c);
    }
    if (!candidates.length) {
        for (let c = 0; c < cols; c++) {
            const hasFilled = sol.some((row, r) => row[c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c]));
            if (hasFilled) candidates.push(c);
        }
    }
    shuffle(candidates);
    const targets = candidates.slice(0, count);
    const erasedCells = [];
    targets.forEach(c => {
        for (let r = 0; r < rows; r++) {
            if (sol[r][c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])) {
                userGrid[r][c] = 0;
                revealedGrid[r][c] = false;
                renderCell(r, c);
                erasedCells.push(`g-${r}-${c}`);
            }
        }
    });
    // Lingering red shimmer so the player clearly sees what was erased
    _applyCellEffect(erasedCells, 'erase');
    return targets.length;
}


// ═══════════════════════════════════════════════
//  CELL EFFECT SYSTEM
//  A unified lingering animation applied to any
//  cell that is touched by an item effect.
//
//  Types:
//    'reveal'   — green pulse  (tile revealed / row-col solved)
//    'mark'     — orange pulse (empty tile marked ✕ by item)
//    'erase'    — red pulse    (filled tile wiped by cursed item)
//    'artifact' — gold burst   (artifact / primer headstart)
//    'unmark'   — yellow fade  (✕ marks cleared by cursedReveal)
//
//  Usage:
//    _applyCellEffect(['g-3-2', 'g-3-5'], 'reveal');
// ═══════════════════════════════════════════════

// _ensureCellEffectCSS — injects all keyframes + classes once.
function _ensureCellEffectCSS() {
    if (document.getElementById('cell-effect-style')) return;
    const style = document.createElement('style');
    style.id = 'cell-effect-style';
    style.textContent = `
        /* ── reveal: green glow sweeping in ── */
        @keyframes cellRevealPulse {
            0%   { background: rgba(46, 213, 115, 0.90); box-shadow: inset 0 0 0 2px #2ed573, 0 0 6px #2ed573; }
            50%  { background: rgba(46, 213, 115, 0.55); box-shadow: inset 0 0 0 1px #2ed573, 0 0 3px #2ed573; }
            100% { background: rgba(46, 213, 115, 0.00); box-shadow: none; }
        }
        .cell-fx-reveal {
            animation: cellRevealPulse 1.6s ease-out forwards;
            pointer-events: none;
        }

        /* ── mark: orange pulse (item placed a ✕) ── */
        @keyframes cellMarkPulse {
            0%   { background: rgba(255, 165, 0, 0.80); box-shadow: inset 0 0 0 2px #ffaa00; }
            50%  { background: rgba(255, 165, 0, 0.45); box-shadow: inset 0 0 0 1px #ffaa00; }
            100% { background: rgba(255, 165, 0, 0.00); box-shadow: none; }
        }
        .cell-fx-mark {
            animation: cellMarkPulse 1.6s ease-out forwards;
            pointer-events: none;
        }

        /* ── erase: red drain (cursed item wiped a filled tile) ── */
        @keyframes cellErasePulse {
            0%   { background: rgba(220, 50, 50, 0.85); box-shadow: inset 0 0 0 2px #ff3333; }
            40%  { background: rgba(180, 20, 20, 0.65); box-shadow: inset 0 0 0 2px #cc0000; }
            70%  { background: rgba(220, 50, 50, 0.40); box-shadow: inset 0 0 0 1px #ff3333; }
            100% { background: rgba(220, 50, 50, 0.00); box-shadow: none; }
        }
        .cell-fx-erase {
            animation: cellErasePulse 2.0s ease-out forwards;
            pointer-events: none;
        }

        /* ── artifact / primer: gold starburst ── */
        @keyframes cellArtifactPulse {
            0%   { background: rgba(255, 215, 0, 0.95); box-shadow: inset 0 0 0 2px #ffd700, 0 0 10px #ffd700; }
            40%  { background: rgba(255, 215, 0, 0.60); box-shadow: inset 0 0 0 1px #ffd700, 0 0 5px #ffd700; }
            100% { background: rgba(255, 215, 0, 0.00); box-shadow: none; }
        }
        .cell-fx-artifact {
            animation: cellArtifactPulse 1.8s ease-out forwards;
            pointer-events: none;
        }

        /* ── unmark: yellow fade (✕ marks cleared by cursedReveal) ── */
        @keyframes cellUnmarkPulse {
            0%   { background: rgba(255, 230, 50, 0.75); box-shadow: inset 0 0 0 2px #ffe632; }
            60%  { background: rgba(255, 230, 50, 0.35); box-shadow: inset 0 0 0 1px #ffe632; }
            100% { background: rgba(255, 230, 50, 0.00); box-shadow: none; }
        }
        .cell-fx-unmark {
            animation: cellUnmarkPulse 1.4s ease-out forwards;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
}

// _applyCellEffect(cellIds, type) — applies the named effect class to each
//   cell element in cellIds, then removes the class once the animation ends.
//   Handles rapid re-use of the same cell via a forced reflow.
//
//   Duration map keeps cleanup timers in sync with the CSS animation lengths:
const _cellEffectDuration = { reveal: 1700, mark: 1700, erase: 2100, artifact: 1900, unmark: 1500 };

function _applyCellEffect(cellIds, type) {
    if (!cellIds.length) return;
    _ensureCellEffectCSS();
    const cls = `cell-fx-${type}`;
    const duration = _cellEffectDuration[type] || 1800;
    cellIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove(cls);
        void el.offsetWidth; // force reflow so animation restarts on rapid re-use
        el.classList.add(cls);
    });
    setTimeout(() => {
        cellIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove(cls);
        });
    }, duration);
}


// ═══════════════════════════════════════════════
//  INVENTORY SCROLL WHEEL
//  Scroll the inventory strip with the mouse wheel
//  when the cursor is hovering over it — no need
//  to grab the scrollbar on a long item list.
// ═══════════════════════════════════════════════
document.addEventListener('wheel', (e) => {
    // Only act when the cursor is over the inventory strip (not Ctrl+wheel zoom)
    if (e.ctrlKey) return;
    const strip = e.target.closest('#inv-list');
    if (!strip) return;
    e.preventDefault();
    // Scroll speed: 120px per notch feels natural for item cards
    strip.scrollLeft += e.deltaY > 0 ? 120 : -120;
}, { passive: false });



// ── RESHUFFLE STATE ───────────────────────────────────────────────────────
let reshuffleCount = 0; // tracks right-clicked (discarded) items toward the goal
const RESHUFFLE_GOAL = 5;


// updateReshuffleCounter — syncs the counter badge next to the INVENTORY label.
function updateReshuffleCounter() {
    const el = document.getElementById('reshuffle-counter');
    if (el) el.textContent = `♻ ${reshuffleCount}/${RESHUFFLE_GOAL}`;
}




// ═══════════════════════════════════════════════
//  RESHUFFLE SYSTEM
//  Right-clicking an item discards it and increments
//  a counter. At 5 discards, a modal opens showing
//  3 random items — the player picks one to keep.
// ═══════════════════════════════════════════════

function reshuffleRightClickItem(uid) {
    const idx = STATE.inventory.findIndex(i => i.uid === uid);
    if (idx < 0) return;

    const def = ITEM_DEFS[STATE.inventory[idx].defId];
    STATE.inventory.splice(idx, 1);
    reshuffleCount++;

    save();
    buildInventoryPanel(); // also calls updateReshuffleCounter()
    showToast(`${def.icon} Tossed into the reshuffle pile… (${reshuffleCount}/${RESHUFFLE_GOAL})`);

    if (reshuffleCount >= RESHUFFLE_GOAL) {
        reshuffleCount = 0;
        updateReshuffleCounter();
        setTimeout(() => openReshuffleModal(), 300); // slight delay so toast reads first
    }
}

function openReshuffleModal() {
    // Pick 3 distinct random items
    const picks = [];
    const usedIds = new Set();
    let attempts = 0;
    while (picks.length < 3 && attempts < 50) {
        attempts++;
        const id = pickLuckyItem(); // uses existing weighted pool with artifact chance
        if (!usedIds.has(id)) {
            usedIds.add(id);
            picks.push(ITEM_DEFS[id]);
        }
    }

    // Build modal HTML
    const cardsHtml = picks.map(def => `
        <div class="rshuffle-card" data-id="${def.id}">
            <div class="rshuffle-card-icon">${def.icon}</div>
            <div class="rshuffle-card-name ${def.rarity}">${itemName(def)}</div>
            <div class="rshuffle-card-rarity">${rarityLabel(def.rarity)}</div>
            <div class="rshuffle-card-desc">${itemDesc(def)}</div>
        </div>`).join('');

    const modal = document.createElement('div');
    modal.id = 'rshuffle-modal';
    modal.innerHTML = `
        <div id="rshuffle-box">
            <div id="rshuffle-title">♻ Reshuffle Reward</div>
            <div id="rshuffle-subtitle">5 items sacrificed — choose your reward:</div>
            <div id="rshuffle-cards">${cardsHtml}</div>
        </div>`;
    document.body.appendChild(modal);

    // Attach click handlers
    modal.querySelectorAll('.rshuffle-card').forEach(card => {
        card.addEventListener('click', () => {
            const chosenId = card.dataset.id;
            const chosenDef = ITEM_DEFS[chosenId];

            // Add chosen item to inventory
            STATE.inventory.push({ uid: `item_${Date.now()}_${Math.random().toString(36).slice(2)}`, defId: chosenId });

            // Count toward merchant achievement (same as a sell/trade action)
            trackAchStat('itemsSold');

            save();
            buildInventoryPanel();
            showToast(`${chosenDef.icon} ${itemName(chosenDef)} added to your inventory!`);

            modal.remove();
        });
    });
}