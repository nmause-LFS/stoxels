// ═══════════════════════════════════════════════════════════════════════════════
//
//  quests-logic.js  —  Milestone evaluation, claiming, badge
//
//  Depends on: quests-data.js   (LEDGER_CATEGORIES, _MILESTONE_MAP)
//  Depends on: (global) STATE, LANG, ITEM_DEFS, save(), showToast(),
//              pickRandomItem()
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
//  MILESTONE EVALUATION
// ─────────────────────────────────────────────────────────────

function _milestone_isComplete(ms) {
    const { current, target } = ms.check(STATE.questStats || {});
    return current >= target;
}

function _milestone_isClaimed(ms) {
    return (STATE.questsClaimed || []).includes(ms.id);
}

// Returns { current, target, pct } — current is clamped to target
function _milestone_getProgress(ms) {
    const { current, target } = ms.check(STATE.questStats || {});
    const clamped = Math.min(current, target);
    return { current: clamped, target, pct: Math.min(100, Math.round((clamped / target) * 100)) };
}

// True if any milestone across all categories can be claimed right now
function _ledger_hasAnyClaimable() {
    return LEDGER_CATEGORIES.some(cat =>
        cat.milestones.some(ms => _milestone_isComplete(ms) && !_milestone_isClaimed(ms))
    );
}


// ─────────────────────────────────────────────────────────────
//  CLAIMING
// ─────────────────────────────────────────────────────────────

function claimQuest(milestoneId) {
    const entry = _MILESTONE_MAP[milestoneId];
    if (!entry) return;

    const { milestone: ms, category: cat } = entry;
    if (_milestone_isClaimed(ms) || !_milestone_isComplete(ms)) return;

    _claim_recordClaim(ms);
    _claim_grantRewards(ms);

    save();
    _showClaimBanner(ms, cat);   
    _refreshQuestBadge();
    renderQuestLog();
}

function _claim_recordClaim(ms) {
    if (!STATE.questsClaimed) STATE.questsClaimed = [];
    STATE.questsClaimed.push(ms.id);
}

function _claim_grantRewards(ms) {
    if (ms.reward.ptPoints) {
        STATE.passiveTreePoints = (STATE.passiveTreePoints || 0) + ms.reward.ptPoints;
    }
    if (ms.reward.items) {
        ms.reward.items.forEach(defId => _claim_grantOneItem(defId));
    }
}

function _claim_grantOneItem(defId) {
    const resolvedId = defId === '__random__' ? pickRandomItem() : defId;
    const def = ITEM_DEFS[resolvedId];
    if (!def) return;
    STATE.inventory.push({
        uid: `ledger_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        defId: resolvedId,
    });
}

// Builds the toast string shown after a successful claim
function _claim_buildToastMessage(ms, cat) {
    const de = LANG === 'de';

    const parts = [];
    if (ms.reward.ptPoints) {
        const label = de ? 'Konvergenzpunkt' : 'Convergence Point';
        parts.push(`+${ms.reward.ptPoints} ${label}`);
    }
    if (ms.reward.items) {
        ms.reward.items.forEach(defId => {
            const resolvedId = defId === '__random__' ? pickRandomItem() : defId;
            const def = ITEM_DEFS[resolvedId];
            parts.push(def ? `${def.icon} ${de ? def.nameDE : def.nameEn}` : '🎁 Item');
        });
    }

    const catName = de ? cat.titleDE : cat.titleEn;
    const msLabel = de ? ms.labelDE : ms.labelEn;
    return `${cat.icon} ${catName}: ${msLabel} — ${parts.join(', ')}`;
}


function _showClaimBanner(ms, cat) {
    const de = LANG === 'de';

    // Build reward summary
    const parts = [];
    if (ms.reward.ptPoints) {
        parts.push(`🌳 +${ms.reward.ptPoints} ${de ? 'Konvergenzpunkt' : 'Convergence Point'}`);
    }
    if (ms.reward.items) {
        ms.reward.items.forEach(defId => {
            const resolvedId = defId === '__random__' ? pickRandomItem() : defId;
            const def = ITEM_DEFS[resolvedId];
            parts.push(def ? `${def.icon} ${de ? def.nameDE : def.nameEn}` : '🎁 Item');
        });
    }

    // Remove any existing banner
    document.getElementById('quest-claim-banner')?.remove();

    const banner = document.createElement('div');
    banner.id = 'quest-claim-banner';
    banner.innerHTML = `
        <div class="qcb-inner">
            <span class="qcb-icon">${cat.icon}</span>
            <div class="qcb-text">
                <div class="qcb-title">✓ ${de ? 'Belohnung erhalten!' : 'Reward Claimed!'}</div>
                <div class="qcb-sub">${de ? cat.titleDE : cat.titleEn}: <em>${de ? ms.labelDE : ms.labelEn}</em></div>
                <div class="qcb-rewards">${parts.join('&nbsp;&nbsp;')}</div>
            </div>
            <button class="qcb-close" onclick="document.getElementById('quest-claim-banner')?.remove()">✕</button>
        </div>`;

    document.body.appendChild(banner);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
        const el = document.getElementById('quest-claim-banner');
        if (el) { el.style.opacity = '0'; setTimeout(() => el.remove(), 400); }
    }, 4000);
}


// ─────────────────────────────────────────────────────────────
//  BADGE
// ─────────────────────────────────────────────────────────────

function _refreshQuestBadge() {
    const badge = document.getElementById('quest-log-badge');
    if (!badge) return;
    badge.style.display = _ledger_hasAnyClaimable() ? 'inline-block' : 'none';
}

// Called from game init after the button HTML is in the DOM
function buildQuestLogButton() {
    _refreshQuestBadge();
}