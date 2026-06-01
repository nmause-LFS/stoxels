//------------------------------------------------------------------------
//-----------------------MOODLE CODES & REQUIREMENTS----------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Moodle Codes require a certain overall Score and a percentage of all possible achievements


const WORLD_CODES = [
    { threshold: 10000, achPct: 0, code: 'TY_4_Playing_Stoxels', titleEn: 'Code 1', titleDE: 'Code 1' },
    { threshold: 25000, achPct: 0.20, code: '0auf100in3Tagen', titleEn: 'Code 2', titleDE: 'Code 2' },
    { threshold: 50000, achPct: 0.40, code: 'CLT_whats_that', titleEn: 'Code 3', titleDE: 'Code 3' },
    { threshold: 75000, achPct: 0.65, code: 'Var(2X)=4Var(X)', titleEn: 'Code 4', titleDE: 'Code 4' },
    { threshold: 100000, achPct: 0.90, code: 'CentralLimitTheorem', titleEn: 'Code 5', titleDE: 'Code 5' },
];


//------------------------------------------------------------------------
// Helper function to show the Moodle Code Modal when a player has 
// unlocked a new code
//------------------------------------------------------------------------

function showCodesModal(codes) {
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

    showModal('pw-modal'); 
}






//------------------------------------------------------------------------
//---------------Helper function to show a hint for locked codes----------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function showLockedCodeHint(lockedCodes) {
    // Only show the hint for the lowest-tier locked code (avoid spam)
    const { wc, needed, have } = lockedCodes[0];
    const title = LANG === 'de' ? wc.titleDE : wc.titleEn;
    const msg = LANG === 'de'
        ? `🔒 "${title}": Punktzahl erreicht! Noch ${needed - have} Achievements benötigt.`
        : `🔒 "${title}": Score reached! ${needed - have} more achievement tiers needed.`;

    if (typeof showToast === 'function') showToast(msg, 4000);
}





//------------------------------------------------------------------------
// Function to check if the player has reached a certain score treshold
// and achievement percentage, called after beating a level or finishing
// a quiz
//------------------------------------------------------------------------

function checkWorldCodes() {
    const newCodes = [];
    const lockedCodes = []; // met score but not enough achievements yet

    // Total number of achievement tiers across all defs
    const totalTiers = ACHIEVEMENT_DEFS.reduce((s, d) => s + d.tiers.length, 0);
    const unlockedTiers = ACH_STATE.unlocked.length;
    const achPctDone = totalTiers > 0 ? unlockedTiers / totalTiers : 0;

    WORLD_CODES.forEach(wc => {
        // Skip codes the player already has
        if (STATE.unlockedCodes.includes(wc.code)) return;

        const scoreOk = STATE.totalScore >= wc.threshold;
        const achOk = achPctDone >= (wc.achPct || 0);


        if (scoreOk && achOk) {
            // enough score and achievements - unlock the code
            STATE.unlockedCodes.push(wc.code);
            newCodes.push(wc);
        } else if (scoreOk && !achOk) {
            // Score is enough but achievements aren't — show a hint
            lockedCodes.push({ wc, needed: Math.ceil(wc.achPct * totalTiers), have: unlockedTiers });
        }
    });

    save();

    if (newCodes.length) showCodesModal(newCodes);
    if (lockedCodes.length) showLockedCodeHint(lockedCodes);
}



//------------------------------------------------------------------------
//------------------MOODLE CODES SCREEN-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function buildCodesScreen() {
    const body = document.getElementById('codes-body');

    if (!STATE.unlockedCodes.length) {
        // Empty state — tell the player how to earn codes
        body.innerHTML = `
            <div style="padding:24px;text-align:center;">
                <p style="font-size:13px;color:var(--accent2);line-height:2;">
                    ${t('no_codes').replace(/\n/g, '<br>')}
                </p>
            </div>`;
        return;
    }

    // Filter WORLD_CODES to only those the player has earned
    const unlocked = WORLD_CODES.filter(c => STATE.unlockedCodes.includes(c.code));

    body.innerHTML =
        `<div style="padding:18px;"><div class="codes-grid">` +
        unlocked.map(c => `
            <div class="code-card">
                <div class="code-card-title">${LANG === 'de' ? c.titleDE : c.titleEn}</div>
                <div class="code-card-code">${c.code}</div>
                <div class="code-card-hint">${t('pw_hint')}</div>
            </div>`
        ).join('') +
        `</div></div>`;
}


//------------------------------------------------------------------------
//------------------FUNCTION TO SHOW CODES SCREEN-------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function showCodes() {
    buildCodesScreen();
    screenHistory.push('screen-title');
    ss('screen-codes');
}











































