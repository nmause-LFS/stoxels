// ═══════════════════════════════════════════════
//  CLASS SYSTEM  (class.js)
//  Players unlock a class after completing all
//  levels in a world for the first time.
//  First world completion → class selection screen
//  Subsequent completions → class upgrade screen
//
//  Each class has:
//    - A passive effect (always active)
//    - An active ability (click to activate, then
//      click the grid to trigger the effect)
//  Both start at level 1 ("weak") and can be
//  upgraded once per world completion.
// ═══════════════════════════════════════════════


// ═══════════════════════════════════════════════
//  CLASS DEFINITIONS
// ═══════════════════════════════════════════════

const CLASS_DEFS = {

    // ── MATHMAGICIAN (Mage archetype) ──────────────────────────────────────
    mathmagician: {
        id: 'mathmagician',
        icon: '🔮',
        nameEn: 'Mathmagician',
        nameDE: 'Mathemagier',
        descEn: 'Wield the arcane power of probability. Master of chance and revelation.',
        descDE: 'Wielding die arkane Macht der Wahrscheinlichkeit. Meister des Zufalls.',
        color: '#9b59b6',
        colorLight: '#c39bd3',

        passive: {
            nameEn: 'Variance Shield',
            nameDE: 'Varianzschild',
            levels: [
                {
                    level: 1,
                    descEn: 'Start each level with 1 free mistake (no time penalty for the first wrong fill).',
                    descDE: 'Beginne jedes Level mit 1 freiem Fehler (kein Zeitabzug für den ersten falschen Klick).',
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
            cooldownSeconds: 120,
            levels: [
                {
                    level: 1,
                    descEn: 'Click a cell to reveal the correct state of all cells within 1 step (up to 9 cells). 2-minute cooldown.',
                    descDE: 'Klicke eine Zelle, um alle Zellen im Umkreis von 1 Schritt zu enthüllen (bis zu 9 Zellen). 2 Minuten Abklingzeit.',
                    effect: { radius: 1 }
                },
                {
                    level: 2,
                    descEn: 'Reveal radius expands to 2 steps (up to 25 cells). 2-minute cooldown.',
                    descDE: 'Enthüllungsradius auf 2 Schritte erweitert (bis zu 25 Zellen). 2 Minuten Abklingzeit.',
                    effect: { radius: 2 }
                },
                {
                    level: 3,
                    descEn: 'Reveal radius expands to 3 steps (up to 49 cells). 2-minute cooldown.',
                    descDE: 'Enthüllungsradius auf 3 Schritte erweitert (bis zu 49 Zellen). 2 Minuten Abklingzeit.',
                    effect: { radius: 3 }
                },
            ]
        },

        active2: {
            nameEn: 'Arcane Freeze',
            nameDE: 'Arkanfrieren',
            descCursorEn: 'Activate to freeze time and click mistake-free',
            descCursorDE: 'Aktiviere zum Einfrieren der Zeit ohne Strafklicks',
            cooldownSeconds: 90,
            levels: [
                {
                    level: 1,
                    descEn: 'Freeze the timer for 3s — all mistakes during the freeze cost NO time. Click as many correct tiles as you can! 90s cooldown.',
                    descDE: 'Friere den Timer für 3s ein — alle Fehler kosten keine Zeit. Klicke so viele richtige Felder wie möglich! 90s Abklingzeit.',
                    effect: { freezeDuration: 3000 }
                },
                {
                    level: 2,
                    descEn: 'Freeze the timer for 4s — no time penalties during the freeze. 90s cooldown.',
                    descDE: 'Friere den Timer für 4s ein — keine Zeitstrafen. 90s Abklingzeit.',
                    effect: { freezeDuration: 4000 }
                },
                {
                    level: 3,
                    descEn: 'Freeze the timer for 5s — no time penalties during the freeze. 90s cooldown.',
                    descDE: 'Friere den Timer für 5s ein — keine Zeitstrafen. 90s Abklingzeit.',
                    effect: { freezeDuration: 5000 }
                },
            ]
        },

    },

    // ── STATISTICIAN (Warrior archetype) ──────────────────────────────────
    statistician: {
        id: 'statistician',
        icon: '⚔️',
        nameEn: 'Statistician',
        nameDE: 'Statistiker',
        descEn: 'Harness the power of data. Every mistake is a sample. Every victory is a distribution.',
        descDE: 'Die Macht der Daten nutzen. Jeder Fehler ist eine Stichprobe. Jeder Sieg eine Verteilung.',
        color: '#e74c3c',
        colorLight: '#f1948a',

        passive: {
            nameEn: 'Mean Reversion',
            nameDE: 'Mittelwertrückkehr',
            levels: [
                {
                    level: 1,
                    descEn: 'After every 3 correct fills in a row, the next mistake\'s time penalty is halved.',
                    descDE: 'Nach je 3 korrekten Klicks hintereinander wird der Zeitabzug des nächsten Fehlers halbiert.',
                    effect: { streakForHalfPenalty: 3 }
                },
                {
                    level: 2,
                    descEn: 'After every 2 correct fills in a row, the next mistake\'s time penalty is halved.',
                    descDE: 'Nach je 2 korrekten Klicks hintereinander wird der Zeitabzug des nächsten Fehlers halbiert.',
                    effect: { streakForHalfPenalty: 2 }
                },
                {
                    level: 3,
                    descEn: 'Any mistake\'s time penalty is always halved.',
                    descDE: 'Der Zeitabzug für jeden Fehler wird immer halbiert.',
                    effect: { streakForHalfPenalty: 0 }
                },
            ]
        },

        active1: {
            nameEn: 'Data Strike',
            nameDE: 'Datenhieb',
            descCursorEn: 'Click a row or column clue to instantly solve that line',
            descCursorDE: 'Klicke auf einen Zeilen- oder Spaltenhinweis, um diese Linie sofort zu lösen',
            cooldownSeconds: 150,
            levels: [
                {
                    level: 1,
                    descEn: 'Instantly solve 1 random unsolved row OR column (your choice via a prompt). 2.5-minute cooldown.',
                    descDE: 'Löse sofort 1 zufällige ungelöste Zeile ODER Spalte (Auswahl per Klick). 2,5 Minuten Abklingzeit.',
                    effect: { solveCount: 1 }
                },
                {
                    level: 2,
                    descEn: 'Instantly solve 2 random unsolved rows OR columns. 2.5-minute cooldown.',
                    descDE: 'Löse sofort 2 zufällige ungelöste Zeilen ODER Spalten. 2,5 Minuten Abklingzeit.',
                    effect: { solveCount: 2 }
                },
                {
                    level: 3,
                    descEn: 'Instantly solve 3 random unsolved rows OR columns. 2.5-minute cooldown.',
                    descDE: 'Löse sofort 3 zufällige ungelöste Zeilen ODER Spalten. 2,5 Minuten Abklingzeit.',
                    effect: { solveCount: 3 }
                },
            ]
        },

        active2: {
            nameEn: 'Diagonal Strike',
            nameDE: 'Diagonalschlag',
            descCursorEn: 'Left-click a correct cell to reveal its diagonal; right-click to mark diagonal empties',
            descCursorDE: 'Linksklick auf richtige Zelle enthüllt Diagonale; Rechtsklick markiert leere Diagonalen',
            cooldownSeconds: 120,
            levels: [
                {
                    level: 1,
                    descEn: 'Click a cell: if correct, reveals all correct cells along 1 diagonal through it. If wrong, marks all empty cells along 1 diagonal. 120s cooldown.',
                    descDE: 'Klicke eine Zelle: Wenn richtig, werden alle richtigen Zellen entlang 1 Diagonale enthüllt. Wenn leer, werden alle leeren Zellen entlang 1 Diagonale markiert. 120s Abklingzeit.',
                    effect: { diagonals: 1 }
                },
                {
                    level: 2,
                    descEn: 'Same effect but covers 2 diagonals (both directions). 120s cooldown.',
                    descDE: 'Gleicher Effekt, aber 2 Diagonalen (beide Richtungen). 120s Abklingzeit.',
                    effect: { diagonals: 2 }
                },
                {
                    level: 3,
                    descEn: 'Covers all 4 diagonals through the clicked cell. 120s cooldown.',
                    descDE: 'Alle 4 Diagonalen durch die angeklickte Zelle. 120s Abklingzeit.',
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
        descDE: 'Chancen berechnen. Präzise zuschlagen. Die Ergebnismenge ist dein Jagdrevier.',
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
            cooldownSeconds: 100,
            levels: [
                {
                    level: 1,
                    descEn: 'Click a cell: marks all wrong (empty) cells in that row AND column with ✕. ~1.7-minute cooldown.',
                    descDE: 'Klicke eine Zelle: markiert alle falschen (leeren) Zellen in dieser Zeile UND Spalte. ~1,7 Min. Abklingzeit.',
                    effect: { crossMark: true, extraLines: 0 }
                },
                {
                    level: 2,
                    descEn: 'Marks wrong cells in the clicked row, column + 1 adjacent row and column. ~1.7-minute cooldown.',
                    descDE: 'Markiert falsche Zellen in Zeile, Spalte + 1 angrenzende Zeile und Spalte. ~1,7 Min. Abklingzeit.',
                    effect: { crossMark: true, extraLines: 1 }
                },
                {
                    level: 3,
                    descEn: 'Marks wrong cells in the clicked row, column + 2 adjacent rows and columns. ~1.7-minute cooldown.',
                    descDE: 'Markiert falsche Zellen in Zeile, Spalte + 2 angrenzende Zeilen und Spalten. ~1,7 Min. Abklingzeit.',
                    effect: { crossMark: true, extraLines: 2 }
                },
            ]
        },

        active2: {
            nameEn: 'Field Scan',
            nameDE: 'Feldscan',
            descCursorEn: 'Click to scan a random region — memorize it fast!',
            descCursorDE: 'Klicken zum Scannen einer zufälligen Region — schnell einprägen!',
            cooldownSeconds: 100,
            levels: [
                {
                    level: 1,
                    descEn: 'Reveals a random 4×4 region for 2 seconds — correct tiles glow green, empty tiles show ✕. Memorize and act! ~1.7min cooldown.',
                    descDE: 'Enthüllt eine zufällige 4×4-Region für 2s — richtige Felder leuchten grün, leere zeigen ✕. Einprägen und handeln! ~1,7Min. Abklingzeit.',
                    effect: { scanSize: 4, scanDuration: 2000 }
                },
                {
                    level: 2,
                    descEn: 'Scans a 6×6 region for 3 seconds. ~1.7min cooldown.',
                    descDE: 'Scannt eine 6×6-Region für 3s. ~1,7Min. Abklingzeit.',
                    effect: { scanSize: 6, scanDuration: 3000 }
                },
                {
                    level: 3,
                    descEn: 'Scans a 8×8 region for 4 seconds. ~1.7min cooldown.',
                    descDE: 'Scannt eine 8×8-Region für 4s. ~1,7Min. Abklingzeit.',
                    effect: { scanSize: 8, scanDuration: 4000 }
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

    // Helper to build one active skill block
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

        let btnLabel, btnClass, btnDisabled;
        if (isArmed) {
            btnLabel = LANG === 'de' ? '✕ ABBRECHEN' : '✕ CANCEL';
            btnClass = 'chud-active-btn armed';
            btnDisabled = false;
        } else if (isOnCooldown) {
            btnLabel = formatCooldown(cdRemaining);
            btnClass = 'chud-active-btn on-cooldown';
            btnDisabled = true;
        } else {
            btnLabel = LANG === 'de' ? '▶ EINSETZEN' : '▶ ACTIVATE';
            btnClass = 'chud-active-btn';
            btnDisabled = activeAbilityMode; // disable the OTHER button while one is armed
        }

        return `
            <div class="chud-section" style="border-left: 3px solid ${isArmed ? def.color : 'transparent'}; padding-left: 8px; margin-bottom: 10px;">
                <div class="chud-label active-lbl">🎯 ${LANG === 'de' ? 'AKTIV' : 'ACTIVE'} ${key === 'active1' ? '1' : '2'} <span class="chud-lv">Lv${skillLv}</span></div>
                <div class="chud-skill-name" style="font-weight:bold; color:${isArmed ? def.colorLight : '#ccc'};">${skillName}</div>
                <div class="chud-skill-desc" style="font-size: 0.85em; opacity: 0.9;">${LANG === 'de' ? skillData.descDE : skillData.descEn}</div>
                <button class="${btnClass}"
                        onclick="toggleActiveAbility('${key}')"
                        ${btnDisabled ? 'disabled' : ''}>
                    ${btnLabel}
                </button>
            </div>
        `;
    };

    panel.innerHTML = `
        <div class="chud-icon">${def.icon}</div>
        <div class="chud-name" style="color:${def.colorLight}; font-size: 1.2em; margin-bottom: 10px;">${name}</div>

        <div class="chud-section" style="margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
            <div class="chud-label passive">⚡ ${LANG === 'de' ? 'PASSIV' : 'PASSIVE'} <span class="chud-lv">Lv${passLv}</span></div>
            <div class="chud-skill-name">${passName}</div>
            <div class="chud-skill-desc">${LANG === 'de' ? passData.descDE : passData.descEn}</div>
        </div>

        ${renderActiveSkill('active1')}
        ${renderActiveSkill('active2')}
    `;
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
            case 'mathmagician': _executeArcaneReveal(row, col, effect.radius); break;
            case 'statistician': _executeDataStrike(effect.solveCount); break;
            case 'probabilist': _executePrecisionMark(row, col, effect.extraLines); break;
        }
    } else {
        switch (STATE.playerClass) {
            case 'mathmagician': _executeArcaneFreeze(effect.freezeDuration); break;
            case 'statistician': _executeDiagonalStrike(row, col, effect.diagonals); break;
            case 'probabilist': _executeFieldScan(effect.scanSize, effect.scanDuration); break;
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

    checkWin();
}

// _executeDataStrike — solves N random unsolved rows or columns.
function _executeDataStrike(count) {
    // Randomly choose rows or columns
    const doRows = Math.random() < 0.5;
    let solved = 0;
    if (doRows) {
        solved = solveRows(count);
    } else {
        solved = solveCols(count);
    }
    const typeName = doRows
        ? (LANG === 'de' ? 'Zeile(n)' : 'row(s)')
        : (LANG === 'de' ? 'Spalte(n)' : 'col(s)');
    showToast(`⚔️ ${solved} ${typeName} ${LANG === 'de' ? 'gelöst!' : 'solved!'}`);
    if (solved > 0) checkWin();
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

    _applyCellEffect(affected, 'mark');
    showToast(`🎯 ${affected.length} ${LANG === 'de' ? 'Zellen markiert!' : 'cells marked!'}`);
}



// _executeArcaneFreeze — Mathmagician active.
// Freezes the timer for `durationMs` ms. During this window
// all wrong fills cost zero time (window._freezeActive flag).
function _executeArcaneFreeze(durationMs) {
    timerFrozen = true;
    window._freezeActive = true;
    updTimer();

    const secs = Math.ceil(durationMs / 1000);
    showToast(`🔮 Arcane Freeze! ${secs}s — click fast, no penalties!`);

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
        showToast('🔮 Arcane Freeze ended!');
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
    const isCorrectCell = sol[row][col] === 1;
    const affected = [];

    dirs.forEach(pair => {
        pair.forEach(([dr, dc]) => {
            let r = row + dr, c = col + dc;
            while (r >= 0 && r < rows && c >= 0 && c < cols) {
                if (isCorrectCell && sol[r][c] === 1) {
                    if (!revealedGrid[r][c] && userGrid[r][c] !== 1) {
                        revealedGrid[r][c] = true;
                        userGrid[r][c] = 1;
                        renderCell(r, c);
                        updClues(r, c);
                        affected.push(`g-${r}-${c}`);
                    }
                } else if (!isCorrectCell && sol[r][c] === 0) {
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
    if (isCorrectCell && !revealedGrid[row][col] && userGrid[row][col] !== 1) {
        revealedGrid[row][col] = true;
        userGrid[row][col] = 1;
        renderCell(row, col);
        updClues(row, col);
        affected.push(`g-${row}-${col}`);
    } else if (!isCorrectCell && userGrid[row][col] === 0) {
        userGrid[row][col] = 2;
        renderCell(row, col);
        affected.push(`g-${row}-${col}`);
    }

    const type = isCorrectCell ? 'reveal' : 'mark';
    _applyCellEffect(affected, type);
    showToast(`⚔️ Diagonal Strike! ${affected.length} cell(s) ${isCorrectCell ? 'revealed' : 'marked'}.`);
    if (isCorrectCell) checkWin();
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

    showToast(`🎯 Field Scan! Memorize the ${scanSize}×${scanSize} region!`);

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
    // Buttons are identified by their onclick attribute value
    const btn = document.querySelector(`#class-hud-panel button[onclick="toggleActiveAbility('${slot}')"]`);
    if (!btn) {
        buildClassHUD();
        return;
    }
    btn.textContent = formatCooldown(cooldownState[slot].remaining);
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
            return 0.0; // free! no penalty
        }
    }

    if (STATE.playerClass === 'statistician') {
        const threshold = effect.streakForHalfPenalty;
        if (threshold === 0) {
            // Level 3: always halved
            return 0.5;
        }
        if (nextPenaltyHalved) {
            nextPenaltyHalved = false;
            correctFillStreak = 0;
            return 0.5;
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
    if (effect.streakForHalfPenalty === 0) return; // level 3 always halves

    correctFillStreak++;
    if (correctFillStreak >= effect.streakForHalfPenalty) {
        nextPenaltyHalved = true;
        correctFillStreak = 0;
    }
}