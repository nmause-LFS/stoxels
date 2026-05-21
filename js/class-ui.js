


let _afterClassEventCallback = null; // Used to trigger a callback (e.g. close the world completion modal) after the class event flow finishes




//------------------------------------------------------------------------
//------------------------WORLD COMPLETION CHECK--------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function checkWorldCompletion() {
    if (!cur) return;
    const wi = cur.world - 1;
    const world = WORLDS[wi];
    if (!world || !world.data.length) return;

    if (!areAllWorldLevelsDone(wi, world)) return;

    if (!STATE.classWorldsCompleted) STATE.classWorldsCompleted = [];
    if (STATE.classWorldsCompleted.includes(wi)) return;

    STATE._pendingClassEvent = true;
    STATE._lastClassWorld = wi;
    save();
}

function areAllWorldLevelsDone(wi, world) {
    const worldStart = WORLD_START_GI[wi];
    const worldEnd = worldStart + world.data.length - 1;
    for (let gi = worldStart; gi <= worldEnd; gi++) {
        if (!STATE.done.includes(gi)) return false;
    }
    return true;
}



//------------------------------------------------------------------------
//------------------CLASS EVENT TRIGGER-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



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



//------------------------------------------------------------------------
//-------------------------CLASS SELECTION SCREEN-------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function showClassSelection() {
    const overlay = document.getElementById('class-selection-overlay');
    const content = document.getElementById('class-selection-content');

    content.innerHTML = `
        <div class="cs-header">
            <div class="cs-title">⚗️ ${t('CHOOSE YOUR CLASS', 'KLASSE WÄHLEN')}</div>
            <div class="cs-subtitle">${t(
        'You completed a world! Choose your class — this decision is permanent.',
        'Du hast eine Welt abgeschlossen! Wähle deine Klasse — diese Entscheidung ist permanent.'
    )}</div>
        </div>
        <div class="cs-cards">
            ${CLASS_LIST.map(cid => buildClassCard(cid, 'select')).join('')}
        </div>`;

    overlay.classList.add('show');
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
    showToast(`${def.icon} ${t(def.nameEn, def.nameDE)} ${t('selected!', 'gewählt!')}`);
    closeClassOverlay();
    buildClassHUD();
    updateQuestStats('classChosen', {})
}


// buildClassCard helpers 

function buildAbilityBlock(tagLabel, tagClass, abilityName, abilityDesc) {
    return `
        <div class="cs-ability ${tagClass}">
            <span class="cs-ability-tag ${tagClass}">${tagLabel}</span>
            <span class="cs-ability-name">${abilityName}</span>
            <span class="cs-ability-desc">${abilityDesc}</span>
        </div>`;
}

function buildClassCard(cid, mode) {
    const def = CLASS_DEFS[cid];

    const passiveBlock = buildAbilityBlock(
        `⚡ ${t('PASSIVE', 'PASSIV')}`, 'passive',
        t(def.passive.nameEn, def.passive.nameDE),
        t(def.passive.levels[0].descEn, def.passive.levels[0].descDE)
    );
    const active1Block = buildAbilityBlock(
        `🎯 ${t('ACTIVE 1', 'AKTIV 1')}`, 'active',
        t(def.active1.nameEn, def.active1.nameDE),
        t(def.active1.levels[0].descEn, def.active1.levels[0].descDE)
    );
    const active2Block = buildAbilityBlock(
        `🎯 ${t('ACTIVE 2', 'AKTIV 2')}`, 'active',
        t(def.active2.nameEn, def.active2.nameDE),
        t(def.active2.levels[0].descEn, def.active2.levels[0].descDE)
    );

    const onclick = mode === 'select' ? `onclick="confirmClassSelection('${cid}')"` : '';
    const cta = mode === 'select'
        ? `<div class="cs-card-cta">${t('▶ SELECT', '▶ WÄHLEN')}</div>`
        : '';

    return `
        <div class="cs-card"
             style="border-color:${def.color};--cls-color:${def.color};--cls-light:${def.colorLight};"
             ${onclick} data-classid="${cid}">
            <div class="cs-card-icon">${def.icon}</div>
            <div class="cs-card-name" style="color:${def.colorLight};">${t(def.nameEn, def.nameDE)}</div>
            <div class="cs-card-desc">${t(def.descEn, def.descDE)}</div>
            <div class="cs-card-abilities">
                ${passiveBlock}
                ${active1Block}
                ${active2Block}
            </div>
            ${cta}
        </div>`;
}







//------------------------------------------------------------------------
//-------------------------CLASS UPGRADE SCREEN---------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

function showClassUpgrade() {
    if (!STATE.playerClass) return;

    if (STATE.classUpgradesAvailable === undefined) STATE.classUpgradesAvailable = 0;
    STATE.classUpgradesAvailable++;
    save();

    const overlay = document.getElementById('class-selection-overlay');
    const content = document.getElementById('class-selection-content');
    const def = CLASS_DEFS[STATE.playerClass];
    const maxLv = 3;

    const levels = {
        passive: STATE.classPassiveLevel || 1,
        active1: STATE.classActive1Level || 1,
        active2: STATE.classActive2Level || 1,
    };
    const allMax = Object.values(levels).every(lv => lv >= maxLv);

    content.innerHTML = `
        <div class="cs-header">
            <div class="cs-title">${def.icon} ${t('CLASS UPGRADE', 'KLASSEN-UPGRADE')}</div>
            <div class="cs-subtitle">${t(
        `You completed another world! Choose an upgrade for your ${t(def.nameEn, def.nameDE)}.`,
        `Du hast eine weitere Welt abgeschlossen! Wähle eine Verbesserung für deinen ${t(def.nameEn, def.nameDE)}.`
    )}</div>
        </div>
        <div class="cs-upgrade-grid">
            ${buildUpgradeCard(def, 'passive', levels.passive, maxLv)}
            ${buildUpgradeCard(def, 'active1', levels.active1, maxLv)}
            ${buildUpgradeCard(def, 'active2', levels.active2, maxLv)}
        </div>
        ${buildUpgradeFooter(allMax)}`;

    overlay.classList.add('show');
}

// showClassUpgrade helpers

function getAbilityDef(def, type) {
    if (type === 'passive') return def.passive;
    if (type === 'active1') return def.active1;
    return def.active2;
}

function getUpgradeTagLabel(type) {
    if (type === 'passive') return `⚡ ${t('PASSIVE', 'PASSIV')}`;
    if (type === 'active1') return `🎯 ${t('ACTIVE 1', 'AKTIV 1')}`;
    return `🎯 ${t('ACTIVE 2', 'AKTIV 2')}`;
}

function getUpgradeCTALabel(type) {
    if (type === 'passive') return t('▶ UPGRADE PASSIVE', '▶ PASSIV VERBESSERN');
    if (type === 'active1') return t('▶ UPGRADE ACTIVE 1', '▶ AKTIV 1 VERBESSERN');
    return t('▶ UPGRADE ACTIVE 2', '▶ AKTIV 2 VERBESSERN');
}

function buildUpgradeCardBody(abilityDef, currentLv, maxLv) {
    const atMax = currentLv >= maxLv;
    if (atMax) {
        return `<div class="cs-upgrade-maxed">${t('✓ MAX LEVEL', '✓ MAX STUFE')}</div>`;
    }

    const currentDesc = t(abilityDef.levels[currentLv - 1].descEn, abilityDef.levels[currentLv - 1].descDE);
    const nextDesc = t(abilityDef.levels[currentLv].descEn, abilityDef.levels[currentLv].descDE);

    return `
        <div class="cs-upgrade-current">${t('Current:', 'Aktuell:')} ${currentDesc}</div>
        <div class="cs-upgrade-new">${t('New:', 'Neu:')} ${nextDesc}</div>
        <div class="cs-upgrade-cta">${getUpgradeCTALabel(/* type passed separately */'')}</div>`;
    // Note: CTA label needs type — see buildUpgradeCard which passes it in.
}

function buildUpgradeCard(def, type, currentLv, maxLv) {
    const atMax = currentLv >= maxLv;
    const abilityDef = getAbilityDef(def, type);
    const tagLabel = getUpgradeTagLabel(type);
    const nextLv = Math.min(currentLv + 1, maxLv);
    const abilityName = t(abilityDef.nameEn, abilityDef.nameDE);

    const body = atMax
        ? `<div class="cs-upgrade-maxed">${t('✓ MAX LEVEL', '✓ MAX STUFE')}</div>`
        : buildUpgradeCardBodyFull(abilityDef, type, currentLv);

    return `
        <div class="cs-upgrade-card ${atMax ? 'maxed' : ''}"
             ${!atMax ? `onclick="applyClassUpgrade('${type}')"` : ''}>
            <div class="cs-upgrade-tag ${type === 'passive' ? 'passive' : 'active'}">
                ${tagLabel} · ${t('LEVEL', 'STUFE')} ${currentLv} → ${nextLv}
            </div>
            <div class="cs-upgrade-name">${abilityName}</div>
            ${body}
        </div>`;
}

function buildUpgradeCardBodyFull(abilityDef, type, currentLv) {
    const currentDesc = t(abilityDef.levels[currentLv - 1].descEn, abilityDef.levels[currentLv - 1].descDE);
    const nextDesc = t(abilityDef.levels[currentLv].descEn, abilityDef.levels[currentLv].descDE);
    return `
        <div class="cs-upgrade-current">${t('Current:', 'Aktuell:')} ${currentDesc}</div>
        <div class="cs-upgrade-new">${t('New:', 'Neu:')} ${nextDesc}</div>
        <div class="cs-upgrade-cta">${getUpgradeCTALabel(type)}</div>`;
}

function buildUpgradeFooter(allMax) {
    if (!allMax) return '';
    return `
        <div style="text-align:center;margin-top:18px;color:#27ae60;font-family:var(--PX);font-size:11px;">
            🏆 ${t('All abilities are at MAX LEVEL!', 'Alle Fähigkeiten sind auf MAX STUFE!')}
        </div>
        <div style="text-align:center;margin-top:12px;">
            <button class="cs-skip-btn" onclick="closeClassOverlay()">
                ${t('CLOSE', 'SCHLIESSEN')}
            </button>
        </div>`;
}






//------------------------------------------------------------------------
//----------------------APPLY CLASS SKILL UPGRADE-------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function applyClassUpgrade(type) {
    incrementUpgradeLevel(type);
    decrementUpgradesAvailable();
    markLastWorldCompleted();
    save();

    trackAchStat('classUpgradesApplied');
    closeClassOverlay();
    showUpgradeToast(type);
    buildClassHUD();
}

function incrementUpgradeLevel(type) {
    if (type === 'passive') {
        STATE.classPassiveLevel = Math.min((STATE.classPassiveLevel || 1) + 1, 3);
    } else if (type === 'active1') {
        STATE.classActive1Level = Math.min((STATE.classActive1Level || 1) + 1, 3);
    } else if (type === 'active2') {
        STATE.classActive2Level = Math.min((STATE.classActive2Level || 1) + 1, 3);
    }
}

function decrementUpgradesAvailable() {
    STATE.classUpgradesAvailable = Math.max(0, (STATE.classUpgradesAvailable || 1) - 1);
}

function markLastWorldCompleted() {
    if (!STATE.classWorldsCompleted) STATE.classWorldsCompleted = [];
    STATE.classWorldsCompleted.push(STATE._lastClassWorld);
}

function getUpgradedLevel(type) {
    if (type === 'passive') return STATE.classPassiveLevel;
    if (type === 'active1') return STATE.classActive1Level;
    return STATE.classActive2Level;
}

function getUpgradedAbilityName(def, type) {
    if (type === 'passive') return t(def.passive.nameEn, def.passive.nameDE);
    if (type === 'active1') return t(def.active1.nameEn, def.active1.nameDE);
    return t(def.active2.nameEn, def.active2.nameDE);
}

function showUpgradeToast(type) {
    const def = CLASS_DEFS[STATE.playerClass];
    const abilityName = getUpgradedAbilityName(def, type);
    const newLv = getUpgradedLevel(type);
    showToast(`${def.icon} ${abilityName} → ${t('Level', 'Stufe')} ${newLv}!`);
}









//------------------------------------------------------------------------
//--------------------CLOSE CLASS OVERLAY---------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



function closeClassOverlay() {
    document.getElementById('class-selection-overlay').classList.remove('show');
    if (_afterClassEventCallback) {
        const cb = _afterClassEventCallback;
        _afterClassEventCallback = null;
        setTimeout(cb, 120);
    }
}




//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------






//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------







