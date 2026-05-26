/*
    ------------------------------------------------------------------------
    -------------------RECURSIONIST SKILLS----------------------------------
    ------------------------------------------------------------------------
    ------------------------------------------------------------------------
*/


// ── STATE ────────────────────────────────────────────────────────────────

window._residualTotem = null;   // { row, col, radius, charges, fireIntervalSecs, timeout }
window._dofSession = null;      // { correctCount, recoverPct, picked: [], active: bool }


// ── SHARED HELPERS ────────────────────────────────────────────────────────

function _getMistakeCells() {
    if (!cur) return [];
    const rows = cur.grid.length, cols = cur.grid[0].length;
    const cells = [];
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            if (wrongGrid[r][c]) cells.push({ r, c });
    return cells;
}

// Looks up the time penalty logged for (r, c) in the actuary mistake log
function _getMistakePenalty(r, c) {
    if (!window._mistakeLog) return 0;
    const entry = window._mistakeLog.find(e => e.r === r && e.c === c);
    return entry ? entry.penaltySecs : 0;
}

// Consumes the log entry for (r, c) and returns the penalty
function _consumeMistakePenalty(r, c) {
    if (!window._mistakeLog) return 0;
    const idx = window._mistakeLog.findIndex(e => e.r === r && e.c === c);
    if (idx === -1) return 0;
    const pen = window._mistakeLog[idx].penaltySecs;
    window._mistakeLog.splice(idx, 1);
    return pen;
}


// ── RESIDUAL TOTEM ────────────────────────────────────────────────────────

function _executeResidual(row, col, effect) {
    _clearResidualTotem();

    const { beamRadius, charges, fires } = effect;

    // Prefer the nearest mistake cell to where the player clicked
    const mistakeCells = _getMistakeCells();
    let totemRow = row, totemCol = col;
    if (mistakeCells.length > 0) {
        let best = mistakeCells[0], bestDist = Infinity;
        mistakeCells.forEach(({ r, c }) => {
            const d = Math.abs(r - row) + Math.abs(c - col);
            if (d < bestDist) { bestDist = d; best = { r, c }; }
        });
        totemRow = best.r;
        totemCol = best.c;
    }

    _spawnResidualTotem(totemRow, totemCol, beamRadius, charges, fires);
}


function _spawnResidualTotem(row, col, radius, charges, fireIntervalSecs) {
    _residualTotemAddDOM(row, col, charges);
    showToast(`💀 Residual Totem planted! ${charges} charges, fires in 3s then every ${fireIntervalSecs}s.`);
    Audio_Manager.playSFX('residualSummon');

    window._residualTotem = { row, col, radius, charges, fireIntervalSecs, timeout: null };

    // First shot fires after 3 seconds, then every fireIntervalSecs
    window._residualTotem.timeout = setTimeout(() => {
        _residualTotemShoot();
    }, 3000);
}


function _residualTotemShoot() {
    const totem = window._residualTotem;
    if (!totem) return;

    const fired = _residualTotemFireOne(totem.row, totem.col, totem.radius);
    totem.charges--;

    // Update DOM charge count
    _residualTotemUpdateDOM(totem.row, totem.col, totem.charges);

    if (fired) {
        showToast(`💀 Residual Beam! 1 cell revealed. (${totem.charges} charge${totem.charges !== 1 ? 's' : ''} left)`);
    } else {
        showToast(`💀 Residual Beam! No cells in range. (${totem.charges} charge${totem.charges !== 1 ? 's' : ''} left)`);
    }

    if (totem.charges <= 0) {
        _clearResidualTotem();
        return;
    }

    // Schedule next shot
    totem.timeout = setTimeout(() => {
        _residualTotemShoot();
    }, totem.fireIntervalSecs * 1000);
}


// Finds the closest unfilled correct cell within radius and reveals exactly 1,
// drawing a beam SVG line from totem to that cell.
function _residualTotemFireOne(row, col, radius) {
    if (!cur) return false;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // Collect all eligible cells, sorted by Manhattan distance
    const candidates = [];
    for (let r = Math.max(0, row - radius); r <= Math.min(rows - 1, row + radius); r++) {
        for (let c = Math.max(0, col - radius); c <= Math.min(cols - 1, col + radius); c++) {
            if (r === row && c === col) continue;
            if (sol[r][c] === 1 && !revealedGrid[r][c] && userGrid[r][c] !== 1) {
                candidates.push({ r, c, dist: Math.abs(r - row) + Math.abs(c - col) });
            }
        }
    }
    if (candidates.length === 0) return false;

    // Pick the nearest one
    candidates.sort((a, b) => a.dist - b.dist);
    const { r, c } = candidates[0];

    // Draw beam first, then reveal
    _residualDrawBeam(row, col, r, c, () => {
        revealedGrid[r][c] = true;
        userGrid[r][c] = 1;
        renderCell(r, c);
        updClues(r, c);
        trackAchStat('tilesRevealed', 1);
        if (ptHasSkill('adjacency_matrix')) _adjacencyMatrixRefreshAll();
        checkWin();
    });

    return true;
}


// Draws an SVG beam line from totem cell to target cell, then fades out
function _residualDrawBeam(fromRow, fromCol, toRow, toCol, onComplete) {
    Audio_Manager.playSFX('residualReveal');
    const fromEl = document.getElementById(`g-${fromRow}-${fromCol}`);
    const toEl = document.getElementById(`g-${toRow}-${toCol}`);
    if (!fromEl || !toEl) { onComplete(); return; }

    const fr = fromEl.getBoundingClientRect();
    const tr = toEl.getBoundingClientRect();

    const x1 = fr.left + fr.width / 2;
    const y1 = fr.top + fr.height / 2;
    const x2 = tr.left + tr.width / 2;
    const y2 = tr.top + tr.height / 2;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        pointer-events: none;
        z-index: 9000;
        overflow: visible;
    `;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', x2); line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#bb8fce');
    line.setAttribute('stroke-width', '30');
    line.setAttribute('stroke-linecap', 'round');
    line.style.filter = 'drop-shadow(0 0 4px #8e44ad)';

    svg.appendChild(line);
    document.body.appendChild(svg);

    // Animate: draw in, pause, fade out
    let opacity = 0.04;
    const fadeOut = () => {
        opacity -= 0.07;
        svg.style.opacity = opacity;
        if (opacity > 0) {
            requestAnimationFrame(fadeOut);
        } else {
            svg.remove();
        }
    };

    // Reveal cell after a short travel delay, then fade beam
    setTimeout(() => {
        onComplete();
        setTimeout(fadeOut, 650);
    }, 350);
}


// Adds the skull totem overlay to the cell
function _residualTotemAddDOM(row, col, charges) {
    const el = document.getElementById(`g-${row}-${col}`);
    if (!el) return;
    el.classList.add('residual-totem');

    const marker = document.createElement('span');
    marker.className = 'residual-totem-icon';
    marker.id = 'residual-totem-marker';
    marker.textContent = '💀';
    // charge badge
    const badge = document.createElement('span');
    badge.className = 'residual-totem-badge';
    badge.id = 'residual-totem-badge';
    badge.textContent = charges;
    marker.appendChild(badge);

    el.appendChild(marker);
}

function _residualTotemUpdateDOM(row, col, charges) {
    const badge = document.getElementById('residual-totem-badge');
    if (badge) badge.textContent = charges;
    const el = document.getElementById(`g-${row}-${col}`);
    if (el) el.setAttribute('title', `💀 Residual Totem (${charges} charges)`);
}


function _clearResidualTotem() {
    if (!window._residualTotem) return;
    const { row, col, timeout } = window._residualTotem;
    if (timeout) clearTimeout(timeout);

    const el = document.getElementById(`g-${row}-${col}`);
    if (el) {
        el.classList.remove('residual-totem');
        el.removeAttribute('title');
        const marker = document.getElementById('residual-totem-marker');
        if (marker) marker.remove();
        renderCell(row, col);
        Audio_Manager.playSFX('residualDespawn');
    }

    window._residualTotem = null;
}


function resetRecursionistState() {
    _clearResidualTotem();
    _cancelDegreesOfFreedom(true); // silent cancel on level start
}


// ── DEGREES OF FREEDOM ────────────────────────────────────────────────────

function _executeDegreesOfFreedom(row, col, effect) {
    const { correctCount, recoverPct } = effect;

    const mistakes = _getMistakeCells();
    if (mistakes.length === 0) {
        showToast('💀 No mistake cells to correct!');
        // Refund cooldown
        const cd = cooldownState['active4'];
        if (cd.interval) { clearInterval(cd.interval); cd.interval = null; }
        cd.remaining = 0;
        buildClassHUD();
        return;
    }

    window._dofSession = { correctCount, recoverPct, picked: [] };

    // Show penalty overlay numbers + pick highlights on all mistake cells
    mistakes.forEach(({ r, c }) => {
        const el = document.getElementById(`g-${r}-${c}`);
        if (!el) return;
        el.classList.add('dof-pick-target');

        const pen = _getMistakePenalty(r, c);
        const overlay = document.createElement('span');
        overlay.className = 'dof-penalty-badge';
        overlay.id = `dof-badge-${r}-${c}`;
        overlay.textContent = pen > 0 ? `${pen}s` : '0s';
        el.appendChild(overlay);
    });

    const maxStr = correctCount === 1 ? '1 mistake cell' : `up to ${correctCount} mistake cells`;
    showToast(`💀 Degrees of Freedom — click ${maxStr} to correct. Esc to cancel.`);

    window._dofEscListener = (e) => {
        if (e.key === 'Escape') _cancelDegreesOfFreedom(false);
    };
    document.addEventListener('keydown', window._dofEscListener);
}


// Returns true if it consumed the click (so ac() should return early)
function _dofHandleClick(row, col) {
    if (!window._dofSession) return false;

    const session = window._dofSession;

    // Only accept clicks on mistake cells that haven't been picked yet
    if (!wrongGrid[row][col]) return false;
    if (session.picked.find(p => p.r === row && p.c === col)) return true; // ignore re-clicks

    session.picked.push({ r: row, c: col });

    // Visual: move from target → selected
    const el = document.getElementById(`g-${row}-${col}`);
    if (el) {
        el.classList.remove('dof-pick-target');
        el.classList.add('dof-pick-selected');
    }

    const remaining = session.correctCount - session.picked.length;
    if (remaining > 0) {
        showToast(`💀 Selected ${session.picked.length}/${session.correctCount}. Click ${remaining} more — or Esc to cancel.`);
    }

    if (session.picked.length >= session.correctCount) {
        _confirmDegreesOfFreedom();
    }

    return true;
}

function _confirmDegreesOfFreedom() {
    if (!window._dofSession) return;
    const { picked, recoverPct } = window._dofSession;

    _cleanupDofSession();

    if (picked.length === 0) {
        showToast('💀 No cells selected.');
        return;
    }

    let totalRecovered = 0;

    // Calculate recovery amounts first (before consuming log entries)
    const pickedData = picked.map(({ r, c }) => {
        const pen = _consumeMistakePenalty(r, c);
        const recovered = Math.round(pen * recoverPct);
        totalRecovered += recovered;
        return { r, c, recovered };
    });

    const recoverPctDisplay = Math.round(recoverPct * 100);

    // Fire animation on each cell, then apply revert after it burns out
    const FIRE_DURATION = 3200; // ms the fire burns before cell changes state

    pickedData.forEach(({ r, c }) => {
        _dofSpawnFire(r, c, FIRE_DURATION, () => {
            wrongGrid[r][c] = false;
            userGrid[r][c] = 0;
            _applyDofRevertedStyle(r, c);
        });
    });

    // Apply time recovery immediately (fire is cosmetic)
    if (totalRecovered > 0) {
        timerSecs = Math.min(timerSecs + totalRecovered, 3600);
        updTimer();
    }

    showToast(`💀 Degrees of Freedom! ${picked.length} cell(s) corrected. +${totalRecovered}s recovered (${recoverPctDisplay}%).`);
    Audio_Manager.playSFX('arcaneReveal')
    Audio_Manager.playSFX('dofBurn');

    setTimeout(() => {
        if (ptHasSkill('adjacency_matrix')) _adjacencyMatrixRefreshAll();
        checkWin();
        buildClassHUD();
    }, FIRE_DURATION + 100);
}


// Spawns a purple burning fire particle effect on a cell for durationMs,
// then calls onComplete when the fire dies out.



function _dofSpawnFire(row, col, durationMs, onComplete) {
    const el = document.getElementById(`g-${row}-${col}`);
    if (!el) { onComplete(); return; }

    const rect = el.getBoundingClientRect();
    const cellSize = rect.width;

    // Container sits over the cell and extends upward like a real flame
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        left: ${rect.left - cellSize * 0.5}px;
        top: ${rect.top - cellSize * 2.5}px;
        width: ${rect.width * 2}px;
        height: ${rect.height * 3.6}px;
        pointer-events: none;
        z-index: 8000;
        overflow: visible;
    `;
    document.body.appendChild(container);

    const W = rect.width * 2;
    const H = rect.height * 3.6;

    // ── SVG FLAME SHAPE ───────────────────────────────────────────────
    // A teardrop / flame silhouette drawn as an SVG path,
    // animated with a morphing filter (feTurbulence) to wobble organically.
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.style.cssText = `
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
    `;

    // ── DEFS: turbulence warp filter + gradient fills ──────────────────
    const defs = document.createElementNS(svgNS, 'defs');

    // Displacement filter — makes the flame edge ripple
    const filter = document.createElementNS(svgNS, 'filter');
    filter.setAttribute('id', 'flame-warp');
    filter.setAttribute('x', '-30%'); filter.setAttribute('y', '-30%');
    filter.setAttribute('width', '160%'); filter.setAttribute('height', '160%');

    const turb = document.createElementNS(svgNS, 'feTurbulence');
    turb.setAttribute('type', 'turbulence');
    turb.setAttribute('baseFrequency', '0.035 0.06');
    turb.setAttribute('numOctaves', '3');
    turb.setAttribute('seed', '2');
    turb.setAttribute('result', 'noise');
    turb.id = `ft-${row}-${col}`;

    const disp = document.createElementNS(svgNS, 'feDisplacementMap');
    disp.setAttribute('in', 'SourceGraphic');
    disp.setAttribute('in2', 'noise');
    disp.setAttribute('scale', '18');
    disp.setAttribute('xChannelSelector', 'R');
    disp.setAttribute('yChannelSelector', 'G');

    filter.appendChild(turb);
    filter.appendChild(disp);

    // Outer glow filter
    const glowFilter = document.createElementNS(svgNS, 'filter');
    glowFilter.setAttribute('id', 'flame-glow');
    glowFilter.setAttribute('x', '-40%'); glowFilter.setAttribute('y', '-40%');
    glowFilter.setAttribute('width', '180%'); glowFilter.setAttribute('height', '180%');
    const feGlow = document.createElementNS(svgNS, 'feGaussianBlur');
    feGlow.setAttribute('stdDeviation', '6');
    feGlow.setAttribute('result', 'blur');
    const feMerge = document.createElementNS(svgNS, 'feMerge');
    const feMergeNode1 = document.createElementNS(svgNS, 'feMergeNode');
    feMergeNode1.setAttribute('in', 'blur');
    const feMergeNode2 = document.createElementNS(svgNS, 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    glowFilter.appendChild(feGlow);
    glowFilter.appendChild(feMerge);

    // Gradient: dark purple base → bright violet mid → white-pink tip
    function makeGrad(id, stops) {
        const g = document.createElementNS(svgNS, 'linearGradient');
        g.setAttribute('id', id);
        g.setAttribute('x1', '0'); g.setAttribute('y1', '1');
        g.setAttribute('x2', '0'); g.setAttribute('y2', '0');
        stops.forEach(([offset, color, opacity]) => {
            const s = document.createElementNS(svgNS, 'stop');
            s.setAttribute('offset', offset);
            s.setAttribute('stop-color', color);
            s.setAttribute('stop-opacity', opacity ?? 1);
            g.appendChild(s);
        });
        return g;
    }

    const gradOuter = makeGrad(`fg-outer-${row}-${col}`, [
        ['0%', '#2d004d', 1],
        ['30%', '#6b0fa0', 1],
        ['60%', '#a020d0', 1],
        ['85%', '#cc66ff', 0.85],
        ['100%', '#f0c0ff', 0],
    ]);
    const gradInner = makeGrad(`fg-inner-${row}-${col}`, [
        ['0%', '#4a0070', 1],
        ['40%', '#9b34cc', 1],
        ['75%', '#e080ff', 0.9],
        ['100%', '#ffffff', 0],
    ]);
    const gradCore = makeGrad(`fg-core-${row}-${col}`, [
        ['0%', '#7700bb', 1],
        ['50%', '#dd88ff', 1],
        ['100%', '#ffffff', 0],
    ]);

    defs.appendChild(filter);
    defs.appendChild(glowFilter);
    defs.appendChild(gradOuter);
    defs.appendChild(gradInner);
    defs.appendChild(gradCore);
    svg.appendChild(defs);

    // ── FLAME PATHS ────────────────────────────────────────────────────
    // Three nested flame shapes: outer body, inner flame, hot core.
    // Each is a teardrop-like cubic bezier path, scaled differently.

    function makeFlame(scaleX, scaleY, yShift, gradId, opacity, filterRef) {
        // Normalised flame path in a 0–100 × 0–200 box then scaled
        const bx = W / 2;   // base centre x
        const by = H;        // base y (bottom of container)
        const hw = (W * 0.42) * scaleX;   // half-width at base
        const ht = H * scaleY;             // full height

        const path = document.createElementNS(svgNS, 'path');
        // Teardrop: rise from base corners, curve inward to narrow tip
        const d = [
            `M ${bx} ${by + yShift}`,
            `C ${bx - hw} ${by + yShift}, ${bx - hw * 1.1} ${by - ht * 0.3 + yShift}, ${bx - hw * 0.55} ${by - ht * 0.6 + yShift}`,
            `C ${bx - hw * 0.25} ${by - ht * 0.82 + yShift}, ${bx} ${by - ht + yShift}, ${bx} ${by - ht + yShift}`,
            `C ${bx} ${by - ht + yShift}, ${bx + hw * 0.25} ${by - ht * 0.82 + yShift}, ${bx + hw * 0.55} ${by - ht * 0.6 + yShift}`,
            `C ${bx + hw * 1.1} ${by - ht * 0.3 + yShift}, ${bx + hw} ${by + yShift}, ${bx} ${by + yShift}`,
            'Z'
        ].join(' ');

        path.setAttribute('d', d);
        path.setAttribute('fill', `url(#${gradId})`);
        path.setAttribute('opacity', opacity);
        if (filterRef) path.setAttribute('filter', `url(#${filterRef})`);
        return path;
    }

    // Outer glow blob (blurred, no warp)
    const glowBlob = makeFlame(1.1, 0.92, 2, `fg-outer-${row}-${col}`, 0.55, 'flame-glow');
    // Main flame body (warped)
    const outerFlame = makeFlame(1.0, 0.88, 0, `fg-outer-${row}-${col}`, 0.92, 'flame-warp');
    // Inner brighter flame (warped, slightly smaller)
    const innerFlame = makeFlame(0.65, 0.72, H * 0.08, `fg-inner-${row}-${col}`, 0.88, 'flame-warp');
    // Hot core (warped, tall and narrow)
    const coreFlame = makeFlame(0.32, 0.58, H * 0.14, `fg-core-${row}-${col}`, 0.80, 'flame-warp');

    svg.appendChild(glowBlob);
    svg.appendChild(outerFlame);
    svg.appendChild(innerFlame);
    svg.appendChild(coreFlame);
    container.appendChild(svg);

    // ── EMBERS (floating sparks) ───────────────────────────────────────
    const EMBER_COUNT = 16;
    const embers = [];
    for (let i = 0; i < EMBER_COUNT; i++) {
        const e = document.createElement('div');
        const sz = 2 + Math.random() * 4;
        e.style.cssText = `
            position: absolute;
            width: ${sz}px; height: ${sz}px;
            border-radius: 50%;
            background: ${['#e0a0ff', '#cc66ff', '#ffffff', '#bb44ee'][Math.floor(Math.random() * 4)]};
            pointer-events: none;
            filter: blur(0.5px);
            opacity: 0;
        `;
        container.appendChild(e);
        embers.push({
            el: e,
            x: W * (0.25 + Math.random() * 0.5),
            y: H * 0.7,
            vx: (Math.random() - 0.5) * 1.2,
            vy: -(1.5 + Math.random() * 2.5),
            life: 0,
            maxLife: 800 + Math.random() * 600,
            delay: Math.random() * 1200,
        });
    }

    // ── ANIMATE ────────────────────────────────────────────────────────
    const startTime = performance.now();
    let animId;
    let turbPhase = 0;

    function globalAlpha(progress) {
        if (progress < 0.12) return progress / 0.12;
        if (progress > 0.90) return 1 - ((progress - 0.90) / 0.10);
        return 1;
    }

    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const gAlpha = globalAlpha(progress);

        // Animate turbulence seed offset to make the flame ripple continuously
        turbPhase += 0.008;
        turb.setAttribute('baseFrequency', `${0.032 + Math.sin(turbPhase) * 0.008} ${0.058 + Math.cos(turbPhase * 0.7) * 0.01}`);

        // Gentle breathing scale on the whole flame
        const breathe = 1 + 0.04 * Math.sin(elapsed / 220);
        svg.style.transform = `scaleX(${breathe})`;
        svg.style.transformOrigin = '50% 100%';
        svg.style.opacity = gAlpha;

        // Embers
        embers.forEach(em => {
            const localElapsed = elapsed - em.delay;
            if (localElapsed < 0) { em.el.style.opacity = 0; return; }

            em.life += 16;
            if (em.life > em.maxLife) {
                // Respawn
                em.x = W * (0.25 + Math.random() * 0.5);
                em.y = H * (0.65 + Math.random() * 0.1);
                em.vx = (Math.random() - 0.5) * 1.2;
                em.vy = -(1.5 + Math.random() * 2.5);
                em.life = 0;
                em.maxLife = 600 + Math.random() * 700;
            }

            em.x += em.vx;
            em.y += em.vy;
            em.vx += (Math.random() - 0.5) * 0.15; // slight drift
            const lifeT = em.life / em.maxLife;
            const alpha = Math.sin(lifeT * Math.PI) * 0.9 * gAlpha;

            em.el.style.left = `${em.x}px`;
            em.el.style.top = `${em.y}px`;
            em.el.style.opacity = Math.max(0, alpha);
        });

        if (progress < 1) {
            animId = requestAnimationFrame(tick);
        } else {
            cancelAnimationFrame(animId);
            container.remove();
            onComplete();
        }
    }

    animId = requestAnimationFrame(tick);
}






/* Old animation for fire

function _dofSpawnFire(row, col, durationMs, onComplete) {
    const el = document.getElementById(`g-${row}-${col}`);
    if (!el) { onComplete(); return; }

    const rect = el.getBoundingClientRect();
    const cellSize = rect.width;

    // Cover the cell plus some overflow above it
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        left: ${rect.left - cellSize * 0.3}px;
        top: ${rect.top - cellSize * 1.2}px;
        width: ${rect.width * 1.6}px;
        height: ${rect.height * 2.4}px;
        pointer-events: none;
        z-index: 8000;
        overflow: visible;
    `;
    document.body.appendChild(container);

    const containerW = rect.width * 1.6;
    const containerH = rect.height * 2.4;

    // ── PARTICLE SYSTEM ───────────────────────────────────────────────
    // Three layers: ember base (wide, slow), core flame (tall, bright),
    // and wisp tips (narrow, fast, reach high).
    const LAYERS = [
        // embers — wide base glow
        { count: 14, minSize: 7, maxSize: 14, minRise: 0.25, maxRise: 0.5, minDur: 900, maxDur: 1400, spread: 0.85, yStart: 0.85, wobble: 18, colors: ['#4a0080', '#6c0fa0', '#7d1db5', '#5b0d94'], blur: 2.5, opacityPeak: 0.75 },
        // core flames — main body
        { count: 22, minSize: 8, maxSize: 18, minRise: 0.55, maxRise: 0.85, minDur: 600, maxDur: 1000, spread: 0.65, yStart: 0.90, wobble: 12, colors: ['#9b34cc', '#b44de8', '#cc66ff', '#d97eff', '#e8aaff'], blur: 1.5, opacityPeak: 0.90 },
        // wisp tips — tall thin tongues
        { count: 12, minSize: 4, maxSize: 9, minRise: 0.85, maxRise: 1.35, minDur: 450, maxDur: 750, spread: 0.45, yStart: 0.88, wobble: 7, colors: ['#e0b0ff', '#ffffff', '#cc88ff'], blur: 1.0, opacityPeak: 0.70 },
    ];

    const particles = [];

    LAYERS.forEach(layer => {
        for (let i = 0; i < layer.count; i++) {
            const size = layer.minSize + Math.random() * (layer.maxSize - layer.minSize);
            const dur = layer.minDur + Math.random() * (layer.maxDur - layer.minDur);
            const rise = containerH * (layer.minRise + Math.random() * (layer.maxRise - layer.minRise));
            const startX = containerW * (0.5 - layer.spread / 2 + Math.random() * layer.spread);
            const startY = containerH * (layer.yStart + (Math.random() - 0.5) * 0.06);
            const delay = Math.random() * (durationMs * 0.35);
            const color = layer.colors[Math.floor(Math.random() * layer.colors.length)];
            const wobble = (Math.random() - 0.5) * 2 * layer.wobble;
            const phaseOffset = Math.random() * Math.PI * 2;

            const p = document.createElement('div');
            p.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size * 2.2}px;
                left: ${startX - size / 2}px;
                top: ${startY}px;
                background: radial-gradient(ellipse at 50% 80%, ${color} 0%, transparent 75%);
                border-radius: 50% 50% 40% 40%;
                opacity: 0;
                filter: blur(${layer.blur}px);
                transform-origin: 50% 100%;
                pointer-events: none;
            `;
            container.appendChild(p);
            particles.push({ el: p, startX, startY, size, dur, rise, delay, color, wobble, phaseOffset, opacityPeak: layer.opacityPeak });
        }
    });

    // ── GLOW BEHIND THE CELL ──────────────────────────────────────────
    const glow = document.createElement('div');
    glow.style.cssText = `
        position: absolute;
        left: ${containerW * 0.1}px;
        top: ${containerH * 0.6}px;
        width: ${containerW * 0.8}px;
        height: ${containerH * 0.35}px;
        background: radial-gradient(ellipse, rgba(140,30,210,0.55) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        filter: blur(4px);
    `;
    container.appendChild(glow);

    // ── ANIMATION LOOP ────────────────────────────────────────────────
    const startTime = performance.now();
    let animId;

    // Fade-in over first 15%, hold, fade-out over last 25%
    function globalAlpha(progress) {
        if (progress < 0.15) return progress / 0.15;
        if (progress > 0.75) return 1 - ((progress - 0.75) / 0.25);
        return 1;
    }

    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const gAlpha = globalAlpha(progress);

        // Pulse the base glow
        const glowPulse = 0.4 + 0.25 * Math.sin(elapsed / 180);
        glow.style.opacity = gAlpha * glowPulse;

        particles.forEach(p => {
            const local = elapsed - p.delay;
            if (local < 0) { p.el.style.opacity = 0; return; }

            const cycle = local % p.dur;
            const t = cycle / p.dur; // 0 → 1

            // Smooth bell curve for rise + fade
            const riseT = Math.sin(t * Math.PI);
            // Wobble = sinusoidal horizontal sway
            const sway = Math.sin(t * Math.PI * 2.5 + p.phaseOffset) * p.wobble;
            // Slight taper as flame rises
            const scaleX = 1 - t * 0.35;
            const scaleY = 0.7 + riseT * 0.6;

            const x = p.startX - p.size / 2 + sway;
            const y = p.startY - p.rise * riseT;

            p.el.style.left = `${x}px`;
            p.el.style.top = `${y}px`;
            p.el.style.opacity = Math.max(0, riseT * p.opacityPeak * gAlpha);
            p.el.style.transform = `scaleX(${scaleX}) scaleY(${scaleY})`;
        });

        if (progress < 1) {
            animId = requestAnimationFrame(tick);
        } else {
            cancelAnimationFrame(animId);
            container.remove();
            onComplete();
        }
    }

    animId = requestAnimationFrame(tick);
}


*/


// Applies a visual "reverted by Degrees of Freedom" overlay to a cell.
// The cell is empty (userGrid=0, wrongGrid=false) but gets a faint purple ghost marker.
function _applyDofRevertedStyle(r, c) {
    renderCell(r, c); // first reset to clean state

    const el = document.getElementById(`g-${r}-${c}`);
    if (!el) return;
    el.classList.add('dof-reverted');

    // Remove the reverted style if the player manually fills the cell later
    // We do this by observing class changes — but simpler: just let renderCell clear it.
    // Since renderCell removes all classes, we track reverted cells so we can skip the cleanup.
    if (!window._dofRevertedCells) window._dofRevertedCells = new Set();
    window._dofRevertedCells.add(`${r}-${c}`);
}


function _cancelDegreesOfFreedom(silent) {
    _cleanupDofSession();
    if (!silent) {
        showToast('💀 Degrees of Freedom cancelled.');
        // Refund cooldown
        const cd = cooldownState['active4'];
        if (cd.interval) { clearInterval(cd.interval); cd.interval = null; }
        cd.remaining = 0;
        buildClassHUD();
    }
}


function _cleanupDofSession() {
    document.querySelectorAll('.dof-pick-target, .dof-pick-selected').forEach(el => {
        el.classList.remove('dof-pick-target', 'dof-pick-selected');
    });
    document.querySelectorAll('[id^="dof-badge-"]').forEach(el => el.remove());

    if (window._dofEscListener) {
        document.removeEventListener('keydown', window._dofEscListener);
        window._dofEscListener = null;
    }
    window._dofSession = null;
}



