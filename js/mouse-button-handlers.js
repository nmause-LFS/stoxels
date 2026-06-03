// Handles mouse interactions with the grid


let pval = 0;               // the value being painted during a drag stroke: 0 = erase, 1 = fill (left-click), 2 = mark-empty (right-click)

let mbtn = 0;               // which mouse button started the current stroke (0 = left, 2 = right)

let dragStartRow = -1;   // cell where the drag began
let dragStartCol = -1;
let dragAxis = null;     // 'row', 'col', or null (undecided)

let dragStrokeCount = 0;     // number of cells filled in the current left-click drag stroke





//------------------------------------------------------------------------
//--------------------------APPLY CELL------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// core logic that actually changes a cell's state.
// Called by cd() on click and by onHover() while dragging.

function ac(row, col) {

    // Significance Threshold: multi-pick mode intercepts left-clicks
    if (window._sigThreshArmed && (pval === 1 || mbtn === 0)) {
        _sigThreshPickFromCell(row, col);
        return;
    }

    // BAYESIAN: Trap Placement Intercept
    if (typeof _bayesTrapPlacementClick === 'function' && _bayesTrapPlacementClick(row, col)) {
        return;
    }



    if (activeAbilityMode) {
        if (pval === 1 || mbtn === 0) {
            executeActiveAbility(row, col); // class skill
        }
        return;
    }

    // Degrees of Freedom pick intercept — must be before any other fill logic
    if (window._dofSession && _dofHandleClick(row, col)) return;

    // No-op: cell already has the desired value
    if (userGrid[row][col] === pval) return;

    // Cannot mark/erase a correctly filled cell (right-click drag protection)
    if (mbtn === 2 && userGrid[row][col] === 1 && cur.grid[row][col] === 1) return;

    // Cannot erase a cell that was revealed by an item
    if (revealedGrid[row][col] && pval === 0) return;

    // Left-click fill: check against the solution
    if (mbtn === 0 && pval === 1) {
        if (cur.grid[row][col] !== 1) {
            // Significance Threshold: intercept before any penalty logic
            if (_sigThresholdIntercept(row, col)) {
                trackAchStat('sigThresholdIntercepts');
                return;
            }

            // BAYESIAN: Mistake Prevention Intercepts
            if (typeof _typeIShieldIntercept === 'function' && _typeIShieldIntercept(row, col)) return;
            if (typeof _bayesTrapProtectionIntercept === 'function' && _bayesTrapProtectionIntercept(row, col)) return;

            if (window._freezeActive) {
                // During freeze: mistake is cosmetically marked but costs zero time
                wrongGrid[row][col] = true;
                renderCell(row, col);
                showToast('❄️ Frozen! No penalty.');
                return;
            }
            if (shieldActive && !ptHasSkill('keystone_null_hypothesis') && !ptHasSkill('keystone_asymptotic_mastery')) {
                absorbedMistakes++;
                if ((window._shieldExtraCharges || 0) > 0) {
                    window._shieldExtraCharges--;
                } else {
                    shieldActive = false;
                }
                showToast(t('pen_shield'));
                return;
            }

            // Check whether a class passive (e.g. Mathmagician free mistakes) would
            // absorb this penalty entirely — if so, skip the hardcore kill too.
            const penMult = getClassPenaltyMultiplier();
            if (penMult === 0) {
                // Fully absorbed by class passive — mark wrong visually but no
                // time cost, no mistake count, and no hardcore game-over.
                wrongGrid[row][col] = true;
                renderCell(row, col);
                absorbedMistakes++;
                showToast(t('pen_shield'));
                return;
            }

            // confidence_interval (231-233): absorb the next mistake within the grace window
            if (_confidenceIntervalActive) {
                _confidenceIntervalActive = false;
                _confidenceIntervalUsed = true;          // ← prevent back-to-back
                absorbedMistakes++;
                questStat_confidenceIntervalIgnored();
                wrongGrid[row][col] = true;
                renderCell(row, col);
                consecutiveCorrectFills = 0;             // ← fix: also reset this streak
                _streakBonusFills = 0;
                showToast(`📐 ${LANG === 'de' ? 'Konfidenzintervall! Fehler ignoriert.' : 'Confidence Interval! Mistake ignored.'}`);
                return;
            }

            // Mark the cell wrong and apply the time penalty
            wrongGrid[row][col] = true;
            renderCell(row, col);   // show the red ✕ 
            Audio_Manager.playSFX('cellWrong');
            applyPenalty(row, col);        // deduct time, show flash
            consecutiveCorrectFills = 0; // sample_efficiency: streak broken by real mistake
            _streakBonusFills = 0;       // streak_bonus: streak broken by real mistake

            if (typeof PassiveTracker !== 'undefined') PassiveTracker.onMistake();

            // Instantly banish animals upon a real mistake 
            if (typeof clearActiveRandomWalkers === "function") {
                clearActiveRandomWalkers();
            }

            // confidence_interval (231-233): open a grace window after a real mistake
            if (ptHasSkill('confidence_interval_1') && !_confidenceIntervalUsed) {
                let windowSecs = 1;
                if (ptHasSkill('confidence_interval_2')) windowSecs++;
                if (ptHasSkill('confidence_interval_3')) windowSecs++;
                _confidenceIntervalActive = true;
                setTimeout(() => { _confidenceIntervalActive = false; }, windowSecs * 1000);
            } else {
                _confidenceIntervalUsed = false;  // ← reset the "just used" flag after skipping once
            }

            // Golden Clock: track remaining allowed mistakes
            if (window._goldenClockActive) {
                window._goldenClockMistakesLeft = (window._goldenClockMistakesLeft || 0) - 1;
                const mcEl = document.getElementById('mistake-counter');
                if (mcEl) mcEl.textContent = `✗ ${mistakeCount} 🕰️${window._goldenClockMistakesLeft}`;
                if (window._goldenClockMistakesLeft <= 0) {
                    window._goldenClockActive = false;
                    dead = true;
                    stopTimer();
                    window._lastFailedGi = cur.gIdx;
                    document.getElementById('lose-title').textContent = t('ov_lose');
                    document.getElementById('lose-sub').textContent =
                        `${LANG === 'de' ? 'Goldene Uhr: Fehlerlimit erreicht!' : 'Golden Clock: mistake limit reached!'}`;
                    document.getElementById('ov-lose').classList.add('show');
                    return;
                }
            }

            // Hardcore mode: one mistake = instant game over
            if (curMods.hardcore) {
                dead = true;
                stopTimer();

                // bounceback achievement: record this as a failed level
                window._lastFailedGi = cur.gIdx;

                document.getElementById('lose-title').textContent = t('hc_fail_title');
                document.getElementById('lose-sub').textContent = t('hc_fail_sub');
                document.getElementById('ov-lose').classList.add('show');
            }
            return;
        }
    }

    // Valid move: update the data, refresh the display, and check for a win
    // Lucky tile check: right-clicking to mark ✕ on an unspent lucky tile
    if (pval === 2 && luckyTiles && luckyTiles.has(`${row}-${col}`)) {
        luckyRewardClaimed++;
        trackAchStat('luckyTilesFound');
        Audio_Manager.playSFX('luckyTileActivate');
        luckyTiles.delete(`${row}-${col}`);

        const _wonItemId = pickLuckyItem();
        const _newItem = {
            uid: `item_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            defId: _wonItemId
        };
        STATE.inventory.push(_newItem);
        const _def = ITEM_DEFS[_newItem.defId];
        let toastMsg = `🍀 Lucky Tile! You found: ${_def.icon} ${itemName(_def)}`;

        // generous_fortune (192-194): chance to grant a second item
        const bonusChance = (ptHasSkill('generous_fortune_1') ? 0.10 : 0)
            + (ptHasSkill('generous_fortune_2') ? 0.15 : 0)
            + (ptHasSkill('generous_fortune_3') ? 0.25 : 0);
        if (bonusChance > 0 && Math.random() < bonusChance) {
            const _bonusItemId = pickLuckyItem();
            const _bonusItem = {
                uid: `item_${Date.now()}_${Math.random().toString(36).slice(2)}`,
                defId: _bonusItemId
            };
            STATE.inventory.push(_bonusItem);
            const _bonusDef = ITEM_DEFS[_bonusItem.defId];
            toastMsg += ` + ${_bonusDef.icon} ${itemName(_bonusDef)}`;
        }

        // keystone_variance_collapse (221): claiming a lucky tile costs −10 minutes
        if (ptHasSkill('keystone_variance_collapse')) {
            timerSecs = Math.max(0, timerSecs - 600);
            updTimer();
            toastMsg += ` ${LANG === 'de' ? '(−10 Min!)' : '(−10 min!)'}`;
        }

        save();
        buildInventoryPanel();
        showToast(toastMsg, 3500);

        // covariance_shift (261-263): reveal extra cells when a lucky tile is claimed
        // Node 1: reveal 1 cell from the same row or column
        // Node 2: reveal up to 2 cells from the same row or column
        // Node 3: reveal up to 3 cells from the same row or column
        if (!window._oracleActive && ptHasSkill('covariance_shift_1') && !ptHasSkill('keystone_ergodic_field')) {
            const _sol = cur.grid;
            const _cols = _sol[0].length, _rows = _sol.length;
            const _affected = [];

            const revealCount = ptHasSkill('covariance_shift_3') ? 3
                : ptHasSkill('covariance_shift_2') ? 2
                    : 1;

            // Build a combined pool of unrevealed correct cells from the same row and column
            const _pool = [];
            for (let _c = 0; _c < _cols; _c++)
                if (_sol[row][_c] === 1 && userGrid[row][_c] !== 1 && !revealedGrid[row][_c])
                    _pool.push([row, _c]);
            for (let _r = 0; _r < _rows; _r++)
                if (_r !== row && _sol[_r][col] === 1 && userGrid[_r][col] !== 1 && !revealedGrid[_r][col])
                    _pool.push([_r, col]);

            shuffle(_pool);
            _pool.slice(0, revealCount).forEach(([_r, _c]) => {
                revealedGrid[_r][_c] = true;
                userGrid[_r][_c] = 1;
                renderCell(_r, _c);
                updClues(_r, _c);
                _affected.push(`g-${_r}-${_c}`);
            });

            if (_affected.length > 0) {
                if (typeof _applyCellEffect === 'function') {
                    _applyCellEffect(_affected, 'reveal');
                    if (ptHasSkill('adjacency_matrix')) _adjacencyMatrixRefreshAll();
                }
                checkWin();
            }
        }
    }
    Audio_Manager.playSFX('cellMark');

    userGrid[row][col] = pval;
    if (pval === 1 && cur.grid[row][col] === 1) {
        if (STATE.questStats) STATE.questStats._ql_hasManuallyFilledCell = true;
        Audio_Manager.playSFX('cellFill');

        if (painting && mbtn === 0 && pval === 1) {
            dragStrokeCount++;
            if (dragStrokeCount > 1) {
                _dragCounterApply(row, col, dragStrokeCount);
            }
        }

        if (typeof feedDrifter === "function") feedDrifter();

        onCorrectFill(row, col); // class.js
        if (typeof PassiveTracker !== 'undefined') PassiveTracker.onCorrectFill();

        _binomialBurstOnCorrectFill();
        _gamblersRuinOnCorrectFill();
        _frequentistsBurdenOnCorrectFill();

        // sample_efficiency nodes: track consecutive correct fills
        if (ptHasSkill('sample_efficiency_1') && !ptHasSkill('keystone_ergodic_field')) {
            consecutiveCorrectFills++;
            let threshold = 20;
            if (ptHasSkill('sample_efficiency_2')) threshold -= 2;
            if (ptHasSkill('sample_efficiency_3')) threshold -= 3;
            if (consecutiveCorrectFills >= threshold) {
                consecutiveCorrectFills = 0;
                revealTiles(1);
                if (_getBayesianBonus() > 0 && Math.random() < _getBayesianBonus()) {
                    _resetBayesianBonus();
                    revealTiles(1);
                    questStat_sampleEfficiencyReveal();
                }

                showToast(`📈 ${LANG === 'de' ? 'Stichprobeneffizienz! 1 Zelle aufgedeckt.' : 'Sample Efficiency! 1 cell revealed.'}`);
                PassiveTracker.onSampleEffTrigger();
            }
        }

        // streak_bonus (243-245): gain time after 15 consecutive correct fills
        if (ptHasSkill('streak_bonus_1') && !ptHasSkill('keystone_gamblers_ruin')) {
            _streakBonusFills++;
            if (_streakBonusFills >= 15) {
                _streakBonusFills = 0;
                let bonus = 0;
                if (ptHasSkill('streak_bonus_1')) bonus += 15;
                if (ptHasSkill('streak_bonus_2')) bonus += 5;
                if (ptHasSkill('streak_bonus_3')) bonus += 10; 

                timerSecs += bonus;
                updTimer();
                showToast(`🔥 ${LANG === 'de' ? `Serienbonus! +${bonus}s` : `Streak Bonus! +${bonus}s`}`);
                PassiveTracker.onStreakBonusTrigger()
            }
        }
    }
    renderCell(row, col);
    updClues(row, col);
    checkWin();
}








//------------------------------------------------------------------------
//--------------------------CELL DOWN-------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Handles mousedown on a grid cell

function cd(e, row, col) {
    e.preventDefault();     // Prevents the context menu from appearing on right-click.
    if (dead) return;

    mbtn = e.button;        // 0 = left button, 2 = right button
    painting = true;

    dragStartRow = row;
    dragStartCol = col;
    dragAxis = null;   // reset — axis decided on first move
    dragStrokeCount = 0;


    // Decide what value to paint for the duration of this drag stroke
    if (mbtn === 0) {   // left-click: toggle fill / erase (but cannot fill revealed cells, so no toggle)
        pval = 1;
    } else {    // right-click: mark or erase (cannot mark revealed cells, so no toggle)
        // cannot mark/erase a correctly filled cell
        if (userGrid[row][col] === 1 && cur.grid[row][col] === 1) {
            painting = false;   // don't start a drag stroke either
            return;
        }
        if (userGrid[row][col] === 2 && SETTINGS.questionMark) {
            pval = 3; // red cross → yellow question mark (only if enabled)
        } else if (userGrid[row][col] === 2 && !SETTINGS.questionMark) {
            pval = 0; // red cross → empty (skip question mark)
        } else if (userGrid[row][col] === 3) {
            pval = 0; // yellow question mark → empty
        } else {
            pval = 2; // empty → red cross
        }
    }

    ac(row, col); // apply immediately to the cell that was clicked
}






//------------------------------------------------------------------------
//-------------------------STOP PAINTING----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function sp() {
    painting = false;
    dragStartRow = -1;
    dragStartCol = -1;
    dragAxis = null;
    _dragCounterClear();
    dragStrokeCount = 0;
}






//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------