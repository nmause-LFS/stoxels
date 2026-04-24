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
//     an optional lock warning, and the cost/sell footer.
//   - Attaches a click handler for useItem() only on unlocked items.
//     The sell button has its own onclick that calls sellItem() and uses
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
    const elapsed = DIFF_CFG[curDiff].timerStart - timerSecs;
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
            <div class="inv-item-rarity ${def.rarity}">${rarityLabel(def.rarity)}</div>
            <div class="inv-item-name">${itemName(def)}</div>
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
                // Guard: don't fire useItem if the sell button was clicked
                if (!e.target.classList.contains('inv-sell-btn')) useItem(item.uid);
            };
        }

        list.appendChild(el);
    });
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
//     'reveal*'    / 'cursedReveal'  → revealTiles()
//     'markWrong*' / 'cursedShield'  → markWrongTiles() or instant-fail gamble
//     'addTime*'   / 'cursedTime'    → add/subtract seconds
//     'freeze'                       → timerFrozen for 30 s
//     'shield'                       → shieldActive = true
//
//   After dispatching:
//   - Removes the item from STATE.inventory (consumed on use).
//   - Increments itemsUsedThisLevel (tracked for the 'noitem' bonus).
//   - Deducts scoreCost from totalScore if the item has a cost > 0.
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
    const elapsed = DIFF_CFG[curDiff].timerStart - timerSecs;
    const cursedMinElapsed = curMods.timetrial ? 60 : 180;
    if (isCursed && elapsed < cursedMinElapsed) {
        showToast(t('item_cursed_locked').replace('{n}', Math.ceil((cursedMinElapsed - elapsed) / 60)));
        return;
    }

    let msg = ''; // toast message built per item type below
    const id = def.id;

    // ── REVEAL items (reveal1–4) and cursedReveal ─────────────────────────
    if (id.startsWith('reveal') || id === 'cursedReveal') {
        // Parse the tile count from the id suffix (e.g. 'reveal3' → 3)
        const count = parseInt(id.replace('reveal', '')) || 1;

        if (id === 'cursedReveal') {
            // 50 % chance: bad outcome resets all non-revealed cells
            if (Math.random() < 0.5) {
                const rows = cur.grid.length, cols = cur.grid[0].length;
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        if (!revealedGrid[r][c]) {
                            userGrid[r][c] = 0;      // erase player progress
                            wrongGrid[r][c] = false;  // clear wrong marks too
                        }
                        renderCell(r, c); // grid.js — redraw every cell
                    }
                }
                msg = t('item_cursed_reset');
            } else {
                // 50 % chance: lucky outcome — reveal 6 tiles for free
                revealTiles(6);
                msg = t('item_cursed_lucky');
            }
        } else {
            // Standard reveal: show 'count' randomly chosen correct tiles
            revealTiles(count);
            msg = `${def.icon} ${count > 1 ? t('item_revealed_pl').replace('{n}', count) : t('item_revealed').replace('{n}', count)}`;
        }

        // ── MARK-WRONG items (markWrong2–8) and cursedShield ─────────────────
    } else if (id.startsWith('markWrong') || id === 'cursedShield') {
        const count = parseInt(id.replace('markWrong', '')) || 2;

        if (id === 'cursedShield') {
            // 30 % chance: instant game over (demon eye triggered)
            if (Math.random() < 0.3) {
                dead = true;
                stopTimer();
                document.getElementById('lose-title').textContent = t('item_demon_title');
                document.getElementById('lose-sub').textContent = t('item_demon_sub');
                document.getElementById('ov-lose').classList.add('show');
            } else {
                // 70 % chance: shield activates normally
                shieldActive = true;
                msg = t('item_demon_shield');
            }
        } else {
            // Standard mark: place ✕ on 'count' empty cells that should stay empty
            markWrongTiles(count);
            msg = `${def.icon} ${t('item_marked').replace('{n}', count)}`;
        }

        // ── ADD-TIME items (addTime30–180) and cursedTime ─────────────────────
    } else if (id.startsWith('addTime') || id === 'cursedTime') {
        if (id === 'cursedTime') {
            // 40 % chance: lose 4 minutes
            if (Math.random() < 0.4) {
                timerSecs = Math.max(0, timerSecs - 240);
                msg = t('item_cursed_time_bad');
            } else {
                // 60 % chance: gain 5 minutes
                timerSecs += 300;
                msg = t('item_cursed_time_good');
            }
            updTimer(); // timer.js — refresh display immediately
        } else {
            // Standard time add: parse seconds from the id suffix
            const secs = parseInt(id.replace('addTime', '')) || 30;
            timerSecs += secs;
            updTimer();
            msg = `${def.icon} ${t('item_time_added').replace('{n}', secs)}`;
        }

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

// sellItem(uid, e) — sells an item for its sellVal, adding points to the score.
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
        userGrid[r][c] = 1;    // count as filled for win-check purposes
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