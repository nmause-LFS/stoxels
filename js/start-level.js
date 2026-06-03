//------------------------------------------------------------------------
//--------------INITIATE LEVEL DATA---------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Sets cur to the puzzle object and tracks replays
function _initLevelData(gi) {
    cur = ALL[gi]; // current level object

    if (STATE.done.includes(gi)) {
        trackAchStat('levelsReplayed');
    }
}


//------------------------------------------------------------------------
//-----------------INITIATE GRIDS-----------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Creates fresh userGrid, wrongGrid, revealedGrid sized to the puzzle dimensions
function _initGrids() {
    const rows = cur.grid.length;
    const cols = cur.grid[0].length;

    userGrid = Array.from({ length: rows }, () => Array(cols).fill(0));
    wrongGrid = Array.from({ length: rows }, () => Array(cols).fill(false));
    revealedGrid = Array.from({ length: rows }, () => Array(cols).fill(false));
}


//------------------------------------------------------------------------
//---------------RESET ALL PER-LEVEL COUNTERS AND FLAGS-------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _resetLevelState() {
    mistakeCount = 0;
    absorbedMistakes = 0;
    levelStartTime = Date.now();
    itemsUsedThisLevel = 0;
    dead = false;
    painting = false;
    hoverRow = -1;
    hoverCol = -1;
    shieldActive = false;
    timerFrozen = false;
    quizAnsweredCorrectly = false;
    consecutiveCorrectFills = 0;
    _lawOfLargeNumbersNext = null;
    window._veiled_cursedUsed = false;
    _confidenceIntervalActive = false;
    _streakBonusFills = 0;
    window._asymptoticLinesCompleted = 0;
    window._stochasticLastFired = false;
    window._deadReckoningActive = false;
    window._deadReckoningUnlocked = false;

    window._mistakeLog = [];
    window._sigThresholdProtected = new Set();
    window._dofRevertedCells = new Set();
    window._sigThreshBonusReveal = false;
    window._regressionRewardedLines = new Set();
    window._hadPenaltyClutch = false;
    window._maxInventoryTrackedThisLevel = false;
    window._collectorTrackedThisLevel = false;

    resetToastQueue();

    _resetNewNodeState();
    resetWitchImmunityLevelCounter();

    resetQuestLevelCounters();

    // Hide completion glimpse bar from previous level
    const _cgBar = document.getElementById('completion-glimpse-bar');
    if (_cgBar) _cgBar.classList.add('hidden');
    if (window._completionGlimpseTimer) { clearTimeout(window._completionGlimpseTimer); window._completionGlimpseTimer = null; }
}



//------------------------------------------------------------------------
//-----------------------LUCKY TILES--------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Picks a handful of wrong cells as lucky tiles.
// Right-clicking a lucky tile to mark ✕ awards a free random item (once per level).
// Scale: 0 tiles for ≤25 cells, up to 1/2/3 for larger grids (randomised).
function _initLuckyTiles() {
    luckyTiles = new Set();
    luckyRewardClaimed = 0;

    const rows = cur.grid.length;
    const cols = cur.grid[0].length;
    const cellCount = rows * cols;

    // Grid size categories (grid_awareness node uses these thresholds):
    // Small: < 100 cells, Medium: 100-199, Large: 200-399, Massive: 400+
    const isLarge = cellCount >= 200 && cellCount <= 399;
    const isMassive = cellCount >= 400;
    const isLargeOrMassive = isLarge || isMassive;

    // grid_awareness (167): large/massive grids now guarantee exactly 1 lucky tile
    // (without the node the old probabilistic system applies, which caps at 0 for small grids)
    let maxTiles = 0;
    if (ptHasSkill('grid_awareness')) {
        // Small/Medium: no lucky tiles. Large: 1. Massive: 1 guaranteed + chance of 2.
        if (!isLargeOrMassive) {
            maxTiles = 0;
        } else if (isLarge) {
            maxTiles = 1;  // exactly 1 for large
        } else {
            maxTiles = 2;  // up to 2 for massive
        }
    }


    // fortunes_tile nodes (189-191): extra chance for an additional lucky tile on large/massive
    let extraTileChance = 0;
    if (isLargeOrMassive) {
        if (ptHasSkill('fortunes_tile_1')) extraTileChance += 0.10;
        if (ptHasSkill('fortunes_tile_2')) extraTileChance += 0.15;
        if (ptHasSkill('fortunes_tile_3')) extraTileChance += 0.25;
    }

    let tileCount;
    if (ptHasSkill('grid_awareness') && isLarge) {
        tileCount = 1 + (Math.random() < extraTileChance ? 1 : 0);
    } else if (ptHasSkill('grid_awareness') && isMassive) {
        tileCount = 1 + Math.floor(Math.random() * 2) + (Math.random() < extraTileChance ? 1 : 0);
    } else {
        tileCount = maxTiles === 0 ? 0 : Math.floor(Math.random() * (maxTiles + 1));
        if (tileCount > 0 && isLargeOrMassive) {
            tileCount += (Math.random() < extraTileChance ? 1 : 0);
        }
    }

    // keystone_variance_collapse (221): lucky tiles appear on ALL grids regardless of size.
    // Guarantees at least 1 tile even when the normal system would produce 0.
    if (ptHasSkill('keystone_variance_collapse') && tileCount === 0) {
        tileCount = 1;
    }

    if (tileCount === 0) return;

    const pool = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (cur.grid[r][c] !== 1) pool.push(`${r}-${c}`);
        }
    }
    shuffle(pool);
    for (let i = 0; i < Math.min(tileCount, pool.length); i++) {
        luckyTiles.add(pool[i]);
    }

    // outlier_detection (228-229): highlight 1 lucky tile per node (up to 2) with cell-lucky class.
    // The highlight is cosmetic only — the cell still behaves as a normal lucky tile.
    // We re-apply after a short delay so the grid DOM is ready.
    if (luckyTiles.size > 0 && (ptHasSkill('outlier_detection_1') || ptHasSkill('outlier_detection_2'))) {
        const highlightCount = (ptHasSkill('outlier_detection_1') ? 1 : 0) + (ptHasSkill('outlier_detection_2') ? 1 : 0);
        const toHighlight = [...luckyTiles].slice(0, highlightCount);
        // Delay so the grid has been built before we touch DOM elements
        setTimeout(() => {
            toHighlight.forEach(key => {
                if (!luckyTiles.has(key)) return; // already claimed
                const [r, c] = key.split('-').map(Number);
                const el = document.getElementById(`g-${r}-${c}`);
                if (el) el.classList.add('cell-lucky');
            });
        }, 200);
    }


}


//------------------------------------------------------------------------
//-----------PASSIVE TREE START-OF-LEVEL EFFECTS--------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Fires probabilistic_start (reveal a correct cell) and
// error_elimination (mark a wrong cell) chances at level start.
// Each allocated node is an independent 10% roll.
function _applyPassiveStartEffects() {
    if (ptHasSkill('keystone_ergodic_field')) return;
    let reveals = 0;
    if (ptHasSkill('probabilistic_start_1') && Math.random() < 0.10) reveals++;
    if (ptHasSkill('probabilistic_start_2') && Math.random() < 0.15) reveals++;
    if (ptHasSkill('probabilistic_start_3') && Math.random() < 0.20) reveals++;
    if (reveals > 0) revealTiles(reveals);

    let marks = 0;
    if (ptHasSkill('error_elimination_1') && Math.random() < 0.10) marks++;
    if (ptHasSkill('error_elimination_2') && Math.random() < 0.15) marks++;
    if (ptHasSkill('error_elimination_3') && Math.random() < 0.20) marks++;
    if (marks > 0) markWrongTiles(marks);

    _applyNullHypothesis();
    _applyCentralTendency();
    _applyDensityMapping();
    _applySparseRegion();
    _applyMarginalDistribution();
    _applyInterquartileVision();
    _applyDeadReckoningStart();
    _applyMaximumLikelihood();
}


//------------------------------------------------------------------------
// central_tendency (node id 234-236): reveal 1 filled cell near the true
// centre of the grid per allocated node.
//
// All unrevealed filled cells are sorted by their Euclidean distance from
// the exact centre point (cx, cy).  Each node reveals the next-closest
// cell from that list, so with 3 nodes you get the 3 nearest filled cells
// to the grid centre revealed at level start.
//------------------------------------------------------------------------
function _applyCentralTendency() {
    const nodes = (ptHasSkill('central_tendency_1') ? 1 : 0)
        + (ptHasSkill('central_tendency_2') ? 1 : 0)
        + (ptHasSkill('central_tendency_3') ? 1 : 0);
    if (nodes === 0) return;

    if (window._oracleActive) return;
    if (ptHasSkill('keystone_ergodic_field')) return;

    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const cx = (rows - 1) / 2;   // exact fractional centre row
    const cy = (cols - 1) / 2;   // exact fractional centre col

    // Normalised Euclidean distance from grid centre
    const dist = (r, c) => {
        const dr = (r - cx) / (rows / 2);
        const dc = (c - cy) / (cols / 2);
        return Math.sqrt(dr * dr + dc * dc);
    };

    // Build a single pool of all unrevealed filled cells, sorted nearest-first
    const pool = [];
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (sol[r][c] === 1 && userGrid[r][c] !== 1 && !revealedGrid[r][c])
                pool.push([r, c]);
    pool.sort((a, b) => dist(a[0], a[1]) - dist(b[0], b[1]));

    const affected = [];
    for (let n = 0; n < nodes; n++) {
        if (pool.length === 0) break;
        const [r, c] = pool.shift();
        revealedGrid[r][c] = true;
        userGrid[r][c] = 1;
        renderCell(r, c);
        updClues(r, c, true);
        affected.push(`g-${r}-${c}`);
    }

    if (affected.length > 0) {
        if (typeof _applyCellEffect === 'function') {
            _applyCellEffect(affected, 'reveal');
            if (ptHasSkill('adjacency_matrix')) _adjacencyMatrixRefreshAll();
        }
        checkWin();
    }
}


//------------------------------------------------------------------------
// density_mapping (237-239): mark 1 wrong empty cell in the densest
// row and densest column. Node 3 targets the top-2 rows AND top-2 cols.
//------------------------------------------------------------------------
function _applyDensityMapping() {
    const nodes = (ptHasSkill('density_mapping_1') ? 1 : 0)
        + (ptHasSkill('density_mapping_2') ? 1 : 0)
        + (ptHasSkill('density_mapping_3') ? 1 : 0);
    if (nodes === 0) return;

    if (window._oracleActive) return;
    if (ptHasSkill('keystone_ergodic_field')) return;

    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // How many rows/cols to target: 1 for nodes 1-2, 2 for node 3
    const lineCount = ptHasSkill('density_mapping_3') ? 2 : 1;

    // Sort rows by filled-cell count descending
    const rowsByDensity = Array.from({ length: rows }, (_, r) => r)
        .sort((a, b) => sol[b].filter(v => v === 1).length - sol[a].filter(v => v === 1).length);

    // Sort cols by filled-cell count descending
    const colsByDensity = Array.from({ length: cols }, (_, c) => c)
        .sort((a, b) =>
            sol.filter(row => row[b] === 1).length - sol.filter(row => row[a] === 1).length);

    // Mark 1 wrong empty cell in each target row
    for (let i = 0; i < lineCount; i++) {
        const r = rowsByDensity[i];
        const cands = [];
        for (let c = 0; c < cols; c++)
            if (sol[r][c] === 0 && (userGrid[r][c] === 0 || userGrid[r][c] === 3) && !wrongGrid[r][c])
                cands.push(c);
        if (cands.length > 0) {
            const c = cands[Math.floor(Math.random() * cands.length)];
            userGrid[r][c] = 2;
            renderCell(r, c);
        }
    }

    // Mark 1 wrong empty cell in each target col
    for (let i = 0; i < lineCount; i++) {
        const c = colsByDensity[i];
        const cands = [];
        for (let r = 0; r < rows; r++)
            if (sol[r][c] === 0 && (userGrid[r][c] === 0 || userGrid[r][c] === 3) && !wrongGrid[r][c])
                cands.push(r);
        if (cands.length > 0) {
            const r = cands[Math.floor(Math.random() * cands.length)];
            userGrid[r][c] = 2;
            renderCell(r, c);
        }
    }
}


//------------------------------------------------------------------------
// sparse_region (240-242): mark 1 wrong empty cells in the sparsest
// row or column per allocated node (each node is independent).
//------------------------------------------------------------------------
function _applySparseRegion() {
    const nodes = (ptHasSkill('sparse_region_1') ? 1 : 0)
        + (ptHasSkill('sparse_region_2') ? 1 : 0)
        + (ptHasSkill('sparse_region_3') ? 1 : 0);
    if (nodes === 0) return;

    if (window._oracleActive) return;
    if (ptHasSkill('keystone_ergodic_field')) return;

    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    for (let n = 0; n < nodes; n++) {
        // Find the sparsest row (fewest filled solution cells, not yet complete)
        let sparsestRow = -1, sparsestRowFilled = Infinity;
        for (let r = 0; r < rows; r++) {
            const filled = sol[r].filter(v => v === 1).length;
            if (filled < sparsestRowFilled) { sparsestRowFilled = filled; sparsestRow = r; }
        }

        // Find the sparsest col
        let sparsestCol = -1, sparsestColFilled = Infinity;
        for (let c = 0; c < cols; c++) {
            const filled = sol.filter(row => row[c] === 1).length;
            if (filled < sparsestColFilled) { sparsestColFilled = filled; sparsestCol = c; }
        }

        // Prefer the sparser of the two; pick randomly on a tie
        const useRow = sparsestRowFilled <= sparsestColFilled
            ? (Math.random() < 0.5 || sparsestCol === -1)
            : false;

        if (useRow && sparsestRow >= 0) {
            const cands = [];
            for (let c = 0; c < cols; c++)
                if (sol[sparsestRow][c] === 0 && (userGrid[sparsestRow][c] === 0 || userGrid[sparsestRow][c] === 3) && !wrongGrid[sparsestRow][c])
                    cands.push(c);
            shuffle(cands);
            cands.slice(0, 1).forEach(c => {
                userGrid[sparsestRow][c] = 2;
                renderCell(sparsestRow, c);
            });
        } else if (sparsestCol >= 0) {
            const cands = [];
            for (let r = 0; r < rows; r++)
                if (sol[r][sparsestCol] === 0 && (userGrid[r][sparsestCol] === 0 || userGrid[r][sparsestCol] === 3) && !wrongGrid[r][sparsestCol])
                    cands.push(r);
            shuffle(cands);
            cands.slice(0, 1).forEach(r => {
                userGrid[r][sparsestCol] = 2;
                renderCell(r, sparsestCol);
            });
        }
    }
}

//------------------------------------------------------------------------
// marginal_distribution (246-248): reveal 1 filled cell per node (up to 3)
// chosen randomly from any of the 4 outermost edges (top row, bottom row,
// left col, right col).
//------------------------------------------------------------------------
function _applyMarginalDistribution() {
    const nodes = (ptHasSkill('marginal_distribution_1') ? 1 : 0)
        + (ptHasSkill('marginal_distribution_2') ? 1 : 0)
        + (ptHasSkill('marginal_distribution_3') ? 1 : 0);
    if (nodes === 0) return;

    if (window._oracleActive) return;
    if (ptHasSkill('keystone_ergodic_field')) return;

    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // Build a deduplicated pool of all unrevealed filled cells on the 4 outer edges
    const seen = new Set();
    const pool = [];
    const addCell = (r, c) => {
        const key = `${r}-${c}`;
        if (seen.has(key)) return;
        seen.add(key);
        if (sol[r][c] === 1 && userGrid[r][c] !== 1 && !revealedGrid[r][c])
            pool.push([r, c]);
    };

    for (let c = 0; c < cols; c++) addCell(0, c);           // top row
    for (let c = 0; c < cols; c++) addCell(rows - 1, c);    // bottom row
    for (let r = 0; r < rows; r++) addCell(r, 0);           // left col
    for (let r = 0; r < rows; r++) addCell(r, cols - 1);    // right col

    shuffle(pool);

    const affected = [];
    for (let n = 0; n < nodes; n++) {
        if (pool.length === 0) break;
        const [r, c] = pool.shift();
        revealedGrid[r][c] = true;
        userGrid[r][c] = 1;
        renderCell(r, c);
        updClues(r, c, true);
        affected.push(`g-${r}-${c}`);
    }

    if (affected.length > 0) {
        if (typeof _applyCellEffect === 'function') {
            _applyCellEffect(affected, 'reveal');
            if (ptHasSkill('adjacency_matrix')) _adjacencyMatrixRefreshAll();
        }
        checkWin();
    }
}


//------------------------------------------------------------------------
// interquartile_vision (258-259): on large grids (≥200 cells), fire a
// field scan centred on the grid for 2s (+1s for node 2).
//------------------------------------------------------------------------
function _applyInterquartileVision() {
    if (!ptHasSkill('interquartile_vision_1')) return;
    if (window._oracleActive) return;

    if (!cur) return;
    const rows = cur.grid.length, cols = cur.grid[0].length;
    if (rows * cols < 200) return; // only fires on large grids

    let scanDur = _interquartileVisionDuration();

    // Use the larger grid dimension as scan size so the scan covers the whole centre region
    const scanSize = Math.max(rows, cols);
    // Delay slightly so the grid DOM is fully rendered before the scan runs
    setTimeout(() => {
        if (typeof _executeFieldScan === 'function') _executeFieldScan(scanSize, scanDur);
    }, 300);
}


//------------------------------------------------------------------------
// keystone_dead_reckoning (264): replace clue numbers with their row/col
// sum at level start, and track progress toward the 25%-unlock threshold.
//------------------------------------------------------------------------
function _applyDeadReckoningStart() {
    window._deadReckoningActive = false;
    window._deadReckoningUnlocked = false;
    if (!ptHasSkill('keystone_dead_reckoning')) return;

    window._deadReckoningActive = true;
    window._deadReckoningUnlocked = false;

    // Replace clue spans with their sum after the grid is built (slight delay)
    setTimeout(() => _deadReckoningApplyClues(), 50);
}

// Replaces individual run-length clue numbers with the total filled count for that line.
function _deadReckoningApplyClues() {
    if (!cur || !window._deadReckoningActive || window._deadReckoningUnlocked) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // Row clues: replace each span in a row with the row's total filled count
    for (let r = 0; r < rows; r++) {
        const total = sol[r].filter(v => v === 1).length;
        document.querySelectorAll(`[id^="rn-${r}-"]`).forEach((span, i) => {
            span.textContent = i === 0 ? total : ''; // show sum only on first span, blank the rest
        });
    }

    // Col clues: replace each span in a col with the col's total filled count
    for (let c = 0; c < cols; c++) {
        const total = sol.filter(row => row[c] === 1).length;
        document.querySelectorAll(`[id^="cn-${c}-"]`).forEach((span, i) => {
            span.textContent = i === 0 ? total : '';
        });
    }
}

// Checks if 25% of the grid has been correctly filled; if so, reveals exact clues.
// Called from updClues so it runs after every cell change.
function _deadReckoningCheckUnlock() {
    if (!window._deadReckoningActive || window._deadReckoningUnlocked) return;
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const totalFilled = sol.reduce((sum, row) => sum + row.filter(v => v === 1).length, 0);
    let playerFilled = 0;
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (sol[r][c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])) playerFilled++;

    if (playerFilled < Math.ceil(totalFilled * 0.25)) return;

    // Unlock: restore exact clue numbers
    window._deadReckoningUnlocked = true;
    for (let r = 0; r < rows; r++) {
        const rc = clues(sol[r]);
        rc.forEach((val, i) => {
            const span = document.getElementById(`rn-${r}-${i}`);
            if (span) span.textContent = val;
        });
    }
    for (let c = 0; c < cols; c++) {
        const cc = clues(sol.map(row => row[c]));
        cc.forEach((val, i) => {
            const span = document.getElementById(`cn-${c}-${i}`);
            if (span) span.textContent = val;
        });
    }
    showToast(`🧭 ${LANG === 'de' ? 'Koppelnavigation: Genaue Hinweise enthüllt!' : 'Dead Reckoning: Exact clues revealed!'}`);
}
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Calculates and sets timerSecs.
// Time Trial mode halves the base time; otherwise uses the difficulty/level default.
function _initTimer() {
    const cfg = DIFF_CFG[curDiff];
    const baseTimer = cur.timer || cfg.timerStart;
    timerSecs = curMods.timetrial ? Math.round(baseTimer * 0.5) : baseTimer;

    // extended_session nodes (174-176): bonus seconds added at level start
    // Node 1: +60s, Node 2: +120s, Node 3: +120s (cumulative)
    // Keystone: Gambler's Ruin disables all bonus time from other sources
    if (!ptHasSkill('keystone_gamblers_ruin')) {
        if (ptHasSkill('extended_session_1')) timerSecs += 60;
        if (ptHasSkill('extended_session_2')) timerSecs += 120;
        if (ptHasSkill('extended_session_3')) timerSecs += 180;
    }

    // expected_value nodes
    if (!ptHasSkill('keystone_gamblers_ruin') && (ptHasSkill('expected_value_1') || ptHasSkill('expected_value_2') || ptHasSkill('expected_value_3'))) {
        const rows = cur.grid.length, cols = cur.grid[0].length;
        const totalCells = rows * cols;
        let secsPerTen = 0;
        if (ptHasSkill('expected_value_1')) secsPerTen += 5;
        if (ptHasSkill('expected_value_2')) secsPerTen += 2;
        if (ptHasSkill('expected_value_3')) secsPerTen += 3;
        timerSecs += Math.floor(totalCells / 10) * secsPerTen;
    }

    // keystone_dead_reckoning (264): +10 minutes at level start
    if (ptHasSkill('keystone_dead_reckoning') && !ptHasSkill('keystone_gamblers_ruin')) timerSecs += 600;
}



//------------------------------------------------------------------------
//-------------------CLOSE LEFTOVER OVERLAYS------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Hides any win/lose overlays and closes the quiz left over from a previous level.
function _closeLeftoverOverlays() {
    hideOv();    // hides win and lose overlays if they are still up from a previous level
    closeQuiz();
}


//------------------------------------------------------------------------
//--------------------UPDATE HUD ELEMENTS---------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Updates the bonus sidebar hint text.
// Appends an "items recommended" note on large (≥200 cell) unseen levels.
function _updateBonusSidebar() {
    const el = document.getElementById('bonus-sidebar-hint');
    el.textContent = (lvText(cur, 'bonusHint') || '');
}


// Renders the modifier and difficulty tags below the timer.
function _updateModTags() {
    const mt = document.getElementById('mod-tags');
    mt.innerHTML = '';
    if (curMods.timetrial) mt.innerHTML += `<span class="mod-tag tt">${t('mod_tt')}</span>`;
    if (curMods.hardcore) mt.innerHTML += `<span class="mod-tag hc">${t('mod_hc')}</span>`;
    if (curMods.ironman) mt.innerHTML += `<span class="mod-tag im">${t('mod_im')}</span>`;
    if (curMods.classless) mt.innerHTML += `<span class="mod-tag cl">${t('mod_cl')}</span>`;
    if (curMods.treeless) mt.innerHTML += `<span class="mod-tag tl">${t('mod_tl')}</span>`;
    mt.innerHTML += `<span class="mod-tag diff">${t('diff_' + curDiff)}</span>`;
}




// Updates all HUD elements: level id, hint, score, penalty, bonus sidebar, mod tags.
function _updateHUD() {
    const rows = cur.grid.length;
    const cols = cur.grid[0].length;

    document.getElementById('top-id').textContent = `${t('lvl_prefix')} ${cur.world}-${cur.li}`;
    document.getElementById('top-hint').textContent = lvText(cur, 'hint');
    document.getElementById('sc-disp').textContent = STATE.totalScore;
    document.getElementById('pen-info').textContent = '';

    const mc = document.getElementById('mistake-counter');
    if (mc) mc.textContent = `${LANG === 'de' ? 'Fehler' : 'Mistakes'}: 0`;

    _updateBonusSidebar()
    _updateModTags();
}



//------------------------------------------------------------------------
//--------START TIMER AND RENDER GRID AND INVENTORY-----------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _startSystems() {
    updTimer();           // timer.js — show initial time before first tick
    startTimer();         // timer.js — begin the countdown
    buildGrid();          // grid.js  — render the puzzle table
    buildInventoryPanel(); // inventory.js — render current items

    // Clear bounceback flag unless this is the same level we just failed
    if (window._lastFailedGi !== undefined && cur && cur.gIdx !== window._lastFailedGi) {
        window._lastFailedGi = null;
    }
}


//------------------------------------------------------------------------
//-----------------CHECK FOR SCOUTS PRIMER--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// If a Scout's Primer was activated in a previous level, shows the question modal now
function _checkPrimerPending() {
    if (!STATE.primerPending) return;
    STATE.primerPending = false;
    save();
    showPrimerModal();
}




//------------------------------------------------------------------------
//------------------------CLASSES-----------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Resets cooldown, applies passive effects, and rebuilds the class HUD panel
function _initClassSystems() {
    resetActiveCooldown();
    applyClassPassiveOnLevelStart();
    buildClassHUD();
}


//------------------------------------------------------------------------
//--------------------SWITCH SCREEN TO GAMEPLAY---------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Pushes level select to the navigation history and switches to the game screen
function _navigateToGameScreen() {
    screenHistory.push('screen-levels');
    ss('screen-game');
}


//------------------------------------------------------------------------
//-----------COMPLETION GLIMPSE-------------------------------------------
//------------------------------------------------------------------------

// completion_glimpse (216-218): shows the level's reveal text as a toast
// for 30s (+30s per extra node) at the start of the level.
function _applyCompletionGlimpse() {
    if (!ptHasSkill('completion_glimpse_1')) return;
    let duration = 30000;
    if (ptHasSkill('completion_glimpse_2')) duration += 30000;
    if (ptHasSkill('completion_glimpse_3')) duration += 30000;
    const text = lvText(cur, 'reveal');
    if (!text) return;

    const bar = document.getElementById('completion-glimpse-bar');
    const textEl = document.getElementById('completion-glimpse-text');
    if (!bar || !textEl) return;

    textEl.textContent = text;
    bar.classList.remove('hidden');

    // Clear any previous timer
    if (window._completionGlimpseTimer) clearTimeout(window._completionGlimpseTimer);
    window._completionGlimpseTimer = setTimeout(() => {
        bar.classList.add('hidden');
    }, duration);
}


//------------------------------------------------------------------------
//-----------KEYSTONE: NULL HYPOTHESIS------------------------------------
//------------------------------------------------------------------------

// keystone_null_hypothesis (220): at level start, find the row and column
// with the fewest correct filled cells and mark all wrong empty cells in them.
function _applyNullHypothesis() {
    if (!ptHasSkill('keystone_null_hypothesis')) return;
    if (window._oracleActive) return;
    if (ptHasSkill('keystone_ergodic_field')) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // Find row with fewest filled solution cells (least dense)
    let minRowFilled = Infinity, targetRow = 0;
    for (let r = 0; r < rows; r++) {
        const filled = sol[r].filter(v => v === 1).length;
        if (filled < minRowFilled) { minRowFilled = filled; targetRow = r; }
    }

    // Find col with fewest filled solution cells
    let minColFilled = Infinity, targetCol = 0;
    for (let c = 0; c < cols; c++) {
        const filled = sol.filter(row => row[c] === 1).length;
        if (filled < minColFilled) { minColFilled = filled; targetCol = c; }
    }

    // Mark all wrong empty cells in that row
    for (let c = 0; c < cols; c++) {
        if (sol[targetRow][c] === 0 && userGrid[targetRow][c] === 0 && !wrongGrid[targetRow][c]) {
            userGrid[targetRow][c] = 2;
            renderCell(targetRow, c);
        }
    }
    // Mark all wrong empty cells in that col
    for (let r = 0; r < rows; r++) {
        if (sol[r][targetCol] === 0 && userGrid[r][targetCol] === 0 && !wrongGrid[r][targetCol]) {
            userGrid[r][targetCol] = 2;
            renderCell(r, targetCol);
        }
    }
}



//------------------------------------------------------------------------
//-----------------------DO START LEVEL-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function _doStartLevel(gi) {
    _initLevelData(gi);
    _initGrids();
    _resetLevelState();
    _initLuckyTiles();
    _initTimer();
    _closeLeftoverOverlays();
    _updateHUD();
    _startSystems();
    _entropyDrainInit();
    if (ptHasSkill('keystone_the_oracle') && cur.grid.length * cur.grid[0].length >= 200) window._oracleActive = true;
    _applyPassiveStartEffects();

    // adjacency_matrix (302): populate neighbour-count overlays after grid and passives are ready
    if (ptHasSkill('adjacency_matrix')) setTimeout(_adjacencyMatrixRefreshAll, 100);

    _applyCompletionGlimpse();
    _checkPrimerPending();
    _initClassSystems();
    _navigateToGameScreen();
    PassiveTracker.init();
    _applySparsePrior();
    _applyFrequentistsBurden();
    _applySignalToNoise();
    _applyDegreesOfFreedom();
    _applyTheOracle();


    Audio_Manager.playBGM(Audio_Manager.trackForLevel(cur.world, cur.li));


}


//------------------------------------------------------------------------
//----------------------START LEVEL-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



function startLevel(gi) {
    if (isGatedLevel(gi) && !isMathGatePassed(gi)) {
        tryStartGatedLevel(gi, () => _doStartLevel(gi));
        return;
    }
    _doStartLevel(gi);
}