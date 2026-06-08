//------------------------------------------------------------------------
//----------------------------CONSTANTS-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// The 5×5 pixel pattern used for the demo nonogram (spells the letter A).
const DEMO_SOLUTION = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
];

// TUTORIAL_STEPS — ordered list of tutorial steps.
//   Each step has:
//     targetId        — id of the DOM element to highlight (null = no highlight)
//     titleKey        — translation key for the step heading
//     textKey         — translation key for the body text
//     arrowDir        — 'top'|'bottom'|'left'|'right'|'none' — which side the
//                       arrow points FROM (the bubble appears on the opposite side)
//     highlightOffset — optional {top, left} nudge applied to the highlight box
const TUTORIAL_STEPS = [
    { targetId: null, titleKey: 'tut2_s0_title', textKey: 'tut2_s0_text', arrowDir: 'none' },
    { targetId: 'screen-game', titleKey: 'tut2_s1_title', textKey: 'tut2_s1_text', arrowDir: 'none' },
    { targetId: 'tut-ptable-wrap', titleKey: 'tut2_s2_title', textKey: 'tut2_s2_text', arrowDir: 'none' },
    { targetId: 'tut-clue-row', titleKey: 'tut2_s3_title', textKey: 'tut2_s3_text', arrowDir: 'none' },
    { targetId: 'tut-clue-col', titleKey: 'tut2_s4_title', textKey: 'tut2_s4_text', arrowDir: 'none' },
    { targetId: 'tut-timer-row', titleKey: 'tut2_s5_title', textKey: 'tut2_s5_text', arrowDir: 'none' },
    { targetId: 'tut-penalty-area', titleKey: 'tut2_s6_title', textKey: 'tut2_s6_text', arrowDir: 'none' },
    { targetId: 'tut-bonus-sidebar', titleKey: 'tut2_s7_title', textKey: 'tut2_s7_text', arrowDir: 'none' },
    { targetId: 'tut-inv-strip', titleKey: 'tut2_s8_title', textKey: 'tut2_s8_text', arrowDir: 'none' },
    { targetId: 'tut-diff-mods', titleKey: 'tut2_s9_title', textKey: 'tut2_s9_text', arrowDir: 'none' },
    { targetId: null, titleKey: 'tut2_s10_title', textKey: 'tut2_s10_text', arrowDir: 'none' },
];

// Arrow length in pixels — how far the dashed line extends from the element edge.
const ARROW_LENGTH_PX = 44;

// Highlight box padding in pixels — how much the glow box extends beyond the element.
const HIGHLIGHT_PAD_PX = 4;

// Demo timer starting value in seconds (30 minutes, counts down for visual effect).
const DEMO_TIMER_START_SECS = 1800;




//------------------------------------------------------------------------
//----------------------------STATE---------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// tutStep — index of the currently displayed tutorial step (0-based).
let tutStep = 0;

// demoTimerInt — interval handle for the fake countdown timer in the demo.
let demoTimerInt = null;

// demoTimerSecs — current remaining seconds on the demo timer.
let demoTimerSecs = DEMO_TIMER_START_SECS;




//------------------------------------------------------------------------
//------------------------ENTRY POINTS------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// showTutorial — called from the title screen.
//   Skips the tutorial and goes straight to setup if already completed.
function showTutorial() {
    if (STATE.tutorialDone) {
        showSetup();
        return;
    }
    screenHistory.push('screen-title');
    showTutorialScreen();
}

// showTutorialScreen — switches to the tutorial screen, builds the demo
//   game layout, and shows the first step.
function showTutorialScreen() {
    tutStep = 0;
    switchScreen('screen-tutorial');
    buildTutorialDemo();
    renderTutStep();
}




//------------------------------------------------------------------------
//--------------------DEMO LAYOUT BUILDERS--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// buildMetaBar — returns the HTML for the top bar showing level label,
//   penalty counter, score, and back button.
//   id="tut-diff-mods" lets the tutorial highlight this whole bar as one unit.
function buildMetaBar() {
    const scoreLabel = LANG === 'de' ? 'Punkte' : 'SCORE';
    return `
        <div class="tut-meta-bar" id="tut-diff-mods">
            <span class="tut-lvl-label">LVL T-1</span>
            <span class="tut-pen-area" id="tut-penalty-area">−30s (#1)</span>
            <div style="flex:1"></div>
            <span class="tut-score-val">142 <span style="font-size:8px;opacity:.6">${scoreLabel}</span></span>
            <button class="tut-back-btn">◀ LEVELS</button>
        </div>`;
}

// buildPuzzleHud — returns the HTML for the timer row, event label, and
//   difficulty/mode tags that sit above the nonogram grid.
function buildPuzzleHud() {
    const eventLabel = LANG === 'de' ? 'Ereignis' : 'Event';
    return `
        <div class="tut-puzzle-hud">
            <div class="tut-timer-row" id="tut-timer-row">
                <span>⏱</span>
                <span class="tut-timer-val" id="tut-timer-display">30:00</span>
            </div>
            <div class="tut-hint-text">${eventLabel}</div>
            <div class="tut-mod-tags" id="tut-mod-tags">
                <span class="mod-tag tt">⏱ TIME TRIAL</span>
                <span class="mod-tag diff">NORMAL</span>
            </div>
        </div>`;
}

// buildPuzzleArea — returns the HTML for the central puzzle section:
//   the HUD (timer, event label, mod tags) and the 5×5 demo nonogram grid.
function buildPuzzleArea() {
    return `
        <div class="tut-puzzle-area" id="tut-ptable-wrap">
            ${buildPuzzleHud()}
            <div class="tut-nonogram" id="tut-nonogram">
                ${buildDemoGrid()}
            </div>
        </div>`;
}

// buildBonusSidebar — returns the HTML for the bonus objective sidebar.
function buildBonusSidebar() {
    const bonusHint = LANG === 'de' ? 'In unter 20 Sek. abschließen' : 'Finish in under 20s';
    return `
        <div class="tut-bonus-sidebar" id="tut-bonus-sidebar">
            <div class="tut-bonus-label">🎯 BONUS</div>
            <div class="tut-bonus-hint">${bonusHint}</div>
        </div>`;
}

// buildInventoryStrip — returns the HTML for the inventory bar at the bottom
//   showing three example items.
function buildInventoryStrip() {
    const invLabel = LANG === 'de' ? 'Inventar' : 'Inventory';
    return `
        <div class="tut-inv-strip" id="tut-inv-strip">
            <div class="tut-inv-header">🎒 ${invLabel}</div>
            <div class="tut-inv-items">
                <div class="tut-inv-item">🔦 <span>Candle</span> <small>COMMON · Reveals 1 tile</small></div>
                <div class="tut-inv-item">🛡️ <span>Shield</span> <small>UNCOMMON · Blocks next mistake</small></div>
                <div class="tut-inv-item">⏳ <span>+30s Hourglass</span> <small>COMMON · +30 seconds</small></div>
            </div>
        </div>`;
}

// buildTutorialDemo — assembles the full mock game screen inside
//   #tut-demo-area by combining all section builders, then starts the timer.
function buildTutorialDemo() {
    const area = document.getElementById('tut-demo-area');
    area.innerHTML = `
        <div class="tut-game-mock">
            ${buildMetaBar()}
            <div class="tut-puzzle-row">
                ${buildPuzzleArea()}
                ${buildBonusSidebar()}
            </div>
            ${buildInventoryStrip()}
        </div>`;

    startDemoTimer();
}




//------------------------------------------------------------------------
//---------------------DEMO GRID BUILDER----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// computeRunLengths — converts a binary array (a single row or column) into
//   an array of run-length numbers, e.g. [1,1,0,1,1,1] → [2,3].
//   Returns [0] if the line is entirely empty.
function computeRunLengths(line) {
    const runs = [];
    let count = 0;
    for (const v of line) {
        if (v) {
            count++;
        } else if (count) {
            runs.push(count);
            count = 0;
        }
    }
    if (count) runs.push(count);
    return runs.length ? runs : [0];
}

// computeRowClues — returns an array of run-length arrays, one per row.
function computeRowClues(solution) {
    return solution.map(row => computeRunLengths(row));
}

// computeColClues — returns an array of run-length arrays, one per column.
function computeColClues(solution) {
    const colCount = solution[0].length;
    return Array.from({ length: colCount }, (_, ci) => {
        const col = solution.map(row => row[ci]);
        return computeRunLengths(col);
    });
}

// buildColClueCell — returns the HTML for a single column-clue <td>.
//   Shows the clue number inside a styled div, or an empty cell if this
//   depth slot is above where this column's clues start.
function buildColClueCell(clue, depth, maxDepth) {
    const offset = maxDepth - clue.length;
    const num = depth >= offset ? clue[depth - offset] : null;
    const inner = num !== null ? `<div class="ccinner"><span>${num}</span></div>` : '';
    return `<td class="cch">${inner}</td>`;
}

// buildColClueRows — returns the HTML <tr> rows that display column clue
//   numbers above the grid.
//   The very first row gets id="tut-clue-col" so the tutorial can highlight it.
function buildColClueRows(colClues, cornerCount) {
    const maxDepth = Math.max(...colClues.map(c => c.length));
    let html = '';

    for (let d = 0; d < maxDepth; d++) {
        const rowId = d === 0 ? 'id="tut-clue-col"' : '';
        html += `<tr ${rowId}>`;
        html += Array(cornerCount).fill('<td class="corner"></td>').join('');
        for (const clue of colClues) {
            html += buildColClueCell(clue, d, maxDepth);
        }
        html += '</tr>';
    }
    return html;
}

// buildRowClueCell — returns the HTML for a single row-clue <td>.
function buildRowClueCell(n) {
    return `<td class="rct"><div class="rcinner"><span>${n}</span></div></td>`;
}

// buildGridCell — returns the HTML for a single puzzle grid <td>.
//   Filled cells get the 'filled' class.
function buildGridCell(value) {
    const filled = value === 1 ? 'filled' : '';
    return `<td><div class="gc ${filled}" style="width:36px;height:36px"></div></td>`;
}

// buildPuzzleRows — returns the HTML <tr> rows for the puzzle itself,
//   including inline row clue cells on the left and filled/empty grid cells.
//   The first puzzle row gets id="tut-clue-row" so the tutorial can highlight it.
function buildPuzzleRows(solution, rowClues) {
    const maxClueWidth = Math.max(...rowClues.map(r => r.length));
    let html = '';

    solution.forEach((row, ri) => {
        const clue = rowClues[ri];
        const padding = maxClueWidth - clue.length;
        const rowId = ri === 0 ? 'id="tut-clue-row"' : '';

        html += `<tr ${rowId}>`;
        for (let i = 0; i < padding; i++) html += '<td class="corner"></td>';
        clue.forEach(n => { html += buildRowClueCell(n); });
        row.forEach(v => { html += buildGridCell(v); });
        html += '</tr>';
    });
    return html;
}

// buildDemoGrid — assembles the full nonogram <table> HTML by combining
//   column clue rows and puzzle rows, derived from DEMO_SOLUTION.
function buildDemoGrid() {
    const rowClues = computeRowClues(DEMO_SOLUTION);
    const colClues = computeColClues(DEMO_SOLUTION);
    const maxClueWidth = Math.max(...rowClues.map(r => r.length));

    return '<table class="tut-ptable">'
        + buildColClueRows(colClues, maxClueWidth)
        + buildPuzzleRows(DEMO_SOLUTION, rowClues)
        + '</table>';
}




//------------------------------------------------------------------------
//------------------------DEMO TIMER--------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// formatDemoTime — converts a number of seconds into a MM:SS string.
function formatDemoTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

// tickDemoTimer — decrements the timer by one second and updates the display.
//   Stops the interval automatically if the display element is gone (e.g.
//   the tutorial screen was closed without calling stopDemoTimer).
function tickDemoTimer() {
    const el = document.getElementById('tut-timer-display');
    if (!el) {
        clearInterval(demoTimerInt);
        return;
    }
    demoTimerSecs = Math.max(0, demoTimerSecs - 1);
    el.textContent = formatDemoTime(demoTimerSecs);
}

// startDemoTimer — resets and begins a 1-second countdown on the demo timer
//   display, purely for visual effect. Updates the display immediately so
//   there is no one-second flash before the first tick.
function startDemoTimer() {
    if (demoTimerInt) clearInterval(demoTimerInt);
    demoTimerSecs = DEMO_TIMER_START_SECS;

    const el = document.getElementById('tut-timer-display');
    if (el) el.textContent = formatDemoTime(demoTimerSecs);

    demoTimerInt = setInterval(tickDemoTimer, 1000);
}

// stopDemoTimer — cancels the demo timer interval.
function stopDemoTimer() {
    if (demoTimerInt) {
        clearInterval(demoTimerInt);
        demoTimerInt = null;
    }
}




//------------------------------------------------------------------------
//------------------------STEP UI UPDATERS--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// updateStepCounter — updates the "X / Y" step counter in the UI.
function updateStepCounter() {
    document.getElementById('tut-step-counter').textContent =
        `${tutStep + 1} / ${TUTORIAL_STEPS.length}`;
}

// updateNextButton — updates the label on the next/finish button to reflect
//   whether this is the last step.
//   NOTE: Does NOT reassign onclick — the button's handler in HTML calls
//   advanceTutStep(), which decides whether to advance or finish.
//   Reassigning onclick here would stack with the HTML handler and fire twice.
function updateNextButton() {
    const isLast = tutStep === TUTORIAL_STEPS.length - 1;
    document.getElementById('tut-next-btn').textContent = isLast
        ? (LANG === 'de' ? 'FERTIG ▶' : 'START PLAYING ▶')
        : (LANG === 'de' ? 'WEITER ▶' : 'NEXT ▶');
}

// updateBubbleContent — fills the text bubble with the translated title and
//   body text for the given step object.
function updateBubbleContent(step) {
    document.getElementById('tut-bubble-title').textContent = t(step.titleKey);
    document.getElementById('tut-bubble-text').innerHTML = t(step.textKey);
}

// renderTutStep — orchestrates rendering the current step:
//   clears old highlights, updates the counter, button, and bubble,
//   then applies a highlight to the step's target element if one is set.
function renderTutStep() {
    const step = TUTORIAL_STEPS[tutStep];
    clearStepHighlights();
    updateStepCounter();
    updateNextButton();
    updateBubbleContent(step);

    if (step.targetId) {
        const target = document.getElementById(step.targetId);
        if (target) applyStepHighlight(target, step.arrowDir, step.highlightOffset);
    }
}




//------------------------------------------------------------------------
//--------------------HIGHLIGHT & ARROW OVERLAY---------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// getScrollOffset — returns the current scroll position of the demo mock
//   container as {top, left}, used to correct element coordinates.
function getScrollOffset(container) {
    return { top: container.scrollTop, left: container.scrollLeft };
}

// buildHighlightStyles — returns a cssText string that positions the
//   highlight box over the target element, with optional nudge offsets.
function buildHighlightStyles(containerRect, targetRect, scroll, offset = {}) {
    const nudgeTop = offset.top ?? 0;
    const nudgeLeft = offset.left ?? 0;
    const left = targetRect.left - containerRect.left + scroll.left - HIGHLIGHT_PAD_PX + nudgeLeft;
    const top = targetRect.top - containerRect.top + scroll.top - HIGHLIGHT_PAD_PX + nudgeTop;
    const width = targetRect.width + HIGHLIGHT_PAD_PX * 2;
    const height = targetRect.height + HIGHLIGHT_PAD_PX * 2;
    return `left:${left}px; top:${top}px; width:${width}px; height:${height}px;`;
}

// createHighlightBox — appends a glowing div overlay that frames the target
//   element inside the given container.
function createHighlightBox(container, containerRect, targetRect, scroll, offset) {
    const hl = document.createElement('div');
    hl.className = 'tut-highlight';
    hl.style.cssText = buildHighlightStyles(containerRect, targetRect, scroll, offset);
    container.appendChild(hl);
}

// getArrowStartPoint — returns the {x, y} point on the edge of the target
//   element from which the arrow should originate, relative to the container.
//   Returns null for direction 'none' or an unrecognised direction.
function getArrowStartPoint(containerRect, targetRect, dir, scroll) {
    const cx = targetRect.left - containerRect.left + scroll.left + targetRect.width / 2;
    const cy = targetRect.top - containerRect.top + scroll.top + targetRect.height / 2;
    const edgePoints = {
        top: { x: cx, y: targetRect.top - containerRect.top + scroll.top },
        bottom: { x: cx, y: targetRect.bottom - containerRect.top + scroll.top },
        left: { x: targetRect.left - containerRect.left + scroll.left, y: cy },
        right: { x: targetRect.right - containerRect.left + scroll.left, y: cy },
    };
    return edgePoints[dir] ?? null;
}

// getArrowEndPoint — returns the {x, y} point ARROW_LENGTH_PX beyond the
//   start in the given direction, where the arrowhead will be drawn.
function getArrowEndPoint(start, dir) {
    const vectors = { top: [0, -1], bottom: [0, 1], left: [-1, 0], right: [1, 0] };
    const [dx, dy] = vectors[dir] ?? [0, 0];
    return { x: start.x + dx * ARROW_LENGTH_PX, y: start.y + dy * ARROW_LENGTH_PX };
}

// createArrowSVG — builds and returns an SVG element with a dashed line and
//   an arrowhead marker, positioned to cover the entire container.
function createArrowSVG(start, end) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'tut-arrow-svg');
    svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:visible;';
    svg.innerHTML = `
        <defs>
            <marker id="ah" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent)"/>
            </marker>
        </defs>
        <line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}"
              stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="5,3"
              marker-end="url(#ah)"/>`;
    return svg;
}

// drawStepArrow — computes start/end points and appends a directional arrow
//   SVG to the container, replacing any existing one.
function drawStepArrow(container, containerRect, targetRect, dir, scroll) {
    const existing = container.querySelector('.tut-arrow-svg');
    if (existing) existing.remove();

    const start = getArrowStartPoint(containerRect, targetRect, dir, scroll);
    if (!start) return;

    const end = getArrowEndPoint(start, dir);
    container.appendChild(createArrowSVG(start, end));
}

// clearStepHighlights — removes all dynamically inserted highlight boxes and
//   arrow SVGs from the demo area.
function clearStepHighlights() {
    document.querySelectorAll('.tut-highlight, .tut-arrow-svg').forEach(el => el.remove());
}

// applyStepHighlight — places a glowing border overlay on the target element
//   and draws a pointer arrow in the given direction.
//   Uses .tut-game-mock as the positioning container (must have position:relative
//   in CSS) so all coordinates are relative to the mock frame, not the padded
//   outer demo area.
function applyStepHighlight(el, arrowDir, highlightOffset) {
    const container = document.querySelector('.tut-game-mock');
    const containerRect = container.getBoundingClientRect();
    const targetRect = el.getBoundingClientRect();
    const scroll = getScrollOffset(container);

    createHighlightBox(container, containerRect, targetRect, scroll, highlightOffset);
    drawStepArrow(container, containerRect, targetRect, arrowDir, scroll);
}




//------------------------------------------------------------------------
//---------------------------NAVIGATION-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// advanceTutStep — moves to the next step, or finishes the tutorial when
//   on the last step. Called directly by the Next button's onclick in HTML.
function advanceTutStep() {
    if (tutStep === TUTORIAL_STEPS.length - 1) {
        finishTutorial();
        return;
    }
    tutStep++;
    renderTutStep();
}

// prevTutStep — moves to the previous step if one exists.
function prevTutStep() {
    if (tutStep > 0) {
        tutStep--;
        renderTutStep();
    }
}

// finishTutorial — marks the tutorial as completed, persists the save,
//   cleans up the timer and overlays, and navigates to the level select screen.
function finishTutorial() {
    STATE.tutorialDone = true;
    save();
    stopDemoTimer();
    clearStepHighlights();
    showSetup();
}