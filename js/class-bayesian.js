//------------------------------------------------------------------------
//--------------------ASCENDENCY SKILL IMPLEMENTATIONS--------------------
//-------------------------------BAYESIAN CLASS---------------------------
//------------------------------------------------------------------------



//------------------------------------------------------------------------
//--------------------------------BAYES TRAPS-----------------------------
//------------------------------------------------------------------------


const BAYES_FUSE_SECONDS = 10;   // time to place all traps before detonation
const BAYES_FUSE_PENALTY = 60;   // seconds lost per unplaced trap at detonation

// Entry point 

function _executeBayesTraps(trapCount, availableTraps) {
    if (!cur) return;
    if (typeof hideHUDTooltip === 'function') hideHUDTooltip();
    if (typeof hideLsClassTooltip === 'function') hideLsClassTooltip();

    // Cancel any lingering previous activation
    _bayesTrapsCleanup(false);

    window._bayesTrapsState = {
        trapCount,
        availableTraps: [...availableTraps],
        trapsQueue: [],   // filled during 'select' phase
        phase: 'select',
        fuseTimer: null,
        fuseRemaining: BAYES_FUSE_SECONDS,
        placedCount: 0,
        currentTrapIdx: 0,
    };

    _bayesTrapsShowSelectPhase();
}


// PHASE 1: Trap Selection
// Player picks a trap type for each of their N slots. They may pick the
// same type multiple times if they want.

function _bayesTrapsShowSelectPhase() {
    document.getElementById('bayes-traps-overlay')?.remove();

    const state = window._bayesTrapsState;
    if (!state) return;

    const selected = state.trapsQueue.length;   // traps already chosen
    const remaining = state.trapCount - selected;

    const title = LANG === 'de' ? 'BAYES-FALLEN' : 'BAYES TRAPS';
    const slotWord = remaining === 1
        ? (LANG === 'de' ? 'Falle' : 'trap')
        : (LANG === 'de' ? 'Fallen' : 'traps');
    const prompt = LANG === 'de'
        ? `Wähle einen Typ für Falle ${selected + 1} von ${state.trapCount}:`
        : `Choose a type for trap ${selected + 1} of ${state.trapCount}:`;

    const trapBtns = state.availableTraps.map(type => {
        const info = _bayesTrapTypeInfo(type);
        return `
            <button onclick="_bayesTrapsSelectType('${type}')"
                style="font-family:var(--PX); font-size:9px; background:transparent;
                       border:1px solid ${info.color}; color:${info.color};
                       padding:8px 14px; cursor:pointer; letter-spacing:1px;
                       margin:4px; border-radius:4px; display:block; width:90%;
                       text-align:left; line-height:1.6;">
                ${info.icon} <strong>${info.label}</strong><br>
                <span style="opacity:.7; font-size:8px;">${info.hint}</span>
            </button>`;
    }).join('');

    // Show already-queued traps
    let queuedHTML = '';
    if (state.trapsQueue.length > 0) {
        const queuedLabels = state.trapsQueue.map(t => {
            const info = _bayesTrapTypeInfo(t.type);
            return `<span style="color:${info.color}">${info.icon} ${info.label}</span>`;
        }).join('  ');
        const qWord = LANG === 'de' ? 'Bereits gewählt' : 'Already chosen';
        queuedHTML = `<div style="font-family:var(--PX);font-size:9px;color:#aaa;
                           margin-bottom:10px;line-height:1.8;">
                        ${qWord}: ${queuedLabels}
                      </div>`;
    }

    const cancelLabel = LANG === 'de' ? 'ABBRECHEN' : 'CANCEL';

    const overlay = document.createElement('div');
    overlay.id = 'bayes-traps-overlay';
    overlay.className = 'modal-bg show';
    overlay.style.cssText = 'z-index:3000;';
    overlay.innerHTML = `
        <div class="modal-box" style="text-align:center; border-left:4px solid #27ae60;
             max-width:380px; max-height:80vh; overflow-y:auto;">
            <div style="font-family:var(--PX);font-size:13px;color:#27ae60;
                        letter-spacing:2px;margin-bottom:6px;">
                🧪 ${title}
            </div>
            <div style="font-family:var(--PX);font-size:10px;color:var(--accent2);
                        margin-bottom:12px;line-height:1.8;">
                ${prompt}
            </div>
            ${queuedHTML}
            <div style="display:flex;flex-direction:column;align-items:center;">
                ${trapBtns}
            </div>
            <div style="margin-top:14px;">
                <button onclick="_bayesTrapsCancel()"
                    style="font-family:var(--PX);font-size:9px;background:transparent;
                           border:1px solid #444;color:#555;padding:5px 14px;
                           cursor:pointer;letter-spacing:1px;">
                    ${cancelLabel}
                </button>
            </div>
        </div>`;
    document.body.appendChild(overlay);
    Audio_Manager.playSFX('bayesTrapSelect');
}

function _bayesTrapsSelectType(type) {
    const state = window._bayesTrapsState;
    if (!state || state.phase !== 'select') return;

    state.trapsQueue.push({ type, placed: false, r: null, c: null });

    if (state.trapsQueue.length < state.trapCount) {
        // More traps to select
        _bayesTrapsShowSelectPhase();
    } else {
        // All traps selected — move to placement phase
        _bayesTrapsStartPlacementPhase();
    }
}


// PHASE 2: Trap Placement
// Fuse starts. Player clicks grid cells to place traps one at a time.
// Unplaced traps at fuse expiry cost time.

function _bayesTrapsStartPlacementPhase() {
    document.getElementById('bayes-traps-overlay')?.remove();

    const state = window._bayesTrapsState;
    if (!state) return;
    state.phase = 'place';
    state.currentTrapIdx = 0;

    _bayesTrapsStartFuse();
    _bayesTrapsCreateCursorFollower();

    const trapInfo = _bayesTrapTypeInfo(state.trapsQueue[0].type);
    showToast(LANG === 'de'
        ? `🧪 Platziere Falle 1/${state.trapCount}: ${trapInfo.icon} ${trapInfo.label} — ${BAYES_FUSE_SECONDS}s Zündschnur!`
        : `🧪 Place trap 1/${state.trapCount}: ${trapInfo.icon} ${trapInfo.label} — ${BAYES_FUSE_SECONDS}s fuse!`);
}



function _bayesTrapsUpdatePlacementHUD() {
    // Update the cursor follower's fuse display
    _bayesTrapsUpdateCursorFollower();
    // Also refresh all placed trap indicators on the grid with new fuse time
    _bayesTrapsRefreshGridIndicators();
}

function _bayesTrapsStartFuse() {
    const state = window._bayesTrapsState;
    if (!state) return;

    state.fuseRemaining = BAYES_FUSE_SECONDS;
    state.fuseTimer = setInterval(() => {
        if (!window._bayesTrapsState) { clearInterval(state.fuseTimer); return; }
        state.fuseRemaining--;
        _bayesTrapsUpdatePlacementHUD();

        if (state.fuseRemaining <= 0) {
            clearInterval(state.fuseTimer);
            state.fuseTimer = null;
            _bayesTrapsDetonateUnplaced();
        }
    }, 1000);
}




function _bayesTrapsDetonateUnplaced() {
    const state = window._bayesTrapsState;
    if (!state) return;


    // Fire effects for all traps that WERE placed on the grid
    state.trapsQueue.filter(t => t.placed && t.r !== null).forEach(trap => {
        // Trigger the visual explosion animation based on the trap type
        _bayesTrapAnimateExplosion(trap.r, trap.c, trap.type);
        // Activate game logic mechanics
        _bayesTrapActivate(trap.type, trap.r, trap.c);
    });

    // Penalise traps that were never placed
    const unplaced = state.trapsQueue.filter(t => !t.placed).length;
    if (unplaced > 0) {
        const penalty = unplaced * BAYES_FUSE_PENALTY;
        timerSecs = Math.max(0, timerSecs - penalty);
        updTimer();
        showToast(LANG === 'de'
            ? `🧪 💥 ${unplaced} Falle(n) in der Hand explodiert! -${penalty}s`
            : `🧪 💥 ${unplaced} trap(s) detonated in hand! -${penalty}s`);

        // Visual flash
        const fl = document.getElementById('pen-flash');
        if (fl) { fl.classList.add('show'); setTimeout(() => fl.classList.remove('show'), 350); }
    } else {
        showToast(LANG === 'de' ? '🧪 💥 Alle Fallen explodiert!' : '🧪 💥 All traps detonated!');
    }

    _bayesTrapsCleanup(true);

    Audio_Manager.playSFX('bayesTrapExplosion');

        

    checkWin();

    if (timerSecs <= 0 && !dead) {
        dead = true;
        stopTimer();
        timesUp();
    }
}




// Called from Mousebutton_Handlers.js when player clicks a grid cell during placement phase.
// Returns true if the click was consumed (caller should return early).

function _bayesTrapPlacementClick(row, col) {
    const state = window._bayesTrapsState;
    if (!state || state.phase !== 'place') return false;

    // Prevent placing if we've already run through all slots but are waiting on the fuse
    if (state.currentTrapIdx >= state.trapCount) return true;

    const trap = state.trapsQueue[state.currentTrapIdx];
    trap.r = row;
    trap.c = col;
    trap.placed = true;
    state.placedCount++;

    // Draw the indicator containing both the icon and the remaining fuse time immediately on placement
    _bayesTrapDrawIndicator(row, col, trap.type);

    state.currentTrapIdx++;

    if (state.currentTrapIdx >= state.trapCount) {
        // All traps placed — remove the hand follower asset but let the fuse timer keep ticking on the grid!
        document.getElementById('bayes-trap-cursor-follower')?.remove();
        showToast(LANG === 'de'
            ? `🧪 Alle ${state.placedCount} Falle(n) platziert! Warten auf Detonation...`
            : `🧪 All ${state.placedCount} trap(s) placed! Waiting for detonation...`);

        trackAchStat('bayesTrapsAllPlaced');
    } else {
        // Next trap to place from the queue
        const nextTrap = state.trapsQueue[state.currentTrapIdx];
        const info = _bayesTrapTypeInfo(nextTrap.type);
        showToast(LANG === 'de'
            ? `🧪 Falle ${state.currentTrapIdx + 1}/${state.trapCount}: ${info.icon} ${info.label}`
            : `🧪 Trap ${state.currentTrapIdx + 1}/${state.trapCount}: ${info.icon} ${info.label}`);
        _bayesTrapsUpdateCursorFollower();
    }

    return true;
}







function _bayesTrapsCancel() {
    document.getElementById('bayes-traps-overlay')?.remove();
    const state = window._bayesTrapsState;

    if (state && state.phase === 'place') {
        const unplaced = state.trapsQueue.filter(t => !t.placed).length;
        if (unplaced > 0) {
            const penalty = unplaced * BAYES_FUSE_PENALTY;
            timerSecs = Math.max(0, timerSecs - penalty);
            updTimer();
            showToast(LANG === 'de'
                ? `🧪 💥 Abgebrochen — ${unplaced} Falle(n) explodiert! -${penalty}s`
                : `🧪 💥 Cancelled — ${unplaced} trap(s) detonated! -${penalty}s`);
        } else {
            showToast(LANG === 'de' ? '🧪 Abgebrochen.' : '🧪 Cancelled.');
        }
    } else {
        _setAbilityMode(false);
        const cd = cooldownState['active3'];
        if (cd && cd.interval) { clearInterval(cd.interval); cd.interval = null; }
        if (cd) cd.remaining = 0;
        showToast(LANG === 'de' ? '🧪 Abgebrochen.' : '🧪 Cancelled.');
    }

    _bayesTrapsCleanup(true);
}

function _bayesTrapsCleanup(buildHUD = true) {
    const state = window._bayesTrapsState;
    if (state && state.fuseTimer) {
        clearInterval(state.fuseTimer);
        state.fuseTimer = null;
    }
    window._bayesTrapsState = null;

    document.getElementById('bayes-traps-overlay')?.remove();
    document.getElementById('bayes-trap-hud')?.remove();

    // Clean up mouse move follower listeners and nodes
    if (window._bayesTrapMouseMoveHandler) {
        window.removeEventListener('mousemove', window._bayesTrapMouseMoveHandler);
        window._bayesTrapMouseMoveHandler = null;
    }
    document.getElementById('bayes-trap-cursor-follower')?.remove();

    // Remove reveal and elimination indicators from the grid
    document.querySelectorAll('.bayes-trap-indicator:not(.bayes-trap-indicator-protection)').forEach(el => el.remove());

    _setAbilityMode(false);
    if (buildHUD) buildClassHUD();
}


// Trap Type Info 

function _bayesTrapTypeInfo(type) {
    const defs = {
        reveal: {
            icon: '🪤',
            color: '#27ae60',
            label: LANG === 'de' ? 'Enthüllungsfalle' : 'Reveal Trap',
            hint: LANG === 'de'
                ? 'Enthüllt korrekte Zellen im Radius 1'
                : 'Reveals correct cells in radius 1',
        },
        elimination: {
            icon: '💣',
            color: '#e74c3c',
            label: LANG === 'de' ? 'Eliminierungsfalle' : 'Elimination Trap',
            hint: LANG === 'de'
                ? 'Markiert falsche leere Zellen horizontal und vertikal bis zu 5 Zellen entfernt'
                : 'Marks wrong empty cells horizontally and vertically up to 5 cells away',
        },
        protection: {
            icon: '🔰',
            color: '#f39c12',
            label: LANG === 'de' ? 'Schutzfalle' : 'Protection Trap',
            hint: LANG === 'de'
                ? 'Schützt die gesamte Zeile & Spalte vor Fehlern'
                : 'Protects the entire row & column from mistakes',
        },
    };
    return defs[type] || { icon: '❓', color: '#aaa', label: type, hint: '' };
}


// Trap Effects 

function _bayesTrapActivate(type, row, col) {
    switch (type) {
        case 'reveal': _bayesTrapReveal(row, col); break;
        case 'elimination': _bayesTrapElimination(row, col); break;
        case 'protection': _bayesTrapProtection(row, col); break;
    }
}

// Reveal Trap: reveals correct unfilled cells in a 1-step radius (8 neighbours + self)
function _bayesTrapReveal(row, col) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const affected = [];

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const r = row + dr, c = col + dc;
            if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
            if (sol[r][c] === 1 && !revealedGrid[r][c] && userGrid[r][c] !== 1) {
                revealedGrid[r][c] = true;
                userGrid[r][c] = 1;
                renderCell(r, c);
                updClues(r, c);
                affected.push(`g-${r}-${c}`);
            }
        }
    }

    if (affected.length > 0) {
        _applyCellEffect(affected, 'reveal');
        trackAchStat('tilesRevealed', affected.length);
        questStat_classRevealUsed(affected.length);
        updateQuestStats('classAbilityUsedThisLevel', {});
        checkWin();
    } 
    
    if (typeof _adjacencyMatrixRefreshAll === 'function' && ptHasSkill('adjacency_matrix')) {
        _adjacencyMatrixRefreshAll();
    }
}

// Elimination Trap: marks wrong (sol===0) empty cells in horizontal / vertical directions up to 5 steps
function _bayesTrapElimination(row, col) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const REACH = 5;
    const affected = [];
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    for (const [dr, dc] of dirs) {
        for (let step = 1; step <= REACH; step++) {
            const r = row + dr * step, c = col + dc * step;
            if (r < 0 || r >= rows || c < 0 || c >= cols) break;
            if (sol[r][c] === 0 && (userGrid[r][c] === 0 || userGrid[r][c] === 3) && !wrongGrid[r][c]) {
                userGrid[r][c] = 2; // ✕ mark
                questStat_classMarkUsed(1);
                renderCell(r, c);
                affected.push(`g-${r}-${c}`);
            }
        }
    }

    if (affected.length > 0) {
    }
   
}

// Protection Trap: registers the row & column in the protected set.
function _bayesTrapProtection(row, col) {
    if (!window._bayesTrapProtectedLines) window._bayesTrapProtectedLines = new Set();

    const rowKey = `row:${row}`;
    const colKey = `col:${col}`;

    if (!window._bayesTrapProtectedLines.has(rowKey)) {
        window._bayesTrapProtectedLines.add(rowKey);
        _bayesTrapApplyProtectionVisual('row', row);
    }
    if (!window._bayesTrapProtectedLines.has(colKey)) {
        window._bayesTrapProtectedLines.add(colKey);
        _bayesTrapApplyProtectionVisual('col', col);
    }
}

// Draw a properly resetting shield icon across ALL cells in the row/column line
function _bayesTrapApplyProtectionVisual(type, idx) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const info = _bayesTrapTypeInfo('protection');

    if (type === 'row') {
        for (let c = 0; c < cols; c++) {
            const el = document.getElementById(`g-${idx}-${c}`);
            if (el) {
                if (!el.querySelector('.bayes-trap-indicator-protection')) {
                    const span = document.createElement('span');
                    span.className = 'bayes-trap-indicator bayes-trap-indicator-protection';
                    span.textContent = info.icon;
                    span.style.cssText = `
                        position: absolute !important; top: 2px !important; right: 2px !important;
                        font-size: 11px !important; line-height: 1 !important; pointer-events: none !important;
                        opacity: .85 !important; background: transparent !important; background-color: transparent !important;
                        border: none !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important;
                        width: auto !important; height: auto !important; display: inline-block !important; z-index: 5 !important;
                    `;
                    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
                    el.appendChild(span);
                }
            }
        }
    } else {
        for (let r = 0; r < rows; r++) {
            const el = document.getElementById(`g-${r}-${idx}`);
            if (el) {
                if (!el.querySelector('.bayes-trap-indicator-protection')) {
                    const span = document.createElement('span');
                    span.className = 'bayes-trap-indicator bayes-trap-indicator-protection';
                    span.textContent = info.icon;
                    span.style.cssText = `
                        position: absolute !important; top: 2px !important; right: 2px !important;
                        font-size: 11px !important; line-height: 1 !important; pointer-events: none !important;
                        opacity: .85 !important; background: transparent !important; background-color: transparent !important;
                        border: none !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important;
                        width: auto !important; height: auto !important; display: inline-block !important; z-index: 5 !important;
                    `;
                    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
                    el.appendChild(span);
                }
            }
        }
    }
}

// Properly remove shields when triggered, making sure overlapping line protections aren't hidden
function _bayesTrapRemoveProtectionVisual(type, idx) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;
    const lines = window._bayesTrapProtectedLines || new Set();

    if (type === 'row') {
        for (let c = 0; c < cols; c++) {
            const el = document.getElementById(`g-${idx}-${c}`);
            if (el) {
                el.classList.remove('bayes-protect-line');
                // Only delete the shield text if no horizontal/column trap covers it anymore
                if (!lines.has(`col:${c}`)) {
                    el.querySelector('.bayes-trap-indicator-protection')?.remove();
                }
            }
        }
    } else {
        for (let r = 0; r < rows; r++) {
            const el = document.getElementById(`g-${r}-${idx}`);
            if (el) {
                el.classList.remove('bayes-protect-line');
                // Only delete the shield text if no vertical/row trap covers it anymore
                if (!lines.has(`row:${r}`)) {
                    el.querySelector('.bayes-trap-indicator-protection')?.remove();
                }
            }
        }
    }
}

// Called from mousebutton_handlers.js before registering a wrong fill.
// Returns true if a Protection Trap intercepted the mistake.
function _bayesTrapProtectionIntercept(row, col) {
    const lines = window._bayesTrapProtectedLines;
    if (!lines || lines.size === 0) return false;

    const rowKey = `row:${row}`;
    const colKey = `col:${col}`;
    const matchKey = lines.has(rowKey) ? rowKey : lines.has(colKey) ? colKey : null;
    if (!matchKey) return false;

    // Auto-mark ✕ instead of mistake
    if (userGrid[row][col] === 0) {
        userGrid[row][col] = 2;
        renderCell(row, col);
        questStat_classMarkUsed(1);
    }

    // Consume this line's protection
    lines.delete(matchKey);
    const [type, idxStr] = matchKey.split(':');
    _bayesTrapRemoveProtectionVisual(type, parseInt(idxStr, 10));

    showToast(`🛡️ ${LANG === 'de'
        ? `Schutzfalle ausgelöst! Fehler blockiert in ${type === 'row' ? 'Zeile' : 'Spalte'} ${parseInt(idxStr, 10) + 1}`
        : `Protection Trap triggered! Mistake blocked in ${type} ${parseInt(idxStr, 10) + 1}`}`);

    if (window.Audio_Manager) Audio_Manager.playSFX('varianceShield');
    return true;
}


// Trap visual indicator on the cell 

//  explicit set of inline rules to completely reset layout dimensions and backgrounds



function _bayesTrapDrawIndicator(row, col, type) {
    const el = document.getElementById(`g-${row}-${col}`);
    if (!el) return;

    // Clear any previous indicators on this cell
    el.querySelectorAll('.bayes-trap-indicator').forEach(e => e.remove());

    const info = _bayesTrapTypeInfo(type);
    const state = window._bayesTrapsState;
    const secs = state ? state.fuseRemaining : 0;

    const span = document.createElement('span');
    span.className = 'bayes-trap-indicator';

    // Stack the active countdown directly above the trap icon
    span.innerHTML = `
        <span class="bayes-trap-time" style="font-size: 8px; display: block; color: #e74c3c; text-align: center; font-family: var(--PX, monospace); line-height: 1; margin-bottom: 1px; text-shadow: 1px 1px 1px rgba(0,0,0,0.7);">${secs}s</span>
        <span class="bayes-trap-icon" style="display: block; text-align: center;">${info.icon}</span>
    `;

    span.style.cssText = `
        position: absolute !important; 
        top: 50% !important; 
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        font-size: 11px !important; line-height: 1 !important; pointer-events: none !important;
        opacity: .85 !important; background: transparent !important; background-color: transparent !important;
        border: none !important; box-shadow: none !important; padding: 0 !important; margin: 0 !important;
        width: 100% !important; height: auto !important; display: inline-block !important; z-index: 5 !important;
    `;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.appendChild(span);
}






function _bayesTrapsRefreshGridIndicators() {
    const state = window._bayesTrapsState;
    if (!state) return;

    state.trapsQueue.forEach(trap => {
        if (trap.placed && trap.r !== null && trap.c !== null) {
            const el = document.getElementById(`g-${trap.r}-${trap.c}`);
            if (el) {
                const timeEl = el.querySelector('.bayes-trap-time');
                if (timeEl) {
                    timeEl.textContent = `${state.fuseRemaining}s`;
                }
            }
        }
    });
}



// Cursor Follower Core Engine 



function _bayesTrapsCreateCursorFollower() {
    document.getElementById('bayes-trap-cursor-follower')?.remove();

    const follower = document.createElement('div');
    follower.id = 'bayes-trap-cursor-follower';
    follower.style.cssText = `
        position: fixed;
        pointer-events: none;
        z-index: 10000;
        font-size: 20px;
        transform: translate(14px, 14px);
        line-height: 1;
        opacity: 0.9;
        transition: opacity 0.1s;
        display: flex;
        flex-direction: column;
        align-items: center;
    `;

    const state = window._bayesTrapsState;
    if (state && state.trapsQueue[state.currentTrapIdx]) {
        const info = _bayesTrapTypeInfo(state.trapsQueue[state.currentTrapIdx].type);
        // Stack the timer above the icon, adding a slight drop shadow so it remains readable over the grid
        follower.innerHTML = `
            <div style="font-size: 14px; font-family: var(--PX, monospace); color: #e74c3c; margin-bottom: 4px; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
                ${state.fuseRemaining}s
            </div>
            <div>${info.icon}</div>
        `;
    }

    document.body.appendChild(follower);

    window._bayesTrapMouseMoveHandler = (e) => {
        const foll = document.getElementById('bayes-trap-cursor-follower');
        if (foll) {
            foll.style.left = e.clientX + 'px';
            foll.style.top = e.clientY + 'px';
        }
    };
    window.addEventListener('mousemove', window._bayesTrapMouseMoveHandler);
}


function _bayesTrapsUpdateCursorFollower() {
    const follower = document.getElementById('bayes-trap-cursor-follower');
    const state = window._bayesTrapsState;

    if (follower && state && state.trapsQueue[state.currentTrapIdx]) {
        const info = _bayesTrapTypeInfo(state.trapsQueue[state.currentTrapIdx].type);
        // Continuously update both the timer and the current icon
        follower.innerHTML = `
            <div style="font-size: 14px; font-family: var(--PX, monospace); color: #e74c3c; margin-bottom: 4px; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
                ${state.fuseRemaining}s
            </div>
            <div>${info.icon}</div>
        `;
    } else if (follower) {
        follower.remove();
    }
}







// Spawns type-specific visual explosions directly over detonated cells
function _bayesTrapAnimateExplosion(row, col, type) {
    const el = document.getElementById(`g-${row}-${col}`);
    if (!el) return;

    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';

    // Inject CSS Keyframe animations dynamically if they don't exist yet
    if (!document.getElementById('bayes-explosion-styles')) {
        const styleNode = document.createElement('style');
        styleNode.id = 'bayes-explosion-styles';
        styleNode.textContent = `
            @keyframes bayes-reveal-burst {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; filter: drop-shadow(0 0 2px #27ae60); }
                50% { background: rgba(39, 174, 96, 0.4); border: 2px solid #27ae60; }
                100% { transform: translate(-50%, -50%) scale(2.8); opacity: 0; }
            }
            @keyframes bayes-elim-spark {
                0% { transform: translate(-50%, -50%) scale(0.2) rotate(0deg); opacity: 1; color: #e74c3c; font-size: 10px; }
                50% { opacity: 1; text-shadow: 0 0 8px #e74c3c; }
                100% { transform: translate(-50%, -50%) scale(2.2) rotate(180deg); opacity: 0; color: #f39c12; font-size: 24px; }
            }
            @keyframes bayes-protect-pulse {
                0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; box-shadow: 0 0 0 0px rgba(243, 156, 18, 0.8); }
                40% { opacity: 0.9; }
                100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; box-shadow: 0 0 4px 12px rgba(243, 156, 18, 0); }
            }
        `;
        document.head.appendChild(styleNode);
    }

    // Create container element for the visual effect
    const fxContainer = document.createElement('div');
    fxContainer.style.cssText = `
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none; z-index: 50;
    `;

    // Design customized visuals based on the trap's unique profile
    switch (type) {
        case 'reveal':
            // Green radar scanner-like shockwave ring expansion
            fxContainer.style.cssText += `
                width: 100%; height: 100%; border-radius: 50%;
                animation: bayes-reveal-burst 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
            `;
            break;

        case 'elimination':
            // Fiery mini combustion shock symbol bursting outward
            fxContainer.textContent = '💥';
            fxContainer.style.cssText += `
                animation: bayes-elim-spark 0.45s ease-out forwards;
                font-family: Arial, sans-serif;
            `;
            break;

        case 'protection':
            // Golden geometric protective aura outward distortion ring
            fxContainer.style.cssText += `
                width: 70%; height: 70%; border-radius: 4px;
                border: 2px solid #f39c12;
                animation: bayes-protect-pulse 0.6s ease-out forwards;
            `;
            break;
    }

    el.appendChild(fxContainer);

    // Automatically scrub the element from memory once animation finishes
    setTimeout(() => fxContainer.remove(), 650);
}

















//------------------------------------------------------------------------
//------------------------TYPE 1 ERROR SHIELD-----------------------------
//------------------------------------------------------------------------



function _executeTypeIShield(seedCount, bonusReveal) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    if (!window._typeIShieldedCells) window._typeIShieldedCells = new Set();
    window._typeIBonusReveal = bonusReveal;

    const eligible = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // We now allow cells that are marked as empty/incorrect, as long as the user hasn't safely cleared them
            if (sol[r][c] === 0
                && revealedGrid[r][c] !== true // Ensure the cell isn't officially solved/revealed
                && !window._typeIShieldedCells.has(`${r}-${c}`)) {

                eligible.push([r, c]);
            }
        }
    }

    if (eligible.length === 0) {
        showToast(LANG === 'de' ? '🛡️ Keine Zellen zum Beschildern!' : '🛡️ No cells available to shield!');
        _setAbilityMode(false);
        const cd = cooldownState['active4'];
        if (cd && cd.interval) { clearInterval(cd.interval); cd.interval = null; }
        if (cd) cd.remaining = 0;
        buildClassHUD();
        return;
    }

    for (let i = eligible.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
    }

    const toSeed = eligible.slice(0, Math.min(seedCount, eligible.length));
    let seeded = 0;

    // Keep track of which columns received shields to play localized sweep animations
    const activeColumns = new Set();

    toSeed.forEach(([r, c], index) => {
        window._typeIShieldedCells.add(`${r}-${c}`);
        seeded++;

        const cellEl = document.getElementById(`g-${r}-${c}`);
        if (cellEl) {
            // Slight delay staggered by index so all 5 bursts don't pop simultaneously
            setTimeout(() => {
                const matrixFlash = document.createElement('div');
                matrixFlash.style.cssText = `
                    position: absolute; inset: 0; background: rgba(46, 204, 113, 0.4);
                    z-index: 10; pointer-events: none; border-radius: inherit;
                    animation: type1-matrix-sweep 0.8s ease-out forwards;
                `;
                if (getComputedStyle(cellEl).position === 'static') cellEl.style.position = 'relative';
                cellEl.appendChild(matrixFlash);

                setTimeout(() => matrixFlash.remove(), 800);
            }, index * 120); // Smooth sequential pop-in effect
        }
    });

 

    const bonusNote = bonusReveal
        ? (LANG === 'de' ? ' (+Enthüllung bei Auslösung)' : ' (+reveal on trigger)')
        : '';

    showToast(`🛡️ ${LANG === 'de'
        ? `Fehler 1. Art Schild: ${seeded} Zelle(n) beschildert${bonusNote}`
        : `Type I Error Shield: ${seeded} cell(s) shielded${bonusNote}`}`);

    Audio_Manager.playSFX('type1errorShieldHide'); 
    buildClassHUD();
}




function _typeIShieldIntercept(row, col) {
    const cells = window._typeIShieldedCells;
    if (!cells || cells.size === 0) return false;

    const key = `${row}-${col}`;
    if (!cells.has(key)) return false;

    cells.delete(key);

    userGrid[row][col] = 2; // ✕
    renderCell(row, col);

    // Dynamic shield shatter burst effect over the clicked grid space
    _typeIShowShieldBreakEffect(row, col);

    showToast(LANG === 'de'
        ? '🧪 Fehler 1. Art - Schutz ausgelöst!'
        : 'Type I Error - Shield triggered!');

    Audio_Manager.playSFX('type1errorShieldBreak');
    trackAchStat('type1Intercepts');

    if (window._typeIBonusReveal) {
        _typeIBonusRevealCell(row, col);
    }

    return true;
}




// Spawns a high-fidelity particle shatter explosion when a hidden shield breaks
function _typeIShowShieldBreakEffect(row, col) {
    const el = document.getElementById(`g-${row}-${col}`);
    if (!el) return;

    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';

    const container = document.createElement('div');
    container.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        pointer-events: none; z-index: 100; overflow: visible;
    `;
    el.appendChild(container);

    // 🌟 COOL EFFECT: Generate physical glowing "shards" that fly out in random directions
    const shardCount = 8;
    for (let i = 0; i < shardCount; i++) {
        const shard = document.createElement('div');
        const angle = (i / shardCount) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
        const velocity = 30 + Math.random() * 30; // pixels to travel
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        const rotation = Math.random() * 360 + 180;

        shard.style.cssText = `
            position: absolute; top: 50%; left: 50%;
            width: 4px; height: 4px; background: #2ecc71;
            box-shadow: 0 0 6px #2ecc71, 0 0 2px #fff;
            border-radius: ${Math.random() > 0.5 ? '0px' : '50%'};
            transform: translate(-50%, -50%);
            opacity: 1;
        `;

        // Dynamic keyframe injection for individual physical trajectories
        const animationName = `shard-fly-${row}-${col}-${i}`;
        if (!document.getElementById(animationName)) {
            const style = document.createElement('style');
            style.id = animationName;
            style.textContent = `
                @keyframes ${animationName} {
                    0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    100% { transform: translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0) rotate(${rotation}deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        shard.style.animation = `${animationName} 0.6s cubic-bezier(0.1, 0.8, 0.25, 1) forwards`;
        container.appendChild(shard);
    }

    // Main shield icon expanding and dissolving outward simultaneously
    const shieldWave = document.createElement('div');
    shieldWave.textContent = '🛡️';
    shieldWave.style.cssText = `
        position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
        font-size: 16px; text-shadow: 0 0 8px #2ecc71;
        animation: type1-shield-shatter 0.5s ease-out forwards;
    `;
    container.appendChild(shieldWave);

    // Clean up the entire engine from DOM after completion
    setTimeout(() => {
        container.remove();
        document.querySelectorAll(`[id^="shard-fly-${row}-${col}-"]`).forEach(s => s.remove());
    }, 650);
}






function _typeIBonusRevealCell(row, col) {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    const candidates = [];
    for (let c = 0; c < cols; c++) {
        if (sol[row][c] === 1 && !revealedGrid[row][c] && userGrid[row][c] !== 1)
            candidates.push([row, c]);
    }
    for (let r = 0; r < rows; r++) {
        if (r === row) continue;
        if (sol[r][col] === 1 && !revealedGrid[r][col] && userGrid[r][col] !== 1)
            candidates.push([r, col]);
    }

    if (!candidates.length) return;

    const [r, c] = candidates[Math.floor(Math.random() * candidates.length)];
    revealedGrid[r][c] = true;
    userGrid[r][c] = 1;
    renderCell(r, c);
    updClues(r, c);
    trackAchStat('tilesRevealed', 1);
    _applyCellEffect([`g-${r}-${c}`], 'reveal');

    showToast(LANG === 'de'
        ? '🛡️ Typ-I-Bonus: 1 korrekte Zelle enthüllt!'
        : 'Type I bonus: 1 correct cell revealed!');

    questStat_classRevealUsed(1);
    updateQuestStats('classAbilityUsedThisLevel', {});

    checkWin();
}
