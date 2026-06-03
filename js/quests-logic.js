// ═══════════════════════════════════════════════════════════════════════════════
//
//  quests-logic.js  —  Milestone evaluation, claiming, badge
//
//  Depends on: quests-data.js   (LEDGER_CATEGORIES, _MILESTONE_MAP)
//  Depends on: (global) STATE, LANG, ITEM_DEFS, save(), pickRandomItem()
//
//  Public API:
//    claimQuest(milestoneId)
//    buildQuestLogButton()
//    _refreshQuestBadge()
//
//  Used internally by quests-ui.js:
//    _milestone_isComplete(ms)
//    _milestone_isClaimed(ms)
//    _milestone_getProgress(ms)   → { current, target, pct }
//    _ledger_hasAnyClaimable()
//
// ═══════════════════════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────

/** How long the claim banner stays visible before auto-dismissing (ms). */
const BANNER_DISMISS_MS = 4000;

/** CSS fade-out duration for the claim banner (ms). Must match .qcb fade CSS. */
const BANNER_FADEOUT_MS = 400;


// ─────────────────────────────────────────────────────────────
//  MILESTONE EVALUATION
//  These three functions are the core read-only query layer.
//  All UI and claiming code calls these — never reads STATE directly.
// ─────────────────────────────────────────────────────────────

/**
 * Returns true if the player has met the milestone's target.
 * @param {Object} ms - A milestone object from quests-data.js
 */
function _milestone_isComplete(ms) {
    const { current, target } = ms.check(STATE.questStats || {});
    return current >= target;
}

/**
 * Returns true if the player has already claimed this milestone's reward.
 * @param {Object} ms - A milestone object from quests-data.js
 */
function _milestone_isClaimed(ms) {
    return (STATE.questsClaimed || []).includes(ms.id);
}

/**
 * Returns progress info for a milestone.
 * `current` is clamped to `target` so progress bars never overflow.
 * @param {Object} ms - A milestone object from quests-data.js
 * @returns {{ current: number, target: number, pct: number }}
 */
function _milestone_getProgress(ms) {
    const { current, target } = ms.check(STATE.questStats || {});
    const clamped = Math.min(current, target);
    const pct = Math.min(100, Math.round((clamped / target) * 100));
    return { current: clamped, target, pct };
}

/**
 * Returns true if ANY milestone across all categories is complete but unclaimed.
 * Used to decide whether to show the red badge on the quest-log button.
 */
function _ledger_hasAnyClaimable() {
    return LEDGER_CATEGORIES.some(cat =>
        cat.milestones.some(ms => _milestone_isComplete(ms) && !_milestone_isClaimed(ms))
    );
}


// ─────────────────────────────────────────────────────────────
//  CLAIMING  —  public entry point + private helpers
// ─────────────────────────────────────────────────────────────

/**
 * Public entry point. Claims a milestone by id if it is complete and unclaimed.
 * Grants rewards, saves, refreshes the badge, and shows the claim banner.
 * Called from inline onclick handlers in quests-ui.js.
 * @param {string} milestoneId
 */
function claimQuest(milestoneId) {
    const entry = _MILESTONE_MAP[milestoneId];
    if (!entry) return;

    const { milestone: ms, category: cat } = entry;

    // Guard: already claimed or not yet complete
    if (_milestone_isClaimed(ms) || !_milestone_isComplete(ms)) return;

    _claim_recordClaim(ms);
    _claim_grantRewards(ms);

    save();
    _trackInferenceAchievements(ms, cat);
    _showClaimBanner(ms, cat);
    _refreshQuestBadge();
    renderQuestLog();
}

/**
 * Pushes the milestone id into STATE.questsClaimed so it can't be claimed again.
 * @param {Object} ms
 */
function _claim_recordClaim(ms) {
    if (!STATE.questsClaimed) STATE.questsClaimed = [];
    STATE.questsClaimed.push(ms.id);
}

/**
 * Grants all rewards defined on the milestone: passive-tree points and/or items.
 * @param {Object} ms
 */
function _claim_grantRewards(ms) {
    Audio_Manager.playSFX('questRewardClaimed');
    if (ms.reward.ptPoints) {
        _claim_grantPassivePoints(ms.reward.ptPoints);
    }
    if (ms.reward.items) {
        ms.reward.items.forEach(defId => _claim_grantOneItem(defId));
    }
}

/**
 * Adds passive-tree points to STATE.
 * @param {number} amount
 */
function _claim_grantPassivePoints(amount) {
    STATE.passiveTreePoints = (STATE.passiveTreePoints || 0) + amount;
}

/**
 * Resolves a single item defId (handling '__random__') and pushes it to inventory.
 * Silently no-ops if the resolved id is missing or not in ITEM_DEFS.
 * @param {string} defId  - Raw defId from the reward definition, may be '__random__'
 */
function _claim_grantOneItem(defId) {
    const resolvedId = defId === '__random__' ? pickRandomItem() : defId;

    // pickRandomItem() may return null if the Apex Collector node consumed the pool
    if (!resolvedId) return;

    const def = ITEM_DEFS[resolvedId];
    if (!def) return;

    STATE.inventory.push({
        uid: _claim_generateItemUid(),
        defId: resolvedId,
    });
}

/**
 * Generates a collision-resistant uid for a newly granted inventory item.
 * Format: "ledger_<timestamp>_<random>"
 * @returns {string}
 */
function _claim_generateItemUid() {
    return `ledger_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}


// ─────────────────────────────────────────────────────────────
//  CLAIM BANNER  —  the on-screen confirmation shown after claiming
// ─────────────────────────────────────────────────────────────

/**
 * Builds the localised reward-parts array used inside the claim banner.
 * Each part is a short human-readable string like "🌳 +1 Convergence Point".
 * @param {Object} ms
 * @returns {string[]}
 */
function _claim_buildRewardParts(ms) {
    const de = LANG === 'de';
    const parts = [];

    if (ms.reward.ptPoints) {
        const label = de ? 'Konvergenzpunkt' : 'Convergence Point';
        parts.push(`🌳 +${ms.reward.ptPoints} ${label}`);
    }

    if (ms.reward.items) {
        ms.reward.items.forEach(defId => {
            // Resolve __random__ to get the actual item name if possible
            const resolvedId = defId === '__random__' ? pickRandomItem() : defId;
            const def = resolvedId ? ITEM_DEFS[resolvedId] : null;
            parts.push(def
                ? `${def.icon} ${de ? def.nameDE : def.nameEn}`
                : '🎁 Item'
            );
        });
    }

    return parts;
}

/**
 * Builds and returns the banner DOM element (not yet attached to the document).
 * @param {Object} ms
 * @param {Object} cat
 * @param {string[]} rewardParts  - Output of _claim_buildRewardParts(ms)
 * @returns {HTMLElement}
 */
function _claim_buildBannerElement(ms, cat, rewardParts) {
    const de = LANG === 'de';

    const banner = document.createElement('div');
    banner.id = 'quest-claim-banner';
    banner.innerHTML = `
        <div class="qcb-inner">
            <span class="qcb-icon">${cat.icon}</span>
            <div class="qcb-text">
                <div class="qcb-title">✓ ${de ? 'Belohnung erhalten!' : 'Reward Claimed!'}</div>
                <div class="qcb-sub">
                    ${de ? cat.titleDE : cat.titleEn}: <em>${de ? ms.labelDE : ms.labelEn}</em>
                </div>
                <div class="qcb-rewards">${rewardParts.join('&nbsp;&nbsp;')}</div>
            </div>
            <button class="qcb-close"
                    onclick="document.getElementById('quest-claim-banner')?.remove()">✕</button>
        </div>`;

    return banner;
}

/**
 * Starts the auto-dismiss timer for the claim banner.
 * Fades the element out, then removes it from the DOM.
 */
function _claim_autoDismissBanner() {
    setTimeout(() => {
        const el = document.getElementById('quest-claim-banner');
        if (!el) return;
        el.style.opacity = '0';
        setTimeout(() => el.remove(), BANNER_FADEOUT_MS);
    }, BANNER_DISMISS_MS);
}

/**
 * Orchestrates showing the claim banner: removes any existing one,
 * builds the new element, appends it, and starts the auto-dismiss timer.
 * @param {Object} ms
 * @param {Object} cat
 */
function _showClaimBanner(ms, cat) {
    // Clear any banner that's still visible from a rapid previous claim
    document.getElementById('quest-claim-banner')?.remove();

    const rewardParts = _claim_buildRewardParts(ms);
    const banner = _claim_buildBannerElement(ms, cat, rewardParts);

    document.body.appendChild(banner);
    _claim_autoDismissBanner();
}


// ─────────────────────────────────────────────────────────────
//  BADGE
// ─────────────────────────────────────────────────────────────

/**
 * Shows or hides the red claimable-badge on the quest-log toolbar button.
 * Call this any time claimed/completed state may have changed.
 */
function _refreshQuestBadge() {
    const badge = document.getElementById('quest-log-badge');
    if (!badge) return;
    badge.style.display = _ledger_hasAnyClaimable() ? 'inline-block' : 'none';
}

/**
 * Public initialiser — called from game init once the toolbar button is in the DOM.
 * Sets the initial badge visibility.
 */
function buildQuestLogButton() {
    _refreshQuestBadge();
}

// ─────────────────────────────────────────────────────────────
//  INFERENCE ACHIEVEMENT TRACKING
//  Called every time a milestone is successfully claimed.
//  Maps milestone IDs and category IDs onto achievement stats.
// ─────────────────────────────────────────────────────────────

/**
 * Fires all relevant achievement stat calls for the milestone that was
 * just claimed. Uses trackAchStat / setAchStat from achievements.js.
 * @param {Object} ms  - The milestone object
 * @param {Object} cat - The parent category object
 */
function _trackInferenceAchievements(ms, cat) {
    if (typeof trackAchStat !== 'function') return;

    // ── 1. Every claim increments the global claims counter ───────────────
    trackAchStat('inferenceQuestsClaimed');

    // ── 2. Passive-tree points granted by this milestone ──────────────────
    if (ms.reward && ms.reward.ptPoints) {
        trackAchStat('inferencePtPointsEarned', ms.reward.ptPoints);
    }

    // ── 3. Keystone quest detection ───────────────────────────────────────
    //  Any milestone whose category id contains a known keystone keyword
    //  counts as a keystone quest.
    const _KEYSTONE_CATEGORY_IDS = new Set([
        'signal_noise_master', 'oracle_vision', 'degrees_of_freedom_master',
        'random_walk_master', 'entropy_drain_master', 'overfitting_gambler',
        'countdown_crisis_master', 'sparse_prior_master', 'dead_reckoning_master',
        'frequentists_burden_master', 'adjacency_matrix_master', 'minesweeper_mind',
        'ergodic_field_master', 'gamblers_ruin_master', 'asymptotic_master',
        'stochastic_resonance_master', 'random_walk_survivor',
    ]);
    if (_KEYSTONE_CATEGORY_IDS.has(cat.id)) {
        trackAchStat('inferenceKeystoneQuestsDone');
    }

    // ── 4. Mirror specific ledger category milestones as tiered stats ─────
    //  Each mapping: { categoryId, milestoneIds[] } → achievementStat, incrementing
    //  the stat by 1 per milestone claimed (so tiers reflect how many ms are done).

    // Expected Value (score milestones)
    if (cat.id === 'expected_value') {
        trackAchStat('inferenceScoreMilestones');
    }

    // Sample Size (levels completed milestones)
    if (cat.id === 'sample_size') {
        trackAchStat('inferenceSampleMilestones');
    }

    // Parameter Space (worlds completed)
    if (cat.id === 'parameter_space') {
        trackAchStat('inferenceWorldMilestones');
    }

    // Conditional Probability (gates passed)
    if (cat.id === 'probability_gate') {
        trackAchStat('inferenceGateMilestones');
    }

    // Convergence (convergence levels)
    if (cat.id === 'convergence') {
        trackAchStat('inferenceConvergenceMilestones');
    }

    // Probability Tree (pt points spent)
    if (cat.id === 'probability_tree') {
        trackAchStat('inferencePTMilestones');
    }

    // Maximum Likelihood (class upgrades)
    if (cat.id === 'max_likelihood') {
        trackAchStat('inferenceClassUpgradeMilestones');
    }

    // Choose Your Ascendency + Ascendency Mastery
    if (cat.id === 'choose_ascendency' || cat.id === 'ascendency_mastery') {
        trackAchStat('inferenceAscendencyMilestones');
    }

    // Descriptive Statistics (achievements unlocked)
    if (cat.id === 'descriptive_stats') {
        trackAchStat('inferenceAchievementMilestones');
    }

    // Confidence Interval (correct answers)
    if (cat.id === 'confidence_interval') {
        trackAchStat('inferenceAnswerMilestones');
    }

    // Rare Event Probability (lucky drops)
    if (cat.id === 'lucky_drop_event') {
        trackAchStat('inferenceLuckyMilestones');
    }

    // Zero Variance (flawless levels)
    if (cat.id === 'zero_variance') {
        trackAchStat('inferenceFlawlessMilestones');
    }

    // ── 5. Full-category completion check ─────────────────────────────────
    //  After claiming this milestone, check if every milestone in its
    //  category is now claimed. If so, award inferenceFullCategoriesClaimed.
    if (typeof setAchStat === 'function') {
        const allClaimed = cat.milestones.every(m =>
            (STATE.questsClaimed || []).includes(m.id)
        );
        if (allClaimed) {
            // Count total fully-claimed categories
            const fullCount = LEDGER_CATEGORIES.filter(c =>
                c.milestones.every(m => (STATE.questsClaimed || []).includes(m.id))
            ).length;
            setAchStat('inferenceFullCategoriesClaimed', fullCount);
        }
    }
}