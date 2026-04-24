// ═══════════════════════════════════════════════
//  TIMER  (timer.js)
//  Manages the countdown clock shown during a
//  puzzle. The timer is the main pressure mechanic:
//  mistakes deduct seconds, and reaching 0 ends
//  the level as a loss.
// ═══════════════════════════════════════════════

// timerSecs    — current seconds remaining; counts down from the value set
//                in startLevel() (either 900 s normal or 300 s time-trial)
// timerInterval— the ID returned by setInterval so we can cancel it with
//                clearInterval() via stopTimer()
let timerSecs = 0, timerInterval = null;


// startTimer — begins the 1-second countdown loop.
//   Always calls stopTimer() first to guarantee there is never more than
//   one interval running at a time (important when replaying a level).
//   Each tick:
//     1. Skips if the game is already over (dead) or the timer is frozen by
//        the Freeze item (timerFrozen).
//     2. Decrements timerSecs and refreshes the displayed clock (updTimer).
//     3. Checks if we just crossed the cursed-item unlock threshold
//        (3 min elapsed in normal mode, 1 min in Time Trial) and refreshes
//        the inventory panel so the lock icon disappears right on cue.
//     4. Triggers the loss screen if time has run out.
function startTimer() {
    stopTimer(); // clear any pre-existing interval before creating a new one

    timerInterval = setInterval(() => {
        if (dead || timerFrozen) return; // pause ticking while frozen or game over

        timerSecs--;
        updTimer();

        // Calculate how many seconds have elapsed since the level started
        const elapsed = DIFF_CFG[curDiff].timerStart - timerSecs;
        // Cursed items unlock after 3 minutes normally, 1 minute in Time Trial
        const thresh = curMods.timetrial ? 60 : 180;
        // Exactly at the threshold — rebuild the inventory to remove lock badges
        if (elapsed === thresh) buildInventoryPanel();

        // Timer reached zero — game over
        if (timerSecs <= 0) {
            dead = true;
            stopTimer();
            timesUp();
        }
    }, 1000); // fires every 1000 ms = 1 second
}

// stopTimer — cancels the interval and clears the reference.
//   Safe to call even when no timer is running (the if-guard prevents errors).
//   Called when: a level ends (win or lose), the player navigates away, or
//   startTimer() calls it to prevent duplicate intervals.
function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

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
}

// timesUp — shows the loss overlay when the clock hits zero.
//   Sets the title and sub-text, then adds the 'show' class which makes
//   the overlay visible (display:flex via CSS).
//   Note: dead = true and stopTimer() are called by the tick loop BEFORE
//   this function, so no need to repeat them here.
function timesUp() {
    document.getElementById('lose-title').textContent = t('ov_lose'); // translated string
    document.getElementById('lose-sub').textContent =
        `${mistakeCount} ${mistakeCount !== 1 ? t('ov_win_mistakes') : t('ov_win_mistake')}. ${t('btn_retry2')}!`;
    document.getElementById('ov-lose').classList.add('show');
}





