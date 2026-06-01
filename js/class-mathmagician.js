
//------------------------------------------------------------------------
//----------------------MATHMAGICIAN SKILLS-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Arcane Reveal

// _executeArcaneReveal — reveals correct/wrong state for all cells within
//   'radius' steps of (row, col), including diagonal. Works at borders.



function _executeArcaneReveal(row, col, radius, maxReveals = 4) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // --- NEW: MODIFIED PASSIVE NODE LOGIC ---
    // Instead of casting twice dynamically via instance bonus cells,
    // these passive nodes now each grant +1 to the maximum allowed reveals.
    let effectiveMaxReveals = maxReveals;
    if (ptHasSkill('arcane_echo')) effectiveMaxReveals += 1;
    if (ptHasSkill('resonant_reveal')) effectiveMaxReveals += 1;

    const effectiveRadius = radius + (ptHasSkill('god_of_math') ? 1 : 0);
    const affected = _arcaneRevealCollectCells(row, col, effectiveRadius, rows, cols, sol, effectiveMaxReveals);

    const revealedIds = _filterRevealedIds(affected, sol);
    const markedIds = ptHasSkill('arcane_exposure') ? _filterMarkedIds(affected, sol) : [];

    // --- STAGGERED REVEAL & EFFECT LOOP ---
    // We process each cell one by one with a delay.
    const STAGGER_DELAY = 250; // Milliseconds between each balloon starting

    revealedIds.forEach((id, index) => {
        setTimeout(() => {
            const [, r, c] = id.split('-').map(Number);

            // 1. Spawn the rising balloon overlay on the cell DOM element
            _spawnArcaneBalloon(r, c, () => {
                // 2. This callback runs exactly 1 second later when the balloon bursts!

                // Visually reveal the cell on the board
                _applyCellEffect([id], 'reveal');

                // Spawn your existing game sparkles at the burst site
                _spawnArcaneSparkles([id]);

                if (ptHasSkill('adjacency_matrix')) _adjacencyMatrixRefreshAll();

                // Stats & Achievements
                updateQuestStats('tilesRevealed', { count: 1 });
                trackAchStat('tilesRevealed', 1);

                questStat_classRevealUsed(1);
                updateQuestStats('classAbilityUsedThisLevel', {});

                // Check win condition after individual tiles update
                checkWin();
            });

        }, index * STAGGER_DELAY);
    });

    // --- EXPOSURE MARKING LOOP ---
    // We can run the standard passive marks on a slight lag or instantly
    if (markedIds.length > 0) {
        markedIds.forEach(id => {
            const [, r, c] = id.split('-').map(Number);
            if (userGrid[r][c] === 0) {
                userGrid[r][c] = 2;
                renderCell(r, c);
                questStat_classMarkUsed(1);
            }
        });
        _applyCellEffect(markedIds, 'mark');
    }

    // --- BONUS CELLS LOOP REMOVED ---
    // Random double-cast logic for 'arcane_echo' and 'resonant_reveal' has been replaced by the max reveal modifiers above.

    Audio_Manager.playSFX('arcaneReveal');
}





function _arcaneRevealCollectCells(row, col, radius, rows, cols, sol, maxReveals) {
    const affected = [];
    const hasExposure = ptHasSkill('arcane_exposure');

    const REVEAL_LIMIT = maxReveals;

    const correctCandidates = [];
    const incorrectCandidates = [];

    // Separate cells into potential correct and incorrect pools
    for (let r = Math.max(0, row - radius); r <= Math.min(rows - 1, row + radius); r++) {
        for (let c = Math.max(0, col - radius); c <= Math.min(cols - 1, col + radius); c++) {
            if (sol[r][c] === 1) {
                correctCandidates.push([r, c]);
            } else if (sol[r][c] === 0 && hasExposure) {
                // Only care about incorrect cells if they have the passive skill
                incorrectCandidates.push([r, c]);
            }
        }
    }

    // Shuffle the correct candidates so the limit picks random ones, not just top-left
    _shuffleArray(correctCandidates);

    // Slice the array to enforce the limit
    const limitedCorrect = correctCandidates.slice(0, REVEAL_LIMIT);

    // Combine the allowed correct cells and incorrect cells to resolve them
    const finalCellsToProcess = [...limitedCorrect, ...incorrectCandidates];

    // Execute resolution on the final allowed list
    finalCellsToProcess.forEach(([r, c]) => {
        const id = _resolveCell(r, c, sol);
        if (id) affected.push(id);
    });

    return affected;
}

// Simple Durstenfeld shuffle utility function (add this if you don't have one)
function _shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function _spawnArcaneBalloon(row, col, onBurstCallback) {
    // 1. Primary Look-up: Directly query the standard game board ID format (g-row-col)
    let cellElement = document.getElementById(`g-${row}-${col}`);

    // 2. Secondary Look-up: Try to find the cell strictly inside standard play grid containers
    if (!cellElement) {
        cellElement = document.querySelector(`#game-grid [id$="-${row}-${col}"]`) ||
            document.querySelector(`.grid-board [id$="-${row}-${col}"]`);
    }

    // 3. Fallback: Check for class name attributes containing the coordinates
    if (!cellElement) {
        cellElement = document.querySelector(`.grid-cell[id$="-${row}-${col}"]`) ||
            document.querySelector(`.tile[id$="-${row}-${col}"]`) ||
            document.querySelector(`.cell[id$="-${row}-${col}"]`);
    }

    // 4. Absolute Fallback: Try your global raw tracking format directly
    if (!cellElement) {
        cellElement = document.getElementById(`${row}-${col}`);
    }

    // Safety guard clause if the element genuinely does not exist or is out-of-bounds
    if (!cellElement) {
        console.error(`🔮 Arcane Reveal Error: Could not find play-grid element for coordinates: ${row}, ${col}`);
        if (onBurstCallback) onBurstCallback();
        return;
    }

    _attachBalloon(cellElement, onBurstCallback);
}


function _attachBalloon(element, onBurstCallback) {
    element.style.position = 'relative';
    element.style.overflow = 'visible';

    const container = document.createElement('div');
    container.className = 'balloon-effect-container';

    const balloon = document.createElement('div');
    balloon.className = 'arcane-balloon';

    container.appendChild(balloon);
    element.appendChild(container);

    // This runs precisely at 1600ms matching our CSS balloon lifespan
    setTimeout(() => {
        if (onBurstCallback) onBurstCallback();

        // --- NEW: SPAWN EXPLODING OUTWARD STARS ---
        const STAR_COUNT = 12; // Number of stars per explosion
        for (let i = 0; i < STAR_COUNT; i++) {
            const star = document.createElement('div');
            star.className = 'arcane-exploding-star';
            star.innerHTML = '✦'; // Purple star symbol

            // Give each star a completely unique random angle (0 to 360 degrees)
            const randomAngle = Math.random() * 360;
            // Distribute speed/distance so they spread organically
            const randomDistance = 400 + Math.random() * 400; // High distance to clear the screen
            // Slight delay variations so the explosion looks textured and chaotic
            const randomDelay = Math.random() * 0.15;

            star.style.setProperty('--angle', `${randomAngle}deg`);
            star.style.setProperty('--distance', `${randomDistance}px`);
            star.style.setProperty('--delay', `${randomDelay}s`);

            // Append directly to the container so they blast outwards from the center
            container.appendChild(star);
        }

        // Clean up the balloon asset itself immediately, but let the stars finish flying
        balloon.remove();

        // Remove the entire container once the stars have flown completely off screen (1.5 seconds later)
        setTimeout(() => {
            container.remove();
        }, 1500);

    }, 1600);
}






















/*

// Absolute Zero

// _executeArcaneFreeze — freezes the timer for durationMs.
//   During the window, wrong fills cost zero time (window._freezeActive flag).
function _executeArcaneFreeze(durationMs) {
    // prolonged_frost and deep_freeze each add 500ms
    let effectiveDuration = durationMs;
    if (ptHasSkill('prolonged_frost')) effectiveDuration += 500;
    if (ptHasSkill('deep_freeze')) effectiveDuration += 500;

    timerFrozen = true;
    window._freezeActive = true;
    window._freezeCorrFills = 0;   // for frozen_resilience tracking
    _startBlizzardEffect(effectiveDuration);
    updTimer();

    const secs = Math.ceil(effectiveDuration / 1000);
    showToast(`🔮 Absolute Zero! ${secs}s!`);

    Audio_Manager.playSFX('absoluteZero');

    const tick = _arcaneFreezeStartCountdown(secs);
    setTimeout(() => _arcaneFreezeEnd(tick), effectiveDuration);
}


*/


// _executeArcaneFreeze — freezes the timer for durationMs.
//   During the window, wrong fills cost zero time (window._freezeActive flag).
function _executeArcaneFreeze(durationMs) {
    // prolonged_frost and deep_freeze each add 500ms
    let effectiveDuration = durationMs;
    if (ptHasSkill('prolonged_frost')) effectiveDuration += 500;
    if (ptHasSkill('deep_freeze')) effectiveDuration += 500;

    timerFrozen = true;
    window._freezeActive = true;
    window._freezeCorrFills = 0;   // for frozen_resilience tracking

    // ── NEW: Spawn the frozen floor element ──
    let frozenFloor = document.getElementById('ability-frozen-floor');
    if (!frozenFloor) {
        frozenFloor = document.createElement('div');
        frozenFloor.id = 'ability-frozen-floor';
        document.body.appendChild(frozenFloor);
    }
    // Force a minor reflow so the transition fires gracefully
    void frozenFloor.offsetWidth;
    frozenFloor.classList.add('active');
    // ──────────────────────────────────────────

    _startBlizzardEffect(effectiveDuration);
    updTimer();

    const secs = Math.ceil(effectiveDuration / 1000);
    showToast(`🔮 Absolute Zero! ${secs}s!`);

    Audio_Manager.playSFX('absoluteZero');

    const tick = _arcaneFreezeStartCountdown(secs);
    setTimeout(() => _arcaneFreezeEnd(tick), effectiveDuration);
}



// _arcaneFreezeStartCountdown — ticks the freeze timer display every second.
//   Returns the interval handle so it can be cleared on expiry.
function _arcaneFreezeStartCountdown(totalSecs) {
    let remaining = totalSecs;
    const interval = setInterval(() => {
        remaining--;
        const el = document.getElementById('timer-val');
        if (el) el.textContent = `❄️ ${remaining}s`;
        if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return interval;
}


/*
// _arcaneFreezeEnd — restores normal timer state after the freeze expires.
function _arcaneFreezeEnd(tick) {
    timerFrozen = false;
    window._freezeActive = false;
    clearInterval(tick);
    updTimer();
    showToast('🔮 Absolute Zero ended!');
    buildClassHUD();
}

*/



// _arcaneFreezeEnd — restores normal timer state after the freeze expires.
function _arcaneFreezeEnd(tick) {
    timerFrozen = false;
    window._freezeActive = false;
    clearInterval(tick);
    updTimer();
    showToast('🔮 Absolute Zero ended!');
    buildClassHUD();

    // ── NEW: Smoothly remove the frozen floor ──
    const frozenFloor = document.getElementById('ability-frozen-floor');
    if (frozenFloor) {
        frozenFloor.classList.remove('active');
        // Wait for the CSS transition (0.5s) to complete before deleting from DOM
        setTimeout(() => {
            if (frozenFloor && !frozenFloor.classList.contains('active')) {
                frozenFloor.remove();
            }
        }, 500);
    }
    // ──────────────────────────────────────────
}