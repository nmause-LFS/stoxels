// ═══════════════════════════════════════════════════════════════════════════════
//
//  quests-ui.js  —  All rendering for the Stochastic Ledger modal
//
//  Depends on: quests-data.js    (LEDGER_CATEGORIES)
//  Depends on: quests-logic.js   (_milestone_isComplete, _milestone_isClaimed,
//                                  _milestone_getProgress, _ledger_hasAnyClaimable,
//                                  claimQuest)
//  Depends on: (global) LANG, STATE, ITEM_DEFS
//
//  Public API:
//    showQuestLog()
//    hideQuestLog()
//    renderQuestLog()
//
//  Inline onclick handlers exposed to HTML:
//    _ledger_openCategory(id)
//    _ledger_backToGrid()
//
// ═══════════════════════════════════════════════════════════════════════════════


// ─────────────────────────────────────────────────────────────
//  NAVIGATION STATE  (grid overview vs. single-category detail)
// ─────────────────────────────────────────────────────────────

let _ledger_activeCategoryId = null;   // null = grid, string = category id

function _ledger_openCategory(id) {
    _ledger_activeCategoryId = id;
    renderQuestLog();
}

function _ledger_backToGrid() {
    _ledger_activeCategoryId = null;
    renderQuestLog();
}


// ─────────────────────────────────────────────────────────────
//  REWARD CHIP TOOLTIP
// ─────────────────────────────────────────────────────────────

let _questRewardTipEl = null;

function _ensureQuestRewardTooltip() {
    if (_questRewardTipEl) return _questRewardTipEl;
    _questRewardTipEl = document.createElement('div');
    _questRewardTipEl.id = 'quest-reward-tooltip';
    document.body.appendChild(_questRewardTipEl);
    return _questRewardTipEl;
}

function _showQuestRewardTooltip(def, anchorEl) {
    const tip = _ensureQuestRewardTooltip();
    const rc = rarityColors(def.rarity);
    const de = LANG === 'de';
    tip.innerHTML = `
        <div class="inv-tip-name" style="color:${rc.color}">${def.icon} ${de ? def.nameDE : def.nameEn}</div>
        <div class="inv-tip-rarity" style="color:${rc.color}">${def.rarity.toUpperCase()}</div>
        <div class="inv-tip-desc">${de ? def.descDE : def.descEn}</div>`;
    tip.classList.add('visible');

    // Position above the chip, flip below if too close to top
    tip.style.left = '0px';
    tip.style.top = '0px';
    const ar = anchorEl.getBoundingClientRect();
    const tw = tip.offsetWidth || 220;
    const th = tip.offsetHeight || 70;
    let left = ar.left + ar.width / 2 - tw / 2;
    let top = ar.top - th - 8;
    if (top < 6) top = ar.bottom + 8;
    left = Math.max(6, Math.min(left, window.innerWidth - tw - 6));
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
}

function _hideQuestRewardTooltip() {
    if (_questRewardTipEl) _questRewardTipEl.classList.remove('visible');
}

function _questChipHover(el, defId) {
    const def = ITEM_DEFS[defId];
    if (def) _showQuestRewardTooltip(def, el);
}



// ─────────────────────────────────────────────────────────────
//  MODAL LIFECYCLE
// ─────────────────────────────────────────────────────────────

function showQuestLog() {
    let modal = document.getElementById('quest-log-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quest-log-modal';
        modal.className = 'modal-bg';
        document.body.appendChild(modal);
    }
    modal.classList.add('show');
    renderQuestLog();
}

function hideQuestLog() {
    _ledger_activeCategoryId = null;   // ← reset to grid view
    const modal = document.getElementById('quest-log-modal');
    if (modal) modal.classList.remove('show');
}

// Entry point — decides which view to render
function renderQuestLog() {
    const modal = document.getElementById('quest-log-modal');
    if (!modal || !modal.classList.contains('show')) return;

    if (_ledger_activeCategoryId) {
        _ledger_renderDetailView(modal);
    } else {
        _ledger_renderGridView(modal);
    }
}


// ─────────────────────────────────────────────────────────────
//  GRID VIEW  —  26-card overview of all categories
// ─────────────────────────────────────────────────────────────

function _ledger_renderGridView(modal) {
    modal.innerHTML = `
        <div class="modal-box ledger-modal-box">
            <button class="modal-close" onclick="hideQuestLog()">
                ✕ ${LANG === 'de' ? 'SCHLIESSEN' : 'CLOSE'}
            </button>
            <div class="modal-title">
                📒 ${LANG === 'de' ? 'INFERENZ' : 'INFERENCE'}
            </div>
            ${_ledger_buildSummaryStrip()}
            <div class="ledger-grid">
                ${LEDGER_CATEGORIES.map(_ledger_buildCategoryCard).join('')}
            </div>
        </div>`;
}

// Summary strip: PT points earned, milestones claimed, claimable count
function _ledger_buildSummaryStrip() {
    const de = LANG === 'de';

    let totalMs = 0, claimedMs = 0, claimableMs = 0, ptFromLedger = 0;
    LEDGER_CATEGORIES.forEach(cat => {
        cat.milestones.forEach(ms => {
            totalMs++;
            if (_milestone_isClaimed(ms)) {
                claimedMs++;
                if (ms.reward.ptPoints) ptFromLedger += ms.reward.ptPoints;
            } else if (_milestone_isComplete(ms)) {
                claimableMs++;
            }
        });
    });

    const claimableBadge = claimableMs > 0
        ? ` &nbsp;·&nbsp;<strong style="color:#f39c12;animation:questPulse 1.2s ease-in-out infinite;display:inline-block;">
               ⭐ ${claimableMs} ${de ? 'einlösbar' : 'claimable'}
           </strong>`
        : '';

    return `
        <div class="ledger-summary-strip">
            <div>
                🌳 ${de ? 'Konvergenzpunkte aus der Inferenz' : 'Convergence Points from Inference'}:
                <strong style="color:#2ecc71">${ptFromLedger}</strong>
            </div>
            <div style="margin-top:4px;">
                🎖️ ${de ? 'Meilensteine abgeholt' : 'Milestones claimed'}:
                <strong style="color:#3498db">${claimedMs} / ${totalMs}</strong>
                ${claimableBadge}
            </div>
        </div>`;
}

// Single category card for the grid
function _ledger_buildCategoryCard(cat) {
    const de = LANG === 'de';

    const totalMs = cat.milestones.length;
    const claimedMs = cat.milestones.filter(ms => _milestone_isClaimed(ms)).length;
    const hasReady = cat.milestones.some(ms => _milestone_isComplete(ms) && !_milestone_isClaimed(ms));

    // Progress bar shows how far the player is through the NEXT unclaimed milestone
    const nextUnclaimed = cat.milestones.find(ms => !_milestone_isClaimed(ms));
    const barPct = nextUnclaimed ? _milestone_getProgress(nextUnclaimed).pct : 100;

    const cardClass = hasReady
        ? 'ledger-card ledger-card-ready'
        : claimedMs === totalMs
            ? 'ledger-card ledger-card-done'
            : 'ledger-card';

    const notifyDot = hasReady ? `<span class="ledger-card-dot"></span>` : '';

    return `
        <div class="${cardClass}" onclick="_ledger_openCategory('${cat.id}')">
            ${notifyDot}
            <div class="ledger-card-icon">${cat.icon}</div>
            <div class="ledger-card-title">${de ? cat.titleDE : cat.titleEn}</div>
            <div class="ledger-card-prog-bar">
                <div class="ledger-card-prog-fill ${claimedMs === totalMs ? 'ledger-prog-done' : ''}"
                     style="width:${barPct}%"></div>
            </div>
            <div class="ledger-card-sub">
                ${claimedMs} / ${totalMs} ${de ? 'abgeholt' : 'claimed'}
            </div>
        </div>`;
}


// ─────────────────────────────────────────────────────────────
//  DETAIL VIEW  —  all milestones for one category
// ─────────────────────────────────────────────────────────────

function _ledger_renderDetailView(modal) {
    const de = LANG === 'de';
    const cat = LEDGER_CATEGORIES.find(c => c.id === _ledger_activeCategoryId);
    if (!cat) { _ledger_backToGrid(); return; }

    modal.innerHTML = `
        <div class="modal-box quest-log-box">
            <button class="modal-close" onclick="hideQuestLog()">
                ✕ ${de ? 'SCHLIESSEN' : 'CLOSE'}
            </button>
            <div class="modal-title">${cat.icon} ${de ? cat.titleDE : cat.titleEn}</div>

            <button class="ledger-back-btn" onclick="_ledger_backToGrid()">
                ← ${de ? 'Zurück zur Übersicht' : 'Back to Overview'}
            </button>

            <div class="ledger-cat-desc">${de ? cat.descDE : cat.descEn}</div>

            <div class="quest-list">
                ${cat.milestones.map(ms => _ledger_buildMilestoneRow(ms)).join('')}
            </div>
        </div>`;
}

// One milestone row in the detail view
function _ledger_buildMilestoneRow(ms) {
    const de = LANG === 'de';
    const claimed = _milestone_isClaimed(ms);
    const complete = _milestone_isComplete(ms);
    const claimable = complete && !claimed;

    const { current, target, pct } = _milestone_getProgress(ms);

    const rowClass = claimed ? 'quest-row quest-done'
        : claimable ? 'quest-row quest-claimable'
            : 'quest-row quest-active';

    const statusText = claimed ? (de ? '✓ Abgeholt' : '✓ Claimed')
        : claimable ? (de ? '⭐ Jetzt abholen!' : '⭐ Claim now!')
            : (de ? 'In Bearbeitung…' : 'In progress…');

    const label = de ? ms.labelDE : ms.labelEn;

    return `
        <div class="${rowClass}">
            <div class="quest-row-header">
                <div class="quest-title-block">
                    <span class="quest-title">${label}</span>
                </div>
                <span class="quest-status-label">${statusText}</span>
            </div>
            <div class="quest-objectives">
                <div class="quest-obj ${complete ? 'quest-obj-done' : ''}">
                    <div class="quest-obj-top">
                        <span class="quest-obj-label">${complete ? '✓ ' : ''}${label}</span>
                        <span class="quest-obj-count">
                            ${current.toLocaleString()} / ${target.toLocaleString()}
                        </span>
                    </div>
                    <div class="quest-prog-bar">
                        <div class="quest-prog-fill ${complete ? 'quest-prog-done' : ''}"
                             style="width:${pct}%"></div>
                    </div>
                </div>
            </div>
            <div class="quest-reward-row">
                <div class="quest-rewards">
                    ${_ledger_buildRewardChips(ms.reward)}
                </div>
                ${_ledger_buildClaimButton(ms, claimable, claimed)}
            </div>
        </div>`;
}

// Renders the coloured reward chips (PT points + items)
function _ledger_buildRewardChips(reward) {
    const de = LANG === 'de';
    const chips = [];

    if (reward.ptPoints) {
        const label = de ? 'Konvergenzpunkt' : 'Convergence Point';
        chips.push(
            `<span class="quest-reward-pt">🌳 +${reward.ptPoints} ${label}</span>`
        );
    }

    if (reward.items) {
        reward.items.forEach(defId => {
            if (defId === '__random__') {
                chips.push(
                    `<span class="quest-reward-item">🎁 ${de ? 'Zufälliges Item' : 'Random Item'}</span>`
                );
            } else {
                const def = ITEM_DEFS[defId];
                if (def) {
                    chips.push(
                        `<span class="quest-reward-item quest-reward-item-tip"
                            onmouseenter="_questChipHover(this,'${defId}')"
                            onmouseleave="_hideQuestRewardTooltip()"
                        >${def.icon} ${de ? def.nameDE : def.nameEn}</span>`
                    );
                }
            }
        });
    }

    return chips.join('');
}

// Claim / claimed button, or empty string when in-progress
function _ledger_buildClaimButton(ms, claimable, claimed) {
    const de = LANG === 'de';
    if (claimable) {
        return `<button class="quest-claim-btn" onclick="claimQuest('${ms.id}')">
                    🎁 ${de ? 'ABHOLEN' : 'CLAIM'}
                </button>`;
    }
    if (claimed) {
        return `<button class="quest-claim-btn quest-claimed-btn" disabled>
                    ✓ ${de ? 'ABGEHOLT' : 'CLAIMED'}
                </button>`;
    }
    return '';
}




// ─────────────────────────────────────────────────────────────
//  QUEST TOAST NOTIFICATIONS
// ─────────────────────────────────────────────────────────────

let _questToastQueue = [];      // pending toasts waiting to be shown
let _questToastBusy = false;    // prevents overlap

function showQuestToast(milestone, category) {
    _questToastQueue.push({ milestone, category });
    setTimeout(_drainQuestToastQueue, 0);
}

function _drainQuestToastQueue() {
    if (_questToastBusy || !_questToastQueue.length) return;
    const { milestone, category } = _questToastQueue.shift();
    _showQuestToast(milestone, category);
}

function _showQuestToast(milestone, category) {
    _questToastBusy = true;
    document.getElementById('quest-toast')?.remove(); // safety clear

    const el = _buildQuestToastElement(milestone, category);
    document.body.appendChild(el);

    // Trigger CSS transition
    requestAnimationFrame(() => el.classList.add('show'));

    // Show for 3.5s, then dismiss
    setTimeout(() => _dismissQuestToast(el), 3500);
    Audio_Manager.playSFX('milestone');
}

function _buildQuestToastElement(milestone, category) {
    const de = LANG === 'de';

    const catTitle = de ? category.titleDE : category.titleEn;
    const msLabel = de ? milestone.labelDE : milestone.labelEn;
    const headerText = de ? 'Meilenstein erreicht!' : 'Milestone Reached!';

    const el = document.createElement('div');
    el.id = 'quest-toast';
    el.innerHTML = `
        <div class="quest-toast-inner">
            <span class="quest-toast-icon">${category.icon}</span>
            <div class="quest-toast-text">
                <div class="quest-toast-title">⭐ ${headerText}</div>
                <div class="quest-toast-name">${catTitle}: <em>${msLabel}</em></div>
            </div>
        </div>`;
    return el;
}

function _dismissQuestToast(el) {
    el.classList.remove('show');
    setTimeout(() => {
        el.remove();
        _questToastBusy = false;
        setTimeout(_drainQuestToastQueue, 300); // 300ms gap between toasts
    }, 500); // Matches the CSS fade-out duration
}