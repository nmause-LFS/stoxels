// ═══════════════════════════════════════════════
//  DIFFICULTY & MODIFIERS  (config.js)
//  Central place for all tuning numbers.
//  If you want to rebalance penalties or score
//  multipliers, this is the only file you need
//  to touch.
// ═══════════════════════════════════════════════

// DIFF_CFG — one entry per difficulty level.
//   penMult   : unused multiplier slot (penalties are currently picked from
//               the 'pens' array directly; keep for future use)
//   scoreMult : base score multiplier applied to the raw score at level end
//   timerStart: seconds on the clock when a level begins (15 * 60 = 900 s)
//               Note: Time Trial mode overrides this with 5 * 60 = 300 s
//   pens      : array of time penalties in seconds for the 1st, 2nd, 3rd, and
//               4th+ mistakes respectively. Once the last index is reached,
//               every additional mistake uses that same (highest) value.
const DIFF_CFG = {
    easy: { penMult: 1, scoreMult: 0.5, timerStart: 15 * 60, pens: [8, 15, 30, 45] },
    normal: { penMult: 2, scoreMult: 1, timerStart: 10 * 60, pens: [15, 30, 60, 90] },
    hard: { penMult: 4, scoreMult: 1.5, timerStart: 7 * 60, pens: [30, 60, 120, 180] },
};

// curDiff — the difficulty the player selected on the Setup screen.
//           Defaults to 'normal' so the game always has a valid config.
let curDiff = 'normal';

// curMods — which optional modifiers are currently active.
//   timetrial : only 5 minutes instead of 15; +20 % score bonus
//   hardcore  : any wrong fill = instant game over; +30 % score bonus
//   ironman   : items cannot be used; +15 % score bonus
let curMods = { timetrial: false, hardcore: false, ironman: false };


// scoreMultiplier — calculates the final score multiplier for the current run.
//   Starts from the difficulty's base scoreMult and then stacks each active
//   modifier on top (multiplicatively, not additively).
//   Example: Hard (×1.5) + Hardcore (×1.3) + Ironman (×1.15) = ×2.2425
//   Called in checkWin() (scoring.js) when calculating the points to award.
function scoreMultiplier() {
    let m = DIFF_CFG[curDiff].scoreMult; // start with difficulty base
    if (curMods.timetrial) m *= 1.2;    // +20 % for Time Trial
    if (curMods.hardcore) m *= 1.3;    // +30 % for Hardcore
    if (curMods.ironman) m *= 1.15;   // +15 % for Ironman
    return m;
}