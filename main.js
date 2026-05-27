
setLang('en');

// Global mouseup listener — ends any paint stroke that started inside the
// puzzle grid. Placed on the document (not the table) so that releasing the
// mouse button outside the grid still stops painting.
// sp() is defined in input.js.
document.addEventListener('mouseup', sp);


// Resize listener — re-scales the puzzle whenever the browser window is
// resized so the grid always fits nicely without overflowing.
// Only fires when the game screen is actually visible to avoid unnecessary
// DOM work on other screens.
// scalePuzzle() is defined in grid.js.
window.addEventListener('resize', () => {
    if (document.getElementById('screen-game').classList.contains('active')) {
        scalePuzzle();
    }
});


// Global keyboard listener — handles the Escape key for navigation.
// Priority order (highest to lowest):
//   1. Quiz overlay is open  → skip the quiz (no bonus awarded)
//   2. Any modal is open     → close all open modals
//   3. Win or lose overlay   → hide the overlay (stay on game screen)
//   4. Anything else         → call goBack() which pops screenHistory
//      (defined in ui.js) to return to the previous screen
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {

        if (typeof _bayesTrapsCleanup === "function") {
            _bayesTrapsCleanup(false);
        }
        if (typeof clearActiveRandomWalkers === "function") {
            clearActiveRandomWalkers();
        }
        // Case 1: quiz is showing
        if (document.getElementById('quiz-overlay').classList.contains('show')) {
            skipQuiz(); // defined in scoring.js
            return;
        }
        // Case 2: a modal backdrop is visible
        if (document.querySelector('.modal-bg.show')) {
            document.querySelectorAll('.modal-bg.show')
                .forEach(m => m.classList.remove('show'));
            return;
        }
        // Case 3: win or lose overlay is showing
        if (document.getElementById('ov-win').classList.contains('show') ||
            document.getElementById('ov-lose').classList.contains('show')) {
            hideOv(); // defined in screens.js
            return;
        }
        // Case 4: normal back navigation
        goBack(); // defined in ui.js
    }
});




// ── Audio bootstrap ──────────────────────────────────────
// Start title music on first user interaction (browser autoplay policy).
// { once: true } means this listener removes itself after firing once.
function _startTitleMusic() {
    Audio_Manager.playBGM('title');
}

document.addEventListener('click', _startTitleMusic, { once: true });



initSettingsControls();   // wire the settings modal controls
applySettings();          // apply saved volume/axis lock values