//------------------------------------------------------------------------
//--------------------ASCENDENCY SKILL IMPLEMENTATIONS-------------------
//----------------------------RANDOM WALKER CLASS-------------------------
//------------------------------------------------------------------------
// Each ascendency's active skills live here.
// Dispatch is routed from _dispatchAscendencyAbility in class-abilities.js.
//------------------------------------------------------------------------

// Global tracking arrays to completely kill active background timer loops
window._bearIntervals = window._bearIntervals || [];
window._walkerHudTimers = window._walkerHudTimers || []; // Tracks active UI interval loops

//------------------------------------------------------------------------
//--------------------RANDOM WALKER — BROWNIAN MOTION--------------------
//------------------------------------------------------------------------

function _executeBrownianMotion(row, col, paths, rank) {
    if (!cur) return false;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    let stepDurationMs = 5000; // 5 second per cell move

    if (rank === 2) {
        stepDurationMs = 4000; // 4 seconds per cell move at rank 2
    } else if (rank === 3) {
            stepDurationMs = 3000; // 3 seconds per cell move at rank 3
        }
    


    // Generate path and start primary bear (Browney) from a random left cell
    const startR1 = Math.floor(Math.random() * rows);
    const path1 = _generateBouncingBrownianPath(startR1, rows, cols);
    _startBearAnimation(path1, "🐻", stepDurationMs, "Browney");

    // Rank 3: Spawn the second bear (Wiener)
    if (paths > 1) {
        const startR2 = Math.floor(Math.random() * rows);
        const path2 = _generateBouncingBrownianPath(startR2, rows, cols);
        _startBearAnimation(path2, "🐼", stepDurationMs, "Wiener");
    }

    if (paths === 1) {
        showToast(`🐻 Browney unleashed!`);
    } else {
        showToast(`🐻 Browney & Wiener unleashed!`);
    }

    Audio_Manager.playSFX('browneySummon');
    return true;
}

function _generateBouncingBrownianPath(startR, rows, cols) {
    const path = [];
    let r = startR;
    let c = 0;
    let emergencyStop = 1500;

    path.push({ r, c });

    while (emergencyStop-- > 0) {
        // Stop generating the path once the bear hits the right edge
        if (c >= cols - 1) {
            break;
        }

        const possibleMoves = [];

        // Always bias movement to the right
        possibleMoves.push({ dr: 0, dc: 1 }, { dr: 0, dc: 1 });

        // Allow random up and down movement
        if (r > 0) possibleMoves.push({ dr: -1, dc: 0 });
        if (r < rows - 1) possibleMoves.push({ dr: 1, dc: 0 });

        const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        r += move.dr;
        c += move.dc;

        path.push({ r, c });
    }
    return path;
}

function _startBearAnimation(path, icon, stepDurationMs, bearName) {
    if (!path || path.length === 0) return;

    const bearEl = document.createElement('div');
    bearEl.className = 'random-walker-agent bear-agent'; // Tracking classes
    bearEl.textContent = icon;
    bearEl.style.cssText = `
        position: fixed;
        font-size: 28px;
        z-index: 1000;
        pointer-events: none;
        transition: left ${stepDurationMs}ms linear, top ${stepDurationMs}ms linear;
        transform: translate(-50%, -50%);
        text-shadow: 0 4px 10px rgba(0,0,0,0.6);
    `;
    document.body.appendChild(bearEl);

    const setBearPosition = (r, c) => {
        const cellEl = document.getElementById(`g-${r}-${c}`);
        if (cellEl) {
            const rect = cellEl.getBoundingClientRect();
            bearEl.style.left = `${rect.left + rect.width / 2}px`;
            bearEl.style.top = `${rect.top + rect.height / 2}px`;
        }
    };

    setBearPosition(path[0].r, path[0].c);
    _revealCellForBear(path[0].r, path[0].c);

    // Spawn HUD element tracking this specific bear
    const totalDurationSeconds = Math.ceil((path.length * stepDurationMs) / 1000);
    const hudUid = _spawnWalkerHudIndicator(icon, bearName, totalDurationSeconds);

    let step = 0;
    const interval = setInterval(() => {
        step++;

        if (step >= path.length) {
            clearInterval(interval);
            window._bearIntervals = window._bearIntervals.filter(id => id !== interval);

            // Clear this specific bear's HUD indicator element
            _removeWalkerHudIndicator(hudUid);

            bearEl.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            bearEl.style.opacity = '0';
            bearEl.style.transform = 'translate(-50%, -80%) scale(1.5)';
            setTimeout(() => bearEl.remove(), 600);
            return;
        }

        const nextTarget = path[step];
        setBearPosition(nextTarget.r, nextTarget.c);
        _revealCellForBear(nextTarget.r, nextTarget.c);
    }, stepDurationMs);

    window._bearIntervals.push(interval);
}

let nextBearRevealSoundTime = 0;
function _revealCellForBear(r, c) {
    if (!cur) return;

    const now = Date.now();

    // Only allow sound every 8-15 seconds
    if (now >= nextBearRevealSoundTime) {
        Audio_Manager.playSFX('browneyReveal');

        // Set next allowed play time
        const randomDelay = (Math.random() * 7 + 8) * 1000; // 8-15 sec
        nextBearRevealSoundTime = now + randomDelay;
    }

    const sol = cur.grid;

    if (sol[r][c] === 1 && !revealedGrid[r][c] && userGrid[r][c] !== 1) {
        revealedGrid[r][c] = true;
        userGrid[r][c] = 1;
        renderCell(r, c);
        updClues(r, c);
        trackAchStat('tilesRevealed', 1);
        _applyCellEffect([`g-${r}-${c}`], 'reveal');
        trackAchStat('brownianCellsRevealed');

        if (typeof ptHasSkill === 'function' && ptHasSkill('adjacency_matrix')) {
            _adjacencyMatrixRefreshAll();
        }
    } else if (sol[r][c] === 0 && userGrid[r][c] === 0) {
        //userGrid[r][c] = 2;
        //renderCell(r, c);
        //_applyCellEffect([`g-${r}-${c}`], 'mark');
    }

    questStat_classRevealUsed(1);
    updateQuestStats('classAbilityUsedThisLevel', {});

    checkWin();
}

//------------------------------------------------------------------------
//--------------------RANDOM WALKER — SUMMON DRIFTER---------------------
//------------------------------------------------------------------------

function _executeSummonDrifter(duration, interval, smartTarget) {
    if (!cur) return;
    _drifterClear();

    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    window._drifterActive = true;
    window._drifterCharges = 0;
    window._drifterCurrentFeed = 0;

    window._drifterBaseInterval = interval;
    window._drifterCurrentInterval = interval;
    window._drifterTimeRemainingSeconds = Math.ceil(duration / 1000);

    let currR = Math.floor(Math.random() * rows);
    let currC = Math.floor(Math.random() * cols);

    showToast(`🐶 Drifter is roaming!`);
    Audio_Manager.playSFX('drifterSummon');

    const drifterEl = document.createElement('div');
    drifterEl.id = 'drifter-agent';
    drifterEl.className = 'random-walker-agent drifter-agent';
    drifterEl.style.cssText = `
        position: fixed;
        font-size: 28px;
        z-index: 1000;
        pointer-events: none;
        transition: left ${interval}ms linear, top ${interval}ms linear;
        transform: translate(-50%, -50%);
        text-shadow: 0 4px 10px rgba(0,0,0,0.6);
        display: flex;
        flex-direction: column;
        align-items: center;
    `;

    drifterEl.innerHTML = `
        <div id="drifter-lvl-text" style="font-size: 12px; color: #48c9b0; font-family: monospace; font-weight: bold; margin-bottom: 2px;">Lv.0</div>
        <div style="width: 30px; height: 5px; background: rgba(0,0,0,0.7); border: 1px solid #48c9b0; border-radius: 3px; margin-bottom: 4px; overflow: hidden;">
            <div id="drifter-healthbar" style="width: 0%; height: 100%; background: #1abc9c; transition: width 0.3s;"></div>
        </div>
        <div id="drifter-icon">🐶</div>
    `;
    document.body.appendChild(drifterEl);

    _drifterUpdateDOMPosition(drifterEl, currR, currC);
    _revealCellForBear(currR, currC);

    const hudUid = _spawnWalkerHudIndicator("🐶", "Drifter", window._drifterTimeRemainingSeconds, true);

    const scheduleNextDrifterStep = () => {
        if (!window._drifterActive) return;

        window._drifterInterval = setTimeout(() => {
            const nextStep = _drifterGetNextStep(currR, currC, rows, cols, smartTarget, sol);
            currR = nextStep.r;
            currC = nextStep.c;

            _drifterUpdateDOMPosition(drifterEl, currR, currC);
            _revealCellForBear(currR, currC);
            Audio_Manager.playSFX('drifterBark');

            scheduleNextDrifterStep();
        }, window._drifterCurrentInterval);
    };
    scheduleNextDrifterStep();

    // Core countdown timer
    window._drifterTimer = setInterval(() => {
        window._drifterTimeRemainingSeconds--;

        if (window._drifterTimeRemainingSeconds <= 0) {
            // STOP active roaming loop logic safely WITHOUT deleting the DOM element yet
            window._drifterActive = false;
            if (window._drifterInterval) { clearTimeout(window._drifterInterval); window._drifterInterval = null; }
            if (window._drifterTimer) { clearInterval(window._drifterTimer); window._drifterTimer = null; }

            _removeWalkerHudIndicator(hudUid); // Terminate roaming HUD card
            _drifterPoopExplosion(drifterEl, currR, currC, rows, cols); // Initiate Phase 2 Explosion!
        }
    }, 1000);
}


function _drifterGetNextStep(r, c, rows, cols, smart, sol) {
    const neighbors = [
        { dr: -1, dc: 0 }, { dr: 1, dc: 0 }, { dr: 0, dc: -1 }, { dr: 0, dc: 1 }
    ].map(n => ({ r: r + n.dr, c: c + n.dc }))
        .filter(n => n.r >= 0 && n.r < rows && n.c >= 0 && n.c < cols);

    if (smart) {
        const smartMoves = neighbors.filter(n => sol[n.r][n.c] === 1 && !revealedGrid[n.r][n.c] && userGrid[n.r][n.c] !== 1);
        if (smartMoves.length > 0) {
            return smartMoves[Math.floor(Math.random() * smartMoves.length)];
        }
    }
    return neighbors[Math.floor(Math.random() * neighbors.length)];
}

function _drifterUpdateDOMPosition(el, r, c) {
    const cellEl = document.getElementById(`g-${r}-${c}`);
    if (cellEl) {
        const rect = cellEl.getBoundingClientRect();
        el.style.left = `${rect.left + rect.width / 2}px`;
        el.style.top = `${rect.top + rect.height / 2}px`;
    }
}

function _drifterPoopExplosion(el, r, c, rows, cols) {
    window._drifterActive = false;

    // Safely verify the element still exists before modifying it
    if (!el || !document.body.contains(el)) return;

    // Wipe out level tags and level metrics smoothly
    const lvlEl = document.getElementById('drifter-lvl-text');
    if (lvlEl) lvlEl.remove();

    const barEl = document.getElementById('drifter-healthbar')?.parentElement;
    if (barEl) barEl.remove();

    const iconEl = document.getElementById('drifter-icon');
    if (iconEl) iconEl.innerHTML = "💩";

    const fuseEl = document.createElement('div');
    fuseEl.style.cssText = "color: #e74c3c; font-weight: bold; font-size: 20px; font-family: monospace; margin-bottom: 2px;";
    fuseEl.innerText = "3";
    if (el.contains(iconEl)) el.insertBefore(fuseEl, iconEl);

    // Give the final explosion fuse phase a high-priority tracking badge
    const hudUid = _spawnWalkerHudIndicator("💥", "Fuse Countdown", 3);
    Audio_Manager.playSFX('drifterPoop');

    let countdown = 3;
    window._drifterFuseInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            if (fuseEl) fuseEl.innerText = countdown;
        } else {
            clearInterval(window._drifterFuseInterval);
            window._drifterFuseInterval = null;
            _removeWalkerHudIndicator(hudUid);

            const radius = window._drifterCharges;
            let cellsRevealed = 0;

            for (let i = r - radius; i <= r + radius; i++) {
                for (let j = c - radius; j <= c + radius; j++) {
                    if (i >= 0 && i < rows && j >= 0 && j < cols) {
                        if (cur.grid[i][j] === 1 && !revealedGrid[i][j] && userGrid[i][j] !== 1) {
                            revealedGrid[i][j] = true;
                            userGrid[i][j] = 1;
                            renderCell(i, j);
                            updClues(i, j);
                            _applyCellEffect([`g-${i}-${j}`], 'reveal');
                            cellsRevealed++;
                        } else if (cur.grid[i][j] === 0 && userGrid[i][j] === 0) {
                            userGrid[i][j] = 2;
                            renderCell(i, j);
                            _applyCellEffect([`g-${i}-${j}`], 'mark');
                        }
                    }
                }
            }

            showToast(`💩 Kaboom!`);
            Audio_Manager.playSFX('drifterExplosion');

            el.style.transform = 'translate(-50%, -50%) scale(2)';
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 300);

            if (cellsRevealed > 0) trackAchStat('tilesRevealed', cellsRevealed);
            questStat_classRevealUsed(cellsRevealed);
            updateQuestStats('classAbilityUsedThisLevel', {});
            checkWin();
        }
    }, 1000);
}


function _drifterClear() {
    window._drifterActive = false;
    if (window._drifterInterval) { clearTimeout(window._drifterInterval); window._drifterInterval = null; }
    if (window._drifterTimer) { clearInterval(window._drifterTimer); window._drifterTimer = null; }
    if (window._drifterFuseInterval) { clearInterval(window._drifterFuseInterval); window._drifterFuseInterval = null; }
    document.getElementById('drifter-agent')?.remove();
}

window.feedDrifter = function () {
    if (!window._drifterActive) return;

    // 1. Grant bonus lifetime duration on every feed point (+1.5 seconds)
    window._drifterTimeRemainingSeconds += 0.5;

    // 2. Dynamic Target Calculation: 
    // Current level requires: (Current Level + 1) * 5 reveals.
    // Lv.0 -> Lv.1 requires 5
    // Lv.1 -> Lv.2 requires 10
    // Lv.2 -> Lv.3 requires 15 ...and so on.
    const currentTargetReq = (window._drifterCharges + 1) * 5;

    window._drifterCurrentFeed++;

    if (window._drifterCurrentFeed >= currentTargetReq) {
        window._drifterCurrentFeed = 0;
        window._drifterCharges++; // LEVEL UP!

        // Speed up movement: Each level reduces step delay by 15% (capped at 75% max speedup)
        const speedMultiplier = Math.max(0.25, 1 - (window._drifterCharges * 0.15));
        window._drifterCurrentInterval = window._drifterBaseInterval * speedMultiplier;

        // Update the CSS transition timing dynamically so animations match the faster loops
        const drifterEl = document.getElementById('drifter-agent');
        if (drifterEl) {
            drifterEl.style.transition = `left ${window._drifterCurrentInterval}ms linear, top ${window._drifterCurrentInterval}ms linear`;

            // Fun pop animation
            drifterEl.style.transform = 'translate(-50%, -50%) scale(1.4)';
            setTimeout(() => {
                if (drifterEl) drifterEl.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 200);
        }

        const lvlEl = document.getElementById('drifter-lvl-text');
        if (lvlEl) lvlEl.innerText = `Lv.${window._drifterCharges}`;

        showToast(`🐶 Drifter Level Up!`);
        Audio_Manager.playSFX('drifterLevelUp');
        trackAchStat('drifterLevelUps');
    }

    // 3. Update the health bar using the newly calculated dynamic level cap
    const nextTargetReq = (window._drifterCharges + 1) * 5;
    const bar = document.getElementById('drifter-healthbar');
    if (bar) {
        bar.style.width = `${(window._drifterCurrentFeed / nextTargetReq) * 100}%`;
    }
};
//------------------------------------------------------------------------
//--------------------SYSTEM ACTIVE TIMERS UI ELEMENT--------------------
//------------------------------------------------------------------------

function _spawnWalkerHudIndicator(icon, label, initialSeconds, isDrifter = false) {
    let container = document.getElementById('walker-hud-panel');
    if (!container) {
        container = document.createElement('div');
        container.id = 'walker-hud-panel';
        container.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 16px;
            z-index: 999;
            display: flex;
            flex-direction: column;
            gap: 6px;
            pointer-events: none;
            font-family: monospace;
        `;
        document.body.appendChild(container);
    }

    const uniqueId = isDrifter ? 'hud-walker-drifter-track' : `hud-walker-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const el = document.createElement('div');
    el.id = uniqueId;
    el.className = 'random-walker-agent';
    el.style.cssText = `
        background: rgba(15, 15, 25, 0.85);
        border: 1px solid #16a085;
        border-left: 4px solid #48c9b0;
        border-radius: 5px;
        padding: 6px 12px;
        font-size: 11px;
        color: #48c9b0;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        backdrop-filter: blur(4px);
        min-width: 130px;
        justify-content: space-between;
        animation: walkerHudSlide 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
    `;

    el.innerHTML = `
        <span style="font-weight: bold;">${icon} ${label}</span>
        <span id="${uniqueId}-timer" style="color: #f1c40f; font-weight: bold; font-family: monospace;">${initialSeconds}s</span>
    `;
    container.appendChild(el);

    let timeRemaining = initialSeconds;
    const tickerInterval = setInterval(() => {
        // If this is the drifter card, pull from the globally scaling duration pool instead!
        if (isDrifter) {
            timeRemaining = Math.max(0, Math.floor(window._drifterTimeRemainingSeconds));
        } else {
            timeRemaining--;
        }

        const timerTextEl = document.getElementById(`${uniqueId}-timer`);
        if (timerTextEl) {
            timerTextEl.textContent = `${timeRemaining}s`;
        }

        if (timeRemaining <= 0 && !isDrifter) {
            clearInterval(tickerInterval);
            _removeWalkerHudIndicator(uniqueId);
        }
    }, 1000);

    window._walkerHudTimers.push({ id: uniqueId, loopId: tickerInterval });
    return uniqueId;
}
function _removeWalkerHudIndicator(id) {
    const targetIndicator = document.getElementById(id);
    if (targetIndicator) {
        targetIndicator.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        targetIndicator.style.opacity = '0';
        targetIndicator.style.transform = 'scale(0.8)';
        setTimeout(() => targetIndicator.remove(), 200);
    }
    // Clean associated intervals internally
    const match = window._walkerHudTimers.find(t => t.id === id);
    if (match) {
        clearInterval(match.loopId);
        window._walkerHudTimers = window._walkerHudTimers.filter(t => t.id !== id);
    }
}

//------------------------------------------------------------------------
//------------------GLOBAL END-OF-LEVEL CLEANUP HOOK---------------------
//------------------------------------------------------------------------

window.clearActiveRandomWalkers = function () {
    // 1. Force kill all background running loop intervals for the bears
    if (window._bearIntervals && window._bearIntervals.length > 0) {
        window._bearIntervals.forEach(intervalId => clearInterval(intervalId));
        window._bearIntervals = [];
    }

    // 2. Shut down UI HUD running intervals cleanly
    if (window._walkerHudTimers && window._walkerHudTimers.length > 0) {
        window._walkerHudTimers.forEach(hud => clearInterval(hud.loopId));
        window._walkerHudTimers = [];
    }

    // 3. Shut down Drifter logic completely (including active explosive countdown fuses)
    _drifterClear();

    // 4. Purge all remaining visual animal elements and status containers from the DOM screen
    document.querySelectorAll('.random-walker-agent').forEach(el => el.remove());
    document.getElementById('walker-hud-panel')?.remove();
};