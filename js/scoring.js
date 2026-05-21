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

    onLevelCompleteAch({
        mistakes: mistakeCount,
        itemsUsed: itemsUsedThisLevel,
        diff: curDiff,
        mods: curMods,
        playerClass: STATE.playerClass || null,
        absorbedMistakes: absorbedMistakes,
        absorbedThisLevel: absorbedMistakes,
        cellsFilled, totalCells, rows, cols,
        scoreEarned: ptsAwarded,
        world: cur.world,
        gi, elapsed, timerSecs, pts, prevBest, mult, isFirstClear,
        hadPenaltyClutwch: !!window._hadPenaltyClutch,
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
        STATE.passiveTreePoints = (STATE.passiveTreePoints || 0) + 1;        // Grant Passive Points, in total players should get 26 from convergence and 26 from quests
        save();
        window._pendingConvergenceModal = true;
    }

    // Ascension: Codex of Completion on first clear of the last world level
    if (isAscensionLevel && isFirstClear && !curMods.ironman) {
        const codexDef = ITEM_DEFS['artifactComplete'];
        STATE.inventory.push({ defId: 'artifactComplete', uid: `item_${Date.now()}_${Math.random().toString(36).slice(2)}` });
        save();
        const rc = rarityColors(codexDef.rarity);
        irz.innerHTML = `<div class="item-reward" style="border-color:${rc.border};color:${rc.color};">
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

    // Base 20% chance, +10% per bonus_replay node
    let chance = 0.20;
    if (ptHasSkill('bonus_replay_1')) chance += 0.10;
    if (ptHasSkill('bonus_replay_2')) chance += 0.10;
    if (ptHasSkill('bonus_replay_3')) chance += 0.10;
    if (Math.random() >= chance) return '';

    // How many items: base 1, lucky_replay nodes each add 10% chance for a second
    let luckyCount = 1;
    const extraChance = (ptHasSkill('lucky_replay_1') ? 0.10 : 0)
        + (ptHasSkill('lucky_replay_2') ? 0.10 : 0)
        + (ptHasSkill('lucky_replay_3') ? 0.10 : 0);
    if (Math.random() < extraChance) luckyCount = 2;

    STATE.questStats = STATE.questStats || {};
    STATE.questStats.luckyDropsClaimed = (STATE.questStats.luckyDropsClaimed || 0) + 1;

    let html = '';
    for (let i = 0; i < luckyCount; i++) {
        const defId = pickRandomItem();
        const def = ITEM_DEFS[defId];
        if (!def) continue;
        STATE.inventory.push({ defId, uid: Date.now() + Math.random().toString(36).slice(2) });
        const rc = rarityColors(def.rarity);
        html += `<div class="item-reward" style="border-color:${rc.border};color:${rc.color};">
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
        `<div class="ov-sub-line ov-sub-pts">${pts} ${t('ov_win_pts')} (×${mult.toFixed(2)})${gainNote}</div>` +
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
            const def = ITEM_DEFS[defId];
            if (def) {
                STATE.inventory.push({ defId, uid: Date.now() + Math.random().toString(36).slice(2) });
                save();
                const rc = rarityColors(def.rarity);
                irz.innerHTML += `<div class="item-reward" style="border-color:${rc.border};color:${rc.color};">
                    ${t('ov_item_earned')}: ${def.icon} <strong>${itemName(def)}</strong>
                </div>`;
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
}




//------------------------------------------------------------------------
//--------------------CHECK WIN FUNCTION----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

//called after every valid cell change to check if the puzzle is solved

function checkWin() {
    if (!isPuzzleSolved()) return;

    dead = true;
    stopTimer();

    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const gi = cur.gIdx;
    const worldData = WORLDS[cur.world - 1];
    const isAscensionLevel = cur.li === worldData.data.length;
    const isFirstClear = !STATE.done.includes(gi);

    if (isFirstClear) STATE.done.push(gi);

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
        const start = WORLD_START_GI[cur.world - 1];
        return _worldData.data.every((_, li) => STATE.done.includes(start + li));
    })();



    _ptApplyLevelCompleteRewards();   // ← gear_of_the_statistician & improved_gear nodes

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
            if (window._pendingConvergenceModal) {
                window._pendingConvergenceModal = false;
                setTimeout(() => showConvergenceModal(), 800);
            }
        }, 600);
    }

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
        luckyDropTriggered: false, // lucky drops are tracked separately via updateQuestStats('luckyDropTriggered')
    });


}



