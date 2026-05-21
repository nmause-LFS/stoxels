






//------------------------------------------------------------------------
//--------------------TOP BAR---------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Renders the active modifier tags (TT / HC / IM) and the current difficulty
// tag into the #ls-mods element
function renderLSTopBar() {
    const modEl = document.getElementById('ls-mods');
    const active = Object.keys(curMods).filter(m => curMods[m]);
    const modMap = { timetrial: 'TT', hardcore: 'HC', ironman: 'IM' };

    modEl.innerHTML =
        active.map(m =>
            `<span class="mod-tag ${m === 'timetrial' ? 'tt' : m === 'hardcore' ? 'hc' : 'im'}">
                ${modMap[m] || m.toUpperCase()}
            </span>`
        ).join(' ') +
        ` <span class="mod-tag diff">${t('diff_' + curDiff)}</span>`;
}

// Renders the total score and the "points to next unlock code" hint
function renderLSScoreRow() {
    const nextCode = WORLD_CODES.find(wc => STATE.totalScore < wc.threshold);
    const nextCodeStr = nextCode
        ? `${nextCode.threshold - STATE.totalScore} ${t('ls_to_next')} (${LANG === 'de' ? nextCode.titleDE : nextCode.titleEn})`
        : `🏆 ${t('ls_all_codes')}`;

    document.getElementById('ls-score').textContent = t('ls_total') + ': ' + STATE.totalScore;

    const ptsNextEl = document.getElementById('ls-pts-next');
    if (ptsNextEl) ptsNextEl.textContent = nextCodeStr;
}

// Renders the player's current class (or a prompt to pick one) in #ls-class-status.
function renderLSClassStatus() {
    const classEl = document.getElementById('ls-class-status');
    if (!classEl) return;

    if (STATE.playerClass) {
        const def = CLASS_DEFS[STATE.playerClass];
        classEl.textContent = def.icon + ' ' + (LANG === 'de' ? def.nameDE : def.nameEn);
        classEl.style.borderColor = def.color;
        classEl.style.color = def.colorLight;
        classEl.style.border = '1px solid ' + def.color;
        classEl.style.padding = '3px 8px';
    } else {
        classEl.textContent = LANG === 'de'
            ? '⚗️ Absolviere ein Aufstiegs-Level um eine Klasse zu wählen'
            : '⚗️ Beat an Ascension level to choose a class';
        classEl.style.border = '';
        classEl.style.padding = '';
        classEl.style.color = '';
        classEl.style.opacity = '1';
    }
}

// Updates the Probability Tree button label and color based on available points.
function renderLSPassiveTreeButton() {
    const treePoints = STATE.passiveTreePoints || 0;
    const ptBtn = document.getElementById('btn-go-passive-tree');
    if (!ptBtn) return;

    ptBtn.textContent = (LANG === 'de' ? '🌿 Wahrscheinlichkeitsbaum' : '🌿 Probability Tree') +
        (treePoints > 0 ? ` (${treePoints})` : '');
    ptBtn.style.borderColor = treePoints > 0 ? 'var(--yellow)' : 'var(--green)';
    ptBtn.style.color = treePoints > 0 ? 'var(--yellow)' : 'var(--green)';
}



//------------------------------------------------------------------------
//---------------------WORLD BLOCKS---------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Creates the world-block wrapper div (heading + empty grid container).
function buildWorldBlock(w, wi) {
    const block = document.createElement('div');
    block.className = 'world-block';
    block.innerHTML = `
        <div class="world-label">${LANG === 'de' && w.labelDE ? w.labelDE : w.label}</div>
        <div class="level-grid" id="wg${wi}"></div>`;
    return block;
}


// Clears #ls-body and rebuilds a world-block + level card grid for every world.
function renderLSWorlds() {
    const body = document.getElementById('ls-body');
    body.innerHTML = '';

    ensureLSTooltipStyles();
    const tip = ensureLSTooltip();

    WORLDS.forEach((w, wi) => {
        const block = buildWorldBlock(w, wi);
        body.appendChild(block);

        const grid = block.querySelector('#wg' + wi);
        w.data.forEach((p, li) => {
            const card = buildLevelCard(p, li, wi, w, tip);
            grid.appendChild(card);
        });
    });
}





//------------------------------------------------------------------------
//--------------------BUILD LEVEL SELECT----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function buildLS() {
    renderLSTopBar();
    renderLSScoreRow();
    renderLSClassStatus();
    renderLSPassiveTreeButton();
    renderLSWorlds();
    buildQuestLogButton();
}


//------------------------------------------------------------------------
//--------------------LEVEL CARDS-----------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------






// Builds and returns a single level card element for level at index li in world w.
function buildLevelCard(p, li, wi, w, tip) {
    const gi = WORLD_START_GI[wi] + li;
    const isUnlocked = li === 0 ? STATE.tutorialDone : STATE.done.includes(gi - 1);
    const isDone = STATE.done.includes(gi);
    const hs = STATE.levelHS[gi];

    const isMathGated = isGatedLevel(gi) && !isMathGatePassed(gi);
    const isLastInWorld = li === w.data.length - 1;
    const isConvergenceLevel = getLevelIsConvergence(li, w, isLastInWorld);

    const card = document.createElement('div');
    card.className = buildLevelCardClassName({ isUnlocked, isDone, isMathGated, isLastInWorld, isConvergenceLevel, w, gi });
    card.innerHTML = buildLevelCardHTML({ p, li, wi, w, gi, isUnlocked, isDone, hs, isLastInWorld, isConvergenceLevel });

    if (isUnlocked) {
        attachLevelCardEvents(card, gi, isDone, isMathGated, tip);
    }

    return card;
}


// Returns true if the level at index li is a convergence point (33% or 66% of world).
function getLevelIsConvergence(li, w, isLastInWorld) {
    const c1 = Math.floor((w.data.length - 1) / 3);
    const c2 = Math.floor((w.data.length - 1) * 2 / 3);
    return w.data.length > 2 && (li === c1 || li === c2) && !isLastInWorld;
}


// Builds the CSS class string for a level card.
function buildLevelCardClassName({ isUnlocked, isDone, isMathGated, isLastInWorld, isConvergenceLevel, w, gi }) {
    return 'level-card' +
        (isUnlocked ? '' : ' locked') +
        (isDone ? ' done' : '') +
        (isMathGated && isUnlocked ? ' math-gated' : '') +
        (isLastInWorld && w.data.length > 1 ? ' ascension' : '') +
        (isConvergenceLevel ? ' convergence' : '') +
        (isMaxCleared(gi) ? ' max-cleared' : '');
}

// Builds the inner HTML string for a level card.
function buildLevelCardHTML({ p, li, wi, w, gi, isUnlocked, isDone, hs, isLastInWorld, isConvergenceLevel }) {
    const stars = isDone ? getStars(gi) : '';
    const hsText = buildHSHtml(hs);
    const bonusText = buildBonusHtml(p, gi, isUnlocked);
    const modTagsHtml = buildModTagsHtml(hs);
    const szStr = buildGridSizeStr(p, w);
    const ascensionBadge = buildAscensionBadge(isLastInWorld, w);
    const convergenceBadge = buildConvergenceBadge(isConvergenceLevel, gi);
    const maxBadge = isMaxCleared(gi) ? `<div class="lc-max-badge">👑</div>` : '';

    return `
        <div class="lc-num">${wi + 1}-${li + 1}</div>
        <div class="lc-hint">${isUnlocked ? lvText(p, 'hint') : '???'}</div>
        <div class="lc-sz">${szStr}</div>
        ${maxBadge}${ascensionBadge}${convergenceBadge}${bonusText}${hsText}${modTagsHtml}
        <div class="lc-stars">${stars}</div>`;
}

// Attaches click + tooltip mouse events to an unlocked level card.
function attachLevelCardEvents(card, gi, isDone, isMathGated, tip) {
    card.addEventListener('click', () => startLevel(gi));

    const tipText = isDone
        ? getTooltipHint(gi)
        : isMathGated
            ? t('ls_locked_hint')
            : t('ls_no_score');

    card.addEventListener('mouseenter', () => { tip.textContent = tipText; tip.classList.add('show'); });
    card.addEventListener('mousemove', e => {
        tip.style.left = (e.clientX + 14) + 'px';
        tip.style.top = Math.min(e.clientY + 14, window.innerHeight - 80) + 'px';
    });
    card.addEventListener('mouseleave', () => tip.classList.remove('show'));
}





//------------------------------------------------------------------------
//----------------CARD HTML FRAGMENT BUILDERS-----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// Returns the high-score div HTML, or an empty string if no score exists.
function buildHSHtml(hs) {
    return hs ? `<div class="lc-hs">${t('ls_hs_best')}: ${hs.score}</div>` : '';
}

// Returns the bonus objective div — either a "claimed" message or the hint text.
function buildBonusHtml(p, gi, isUnlocked) {
    if (!isUnlocked) return `<div class="lc-bonus">???</div>`;
    const bonusIcons = {
        nomiss: '✨', fast: '⚡', noitem: '🎒', quiz: '🧠',
        combo: '🔥', lowmiss: '🎯', noitem_nomiss: '🎒✨', noitem_fast: '🎒⚡'
    };
    const bIcon = bonusIcons[p.bonusType || 'nomiss'] || '🎯';

    return STATE.bonusDone.includes(gi)
        ? `<div class="lc-bonus" style="color:var(--green);opacity:0.7;">✓ ${bIcon} ${t('ls_bonus_claimed')}</div>`
        : `<div class="lc-bonus">${bIcon} ${lvText(p, 'bonusHint') || t('ls_complete_level')}</div>`;
}

// Returns the modifier-tag row HTML for the best-score run, or an empty string.
function buildModTagsHtml(hs) {
    if (!hs || !hs.mods) return '';

    const modMap = { timetrial: 'TT', hardcore: 'HC', ironman: 'IM' };
    const ms = Object.keys(hs.mods).filter(m => hs.mods[m]);
    if (!ms.length) return '';

    return '<div class="lc-mods">' +
        ms.map(m =>
            `<span class="lc-mod-tag ${m === 'timetrial' ? 'tt' : m === 'hardcore' ? 'hc' : 'im'}">
                ${modMap[m] || m.slice(0, 2).toUpperCase()}
            </span>`
        ).join('') +
        `<span class="lc-mod-tag diff">${t('diff_' + (hs.diff || 'normal')).slice(0, 1)}</span>` +
        '</div>';
}

// Returns "rows×cols" from the level data, falling back to the world's default size.
function buildGridSizeStr(p, w) {
    return p.grid
        ? `${p.grid.length}×${p.grid[0].length}`
        : (w.size ? `${w.size}×${w.size}` : '?');
}


// Returns the ASCENSION badge HTML for the final level of a world.
function buildAscensionBadge(isLastInWorld, w) {
    return isLastInWorld && w.data.length > 1
        ? `<div class="lc-ascension-badge">${LANG === 'de' ? '⚗️ AUFSTIEG' : '⚗️ ASCENSION'}</div>`
        : '';
}

// Returns the CONVERGENCE badge HTML, with a checkmark if the reward is claimed.
function buildConvergenceBadge(isConvergenceLevel, gi) {
    if (!isConvergenceLevel) return '';
    const claimed = STATE.convergenceDone && STATE.convergenceDone.includes(gi);
    return `<div class="lc-convergence-badge">${claimed
        ? (LANG === 'de' ? '🌿 KONVERGENZ ✓' : '🌿 CONVERGENCE ✓')
        : (LANG === 'de' ? '🌿 KONVERGENZ' : '🌿 CONVERGENCE')
        }</div>`;
}





//------------------------------------------------------------------------
//-----------------CUSTOM TOOLTIP ON LEVEL CARDS--------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// ── Tooltip setup ──────────────────────────────────────────────────────────

// Injects the tooltip + items-hint CSS rules once into the document head.
function ensureLSTooltipStyles() {
    if (document.getElementById('ls-tooltip-style')) return;

    const style = document.createElement('style');
    style.id = 'ls-tooltip-style';
    style.textContent = `
        .lc-tooltip { position:fixed; z-index:9999; background:#1a1a2e; border:1px solid var(--accent);
            color:var(--accent2); font-family:var(--PX); font-size:10px; padding:8px 12px;
            max-width:280px; line-height:1.6; pointer-events:none; opacity:0;
            transition:opacity 0.15s; border-left:3px solid var(--purple); }
        .lc-tooltip.show { opacity:1; }
        .lc-items-hint { font-family:var(--PX); font-size:9px; color:var(--orange);
            margin-top:4px; opacity:0.9; }
    `;
    document.head.appendChild(style);
}

// Returns the shared tooltip element, creating it if it doesn't exist yet.
function ensureLSTooltip() {
    let tip = document.getElementById('lc-tip');
    if (!tip) {
        tip = document.createElement('div');
        tip.id = 'lc-tip';
        tip.className = 'lc-tooltip';
        document.body.appendChild(tip);
    }
    return tip;
}



// getTooltipHint(gi) — builds a suggestion string for the level tooltip.
//   Looks at what difficulty + mods the player has already used for their
//   best score and suggests what to try next to squeeze out more points.
function getTooltipHint(gi) {
    const hs = STATE.levelHS[gi];
    if (!hs) return t('ls_no_score');

    const diffs = ['easy', 'normal', 'hard'];
    const allMods = ['timetrial', 'hardcore', 'ironman'];

    const currentDiffIdx = diffs.indexOf(hs.diff || 'easy');
    const usedMods = hs.mods ? Object.keys(hs.mods).filter(m => hs.mods[m]) : [];
    const unusedMods = allMods.filter(m => !usedMods.includes(m));

    const suggestions = [];

    // Suggest a harder difficulty if not on hard yet
    if (currentDiffIdx < 2) {
        const nextDiff = t('diff_' + diffs[currentDiffIdx + 1]);
        suggestions.push(t('ls_tip_harder').replace('{diff}', nextDiff));
    }

    // Suggest unused modifiers
    if (unusedMods.length) {
        const modNames = unusedMods.map(m => {
            const keyMap = { timetrial: 'mod_tt', hardcore: 'mod_hc', ironman: 'mod_im' };
            return t(keyMap[m]);
        });
        const key = modNames.length > 1 ? 'ls_tip_mods_plural' : 'ls_tip_mods';
        suggestions.push(t(key).replace('{mods}', modNames.join(' / ')));
    }

    if (!suggestions.length) return t('ls_max_score');

    return '💡 ' + suggestions.join(' · ');
}





//------------------------------------------------------------------------
//---------------------HELPERS--------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// getStars(gi) — returns a star string based on difficulty + modifiers used.
// Stars 1–3 = difficulty tier; each active modifier adds a bonus star (★).
function getStars(gi) {
    const hs = STATE.levelHS[gi];
    if (!hs) return '';

    const filled = '⭐';
    const empty = '☆';
    const modStar = '★';

    let count = 1;
    if (hs.diff === 'normal') count = 2;
    if (hs.diff === 'hard') count = 3;

    const modCount = hs.mods ? Object.values(hs.mods).filter(Boolean).length : 0;
    const modStars = modStar.repeat(modCount);

    return filled.repeat(count) + empty.repeat(3 - count) + (modStars ? ' ' + modStars : '');
}


// isMaxCleared(gi) — returns true if the player has beaten this level on
//   Hard difficulty with all three modifiers active (the theoretical maximum).
function isMaxCleared(gi) {
    const hs = STATE.levelHS[gi];
    if (!hs) return false;
    return hs.diff === 'hard' &&
        hs.mods &&
        hs.mods.timetrial &&
        hs.mods.hardcore &&
        hs.mods.ironman;
}



//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
















