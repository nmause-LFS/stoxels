// ═══════════════════════════════════════════════
//  TUTORIAL  (tutorial.js)
//  A step-by-step interactive tutorial that walks
//  the player through the game UI before they can
//  access any levels. Completing it sets
//  STATE.tutorialDone = true and saves.
//
//  Each step highlights a region of the screen,
//  draws a pointer arrow, and shows a text bubble.
//  The player clicks "NEXT" (or the highlighted
//  element itself) to advance.
// ═══════════════════════════════════════════════

// tutStep — index of the currently displayed step (0-based)
let tutStep = 0;

// TUTORIAL_STEPS — ordered list of tutorial steps.
//   Each step has:
//     targetId   — id of the DOM element to highlight (null = no highlight)
//     titleKey   — translation key for the step heading
//     textKey    — translation key for the body text
//     arrowDir   — 'top'|'bottom'|'left'|'right'|'none' — which side the
//                  arrow points FROM (the bubble appears on the opposite side)
//     demoAction — optional function called when this step is shown,
//                  e.g. to animate something
const TUTORIAL_STEPS = [
    {
        targetId: null,
        titleKey: 'tut2_s0_title',
        textKey: 'tut2_s0_text',
        arrowDir: 'none'
    },
    {
        targetId: 'screen-game',          // the whole game screen layout
        titleKey: 'tut2_s1_title',
        textKey: 'tut2_s1_text',
        arrowDir: 'none'
    },
    {
        targetId: 'tut-ptable-wrap',      // puzzle grid area (injected during tut)
        titleKey: 'tut2_s2_title',
        textKey: 'tut2_s2_text',
        arrowDir: 'bottom'
    },
    {
        targetId: 'tut-clue-row',
        titleKey: 'tut2_s3_title',
        textKey: 'tut2_s3_text',
        arrowDir: 'bottom'
    },
    {
        targetId: 'tut-clue-col',
        titleKey: 'tut2_s4_title',
        textKey: 'tut2_s4_text',
        arrowDir: 'right'
    },
    {
        targetId: 'tut-timer-row',
        titleKey: 'tut2_s5_title',
        textKey: 'tut2_s5_text',
        arrowDir: 'top'
    },
    {
        targetId: 'tut-penalty-area',
        titleKey: 'tut2_s6_title',
        textKey: 'tut2_s6_text',
        arrowDir: 'top'
    },
    {
        targetId: 'tut-bonus-sidebar',
        titleKey: 'tut2_s7_title',
        textKey: 'tut2_s7_text',
        arrowDir: 'left'
    },
    {
        targetId: 'tut-inv-strip',
        titleKey: 'tut2_s8_title',
        textKey: 'tut2_s8_text',
        arrowDir: 'top'
    },
    {
        targetId: 'tut-diff-mods',
        titleKey: 'tut2_s9_title',
        textKey: 'tut2_s9_text',
        arrowDir: 'top'
    },
    {
        targetId: null,
        titleKey: 'tut2_s10_title',
        textKey: 'tut2_s10_text',
        arrowDir: 'none'
    },
];


// ═══════════════════════════════════════════════
//  LAUNCH  &  TEARDOWN
// ═══════════════════════════════════════════════

// showTutorial — entry point.  Switches to the tutorial screen,
//   injects the demo game layout, and shows step 0.
function showTutorialScreen() {
    tutStep = 0;
    ss('screen-tutorial');
    buildTutorialDemo();
    renderTutStep();
}

// buildTutorialDemo — populates #tut-demo-area with a miniature but real
//   representation of the game screen so we can point at actual elements.
//   Uses ids prefixed with 'tut-' so they don't collide with the live game.
function buildTutorialDemo() {
    const area = document.getElementById('tut-demo-area');
    area.innerHTML = `
        <div class="tut-game-mock">

            <!-- Top meta bar -->
            <div class="tut-meta-bar" id="tut-diff-mods">
                <span class="tut-lvl-label">LVL T-1</span>
                <span class="tut-pen-area" id="tut-penalty-area">−30s (#1)</span>
                <div style="flex:1"></div>
                <span class="tut-score-val">142 <span style="font-size:8px;opacity:.6">SCORE</span></span>
                <button class="tut-back-btn">◀ LEVELS</button>
            </div>

            <!-- Puzzle + sidebar row -->
            <div class="tut-puzzle-row">

                <!-- Puzzle scaler area -->
                <div class="tut-puzzle-area" id="tut-ptable-wrap">

                    <!-- HUD above grid -->
                    <div class="tut-puzzle-hud">
                        <div class="tut-timer-row" id="tut-timer-row">
                            <span>⏱</span>
                            <span class="tut-timer-val" id="tut-timer-display">08:42</span>
                        </div>
                        <div class="tut-hint-text">typical event notation</div>
                        <div class="tut-mod-tags" id="tut-mod-tags">
                            <span class="mod-tag tt">⏱ TIME TRIAL</span>
                            <span class="mod-tag diff">NORMAL</span>
                        </div>
                    </div>

                    <!-- Mini nonogram grid (5×5 demo — the letter A) -->
                    <div class="tut-nonogram" id="tut-nonogram">
                        ${buildDemoGrid()}
                    </div>

                </div>

                <!-- Bonus sidebar -->
                <div class="tut-bonus-sidebar" id="tut-bonus-sidebar">
                    <div class="tut-bonus-label">🎯 BONUS</div>
                    <div class="tut-bonus-hint">Finish in under 20s</div>
                </div>

            </div>

            <!-- Inventory strip -->
            <div class="tut-inv-strip" id="tut-inv-strip">
                <div class="tut-inv-header">🎒 INVENTORY — click an item to use it</div>
                <div class="tut-inv-items">
                    <div class="tut-inv-item">🔦 <span>Candle</span> <small>COMMON · Reveals 1 tile</small></div>
                    <div class="tut-inv-item">🛡️ <span>Shield</span> <small>UNCOMMON · Blocks next mistake</small></div>
                    <div class="tut-inv-item">⏳ <span>+30s Hourglass</span> <small>COMMON · +30 seconds</small></div>
                </div>
            </div>

        </div>`;

    // Animate the demo timer ticking
    startDemoTimer();

    // Add the row/col clue highlight targets as overlays
    addClueHighlightTargets();
}

// buildDemoGrid — returns the HTML for a 5×5 demo nonogram showing the letter A.
//   The grid includes row clues and column clues so every UI element can be
//   pointed at. Cells are just divs — no real game logic attached.
function buildDemoGrid() {
    // Solution for demo: letter A pattern
    const sol = [
        [0, 1, 1, 1, 0],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1]
    ];
    const RC = sol.map(row => {
        const r = []; let c = 0;
        for (const v of row) { if (v) c++; else if (c) { r.push(c); c = 0; } }
        if (c) r.push(c);
        return r.length ? r : [0];
    });
    const CC = Array.from({ length: 5 }, (_, ci) => {
        const col = sol.map(r => r[ci]);
        const r = []; let c = 0;
        for (const v of col) { if (v) c++; else if (c) { r.push(c); c = 0; } }
        if (c) r.push(c);
        return r.length ? r : [0];
    });
    const mcd = Math.max(...CC.map(c => c.length));
    const mrw = Math.max(...RC.map(r => r.length));

    let h = '<table class="tut-ptable">';

    // Column clue rows
    for (let d = 0; d < mcd; d++) {
        const isFirst = (d === 0);
        h += `<tr id="${isFirst ? 'tut-clue-col' : ''}">` + Array(mrw).fill('<td class="corner"></td>').join('');
        for (let col = 0; col < 5; col++) {
            const off = mcd - CC[col].length;
            const num = d >= off ? CC[col][d - off] : null;
            h += `<td class="cch">${num !== null ? `<div class="ccinner"><span>${num}</span></div>` : ''}</td>`;
        }
        h += '</tr>';
    }

    // Puzzle rows
    sol.forEach((row, ri) => {
        const rc = RC[ri];
        const pad = mrw - rc.length;
        const isFirst = (ri === 0);
        h += `<tr id="${isFirst ? 'tut-clue-row' : ''}">`;
        for (let i = 0; i < pad; i++) h += '<td class="corner"></td>';
        rc.forEach(n => {
            h += `<td class="rct"><div class="rcinner"><span>${n}</span></div></td>`;
        });
        row.forEach((v, ci) => {
            const filled = v === 1 ? 'filled' : '';
            h += `<td><div class="gc ${filled}" style="width:36px;height:36px"></div></td>`;
        });
        h += '</tr>';
    });
    h += '</table>';
    return h;
}

// addClueHighlightTargets — wraps no-id clue rows/cols with id anchors so
//   the highlight system can find them. Called after buildDemoGrid injects
//   the HTML into the DOM.
function addClueHighlightTargets() {
    // IDs are already set inline in buildDemoGrid via the id="" attributes
    // This function is a hook for any post-injection work needed.
}

// Demo timer animation — counts down from 8:42 for visual realism
let demoTimerInt = null;
let demoTimerSecs = 522; // 8:42
function startDemoTimer() {
    if (demoTimerInt) clearInterval(demoTimerInt);
    demoTimerSecs = 522;
    demoTimerInt = setInterval(() => {
        if (!document.getElementById('tut-timer-display')) { clearInterval(demoTimerInt); return; }
        demoTimerSecs = Math.max(0, demoTimerSecs - 1);
        const m = Math.floor(demoTimerSecs / 60);
        const s = demoTimerSecs % 60;
        const el = document.getElementById('tut-timer-display');
        if (el) el.textContent = String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }, 1000);
}

function stopDemoTimer() {
    if (demoTimerInt) { clearInterval(demoTimerInt); demoTimerInt = null; }
}


// ═══════════════════════════════════════════════
//  STEP RENDERER
// ═══════════════════════════════════════════════

// renderTutStep — reads TUTORIAL_STEPS[tutStep] and:
//   1. Removes all existing highlight overlays and bubbles.
//   2. If step has a targetId, finds that element and draws a highlight
//      rectangle over it, then positions the text bubble.
//   3. Updates the step counter and Next/Done button label.
function renderTutStep() {
    const step = TUTORIAL_STEPS[tutStep];
    clearTutHighlights();

    // Update step counter text
    document.getElementById('tut-step-counter').textContent =
        `${tutStep + 1} / ${TUTORIAL_STEPS.length}`;

    // Update next/done button
    const nextBtn = document.getElementById('tut-next-btn');
    const isLast = tutStep === TUTORIAL_STEPS.length - 1;
    nextBtn.textContent = isLast ? (LANG === 'de' ? 'FERTIG ▶' : 'START PLAYING ▶') : (LANG === 'de' ? 'WEITER ▶' : 'NEXT ▶');
    nextBtn.onclick = isLast ? finishTutorial : advanceTutStep;

    // Update bubble title & text
    document.getElementById('tut-bubble-title').textContent = t(step.titleKey);
    document.getElementById('tut-bubble-text').innerHTML = t(step.textKey);

    // If no target, just show centred bubble and no highlight
    if (!step.targetId) {
        document.getElementById('tut-bubble').className = 'tut-bubble tut-bubble-center';
        return;
    }

    const target = document.getElementById(step.targetId);
    if (!target) {
        document.getElementById('tut-bubble').className = 'tut-bubble tut-bubble-center';
        return;
    }

    // Highlight the target element
    highlightElement(target, step.arrowDir);
}

// highlightElement — places a glowing border overlay on top of the target
//   element using its bounding rect, then positions the text bubble on the
//   appropriate side with an SVG arrow connecting them.
function highlightElement(el, arrowDir) {
    const demoArea = document.getElementById('tut-demo-area');
    const demoRect = demoArea.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    // Create highlight box
    const hl = document.createElement('div');
    hl.className = 'tut-highlight';
    hl.style.cssText = `
        left:   ${elRect.left - demoRect.left - 4}px;
        top:    ${elRect.top - demoRect.top  - 4}px;
        width:  ${elRect.width + 8}px;
        height: ${elRect.height + 8}px;
    `;
    demoArea.appendChild(hl);

    // Position the bubble on the opposite side from the arrow
    const bubble = document.getElementById('tut-bubble');
    bubble.className = 'tut-bubble tut-bubble-' + arrowDir;

    // Draw the SVG arrow connecting highlight to bubble
    drawArrow(demoArea, demoRect, elRect, arrowDir);
}

// drawArrow — creates an SVG line+arrowhead from the edge of the highlighted
//   element toward the bubble, giving a clear visual connection.
function drawArrow(container, containerRect, targetRect, dir) {
    const existing = container.querySelector('.tut-arrow-svg');
    if (existing) existing.remove();

    // Relative coords of target centre within the demo area
    const cx = targetRect.left - containerRect.left + targetRect.width / 2;
    const cy = targetRect.top - containerRect.top + targetRect.height / 2;

    // Determine arrow start: edge of the target bounding box
    const offsets = {
        top: { x: cx, y: targetRect.top - containerRect.top },
        bottom: { x: cx, y: targetRect.bottom - containerRect.top },
        left: { x: targetRect.left - containerRect.left, y: cy },
        right: { x: targetRect.right - containerRect.left, y: cy },
        none: null
    };
    const start = offsets[dir] || null;
    if (!start) return;

    // Arrow end: 40px beyond the edge in the same direction
    const vectors = { top: [0, -44], bottom: [0, 44], left: [-44, 0], right: [44, 0] };
    const [dx, dy] = vectors[dir] || [0, 0];
    const end = { x: start.x + dx, y: start.y + dy };

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'tut-arrow-svg');
    svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:visible;';

    // Arrowhead marker
    svg.innerHTML = `
        <defs>
            <marker id="ah" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent)"/>
            </marker>
        </defs>
        <line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}"
              stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="5,3"
              marker-end="url(#ah)"/>`;
    container.appendChild(svg);
}

// clearTutHighlights — removes all dynamically inserted highlight divs and arrows.
function clearTutHighlights() {
    document.querySelectorAll('.tut-highlight, .tut-arrow-svg').forEach(el => el.remove());
}


// ═══════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════

function advanceTutStep() {
    if (tutStep < TUTORIAL_STEPS.length - 1) {
        tutStep++;
        renderTutStep();
    }
}

function prevTutStep() {
    if (tutStep > 0) {
        tutStep--;
        renderTutStep();
    }
}

// finishTutorial — marks tutorial complete, saves, and goes to level select.
function finishTutorial() {
    STATE.tutorialDone = true;
    save();
    stopDemoTimer();
    clearTutHighlights();
    // Navigate to setup → levels so they can pick a level
    startSetup();
}