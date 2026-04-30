//  ----------------------------------------------------------------------------
//  TRANSLATIONS  (translations.js)
//  Provides a simple two-language (EN / DE) string lookup system. Every piece 
//  of visible text that needs to switch language is stored here.
//  ----------------------------------------------------------------------------

// LANG — the currently active language code ('en' or 'de').
//        Read by t() and by any code that needs to choose between
//        language-specific data (e.g. item names, world code titles).
let LANG = 'en';

// t(k) — translation helper. Returns the string for key k in the
//   active language. Falls back to T.en if the active language is
//   missing a key, and falls back to the key itself as a last resort
//   so missing translations are visible rather than silently blank.
//   Usage example:  t('btn_play')  →  '▶ PLAY'  (in English)
function t(k) {
    return (T[LANG] || T.en)[k] || k;
}

// setLang(l) — switches the active language and refreshes all UI text.
//   Steps:
//   1. Updates the LANG variable.
//   2. Toggles the 'active' CSS class on the EN/DE buttons in the header
//      so the currently selected one is highlighted.
//   3. Finds every HTML element with a [data-t] attribute and sets its
//      innerHTML to the translated string. This covers all static labels
//      that exist in the HTML from the start (buttons, headings, etc.).
//      Dynamic content (level cards, inventory items) is re-built by their
//      own functions when they render, so they always use the current LANG.
//   4. Re-renders the difficulty description and modifier description on
//      the Setup screen, since those are built from translated strings.
//   Called from: the EN/DE buttons in index.html, and once from main.js
//   on startup to initialise all [data-t] elements.
function setLang(l) {
    LANG = l;

    // Highlight the matching language button
    document.querySelectorAll('.lang-btn').forEach(b =>
        b.classList.toggle('active', b.textContent === l.toUpperCase())
    );

    // Fill every element that has a data-t attribute
    document.querySelectorAll('[data-t]').forEach(el => {
        const k = el.getAttribute('data-t');
        const v = t(k);
        // Only write if the translation exists (v !== k guards against missing keys
        // accidentally overwriting useful fallback content)
        if (v && v !== k) el.innerHTML = v;
    });

    // Refresh the Setup screen's description texts (they are built dynamically,
    // not via data-t, so they need an explicit refresh call)
    updDiffDesc();
    updModDesc();
}


//  ----------------------------------------------------------------------------
//  TRANSLATIONS TABLE
//  T.en — English strings (primary / fallback)
//  T.de — German strings
//
//  KEY NAMING CONVENTIONS:
//    btn_*      — button labels
//    tut_*      — tutorial modal content (h = heading, p = paragraph)
//    setup_*    — Setup screen labels
//    diff_*     — difficulty names and descriptions
//    mod_*      — modifier names and descriptions
//    ls_*       — level-select screen
//    ov_*       — overlay (win/lose) titles
//    hs_*       — highscore screen
//    pw_*       — password/code modal
//    inv_*      — inventory panel
//    bonus_*    — bonus objective labels
//    no_*       — empty-state messages
//  ----------------------------------------------------------------------------
const T = {
    en: {
        // Title screen
        tagline: 'PROBABILITY THEORY & STATISTICS NONOGRAMS',

        // Navigation buttons (used across multiple screens)
        btn_play: '▶ PLAY', btn_howtoplay: '? HOW TO PLAY',
        btn_highscores: '🏆 HIGHSCORES', btn_codes: '🔑 MY CODES',
        btn_confirm: '▶ SELECT LEVEL', btn_back: '◀ BACK',
        btn_setup: 'SETUP', btn_menu: 'MENU', btn_levels: '◀ LEVELS',
        btn_next: 'NEXT ▶', btn_retry: 'RETRY', btn_retry2: 'TRY AGAIN',

        // Reset
        toast_reset: '🗑 All Progress has been reset.',

        // Tutorial modal — section headings (h) and paragraphs (p)
        tut_title: '▸ HOW TO PLAY STOXELS',
        tut_s1h: 'WHAT IS A NONOGRAM?',
        tut_s1p: 'A nonogram is a grid puzzle. Numbers on row and columns tell you how many consecutive filled cells exist. Reveal the full symbol to win!',
        tut_s2h: 'CONTROLS',
        tut_s2p: '<strong>Left click</strong> — fill a cell<br><strong>Right click</strong> — mark a cell as empty<br><strong>Hold Left Click and Drag</strong> — fill multiple cells<br><strong>CTRL + MouseWheel</strong> — Zoom in & out to scale<br><strong>Escape</strong> — go back',
        tut_s3h: 'DIFFICULTY',
        tut_s3p: '<strong style="color:var(--green)">Easy</strong> — low time penalties for mistakes, ×0.5 score<br><strong style="color:var(--yellow)">Normal</strong> — standard time penalties for mistakes, ×1 score<br><strong style="color:var(--red)">Hard</strong> — heavy time penalties for mistakes, ×1.5 score',
        tut_s4h: 'GAME MODIFIERS',
        tut_s4p: '<strong style="color:var(--orange)">Time Trial</strong> — 50% less time per level — 20% score multiplier <br><strong style="color:var(--red)">Hardcore</strong> — one mistake = instant fail — 30% score multiplier<br><strong style="color:var(--purple)">Ironman</strong> — items cannot be used — 15% score multiplier',
        tut_s5h: 'ITEMS & INVENTORY',
        tut_s5p: 'Complete a level\'s bonus objective to earn a random item. Consecutive clears of that level have a 50% of rewarding a lucky drop. Cursed items are powerful but <strong>locked for the first 3 minutes of a level (1 minute when Time Trial is active)</strong>',
        tut_s6h: 'QUIZ & Probability Gates',
        tut_s6p: 'Some levels require answering a quiz correctly after finishing a level in order to achieve the bonus objective, and some levels have a Probability Gate that can be unlocked by solving an excercise.',
        tut_s7h: 'ACHIEVEMENT CODES',
        tut_s7p: 'Reach score milestones to unlock Moodle Codes. You can see your progress towards the next achievement in the Highscores tab. More score can be earned by replaying levels on higher difficulties or by adding more game modifiers.',

        // Setup screen
        setup_title: '▸ GAME SETUP',
        setup_diff: 'DIFFICULTY',
        setup_mod: 'GAME MODIFIERS (OPTIONAL)',

        // Difficulty button labels and one-line descriptions (shown below the buttons)
        diff_easy: 'EASY', diff_normal: 'NORMAL', diff_hard: 'HARD',
        diff_desc_easy: 'Low Time Penalties for Mistakes · 50% less Score',
        diff_desc_normal: 'Standard Time Penalties for Mistakes · Default Score',
        diff_desc_hard: 'Strong Time Penalties for Mistakes · 50% more Score',

        // Modifier button labels and descriptions
        mod_tt: '⏱ TIME TRIAL', mod_hc: '💀 HARDCORE', mod_im: '🔒 IRONMAN',
        mod_desc_none: 'No modifiers selected.',
        mod_desc_tt: '50% less time per level, but 20% Score multiplier bonus',
        mod_desc_hc: 'one wrong tile = instant fail, but 30% Score multiplier bonus',
        mod_desc_im: 'items cannot be used, but 15% Score multiplier',

        // In-game HUD
        score_lbl: 'SCORE',
        ls_title: 'SELECT LEVEL',

        // Inventory panel
        inv_title: '🎒 INVENTORY',
        item_cost: 'Use: −',   // prefix before the score cost of using an item
        item_sell: 'Sell +',   // prefix before the sell value of an item
        inv_empty: 'No items yet.\nComplete bonus objectives\nto earn items!',

        // Win / lose overlays
        ov_win: 'STOXEL SOLVED!',
        ov_lose: "TIME'S UP!",

        // Bonus objective type labels (used on level cards)
        bonus_nomiss: '✨ No mistakes',
        bonus_fast: '⚡ Speed bonus',
        bonus_quiz: '🧠 Correct answer',

        // Highscore screen
        hs_title: 'HIGHSCORES',
        hs_total: 'TOTAL SCORE', hs_level: 'Level',
        hs_best: 'Best Score', hs_diff: 'Difficulty',
        no_hs: '<strong style="color:var(--orange)">No highscores yet.</strong>',
        hs_mods: 'Mods',
        hs_code_unlocked: 'CODE UNLOCKED',

        // Codes screen
        codes_title: 'MY CODES',
        no_codes: 'No codes unlocked yet.\nEarn points to unlock achievement codes!',

        // Password / Moodle code modal
        pw_title: '🔑 NEW CODE UNLOCKED!',
        pw_intro: 'You unlocked a Moodle code. Enter it in Moodle to claim your badge!',
        pw_hint: 'Enter this code in Moodle to receive your badge.',

        // Level select — dynamic strings
        ls_total: 'TOTAL',
        ls_bonus_claimed: 'Bonus claimed — reward received!',
        ls_complete_level: 'Complete level',
        ls_locked_hint: '🔓 Beat this level to unlock improvement hints!',
        ls_no_score: 'Complete this level to set a score!',
        ls_max_score: '🏆 Maximum score reached!',
        ls_tip_harder: 'Try {diff} difficulty for a higher score multiplier',
        ls_tip_mods: 'Add {mods} modifier for bonus score',
        ls_tip_mods_plural: 'Add {mods} modifiers for bonus score',
        ls_hs_best: 'BEST',

        // In-game HUD
        lvl_prefix: 'LEVEL',
        zoom_hint: 'Ctrl + Scroll Wheel to zoom',

        // Penalty / mistake feedback
        pen_shield: '🛡️ Shield absorbed the mistake!',
        pen_display: '−{n}s (#{m})',

        // Hardcore fail overlay
        hc_fail_title: 'HARDCORE FAIL!',
        hc_fail_sub: 'One mistake = game over in Hardcore mode!',

        // Item use toasts
        item_revealed: 'Revealed {n} tile',
        item_revealed_pl: 'Revealed {n} tiles',
        item_cursed_reset: '☠️ CURSED! Board was reset!',
        item_cursed_lucky: '☠️ Lucky! Revealed 6 tiles!',
        item_marked: 'Marked {n} empty tiles!',
        item_demon_title: '👁️ DEMON EYE TRIGGERED!',
        item_demon_sub: 'The cursed item sealed your fate!',
        item_demon_shield: '👁️ Risky shield activated!',
        item_cursed_time_bad: '💀 CURSED! −4 minutes!',
        item_cursed_time_good: '💀 Lucky! +5 minutes!',
        item_time_added: '+{n}s added!',
        item_freeze_msg: 'Timer frozen 30s!',
        item_shield_msg: 'Shield active!',
        item_cursed_locked: '☠️ Cursed items unlock after {n} more min',
        item_discarded: 'Item discarded',
        item_sell_btn: '🗑 Discard',
        inv_cursed_locked_label: '🔒 LOCKED {n}min+',
        item_row_solved: 'Row fully revealed!',
        item_row_solved_none: 'All rows already solved!',
        item_col_solved: 'Column fully revealed!',
        item_col_solved_none: 'All columns already solved!',
        item_mistake_erased: 'Erased {n} mistake(s) from your count!',
        item_mistake_erased_none: 'No mistakes to erase!',
        item_cursed_row_lucky: '🌊 Lucky! {n} row(s) revealed!',
        item_cursed_row_bad: '🌊 CURSED! {n} row(s) erased!',
        item_cursed_col_lucky: '🌪️ Lucky! {n} column(s) revealed!',
        item_cursed_col_bad: '🌪️ CURSED! {n} column(s) erased!',
        item_cursed_rowcol_lucky: '💥 JACKPOT! {r} rows + {c} cols revealed!',
        item_cursed_rowcol_bad: '💥 CHAOS! {n} rows/cols erased!',
        item_artifact_complete: '🌟 CODEX activated! Puzzle solved instantly!',
        item_primer_activated: "📜 Scout's Primer activated! Question fires on your next level.",
        item_primer_headstart: "Headstart applied! 2 rows + 2 columns pre-solved.",

        item_cursed_reveal_both: 'Revealed 6 tiles! But all ✕ marks were cleared.',
        item_cursed_time_both: '+5 min added, −2 min penalty. Net: +3 min.',
        item_cursed_shield_both: 'Shield active + 2 tiles revealed! Row clues hidden 30s.',
        item_cursed_row_both: '🌊 {r} row(s) revealed · {e} row erased!',
        item_cursed_col_both: '🌪️ {r} col(s) revealed · {e} col erased!',
        item_cursed_rowcol_both: '💥 {r} rows + {c} cols revealed! Column clues hidden 45s.',

        // Inventory rarity labels
        rar_common: 'COMMON', rar_uncommon: 'UNCOMMON', rar_rare: 'RARE',
        rar_legendary: 'LEGENDARY', rar_cursed: 'CURSED',

        // Win overlay
        ov_win_pts: 'pts',
        ov_win_left: 'left',
        ov_win_solved_in: 'solved in',
        ov_win_mistake: 'mistake',
        ov_win_mistakes: 'mistakes',
        ov_win_new: 'new',
        ov_win_best_was: 'best was',
        ov_bonus_met: '🎯 BONUS MET!',
        ov_item_earned: '🎁 Item earned',
        ov_bonus_claimed_note: '✓ Bonus objective already claimed — no duplicate reward.',
        ov_lucky_drop: '🍀 Lucky drop!',
        ov_quiz_reward: '🧠 Quiz reward',

        // Quiz overlay
        quiz_title: '⭐ BONUS QUESTION',
        quiz_correct: '✓ CORRECT! +50 bonus pts & item!',
        quiz_correct_claimed: '✓ Correct! (Bonus already claimed — no duplicate reward.)',
        quiz_wrong: '✗ Wrong answer. No bonus.',
        quiz_continue: 'CONTINUE ▶',
        quiz_skip: 'SKIP (no bonus)',

        // Inventory strip header
        inv_strip_header: '🎒 INVENTORY',

        // Tutorial steps
        tut2_s0_title: 'Welcome to STOXELS!',
        tut2_s0_text: 'This quick tutorial walks you through the game interface. Use <strong>NEXT ▶</strong> to advance or skip straight to playing.<br><br>STOXELS is a nonogram puzzle game themed around <strong>probability theory & statistics</strong>. Solve puzzles, earn items, and unlock Moodle achievement codes!',

        tut2_s1_title: 'The Game Screen',
        tut2_s1_text: 'Here is what a typical game session looks like. You will see:<br>• A <strong>puzzle grid</strong> in the centre<br>• <strong>Clue numbers</strong> on the rows and columns<br>• A <strong>timer</strong> counting down<br>• Your <strong>inventory</strong> of items below<br><br>Let\'s go through each part.',

        tut2_s2_title: 'The Puzzle Grid',
        tut2_s2_text: '<strong>Left-click</strong> a cell to fill it.<br><strong>Right-click</strong> to mark it empty (✕).<br><strong>Drag</strong> to paint multiple cells at once.<br><br>Filling a cell that should be <em>empty</em> costs you time — so think before you click!',

        tut2_s3_title: 'Row Clues',
        tut2_s3_text: 'The numbers on the <strong>left of each row</strong> tell you how many consecutive filled cells exist in that row, and in what order.<br><br>Example: <strong>3 1</strong> means there is a run of 3 filled cells, then a gap, then 1 filled cell.',

        tut2_s4_title: 'Column Clues',
        tut2_s4_text: 'The numbers <strong>above each column</strong> work the same way — they describe runs of filled cells from top to bottom.<br><br>Use both the row and column clues together to deduce which cells must be filled.',

        tut2_s5_title: 'The Timer',
        tut2_s5_text: 'You have a limited amount of time to complete each puzzle. The clock starts as soon as the level loads.<br><br>⚠️ <strong>Wrong fills cost time!</strong> Each mistake subtracts seconds from the clock. The harsher the difficulty, the bigger the penalty.<br><br>The timer turns orange at 3 minutes remaining and red at 1 minute.',

        tut2_s6_title: 'Penalties',
        tut2_s6_text: 'When you fill a wrong cell:<br>• The cell turns <strong>red ✕</strong><br>• Seconds are subtracted from your timer<br>• The penalty amount is shown here briefly<br><br>On <strong>Easy</strong> difficulty penalties are small. On <strong>Hard</strong> they are brutal. <strong>Hardcore</strong> mode ends the level on the very first mistake!',

        tut2_s7_title: 'Bonus Objective',
        tut2_s7_text: 'Every level has a <strong>bonus objective</strong> shown here — for example: finish in under 20 seconds, or make no mistakes.<br><br>Meet the objective ➜ earn a random item when you finish.<br>If the bonus type is <strong>Quiz</strong>, answering a statistics question correctly gives +50 points and an extra item.',

        tut2_s8_title: 'Inventory',
        tut2_s8_text: 'Items you have earned are shown here. <strong>Click an item to use it</strong> during a level.<br><br>Items include:<br>• 🔦 <em>Reveal</em> — shows correct tiles in green<br>• 🛡️ <em>Shield</em> — absorbs your next mistake<br>• ⏳ <em>+Time</em> — adds seconds to the clock<br>• ☠️ <em>Cursed</em> — powerful but risky, locked for 3 min<br><br><strong>Ironman</strong> mode disables all items for a score bonus.',

        tut2_s9_title: 'Difficulty & Modifiers',
        tut2_s9_text: 'Before starting, choose your <strong>difficulty</strong>:<br>• 🟢 Easy — small penalties, ×0.5 score<br>• 🟡 Normal — standard, ×1 score<br>• 🔴 Hard — heavy penalties, ×1.5 score<br><br>Add optional <strong>modifiers</strong> for a score bonus:<br>• ⏱ Time Trial — only 5 minutes (+20%)<br>• 💀 Hardcore — one mistake = instant fail (+30%)<br>• 🔒 Ironman — no items (+15%)',

        tut2_s10_title: 'You\'re Ready!',
        tut2_s10_text: 'That covers everything! A few last tips:<br><br>• Use <strong>Ctrl + Scroll</strong> to zoom the puzzle<br>• Press <strong>Escape</strong> to go back at any time<br>• Earn enough total score to unlock <strong>Moodle achievement codes</strong><br>• Check the <strong>Highscores</strong> screen to track your progress<br><br>Good luck solving the puzzles! 🎉',


        // Math gate modal
        mg_gate_badge: 'PROBABILITY GATE',
        mg_instruction: 'Solve this exercise to unlock the level:',
        mg_submit: 'CHECK ▶',
        mg_correct: '✓ Correct! Unlocking level…',
        mg_wrong: '✗ Not quite. Attempt {n} — try again!',
        mg_not_a_number: '⚠ Please enter a numeric value.',
        mg_new_q: '🔄 TRY A DIFFERENT QUESTION',
        mg_footer: 'Solve it once and this level stays unlocked permanently.',

        ls_to_next: 'pts to next code',
        ls_all_codes: 'All codes unlocked!',

    },

    de: {
        // Title screen
        tagline: 'WAHRSCHEINLICHKEITSTHEORIE & STATISTIK NONOGRAMME',

        // Navigation buttons
        btn_play: '▶ SPIELEN', btn_howtoplay: '? ANLEITUNG',
        btn_highscores: '🏆 BESTENLISTE', btn_codes: '🔑 MEINE CODES',
        btn_confirm: '▶ LEVEL WÄHLEN', btn_back: '◀ ZURÜCK',
        btn_setup: 'EINR.', btn_menu: 'MENÜ', btn_levels: '◀ LEVELS',
        btn_next: 'WEITER ▶', btn_retry: 'NOCHMAL', btn_retry2: 'NOCHMAL',

        // Reset:
        toast_reset: '🗑 Fortschritt zurückgesetzt. Neuer Start!',

        // Tutorial modal
        tut_title: '▸ SO SPIELST DU STOXELS',
        tut_s1h: 'WAS IST EIN NONOGRAMM?',
        tut_s1p: 'Ein Nonogramm ist ein Gitterpuzzle. Zahlen an Zeilen und Spalten stellen die Anzahl aufeinanderfolgend gefüllter Zellen dar. Enthülle das gesamte Symbol um zu gewinnen!',
        tut_s2h: 'STEUERUNG',
        tut_s2p: '<strong>Linksklick</strong> — Zelle füllen<br><strong>Rechtsklick</strong> — Zelle als leer markieren<br><strong>Linksklick gedrückt halten & Ziehen</strong> — Mehrere Zellen füllen<br><strong>STRG + Mausrad</strong> — Hinein- & herauszoomen zum Skalieren<br><strong>Escape</strong> — Zurück',
        tut_s3h: 'SCHWIERIGKEIT',
        tut_s3p: '<strong style="color:var(--green)">Leicht</strong> — geringe Zeitstrafen bei Fehlern, ×0,5 Punkte<br><strong style="color:var(--yellow)">Normal</strong> — normale Zeitstrafen bei Fehlern, ×1 Punkte<br><strong style="color:var(--red)">Schwer</strong> — schwere Zeitstrafen bei Fehlern, ×1,5 Punkte',
        tut_s4h: 'SPIELMODIFIKATOREN',
        tut_s4p: '<strong style="color:var(--orange)">Time Trial</strong> — 50% weniger Zeit pro Level — 20% Punktemultiplikator<br><strong style="color:var(--red)">Hardcore</strong> — ein Fehler = sofort verloren — 30% Punktemultiplikator<br><strong style="color:var(--purple)">Ironman</strong> — Items können nicht verwendet werden — 15% Punktemultiplikator',
        tut_s5h: 'ITEMS & INVENTAR',
        tut_s5p: 'Erfülle das Bonusziel eines Levels, um ein zufälliges Item zu erhalten. Wiederholte Abschlüsse haben eine 50%-Chance auf einen Glücksfund. Verfluchte Items sind mächtig, aber <strong>für die ersten 3 Minuten eines Levels gesperrt (1 Minute bei aktivem Time Trial)</strong>',
        tut_s6h: 'QUIZ & WAHRSCHEINLICHKEITSTORE',
        tut_s6p: 'Manche Level erfordern nach dem Abschluss eine korrekt beantwortete Quizfrage, um das Bonusziel zu erreichen. Außerdem haben einige Level ein Wahrscheinlichkeitstor, das durch Lösen einer Aufgabe freigeschaltet werden kann.',
        tut_s7h: 'ACHIEVEMENT CODES',
        tut_s7p: 'Erreiche Punktemeilensteine, um Moodle-Codes freizuschalten. Deinen Fortschritt zum nächsten Achievement siehst du im Bestenlisten-Tab. Mehr Punkte lassen sich durch Wiederholen von Levels auf höheren Schwierigkeitsstufen oder durch zusätzliche Modifikatoren verdienen.',

        // Setup screen
        setup_title: '▸ SPIELEINRICHTUNG',
        setup_diff: 'SCHWIERIGKEIT',
        setup_mod: 'MODIFIKATOREN (OPTIONAL)',

        // Difficulty
        diff_easy: 'LEICHT', diff_normal: 'NORMAL', diff_hard: 'SCHWER',
        diff_desc_easy: 'Geringe Zeitstrafen bei Fehlern · 50% weniger Punkte',
        diff_desc_normal: 'Normale Zeitstrafen bei Fehlern · Standard-Punkte',
        diff_desc_hard: 'Starke Zeitstrafen bei Fehlern · 50% mehr Punkte',

        // Modifiers
        mod_tt: '⏱ TIME TRIAL', mod_hc: '💀 HARDCORE', mod_im: '🔒 IRONMAN',
        mod_desc_none: 'Keine Modifikatoren. Normaler Puzzlemodus.',
        mod_desc_tt: '50% weniger Zeit pro Level, aber 20% Punktemultiplikator-Bonus',
        mod_desc_hc: 'ein falsches Feld = sofort verloren, aber 30% Punktemultiplikator-Bonus',
        mod_desc_im: 'Items können nicht verwendet werden, aber 15% Punktemultiplikator-Bonus',

        // In-game HUD
        score_lbl: 'PUNKTE',
        ls_title: 'LEVEL WÄHLEN',

        // Inventory panel
        inv_title: '🎒 INVENTAR',
        item_cost: 'Nutzung: −',
        item_sell: 'Verkauf +',
        inv_empty: 'Noch keine Items.\nErfülle Bonusziele!',

        // Win / lose overlays
        ov_win: 'PUZZLE GELÖST!',
        ov_lose: 'ZEIT UM!',

        // Bonus objective type labels
        bonus_nomiss: '✨ Keine Fehler',
        bonus_fast: '⚡ Schnell',
        bonus_quiz: '🧠 Richtige Antwort',

        // Highscore screen
        hs_title: 'BESTENLISTE',
        hs_total: 'GESAMTPUNKTE', hs_level: 'Level',
        hs_best: 'Bestes Ergebnis', hs_diff: 'Schwierigkeit',
        no_hs: '<strong style="color:var(--orange)">Noch keine Einträge.</strong>',
        hs_mods: 'Mods',
        hs_code_unlocked: 'CODE FREIGESCHALTET',

        // Codes screen
        codes_title: 'MEINE CODES',
        no_codes: 'Noch keine Codes freigeschaltet.\nSammle Punkte, um Achievement-Codes freizuschalten!',

        // Password / Moodle code modal
        pw_title: '🔑 NEUER CODE FREIGESCHALTET!',
        pw_intro: 'Du hast einen Moodle-Code freigeschaltet. Gib ihn in Moodle ein, um dein Abzeichen zu erhalten!',
        pw_hint: 'Gib diesen Code in Moodle ein.',

        // Level select — dynamic strings
        ls_total: 'GESAMT',
        ls_bonus_claimed: 'Bonus erhalten — Belohnung eingelöst!',
        ls_complete_level: 'Level abschließen',
        ls_locked_hint: '🔓 Schließe dieses Level ab für Verbesserungshinweise!',
        ls_no_score: 'Schließe dieses Level ab, um eine Punktzahl zu setzen!',
        ls_max_score: '🏆 Maximale Punktzahl erreicht!',
        ls_tip_harder: '{diff} Schwierigkeit für höheren Multiplikator',
        ls_tip_mods: 'Füge {mods} Modifikator für Bonuspunkte hinzu',
        ls_tip_mods_plural: 'Füge {mods} Modifikatoren für Bonuspunkte hinzu',
        ls_hs_best: 'BEST',

        // In-game HUD
        lvl_prefix: 'LVL',
        zoom_hint: 'Strg + Scrollen zum Zoomen',

        // Penalty / mistake feedback
        pen_shield: '🛡️ Schild hat den Fehler absorbiert!',
        pen_display: '−{n}s (#{m})',

        // Hardcore fail overlay
        hc_fail_title: 'HARDCORE GESCHEITERT!',
        hc_fail_sub: 'Ein Fehler = Spielende im Hardcore-Modus!',

        // Item use toasts
        item_revealed: '{n} Feld enthüllt!',
        item_revealed_pl: '{n} Felder enthüllt!',
        item_cursed_reset: '☠️ VERFLUCHT! Das Brett wurde zurückgesetzt!',
        item_cursed_lucky: '☠️ Glück! 6 Felder enthüllt!',
        item_marked: '{n} leere Felder markiert!',
        item_demon_title: '👁️ DÄMONENAUGE AUSGELÖST!',
        item_demon_sub: 'Das verfluchte Item hat dein Schicksal besiegelt!',
        item_demon_shield: '👁️ Riskanter Schild aktiviert!',
        item_cursed_time_bad: '💀 VERFLUCHT! −4 Minuten!',
        item_cursed_time_good: '💀 Glück! +5 Minuten!',
        item_time_added: '+{n}s hinzugefügt!',
        item_freeze_msg: 'Timer eingefroren 30s!',
        item_shield_msg: 'Schild aktiv!',
        item_cursed_locked: '☠️ Verfluchte Items entsperren nach {n} weiteren Min.',
        item_discarded: 'Item verworfen',
        item_sell_btn: '🗑 Verwerfen',
        inv_cursed_locked_label: '🔒 GESPERRT {n}min+',
        item_row_solved: 'Zeile vollständig enthüllt!',
        item_row_solved_none: 'Alle Zeilen bereits gelöst!',
        item_col_solved: 'Spalte vollständig enthüllt!',
        item_col_solved_none: 'Alle Spalten bereits gelöst!',
        item_mistake_erased: '{n} Fehler aus deiner Zählung gelöscht!',
        item_mistake_erased_none: 'Keine Fehler zum Löschen!',
        item_cursed_row_lucky: '🌊 Glück! {n} Zeile(n) enthüllt!',
        item_cursed_row_bad: '🌊 VERFLUCHT! {n} Zeile(n) gelöscht!',
        item_cursed_col_lucky: '🌪️ Glück! {n} Spalte(n) enthüllt!',
        item_cursed_col_bad: '🌪️ VERFLUCHT! {n} Spalte(n) gelöscht!',
        item_cursed_rowcol_lucky: '💥 JACKPOT! {r} Zeilen + {c} Spalten enthüllt!',
        item_cursed_rowcol_bad: '💥 CHAOS! {n} Zeilen/Spalten gelöscht!',
        item_artifact_complete: '🌟 KODEX aktiviert! Puzzle sofort gelöst!',
        item_primer_activated: "📜 Pfadfinder-Kompass aktiviert! Frage erscheint beim nächsten Level.",
        item_primer_headstart: "Vorsprung angewendet! 2 Zeilen + 2 Spalten vorgelöst.",

        item_cursed_reveal_both: '6 Felder enthüllt! Aber alle ✕-Markierungen gelöscht.',
        item_cursed_time_both: '+5 Min. hinzugefügt, −2 Min. Strafe. Netto: +3 Min.',
        item_cursed_shield_both: 'Schild aktiv + 2 Felder enthüllt! Zeilenhinweise 30s versteckt.',
        item_cursed_row_both: '🌊 {r} Zeile(n) enthüllt · {e} Zeile gelöscht!',
        item_cursed_col_both: '🌪️ {r} Spalte(n) enthüllt · {e} Spalte gelöscht!',
        item_cursed_rowcol_both: '💥 {r} Zeilen + {c} Spalten enthüllt! Spaltenhinweise 45s ausgeblendet.',

        // Inventory rarity labels
        rar_common: 'GEWÖHNLICH', rar_uncommon: 'UNGEWÖHNLICH', rar_rare: 'SELTEN',
        rar_legendary: 'LEGENDÄR', rar_cursed: 'VERFLUCHT',

        // Win overlay
        ov_win_pts: 'Pkt.',
        ov_win_left: 'übrig',
        ov_win_solved_in: 'gelöst in',
        ov_win_mistake: 'Fehler',
        ov_win_mistakes: 'Fehler',
        ov_win_new: 'neu',
        ov_win_best_was: 'Beste war',
        ov_bonus_met: '🎯 BONUS ERFÜLLT!',
        ov_item_earned: '🎁 Item erhalten',
        ov_bonus_claimed_note: '✓ Bonusziel bereits eingelöst — keine doppelte Belohnung.',
        ov_lucky_drop: '🍀 Glücksfund!',
        ov_quiz_reward: '🧠 Quiz-Belohnung',

        // Quiz overlay
        quiz_title: '⭐ BONUSFRAGE',
        quiz_correct: '✓ RICHTIG! +50 Bonuspunkte & Item!',
        quiz_correct_claimed: '✓ Richtig! (Bonus bereits eingelöst — keine doppelte Belohnung.)',
        quiz_wrong: '✗ Falsche Antwort. Kein Bonus.',
        quiz_continue: 'WEITER ▶',
        quiz_skip: 'ÜBERSPRINGEN (kein Bonus)',

        // Inventory strip header
        inv_strip_header: '🎒 INVENTAR',

        // Tutorial steps
        tut2_s0_title: 'Willkommen bei STOXELS!',
        tut2_s0_text: 'Dieses kurze Tutorial führt dich durch die Spieloberfläche. Nutze <strong>WEITER ▶</strong> oder überspringe es gleich.<br><br>STOXELS ist ein Nonogramm-Puzzle-Spiel zum Thema <strong>Wahrscheinlichkeitstheorie & Statistik</strong>. Löse Puzzles, sammle Items und schalte Moodle-Codes frei!',

        tut2_s1_title: 'Der Spielbildschirm',
        tut2_s1_text: 'So sieht eine typische Spielsitzung aus:<br>• Ein <strong>Puzzlegitter</strong> in der Mitte<br>• <strong>Hinweiszahlen</strong> an Zeilen und Spalten<br>• Ein <strong>Timer</strong>, der herunterläuft<br>• Dein <strong>Inventar</strong> unten<br><br>Gehen wir jeden Bereich durch.',

        tut2_s2_title: 'Das Puzzlegitter',
        tut2_s2_text: '<strong>Linksklick</strong> füllt ein Feld.<br><strong>Rechtsklick</strong> markiert es als leer (✕).<br><strong>Ziehen</strong> malt mehrere Felder auf einmal.<br><br>Ein falsch gefülltes Feld kostet Zeit — also erst denken, dann klicken!',

        tut2_s3_title: 'Zeilenhinweise',
        tut2_s3_text: 'Die Zahlen <strong>links jeder Zeile</strong> zeigen, wie viele aufeinanderfolgende gefüllte Felder in dieser Zeile existieren und in welcher Reihenfolge.<br><br>Beispiel: <strong>3 1</strong> bedeutet ein Block von 3 Feldern, dann eine Lücke, dann 1 Feld.',

        tut2_s4_title: 'Spaltenhinweise',
        tut2_s4_text: 'Die Zahlen <strong>über jeder Spalte</strong> funktionieren genauso — sie beschreiben Blöcke von oben nach unten.<br><br>Nutze Zeilen- und Spaltenhinweise zusammen, um die richtigen Felder zu bestimmen.',

        tut2_s5_title: 'Der Timer',
        tut2_s5_text: 'Du hast begrenzte Zeit für jedes Puzzle. Die Uhr startet sofort mit dem Level.<br><br>⚠️ <strong>Falsche Felder kosten Zeit!</strong> Jeder Fehler zieht Sekunden ab. Je schwerer der Schwierigkeitsgrad, desto größer die Strafe.<br><br>Der Timer wird bei 3 Minuten orange und bei 1 Minute rot.',

        tut2_s6_title: 'Strafen',
        tut2_s6_text: 'Bei einem falschen Feld:<br>• Das Feld wird <strong>rot ✕</strong><br>• Sekunden werden abgezogen<br>• Die Strafe wird kurz hier angezeigt<br><br>Bei <strong>Leicht</strong> sind Strafen klein. Bei <strong>Schwer</strong> brutal. <strong>Hardcore</strong> beendet das Level beim ersten Fehler!',

        tut2_s7_title: 'Bonusziel',
        tut2_s7_text: 'Jedes Level hat ein <strong>Bonusziel</strong> — z.B. unter 20 Sekunden fertig werden oder keine Fehler machen.<br><br>Ziel erreicht ➜ zufälliges Item als Belohnung, wenn du fertig bist.<br>Beim Typ <strong>Quiz</strong> gibt eine korrekte Antwort auf eine Statistikfrage +50 Punkte und ein Extra-Item.',

        tut2_s8_title: 'Inventar',
        tut2_s8_text: 'Hier werden deine Items angezeigt. <strong>Klicke ein Item um es zu benutzen</strong>.<br><br>Items umfassen:<br>• 🔦 <em>Enthüllen</em> — zeigt richtige Felder grün<br>• 🛡️ <em>Schild</em> — absorbiert den nächsten Fehler<br>• ⏳ <em>+Zeit</em> — fügt Sekunden hinzu<br>• ☠️ <em>Verflucht</em> — mächtig, aber riskant, 3 Min. gesperrt<br><br><strong>Ironman</strong>-Modus deaktiviert alle Items für einen Punktebonus.',

        tut2_s9_title: 'Schwierigkeit & Modifikatoren',
        tut2_s9_text: 'Wähle vor dem Start die <strong>Schwierigkeit</strong>:<br>• 🟢 Leicht — kleine Strafen, ×0,5 Punkte<br>• 🟡 Normal — Standard, ×1 Punkte<br>• 🔴 Schwer — schwere Strafen, ×1,5 Punkte<br><br>Füge optionale <strong>Modifikatoren</strong> für einen Punktebonus hinzu:<br>• ⏱ Time Trial — nur 5 Minuten (+20%)<br>• 💀 Hardcore — ein Fehler = sofort verloren (+30%)<br>• 🔒 Ironman — keine Items (+15%)',

        tut2_s10_title: 'Du bist bereit!',
        tut2_s10_text: 'Das war alles! Noch ein paar letzte Tipps:<br><br>• <strong>Strg + Scrollen</strong> zum Zoomen<br>• <strong>Escape</strong> um jederzeit zurückzugehen<br>• Genug Punkte sammeln für <strong>Moodle-Codes</strong><br>• In der <strong>Bestenliste</strong> deinen Fortschritt verfolgen<br><br>Viel Erfolg beim Rätsellösen! 🎉',

        // Math gate modal
        mg_gate_badge: 'WAHRSCHEINLICHKEITSTOR',
        mg_instruction: 'Löse diese Aufgabe, um das Level freizuschalten:',
        mg_submit: 'PRÜFEN ▶',
        mg_correct: '✓ Richtig! Level wird geöffnet…',
        mg_wrong: '✗ Nicht ganz. Versuch {n} — nochmals!',
        mg_not_a_number: '⚠ Bitte gib einen numerischen Wert ein.',
        mg_new_q: '🔄 ANDERE AUFGABE VERSUCHEN',
        mg_footer: 'Löse es einmal und das Level bleibt dauerhaft freigeschaltet.',

        ls_to_next: 'Pkt. bis nächster Code',
        ls_all_codes: 'Alle Codes freigeschaltet!',

    }
};