// ============================================================
//  ui-events.js
//  All DOM event listeners for static HTML elements
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ── Helpers ─────────────────────────────────────────────

    /** Attach a click listener by element id. Warns if id is missing. */
    function onClick(id, fn) {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', fn);
        else console.warn(`ui-events: element #${id} not found`);
    }

    /** Close a modal when its [data-modal-close] button is clicked. */
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => hideModal(btn.dataset.modalClose));
    });


    // ── Title screen ────────────────────────────────────────

    onClick('btn-play', () => showTutorial());
    onClick('btn-how-to-play', () => showModal('tut-modal'));
    onClick('btn-highscores', () => showHS());
    onClick('btn-codes', () => showCodes());
    onClick('btn-achievements', () => showAchievements());
    onClick('btn-reset', () => showModal('reset-modal'));

    // Language switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLang(btn.dataset.lang);
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });


    // ── Game setup screen ───────────────────────────────────

    // Difficulty buttons
    document.querySelectorAll('[data-diff]').forEach(btn => {
        btn.addEventListener('click', () => selDiff(btn));
    });

    // Modifier toggle buttons
    document.querySelectorAll('[data-mod]').forEach(btn => {
        btn.addEventListener('click', () => togMod(btn));
    });

    onClick('btn-start-setup', () => startSetup());
    onClick('btn-setup-back', () => showTitle());


    // ── Reset modal ─────────────────────────────────────────

    onClick('btn-confirm-reset', () => confirmReset());


    // ── Level select screen ──────────────────────────────────

    onClick('btn-levels-back', () => showSetup());
    onClick('btn-go-passive-tree', () => showPassiveTree());



    // ── In-game ──────────────────────────────────────────────

    onClick('btn-go-levels', () => goLevels());

    // Puzzle table: suppress context menu and clear hover on mouse leave
    const ptable = document.getElementById('ptable');
    if (ptable) {
        ptable.addEventListener('contextmenu', e => e.preventDefault());
        ptable.addEventListener('mouseleave', () => {
            clearHover();
            hoverRow = -1;
            hoverCol = -1;
        });
    }


    // ── Win / Lose overlays ──────────────────────────────────

    onClick('btn-next-lvl', () => nextLvl());
    onClick('btn-win-retry', () => replayLvl());
    onClick('btn-win-levels', () => goLevels());

    onClick('btn-lose-retry', () => replayLvl());
    onClick('btn-lose-levels', () => goLevels());


    // ── Quiz overlay ─────────────────────────────────────────

    onClick('quiz-input-submit', () => answerQuizInput());
    onClick('quiz-tutor-btn', () => quizUseTutor());
    onClick('quiz-continue', () => finishQuiz());
    onClick('btn-skip-quiz', () => skipQuiz());


    // ── Tutorial screen ──────────────────────────────────────

    onClick('btn-skip-tutorial', () => finishTutorial());
    onClick('tut-prev-btn', () => prevTutStep());
    onClick('tut-next-btn', () => advanceTutStep());


    // ── Math gate modal ──────────────────────────────────────

    onClick('btn-mg-close', () => hideMathGate());
    onClick('mg-submit-btn', () => submitMathGate());
    onClick('mg-tutor-btn', () => mgUseTutor());
    onClick('mg-new-q-btn', () => mgNewQuestion());

    // Allow submitting with Enter key in the math gate input
    const mgInput = document.getElementById('mg-answer-input');
    if (mgInput) {
        mgInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') submitMathGate();
        });
    }


    // ── Highscores / Codes screens ───────────────────────────

    onClick('btn-hs-back', () => showTitle());
    onClick('btn-codes-back', () => showTitle());


    // ── Achievements screen ──────────────────────────────────

    onClick('btn-ach-back', () => goBack());
    onClick('btn-reset-achievements', () => resetAchievements());


    // ── Probability tree screen ──────────────────────────────

    onClick('btn-pt-back', () => goBack());

});