//========================================================================
// passive-tree-new-nodes.js
// Implementations for passive tree nodes 270 (poisson fix), 282–301
//========================================================================


//------------------------------------------------------------------------
// SHARED HELPER: Bayesian Update boost
// Returns the current bayesian multiplier bonus (accumulated mistake bonus).
// Resets after each auto-trigger that uses it.
//------------------------------------------------------------------------
window._bayesianBonus = window._bayesianBonus || 0; // extra % chance from mistakes

function _getBayesianBonus() {
    return window._bayesianBonus || 0;
}

function _resetBayesianBonus() {
    window._bayesianBonus = 0;
}

// Called from penalty.js after mistakeCount++ (see instructions below)
function _onMistakeBayesianUpdate() {
    if (!ptHasSkill('bayesian_update_1') && !ptHasSkill('bayesian_update_2') && !ptHasSkill('bayesian_update_3')) return;
    let increment = 0;
    if (ptHasSkill('bayesian_update_1')) increment += 0.05;
    if (ptHasSkill('bayesian_update_2')) increment += 0.05;
    if (ptHasSkill('bayesian_update_3')) increment += 0.08; // node 3 replaces node 3's own 5% with 8%
    // If all three: 5% + 5% + 8% per mistake
    window._bayesianBonus = (window._bayesianBonus || 0) + increment;
}


//------------------------------------------------------------------------
// SHARED HELPER: apply bayesian boost to a random chance, then reset
// Pass baseChance (0–1), returns true if should trigger.
//------------------------------------------------------------------------
function _bayesianRoll(baseChance) {
    const total = baseChance + _getBayesianBonus();
    const triggered = Math.random() < total;
    if (triggered) _resetBayesianBonus();
    return triggered;
}


//------------------------------------------------------------------------
// 270/271/272 — POISSON PROCESS (fix: add actual firing logic)
// Called from the timer interval in timer.js each second.
// The scheduling (window._poissonNext) already exists in timer.js.
// Add a call to _poissonProcessTick() inside the setInterval body in timer.js.
//------------------------------------------------------------------------
function _poissonProcessTick() {
    if (!window._poissonNext) return;
    if (Date.now() < window._poissonNext) return;
    if (!cur) return;

    const interval = ptHasSkill('poisson_process_3') ? 45 : 60;
    window._poissonNext = Date.now() + interval * 1000;

    // How many cells to mark: 1 per node
    let count = (ptHasSkill('poisson_process_1') ? 1 : 0)
        + (ptHasSkill('poisson_process_2') ? 1 : 0)
        + (ptHasSkill('poisson_process_3') ? 1 : 0);

    if (count <= 0) return;

    // Ergodic Field disables auto-marks
    if (ptHasSkill('keystone_ergodic_field')) return;

    // Bayesian Update boost
    if (_bayesianRoll(0)) count = Math.max(count, 1); // bayesian doesn't boost count, just resets

    markWrongTiles(count);
    showToast(`⚗️ ${LANG === 'de' ? `Poisson-Prozess! ${count} Zelle(n) markiert.` : `Poisson Process! ${count} cell(s) marked.`}`);
}


//------------------------------------------------------------------------
// 282/283/284 — BINOMIAL BURST
// Call _binomialBurstOnCorrectFill() from mouse-button-handlers.js
// inside the block where pval===1 and cur.grid[row][col]===1 (correct fill).
//------------------------------------------------------------------------
window._binomialBurstFills = 0;

function _binomialBurstOnCorrectFill() {
    if (!ptHasSkill('binomial_burst_1') && !ptHasSkill('binomial_burst_2') && !ptHasSkill('binomial_burst_3')) return;
    // Ergodic Field disables auto-marks
    if (ptHasSkill('keystone_ergodic_field')) return;

    window._binomialBurstFills = (window._binomialBurstFills || 0) + 1;
    if (window._binomialBurstFills < 10) return;
    window._binomialBurstFills = 0;

    // Chance: 20% base; node 3 replaces with 35%
    let chance = 0;
    if (ptHasSkill('binomial_burst_1')) chance = 0.20;
    if (ptHasSkill('binomial_burst_2')) chance = 0.20;
    if (ptHasSkill('binomial_burst_3')) chance = 0.35;

    if (_bayesianRoll(chance)) {
        markWrongTiles(1);
        showToast(`💢 ${LANG === 'de' ? 'Binomialer Ausbruch! 1 Zelle markiert.' : 'Binomial Burst! 1 cell marked.'}`);
    }
}


//------------------------------------------------------------------------
// 288 — KEYSTONE: MAXIMUM LIKELIHOOD
// Call _applyMaximumLikelihood() from start-level.js in _applyPassiveStartEffects().
//------------------------------------------------------------------------
function _applyMaximumLikelihood() {
    if (!ptHasSkill('keystone_maximum_likelihood')) return;
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // -15 minutes at start (applied to timerSecs after _initTimer)
    timerSecs = Math.max(0, timerSecs - 900);

    // Find densest row
    let bestRow = 0, bestRowCount = -1;
    for (let r = 0; r < rows; r++) {
        const count = sol[r].filter(v => v === 1).length;
        if (count > bestRowCount) { bestRowCount = count; bestRow = r; }
    }

    // Find densest col
    let bestCol = 0, bestColCount = -1;
    for (let c = 0; c < cols; c++) {
        const count = sol.filter(row => row[c] === 1).length;
        if (count > bestColCount) { bestColCount = count; bestCol = c; }
    }

    const affected = [];
    for (let c = 0; c < cols; c++) {
        if (sol[bestRow][c] === 1 && userGrid[bestRow][c] !== 1 && !revealedGrid[bestRow][c]) {
            revealedGrid[bestRow][c] = true;
            userGrid[bestRow][c] = 1;
            renderCell(bestRow, c);
            updClues(bestRow, c);
            affected.push(`g-${bestRow}-${c}`);
        }
    }
    for (let r = 0; r < rows; r++) {
        if (sol[r][bestCol] === 1 && userGrid[r][bestCol] !== 1 && !revealedGrid[r][bestCol]) {
            revealedGrid[r][bestCol] = true;
            userGrid[r][bestCol] = 1;
            renderCell(r, bestCol);
            updClues(r, bestCol);
            affected.push(`g-${r}-${bestCol}`);
        }
    }
    if (typeof _applyCellEffect === 'function') _applyCellEffect(affected, 'reveal');
    checkWin();
    updTimer();
}


//------------------------------------------------------------------------
// 289 — KEYSTONE: GAMBLER'S RUIN
// +3s per correct fill: call _gamblersRuinOnCorrectFill() from mouse-button-handlers.js
// -60s per mistake: call _gamblersRuinOnMistake() from penalty.js
// Bonus time from other sources blocked: checked inline in each time-granting function
// via ptHasSkill('keystone_gamblers_ruin').
//------------------------------------------------------------------------
function _gamblersRuinOnCorrectFill() {
    if (!ptHasSkill('keystone_gamblers_ruin')) return;
    timerSecs += 3;
    updTimer();
}

function _gamblersRuinOnMistake() {
    if (!ptHasSkill('keystone_gamblers_ruin')) return;
    timerSecs = Math.max(0, timerSecs - 60);
    updTimer();
}


//------------------------------------------------------------------------
// 290 — KEYSTONE: SPARSE PRIOR
// All clues hidden at start. Completing a row/col reveals adjacent clues.
// Call _applySparsePrior() from start-level.js after buildGrid().
// Call _sparsePriorOnLineComplete(row, col, isRow) from grid.js in updClues()
// when rowDone or colDone.
//------------------------------------------------------------------------
function _applySparsePrior() {
    if (!ptHasSkill('keystone_sparse_prior')) return;
    // Hide all clues with blackout (permanent until a line is completed)
    setTimeout(() => {
        document.querySelectorAll('.rct, .cch').forEach(el => el.classList.add('clue-blackout'));
    }, 100);
}

function _sparsePriorOnLineComplete(lineIndex, isRow) {
    if (!ptHasSkill('keystone_sparse_prior')) return;
    if (!cur) return;
    const rows = cur.grid.length, cols = cur.grid[0].length;

    if (isRow) {
        // Reveal clues for row lineIndex and adjacent rows
        const toReveal = [lineIndex - 1, lineIndex, lineIndex + 1].filter(r => r >= 0 && r < rows);
        toReveal.forEach(r => {
            document.querySelectorAll(`.rct-${r}`).forEach(el => el.classList.remove('clue-blackout'));
        });
    } else {
        // Reveal clues for col lineIndex and adjacent cols
        const toReveal = [lineIndex - 1, lineIndex, lineIndex + 1].filter(c => c >= 0 && c < cols);
        toReveal.forEach(c => {
            document.querySelectorAll(`.cch-${c}`).forEach(el => el.classList.remove('clue-blackout'));
        });
    }
}


//------------------------------------------------------------------------
// 291 — KEYSTONE: ERGODIC FIELD
// Every 3 minutes flash the complete solution for 1 second.
// All auto-reveals/marks disabled (checked inline via ptHasSkill).
// Call _ergodicFieldTick() from the timer interval in timer.js.
//------------------------------------------------------------------------
window._ergodicFieldNext = null;

function _ergodicFieldInit() {
    if (!ptHasSkill('keystone_ergodic_field')) return;
    window._ergodicFieldNext = Date.now() + 3 * 60 * 1000;
}

function _ergodicFieldTick() {
    if (!ptHasSkill('keystone_ergodic_field')) return;
    if (!window._ergodicFieldNext || Date.now() < window._ergodicFieldNext) return;
    window._ergodicFieldNext = Date.now() + 3 * 60 * 1000;
    if (!cur) return;

    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const flashed = [];

    // Temporarily show solution
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (userGrid[r][c] === 1 || revealedGrid[r][c]) continue;
            const el = document.getElementById(`g-${r}-${c}`);
            if (!el) continue;
            el.classList.remove('filled', 'marked', 'wrong-mark', 'revealed', 'questioned');
            el.classList.add(sol[r][c] === 1 ? 'filled' : 'marked', 'scan-reveal');
            flashed.push(el);
        }
    }

    showToast(`🌊 ${LANG === 'de' ? 'Ergodisches Feld! Lösung kurz sichtbar.' : 'Ergodic Field! Solution briefly visible.'}`);

    setTimeout(() => {
        for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
                renderCell(r, c);
        flashed.forEach(el => el.classList.remove('scan-reveal'));
    }, 1000);
}


//------------------------------------------------------------------------
// 293 — KEYSTONE: ENTROPY DRAIN
// Per-row/col: if a line has been partially filled but not completed for >3 min,
// revert all reveals and marks in it. Also: class cooldowns -30s (handled in class code).
// Call _entropyDrainInit() from start-level.js, _entropyDrainTick() from timer interval.
//------------------------------------------------------------------------
window._entropyDrainTimestamps = {}; // key: "r-{row}" or "c-{col}" => timestamp of last progress

function _entropyDrainInit() {
    window._entropyDrainTimestamps = {};
    if (!ptHasSkill('keystone_entropy_drain')) return;
    // Initialise all lines as "now" so the 3-min clock starts fresh
    if (!cur) return;
    const rows = cur.grid.length, cols = cur.grid[0].length;
    const now = Date.now();
    for (let r = 0; r < rows; r++) window._entropyDrainTimestamps[`r-${r}`] = now;
    for (let c = 0; c < cols; c++) window._entropyDrainTimestamps[`c-${c}`] = now;
}

// Call this from updClues when a cell changes (row, col, true = progress made)
function _entropyDrainUpdateProgress(row, col) {
    if (!ptHasSkill('keystone_entropy_drain')) return;
    const now = Date.now();
    window._entropyDrainTimestamps[`r-${row}`] = now;
    window._entropyDrainTimestamps[`c-${col}`] = now;
}

function _entropyDrainTick() {
    if (!ptHasSkill('keystone_entropy_drain')) return;
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const limit = 3 * 60 * 1000; // 3 minutes
    const now = Date.now();

    for (let r = 0; r < rows; r++) {
        const key = `r-${r}`;
        const ts = window._entropyDrainTimestamps[key];
        if (!ts) continue;
        // Check if row is partially but not fully done
        const hasAny = sol[r].some((v, c) => v === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c]));
        const isDone = sol[r].every((v, c) => v === 0 || userGrid[r][c] === 1 || revealedGrid[r][c]);
        if (!hasAny || isDone) { window._entropyDrainTimestamps[key] = now; continue; }
        if (now - ts >= limit) {
            window._entropyDrainTimestamps[key] = now;
            // Revert all reveals and marks in this row
            for (let c = 0; c < cols; c++) {
                if (revealedGrid[r][c]) { revealedGrid[r][c] = false; userGrid[r][c] = 0; }
                else if (userGrid[r][c] === 2) userGrid[r][c] = 0;
                renderCell(r, c);
            }
            showToast(`🌡️ ${LANG === 'de' ? `Entropie-Abbau: Zeile ${r + 1} zurückgesetzt!` : `Entropy Drain: Row ${r + 1} reverted!`}`);
        }
    }

    for (let c = 0; c < cols; c++) {
        const key = `c-${c}`;
        const ts = window._entropyDrainTimestamps[key];
        if (!ts) continue;
        const hasAny = sol.some((row, r) => row[c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c]));
        const isDone = sol.every((row, r) => row[c] === 0 || userGrid[r][c] === 1 || revealedGrid[r][c]);
        if (!hasAny || isDone) { window._entropyDrainTimestamps[key] = now; continue; }
        if (now - ts >= limit) {
            window._entropyDrainTimestamps[key] = now;
            for (let r = 0; r < rows; r++) {
                if (revealedGrid[r][c]) { revealedGrid[r][c] = false; userGrid[r][c] = 0; }
                else if (userGrid[r][c] === 2) userGrid[r][c] = 0;
                renderCell(r, c);
            }
            showToast(`🌡️ ${LANG === 'de' ? `Entropie-Abbau: Spalte ${c + 1} zurückgesetzt!` : `Entropy Drain: Column ${c + 1} reverted!`}`);
        }
    }
}


//------------------------------------------------------------------------
// 294 — KEYSTONE: RANDOM WALK
// Every 30s: 1 random unfilled cell is auto-filled correctly or marked wrong.
// Max 2 mistakes before level fail.
// Call _randomWalkInit() from start-level.js, _randomWalkTick() from timer interval.
//------------------------------------------------------------------------
window._randomWalkNext = null;

function _randomWalkInit() {
    window._randomWalkNext = null;
    if (!ptHasSkill('keystone_random_walk')) return;
    window._randomWalkNext = Date.now() + 30 * 1000;
}

function _randomWalkTick() {
    if (!ptHasSkill('keystone_random_walk')) return;
    if (!window._randomWalkNext || Date.now() < window._randomWalkNext) return;
    window._randomWalkNext = Date.now() + 30 * 1000;
    if (!cur || dead) return;

    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const unfilled = [];
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (userGrid[r][c] === 0 && !revealedGrid[r][c] && !wrongGrid[r][c])
                unfilled.push([r, c]);

    if (unfilled.length === 0) return;
    const [r, c] = unfilled[Math.floor(Math.random() * unfilled.length)];

    if (sol[r][c] === 1) {
        revealedGrid[r][c] = true;
        userGrid[r][c] = 1;
        renderCell(r, c);
        updClues(r, c);
        showToast(`🚶 ${LANG === 'de' ? 'Zufällige Wanderung: Zelle enthüllt!' : 'Random Walk: Cell revealed!'}`);
        checkWin();
    } else {
        // Counts as a mistake — check 2-mistake limit
        wrongGrid[r][c] = true;
        renderCell(r, c);
        mistakeCount++;
        const mc = document.getElementById('mistake-counter');
        if (mc) mc.textContent = `${LANG === 'de' ? 'Fehler' : 'Mistakes'}: ${mistakeCount}`;
        showToast(`🚶 ${LANG === 'de' ? 'Zufällige Wanderung: Falsches Feld!' : 'Random Walk: Wrong cell!'}`);
        if (mistakeCount >= 2) {
            dead = true;
            stopTimer();
            window._lastFailedGi = cur.gIdx;
            document.getElementById('lose-title').textContent = t('ov_lose');
            document.getElementById('lose-sub').textContent =
                `${LANG === 'de' ? 'Zufällige Wanderung: 2 Fehler — Level verloren!' : 'Random Walk: 2 mistakes — level lost!'}`;
            document.getElementById('ov-lose').classList.add('show');
        }
    }
}


//------------------------------------------------------------------------
// 295 — KEYSTONE: FREQUENTIST'S BURDEN
// All clues hidden at start. Every 5 correct fills reveal 1 random clue number.
// Call _applyFrequentistsBurden() from start-level.js after buildGrid().
// Call _frequentistsBurdenOnCorrectFill() from mouse-button-handlers.js.
//------------------------------------------------------------------------
window._frequentistsFills = 0;
window._frequentistsBurdenActive = false;

function _applyFrequentistsBurden() {
    if (!ptHasSkill('keystone_frequentists_burden')) return;
    window._frequentistsFills = 0;
    window._frequentistsBurdenActive = true;
    // Hide all clues
    setTimeout(() => {
        document.querySelectorAll('.rct, .cch').forEach(el => el.classList.add('clue-blackout'));
    }, 100);
}

function _frequentistsBurdenOnCorrectFill() {
    if (!ptHasSkill('keystone_frequentists_burden')) return;
    if (!window._frequentistsBurdenActive) return;
    window._frequentistsFills = (window._frequentistsFills || 0) + 1;
    if (window._frequentistsFills % 5 !== 0) return;

    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // Collect all still-hidden clue cells (rows and cols)
    const hiddenRows = [];
    for (let r = 0; r < rows; r++) {
        const el = document.querySelector(`.rct-${r}.clue-blackout`);
        if (el) hiddenRows.push(r);
    }
    const hiddenCols = [];
    for (let c = 0; c < cols; c++) {
        const el = document.querySelector(`.cch-${c}.clue-blackout`);
        if (el) hiddenCols.push(c);
    }

    const allHidden = [
        ...hiddenRows.map(r => ({ type: 'row', idx: r })),
        ...hiddenCols.map(c => ({ type: 'col', idx: c }))
    ];
    if (allHidden.length === 0) return;

    const pick = allHidden[Math.floor(Math.random() * allHidden.length)];
    if (pick.type === 'row') {
        document.querySelectorAll(`.rct-${pick.idx}`).forEach(el => el.classList.remove('clue-blackout'));
        showToast(`📜 ${LANG === 'de' ? `Frequentist: Zeile ${pick.idx + 1} enthüllt!` : `Frequentist: Row ${pick.idx + 1} revealed!`}`);
    } else {
        document.querySelectorAll(`.cch-${pick.idx}`).forEach(el => el.classList.remove('clue-blackout'));
        showToast(`📜 ${LANG === 'de' ? `Frequentist: Spalte ${pick.idx + 1} enthüllt!` : `Frequentist: Column ${pick.idx + 1} revealed!`}`);
    }
}


//------------------------------------------------------------------------
// 296 — KEYSTONE: SIGNAL TO NOISE
// 10% of clues randomized at start. At 75% completion restore all.
// Call _applySignalToNoise() from start-level.js after buildGrid().
// Call _signalToNoiseCheckRestore() from checkWin / updClues.
//------------------------------------------------------------------------
window._signalToNoiseActive = false;
window._signalToNoiseFakeClues = []; // {type:'row'|'col', idx, spanId, originalVal, fakeVal}

function _applySignalToNoise() {
    if (!ptHasSkill('keystone_signal_to_noise')) return;
    if (!cur) return;
    window._signalToNoiseActive = true;
    window._signalToNoiseFakeClues = [];

    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // Collect all clue spans
    const allSpans = [];
    for (let r = 0; r < rows; r++) {
        document.querySelectorAll(`[id^="rn-${r}-"]`).forEach(span => {
            allSpans.push({ span, type: 'row', idx: r });
        });
    }
    for (let c = 0; c < cols; c++) {
        document.querySelectorAll(`[id^="cn-${c}-"]`).forEach(span => {
            allSpans.push({ span, type: 'col', idx: c });
        });
    }

    // Shuffle and pick 10%
    const count = Math.max(1, Math.floor(allSpans.length * 0.10));
    const shuffled = allSpans.sort(() => Math.random() - 0.5);
    shuffled.slice(0, count).forEach(({ span, type, idx }) => {
        const original = parseInt(span.textContent) || 0;
        let fake;
        do { fake = original + (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 3)); }
        while (fake === original || fake < 0);
        window._signalToNoiseFakeClues.push({ spanId: span.id, originalVal: original, fakeVal: fake });
        span.textContent = fake;
        span.style.color = 'var(--danger, #f55)';
    });

    showToast(`📡 ${LANG === 'de' ? '10% der Hinweise sind verfälscht!' : '10% of clues are falsified!'}`);
}

function _signalToNoiseCheckRestore() {
    if (!ptHasSkill('keystone_signal_to_noise')) return;
    if (!window._signalToNoiseActive) return;
    if (!cur) return;

    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const total = sol.reduce((s, row) => s + row.filter(v => v === 1).length, 0);
    let filled = 0;
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (sol[r][c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])) filled++;

    if (filled < Math.ceil(total * 0.75)) return;

    // Restore all fake clues
    window._signalToNoiseActive = false;
    window._signalToNoiseFakeClues.forEach(({ spanId, originalVal }) => {
        const span = document.getElementById(spanId);
        if (span) { span.textContent = originalVal; span.style.color = ''; }
    });
    window._signalToNoiseFakeClues = [];
    showToast(`📡 ${LANG === 'de' ? 'Alle Hinweise wiederhergestellt!' : 'All clues restored!'}`);
}


//------------------------------------------------------------------------
// 298 — KEYSTONE: DEGREES OF FREEDOM
// At level start, player chooses row or col clues to hide.
// Hidden clues replaced with cell count every 3 min.
// Call _applyDegreesOfFreedom() from start-level.js after buildGrid().
//------------------------------------------------------------------------
window._degreesOfFreedomChoice = null; // 'row' | 'col'
window._degreesOfFreedomNext = null;

function _applyDegreesOfFreedom() {
    if (!ptHasSkill('keystone_degrees_of_freedom')) return;
    window._degreesOfFreedomNext = null;
    window._degreesOfFreedomChoice = null;

    // Show a modal letting player choose
    const modal = document.createElement('div');
    modal.className = 'modal-bg show';
    modal.id = 'dof-modal';
    modal.innerHTML = `
        <div class="modal-box" style="text-align:center;max-width:340px">
            <h3>🎛️ ${LANG === 'de' ? 'Freiheitsgrade' : 'Degrees of Freedom'}</h3>
            <p style="margin:10px 0">${LANG === 'de'
            ? 'Welche Hinweise sollen verborgen werden?'
            : 'Which clues should be hidden?'}</p>
            <button onclick="_dofChoose('row')" style="margin:6px;padding:8px 18px">
                ${LANG === 'de' ? '🔲 Zeilenhinweise' : '🔲 Row Clues'}
            </button>
            <button onclick="_dofChoose('col')" style="margin:6px;padding:8px 18px">
                ${LANG === 'de' ? '🔲 Spaltenhinweise' : '🔲 Column Clues'}
            </button>
        </div>`;
    document.body.appendChild(modal);
}

function _dofChoose(type) {
    const modal = document.getElementById('dof-modal');
    if (modal) modal.remove();
    window._degreesOfFreedomChoice = type;
    window._degreesOfFreedomNext = Date.now() + 3 * 60 * 1000;

    if (!cur) return;
    const rows = cur.grid.length, cols = cur.grid[0].length;
    if (type === 'row') {
        for (let r = 0; r < rows; r++)
            document.querySelectorAll(`.rct-${r}`).forEach(el => el.classList.add('clue-blackout'));
    } else {
        for (let c = 0; c < cols; c++)
            document.querySelectorAll(`.cch-${c}`).forEach(el => el.classList.add('clue-blackout'));
    }
    showToast(`🎛️ ${LANG === 'de' ? `${type === 'row' ? 'Zeilen' : 'Spalten'}hinweise verborgen!` : `${type === 'row' ? 'Row' : 'Column'} clues hidden!`}`);
}

function _degreesOfFreedomTick() {
    if (!ptHasSkill('keystone_degrees_of_freedom')) return;
    if (!window._degreesOfFreedomChoice || !window._degreesOfFreedomNext) return;
    if (Date.now() < window._degreesOfFreedomNext) return;
    window._degreesOfFreedomNext = Date.now() + 3 * 60 * 1000;
    if (!cur) return;

    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const type = window._degreesOfFreedomChoice;

    if (type === 'row') {
        for (let r = 0; r < rows; r++) {
            const count = sol[r].filter(v => v === 1).length;
            // Show count briefly by un-blacking-out the first clue span
            const span = document.querySelector(`[id^="rn-${r}-"]`);
            if (span) {
                const orig = span.textContent;
                document.querySelectorAll(`.rct-${r}`).forEach(el => el.classList.remove('clue-blackout'));
                span.textContent = count;
                setTimeout(() => {
                    document.querySelectorAll(`.rct-${r}`).forEach(el => el.classList.add('clue-blackout'));
                    span.textContent = orig;
                }, 3000);
            }
        }
    } else {
        for (let c = 0; c < cols; c++) {
            const count = sol.filter(row => row[c] === 1).length;
            const span = document.querySelector(`[id^="cn-${c}-"]`);
            if (span) {
                const orig = span.textContent;
                document.querySelectorAll(`.cch-${c}`).forEach(el => el.classList.remove('clue-blackout'));
                span.textContent = count;
                setTimeout(() => {
                    document.querySelectorAll(`.cch-${c}`).forEach(el => el.classList.add('clue-blackout'));
                    span.textContent = orig;
                }, 3000);
            }
        }
    }
    showToast(`🎛️ ${LANG === 'de' ? 'Hinweise kurz sichtbar!' : 'Clues briefly visible!'}`);
}


//------------------------------------------------------------------------
// 299 — KEYSTONE: OVERFITTING
// First 50%: mistakes free. After 50%: mistakes cost 3× time.
// getOverfittingPhase() returns 'free' | 'hard' | 'off'.
// Call _overfittingPenaltyMultiplier() from penalty.js.
//------------------------------------------------------------------------
function _overfittingGetPhase() {
    if (!ptHasSkill('keystone_overfitting')) return 'off';
    if (!cur) return 'off';
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const total = sol.reduce((s, row) => s + row.filter(v => v === 1).length, 0);
    let filled = 0;
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (sol[r][c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])) filled++;
    return filled < Math.ceil(total * 0.50) ? 'free' : 'hard';
}

// Returns a penalty multiplier override, or null if not active.
// Call in applyPenalty() before the normal pen * penMult calculation.
function _overfittingPenaltyMultiplier() {
    if (!ptHasSkill('keystone_overfitting')) return null;
    const phase = _overfittingGetPhase();
    if (phase === 'free') return 0;   // no cost
    if (phase === 'hard') return 3;   // triple
    return null;
}


//------------------------------------------------------------------------
// 300 — KEYSTONE: THE ORACLE
// Show full solution for 3s at start, then hide all clues + board state.
// No auto-reveals, marks, or clues for the rest of the level.
// Call _applyTheOracle() from start-level.js after buildGrid().
//------------------------------------------------------------------------
window._oracleActive = false;

function _applyTheOracle() {
    if (!ptHasSkill('keystone_the_oracle')) return;
    window._oracleActive = true;

    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // Flash the full solution
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const el = document.getElementById(`g-${r}-${c}`);
            if (!el) continue;
            el.classList.remove('filled', 'marked', 'wrong-mark', 'revealed', 'questioned');
            if (sol[r][c] === 1) el.classList.add('filled', 'scan-reveal');
        }
    }

    // Hide all clues immediately
    document.querySelectorAll('.rct, .cch').forEach(el => el.classList.add('clue-blackout'));

    showToast(`👁️ ${LANG === 'de' ? 'Das Orakel! Lösung für 3 Sekunden sichtbar.' : 'The Oracle! Solution visible for 3 seconds.'}`, 3000);

    setTimeout(() => {
        // Restore all cells to blank
        for (let r = 0; r < rows; r++)
            for (let c = 0; c < cols; c++)
                renderCell(r, c);
        document.querySelectorAll('.scan-reveal').forEach(el => el.classList.remove('scan-reveal'));
    }, 3000);
}


//------------------------------------------------------------------------
// 301 — KEYSTONE: INTERQUARTILE VISION (3rd node / keystone variant)
// Adds a 3rd node of +1s to the interquartile vision scan duration.
// No separate code needed — just update _applyInterquartileVision() in start-level.js
// to also check ptHasSkill('keystone_interquartile_vision').
// This function is a drop-in replacement for that check:
//------------------------------------------------------------------------
function _interquartileVisionDuration() {
    let dur = 0;
    if (ptHasSkill('interquartile_vision_1')) dur = 2000;
    if (ptHasSkill('interquartile_vision_2')) dur += 1000;
    if (ptHasSkill('keystone_interquartile_vision')) dur += 1000;
    return dur;
}


//------------------------------------------------------------------------
// RESET all new per-level flags — call from _resetLevelState() in start-level.js
//------------------------------------------------------------------------
function _resetNewNodeState() {
    window._bayesianBonus = 0;
    window._binomialBurstFills = 0;
    window._ergodicFieldNext = null;
    window._entropyDrainTimestamps = {};
    window._randomWalkNext = null;
    window._frequentistsFills = 0;
    window._frequentistsBurdenActive = false;
    window._signalToNoiseActive = false;
    window._signalToNoiseFakeClues = [];
    window._degreesOfFreedomChoice = null;
    window._degreesOfFreedomNext = null;
    window._oracleActive = false;
}