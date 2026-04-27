// ═══════════════════════════════════════════════
//  UI  (ui.js)
//  Screen navigation, modal helpers, the Setup
//  screen's difficulty/modifier controls, and the
//  title-screen pixel-art decoration.
//
//  SCREEN SYSTEM OVERVIEW:
//  Only one <div class="screen"> is visible at a
//  time (the one with class 'active'). Switching
//  screens is done by calling ss(id). Navigation
//  history is tracked in screenHistory (state.js)
//  so the Escape key can always go back correctly.
// ═══════════════════════════════════════════════

// ── Core screen switcher ──────────────────────

// ss(id) — low-level screen switch.
//   Removes 'active' from every screen, then adds
//   it to the one with the given id. All other
//   navigation functions call this internally.
function ss(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// ── Named navigation helpers ──────────────────
// Each function has a specific job beyond just switching screens:
// stopping the timer, pushing to history, rebuilding dynamic content, etc.

// showTitle — returns to the title screen from anywhere.
//   Stops the timer (safety net) and clears the history stack so Escape
//   from the title screen doesn't try to go further back.
function showTitle() {
    stopTimer();
    screenHistory = [];
    ss('screen-title');
}

// showSetup — opens the difficulty / modifier Setup screen.
//   Refreshes the two description lines so they always show current values
//   even if the player changed settings and came back.
function showSetup() {
    stopTimer();
    screenHistory.push('screen-title'); // Escape from Setup → title
    updDiffDesc();
    updModDesc();
    ss('screen-setup');
}

// startSetup — called by the "Select Level" button on the Setup screen.
//   Builds (or rebuilds) the level-select grid before showing it so any
//   newly completed levels are reflected immediately.
function startSetup() {
    buildLS(); // screens.js — builds level cards
    screenHistory.push('screen-setup'); // Escape from levels → setup
    ss('screen-levels');
}

// showHS — opens the Highscores screen.
//   Rebuilds the table so it always shows the latest data.
function showHS() {
    buildHS(); // screens.js
    screenHistory.push('screen-title');
    ss('screen-hs');
}

// showCodes — opens the My Codes screen.
//   Rebuilds the code cards so newly unlocked codes appear immediately.
function showCodes() {
    buildCodesScreen(); // screens.js
    screenHistory.push('screen-title');
    ss('screen-codes');
}


// showTutorial — opens the tutorial screen.
//   If the tutorial was already completed, goes straight to setup instead.
function showTutorial() {
    if (STATE.tutorialDone) {
        showSetup();
        return;
    }
    screenHistory.push('screen-title');
    showTutorialScreen(); // defined in tutorial.js
}





// goLevels — navigates from the game screen to the level-select screen.
//   Also hides the win/lose overlays and closes any open quiz, since
//   this can be called mid-overlay via the "LEVELS" button.
function goLevels() {
    hideOv();    // screens.js — hides win and lose overlays
    closeQuiz(); // scoring.js — hides the quiz overlay
    buildLS();
    ss('screen-levels');
}

// ── Modal helpers ─────────────────────────────

// showModal(id) / hideModal(id) — toggle the 'show' class on a modal backdrop.
//   The CSS rule  .modal-bg.show { display: flex }  makes it visible.
//   Used for: tutorial, reset-confirm, password/code modals.
function showModal(id) { document.getElementById(id).classList.add('show'); }
function hideModal(id) { document.getElementById(id).classList.remove('show'); }

// goBack — universal "go back" handler.
//   Called by the Escape key (main.js) and by back buttons.
//   Priority:
//   1. If a modal is open, close it (don't navigate away from the screen).
//   2. Pop the most recent screen from screenHistory.
//      Special case: if popping leads back to 'screen-game', call goLevels()
//      instead of ss() directly — this ensures the level-select is rebuilt
//      and overlays are cleared properly.
//   3. If history is empty (shouldn't normally happen), fall back to title.
function goBack() {
    const openModal = document.querySelector('.modal-bg.show');
    if (openModal) {
        openModal.classList.remove('show');
        return;
    }

    if (screenHistory.length) {
        const prev = screenHistory.pop();
        if (prev === 'screen-game') {
            goLevels();
            return;
        }
        stopTimer();
        if (prev === 'screen-levels') {
            buildLS(); // ← rebuild so completion state is fresh
        }
        ss(prev);
    } else {
        showTitle();
    }
}


// ── Reset ─────────────────────────────────────

// confirmReset — called when the player clicks "YES, RESET EVERYTHING".
//   1. Closes the confirm modal.
//   2. Removes the save from localStorage entirely.
//   3. Resets the in-memory STATE object to factory defaults
//      (must match the structure in initState() in state.js).
//   4. Returns to the title screen and shows a toast confirmation.
//   NOTE: This is irreversible — there is intentionally no undo.
function confirmReset() {
    hideModal('reset-modal');
    localStorage.removeItem('stoxels'); // wipe the save key
    // Re-initialise in-memory state (mirrors the fresh object in state.js)
    STATE = {
        totalScore: 0,
        levelHS: {},
        inventory: [],
        unlockedCodes: [],
        done: [],
        bonusDone: []
    };
    showTitle();
    showToast(t('toast_reset'));
}


// ═══════════════════════════════════════════════
//  DIFFICULTY & MODIFIERS UI  (Setup screen)
// ═══════════════════════════════════════════════

// selDiff(btn) — called when the player clicks a difficulty button.
//   Updates the global curDiff (config.js), moves the 'sel' highlight to
//   the clicked button, and refreshes both description lines.
function selDiff(btn) {
    curDiff = btn.dataset.diff; // 'easy' | 'normal' | 'hard'
    document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    updDiffDesc();
    updModDesc(); // modifier description may reference difficulty context
}

// togMod(btn) — toggles a modifier on or off when its button is clicked.
//   Uses the button's data-mod attribute to know which modifier to flip.
//   The 'sel-yellow' CSS class provides the yellow highlighted state.
function togMod(btn) {
    const m = btn.dataset.mod;   // 'timetrial' | 'hardcore' | 'ironman'
    curMods[m] = !curMods[m];    // flip the boolean in config.js
    btn.classList.toggle('sel-yellow', curMods[m]);
    updModDesc();
}

// updDiffDesc — refreshes the small description text below the difficulty
//   buttons (e.g. "Penalties ×2 · Score multiplier ×1").
//   Uses the t() helper so it respects the active language.
function updDiffDesc() {
    const el = document.getElementById('diff-desc');
    if (el) el.textContent = t('diff_desc_' + curDiff);
}

// updModDesc — refreshes the modifier description area below the modifier
//   buttons. Shows a neutral message when nothing is active, or builds a
//   coloured line per active modifier using their brand colours and
//   translated names. Each modifier has a short key alias (tt/hc/im) used
//   to construct the translation keys (mod_tt, mod_desc_tt, etc.).
function updModDesc() {
    const el = document.getElementById('mod-desc');
    if (!el) return;

    const active = Object.keys(curMods).filter(m => curMods[m]);

    if (!active.length) {
        el.textContent = t('mod_desc_none'); // "No modifiers. Pure puzzle mode."
        return;
    }

    // Map each active modifier to a coloured description line
    const colorMap = { timetrial: 'var(--orange)', hardcore: 'var(--red)', ironman: 'var(--purple)' };
    const keyMap = { timetrial: 'tt', hardcore: 'hc', ironman: 'im' };

    el.innerHTML = active.map(m =>
        `<span style="color:${colorMap[m]}">${t('mod_' + keyMap[m])}</span> — ${t('mod_desc_' + keyMap[m])}`
    ).join('<br>');
}


// ═══════════════════════════════════════════════
//  TITLE SCREEN DECORATION
//  An IIFE (immediately-invoked function) that
//  builds the small pixel-art grid shown at the
//  bottom of the title screen. Each row is an
//  array of 0s and 1s — 1 = visible cyan cell.
//  The pattern spells out a simple cross/sigma
//  shape that fits the maths theme.
//  To change the pattern, edit the 2-D array below.
// ═══════════════════════════════════════════════
(() => {
    const d = document.getElementById('tdeco');
    [
        [0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1],
        [0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0]
    ].forEach(row => {
        row.forEach(v => {
            const c = document.createElement('div');
            c.className = 'title-deco-cell';
            c.style.opacity = v ? '1' : '0'; // 0-cells are invisible but keep the grid spacing
            d.appendChild(c);
        });
    });
})();

// Disable the browser's right-click context menu everywhere on the page.
// This prevents it from appearing when right-clicking puzzle cells to mark them.
document.addEventListener('contextmenu', e => e.preventDefault());