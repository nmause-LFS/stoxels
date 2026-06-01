


// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────

/** How long a quest toast stays fully visible before fading out (ms). */
const QUEST_TOAST_DISPLAY_MS = 3500;

/** Duration of the toast CSS fade-out transition (ms). Must match the CSS. */
const QUEST_TOAST_FADEOUT_MS = 500;

/** Gap between consecutive toasts to prevent them overlapping (ms). */
const QUEST_TOAST_GAP_MS = 300;

let _ledger_activeGroupId = 'progression'; // Default tab


// ─────────────────────────────────────────────────────────────
//  NAVIGATION STATE  (grid overview vs. single-category detail)
// ─────────────────────────────────────────────────────────────

/** Currently open category id, or null when showing the grid overview. */
let _ledger_activeCategoryId = null;

/**
 * Opens the detail view for a category.
 * Called from inline onclick on category cards.
 * @param {string} id - Category id from quests-data.js
 */
function _ledger_openCategory(id) {
    _ledger_activeCategoryId = id;
    renderQuestLog();
}

/**
 * Returns to the category grid from a detail view.
 * Called from the "Back to Overview" button.
 */
function _ledger_backToGrid() {
    _ledger_activeCategoryId = null;
    renderQuestLog();
}


// ─────────────────────────────────────────────────────────────
//  REWARD CHIP TOOLTIP
// ─────────────────────────────────────────────────────────────

/** Cached reference to the floating reward-tooltip element. */
let _questRewardTipEl = null;

/**
 * Returns (or lazily creates) the floating tooltip element used on reward chips.
 * @returns {HTMLElement}
 */
function _ensureQuestRewardTooltip() {
    if (_questRewardTipEl) return _questRewardTipEl;
    _questRewardTipEl = document.createElement('div');
    _questRewardTipEl.id = 'quest-reward-tooltip';
    document.body.appendChild(_questRewardTipEl);
    return _questRewardTipEl;
}

/**
 * Positions and shows the reward tooltip above (or below) an anchor chip element.
 * @param {Object} def       - ITEM_DEFS entry for the item
 * @param {HTMLElement} anchorEl - The chip element that was hovered
 */
function _showQuestRewardTooltip(def, anchorEl) {
    const tip = _ensureQuestRewardTooltip();
    const rc = rarityColors(def.rarity);
    const de = LANG === 'de';

    tip.innerHTML = `
        <div class="inv-tip-name"   style="color:${rc.color}">${def.icon} ${de ? def.nameDE : def.nameEn}</div>
        <div class="inv-tip-rarity" style="color:${rc.color}">${def.rarity.toUpperCase()}</div>
        <div class="inv-tip-desc">${de ? def.descDE : def.descEn}</div>`;
    tip.classList.add('visible');

    _positionTooltipNearAnchor(tip, anchorEl);
}

/**
 * Positions a tooltip element above its anchor, flipping below if too close to the top.
 * Clamps horizontally to stay within the viewport.
 * @param {HTMLElement} tip
 * @param {HTMLElement} anchorEl
 */
function _positionTooltipNearAnchor(tip, anchorEl) {
    // Reset so we can measure the natural size
    tip.style.left = '0px';
    tip.style.top = '0px';

    const ar = anchorEl.getBoundingClientRect();
    const tw = tip.offsetWidth || 220;
    const th = tip.offsetHeight || 70;

    let left = ar.left + ar.width / 2 - tw / 2;
    let top = ar.top - th - 8;

    // Flip below anchor if it would be cut off at the top of the viewport
    if (top < 6) top = ar.bottom + 8;

    // Clamp horizontally within the viewport
    left = Math.max(6, Math.min(left, window.innerWidth - tw - 6));

    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
}

/** Hides the floating reward tooltip. Called from chip onmouseleave. */
function _hideQuestRewardTooltip() {
    if (_questRewardTipEl) _questRewardTipEl.classList.remove('visible');
}

/**
 * Convenience handler attached to chip onmouseenter via inline HTML.
 * Looks up the item def and delegates to _showQuestRewardTooltip.
 * @param {HTMLElement} el
 * @param {string} defId
 */
function _questChipHover(el, defId) {
    const def = ITEM_DEFS[defId];
    if (def) _showQuestRewardTooltip(def, el);
}


// ─────────────────────────────────────────────────────────────
//  MODAL LIFECYCLE
// ─────────────────────────────────────────────────────────────

/**
 * Opens the quest-log modal and renders its current state.
 * Creates the modal element if it doesn't exist yet.
 */
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

/**
 * Closes the quest-log modal and resets navigation back to the grid overview.
 */
function hideQuestLog() {
    _ledger_activeCategoryId = null;
    const modal = document.getElementById('quest-log-modal');
    if (modal) modal.classList.remove('show');
}

/**
 * Re-renders the quest-log modal in-place.
 * Decides whether to show the grid overview or a category detail view.
 * Safe to call when the modal is not open — it will no-op.
 */
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
//  GRID VIEW  —  overview card for every category
// ─────────────────────────────────────────────────────────────

/**
 * Renders the full grid overview into the modal element.
 * @param {HTMLElement} modal
 */

function _ledger_switchGroup(groupId) {
    _ledger_activeGroupId = groupId;
    renderQuestLog();
}


function _ledger_renderGridView(modal) {
    const de = LANG === 'de';

    // Build the Tab Navigation
    const tabsHtml = LEDGER_GROUPS.map(g => {
        const isActive = g.id === _ledger_activeGroupId;
        const label = de ? g.labelDE : g.labelEn;
        const groupHasClaimable = LEDGER_CATEGORIES
            .filter(c => c.groupId === g.id)
            .some(c => c.milestones.some(ms => _milestone_isComplete(ms) && !_milestone_isClaimed(ms)));
        const dot = groupHasClaimable
            ? `<span class="ledger-tab-dot"></span>`
            : '';
        return `<button class="ledger-tab-btn ${isActive ? 'active' : ''}" 
                    onclick="_ledger_switchGroup('${g.id}')">
                ${label}${dot}
            </button>`;
    }).join('');

    // Filter categories to only show the active group
    const visibleCats = LEDGER_CATEGORIES.filter(c => c.groupId === _ledger_activeGroupId);

    // Render the modal
    modal.innerHTML = `
        <div class="modal-box ledger-modal-box">
            <button class="modal-close" onclick="hideQuestLog()">
                ✕ ${de ? 'SCHLIESSEN' : 'CLOSE'}
            </button>
            <div class="modal-title">
                📒 ${de ? 'INFERENZ' : 'INFERENCE'}
            </div>
            
            ${_ledger_buildSummaryStrip()}
            
            <div class="ledger-tabs">
                ${tabsHtml}
            </div>

            <div class="ledger-grid">
                ${visibleCats.map(_ledger_buildCategoryCard).join('')}
            </div>
        </div>`;
}

/**
 * Gathers the numbers needed for the summary strip.
 * Separated from the HTML builder so the data is easy to test or reuse.
 * @returns {{ totalMs: number, claimedMs: number, claimableMs: number, ptFromLedger: number }}
 */
function _ledger_computeSummaryData() {
    let totalMs = 0, claimedMs = 0, claimableMs = 0, ptFromLedger = 0, ptTotal = 0;

    LEDGER_CATEGORIES.forEach(cat => {
        cat.milestones.forEach(ms => {
            totalMs++;
            if (ms.reward.ptPoints) ptTotal += ms.reward.ptPoints;
            if (_milestone_isClaimed(ms)) {
                claimedMs++;
                if (ms.reward.ptPoints) ptFromLedger += ms.reward.ptPoints;
            } else if (_milestone_isComplete(ms)) {
                claimableMs++;
            }
        });
    });

    return { totalMs, claimedMs, claimableMs, ptFromLedger, ptTotal };
}

/**
 * Builds the summary strip HTML shown above the category grid.
 * Displays total PT points earned, milestones claimed, and a claimable badge if relevant.
 * @returns {string} HTML string
 */
function _ledger_buildSummaryStrip() {
    const de = LANG === 'de';
    const { totalMs, claimedMs, claimableMs, ptFromLedger, ptTotal } = _ledger_computeSummaryData();

    const claimableBadge = claimableMs > 0
        ? ` &nbsp;·&nbsp;<strong style="color:#f39c12;animation:questPulse 1.2s ease-in-out infinite;display:inline-block;">
               ⭐ ${claimableMs} ${de ? 'einlösbar' : 'claimable'}
           </strong>`
        : '';

    return `
        <div class="ledger-summary-strip">
            🌳 ${de ? 'Convergence Points from Inference' : 'Convergence Points from Inference'}:
            <strong style="color:#2ecc71">${ptFromLedger} / ${ptTotal}</strong>
            &nbsp;&nbsp; <br>
            🎖️ ${de ? 'Meilensteine abgeholt' : 'Milestones claimed'}:
            <strong style="color:#3498db">${claimedMs} / ${totalMs}</strong>
            ${claimableBadge}
        </div>`;
}

/**
 * Builds the HTML for a single category card in the grid overview.
 * The card's border colour and animated dot reflect its current claim state.
 * @param {Object} cat - A category object from LEDGER_CATEGORIES
 * @returns {string} HTML string
 */
function _ledger_buildCategoryCard(cat) {
    const de = LANG === 'de';

    const totalMs = cat.milestones.length;
    const claimedMs = cat.milestones.filter(ms => _milestone_isClaimed(ms)).length;
    const hasReady = cat.milestones.some(ms => _milestone_isComplete(ms) && !_milestone_isClaimed(ms));

    // Progress bar reflects how far the player is through the NEXT unclaimed milestone
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

/**
 * Renders the detail view for the active category into the modal element.
 * Falls back to the grid view if the category id is invalid.
 * @param {HTMLElement} modal
 */
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

/**
 * Derives the display state for a milestone row from its claimed/complete status.
 * Keeps the HTML builder clean by centralising all the conditional logic here.
 * @param {Object} ms
 * @returns {{ rowClass: string, statusText: string, claimable: boolean, claimed: boolean }}
 */
function _ledger_getMilestoneDisplayState(ms) {
    const de = LANG === 'de';
    const claimed = _milestone_isClaimed(ms);
    const complete = _milestone_isComplete(ms);
    const claimable = complete && !claimed;

    const rowClass = claimed ? 'quest-row quest-done'
        : claimable ? 'quest-row quest-claimable'
            : 'quest-row quest-active';

    const statusText = claimed ? (de ? '✓ Abgeholt' : '✓ Claimed')
        : claimable ? (de ? '⭐ Jetzt abholen!' : '⭐ Claim now!')
            : (de ? 'In Bearbeitung…' : 'In progress…');

    return { rowClass, statusText, claimable, claimed };
}

/**
 * Builds the HTML for a single milestone row in the detail view.
 * @param {Object} ms - A milestone object from quests-data.js
 * @returns {string} HTML string
 */
function _ledger_buildMilestoneRow(ms) {
    const de = LANG === 'de';
    const { rowClass, statusText, claimable, claimed } = _ledger_getMilestoneDisplayState(ms);
    const { current, target, pct } = _milestone_getProgress(ms);
    const complete = _milestone_isComplete(ms);
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

/**
 * Builds the coloured reward chip HTML for a milestone's reward definition.
 * PT-point chips are green; item chips are orange with a hover tooltip.
 * @param {Object} reward - The ms.reward object
 * @returns {string} HTML string
 */
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
            chips.push(defId === '__random__'
                ? `<span class="quest-reward-item">🎁 ${de ? 'Zufälliges Item' : 'Random Item'}</span>`
                : _ledger_buildItemChip(defId, de)
            );
        });
    }

    return chips.join('');
}

/**
 * Builds a single named-item reward chip with a hover tooltip.
 * @param {string} defId
 * @param {boolean} de - True if German locale
 * @returns {string} HTML string
 */
function _ledger_buildItemChip(defId, de) {
    const def = ITEM_DEFS[defId];
    if (!def) return '';
    return `
        <span class="quest-reward-item quest-reward-item-tip"
              onmouseenter="_questChipHover(this,'${defId}')"
              onmouseleave="_hideQuestRewardTooltip()">
            ${def.icon} ${de ? def.nameDE : def.nameEn}
        </span>`;
}

/**
 * Builds the claim/claimed button for a milestone row, or an empty string
 * if the milestone is still in progress (no button shown).
 * @param {Object} ms
 * @param {boolean} claimable
 * @param {boolean} claimed
 * @returns {string} HTML string
 */
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
//  Toasts are queued so they never overlap each other.
// ─────────────────────────────────────────────────────────────

/** Queue of pending { milestone, category } objects waiting to be displayed. */
let _questToastQueue = [];

/** True while a toast is currently being shown (prevents overlap). */
let _questToastBusy = false;

/**
 * Public entry point — queues a "milestone reached" toast notification.
 * Called from quests-stats.js when a milestone becomes complete.
 * @param {Object} milestone
 * @param {Object} category
 */
function showQuestToast(milestone, category) {
    _questToastQueue.push({ milestone, category });
    // Use setTimeout 0 so callers finish their stack frame first
    setTimeout(_drainQuestToastQueue, 0);
}

/**
 * Dequeues and displays the next toast if none is currently showing.
 */
function _drainQuestToastQueue() {
    if (_questToastBusy || !_questToastQueue.length) return;
    const { milestone, category } = _questToastQueue.shift();
    _showQuestToast(milestone, category);
}

/**
 * Displays a single toast notification.
 * Sets the busy flag, builds the DOM element, triggers the CSS show transition,
 * and schedules auto-dismiss.
 * @param {Object} milestone
 * @param {Object} category
 */
function _showQuestToast(milestone, category) {
    _questToastBusy = true;

    // Safety-clear any element that somehow wasn't removed
    document.getElementById('quest-toast')?.remove();

    const el = _buildQuestToastElement(milestone, category);
    document.body.appendChild(el);

    // Trigger the CSS slide-in transition on the next paint
    requestAnimationFrame(() => el.classList.add('show'));

    setTimeout(() => _dismissQuestToast(el), QUEST_TOAST_DISPLAY_MS);
    Audio_Manager.playSFX('milestone');
}

/**
 * Builds and returns the toast DOM element (not yet appended to the document).
 * @param {Object} milestone
 * @param {Object} category
 * @returns {HTMLElement}
 */
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

/**
 * Slides the toast out, removes it from the DOM, clears the busy flag,
 * and schedules the next drain after the gap delay.
 * @param {HTMLElement} el
 */
function _dismissQuestToast(el) {
    el.classList.remove('show');
    setTimeout(() => {
        el.remove();
        _questToastBusy = false;
        // Brief gap between toasts so they don't feel like they're stacking
        setTimeout(_drainQuestToastQueue, QUEST_TOAST_GAP_MS);
    }, QUEST_TOAST_FADEOUT_MS);
}