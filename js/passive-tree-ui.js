


// DOM refs shared across renderer / UI + viewport 
let _pt_container = null;   // #pt-canvas element
let _pt_world = null;   // the zoomable/pannable world div
let _pt_svg = null;   // SVG overlay for connections
let _pt_nodesLayer = null;   // div layer for node elements
let _pt_tooltip = null;   // floating tooltip element (lives in document.body)
let _pt_nodeEls = {};     // id → node div element
let _pt_connEls = {};     // conn id → SVG line element





//------------------------------------------------------------------------
//---------------------STYLE HELPERS--------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _ptApplyNodeStyle(id) {
    const el = _pt_nodeEls[id];
    if (!el) return;

    const isStart = (id === PT_START_ID);
    const state = _ptGetNodeVisualState(id);
    const skill = _pt_skillMap[id];
    const def = skill ? skill._def : null;
    const isKeystone = def && (
        (def.statKey && def.statKey.startsWith('keystone_')) ||
        (def.nameEn && def.nameEn.startsWith('Keystone:')) ||
        (def.nameDe && def.nameDe.startsWith('Schlüsselfertigkeit:'))
    );

    let bg, border, shadow, dotColor, cursor;

    if (state === 'allocated') {
        bg = isKeystone ? '#1a1000' : PT_COL_ALLOCATED_BG;
        border = isKeystone ? '2px solid #e8a020' : `2px solid ${PT_COL_ALLOCATED_BORDER}`;
        shadow = isKeystone
            ? '0 0 14px rgba(232,160,32,0.75), inset 0 0 6px rgba(0,0,0,0.4)'
            : '0 0 10px rgba(109,191,64,0.55), inset 0 0 4px rgba(0,0,0,0.3)';
        dotColor = isKeystone ? '#e8a020' : PT_COL_ALLOCATED_DOT;
        cursor = 'pointer';
    } else if (state === 'unlockable') {
        bg = isKeystone ? '#100800' : PT_COL_UNLOCKED_BG;
        border = isStart
            ? `3px solid ${PT_COL_START}`
            : isKeystone ? '2px solid #c07818' : `2px solid ${PT_COL_UNLOCKED_BORDER}`;
        shadow = isStart
            ? '0 0 12px rgba(255,215,0,0.6), inset 0 0 6px rgba(255,215,0,0.15)'
            : isKeystone ? '0 0 8px rgba(192,120,24,0.45), inset 0 0 4px rgba(0,0,0,0.4)'
                : '0 0 6px rgba(184,154,80,0.3), inset 0 0 4px rgba(0,0,0,0.4)';
        dotColor = isStart ? PT_COL_START : isKeystone ? '#c07818' : PT_COL_UNLOCKED_DOT;
        cursor = 'pointer';
    } else {
        // locked
        bg = PT_COL_LOCKED_BG;
        border = `2px solid ${PT_COL_LOCKED_BORDER}`;
        shadow = 'none';
        dotColor = PT_COL_LOCKED_DOT;
        cursor = 'not-allowed';
    }

    el.style.background = bg;
    el.style.border = border;
    el.style.boxShadow = shadow;
    el.style.cursor = cursor;
    el.style.opacity = state === 'locked' ? '0.45' : '1';

    const dot = el.querySelector('div.pt-dot');
    if (dot) dot.style.background = dotColor;
}

function _ptApplyConnStyle(connId, fromId, toId) {
    const line = _pt_connEls[connId];
    if (!line) return;

    const alloc = _ptAllocated();
    const bothAllocated = alloc.has(fromId) && alloc.has(toId);
    const eitherActive = alloc.has(fromId) || alloc.has(toId)
        || _ptIsUnlockable(fromId) || _ptIsUnlockable(toId);

    let color;
    if (bothAllocated) {
        color = PT_CONN_ALLOCATED;
    } else if (eitherActive) {
        color = PT_CONN_UNLOCKED;
    } else {
        color = PT_CONN_UNLOCKED;
    }
    line.setAttribute('stroke', color);
}

// Refresh every node and connection's visual state
function _ptRefreshAllStyles() {
    _pt_skills.forEach(s => _ptApplyNodeStyle(s.id));
    _pt_conns.forEach(c => _ptApplyConnStyle(c.id, c.from, c.to));
    _ptRefreshPointsDisplay();
}






//------------------------------------------------------------------------
//------------------------NODE TOOLTIP------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _ptCreateTooltip() {
    const tt = document.createElement('div');
    tt.id = 'pt-tooltip';
    tt.style.cssText = `
        position: fixed;
        z-index: 9999;
        pointer-events: none;
        max-width: 350px;
        background: rgba(10,10,20,0.97);
        border: 1px solid rgba(184,154,80,0.5);
        border-radius: 6px;
        padding: 10px 13px;
        font-family: var(--PX, monospace);
        font-size: 12px;
        color: #d4b870;
        box-shadow: 0 4px 18px rgba(0,0,0,0.7);
        line-height: 1.5;
        opacity: 0;
        transition: opacity 0.1s;
    `;
    document.body.appendChild(tt);
    return tt;
}

function _ptShowTooltip(id, mouseX, mouseY) {
    if (!_pt_tooltip) _pt_tooltip = _ptCreateTooltip();

    const skill = _pt_skillMap[id];
    const def = skill ? skill._def : null;   // _def is the raw node from new JSON
    const lang = _ptLang();
    const state = _ptGetNodeVisualState(id);

    const name = def
        ? (lang === 'de' ? (def.nameDe || def.nameEn) : def.nameEn)
        : (skill ? skill.name : `Skill ${id}`);

    const rawDesc = def
        ? (lang === 'de' ? (def.descDe || def.descEn) : def.descEn)
        : '';
    const desc = rawDesc ? rawDesc.replace(/\n/g, '<br>') : '';

    // Status line
    let statusHtml = '';
    if (state === 'allocated') {
        const canRemove = _ptIsDeallocatable(id);
        statusHtml = lang === 'de'
            ? `<div style="margin-top:7px;font-size:11px;color:${canRemove ? '#6dbf40' : '#888'};">
                 ${canRemove ? '✓ Aktiv — Klicken zum Entfernen' : '✓ Aktiv — Kann nicht entfernt werden'}
               </div>`
            : `<div style="margin-top:7px;font-size:11px;color:${canRemove ? '#6dbf40' : '#888'};">
                 ${canRemove ? '✓ Active — Click to remove' : '✓ Active — Cannot be removed'}
               </div>`;
    } else if (state === 'unlockable') {
        const noPoints = _ptPoints() < 1;
        statusHtml = lang === 'de'
            ? `<div style="margin-top:7px;font-size:11px;color:${noPoints ? '#c08030' : '#b89a50'};">
                 ${noPoints ? '⚠ Keine Punkte verfügbar' : '▶ Klicken zum Freischalten'}
               </div>`
            : `<div style="margin-top:7px;font-size:11px;color:${noPoints ? '#c08030' : '#b89a50'};">
                 ${noPoints ? '⚠ No points available' : '▶ Click to unlock'}
               </div>`;
    } else {
        statusHtml = lang === 'de'
            ? `<div style="margin-top:7px;font-size:11px;color:#555;">🔒 Gesperrt</div>`
            : `<div style="margin-top:7px;font-size:11px;color:#555;">🔒 Locked</div>`;
    }

    _pt_tooltip.innerHTML = `
        <div style="font-size:13px;font-weight:bold;color:#66fcf1;margin-bottom:5px;">${name}</div>
        ${desc ? `<div style="color:#bba870;">${desc}</div>` : ''}
        ${statusHtml}
    `;
    _ptPositionTooltip(mouseX, mouseY);
    _pt_tooltip.style.opacity = '1';
}

function _ptPositionTooltip(mx, my) {
    if (!_pt_tooltip) return;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const tw = _pt_tooltip.offsetWidth || 260;
    const th = _pt_tooltip.offsetHeight || 100;
    const PAD = 14;

    let x = mx + PAD;
    let y = my - th / 2;

    if (x + tw > W - PAD) x = mx - tw - PAD;
    if (y < PAD) y = PAD;
    if (y + th > H - PAD) y = H - th - PAD;

    _pt_tooltip.style.left = `${x}px`;
    _pt_tooltip.style.top = `${y}px`;
}

function _ptHideTooltip() {
    if (_pt_tooltip) _pt_tooltip.style.opacity = '0';
}









//------------------------------------------------------------------------
//-------------------------BOUNDING BOX-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _ptGetBounds() {
    if (!_pt_skills.length) return { minX: 0, minY: 0, maxX: 800, maxY: 600 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    _pt_skills.forEach(s => {
        if (s.x < minX) minX = s.x;
        if (s.y < minY) minY = s.y;
        if (s.x > maxX) maxX = s.x;
        if (s.y > maxY) maxY = s.y;
    });
    return { minX, minY, maxX, maxY };
}







//------------------------------------------------------------------------
//------------------------DRAW CONNECTIONS--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _ptDrawConnections(bounds) {
    const offsetX = PT_PADDING + PT_NODE_RADIUS - bounds.minX;
    const offsetY = PT_PADDING + PT_NODE_RADIUS - bounds.minY;

    _pt_conns.forEach(conn => {
        const from = _pt_skillMap[conn.from];
        const to = _pt_skillMap[conn.to];
        if (!from || !to) return;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', from.x + offsetX);
        line.setAttribute('y1', from.y + offsetY);
        line.setAttribute('x2', to.x + offsetX);
        line.setAttribute('y2', to.y + offsetY);
        line.setAttribute('stroke-width', PT_CONN_WIDTH);
        line.setAttribute('stroke-linecap', 'round');
        if (conn.dotted) line.setAttribute('stroke-dasharray', '5,5');
        _pt_svg.appendChild(line);

        _pt_connEls[conn.id] = line;
    });
}





//------------------------------------------------------------------------
//----------------------------DRAW NODES----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _ptDrawNodes(bounds) {
    const offsetX = PT_PADDING + PT_NODE_RADIUS - bounds.minX;
    const offsetY = PT_PADDING + PT_NODE_RADIUS - bounds.minY;


    /*

    _pt_skills.forEach(skill => {
        const cx = skill.x + offsetX;
        const cy = skill.y + offsetY;
        const isStart = (skill.id === PT_START_ID);
        const r = isStart ? PT_NODE_RADIUS * 1.4 : PT_NODE_RADIUS;

        const node = document.createElement('div');
        node.className = 'pt-node';
        node.dataset.id = skill.id;
        node.style.cssText = `
            position: absolute;
            left: ${cx - r}px;
            top:  ${cy - r}px;
            width:  ${r * 2}px;
            height: ${r * 2}px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s, box-shadow 0.15s, transform 0.12s, opacity 0.15s;
            z-index: 2;
            box-sizing: border-box;
        `;

        */


    _pt_skills.forEach(skill => {
        const cx = skill.x + offsetX;
        const cy = skill.y + offsetY;
        const isStart = (skill.id === PT_START_ID);
        const def = skill._def || null;
        const isKeystone = def && (
            (def.statKey && def.statKey.startsWith('keystone_')) ||
            (def.nameEn && def.nameEn.startsWith('Keystone:')) ||
            (def.nameDe && def.nameDe.startsWith('Schlüsselfertigkeit:'))
        );
        const r = isStart ? PT_NODE_RADIUS * 1.4 : PT_NODE_RADIUS;

        const node = document.createElement('div');
        node.className = isKeystone ? 'pt-node pt-node-keystone' : 'pt-node';
        node.dataset.id = skill.id;

        if (isKeystone) {
            // Diamond: rotated square, centered on same cx/cy
            const side = r * 2 * 0.92; // slightly smaller so diamond fits the same footprint
            node.style.cssText = `
            position: absolute;
            left: ${cx - side / 2}px;
            top:  ${cy - side / 2}px;
            width:  ${side}px;
            height: ${side}px;
            border-radius: 4px;
            transform: rotate(45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s, box-shadow 0.15s, transform 0.12s, opacity 0.15s;
            z-index: 2;
            box-sizing: border-box;
        `;
        } else {
            node.style.cssText = `
            position: absolute;
            left: ${cx - r}px;
            top:  ${cy - r}px;
            width:  ${r * 2}px;
            height: ${r * 2}px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.15s, box-shadow 0.15s, transform 0.12s, opacity 0.15s;
            z-index: 2;
            box-sizing: border-box;
        `;
        }



        // Resolve icon: prefer PT_SKILL_DEFS, fall back to layout data
        const icon = (def && def.icon) ? def.icon : skill.image;

        const isImageUrl = icon && (icon.startsWith('/') || icon.startsWith('http'));
        const isEmoji = icon && !isImageUrl && !icon.includes('axe-hammer-grey');

        if (isImageUrl && !icon.includes('axe-hammer-grey')) {
            const img = document.createElement('img');
            img.src = icon;
            img.style.cssText = `
                width: 60%; height: 60%;
                object-fit: contain;
                image-rendering: pixelated;
                opacity: 0.85;
                pointer-events: none;
            `;
            node.appendChild(img);
            // Counter-rotate inner content for keystone diamonds
            if (isKeystone) {
                const inner = node.firstChild;
                if (inner) inner.style.transform = 'rotate(-45deg)';
            }
        } else if (isEmoji) {
            const span = document.createElement('span');
            span.textContent = icon;
            span.style.cssText = `
                font-size: ${PT_NODE_RADIUS * 0.95}px;
                line-height: 1;
                pointer-events: none;
                user-select: none;
            `;
            node.appendChild(span);
            // Counter-rotate inner content for keystone diamonds
            if (isKeystone) {
                const inner = node.firstChild;
                if (inner) inner.style.transform = 'rotate(-45deg)';
            }
        } else {
            const dot = document.createElement('div');
            dot.className = 'pt-dot';
            dot.style.cssText = `
                width: 6px; height: 6px;
                border-radius: 50%;
                opacity: 0.7;
                pointer-events: none;
            `;
            node.appendChild(dot);
            // Counter-rotate inner content for keystone diamonds
            if (isKeystone) {
                const inner = node.firstChild;
                if (inner) inner.style.transform = 'rotate(-45deg)';
            }
        }

        // Mouse events 
        node.addEventListener('mouseenter', e => {
            if (_ptGetNodeVisualState(skill.id) !== 'locked') {
                node.style.transform = isKeystone ? 'rotate(45deg) scale(1.15)' : 'scale(1.15)';
                node.style.zIndex = '10';
            }
            _ptShowTooltip(skill.id, e.clientX, e.clientY);
        });

        node.addEventListener('mousemove', e => {
            _ptPositionTooltip(e.clientX, e.clientY);
        });

        node.addEventListener('mouseleave', () => {
            node.style.transform = isKeystone ? 'rotate(45deg)' : 'scale(1)';
            node.style.zIndex = '2';
            _ptHideTooltip();
        });

        node.addEventListener('mousedown', () => {
            _pt_mouseDownTime = Date.now();
        });

        node.addEventListener('click', e => {
            e.stopPropagation();
            if (Date.now() - _pt_mouseDownTime > 300) return;
            _ptOnNodeClick(skill.id);
            _ptShowTooltip(skill.id, e.clientX, e.clientY);
        });

        _pt_nodesLayer.appendChild(node);
        _pt_nodeEls[skill.id] = node;
    });
}


// Main render

function _ptRender() {
    const old = document.getElementById('pt-canvas');
    if (!old) { console.error('[PassiveTree] #pt-canvas not found'); return; }

    // Clone the element to strip all previously attached event listeners
    _pt_container = old.cloneNode(false);
    old.parentNode.replaceChild(_pt_container, old);

    // Reset caches
    _pt_nodeEls = {};
    _pt_connEls = {};
    _pt_eventsBound = false;
    if (_pt_tooltip) { _pt_tooltip.remove(); _pt_tooltip = null; }

    _pt_container.innerHTML = '';
    _pt_container.style.cssText += `
        position: relative;
        overflow: hidden;
        cursor: grab;
        user-select: none;
    `;

    if (!_pt_skills.length) {
        _pt_container.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;
                justify-content:center;height:100%;gap:18px;opacity:0.55;">
                <div style="font-family:var(--PX,monospace);font-size:13px;
                    color:var(--accent2,#aaa);letter-spacing:2px;text-align:center;">
                    ${_ptLang() === 'de'
                ? 'BAUM KONNTE NICHT GELADEN WERDEN'
                : 'TREE COULD NOT BE LOADED'}
                </div>
            </div>`;
        return;
    }

    _ptBuildAdjacency();

    // Start node is always pre-allocated
    const allocOnLoad = _ptAllocated();
    if (!allocOnLoad.has(PT_START_ID)) {
        allocOnLoad.add(PT_START_ID);
    }

    const bounds = _ptGetBounds();
    const worldW = bounds.maxX - bounds.minX + (PT_PADDING + PT_NODE_RADIUS) * 2;
    const worldH = bounds.maxY - bounds.minY + (PT_PADDING + PT_NODE_RADIUS) * 2;

    _pt_world = document.createElement('div');
    _pt_world.id = 'pt-world';
    _pt_world.style.cssText = `
        position: absolute;
        top: 0; left: 0;
        width:  ${worldW}px;
        height: ${worldH}px;
        transform-origin: 0 0;
        will-change: transform;
    `;

    _pt_svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    _pt_svg.style.cssText = `
        position: absolute;
        top: 0; left: 0;
        width:  ${worldW}px;
        height: ${worldH}px;
        overflow: visible;
        pointer-events: none;
    `;
    _pt_svg.setAttribute('width', worldW);
    _pt_svg.setAttribute('height', worldH);

    _pt_nodesLayer = document.createElement('div');
    _pt_nodesLayer.style.cssText = `
        position: absolute;
        top: 0; left: 0;
        width:  ${worldW}px;
        height: ${worldH}px;
    `;

    _pt_world.appendChild(_pt_svg);
    _pt_world.appendChild(_pt_nodesLayer);
    _pt_container.appendChild(_pt_world);

    _ptDrawConnections(bounds);
    _ptDrawNodes(bounds);
    _ptRefreshAllStyles();
    _ptFitToView(bounds);
    _ptBindEvents();
    // Inject search bar into topbar
    const existingWrap = document.getElementById('pt-search-wrap');
    if (existingWrap && !existingWrap.hasChildNodes()) {
        const searchBar = _ptCreateSearchBar();
        // Move children into the existing wrap instead of appending the whole element
        while (searchBar.firstChild) {
            existingWrap.appendChild(searchBar.firstChild);
        }
        // Copy styles
        existingWrap.style.cssText = searchBar.style.cssText;
    }
}






//------------------------------------------------------------------------
//------------------------------SEARCH FUNCTIONALITY----------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// ── Search ────────────────────────────────────────────────────────────────

function _ptCreateSearchBar() {
    const wrap = document.createElement('div');
    wrap.id = 'pt-search-wrap';
    wrap.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(10,10,20,0.88);
    border: 1px solid rgba(184,154,80,0.45);
    border-radius: 6px;
    padding: 5px 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.5);
`;

    const icon = document.createElement('span');
    icon.textContent = '🔍';
    icon.style.cssText = 'font-size:14px;opacity:0.7;pointer-events:none;';

    const input = document.createElement('input');
    input.id = 'pt-search-input';
    input.type = 'text';
    input.placeholder = _ptLang() === 'de' ? 'Knoten suchen…' : 'Search nodes…';
    input.style.cssText = `
        background: transparent;
        border: none;
        outline: none;
        font-family: var(--PX, monospace);
        font-size: 12px;
        color: #d4b870;
        width: 200px;
        caret-color: #d4b870;
    `;
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('autocomplete', 'off');

    const clearBtn = document.createElement('span');
    clearBtn.textContent = '✕';
    clearBtn.style.cssText = `
        font-size: 11px;
        color: #888;
        cursor: pointer;
        padding: 2px 4px;
        border-radius: 3px;
        transition: color 0.15s;
        display: none;
    `;
    clearBtn.addEventListener('mouseenter', () => clearBtn.style.color = '#d4b870');
    clearBtn.addEventListener('mouseleave', () => clearBtn.style.color = '#888');
    clearBtn.addEventListener('click', () => {
        input.value = '';
        _ptClearSearch();
        clearBtn.style.display = 'none';
    });

    input.addEventListener('input', () => {
        const q = input.value.trim();
        clearBtn.style.display = q ? 'inline' : 'none';
        _ptApplySearch(q);
    });

    // Prevent canvas pan when typing
    input.addEventListener('mousedown', e => e.stopPropagation());

    wrap.appendChild(icon);
    wrap.appendChild(input);
    wrap.appendChild(clearBtn);
    return wrap;
}

function _ptApplySearch(query) {
    const q = query.toLowerCase();

    _pt_skills.forEach(skill => {
        const el = _pt_nodeEls[skill.id];
        if (!el) return;
        const def = skill._def || {};

        if (!q) {
            // Clear: remove glow & dim overrides
            el.style.filter = '';
            el.style.opacity = '';
            el.style.zIndex = '2';
            return;
        }

        const haystack = [
            def.nameEn || '',
            def.nameDe || '',
            def.descEn || '',
            def.descDe || '',
            def.statKey || '',
        ].join(' ').toLowerCase();

        const match = haystack.includes(q);

        if (match) {
            // Golden glow pulse
            el.style.filter = 'drop-shadow(0 0 8px rgba(255,215,0,0.95)) drop-shadow(0 0 16px rgba(255,165,0,0.6))';
            el.style.opacity = '1';
            el.style.zIndex = '20';
        } else {
            // Dim non-matches
            el.style.filter = 'brightness(0.3) saturate(0.3)';
            el.style.opacity = '0.35';
            el.style.zIndex = '1';
        }
    });

    // Also dim connections when searching
    _pt_conns.forEach(conn => {
        const line = _pt_connEls[conn.id];
        if (!line) return;
        line.style.opacity = q ? '0.15' : '';
    });
}

function _ptClearSearch() {
    _ptApplySearch('');
}