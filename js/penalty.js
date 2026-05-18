// Handles penalties for mistakes, including time deduction, visual feedback, and tracking mistake count for scoring and achievements.







function applyPenalty() {
    const penMult = getClassPenaltyMultiplier(); // class effect, 0 = absorbed by Variance Shield

    if (penMult === 0) {
        // Fully absorbed by a shield effect
        showToast(t('pen_shield')); 
        return;
    }

    mistakeCount++;
    trackAchStat('mistakesMade');

    if (typeof onMistake === 'function') onMistake();

    // Pick the penalty for this mistake based on current difficuly and mistake count
    const pens = DIFF_CFG[curDiff].pens;
    const pen = pens[Math.min(mistakeCount - 1, pens.length - 1)];

    // Deduct penalty seconds and refresh the clock display
    const timerBefore = timerSecs;
    timerSecs = Math.max(0, timerSecs - Math.round(pen * penMult));
    updTimer();

    // penalty_clutch: flag if this penalty pushed the timer below 60s (and player
    // was above 60s before), so scoring.js can award the achievement on win
    if (timerBefore >= 60 && timerSecs < 60 && timerSecs > 0) {
        window._hadPenaltyClutch = true;
    }

    // Show the penalty amount in the HUD as minutes:seconds, then clear it after 3 s
    const pi = document.getElementById('pen-info');
    const penMins = Math.floor(pen / 60);
    const penSecs = pen % 60;
    const penLabel = penMins > 0 ? `−${penMins}:${String(penSecs).padStart(2, '0')}` : `−${penSecs}s`;
    pi.textContent = `${penLabel} (#${mistakeCount})`;

    const mc = document.getElementById('mistake-counter');
    if (mc) mc.textContent = `${LANG === 'de' ? 'Fehler' : 'Mistakes'}: ${mistakeCount}`;
    clearTimeout(pi._t);
    pi._t = setTimeout(() => pi.textContent = '', 3000);

    // Brief red screen flash for visual feedback
    const fl = document.getElementById('pen-flash');
    fl.classList.add('show');
    setTimeout(() => fl.classList.remove('show'), 350);

    // If time ran out from this penalty, end the game immediately
    if (timerSecs <= 0) {
        dead = true;
        stopTimer();
        timesUp();
    }
}





//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------










