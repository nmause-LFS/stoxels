// ═══════════════════════════════════════════════
//  WORLD CODE UNLOCK
//  Handles the Moodle badge system. When a player
//  reaches a certain overall score treshold in a 
//  World they earn a unique code that can be entered 
//  in Moodle for a badge. This file checks whether that
//  threshold has been crossed and shows the modal.
// ═══════════════════════════════════════════════

// checkWorldCodes — scans WORLD_CODES to see if any score threshold
//   has just been crossed. Awards codes based on totalScore instead of
//   world completion.
//   Logic per code:
//     1. Skip if the code is already in STATE.unlockedCodes.
//     2. Check if STATE.totalScore >= threshold.
//     3. If yes, add the code to STATE.unlockedCodes and collect it
//        in the local newCodes array.
//   After scanning, saves progress and shows the password modal for any
//   newly unlocked codes.
//   Called from: checkWin() and finishQuiz() in scoring.js.
function checkWorldCodes() {
    const newCodes = []; // codes unlocked during THIS call

    WORLD_CODES.forEach(wc => {
        // Skip codes the player already has
        if (STATE.unlockedCodes.includes(wc.code)) return;

        // Check if total score meets or exceeds the threshold
        if (STATE.totalScore >= wc.threshold) {
            STATE.unlockedCodes.push(wc.code);
            newCodes.push(wc); // queue for display
            trackEvent('achievement_unlocked', {
            code_title: LANG === 'de' ? wc.titleDE : wc.titleEn,
            threshold: wc.threshold,
            total_score: STATE.totalScore,
        });
        }
    });

    save(); // persist the updated unlockedCodes array

    if (newCodes.length) showPwModal(newCodes); // only show modal if something new was earned
}

// showPwModal — builds and displays the password/code modal.
//   Receives an array of newly unlocked world-code objects (each has
//   .code, .titleEn, .titleDE).
//   The modal shows a brief intro paragraph followed by one styled block
//   per code, containing:
//     - the world title (language-aware)
//     - the code itself with a glowing animation (class: pw-unlock-anim)
//     - a hint reminding the player to enter it in Moodle
//   To add more information per code in the future, extend the template
//   literal inside codes.map(…).
function showPwModal(codes) {
    const ct = document.getElementById('pw-content');

    // Update the modal title text (translated)
    document.getElementById('pw-modal')
        .querySelector('.modal-title')
        .textContent = t('pw_title');

    // Build the inner HTML: intro paragraph + one block per code
    ct.innerHTML =
        `<p style="font-size:12px;color:#888;margin-bottom:16px;">${t('pw_intro')}</p>` +
        codes.map(c => `
            <div style="margin-bottom:14px;">
                <!-- World title in the active language -->
                <div style="font-family:var(--PX);font-size:9px;color:var(--purple);margin-bottom:5px;">
                    ${LANG === 'de' ? c.titleDE : c.titleEn}
                </div>
                <!-- The actual code string with glow animation -->
                <div class="pw-unlock-anim">${c.code}</div>
                <!-- Reminder hint -->
                <div style="font-size:11px;color:#666;margin-top:6px;">${t('pw_hint')}</div>
            </div>
        `).join('');

    showModal('pw-modal'); // defined in ui.js — adds class 'show' to the modal backdrop
}