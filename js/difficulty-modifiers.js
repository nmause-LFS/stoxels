//------------------------------------------------------------------------
//----------------------GAME DIFFICULTY-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Default Difficulty, overwritten when player selects a different difficulty
let curDiff = 'normal';


// Difficulty constants, pens represent the time penalties for mistakes based on selected difficulty
const DIFF_CFG = {
    easy: { scoreMult: 0.5, pens: [15, 30, 45, 60] },
    normal: { scoreMult: 1, pens: [30, 60, 90, 120] },
    hard: { scoreMult: 1.5, pens: [60, 120, 180, 240] },
};


// updDiffDesc — refreshes the small description text below the difficulty
// buttons. Uses the t() translation helper so it respects the active language.

function updDiffDesc() {
    const el = document.getElementById('diff-desc');
    if (el) el.textContent = t('diff_desc_' + curDiff);
}



// selDiff(btn) — called when the player clicks a difficulty button.
//   Updates curDiff, moves the selected 'sel' highlight to
//   the clicked button, and refreshes both description lines.
function selDiff(btn) {
    curDiff = btn.dataset.diff; // 'easy' | 'normal' | 'hard'
    document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    updDiffDesc();
}



//------------------------------------------------------------------------
//------------------------GAME MODIFIERS----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// currently selected active game modifier, none selected by default
let curMods = { timetrial: false, hardcore: false, ironman: false };


// Modifier score multipliers
const MOD_MULT = {
    timetrial: 1.2,   // +20 % for Time Trial
    hardcore: 1.3,   // +30 % for Hardcore
    ironman: 1.15,  // +15 % for Ironman
};



// updModDesc — refreshes the modifier description area below the modifier buttons
function updModDesc() {
    const el = document.getElementById('mod-desc');
    if (!el) return;

    const active = Object.keys(curMods).filter(m => curMods[m]);

    if (!active.length) {
        el.textContent = t('mod_desc_none');
        return;
    }

    // Map each active modifier to a coloured description line
    const colorMap = { timetrial: 'var(--orange)', hardcore: 'var(--red)', ironman: 'var(--purple)' };
    const keyMap = { timetrial: 'tt', hardcore: 'hc', ironman: 'im' };

    el.innerHTML = active.map(m =>
        `<span style="color:${colorMap[m]}">${t('mod_' + keyMap[m])}</span> — ${t('mod_desc_' + keyMap[m])}`
    ).join('<br>');
}



// togMod(btn) — toggles a modifier on or off when its button is clicked.
//   Uses the button's data-mod attribute to know which modifier to flip.
function togMod(btn) {
    const m = btn.dataset.mod;   // 'timetrial' | 'hardcore' | 'ironman'
    curMods[m] = !curMods[m];    // flip the boolean in curMods
    btn.classList.toggle('sel-yellow', curMods[m]);
    updModDesc();
}




//------------------------------------------------------------------------
//-----------------SCORE MULTIPLIERS FOR GAME MODIFIERS-------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function scoreMultiplier() {
    let m = DIFF_CFG[curDiff].scoreMult;             // start with difficulty base
    if (curMods.timetrial) m *= MOD_MULT.timetrial;
    if (curMods.hardcore) m *= MOD_MULT.hardcore;
    if (curMods.ironman) m *= MOD_MULT.ironman;
    return m;
}











