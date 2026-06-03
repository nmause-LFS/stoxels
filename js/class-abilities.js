let correctFillStreak = 0;
let nextPenaltyHalved = false;



//------------------------------------------------------------------------
//---------------------------SHARED HELPERS-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// _resolveCell — reveals a filled solution cell or marks an empty one.
//   Returns the cell id string if the cell was actually changed, otherwise null.
function _resolveCell(r, c, sol) {
    if (sol[r][c] === 1) {
        if (!revealedGrid[r][c] && userGrid[r][c] !== 1) {
            revealedGrid[r][c] = true;
            userGrid[r][c] = 1;
            renderCell(r, c);
            updClues(r, c);
            return `g-${r}-${c}`;
        }
    } else {
        if (userGrid[r][c] === 0) {
            userGrid[r][c] = 2;
            renderCell(r, c);
            return `g-${r}-${c}`;
        }
    }
    return null;
}


// _revealFilledCell — reveals a filled solution cell only. Never marks empty cells.
// Used by Diagonal Strike when the 'diagonally_wrong' node is not active.
function _revealFilledCell(r, c, sol) {
    if (sol[r][c] === 1) {
        if (!revealedGrid[r][c] && userGrid[r][c] !== 1) {
            revealedGrid[r][c] = true;
            userGrid[r][c] = 1;
            renderCell(r, c);
            updClues(r, c);
            return `g-${r}-${c}`;
        }
    }
    return null;
}


// _filterRevealedIds — returns only the ids that correspond to filled solution cells.
function _filterRevealedIds(ids, sol) {
    return ids.filter(id => {
        const [, r, c] = id.split('-').map(Number);
        return sol[r][c] === 1;
    });
}

// _filterMarkedIds — returns only the ids that correspond to empty solution cells.
function _filterMarkedIds(ids, sol) {
    return ids.filter(id => {
        const [, r, c] = id.split('-').map(Number);
        return sol[r][c] === 0;
    });
}

// _getActiveAbilityData — resolves the level index and effect for the given ability slot.
function _getActiveAbilityData(def, activeKey) {
    const level = activeKey === 'active1'
        ? (STATE.classActive1Level || 1)
        : (STATE.classActive2Level || 1);
    return def[activeKey].levels[level - 1];
}

// _getPassiveEffect — resolves the current passive effect for the active class.
function _getPassiveEffect() {
    const def = CLASS_DEFS[STATE.playerClass];
    const passLv = STATE.classPassiveLevel || 1;
    return def.passive.levels[passLv - 1].effect;
}

// _setAbilityMode — arms or disarms activeAbilityMode and updates the puzzle cursor.
function _setAbilityMode(armed) {
    activeAbilityMode = armed;
    const wrap = document.getElementById('puzzle-scaler-wrap');
    if (wrap) wrap.style.cursor = armed ? 'crosshair' : '';
}






//------------------------------------------------------------------------
//---------------ACTIVE ABILITY TOGGLE & EXECUTION------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// toggleActiveAbility — arms or disarms the active ability.
//   slot: 'active1' or 'active2' — which ability to arm.
//   When armed, clicking a grid cell triggers executeActiveAbility().
//   Some abilities are "instant" and fire immediately without needing a cell click.
function toggleActiveAbility(slot) {
    if (isClassless()) return;
    const newSlot = slot || 'active1';
    const cd = cooldownState[newSlot];

    if (dead || cd.remaining > 0) return;

    // If clicking the already-armed slot, cancel it
    const isAlreadyArmed = activeAbilityMode && STATE.classActiveChoice === newSlot;
    if (isAlreadyArmed) {
        _setAbilityMode(false);
        buildClassHUD();
        return;
    }

    // Check if this ability fires instantly (no cell click needed)
    if (_isInstantAbility(newSlot)) {
        STATE.classActiveChoice = newSlot;
        _fireInstantAbility(newSlot);
        return;
    }

    // Normal arm-then-click flow
    STATE.classActiveChoice = newSlot;
    _setAbilityMode(true);
    _showAbilityArmToast(newSlot);
    buildClassHUD();
}

// _isInstantAbility — returns true for abilities that fire on button press,
//   not on a subsequent cell click. Currently: Black Swan (active4 for Outlier).

function _isInstantAbility(slot) {

    if (STATE.playerClass === 'probabilist' && slot === 'active2') return true;   // Field Scan
    if (STATE.playerClass === 'statistician' && slot === 'active1') return true;  // Data Strike
    if (STATE.playerClass === 'mathmagician' && slot === 'active2') return true;  // Freeze

    if (STATE.playerAscendency === 'actuary') {
        if (slot === 'active3') return true; // Regression to Prior — instant
        if (slot === 'active4') return true; // Significance Threshold — instant (shows picker immediately)
    }
    if (STATE.playerAscendency === 'markovian') {
        if (slot === 'active3') return true; // State Rollback — instant (no cell click)
        if (slot === 'active4') return true; // Transition Matrix — instant
    }

    if (STATE.playerAscendency === 'bayesian') {
        if (slot === 'active3') return true; // Bayes Traps (Opens UI immediately)
        if (slot === 'active4') return true; // Type I Error Shield (Auto-seeds immediately)
    }

    if (STATE.playerAscendency === 'outlier' && slot === 'active3') return true; // Tail Risk — instant
    if (slot !== 'active4') return false;
    return STATE.playerAscendency === 'outlier' || STATE.playerAscendency === 'recursionist';
}



// _fireInstantAbility — executes the ability immediately and starts its cooldown.

function _fireInstantAbility(slot) {
    if (slot === 'active1' || slot === 'active2') {
        // Handle base class skills (like Field Scan)
        const def = CLASS_DEFS[STATE.playerClass];
        if (!def) return;

        const actData = _getActiveAbilityData(def, slot);
        const effect = actData.effect;

        // Dispatch the base ability. (0, 0 coords are ignored by _executeFieldScan anyway)
        _dispatchActiveAbility(slot, STATE.playerClass, 0, 0, effect);

        const cdSeconds = getEffectiveCooldown(slot, def[slot].cooldownSeconds);
        startSlotCooldown(slot, cdSeconds);
    } else {
        // Handle ascendency skills
        const asc = STATE.playerAscendency ? ASCENDENCY_DEFS[STATE.playerAscendency] : null;
        if (!asc) return;

        const ascSlot = slot === 'active3' ? 'active1' : 'active2';
        const skillLv = ascSlot === 'active1'
            ? (STATE.ascendencySkill1Level || 1)
            : (STATE.ascendencySkill2Level || 1);
        const actData = asc[ascSlot].levels[skillLv - 1];
        const effect = actData.effect;

        _dispatchAscendencyAbility(slot, STATE.playerAscendency, 0, 0, effect);

        const cdSeconds = getEffectiveCooldown(slot, asc[ascSlot].cooldownSeconds);
        startSlotCooldown(slot, cdSeconds);
    }

    buildClassHUD();
}





// _showAbilityArmToast — shows the cursor hint toast for the given ability slot.

function _showAbilityArmToast(slot) {
    let activeData = null;
    if (slot === 'active3' || slot === 'active4') {
        const asc = STATE.playerAscendency ? ASCENDENCY_DEFS[STATE.playerAscendency] : null;
        if (!asc) return;
        activeData = slot === 'active3' ? asc.active1 : asc.active2;
    } else {
        const def = CLASS_DEFS[STATE.playerClass];
        if (!def) return;
        activeData = def[slot];
    }
    if (!activeData) return;
    const msg = LANG === 'de' ? (activeData.descCursorDE || activeData.descCursorEn) : activeData.descCursorEn;
    showToast(`🎯 ${msg}`);
}



// executeActiveAbility — called when the player clicks a grid cell
//   while activeAbilityMode is true. Dispatches to the correct class ability.
function executeActiveAbility(row, col) {
    if (!activeAbilityMode || !STATE.playerClass || dead) return;
    if (isClassless()) { _setAbilityMode(false); return; }

    const activeKey = STATE.classActiveChoice || 'active1';

    if (activeKey === 'active3' || activeKey === 'active4') {
        // Ascendency skill
        const asc = STATE.playerAscendency ? ASCENDENCY_DEFS[STATE.playerAscendency] : null;
        if (!asc) return;
        const ascSlot = activeKey === 'active3' ? 'active1' : 'active2';
        const skillLv = ascSlot === 'active1'
            ? (STATE.ascendencySkill1Level || 1)
            : (STATE.ascendencySkill2Level || 1);
        const actData = asc[ascSlot].levels[skillLv - 1];
        const effect = actData.effect;

        // Route and fire the ability
        _dispatchAscendencyAbility(activeKey, STATE.playerAscendency, row, col, effect);

        // Recursionist Residual special case: placing totems doesn't start cooldown until max totems are placed, so keep the mode active and skip starting cooldown for now
        if (STATE.playerAscendency === 'recursionist' && ascSlot === 'active1') {
            const maxTotemsAllowed = effect.maxTotems || 1;
            const currentTotems = (window._residualTotems || []).length;

            if (currentTotems >= maxTotemsAllowed) {
                // At maximum capacity: finalize deployment and begin cooldown
                _setAbilityMode(false);
                const cdSeconds = getEffectiveCooldown(activeKey, asc[ascSlot].cooldownSeconds);
                startSlotCooldown(activeKey, cdSeconds);
                showToast('💀 All active totems deployed.');
            } else {
                // Keep selection mode active and bypass starting the cooldown
                const remaining = maxTotemsAllowed - currentTotems;
                showToast(`💀 Totem placed! Click another mistake cell to place another. (${remaining} left)`);
            }
        } else {
            // Default behavior for all other standard targeted ascendency skills
            _setAbilityMode(false);
            const cdSeconds = getEffectiveCooldown(activeKey, asc[ascSlot].cooldownSeconds);
            startSlotCooldown(activeKey, cdSeconds);
        }
    } else {
        // Base class skill behavior (remains completely unchanged)
        _setAbilityMode(false);
        const def = CLASS_DEFS[STATE.playerClass];
        const actData = _getActiveAbilityData(def, activeKey);
        const effect = actData.effect;

        _dispatchActiveAbility(activeKey, STATE.playerClass, row, col, effect);

        const cdSeconds = getEffectiveCooldown(activeKey, def[activeKey].cooldownSeconds);
        startSlotCooldown(activeKey, cdSeconds);
    }

    buildClassHUD();
}



// _dispatchActiveAbility — routes to the correct ability function and tracks achievement stats.
function _dispatchActiveAbility(activeKey, playerClass, row, col, effect) {
    if (activeKey === 'active1') {
        switch (playerClass) {
            case 'mathmagician':
                _executeArcaneReveal(row, col, effect.radius, effect.maxReveals );
                trackAchStat('skillArcaneRevealUsed');
                break;
            case 'statistician':
                _executeDataStrike(effect.solveCount, effect.revealCap || 5);
                trackAchStat('skillDataStrikeUsed');
                break;
            case 'probabilist':                            
                _executePrecisionMark(row, col, effect.extraLines || 0);
                trackAchStat('skillPrecisionMarkUsed');
                break;
        }
        updateQuestStats('classAbilityUsed', {});
    } else {
        switch (playerClass) {
            case 'mathmagician':
                _executeArcaneFreeze(effect.freezeDuration);
                trackAchStat('skillAbsoluteZeroUsed');
                break;
            case 'statistician':
                _executeDiagonalStrike(row, col, effect.diagonals);
                trackAchStat('skillDiagonalStrikeUsed');
                break;
            case 'probabilist':
                _executeFieldScan(effect.scanSize, effect.scanDuration);
                trackAchStat('skillFieldScanUsed');
                break;
        }
        updateQuestStats('classAbilityUsed', {});
    }
}


// _dispatchAscendencyAbility — routes to the correct ascendency ability function.
// Skill implementations are stubs for now; effects will be filled in later.
function _dispatchAscendencyAbility(hudSlot, ascendency, row, col, effect) {
    const ascSlot = hudSlot === 'active3' ? 'active1' : 'active2';

    updateQuestStats('classAbilityUsed', {});

    switch (ascendency) {
        case 'outlier':
            if (ascSlot === 'active1') {
                _executeTailRisk(effect.secondsPerCell, effect.maxCells);
                trackAchStat('skillAscendencyUsed');
            } else {
                _executeBlackSwan(effect.duration);
                trackAchStat('skillAscendencyUsed');
            }
            break;
        case 'actuary':
            if (ascSlot === 'active1') {
                _executeRegressionToPrior(effect.correctCount, effect.recoverPct)
                trackAchStat('skillAscendencyUsed');
            } else {
                _executeSignificanceThreshold(effect.protectCount, effect.bonusReveal)
                trackAchStat('skillAscendencyUsed');
            }
            break;
        case 'recursionist':
            if (ascSlot === 'active1') {
                _executeResidual(row, col, effect);
                trackAchStat('skillAscendencyUsed');
            } else {
                _executeDegreesOfFreedom(row, col, effect);
                trackAchStat('skillAscendencyUsed');
            }
            break;
        case 'markovian':
            if (ascSlot === 'active1') {
                _executeStateRollback(effect.windowSeconds, effect.rewindSeconds, effect.clearOldMistakes);
                trackAchStat('skillAscendencyUsed');
            } else {
                _executeTransitionMatrix(effect.duration, effect.cascadeChance, effect.maxDepth);
                trackAchStat('skillAscendencyUsed');
            }
            break;
        case 'bayesian':
            if (ascSlot === 'active1') {
                _executeBayesTraps(effect.trapCount, effect.availableTraps);
                trackAchStat('skillAscendencyUsed');
            } else {
                _executeTypeIShield(effect.seedCount, effect.bonusReveal);
                trackAchStat('skillAscendencyUsed');
            }
            break;
        // 
        case 'random_walker':
            if (ascSlot === 'active1') {
                _executeBrownianMotion(row, col, effect.paths, effect.rank);
                trackAchStat('skillAscendencyUsed');
            } else {
                _executeSummonDrifter(effect.duration, effect.interval, effect.smartTarget, effect.finalHowl);
                trackAchStat('skillAscendencyUsed');
            }
            break;
    }
}



















//------------------------------------------------------------------------
//---------------------------CLASS PASSIVES-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------




// _bayesianRevealOneCell — reveals 1 random unrevealed filled cell at level start.
// Used by confirmed_hypothesis and god_of_probabilities.
function _bayesianRevealOneCell() {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const candidates = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 1 && !revealedGrid[r][c] && userGrid[r][c] !== 1) {
                candidates.push([r, c]);
            }
        }
    }

    if (!candidates.length) return;
    const [r, c] = candidates[Math.floor(Math.random() * candidates.length)];
    revealedGrid[r][c] = true;
    userGrid[r][c] = 1;
    renderCell(r, c);
    updClues(r, c);
    trackAchStat('tilesRevealed', 1);

    // Play the confirmed-hypothesis reveal effect
    if (typeof _playBayesianRevealEffect === 'function') {
        const cellEl = document.getElementById(`g-${r}-${c}`);
        if (cellEl) _playBayesianRevealEffect(cellEl);
    }
}






// applyClassPassiveOnLevelStart — called at the start of each level
//   to apply the passive effect before play begins.
function applyClassPassiveOnLevelStart() {
    correctFillStreak = 0;
    updateMomentumBar(0, 15);
    nextPenaltyHalved = false;
    window._momentumThisLevel = 0;
    window._dataStrikeUsesThisLevel = 0;
    window._veiled_cursedUsed = false;
    window._goldenClockActive = false;
    window._goldenClockMistakesLeft = null;
    window._cursedImmune = false;
    window._shieldExtraCharges = 0;

    window._bayesTrapsState = null;
    window._typeIShieldedCells = new Set();
    window._typeIBonusReveal = false;
    window._bayesTrapProtectedLines = new Set();

    if (typeof resetRecursionistState === 'function') resetRecursionistState();
    if (typeof resetMarkovianState === 'function') resetMarkovianState();

    if (!STATE.playerClass || isClassless()) return;
    const effect = _getPassiveEffect();

    if (STATE.playerClass === 'mathmagician') {
        let freeMistakes = effect.freeMistakes || 0;
        if (ptHasSkill('reinforced_shield')) freeMistakes += 1;
        if (ptHasSkill('fortified_shield')) freeMistakes += 1;
        window._classFreeMistakes = freeMistakes;
    }

    if (STATE.playerClass === 'probabilist' && effect.autoMarkCount) {
        setTimeout(() => {
            let markCount = effect.autoMarkCount;
            if (ptHasSkill('prior_knowledge')) markCount += 1;
            if (ptHasSkill('updated_beliefs')) markCount += 1;
            if (ptHasSkill('posterior_insight')) markCount += 1;
            if (ptHasSkill('convergent_evidence')) markCount += 1;

            // Snapshot which cells are marked BEFORE and AFTER so we know what changed
            const markedBefore = new Set();
            if (cur) {
                const sol = cur.grid;
                for (let r = 0; r < sol.length; r++)
                    for (let c = 0; c < sol[0].length; c++)
                        if (userGrid[r][c] === 2) markedBefore.add(`g-${r}-${c}`);
            }

            markWrongTiles(markCount);
            Audio_Manager.playSFX('bayesianInsight');
            trackAchStat('bayesianInsightUsed');

            // Collect newly-marked cell ids for the animation
            const newlyMarked = [];
            if (cur) {
                const sol = cur.grid;
                for (let r = 0; r < sol.length; r++)
                    for (let c = 0; c < sol[0].length; c++)
                        if (userGrid[r][c] === 2 && !markedBefore.has(`g-${r}-${c}`))
                            newlyMarked.push(`g-${r}-${c}`);
            }

            if (typeof _playBayesianInsightAnimation === 'function') {
                _playBayesianInsightAnimation(newlyMarked);
            }

            // confirmed_hypothesis and god_of_probabilities each reveal 1 correct filled cell
            let bonusReveals = 0;
            if (ptHasSkill('confirmed_hypothesis')) bonusReveals += 1;
            if (ptHasSkill('god_of_probabilities')) bonusReveals += 1;
            for (let i = 0; i < bonusReveals; i++) {
                _bayesianRevealOneCell();
            }
        }, 300);
    }
}

// getClassPenaltyMultiplier — returns the penalty time multiplier for this mistake.
//   Called from applyPenalty() in input.js.
//   Returns 0.0 if the Mathmagician has free mistakes remaining (no penalty).
function getClassPenaltyMultiplier() {
    if (!STATE.playerClass || isClassless()) return 1.0;

    // Black Swan active mistake modifier
    if (window._blackSwanActive) {
        _endBlackSwan(false); // Ends unnatural
        showToast(LANG === 'de' ? '📉 SPEEDFORCE abgebrochen!' : '📉 SPEEDFORCE broken!');
        return 5.0;
    }


    if (STATE.playerClass === 'mathmagician' && window._classFreeMistakes > 0) {
        window._classFreeMistakes--;
        absorbedMistakes++;
        buildClassHUD();
        Audio_Manager.playSFX('varianceShield');
        trackAchStat('mistakesAbsorbed');

        // Bonus time for absorbed mistakes
        let bonus = 0;
        if (ptHasSkill('calculated_error') && Math.random() < 0.50) bonus += 120;
        if (ptHasSkill('error_dividend') && Math.random() < 0.25) bonus += 30;
        if (ptHasSkill('lucky_lapse') && Math.random() < 0.25) bonus += 30;

        // god_of_math doubles the absorbed-mistake timer bonuses
        if (ptHasSkill('god_of_math') && bonus > 0) bonus *= 2;

        if (bonus > 0) {
            timerSecs = Math.min(timerSecs + bonus, 3600);
            updTimer();
            showToast(`🔮 Absorbed! +${bonus}s`);
            trackAchStat('timeAdded', bonus);
        }

        return 0.0;
    }

    return 1.0;
}

// onCorrectFill — called from ac() in mouse-button-handlers.js when a correct cell is filled.
//   Tracks the Statistician fill streak and awards bonus time on threshold.
function onCorrectFill(row, col) {
    // Transition Matrix cascade runs for any class
    if (window._transitionMatrixActive && typeof _transitionMatrixCascade === 'function') {
        const tm = window._transitionMatrixActive;
        if (Date.now() <= tm.endTime) {
            _transitionMatrixCascade(row, col, tm.maxDepth);
        } else {
            _clearTransitionMatrix(true);
        }
    }

    // frozen_resilience: every 5 correct fills during Absolute Zero → +1 free mistake
    // god_of_math: each correct fill during AZ reduces Arcane Reveal cooldown by 1s
    if (STATE.playerClass === 'mathmagician' && window._freezeActive) {
        if (ptHasSkill('frozen_resilience')) {
            window._freezeCorrFills = (window._freezeCorrFills || 0) + 1;
            if (window._freezeCorrFills % 5 === 0) {
                window._classFreeMistakes = (window._classFreeMistakes || 0) + 1;
                showToast('🔮 Frozen Resilience! +1 shield charge!');
            }
        }
        if (ptHasSkill('god_of_math')) {
            const cd = cooldownState['active1'];
            if (cd.remaining > 0) {
                cd.remaining = Math.max(0, cd.remaining - 1);
                _patchCooldownButton('active1');
            }
        }
    }


    // momentum_of_certainty: +20s if this fill is in the Precision Mark window
    if (ptHasSkill('momentum_of_certainty') && window._pmMomentumActive && window._pmMomentumSet) {
        const id = `g-${row}-${col}`;
        if (window._pmMomentumSet.has(id)) {
            window._pmMomentumSet.delete(id); // don't double-count the same cell
            timerSecs = Math.min(timerSecs + 20, 3600);
            updTimer();
            showToast(LANG === 'de' ? '🎯 Schwung der Gewissheit! +20 s!' : '🎯 Momentum of Certainty! +20 s!');
            trackAchStat('timeAdded', 20);
            if (window._pmMomentumSet.size === 0) { // auto-close when all cells are filled
                window._pmMomentumActive = false;
                window._pmMomentumSet = null;
            }
        }
    }

    if (STATE.playerClass !== 'statistician' || isClassless()) return;
    const effect = _getPassiveEffect();



    if (window._blackSwanActive) {
        // Black Swan triggers Momentum on EVERY correct fill
        _statisticianTriggerMomentum(effect.bonusSeconds);
        updateMomentumBar(correctFillStreak, effect.streakForBonus);
    } else {
        correctFillStreak++;
        if (correctFillStreak >= effect.streakForBonus) {
            _statisticianTriggerMomentum(effect.bonusSeconds);
            // streak was reset to 0 inside triggerMomentum — bar will be called by onMistake-style reset below
        } else {
            updateMomentumBar(correctFillStreak, effect.streakForBonus);
        }
    }

}



// onMistake — called on any wrong fill.
// Resets or reduces the Statistician streak depending on passive tree nodes.
// AFTER
function onMistake() {
    if (STATE.playerClass === 'statistician' && !isClassless()) {
        const effect = _getPassiveEffect();
        const threshold = effect.streakForBonus || 15;
        const hasLFM = ptHasSkill('learning_from_mistakes');
        const hasMNM = ptHasSkill('mistakes_no_matter');

        if (hasLFM || hasMNM) {
            // Both together: -10. Either alone: -12.
            const reduction = (hasLFM && hasMNM) ? 10 : 12;
            correctFillStreak = Math.max(0, correctFillStreak - reduction);
            updateMomentumBar(correctFillStreak, threshold);
            return;
        }

        correctFillStreak = 0;
        updateMomentumBar(0, threshold);
        return;
    }
    correctFillStreak = 0;
}





//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------