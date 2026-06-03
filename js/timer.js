let timerSecs = 0; // current seconds remaining, initialized in startLevel() when we know which mode we're in (normal vs time trial)

let timerInterval = null; // the ID returned by setInterval so we can cancel it with clearInterval via stopTimer()



//------------------------------------------------------------------------
// Function to cancel the timer interval
//------------------------------------------------------------------------
//------------------------------------------------------------------------

//   Called when: a level ends (win or lose), the player navigates away, or
//   startTimer() calls it to prevent duplicate intervals.
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}




//------------------------------------------------------------------------
// Function to update the timer 
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// updTimer — refreshes the timer display element (#timer-val) to match
//   the current value of timerSecs, and applies colour/animation classes:
//     normal  — default accent colour, no animation
//     warn    — orange + slow blink when ≤ 3 minutes remain
//     danger  — red + fast blink when ≤ 1 minute remains
//     frozen  — solid light-blue tint while the Freeze item is active
//   Also called by applyPenalty() (input.js) after subtracting penalty
//   seconds, so the display updates immediately on a mistake.
function updTimer() {
    const m = Math.floor(Math.max(0, timerSecs) / 60); // whole minutes
    const s = Math.max(0, timerSecs) % 60;              // remaining seconds
    const el = document.getElementById('timer-val');

    // Format as MM:SS (e.g. "04:07")
    el.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');

    // Reset class list before re-applying the correct state class
    el.className = 'timer-val';

    if (timerFrozen) {
        el.style.color = '#6cf'; // icy blue — overrides CSS colour
    } else if (timerSecs <= 60) {
        el.classList.add('danger'); // red fast-blink (CSS animation)
        el.style.color = '';        // let CSS handle the colour
    } else if (timerSecs <= 180) {
        el.classList.add('warn');   // orange slow-blink
        el.style.color = '';
    } else {
        el.style.color = '';        // default accent colour from CSS
    }
    if (typeof PassiveTracker !== 'undefined') PassiveTracker.onTimerTick();
}




//------------------------------------------------------------------------
// Function to handle the timer reaching zero
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// timesUp — shows the loss overlay when the timer hits zero.
//   Sets the title and sub-text, then adds the 'show' class which makes
//   the overlay visible (display:flex via CSS).
//   Note: dead = true and stopTimer() are called by the tick loop BEFORE
//   this function, so no need to repeat them here.
function timesUp() {

    // bounceback achievement: record which level was just failed so scoring.js can
    // detect an immediate retry win on the same level.
    if (cur) window._lastFailedGi = cur.gIdx;

    document.getElementById('lose-title').textContent = t('ov_lose'); // translated string
    document.getElementById('lose-sub').textContent =
        `${mistakeCount} ${mistakeCount !== 1 ? t('ov_win_mistakes') : t('ov_win_mistake')}. ${t('btn_retry2')}!`;
    document.getElementById('ov-lose').classList.add('show');

    Audio_Manager.playSFX('lose');
}






//------------------------------------------------------------------------
// Function to start the timer
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// startTimer — begins the 1-second countdown loop.
//   Always calls stopTimer() first to guarantee there is never more than
//   one interval running at a time (important when replaying a level).
//   Each tick:
//     1. Skips if the game is already over (dead) or the timer is frozen by
//        the Freeze item or class skills(timerFrozen).
//     2. Decrements timerSecs and refreshes the displayed clock (updTimer).
//     3. Triggers the loss screen if time has run out.
function startTimer() {
    stopTimer();

    window._emergencyScanFired = false;
    window._timedStasisNext = null;
    window._lawOfLargeNext = null;
    window._poissonNext = null;

    if (ptHasSkill('timed_stasis_1')) {
        window._timedStasisNext = Date.now() + 10 * 60 * 1000;
    }

    // keystone_law_of_large_numbers (219): first trigger after 5 min
    if (ptHasSkill('keystone_law_of_large_numbers')) {
        window._lawOfLargeNext = Date.now() + 5 * 60 * 1000;
    }

    // poisson_process (270-272): schedule first auto-mark
    // Base: 120s, node 271: 90s, node 272: 60s
    if (ptHasSkill('poisson_process_1') || ptHasSkill('poisson_process_2') || ptHasSkill('poisson_process_3')) {
        let interval = 120; // Default
        if (ptHasSkill('poisson_process_3')) {
            interval = 60;
        } else if (ptHasSkill('poisson_process_2')) {
            interval = 90;
        }
        window._poissonNext = Date.now() + interval * 1000;
    }


    _ergodicFieldInit();
    _randomWalkInit();
    if (typeof resetMarkovianState === 'function') resetMarkovianState();

    timerInterval = setInterval(() => {
        if (dead || timerFrozen) return;

        _poissonProcessTick();
        _ergodicFieldTick();
        _entropyDrainTick();
        _randomWalkTick();
        _degreesOfFreedomTick();
        if (typeof _markovSnapshotTick === 'function') _markovSnapshotTick();

        // timed_stasis (195-197): auto-freeze for 1s (+0.5s per tier 2/3) every 10 min
        if ( ptHasSkill('timed_stasis_1') && window._timedStasisNext && Date.now() >= window._timedStasisNext) {
            window._timedStasisNext = Date.now() + 10 * 60 * 1000; // schedule next
            let freezeDur = 1000;
            if (ptHasSkill('timed_stasis_2')) freezeDur += 500;
            if (ptHasSkill('timed_stasis_3')) freezeDur += 500;
            timerFrozen = true;
            updTimer();
            showToast(`⏸️ ${LANG === 'de' ? 'Zeitstase!' : 'Timed Stasis!'}`);
            setTimeout(() => {
                timerFrozen = false;
                updTimer();
            }, freezeDur);
        }

        // keystone_law_of_large_numbers (219): every 5 min, reveal 1 sparse row + 1 sparse col.
        // Does not fire in the last 15 minutes (timerSecs <= 900).
        if (window._lawOfLargeNext && Date.now() >= window._lawOfLargeNext && timerSecs > 900) {
            window._lawOfLargeNext = Date.now() + 5 * 60 * 1000;
            if (cur) {
                const sol = cur.grid;
                const rows = sol.length, cols = sol[0].length;

                // Find row with fewer than 2 correct filled cells
                let sparseRow = -1;
                for (let r = 0; r < rows; r++) {
                    const filled = sol[r].filter((v, c) => v === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])).length;
                    const total = sol[r].filter(v => v === 1).length;
                    if (filled < 2 && filled < total) { sparseRow = r; break; }
                }

                // Find col with fewer than 2 correct filled cells
                let sparseCol = -1;
                for (let c = 0; c < cols; c++) {
                    const filled = sol.filter((row, r) => row[c] === 1 && (userGrid[r][c] === 1 || revealedGrid[r][c])).length;
                    const total = sol.filter(row => row[c] === 1).length;
                    if (filled < 2 && filled < total) { sparseCol = c; break; }
                }

                if (sparseRow >= 0) {
                    for (let c = 0; c < cols; c++) {
                        if (sol[sparseRow][c] === 1 && userGrid[sparseRow][c] !== 1 && !revealedGrid[sparseRow][c]) {
                            revealedGrid[sparseRow][c] = true;
                            userGrid[sparseRow][c] = 1;
                            renderCell(sparseRow, c);
                            updClues(sparseRow, c);
                        }
                    }
                }
                if (sparseCol >= 0) {
                    for (let r = 0; r < rows; r++) {
                        if (sol[r][sparseCol] === 1 && userGrid[r][sparseCol] !== 1 && !revealedGrid[r][sparseCol]) {
                            revealedGrid[r][sparseCol] = true;
                            userGrid[r][sparseCol] = 1;
                            renderCell(r, sparseCol);
                            updClues(r, sparseCol);
                        }
                    }
                }

                if (sparseRow >= 0 || sparseCol >= 0) {

                    // After the existing sparseRow/sparseCol reveal block, before checkWin():
                    if (_getBayesianBonus() > 0 && Math.random() < _getBayesianBonus()) {
                        _resetBayesianBonus();
                        revealTiles(1);
                        showToast(`🔃 ${LANG === 'de' ? 'Bayessche Verstärkung!' : 'Bayesian Boost!'}`);
                    }
                    showToast(`📉 ${LANG === 'de' ? 'Gesetz der Großen Zahlen!' : 'Law of Large Numbers!'}`);
                    checkWin();


                }
            }
        }



        if (!window._goldenClockActive) {
            timerSecs--;
            // Black Swan speedforce: timer drains 10 times as fast
            if (window._blackSwanActive) timerSecs-=9;
        }
        updTimer();

        const elapsed = Math.floor((Date.now() - levelStartTime) / 1000);
        const thresh = curMods.timetrial ? 60 : 180;
        if (elapsed >= thresh && elapsed - 1 < thresh) buildInventoryPanel();

        // emergency_scan (201-203): one-shot field scan when timer first drops to ≤5 min
        if (ptHasSkill('emergency_scan_1') && !window._emergencyScanFired && timerSecs <= 300 && timerSecs > 0) {
            window._emergencyScanFired = true;
            let scanDur = 2000;
            if (ptHasSkill('emergency_scan_2')) scanDur += 1000;
            if (ptHasSkill('emergency_scan_3')) scanDur += 2000;
            // Use a scan size of the full grid (rows and cols) so it covers everything.
            // _executeFieldScan expects (scanSize, durationMs); we pass the larger grid
            // dimension so the region always covers the whole puzzle.
            const fullSize = Math.max(cur.grid.length, cur.grid[0].length);
            _executeFieldScan(fullSize, scanDur);
        }

        if (timerSecs <= 0) {
            dead = true;
            stopTimer();
            timesUp();
        }
    }, 1000);
}



function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function resumeTimer() {
    if (!dead && !timerInterval) startTimer();
}