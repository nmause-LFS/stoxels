// Handles mouse interactions with the grid


let pval = 0;               // the value being painted during a drag stroke: 0 = erase, 1 = fill (left-click), 2 = mark-empty (right-click)

let mbtn = 0;               // which mouse button started the current stroke (0 = left, 2 = right)







//------------------------------------------------------------------------
//--------------------------APPLY CELL------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// core logic that actually changes a cell's state.
// Called by cd() on click and by onHover() while dragging.

function ac(row, col) {

    if (activeAbilityMode) {
        if (pval === 1 || mbtn === 0) {
            executeActiveAbility(row, col); // class skill
        }
        return;
    }

    // No-op: cell already has the desired value
    if (userGrid[row][col] === pval) return;

    // Cannot erase a cell that was revealed by an item
    if (revealedGrid[row][col] && pval === 0) return;

    // Left-click fill: check against the solution
    if (mbtn === 0 && pval === 1) {
        if (cur.grid[row][col] !== 1) {
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
                absorbedMistakes++;
                wrongGrid[row][col] = true;
                renderCell(row, col);
                _streakBonusFills = 0; // streak resets even on an absorbed mistake
                showToast(`📐 ${LANG === 'de' ? 'Konfidenzintervall! Fehler ignoriert.' : 'Confidence Interval! Mistake ignored.'}`);
                return;
            }

            // Mark the cell wrong and apply the time penalty
            wrongGrid[row][col] = true;
            renderCell(row, col);   // show the red ✕ 
            applyPenalty();         // deduct time, show flash
            consecutiveCorrectFills = 0; // sample_efficiency: streak broken by real mistake
            _streakBonusFills = 0;       // streak_bonus: streak broken by real mistake

            // confidence_interval (231-233): open a grace window after a real mistake
            if (ptHasSkill('confidence_interval_1')) {
                let windowSecs = 1;
                if (ptHasSkill('confidence_interval_2')) windowSecs++;
                if (ptHasSkill('confidence_interval_3')) windowSecs++;
                _confidenceIntervalActive = true;
                setTimeout(() => { _confidenceIntervalActive = false; }, windowSecs * 1000);
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
    if (pval === 2 && !luckyRewardClaimed && luckyTiles && luckyTiles.has(`${row}-${col}`)) {
        luckyRewardClaimed = true;
        trackAchStat('luckyTilesFound');
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
        if (ptHasSkill('covariance_shift_1') || ptHasSkill('covariance_shift_2') || ptHasSkill('covariance_shift_3')) {
            const _sol = cur.grid;
            const _cols = _sol[0].length, _rows = _sol.length;
            const _affected = [];

            // Nodes 1 & 2: reveal 1 cell in the same row per node
            const rowRevealCount = (ptHasSkill('covariance_shift_1') ? 1 : 0)
                + (ptHasSkill('covariance_shift_2') ? 1 : 0);
            const _rowCands = [];
            for (let _c = 0; _c < _cols; _c++)
                if (_sol[row][_c] === 1 && userGrid[row][_c] !== 1 && !revealedGrid[row][_c])
                    _rowCands.push(_c);
            shuffle(_rowCands);
            _rowCands.slice(0, rowRevealCount).forEach(_c => {
                revealedGrid[row][_c] = true;
                userGrid[row][_c] = 1;
                renderCell(row, _c);
                updClues(row, _c);
                _affected.push(`g-${row}-${_c}`);
            });

            // Node 3: also reveal 1 cell in the same column
            if (ptHasSkill('covariance_shift_3')) {
                const _colCands = [];
                for (let _r = 0; _r < _rows; _r++)
                    if (_sol[_r][col] === 1 && userGrid[_r][col] !== 1 && !revealedGrid[_r][col])
                        _colCands.push(_r);
                shuffle(_colCands);
                if (_colCands.length > 0) {
                    const _r = _colCands[0];
                    revealedGrid[_r][col] = true;
                    userGrid[_r][col] = 1;
                    renderCell(_r, col);
                    updClues(_r, col);
                    _affected.push(`g-${_r}-${col}`);
                }
            }

            if (_affected.length > 0) {
                if (typeof _applyCellEffect === 'function') _applyCellEffect(_affected, 'reveal');
                checkWin();
            }
        }
    }


    userGrid[row][col] = pval;
    if (pval === 1 && cur.grid[row][col] === 1) {
        onCorrectFill(row, col); // class.js

        _binomialBurstOnCorrectFill();
        _gamblersRuinOnCorrectFill();
        _frequentistsBurdenOnCorrectFill();

        // sample_efficiency (222-224): track consecutive correct fills
        if (ptHasSkill('sample_efficiency_1')) {
            consecutiveCorrectFills++;
            let threshold = 20;
            if (ptHasSkill('sample_efficiency_2')) threshold -= 2;
            if (ptHasSkill('sample_efficiency_3')) threshold -= 3;
            if (consecutiveCorrectFills >= threshold) {
                consecutiveCorrectFills = 0;
                revealTiles(1);
                showToast(`📈 ${LANG === 'de' ? 'Stichprobeneffizienz! 1 Zelle aufgedeckt.' : 'Sample Efficiency! 1 cell revealed.'}`);
            }
        }

        // streak_bonus (243-245): gain time after 15 consecutive correct fills
        if (ptHasSkill('streak_bonus_1')) {
            _streakBonusFills++;
            if (_streakBonusFills >= 15) {
                _streakBonusFills = 0;
                let bonus = 0;
                if (ptHasSkill('streak_bonus_1')) bonus += 30;
                if (ptHasSkill('streak_bonus_2')) bonus += 30;
                if (ptHasSkill('streak_bonus_3')) bonus += 45; // node 3 replaces the flat 30 of its own tier
                // Node 3 desc says "+45s", nodes 1 and 2 say "+30s" each.
                // With all 3: 30 + 30 + 45 = 105s total.
                timerSecs += bonus;
                updTimer();
                showToast(`🔥 ${LANG === 'de' ? `Serienbonus! +${bonus}s` : `Streak Bonus! +${bonus}s`}`);
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

    // Decide what value to paint for the duration of this drag stroke
    if (mbtn === 0) {   // left-click: toggle fill / erase (but cannot fill revealed cells, so no toggle)
        pval = userGrid[row][col] === 1 ? 0 : 1; // left: fill or erase
    } else {    // right-click: mark or erase (cannot mark revealed cells, so no toggle)
        if (userGrid[row][col] === 2) {
            pval = 3; // red cross gets switched to yellow question mark
        } else if (userGrid[row][col] === 3) {
            pval = 0; // yellow question mark gets switched to empty
        } else {
            pval = 2; // empty gets switched to red cross
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
}






//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------