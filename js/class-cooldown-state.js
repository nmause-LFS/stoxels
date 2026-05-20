

let activeAbilityMode = false;

// Per-skill independent cooldown state.
// Each slot ('active1', 'active2') tracks its own remaining seconds + interval
let cooldownState = {
    active1: { remaining: 0, interval: null },
    active2: { remaining: 0, interval: null },
};



//------------------------------------------------------------------------
//--------------------HELPER FUNCTION-------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function formatCooldown(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`;
}



// getEffectiveCooldown — returns the cooldown for a slot after all passive tree reductions.
// celerity:               −30s all active abilities
// advanced_data_strike:   −30s Data Strike  (active1)
// swift_strike:           −30s Data Strike  (active1)
// accelerated_computation:−30s Data Strike  (active1)
// quick_strike:           −30s Diagonal Strike (active2)
// accelerated_striking:   −30s Diagonal Strike (active2)
function getEffectiveCooldown(slot, baseSeconds) {
    let reduction = 0;

    if (ptHasSkill('celerity')) reduction += 30;

    if (STATE.playerClass === 'statistician') {
        if (slot === 'active1') {
            if (ptHasSkill('advanced_data_strike')) reduction += 30;
            if (ptHasSkill('swift_strike')) reduction += 30;
            if (ptHasSkill('accelerated_computation')) reduction += 30;
        }
        if (slot === 'active2') {
            if (ptHasSkill('quick_strike')) reduction += 30;
            if (ptHasSkill('accelerated_striking')) reduction += 30;
        }
    }


    if (STATE.playerClass === 'mathmagician') {
        if (slot === 'active1') {
            // Arcane Reveal cooldown reductions
            if (ptHasSkill('rapid_revelation')) reduction += 30;
            if (ptHasSkill('accelerated_revelation')) reduction += 30;
        }
        if (slot === 'active2') {
            // Absolute Zero cooldown reductions
            if (ptHasSkill('hastened_zero')) reduction += 30;
            if (ptHasSkill('accelerated_zero')) reduction += 30;
        }
    }

    if (STATE.playerClass === 'probabilist') {
        if (slot === 'active1') {
            // Precision Mark cooldown reductions
            if (ptHasSkill('swift_marking')) reduction += 30;
            if (ptHasSkill('accelerated_marking')) reduction += 30;
        }
        if (slot === 'active2') {
            // Field Scan cooldown reductions
            if (ptHasSkill('swift_scan')) reduction += 30;
            if (ptHasSkill('accelerated_scan')) reduction += 30;
        }
    }



    return Math.max(0, baseSeconds - reduction);
}




//------------------------------------------------------------------------
//------------------------START SLOT COOLDOWN-----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


//   starts an independent countdown for one skill slot.
//   Updates only that slot's button each tick by patching the DOM directly,
//   avoiding a full HUD rebuild on every tick

function startSlotCooldown(slot, seconds) {
    const state = cooldownState[slot];

    // Clear any pre-existing interval for this slot
    if (state.interval) clearInterval(state.interval);
    state.remaining = seconds;

    // Initial render
    _patchCooldownButton(slot);

    state.interval = setInterval(() => {
        state.remaining--;
        if (state.remaining <= 0) {
            state.remaining = 0;
            clearInterval(state.interval);
            state.interval = null;
            buildClassHUD(); // full rebuild to restore ACTIVATE button
        } else {
            _patchCooldownButton(slot);
        }
    }, 1000);
}









//------------------------------------------------------------------------
//----------PATCH / UPDATE COOLDOWN BUTTON TEXT ON ABILITY USE------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// _patchCooldownButton — updates only the button text for one slot
//   without rebuilding the entire HUD. Falls back to full rebuild if
//   the button element can't be found (e.g. panel was just re-rendered).
function _patchCooldownButton(slot) {
    // Update the full cooldown overlay when HUD is expanded
    const section = document.querySelector(
        `#class-hud-panel .chud-active-section[data-slot="${slot}"]`
    );
    if (section) {
        const timerEl = section.querySelector('.chud-cd-timer');
        if (timerEl) timerEl.textContent = formatCooldown(cooldownState[slot].remaining);
    }

    // Also update the minimized bar if it's visible
    if (hudMinimized) patchMinimizedBar();
}


//------------------------------------------------------------------------
//----------PATCH / UPDATE COOLDOWNS ON THE CLASS HUD---------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Updates only the minimized cooldown bar text in-place each tick
// Called from _patchCooldownButton when the HUD is minimized
// Falls back silently if the bar element isn't in the DOM

function patchMinimizedBar() {
    const bar = document.getElementById('chud-mini-bar');
    if (!bar) return;

    const def = CLASS_DEFS[STATE.playerClass];
    if (!def) return;

    const slots = ['active1', 'active2'];

    const parts = slots.map((key, i) => {
        const cd = cooldownState[key].remaining;
        const isReady = cd <= 0;
        const label = LANG === 'de' ? `${i + 1}` : `${i + 1}`;

        return isReady
            ? `<span class="chud-mini-ready">${label}: ${LANG === 'de' ? 'Bereit' : 'Ready'} ✓</span>`
            : `<span class="chud-mini-cd">${label}: ${formatCooldown(cd)}</span>`;
    }).join('<span class="chud-mini-sep">|</span>');

    bar.innerHTML = parts;
}




//------------------------------------------------------------------------
//-------------------------RESET COOLDOWNS--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function resetActiveCooldown() {
    // Clear both slot timers
    ['active1', 'active2'].forEach(slot => {
        if (cooldownState[slot].interval) clearInterval(cooldownState[slot].interval);
        cooldownState[slot].interval = null;
        cooldownState[slot].remaining = 0;
    });
    activeAbilityMode = false;
    correctFillStreak = 0;
    nextPenaltyHalved = false;
    const wrap = document.getElementById('puzzle-scaler-wrap');
    if (wrap) wrap.style.cursor = '';
}





//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------












