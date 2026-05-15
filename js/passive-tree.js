// ═══════════════════════════════════════════════════════════════════════════
//  PASSIVE TREE  (passive-tree.js)
//
//  Depends on (load order in HTML):
//    1. passive-tree-data.js     → TALENT_TREE_DATA  (layout / connections)
//    2. passive-tree-skills.js   → PT_SKILL_DEFS     (names, descriptions, EN/DE)
//    3. this file
//
//  Public API
//    buildPassiveTreeScreen()   – called by showPassiveTree() in ui.js
//    PT.reload()                – re-render with current data
//
//  STATE integration
//    STATE.passiveTreePoints    – spendable points (read + written)
//    STATE.passiveTreeAllocated – Set of allocated skill IDs (read + written)
//                                  auto-created as empty Set if missing
//
//  Expected HTML
//    #pt-points   – text node for available-points counter
//    #pt-canvas   – the scrollable / zoomable container
// ═══════════════════════════════════════════════════════════════════════════

// ── Visual constants ─────────────────────────────────────────────────────────
const PT_NODE_RADIUS = 22;
const PT_PADDING = 80;
const PT_ZOOM_MIN = 0.25;
const PT_ZOOM_MAX = 3.0;
const PT_ZOOM_STEP = 0.12;
const PT_CONN_WIDTH = 2;

// Colours – locked / unlocked / allocated / start
const PT_COL_LOCKED_BG = '#111120';
const PT_COL_LOCKED_BORDER = '#3a3350';
const PT_COL_LOCKED_DOT = '#3a3350';
const PT_COL_UNLOCKED_BG = '#1a1a2e';
const PT_COL_UNLOCKED_BORDER = '#b89a50';
const PT_COL_UNLOCKED_DOT = '#b89a50';
const PT_COL_ALLOCATED_BG = '#1e2a10';
const PT_COL_ALLOCATED_BORDER = '#6dbf40';
const PT_COL_ALLOCATED_DOT = '#6dbf40';
const PT_COL_START = '#ffd700';
const PT_CONN_LOCKED = 'rgba(80,70,110,0.3)';
const PT_CONN_UNLOCKED = 'rgba(160,130,80,0.45)';
const PT_CONN_ALLOCATED = 'rgba(109,191,64,0.7)';

// ── Module ───────────────────────────────────────────────────────────────────
const PT = (() => {

    // ── Data ─────────────────────────────────────────────────────────────────
    let _data = null;
    let _skills = [];
    let _conns = [];
    let _skillMap = {};  // id (number) → layout skill object
    // Adjacency map: id → Set of adjacent ids (derived from _conns)
    let _adjacency = {};

    // ── Viewport ─────────────────────────────────────────────────────────────
    let _scale = 1.0;
    let _tx = 0;
    let _ty = 0;

    // ── Drag state ───────────────────────────────────────────────────────────
    let _dragging = false;
    let _dragStartX = 0;
    let _dragStartY = 0;
    let _dragTxStart = 0;
    let _dragTyStart = 0;
    let _mouseDownTime = 0;  // used to distinguish click vs drag

    // ── DOM refs ─────────────────────────────────────────────────────────────
    let _container = null;
    let _world = null;
    let _svg = null;
    let _nodesLayer = null;
    let _tooltip = null;   // floating tooltip element (lives in _container)
    let _nodeEls = {};     // id → DOM node element (for fast style updates)
    let _connEls = {};     // conn id → SVG line element

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** Current language string */
    function _lang() {
        return (typeof LANG !== 'undefined' && LANG === 'de') ? 'de' : 'en';
    }

    /** Get the Set of allocated IDs from STATE (auto-create if absent) */
    function _allocated() {
        if (typeof STATE === 'undefined') return new Set();
        if (!(STATE.passiveTreeAllocated instanceof Set)) {
            STATE.passiveTreeAllocated = new Set();
        }
        return STATE.passiveTreeAllocated;
    }

    /** Available spendable points */
    function _points() {
        return (typeof STATE !== 'undefined' && STATE.passiveTreePoints) || 0;
    }

    /** Decrement points and persist */
    function _spendPoint() {
        if (typeof STATE !== 'undefined') STATE.passiveTreePoints = Math.max(0, _points() - 1);
        _refreshPointsDisplay();
    }

    /** Refund a point and persist */
    function _refundPoint() {
        if (typeof STATE !== 'undefined') STATE.passiveTreePoints = _points() + 1;
        _refreshPointsDisplay();
    }

    /** Update the #pt-points label */
    function _refreshPointsDisplay() {
        const el = document.getElementById('pt-points');
        if (!el) return;
        const p = _points();
        el.textContent = _lang() === 'de'
            ? `Verfügbare Punkte: ${p}`
            : `Available points: ${p}`;
    }

    // ── Unlock logic ──────────────────────────────────────────────────────────

    /** The Start node is always considered "reachable" */
    const START_ID = 11;

    /**
     * A node is UNLOCKABLE (can be spent on) when:
     *   – it is NOT already allocated
     *   – at least one adjacent node IS allocated  OR  it is the Start node
     */
    function _isUnlockable(id) {
        const alloc = _allocated();
        if (alloc.has(id)) return false;                    // already allocated
        if (id === START_ID) return true;                   // Start is always reachable
        const neighbours = _adjacency[id] || new Set();
        for (const nid of neighbours) {
            if (alloc.has(nid)) return true;
        }
        return false;
    }

    /**
     * A node can be DE-ALLOCATED when:
     *   – it IS currently allocated
     *   – removing it would NOT disconnect any other allocated node from Start
     *     (i.e. no allocated neighbour would become stranded)
     */
    function _isDeallocatable(id) {
        const alloc = _allocated();
        if (!alloc.has(id)) return false;
        if (id === START_ID) {
            // Only allow de-allocating Start if nothing else is allocated
            return alloc.size === 1;
        }

        // Simulate removal and verify every remaining allocated node
        // is still reachable from Start through the remaining allocated set
        const testSet = new Set(alloc);
        testSet.delete(id);

        // BFS/DFS from Start within testSet
        function reachable(from, available) {
            const visited = new Set();
            const queue = [from];
            while (queue.length) {
                const cur = queue.pop();
                if (visited.has(cur)) continue;
                visited.add(cur);
                const adj = _adjacency[cur] || new Set();
                for (const n of adj) {
                    if (available.has(n) && !visited.has(n)) queue.push(n);
                }
            }
            return visited;
        }

        if (!testSet.has(START_ID)) return true; // Start wasn't even kept
        const reachableSet = reachable(START_ID, testSet);
        for (const aid of testSet) {
            if (!reachableSet.has(aid)) return false; // someone got stranded
        }
        return true;
    }

    // ── Visual state helpers ──────────────────────────────────────────────────

    function _getNodeVisualState(id) {
        const alloc = _allocated();
        if (alloc.has(id)) return 'allocated';
        if (_isUnlockable(id)) return 'unlockable';
        return 'locked';
    }

    function _applyNodeStyle(id) {
        const el = _nodeEls[id];
        if (!el) return;
        const isStart = (id === START_ID);
        const state = _getNodeVisualState(id);

        let bg, border, shadow, dotColor, cursor;
        if (state === 'allocated') {
            bg = PT_COL_ALLOCATED_BG;
            border = `2px solid ${PT_COL_ALLOCATED_BORDER}`;
            shadow = '0 0 10px rgba(109,191,64,0.55), inset 0 0 4px rgba(0,0,0,0.3)';
            dotColor = PT_COL_ALLOCATED_DOT;
            cursor = 'pointer';
        } else if (state === 'unlockable') {
            bg = PT_COL_UNLOCKED_BG;
            border = isStart
                ? `3px solid ${PT_COL_START}`
                : `2px solid ${PT_COL_UNLOCKED_BORDER}`;
            shadow = isStart
                ? '0 0 12px rgba(255,215,0,0.6), inset 0 0 6px rgba(255,215,0,0.15)'
                : '0 0 6px rgba(184,154,80,0.3), inset 0 0 4px rgba(0,0,0,0.4)';
            dotColor = isStart ? PT_COL_START : PT_COL_UNLOCKED_DOT;
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

        // Update dot colour (first child that's a div, not an img)
        const dot = el.querySelector('div.pt-dot');
        if (dot) dot.style.background = dotColor;
    }

    function _applyConnStyle(connId, fromId, toId) {
        const line = _connEls[connId];
        if (!line) return;
        const alloc = _allocated();
        const bothAllocated = alloc.has(fromId) && alloc.has(toId);
        const eitherActive = alloc.has(fromId) || alloc.has(toId)
            || _isUnlockable(fromId) || _isUnlockable(toId);

        let color;
        if (bothAllocated) {
            color = PT_CONN_ALLOCATED;   // bright green — both ends taken
        } else if (eitherActive) {
            color = PT_CONN_UNLOCKED;    // gold — at least one end is active/reachable
        } else {
            // Neither end is allocated or directly reachable yet —
            // still show the line so players can plan routes, just dimmer.
            color = PT_CONN_UNLOCKED; //'rgba(120,100,60,0.28)';
        }
        line.setAttribute('stroke', color);
    }

    /** Refresh every node and connection's visual state */
    function _refreshAllStyles() {
        _skills.forEach(s => _applyNodeStyle(s.id));
        _conns.forEach(c => _applyConnStyle(c.id, c.from, c.to));
        _refreshPointsDisplay();
    }

    // ── Click handler ────────────────────────────────────────────────────────

    function _onNodeClick(id) {
        const alloc = _allocated();

        if (alloc.has(id)) {
            // Try to de-allocate
            if (_isDeallocatable(id)) {
                alloc.delete(id);
                _refundPoint();
                _refreshAllStyles();
            }
            // else: cannot remove – show nothing (tooltip still visible from hover)
            return;
        }

        // Try to allocate
        if (!_isUnlockable(id)) return;
        if (_points() < 1) return; // no points left

        alloc.add(id);
        _spendPoint();
        _refreshAllStyles();
    }

    // ── Tooltip ───────────────────────────────────────────────────────────────

    function _createTooltip() {
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

    function _showTooltip(id, mouseX, mouseY) {
        if (!_tooltip) _tooltip = _createTooltip();

        const def = (typeof PT_SKILL_DEFS !== 'undefined') ? PT_SKILL_DEFS[id] : null;
        const skill = _skillMap[id];
        const lang = _lang();
        const alloc = _allocated();
        const state = _getNodeVisualState(id);

        const name = def
            ? (lang === 'de' ? def.nameDe : def.nameEn)
            : (skill ? skill.name : `Skill ${id}`);

        const rawDesc = def
            ? (lang === 'de' ? def.descDe : def.descEn)
            : (skill ? skill.description : '');
        const desc = rawDesc ? rawDesc.replace(/\n/g, '<br>') : '';

        // Status line
        let statusHtml = '';
        if (state === 'allocated') {
            const canRemove = _isDeallocatable(id);
            statusHtml = lang === 'de'
                ? `<div style="margin-top:7px;font-size:11px;color:${canRemove ? '#6dbf40' : '#888'};">
                     ${canRemove ? '✓ Aktiv — Klicken zum Entfernen' : '✓ Aktiv — Kann nicht entfernt werden'}
                   </div>`
                : `<div style="margin-top:7px;font-size:11px;color:${canRemove ? '#6dbf40' : '#888'};">
                     ${canRemove ? '✓ Active — Click to remove' : '✓ Active — Cannot be removed'}
                   </div>`;
        } else if (state === 'unlockable') {
            const noPoints = _points() < 1;
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


        // Title and Skill Description inside the Tooltip 
        _tooltip.innerHTML = `
            <div style="font-size:13px;font-weight:bold;color:#66fcf1;margin-bottom:5px;">${name}</div>
            ${desc ? `<div style="color:#bba870;">${desc}</div>` : ''}
            ${statusHtml}
        `;
        _positionTooltip(mouseX, mouseY);
        _tooltip.style.opacity = '1';
    }

    function _positionTooltip(mx, my) {
        if (!_tooltip) return;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const tw = _tooltip.offsetWidth || 260;
        const th = _tooltip.offsetHeight || 100;
        const PAD = 14;

        let x = mx + PAD;
        let y = my - th / 2;

        if (x + tw > W - PAD) x = mx - tw - PAD;
        if (y < PAD) y = PAD;
        if (y + th > H - PAD) y = H - th - PAD;

        _tooltip.style.left = `${x}px`;
        _tooltip.style.top = `${y}px`;
    }

    function _hideTooltip() {
        if (_tooltip) _tooltip.style.opacity = '0';
    }

    // ── Bounding box ──────────────────────────────────────────────────────────
    function _getBounds() {
        if (!_skills.length) return { minX: 0, minY: 0, maxX: 800, maxY: 600 };
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        _skills.forEach(s => {
            if (s.x < minX) minX = s.x;
            if (s.y < minY) minY = s.y;
            if (s.x > maxX) maxX = s.x;
            if (s.y > maxY) maxY = s.y;
        });
        return { minX, minY, maxX, maxY };
    }

    // ── Fit to view ───────────────────────────────────────────────────────────
    function _fitToView() {
        const bounds = _getBounds();
        const treeW = bounds.maxX - bounds.minX + PT_PADDING * 2 + PT_NODE_RADIUS * 2;
        const treeH = bounds.maxY - bounds.minY + PT_PADDING * 2 + PT_NODE_RADIUS * 2;
        const cW = _container.clientWidth || 800;
        const cH = _container.clientHeight || 600;

        const sx = cW / treeW;
        const sy = cH / treeH;
        _scale = Math.min(sx, sy, 1.0);
        _scale = Math.max(_scale, PT_ZOOM_MIN);

        const offsetX = PT_PADDING + PT_NODE_RADIUS - bounds.minX;
        const offsetY = PT_PADDING + PT_NODE_RADIUS - bounds.minY;

        const scaledW = treeW * _scale;
        const scaledH = treeH * _scale;

        _tx = (cW - scaledW) / 2;
        _ty = (cH - scaledH) / 2;

        _tx += 500;
        _ty += offsetY * _scale;

        _applyTransform();
    }

    function _applyTransform() {
        if (_world) {
            _world.style.transform = `translate(${_tx}px, ${_ty}px) scale(${_scale})`;
        }
    }

    // ── Build adjacency map ───────────────────────────────────────────────────
    function _buildAdjacency() {
        _adjacency = {};
        _skills.forEach(s => { _adjacency[s.id] = new Set(); });
        _conns.forEach(c => {
            if (_adjacency[c.from]) _adjacency[c.from].add(c.to);
            if (_adjacency[c.to]) _adjacency[c.to].add(c.from);
        });
    }

    // ── Draw connections ──────────────────────────────────────────────────────
    function _drawConnections(bounds) {
        const offsetX = PT_PADDING + PT_NODE_RADIUS - bounds.minX;
        const offsetY = PT_PADDING + PT_NODE_RADIUS - bounds.minY;

        _conns.forEach(conn => {
            const from = _skillMap[conn.from];
            const to = _skillMap[conn.to];
            if (!from || !to) return;

            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', from.x + offsetX);
            line.setAttribute('y1', from.y + offsetY);
            line.setAttribute('x2', to.x + offsetX);
            line.setAttribute('y2', to.y + offsetY);
            line.setAttribute('stroke-width', PT_CONN_WIDTH);
            line.setAttribute('stroke-linecap', 'round');
            if (conn.dotted) line.setAttribute('stroke-dasharray', '5,5');
            _svg.appendChild(line);

            _connEls[conn.id] = line;
        });
    }

    // ── Draw nodes ────────────────────────────────────────────────────────────
    function _drawNodes(bounds) {
        const offsetX = PT_PADDING + PT_NODE_RADIUS - bounds.minX;
        const offsetY = PT_PADDING + PT_NODE_RADIUS - bounds.minY;

        _skills.forEach(skill => {
            const cx = skill.x + offsetX;
            const cy = skill.y + offsetY;
            const isStart = (skill.id === START_ID);
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

            // Resolve icon: prefer PT_SKILL_DEFS, fall back to layout data
            const def = (typeof PT_SKILL_DEFS !== 'undefined') ? PT_SKILL_DEFS[skill.id] : null;
            const icon = (def && def.icon) ? def.icon : skill.image;

            // Distinguish: image URL (starts with / or http) vs emoji/text vs fallback dot
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
            }

            // ── Mouse events ──────────────────────────────────────────────
            node.addEventListener('mouseenter', e => {
                if (_getNodeVisualState(skill.id) !== 'locked') {
                    node.style.transform = 'scale(1.15)';
                    node.style.zIndex = '10';
                }
                _showTooltip(skill.id, e.clientX, e.clientY);
            });

            node.addEventListener('mousemove', e => {
                _positionTooltip(e.clientX, e.clientY);
            });

            node.addEventListener('mouseleave', () => {
                node.style.transform = 'scale(1)';
                node.style.zIndex = '2';
                _hideTooltip();
            });

            node.addEventListener('mousedown', () => {
                _mouseDownTime = Date.now();
            });

            node.addEventListener('click', e => {
                e.stopPropagation();
                // Ignore if this was actually a drag (moved more than a few px)
                if (Date.now() - _mouseDownTime > 300) return;
                _onNodeClick(skill.id);
                // Refresh tooltip content in-place (state may have changed)
                _showTooltip(skill.id, e.clientX, e.clientY);
            });

            _nodesLayer.appendChild(node);
            _nodeEls[skill.id] = node;
        });
    }

    // ── Pan / zoom events ─────────────────────────────────────────────────────
    function _bindEvents() {
        // Wheel → zoom
        _container.addEventListener('wheel', e => {
            e.preventDefault();
            const dir = e.deltaY < 0 ? 1 : -1;
            const factor = 1 + dir * PT_ZOOM_STEP;
            const newScale = Math.min(PT_ZOOM_MAX, Math.max(PT_ZOOM_MIN, _scale * factor));
            const rect = _container.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            const ratio = newScale / _scale;
            _tx = mx - ratio * (mx - _tx);
            _ty = my - ratio * (my - _ty);
            _scale = newScale;
            _applyTransform();
        }, { passive: false });

        // Mouse drag → pan
        _container.addEventListener('mousedown', e => {
            if (e.button !== 0) return;
            if (e.target.closest('.pt-node')) return;
            _dragging = true;
            _dragStartX = e.clientX;
            _dragStartY = e.clientY;
            _dragTxStart = _tx;
            _dragTyStart = _ty;
            _container.style.cursor = 'grabbing';
        });
        window.addEventListener('mousemove', e => {
            if (!_dragging) return;
            _tx = _dragTxStart + (e.clientX - _dragStartX);
            _ty = _dragTyStart + (e.clientY - _dragStartY);
            _applyTransform();
        });
        window.addEventListener('mouseup', () => {
            if (_dragging) {
                _dragging = false;
                _container.style.cursor = 'grab';
            }
        });

        // Touch drag + pinch-zoom
        let lastDist = null;

        _container.addEventListener('touchstart', e => {
            if (e.touches.length === 1) {
                _dragging = true;
                _dragStartX = e.touches[0].clientX;
                _dragStartY = e.touches[0].clientY;
                _dragTxStart = _tx;
                _dragTyStart = _ty;
            }
            if (e.touches.length === 2) {
                _dragging = false;
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                lastDist = Math.hypot(dx, dy);
            }
        }, { passive: true });

        _container.addEventListener('touchmove', e => {
            e.preventDefault();
            if (e.touches.length === 1 && _dragging) {
                _tx = _dragTxStart + (e.touches[0].clientX - _dragStartX);
                _ty = _dragTyStart + (e.touches[0].clientY - _dragStartY);
                _applyTransform();
            }
            if (e.touches.length === 2 && lastDist !== null) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.hypot(dx, dy);
                const factor = dist / lastDist;
                const newScale = Math.min(PT_ZOOM_MAX, Math.max(PT_ZOOM_MIN, _scale * factor));
                _scale = newScale;
                lastDist = dist;
                _applyTransform();
            }
        }, { passive: false });

        _container.addEventListener('touchend', () => {
            _dragging = false;
            lastDist = null;
        });

        // Hide tooltip when clicking empty canvas
        _container.addEventListener('click', () => _hideTooltip());
    }

    // ── Main render ───────────────────────────────────────────────────────────
    function _render() {
        _container = document.getElementById('pt-canvas');
        if (!_container) { console.error('[PassiveTree] #pt-canvas not found'); return; }

        // Reset DOM caches (re-render clears everything)
        _nodeEls = {};
        _connEls = {};
        if (_tooltip) { _tooltip.remove(); _tooltip = null; }

        _container.innerHTML = '';
        _container.style.cssText += `
            position: relative;
            overflow: hidden;
            cursor: grab;
            user-select: none;
        `;

        if (!_skills.length) {
            _container.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;
                    justify-content:center;height:100%;gap:18px;opacity:0.55;">
                    <div style="font-family:var(--PX,monospace);font-size:13px;
                        color:var(--accent2,#aaa);letter-spacing:2px;text-align:center;">
                        ${_lang() === 'de'
                    ? 'BAUM KONNTE NICHT GELADEN WERDEN'
                    : 'TREE COULD NOT BE LOADED'}
                    </div>
                </div>`;
            return;
        }

        _buildAdjacency();

        // Start node is always free — allocate it silently if not already done
        const _allocOnLoad = _allocated();
        if (!_allocOnLoad.has(START_ID)) {
            _allocOnLoad.add(START_ID);
        }

        const bounds = _getBounds();
        const worldW = bounds.maxX - bounds.minX + (PT_PADDING + PT_NODE_RADIUS) * 2;
        const worldH = bounds.maxY - bounds.minY + (PT_PADDING + PT_NODE_RADIUS) * 2;

        _world = document.createElement('div');
        _world.id = 'pt-world';
        _world.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: ${worldW}px;
            height: ${worldH}px;
            transform-origin: 0 0;
            will-change: transform;
        `;

        _svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        _svg.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: ${worldW}px;
            height: ${worldH}px;
            overflow: visible;
            pointer-events: none;
        `;
        _svg.setAttribute('width', worldW);
        _svg.setAttribute('height', worldH);

        _nodesLayer = document.createElement('div');
        _nodesLayer.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: ${worldW}px;
            height: ${worldH}px;
        `;

        _world.appendChild(_svg);
        _world.appendChild(_nodesLayer);
        _container.appendChild(_world);

        _drawConnections(bounds);
        _drawNodes(bounds);
        _refreshAllStyles();   // apply locked/unlocked/allocated colours
        _fitToView();
        _bindEvents();
    }

    // ── Public interface ──────────────────────────────────────────────────────
    return {
        reload: _render,

        loadInline(json) {
            _data = json.FullData;
            _skills = _data.skills || [];
            _conns = _data.connections || [];
            _skillMap = {};
            _skills.forEach(s => { _skillMap[s.id] = s; });
        },

        hasSkill(statKey) {
            const alloc = _allocated();
            for (const id of alloc) {
                const def = (typeof PT_SKILL_DEFS !== 'undefined') ? PT_SKILL_DEFS[id] : null;
                if (def && def.statKey === statKey) return true;
            }
            return false;
        },


        get data() { return _data; },
    };
})();

// ── Entry point called by ui.js ───────────────────────────────────────────────
async function buildPassiveTreeScreen() {
    const lang = (typeof LANG !== 'undefined') ? LANG : 'en';
    const points = (typeof STATE !== 'undefined' && STATE.passiveTreePoints) || 0;

    // Update points counter
    const pointsEl = document.getElementById('pt-points');
    if (pointsEl) {
        pointsEl.textContent = lang === 'de'
            ? `Verfügbare Punkte: ${points}`
            : `Available points: ${points}`;
    }

    // Show brief loading state
    const canvas = document.getElementById('pt-canvas');
    if (canvas) {
        canvas.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;
                height:100%;font-family:var(--PX,monospace);font-size:12px;
                color:var(--accent2,#aaa);letter-spacing:2px;opacity:0.6;">
                ${lang === 'de' ? 'LADE BAUM…' : 'LOADING TREE…'}
            </div>`;
    }

    // Load data only once
    if (!PT.data) {
        PT.loadInline(TALENT_TREE_DATA);
    }
    PT.reload();
}









/*

if (PT.hasSkill('tutor_enable')) {
    // player has the Tutor node allocated — show tutor button, etc.
}

*/