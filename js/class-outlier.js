//------------------------------------------------------------------------
//--------------------ASCENDENCY SKILL IMPLEMENTATIONS--------------------
//-------------------------------OUTLIER CLASS----------------------------
//------------------------------------------------------------------------

// ─── ACTIVE 1: TAIL RISK ───────────────────────────────────────────────

function _executeTailRisk(secondsPerCell, maxCells) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const candidates = [];

    // Find all unrevealed filled cells
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 1 && !revealedGrid[r][c] && userGrid[r][c] !== 1) {
                candidates.push([r, c]);
            }
        }
    }

    const available = candidates.length;
    if (available === 0) {
        showToast(LANG === 'de' ? '📈 Keine Zellen zum Enthüllen!' : '📈 No cells to reveal!');
        _tailRiskCancel(true); // refund cooldown
        return;
    }

    const actualMax = Math.min(maxCells, available);
    _tailRiskShowOverlay(secondsPerCell, actualMax, candidates);

    trackAchStat('skillTailRiskUsed');
    Audio_Manager.playSFX('tailRiskStart');
}

function _tailRiskShowOverlay(secondsPerCell, maxCells, candidates) {
    const overlay = document.createElement('div');
    overlay.id = 'tail-risk-overlay';
    overlay.className = 'modal-bg show';
    overlay.style.cssText = 'z-index:3000;';

    window._tailRiskData = { secondsPerCell, candidates };

    overlay.innerHTML = _tailRiskOverlayHTML(secondsPerCell, maxCells);
    document.body.appendChild(overlay);

    // Sync the range slider with the visual cost text
    const slider = document.getElementById('tr-slider');
    const costEl = document.getElementById('tr-cost');
    if (slider && costEl) {
        slider.addEventListener('input', (e) => {
            costEl.textContent = e.target.value * secondsPerCell;
        });
    }
}

function _tailRiskOverlayHTML(secondsPerCell, maxCells) {
    const title = LANG === 'de' ? 'UNENDLICHER HUNGER' : 'INFINITE HUNGER';
    const prompt = LANG === 'de'
        ? `Wie viele Zellen willst du enthüllen? (Kosten: ${secondsPerCell}s pro Zelle)`
        : `How many cells to reveal? (Cost: ${secondsPerCell}s per cell)`;
    const confirmLabel = LANG === 'de' ? 'OPFERN' : 'SACRIFICE';
    const cancelLabel = LANG === 'de' ? 'ABBRECHEN' : 'CANCEL';

    return `
        <div class="modal-box" style="text-align:center; border-left: 4px solid #e74c3c; max-width: 320px;">
            <div style="font-family:var(--PX); font-size:13px; color:#e74c3c; letter-spacing:2px; margin-bottom:12px;">
                📈 ${title}
            </div>
            <div style="font-family:var(--PX); font-size:15px; color:var(--accent2); margin-bottom:18px; line-height:1.8;">
                ${prompt}
            </div>
            <div style="margin-bottom:18px;">
                <input type="range" id="tr-slider" min="1" max="${maxCells}" value="1" style="width:80%;">
                <div style="margin-top:15px; font-size:15px; color:#e74c3c;">
                    ${LANG === 'de' ? 'Kosten' : 'Cost'}: <span id="tr-cost">${secondsPerCell}</span>s
                </div>
            </div>
            <div style="display:flex; gap:12px; justify-content:center;">
                <button onclick="_tailRiskResolve()" style="font-family:var(--PX); font-size:10px; background:transparent; border:1px solid #e74c3c; color:#e74c3c; padding:8px 18px; cursor:pointer; letter-spacing:1px;">
                    ${confirmLabel}
                </button>
            </div>
            <div style="margin-top:12px;">
                <button onclick="_tailRiskCancel()" style="font-family:var(--PX); font-size:15px; background:transparent; border:1px solid #444; color:#555; padding:5px 14px; cursor:pointer; letter-spacing:1px;">
                    ${cancelLabel}
                </button>
            </div>
        </div>`;
}

function _tailRiskRemoveOverlay() {
    const overlay = document.getElementById('tail-risk-overlay');
    if (overlay) overlay.remove();
}

function _tailRiskCancel(refund = false) {
    _tailRiskRemoveOverlay();
    window._tailRiskData = null;

    _setAbilityMode(false);
    STATE.classActiveChoice = 'active3';

    // Refund cooldown if user backs out
    const cd = cooldownState['active3']; // Ascendency active1 maps to hudSlot active3
    if (cd && cd.interval) {
        clearInterval(cd.interval);
        cd.interval = null;
    }
    if (cd) cd.remaining = 0;

    buildClassHUD();
    if (!refund) showToast(LANG === 'de' ? '📈 Abgebrochen.' : '📈 Cancelled.');
}

function _tailRiskResolve() {
    const slider = document.getElementById('tr-slider');
    if (!slider) return;

    const count = parseInt(slider.value, 10);
    const data = window._tailRiskData;
    const totalCost = count * data.secondsPerCell;

    _tailRiskRemoveOverlay();
    window._tailRiskData = null;

    // Apply the time sacrifice
    timerSecs = Math.max(0, timerSecs - totalCost);
    updTimer();

    // Shuffle and pick candidates
    let revealedCount = 0;
    const affected = [];
    const shuffled = data.candidates.sort(() => 0.5 - Math.random());

    for (let i = 0; i < count; i++) {
        const [r, c] = shuffled[i];
        revealedGrid[r][c] = true;
        userGrid[r][c] = 1;
        renderCell(r, c);
        updClues(r, c);
        affected.push(`g-${r}-${c}`);
        revealedCount++;
    }

    _applyCellEffect(affected, 'reveal');

    if (typeof _adjacencyMatrixRefreshAll === 'function' && ptHasSkill('adjacency_matrix')) {
        _adjacencyMatrixRefreshAll();
    }

    trackAchStat('tilesRevealed', revealedCount);
    showToast(`📈 Tail Risk: ${revealedCount} ${LANG === 'de' ? 'Zellen enthüllt' : 'cells revealed'} (-${totalCost}s)`);

    Audio_Manager.playSFX('tailRiskResolve'); 

    questStat_classRevealUsed(revealedCount);
    updateQuestStats('classAbilityUsedThisLevel', {});

    if (revealedCount === 20) trackAchStat('outlierInfiniteHunger20Reveals');

    checkWin();
}


// ─── ACTIVE 2: BLACK SWAN ──────────────────────────────────────────────

function _executeBlackSwan(durationMs) {
    window._blackSwanActive = true;
    window._blackSwanDurationMs = durationMs;
    window._blackSwanStartTime = Date.now();

    Audio_Manager.stopBGM(300);  // 300ms fade out

    showToast(LANG === 'de' ? '📉 BETRETE SPEEDFORCE' : '📉 ENTERING SPEEDFORCE');
    Audio_Manager.playSFX('speedforceEnter');
    trackAchStat('skillSpeedforceUsed');

    if (window._blackSwanTimeout) clearTimeout(window._blackSwanTimeout);
    if (window._blackSwanTickInterval) clearInterval(window._blackSwanTickInterval);

    _blackSwanStartHyperspeed(durationMs);

    // Badge appended after buildClassHUD() finishes rebuilding the handle
    setTimeout(() => _blackSwanSpawnBadge(Math.ceil(durationMs / 1000)), 0);

    let remaining = Math.ceil(durationMs / 1000);
    window._blackSwanTickInterval = setInterval(() => {
        remaining--;
        _blackSwanUpdateBadge(remaining);
        if (remaining <= 0) {
            clearInterval(window._blackSwanTickInterval);
            window._blackSwanTickInterval = null;
        }
    }, 1000);

    window._blackSwanTimeout = setTimeout(() => {
        _endBlackSwan(true);
    }, durationMs);
}

function _endBlackSwan(natural = false) {
    window._blackSwanActive = false;

    

    if (window._blackSwanTimeout) {
        clearTimeout(window._blackSwanTimeout);
        window._blackSwanTimeout = null;
    }
    if (window._blackSwanTickInterval) {
        clearInterval(window._blackSwanTickInterval);
        window._blackSwanTickInterval = null;
    }

    _blackSwanFadeOutHyperspeed();
    _blackSwanRemoveBadge();

    if (natural) {
        trackAchStat('speedforceNaturalCompletions');
        showToast(LANG === 'de' ? '📉 VERLASSE SPEEDFORCE' : '📉 LEAVING SPEEDFORCE');
        buildClassHUD();
    }

    Audio_Manager.stopSFX('speedforceEnter');
    // Resume BGM after leaving speedforce
    Audio_Manager.toggleBGM(true);
}

// ─── HYPERSPEED OVERLAY ────────────────────────────────────────────────

function _blackSwanStartHyperspeed(durationMs) {
    _blackSwanStopHyperspeed();

    const canvas = document.createElement('canvas');
    canvas.id = 'black-swan-hyperspeed';
    canvas.style.cssText = [
        'position:fixed',
        'inset:0',
        'width:100%',
        'height:100%',
        'pointer-events:none',
        'z-index:1',
        'opacity:0',
        'transition:opacity 0.4s ease-in',
    ].join(';');
    document.body.appendChild(canvas);

    requestAnimationFrame(() => requestAnimationFrame(() => { canvas.style.opacity = '1'; }));

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const W = canvas.width, H = canvas.height;
    let cx = W / 2, cy = H / 2;
    const _gridEl = document.getElementById('ptable') || document.getElementById('puzzle-scaler-wrap');
    if (_gridEl) {
        const _r = _gridEl.getBoundingClientRect();
        cx = _r.left + _r.width / 2;
        cy = _r.top + _r.height / 2;
    }

    const COLORS = ['#ffffff', '#e8ccff', '#c4a8ff', '#ff6b6b', '#ffd93d', '#6bcfff'];
    const stars = Array.from({ length: 180 }, () => _bswMakeStar(COLORS));

    const RAMP_MS = 800;
    const startTime = performance.now();
    let animId;

    // Cache grid rect once — recomputed only on resize, not every frame
    let gridRect = null;
    const _updateGridRect = () => {
        const _g = document.getElementById('ptable') || document.getElementById('puzzle-scaler-wrap');
        gridRect = _g ? _g.getBoundingClientRect() : null;
    };
    _updateGridRect();
    const _origResize = canvas._onResize;
    canvas._onResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        _updateGridRect();
    };

    function draw(now) {
        const elapsed = now - startTime;
        const speedFactor = Math.min(elapsed / RAMP_MS, 1);
        const baseSpeed = 6 + speedFactor * 22;
        const cw = canvas.width, ch = canvas.height;
        ctx.clearRect(0, 0, cw, ch);
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(cw, ch) * 0.7);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.45)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);

        // Clip: draw streaks everywhere EXCEPT inside the grid rectangle (uses cached rect)
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, cw, ch);
        if (gridRect) {
            ctx.rect(gridRect.left, gridRect.top, gridRect.width, gridRect.height);
        }
        ctx.clip('evenodd');

        for (let i = 0; i < stars.length; i++) {
            const s = stars[i];
            s.dist += baseSpeed * s.speed;

            const tailDist = Math.max(0, s.dist - s.length * speedFactor);
            const tx = cx + Math.cos(s.angle) * s.dist;
            const ty = cy + Math.sin(s.angle) * s.dist;
            const bx = cx + Math.cos(s.angle) * tailDist;
            const by = cy + Math.sin(s.angle) * tailDist;

            const alpha = Math.min(s.dist / 120, 1) * s.opacity;

            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(tx, ty);
            ctx.strokeStyle = _bswHexToRgba(s.color, alpha);
            ctx.lineWidth = s.width;
            ctx.lineCap = 'round';
            ctx.stroke();

            if (tx < -20 || tx > cw + 20 || ty < -20 || ty > ch + 20) {
                stars[i] = _bswMakeStar(COLORS);
            }
        }

        ctx.restore();
        animId = requestAnimationFrame(draw);
        canvas._animId = animId;  // keep _animId in sync so cancelAnimationFrame works
    }

    animId = requestAnimationFrame(draw);  // actually start the animation

    canvas._onResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        _updateGridRect();
    };
    window.addEventListener('resize', canvas._onResize);

    canvas._stopTimeout = setTimeout(() => _blackSwanFadeOutHyperspeed(), Math.max(0, durationMs - 500));
}

function _bswMakeStar(colors) {
    return {
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * 60 + 5,
        speed: 0.6 + Math.random() * 0.8,
        length: 30 + Math.random() * 120,
        opacity: 0.5 + Math.random() * 0.5,
        width: 0.5 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
    };
}

function _bswHexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}

function _blackSwanFadeOutHyperspeed() {
    const canvas = document.getElementById('black-swan-hyperspeed');
    if (!canvas) return;
    canvas.style.transition = 'opacity 0.5s ease-out';
    canvas.style.opacity = '0';
    setTimeout(() => _blackSwanStopHyperspeed(), 550);
}

function _blackSwanStopHyperspeed() {
    const canvas = document.getElementById('black-swan-hyperspeed');
    if (!canvas) return;
    if (canvas._animId) cancelAnimationFrame(canvas._animId);
    if (canvas._stopTimeout) clearTimeout(canvas._stopTimeout);
    if (canvas._onResize) window.removeEventListener('resize', canvas._onResize);
    canvas.remove();
}


// ─── HUD BADGE ────────────────────────────────────────────────────────

function _blackSwanSpawnBadge(remainingSecs) {
    _blackSwanRemoveBadge();

    if (!document.getElementById('black-swan-badge-styles')) {
        const s = document.createElement('style');
        s.id = 'black-swan-badge-styles';
        s.textContent = `
            #black-swan-badge {
                display:inline-flex;align-items:center;gap:3px;
                background:rgba(231,76,60,0.18);border:1px solid #e74c3c;
                border-radius:5px;padding:2px 6px;
                font-family:var(--PX,monospace);font-size:10px;color:#e74c3c;
                animation:bsw-pulse 1s ease-in-out infinite;white-space:nowrap;
            }
            .bsw-icon{font-size:11px;line-height:1;}
            .bsw-timer{font-variant-numeric:tabular-nums;letter-spacing:.03em;font-weight:bold;}
            @keyframes bsw-pulse{
                0%,100%{box-shadow:0 0 4px 1px rgba(231,76,60,0.4);}
                50%{box-shadow:0 0 10px 3px rgba(231,76,60,0.75);}
            }
        `;
        document.head.appendChild(s);
    }

    const badge = document.createElement('div');
    badge.id = 'black-swan-badge';
    badge.innerHTML = `<span class="bsw-icon">📉</span><span class="bsw-timer" id="bsw-timer-val">${remainingSecs}s</span>`;

    const handle = document.getElementById('class-hud-drag-handle');
    if (handle) handle.appendChild(badge);
    else {
        const panel = document.getElementById('class-hud-panel');
        if (panel) panel.appendChild(badge);
    }
}

function _blackSwanUpdateBadge(remainingSecs) {
    const el = document.getElementById('bsw-timer-val');
    if (el) el.textContent = `${Math.max(0, remainingSecs)}s`;
}

function _blackSwanRemoveBadge() {
    document.getElementById('black-swan-badge')?.remove();
}