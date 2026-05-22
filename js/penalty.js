// Handles penalties for mistakes, including time deduction, visual feedback, and tracking mistake count for scoring and achievements.


function applyPenalty() {
    const penMult = getClassPenaltyMultiplier(); // class effect, 0 = absorbed by Variance Shield

    const overfitMult = _overfittingPenaltyMultiplier();

    if (overfitMult !== null) {
        if (overfitMult === 0) { wrongGrid[row][col] = true; renderCell(row, col); return; }
        // otherwise overfitMult replaces the normal penMult below
    }




    if (penMult === 0) {
        // Fully absorbed by a shield effect
        showToast(t('pen_shield'));
        return;
    }

    // keystone_stochastic_resonance (265): 50% chance to reveal 1 correct cell instead of penalising.
    // Cannot trigger twice in a row (tracked via window._stochasticLastFired).
    if (ptHasSkill('keystone_stochastic_resonance') && !window._stochasticLastFired && Math.random() < 0.5) {
        window._stochasticLastFired = true;
        revealTiles(1);
        showToast(`〰️ ${LANG === 'de' ? 'Stochastische Resonanz! Zelle enthüllt.' : 'Stochastic Resonance! Cell revealed.'}`);
        return; // no mistakeCount increment, no time loss
    }
    window._stochasticLastFired = false;

    mistakeCount++;

    _onMistakeBayesianUpdate();
    _gamblersRuinOnMistake();

    trackAchStat('mistakesMade');

    if (typeof onMistake === 'function') onMistake();

    // standard_deviation (255-257): every 3 mistakes (or every 2 with node 3) reveal cells.
    // Nodes stack: 1 cell each per node allocated (up to 3 cells with all three).
    if (ptHasSkill('standard_deviation_1') || ptHasSkill('standard_deviation_2') || ptHasSkill('standard_deviation_3')) {
        const threshold = ptHasSkill('standard_deviation_3') ? 2 : 3;
        if (mistakeCount % threshold === 0) {
            const count = (ptHasSkill('standard_deviation_1') ? 1 : 0)
                + (ptHasSkill('standard_deviation_2') ? 1 : 0)
                + (ptHasSkill('standard_deviation_3') ? 1 : 0);
            revealTiles(count);
            showToast(`📏 ${LANG === 'de' ? `Standardabweichung! ${count} Zelle(n) enthüllt.` : `Standard Deviation! ${count} cell(s) revealed.`}`);
        }
    }

    // Pick the penalty for this mistake based on current difficulty and mistake count
    const pens = DIFF_CFG[curDiff].pens;
    const pen = pens[Math.min(mistakeCount - 1, pens.length - 1)];

    // keystone_asymptotic_mastery (266): each completed line permanently reduces future penalty by 5s
    const asymptoteReduction = (window._asymptoticLinesCompleted || 0) * 5;

    // Deduct penalty seconds and refresh the clock display
    const timerBefore = timerSecs;
    const effectivePen = Math.max(0, Math.round(pen * penMult) - asymptoteReduction);
    timerSecs = Math.max(0, timerSecs - effectivePen);
    updTimer();

    // penalty_clutch: flag if this penalty pushed the timer below 60s (and player
    // was above 60s before), so scoring.js can award the achievement on win
    if (timerBefore >= 60 && timerSecs < 60 && timerSecs > 0) {
        window._hadPenaltyClutch = true;
    }

    // Show the penalty amount in the HUD as minutes:seconds, then clear it after 3 s
    const pi = document.getElementById('pen-info');
    const penMins = Math.floor(effectivePen / 60);
    const penSecs = effectivePen % 60;
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