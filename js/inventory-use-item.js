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



// Tracks cursed item usage while witch immunity is active (for the quest).
// Must be called once per cursed item use, before downside logic.
function _trackWitchImmuneCursedUse() {
    if (window._cursedImmune) {
        updateQuestStats('cursedUnderImmunityUsed', {});
    }
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
    // keystone_ergodic_field (291) and keystone_the_oracle (300) disable all auto-reveals
    if (ptHasSkill('keystone_ergodic_field') || window._oracleActive) return;
    const sol = cur.grid, rows = sol.length, cols = sol[0].length;
    let cands = [];
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (sol[r][c] === 1 && userGrid[r][c] !== 1 && !revealedGrid[r][c])
                cands.push([r, c]);

    // Targeted Reveal: chance to bias toward the least-filled unsolved row or col
    const targetChance = (ptHasSkill('targeted_reveal_1') ? 0.20 : 0)
        + (ptHasSkill('targeted_reveal_2') ? 0.20 : 0)
        + (ptHasSkill('targeted_reveal_3') ? 0.30 : 0);
    if (targetChance > 0 && Math.random() < targetChance && cands.length > 0) {
        // Find the unsolved row with the fewest filled correct cells
        let bestRow = -1, bestRowFilled = Infinity;
        for (let r = 0; r < rows; r++) {
            const filled = sol[r].filter((v, c) => v === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])).length;
            const total = sol[r].filter(v => v === 1).length;
            if (filled < total && filled < bestRowFilled) { bestRowFilled = filled; bestRow = r; }
        }
        // Find the unsolved col with the fewest filled correct cells
        let bestCol = -1, bestColFilled = Infinity;
        for (let c = 0; c < cols; c++) {
            const filled = sol.filter((row, r) => row[c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])).length;
            const total = sol.filter(row => row[c] === 1).length;
            if (filled < total && filled < bestColFilled) { bestColFilled = filled; bestCol = c; }
        }
        // Bias candidates toward cells in that row or col
        const biased = cands.filter(([r, c]) => r === bestRow || c === bestCol);
        if (biased.length > 0) cands = biased;

        showToast('Biased Reveal!');
    }

    const affected = [];
    shuffle(cands).slice(0, count).forEach(([r, c]) => {
        revealedGrid[r][c] = true;
        userGrid[r][c] = 1;
        renderCell(r, c);
        updClues(r, c);
        affected.push(`g-${r}-${c}`);
    });
    _applyCellEffect(affected, 'reveal');
    if (ptHasSkill('adjacency_matrix')) _adjacencyMatrixRefreshAll();
    trackAchStat('tilesRevealed', affected.length);
    checkWin();
}







//------------------------------------------------------------------------
//----------------------MARK WRONG TILES----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function markWrongTiles(count) {
    // keystone_ergodic_field (291) and keystone_the_oracle (300) disable all auto-marks
    if (ptHasSkill('keystone_ergodic_field') || window._oracleActive) return;
    const sol = cur.grid, rows = sol.length, cols = sol[0].length;
    let cands = [];
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (sol[r][c] === 0 && (userGrid[r][c] === 0 || userGrid[r][c] === 3) && !wrongGrid[r][c])
                cands.push([r, c]);

    // Dense Marker: chance to bias toward rows/cols that already have many filled cells
    const denseChance = (ptHasSkill('dense_marker_1') ? 0.20 : 0)
        + (ptHasSkill('dense_marker_2') ? 0.20 : 0)
        + (ptHasSkill('dense_marker_3') ? 0.30 : 0);
    if (denseChance > 0 && Math.random() < denseChance && cands.length > 0) {
        // Find the row with the most filled correct cells that is not yet complete
        let bestRow = -1, bestRowFilled = -1;
        for (let r = 0; r < rows; r++) {
            const filled = sol[r].filter((v, c) => v === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])).length;
            const total = sol[r].filter(v => v === 1).length;
            if (filled < total && filled > bestRowFilled) { bestRowFilled = filled; bestRow = r; }
        }
        let bestCol = -1, bestColFilled = -1;
        for (let c = 0; c < cols; c++) {
            const filled = sol.filter((row, r) => row[c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])).length;
            const total = sol.filter(row => row[c] === 1).length;
            if (filled < total && filled > bestColFilled) { bestColFilled = filled; bestCol = c; }
        }
        const biased = cands.filter(([r, c]) => r === bestRow || c === bestCol);
        if (biased.length > 0) cands = biased;

        showToast('Biased Mark!')
    }

    const affected = [];
    shuffle(cands).slice(0, count).forEach(([r, c]) => {
        userGrid[r][c] = 2;
        renderCell(r, c);
        affected.push(`g-${r}-${c}`);
    });
    _applyCellEffect(affected, 'mark');
    trackAchStat('tilesMarkedWrong', affected.length);
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
    if (ptHasSkill('adjacency_matrix')) _adjacencyMatrixRefreshAll();
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
    if (ptHasSkill('adjacency_matrix')) _adjacencyMatrixRefreshAll();
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
                updClues(r, c);
            }
        }
    });
    if (targets.length > 0) questStat_rowsErased(targets.length);
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
                updClues(r, c);
            }
        }
    });
    if (targets.length > 0) questStat_rowsErased(targets.length);
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
                updClues(r, c);
                erasedCells.push(`g-${r}-${c}`);
            }
        }
    });
    // Lingering red shimmer so the player clearly sees what was erased
    _applyCellEffect(erasedCells, 'erase');
    if (ptHasSkill('adjacency_matrix')) _adjacencyMatrixRefreshAll();
    if (targets.length > 0) questStat_rowsErased(targets.length);
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
                updClues(r, c);
                erasedCells.push(`g-${r}-${c}`);
            }
        }
    });
    // Lingering red shimmer so the player clearly sees what was erased
    _applyCellEffect(erasedCells, 'erase');
    if (ptHasSkill('adjacency_matrix')) _adjacencyMatrixRefreshAll();
    if (targets.length > 0) questStat_rowsErased(targets.length);
    return targets.length;
}




//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns the effective duration for a cursed downside, factoring in
// Dampened Curse, Curse Embrace immunity, and Veil of Purity.
function _cursedDownsideDuration(baseMs) {
    if (window._cursedImmune) {
        questStat_curseBlocked();
        return 0;
    }
    if (ptHasSkill('keystone_curse_embrace')) {
        questStat_curseBlocked();
        return 0;
    }

    // FIRST USE: Immune to curse
    if (ptHasSkill('keystone_veil_of_purity')) {
        if (!window._veiled_cursedUsed) {
            window._veiled_cursedUsed = true;
            showToast('Veil of Purity: Downside prevented!');
            questStat_curseBlocked();
            return 0;
        }

        // SUBSEQUENT USES: Curse is amplified
        showToast('Veil of Purity broken! Curse amplified!');
        return Math.round(baseMs * 2);
    }
    let mult = 1.0;
    if (ptHasSkill('dampened_curse_1')) mult -= 0.10;
    if (ptHasSkill('dampened_curse_2')) mult -= 0.10;
    if (ptHasSkill('dampened_curse_3')) mult -= 0.15;
    return Math.round(baseMs * Math.max(0, mult));
}

// Returns adjusted count for cursed erase effects (rows/cols erased).
function _cursedDownsideCount(baseCount) {
    if (window._cursedImmune) {
        questStat_curseBlocked();
        return 0;
    }
    if (ptHasSkill('keystone_curse_embrace')) {
        questStat_curseBlocked();
        return 0;

    }
    // FIRST USE: Immune to curse (duration check sets flag, but we check/toast here too)
    if (ptHasSkill('keystone_veil_of_purity')) {
        if (!window._veiled_cursedUsed) {
            showToast('Veil of Purity: Downside prevented!');
            questStat_curseBlocked();
            return 0; // first use: immunity (flag set in duration)
        }
        // Subsequent uses: double the downside

        showToast('Veil of Purity broken! Curse amplified!');
        return Math.round(baseCount * 2);
    }
    const durationMult = _cursedDownsideDuration(1000) / 1000;
    return Math.max(0, Math.floor(baseCount * durationMult));
}


// Returns true if the blackout_ward nodes block a blackout effect this trigger.
function _blackoutWardBlocks() {
    let chance = 0;
    if (ptHasSkill('blackout_ward_1')) chance += 0.30;
    if (ptHasSkill('blackout_ward_2')) chance += 0.10;
    if (ptHasSkill('blackout_ward_3')) chance += 0.20;
    return chance > 0 && Math.random() < chance;
}

// Returns true if the removal_ward nodes block a row/col erasure effect this trigger.

function _removalWardBlocks() {
    let chance = 0;
    if (ptHasSkill('removal_ward_1')) chance += 0.30;
    if (ptHasSkill('removal_ward_2')) chance += 0.10;
    if (ptHasSkill('removal_ward_3')) chance += 0.20;
    return chance > 0 && Math.random() < chance;
}





//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------












//------------------------------------------------------------------------
//-------------------REVEAL ITEMS-----------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _useReveal(id, def) {

    questStat_revealItemUsed();
    let count = parseInt(id.replace('reveal', '')) || 1;

    // Passive: Stronger Light
    count += (ptHasSkill('stronger_light_1') ? 1 : 0)
        + (ptHasSkill('stronger_light_2') ? 1 : 0)
        + (ptHasSkill('stronger_light_3') ? 1 : 0);

    // Keystone: Blinding Truth — 50% more reveals (rounded up), mark-wrong blocked elsewhere
    if (ptHasSkill('keystone_blinding_truth')) count = Math.ceil(count * 1.5);

    // Keystone: Countdown Crisis — 5× if timer < 3 min
    if (ptHasSkill('keystone_countdown_crisis') && timerSecs < 180) count *= 5;

    // Keystone: Curse Embrace — non-cursed items 50% weaker
    if (ptHasSkill('keystone_curse_embrace')) count = Math.max(1, Math.floor(count * 0.5));

    // Keystone: Iron Doctrine — all non-cursed items at 300% for reveals (same modifier)
    if (ptHasSkill('keystone_iron_doctrine')) count = Math.ceil(count * 3);

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
    // Keystone: Blinding Truth blocks mark-wrong items entirely
    if (ptHasSkill('keystone_blinding_truth')) {
        return `${def.icon} ${LANG === 'de' ? 'Blockiert durch Blendende Wahrheit!' : 'Blocked by Blinding Truth!'}`;
    }

    let count = parseInt(id.replace('markWrong', '')) || 2;

    // Passive: Stronger Marks
    count += (ptHasSkill('stronger_marks_1') ? 1 : 0)
        + (ptHasSkill('stronger_marks_2') ? 1 : 0)
        + (ptHasSkill('stronger_marks_3') ? 1 : 0);

    // Keystone: Curse Embrace — non-cursed items 50% weaker
    if (ptHasSkill('keystone_curse_embrace')) count = Math.max(1, Math.floor(count * 0.5));

    // Keystone: Iron Doctrine — 300% effectiveness
    if (ptHasSkill('keystone_iron_doctrine')) count = Math.ceil(count * 3);

    markWrongTiles(count);
    playItemEffect(id);
    return `${def.icon} ${t('item_marked').replace('{n}', count)}`;
}




//------------------------------------------------------------------------
//---------------ADDITIONAL TIME ITEMS------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function _useAddTime(id, def) {
    // Keystone: Gambler's Ruin — bonus time from all other sources is disabled
    if (ptHasSkill('keystone_gamblers_ruin')) {
        return `${def.icon} ${LANG === 'de' ? 'Blockiert durch Ruin des Spielers!' : 'Blocked by Gambler\'s Ruin!'}`;
    }

    let secs = parseInt(id.replace('addTime', '')) || 30;

    // Passive: Extended Hour (10%, 10%, 15%)
    let multiplier = 1.0;
    if (ptHasSkill('extended_hour_1')) multiplier += 0.10;
    if (ptHasSkill('extended_hour_2')) multiplier += 0.15;
    if (ptHasSkill('extended_hour_3')) multiplier += 0.10;

    // Keystone: Golden Clock — timer items 100% more effective while active
    if (window._goldenClockActive) multiplier += 1.0;

    // Keystone: Iron Doctrine — 300% effectiveness
    if (ptHasSkill('keystone_iron_doctrine')) multiplier += 3.0;

    // Keystone: Curse Embrace — non-cursed 50% weaker
    if (ptHasSkill('keystone_curse_embrace')) multiplier *= 0.5;

    secs = Math.round(secs * multiplier);

    // Keystone: Countdown Crisis — subtracts time instead of adding
    if (ptHasSkill('keystone_countdown_crisis')) {
        questStat_timerItemUsed();
        timerSecs = Math.max(0, timerSecs - secs);
        updTimer();
        playItemEffect(id);
        return `${def.icon} ${LANG === 'de' ? `−${secs}s (Countdown-Krise!)` : `−${secs}s (Countdown Crisis!)`}`;
    }

    questStat_timerItemUsed();
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
    if (ptHasSkill('keystone_iron_doctrine')) {
        return `${def.icon} ${LANG === 'de' ? 'Blockiert durch Eiserne Doktrin!' : 'Blocked by Iron Doctrine!'}`;
    }
    if (ptHasSkill('keystone_null_hypothesis')) {
        return `${def.icon} ${LANG === 'de' ? 'Blockiert durch Nullhypothese!' : 'Blocked by Null Hypothesis!'}`;
    }
    if (ptHasSkill('keystone_asymptotic_mastery')) {
        return `${def.icon} ${LANG === 'de' ? 'Blockiert durch Asymptotische Meisterschaft!' : 'Blocked by Asymptotic Mastery!'}`;
    }
    shieldActive = true;

    // Passive: Reinforced Ward — each node adds 1 extra absorbed mistake
    const extraCharges = (ptHasSkill('reinforced_ward_1') ? 1 : 0)
        + (ptHasSkill('reinforced_ward_2') ? 1 : 0)
        + (ptHasSkill('reinforced_ward_3') ? 1 : 0);
    // Store extra charges for the mistake handler to consume
    window._shieldExtraCharges = (window._shieldExtraCharges || 0) + extraCharges;

    // Passive: Cursed Ward — each node adds 5 s of cursed immunity (max 15 s)
    const cursedWardSecs = (ptHasSkill('cursed_ward_1') ? 5 : 0)
        + (ptHasSkill('cursed_ward_2') ? 5 : 0)
        + (ptHasSkill('cursed_ward_3') ? 5 : 0);
    if (cursedWardSecs > 0) {
        window._cursedImmune = true;
        setTimeout(() => { window._cursedImmune = false; }, cursedWardSecs * 1000);

        showToast('Warded against curses!')
    }

    playItemEffect(id);
    return `${def.icon} ${t('item_shield_msg')}`;
}








//------------------------------------------------------------------------
//-------------------TUTOR ITEMS------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function _useMistakeEraser(id, def) {
    let reduceBy = id === 'mistakeEraserAll'
        ? mistakeCount
        : (parseInt(id.replace('mistakeEraser', '')) || 2);

    // Passive: Scholarly Aid
    if (id !== 'mistakeEraserAll') {
        reduceBy += (ptHasSkill('scholarly_aid_1') ? 1 : 0)
            + (ptHasSkill('scholarly_aid_2') ? 1 : 0)
            + (ptHasSkill('scholarly_aid_3') ? 1 : 0);
    }

    // Keystone: Iron Doctrine — 300% effectiveness
    if (ptHasSkill('keystone_iron_doctrine') && id !== 'mistakeEraserAll') reduceBy = Math.ceil(reduceBy * 3);

    // Keystone: Curse Embrace — non-cursed 50% weaker
    if (ptHasSkill('keystone_curse_embrace') && id !== 'mistakeEraserAll') reduceBy = Math.max(1, Math.floor(reduceBy * 0.5));

    const before = mistakeCount;
    mistakeCount = Math.max(0, mistakeCount - reduceBy);
    playItemEffect(id);
    const removed = before - mistakeCount;
    if (removed > 0) questStat_mistakesRemoved(removed);

    // Passive: Time Well Spent — bonus time per mistake removed
    if (removed > 0 && !ptHasSkill('keystone_gamblers_ruin')) {
        let bonusSecs = 0;
        if (ptHasSkill('time_well_spent_1')) bonusSecs = 30;
        if (ptHasSkill('time_well_spent_2')) bonusSecs = 60;
        if (ptHasSkill('time_well_spent_3')) bonusSecs = 90;
        if (bonusSecs > 0) {
            timerSecs += bonusSecs * removed;
            updTimer();
        }
    }

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
    if (!ptHasSkill('keystone_null_hypothesis')) shieldActive = true;
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

function _useCursedTime(id, def) {
    _trackWitchImmuneCursedUse();
    timerSecs += 1200;
    updTimer();
    playItemEffect(id);
    const dur = _cursedDownsideDuration(30000);
    if (dur > 0 && !_blackoutWardBlocks()) {
        applyCursedRowBlackout(dur);
        applyCursedColBlackout(dur);
    } else if (dur > 0) {
        showToast(`🌑 ${LANG === 'de' ? 'Verdunklungs-Schutz! Hinweise geschützt.' : 'Blackout Ward! Clues protected.'}`);
    }
    return `💀 ${t('item_cursed_time_both')}`;
}

function _useCursedShield(id, def) {
    _trackWitchImmuneCursedUse();
    shieldActive = true;
    revealTiles(2);
    const dur = _cursedDownsideDuration(30000);
    if (dur > 0 && !_blackoutWardBlocks()) {
        applyCursedRowBlackout(dur);
    } else if (dur > 0) {
        showToast(`🌑 ${LANG === 'de' ? 'Verdunklungs-Schutz! Hinweise geschützt.' : 'Blackout Ward! Clues protected.'}`);
    }
    playItemEffect(id);
    return `👁️ ${t('item_cursed_shield_both')}`;
}

function _useCursedRowSolve(id, def) {
    _trackWitchImmuneCursedUse();
    const preFilledRows = _getPreFilledRows();
    const revealed = solveRows(3);
    const eraseCount = _cursedDownsideCount(1);
    let erased = 0;
    if (eraseCount > 0) {
        if (_removalWardBlocks()) {
            showToast(`🔒 ${LANG === 'de' ? 'Entfernungsschutz! Zeilen behalten.' : 'Removal Ward! Rows kept.'}`);
        } else {
            erased = unsolveRowsExcluding(eraseCount, preFilledRows);
        }
    }
    playItemEffect(id);
    if (revealed > 0) checkWin();
    return `🌊 ${t('item_cursed_row_both').replace('{r}', revealed).replace('{e}', erased)}`;
}

function _useCursedColSolve(id, def) {
    _trackWitchImmuneCursedUse();
    const preFilledCols = _getPreFilledCols();
    const revealed = solveCols(3);
    const eraseCount = _cursedDownsideCount(1);
    let erased = 0;
    if (eraseCount > 0) {
        if (_removalWardBlocks()) {
            showToast(`🔒 ${LANG === 'de' ? 'Entfernungsschutz! Spalten behalten.' : 'Removal Ward! Columns kept.'}`);
        } else {
            erased = unsolveColsExcluding(eraseCount, preFilledCols);
        }
    }
    playItemEffect(id);
    if (revealed > 0) checkWin();
    return `🌪️ ${t('item_cursed_col_both').replace('{r}', revealed).replace('{e}', erased)}`;
}

function _useCursedRowCol(id, def) {
    _trackWitchImmuneCursedUse();
    const r = solveRows(4);
    const c = solveCols(4);
    const dur = _cursedDownsideDuration(45000);
    if (dur > 0 && !_blackoutWardBlocks()) {
        applyCursedColBlackout(dur);
    } else if (dur > 0) {
        showToast(`🌑 ${LANG === 'de' ? 'Verdunklungs-Schutz! Hinweise geschützt.' : 'Blackout Ward! Clues protected.'}`);
    }
    playItemEffect(id);
    checkWin();
    return `💥 ${t('item_cursed_rowcol_both').replace('{r}', r).replace('{c}', c)}`;
}

function _useCursedReveal(id, def) {
    _trackWitchImmuneCursedUse();
    revealTiles(6);
    if (window._cursedImmune || ptHasSkill('keystone_curse_embrace')) {
        playItemEffect(id);
        return `☠️ ${LANG === 'de' ? 'Enthüllt 6 Zellen (Markierungen geschützt)!' : '6 cells revealed (marks protected)!'}`;
    }
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
    playItemEffect(id);
    return `☠️ ${t('item_cursed_reveal_both')}`;
}




//------------------------------------------------------------------------
//------------------PEARL ITEMS-------------------------------------------
//------------------------------------------------------------------------

function _usePearlOfHaste(id, def) {
    if (!STATE.playerClass) return `${def.icon} No class equipped!`;
    const cd = cooldownState['active1'];
    if (cd.interval) { clearInterval(cd.interval); cd.interval = null; }
    cd.remaining = 1;
    startSlotCooldown('active1', 1);
    playItemEffect(id);
    return `${def.icon} ${LANG === 'de' ? 'Abklingzeit 1 auf 1s reduziert!' : 'Skill 1 cooldown set to 1s!'}`;
}

function _usePearlOfSwiftness(id, def) {
    if (!STATE.playerClass) return `${def.icon} No class equipped!`;
    const cd = cooldownState['active2'];
    if (cd.interval) { clearInterval(cd.interval); cd.interval = null; }
    cd.remaining = 1;
    startSlotCooldown('active2', 1);
    playItemEffect(id);
    return `${def.icon} ${LANG === 'de' ? 'Abklingzeit 2 auf 1s reduziert!' : 'Skill 2 cooldown set to 1s!'}`;
}

function _useGrandPearl(id, def) {
    if (!STATE.playerClass) return `${def.icon} No class equipped!`;
    ['active1', 'active2'].forEach(slot => {
        const cd = cooldownState[slot];
        if (cd.interval) { clearInterval(cd.interval); cd.interval = null; }
        cd.remaining = 1;
        startSlotCooldown(slot, 1);
    });
    playItemEffect(id);
    return `${def.icon} ${LANG === 'de' ? 'Beide Abklingzeiten auf 1s reduziert!' : 'Both skill cooldowns set to 1s!'}`;
}

//------------------------------------------------------------------------
//------------------THE WITCH---------------------------------------------
//------------------------------------------------------------------------

function _useTheWitch(id, def) {
    // -10 min penalty first
    timerSecs = Math.max(0, timerSecs - 600);
    updTimer();
    // Cursed immunity for 60 s
    window._cursedImmune = true;
    playItemEffect(id);
    showToast(`🧙 ${LANG === 'de' ? 'Verfluchter Schutz für 60s! −10 Min.' : 'Cursed immunity 60s! −10 min.'}`);
    setTimeout(() => {
        window._cursedImmune = false;
        showToast(`🧙 ${LANG === 'de' ? 'Hexenschutz endet.' : 'Witch immunity faded.'}`);
    }, 60000);
    return '';  // toast already shown above
}

//------------------------------------------------------------------------
//------------------GOLDEN CLOCK------------------------------------------
//------------------------------------------------------------------------

function _useGoldenClock(id, def) {
    window._goldenClockActive = true;
    window._goldenClockMistakesLeft = 3;
    playItemEffect(id);
    // Update mistake display immediately so player sees the new limit
    const mcEl = document.getElementById('mistake-counter');
    if (mcEl) mcEl.textContent = `✗ ${mistakeCount} 🕰️`;
    return `${def.icon} ${LANG === 'de' ? 'Timer angehalten! Noch 3 Fehler erlaubt.' : 'Timer halted! 3 mistakes remaining.'}`;
}

//------------------------------------------------------------------------
//------------------SHADOW SEAL-------------------------------------------
//------------------------------------------------------------------------

function _useShadowSeal(id, def) {
    questStat_shadowSealUsed();

    if (!cur) return '';

    // 1. Set timer to exactly 5 min
    timerSecs = 300;
    updTimer();

    // 2. Permanently hide all clues for the rest of the level
    window._shadowSealActive = true;
    document.querySelectorAll('.row-clue, .col-clue, [class*="rct-"], [class*="cch-"]')
        .forEach(el => el.classList.add('clue-blackout'));

    // 3. Mark 75% of all wrong empty tiles
    const sol = cur.grid, rows = sol.length, cols = sol[0].length;
    const cands = [];
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (sol[r][c] === 0 && (userGrid[r][c] === 0 || userGrid[r][c] === 3) && !wrongGrid?.[r]?.[c])
                cands.push([r, c]);

    const markCount = Math.floor(cands.length * 0.75);
    shuffle(cands);
    const affected = [];
    cands.slice(0, markCount).forEach(([r, c]) => {
        userGrid[r][c] = 2;
        renderCell(r, c);
        affected.push(`g-${r}-${c}`);
    });
    _applyCellEffect(affected, 'mark');

    playItemEffect(id);
    return `${def.icon} ${LANG === 'de' ? `Schattensiegel! Hinweise versteckt, ${markCount} Felder markiert.` : `Shadow Seal! Clues hidden, ${markCount} tiles marked.`}`;
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
    mistakeEraser4: _useMistakeEraser,
    mistakeEraser6: _useMistakeEraser,
    mistakeEraserAll: _useMistakeEraser,
    artifactComplete: _useArtifactComplete,
    scoutPrimer: _useScoutPrimer,
    cursedReveal: _useCursedReveal,
    cursedTime: _useCursedTime,
    cursedShield: _useCursedShield,
    cursedRowSolve: _useCursedRowSolve,
    cursedColSolve: _useCursedColSolve,
    cursedRowCol: _useCursedRowCol,
    pearlOfHaste: _usePearlOfHaste,
    pearlOfSwiftness: _usePearlOfSwiftness,
    grandPearl: _useGrandPearl,
    theWitch: _useTheWitch,
    goldenClock: _useGoldenClock,
    shadowSeal: _useShadowSeal,
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
    if (id === 'mistakeEraser' || id === 'mistakeEraser4' || id === 'mistakeEraser6' || id === 'mistakeEraserAll') trackAchStat('eraserUsed');
    if (id === 'cursedReveal') trackAchStat('cursedLensUsed');
    if (id === 'cursedTime') trackAchStat('cursedClockUsed');
    if (id === 'cursedShield') trackAchStat('demonEyeUsed');
    if (id === 'cursedRowSolve') trackAchStat('tidalWaveUsed');
    if (id === 'cursedColSolve') trackAchStat('vortexUsed');
    if (id === 'cursedRowCol') trackAchStat('chaosGridUsed');
    if (id === 'scoutPrimer') trackAchStat('scoutPrimerUsed');

    if (id === 'rowSolve' || id === 'colSolve') trackAchStat('rowColSolved');

    if (id.startsWith('addTime')) {
        const secs = parseInt(id.replace('addTime', '')) || 0;
        if (secs > 0) trackAchStat('timeAdded', secs);
    }
    if (id === 'cursedTime') trackAchStat('timeAdded', 1200);

    if (itemsUsedThisLevel >= 3) trackAchStat('threeItemsOneLevelCount');

    if (def.rarity === 'cursed' && !STATE.done.includes(cur.gIdx)) {
        trackAchStat('cursedFirstAttempts');
    }

    if (id === 'pearlOfHaste' || id === 'pearlOfSwiftness' || id === 'grandPearl') trackAchStat('pearlsUsed');
    if (id === 'theWitch') trackAchStat('witchUsed');
    if (id === 'goldenClock') trackAchStat('goldenClockUsed');
    if (id === 'shadowSeal') trackAchStat('shadowSealUsed');


}





//------------------------------------------------------------------------
//----------------------------CONSUME ITEM--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// Removes the item from inventory, increments the used counter,
// tracks achievements, saves, shows the toast, and rebuilds the panel

function _consumeItem(idx, def, msg) {
    // Frugal Use: chance to not consume the item
    const frugalChance = (ptHasSkill('frugal_use_1') ? 0.05 : 0)
        + (ptHasSkill('frugal_use_2') ? 0.05 : 0)
        + (ptHasSkill('frugal_use_3') ? 0.07 : 0);
    if (frugalChance > 0 && Math.random() < frugalChance) {
        // Item is not consumed — skip the splice, just track and show toast
        itemsUsedThisLevel++;
        _trackItemAchievements(def.id, def);
        updateQuestStats('itemUsed', { defId: def.id, rarity: def.rarity });
        save();
        showToast(msg + (LANG === 'de' ? ' ♻ Nicht verbraucht!' : ' ♻ Not consumed!'));
        buildInventoryPanel();
        return;
    }

    STATE.inventory.splice(idx, 1);
    itemsUsedThisLevel++;
    _trackItemAchievements(def.id, def);
    updateQuestStats('itemUsed', { defId: def.id, rarity: def.rarity });
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