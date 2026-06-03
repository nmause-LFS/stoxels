//------------------------------------------------------------------------
//--------------------ASCENDENCY SKILL IMPLEMENTATIONS--------------------
//------------------------------MARKOVIAN CLASS---------------------------
//------------------------------------------------------------------------

// ─── ACTIVE 1: STATE ROLLBACK ─────────────────────────────────────────
//
// Records snapshots of the puzzle state every second while a level is
// running. When activated, rolls the puzzle back to the snapshot taken
// windowSeconds ago, rewinding:
//   - userGrid (fills and marks)
//   - wrongGrid (mistake flags)
//   - revealedGrid (item/class reveals)
//   - mistakeCount
//   - timerSecs (adds back rewindSeconds)
//
// Snapshots are stored in window._markovSnapshots: a circular buffer of
// { userGrid, wrongGrid, revealedGrid, mistakeCount, ts } objects, one
// per second. The buffer is initialized in _markovSnapshotInit() called
// from startTimer() / startLevel().
//
// Rank 3 bonus: clearOldMistakes — also wipes wrongGrid cells that existed
// BEFORE the rollback window (pre-existing mistakes are forgiven).
//------------------------------------------------------------------------

// ── SNAPSHOT SYSTEM ───────────────────────────────────────────────────

const MARKOV_SNAPSHOT_BUFFER = 35; // keep up to 35 seconds of history

function _markovSnapshotInit() {
    window._markovSnapshots = [];
}

// Called once per second from the timer tick (_markovSnapshotTick is
// hooked into timer.js via the existing _degreesOfFreedomTick pattern).
function _markovSnapshotTick() {
    if (!cur || dead) return;

    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // Deep-copy the three grids (flat typed arrays are fastest but plain
    // arrays work fine for the sizes used in this game).
    const ugCopy = userGrid.map(row => [...row]);
    const wgCopy = wrongGrid.map(row => [...row]);
    const rgCopy = revealedGrid.map(row => [...row]);

    window._markovSnapshots.push({
        userGrid: ugCopy,
        wrongGrid: wgCopy,
        revealedGrid: rgCopy,
        mistakeCount: mistakeCount,
        timerSecs: timerSecs,
        ts: Date.now(),
    });

    // Trim to buffer size
    if (window._markovSnapshots.length > MARKOV_SNAPSHOT_BUFFER) {
        window._markovSnapshots.shift();
    }
}


// ── ROLLBACK EXECUTION ────────────────────────────────────────────────

function _executeStateRollback(windowSeconds, rewindSeconds, clearOldMistakes) {
    if (!cur) return;

    const snapshots = window._markovSnapshots || [];
    if (snapshots.length === 0) {
        showToast(LANG === 'de'
            ? '⏳ Keine Zustandshistorie vorhanden!'
            : '⏳ No state history available!');
        _rollbackCancel(true);
        return;
    }

    // Find the snapshot closest to windowSeconds ago
    const targetTs = Date.now() - windowSeconds * 1000;
    let best = snapshots[0];
    let bestDiff = Infinity;
    for (const snap of snapshots) {
        const diff = Math.abs(snap.ts - targetTs);
        if (diff < bestDiff) { bestDiff = diff; best = snap; }
    }

    // Count how many mistake cells exist before the rollback (for rank 3 bonus)
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // Collect currently wrong cells BEFORE the rollback window
    // (i.e. cells that were wrong in the target snapshot too — pre-existing mistakes)
    const preExistingWrong = [];
    if (clearOldMistakes) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (best.wrongGrid[r][c]) preExistingWrong.push({ r, c });
            }
        }
    }

    // Apply the snapshot
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            userGrid[r][c] = best.userGrid[r][c];
            wrongGrid[r][c] = best.wrongGrid[r][c];
            revealedGrid[r][c] = best.revealedGrid[r][c];
        }
    }
    mistakeCount = best.mistakeCount;

    // Rank 3: also clear pre-existing mistake cells
    if (clearOldMistakes && preExistingWrong.length > 0) {
        preExistingWrong.forEach(({ r, c }) => {
            wrongGrid[r][c] = false;
            if (userGrid[r][c] !== 1 && !revealedGrid[r][c]) {
                userGrid[r][c] = 0;
            }
            questStat_mistakesRemoved(1);   // Make these removed mistakes count towards the Remove 50 mistakes quest
        });
        showToast(`⏳ ${preExistingWrong.length} ${LANG === 'de'
            ? 'alte Fehler ebenfalls korrigiert!'
            : 'pre-existing mistake(s) also cleared!'}`);

    }

    if (timerSecs <= 10) {
        trackAchStat('rollbackSaves'); 
        showToast('⏳ State Rollback: Cheat Death!');
    }


    // Restore the timer to what it actually was at the snapshot moment,
    // then add the rank bonus on top (rewindSeconds is the extra gift, not
    // the sole source of time recovery).
    timerSecs = Math.min(best.timerSecs + rewindSeconds, 3600);

    // Re-render every cell
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            renderCell(r, c);
        }
    }

    // Refresh all row/col clues
    for (let r = 0; r < rows; r++) updClues(r, 0);
    for (let c = 0; c < cols; c++) updClues(0, c);

    // Update mistake counter display
    const mc = document.getElementById('mistake-counter');
    if (mc) mc.textContent = `${LANG === 'de' ? 'Fehler' : 'Mistakes'}: ${mistakeCount}`;

    updTimer();

    if (ptHasSkill('adjacency_matrix')) _adjacencyMatrixRefreshAll();

    // Clear DoF reverted cell tracking since grid state changed entirely
    window._dofRevertedCells = new Set();
    window._mistakeLog = [];

    // Flush stale snapshots (everything after the applied snapshot is now invalid)
    window._markovSnapshots = [];

    _rollbackPlayVFX(rows, cols);

    const approxSecs = Math.round((Date.now() - best.ts) / 1000);
    showToast(`⏳ ${LANG === 'de'
        ? `Zustandsrücksetzer! ${approxSecs}s zurückgespult. +${rewindSeconds}s Zeit.`
        : `State Rollback! Rewound ~${approxSecs}s. +${rewindSeconds}s added.`}`);

    Audio_Manager.playSFX('stateReversal'); 
    trackAchStat('skillRollbackUsed');

    checkWin();
}

function _rollbackCancel(silent = false) {
    _setAbilityMode(false);
    STATE.classActiveChoice = 'active3';

    const cd = cooldownState['active3'];
    if (cd && cd.interval) { clearInterval(cd.interval); cd.interval = null; }
    if (cd) cd.remaining = 0;

    buildClassHUD();
    if (!silent) showToast(LANG === 'de' ? '⏳ Abgebrochen.' : '⏳ Cancelled.');
}


function _rollbackPlayVFX(rows, cols) {

    const DURATION = 2200;

    // ── Full-screen canvas overlay ────────────────────────────────
    const cvs = document.createElement('canvas');
    cvs.style.cssText = `
        position: fixed; inset: 0;
        width: 100vw; height: 100vh;
        pointer-events: none;
        z-index: 7000;
    `;
    document.body.appendChild(cvs);
    const ctx = cvs.getContext('2d');

    const resize = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const W = () => cvs.width, H = () => cvs.height;
    const startTime = performance.now();

    const bolts = [];
    const particles = [];
    let hourglassAngle = 0;

    const BOLT_HUES = [
        'rgba(140,80,255,', 'rgba(80,140,255,',
        'rgba(80,220,200,', 'rgba(200,100,255,',
    ];

    function spawnBolt() {
        const x1 = W() * 0.05 + Math.random() * W() * 0.9;
        const y1 = Math.random() * H();
        const segs = [];
        let cx = x1, cy = y1;
        const steps = 5 + Math.floor(Math.random() * 6);
        for (let i = 0; i < steps; i++) {
            cx += (Math.random() - 0.5) * 100;
            cy += 18 + Math.random() * 40;
            segs.push({ x: cx, y: cy });
        }
        const col = BOLT_HUES[Math.floor(Math.random() * BOLT_HUES.length)];
        bolts.push({ x1, y1, segs, life: 1, maxLife: 18 + Math.random() * 18, col });
    }

    let animId;
    function tick(now) {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / DURATION, 1);
        const fade = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1;

        const w = W(), h = H();
        ctx.clearRect(0, 0, w, h);

        // Dark tint
        ctx.fillStyle = `rgba(10,5,30,${0.82 * fade})`;
        ctx.fillRect(0, 0, w, h);

        // Grid dot pulse
        for (let r = 0; r < h; r += 18) {
            for (let c = 0; c < w; c += 18) {
                const wave = Math.sin((c + r) * 0.04 - elapsed * 0.003) * 0.5 + 0.5;
                ctx.fillStyle = `rgba(100,60,200,${wave * 0.06 * fade})`;
                ctx.fillRect(c, r, 2, 2);
            }
        }

        // Sweeping purple wave
        const waveX = (elapsed % 1000) / 1000 * (w + 200) - 100;
        const wg = ctx.createLinearGradient(waveX - 70, 0, waveX + 70, 0);
        wg.addColorStop(0, 'rgba(130,50,220,0)');
        wg.addColorStop(0.5, `rgba(130,50,220,${0.16 * fade})`);
        wg.addColorStop(1, 'rgba(130,50,220,0)');
        ctx.fillStyle = wg;
        ctx.fillRect(0, 0, w, h);

        // Spawn bolts
        if (Math.random() < 0.4) spawnBolt();

        // Draw chronobolts
        for (let i = bolts.length - 1; i >= 0; i--) {
            const b = bolts[i];
            b.life -= 1 / b.maxLife;
            if (b.life <= 0) { bolts.splice(i, 1); continue; }
            const a = b.life * fade;

            ctx.save();
            ctx.shadowColor = b.col + (a * 0.7) + ')';
            ctx.shadowBlur = 10;
            ctx.strokeStyle = b.col + a + ')';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(b.x1, b.y1);
            b.segs.forEach(s => ctx.lineTo(s.x, s.y));
            ctx.stroke();

            // Bright white core
            ctx.shadowBlur = 0;
            ctx.strokeStyle = `rgba(230,210,255,${a * 0.55})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(b.x1, b.y1);
            b.segs.forEach(s => ctx.lineTo(s.x, s.y));
            ctx.stroke();
            ctx.restore();
        }

        // ── Hourglass ──────────────────────────────────────────────
        const cx2 = w / 2, cy2 = h / 2;
        hourglassAngle = Math.PI * Math.min(t * 1.25, 1);

        // Glow ring behind it
        const hg = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, 120);
        hg.addColorStop(0, `rgba(150,80,255,${0.4 * fade})`);
        hg.addColorStop(0.5, `rgba(80,40,180,${0.18 * fade})`);
        hg.addColorStop(1, 'rgba(80,40,180,0)');
        ctx.fillStyle = hg;
        ctx.beginPath(); ctx.arc(cx2, cy2, 120, 0, Math.PI * 2); ctx.fill();

        ctx.save();
        ctx.translate(cx2, cy2);
        ctx.rotate(hourglassAngle);
        ctx.font = `100px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(180,100,255,0.95)';
        ctx.shadowBlur = 28;
        ctx.fillStyle = `rgba(255,255,255,${0.93 * fade})`;
        ctx.fillText('⏳', 0, 0);
        ctx.shadowBlur = 0;
        ctx.restore();

        // Sand/time particles drifting off the hourglass
        if (Math.random() < 0.5) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 20 + Math.random() * 35;
            const PCOLS = ['rgba(200,140,255,', 'rgba(140,100,255,', 'rgba(100,160,255,'];
            particles.push({
                x: cx2 + Math.cos(angle) * dist, y: cy2 + Math.sin(angle) * dist,
                vx: (Math.random() - 0.5) * 1.6, vy: -1 - Math.random() * 2.2,
                life: 1, col: PCOLS[Math.floor(Math.random() * PCOLS.length)],
            });
        }
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx; p.y += p.vy; p.vy += 0.07; p.life -= 0.025;
            if (p.life <= 0) { particles.splice(i, 1); continue; }
            ctx.fillStyle = p.col + (p.life * 0.85 * fade) + ')';
            ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2); ctx.fill();
        }

        if (t < 1) {
            animId = requestAnimationFrame(tick);
        } else {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
            cvs.remove();
        }
    }
    animId = requestAnimationFrame(tick);

    // Cell wave (existing behaviour — keep it)
    if (!cur) return;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const el = document.getElementById(`g-${r}-${c}`);
            if (el) {
                const delay = (r + c) * 18;
                setTimeout(() => {
                    el.classList.add('rollback-flash');
                    setTimeout(() => el.classList.remove('rollback-flash'), 500);
                }, delay);
            }
        }
    }
}







// ─── ACTIVE 2: TRANSITION MATRIX ──────────────────────────────────────
//
// Activates a timed mode where each correct fill has a cascadeChance of
// also revealing a random unfilled correct neighbour. At rank 3 the
// cascaded fill can itself cascade once (maxDepth 2).
//
// State: window._transitionMatrixActive  { endTime, cascadeChance, maxDepth, timeout }
//
// The cascade is triggered from the onCorrectFill hook in class-abilities.js.
//------------------------------------------------------------------------

function _executeTransitionMatrix(durationMs, cascadeChance, maxDepth) {
    _clearTransitionMatrix(); // cancel any existing session

    window._transitionMatrixActive = {
        cascadeChance,
        maxDepth,
        endTime: Date.now() + durationMs,
        timeout: null,
    };

    const secs = Math.ceil(durationMs / 1000);

    showToast(LANG === 'de'
        ? `⏳ Übergangsmatrix aktiviert! ${secs}s — ${Math.round(cascadeChance * 100)}% Kettenreaktion.`
        : `⏳ Transition Matrix active! ${secs}s — ${Math.round(cascadeChance * 100)}% cascade chance.`);

    Audio_Manager.playSFX('transitionMatrix');

    trackAchStat('skillTransitionMatrixUsed');

    // ── Start the background overlay ──────────────────────────────
    _transitionMatrixStartOverlay(durationMs);

    _transitionMatrixSpawnBadge(secs);

    let remaining = secs;
    window._transitionMatrixTickInterval = setInterval(() => {
        remaining--;
        _transitionMatrixUpdateBadge(remaining);
        if (remaining <= 0) {
            clearInterval(window._transitionMatrixTickInterval);
            window._transitionMatrixTickInterval = null;
        }
    }, 1000);

    window._transitionMatrixActive.timeout = setTimeout(() => {
        _clearTransitionMatrix(true);
    }, durationMs);
}

function _clearTransitionMatrix(natural = false) {
    if (window._transitionMatrixActive?.timeout) {
        clearTimeout(window._transitionMatrixActive.timeout);
    }
    if (window._transitionMatrixTickInterval) {
        clearInterval(window._transitionMatrixTickInterval);
        window._transitionMatrixTickInterval = null;
    }
    window._transitionMatrixActive = null;
    _transitionMatrixRemoveBadge();

    // ── Tear down overlay if still running ────────────────────────
    const cvs = document.getElementById('tm-canvas-overlay');
    if (cvs) {
        if (cvs._animId) cancelAnimationFrame(cvs._animId);
        cvs.style.transition = 'opacity 0.4s ease-out';
        cvs.style.opacity = '0';
        setTimeout(() => {
            if (cvs._resizeHandler) window.removeEventListener('resize', cvs._resizeHandler);
            cvs.remove();
        }, 450);
    }

    if (natural) {
        showToast(LANG === 'de' ? '⏳ Übergangsmatrix beendet.' : '⏳ Transition Matrix ended.');
        buildClassHUD();
    }
}



function _transitionMatrixStartOverlay(durationMs) {
    // Remove any existing overlay
    document.getElementById('tm-canvas-overlay')?.remove();

    const cvs = document.createElement('canvas');
    cvs.id = 'tm-canvas-overlay';
    cvs.style.cssText = `
        position: fixed; inset: 0;
        width: 100vw; height: 100vh;
        pointer-events: none;
        z-index: 400;
        opacity: 0;
        transition: opacity 0.5s ease-in;
    `;
    document.body.appendChild(cvs);

    const ctx = cvs.getContext('2d');
    const resize = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    cvs._resizeHandler = resize;

    // Fade in
    requestAnimationFrame(() => requestAnimationFrame(() => { cvs.style.opacity = '1'; }));

    const GLYPH = '01アイウエオカキクケコ∑∫∂∇λμπ';
    const W = () => cvs.width, H = () => cvs.height;
    const startTime = performance.now();

    // Build node grid mirroring the puzzle cells
    let nodes = [];
    let chains = [];
    const glyphRain = [];

    function buildNodes() {
        nodes = [];
        if (!cur) return;
        const sol = cur.grid;
        const rows = sol.length, cols = sol[0].length;
        // Map puzzle grid positions onto screen via cell DOM elements
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const el = document.getElementById(`g-${r}-${c}`);
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                nodes.push({
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                    r, c,
                    pulse: Math.random() * Math.PI * 2,
                    active: sol[r][c] === 1 && (window.revealedGrid?.[r]?.[c] || window.userGrid?.[r]?.[c] === 1),
                });
            }
        }

        // Build random chains between nearby nodes
        chains = [];
        const maxDist = 120;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[j].x - nodes[i].x;
                const dy = nodes[j].y - nodes[i].y;
                if (Math.sqrt(dx * dx + dy * dy) < maxDist && Math.random() < 0.18) {
                    chains.push({ a: nodes[i], b: nodes[j], progress: Math.random(), speed: 0.003 + Math.random() * 0.005 });
                }
            }
        }

        // Glyph rain columns
        const cols2 = Math.floor(W() / 22);
        for (let i = glyphRain.length; i < cols2; i++) {
            glyphRain.push({
                x: i * 22 + 11, y: Math.random() * H(),
                speed: 0.7 + Math.random() * 1.6,
                alpha: 0.01 + Math.random() * 0.01,
                len: 4 + Math.floor(Math.random() * 7),
            });
        }
    }
    buildNodes();

    const particles = [];
    let animId;

    function tick(now) {
        const elapsed = now - startTime;
        const t = elapsed / durationMs;
        if (t >= 1) {
            cancelAnimationFrame(animId);
            // Fade out then remove
            cvs.style.transition = 'opacity 0.5s ease-out';
            cvs.style.opacity = '0';
            setTimeout(() => {
                window.removeEventListener('resize', cvs._resizeHandler);
                cvs.remove();
            }, 550);
            return;
        }

        // Also stop if _transitionMatrixActive was cleared externally
        if (!window._transitionMatrixActive) {
            cancelAnimationFrame(animId);
            cvs.style.transition = 'opacity 0.4s ease-out';
            cvs.style.opacity = '0';
            setTimeout(() => {
                window.removeEventListener('resize', cvs._resizeHandler);
                cvs.remove();
            }, 450);
            return;
        }

        const fade = t < 0.08 ? t / 0.08 : t > 0.9 ? (1 - t) / 0.1 : 1;
        const w = W(), h = H();
        ctx.clearRect(0, 0, w, h);

        // Subtle dark tint
        ctx.fillStyle = `rgba(4,12,6,${0.22 * fade})`;
        ctx.fillRect(0, 0, w, h);

        // Glyph rain
        ctx.font = '13px monospace';
        glyphRain.forEach(col => {
            col.y += col.speed;
            if (col.y > h + col.len * 18) col.y = -col.len * 18;
            for (let i = 0; i < col.len; i++) {
                const a = (1 - i / col.len) * col.alpha * fade;
                const green = Math.floor(80 + 100 * (1 - i / col.len));
                ctx.fillStyle = `rgba(20,${green},60,${a})`;
                ctx.fillText(GLYPH[Math.floor(Math.random() * GLYPH.length)], col.x, col.y - i * 16);
            }
            ctx.fillStyle = `rgba(120,255,160,${col.alpha * fade * 1.6})`;
            ctx.fillText(GLYPH[Math.floor(Math.random() * GLYPH.length)], col.x, col.y);
        });

        // Chains
        const t2 = elapsed * 0.001;
        chains.forEach(ch => {
            ch.progress += ch.speed;
            if (ch.progress > 1) ch.progress = 0;

            const dx = ch.b.x - ch.a.x, dy = ch.b.y - ch.a.y;
            ctx.strokeStyle = `rgba(30,180,100,${0.22 * fade})`;
            ctx.lineWidth = 0.7;
            ctx.setLineDash([4, 7]);
            ctx.beginPath(); ctx.moveTo(ch.a.x, ch.a.y); ctx.lineTo(ch.b.x, ch.b.y); ctx.stroke();
            ctx.setLineDash([]);

            // Traveling pulse
            const px = ch.a.x + dx * ch.progress;
            const py = ch.a.y + dy * ch.progress;
            const grad = ctx.createRadialGradient(px, py, 0, px, py, 10);
            grad.addColorStop(0, `rgba(80,255,140,${0.55 * fade})`);
            grad.addColorStop(1, 'rgba(80,255,140,0)');
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.fill();
        });

        // Nodes (only for puzzle cells visible on screen)
        nodes.forEach(n => {
            const pulse = 0.5 + 0.5 * Math.sin(t2 * 2.2 + n.pulse);
            const r = n.active ? 6 + pulse * 3 : 3.5 + pulse;

            if (n.active) {
                const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 20);
                glow.addColorStop(0, `rgba(40,220,110,${0.15 * pulse * fade})`);
                glow.addColorStop(1, 'rgba(40,220,110,0)');
                ctx.fillStyle = glow;
                ctx.beginPath(); ctx.arc(n.x, n.y, 20, 0, Math.PI * 2); ctx.fill();
            }

            ctx.fillStyle = n.active
                ? `rgba(60,230,130,${0.35 * fade})`
                : `rgba(30,110,70,${0.12 * fade})`;
            ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = n.active
                ? `rgba(120,255,170,${0.75 * fade})`
                : `rgba(50,150,90,${0.25 * fade})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
        });

        // Floating cascade particles
        if (Math.random() < 0.15 && nodes.length > 0) {
            const src = nodes[Math.floor(Math.random() * nodes.length)];
            particles.push({ x: src.x, y: src.y, vx: (Math.random() - 0.5) * 1.2, vy: (Math.random() - 0.5) * 1.2, life: 1 });
        }
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx; p.y += p.vy; p.vy += 0.015; p.life -= 0.02;
            if (p.life <= 0) { particles.splice(i, 1); continue; }
            ctx.fillStyle = `rgba(100,255,150,${p.life * 0.65 * fade})`;
            ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
        }

        animId = requestAnimationFrame(tick);
    }
    animId = requestAnimationFrame(tick);
    cvs._animId = animId;
}






// Called from onCorrectFill() when Transition Matrix is active.
// Cascades from (row, col) up to maxDepth levels deep.
function _transitionMatrixCascade(row, col, depth) {
    const tm = window._transitionMatrixActive;
    if (!tm || Date.now() > tm.endTime) {
        _clearTransitionMatrix(true);
        return;
    }
    if (depth <= 0) return;
    if (Math.random() > tm.cascadeChance) return;
    if (!cur) return;

    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // Collect unfilled correct cardinal neighbours
    const neighbours = [];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of dirs) {
        const nr = row + dr, nc = col + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (sol[nr][nc] === 1 && !revealedGrid[nr][nc] && userGrid[nr][nc] !== 1) {
            neighbours.push([nr, nc]);
        }
    }

    if (neighbours.length === 0) return;

    const [nr, nc] = neighbours[Math.floor(Math.random() * neighbours.length)];

    // Reveal the cell
    revealedGrid[nr][nc] = true;
    userGrid[nr][nc] = 1;
    renderCell(nr, nc);
    updClues(nr, nc);
    trackAchStat('tilesRevealed', 1);
    questStat_classRevealUsed(1);
    updateQuestStats('classAbilityUsedThisLevel', {});
    if (ptHasSkill('adjacency_matrix')) _adjacencyMatrixRefreshAll();

    _transitionMatrixCellVFX(nr, nc, row, col);

    showToast(`⏳ ${LANG === 'de' ? 'Übergang! Zelle enthüllt.' : 'Transition! Cell cascaded.'}`);

    // Depth 2 (rank 3): the cascaded cell can itself cascade
    if (depth > 1) {
        setTimeout(() => _transitionMatrixCascade(nr, nc, depth - 1), 250);
        trackAchStat('transitionMatrixCascades');
    }

    Audio_Manager.playSFX('transitionCascade');

    checkWin();
}

// Draws a brief chain-link VFX on the cascaded cell,
// plus an animated green beam from the source cell to the target.
function _transitionMatrixCellVFX(row, col, srcRow, srcCol) {
    // Flash on the destination cell (existing behaviour)
    const el = document.getElementById(`g-${row}-${col}`);
    if (el) {
        el.classList.add('transition-cascade-flash');
        setTimeout(() => el.classList.remove('transition-cascade-flash'), 600);
    }

    // ── Beam from source → target ─────────────────────────────────
    if (srcRow == null || srcCol == null) return;
    const srcEl = document.getElementById(`g-${srcRow}-${srcCol}`);
    const dstEl = document.getElementById(`g-${row}-${col}`);
    if (!srcEl || !dstEl) return;

    const sr = srcEl.getBoundingClientRect();
    const dr = dstEl.getBoundingClientRect();
    const x1 = sr.left + sr.width / 2;
    const y1 = sr.top + sr.height / 2;
    const x2 = dr.left + dr.width / 2;
    const y2 = dr.top + dr.height / 2;

    const DURATION = 1000; // ms — beam lifetime

    const cvs = document.createElement('canvas');
    cvs.style.cssText = `
        position: fixed; inset: 0;
        width: 100vw; height: 100vh;
        pointer-events: none;
        z-index: 6000;
    `;
    document.body.appendChild(cvs);
    const ctx = cvs.getContext('2d');

    const resize = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const startTime = performance.now();
    let animId;

    function tick(now) {
        const t = Math.min((now - startTime) / DURATION, 1);

        // Fade: quick in, slow fade out
        const alpha = t < 0.15 ? t / 0.15 : 1 - ((t - 0.15) / 0.85);

        cvs.width = cvs.width; // clear
        const ctx2 = cvs.getContext('2d');

        // ── Travelling head position along the beam ───────────────
        const headT = Math.min(t / 0.55, 1); // head reaches target at t=0.55
        const hx = x1 + (x2 - x1) * headT;
        const hy = y1 + (y2 - y1) * headT;

        // ── Core beam line (drawn only up to head position) ───────
        const grad = ctx2.createLinearGradient(x1, y1, hx, hy);
        grad.addColorStop(0, `rgba(46,204,113,0)`);
        grad.addColorStop(0.3, `rgba(46,204,113,${0.55 * alpha})`);
        grad.addColorStop(1, `rgba(150,255,180,${0.95 * alpha})`);

        ctx2.save();
        ctx2.strokeStyle = grad;
        ctx2.lineWidth = 2.5;
        ctx2.shadowColor = `rgba(46,204,113,${0.8 * alpha})`;
        ctx2.shadowBlur = 10;
        ctx2.beginPath();
        ctx2.moveTo(x1, y1);
        ctx2.lineTo(hx, hy);
        ctx2.stroke();

        // Bright white core stripe
        ctx2.strokeStyle = `rgba(220,255,235,${0.6 * alpha})`;
        ctx2.lineWidth = 1;
        ctx2.shadowBlur = 0;
        ctx2.beginPath();
        ctx2.moveTo(x1, y1);
        ctx2.lineTo(hx, hy);
        ctx2.stroke();
        ctx2.restore();

        // ── Travelling spark at the head ─────────────────────────
        const sparkR = 5 + 3 * Math.sin(t * Math.PI);
        const sparkGrad = ctx2.createRadialGradient(hx, hy, 0, hx, hy, sparkR * 2.5);
        sparkGrad.addColorStop(0, `rgba(200,255,210,${alpha})`);
        sparkGrad.addColorStop(0.4, `rgba(46,204,113,${0.75 * alpha})`);
        sparkGrad.addColorStop(1, `rgba(46,204,113,0)`);
        ctx2.beginPath();
        ctx2.arc(hx, hy, sparkR * 2.5, 0, Math.PI * 2);
        ctx2.fillStyle = sparkGrad;
        ctx2.fill();

        // ── Destination burst (when head arrives) ─────────────────
        if (headT >= 1) {
            const burstT = (t - 0.55) / 0.45; // 0→1 after head arrives
            const burstAlpha = alpha * (1 - burstT * 0.5);
            const burstR = 6 + burstT * 18;
            const burstGrad = ctx2.createRadialGradient(x2, y2, 0, x2, y2, burstR);
            burstGrad.addColorStop(0, `rgba(180,255,200,${burstAlpha})`);
            burstGrad.addColorStop(0.5, `rgba(46,204,113,${burstAlpha * 0.6})`);
            burstGrad.addColorStop(1, `rgba(46,204,113,0)`);
            ctx2.beginPath();
            ctx2.arc(x2, y2, burstR, 0, Math.PI * 2);
            ctx2.fillStyle = burstGrad;
            ctx2.fill();
        }

        if (t < 1) {
            animId = requestAnimationFrame(tick);
        } else {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
            cvs.remove();
        }
    }

    animId = requestAnimationFrame(tick);
}


// ── HUD BADGE ─────────────────────────────────────────────────────────

function _transitionMatrixSpawnBadge(remainingSecs) {
    _transitionMatrixRemoveBadge();

    if (!document.getElementById('tm-badge-styles')) {
        const s = document.createElement('style');
        s.id = 'tm-badge-styles';
        s.textContent = `
            #transition-matrix-badge {
                display:inline-flex;align-items:center;gap:3px;
                background:rgba(41,128,185,0.18);border:1px solid #2980b9;
                border-radius:5px;padding:2px 6px;
                font-family:var(--PX,monospace);font-size:10px;color:#7fb3d3;
                animation:tm-pulse 1s ease-in-out infinite;white-space:nowrap;
            }
            .tm-icon{font-size:11px;line-height:1;}
            .tm-timer{font-variant-numeric:tabular-nums;letter-spacing:.03em;font-weight:bold;}
            @keyframes tm-pulse{
                0%,100%{box-shadow:0 0 4px 1px rgba(41,128,185,0.4);}
                50%{box-shadow:0 0 10px 3px rgba(41,128,185,0.75);}
            }
            .rollback-flash {
                animation: rollback-wave 0.5s ease-out forwards;
            }
            @keyframes rollback-wave {
                0%   { filter: brightness(2.5) saturate(0.3) hue-rotate(180deg); }
                60%  { filter: brightness(1.4) saturate(1.2) hue-rotate(30deg); }
                100% { filter: brightness(1) saturate(1) hue-rotate(0deg); }
            }
            .transition-cascade-flash {
                animation: cascade-pop 0.6s ease-out forwards;
            }
            @keyframes cascade-pop {
                0%   { filter: brightness(2) saturate(0.5) hue-rotate(200deg); transform: scale(1.15); }
                60%  { filter: brightness(1.3) saturate(1.5); transform: scale(1.05); }
                100% { filter: brightness(1) saturate(1); transform: scale(1); }
            }
        `;
        document.head.appendChild(s);
    }

    const badge = document.createElement('div');
    badge.id = 'transition-matrix-badge';
    badge.innerHTML = `<span class="tm-icon">⏳</span><span class="tm-timer" id="tm-timer-val">${remainingSecs}s</span>`;

    const handle = document.getElementById('class-hud-drag-handle');
    if (handle) handle.appendChild(badge);
    else {
        const panel = document.getElementById('class-hud-panel');
        if (panel) panel.appendChild(badge);
    }
}

function _transitionMatrixUpdateBadge(remainingSecs) {
    const el = document.getElementById('tm-timer-val');
    if (el) el.textContent = `${Math.max(0, remainingSecs)}s`;
}

function _transitionMatrixRemoveBadge() {
    document.getElementById('transition-matrix-badge')?.remove();
}


// ── RESET ─────────────────────────────────────────────────────────────

function resetMarkovianState() {
    _markovSnapshotInit();
    _clearTransitionMatrix(false);
}