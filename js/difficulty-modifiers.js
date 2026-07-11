//------------------------------------------------------------------------
//----------------------GAME DIFFICULTY-----------------------------------
//------------------------------------------------------------------------

let curDiff = 'normal';

const DIFF_CFG = {
    easy: { scoreMult: 0.5, pens: [15, 30, 45, 60] },
    normal: { scoreMult: 1, pens: [40, 80, 120, 150] },
    hard: { scoreMult: 1.5, pens: [75, 150, 225, 300] },
};

function updDiffDesc() {
    const el = document.getElementById('diff-desc');
    if (el) el.textContent = t('diff_desc_' + curDiff);
}

function selDiff(btn) {
    curDiff = btn.dataset.diff;
    document.querySelectorAll('[data-diff]').forEach(b => b.classList.remove('sel'));
    btn.classList.add('sel');
    updDiffDesc();
}


//------------------------------------------------------------------------
//------------------------GAME MODIFIERS----------------------------------
//------------------------------------------------------------------------

let curMods = { timetrial: false, hardcore: false, ironman: false, classless: false, treeless: false };

const MOD_MULT = {
    timetrial: 1.2,
    hardcore: 1.3,
    ironman: 1.15,
    classless: 1.2,   // +20% — disables all class abilities
    treeless: 1.25,  // +25% — disables all passive tree nodes
};

// Short, plain-language warning text shown on the left-page scroll for
// each modifier when it's toggled on. Keyed by the same .dataset.mod value
// used everywhere else (timetrial, hardcore, ironman, classless, treeless).
const MOD_SCROLL_TEXT = {
    timetrial: 'A clock is ticking against you.',
    hardcore: 'One mistake and game over.',
    ironman: 'No retries. No mercy.',
    classless: 'All class abilities are disabled.',
    treeless: 'The passive tree is sealed shut.',
};

function updModDesc() {
    // Per-tombstone descriptions are handled by CSS (.sel-yellow .mod-per-desc)
    // This only refreshes the left-page "active modifiers" scroll text.
    const el = document.getElementById('active-mods-text');
    if (!el) return;

    const activeLines = Object.keys(curMods)
        .filter(m => curMods[m])
        .map(m => MOD_SCROLL_TEXT[m])
        .filter(Boolean);

    el.textContent = activeLines.length
        ? activeLines.join(' ')
        : t('setup_no_mods');
}

function togMod(btn) {
    const m = btn.dataset.mod;
    curMods[m] = !curMods[m];
    btn.classList.toggle('sel-yellow', curMods[m]);
    updModDesc();
}


//------------------------------------------------------------------------
//-----------------SCORE MULTIPLIERS FOR GAME MODIFIERS-------------------
//------------------------------------------------------------------------

function scoreMultiplier() {
    let m = DIFF_CFG[curDiff].scoreMult;
    if (curMods.timetrial) m *= MOD_MULT.timetrial;
    if (curMods.hardcore) m *= MOD_MULT.hardcore;
    if (curMods.ironman) m *= MOD_MULT.ironman;
    if (curMods.classless) m *= MOD_MULT.classless;
    if (curMods.treeless) m *= MOD_MULT.treeless;
    return m;
}


//------------------------------------------------------------------------
//------------------MODIFIER ACTIVE CHECKS -------------------------------
//------------------------------------------------------------------------

// Returns true when class abilities/passives should be fully suppressed.
function isClassless() { return !!curMods.classless; }

// Returns true when passive tree nodes should be treated as unallocated.
function isTreeless() { return !!curMods.treeless; }