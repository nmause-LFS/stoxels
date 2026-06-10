//------------------------------------------------------------------------
//---------------------------MOODLE CODES---------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Each entry defines a Moodle code the player can unlock by reaching
// a score threshold AND a minimum percentage of all achievement tiers.
// achPct: 0 means only the score requirement matters for that code.

const WORLD_CODES = [
    { threshold: 10000, achPct: 0, code: 'TY_4_Playing_Stoxels', titleEn: 'Code 1', titleDE: 'Code 1' },
    { threshold: 25000, achPct: 0.20, code: 'IsThereADog?', titleEn: 'Code 2', titleDE: 'Code 2' },
    { threshold: 50000, achPct: 0.40, code: 'Stox0rTrix', titleEn: 'Code 3', titleDE: 'Code 3' },
    { threshold: 75000, achPct: 0.65, code: 'MonstersInStoxels', titleEn: 'Code 4', titleDE: 'Code 4' },
    { threshold: 100000, achPct: 0.90, code: 'Examn1.0afterStoxels', titleEn: 'Code 5', titleDE: 'Code 5' },
];


//------------------------------------------------------------------------
//---------------------------UNLOCK LOGIC---------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns the localised title for a code entry based on the active language
function getCodeTitle(worldCode) {
    return LANG === 'de' ? worldCode.titleDE : worldCode.titleEn;
}

// Calculates what fraction of all achievement tiers the player has unlocked.
// Returns a value between 0 and 1 (e.g. 0.5 = 50 % complete).
function calcAchievementProgress() {
    const totalTiers = ACHIEVEMENT_DEFS.reduce((sum, def) => sum + def.tiers.length, 0);
    const unlockedTiers = ACH_STATE.unlocked.length;
    return totalTiers > 0 ? unlockedTiers / totalTiers : 0;
}

// Evaluates a single WORLD_CODES entry against the player's current
// score and achievement progress.
// Returns: 'unlocked' | 'locked_achievements' | 'not_reached'
function evaluateCodeEligibility(worldCode, achPctDone) {
    const scoreOk = STATE.totalScore >= worldCode.threshold;
    const achOk = achPctDone >= (worldCode.achPct || 0);

    if (scoreOk && achOk) return 'unlocked';
    if (scoreOk && !achOk) return 'locked_achievements';
    return 'not_reached';
}

// Checks every WORLD_CODES entry and sorts them into:
//   newCodes    — ready to unlock right now
//   lockedCodes — score met, but not enough achievements yet
// Returns both lists so the caller can act on them.
function collectCodeUnlockResults() {
    const newCodes = [];
    const lockedCodes = [];

    const totalTiers = ACHIEVEMENT_DEFS.reduce((sum, def) => sum + def.tiers.length, 0);
    const unlockedTiers = ACH_STATE.unlocked.length;
    const achPctDone = calcAchievementProgress();

    WORLD_CODES.forEach(wc => {
        // Skip codes the player already owns
        if (STATE.unlockedCodes.includes(wc.code)) return;

        const result = evaluateCodeEligibility(wc, achPctDone);

        if (result === 'unlocked') {
            STATE.unlockedCodes.push(wc.code);
            newCodes.push(wc);
        } else if (result === 'locked_achievements') {
            lockedCodes.push({
                wc,
                needed: Math.ceil(wc.achPct * totalTiers),
                have: unlockedTiers,
            });
        }
    });

    return { newCodes, lockedCodes };
}

// Main entry point — call this after a level is beaten or a quiz is finished.
// Checks for newly unlocked codes, persists state, and triggers UI feedback.
function checkWorldCodes() {
    const { newCodes, lockedCodes } = collectCodeUnlockResults();

    save();

    if (newCodes.length) showUnlockedCodesModal(newCodes);
    if (lockedCodes.length) showLockedCodeHintToast(lockedCodes);
}


//------------------------------------------------------------------------
//-------------------------MODAL & TOAST UI-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Builds the HTML for a single code block inside the unlock modal.
function buildCodeUnlockBlock(worldCode) {
    const title = getCodeTitle(worldCode);
    return `
        <div style="margin-bottom:14px;">
            <div style="font-family:var(--PX);font-size:9px;color:var(--purple);margin-bottom:5px;">
                ${title}
            </div>
            <div class="pw-unlock-anim">${worldCode.code}</div>
            <div style="font-size:11px;color:#666;margin-top:6px;">${t('pw_hint')}</div>
        </div>
    `;
}

// Populates and opens the unlock modal for one or more newly earned codes.
function showUnlockedCodesModal(codes) {
    const contentEl = document.getElementById('pw-content');

    document.getElementById('pw-modal')
        .querySelector('.modal-title')
        .textContent = t('pw_title');

    contentEl.innerHTML =
        `<p style="font-size:12px;color:#888;margin-bottom:16px;">${t('pw_intro')}</p>` +
        codes.map(buildCodeUnlockBlock).join('');

    showModal('pw-modal');
}

// Shows a toast notification when the score requirement is met but the
// achievement requirement is not. Only surfaces the lowest-tier locked
// code to avoid spamming the player.
function showLockedCodeHintToast(lockedCodes) {
    const { wc, needed, have } = lockedCodes[0];
    const title = getCodeTitle(wc);
    const remaining = needed - have;

    const msg = LANG === 'de'
        ? `🔒 "${title}": Punktzahl erreicht! Noch ${remaining} Achievements benötigt.`
        : `🔒 "${title}": Score reached! ${remaining} more achievement tiers needed.`;

    if (typeof showToast === 'function') showToast(msg, 4000);
}


//------------------------------------------------------------------------
//-------------------------CODES SCREEN UI--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Renders the empty-state view when the player has not yet unlocked any codes.
// Receives the pre-built score header HTML to include above the empty message.
function buildCodesScreenEmpty(bodyEl, header) {
    bodyEl.innerHTML = header + `
        <div style="padding:0 24px 24px;text-align:center;">
            <p style="font-size:13px;color:var(--accent2);line-height:2;">
                ${t('no_codes').replace(/\n/g, '<br>')}
            </p>
        </div>
    `;
}

// Builds the HTML card for a single unlocked code on the codes screen.
function buildCodeCard(worldCode) {
    const title = getCodeTitle(worldCode);
    return `
        <div class="code-card">
            <div class="code-card-title">${title}</div>
            <div class="code-card-code">${worldCode.code}</div>
            <div class="code-card-hint">${t('pw_hint')}</div>
        </div>
    `;
}

// Renders the grid of all codes the player has unlocked so far.
// Receives the pre-built score header HTML to include above the grid.
function buildCodesScreenGrid(bodyEl, header) {
    const unlockedCodes = WORLD_CODES.filter(c => STATE.unlockedCodes.includes(c.code));

    bodyEl.innerHTML =
        header +
        `<div style="padding:18px;"><div class="codes-grid">` +
        unlockedCodes.map(buildCodeCard).join('') +
        `</div></div>`;
}

// Decides which codes-screen view to render (empty state vs. grid)
// and writes it into the #codes-body element.
// Always prepends the total score + per-code progress bars at the top.
function buildCodesScreen() {
    const bodyEl = document.getElementById('codes-body');
    const total = STATE.totalScore;
    const header = buildCodesScoreHeader(total);

    if (!STATE.unlockedCodes.length) {
        buildCodesScreenEmpty(bodyEl, header);
        return;
    }

    buildCodesScreenGrid(bodyEl, header);
}

// Navigates to the codes screen. Pushes the title screen onto the
// history stack so the back button returns there.
function showCodes() {
    buildCodesScreen();
    screenHistory.push('screen-title');
    switchScreen('screen-codes');
}

//------------------------------------------------------------------------
//-------------------SCORE PROGRESS IN CODES SCREEN----------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
// These helpers build the total score summary and per-code progress bars
// shown at the top of the Codes screen. Moved here from the HS screen
// because they are inherently about code unlock progress, not scores.

// Returns the display name for a world code tier, respecting the current language.
function getWorldCodeTierName(wc) {
    return LANG === 'de' ? wc.titleDE : wc.titleEn;
}

// Calculates the fill percentage for a progress bar, capped at 100.
function calcProgressPct(current, threshold) {
    return Math.min(100, Math.round((current / threshold) * 100));
}

// Returns the bar fill color: green if already unlocked, purple if still in progress.
function getProgressBarColor(unlocked) {
    return unlocked ? 'var(--green)' : 'var(--purple)';
}

// Builds the unlock badge shown next to a tier name when its code is already unlocked.
function buildUnlockedBadge() {
    return `<span style="color:var(--green)">✓ ${t('hs_code_unlocked')}</span>`;
}

// Returns a short status label for a single requirement (score or achievements).
// Shows a green check if met, or a grey "x / y" count if not.
function buildRequirementStatus(label, current, required, met, unit) {
    // If the requirement is met, cap the display value at the required amount
    const displayCurrent = met ? required : current;

    const currentFmt = unit === 'score' ? displayCurrent.toLocaleString() : displayCurrent;
    const requiredFmt = unit === 'score' ? required.toLocaleString() : required;
    const color = met ? 'var(--green)' : 'var(--hs-row-text)';
    const icon = met ? '✓' : '–';
    return `<span style="color:${color}">${icon} ${label}: ${currentFmt} / ${requiredFmt}</span>`;
}

// Builds a single thin fill bar for one requirement.
// barColor — the fill color when in progress; turns green when met.
function buildRequirementBar(pct, met, barColor) {
    const fill = met ? 'var(--green)' : barColor;
    return `
    <div style="background:var(--surface);height:4px;margin-top:3px;border:1px solid var(--border);">
        <div style="background:${fill};height:100%;width:${pct}%;"></div>
    </div>`;
}

// Builds the HTML for a single world code progress bar.
// Shows both the score requirement and the achievement requirement (if any).
// wc       — a world code object from WORLD_CODES
// total    — the player's current total score
// achPct   — the player's current achievement completion (0–1), from calcAchievementProgress()
// totalAchTiers — total number of achievement tiers in the game
// unlockedAchTiers — how many the player has unlocked
function buildCodesProgressBar(wc, total, achPct, totalAchTiers, unlockedAchTiers) {
    const unlocked = STATE.unlockedCodes.includes(wc.code);
    const tierName = getWorldCodeTierName(wc);
    const badge = unlocked ? buildUnlockedBadge() : '';

    // Score requirement
    const scorePct = calcProgressPct(total, wc.threshold);
    const scoreMet = total >= wc.threshold;
    const scoreBar = buildRequirementBar(scorePct, scoreMet, 'var(--purple)');
    const scoreStatus = buildRequirementStatus(t('codes_req_score') || 'Score', total, wc.threshold, scoreMet, 'score');

    // Achievement requirement — only shown when achPct > 0 for this code
    let achBlock = '';
    if (wc.achPct > 0) {
        const achRequired = Math.ceil(wc.achPct * totalAchTiers);
        const achMet = achPct >= wc.achPct;
        const achBarPct = calcProgressPct(unlockedAchTiers, achRequired);
        const achBar = buildRequirementBar(achBarPct, achMet, 'var(--orange)');
        const achStatus = buildRequirementStatus(t('codes_req_ach') || 'Achievements', unlockedAchTiers, achRequired, achMet, 'count');
        achBlock = `<div style="margin-top:5px;">${achStatus}${achBar}</div>`;
    }

    return `
    <div style="margin-bottom:14px;font-size:15px;color:var(--accent);">
        <div style="margin-bottom:4px;">
            <span style="font-family:var(--PX);font-size:15px;color:var(--accent);">${tierName}</span>
            ${badge}
        </div>
        ${scoreStatus}
        ${scoreBar}
        ${achBlock}
    </div>`;
}

// Builds the full progress section: one bar per world code entry.
// Calculates achievement progress once and passes it to each bar builder.
function buildCodesProgressSection(total) {
    const achPct = calcAchievementProgress();
    const totalAchTiers = ACHIEVEMENT_DEFS.reduce((sum, def) => sum + def.tiers.length, 0);
    const unlockedAchTiers = ACH_STATE.unlocked.length;

    return WORLD_CODES
        .map(wc => buildCodesProgressBar(wc, total, achPct, totalAchTiers, unlockedAchTiers))
        .join('');
}

// Builds the total score line shown above the progress bars.
function buildCodesTotalLine(total) {
    return `<div class="hs-total">${t('hs_total')}: ${total}</div>`;
}

// Builds the score + progress header block for the top of the codes screen.
function buildCodesScoreHeader(total) {
    return `
    <div style="padding:18px 18px 0;">
        ${buildCodesTotalLine(total)}
        ${buildCodesProgressSection(total)}
    </div>`;
}