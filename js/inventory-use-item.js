



//------------------------------------------------------------------------
//-------------------GET PRE-FILLED ROWS & COLS---------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Snapshots which rows currently have at least one filled correct cell.
// Used by cursedRowSolve so the negative erase only targets pre-existing rows.
function _getPreFilledRows() {
    const s = cur.grid, rows = s.length, cols = s[0].length;
    const set = new Set();
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (s[r][c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])) { set.add(r); break; }
    return set;
}

// Same as above but for columns.
function _getPreFilledCols() {
    const s = cur.grid, rows = s.length, cols = s[0].length;
    const set = new Set();
    for (let c = 0; c < cols; c++)
        for (let r = 0; r < rows; r++)
            if (s[r][c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])) { set.add(c); break; }
    return set;
}



//------------------------------------------------------------------------
//----------------------ROW & COL BLACKOUT--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



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




//------------------------------------------------------------------------
//-----------------------REVEAL TILES-------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
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
        renderCell(r, c);          
        updClues(r, c);            
        affected.push(`g-${r}-${c}`);
    });
    _applyCellEffect(affected, 'reveal');

    trackAchStat('tilesRevealed', affected.length);
    checkWin(); 
}







//------------------------------------------------------------------------
//----------------------MARK WRONG TILES----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


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
        renderCell(r, c);   
        affected.push(`g-${r}-${c}`);
    });
    _applyCellEffect(affected, 'mark');
    trackAchStat('tilesMarked', affected.length);
}




//------------------------------------------------------------------------
//-------------------SHUFFLE HELPER---------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]; 
    }
    return a;
}



//------------------------------------------------------------------------
//-----------------------SOLVE ROWS & COLS--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

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





//------------------------------------------------------------------------
//-------------------------UNSOLVE ROWS & COLS----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

//   erases 'count' random rows of player progress.
//   Clears both player-filled and item-revealed correct cells in those rows,
//   resetting them to empty. Wrong marks are left untouched.
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




//------------------------------------------------------------------------
//-------------UNSOLVE ROWS & COLS (EXCLUDING VARIANT)--------------------
//----cursed items only target rows & cols the player filled--------------
//------------------------------------------------------------------------



//   like unsolveRows but only
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




//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------








//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------












//------------------------------------------------------------------------
//-------------------REVEAL ITEMS-----------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _useReveal(id, def) {
    const count = parseInt(id.replace('reveal', '')) || 1;
    revealTiles(count);
    playItemEffect(id);
    return `${def.icon} ${count > 1 ? t('item_revealed_pl').replace('{n}', count) : t('item_revealed').replace('{n}', count)}`;
}



//------------------------------------------------------------------------
//-------------------------ROW SOLVE--------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _useRowSolve(id, def) {
    const n = solveRows(1);
    playItemEffect(id);
    if (n > 0) checkWin();
    return n > 0 ? `${def.icon} ${t('item_row_solved')}` : `${def.icon} ${t('item_row_solved_none')}`;
}



//------------------------------------------------------------------------
//----------------------------COL SOLVE-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _useColSolve(id, def) {
    const n = solveCols(1);
    playItemEffect(id);
    if (n > 0) checkWin();
    return n > 0 ? `${def.icon} ${t('item_col_solved')}` : `${def.icon} ${t('item_col_solved_none')}`;
}



//------------------------------------------------------------------------
//-----------------------SCOUTS PRIMER------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _useScoutPrimer(id, def) {
    STATE.primerPending = true;
    save();
    playItemEffect(id);
    return `📜 ${t('item_primer_activated')}`;
}



//------------------------------------------------------------------------
//---------------------CODEX OF COMPLETION--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _useArtifactComplete(id, def) {
    const sol = cur.grid, rows = sol.length, cols = sol[0].length;
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (sol[r][c] === 1 && userGrid[r][c] !== 1) {
                revealedGrid[r][c] = true;
                userGrid[r][c] = 1;
                renderCell(r, c);
                updClues(r, c);
            }
    playItemEffect(id);
    checkWin();
    return `🌟 ${t('item_artifact_complete')}`;
}




//------------------------------------------------------------------------
//------------------MARK WRONG ITEMS--------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function _useMarkWrong(id, def) {
    const count = parseInt(id.replace('markWrong', '')) || 2;
    markWrongTiles(count);
    playItemEffect(id);
    return `${def.icon} ${t('item_marked').replace('{n}', count)}`;
}




//------------------------------------------------------------------------
//---------------ADDITIONAL TIME ITEMS------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function _useAddTime(id, def) {
    const secs = parseInt(id.replace('addTime', '')) || 30;
    timerSecs += secs;
    updTimer();
    playItemEffect(id);
    return `${def.icon} ${t('item_time_added').replace('{n}', secs)}`;
}






//------------------------------------------------------------------------
//-------------------SHIELD ITEMS-----------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _useShield(id, def) {
    shieldActive = true;
    playItemEffect(id);
    return `${def.icon} ${t('item_shield_msg')}`;
}








//------------------------------------------------------------------------
//-------------------TUTOR ITEMS------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function _useMistakeEraser(id, def) {
    const before = mistakeCount;
    mistakeCount = Math.max(0, mistakeCount - 2);
    playItemEffect(id);
    const removed = before - mistakeCount;
    const mcEl = document.getElementById('mistake-counter');
    if (mcEl) mcEl.textContent = `✗ ${mistakeCount}`;
    return removed > 0
        ? `${def.icon} ${t('item_mistake_erased').replace('{n}', removed)}`
        : `${def.icon} ${t('item_mistake_erased_none')}`;
}








//------------------------------------------------------------------------
//---------------------FREEZE ITEMS---------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _useFreeze(id, def) {
    const FREEZE_DURATION = 2000;
    timerFrozen = true;
    shieldActive = true;
    window._freezeActive = true;
    updTimer();
    playItemEffect(id);
    if (timerSecs <= 10) trackAchStat('freezeClutches');

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

    return `${def.icon} ${t('item_freeze_msg')}`;
}





//------------------------------------------------------------------------
//-------------------CURSED ITEMS-----------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function _useCursedReveal(id, def) {
    // ✅ Reveals 6 tiles   ⚠️ Clears all player ✕ marks
    revealTiles(6);
    playItemEffect(id);
    const rows = cur.grid.length, cols = cur.grid[0].length;
    const unmarked = [];
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (userGrid[r][c] === 2) {
                userGrid[r][c] = 0;
                renderCell(r, c);
                unmarked.push(`g-${r}-${c}`);
            }
    _applyCellEffect(unmarked, 'unmark');
    return `☠️ ${t('item_cursed_reveal_both')}`;
}

function _useCursedTime(id, def) {
    // ✅ +10 minutes   ⚠️ Row + column clue blackout 30s
    timerSecs += 1200;
    updTimer();
    playItemEffect(id);
    applyCursedRowBlackout(30000);
    applyCursedColBlackout(30000);
    return `💀 ${t('item_cursed_time_both')}`;
}

function _useCursedShield(id, def) {
    // ✅ Shield + 2 revealed tiles   ⚠️ Row clue blackout 30s
    shieldActive = true;
    revealTiles(2);
    applyCursedRowBlackout();
    playItemEffect(id);
    return `👁️ ${t('item_cursed_shield_both')}`;
}

function _useCursedRowSolve(id, def) {
    // ✅ Reveals 3 unsolved rows   ⚠️ Erases 1 different pre-filled row
    const preFilledRows = _getPreFilledRows();
    const revealed = solveRows(3);
    const erased = unsolveRowsExcluding(1, preFilledRows);
    playItemEffect(id);
    if (revealed > 0) checkWin();
    return `🌊 ${t('item_cursed_row_both').replace('{r}', revealed).replace('{e}', erased)}`;
}

function _useCursedColSolve(id, def) {
    // ✅ Reveals 3 unsolved cols   ⚠️ Erases 1 different pre-filled col
    const preFilledCols = _getPreFilledCols();
    const revealed = solveCols(3);
    const erased = unsolveColsExcluding(1, preFilledCols);
    playItemEffect(id);
    if (revealed > 0) checkWin();
    return `🌪️ ${t('item_cursed_col_both').replace('{r}', revealed).replace('{e}', erased)}`;
}

function _useCursedRowCol(id, def) {
    // ✅ Reveals 4 rows + 4 cols   ⚠️ Column clue blackout 45s
    const r = solveRows(4);
    const c = solveCols(4);
    applyCursedColBlackout(45000);
    playItemEffect(id);
    checkWin();
    return `💥 ${t('item_cursed_rowcol_both').replace('{r}', r).replace('{c}', c)}`;
}



//------------------------------------------------------------------------
//------------------ITEM EFFECT DISPATCH TABLE----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

//  Maps item id -> handler function.
//  Prefix entries (reveal*, markWrong*, addTime*)
//  are matched first before falling through to the
//  exact-id lookup.


const ITEM_EFFECT_HANDLERS = {
    // exact-id items
    freeze: _useFreeze,
    shield: _useShield,
    rowSolve: _useRowSolve,
    colSolve: _useColSolve,
    mistakeEraser: _useMistakeEraser,
    artifactComplete: _useArtifactComplete,
    scoutPrimer: _useScoutPrimer,
    cursedReveal: _useCursedReveal,
    cursedTime: _useCursedTime,
    cursedShield: _useCursedShield,
    cursedRowSolve: _useCursedRowSolve,
    cursedColSolve: _useCursedColSolve,
    cursedRowCol: _useCursedRowCol,
};

// Prefix-matched items (reveal1–4, markWrong2–8, addTime30–180).
// Checked before the exact table since their ids are dynamic.
const ITEM_PREFIX_HANDLERS = [
    { prefix: 'reveal', handler: _useReveal, exclude: ['cursedReveal'] },
    { prefix: 'markWrong', handler: _useMarkWrong, exclude: [] },
    { prefix: 'addTime', handler: _useAddTime, exclude: [] },
];

function _dispatchItemEffect(id, def) {
    for (const { prefix, handler, exclude } of ITEM_PREFIX_HANDLERS) {
        if (id.startsWith(prefix) && !exclude.includes(id)) {
            return handler(id, def);
        }
    }
    const handler = ITEM_EFFECT_HANDLERS[id];
    if (handler) return handler(id, def);

    return ''; // unknown item
}




//------------------------------------------------------------------------
//----------------ACHIEVEMENTS FOR ITEM USEAGE----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Fires all achievement tracking for the item that was just used
function _trackItemAchievements(id, def) {
    trackAchStat('itemsUsed');
    if (def.rarity === 'cursed') trackAchStat('cursedItemsUsed');
    if (id === 'shield') trackAchStat('shieldsUsed');
    if (id === 'artifactComplete') trackAchStat('artifactUsed');
    if (id === 'freeze') trackAchStat('freezeUsed');
    if (id === 'mistakeEraser') trackAchStat('eraserUsed');
    if (id === 'cursedReveal') trackAchStat('cursedLensUsed');
    if (id === 'cursedTime') trackAchStat('cursedClockUsed');
    if (id === 'cursedShield') trackAchStat('demonEyeUsed');
    if (id === 'cursedRowSolve') trackAchStat('tidalWaveUsed');
    if (id === 'cursedColSolve') trackAchStat('vortexUsed');
    if (id === 'cursedRowCol') trackAchStat('chaosGridUsed');

    if (id === 'rowSolve' || id === 'colSolve'
        || id.startsWith('cursedRow') || id.startsWith('cursedCol')
        || id === 'cursedRowCol') trackAchStat('rowColSolved');

    if (id.startsWith('addTime')) {
        const secs = parseInt(id.replace('addTime', '')) || 0;
        if (secs > 0) trackAchStat('timeAdded', secs);
    }
    if (id === 'cursedTime') trackAchStat('timeAdded', 1200);

    if (itemsUsedThisLevel === 3) trackAchStat('threeItemsOneLevelCount');

    if (def.rarity === 'cursed' && !STATE.done.includes(cur.gIdx)) {
        trackAchStat('cursedFirstAttempts');
    }
}





//------------------------------------------------------------------------
//----------------------------CONSUME ITEM--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// Removes the item from inventory, increments the used counter,
// tracks achievements, saves, shows the toast, and rebuilds the panel

function _consumeItem(idx, def, msg) {
    STATE.inventory.splice(idx, 1);
    itemsUsedThisLevel++;
    _trackItemAchievements(def.id, def);
    save();
    showToast(msg);
    buildInventoryPanel();
}





//------------------------------------------------------------------------
//----------------------------USE ITEM------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function useItem(uid) {
    if (dead || curMods.ironman) return;

    const idx = STATE.inventory.findIndex(i => i.uid === uid);
    if (idx < 0) return;

    const item = STATE.inventory[idx];
    const def = ITEM_DEFS[item.defId];
    if (!def) return;

    const msg = _dispatchItemEffect(def.id, def);
    _consumeItem(idx, def, msg);
}














































