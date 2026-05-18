

let hudMinimized = false;

const HUD_COLOR_PASSIVE = '#f39c12';
const HUD_COLOR_ACTIVE = '#3498db';




//------------------------------------------------------------------------
//-------------------------HELPER FUNCTIONS-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// Returns the localised string from a {nameDE, nameEn} object
function getLocalName(obj) {
    return LANG === 'de' ? obj.nameDE : obj.nameEn;
}

// Returns the localised description from a level-data object
function getLocalDesc(data) {
    return LANG === 'de' ? data.descDE : data.descEn;
}

// Returns the current skill level for a given active slot key. 
function getActiveSkillLevel(key) {
    return key === 'active1'
        ? (STATE.classActive1Level || 1)
        : (STATE.classActive2Level || 1);
}




//------------------------------------------------------------------------
//------------------------------RENDERERS---------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------





// Renders the cooldown overlay that sits on top of a skill while it is cooling down 

function renderCooldownOverlay(cdRemaining) {
    const label = LANG === 'de' ? 'Abklingzeit' : 'Cooldown';
    return `
        <div class="chud-cd-overlay">
            <span class="chud-cd-timer">${formatCooldown(cdRemaining)}</span>
            <span class="chud-cd-label">${label}</span>
        </div>`;
}

// Renders the small "click to cancel" hint shown when a skill is armed
function renderArmedHint() {
    const text = LANG === 'de' ? '✕ Klicken zum Abbrechen' : '✕ Click to cancel';
    return `<div class="chud-armed-hint">${text}</div>`;
}

// Renders the passive skill block (no click interaction)
function renderPassiveSkill(def) {
    const passLv = STATE.classPassiveLevel || 1;
    const passData = def.passive.levels[passLv - 1];
    const passName = getLocalName(def.passive);
    const rankWord = LANG === 'de' ? 'Rang' : 'Rank';

    return `
        <div class="chud-passive-section" style="
            padding: 8px 8px 8px 10px;
            background: rgba(0,0,0,0.25);
            border: 1px solid var(--border);
            border-left: 3px solid ${HUD_COLOR_PASSIVE};
            margin-bottom: 6px;">
            <div class="chud-skill-name" style="color:${HUD_COLOR_PASSIVE}; font-weight:bold; margin-bottom:4px;">
                ${passName}
                <span class="chud-rank" style="opacity:0.65; font-size:0.85em;">— ${rankWord} ${passLv}</span>
            </div>
            <div class="chud-skill-desc">${getLocalDesc(passData)}</div>
        </div>`;
}

// Renders one active skill block (active1 or active2)
function renderActiveSkill(def, key) {
    const skill = def[key];
    const skillLv = getActiveSkillLevel(key);
    const skillData = skill.levels[skillLv - 1];
    const skillName = getLocalName(skill);
    const cdRemaining = cooldownState[key].remaining;

    const isArmed = activeAbilityMode && STATE.classActiveChoice === key;
    const isOnCooldown = cdRemaining > 0;

    const rankWord = LANG === 'de' ? 'Rang' : 'Rank';
    const accentColor = isArmed ? '#e74c3c' : HUD_COLOR_ACTIVE;

    const sectionClass = [
        'chud-active-section',
        isArmed ? 'armed' : '',
        isOnCooldown ? 'on-cooldown' : ''
    ].filter(Boolean).join(' ');

    const inlineStyle = `
        padding: 8px 8px 8px 10px;
        background: ${isArmed ? 'rgba(231,76,60,0.1)' : 'rgba(0,0,0,0.25)'};
        border: 1px solid var(--border);
        border-left: 3px solid ${accentColor};
        margin-bottom: 6px;
        cursor: ${isOnCooldown ? 'not-allowed' : 'pointer'};
        position: relative;
        ${isOnCooldown ? 'opacity:0.7;' : ''}
    `;

    const clickAttr = isOnCooldown ? '' : `onclick="toggleActiveAbility('${key}')"`;

    return `
        <div class="${sectionClass}" data-slot="${key}" style="${inlineStyle}" ${clickAttr}>
            <div class="chud-skill-name" style="color:${HUD_COLOR_ACTIVE}; font-weight:bold; margin-bottom:4px;">
                ${skillName}
                <span class="chud-rank" style="opacity:0.65; font-size:0.85em;">— ${rankWord} ${skillLv}</span>
            </div>
            <div class="chud-skill-desc" style="position:relative;">
                ${getLocalDesc(skillData)}
                ${isOnCooldown ? renderCooldownOverlay(cdRemaining) : ''}
            </div>
            ${isArmed ? renderArmedHint() : ''}
        </div>`;
}

// Renders the drag handle bar at the top of the HUD
function renderDragHandle() {
    const title = hudMinimized ? '▲' : '▼';
    const tipText = hudMinimized ? 'Expand' : 'Minimize';
    return `
        <div id="class-hud-drag-handle">
            ${hudMinimized ? '' : '<span id="chud-drag-label">DRAG TO MOVE</span>'}
            ${renderMinimizedCooldownBar()}
            <button id="class-hud-minimize-btn"
                    onclick="toggleClassHUDMinimize(event)"
                    title="${tipText}">${title}</button>
        </div>`;
}

// Renders the collapsible body containing icon, name, and all skills
function renderHUDBody(def) {
    const name = getLocalName(def);
    return `
        <div id="class-hud-body" style="
            padding: 0 10px 10px;
            display: ${hudMinimized ? 'none' : 'flex'};
            flex-direction: column;
            gap: 6px;">
            <div class="chud-icon">${def.icon}</div>
            <div class="chud-name" style="color:${def.colorLight}; font-size:1.2em; margin-bottom:10px;">${name}</div>
            ${renderPassiveSkill(def)}
            ${renderActiveSkill(def, 'active1')}
            ${renderActiveSkill(def, 'active2')}
        </div>`;
}





// Builds the cooldown status HTML shown inside the drag handle when minimized
// Called by renderDragHandle and patchMinimizedBar
// used to show skill cooldowns while class hud is minimized

function renderMinimizedCooldownBar() {
    if (!hudMinimized) return '';

    const def = CLASS_DEFS[STATE.playerClass];
    if (!def) return '';

    const slots = ['active1', 'active2'];

    const parts = slots.map((key, i) => {
        const cd = cooldownState[key].remaining;
        const isReady = cd <= 0;
        const label = LANG === 'de' ? `${i + 1}` : `${i + 1}`;

        return isReady
            ? `<span class="chud-mini-ready">${label}: ${LANG === 'de' ? 'Bereit' : 'Ready'} ✓</span>`
            : `<span class="chud-mini-cd">${label}: ${formatCooldown(cd)}</span>`;
    }).join('<span class="chud-mini-sep">|</span>');

    return `<div id="chud-mini-bar">${parts}</div>`;
}





//------------------------------------------------------------------------
//-----------------------BUILD CLASS HUD----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

 // Clears and rebuilds the entire class HUD panel from current STATE
 // Also re-attaches drag behaviour after each rebuild
 
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

    // Ensure classActiveChoice is always a string key, never a number
    if (!STATE.classActiveChoice || typeof STATE.classActiveChoice === 'number') {
        STATE.classActiveChoice = 'active1';
    }

    panel.style.display = 'flex';
    panel.innerHTML = renderDragHandle() + renderHUDBody(def);

    makeClassHUDDraggable();
}


//------------------------------------------------------------------------
//---------------------------DRAG LOGIC-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Attaches pointer-drag logic to the HUD panel via its drag handle
// Clamps position so the panel can never be dragged fully off-screen.

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

// Returns left/top values clamped so the panel stays fully inside the viewport
function clampToViewport(left, top, panelW, panelH) {
    return {
        left: Math.max(0, Math.min(left, window.innerWidth - panelW)),
        top: Math.max(0, Math.min(top, window.innerHeight - panelH))
    };
}




//------------------------------------------------------------------------
//----------------------------MINIMIZE TOGGLE-----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Toggles the collapsed/expanded state of the HUD body

function toggleClassHUDMinimize(e) {
    e.stopPropagation();
    hudMinimized = !hudMinimized;

    const body = document.getElementById('class-hud-body');
    const btn = document.getElementById('class-hud-minimize-btn');
    const handle = document.getElementById('class-hud-drag-handle');

    if (body) body.style.display = hudMinimized ? 'none' : 'flex';
    if (btn) btn.textContent = hudMinimized ? '▲' : '▼';

    if (handle) {
        // Toggle the drag label
        const label = document.getElementById('chud-drag-label');
        if (hudMinimized) {
            if (label) label.remove();
        } else {
            if (!label) {
                const span = document.createElement('span');
                span.id = 'chud-drag-label';
                span.textContent = 'DRAG TO MOVE';
                handle.prepend(span);
            }
        }

        // Toggle the cooldown bar
        const existing = document.getElementById('chud-mini-bar');
        if (hudMinimized) {
            if (!existing) {
                const bar = document.createElement('div');
                bar.innerHTML = renderMinimizedCooldownBar();
                btn.insertAdjacentElement('beforebegin', bar.firstElementChild);
            }
        } else {
            if (existing) existing.remove();
        }
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






//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------












