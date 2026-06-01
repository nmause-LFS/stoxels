








// ═══════════════════════════════════════════════
//  CELL EFFECT SYSTEM
//  A unified lingering animation applied to any
//  cell that is touched by an item effect.
//
//  Types:
//    'reveal'   — green pulse  (tile revealed / row-col solved)
//    'mark'     — orange pulse (empty tile marked ✕ by item)
//    'erase'    — red pulse    (filled tile wiped by cursed item)
//    'artifact' — gold burst   (artifact / primer headstart)
//    'unmark'   — yellow fade  (✕ marks cleared by cursedReveal)
//
//  Usage:
//    _applyCellEffect(['g-3-2', 'g-3-5'], 'reveal');
// ═══════════════════════════════════════════════

// _ensureCellEffectCSS — injects all keyframes + classes once.
function _ensureCellEffectCSS() {
    if (document.getElementById('cell-effect-style')) return;
    const style = document.createElement('style');
    style.id = 'cell-effect-style';
    style.textContent = `
        /* ── reveal: green glow sweeping in ── */
        @keyframes cellRevealPulse {
            0%   { background: rgba(46, 213, 115, 0.90); box-shadow: inset 0 0 0 2px #2ed573, 0 0 6px #2ed573; }
            50%  { background: rgba(46, 213, 115, 0.55); box-shadow: inset 0 0 0 1px #2ed573, 0 0 3px #2ed573; }
            100% { background: rgba(46, 213, 115, 0.00); box-shadow: none; }
        }
        .cell-fx-reveal {
            animation: cellRevealPulse 1.6s ease-out forwards;
            pointer-events: none;
        }

        /* ── mark: orange pulse (item placed a ✕) ── */
        @keyframes cellMarkPulse {
            0%   { background: rgba(255, 165, 0, 0.80); box-shadow: inset 0 0 0 2px #ffaa00; }
            50%  { background: rgba(255, 165, 0, 0.45); box-shadow: inset 0 0 0 1px #ffaa00; }
            100% { background: rgba(255, 165, 0, 0.00); box-shadow: none; }
        }
        .cell-fx-mark {
            animation: cellMarkPulse 1.6s ease-out forwards;
            pointer-events: none;
        }

        /* ── erase: red drain (cursed item wiped a filled tile) ── */
        @keyframes cellErasePulse {
            0%   { background: rgba(220, 50, 50, 0.85); box-shadow: inset 0 0 0 2px #ff3333; }
            40%  { background: rgba(180, 20, 20, 0.65); box-shadow: inset 0 0 0 2px #cc0000; }
            70%  { background: rgba(220, 50, 50, 0.40); box-shadow: inset 0 0 0 1px #ff3333; }
            100% { background: rgba(220, 50, 50, 0.00); box-shadow: none; }
        }
        .cell-fx-erase {
            animation: cellErasePulse 2.0s ease-out forwards;
            pointer-events: none;
        }

        /* ── artifact / primer: gold starburst ── */
        @keyframes cellArtifactPulse {
            0%   { background: rgba(255, 215, 0, 0.95); box-shadow: inset 0 0 0 2px #ffd700, 0 0 10px #ffd700; }
            40%  { background: rgba(255, 215, 0, 0.60); box-shadow: inset 0 0 0 1px #ffd700, 0 0 5px #ffd700; }
            100% { background: rgba(255, 215, 0, 0.00); box-shadow: none; }
        }
        .cell-fx-artifact {
            animation: cellArtifactPulse 1.8s ease-out forwards;
            pointer-events: none;
        }

        /* ── unmark: yellow fade (✕ marks cleared by cursedReveal) ── */
        @keyframes cellUnmarkPulse {
            0%   { background: rgba(255, 230, 50, 0.75); box-shadow: inset 0 0 0 2px #ffe632; }
            60%  { background: rgba(255, 230, 50, 0.35); box-shadow: inset 0 0 0 1px #ffe632; }
            100% { background: rgba(255, 230, 50, 0.00); box-shadow: none; }
        }
        .cell-fx-unmark {
            animation: cellUnmarkPulse 1.4s ease-out forwards;
            pointer-events: none;
        }

        @keyframes fx-shadow-seal-veil {
            0%   { background: rgba(0,0,0,0); }
            60%  { background: rgba(0,0,0,0.55); }
            100% { background: rgba(0,0,0,0); }
        }
    `;
    document.head.appendChild(style);
}

// _applyCellEffect(cellIds, type) — applies the named effect class to each
//   cell element in cellIds, then removes the class once the animation ends.
//   Handles rapid re-use of the same cell via a forced reflow.
//
//   Duration map keeps cleanup timers in sync with the CSS animation lengths:
const _cellEffectDuration = { reveal: 1700, mark: 1700, erase: 2100, artifact: 1900, unmark: 1500 };

function _applyCellEffect(cellIds, type) {
    if (!cellIds.length) return;
    _ensureCellEffectCSS();
    const cls = `cell-fx-${type}`;
    const duration = _cellEffectDuration[type] || 1800;
    cellIds.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.remove(cls);
        void el.offsetWidth; // force reflow so animation restarts on rapid re-use
        el.classList.add(cls);
    });
    setTimeout(() => {
        cellIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove(cls);
        });
    }, duration);
}






























// ═══════════════════════════════════════════════
//  ITEM VISUAL EFFECTS  (inventory_effects.js)
//  Plays a thematic visual effect on the puzzle
//  area whenever a player uses an item.
//
//  Entry point: playItemEffect(defId)
//    Called from useItem() in inventory.js
//    immediately after the item's game logic fires.
//
//  Each effect is self-contained: it creates DOM
//  elements, animates them, then removes them.
//  No persistent state is kept — effects are
//  purely cosmetic and fire-and-forget.
//
//  HOW TO ADD A NEW EFFECT:
//    1. Add a case (or startsWith branch) inside
//       playItemEffect() mapping the item id to a
//       function call.
//    2. Write the function below in the relevant
//       section (reveal, markWrong, time, utility,
//       cursed).
//    3. Add matching CSS keyframes + classes to
//       inventory_effects.css.
// ═══════════════════════════════════════════════


// ── ENTRY POINT ──────────────────────────────────────────────────────────

function playItemEffect(defId) {
    if (!defId) return;

    // ── REVEAL group ──────────────────────────────────────────────────────
    if (defId === 'reveal1') return _fxCandle();
    if (defId === 'reveal2') return _fxMagnifier();
    if (defId === 'reveal3') return _fxSpyglass();
    if (defId === 'reveal4') return _fxScanner();

    // ── MARK-WRONG group ──────────────────────────────────────────────────
    if (defId === 'markWrong2') return _fxEraser();
    if (defId === 'markWrong4') return _fxSweeper();
    if (defId === 'markWrong6') return _fxErrorMagnet();
    if (defId === 'markWrong8') return _fxErrorGem();

    // ── ADD-TIME group ────────────────────────────────────────────────────
    if (defId === 'addTime60') return _fxHourglass();
    if (defId === 'addTime300') return _fxStopwatch();
    if (defId === 'addTime600') return _fxClock();
    if (defId === 'addTime900') return _fxChronobolt();

    // ── UTILITY ───────────────────────────────────────────────────────────
    if (defId === 'freeze') return _fxFreeze();
    if (defId === 'shield') return _fxShield();
    if (defId === 'rowSolve') return _fxRowSolve();
    if (defId === 'colSolve') return _fxColSolve();
    if (defId === 'mistakeEraser' || defId === 'mistakeEraser4' || defId === 'mistakeEraser6' || defId === 'mistakeEraserAll') return _fxMistakeEraser(defId);
    if (defId === 'scoutPrimer') return _fxScoutPrimer();
    if (defId === 'artifactComplete') return _fxArtifact();

    // ── CURSED ────────────────────────────────────────────────────────────
    if (defId === 'cursedReveal') return _fxCursedReveal();
    if (defId === 'cursedTime') return _fxCursedTime();
    if (defId === 'cursedShield') return _fxCursedShield();
    if (defId === 'cursedRowSolve') return _fxTidalWave();
    if (defId === 'cursedColSolve') return _fxVortex();
    if (defId === 'cursedRowCol') return _fxChaosGrid();

    // ── PEARLS ────────────────────────────────────────────────────────────
    if (defId === 'pearlOfHaste') return _fxPearl('#88aaff', 'pearl_of_haste');
    if (defId === 'pearlOfSwiftness') return _fxPearl('#cc88ff', 'pearl_of_swiftness');
    if (defId === 'grandPearl') return _fxPearl('#e0e0e0', 'grand_pearl');

    // ── KEYSTONES ─────────────────────────────────────────────────────────
    if (defId === 'theWitch') return _fxTheWitch();
    if (defId === 'goldenClock') return _fxGoldenClock();
    if (defId === 'shadowSeal') return _fxShadowSeal();
}


// ── SHARED HELPERS ────────────────────────────────────────────────────────

// _fxGetPuzzleRect — returns the bounding rect of the puzzle grid in the
//   coordinate space of the puzzle-scaler element (logical pixels).
//   Returns null if the grid cells can't be found.
function _fxGetPuzzleRect() {
    const wrap = document.getElementById('puzzle-scaler');
    if (!wrap) return null;
    if (!wrap.style.position || wrap.style.position === 'static') wrap.style.position = 'relative';

    const sol = cur?.grid;
    if (!sol || !sol.length) return null;
    const rows = sol.length, cols = sol[0].length;
    const first = document.getElementById('g-0-0');
    const last = document.getElementById(`g-${rows - 1}-${cols - 1}`);
    if (!first || !last) return null;

    const zoom = currentZoom || 1;
    const wRect = wrap.getBoundingClientRect();
    const fRect = first.getBoundingClientRect();
    const lRect = last.getBoundingClientRect();

    return {
        wrap,
        top: (fRect.top - wRect.top) / zoom,
        left: (fRect.left - wRect.left) / zoom,
        bottom: (lRect.bottom - wRect.top) / zoom,
        right: (lRect.right - wRect.left) / zoom,
        width: (lRect.right - fRect.left) / zoom,
        height: (lRect.bottom - fRect.top) / zoom,
    };
}

// _fxOverlay — creates a full-wrap absolute overlay div, appends it to wrap,
//   and removes it after `durationMs`.  Returns the element for further setup.
function _fxOverlay(wrap, durationMs, extraStyle = '') {
    const el = document.createElement('div');
    el.style.cssText = `position:absolute;inset:0;pointer-events:none;z-index:320;overflow:hidden;${extraStyle}`;
    wrap.appendChild(el);
    setTimeout(() => el.remove(), durationMs);
    return el;
}

// _fxSpawnParticles — generic particle spawner.
//   opts: { count, chars, colors, sizeMin, sizeMax, container,
//           startX, startY, spreadX, spreadY, duration, cssClass }
function _fxSpawnParticles(opts) {
    const {
        count = 12, chars = ['·'], colors = ['#fff'],
        sizeMin = 14, sizeMax = 22,
        container, startX, startY, spreadX = 60, spreadY = 60,
        duration = 900, cssClass = 'fx-particle-generic',
    } = opts;

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const p = document.createElement('div');
            p.className = cssClass;
            p.textContent = chars[Math.floor(Math.random() * chars.length)];
            p.style.color = colors[Math.floor(Math.random() * colors.length)];
            p.style.fontSize = (sizeMin + Math.random() * (sizeMax - sizeMin)) + 'px';
            p.style.left = (startX + (Math.random() - .5) * spreadX) + 'px';
            p.style.top = (startY + (Math.random() - .5) * spreadY) + 'px';
            p.style.animationDuration = (duration * (.7 + Math.random() * .6)) + 'ms';
            container.appendChild(p);
            setTimeout(() => p.remove(), duration * 1.5);
        }, i * (duration / count / 2));
    }
}


// ════════════════════════════════════════════════════════════════
//  REVEAL ITEM EFFECTS
// ════════════════════════════════════════════════════════════════

// 🕯️ Candle — warm amber glow slowly blooms across the puzzle.
function _fxCandle() {
    const r = _fxGetPuzzleRect();
    if (!r) return;

    const overlay = _fxOverlay(r.wrap, 1800);
    overlay.innerHTML = `<div class="fx-candle-glow" style="
        position:absolute;
        left:${r.left + r.width / 2}px;
        top:${r.top + r.height / 2}px;
        transform:translate(-50%,-50%);
    "></div>`;

    // Floating candle flame emoji
    const flame = document.createElement('div');
    flame.className = 'fx-candle-flame';
    flame.textContent = '🕯️';
    flame.style.cssText = `position:absolute;left:${r.left + r.width / 2}px;top:${r.top}px;transform:translateX(-50%);`;
    r.wrap.appendChild(flame);
    setTimeout(() => flame.remove(), 2000);

    Audio_Manager.playSFX('candle');
}

// 🔍 Magnifier — a loupe slides across the grid left→right.
function _fxMagnifier() {
    const r = _fxGetPuzzleRect();
    if (!r) return;

    const lens = document.createElement('div');
    lens.className = 'fx-magnifier-lens';
    lens.textContent = '🔍';
    lens.style.cssText = `
        position:absolute;
        top:${r.top + r.height / 2 - 28}px;
        left:${r.left - 40}px;
        font-size:48px;
        pointer-events:none;
        z-index:325;
        animation:fx-magnifier-slide 0.8s cubic-bezier(.3,1.4,.6,1) forwards;
        --slide-end:${r.right + 20}px;
    `;
    r.wrap.appendChild(lens);
    setTimeout(() => lens.remove(), 1000);

    Audio_Manager.playSFX('magnifier');
}

// 🔭 Spyglass — three concentric scan-rings expand from grid centre.
function _fxSpyglass() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 1400);
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;

    for (let i = 0; i < 3; i++) {
        const ring = document.createElement('div');
        ring.className = 'fx-spyglass-ring';
        ring.style.cssText = `
            position:absolute;
            left:${cx}px; top:${cy}px;
            transform:translate(-50%,-50%) scale(0);
            animation:fx-ring-expand 0.9s ease-out ${i * 0.18}s forwards;
            --ring-size:${Math.max(r.width, r.height) * (0.5 + i * 0.35)}px;
        `;
        overlay.appendChild(ring);
    }

    Audio_Manager.playSFX('spyglass');
}

// 📡 Scanner — a horizontal green scan-bar sweeps top-to-bottom twice.
function _fxScanner() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 1600);

    for (let pass = 0; pass < 2; pass++) {
        const bar = document.createElement('div');
        bar.className = 'fx-scanner-bar';
        bar.style.cssText = `
            position:absolute;
            left:${r.left}px; width:${r.width}px;
            top:${r.top}px; height:4px;
            animation:fx-scanner-sweep ${0.65}s linear ${pass * 0.55}s forwards;
            --scan-distance:${r.height}px;
        `;
        overlay.appendChild(bar);
    }
    Audio_Manager.playSFX('scanner');
}


// ════════════════════════════════════════════════════════════════
//  MARK-WRONG ITEM EFFECTS
// ════════════════════════════════════════════════════════════════

// ✏️ Eraser — pink rubber streaks wipe across the grid.
function _fxEraser() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 1200);

    for (let i = 0; i < 2; i++) {
        const streak = document.createElement('div');
        streak.className = 'fx-eraser-streak';
        streak.style.cssText = `
            position:absolute;
            top:${r.top + (r.height / (3)) * (i + 1)}px;
            left:${r.left}px; width:${r.width}px; height:12px;
            animation:fx-eraser-wipe 0.45s ease-out ${i * 0.18}s forwards;
        `;
        overlay.appendChild(streak);
    }

    Audio_Manager.playSFX('eraser');
}

// 🧹 Sweeper — a sweeping broom icon trails dust particles.
function _fxSweeper() {
    const r = _fxGetPuzzleRect();
    if (!r) return;

    const broom = document.createElement('div');
    broom.className = 'fx-sweeper-icon';
    broom.textContent = '🧹';
    broom.style.cssText = `
        position:absolute;
        top:${r.top + r.height / 2 - 24}px;
        left:${r.right + 20}px;
        font-size:44px;
        pointer-events:none;z-index:325;
        animation:fx-sweeper-broom 0.85s cubic-bezier(.3,1.3,.6,1) forwards;
        --broom-start:${r.right + 20}px;
        --broom-end:${r.left - 50}px;
    `;
    r.wrap.appendChild(broom);

    // Dust particles trailing behind broom
    const overlay = _fxOverlay(r.wrap, 1400);
    for (let i = 0; i < 14; i++) {
        setTimeout(() => {
            const dust = document.createElement('div');
            dust.className = 'fx-dust-particle';
            dust.style.cssText = `
                position:absolute;
                left:${r.left + Math.random() * r.width}px;
                top:${r.top + r.height / 2 + (Math.random() - 0.5) * 60}px;
            `;
            overlay.appendChild(dust);
        }, i * 50);
    }

    setTimeout(() => broom.remove(), 1100);
    Audio_Manager.playSFX('sweeper');
}

// 🧲 Error Magnet — a magnet swoops in, ✕ crosses fly toward it.
function _fxErrorMagnet() {
    const r = _fxGetPuzzleRect();
    if (!r) return;

    // Magnet icon
    const magnet = document.createElement('div');
    magnet.className = 'fx-magnet-icon';
    magnet.textContent = '🧲';
    const magnetX = r.left + r.width / 2;
    const magnetY = r.top - 50;
    magnet.style.cssText = `
        position:absolute;
        left:${magnetX}px; top:${r.top - 80}px;
        font-size:52px; transform:translateX(-50%);
        pointer-events:none; z-index:326;
        animation:fx-magnet-drop 0.45s cubic-bezier(.2,1.5,.5,1) forwards;
        --magnet-land:${magnetY}px;
    `;
    r.wrap.appendChild(magnet);

    // Red ✕ particles that fly toward the magnet from all over grid
    const overlay = _fxOverlay(r.wrap, 1600);
    for (let i = 0; i < 18; i++) {
        setTimeout(() => {
            const cross = document.createElement('div');
            cross.className = 'fx-magnet-cross';
            const startX = r.left + Math.random() * r.width;
            const startY = r.top + Math.random() * r.height;
            const dx = magnetX - startX;
            const dy = magnetY - startY;
            cross.style.cssText = `
                position:absolute;
                left:${startX}px; top:${startY}px;
                --dx:${dx}px; --dy:${dy}px;
                animation:fx-cross-fly 0.55s ease-in forwards;
            `;
            cross.textContent = '✕';
            overlay.appendChild(cross);
        }, 400 + i * 40);
    }

    setTimeout(() => magnet.remove(), 1700);

    Audio_Manager.playSFX('magnet');
}

// 💎 Error Gem — gem pulses, then showers coloured sparkles top-down.
function _fxErrorGem() {
    const r = _fxGetPuzzleRect();
    if (!r) return;

    const gem = document.createElement('div');
    gem.className = 'fx-gem-pulse';
    gem.textContent = '💎';
    gem.style.cssText = `
        position:absolute;
        left:${r.left + r.width / 2}px;
        top:${r.top + r.height / 2}px;
        transform:translate(-50%,-50%);
        font-size:64px;
        pointer-events:none; z-index:326;
        animation:fx-gem-burst 1.2s ease-out forwards;
    `;
    r.wrap.appendChild(gem);

    // Sparkle rain
    const overlay = _fxOverlay(r.wrap, 1600);
    const cols = ['#88f', '#c8f', '#66f', '#aaf', '#fff'];
    _fxSpawnParticles({
        count: 24, chars: ['✦', '◆', '●', '▪'],
        colors: cols, sizeMin: 10, sizeMax: 18,
        container: overlay,
        startX: r.left + r.width / 2, startY: r.top,
        spreadX: r.width * .9, spreadY: 30,
        duration: 1100, cssClass: 'fx-gem-spark',
    });

    setTimeout(() => gem.remove(), 1400);

    Audio_Manager.playSFX('error_gem');
}


// ════════════════════════════════════════════════════════════════
//  ADD-TIME ITEM EFFECTS
// ════════════════════════════════════════════════════════════════

// ⏳ Hourglass — sand streams downward through the centre.
function _fxHourglass() {
    const r = _fxGetPuzzleRect();
    if (!r) return;

    const hg = document.createElement('div');
    hg.className = 'fx-hourglass-icon';
    hg.textContent = '⏳';
    hg.style.cssText = `
        position:absolute;
        left:${r.left + r.width / 2}px;
        top:${r.top + r.height / 2}px;
        transform:translate(-50%,-50%);
        font-size:56px; pointer-events:none; z-index:326;
        animation:fx-hourglass-spin 1s ease-in-out forwards;
    `;
    r.wrap.appendChild(hg);

    // Sand particles falling
    const overlay = _fxOverlay(r.wrap, 1400);
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const grain = document.createElement('div');
            grain.className = 'fx-sand-grain';
            grain.style.cssText = `
                position:absolute;
                left:${r.left + r.width / 2 + (Math.random() - 0.5) * 16}px;
                top:${r.top + r.height / 2 - 20}px;
                --fall-dist:${40 + Math.random() * 30}px;
            `;
            overlay.appendChild(grain);
        }, i * 55);
    }

    setTimeout(() => hg.remove(), 1600);

    Audio_Manager.playSFX('hourglass');
}

// ⏱️ Stopwatch — timer rings ripple outward from centre.
function _fxStopwatch() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 1400);
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;

    for (let i = 0; i < 4; i++) {
        const ring = document.createElement('div');
        ring.className = 'fx-time-ring';
        ring.style.cssText = `
            position:absolute;
            left:${cx}px; top:${cy}px;
            transform:translate(-50%,-50%) scale(0);
            animation:fx-time-ring-expand 0.85s ease-out ${i * 0.2}s forwards;
            --ring-max:${Math.max(r.width, r.height) * 0.7}px;
        `;
        overlay.appendChild(ring);
    }

    // Stopwatch icon bounce
    const icon = document.createElement('div');
    icon.textContent = '⏱️';
    icon.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);font-size:42px;pointer-events:none;z-index:327;animation:fx-icon-pop 0.6s ease-out forwards;`;
    r.wrap.appendChild(icon);
    setTimeout(() => icon.remove(), 900);

    Audio_Manager.playSFX('stopwatch');
}

// 🕰️ Clock — clock hands sweep + golden radial burst.
function _fxClock() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 1800);
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;

    // Golden burst
    const burst = document.createElement('div');
    burst.className = 'fx-clock-burst';
    burst.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);`;
    overlay.appendChild(burst);

    // Rays
    for (let i = 0; i < 12; i++) {
        const ray = document.createElement('div');
        ray.className = 'fx-clock-ray';
        ray.style.cssText = `
            position:absolute;
            left:${cx}px; top:${cy}px;
            transform-origin:0 0;
            transform:translate(-50%,-50%) rotate(${i * 30}deg);
            animation:fx-clock-ray-shoot 0.7s ease-out ${i * 0.06}s forwards;
            --ray-len:${Math.max(r.width, r.height) * 0.55}px;
        `;
        overlay.appendChild(ray);
    }

    const icon = document.createElement('div');
    icon.textContent = '🕰️';
    icon.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);font-size:50px;pointer-events:none;z-index:327;animation:fx-icon-pop 0.7s ease-out forwards;`;
    r.wrap.appendChild(icon);
    setTimeout(() => icon.remove(), 1100);

    Audio_Manager.playSFX('clock');
}

// ⚡ Chronobolt — lightning bolts crackle across the puzzle grid.
function _fxChronobolt() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 1600, 'z-index:328;');

    // Flash tint
    const flash = document.createElement('div');
    flash.className = 'fx-chronobolt-flash';
    flash.style.cssText = `position:absolute;inset:0;`;
    overlay.appendChild(flash);

    // Multiple lightning bolts from top edges
    const boltPositions = [.2, .5, .8];
    boltPositions.forEach((xFrac, i) => {
        setTimeout(() => {
            const bolt = document.createElement('div');
            bolt.className = 'fx-lightning-bolt';
            const startX = r.left + r.width * xFrac;
            bolt.style.cssText = `
                position:absolute;
                left:${startX}px;
                top:${r.top}px;
                --bolt-height:${r.height}px;
                animation:fx-bolt-strike 0.35s steps(3) forwards;
            `;
            bolt.innerHTML = _fxGenerateLightningPath(r.height);
            overlay.appendChild(bolt);
        }, i * 180);
    });

    // ⚡ icon flash
    const icon = document.createElement('div');
    icon.textContent = '⚡';
    icon.style.cssText = `position:absolute;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;transform:translate(-50%,-50%);font-size:72px;pointer-events:none;z-index:330;animation:fx-bolt-icon 0.5s ease-out forwards;`;
    r.wrap.appendChild(icon);
    setTimeout(() => icon.remove(), 800);

    Audio_Manager.playSFX('chronobolt');
}

// Generates a zigzag SVG lightning path
function _fxGenerateLightningPath(height) {
    const segs = 8;
    const segH = height / segs;
    let d = 'M 0 0';
    for (let i = 1; i <= segs; i++) {
        const xOff = (Math.random() - 0.5) * 28;
        d += ` L ${xOff} ${segH * i}`;
    }
    return `<svg width="60" height="${height}" style="overflow:visible;position:absolute;left:-30px;top:0;">
        <path d="${d}" stroke="#ffe066" stroke-width="3" fill="none"
              filter="url(#glow)" opacity="0.95"/>
        <path d="${d}" stroke="#fff" stroke-width="1.5" fill="none" opacity="0.8"/>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
      </svg>`;
}


// ════════════════════════════════════════════════════════════════
//  UTILITY ITEM EFFECTS
// ════════════════════════════════════════════════════════════════

// 🛡️ Shield — a golden hexagonal shield briefly overlays the puzzle.
function _fxShield() {
    const r = _fxGetPuzzleRect();
    if (!r) return;

    const shield = document.createElement('div');
    shield.className = 'fx-shield-overlay';
    shield.style.cssText = `
        position:absolute;
        left:${r.left}px; top:${r.top}px;
        width:${r.width}px; height:${r.height}px;
        pointer-events:none; z-index:325;
        animation:fx-shield-pulse 1.2s ease-out forwards;
    `;
    shield.innerHTML = `<div class="fx-shield-hex">🛡️</div>`;
    r.wrap.appendChild(shield);
    setTimeout(() => shield.remove(), 1500);

    // Hex shimmer rings
    const overlay = _fxOverlay(r.wrap, 1400);
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (let i = 0; i < 3; i++) {
        const ring = document.createElement('div');
        ring.className = 'fx-shield-ring';
        ring.style.cssText = `
            position:absolute; left:${cx}px; top:${cy}px;
            transform:translate(-50%,-50%) scale(0);
            animation:fx-shield-ring-expand 0.9s ease-out ${i * 0.22}s forwards;
            --ring-max:${Math.max(r.width, r.height) * 0.65}px;
        `;
        overlay.appendChild(ring);
    }

    Audio_Manager.playSFX('shield');
}



// ❄️ Time Freeze (item) — icy blue frost creeps in from edges.
function _fxFreeze() {
    // Reuses the blizzard system from class.js
    _startBlizzardEffect(2200);
    Audio_Manager.playSFX('time_freeze');
}





// 🎓 Mistake Eraser — a chalkboard-eraser wipe clears a smudge from the board.
function _fxMistakeEraser(defId) {

    const sfxMap = {
        mistakeEraser: 'tutor',
        mistakeEraser4: 'professor',
        mistakeEraser6: 'scholar',
        mistakeEraserAll: 'grand_mentor',
    };
    Audio_Manager.playSFX(sfxMap[defId] || 'tutor');

    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 1300);

    // "Chalk dust" smear diagonally
    for (let i = 0; i < 3; i++) {
        const smear = document.createElement('div');
        smear.className = 'fx-chalk-smear';
        smear.style.cssText = `
            position:absolute;
            left:${r.left + r.width * (0.2 + i * 0.25)}px;
            top:${r.top + r.height * 0.4}px;
            animation:fx-chalk-wipe 0.5s ease-out ${i * 0.12}s forwards;
        `;
        overlay.appendChild(smear);
    }

    const icon = document.createElement('div');
    icon.textContent = '🎓';
    icon.style.cssText = `position:absolute;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;transform:translate(-50%,-50%);font-size:56px;pointer-events:none;z-index:327;animation:fx-icon-pop 0.6s ease-out forwards;`;
    r.wrap.appendChild(icon);
    setTimeout(() => icon.remove(), 900);
}



// 📜 Scout's Primer — golden compass-points radiate outward.
function _fxScoutPrimer() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 1600);
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;

    const arrows = ['▲', '▶', '▼', '◀', '◥', '◤', '◣', '◢'];
    arrows.forEach((ch, i) => {
        const a = document.createElement('div');
        a.className = 'fx-primer-arrow';
        a.textContent = ch;
        const angle = (i / arrows.length) * Math.PI * 2;
        a.style.cssText = `
            position:absolute; left:${cx}px; top:${cy}px;
            font-size:22px; color:#ffd700;
            text-shadow:0 0 8px #ffd700;
            animation:fx-primer-shoot 0.8s ease-out ${i * 0.08}s forwards;
            --dx:${Math.cos(angle) * r.width * 0.55}px;
            --dy:${Math.sin(angle) * r.height * 0.55}px;
        `;
        overlay.appendChild(a);
    });

    const icon = document.createElement('div');
    icon.textContent = '📜';
    icon.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);font-size:52px;pointer-events:none;z-index:327;animation:fx-icon-pop 0.6s ease-out forwards;`;
    r.wrap.appendChild(icon);
    setTimeout(() => icon.remove(), 1100);

    Audio_Manager.playSFX('scouts_primer');
}




// 📐 Row Solve — a golden sweep flashes across the full grid height.
function _fxRowSolve() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 1600);

    // Full-grid horizontal sweep bar (left → right)
    const sweep = document.createElement('div');
    sweep.className = 'fx-rowsolve-bar';
    sweep.style.cssText = `
        position:absolute;
        top:${r.top}px; height:${r.height}px;
        left:${r.left - r.width}px; width:${r.width}px;
        animation:fx-rowsolve-sweep 0.65s ease-out forwards;
        --sweep-dist:${r.width * 2}px;
    `;
    overlay.appendChild(sweep);

    // Thin shimmer lines for every row — no cap
    const rows = cur?.grid?.length || 5;
    const rowH = r.height / rows;
    for (let i = 0; i < rows; i++) {
        const line = document.createElement('div');
        line.className = 'fx-rowsolve-line';
        line.style.cssText = `
            position:absolute;
            left:${r.left}px; width:${r.width}px;
            top:${r.top + rowH * i + rowH / 2 - 1}px; height:2px;
            opacity:0;
            animation:fx-rowsolve-line-flash 0.4s ease-out ${0.1 + i * 0.03}s forwards;
        `;
        overlay.appendChild(line);
    }

    // 📐 icon
    const icon = document.createElement('div');
    icon.textContent = '📐';
    icon.style.cssText = `position:absolute;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;transform:translate(-50%,-50%);font-size:56px;pointer-events:none;z-index:327;animation:fx-icon-pop 0.6s ease-out forwards;`;
    r.wrap.appendChild(icon);
    setTimeout(() => icon.remove(), 1000);

    Audio_Manager.playSFX('set_square');
}

// 📏 Col Solve — a golden sweep flashes across the full grid width.
function _fxColSolve() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 1600);

    // Full-grid vertical sweep bar (top → bottom)
    const sweep = document.createElement('div');
    sweep.className = 'fx-colsolve-bar';
    sweep.style.cssText = `
        position:absolute;
        left:${r.left}px; width:${r.width}px;
        top:${r.top - r.height}px; height:${r.height}px;
        animation:fx-colsolve-sweep 0.65s ease-out forwards;
        --sweep-dist:${r.height * 2}px;
    `;
    overlay.appendChild(sweep);

    // Thin shimmer lines for every col — no cap
    const cols = cur?.grid?.[0]?.length || 5;
    const colW = r.width / cols;
    for (let i = 0; i < cols; i++) {
        const line = document.createElement('div');
        line.className = 'fx-colsolve-line';
        line.style.cssText = `
            position:absolute;
            top:${r.top}px; height:${r.height}px;
            left:${r.left + colW * i + colW / 2 - 1}px; width:2px;
            opacity:0;
            animation:fx-colsolve-line-flash 0.4s ease-out ${0.1 + i * 0.03}s forwards;
        `;
        overlay.appendChild(line);
    }

    // 📏 icon
    const icon = document.createElement('div');
    icon.textContent = '📏';
    icon.style.cssText = `position:absolute;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;transform:translate(-50%,-50%);font-size:56px;pointer-events:none;z-index:327;animation:fx-icon-pop 0.6s ease-out forwards;`;
    r.wrap.appendChild(icon);
    setTimeout(() => icon.remove(), 1000);

    Audio_Manager.playSFX('ruler');
}






// 🌟 Artifact Complete — full golden supernova engulfs the grid.
function _fxArtifact() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 2400, 'z-index:329;');
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;

    // Gold fill flash
    const fill = document.createElement('div');
    fill.className = 'fx-artifact-fill';
    fill.style.cssText = `position:absolute;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;`;
    overlay.appendChild(fill);

    // Starburst rays
    for (let i = 0; i < 16; i++) {
        const ray = document.createElement('div');
        ray.className = 'fx-artifact-ray';
        const angle = (i / 16) * 360;
        ray.style.cssText = `
            position:absolute; left:${cx}px; top:${cy}px;
            transform-origin:0 0;
            transform:translate(-50%,-50%) rotate(${angle}deg);
            animation:fx-artifact-ray-shoot 1s ease-out ${i * 0.04}s forwards;
            --ray-len:${Math.max(r.width, r.height) * 0.75}px;
        `;
        overlay.appendChild(ray);
    }

    // Stars
    _fxSpawnParticles({
        count: 32, chars: ['★', '✦', '✧', '⋆', '🌟'],
        colors: ['#ffd700', '#ffe066', '#fff9c4', '#fff', '#ffc300'],
        sizeMin: 14, sizeMax: 30,
        container: overlay,
        startX: cx, startY: cy,
        spreadX: r.width, spreadY: r.height,
        duration: 1600, cssClass: 'fx-artifact-star',
    });

    const icon = document.createElement('div');
    icon.textContent = '🌟';
    icon.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);font-size:88px;pointer-events:none;z-index:331;animation:fx-artifact-icon 1.8s ease-out forwards;`;
    r.wrap.appendChild(icon);
    setTimeout(() => icon.remove(), 2200);

    Audio_Manager.playSFX('codex_of_completion');
}


// ════════════════════════════════════════════════════════════════
//  CURSED ITEM EFFECTS
// ════════════════════════════════════════════════════════════════

// ☠️ Cursed Reveal — sickly green skull flash + ✕ marks dissolve.
function _fxCursedReveal() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 1600, 'z-index:325;');

    const tint = document.createElement('div');
    tint.className = 'fx-cursed-tint';
    tint.style.cssText = `position:absolute;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;`;
    overlay.appendChild(tint);

    const skull = document.createElement('div');
    skull.textContent = '☠️';
    skull.style.cssText = `position:absolute;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;transform:translate(-50%,-50%);font-size:72px;pointer-events:none;z-index:327;animation:fx-skull-rise 1.1s ease-out forwards;`;
    r.wrap.appendChild(skull);
    setTimeout(() => skull.remove(), 1400);

    // Dissolving ✕ particles
    _fxSpawnParticles({
        count: 16, chars: ['✕', '✗', '×'],
        colors: ['#f44', '#ff6666', '#cc0000'],
        sizeMin: 16, sizeMax: 26,
        container: overlay,
        startX: r.left + r.width / 2, startY: r.top + r.height / 2,
        spreadX: r.width, spreadY: r.height,
        duration: 900, cssClass: 'fx-cursed-cross',
    });

    Audio_Manager.playSFX('cursed_lens');
}

// 💀 Cursed Time — dark miasma + clock hands spin wildly.
function _fxCursedTime() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 1800, 'z-index:325;');

    // Dark fog tendrils from all four corners
    const corners = [
        { top: r.top, left: r.left },
        { top: r.top, left: r.right },
        { top: r.bottom, left: r.left },
        { top: r.bottom, left: r.right },
    ];
    corners.forEach((pos, i) => {
        const fog = document.createElement('div');
        fog.className = 'fx-cursed-fog';
        fog.style.cssText = `position:absolute;left:${pos.left}px;top:${pos.top}px;animation:fx-fog-bloom 1.2s ease-out ${i * 0.15}s forwards;`;
        overlay.appendChild(fog);
    });

    const skull = document.createElement('div');
    skull.textContent = '💀';
    skull.style.cssText = `position:absolute;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;transform:translate(-50%,-50%);font-size:68px;pointer-events:none;z-index:327;animation:fx-skull-rise 0.9s ease-out forwards;`;
    r.wrap.appendChild(skull);
    setTimeout(() => skull.remove(), 1400);

    Audio_Manager.playSFX('cursed_clock');
}

// 👁️ Cursed Shield — demonic eye opens, then rows black out.
function _fxCursedShield() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 1600, 'z-index:325;');

    const eye = document.createElement('div');
    eye.textContent = '👁️';
    eye.style.cssText = `position:absolute;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;transform:translate(-50%,-50%);font-size:80px;pointer-events:none;z-index:327;animation:fx-eye-open 1.3s ease-out forwards;`;
    r.wrap.appendChild(eye);

    // Dark red scan lines creeping down
    for (let i = 0; i < 5; i++) {
        const line = document.createElement('div');
        line.className = 'fx-eye-scanline';
        line.style.cssText = `
            position:absolute;left:${r.left}px;width:${r.width}px;
            top:${r.top + (r.height / 5) * i}px; height:${r.height / 5}px;
            animation:fx-scanline-darken 0.5s ease-in ${0.6 + i * 0.1}s forwards;
        `;
        overlay.appendChild(line);
    }

    setTimeout(() => eye.remove(), 1800);

    Audio_Manager.playSFX('demon_eye');
}

// 🌊 Tidal Wave — waves of blue sweep across the grid multiple times.
function _fxTidalWave() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 2000, 'z-index:325;');

    // Three successive wave sweeps
    for (let wave = 0; wave < 3; wave++) {
        setTimeout(() => {
            const w = document.createElement('div');
            w.className = 'fx-tidal-wave';
            w.style.cssText = `
                position:absolute;
                top:${r.top}px;
                height:${r.height}px;
                left:${r.left - r.width}px;
                width:${r.width * 1.3}px;
                animation:fx-wave-sweep 0.7s ease-in forwards;
                --wave-dist:${r.width * 2.5}px;
                opacity:${0.7 - wave * 0.18};
            `;
            overlay.appendChild(w);
        }, wave * 280);
    }

    // 🌊 icon
    const icon = document.createElement('div');
    icon.textContent = '🌊';
    icon.style.cssText = `position:absolute;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;transform:translate(-50%,-50%);font-size:72px;pointer-events:none;z-index:327;animation:fx-icon-pop 0.55s ease-out 0.2s forwards;opacity:0;`;
    r.wrap.appendChild(icon);
    setTimeout(() => icon.remove(), 1200);

    Audio_Manager.playSFX('tidal_wave');
}

// 🌪️ Vortex — spinning tornado sweeps columns.
function _fxVortex() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 2000, 'z-index:325;');
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;

    // Swirling debris particles
    _fxSpawnParticles({
        count: 28, chars: ['○', '◌', '◯', '·', '▪'],
        colors: ['#aaa', '#ccc', '#888', '#ddd', '#fff'],
        sizeMin: 10, sizeMax: 20,
        container: overlay,
        startX: cx, startY: cy,
        spreadX: r.width * 0.8, spreadY: r.height * 0.8,
        duration: 1400, cssClass: 'fx-vortex-debris',
    });

    // Vortex icon
    const icon = document.createElement('div');
    icon.textContent = '🌪️';
    icon.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);font-size:80px;pointer-events:none;z-index:327;animation:fx-vortex-spin 1.4s ease-out forwards;`;
    r.wrap.appendChild(icon);
    setTimeout(() => icon.remove(), 1800);

    // Dark "sucked in" column strips
    const cols = cur?.grid?.[0]?.length || 5;
    const colW = r.width / cols;
    for (let i = 0; i < Math.min(cols, 8); i++) {
        const strip = document.createElement('div');
        strip.className = 'fx-vortex-strip';
        strip.style.cssText = `
            position:absolute;
            top:${r.top}px; height:${r.height}px;
            left:${r.left + colW * i}px; width:${colW}px;
            animation:fx-vortex-strip-swirl 0.9s ease-in ${i * 0.06}s forwards;
        `;
        overlay.appendChild(strip);
    }

    Audio_Manager.playSFX('vortex');
}

// 💥 Chaos Grid — multicolour explosions detonate across the entire grid.
function _fxChaosGrid() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 2200, 'z-index:325;');

    // Random explosion bursts
    const colours = ['#e74c3c', '#f39c12', '#9b59b6', '#3498db', '#2ecc71', '#e91e63'];
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const blast = document.createElement('div');
            blast.className = 'fx-chaos-blast';
            blast.style.cssText = `
                position:absolute;
                left:${r.left + Math.random() * r.width}px;
                top:${r.top + Math.random() * r.height}px;
                --blast-color:${colours[Math.floor(Math.random() * colours.length)]};
                animation:fx-chaos-explode 0.5s ease-out forwards;
            `;
            overlay.appendChild(blast);

            // Shrapnel
            _fxSpawnParticles({
                count: 8, chars: ['★', '✦', '▪', '●'],
                colors: [blast.style.getPropertyValue('--blast-color'), '#fff'],
                sizeMin: 8, sizeMax: 16,
                container: overlay,
                startX: parseFloat(blast.style.left),
                startY: parseFloat(blast.style.top),
                spreadX: 50, spreadY: 50,
                duration: 600, cssClass: 'fx-chaos-shard',
            });
        }, i * 180);
    }

    const icon = document.createElement('div');
    icon.textContent = '💥';
    icon.style.cssText = `position:absolute;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;transform:translate(-50%,-50%);font-size:80px;pointer-events:none;z-index:330;animation:fx-artifact-icon 1.2s ease-out forwards;`;
    r.wrap.appendChild(icon);
    setTimeout(() => icon.remove(), 1600);

    Audio_Manager.playSFX('chaos_grid');
}





// ════════════════════════════════════════════════════════════════
//  PEARL / GOLDEN CLOCK / THE WITCH / SHADOW SEAL EFFECTS
// ════════════════════════════════════════════════════════════════

// 🔵 Pearl of Haste / 🟣 Pearl of Swiftness / ⚪ Grand Pearl — iridescent ripple burst
function _fxPearl(color, sfxKey) {
    Audio_Manager.playSFX(sfxKey);
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 1400);
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;

    for (let i = 0; i < 5; i++) {
        const ring = document.createElement('div');
        ring.className = 'fx-shield-ring'; // reuse shield ring CSS
        ring.style.cssText = `
            position:absolute; left:${cx}px; top:${cy}px;
            transform:translate(-50%,-50%) scale(0);
            border-color:${color};
            box-shadow:0 0 8px ${color};
            animation:fx-shield-ring-expand 0.9s ease-out ${i * 0.14}s forwards;
            --ring-max:${Math.max(r.width, r.height) * 0.7}px;
        `;
        overlay.appendChild(ring);
    }
    const icon = document.createElement('div');
    icon.textContent = color === '#88aaff' ? '🔵' : color === '#cc88ff' ? '🟣' : '⚪';
    icon.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);font-size:64px;pointer-events:none;z-index:327;animation:fx-icon-pop 0.6s ease-out forwards;`;
    r.wrap.appendChild(icon);
    setTimeout(() => icon.remove(), 1000);
}

// 🧙 The Witch — purple smoky swirl
function _fxTheWitch() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 2000, 'z-index:325;');
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;

    _fxSpawnParticles({
        count: 24, chars: ['✦', '◆', '★', '·'],
        colors: ['#9b59b6', '#c39bd3', '#6c3483', '#d7bde2', '#fff'],
        sizeMin: 12, sizeMax: 22,
        container: overlay,
        startX: cx, startY: cy,
        spreadX: r.width * 0.9, spreadY: r.height * 0.9,
        duration: 1400, cssClass: 'fx-artifact-star',
    });

    const icon = document.createElement('div');
    icon.textContent = '🧙';
    icon.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);font-size:80px;pointer-events:none;z-index:327;animation:fx-skull-rise 1.2s ease-out forwards;`;
    r.wrap.appendChild(icon);
    setTimeout(() => icon.remove(), 1600);

    Audio_Manager.playSFX('the_witch');
}

// 🕰️ Golden Clock — gold radial burst + clock glow
function _fxGoldenClock() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    _fxClock(); // reuse existing clock effect but then add a gold tint overlay
    const overlay = _fxOverlay(r.wrap, 2000, 'z-index:324;');
    const fill = document.createElement('div');
    fill.style.cssText = `position:absolute;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;background:rgba(255,215,0,0.12);border:2px solid rgba(255,215,0,0.4);animation:fx-artifact-fill 2s ease-out forwards;`;
    overlay.appendChild(fill);

    Audio_Manager.playSFX('golden_clock');
}

// 🌑 Shadow Seal — dark void engulfs the puzzle
function _fxShadowSeal() {
    const r = _fxGetPuzzleRect();
    if (!r) return;
    const overlay = _fxOverlay(r.wrap, 2200, 'z-index:325;');

    const veil = document.createElement('div');
    veil.style.cssText = `position:absolute;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;background:rgba(0,0,0,0);animation:fx-shadow-seal-veil 1.5s ease-in forwards;`;
    overlay.appendChild(veil);

    _fxSpawnParticles({
        count: 20, chars: ['●', '◯', '·', '▪'],
        colors: ['#111', '#333', '#222', '#444'],
        sizeMin: 8, sizeMax: 18,
        container: overlay,
        startX: r.left + r.width / 2, startY: r.top + r.height / 2,
        spreadX: r.width, spreadY: r.height,
        duration: 1600, cssClass: 'fx-cursed-cross',
    });

    const icon = document.createElement('div');
    icon.textContent = '🌑';
    icon.style.cssText = `position:absolute;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;transform:translate(-50%,-50%);font-size:88px;pointer-events:none;z-index:330;animation:fx-artifact-icon 1.8s ease-out forwards;`;
    r.wrap.appendChild(icon);
    setTimeout(() => icon.remove(), 2200);

    Audio_Manager.playSFX('shadow_seal');
}