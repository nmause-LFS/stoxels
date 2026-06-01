// ═══════════════════════════════════════════════════════════════════════════════
//
//  quests-styles.js  —  Injects all Ledger / Quest CSS once on load
//
//  No dependencies. Safe to load before the DOM is ready (uses
//  document.head.appendChild which works as soon as <head> exists).
//
//  If you prefer to keep styles in your main .css file, move the rules
//  there and delete this file. Just ensure the selectors listed here are
//  present before showQuestLog() is called.
//
// ═══════════════════════════════════════════════════════════════════════════════

(function _ledger_injectStyles() {
    if (document.getElementById('quest-styles')) return;   // already injected

    const style = document.createElement('style');
    style.id = 'quest-styles';
    style.textContent = `

    /* ── Badge on the toolbar button ─────────────────────────────────────── */
    .quest-badge {
        display: inline-block;
        background: #e74c3c;
        color: #fff;
        font-family: var(--PX, monospace);
        font-size: 9px;
        padding: 1px 5px;
        border-radius: 2px;
        margin-left: 4px;
        vertical-align: middle;
        animation: questPulse 1.2s ease-in-out infinite;
    }
    @keyframes questPulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.45; }
    }


    /* ── Modal sizing ─────────────────────────────────────────────────────── */
    .ledger-modal-box {
        width: min(1000px, 96vw);
        max-height: 88vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0;
        padding-bottom: 20px;
    }
    .quest-log-box {
        width: min(1000px, 96vw);
        max-height: 86vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0;
        padding-bottom: 16px;
    }


    /* ── Summary strip ────────────────────────────────────────────────────── */
    .ledger-summary-strip {
        font-family: var(--PX, monospace);
        font-size: 10px;
        color: var(--accent2, #aaa);
        background: rgba(46, 204, 113, 0.06);
        border: 1px solid rgba(46, 204, 113, 0.2);
        padding: 8px 12px;
        margin-bottom: 16px;
        line-height: 1.8;
    }


    /* ── Category grid ────────────────────────────────────────────────────── */
    .ledger-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 8px;
    }


    /* ── Category card ────────────────────────────────────────────────────── */
    .ledger-card {
        position: relative;
        border: 1px solid var(--border2, #333);
        padding: 12px 10px 10px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        transition: border-color 0.18s, background 0.18s;
        text-align: center;
    }
    .ledger-card:hover {
        border-color: var(--accent, #fff);
        background: rgba(255, 255, 255, 0.03);
    }
    .ledger-card-done {
        border-color: #2ecc71;
        opacity: 0.55;
    }
    .ledger-card-ready {
        border-color: #f39c12;
        background: rgba(243, 156, 18, 0.04);
        animation: questGlow 2s ease-in-out infinite;
    }
    @keyframes questGlow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(243, 156, 18, 0); }
        50%       { box-shadow: 0 0 8px 2px rgba(243, 156, 18, 0.2); }
    }

    /* Pulsing dot in top-right of claimable cards */
    .ledger-card-dot {
        position: absolute;
        top: 6px;
        right: 7px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #f39c12;
        animation: questPulse 1.2s ease-in-out infinite;
    }

    .ledger-card-icon  { font-size: 22px; line-height: 1; }
    .ledger-card-title {
        font-family: var(--PX, monospace);
        font-size: 9px;
        color: var(--accent, #fff);
        letter-spacing: 0.6px;
        line-height: 1.4;
    }
    .ledger-card-prog-bar {
        width: 100%;
        height: 3px;
        background: var(--border2, #2a2a2a);
        border-radius: 2px;
        overflow: hidden;
        margin-top: 2px;
    }
    .ledger-card-prog-fill {
        height: 100%;
        background: #3498db;
        border-radius: 2px;
        transition: width 0.3s;
    }
    .ledger-prog-done { background: #2ecc71; }
    .ledger-card-sub {
        font-family: var(--PX, monospace);
        font-size: 8px;
        color: var(--accent2, #666);
    }


    /* ── Back button ──────────────────────────────────────────────────────── */
    .ledger-back-btn {
        font-family: var(--PX, monospace);
        font-size: 9px;
        letter-spacing: 1px;
        background: transparent;
        border: 1px solid var(--border2, #333);
        color: var(--accent2, #aaa);
        padding: 6px 12px;
        cursor: pointer;
        align-self: flex-start;
        margin-bottom: 10px;
        transition: border-color 0.15s, color 0.15s;
    }
    .ledger-back-btn:hover {
        border-color: var(--accent, #fff);
        color: var(--accent, #fff);
    }


    /* ── Category description blurb ───────────────────────────────────────── */
    .ledger-cat-desc {
        font-family: var(--PX, monospace);
        font-size: 9px;
        color: var(--accent2, #aaa);
        border-left: 2px solid rgba(52, 152, 219, 0.4);
        padding: 6px 10px;
        margin-bottom: 12px;
        line-height: 1.7;
        font-style: italic;
    }


    /* ── Milestone list ───────────────────────────────────────────────────── */
    .quest-list {
        display: flex;
        flex-direction: column;
        gap: 9px;
    }

    .quest-row {
        border: 1px solid var(--border2, #333);
        padding: 12px 13px;
        display: flex;
        flex-direction: column;
        gap: 7px;
    }
    .quest-row.quest-done      { border-color: #2ecc71; opacity: 0.6; }
    .quest-row.quest-claimable {
        border-color: #f39c12;
        background: rgba(243, 156, 18, 0.05);
        animation: questGlow 2s ease-in-out infinite;
    }

    .quest-row-header {
        display: flex;
        align-items: flex-start;
        gap: 10px;
    }
    .quest-title-block {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    .quest-title {
        font-family: var(--PX, monospace);
        font-size: 11px;
        color: var(--accent, #fff);
        letter-spacing: 1px;
    }
    .quest-status-label {
        font-family: var(--PX, monospace);
        font-size: 9px;
        color: var(--accent2, #aaa);
        white-space: nowrap;
        flex-shrink: 0;
    }
    .quest-claimable .quest-status-label { color: #f39c12; }
    .quest-done      .quest-status-label { color: #2ecc71; }


    /* ── Objective block with progress bar ───────────────────────────────── */
    .quest-objectives {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .quest-obj {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    .quest-obj-top {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 6px;
    }
    .quest-obj-label {
        font-family: var(--PX, monospace);
        font-size: 9px;
        color: var(--accent2, #aaa);
    }
    .quest-obj-count {
        font-family: var(--PX, monospace);
        font-size: 8px;
        color: #555;
        white-space: nowrap;
    }
    .quest-obj-done .quest-obj-label { color: #2ecc71; }
    .quest-obj-done .quest-obj-count { color: #2ecc71; }

    .quest-prog-bar {
        height: 3px;
        background: var(--border2, #2a2a2a);
        border-radius: 2px;
        overflow: hidden;
        width: 100%;
    }
    .quest-prog-fill {
        height: 100%;
        background: #3498db;
        border-radius: 2px;
        transition: width 0.3s;
    }
    .quest-prog-done { background: #2ecc71; }


    /* ── Reward row: chips + claim button ─────────────────────────────────── */
    .quest-reward-row {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }
    .quest-rewards {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        flex: 1;
    }
    .quest-reward-pt {
        font-family: var(--PX, monospace);
        font-size: 9px;
        color: #2ecc71;
        background: rgba(46, 204, 113, 0.1);
        border: 1px solid rgba(46, 204, 113, 0.28);
        padding: 2px 7px;
    }
    .quest-reward-item {
        font-family: var(--PX, monospace);
        font-size: 9px;
        color: #f39c12;
        background: rgba(243, 156, 18, 0.09);
        border: 1px solid rgba(243, 156, 18, 0.28);
        padding: 2px 7px;
    }

    .quest-claim-btn {
        font-family: var(--PX, monospace);
        font-size: 9px;
        letter-spacing: 1px;
        padding: 5px 13px;
        border: 1px solid #f39c12;
        background: rgba(243, 156, 18, 0.1);
        color: #f39c12;
        cursor: pointer;
        flex-shrink: 0;
        transition: background 0.15s;
    }
    .quest-claim-btn:hover       { background: rgba(243, 156, 18, 0.24); }
    .quest-claimed-btn           {
        border-color: #2ecc71;
        background: rgba(46, 204, 113, 0.07);
        color: #2ecc71;
        cursor: default;
    }
    .quest-claimed-btn:hover     { background: rgba(46, 204, 113, 0.07); }

/* ── Quest / Milestone Toast Notification ── */
#quest-toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    transform: translateY(150%);
    opacity: 0;
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease;
    z-index: 9999;
    pointer-events: none; /* Let clicks pass through to the game */
}

#quest-toast.show {
    transform: translateY(0);
    opacity: 1;
}

.quest-toast-inner {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(20, 20, 20, 0.95);
    border: 1px solid #f39c12;
    border-left: 4px solid #f39c12;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    padding: 12px 16px;
    border-radius: 4px;
}

.quest-toast-icon {
    font-size: 28px;
    line-height: 1;
}

.quest-toast-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.quest-toast-title {
    font-family: var(--PX, monospace);
    font-size: 10px;
    color: #f39c12;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.quest-toast-name {
    font-family: var(--PX, monospace);
    font-size: 11px;
    color: #fff;
}

.quest-toast-name em {
    color: #aaa;
    font-style: normal;
}





    `;

    document.head.appendChild(style);
})();