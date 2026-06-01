let activeAbilityMode = false;

// Per-skill independent cooldown state.
// Each slot ('active1', 'active2') tracks its own remaining seconds + interval
// active3 / active4 are the two ascendency skill slots
let cooldownState = {
    active1: { remaining: 0, interval: null },
    active2: { remaining: 0, interval: null },
    active3: { remaining: 0, interval: null },
    active4: { remaining: 0, interval: null },
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
// swift_strike:           −15s Data Strike  (active1)
// accelerated_computation:−15s Data Strike  (active1)
// quick_strike:           −30s Diagonal Strike (active2)
// accelerated_striking:   −30s Diagonal Strike (active2)
// signal_to_noise:        -15s all active abilities
// keystone_the_oracle:    -30s all active abilities (only on large or massive grids)
// degrees_of_freedom:     -30s all active abilities
// frequentists_burden:    -15s all active abilities
function getEffectiveCooldown(slot, baseSeconds) {
    let reduction = 0;

    if (ptHasSkill('celerity')) reduction += 30;
    if (ptHasSkill('signal_to_noise')) reduction += 15;
    if (ptHasSkill('keystone_the_oracle') && window._oracleActive === true) reduction += 30;
    if (ptHasSkill('keystone_degrees_of_freedom')) reduction += 30;
    if (ptHasSkill('keystone_entropy_drain')) reduction += 30;
    if (ptHasSkill('keystone_frequentists_burden')) reduction += 15;

    if (STATE.playerClass === 'statistician') {
        if (slot === 'active1') {
            if (ptHasSkill('advanced_data_strike')) reduction += 30;
            if (ptHasSkill('swift_strike')) reduction += 15;
            if (ptHasSkill('accelerated_computation')) reduction += 15;
        }
        if (slot === 'active2') {
            if (ptHasSkill('quick_strike')) reduction += 15;
            if (ptHasSkill('accelerated_striking')) reduction += 15;
        }
    }


    if (STATE.playerClass === 'mathmagician') {
        if (slot === 'active1') {
            // Arcane Reveal cooldown reductions
            if (ptHasSkill('rapid_revelation')) reduction += 15;
            if (ptHasSkill('accelerated_revelation')) reduction += 15;
        }
        if (slot === 'active2') {
            // Absolute Zero cooldown reductions
            if (ptHasSkill('hastened_zero')) reduction += 15;
            if (ptHasSkill('accelerated_zero')) reduction += 15;
        }
    }

    if (STATE.playerClass === 'probabilist') {
        if (slot === 'active1') {
            // Precision Mark cooldown reductions
            if (ptHasSkill('swift_marking')) reduction += 15;
            if (ptHasSkill('accelerated_marking')) reduction += 15;
        }
        if (slot === 'active2') {
            // Field Scan cooldown reductions
            if (ptHasSkill('swift_scan')) reduction += 15;
            if (ptHasSkill('accelerated_scan')) reduction += 15;
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
            _showCooldownReadyToast(slot);
            buildClassHUD(); // full rebuild to restore ACTIVATE button
        } else {
            _patchCooldownButton(slot);
        }
    }, 1000);
}


// _showCooldownReadyToast — shows a toast when an ability comes off cooldown.
function _showCooldownReadyToast(slot) {
    // Don't fire if the player has already left the game screen
    if (!document.getElementById('screen-game')?.classList.contains('active')) return;

    let abilityData = null;
    const slotIndex = { active1: '1', active2: '2', active3: '3', active4: '4' }[slot] || slot;

    if (slot === 'active3' || slot === 'active4') {
        const asc = STATE.playerAscendency ? ASCENDENCY_DEFS[STATE.playerAscendency] : null;
        if (!asc) return;
        abilityData = slot === 'active3' ? asc.active1 : asc.active2;
    } else {
        const def = CLASS_DEFS[STATE.playerClass];
        if (!def) return;
        abilityData = def[slot];
    }

    if (!abilityData) return;
    const name = LANG === 'de' ? (abilityData.nameDE || abilityData.nameEn) : abilityData.nameEn;
    showToast(`✅ [${slotIndex}] ${name} — ${LANG === 'de' ? 'Bereit!' : 'Ready!'}`);
    Audio_Manager.playSFX('abilityReady');
}







//------------------------------------------------------------------------
//----------PATCH / UPDATE COOLDOWN BUTTON TEXT ON ABILITY USE------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// _patchCooldownButton — updates only the button text for one slot
//   without rebuilding the entire HUD. Falls back to full rebuild if
//   the button element can't be found (e.g. panel was just re-rendered).
function _patchCooldownButton(slot) {
    const btn = document.querySelector(
        `#class-hud-panel .chud-skill-btn[data-slot="${slot}"]`
    );
    if (btn) {
        const cdEl = btn.querySelector('.chud-btn-cd');
        if (cdEl) {
            cdEl.textContent = formatCooldown(cooldownState[slot].remaining);
        }
    }
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
    // Clear all slot timers (base + ascendency)
    ['active1', 'active2', 'active3', 'active4'].forEach(slot => {
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









//------------------------------------------------------------------------
//---------------------------KEYBOARD SHORTCUTS---------------------------
//------------------------------------------------------------------------

function _initClassAbilityHotkeys() {
    document.addEventListener('keydown', (e) => {
        // Ignore if focus is in a text input / textarea
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;

        // Ignore if any modal overlay is open
        if (document.querySelector('.modal-bg.show, .cs-overlay.show, #class-selection-overlay.show')) return;

        if (!STATE.playerClass || isClassless() || dead) return;

        if (e.key === '1') { e.preventDefault(); toggleActiveAbility('active1'); }
        if (e.key === '2') { e.preventDefault(); toggleActiveAbility('active2'); }
        if (e.key === '3') { e.preventDefault(); toggleActiveAbility('active3'); }
        if (e.key === '4') { e.preventDefault(); toggleActiveAbility('active4'); }

        // Pressing Escape cancels an armed ability
        if (e.key === 'Escape' && activeAbilityMode) { _setAbilityMode(false); buildClassHUD(); }
    });
}

_initClassAbilityHotkeys();