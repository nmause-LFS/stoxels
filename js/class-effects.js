







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




//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------






//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------





// ═══════════════════════════════════════════════
//  ABILITY VISUAL EFFECTS
// ═══════════════════════════════════════════════

// _startBlizzardEffect — creates a snowflake blizzard overlay for Absolute Zero.
function _startBlizzardEffect(durationMs) {
    // Remove any existing blizzard
    document.getElementById('ability-blizzard-overlay')?.remove();
    document.getElementById('ability-ice-tint')?.remove();

    const tint = document.createElement('div');
    tint.id = 'ability-ice-tint';
    document.body.appendChild(tint);

    const overlay = document.createElement('div');
    overlay.id = 'ability-blizzard-overlay';
    document.body.appendChild(overlay);

    const flakeChars = ['❄', '❅', '❆', '✦', '·'];
    const flakeCount = 60;
    const spawnInterval = durationMs / flakeCount;

    let spawned = 0;
    const spawnTimer = setInterval(() => {
        if (spawned >= flakeCount) { clearInterval(spawnTimer); return; }
        spawned++;

        const flake = document.createElement('div');
        flake.className = 'blizzard-flake';
        flake.textContent = flakeChars[Math.floor(Math.random() * flakeChars.length)];
        flake.style.left = (Math.random() * 100) + 'vw';
        flake.style.fontSize = (10 + Math.random() * 14) + 'px';
        flake.style.animationDuration = (1.5 + Math.random() * 2) + 's';
        flake.style.animationDelay = (Math.random() * 0.5) + 's';
        overlay.appendChild(flake);
    }, spawnInterval);

    setTimeout(() => {
        overlay.style.transition = 'opacity 0.8s';
        tint.style.transition = 'opacity 0.8s';
        overlay.style.opacity = '0';
        tint.style.opacity = '0';
        setTimeout(() => { overlay.remove(); tint.remove(); }, 800);
    }, durationMs);
}

// _playSlashEffect — red slashes sweep across the puzzle grid area for Data Strike.
//   vertical=true → column strike (vertical slashes), else row strike (horizontal).
function _playSlashEffect(vertical = false) {
    const wrap = document.getElementById('puzzle-scaler');
    if (!wrap) return;
    if (!wrap.style.position || wrap.style.position === 'static') wrap.style.position = 'relative';

    // Find the actual grid area by measuring the first and last grid cells
    const sol = cur?.grid;
    if (!sol) return;
    const rows = sol.length, cols = sol[0].length;

    const firstCell = document.getElementById('g-0-0');
    const lastCell = document.getElementById(`g-${rows - 1}-${cols - 1}`);
    if (!firstCell || !lastCell) return;

    const wrapRect = wrap.getBoundingClientRect();
    const zoom = currentZoom || 1;

    const gridTop = (firstCell.getBoundingClientRect().top - wrapRect.top) / zoom;
    const gridLeft = (firstCell.getBoundingClientRect().left - wrapRect.left) / zoom;
    const gridBottom = (lastCell.getBoundingClientRect().bottom - wrapRect.top) / zoom;
    const gridRight = (lastCell.getBoundingClientRect().right - wrapRect.left) / zoom;
    const gridH = gridBottom - gridTop;
    const gridW = gridRight - gridLeft;

    const slashCount = 3;

    for (let i = 0; i < slashCount; i++) {
        const slash = document.createElement('div');
        slash.style.cssText = `
            position: absolute;
            pointer-events: none;
            z-index: 300;
            border-radius: 3px;
            opacity: 0;
            animation: slash-sweep ${0.55}s ease-out forwards;
            animation-delay: ${i * 0.12}s;
            box-shadow: 0 0 18px 4px rgba(231,76,60,0.7), 0 0 40px 8px rgba(231,76,60,0.35);
        `;

        if (!vertical) {
            // Horizontal slashes evenly spaced across grid height
            const yPos = gridTop + (gridH / (slashCount + 1)) * (i + 1) - 3;
            slash.style.left = gridLeft + 'px';
            slash.style.width = gridW + 'px';
            slash.style.top = yPos + 'px';
            slash.style.height = '6px';
            slash.style.background = 'linear-gradient(90deg, transparent 0%, #e74c3c 30%, #fff 50%, #e74c3c 70%, transparent 100%)';
        } else {
            // Vertical slashes evenly spaced across grid width
            const xPos = gridLeft + (gridW / (slashCount + 1)) * (i + 1) - 3;
            slash.style.top = gridTop + 'px';
            slash.style.height = gridH + 'px';
            slash.style.left = xPos + 'px';
            slash.style.width = '6px';
            slash.style.background = 'linear-gradient(180deg, transparent 0%, #e74c3c 30%, #fff 50%, #e74c3c 70%, transparent 100%)';
        }

        wrap.appendChild(slash);
        setTimeout(() => slash.remove(), 900 + i * 120);
    }
}


// _playDiagonalSlashEffect — diagonal red slash(es) through the clicked cell.
//   diagonalCount=1 → main diagonal only (↘, 45°)
//   diagonalCount=2 → both diagonals (↘ + ↙)
//   diagonalCount=4 → both diagonals + H + V lines (rank 3)
//   row/col tell us exactly where to anchor the slash.

function _playDiagonalSlashEffect(row, col, diagonalCount) {
    const wrap = document.getElementById('puzzle-scaler');
    if (!wrap) return;
    if (!wrap.style.position || wrap.style.position === 'static') wrap.style.position = 'relative';

    const sol = cur?.grid;
    if (!sol) return;
    const rows = sol.length, cols = sol[0].length;

    const cellEl = document.getElementById(`g-${row}-${col}`);
    if (!cellEl) return;

    const wrapRect = wrap.getBoundingClientRect();
    const cellRect = cellEl.getBoundingClientRect();
    const zoom = currentZoom || 1;

    // Centre of clicked cell in logical pixels inside the scaler
    const cx = (cellRect.left + cellRect.width / 2 - wrapRect.left) / zoom;
    const cy = (cellRect.top + cellRect.height / 2 - wrapRect.top) / zoom;

    // Grid extents for diagonal length calculation
    const firstCell = document.getElementById('g-0-0');
    const lastCell = document.getElementById(`g-${rows - 1}-${cols - 1}`);
    if (!firstCell || !lastCell) return;

    const gridW = (lastCell.getBoundingClientRect().right - firstCell.getBoundingClientRect().left) / zoom;
    const gridH = (lastCell.getBoundingClientRect().bottom - firstCell.getBoundingClientRect().top) / zoom;
    const diagLen = Math.sqrt(gridW * gridW + gridH * gridH) * 1.15;

    const container = document.createElement('div');
    container.style.cssText = `
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 300;
        overflow: hidden;
    `;
    wrap.appendChild(container);

    // Each slash is a thin bar centred on the clicked cell, rotated to the right angle.
    // We animate opacity directly (no clip-path) so rotation doesn't break the animation.
    const makeSlash = (deg, delay) => {
        const s = document.createElement('div');
        s.style.cssText = `
            position: absolute;
            width: 5px;
            height: ${diagLen}px;
            left: ${cx - 2.5}px;
            top:  ${cy - diagLen / 2}px;
            transform-origin: center center;
            transform: rotate(${deg}deg);
            background: linear-gradient(
                180deg,
                transparent 0%,
                #e74c3c 20%,
                #ffffff 50%,
                #e74c3c 80%,
                transparent 100%
            );
            box-shadow: 0 0 10px 3px rgba(231,76,60,0.7), 0 0 24px 6px rgba(231,76,60,0.35);
            border-radius: 3px;
            opacity: 0;
            animation: diag-fade-in-out 0.65s ease-out ${delay}s forwards;
        `;
        container.appendChild(s);
    };

    // Rank 1 → main diagonal ↘ (135°)
    makeSlash(135, 0);

    // Rank 2 → add anti-diagonal ↙ (45°)
    if (diagonalCount >= 2) makeSlash(45, 0.1);

    // Rank 3 → also horizontal (0°) and vertical (90°)
    if (diagonalCount >= 4) {
        makeSlash(0, 0.05);
        makeSlash(90, 0.15);
    }

    setTimeout(() => container.remove(), 1200);
}

// _spawnArcaneSparkles — floats sparkle emojis up from revealed cells.
function _spawnArcaneSparkles(cellIds) {
    const wrap = document.getElementById('puzzle-scaler');
    if (!wrap) return;

    // Ensure wrap is a positioning context
    if (!wrap.style.position || wrap.style.position === 'static') wrap.style.position = 'relative';

    const wrapRect = wrap.getBoundingClientRect();
    const zoom = currentZoom || 1;
    const sparkleChars = ['✦', '✧', '⋆', '★', '◆', '🔮'];

    // Limit to first 20 so it doesn't overwhelm on large reveals
    cellIds.slice(0, 20).forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const rect = el.getBoundingClientRect();

        // Convert screen-pixel position to logical pixels inside scaler
        const cx = (rect.left + rect.width / 2 - wrapRect.left) / zoom;
        const cy = (rect.top + rect.height / 2 - wrapRect.top) / zoom;

        const count = 2 + Math.floor(Math.random() * 2);
        for (let j = 0; j < count; j++) {
            setTimeout(() => {
                const sp = document.createElement('div');
                sp.className = 'arcane-sparkle';
                sp.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
                sp.style.cssText = `
                    position: absolute;
                    left: ${cx + (Math.random() - 0.5) * 28}px;
                    top: ${cy + (Math.random() - 0.5) * 20}px;
                    color: ${['#c39bd3', '#9b59b6', '#a29bfe', '#d6a2e8'][Math.floor(Math.random() * 4)]};
                    font-size: 16px;
                    pointer-events: none;
                    z-index: 310;
                    user-select: none;
                    animation: sparkle-burst ${0.5 + Math.random() * 0.4}s ease-out forwards;
                `;
                wrap.appendChild(sp);
                setTimeout(() => sp.remove(), 900);
            }, i * 18 + j * 40);
        }
    });
}

// _playPrecisionMarkEffect — green crosshair lines pulse through the targeted row/col.
function _playPrecisionMarkEffect(row, col) {
    const wrap = document.getElementById('puzzle-scaler');
    if (!wrap) return;

    // Make sure wrap is a positioning context
    const prevPosition = wrap.style.position;
    if (!prevPosition || prevPosition === 'static') wrap.style.position = 'relative';

    const cellEl = document.getElementById(`g-${row}-${col}`);
    if (!cellEl) return;

    // getBoundingClientRect() returns screen pixels (after CSS scale).
    // We need logical pixels (before scale) for positioning inside wrap.
    const wrapRect = wrap.getBoundingClientRect();
    const cellRect = cellEl.getBoundingClientRect();
    const zoom = currentZoom || 1;

    // Convert screen-pixel offsets to logical pixels inside the scaler
    const centerY = (cellRect.top + cellRect.height / 2 - wrapRect.top) / zoom;
    const centerX = (cellRect.left + cellRect.width / 2 - wrapRect.left) / zoom;

    // Horizontal line spanning the full width of the scaler
    const lineH = document.createElement('div');
    lineH.className = 'precision-line-h';
    lineH.style.cssText = `
        position:absolute;
        top:${centerY - 1.5}px;
        left:0; right:0;
        height:3px;
        pointer-events:none;
        z-index:305;
    `;
    wrap.appendChild(lineH);

    // Vertical line spanning the full height of the scaler
    const lineV = document.createElement('div');
    lineV.className = 'precision-line-v';
    lineV.style.cssText = `
        position:absolute;
        left:${centerX - 1.5}px;
        top:0; bottom:0;
        width:3px;
        pointer-events:none;
        z-index:305;
    `;
    wrap.appendChild(lineV);

    setTimeout(() => { lineH.remove(); lineV.remove(); }, 700);
}

// _playScanBeamEffect — a glowing green beam sweeps over the scan region top-to-bottom.
function _playScanBeamEffect(startRow, startCol, scanSize, durationMs) {
    const wrap = document.getElementById('puzzle-scaler');
    if (!wrap) return;

    const prevPosition = wrap.style.position;
    if (!prevPosition || prevPosition === 'static') wrap.style.position = 'relative';

    const rows = cur?.grid?.length || 99;
    const endRow = Math.min(startRow + scanSize - 1, rows - 1);

    const topCellEl = document.getElementById(`g-${startRow}-${startCol}`);
    const botCellEl = document.getElementById(`g-${endRow}-${startCol}`);
    if (!topCellEl || !botCellEl) return;

    const wrapRect = wrap.getBoundingClientRect();
    const topRect = topCellEl.getBoundingClientRect();
    const botRect = botCellEl.getBoundingClientRect();
    const zoom = currentZoom || 1;

    // Convert to logical pixels inside the scaler
    const regionTop = (topRect.top - wrapRect.top) / zoom;
    const regionBottom = (botRect.bottom - wrapRect.top) / zoom;
    const regionHeight = regionBottom - regionTop;

    const beamH = 40; // px, logical

    // Remove any leftover beam + style from a previous cast
    document.getElementById('ability-scan-beam')?.remove();
    document.getElementById('scan-beam-style')?.remove();

    // Inject a fresh keyframe that travels exactly from top to bottom of region
    const styleTag = document.createElement('style');
    styleTag.id = 'scan-beam-style';
    styleTag.textContent = `
        @keyframes scan-beam-move-dynamic {
            0%   { opacity: 0;   top: ${regionTop}px; }
            6%   { opacity: 1; }
            94%  { opacity: 1; }
            100% { opacity: 0;   top: ${regionTop + Math.max(0, regionHeight - beamH)}px; }
        }
    `;
    document.head.appendChild(styleTag);

    const beam = document.createElement('div');
    beam.id = 'ability-scan-beam';
    beam.style.cssText = `
        position: absolute;
        left: 0; right: 0;
        height: ${beamH}px;
        top: ${regionTop}px;
        pointer-events: none;
        z-index: 308;
        background: linear-gradient(180deg,
            rgba(39,174,96,0) 0%,
            rgba(39,174,96,0.55) 40%,
            rgba(150,255,200,0.85) 50%,
            rgba(39,174,96,0.55) 60%,
            rgba(39,174,96,0) 100%
        );
        box-shadow: 0 0 24px 6px rgba(39,174,96,0.4);
        animation: scan-beam-move-dynamic ${durationMs}ms linear forwards;
    `;

    wrap.appendChild(beam);
    setTimeout(() => { beam.remove(); styleTag.remove(); }, durationMs + 150);
}

