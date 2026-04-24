// ═══════════════════════════════════════════════
//  MAIN  (main.js)
//  This is the entry point — the last script
//  loaded by index.html. By the time it runs,
//  every other module is already defined.
//  It is intentionally kept small: only global
//  bootstrap calls and document-level event
//  listeners live here.
// ═══════════════════════════════════════════════

// Set the initial UI language to English.
// This also triggers setLang() in translations.js which:
//   - marks the EN button as active
//   - fills every [data-t] element with its translated text
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