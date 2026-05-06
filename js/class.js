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
        nameDE: 'Mathmagier',
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

        active: {
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
        }
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

        active: {
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
        }
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

        active: {
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
        }
    }
};

const CLASS_LIST = ['statistician', 'mathmagician', 'probabilist'];


// ═══════════════════════════════════════════════
//  ACTIVE ABILITY RUNTIME STATE
// ═══════════════════════════════════════════════

// activeAbilityMode — true when player has clicked the active ability button
//   and is waiting to click a cell to trigger it
let activeAbilityMode = false;

// activeCooldownRemaining — seconds remaining on cooldown (counts down each second)
let activeCooldownRemaining = 0;
let cooldownInterval = null;

// correctFillStreak — for Statistician passive: consecutive correct fills
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
    const passName = LANG === 'de' ? def.passive.nameDE : def.passive.nameEn;
    const passDesc = LANG === 'de'
        ? def.passive.levels[0].descDE
        : def.passive.levels[0].descEn;
    const actName = LANG === 'de' ? def.active.nameDE : def.active.nameEn;
    const actDesc = LANG === 'de'
        ? def.active.levels[0].descDE
        : def.active.levels[0].descEn;

    const onclick = mode === 'select'
        ? `confirmClassSelection('${cid}')`
        : ''; // upgrade mode cards use different handlers

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
                    <span class="cs-ability-tag active">🎯 ${LANG === 'de' ? 'AKTIV' : 'ACTIVE'}</span>
                    <span class="cs-ability-name">${actName}</span>
                    <span class="cs-ability-desc">${actDesc}</span>
                </div>
            </div>
            ${mode === 'select' ? `<div class="cs-card-cta">${LANG === 'de' ? '▶ WÄHLEN' : '▶ SELECT'}</div>` : ''}
        </div>`;
}

function confirmClassSelection(cid) {
    const def = CLASS_DEFS[cid];
    if (!def) return;

    STATE.playerClass = cid;
    STATE.classPassiveLevel = 1;
    STATE.classActiveLevel = 1;
    STATE.classUpgradesAvailable = 0;
    if (!STATE.classWorldsCompleted) STATE.classWorldsCompleted = [];
    STATE.classWorldsCompleted.push(STATE._lastClassWorld);
    save();

    document.getElementById('class-selection-overlay').classList.remove('show');
    showToast(`${def.icon} ${LANG === 'de' ? 'Klasse gewählt:' : 'Class chosen:'} ${LANG === 'de' ? def.nameDE : def.nameEn}!`);

    // Apply passive immediately for next level
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
    const actLv = STATE.classActiveLevel || 1;
    const maxLv = 3;

    const passAtMax = passLv >= maxLv;
    const actAtMax = actLv >= maxLv;
    const bothMax = passAtMax && actAtMax;

    const passNext = def.passive.levels[passLv] || null; // next level data (0-indexed)
    const actNext = def.active.levels[actLv] || null;

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

            <!-- Passive upgrade card -->
            <div class="cs-upgrade-card ${passAtMax ? 'maxed' : ''}" 
                 ${!passAtMax ? `onclick="applyClassUpgrade('passive')"` : ''}>
                <div class="cs-upgrade-tag passive">⚡ ${LANG === 'de' ? 'PASSIV' : 'PASSIVE'} · ${LANG === 'de' ? 'STUFE' : 'LEVEL'} ${passLv} → ${Math.min(passLv + 1, maxLv)}</div>
                <div class="cs-upgrade-name">${LANG === 'de' ? def.passive.nameDE : def.passive.nameEn}</div>
                ${passAtMax
            ? `<div class="cs-upgrade-maxed">${LANG === 'de' ? '✓ MAX STUFE ERREICHT' : '✓ MAX LEVEL REACHED'}</div>`
            : `<div class="cs-upgrade-current">${LANG === 'de' ? 'Aktuell:' : 'Current:'} ${passLv > 0 ? (LANG === 'de' ? def.passive.levels[passLv - 1].descDE : def.passive.levels[passLv - 1].descEn) : ''}</div>
                       <div class="cs-upgrade-new">${LANG === 'de' ? 'Neu:' : 'New:'} ${passNext ? (LANG === 'de' ? passNext.descDE : passNext.descEn) : ''}</div>
                       <div class="cs-upgrade-cta">${LANG === 'de' ? '▶ PASSIV VERBESSERN' : '▶ UPGRADE PASSIVE'}</div>`
        }
            </div>

            <!-- Active upgrade card -->
            <div class="cs-upgrade-card ${actAtMax ? 'maxed' : ''}"
                 ${!actAtMax ? `onclick="applyClassUpgrade('active')"` : ''}>
                <div class="cs-upgrade-tag active">🎯 ${LANG === 'de' ? 'AKTIV' : 'ACTIVE'} · ${LANG === 'de' ? 'STUFE' : 'LEVEL'} ${actLv} → ${Math.min(actLv + 1, maxLv)}</div>
                <div class="cs-upgrade-name">${LANG === 'de' ? def.active.nameDE : def.active.nameEn}</div>
                ${actAtMax
            ? `<div class="cs-upgrade-maxed">${LANG === 'de' ? '✓ MAX STUFE ERREICHT' : '✓ MAX LEVEL REACHED'}</div>`
            : `<div class="cs-upgrade-current">${LANG === 'de' ? 'Aktuell:' : 'Current:'} ${actLv > 0 ? (LANG === 'de' ? def.active.levels[actLv - 1].descDE : def.active.levels[actLv - 1].descEn) : ''}</div>
                       <div class="cs-upgrade-new">${LANG === 'de' ? 'Neu:' : 'New:'} ${actNext ? (LANG === 'de' ? actNext.descDE : actNext.descEn) : ''}</div>
                       <div class="cs-upgrade-cta">${LANG === 'de' ? '▶ AKTIV VERBESSERN' : '▶ UPGRADE ACTIVE'}</div>`
        }
            </div>

        </div>
        ${bothMax ? `<div style="text-align:center;margin-top:18px;color:#27ae60;font-family:var(--PX);font-size:11px;">🏆 ${LANG === 'de' ? 'Beide Fähigkeiten sind auf MAX STUFE!' : 'Both abilities are at MAX LEVEL!'}</div>` : ''}
        ${bothMax ? `<div style="text-align:center;margin-top:12px;"><button class="cs-skip-btn" onclick="closeClassOverlay()">${LANG === 'de' ? 'SCHLIESSEN' : 'CLOSE'}</button></div>` : ''}
    `;

    overlay.classList.add('show');
}

function applyClassUpgrade(type) {
    if (type === 'passive') {
        STATE.classPassiveLevel = Math.min((STATE.classPassiveLevel || 1) + 1, 3);
    } else {
        STATE.classActiveLevel = Math.min((STATE.classActiveLevel || 1) + 1, 3);
    }
    STATE.classUpgradesAvailable = Math.max(0, (STATE.classUpgradesAvailable || 1) - 1);
    if (!STATE.classWorldsCompleted) STATE.classWorldsCompleted = [];
    STATE.classWorldsCompleted.push(STATE._lastClassWorld);
    save();

    closeClassOverlay();

    const def = CLASS_DEFS[STATE.playerClass];
    const typeName = type === 'passive'
        ? (LANG === 'de' ? def.passive.nameDE : def.passive.nameEn)
        : (LANG === 'de' ? def.active.nameDE : def.active.nameEn);
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
    const actLv = STATE.classActiveLevel || 1;
    const passData = def.passive.levels[passLv - 1];
    const actData = def.active.levels[actLv - 1];
    const name = LANG === 'de' ? def.nameDE : def.nameEn;
    const passName = LANG === 'de' ? def.passive.nameDE : def.passive.nameEn;
    const actName = LANG === 'de' ? def.active.nameDE : def.active.nameEn;

    const isOnCooldown = activeCooldownRemaining > 0;
    const isActive = activeAbilityMode;

    const cooldownDisplay = isOnCooldown
        ? `<div class="chud-cooldown" id="chud-cd-display">${formatCooldown(activeCooldownRemaining)}</div>`
        : '';

    panel.innerHTML = `
        <div class="chud-icon">${def.icon}</div>
        <div class="chud-name" style="color:${def.colorLight};">${name}</div>

        <div class="chud-section">
            <div class="chud-label passive">⚡ ${LANG === 'de' ? 'PASSIV' : 'PASSIVE'} <span class="chud-lv">Lv${passLv}</span></div>
            <div class="chud-skill-name">${passName}</div>
            <div class="chud-skill-desc">${LANG === 'de' ? passData.descDE : passData.descEn}</div>
        </div>

        <div class="chud-section">
            <div class="chud-label active-lbl">🎯 ${LANG === 'de' ? 'AKTIV' : 'ACTIVE'} <span class="chud-lv">Lv${actLv}</span></div>
            <div class="chud-skill-name">${actName}</div>
            <div class="chud-skill-desc">${LANG === 'de' ? actData.descDE : actData.descEn}</div>
            ${cooldownDisplay}
            <button class="chud-active-btn ${isActive ? 'armed' : ''} ${isOnCooldown ? 'on-cooldown' : ''}"
                    id="chud-active-btn"
                    onclick="toggleActiveAbility()"
                    ${isOnCooldown ? 'disabled' : ''}>
                ${isActive
            ? (LANG === 'de' ? '✕ ABBRECHEN' : '✕ CANCEL')
            : isOnCooldown
                ? (LANG === 'de' ? '⏳ ABKLINGZEIT' : '⏳ COOLDOWN')
                : (LANG === 'de' ? '▶ EINSETZEN' : '▶ ACTIVATE')
        }
            </button>
        </div>
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
//   When armed, clicking a grid cell triggers executeActiveAbility().
function toggleActiveAbility() {
    if (dead || activeCooldownRemaining > 0) return;

    activeAbilityMode = !activeAbilityMode;

    // Change cursor on the puzzle wrapper
    const wrap = document.getElementById('puzzle-scaler-wrap');
    if (wrap) {
        wrap.style.cursor = activeAbilityMode ? 'crosshair' : '';
    }

    // Show hint toast
    if (activeAbilityMode) {
        const def = CLASS_DEFS[STATE.playerClass];
        const msg = LANG === 'de' ? def.active.descCursorDE : def.active.descCursorEn;
        showToast(`🎯 ${msg}`);
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
    const actLv = STATE.classActiveLevel || 1;
    const actData = def.active.levels[actLv - 1];
    const effect = actData.effect;

    switch (STATE.playerClass) {

        case 'mathmagician':
            _executeArcaneReveal(row, col, effect.radius);
            break;

        case 'statistician':
            _executeDataStrike(effect.solveCount);
            break;

        case 'probabilist':
            _executePrecisionMark(row, col, effect.extraLines);
            break;
    }

    // Start cooldown
    const cd = def.active.cooldownSeconds;
    startActiveCooldown(cd);
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


// ═══════════════════════════════════════════════
//  COOLDOWN SYSTEM
// ═══════════════════════════════════════════════

function startActiveCooldown(seconds) {
    if (cooldownInterval) clearInterval(cooldownInterval);
    activeCooldownRemaining = seconds;
    updateCooldownDisplay();

    cooldownInterval = setInterval(() => {
        activeCooldownRemaining--;
        updateCooldownDisplay();
        if (activeCooldownRemaining <= 0) {
            activeCooldownRemaining = 0;
            clearInterval(cooldownInterval);
            cooldownInterval = null;
            buildClassHUD(); // re-render to re-enable button
        }
    }, 1000);
}

function updateCooldownDisplay() {
    const el = document.getElementById('chud-cd-display');
    if (el) el.textContent = formatCooldown(activeCooldownRemaining);

    const btn = document.getElementById('chud-active-btn');
    if (btn) {
        if (activeCooldownRemaining > 0) {
            btn.textContent = `⏳ ${formatCooldown(activeCooldownRemaining)}`;
            btn.disabled = true;
            btn.classList.add('on-cooldown');
        } else {
            buildClassHUD();
        }
    }
}

function resetActiveCooldown() {
    if (cooldownInterval) clearInterval(cooldownInterval);
    cooldownInterval = null;
    activeCooldownRemaining = 0;
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