// Track current points during the active level


let currentRunScore = 0;        // currentRunScore tracks the points earned during the current run, including the base score for completing the level and any bonuses from objectives met; 
                                // it is calculated in checkWin() when a level is completed and displayed on the win overlay,
                                // and is used to determine how many points to award to the player based on their previous best score for that level



//------------------------------------------------------------------------
//-------------CHECK IF PUZZLE IS SOLVED----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns true if the player's current grid state matches the solution exactly.
function isPuzzleSolved() {
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
            const effective = userGrid[r][c] === 1 || revealedGrid[r][c];
            if (effective !== (sol[r][c] === 1)) return false;
        }
    return true;
}




//------------------------------------------------------------------------
//----------------------SCORE CALCULATION---------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function calculateScore(rows, cols, elapsed) {
    const gi = cur.gIdx;
    const baseScore = 100 + (rows + cols) * 2;
    const cappedTime = Math.min(timerSecs, 3600);
    const timeBonus = Math.floor(cappedTime / 10);
    const mistakePenalty = mistakeCount * 20;
    const rawScore = Math.max(10, baseScore + timeBonus - mistakePenalty);
    const mult = scoreMultiplier();
    const pts = Math.round(rawScore * mult);

    const hs = STATE.levelHS[gi];
    const prevBest = hs ? hs.score : 0;
    const ptsAwarded = Math.max(0, pts - prevBest);

    STATE.totalScore += ptsAwarded;

    if (!hs || pts > hs.score) {
        STATE.levelHS[gi] = { score: pts, diff: curDiff, time: timerSecs, mods: { ...curMods } };
    }

    return { pts, ptsAwarded, prevBest, mult };
}





//------------------------------------------------------------------------
//--------------------BONUS REQUIREMENT EVALUATION------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Evaluates whether the current level's bonus objective was met.
function evaluateBonusObjective(elapsed) {
    const bt = cur.bonusType || 'nomiss';
    const bp = cur.bonusParam !== undefined ? cur.bonusParam : 0;

    if (bt === 'fast') return elapsed <= bp;
    if (bt === 'nomiss') return mistakeCount === 0;
    if (bt === 'lowmiss') return mistakeCount <= bp;
    if (bt === 'noitem') return itemsUsedThisLevel === 0;
    if (bt === 'quiz') return true;
    if (bt === 'combo') return elapsed <= bp && mistakeCount === 0;
    if (bt === 'noitem_nomiss') return itemsUsedThisLevel === 0 && mistakeCount === 0;
    if (bt === 'noitem_fast') return itemsUsedThisLevel === 0 && elapsed <= bp;
    return false;
}






//------------------------------------------------------------------------
//---------------------ACHIEVEMENT HOOKS----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Fires achievement hooks and resets per-level flags.
function fireAchievements({ gi, rows, cols, elapsed, pts, ptsAwarded, prevBest, mult, isFirstClear }) {
    const sol = cur.grid;
    const totalCells = rows * cols;
    let cellsFilled = 0;
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (sol[r][c] === 1) cellsFilled++;

    // Scan the player grid for cross-marks
    let tilesMarked = 0;
    if (userGrid) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (userGrid[r][c] === 2) {
                    tilesMarked++;
                }
            }
        }
    }


    onLevelCompleteAch({
        mistakes: mistakeCount,
        itemsUsed: itemsUsedThisLevel,
        diff: curDiff,
        mods: curMods,
        playerClass: STATE.playerClass || null,
        playerAscendency: STATE.playerAscendency || null,
        absorbedMistakes: absorbedMistakes,
        absorbedThisLevel: absorbedMistakes,
        cellsFilled,
        tilesMarked,
        totalCells,
        rows,
        cols,
        scoreEarned: pts,
        world: cur.world,
        gi,
        elapsed,
        timerSecs,
        pts,
        prevBest,
        mult,
        isFirstClear,
        hadPenaltyClutch: !!window._hadPenaltyClutch,
        isBouncebackWin: window._lastFailedGi === gi,
    });

    window._hadPenaltyClutch = false;
    window._lastFailedGi = null;
    checkWorldCompleteAch();
}





//------------------------------------------------------------------------
//----------CONVERGENCE AND ASCENSION REWARDS-----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Handles convergence and ascension one-time rewards.
function handleSpecialRewards({ gi, isFirstClear, isAscensionLevel, irz }) {
    const worldData = WORLDS[cur.world - 1];

    // Convergence: passive tree point at 33% and 66% milestones
    const c1 = Math.floor((worldData.data.length - 1) / 3);
    const c2 = Math.floor((worldData.data.length - 1) * 2 / 3);
    const currentIdx = cur.li - 1;
    const isConvergenceLevel = worldData.data.length > 2 &&
        (currentIdx === c1 || currentIdx === c2) &&
        !isAscensionLevel;

    if (isConvergenceLevel && isFirstClear) {
        if (!STATE.convergenceDone) STATE.convergenceDone = [];
        STATE.convergenceDone.push(gi);
        STATE.passiveTreePoints = (STATE.passiveTreePoints || 0) + 1;        // Grant Passive tree Points, in total players should get 26 from convergence and 26 from quests
        save();
        window._pendingConvergenceModal = true;
    }

    // Ascension: Codex of Completion on first clear of the last world level
    if (isAscensionLevel && isFirstClear && !curMods.ironman) {
        const defId = 'artifactComplete';
        const codexDef = ITEM_DEFS['artifactComplete'];

        /*
        
        // Testing purpose code:
        for (let i = 0; i < 100; i++) {
            STATE.inventory.push({
                defId: 'artifactComplete',
                uid: `item_${Date.now()}_${i}_${Math.random().toString(36).slice(2)}`
            });
        }

        */

        // Non - testing code code:

        STATE.inventory.push({ defId: 'artifactComplete', uid: `item_${Date.now()}_${Math.random().toString(36).slice(2)}` });




        save();
        const rc = rarityColors(codexDef.rarity);
        irz.innerHTML = `<div class="item-reward" data-reward-defid="${defId}" style="border-color:${rc.border};color:${rc.color};cursor:default;">
            🌟 ${LANG === 'de' ? 'Aufstiegsbonus' : 'Ascension Reward'}: ${codexDef.icon} <strong>${itemName(codexDef)}</strong>
        </div>`;
    }
}







//------------------------------------------------------------------------
//----------------------LUCKY DROP ITEMS----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function rollLuckyDrops() {
    // Lucky Drops node must be allocated — no drops without it
    if (!ptHasSkill('lucky_drops')) return '';

    // Base 25% chance, +10% per bonus_replay node
    let chance = 0.25;
    if (ptHasSkill('bonus_replay_1')) chance += 0.10;
    if (ptHasSkill('bonus_replay_2')) chance += 0.15;
    if (ptHasSkill('bonus_replay_3')) chance += 0.20;
    if (Math.random() >= chance) return '';

    // How many items: base 1, lucky_replay nodes add 10%, 15%, 20% chance for a second
    let luckyCount = 1;
    const extraChance = (ptHasSkill('lucky_replay_1') ? 0.10 : 0)
        + (ptHasSkill('lucky_replay_2') ? 0.15 : 0)
        + (ptHasSkill('lucky_replay_3') ? 0.20 : 0);
    if (Math.random() < extraChance) luckyCount = 2;

    STATE.questStats = STATE.questStats || {};
    STATE.questStats.luckyDropsClaimed = (STATE.questStats.luckyDropsClaimed || 0) + 1;

    let html = '';
    for (let i = 0; i < luckyCount; i++) {
        const defId = pickRandomItem();
        if (!defId) continue;
        const def = ITEM_DEFS[defId];
        if (!def) continue;
        STATE.inventory.push({ defId, uid: Date.now() + Math.random().toString(36).slice(2) });
        const rc = rarityColors(def.rarity);
        html += `<div class="item-reward" data-reward-defid="${defId}" style="border-color:${rc.border};color:${rc.color};cursor:default;">
            ${t('ov_lucky_drop')} ${def.icon} <strong>${itemName(def)}</strong>
        </div>`;
    }
    if (html) {
        save();
    }
    return html;
}






//------------------------------------------------------------------------
//--------------------WIN OVERLAY RENDERER--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Writes all DOM content for the win overlay (stats, bonus badge, item rewards).
function renderWinOverlay({ gi, pts, ptsAwarded, prevBest, mult, elapsed, bonusMet, isAscensionLevel, isFirstClear }) {
    const mins = Math.floor(timerSecs / 60);
    const secs = timerSecs % 60;
    const elapsedMins = Math.floor(elapsed / 60);
    const elapsedSecs = elapsed % 60;

    const gainNote = ptsAwarded < pts
        ? ` (+${ptsAwarded} ${t('ov_win_new')} — ${t('ov_win_best_was')} ${prevBest})`
        : ` (+${ptsAwarded})`;

    // Mistake line — accounts for absorbed mistakes
    const totalWrongClicks = mistakeCount + absorbedMistakes;
    let mistakeLine;
    if (totalWrongClicks === 0) {
        mistakeLine = `<div class="ov-sub-line ov-sub-miss-ok">✗ 0 ${t('ov_win_mistakes')}</div>`;
    } else if (absorbedMistakes > 0 && mistakeCount === 0) {
        mistakeLine = `<div class="ov-sub-line ov-sub-miss-ok">✗ 0 ${t('ov_win_mistakes')} <span style="opacity:0.55;font-size:0.85em">(${absorbedMistakes} ${t('ov_win_absorbed')})</span></div>`;
    } else if (absorbedMistakes > 0) {
        mistakeLine = `<div class="ov-sub-line ov-sub-miss">✗ ${mistakeCount} ${mistakeCount !== 1 ? t('ov_win_mistakes') : t('ov_win_mistake')} <span style="opacity:0.55;font-size:0.85em">(${absorbedMistakes} ${t('ov_win_absorbed')})</span></div>`;
    } else {
        mistakeLine = `<div class="ov-sub-line ${mistakeCount === 0 ? 'ov-sub-miss-ok' : 'ov-sub-miss'}">✗ ${mistakeCount} ${mistakeCount !== 1 ? t('ov_win_mistakes') : t('ov_win_mistake')}</div>`;
    }

    document.getElementById('ov-sub').innerHTML =
        `<div class="ov-sub-line ov-sub-reveal">"${lvText(cur, 'reveal')}"</div>` +
    `<div class="ov-sub-line ov-sub-pts">${pts} ${t('ov_win_pts')} <br> ${t('ov_win_multiplier')} ×${mult.toFixed(2)}<br>${gainNote}</div>` +
        `<div class="ov-sub-line ov-sub-time">⏱ ${mins}:${String(secs).padStart(2, '00')} ${t('ov_win_left')} · ${t('ov_win_solved_in')} ${elapsedMins}:${String(elapsedSecs).padStart(2, '00')}</div>` +
        mistakeLine;
    

    document.getElementById('bonus-list').innerHTML =
        `<span class="bonus-badge ${bonusMet ? 'earned' : 'missed'}">
            ${bonusMet ? t('ov_bonus_met') : '🎯 ' + lvText(cur, 'bonusHint')}
        </span>`;

    // Item reward zone
    const irz = document.getElementById('item-reward-zone');
    irz.innerHTML = '';

    handleSpecialRewards({ gi, isFirstClear, isAscensionLevel, irz });

    const bonusAlreadyDone = STATE.bonusDone.includes(gi);
    const isQuizBonus = cur.bonusType === 'quiz';

    if (bonusMet && !bonusAlreadyDone && !isQuizBonus) {
        STATE.bonusDone.push(gi);
        save();
    }

    if (!curMods.ironman && !isQuizBonus) {
        if (bonusMet && !bonusAlreadyDone) {
            // First-time bonus clear: guaranteed item reward
            const defId = pickRandomItem();
            if (defId) {
                const def = ITEM_DEFS[defId];
                if (def) {
                    STATE.inventory.push({ defId, uid: Date.now() + Math.random().toString(36).slice(2) });
                    save();
                    const rc = rarityColors(def.rarity);
                    irz.innerHTML += `<div class="item-reward" data-reward-defid="${defId}" style="border-color:${rc.border};color:${rc.color};cursor:default;">
                        ${t('ov_item_earned')}: ${def.icon} <strong>${itemName(def)}</strong>
                    </div>`;
                }
            }
        } else if (bonusMet && bonusAlreadyDone) {
            // Bonus already claimed: show note + chance at lucky drops
            irz.innerHTML += `<div class="item-reward" style="border-color:var(--border2);color:#666;">
                ${t('ov_bonus_claimed_note')}
            </div>`;
            irz.innerHTML += rollLuckyDrops();
        } else if (!bonusMet) {
            // Bonus missed: chance at lucky drops
            irz.innerHTML += rollLuckyDrops();
        }
    }

    // Attach hover tooltips to all item-reward elements in the win overlay
    setTimeout(() => {
        irz.querySelectorAll('[data-reward-defid]').forEach(el => {
            attachItemTooltip(el, el.dataset.rewardDefid);
        });
    }, 0);

}




//------------------------------------------------------------------------
//--------------------CHECK WIN FUNCTION----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

//called after every valid cell change to check if the puzzle is solved

function checkWin() {
    if (!isPuzzleSolved()) return;

    if (typeof clearActiveRandomWalkers === "function") {
        clearActiveRandomWalkers();
    }

    dead = true;
    stopTimer();

    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const gi = cur.gIdx;
    const worldData = WORLDS[cur.world - 1];
    const isAscensionLevel = cur.li === worldData.data.length;
    const isFirstClear = !STATE.done.includes(gi);

    if (isFirstClear) STATE.done.push(gi);

    // Record mistakes for this level (used by flawless world achievement)
    // Always keep the best (lowest) value across replays
    if (!STATE.levelMistakes) STATE.levelMistakes = {};
    const prev = STATE.levelMistakes[gi];
    if (prev === undefined || mistakeCount < prev) {
        STATE.levelMistakes[gi] = mistakeCount;
    }

    const elapsed = Math.round((Date.now() - levelStartTime) / 1000);

    const { pts, ptsAwarded, prevBest, mult } = calculateScore(rows, cols, elapsed);
    save();
    document.getElementById('sc-disp').textContent = STATE.totalScore;

    fireAchievements({ gi, rows, cols, elapsed, pts, ptsAwarded, prevBest, mult, isFirstClear });

    // Quest stat tracking
    const _worldData = WORLDS[cur.world - 1];
    const _isConvergenceLevel = (() => {
        const c1 = Math.floor((_worldData.data.length - 1) / 3);
        const c2 = Math.floor((_worldData.data.length - 1) * 2 / 3);
        const idx = cur.li - 1;
        return _worldData.data.length > 2 && (idx === c1 || idx === c2) && !isAscensionLevel;
    })();
    const _worldJustCompleted = (() => {
        // Only count as a new world completion if:
        // 1. This level itself is a first clear (prevents replays from triggering it)
        // 2. Every level in the world is now done
        // 3. This world hasn't already been counted in quest stats before
        if (!isFirstClear) return false;
        const wi = cur.world - 1;
        const start = WORLD_START_GI[wi];
        const allDone = _worldData.data.every((_, li) => STATE.done.includes(start + li));
        if (!allDone) return false;
        if (!STATE.questStats) STATE.questStats = {};
        const counted = STATE.questStats._worldsCountedList || [];
        if (counted.includes(wi)) return false;
        return true;
    })();



    _ptApplyLevelCompleteRewards();   // gear_of_the_statistician & improved_gear nodes

    const bonusMet = evaluateBonusObjective(elapsed);

    buildReveal();

    renderWinOverlay({ gi, pts, ptsAwarded, prevBest, mult, elapsed, bonusMet, isAscensionLevel, isFirstClear });

    // Delay world-code popup so it feels distinct from the win overlay
    setTimeout(() => checkWorldCodes(), 2000);
    checkWorldCompletion();

    if (bonusMet && cur.bonusType === 'quiz') {
        setTimeout(() => showQuiz(cur.world), 1500);
    } else {
        setTimeout(() => {
            document.getElementById('ov-win').classList.add('show');
        }, 1000);
    }
    Audio_Manager.playSFX('win');

    updateQuestStats('levelComplete', {
        gi,
        world: cur.world,
        diff: curDiff,
        mods: { ...curMods },
        mistakeCount,
        itemsUsed: itemsUsedThisLevel,
        playerClass: STATE.playerClass,
        elapsed,
        bonusMet,
        isConvergence: _isConvergenceLevel && isFirstClear,
        worldJustCompleted: _worldJustCompleted,
        worldIndex: cur.world - 1, 
        luckyDropTriggered: false,
        timerSecsAtWin: timerSecs,
        isLargeAdjMatrix: (() => {                          
            const rows = cur.grid.length;
            const cols = cur.grid[0].length;
            return (rows * cols >= 200) && ptHasSkill('adjacency_matrix');
        })(),
    });

    if (typeof _endBlackSwan === "function") _endBlackSwan(false);


}



