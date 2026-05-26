let hudMinimized = false; // kept for legacy compat, not used in compact mode

const HUD_COLOR_PASSIVE = '#f39c12';
const HUD_COLOR_ACTIVE = '#3498db';


//------------------------------------------------------------------------
//-------------------------HELPER FUNCTIONS-------------------------------
//------------------------------------------------------------------------

function getLocalName(obj) {
    return LANG === 'de' ? obj.nameDE : obj.nameEn;
}

function getLocalDesc(data) {
    return LANG === 'de' ? data.descDE : data.descEn;
}

function getActiveSkillLevel(key) {
    return key === 'active1'
        ? (STATE.classActive1Level || 1)
        : (STATE.classActive2Level || 1);
}


//------------------------------------------------------------------------
//---------------------------TOOLTIP ENGINE-------------------------------
//------------------------------------------------------------------------

// Builds the rich tooltip HTML for a skill button
function buildSkillTooltip(def, key) {
    if (key === 'passive') {
        const passLv = STATE.classPassiveLevel || 1;
        const passData = def.passive.levels[passLv - 1];
        const rankWord = LANG === 'de' ? 'Rang' : 'Rank';
        return `<strong style="color:${HUD_COLOR_PASSIVE}">${getLocalName(def.passive)}</strong>`
            + ` <span style="opacity:.6;font-size:.85em">— ${rankWord} ${passLv}</span>`
            + `<br>${getLocalDesc(passData)}`;
    }

    const skill = def[key];
    const skillLv = getActiveSkillLevel(key);
    const skillData = skill.levels[skillLv - 1];
    const rankWord = LANG === 'de' ? 'Rang' : 'Rank';
    const cdSec = Math.ceil((def[key].cooldownSeconds || 0));
    const cdMin = Math.floor(cdSec / 60);
    const cdStr = cdMin > 0 ? `${cdMin}m` : `${cdSec}s`;

    return `<strong style="color:${HUD_COLOR_ACTIVE}">${getLocalName(skill)}</strong>`
        + ` <span style="opacity:.6;font-size:.85em">— ${rankWord} ${skillLv}</span>`
        + `<br>${getLocalDesc(skillData)}`
        + `<br><span style="opacity:.55;font-size:.85em">⏱ CD: ${cdStr}</span>`;
}

// Singleton tooltip element — created once, reused
function getHUDTooltip() {
    let tip = document.getElementById('chud-floating-tip');
    if (!tip) {
        tip = document.createElement('div');
        tip.id = 'chud-floating-tip';
        tip.style.cssText = `
            position: fixed;
            z-index: 9999;
            background: #12121e;
            border: 1px solid var(--accent, #5555aa);
            border-left: 3px solid var(--accent2, #aaaaff);
            color: var(--accent2, #ccc);
            font-family: var(--PX, monospace);
            font-size: 10px;
            line-height: 1.6;
            padding: 8px 12px;
            max-width: 260px;
            pointer-events: none;
            opacity: 0;
            transition: opacity .12s;
            white-space: normal;
        `;
        document.body.appendChild(tip);
    }
    return tip;
}

function showHUDTooltip(html, e) {
    const tip = getHUDTooltip();
    tip.innerHTML = html;
    tip.style.opacity = '1';
    moveHUDTooltip(e);
}

function moveHUDTooltip(e) {
    const tip = getHUDTooltip();
    const tw = tip.offsetWidth || 220;
    const th = tip.offsetHeight || 60;
    let x = e.clientX + 14;
    let y = e.clientY + 14;
    if (x + tw > window.innerWidth - 8) x = e.clientX - tw - 10;
    if (y + th > window.innerHeight - 8) y = e.clientY - th - 10;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
}

function hideHUDTooltip() {
    const tip = document.getElementById('chud-floating-tip');
    if (tip) tip.style.opacity = '0';
}


//------------------------------------------------------------------------
//------------------------------RENDERERS---------------------------------
//------------------------------------------------------------------------

// The compact drag handle — just the grip dots + class icon + skill buttons
function renderCompactHUD(def) {
    const passLv = STATE.classPassiveLevel || 1;
    const passData = def.passive.levels[passLv - 1];

    const isMage = STATE.playerClass === 'mathmagician';
    const stacks = isMage ? (window._classFreeMistakes || 0) : 0;
    const shieldAttr = isMage ? `data-shield-stacks="${stacks}"` : '';
    const shieldPips = isMage && stacks > 0 ? _renderShieldPips(stacks) : '';

    return `
        <div id="class-hud-drag-handle" ${shieldAttr}>
            <span class="chud-grip">⠿</span>
            <span class="chud-icon-sm"
                  data-tipkey="passive"
                  onmouseenter="handleHUDTip(event,'passive')"
                  onmousemove="handleHUDTipMove(event)"
                  onmouseleave="hideHUDTooltip()">
                ${def.icon}
            </span>
            ${renderCompactActiveBtn(def, 'active1')}
            ${renderCompactActiveBtn(def, 'active2')}
            ${STATE.playerAscendency ? renderAscendencyButtons() : ''}
            ${shieldPips}
        </div>`;
}

// Renders shield stack pip indicators for Variance Shield
function _renderShieldPips(stacks) {
    const maxShow = Math.min(stacks, 5); // cap visual at 5
    let pips = '';
    for (let i = 0; i < maxShow; i++) {
        pips += `<span class="chud-shield-pip"></span>`;
    }
    return `<span class="chud-shield-pips" title="Variance Shield: ${stacks} stack(s)">${pips}</span>`;
}

// One compact ability button — icon/label + live cooldown ticker
function renderCompactActiveBtn(def, key) {
    const skill = def[key];
    const skillLv = getActiveSkillLevel(key);
    const cdRemaining = cooldownState[key].remaining;
    const isOnCD = cdRemaining > 0;
    const isArmed = activeAbilityMode && STATE.classActiveChoice === key;
    const idx = key === 'active1' ? '1' : '2';

    const btnColor = isArmed ? '#e74c3c' : isOnCD ? '#555' : HUD_COLOR_ACTIVE;
    const cursor = isOnCD ? 'not-allowed' : 'pointer';
    const clickAttr = isOnCD ? '' : `onclick="toggleActiveAbility('${key}')"`;
    const armedRing = isArmed ? `outline: 2px solid #e74c3c; outline-offset: 2px;` : '';

    const label = isOnCD
        ? `<span class="chud-btn-cd">${formatCooldown(cdRemaining)}</span>`
        : isArmed
            ? `<span class="chud-btn-ready armed">✕</span>`
            : `<span class="chud-btn-ready">▶</span>`;

    return `
        <button class="chud-skill-btn ${isArmed ? 'armed' : ''} ${isOnCD ? 'on-cd' : ''}"
                data-slot="${key}"
                style="border-color:${btnColor}; cursor:${cursor}; ${armedRing}"
                ${clickAttr}
                data-tipkey="${key}"
                onmouseenter="handleHUDTip(event,'${key}')"
                onmousemove="handleHUDTipMove(event)"
                onmouseleave="hideHUDTooltip()">
            <span class="chud-btn-idx" style="color:${btnColor}">${idx}</span>
            ${label}
        </button>`;
}


// Global handlers called from inline HTML (needed because buildClassHUD rebuilds innerHTML)
function handleHUDTip(e, key) {
    const def = CLASS_DEFS[STATE.playerClass];
    if (!def) return;
    // Route ascendency slots to their own tooltip builder
    if (key === 'active3' || key === 'active4') {
        showHUDTooltip(buildAscendencySkillTooltip(key), e);
        return;
    }
    showHUDTooltip(buildSkillTooltip(def, key), e);
}
function handleHUDTipMove(e) {
    moveHUDTooltip(e);
}


//------------------------------------------------------------------------
//-------------------ASCENDENCY HUD BUTTONS-------------------------------
//------------------------------------------------------------------------

// renderAscendencyButtons — renders a separator + 2 ascendency skill buttons.
function renderAscendencyButtons() {
    if (!STATE.playerAscendency) return '';
    const asc = ASCENDENCY_DEFS[STATE.playerAscendency];
    if (!asc) return '';

    return `
        <span class="chud-asc-sep" title="${t(asc.nameEn, asc.nameDE)}">${asc.icon}</span>
        ${renderCompactAscBtn(asc, 'active3', 'active1')}
        ${renderCompactAscBtn(asc, 'active4', 'active2')}`;
}

// renderCompactAscBtn — renders one ascendency skill button.
//   hudSlot: 'active3' or 'active4' (cooldown state key)
//   ascSlot: 'active1' or 'active2' (key in ASCENDENCY_DEFS)
function renderCompactAscBtn(asc, hudSlot, ascSlot) {
    const cdRemaining = cooldownState[hudSlot].remaining;
    const isOnCD = cdRemaining > 0;
    const isArmed = activeAbilityMode && STATE.classActiveChoice === hudSlot;
    const idx = hudSlot === 'active3' ? '3' : '4';

    const btnColor = isArmed ? '#e74c3c' : isOnCD ? '#555' : '#f1c40f';
    const cursor = isOnCD ? 'not-allowed' : 'pointer';
    const clickAttr = isOnCD ? '' : `onclick="toggleActiveAbility('${hudSlot}')"`;
    const armedRing = isArmed ? `outline: 2px solid #e74c3c; outline-offset: 2px;` : '';

    const label = isOnCD
        ? `<span class="chud-btn-cd">${formatCooldown(cdRemaining)}</span>`
        : isArmed
            ? `<span class="chud-btn-ready armed">✕</span>`
            : `<span class="chud-btn-ready">▶</span>`;

    return `
        <button class="chud-skill-btn chud-asc-btn ${isArmed ? 'armed' : ''} ${isOnCD ? 'on-cd' : ''}"
                data-slot="${hudSlot}"
                style="border-color:${btnColor}; cursor:${cursor}; ${armedRing}"
                ${clickAttr}
                data-tipkey="${hudSlot}"
                onmouseenter="handleHUDTip(event,'${hudSlot}')"
                onmousemove="handleHUDTipMove(event)"
                onmouseleave="hideHUDTooltip()">
            <span class="chud-btn-idx" style="color:${btnColor}">${idx}</span>
            ${label}
        </button>`;
}

// buildAscendencySkillTooltip — builds tooltip HTML for active3/active4 slots.
function buildAscendencySkillTooltip(hudSlot) {
    if (!STATE.playerAscendency) return '';
    const asc = ASCENDENCY_DEFS[STATE.playerAscendency];
    if (!asc) return '';

    const ascSlot = hudSlot === 'active3' ? 'active1' : 'active2';
    const skill = asc[ascSlot];
    const skillLv = ascSlot === 'active1'
        ? (STATE.ascendencySkill1Level || 1)
        : (STATE.ascendencySkill2Level || 1);
    const skillData = skill.levels[skillLv - 1];
    const rankWord = LANG === 'de' ? 'Rang' : 'Rank';
    const cdSec = Math.ceil(skill.cooldownSeconds || 0);
    const cdMin = Math.floor(cdSec / 60);
    const cdStr = cdMin > 0 ? `${cdMin}m` : `${cdSec}s`;

    return `<strong style="color:#f1c40f">${t(skill.nameEn, skill.nameDE)}</strong>`
        + ` <span style="opacity:.6;font-size:.85em">— ${rankWord} ${skillLv}</span>`
        + `<br>${t(skillData.descEn, skillData.descDE)}`
        + `<br><span style="opacity:.55;font-size:.85em">⏱ CD: ${cdStr}</span>`;
}


//------------------------------------------------------------------------
//-------------------MINIMIZED COOLDOWN BAR (legacy compat)---------------
//------------------------------------------------------------------------

// Kept so any external callers don't break; returns empty since compact
// HUD always shows cooldowns inline.
function renderMinimizedCooldownBar() { return ''; }


//------------------------------------------------------------------------
//-----------------------BUILD CLASS HUD----------------------------------
//------------------------------------------------------------------------

function buildClassHUD() {
    const panel = document.getElementById('class-hud-panel');
    if (!panel) return;

    if (!STATE.playerClass || isClassless()) {
        panel.innerHTML = '';
        panel.style.display = 'none';
        return;
    }

    const def = CLASS_DEFS[STATE.playerClass];
    if (!def) return;

    if (!STATE.classActiveChoice || typeof STATE.classActiveChoice === 'number') {
        STATE.classActiveChoice = 'active1';
    }

    panel.style.display = 'flex';
    panel.innerHTML = renderCompactHUD(def);

    // Update shield stack attribute on panel for CSS layering
    if (STATE.playerClass === 'mathmagician') {
        const stacks = window._classFreeMistakes || 0;
        panel.setAttribute('data-shield-stacks', stacks);
    } else {
        panel.removeAttribute('data-shield-stacks');
    }

    // Inject compact HUD CSS once
    injectCompactHUDStyles(def);
    makeClassHUDDraggable();

    // If the drifter is actively ticking down, make sure his badge stays docked
    if (window._drifterHudInterval && typeof remainingSeconds !== 'undefined' && remainingSeconds > 0) {
        _drifterSpawnIndicator(remainingSeconds);
    }
}

// Injects all CSS for the compact HUD into a <style> tag (once per page load)
function injectCompactHUDStyles(def) {
    if (document.getElementById('chud-compact-styles')) return;
    const s = document.createElement('style');
    s.id = 'chud-compact-styles';
    s.textContent = `
        #class-hud-panel {
            position: fixed;
            top: 60px;
            left: 12px;
            z-index: 600;
            display: flex;
            flex-direction: column;
            user-select: none;
        }

         #class-hud-drag-handle {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: rgba(10,10,20,0.88);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 8px;
            padding: 4px 5px;
            cursor: grab;
            backdrop-filter: blur(4px);
            box-shadow: 0 2px 12px rgba(0,0,0,0.5);
            white-space: nowrap;
        }

        #class-hud-drag-handle:active { cursor: grabbing; }

        .chud-grip {
            font-size: 13px;
            opacity: .35;
            pointer-events: none;
            line-height: 1;
        }

        .chud-icon-sm {
            font-size: 16px;
            line-height: 1;
            cursor: help;
        }

        .chud-skill-btn {
            display: flex;
            align-items: center;
            gap: 4px;
            background: rgba(0,0,0,0.4);
            border: 1px solid #3498db;
            border-radius: 5px;
            padding: 3px 7px;
            font-family: var(--PX, monospace);
            font-size: 10px;
            color: #ccc;
            transition: background .12s, border-color .12s;
            min-width: 44px;
            justify-content: center;
        }

        .chud-skill-btn:hover:not(.on-cd) {
            background: rgba(52,152,219,0.18);
        }

        .chud-skill-btn.armed {
            background: rgba(231,76,60,0.15) !important;
        }

        .chud-skill-btn.on-cd {
            opacity: .65;
        }

        .chud-btn-idx {
            font-weight: bold;
            font-size: 9px;
            opacity: .8;
        }

        .chud-btn-ready {
            font-size: 9px;
            opacity: .9;
        }

        .chud-btn-ready.armed {
            color: #e74c3c;
            font-weight: bold;
        }

        .chud-btn-cd {
            font-size: 9px;
            color: #e67e22;
            font-variant-numeric: tabular-nums;
            letter-spacing: .03em;
        }
    `;
    document.head.appendChild(s);
}


//------------------------------------------------------------------------
//---------------------------DRAG LOGIC-----------------------------------
//------------------------------------------------------------------------

function makeClassHUDDraggable() {
    const panel = document.getElementById('class-hud-panel');
    const handle = document.getElementById('class-hud-drag-handle');
    if (!panel || !handle) return;

    let dragging = false;
    let startX, startY, origLeft, origTop;

    handle.addEventListener('pointerdown', (e) => {
        // Don't start drag on button clicks
        if (e.target.closest('.chud-skill-btn')) return;
        e.preventDefault();
        dragging = true;
        handle.setPointerCapture(e.pointerId);
        const rect = panel.getBoundingClientRect();
        origLeft = rect.left;
        origTop = rect.top;
        startX = e.clientX;
        startY = e.clientY;
    });

    handle.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const { left, top } = clampToViewport(
            origLeft + (e.clientX - startX),
            origTop + (e.clientY - startY),
            panel.offsetWidth,
            panel.offsetHeight
        );
        panel.style.left = left + 'px';
        panel.style.top = top + 'px';
    });

    handle.addEventListener('pointerup', () => { dragging = false; });
    handle.addEventListener('pointercancel', () => { dragging = false; });
}

function clampToViewport(left, top, panelW, panelH) {
    return {
        left: Math.max(0, Math.min(left, window.innerWidth - panelW)),
        top: Math.max(0, Math.min(top, window.innerHeight - panelH))
    };
}


//------------------------------------------------------------------------
//----------------------------MINIMIZE TOGGLE (stub)----------------------
//------------------------------------------------------------------------

// The compact HUD has no minimize — this stub keeps any external callers happy.
function toggleClassHUDMinimize(e) {
    if (e) e.stopPropagation();
}


//------------------------------------------------------------------------
//-------------------LEVEL SELECT CLASS TOOLTIP---------------------------
//------------------------------------------------------------------------
function buildLsClassTooltipHTML() {
    if (!STATE.playerClass || !CLASS_DEFS[STATE.playerClass]) return '';
    const def = CLASS_DEFS[STATE.playerClass];
    const rankWord = LANG === 'de' ? 'Rang' : 'Rank';

    const passLv = STATE.classPassiveLevel || 1;
    const act1Lv = STATE.classActive1Level || 1;
    const act2Lv = STATE.classActive2Level || 1;

    const passData = def.passive.levels[passLv - 1];
    const act1Data = def.active1.levels[act1Lv - 1];
    const act2Data = def.active2.levels[act2Lv - 1];

    const passName = LANG === 'de' ? def.passive.nameDE : def.passive.nameEn;
    const act1Name = LANG === 'de' ? def.active1.nameDE : def.active1.nameEn;
    const act2Name = LANG === 'de' ? def.active2.nameDE : def.active2.nameEn;
    const passDesc = LANG === 'de' ? passData.descDE : passData.descEn;
    const act1Desc = LANG === 'de' ? act1Data.descDE : act1Data.descEn;
    const act2Desc = LANG === 'de' ? act2Data.descDE : act2Data.descEn;
    const className = LANG === 'de' ? def.nameDE : def.nameEn;

    const cdFmt = (secs) => {
        const m = Math.floor(secs / 60);
        return m > 0 ? `${m}m` : `${secs}s`;
    };
    const maxMark = (lv) => lv >= 3
        ? ` <span style="color:#27ae60;font-size:.85em">✓ MAX</span>`
        : '';

    // Build the ascendency section if the player has chosen one
    let ascSection = '';
    if (STATE.playerAscendency && ASCENDENCY_DEFS[STATE.playerAscendency]) {
        const asc = ASCENDENCY_DEFS[STATE.playerAscendency];
        const ascName = LANG === 'de' ? asc.nameDE : asc.nameEn;
        const sk1Lv = STATE.ascendencySkill1Level || 1;
        const sk2Lv = STATE.ascendencySkill2Level || 1;
        const sk1Data = asc.active1.levels[sk1Lv - 1];
        const sk2Data = asc.active2.levels[sk2Lv - 1];
        const sk1Name = LANG === 'de' ? asc.active1.nameDE : asc.active1.nameEn;
        const sk2Name = LANG === 'de' ? asc.active2.nameDE : asc.active2.nameEn;
        const sk1Desc = LANG === 'de' ? sk1Data.descDE : sk1Data.descEn;
        const sk2Desc = LANG === 'de' ? sk2Data.descDE : sk2Data.descEn;

        ascSection = `
        <div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(241,196,15,0.25);">
            <div style="margin-bottom:6px;">
                <span style="font-size:1.1em">${asc.icon}</span>
                <strong style="color:${asc.colorLight};letter-spacing:1px;margin-left:4px;">${ascName}</strong>
                <span style="opacity:.5;font-size:.8em;margin-left:4px;">${asc.archetype}</span>
            </div>
            <div style="margin-bottom:6px;">
                <div style="color:#f1c40f;margin-bottom:2px;">
                    🎯 ${sk1Name}
                    <span style="opacity:.6;font-size:.85em">— ${rankWord} ${sk1Lv}/3${maxMark(sk1Lv)}</span>
                    <span style="opacity:.4;font-size:.8em"> ⏱ ${cdFmt(asc.active1.cooldownSeconds)}</span>
                </div>
                <div style="color:#ccc;">${sk1Desc}</div>
            </div>
            <div>
                <div style="color:#f1c40f;margin-bottom:2px;">
                    🎯 ${sk2Name}
                    <span style="opacity:.6;font-size:.85em">— ${rankWord} ${sk2Lv}/3${maxMark(sk2Lv)}</span>
                    <span style="opacity:.4;font-size:.8em"> ⏱ ${cdFmt(asc.active2.cooldownSeconds)}</span>
                </div>
                <div style="color:#ccc;">${sk2Desc}</div>
            </div>
        </div>`;
    }

    return `
        <div style="margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.1);">
            <span style="font-size:1.3em">${def.icon}</span>
            <strong style="color:${def.colorLight};font-size:1.1em;letter-spacing:1px;margin-left:4px;">${className}</strong>
        </div>
        <div style="margin-bottom:7px;">
            <div style="color:${HUD_COLOR_PASSIVE};margin-bottom:2px;">
                ⚡ ${passName}
                <span style="opacity:.6;font-size:.85em">— ${rankWord} ${passLv}/3${maxMark(passLv)}</span>
            </div>
            <div style="color:#ccc;">${passDesc}</div>
        </div>
        <div style="margin-bottom:7px;">
            <div style="color:${HUD_COLOR_ACTIVE};margin-bottom:2px;">
                🎯 ${act1Name}
                <span style="opacity:.6;font-size:.85em">— ${rankWord} ${act1Lv}/3${maxMark(act1Lv)}</span>
                <span style="opacity:.4;font-size:.8em"> ⏱ ${cdFmt(def.active1.cooldownSeconds)}</span>
            </div>
            <div style="color:#ccc;">${act1Desc}</div>
        </div>
        <div>
            <div style="color:${HUD_COLOR_ACTIVE};margin-bottom:2px;">
                🎯 ${act2Name}
                <span style="opacity:.6;font-size:.85em">— ${rankWord} ${act2Lv}/3${maxMark(act2Lv)}</span>
                <span style="opacity:.4;font-size:.8em"> ⏱ ${cdFmt(def.active2.cooldownSeconds)}</span>
            </div>
            <div style="color:#ccc;">${act2Desc}</div>
        </div>
        ${ascSection}`;
}
function _getLsClassTooltipEl() {
    let tip = document.getElementById('ls-class-tooltip');
    if (!tip) {
        tip = document.createElement('div');
        tip.id = 'ls-class-tooltip';
        tip.style.cssText = `
            position: fixed;
            z-index: 9999;
            background: #12121e;
            border: 1px solid var(--accent, #5555aa);
            border-left: 3px solid var(--purple, #9b59b6);
            color: var(--accent2, #ccc);
            font-family: var(--PX, monospace);
            font-size: 11px;
            line-height: 1.6;
            padding: 12px 14px;
            max-width: 400px;
            min-width: 220px;
            pointer-events: none;
            opacity: 0;
            transition: opacity .12s;
            white-space: normal;
            box-shadow: 0 4px 20px rgba(0,0,0,0.6);
        `;
        document.body.appendChild(tip);
    }
    return tip;
}

function showLsClassTooltip(e) {
    const tip = _getLsClassTooltipEl();
    tip.innerHTML = buildLsClassTooltipHTML();
    tip.style.opacity = '1';
    moveLsClassTooltip(e);
}

function moveLsClassTooltip(e) {
    const tip = _getLsClassTooltipEl();
    const tw = tip.offsetWidth || 260;
    const th = tip.offsetHeight || 100;
    let x = e.clientX + 14;
    let y = e.clientY + 14;
    if (x + tw > window.innerWidth - 8) x = e.clientX - tw - 10;
    if (y + th > window.innerHeight - 8) y = e.clientY - th - 10;
    tip.style.left = x + 'px';
    tip.style.top = y + 'px';
}

function hideLsClassTooltip() {
    const tip = document.getElementById('ls-class-tooltip');
    if (tip) tip.style.opacity = '0';
}