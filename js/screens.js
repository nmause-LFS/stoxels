// ═══════════════════════════════════════════════
//  SCREENS  (screens.js)
//  Builds the dynamic HTML content for each
//  information-heavy screen and manages level
//  launching and overlay controls.
//
//  Functions in this file:
//    buildLS()          — level-select screen
//    buildHS()          — highscore screen
//    buildCodesScreen() — my codes screen
//    getStars()         — difficulty star helper
//    startLevel()       — initialise and launch a level
//    hideOv()           — hide win/lose overlays
//    nextLvl()          — advance to the next level
//    replayLvl()        — restart the current level
// ═══════════════════════════════════════════════


// ═══════════════════════════════════════════════
//  LEVEL SELECT
// ═══════════════════════════════════════════════

// buildLS — rebuilds the entire level-select screen from STATE.
//   Called every time the screen is shown (startSetup, goLevels in ui.js)
//   so newly completed levels, claimed bonuses, and new high scores are
//   always reflected without needing a page reload.
//
//   Top bar:
//     - Active modifier tags (TT / HC / IM) and the current difficulty tag
//     - Running total score
//
//   For each World in WORLDS (levels.js), a world-block div is created
//   containing a labelled row of level cards. Each card shows:
//     - Level number (e.g. "2-4")
//     - Hint text (or "???" if locked)
//     - Grid size string (e.g. "10×10")
//     - Bonus objective hint with an icon matching the bonus type
//       (green "✓ claimed" text if the reward has already been collected)
//     - Best score and the difficulty/mod tags it was achieved on
//     - Star rating based on the difficulty of the best score
//
//   Unlock logic: the first level of every World is always unlocked.
//   Every subsequent level within a world requires the previous level
//   (gi - 1) to be in STATE.done. Locked cards have pointer-events
//   disabled via the CSS class 'locked'.
function buildLS() {
    // ── Top bar: active mods + difficulty tag ──────────────────────────────
    const modEl = document.getElementById('ls-mods');
    const active = Object.keys(curMods).filter(m => curMods[m]);
    modEl.innerHTML =
        active.map(m => {
            const modMap = { timetrial: 'TT', hardcore: 'HC', ironman: 'IM' };
            return `<span class="mod-tag ${m === 'timetrial' ? 'tt' : m === 'hardcore' ? 'hc' : 'im'}">
        ${modMap[m] || m.toUpperCase()}
    </span>`;
        }).join(' ') +
        ` <span class="mod-tag diff">${t('diff_' + curDiff)}</span>`;

    const nextCode = WORLD_CODES.find(wc => STATE.totalScore < wc.threshold);
    const nextCodeStr = nextCode
        ? ` · ${nextCode.threshold - STATE.totalScore} ${t('ls_to_next')} (${LANG === 'de' ? nextCode.titleDE : nextCode.titleEn})`
        : ` · 🏆 ${t('ls_all_codes')}`;
    document.getElementById('ls-score').textContent = t('ls_total') + ': ' + STATE.totalScore + nextCodeStr;

    // ── World blocks ───────────────────────────────────────────────────────
    const body = document.getElementById('ls-body');
    body.innerHTML = ''; // clear previous render


    // Inject tooltip styles once
    if (!document.getElementById('ls-tooltip-style')) {
        const style = document.createElement('style');
        style.id = 'ls-tooltip-style';
        style.textContent = `
        .lc-tooltip { position:fixed; z-index:9999; background:#1a1a2e; border:1px solid var(--accent);
            color:var(--accent2); font-family:var(--PX); font-size:10px; padding:8px 12px;
            max-width:280px; line-height:1.6; pointer-events:none; opacity:0;
            transition:opacity 0.15s; border-left:3px solid var(--purple); }
        .lc-tooltip.show { opacity:1; }
    `;
        document.head.appendChild(style);
    }

    // Create shared tooltip element
    let tip = document.getElementById('lc-tip');
    if (!tip) {
        tip = document.createElement('div');
        tip.id = 'lc-tip';
        tip.className = 'lc-tooltip';
        document.body.appendChild(tip);
    }


    WORLDS.forEach((w, wi) => {
        // Create a block for each World with a heading and a card grid
        const block = document.createElement('div');
        block.className = 'world-block';
        block.innerHTML = `<div class="world-label">${LANG === 'de' && w.labelDE ? w.labelDE : w.label}</div><div class="level-grid" id="wg${wi}"></div>`;
        body.appendChild(block);

        const grid = block.querySelector('#wg' + wi);

        w.data.forEach((p, li) => {
            // Global index
            const gi = WORLD_START_GI[wi] + li;

            // Unlock rule: first level of each world is always open;
            // all others require the previous level (gi-1) to be completed
            // Tutorial gate: the first level of every world additionally requires
            // the tutorial to be completed. Subsequent levels only need the prior level.
            const tutDone = STATE.tutorialDone;
            const isUnlocked = (li === 0 ? tutDone : STATE.done.includes(gi - 1));
            const isDone = STATE.done.includes(gi);
            const hs = STATE.levelHS[gi]; // best score object or undefined

            // ── Card element ───────────────────────────────────────────────
            const card = document.createElement('div');

            const isMathGated = isGatedLevel(gi) && !isMathGatePassed(gi);
                card.className = 'level-card' +
                (isUnlocked ? '' : ' locked') +
                (isDone ? ' done' : '') +
                (isMathGated && isUnlocked ? ' math-gated' : '');

            // Star rating (only shown if the level has been completed)
            const stars = isDone ? getStars(gi) : '';

            // High score line
            const hsText = hs ? `<div class="lc-hs">${t('ls_hs_best')}: ${hs.score}</div>` : '';

            // Bonus objective icon — each type has a matching emoji
            const bonusIcons = {
                nomiss: '✨',
                fast: '⚡',
                noitem: '🎒',
                quiz: '🧠',
                combo: '🔥',
                lowmiss: '🎯',
                noitem_nomiss: '🎒✨',
                noitem_fast: '🎒⚡'
            };
            const bIcon = bonusIcons[p.bonusType || 'nomiss'] || '🎯';

            // Bonus text: green "claimed" message if already earned, otherwise the hint
            const bonusAlreadyClaimed = STATE.bonusDone.includes(gi);
            const bonusText = bonusAlreadyClaimed
                ? `<div class="lc-bonus" style="color:var(--green);opacity:0.7;">✓ ${bIcon} ${t('ls_bonus_claimed')}</div>`
                : `<div class="lc-bonus">${bIcon} ${lvText(p, 'bonusHint') || t('ls_complete_level')}</div>`;

            // Modifier tags from the best-score run (TT/HC/IM + difficulty initial)
            let modTagsHtml = '';
            if (hs && hs.mods) {
                const ms = Object.keys(hs.mods).filter(m => hs.mods[m]);
                if (ms.length) {
                    const modMap = { timetrial: 'TT', hardcore: 'HC', ironman: 'IM' };
                    modTagsHtml =
                        '<div class="lc-mods">' +
                        ms.map(m =>
                            `<span class="lc-mod-tag ${m === 'timetrial' ? 'tt' : m === 'hardcore' ? 'hc' : 'im'}">
                                ${modMap[m] || m.slice(0, 2).toUpperCase()}
                            </span>`
                        ).join('') +
                    `<span class="lc-mod-tag diff">${t('diff_' + (hs.diff || 'normal')).slice(0, 1)}</span>` +
                        '</div>';
                }
            }

            // Grid size string — prefer actual grid dimensions over the world's default
            const szStr = p.grid
                ? `${p.grid[0].length}×${p.grid.length}`   // actual cols × rows
                : (w.size ? `${w.size}×${w.size}` : '?');  // fallback to world size

            card.innerHTML = `
                <div class="lc-num">${wi + 1}-${li + 1}</div>
                <div class="lc-hint">${isUnlocked ? lvText(p, 'hint') : '???'}</div>
                <div class="lc-sz">${szStr}</div>
                ${bonusText}${hsText}${modTagsHtml}
                <div class="lc-stars">${stars}</div>`;

            // Only attach click handler to unlocked cards

            if (isUnlocked) {
                card.addEventListener('click', () => startLevel(gi));
                const tipText = isDone ? getTooltipHint(gi) : t('ls_locked_hint');
                card.addEventListener('mouseenter', () => { tip.textContent = tipText; tip.classList.add('show'); });
                card.addEventListener('mousemove', e => { tip.style.left = (e.clientX + 14) + 'px'; tip.style.top = Math.min(e.clientY + 14, window.innerHeight - 80) + 'px'; });
                card.addEventListener('mouseleave', () => tip.classList.remove('show'));
            }


            grid.appendChild(card);
        });
    });
}


// ═══════════════════════════════════════════════
//  HIGHSCORE SCREEN
// ═══════════════════════════════════════════════

// buildHS — builds the highscore screen content.
//   Top section: total score + one progress bar per World showing how
//   many levels have been completed and whether the Moodle code is unlocked.
//   Table section: all levels that have a recorded best score, sorted
//   by score descending. Each row shows level number, best score,
//   difficulty, and the modifier abbreviations used for that run.
function buildHS() {
    const body = document.getElementById('hs-body');
    const total = STATE.totalScore;

    // Build sorted list of all levels that have a high score entry
    // ALL is the flat array of every level object defined in levels.js
    const entries = Object.entries(STATE.levelHS)
        .map(([gi, hs]) => ({
            gi: parseInt(gi),
            lv: ALL[parseInt(gi)], // full level object (has .world and .li for display)
            hs
        }))
        .sort((a, b) => b.hs.score - a.hs.score); // highest score first

    let html = `<div style="padding:18px;"><div class="hs-total">${t('hs_total')}: ${total}</div>`;

    // ── Code unlock progress bars ──────────────────────────────────────────
    WORLD_CODES.forEach((wc, idx) => {
        const pct = Math.min(100, Math.round((total / wc.threshold) * 100)); // progress percentage
        const unlocked = STATE.unlockedCodes.includes(wc.code);
        const tierName = LANG === 'de' ? wc.titleDE : wc.titleEn;

        html += `
        <div style="margin-bottom:10px;font-size:11px;color:var(--accent2);">
            ${tierName}: ${total.toLocaleString()}/${wc.threshold.toLocaleString()}
            ${unlocked ? `<span style="color:var(--green)">✓ ${t('hs_code_unlocked')}</span>` : ''}
            <!-- Progress bar: purple while in progress, green when complete -->
            <div style="background:var(--surface);height:5px;margin-top:4px;border:1px solid var(--border);">
                <div style="background:${unlocked ? 'var(--green)' : 'var(--purple)'};height:100%;width:${pct}%;"></div>
            </div>
        </div>`;
    });

    // ── Score table ────────────────────────────────────────────────────────
    if (!entries.length) {
        html += `<p style="font-size:12px;color:#555;">${t('no_hs')}</p>`;
    } else {
        html += `<table class="hs-table"><thead><tr>
            <th>${t('hs_level')}</th>
            <th>${t('hs_best')}</th>
            <th>${t('hs_diff')}</th>
            <th>${t('hs_mods')}</th>
        </tr></thead><tbody>`;

        entries.forEach(({ gi, lv, hs }) => {
            // Build modifier abbreviation string (e.g. "TT+HC+IM" or "—")
            const modMap = { timetrial: 'TT', hardcore: 'HC', ironman: 'IM' };
            const mods = hs.mods
                ? Object.keys(hs.mods).filter(m => hs.mods[m])
                    .map(m => modMap[m] || m.slice(0, 2).toUpperCase()).join('+')
                : '—';

            html += `<tr>
                <td class="lvl">${lv.world}-${lv.li}</td>
                <td class="pts">${hs.score}</td>
                <td>${hs.diff ? t('diff_' + hs.diff) : '—'}</td>
                <td>${mods || '—'}</td>
            </tr>`;
        });

        html += `</tbody></table>`;
    }

    html += `</div>`;
    body.innerHTML = html;
}


// ═══════════════════════════════════════════════
//  CODES SCREEN
// ═══════════════════════════════════════════════

// buildCodesScreen — renders the "My Codes" screen.
//   Shows an empty-state message if no codes have been unlocked yet.
//   Otherwise, builds one card per unlocked code from WORLD_CODES,
//   filtered to only those present in STATE.unlockedCodes.
//   Each card shows the world title, the code string, and the Moodle hint.
function buildCodesScreen() {
    const body = document.getElementById('codes-body');

    if (!STATE.unlockedCodes.length) {
        // Empty state — tell the player how to earn codes
        body.innerHTML = `
            <div style="padding:24px;text-align:center;">
                <p style="font-size:13px;color:var(--accent2);line-height:2;">
                    ${t('no_codes').replace(/\n/g, '<br>')}
                </p>
            </div>`;
        return;
    }

    // Filter WORLD_CODES to only those the player has earned
    const unlocked = WORLD_CODES.filter(c => STATE.unlockedCodes.includes(c.code));

    body.innerHTML =
        `<div style="padding:18px;"><div class="codes-grid">` +
        unlocked.map(c => `
            <div class="code-card">
                <div class="code-card-title">${LANG === 'de' ? c.titleDE : c.titleEn}</div>
                <div class="code-card-code">${c.code}</div>
                <div class="code-card-hint">${t('pw_hint')}</div>
            </div>`
        ).join('') +
        `</div></div>`;
}


// ═══════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════

// getStars(gi) — returns a star string based on difficulty + modifiers used.
// Stars 1–3 = difficulty tier; each active modifier adds a ½-star (★).
// Max display: 3 filled + up to 3 bonus mod stars shown as ★.
function getStars(gi) {
    const hs = STATE.levelHS[gi];
    if (!hs) return '';

    const filled = '⭐';
    const empty = '☆';
    const modStar = '★'; // bonus star per modifier

    let count = 1;
    if (hs.diff === 'normal') count = 2;
    if (hs.diff === 'hard') count = 3;

    const modCount = hs.mods ? Object.values(hs.mods).filter(Boolean).length : 0;
    const modStars = modStar.repeat(modCount);

    return filled.repeat(count) + empty.repeat(3 - count) + (modStars ? ' ' + modStars : '');
}

// getTooltipHint(gi) — builds a suggestion string for the level tooltip.
//   Looks at what difficulty + mods the player has already used for their
//   best score and suggests what to try next to squeeze out more points.
function getTooltipHint(gi) {
    const hs = STATE.levelHS[gi];
    if (!hs) return t('ls_no_score');

    const diffs = ['easy', 'normal', 'hard'];
    const allMods = ['timetrial', 'hardcore', 'ironman'];

    const currentDiffIdx = diffs.indexOf(hs.diff || 'easy');
    const usedMods = hs.mods ? Object.keys(hs.mods).filter(m => hs.mods[m]) : [];
    const unusedMods = allMods.filter(m => !usedMods.includes(m));

    const suggestions = [];

    // Suggest a harder difficulty if not on hard yet
    if (currentDiffIdx < 2) {
        const nextDiff = t('diff_' + diffs[currentDiffIdx + 1]);
        suggestions.push(t('ls_tip_harder').replace('{diff}', nextDiff));
    }

    // Suggest unused modifiers (keep proper names for TT/HC/IM)
    if (unusedMods.length) {
        const modNames = unusedMods.map(m => {
            const keyMap = { timetrial: 'mod_tt', hardcore: 'mod_hc', ironman: 'mod_im' };
            return t(keyMap[m]);
        });
        const key = modNames.length > 1 ? 'ls_tip_mods_plural' : 'ls_tip_mods';
        suggestions.push(t(key).replace('{mods}', modNames.join(' / ')));
    }

    if (!suggestions.length) return t('ls_max_score');

    return '💡 ' + suggestions.join(' · ');
}



// ═══════════════════════════════════════════════
//  START LEVEL
// ═══════════════════════════════════════════════

// startLevel(gi) — the main entry point for beginning a puzzle.
//   gi = global index into the ALL array (worldIdx * 10 + levelIdx).
//   Resets ALL per-level state variables before doing anything else so
//   there's no bleed-over from a previous attempt.
//
//   Initialisation checklist:
//   1.  Set cur to the puzzle object (from ALL in levels.js).
//   2.  Create fresh userGrid, wrongGrid, revealedGrid arrays sized to
//       the puzzle's actual dimensions (supports non-square grids).
//   3.  Reset all per-session counters and flags.
//   4.  Set timerSecs: 5 min for Time Trial, otherwise the difficulty default.
//   5.  Hide any open overlays and close the quiz (safety net for replays).
//   6.  Update all HUD elements: level id, hint text, score, penalty info,
//       bonus sidebar hint, and modifier/difficulty tags.
//   7.  Start the timer, build the grid, rebuild the inventory panel.
//   8.  Push 'screen-levels' to screenHistory so Escape goes back to levels.
//   9.  Switch to the game screen.


function startLevel(gi) {
    if (isGatedLevel(gi) && !isMathGatePassed(gi)) {
        tryStartGatedLevel(gi, () => _doStartLevel(gi));
        return;
    }
    _doStartLevel(gi);
}


function _doStartLevel(gi) {
    cur = ALL[gi]; // set the current puzzle (levels.js)

    const rows = cur.grid.length;
    const cols = cur.grid[0].length;

    // Fresh grids — all zeroed/false, sized to the actual puzzle dimensions
    userGrid = Array.from({ length: rows }, () => Array(cols).fill(0));
    wrongGrid = Array.from({ length: rows }, () => Array(cols).fill(false));
    revealedGrid = Array.from({ length: rows }, () => Array(cols).fill(false));

    // Reset all per-level state variables (state.js)
    mistakeCount = 0;
    itemsUsedThisLevel = 0;
    dead = false;
    painting = false;
    hoverRow = -1;
    hoverCol = -1;
    shieldActive = false;
    timerFrozen = false;
    quizAnsweredCorrectly = false;

    //   timetrial : timer is halved (50% of difficulty/level default); +20 % score bonus
    const cfg = DIFF_CFG[curDiff];
    const baseTimer = cur.timer || cfg.timerStart;
    timerSecs = curMods.timetrial ? Math.round(baseTimer * 0.5) : baseTimer;

    // Close any leftover overlays from a previous level
    hideOv();    // hides win and lose overlays (below)
    closeQuiz(); // scoring.js

    // ── HUD elements ──────────────────────────────────────────────────────
    document.getElementById('top-id').textContent = `${t('lvl_prefix')} ${cur.world}-${cur.li}`;
    document.getElementById('top-hint').textContent = lvText(cur, 'hint');
    document.getElementById('sc-disp').textContent = STATE.totalScore;
    document.getElementById('pen-info').textContent = ''; // clear any previous penalty display
    const mc = document.getElementById('mistake-counter');
    if (mc) mc.textContent = '✗ 0';
    document.getElementById('bonus-sidebar-hint').textContent = lvText(cur, 'bonusHint') || '';

    // Modifier and difficulty tags below the timer
    const mt = document.getElementById('mod-tags');
    mt.innerHTML = '';
    if (curMods.timetrial) mt.innerHTML += `<span class="mod-tag tt">${t('mod_tt')}</span>`;
    if (curMods.hardcore) mt.innerHTML += `<span class="mod-tag hc">${t('mod_hc')}</span>`;
    if (curMods.ironman) mt.innerHTML += `<span class="mod-tag im">${t('mod_im')}</span>`;
    mt.innerHTML += `<span class="mod-tag diff">${t('diff_' + curDiff)}</span>`;

    // Start all systems
    updTimer();           // timer.js — show initial time before first tick
    startTimer();         // timer.js — begin the countdown
    buildGrid();          // grid.js  — render the puzzle table

    // ── Scout's Primer check ──────────────────────────────────────────────────
    // If a primer was activated in a previous level, show the question modal now.
    if (STATE.primerPending) {
        STATE.primerPending = false;
        save();
        showPrimerModal();
    }



    buildInventoryPanel(); // inventory.js — render current items

    // Navigation: Escape from the game screen goes back to level select
    screenHistory.push('screen-levels');
    ss('screen-game'); // ui.js — switch to the game screen
}


// ═══════════════════════════════════════════════
//  OVERLAY CONTROLS
// ═══════════════════════════════════════════════

// hideOv — hides both the win and lose overlays by removing 'show'.
//   Called at the start of startLevel() as a safety net, and by the
//   Escape key handler in main.js when an overlay is visible.
function hideOv() {
    document.getElementById('ov-win').classList.remove('show');
    document.getElementById('ov-lose').classList.remove('show');
}

// nextLvl — advances to the next level in the ALL array after the win overlay.
//   If the current level is the last one (cur.gIdx + 1 >= ALL.length),
//   navigates to the level select screen instead of trying to load
//   a non-existent level.
function nextLvl() {
    hideOv();
    const n = cur.gIdx + 1;
    if (n < ALL.length) {
        startLevel(n); // start the very next level
    } else {
        goLevels();    // no more levels — go back to the level select (ui.js)
    }
}

// replayLvl — restarts the current level from scratch.
//   Simply hides the overlay and calls startLevel() with the same gi,
//   which resets all state and rebuilds the grid cleanly.
function replayLvl() {
    hideOv();
    startLevel(cur.gIdx);
}




// ═══════════════════════════════════════════════
//  SCOUT'S PRIMER MODAL
// ═══════════════════════════════════════════════

// primerQuestion — the question currently shown in the primer modal.
let primerQuestion = null;

// getPrimerQuestion — picks randomly from the combined pool of:
//   - all QUIZ_QUESTIONS (quiz.js)
//   - all MATH_GATE_POOLS questions flattened (mathgate.js)
// Returns a normalised { q, opts, isMultiChoice } object.
// Math gate questions are converted to free-text mode.
function getPrimerQuestion() {
    // Flatten all math gate questions across worlds
    const gateQs = Object.values(MATH_GATE_POOLS).flat();

    // Decide: 50% chance quiz question, 50% math gate question
    if (Math.random() < 0.5 && QUIZ_QUESTIONS.length) {
        const raw = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
        const q = (LANG === 'de' && raw.qDE) ? raw.qDE : raw.q;
        const opts = (LANG === 'de' && raw.optsDE) ? raw.optsDE : raw.opts;
        const optsWithFlag = opts.map((o, i) => ({ text: o, isCorrect: i === raw.correct }));
        shuffle(optsWithFlag);
        return { q, opts: optsWithFlag, isMultiChoice: true };
    } else {
        const raw = gateQs[Math.floor(Math.random() * gateQs.length)];
        const q = (LANG === 'de' && raw.qDE) ? raw.qDE : raw.q;
        return {
            q,
            answer: raw.answer,
            tolerance: raw.tolerance,
            unit: raw.unit || '',
            hintEn: raw.hintEn,
            hintDE: raw.hintDE,
            isMultiChoice: false
        };
    }
}

// showPrimerModal — builds and injects a one-off modal into the DOM,
//   then shows it. The modal is removed from the DOM when dismissed.
function showPrimerModal() {
    primerQuestion = getPrimerQuestion();

    // Build modal HTML
    const overlay = document.createElement('div');
    overlay.id = 'primer-overlay';
    overlay.className = 'modal-bg show';
    overlay.style.cssText = 'z-index:3000;';

    const q = primerQuestion.q;
    const isMulti = primerQuestion.isMultiChoice;

    let answerHtml = '';
    if (isMulti) {
        answerHtml = `<div class="quiz-opts" id="primer-opts" style="margin-top:14px;"></div>`;
    } else {
        const unitLabel = primerQuestion.unit
            ? `<span style="font-family:var(--PX);font-size:11px;color:#888;margin-left:6px;">${primerQuestion.unit}</span>`
            : '';
        answerHtml = `
            <div class="mg-answer-row" style="margin-top:14px;">
                <input type="text" id="primer-input" class="mg-input" placeholder="${LANG === 'de' ? 'deine Antwort' : 'your answer'}" autocomplete="off" />
                ${unitLabel}
                <button class="mg-submit-btn" onclick="submitPrimerAnswer()">${LANG === 'de' ? 'PRÜFEN ▶' : 'CHECK ▶'}</button>
            </div>`;
    }

    overlay.innerHTML = `
        <div class="modal-box mg-box" style="border-left-color:var(--purple);">
            <div class="mg-world-badge" style="background:var(--purple);color:#fff;">
                📜 ${LANG === 'de' ? "PFADFINDER-KOMPASS — BONUSFRAGE" : "SCOUT'S PRIMER — BONUS QUESTION"}
            </div>
            <div class="mg-instruction" style="margin-top:12px;">
                ${LANG === 'de'
            ? 'Beantworte diese Frage für einen Vorsprung beim Level-Start:'
            : 'Answer correctly for a headstart on this level:'}
            </div>
            <div class="mg-question" id="primer-question-text" style="margin-top:10px;">${q}</div>
            ${answerHtml}
            <div class="mg-feedback" id="primer-feedback"></div>
            <div class="mg-hint-box" id="primer-hint" style="display:none;"></div>
            <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
                <button class="mg-submit-btn" id="primer-skip-btn" onclick="skipPrimer()" style="background:transparent;border-color:#555;color:#777;">
                    ${LANG === 'de' ? 'ÜBERSPRINGEN (kein Vorsprung)' : 'SKIP (no headstart)'}
                </button>
            </div>
            <div class="mg-footer">
                ${LANG === 'de'
            ? 'Richtig: 2 Zeilen + 2 Spalten werden automatisch für dich gelöst!'
            : 'Correct: 2 rows + 2 columns will be solved for you as a headstart!'}
            </div>
        </div>`;

    document.body.appendChild(overlay);

    // Wire up multiple-choice buttons
    if (isMulti) {
        const optsEl = document.getElementById('primer-opts');
        primerQuestion.opts.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opt';
            btn.textContent = opt.text;
            if (opt.isCorrect) btn.dataset.isCorrect = '1';
            btn.onclick = () => submitPrimerMCQ(opt.isCorrect, optsEl, btn);
            optsEl.appendChild(btn);
        });
    }

    // Allow Enter key for free-text input
    setTimeout(() => {
        const inp = document.getElementById('primer-input');
        if (inp) {
            inp.focus();
            inp.addEventListener('keydown', e => { if (e.key === 'Enter') submitPrimerAnswer(); });
        }
    }, 100);
}

// submitPrimerMCQ — handles a multiple-choice answer in the primer modal.
function submitPrimerMCQ(correct, optsEl, clickedBtn) {
    Array.from(optsEl.children).forEach(btn => btn.onclick = null);
    Array.from(optsEl.children).forEach(btn => {
        if (btn.dataset.isCorrect === '1') btn.classList.add('correct');
        else if (btn === clickedBtn && !correct) btn.classList.add('wrong');
    });
    showPrimerResult(correct);
}

// submitPrimerAnswer — handles a free-text answer in the primer modal.
function submitPrimerAnswer() {
    const raw = (document.getElementById('primer-input').value || '').trim().replace(',', '.');
    const entered = parseFloat(raw);
    const fb = document.getElementById('primer-feedback');
    if (isNaN(entered)) {
        fb.className = 'mg-feedback mg-bad';
        fb.textContent = LANG === 'de' ? '⚠ Bitte eine Zahl eingeben.' : '⚠ Please enter a number.';
        return;
    }
    const correct = Math.abs(entered - primerQuestion.answer) <= primerQuestion.tolerance;
    if (!correct) {
        const hintBox = document.getElementById('primer-hint');
        const hint = (LANG === 'de' && primerQuestion.hintDE) ? primerQuestion.hintDE : primerQuestion.hintEn;
        hintBox.innerHTML = '💡 ' + hint;
        hintBox.style.display = 'block';
    }
    showPrimerResult(correct);
}

// showPrimerResult — shows feedback, applies the headstart if correct,
//   then auto-closes the modal after a short delay.
function showPrimerResult(correct) {
    const fb = document.getElementById('primer-feedback');
    const skipBtn = document.getElementById('primer-skip-btn');
    if (skipBtn) skipBtn.style.display = 'none';

    if (correct) {
        fb.className = 'mg-feedback mg-ok';
        fb.textContent = LANG === 'de'
            ? '✓ Richtig! Vorsprung wird angewendet…'
            : '✓ Correct! Applying headstart…';
        setTimeout(() => {
            closePrimerModal();
            applyPrimerHeadstart();
        }, 1000);
    } else {
        fb.className = 'mg-feedback mg-bad';
        fb.textContent = LANG === 'de'
            ? '✗ Falsch. Kein Vorsprung — viel Erfolg!'
            : '✗ Wrong. No headstart — good luck!';
        setTimeout(closePrimerModal, 1800);
    }
}

// skipPrimer — dismisses the modal without applying any headstart.
function skipPrimer() {
    closePrimerModal();
}

// closePrimerModal — removes the primer overlay from the DOM.
function closePrimerModal() {
    const el = document.getElementById('primer-overlay');
    if (el) el.remove();
    primerQuestion = null;
}

// applyPrimerHeadstart — solves 2 random rows + 2 random columns,
//   filling correct tiles and marking wrong tiles (like markWrongTiles)
//   so the player has a genuine headstart.
function applyPrimerHeadstart() {
    if (!cur) return;
    const sol = cur.grid;
    const rows = sol.length, cols = sol[0].length;

    // Solve rows: reveal all correct tiles + mark all wrong tiles in 2 rows
    const rowIdxs = shuffle(Array.from({ length: rows }, (_, i) => i)).slice(0, 2);
    rowIdxs.forEach(r => {
        for (let c = 0; c < cols; c++) {
            if (sol[r][c] === 1) {
                revealedGrid[r][c] = true;
                userGrid[r][c] = 1;
            } else if (userGrid[r][c] === 0) {
                userGrid[r][c] = 2; // mark as empty (✕)
            }
            renderCell(r, c);
            updClues(r, c);
        }
    });

    // Solve cols: same treatment for 2 columns
    const colIdxs = shuffle(Array.from({ length: cols }, (_, i) => i)).slice(0, 2);
    colIdxs.forEach(c => {
        for (let r = 0; r < rows; r++) {
            if (sol[r][c] === 1) {
                revealedGrid[r][c] = true;
                userGrid[r][c] = 1;
            } else if (userGrid[r][c] === 0) {
                userGrid[r][c] = 2;
            }
            renderCell(r, c);
            updClues(r, c);
        }
    });

    showToast(`📜 ${t('item_primer_headstart')}`);
    checkWin(); // in case the headstart already solves the puzzle
}