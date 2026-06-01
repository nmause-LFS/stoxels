// Handles penalties for mistakes, including time deduction, visual feedback, and tracking mistake count for scoring and achievements.

function applyPenalty(row, col) {
    const penMult = getClassPenaltyMultiplier(); // class effect; 5.0 during Black Swan, 0 = absorbed

    // Shield absorbed — nothing happens (do NOT end Black Swan for a free hit)
    if (penMult === 0) {
        showToast(t('pen_shield'));
        return;
    }

    // If Black Swan is active, end it now — the penalty is landing
    if (window._blackSwanActive) {
        _endBlackSwan(false);
        showToast(LANG === 'de' ? '📉 SPEEDFORCE abgebrochen!' : '📉 SPEEDFORCE broken!');
    }


    // keystone_stochastic_resonance (265): 20% chance to reveal 1 correct cell instead of penalising.
    // Cannot trigger twice in a row (tracked via window._stochasticLastFired).
    if (ptHasSkill('keystone_stochastic_resonance') && !window._stochasticLastFired && Math.random() < 0.2) {
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

    // standard_deviation (node ID: 255-257):
    //   Node 1 only      → every 3 mistakes → 1 reveal
    //   Nodes 1+2        → every 2 mistakes → 1 reveal
    //   Nodes 1+2+3      → every 2 mistakes → 2 reveals
    if (ptHasSkill('standard_deviation_1')) {
        const hasNode2 = ptHasSkill('standard_deviation_2');
        const hasNode3 = ptHasSkill('standard_deviation_3');
        const threshold = hasNode2 ? 2 : 3;
        if (mistakeCount % threshold === 0) {
            const count = hasNode3 ? 2 : 1;
            revealTiles(count);
            if (_getBayesianBonus() > 0 && Math.random() < _getBayesianBonus()) {
                _resetBayesianBonus();
                revealTiles(1);
            }
            showToast(`📏 ${LANG === 'de' ? `Fehler-Feedback! ${count} Zelle(n) enthüllt.` : `Error Feedback! ${count} cell(s) revealed.`}`);
        }
    }

    // Pick the penalty for this mistake based on current difficulty and mistake count
    const pens = DIFF_CFG[curDiff].pens;
    const pen = pens[Math.min(mistakeCount - 1, pens.length - 1)];

    // keystone_asymptotic_mastery (266): each completed line permanently reduces future penalty by 5s
    const asymptoteReduction = (window._asymptoticLinesCompleted || 0) * 5;

    // Deduct penalty seconds and refresh the clock display
    const timerBefore = timerSecs;


    const overfitMult = _overfittingPenaltyMultiplier();
    const activeMult = (overfitMult !== null) ? overfitMult : penMult;
    const effectivePen = Math.max(0, Math.round(pen * activeMult) - asymptoteReduction);


    timerSecs = Math.max(0, timerSecs - effectivePen);
    updTimer();

    // Actuary: log this mistake for Regression to Prior
    if (effectivePen > 0) actuaryLogMistake(row, col, effectivePen);

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