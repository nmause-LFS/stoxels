


let _achToastQueue = [];        // pending toasts waiting to be shown one at a time.
let _achToastBusy = false;      // true while a toast is currently visible; prevents overlap.



// ordered list of all categories shown in the achievement screen.
const ACH_CATEGORIES = [
    { key: 'completion', icon: '🏁', labelEn: 'Completion', labelDE: 'Abschluss' },
    { key: 'difficulty', icon: '🔥', labelEn: 'Difficulty', labelDE: 'Schwierigkeit' },
    { key: 'grid', icon: '🔲', labelEn: 'Grid & Puzzles', labelDE: 'Gitter & Rätsel' },
    { key: 'score', icon: '💰', labelEn: 'Score', labelDE: 'Punkte' },
    { key: 'time', icon: '⏱', labelEn: 'Time & Speed', labelDE: 'Zeit & Geschwindigkeit' },
    { key: 'mistakes', icon: '💥', labelEn: 'Mistakes & Comebacks', labelDE: 'Fehler & Comebacks' },
    { key: 'items', icon: '🎁', labelEn: 'Items & Inventory', labelDE: 'Items & Inventar' },
    { key: 'quiz', icon: '🧠', labelEn: 'Quiz & Excercises', labelDE: 'Quiz & Aufgaben' },
    { key: 'class', icon: '🔮', labelEn: 'Classes & Abilities', labelDE: 'Klassen & Fähigkeiten' },
    { key: 'tree', icon: '🌳', labelEn: 'Probability Tree', labelDE: 'Wahrscheinlichkeitsbaum' },
    { key: 'inference', icon: '🔍', labelEn: 'Inference', labelDE: 'Inferenz' },
    { key: 'meta', icon: '🗺️', labelEn: 'Progression & Meta', labelDE: 'Fortschritt & Meta' },
];



//------------------------------------------------------------------------
//---------------------SHOW ACHIEVEMENTS SCREEN---------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------




// showAchievements — opens the Achievements overview screen.
//   Rebuilds the progress bars and cards so they reflect latest stats.
function showAchievements() {
    buildAchievementsScreen();
    screenHistory.push('screen-title');
    ss('screen-achievements');
}


//------------------------------------------------------------------------
//----------------ACHIEVEMENT TOAST INGAME--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// showAchievementToast — public entry point. Enqueues a toast and starts
//   draining the queue if nothing is currently being shown.
function showAchievementToast(def, tier) {
    _achToastQueue.push({ def, tier });
    setTimeout(_drainAchToastQueue, 0);
}

// _drainAchToastQueue — shows the next queued toast if none is currently visible.
function _drainAchToastQueue() {
    if (_achToastBusy || !_achToastQueue.length) return;
    const { def, tier } = _achToastQueue.shift();
    _showAchToast(def, tier);
}

// _showAchToast — renders and animates a single achievement toast.
//   Visible for ~3.5 s, fades out over 0.5 s, then a short gap before
//   the next toast in the queue slides in.
function _showAchToast(def, tier) {
    _achToastBusy = true;
    document.getElementById('ach-toast')?.remove(); // safety: remove any leftover

    const el = _buildToastElement(def, tier);
    document.body.appendChild(el);

    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => _dismissAchToast(el), 10000);

    Audio_Manager.playSFX('achievement');
}

// _buildToastElement — creates and returns the DOM element for a toast.
function _buildToastElement(def, tier) {
    const lang = _getAchLang();
    const label = lang === 'de' ? tier.labelDE : tier.labelEn;
    const name = lang === 'de' ? def.nameDE : def.nameEn;

    // Extract description base
    const baseDesc = lang === 'de' ? def.descDE : def.descEn;

    // Format the requirement text cleanly (e.g., "Complete levels: 10")
    const requirementText = lang === 'de'
        ? `${baseDesc} Ziel: ${tier.threshold.toLocaleString()}`
        : `${baseDesc} Target: ${tier.threshold.toLocaleString()}`;

    const el = document.createElement('div');
    el.id = 'ach-toast';
    el.innerHTML = `
        <div class="ach-toast-inner">
            <span class="ach-toast-icon">${def.icon}</span>
            <div class="ach-toast-text">
                <div class="ach-toast-title">🏆 Achievement Unlocked!</div>
                <div class="ach-toast-name">${name}: <em>${label}</em></div>
                <div class="ach-toast-requirement" style="font-size: 0.85em; opacity: 0.8; margin-top: 2px;">📋 ${requirementText}</div>
            </div>
        </div>`;
    return el;
}

// _dismissAchToast — animates the toast out, removes it from the DOM,
//   then triggers the next queued toast after a short gap.
function _dismissAchToast(el) {
    el.classList.remove('show');
    setTimeout(() => {
        el.remove();
        _achToastBusy = false;
        setTimeout(_drainAchToastQueue, 300); // brief gap between consecutive toasts
    }, 500); // matches CSS transition-out duration
}



//------------------------------------------------------------------------
//-----------------------ACHIEVEMENT SCREEN-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// buildAchievementsScreen — top-level builder: wires together the header
//   and all category sections, then injects them into #ach-body.
function buildAchievementsScreen() {
    const body = document.getElementById('ach-body');
    if (!body) return;

    const lang = _getAchLang();

    // Milestone counter (existing)
    const totalTiers = _countTotalTiers();
    const unlockedTiers = ACH_STATE.unlocked.length;
    const milestonePct = _calcProgressPct(unlockedTiers, totalTiers);

    // Full-achievement counter (new)
    const totalAchs = _countTotalAchievements();
    const fullAchs = _countFullyUnlockedAchievements();
    const fullPct = _calcProgressPct(fullAchs, totalAchs);

    const grouped = _groupDefsByCategory();

    let html = _buildOverallHeaderHtml(fullAchs, totalAchs, fullPct, unlockedTiers, totalTiers, milestonePct, lang);
    html += ACH_CATEGORIES
        .map(cat => _buildCategoryHtml(cat, grouped[cat.key] || [], lang))
        .join('');

    body.innerHTML = html;
}

// _getAchLang — returns 'de' or 'en' based on the global LANG variable.
function _getAchLang() {
    return (typeof LANG !== 'undefined' && LANG === 'de') ? 'de' : 'en';
}

// _countTotalTiers — sums up all tier entries across every achievement definition.
function _countTotalTiers() {
    return ACHIEVEMENT_DEFS.reduce((sum, def) => sum + def.tiers.length, 0);
}

// _calcProgressPct — returns a 0-100 integer representing overall completion.
function _calcProgressPct(unlocked, total) {
    return Math.round((unlocked / total) * 100);
}

// _countTotalAchievements — total number of achievement definitions (ignoring tiers).
function _countTotalAchievements() {
    return ACHIEVEMENT_DEFS.length;
}

// _countFullyUnlockedAchievements — counts defs where every tier has been unlocked.
function _countFullyUnlockedAchievements() {
    return ACHIEVEMENT_DEFS.filter(def =>
        def.tiers.every((_, ti) => ACH_STATE.unlocked.includes(`${def.id}__${ti}`))
    ).length;
}

// _groupDefsByCategory — returns a plain object keyed by category string,
//   each value being the array of achievement defs that belong to it.
function _groupDefsByCategory() {
    const grouped = {};
    ACHIEVEMENT_DEFS.forEach(def => {
        const cat = def.category || 'meta';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(def);
    });
    return grouped;
}

// _buildOverallHeaderHtml — renders two progress counters side by side:
//   left = fully completed achievements, right = milestone tiers unlocked.
function _buildOverallHeaderHtml(fullAchs, totalAchs, fullPct, unlockedTiers, totalTiers, milestonePct, lang) {
    const achLabel = lang === 'de' ? 'Achievements abgeschlossen' : 'Achievements Completed';
    const mileLabel = lang === 'de' ? 'Achievement Meilensteine' : 'Achievement Milestones';

    return `
        <div class="ach-header">
            <div class="ach-progress-dual">
                <div class="ach-progress-block">
                    <span class="ach-progress-label">${achLabel}</span>
                    <span class="ach-progress-text">${fullAchs} / ${totalAchs} &nbsp;(${fullPct}%)</span>
                    <div class="ach-progress-bar-outer">
                        <div class="ach-progress-bar-inner" style="width:${fullPct}%"></div>
                    </div>
                </div>
                <div class="ach-progress-block">
                    <span class="ach-progress-label">${mileLabel}</span>
                    <span class="ach-progress-text">${unlockedTiers} / ${totalTiers} &nbsp;(${milestonePct}%)</span>
                    <div class="ach-progress-bar-outer">
                        <div class="ach-progress-bar-inner ach-progress-bar-milestones" style="width:${milestonePct}%"></div>
                    </div>
                </div>
            </div>
        </div>`;
}

// _buildCategoryHtml — returns the HTML for one category section (header + grid).
//   Returns an empty string if there are no defs for this category.
function _buildCategoryHtml(cat, defs, lang) {
    if (!defs.length) return '';

    const catLabel = lang === 'de' ? cat.labelDE : cat.labelEn;
    const catTotal = _countCategoryTiers(defs);
    const catUnlocked = _countCategoryUnlocked(defs);
    const cardsHtml = defs.map(def => _buildCardHtml(def, lang)).join('');

    return `
        <div class="ach-category">
            <div class="ach-category-header">
                <span class="ach-category-icon">${cat.icon}</span>
                <span class="ach-category-name">${catLabel}</span>
                <span class="ach-category-count">${catUnlocked} / ${catTotal}</span>
            </div>
            <div class="ach-grid">
                ${cardsHtml}
            </div>
        </div>`;
}

// _countCategoryTiers — total number of tiers across all defs in one category.
function _countCategoryTiers(defs) {
    return defs.reduce((sum, def) => sum + def.tiers.length, 0);
}

// _countCategoryUnlocked — total unlocked tiers across all defs in one category.
function _countCategoryUnlocked(defs) {
    return defs.reduce((sum, def) =>
        sum + def.tiers.filter((_, ti) =>
            ACH_STATE.unlocked.includes(`${def.id}__${ti}`)
        ).length
        , 0);
}

// _buildCardHtml — returns the HTML for a single achievement card.
function _buildCardHtml(def, lang) {
    const val = ACH_STATE.stats[def.stat] || 0;
    const name = lang === 'de' ? def.nameDE : def.nameEn;
    const desc = lang === 'de' ? def.descDE : def.descEn;
    const highestUnlocked = _getHighestUnlockedTierIndex(def);
    const isComplete = highestUnlocked === def.tiers.length - 1;
    const cardClass = _getCardClass(highestUnlocked, isComplete);
    const earnedLabel = _getEarnedLabel(def, highestUnlocked, lang);
    const dotsHtml = _buildTierDotsHtml(def, lang);
    const progressHtml = _buildCardProgressHtml(def, highestUnlocked, val, lang);

    return `
        <div class="${cardClass}">
            <div class="ach-card-top">
                <span class="ach-card-icon">${def.icon}</span>
                <div class="ach-card-info">
                    <div class="ach-card-name">${name}</div>
                    <div class="ach-card-desc">${desc}</div>
                    ${earnedLabel ? `<div class="ach-card-earned">✓ ${earnedLabel}</div>` : ''}
                </div>
            </div>
            <div class="ach-tier-dots">${dotsHtml}</div>
            ${progressHtml}
        </div>`;
}

// _getHighestUnlockedTierIndex — returns the index of the highest tier the
//   player has unlocked for this achievement, or -1 if none.
function _getHighestUnlockedTierIndex(def) {
    let highest = -1;
    def.tiers.forEach((_, ti) => {
        if (ACH_STATE.unlocked.includes(`${def.id}__${ti}`)) highest = ti;
    });
    return highest;
}

// _getCardClass — returns the CSS class string for a card based on its state.
function _getCardClass(highestUnlocked, isComplete) {
    if (isComplete) return 'ach-card complete';
    if (highestUnlocked >= 0) return 'ach-card partial';
    return 'ach-card locked';
}

// _getEarnedLabel — returns the localised label for the highest earned tier,
//   or an empty string if nothing has been unlocked yet.
function _getEarnedLabel(def, highestUnlocked, lang) {
    if (highestUnlocked < 0) return '';
    const tier = def.tiers[highestUnlocked];
    return lang === 'de' ? tier.labelDE : tier.labelEn;
}

// _buildTierDotsHtml — returns a row of coloured dots representing each tier's
//   locked / earned state.
function _buildTierDotsHtml(def, lang) {
    return def.tiers.map((tier, ti) => {
        const unlocked = ACH_STATE.unlocked.includes(`${def.id}__${ti}`);
        const tierLabel = lang === 'de' ? tier.labelDE : tier.labelEn;
        return `<span class="ach-tier-dot ${unlocked ? 'earned' : 'locked'}" title="${tierLabel}">●</span>`;
    }).join('');
}

// _buildCardProgressHtml — returns the progress bar HTML toward the next tier,
//   or an empty string if all tiers are already unlocked.
function _buildCardProgressHtml(def, highestUnlocked, currentVal, lang) {
    const nextTierIdx = highestUnlocked + 1;
    const nextTier = def.tiers[nextTierIdx];
    if (!nextTier) return '';

    const pct = Math.min(100, Math.round((currentVal / nextTier.threshold) * 100));
    const progressLabel = lang === 'de' ? nextTier.labelDE : nextTier.labelEn;

    return `
        <div class="ach-card-progress">
            <div class="ach-card-progress-bar-outer">
                <div class="ach-card-progress-bar-inner" style="width:${pct}%"></div>
            </div>
            <span class="ach-card-progress-label">${currentVal.toLocaleString()} / ${nextTier.threshold.toLocaleString()} — <em>${progressLabel}</em></span>
        </div>`;
}








//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function showAchResetModal() {
    document.getElementById('ach-reset-modal').style.display = 'flex';
}

function hideAchResetModal() {
    document.getElementById('ach-reset-modal').style.display = 'none';
}



//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------





//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------





//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------





//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------





//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------









//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------





//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------





//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------












