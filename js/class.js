// ═══════════════════════════════════════════════
//  CLASS SYSTEM  (class.js)
//  Players unlock a class after completing all
//  levels in a world for the first time.
//  First world completion -> class selection screen
//  Subsequent completions -> class upgrade screen
//
//  Each class has:
//    - A passive effect (always active)
//    - Two active abilities (click to activate, then
//      click the grid to trigger the effect)
//  Both start at level 1 ("weak") and can be
//  upgraded once per world completion.
// ═══════════════════════════════════════════════





/*
    ------------------------------------------------------------------------
    -----------------------CLASS DEFINITIONS--------------------------------
    ------------------------------------------------------------------------
    ------------------------------------------------------------------------
*/


const CLASS_DEFS = {

    // -- MATHMAGICIAN (Mage archetype) -----------------------------------
    mathmagician: {
        id: 'mathmagician',
        icon: '🔮',
        nameEn: 'Mathmagician',
        nameDE: 'Mathemagier',
        descEn: 'Wield the arcane power of probability. Master of chance and revelation.',
        descDE: 'Führe die arkane Macht der Wahrscheinlichkeit. Meister des Zufalls und Chancen.',
        color: '#9b59b6',
        colorLight: '#c39bd3',

        passive: {
            nameEn: 'Variance Shield',
            nameDE: 'Varianzschild',
            levels: [
                {
                    level: 1,
                    descEn: 'Start each level with 1 free mistake.',
                    descDE: 'Beginne jedes Level mit 1 freiem Fehler.',
                    effect: { freeMistakes: 1 }
                },
                {
                    level: 2,
                    descEn: 'Start each level with 2 free mistakes.',
                    descDE: 'Beginne jedes Level mit 2 freien Fehlern.',
                    effect: { freeMistakes: 2 }
                },
                {
                    level: 3,
                    descEn: 'Start each level with 3 free mistakes.',
                    descDE: 'Beginne jedes Level mit 3 freien Fehlern.',
                    effect: { freeMistakes: 3 }
                },
            ]
        },

        active1: {
            nameEn: 'Arcane Reveal',
            nameDE: 'Arkane Enthüllung',
            descCursorEn: 'Click a cell to reveal it and its neighbours',
            descCursorDE: 'Klicke eine Zelle, um sie und ihre Nachbarn zu enthüllen',
            cooldownSeconds: 420, // 1200,
            levels: [
                {
                    level: 1,
                    descEn: 'Click a cell to reveal the correct state of all cells within 1 step. Cooldown: 7 minutes.',
                    descDE: 'Klicke eine Zelle, um alle Zellen im Umkreis von 1 Schritt zu enthüllen. Abklingzeit: 7 Minuten.',
                    effect: { radius: 1 }
                },
                {
                    level: 2,
                    descEn: 'Click a cell to reveal the correct state of all cells within 2 steps. Cooldown: 7 minutes.',
                    descDE: 'Klicke eine Zelle, um alle Zellen im Umkreis von 2 Schritten zu enthüllen. Abklingzeit: 7 Minuten.',
                    effect: { radius: 2 }
                },
                {
                    level: 3,
                    descEn: 'Click a cell to reveal the correct state of all cells within 3 steps. Cooldown: 7 minutes.',
                    descDE: 'Klicke eine Zelle, um alle Zellen im Umkreis von 3 Schritten zu enthüllen. Abklingzeit: 7 Minuten.',
                    effect: { radius: 3 }
                },
            ]
        },

        active2: {
            nameEn: 'Absolute Zero',
            nameDE: 'Absoluter Nullpunkt',
            descCursorEn: 'Click a cell to freeze time and click without causing mistakes',
            descCursorDE: 'Klicke eine Zelle zum Einfrieren der Zeit und klicke danach schnell ohne Fehler zu verursachen',
            cooldownSeconds: 300,
            levels: [
                {
                    level: 1,
                    descEn: 'Freeze the timer for 1s. Mistakes cause no penalties. Cooldown: 5 minutes.',
                    descDE: 'Friere die Zeit für 1s ein. Fehler verursachen keine Strafen. Abklingzeit: 5 Minuten.',
                    effect: { freezeDuration: 1000 }
                },
                {
                    level: 2,
                    descEn: 'Freeze the timer for 1.5s. Mistakes cause no penalties. Cooldown: 5 minutes.',
                    descDE: 'Friere die Zeit für 1.5 ein. Fehler verursachen keine Strafen. Abklingzeit: 5 Minuten.',
                    effect: { freezeDuration: 1500 }
                },
                {
                    level: 3,
                    descEn: 'Freeze the timer for 2s. Mistakes cause no penalties. Cooldown: 5 minutes.',
                    descDE: 'Friere die Zeit für 2s ein. Fehler verursachen keine Strafen. Abklingzeit: 5 Minuten.',
                    effect: { freezeDuration: 2000 }
                },
            ]
        },

    },

    // --- STATISTICIAN (Warrior archetype) ------------------------------------------------------------
    statistician: {
        id: 'statistician',
        icon: '⚔️',
        nameEn: 'Statistician',
        nameDE: 'Statistiker',
        descEn: 'Harness the power of data. Every mistake is a sample. Every victory is a distribution.',
        descDE: 'Nutze die Macht der Daten aus. Jeder Fehler ist eine Stichprobe. Jeder Sieg eine Verteilung.',
        color: '#e74c3c',
        colorLight: '#f1948a',

        passive: {
            nameEn: 'Momentum',
            nameDE: 'Schwung',
            levels: [
                {
                    level: 1,
                    descEn: 'Every 10 correct fills in a row grant +10 seconds added to the timer.',
                    descDE: '10 korrekte Klicks hintereinander geben +10 Sekunden mehr Zeit.',
                    effect: { streakForBonus: 10, bonusSeconds: 10 }
                },
                {
                    level: 2,
                    descEn: 'Every 9 correct fills in a row grant +15 seconds added to the timer.',
                    descDE: '9 korrekte Klicks hintereinander geben +15 Sekunden mehr Zeit.',
                    effect: { streakForBonus: 9, bonusSeconds: 15 }
                },
                {
                    level: 3,
                    descEn: 'Every 8 correct fills in a row grant +20 seconds added to the timer.',
                    descDE: '8 korrekte Klicks hintereinander geben +20 Sekunden mehr Zeit.',
                    effect: { streakForBonus: 8, bonusSeconds: 20 }
                },
            ]
        },

        active1: {
            nameEn: 'Data Strike',
            nameDE: 'Datenhieb',
            descCursorEn: 'Click a cell to make your choice between row or column.',
            descCursorDE: 'Klicke auf eine Zelle um deine Wahl zwischen Zeile oder Spalte zu treffen.',
            cooldownSeconds: 300,
            levels: [
                {
                    level: 1,
                    descEn: 'Choose between instantly solving 1 random unsolved row or column. Cooldown: 5 minutes.',
                    descDE: 'Wähle zwischen dem sofortigen Lösen einer ungelösten Zeile oder Spalte. Abklingzeit: 5 Minuten.',
                    effect: { solveCount: 1 }
                },
                {
                    level: 2,
                    descEn: 'Choose between instantly solving 2 random unsolved row or column. Cooldown: 5 minutes.',
                    descDE: 'Wähle zwischen dem sofortigen Lösen von 2 ungelösten Zeilen oder Spalten. Abklingzeit: 5 Minuten.',
                    effect: { solveCount: 2 }
                },
                {
                    level: 3,
                    descEn: 'Choose between instantly solving 3 random unsolved row or column. Cooldown: 5 minutes.',
                    descDE: 'Wähle zwischen dem sofortigen Lösen von 3 ungelösten Zeilen oder Spalten. Abklingzeit: 5 Minuten.',
                    effect: { solveCount: 3 }
                },
            ]
        },

        active2: {
            nameEn: 'Diagonal Strike',
            nameDE: 'Diagonalschlag',
            descCursorEn: 'Select a cell to strike.',
            descCursorDE: 'Wähle eine Zelle zum Zuschlagen aus.',
            cooldownSeconds: 180,
            levels: [
                {
                    level: 1,
                    descEn: 'Strike diagonally through a cell. Cooldown: 3 minutes.',
                    descDE: 'Gehe diagonal durch eine Zelle. Abklingzeit: 3 Minuten.',
                    effect: { diagonals: 1 }
                },
                {
                    level: 2,
                    descEn: 'Strike diagonally through a cell. Covers both diagonals. Cooldown: 3 minutes.',
                    descDE: 'Gehe diagonal durch eine Zelle. Erfasst beide Diagonalen. Abklingzeit: 3 Minuten.',
                    effect: { diagonals: 2 }
                },
                {
                    level: 3,  // should be both diagonals + horizontally + vertically
                    descEn: 'Strike diagonally, horicontally and vertically through a cell. Cooldown: 3 minutes.',
                    descDE: 'Gehe diagonal, horizontal und vertikal durch eine Zelle. Abklingzeit: 3 Minuten.',
                    effect: { diagonals: 4 }
                },
            ]
        },

    },

    // ── PROBABILIST (Ranger archetype) ────────────────────────────────────
    probabilist: {
        id: 'probabilist',
        icon: '🎯',
        nameEn: 'Probabilist',
        nameDE: 'Probabilist',
        descEn: 'Calculate the odds. Strike with precision. The sample space is your hunting ground.',
        descDE: 'Berechne die Chancen. Schlage präzise zu. Die Ergebnismenge ist dein Jagdrevier.',
        color: '#27ae60',
        colorLight: '#58d68d',

        passive: {
            nameEn: 'Bayesian Insight',
            nameDE: 'Bayesianische Einsicht',
            levels: [
                {
                    level: 1,
                    descEn: 'When the level loads, 2 random empty cells are automatically marked with ✕.',
                    descDE: 'Beim Laden des Levels werden 2 zufällige leere Zellen automatisch mit ✕ markiert.',
                    effect: { autoMarkCount: 2 }
                },
                {
                    level: 2,
                    descEn: 'When the level loads, 5 random empty cells are automatically marked with ✕.',
                    descDE: 'Beim Laden des Levels werden 5 zufällige leere Zellen automatisch mit ✕ markiert.',
                    effect: { autoMarkCount: 5 }
                },
                {
                    level: 3,
                    descEn: 'When the level loads, 10 random empty cells are automatically marked with ✕.',
                    descDE: 'Beim Laden des Levels werden 10 zufällige leere Zellen automatisch mit ✕ markiert.',
                    effect: { autoMarkCount: 10 }
                },
            ]
        },

        active1: {
            nameEn: 'Precision Mark',
            nameDE: 'Präzisionsmarkierung',
            descCursorEn: 'Click a cell to mark all wrong cells in its row and column with ✕',
            descCursorDE: 'Klicke eine Zelle, um alle falschen Zellen in Zeile und Spalte mit ✕ zu markieren',
            cooldownSeconds: 300,
            levels: [
                {
                    level: 1,
                    descEn: 'Click a cell to mark all wrong cells in that row and column with ✕. Cooldown: 5 minutes.',
                    descDE: 'Klicke eine Zelle um alle falschen Zellen in dieser Zeile und Spalte mit einem ✕ zu markieren. Abklingzeit: 5 Minuten.',
                    effect: { crossMark: true, extraLines: 0 }
                },
                {
                    level: 2,
                    descEn: 'Click a cell to mark all wrong cells in that row, column and 1 adjacent row and column with ✕. Cooldown: 5 minutes.',
                    descDE: 'Klicke eine Zelle um alle falschen Zellen in dieser Zeile, Spalte, und 1 angrenzende Zeile und Spalte mit ✕ zu markieren. Abklingzeit: 5 Minuten',
                    effect: { crossMark: true, extraLines: 1 }
                },
                {
                    level: 3,
                    descEn: 'Click a cell to mark all wrong cells in that row, column and 2 adjacent rows and columns with ✕. Cooldown: 5 minutes.',
                    descDE: 'Klicke eine Zelle um alle falschen Zellen in dieser Zeile, Spalte, und 2 angrenzenden Zeilen und Spalten mit ✕ zu markieren. Abklingzeit: 5 Minuten',
                    effect: { crossMark: true, extraLines: 2 }
                },
            ]
        },

        active2: {
            nameEn: 'Field Scan',
            nameDE: 'Feldscan',
            descCursorEn: 'Click a cell to scan a random region',
            descCursorDE: 'Klicke eine Zelle zum Scannen einer zufälligen Region!',
            cooldownSeconds: 120,
            levels: [
                {
                    level: 1,
                    descEn: 'Reveals a random 4×4 region for 1 second — correct tiles glow green, empty tiles show ✕. Cooldown: 2 minutes.',
                    descDE: 'Enthüllt eine zufällige 4×4-Region für 1 Sekunde — richtige Felder leuchten grün, leere zeigen ✕. Abklingzeit: 2 Minuten.',
                    effect: { scanSize: 4, scanDuration: 1000 }
                },
                {
                    level: 2,
                    descEn: 'Reveals a random 6×6 region for 2 seconds — correct tiles glow green, empty tiles show ✕. Cooldown: 2 minutes.',
                    descDE: 'Enthüllt eine zufällige 6×6-Region für 2 Sekunden — richtige Felder leuchten grün, leere zeigen ✕. Abklingzeit: 2 Minuten.',
                    effect: { scanSize: 6, scanDuration: 2000 }
                },
                {
                    level: 3,
                    descEn: 'Reveals a random 8×8 region for 3 seconds — correct tiles glow green, empty tiles show ✕. Cooldown: 2 minutes.',
                    descDE: 'Enthüllt eine zufällige 8×8-Region für 3 Sekunden — richtige Felder leuchten grün, leere zeigen ✕. Abklingzeit: 2 Minuten.',
                    effect: { scanSize: 8, scanDuration: 3000 }
                },
            ]
        },
    }
};

const CLASS_LIST = ['statistician', 'mathmagician', 'probabilist'];


// ═══════════════════════════════════════════════
//  ACTIVE ABILITY RUNTIME STATE
// ═══════════════════════════════════════════════

let activeAbilityMode = false;

// Per-skill independent cooldown state.
// Each slot ('active1', 'active2') tracks its own remaining seconds + interval.
let cooldownState = {
    active1: { remaining: 0, interval: null },
    active2: { remaining: 0, interval: null },
};

// Legacy single-cooldown variables — kept so nothing outside this file breaks.
let activeCooldownRemaining = 0;
let cooldownInterval = null;

let correctFillStreak = 0;
let nextPenaltyHalved = false;

let hudMinimized = false;


// ═══════════════════════════════════════════════
//  WORLD COMPLETION CHECK
//  Called from checkWin() in scoring.js after
//  every level completion.
// ═══════════════════════════════════════════════

// checkWorldCompletion — checks if finishing this level completes a world
//   for the FIRST TIME. If so, queues the class selection or upgrade screen.
function checkWorldCompletion() {
    if (!cur) return;
    const wi = cur.world - 1; // 0-based world index
    const world = WORLDS[wi];
    if (!world || !world.data.length) return;

    // Check all levels in this world are done
    const worldStart = WORLD_START_GI[wi];
    const worldEnd = worldStart + world.data.length - 1;
    for (let gi = worldStart; gi <= worldEnd; gi++) {
        if (!STATE.done.includes(gi)) return; // not all done yet
    }

    // All done — has this world already triggered a class event?
    if (!STATE.classWorldsCompleted) STATE.classWorldsCompleted = [];
    if (STATE.classWorldsCompleted.includes(wi)) return; // already handled

    // Queue the class event — do NOT mark the world as handled yet.
    // It gets marked only after the player actually picks a class or upgrade.
    STATE._pendingClassEvent = true;
    STATE._lastClassWorld = wi;
    save();
}

// _afterClassEventCallback — stored so closeClassOverlay() knows where to go
let _afterClassEventCallback = null;

// triggerClassEventIfPending — call this from nextLvl/replayLvl/goLevels.
//   If a class event is pending, shows the class screen and holds the
//   provided callback (the action the player wanted to take). After the
//   player finishes class selection/upgrade, the callback fires.
//   Returns true if an event was triggered (caller should NOT proceed).
function triggerClassEventIfPending(afterCallback) {
    if (!STATE._pendingClassEvent) return false;
    STATE._pendingClassEvent = false;
    save();

    _afterClassEventCallback = afterCallback || null;

    if (!STATE.playerClass) {
        showClassSelection();
    } else {
        showClassUpgrade();
    }
    return true;
}


// ═══════════════════════════════════════════════
//  CLASS SELECTION SCREEN
// ═══════════════════════════════════════════════

function showClassSelection() {
    const overlay = document.getElementById('class-selection-overlay');
    const content = document.getElementById('class-selection-content');

    content.innerHTML = `
        <div class="cs-header">
            <div class="cs-title">⚗️ ${LANG === 'de' ? 'KLASSE WÄHLEN' : 'CHOOSE YOUR CLASS'}</div>
            <div class="cs-subtitle">${LANG === 'de'
            ? 'Du hast eine Welt abgeschlossen! Wähle deine Klasse — diese Entscheidung ist permanent.'
            : 'You completed a world! Choose your class — this decision is permanent.'
        }</div>
        </div>
        <div class="cs-cards">
            ${CLASS_LIST.map(cid => buildClassCard(cid, 'select')).join('')}
        </div>`;

    overlay.classList.add('show');
}


function buildClassCard(cid, mode) {
    const def = CLASS_DEFS[cid];
    const name = LANG === 'de' ? def.nameDE : def.nameEn;
    const desc = LANG === 'de' ? def.descDE : def.descEn;

    // Passive details
    const passName = LANG === 'de' ? def.passive.nameDE : def.passive.nameEn;
    const passDesc = LANG === 'de'
        ? def.passive.levels[0].descDE
        : def.passive.levels[0].descEn;

    // Active 1 details
    const act1Name = LANG === 'de' ? def.active1.nameDE : def.active1.nameEn;
    const act1Desc = LANG === 'de'
        ? def.active1.levels[0].descDE
        : def.active1.levels[0].descEn;

    // Active 2 details
    const act2Name = LANG === 'de' ? def.active2.nameDE : def.active2.nameEn;
    const act2Desc = LANG === 'de'
        ? def.active2.levels[0].descDE
        : def.active2.levels[0].descEn;

    const onclick = mode === 'select'
        ? `confirmClassSelection('${cid}')`
        : '';

    return `
        <div class="cs-card" style="border-color:${def.color};--cls-color:${def.color};--cls-light:${def.colorLight};"
             ${onclick ? `onclick="${onclick}"` : ''} data-classid="${cid}">
            <div class="cs-card-icon">${def.icon}</div>
            <div class="cs-card-name" style="color:${def.colorLight};">${name}</div>
            <div class="cs-card-desc">${desc}</div>
            <div class="cs-card-abilities">
                <div class="cs-ability passive">
                    <span class="cs-ability-tag passive">⚡ ${LANG === 'de' ? 'PASSIV' : 'PASSIVE'}</span>
                    <span class="cs-ability-name">${passName}</span>
                    <span class="cs-ability-desc">${passDesc}</span>
                </div>
                <div class="cs-ability active">
                    <span class="cs-ability-tag active">🎯 ${LANG === 'de' ? 'AKTIV 1' : 'ACTIVE 1'}</span>
                    <span class="cs-ability-name">${act1Name}</span>
                    <span class="cs-ability-desc">${act1Desc}</span>
                </div>
                <div class="cs-ability active">
                    <span class="cs-ability-tag active">🎯 ${LANG === 'de' ? 'AKTIV 2' : 'ACTIVE 2'}</span>
                    <span class="cs-ability-name">${act2Name}</span>
                    <span class="cs-ability-desc">${act2Desc}</span>
                </div>
            </div>
            ${mode === 'select' ? `<div class="cs-card-cta">${LANG === 'de' ? '▶ WÄHLEN' : '▶ SELECT'}</div>` : ''}
        </div>`;
}


function confirmClassSelection(cid) {
    if (!CLASS_DEFS[cid]) return;

    STATE.playerClass = cid;
    STATE.classPassiveLevel = 1;
    STATE.classActive1Level = 1;
    STATE.classActive2Level = 1;
    STATE.classActiveLevel = 1;
    STATE.classActiveChoice = 'active1';
    if (!STATE.classWorldsCompleted) STATE.classWorldsCompleted = [];
    STATE.classWorldsCompleted.push(STATE._lastClassWorld);
    save();

    const def = CLASS_DEFS[cid];
    const name = LANG === 'de' ? def.nameDE : def.nameEn;
    showToast(`${def.icon} ${name} ${LANG === 'de' ? 'gewählt!' : 'selected!'}`);

    closeClassOverlay();
    buildClassHUD();
}


// ═══════════════════════════════════════════════
//  CLASS UPGRADE SCREEN
// ═══════════════════════════════════════════════

function showClassUpgrade() {
    if (!STATE.playerClass) return;

    // Increment available upgrades
    if (STATE.classUpgradesAvailable === undefined) STATE.classUpgradesAvailable = 0;
    STATE.classUpgradesAvailable++;
    save();

    const overlay = document.getElementById('class-selection-overlay');
    const content = document.getElementById('class-selection-content');
    const def = CLASS_DEFS[STATE.playerClass];
    const passLv = STATE.classPassiveLevel || 1;
    const act1Lv = STATE.classActive1Level || 1;
    const act2Lv = STATE.classActive2Level || 1;
    const maxLv = 3;

    const passAtMax = passLv >= maxLv;
    const act1AtMax = act1Lv >= maxLv;
    const act2AtMax = act2Lv >= maxLv;
    const allMax = passAtMax && act1AtMax && act2AtMax;

    // Next level data for all three categories
    const passNext = def.passive.levels[passLv] || null;
    const act1Next = def.active1.levels[act1Lv] || null;
    const act2Next = def.active2.levels[act2Lv] || null;

    const name = LANG === 'de' ? def.nameDE : def.nameEn;

    content.innerHTML = `
        <div class="cs-header">
            <div class="cs-title">${def.icon} ${LANG === 'de' ? 'KLASSEN-UPGRADE' : 'CLASS UPGRADE'}</div>
            <div class="cs-subtitle">${LANG === 'de'
            ? `Du hast eine weitere Welt abgeschlossen! Wähle eine Verbesserung für deinen ${name}.`
            : `You completed another world! Choose an upgrade for your ${name}.`
        }</div>
        </div>
        <div class="cs-upgrade-grid">

            <div class="cs-upgrade-card ${passAtMax ? 'maxed' : ''}" 
                 ${!passAtMax ? `onclick="applyClassUpgrade('passive')"` : ''}>
                <div class="cs-upgrade-tag passive">⚡ ${LANG === 'de' ? 'PASSIV' : 'PASSIVE'} · ${LANG === 'de' ? 'STUFE' : 'LEVEL'} ${passLv} → ${Math.min(passLv + 1, maxLv)}</div>
                <div class="cs-upgrade-name">${LANG === 'de' ? def.passive.nameDE : def.passive.nameEn}</div>
                ${passAtMax
            ? `<div class="cs-upgrade-maxed">${LANG === 'de' ? '✓ MAX STUFE' : '✓ MAX LEVEL'}</div>`
            : `<div class="cs-upgrade-current">${LANG === 'de' ? 'Aktuell:' : 'Current:'} ${passLv > 0 ? (LANG === 'de' ? def.passive.levels[passLv - 1].descDE : def.passive.levels[passLv - 1].descEn) : ''}</div>
                       <div class="cs-upgrade-new">${LANG === 'de' ? 'Neu:' : 'New:'} ${passNext ? (LANG === 'de' ? passNext.descDE : passNext.descEn) : ''}</div>
                       <div class="cs-upgrade-cta">${LANG === 'de' ? '▶ PASSIV VERBESSERN' : '▶ UPGRADE PASSIVE'}</div>`
        }
            </div>

            <div class="cs-upgrade-card ${act1AtMax ? 'maxed' : ''}"
                 ${!act1AtMax ? `onclick="applyClassUpgrade('active1')"` : ''}>
                <div class="cs-upgrade-tag active">🎯 ${LANG === 'de' ? 'AKTIV 1' : 'ACTIVE 1'} · ${LANG === 'de' ? 'STUFE' : 'LEVEL'} ${act1Lv} → ${Math.min(act1Lv + 1, maxLv)}</div>
                <div class="cs-upgrade-name">${LANG === 'de' ? def.active1.nameDE : def.active1.nameEn}</div>
                ${act1AtMax
            ? `<div class="cs-upgrade-maxed">${LANG === 'de' ? '✓ MAX STUFE' : '✓ MAX LEVEL'}</div>`
            : `<div class="cs-upgrade-current">${LANG === 'de' ? 'Aktuell:' : 'Current:'} ${act1Lv > 0 ? (LANG === 'de' ? def.active1.levels[act1Lv - 1].descDE : def.active1.levels[act1Lv - 1].descEn) : ''}</div>
                       <div class="cs-upgrade-new">${LANG === 'de' ? 'Neu:' : 'New:'} ${act1Next ? (LANG === 'de' ? act1Next.descDE : act1Next.descEn) : ''}</div>
                       <div class="cs-upgrade-cta">${LANG === 'de' ? '▶ AKTIV 1 VERBESSERN' : '▶ UPGRADE ACTIVE 1'}</div>`
        }
            </div>

            <div class="cs-upgrade-card ${act2AtMax ? 'maxed' : ''}"
                 ${!act2AtMax ? `onclick="applyClassUpgrade('active2')"` : ''}>
                <div class="cs-upgrade-tag active">🎯 ${LANG === 'de' ? 'AKTIV 2' : 'ACTIVE 2'} · ${LANG === 'de' ? 'STUFE' : 'LEVEL'} ${act2Lv} → ${Math.min(act2Lv + 1, maxLv)}</div>
                <div class="cs-upgrade-name">${LANG === 'de' ? def.active2.nameDE : def.active2.nameEn}</div>
                ${act2AtMax
            ? `<div class="cs-upgrade-maxed">${LANG === 'de' ? '✓ MAX STUFE' : '✓ MAX LEVEL'}</div>`
            : `<div class="cs-upgrade-current">${LANG === 'de' ? 'Aktuell:' : 'Current:'} ${act2Lv > 0 ? (LANG === 'de' ? def.active2.levels[act2Lv - 1].descDE : def.active2.levels[act2Lv - 1].descEn) : ''}</div>
                       <div class="cs-upgrade-new">${LANG === 'de' ? 'Neu:' : 'New:'} ${act2Next ? (LANG === 'de' ? act2Next.descDE : act2Next.descEn) : ''}</div>
                       <div class="cs-upgrade-cta">${LANG === 'de' ? '▶ AKTIV 2 VERBESSERN' : '▶ UPGRADE ACTIVE 2'}</div>`
        }
            </div>

        </div>
        ${allMax ? `<div style="text-align:center;margin-top:18px;color:#27ae60;font-family:var(--PX);font-size:11px;">🏆 ${LANG === 'de' ? 'Alle Fähigkeiten sind auf MAX STUFE!' : 'All abilities are at MAX LEVEL!'}</div>` : ''}
        ${allMax ? `<div style="text-align:center;margin-top:12px;"><button class="cs-skip-btn" onclick="closeClassOverlay()">${LANG === 'de' ? 'SCHLIESSEN' : 'CLOSE'}</button></div>` : ''}
    `;

    overlay.classList.add('show');
}




function applyClassUpgrade(type) {
    if (type === 'passive') {
        STATE.classPassiveLevel = Math.min((STATE.classPassiveLevel || 1) + 1, 3);
    } else if (type === 'active1') {
        STATE.classActive1Level = Math.min((STATE.classActive1Level || 1) + 1, 3);
    } else if (type === 'active2') {
        STATE.classActive2Level = Math.min((STATE.classActive2Level || 1) + 1, 3);
    }
    STATE.classUpgradesAvailable = Math.max(0, (STATE.classUpgradesAvailable || 1) - 1);
    if (!STATE.classWorldsCompleted) STATE.classWorldsCompleted = [];
    STATE.classWorldsCompleted.push(STATE._lastClassWorld);
    save();

    trackAchStat('classUpgradesApplied');
    closeClassOverlay();

    const def = CLASS_DEFS[STATE.playerClass];
    const typeName = type === 'passive'
        ? (LANG === 'de' ? def.passive.nameDE : def.passive.nameEn)
        : type === 'active1'
            ? (LANG === 'de' ? def.active1.nameDE : def.active1.nameEn)
            : (LANG === 'de' ? def.active2.nameDE : def.active2.nameEn);
    const newLv = type === 'passive' ? STATE.classPassiveLevel : STATE.classActiveLevel;
    showToast(`${def.icon} ${typeName} → ${LANG === 'de' ? 'Stufe' : 'Level'} ${newLv}!`);
    buildClassHUD();
}

function closeClassOverlay() {
    document.getElementById('class-selection-overlay').classList.remove('show');
    if (_afterClassEventCallback) {
        const cb = _afterClassEventCallback;
        _afterClassEventCallback = null;
        setTimeout(cb, 120);
    }
}


// ═══════════════════════════════════════════════
//  CLASS HUD  (shown during gameplay)
// ═══════════════════════════════════════════════

// buildClassHUD — renders the class panel on the left of the game screen.
//   Shows class icon, name, passive and active abilities with their levels.
// ═══════════════════════════════════════════════
//  CLASS HUD  (shown during gameplay)
// ═══════════════════════════════════════════════



function buildClassHUD() {
    const panel = document.getElementById('class-hud-panel');
    if (!panel) return;

    if (!STATE.playerClass) {
        panel.innerHTML = '';
        panel.style.display = 'none';
        return;
    }

    const def = CLASS_DEFS[STATE.playerClass];
    if (!def) return;

    panel.style.display = 'flex';

    const passLv = STATE.classPassiveLevel || 1;
    const passData = def.passive.levels[passLv - 1];
    const passName = LANG === 'de' ? def.passive.nameDE : def.passive.nameEn;
    const name = LANG === 'de' ? def.nameDE : def.nameEn;

    if (!STATE.classActiveChoice || typeof STATE.classActiveChoice === 'number') {
        STATE.classActiveChoice = 'active1';
    }

    const PASSIVE_COLOR = '#f39c12';
    const ACTIVE_COLOR = '#3498db';

    // Helper to build one active skill block (clickable, no button)
    const renderActiveSkill = (key) => {
        const skill = def[key];
        const skillLv = key === 'active1'
            ? (STATE.classActive1Level || 1)
            : (STATE.classActive2Level || 1);
        const skillData = skill.levels[skillLv - 1];
        const skillName = LANG === 'de' ? skill.nameDE : skill.nameEn;
        const isArmed = activeAbilityMode && STATE.classActiveChoice === key;
        const cdRemaining = cooldownState[key].remaining;
        const isOnCooldown = cdRemaining > 0;

        const rankLabel = LANG === 'de' ? 'Rang' : 'Rank';
        const descText = LANG === 'de' ? skillData.descDE : skillData.descEn;

        // Determine section style
        let sectionStyle = `border-left: 3px solid ${isArmed ? '#e74c3c' : ACTIVE_COLOR}; padding-left: 8px; margin-bottom: 6px; cursor: pointer; position: relative; padding: 8px 8px 8px 10px; background: rgba(0,0,0,0.25); border: 1px solid var(--border); border-left: 3px solid ${isArmed ? '#e74c3c' : ACTIVE_COLOR};`;
        if (isOnCooldown) sectionStyle += ' opacity: 0.7; cursor: not-allowed;';
        if (isArmed) sectionStyle += ' background: rgba(231,76,60,0.1);';

        const clickAttr = isOnCooldown
            ? ''
            : `onclick="toggleActiveAbility('${key}')"`;

        // Cooldown overlay (shown when on cooldown)
        const cooldownOverlay = isOnCooldown ? `
            <div class="chud-cd-overlay">
                <span class="chud-cd-timer">${formatCooldown(cdRemaining)}</span>
                <span class="chud-cd-label">${LANG === 'de' ? 'Abklingzeit' : 'Cooldown'}</span>
            </div>` : '';

        // Armed hint
        const armedHint = isArmed ? `<div class="chud-armed-hint">${LANG === 'de' ? '✕ Klicken zum Abbrechen' : '✕ Click to cancel'}</div>` : '';

        return `
            <div class="chud-active-section${isArmed ? ' armed' : ''}${isOnCooldown ? ' on-cooldown' : ''}"
                 data-slot="${key}"
                 style="${sectionStyle}"
                 ${clickAttr}>
                <div class="chud-skill-name" style="color: ${ACTIVE_COLOR}; font-weight: bold; margin-bottom: 4px;">
                    ${skillName} <span class="chud-rank" style="opacity:0.65; font-size:0.85em;">— ${rankLabel} ${skillLv}</span>
                </div>
                <div class="chud-skill-desc" style="position: relative;">
                    ${descText}
                    ${cooldownOverlay}
                </div>
                ${armedHint}
            </div>
        `;
    };






    panel.innerHTML = `
        <div id="class-hud-drag-handle">
        <span>DRAG TO MOVE</span>
        <button id="class-hud-minimize-btn" onclick="toggleClassHUDMinimize(event)" title="${hudMinimized ? 'Expand' : 'Minimize'}">
            ${hudMinimized ? '▲' : '▼'}
        </button>
    </div>
       <div id="class-hud-body" style="padding: 0 10px 10px; display:${hudMinimized ? 'none' : 'flex'}; flex-direction:column; gap:6px;">
        <div class="chud-icon">${def.icon}</div>
        <div class="chud-name" style="color:${def.colorLight}; font-size: 1.2em; margin-bottom: 10px;">${name}</div>

        <div class="chud-passive-section" style="padding: 8px 8px 8px 10px; background: rgba(0,0,0,0.25); border: 1px solid var(--border); border-left: 3px solid ${PASSIVE_COLOR}; margin-bottom: 6px;">
            <div class="chud-skill-name" style="color: ${PASSIVE_COLOR}; font-weight: bold; margin-bottom: 4px;">
                ${passName} <span class="chud-rank" style="opacity:0.65; font-size:0.85em;">— ${LANG === 'de' ? 'Rang' : 'Rank'} ${passLv}</span>
            </div>
            <div class="chud-skill-desc">${LANG === 'de' ? passData.descDE : passData.descEn}</div>
        </div>

        ${renderActiveSkill('active1')}
        ${renderActiveSkill('active2')}
    </div>
`;
    makeClassHUDDraggable();



}



// makeClassHUDDraggable — attaches pointer-drag logic to the HUD panel.
//   Called once after buildClassHUD() injects the drag handle into the DOM.
//   Clamps position to the viewport so the panel can never be dragged off-screen.
function makeClassHUDDraggable() {
    const panel = document.getElementById('class-hud-panel');
    const handle = document.getElementById('class-hud-drag-handle');
    if (!panel || !handle) return;

    let dragging = false;
    let startX, startY, origLeft, origTop;

    handle.addEventListener('pointerdown', (e) => {
        if (e.target.id === 'class-hud-minimize-btn') return;
        e.preventDefault();
        dragging = true;
        handle.setPointerCapture(e.pointerId);

        // Read current position (may have been set by previous drag)
        const rect = panel.getBoundingClientRect();
        origLeft = rect.left;
        origTop = rect.top;
        startX = e.clientX;
        startY = e.clientY;
    });

    handle.addEventListener('pointermove', (e) => {
        if (!dragging) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        let newLeft = origLeft + dx;
        let newTop = origTop + dy;

        // Clamp to viewport bounds
        const pw = panel.offsetWidth;
        const ph = panel.offsetHeight;
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - pw));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - ph));

        panel.style.left = newLeft + 'px';
        panel.style.top = newTop + 'px';
    });

    handle.addEventListener('pointerup', () => { dragging = false; });
    handle.addEventListener('pointercancel', () => { dragging = false; });
}



function toggleClassHUDMinimize(e) {
    e.stopPropagation();
    hudMinimized = !hudMinimized;
    const body = document.getElementById('class-hud-body');
    const btn = document.getElementById('class-hud-minimize-btn');
    if (body) body.style.display = hudMinimized ? 'none' : 'flex';
    if (btn) btn.textContent = hudMinimized ? '▲' : '▼';
}





function formatCooldown(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}s`;
}


// ═══════════════════════════════════════════════
//  ACTIVE ABILITY TOGGLE & EXECUTION
// ═══════════════════════════════════════════════

// toggleActiveAbility — arms or disarms the active ability.
//   slot: 'active1' or 'active2' — which ability to arm.
//   When armed, clicking a grid cell triggers executeActiveAbility().
function toggleActiveAbility(slot) {
    const newSlot = slot || 'active1';
    const cd = cooldownState[newSlot];

    if (dead || cd.remaining > 0) return;

    // If clicking the already-armed slot, cancel it; otherwise arm it
    if (activeAbilityMode && STATE.classActiveChoice === newSlot) {
        activeAbilityMode = false;
    } else {
        STATE.classActiveChoice = newSlot;
        activeAbilityMode = true;
    }

    // Change cursor on the puzzle wrapper
    const wrap = document.getElementById('puzzle-scaler-wrap');
    if (wrap) {
        wrap.style.cursor = activeAbilityMode ? 'crosshair' : '';
    }

    // Show hint toast when arming
    if (activeAbilityMode) {
        const def = CLASS_DEFS[STATE.playerClass];
        const activeData = def[newSlot];
        if (activeData) {
            const msg = LANG === 'de' ? activeData.descCursorDE : activeData.descCursorEn;
            showToast(`🎯 ${msg}`);
        }
    }

    buildClassHUD();
}

// executeActiveAbility(row, col) — called when player clicks a cell
//   while activeAbilityMode is true.
function executeActiveAbility(row, col) {
    if (!activeAbilityMode || !STATE.playerClass || dead) return;

    activeAbilityMode = false;
    const wrap = document.getElementById('puzzle-scaler-wrap');
    if (wrap) wrap.style.cursor = '';

    const def = CLASS_DEFS[STATE.playerClass];
    const activeKey = STATE.classActiveChoice || 'active1';
    const actLv = activeKey === 'active1'
        ? (STATE.classActive1Level || 1)
        : (STATE.classActive2Level || 1);
    const actData = def[activeKey].levels[actLv - 1];
    const effect = actData.effect;

    if (activeKey === 'active1') {
        switch (STATE.playerClass) {
            case 'mathmagician':
                _executeArcaneReveal(row, col, effect.radius);
                trackAchStat('skillArcaneRevealUsed');
                break;
            case 'statistician':
                _executeDataStrike(effect.solveCount);
                trackAchStat('skillDataStrikeUsed');
                break;
            case 'probabilist':
                _executePrecisionMark(row, col, effect.extraLines);
                trackAchStat('skillPrecisionMarkUsed');
                break;
        }
    } else {
        switch (STATE.playerClass) {
            case 'mathmagician':
                _executeArcaneFreeze(effect.freezeDuration);
                trackAchStat('skillAbsoluteZeroUsed');
                break;
            case 'statistician':
                _executeDiagonalStrike(row, col, effect.diagonals);
                trackAchStat('skillDiagonalStrikeUsed');
                break;
            case 'probabilist':
                _executeFieldScan(effect.scanSize, effect.scanDuration);
                trackAchStat('skillFieldScanUsed');
                break;
        }
    }


    const cdSeconds = def[activeKey].cooldownSeconds;
    startSlotCooldown(activeKey, cdSeconds);
    buildClassHUD();
}

// _executeArcaneReveal — reveals correct/wrong state for all cells within
//   'radius' steps of (row, col), including diagonal. Works at borders.
function _executeArcaneReveal(row, col, radius) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const affected = [];

    for (let r = Math.max(0, row - radius); r <= Math.min(rows - 1, row + radius); r++) {
        for (let c = Math.max(0, col - radius); c <= Math.min(cols - 1, col + radius); c++) {
            if (sol[r][c] === 1) {
                // Correct cell: reveal it
                if (!revealedGrid[r][c] && userGrid[r][c] !== 1) {
                    revealedGrid[r][c] = true;
                    userGrid[r][c] = 1;
                    renderCell(r, c);
                    updClues(r, c);
                    affected.push(`g-${r}-${c}`);
                }
            } else {
                // Empty cell: mark with ✕
                if (userGrid[r][c] === 0) {
                    userGrid[r][c] = 2;
                    renderCell(r, c);
                    affected.push(`g-${r}-${c}`);
                }
            }
        }
    }

    _applyCellEffect(affected.filter(id => {
        const [, r, c] = id.split('-').map(Number);
        return sol[r][c] === 1;
    }), 'reveal');

    _applyCellEffect(affected.filter(id => {
        const [, r, c] = id.split('-').map(Number);
        return sol[r][c] === 0;
    }), 'mark');

    const revealedCount = affected.filter(id => {
        const [, r, c] = id.split('-').map(Number);
        return sol[r][c] === 1;
    }).length;
    if (revealedCount > 0) trackAchStat('tilesRevealed', revealedCount);

    checkWin();

    _spawnArcaneSparkles(affected.filter(id => {
        const [, r, c] = id.split('-').map(Number);
        return sol[r][c] === 1;
    }));

}

// _executeDataStrike — solves N random unsolved rows or columns.
// Shows a choice popup first so the player can pick rows or columns.
function _executeDataStrike(count) {
    const overlay = document.createElement('div');
    overlay.id = 'data-strike-overlay';
    overlay.className = 'modal-bg show';
    overlay.style.cssText = 'z-index:3000;';

    overlay.innerHTML = `
        <div class="modal-box" style="text-align:center; border-left: 4px solid #e74c3c; max-width: 320px;">
            <div style="font-family:var(--PX); font-size:13px; color:#e74c3c; letter-spacing:2px; margin-bottom:12px;">
                ⚔️ ${LANG === 'de' ? 'DATENHIEB' : 'DATA STRIKE'}
            </div>
            <div style="font-family:var(--PX); font-size:10px; color:var(--accent2); margin-bottom:18px; line-height:1.8;">
                ${LANG === 'de'
            ? `Wähle: ${count} zufällige Zeile(n) oder Spalte(n) sofort lösen?`
            : `Choose: solve ${count} random row(s) or column(s)?`}
            </div>
            <div style="display:flex; gap:12px; justify-content:center;">
                <button onclick="_dataStrikeResolve('rows')" style="font-family:var(--PX); font-size:10px; background:transparent; border:1px solid #e74c3c; color:#e74c3c; padding:8px 18px; cursor:pointer; letter-spacing:1px;">
                    ${LANG === 'de' ? '▶ ZEILEN' : '▶ ROWS'}
                </button>
                <button onclick="_dataStrikeResolve('cols')" style="font-family:var(--PX); font-size:10px; background:transparent; border:1px solid #e74c3c; color:#e74c3c; padding:8px 18px; cursor:pointer; letter-spacing:1px;">
                    ${LANG === 'de' ? '▶ SPALTEN' : '▶ COLS'}
                </button>
            </div>
            <div style="margin-top:12px;">
                <button onclick="_dataStrikeCancel()" style="font-family:var(--PX); font-size:9px; background:transparent; border:1px solid #444; color:#555; padding:5px 14px; cursor:pointer; letter-spacing:1px;">
                    ${LANG === 'de' ? 'ABBRECHEN' : 'CANCEL'}
                </button>
            </div>
        </div>`;

    document.body.appendChild(overlay);
    window._dataStrikePendingCount = count;
}

function _dataStrikeResolve(type) {
    const overlay = document.getElementById('data-strike-overlay');
    if (overlay) overlay.remove();

    const count = window._dataStrikePendingCount || 1;
    window._dataStrikePendingCount = null;

    let solved = 0;
    if (type === 'rows') {
        solved = solveRows(count);
    } else {
        solved = solveCols(count);
    }

    const typeName = type === 'rows'
        ? (LANG === 'de' ? 'Zeile(n)' : 'row(s)')
        : (LANG === 'de' ? 'Spalte(n)' : 'col(s)');
    _playSlashEffect(type === 'cols');
    showToast(`⚔️ ${solved} ${typeName} ${LANG === 'de' ? 'gelöst!' : 'solved!'}`);
    if (solved > 0) checkWin();
}

function _dataStrikeCancel() {
    const overlay = document.getElementById('data-strike-overlay');
    if (overlay) overlay.remove();
    window._dataStrikePendingCount = null;

    // Re-arm the ability since the player cancelled
    STATE.classActiveChoice = 'active1';
    activeAbilityMode = false;

    // Also refund the cooldown since we cancel before execution
    // (cooldown was started in executeActiveAbility before this function was called,
    //  so we need to clear it)
    const cd = cooldownState['active1'];
    if (cd.interval) { clearInterval(cd.interval); cd.interval = null; }
    cd.remaining = 0;
    buildClassHUD();


    showToast(LANG === 'de' ? '⚔️ Abgebrochen.' : '⚔️ Cancelled.');
}

// _executePrecisionMark — marks all empty cells in the target row+col
//   plus 'extraLines' additional adjacent rows and columns.
function _executePrecisionMark(row, col, extraLines) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    const targetRows = new Set([row]);
    const targetCols = new Set([col]);

    for (let i = 1; i <= extraLines; i++) {
        if (row - i >= 0) targetRows.add(row - i);
        if (row + i < rows) targetRows.add(row + i);
        if (col - i >= 0) targetCols.add(col - i);
        if (col + i < cols) targetCols.add(col + i);
    }

    const affected = [];
    targetRows.forEach(r => {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 0 && userGrid[r][c] === 0) {
                userGrid[r][c] = 2;
                renderCell(r, c);
                affected.push(`g-${r}-${c}`);
            }
        }
    });
    targetCols.forEach(c => {
        for (let r = 0; r < rows; r++) {
            if (sol[r][c] === 0 && userGrid[r][c] === 0) {
                userGrid[r][c] = 2;
                renderCell(r, c);
                affected.push(`g-${r}-${c}`);
            }
        }
    });

    _playPrecisionMarkEffect(row, col);
    _applyCellEffect(affected, 'mark');
    showToast(`🎯 ${affected.length} ${LANG === 'de' ? 'Zellen markiert!' : 'cells marked!'}`);
}



// _executeArcaneFreeze — Mathmagician active.
// Freezes the timer for `durationMs` ms. During this window
// all wrong fills cost zero time (window._freezeActive flag).
function _executeArcaneFreeze(durationMs) {
    timerFrozen = true;
    _startBlizzardEffect(durationMs);
    window._freezeActive = true;
    updTimer();

    const secs = Math.ceil(durationMs / 1000);
    showToast(`🔮 Absolute Zero! ${secs}s!`);

    let remaining = secs;
    const tick = setInterval(() => {
        remaining--;
        const el = document.getElementById('timer-val');
        if (el) el.textContent = `❄️ ${remaining}s`;
        if (remaining <= 0) clearInterval(tick);
    }, 1000);

    setTimeout(() => {
        timerFrozen = false;
        window._freezeActive = false;
        clearInterval(tick);
        updTimer();
        showToast('🔮 Absolute Zero ended!');
        buildClassHUD();
    }, durationMs);
}

// _executeDiagonalStrike — Statistician active.
// Clicks a cell; if it's correct in the solution, reveals all correct
// cells along `diagonalCount` diagonal directions through that cell.
// If it's empty in the solution, marks all empty cells in those diagonals.
function _executeDiagonalStrike(row, col, diagonalCount) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    const allDirs = [
        [[1, 1], [-1, -1]],   // main diagonal ↘↖
        [[1, -1], [-1, 1]],   // anti-diagonal ↙↗
    ];
    const dirs = allDirs.slice(0, Math.min(diagonalCount, 2));
    const affected = [];

    dirs.forEach(pair => {
        pair.forEach(([dr, dc]) => {
            let r = row + dr, c = col + dc;
            while (r >= 0 && r < rows && c >= 0 && c < cols) {
                if (sol[r][c] === 1) {
                    if (!revealedGrid[r][c] && userGrid[r][c] !== 1) {
                        revealedGrid[r][c] = true;
                        userGrid[r][c] = 1;
                        renderCell(r, c);
                        updClues(r, c);
                        affected.push(`g-${r}-${c}`);
                    }
                } else if (sol[r][c] === 0) {
                    if (userGrid[r][c] === 0) {
                        userGrid[r][c] = 2;
                        renderCell(r, c);
                        affected.push(`g-${r}-${c}`);
                    }
                }
                r += dr; c += dc;
            }
        });
    });

    // Also process the clicked cell itself
    if (sol[row][col] === 1 && !revealedGrid[row][col] && userGrid[row][col] !== 1) {
        revealedGrid[row][col] = true;
        userGrid[row][col] = 1;
        renderCell(row, col);
        updClues(row, col);
        affected.push(`g-${row}-${col}`);
    } else if (sol[row][col] === 0 && userGrid[row][col] === 0) {
        userGrid[row][col] = 2;
        renderCell(row, col);
        affected.push(`g-${row}-${col}`);
    }

    // Rank 3 (diagonalCount >= 4): also cover the full row and column
    if (diagonalCount >= 4) {
        for (let c = 0; c < cols; c++) {
            if (sol[row][c] === 1 && !revealedGrid[row][c] && userGrid[row][c] !== 1) {
                revealedGrid[row][c] = true;
                userGrid[row][c] = 1;
                renderCell(row, c);
                updClues(row, c);
                affected.push(`g-${row}-${c}`);
            } else if (sol[row][c] === 0 && userGrid[row][c] === 0) {
                userGrid[row][c] = 2;
                renderCell(row, c);
                affected.push(`g-${row}-${c}`);
            }
        }
        for (let r = 0; r < rows; r++) {
            if (sol[r][col] === 1 && !revealedGrid[r][col] && userGrid[r][col] !== 1) {
                revealedGrid[r][col] = true;
                userGrid[r][col] = 1;
                renderCell(r, col);
                updClues(r, col);
                affected.push(`g-${r}-${col}`);
            } else if (sol[r][col] === 0 && userGrid[r][col] === 0) {
                userGrid[r][col] = 2;
                renderCell(r, col);
                affected.push(`g-${r}-${col}`);
            }
        }
    }
    _playDiagonalSlashEffect(row, col, diagonalCount);
    _applyCellEffect(affected, 'reveal');

    const diagRevealed = affected.filter(id => {
        const [, r, c] = id.split('-').map(Number);
        return cur.grid[r][c] === 1;
    }).length;
    if (diagRevealed > 0) trackAchStat('tilesRevealed', diagRevealed);


    showToast(`⚔️ Diagonal Strike! ${affected.length} cell(s) affected.`);
    checkWin();
}

// _executeFieldScan — Probabilist active.
// Temporarily reveals a random region of the grid for `durationMs` ms.
// Adds a CSS class to show correct/empty state, then removes it.
function _executeFieldScan(scanSize, durationMs) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // Pick a random top-left corner that keeps the region in bounds
    const maxRow = Math.max(0, rows - scanSize);
    const maxCol = Math.max(0, cols - scanSize);
    const startRow = Math.floor(Math.random() * (maxRow + 1));
    const startCol = Math.floor(Math.random() * (maxCol + 1));

    const scanned = [];
    const prevStates = []; // to restore

    for (let r = startRow; r < Math.min(startRow + scanSize, rows); r++) {
        for (let c = startCol; c < Math.min(startCol + scanSize, cols); c++) {
            // Only show cells not already permanently revealed/filled
            if (userGrid[r][c] !== 1 && !revealedGrid[r][c]) {
                const el = document.getElementById(`g-${r}-${c}`);
                if (!el) continue;
                prevStates.push({ r, c, html: el.className });
                // Temporarily apply correct class
                el.classList.remove('filled', 'marked', 'wrong-mark', 'revealed', 'questioned');
                if (sol[r][c] === 1) {
                    el.classList.add('filled', 'scan-reveal');
                } else {
                    el.classList.add('marked', 'scan-reveal');
                }
                scanned.push(el);
            }
        }
    }

    _playScanBeamEffect(startRow, startCol, scanSize, durationMs);
    showToast(`🎯 Field Scan! Memorize the ${scanSize}×${scanSize} region!`);

    // probabilist_big_scan: count correct cells shown in this scan
    const correctInScan = prevStates.filter(({ r, c }) => sol[r][c] === 1).length;
    if (correctInScan >= 20) {
        trackAchStat('probabilistBigScan');
    }

    setTimeout(() => {
        // Restore all cells to their actual userGrid state
        prevStates.forEach(({ r, c }) => {
            renderCell(r, c);
        });
        scanned.forEach(el => el.classList.remove('scan-reveal'));
        showToast('🎯 Scan faded — play from memory!');
        buildClassHUD();
    }, durationMs);
}


// ═══════════════════════════════════════════════
//  ABILITY VISUAL EFFECTS
// ═══════════════════════════════════════════════

// _startBlizzardEffect — creates a snowflake blizzard overlay for Absolute Zero.
function _startBlizzardEffect(durationMs) {
    // Remove any existing blizzard
    document.getElementById('ability-blizzard-overlay')?.remove();
    document.getElementById('ability-ice-tint')?.remove();

    const tint = document.createElement('div');
    tint.id = 'ability-ice-tint';
    document.body.appendChild(tint);

    const overlay = document.createElement('div');
    overlay.id = 'ability-blizzard-overlay';
    document.body.appendChild(overlay);

    const flakeChars = ['❄', '❅', '❆', '✦', '·'];
    const flakeCount = 60;
    const spawnInterval = durationMs / flakeCount;

    let spawned = 0;
    const spawnTimer = setInterval(() => {
        if (spawned >= flakeCount) { clearInterval(spawnTimer); return; }
        spawned++;

        const flake = document.createElement('div');
        flake.className = 'blizzard-flake';
        flake.textContent = flakeChars[Math.floor(Math.random() * flakeChars.length)];
        flake.style.left = (Math.random() * 100) + 'vw';
        flake.style.fontSize = (10 + Math.random() * 14) + 'px';
        flake.style.animationDuration = (1.5 + Math.random() * 2) + 's';
        flake.style.animationDelay = (Math.random() * 0.5) + 's';
        overlay.appendChild(flake);
    }, spawnInterval);

    setTimeout(() => {
        overlay.style.transition = 'opacity 0.8s';
        tint.style.transition = 'opacity 0.8s';
        overlay.style.opacity = '0';
        tint.style.opacity = '0';
        setTimeout(() => { overlay.remove(); tint.remove(); }, 800);
    }, durationMs);
}

// _playSlashEffect — red slashes sweep across the puzzle grid area for Data Strike.
//   vertical=true → column strike (vertical slashes), else row strike (horizontal).
function _playSlashEffect(vertical = false) {
    const wrap = document.getElementById('puzzle-scaler');
    if (!wrap) return;
    if (!wrap.style.position || wrap.style.position === 'static') wrap.style.position = 'relative';

    // Find the actual grid area by measuring the first and last grid cells
    const sol = cur?.grid;
    if (!sol) return;
    const rows = sol.length, cols = sol[0].length;

    const firstCell = document.getElementById('g-0-0');
    const lastCell = document.getElementById(`g-${rows - 1}-${cols - 1}`);
    if (!firstCell || !lastCell) return;

    const wrapRect = wrap.getBoundingClientRect();
    const zoom = currentZoom || 1;

    const gridTop = (firstCell.getBoundingClientRect().top - wrapRect.top) / zoom;
    const gridLeft = (firstCell.getBoundingClientRect().left - wrapRect.left) / zoom;
    const gridBottom = (lastCell.getBoundingClientRect().bottom - wrapRect.top) / zoom;
    const gridRight = (lastCell.getBoundingClientRect().right - wrapRect.left) / zoom;
    const gridH = gridBottom - gridTop;
    const gridW = gridRight - gridLeft;

    const slashCount = 3;

    for (let i = 0; i < slashCount; i++) {
        const slash = document.createElement('div');
        slash.style.cssText = `
            position: absolute;
            pointer-events: none;
            z-index: 300;
            border-radius: 3px;
            opacity: 0;
            animation: slash-sweep ${0.55}s ease-out forwards;
            animation-delay: ${i * 0.12}s;
            box-shadow: 0 0 18px 4px rgba(231,76,60,0.7), 0 0 40px 8px rgba(231,76,60,0.35);
        `;

        if (!vertical) {
            // Horizontal slashes evenly spaced across grid height
            const yPos = gridTop + (gridH / (slashCount + 1)) * (i + 1) - 3;
            slash.style.left = gridLeft + 'px';
            slash.style.width = gridW + 'px';
            slash.style.top = yPos + 'px';
            slash.style.height = '6px';
            slash.style.background = 'linear-gradient(90deg, transparent 0%, #e74c3c 30%, #fff 50%, #e74c3c 70%, transparent 100%)';
        } else {
            // Vertical slashes evenly spaced across grid width
            const xPos = gridLeft + (gridW / (slashCount + 1)) * (i + 1) - 3;
            slash.style.top = gridTop + 'px';
            slash.style.height = gridH + 'px';
            slash.style.left = xPos + 'px';
            slash.style.width = '6px';
            slash.style.background = 'linear-gradient(180deg, transparent 0%, #e74c3c 30%, #fff 50%, #e74c3c 70%, transparent 100%)';
        }

        wrap.appendChild(slash);
        setTimeout(() => slash.remove(), 900 + i * 120);
    }
}


// _playDiagonalSlashEffect — diagonal red slash(es) through the clicked cell.
//   diagonalCount=1 → main diagonal only (↘, 45°)
//   diagonalCount=2 → both diagonals (↘ + ↙)
//   diagonalCount=4 → both diagonals + H + V lines (rank 3)
//   row/col tell us exactly where to anchor the slash.

function _playDiagonalSlashEffect(row, col, diagonalCount) {
    const wrap = document.getElementById('puzzle-scaler');
    if (!wrap) return;
    if (!wrap.style.position || wrap.style.position === 'static') wrap.style.position = 'relative';

    const sol = cur?.grid;
    if (!sol) return;
    const rows = sol.length, cols = sol[0].length;

    const cellEl = document.getElementById(`g-${row}-${col}`);
    if (!cellEl) return;

    const wrapRect = wrap.getBoundingClientRect();
    const cellRect = cellEl.getBoundingClientRect();
    const zoom = currentZoom || 1;

    // Centre of clicked cell in logical pixels inside the scaler
    const cx = (cellRect.left + cellRect.width / 2 - wrapRect.left) / zoom;
    const cy = (cellRect.top + cellRect.height / 2 - wrapRect.top) / zoom;

    // Grid extents for diagonal length calculation
    const firstCell = document.getElementById('g-0-0');
    const lastCell = document.getElementById(`g-${rows - 1}-${cols - 1}`);
    if (!firstCell || !lastCell) return;

    const gridW = (lastCell.getBoundingClientRect().right - firstCell.getBoundingClientRect().left) / zoom;
    const gridH = (lastCell.getBoundingClientRect().bottom - firstCell.getBoundingClientRect().top) / zoom;
    const diagLen = Math.sqrt(gridW * gridW + gridH * gridH) * 1.15;

    const container = document.createElement('div');
    container.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 300;
        overflow: hidden;
    `;
    wrap.appendChild(container);

    // Each slash is a thin bar centred on the clicked cell, rotated to the right angle.
    // We animate opacity directly (no clip-path) so rotation doesn't break the animation.
    const makeSlash = (deg, delay) => {
        const s = document.createElement('div');
        s.style.cssText = `
            position: absolute;
            width: 5px;
            height: ${diagLen}px;
            left: ${cx - 2.5}px;
            top:  ${cy - diagLen / 2}px;
            transform-origin: center center;
            transform: rotate(${deg}deg);
            background: linear-gradient(
                180deg,
                transparent 0%,
                #e74c3c 20%,
                #ffffff 50%,
                #e74c3c 80%,
                transparent 100%
            );
            box-shadow: 0 0 10px 3px rgba(231,76,60,0.7), 0 0 24px 6px rgba(231,76,60,0.35);
            border-radius: 3px;
            opacity: 0;
            animation: diag-fade-in-out 0.65s ease-out ${delay}s forwards;
        `;
        container.appendChild(s);
    };

    // Rank 1 → main diagonal ↘ (135°)
    makeSlash(135, 0);

    // Rank 2 → add anti-diagonal ↙ (45°)
    if (diagonalCount >= 2) makeSlash(45, 0.1);

    // Rank 3 → also horizontal (0°) and vertical (90°)
    if (diagonalCount >= 4) {
        makeSlash(0, 0.05);
        makeSlash(90, 0.15);
    }

    setTimeout(() => container.remove(), 1200);
}

// _spawnArcaneSparkles — floats sparkle emojis up from revealed cells.
function _spawnArcaneSparkles(cellIds) {
    const wrap = document.getElementById('puzzle-scaler');
    if (!wrap) return;

    // Ensure wrap is a positioning context
    if (!wrap.style.position || wrap.style.position === 'static') wrap.style.position = 'relative';

    const wrapRect = wrap.getBoundingClientRect();
    const zoom = currentZoom || 1;
    const sparkleChars = ['✦', '✧', '⋆', '★', '◆', '🔮'];

    // Limit to first 20 so it doesn't overwhelm on large reveals
    cellIds.slice(0, 20).forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();

        // Convert screen-pixel position to logical pixels inside scaler
        const cx = (rect.left + rect.width / 2 - wrapRect.left) / zoom;
        const cy = (rect.top + rect.height / 2 - wrapRect.top) / zoom;

        const count = 2 + Math.floor(Math.random() * 2);
        for (let j = 0; j < count; j++) {
            setTimeout(() => {
                const sp = document.createElement('div');
                sp.className = 'arcane-sparkle';
                sp.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
                sp.style.cssText = `
                    position: absolute;
                    left: ${cx + (Math.random() - 0.5) * 28}px;
                    top: ${cy + (Math.random() - 0.5) * 20}px;
                    color: ${['#c39bd3', '#9b59b6', '#a29bfe', '#d6a2e8'][Math.floor(Math.random() * 4)]};
                    font-size: 16px;
                    pointer-events: none;
                    z-index: 310;
                    user-select: none;
                    animation: sparkle-burst ${0.5 + Math.random() * 0.4}s ease-out forwards;
                `;
                wrap.appendChild(sp);
                setTimeout(() => sp.remove(), 900);
            }, i * 18 + j * 40);
        }
    });
}

// _playPrecisionMarkEffect — green crosshair lines pulse through the targeted row/col.
function _playPrecisionMarkEffect(row, col) {
    const wrap = document.getElementById('puzzle-scaler');
    if (!wrap) return;

    // Make sure wrap is a positioning context
    const prevPosition = wrap.style.position;
    if (!prevPosition || prevPosition === 'static') wrap.style.position = 'relative';

    const cellEl = document.getElementById(`g-${row}-${col}`);
    if (!cellEl) return;

    // getBoundingClientRect() returns screen pixels (after CSS scale).
    // We need logical pixels (before scale) for positioning inside wrap.
    const wrapRect = wrap.getBoundingClientRect();
    const cellRect = cellEl.getBoundingClientRect();
    const zoom = currentZoom || 1;

    // Convert screen-pixel offsets to logical pixels inside the scaler
    const centerY = (cellRect.top + cellRect.height / 2 - wrapRect.top) / zoom;
    const centerX = (cellRect.left + cellRect.width / 2 - wrapRect.left) / zoom;

    // Horizontal line spanning the full width of the scaler
    const lineH = document.createElement('div');
    lineH.className = 'precision-line-h';
    lineH.style.cssText = `
        position:absolute;
        top:${centerY - 1.5}px;
        left:0; right:0;
        height:3px;
        pointer-events:none;
        z-index:305;
    `;
    wrap.appendChild(lineH);

    // Vertical line spanning the full height of the scaler
    const lineV = document.createElement('div');
    lineV.className = 'precision-line-v';
    lineV.style.cssText = `
        position:absolute;
        left:${centerX - 1.5}px;
        top:0; bottom:0;
        width:3px;
        pointer-events:none;
        z-index:305;
    `;
    wrap.appendChild(lineV);

    setTimeout(() => { lineH.remove(); lineV.remove(); }, 700);
}

// _playScanBeamEffect — a glowing green beam sweeps over the scan region top-to-bottom.
function _playScanBeamEffect(startRow, startCol, scanSize, durationMs) {
    const wrap = document.getElementById('puzzle-scaler');
    if (!wrap) return;

    const prevPosition = wrap.style.position;
    if (!prevPosition || prevPosition === 'static') wrap.style.position = 'relative';

    const rows = cur?.grid?.length || 99;
    const endRow = Math.min(startRow + scanSize - 1, rows - 1);

    const topCellEl = document.getElementById(`g-${startRow}-${startCol}`);
    const botCellEl = document.getElementById(`g-${endRow}-${startCol}`);
    if (!topCellEl || !botCellEl) return;

    const wrapRect = wrap.getBoundingClientRect();
    const topRect = topCellEl.getBoundingClientRect();
    const botRect = botCellEl.getBoundingClientRect();
    const zoom = currentZoom || 1;

    // Convert to logical pixels inside the scaler
    const regionTop = (topRect.top - wrapRect.top) / zoom;
    const regionBottom = (botRect.bottom - wrapRect.top) / zoom;
    const regionHeight = regionBottom - regionTop;

    const beamH = 40; // px, logical

    // Remove any leftover beam + style from a previous cast
    document.getElementById('ability-scan-beam')?.remove();
    document.getElementById('scan-beam-style')?.remove();

    // Inject a fresh keyframe that travels exactly from top to bottom of region
    const styleTag = document.createElement('style');
    styleTag.id = 'scan-beam-style';
    styleTag.textContent = `
        @keyframes scan-beam-move-dynamic {
            0%   { opacity: 0;   top: ${regionTop}px; }
            6%   { opacity: 1; }
            94%  { opacity: 1; }
            100% { opacity: 0;   top: ${regionTop + Math.max(0, regionHeight - beamH)}px; }
        }
    `;
    document.head.appendChild(styleTag);

    const beam = document.createElement('div');
    beam.id = 'ability-scan-beam';
    beam.style.cssText = `
        position: absolute;
        left: 0; right: 0;
        height: ${beamH}px;
        top: ${regionTop}px;
        pointer-events: none;
        z-index: 308;
        background: linear-gradient(180deg,
            rgba(39,174,96,0) 0%,
            rgba(39,174,96,0.55) 40%,
            rgba(150,255,200,0.85) 50%,
            rgba(39,174,96,0.55) 60%,
            rgba(39,174,96,0) 100%
        );
        box-shadow: 0 0 24px 6px rgba(39,174,96,0.4);
        animation: scan-beam-move-dynamic ${durationMs}ms linear forwards;
    `;

    wrap.appendChild(beam);
    setTimeout(() => { beam.remove(); styleTag.remove(); }, durationMs + 150);
}




// ═══════════════════════════════════════════════
//  COOLDOWN SYSTEM  (per-slot, independent)
// ═══════════════════════════════════════════════

// startSlotCooldown — starts an independent countdown for one skill slot.
//   Updates only that slot's button each tick by patching the DOM directly,
//   avoiding a full HUD rebuild on every tick.
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

// _patchCooldownButton — updates only the button text for one slot
//   without rebuilding the entire HUD. Falls back to full rebuild if
//   the button element can't be found (e.g. panel was just re-rendered).
function _patchCooldownButton(slot) {
    // Target the cd-timer span inside the slot's section
    const section = document.querySelector(
        `#class-hud-panel .chud-active-section[data-slot="${slot}"]`
    );
    if (!section) return; // panel not in DOM yet, skip silently

    const timerEl = section.querySelector('.chud-cd-timer');
    if (timerEl) {
        timerEl.textContent = formatCooldown(cooldownState[slot].remaining);
    }
}

// startActiveCooldown — legacy wrapper kept so nothing outside breaks.
//   Previously used a single shared timer; now delegates to startSlotCooldown.
function startActiveCooldown(seconds) {
    // No-op: executeActiveAbility now calls startSlotCooldown directly.
    // Kept to avoid ReferenceErrors from any stale call sites.
}

function updateCooldownDisplay() {
    // No longer needed — per-slot patching handles updates.
}

function resetActiveCooldown() {
    // Clear both slot timers
    ['active1', 'active2'].forEach(slot => {
        if (cooldownState[slot].interval) clearInterval(cooldownState[slot].interval);
        cooldownState[slot].interval = null;
        cooldownState[slot].remaining = 0;
    });
    activeCooldownRemaining = 0;
    cooldownInterval = null;
    activeAbilityMode = false;
    correctFillStreak = 0;
    nextPenaltyHalved = false;
    const wrap = document.getElementById('puzzle-scaler-wrap');
    if (wrap) wrap.style.cursor = '';
}


// ═══════════════════════════════════════════════
//  PASSIVE EFFECTS — hooks called from other modules
// ═══════════════════════════════════════════════

// applyClassPassiveOnLevelStart — called at the start of each level
//   to apply the passive effect before play begins.
function applyClassPassiveOnLevelStart() {
    correctFillStreak = 0;
    nextPenaltyHalved = false;
    window._momentumThisLevel = 0; // reset per-level momentum counter

    if (!STATE.playerClass) return;
    const def = CLASS_DEFS[STATE.playerClass];
    const passLv = STATE.classPassiveLevel || 1;
    const effect = def.passive.levels[passLv - 1].effect;

    if (STATE.playerClass === 'mathmagician') {
        // Free mistakes are stored as a level-start variable
        window._classFreeMistakes = effect.freeMistakes || 0;
    }

    if (STATE.playerClass === 'probabilist' && effect.autoMarkCount) {
        // Auto-mark empty cells after a brief delay (grid needs to be built first)
        setTimeout(() => {
            markWrongTiles(effect.autoMarkCount);
        }, 300);
    }
}

// getClassPenaltyMultiplier — returns the penalty time multiplier for this mistake.
//   Called from applyPenalty() in input.js.
function getClassPenaltyMultiplier() {
    if (!STATE.playerClass) return 1.0;
    const def = CLASS_DEFS[STATE.playerClass];
    const passLv = STATE.classPassiveLevel || 1;
    const effect = def.passive.levels[passLv - 1].effect;

    if (STATE.playerClass === 'mathmagician') {
        // Check free mistakes
        if (window._classFreeMistakes > 0) {
            window._classFreeMistakes--;
            absorbedMistakes++;
            trackAchStat('mistakesAbsorbed');
            return 0.0; // free! no penalty
        }
    }

    return 1.0;
}

// onCorrectFill — called from ac() in input.js when a correct cell is filled.
//   Used by Statistician passive to track streak.
function onCorrectFill() {
    if (!STATE.playerClass) return;
    if (STATE.playerClass !== 'statistician') return;
    const def = CLASS_DEFS['statistician'];
    const passLv = STATE.classPassiveLevel || 1;
    const effect = def.passive.levels[passLv - 1].effect;

    correctFillStreak++;
    if (correctFillStreak >= effect.streakForBonus) {
        correctFillStreak = 0;
        timerSecs = Math.min(timerSecs + effect.bonusSeconds, 3600);
        updTimer();
        showToast(`⚔️ Momentum! +${effect.bonusSeconds}s`);
        trackAchStat('timeAdded', effect.bonusSeconds);
        trackAchStat('momentumTriggered');

        // statistician_momentum_level: count triggers within a single level
        window._momentumThisLevel = (window._momentumThisLevel || 0) + 1;
        if (window._momentumThisLevel === 3) {
            trackAchStat('statistician3MomentumOneLevel');
        }
    }
}

function onMistake() {
    correctFillStreak = 0;
}