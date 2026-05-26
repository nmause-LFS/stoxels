//------------------------------------------------------------------------
//----------------------GAME DIFFICULTY-----------------------------------
//------------------------------------------------------------------------

let curDiff = 'normal';

const DIFF_CFG = {
    easy: { scoreMult: 0.5, pens: [15, 30, 45, 60] },
    normal: { scoreMult: 1, pens: [30, 60, 90, 120] },
    hard: { scoreMult: 1.5, pens: [60, 120, 180, 240] },
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

function updModDesc() {
    const el = document.getElementById('mod-desc');
    if (!el) return;

    const active = Object.keys(curMods).filter(m => curMods[m]);

    if (!active.length) {
        el.textContent = t('mod_desc_none');
        return;
    }

    const colorMap = {
        timetrial: 'var(--orange)',
        hardcore: 'var(--red)',
        ironman: 'var(--purple)',
        classless: 'var(--accent)',
        treeless: 'var(--green)',
    };
    const keyMap = {
        timetrial: 'tt',
        hardcore: 'hc',
        ironman: 'im',
        classless: 'cl',
        treeless: 'tl',
    };

    el.innerHTML = active.map(m =>
        `<span style="color:${colorMap[m]}">${t('mod_' + keyMap[m])}</span> — ${t('mod_desc_' + keyMap[m])}`
    ).join('<br>');
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