//todo: properly clean up this file



let tutStep = 0;        // tutStep — index of the currently displayed step (0-based)


let demoTimerInt = null;
let demoTimerSecs = 1800; // 30min



// TUTORIAL_STEPS — ordered list of tutorial steps.
//   Each step has:
//     targetId   — id of the DOM element to highlight (null = no highlight)
//     titleKey   — translation key for the step heading
//     textKey    — translation key for the body text
//     arrowDir   — 'top'|'bottom'|'left'|'right'|'none' — which side the
//                  arrow points FROM (the bubble appears on the opposite side)
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




//------------------------------------------------------------------------
//----------------------SHOW TUTORIAL-------------------------------------
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
    ss('screen-tutorial');
    buildTutorialDemo();
    renderTutStep();
}


//------------------------------------------------------------------------
//---------------------DEMO LAYOUT BUILDERS-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// buildTutorialDemo — assembles the full mock game screen inside
//   #tut-demo-area by combining all section builders.
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

// buildMetaBar — returns the HTML for the top bar showing level label,
//   penalty counter, score, and back button.
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

// buildPuzzleArea — returns the HTML for the central puzzle section:
//   the HUD (timer, event label, mod tags) and the 5×5 demo nonogram grid.
function buildPuzzleArea() {
    const eventLabel = LANG === 'de' ? 'Ereignis' : 'Event';
    return `
        <div class="tut-puzzle-area" id="tut-ptable-wrap">
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
            </div>
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


//------------------------------------------------------------------------
//--------------------DEMO GRID BUILDER-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// DEMO_SOLUTION — the 5×5 pixel pattern for the letter A.
const DEMO_SOLUTION = [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
];

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
    const cols = solution[0].length;
    return Array.from({ length: cols }, (_, ci) => {
        const col = solution.map(row => row[ci]);
        return computeRunLengths(col);
    });
}

// buildColClueRows — returns the HTML <tr> rows that display column clue
//   numbers above the grid. The first row gets id="tut-clue-col" so the
//   tutorial highlight system can target it.
function buildColClueRows(colClues, cornerCount) {
    const maxColDepth = Math.max(...colClues.map(c => c.length));
    let html = '';
    for (let d = 0; d < maxColDepth; d++) {
        const rowId = d === 0 ? 'tut-clue-col' : '';
        html += `<tr id="${rowId}">`;
        html += Array(cornerCount).fill('<td class="corner"></td>').join('');
        for (const clue of colClues) {
            const offset = maxColDepth - clue.length;
            const num = d >= offset ? clue[d - offset] : null;
            html += `<td class="cch">${num !== null ? `<div class="ccinner"><span>${num}</span></div>` : ''}</td>`;
        }
        html += '</tr>';
    }
    return html;
}

// buildPuzzleRows — returns the HTML <tr> rows for the puzzle itself,
//   including inline row clue cells and filled/empty grid cells.
//   The first puzzle row gets id="tut-clue-row".
function buildPuzzleRows(solution, rowClues) {
    const maxRowWidth = Math.max(...rowClues.map(r => r.length));
    let html = '';
    solution.forEach((row, ri) => {
        const clue = rowClues[ri];
        const padding = maxRowWidth - clue.length;
        const rowId = ri === 0 ? 'tut-clue-row' : '';
        html += `<tr id="${rowId}">`;
        for (let i = 0; i < padding; i++) html += '<td class="corner"></td>';
        clue.forEach(n => {
            html += `<td class="rct"><div class="rcinner"><span>${n}</span></div></td>`;
        });
        row.forEach(v => {
            const filled = v === 1 ? 'filled' : '';
            html += `<td><div class="gc ${filled}" style="width:36px;height:36px"></div></td>`;
        });
        html += '</tr>';
    });
    return html;
}

// buildDemoGrid — assembles the full nonogram <table> HTML by combining
//   column clue rows and puzzle rows.
function buildDemoGrid() {
    const rowClues = computeRowClues(DEMO_SOLUTION);
    const colClues = computeColClues(DEMO_SOLUTION);
    const maxRowWidth = Math.max(...rowClues.map(r => r.length));

    return '<table class="tut-ptable">'
        + buildColClueRows(colClues, maxRowWidth)
        + buildPuzzleRows(DEMO_SOLUTION, rowClues)
        + '</table>';
}

//------------------------------------------------------------------------
//-----------------DEMO TIMER---------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------




// startDemoTimer — begins a 1-second interval that counts down the demo
//   timer display from 8:42, purely for visual effect.
function startDemoTimer() {
    if (demoTimerInt) clearInterval(demoTimerInt);
    demoTimerSecs = 1800;

    // set display immediately so there's no 1-second flash
    const el = document.getElementById('tut-timer-display');
    if (el) el.textContent = formatDemoTime(demoTimerSecs);
    demoTimerInt = setInterval(() => {
        const el = document.getElementById('tut-timer-display');
        if (!el) { clearInterval(demoTimerInt); return; }
        demoTimerSecs = Math.max(0, demoTimerSecs - 1);
        el.textContent = formatDemoTime(demoTimerSecs);
    }, 1000);
}

// stopDemoTimer — cancels the demo timer interval.
function stopDemoTimer() {
    if (demoTimerInt) { clearInterval(demoTimerInt); demoTimerInt = null; }
}

// formatDemoTime — converts a number of seconds into a MM:SS string.
function formatDemoTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}




//------------------------------------------------------------------------
//-----------------------STEP RENDERER------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// renderTutStep — orchestrates rendering the current step:
//   clears old highlights, updates the counter, button, bubble content,
//   and optionally highlights a target element.
function renderTutStep() {
    const step = TUTORIAL_STEPS[tutStep];
    clearTutHighlights();
    updateStepCounter();
    updateNextButton();
    updateBubbleContent(step);

    // Highlight the target element for this step, if there is one
    if (step.targetId) {
        const target = document.getElementById(step.targetId);
        if (target) highlightElement(target, step.arrowDir, step.highlightOffset);
    }
}

// updateStepCounter — updates the "X / Y" step counter in the UI.
function updateStepCounter() {
    document.getElementById('tut-step-counter').textContent =
        `${tutStep + 1} / ${TUTORIAL_STEPS.length}`;
}

// updateNextButton — updates the label on the next/finish button.
//   Does NOT reassign onclick — the button's handler calls advanceTutStep(),
//   which internally decides whether to advance or finish. Reassigning onclick
//   here would stack with any onclick already set in the HTML and fire twice.
function updateNextButton() {
    const nextBtn = document.getElementById('tut-next-btn');
    const isLast = tutStep === TUTORIAL_STEPS.length - 1;
    nextBtn.textContent = isLast
        ? (LANG === 'de' ? 'FERTIG ▶' : 'START PLAYING ▶')
        : (LANG === 'de' ? 'WEITER ▶' : 'NEXT ▶');
}

// updateBubbleContent — fills the text bubble with the translated title and
//   body text for the given step.
function updateBubbleContent(step) {
    document.getElementById('tut-bubble-title').textContent = t(step.titleKey);
    document.getElementById('tut-bubble-text').innerHTML = t(step.textKey);
}




//------------------------------------------------------------------------
//---------------------HIGHLIGHT & ARROW----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// highlightElement — places a glowing border overlay on top of the target
//   element, positions the text bubble beside it, and draws a pointer arrow.
//   Uses .tut-game-mock as the positioning container (needs position:relative
//   in CSS) so coordinates are relative to the mock frame, not the outer
//   demo area which is padded and centred.
function highlightElement(el, arrowDir, highlightOffset, bubbleOffset) {
    const container = document.querySelector('.tut-game-mock');
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const scrollTop = container.scrollTop;
    const scrollLeft = container.scrollLeft;

    createHighlightBox(container, containerRect, elRect, scrollTop, scrollLeft, highlightOffset);
    drawArrow(container, containerRect, elRect, arrowDir, scrollTop, scrollLeft);
}

// createHighlightBox — appends a glowing div overlay that frames the target
//   element, offset by 4px on each side for visual padding.
//   scrollTop/Left correct for any scroll offset inside the demo container.
function createHighlightBox(container, containerRect, targetRect, scrollTop, scrollLeft, offset = {}) {
    const nudgeTop = offset.top ?? 0;
    const nudgeLeft = offset.left ?? 0;
    const hl = document.createElement('div');
    hl.className = 'tut-highlight';
    hl.style.cssText = `
        left:   ${targetRect.left - containerRect.left + scrollLeft - 4 + nudgeLeft}px;
        top:    ${targetRect.top - containerRect.top + scrollTop - 4 + nudgeTop}px;
        width:  ${targetRect.width + 8}px;
        height: ${targetRect.height + 8}px;
    `;
    container.appendChild(hl);
}




// drawArrow — creates and appends an SVG dashed line with an arrowhead
//   pointing from the edge of the highlighted element outward.
function drawArrow(container, containerRect, targetRect, dir, scrollTop, scrollLeft) {
    const existing = container.querySelector('.tut-arrow-svg');
    if (existing) existing.remove();

    const start = getArrowStartPoint(containerRect, targetRect, dir, scrollTop, scrollLeft);
    if (!start) return;

    const end = getArrowEndPoint(start, dir);
    container.appendChild(createArrowSVG(start, end));
}

// getArrowStartPoint — returns the {x, y} point on the edge of the target
//   element from which the arrow should originate, relative to the container.
//   scrollTop/Left correct for any scroll offset inside the demo container.
//   Returns null for direction 'none'.
function getArrowStartPoint(containerRect, targetRect, dir, scrollTop, scrollLeft) {
    const cx = targetRect.left - containerRect.left + scrollLeft + targetRect.width / 2;
    const cy = targetRect.top - containerRect.top + scrollTop + targetRect.height / 2;
    const points = {
        top: { x: cx, y: targetRect.top - containerRect.top + scrollTop },
        bottom: { x: cx, y: targetRect.bottom - containerRect.top + scrollTop },
        left: { x: targetRect.left - containerRect.left + scrollLeft, y: cy },
        right: { x: targetRect.right - containerRect.left + scrollLeft, y: cy },
    };
    return points[dir] || null;
}

// getArrowEndPoint — returns the {x, y} point 44px beyond the start point
//   in the given direction, where the arrowhead will be drawn.
function getArrowEndPoint(start, dir) {
    const vectors = { top: [0, -44], bottom: [0, 44], left: [-44, 0], right: [44, 0] };
    const [dx, dy] = vectors[dir] || [0, 0];
    return { x: start.x + dx, y: start.y + dy };
}

// createArrowSVG — builds and returns an SVG element with a dashed line and
//   an arrowhead marker, ready to be appended to the demo area.
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

// clearTutHighlights — removes all dynamically inserted highlight boxes and
//   arrow SVGs from the demo area.
function clearTutHighlights() {
    document.querySelectorAll('.tut-highlight, .tut-arrow-svg').forEach(el => el.remove());
}






//------------------------------------------------------------------------
//-------------------------NAVIGATION-------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// advanceTutStep — moves to the next step, or finishes the tutorial if on
//   the last step. Called directly by the Next button's onclick in HTML.
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

// finishTutorial — marks the tutorial as completed, saves, cleans up,
//   and navigates to the level select screen.
function finishTutorial() {
    STATE.tutorialDone = true;
    save();
    stopDemoTimer();
    clearTutHighlights();
    showSetup();
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




























