//------------------------------------------------------------------------
//-------------------CHARACTER BANTER (SPEECH BUBBLE)----------------------
//------------------------------------------------------------------------
// Shows a speech bubble above-right of the player's sprite during puzzle
// levels. Lines are picked per-character (Stox / Trix / Syla) and per
// trigger (mistakes, items, streaks, etc.) to give each character a
// distinct personality:
//   - Stox  : analytical, dry, "math nerd"
//   - Trix  : arrogant, know-it-all, full of herself
//   - Syla  : down-to-earth, childish/naive, sees the good in everything
//
// This file owns:
//   - the line bank (_BANTER_LINES)
//   - the bubble DOM element (create / position / show / hide)
//   - triggerBanter(eventKey, ctx) — the single public entry point
//   - cooldown + chance gating so lines don't spam every tick
//
// All other files just call triggerBanter('some_event') at the moment
// that event happens. See bottom of file for the full list of event keys.
//------------------------------------------------------------------------


//------------------------------------------------------------------------
//-------------------LINE BANK----------------------------------------------
//------------------------------------------------------------------------
// Keyed by character -> event key -> array of { en, de } lines.
// One is picked at random each time triggerBanter() fires for that event.
//------------------------------------------------------------------------

const _BANTER_LINES = {
    stox: {
        level_start: [
            { en: "Let's see the distribution of this one.", de: "Schauen wir uns die Verteilung an." },
            { en: "Hypothesis: solvable. Let's test it.", de: "Hypothese: lösbar. Testen wir das." },
            { en: "Initial conditions look... manageable.", de: "Die Ausgangsbedingungen sehen... machbar aus." },
            { en: "Every grid is just a system waiting to be solved.", de: "Jedes Raster ist nur ein System, das darauf wartet, gelöst zu werden." },
            { en: "Let's approach this methodically.", de: "Gehen wir das methodisch an." },
            { en: "The pattern is in here somewhere. It always is.", de: "Das Muster steckt irgendwo drin. Das ist immer so." },
            { en: "I've cross-referenced worse than this.", de: "Ich hab Schlimmeres abgeglichen." },
            { en: "Every anomaly leaves a signature. Let's find this one's.", de: "Jede Anomalie hinterlässt eine Signatur. Finden wir diese." },
        ],
        mistake_single: [
            { en: "Hm. Noted. Recalculating.", de: "Hm. Notiert. Neu berechnet." },
            { en: "An outlier. Statistically expected, actually.", de: "Ein Ausreißer. Statistisch eigentlich erwartet." },
            { en: "Data point rejected. Adjusting the model.", de: "Datenpunkt verworfen. Modell wird angepasst." },
            { en: "Error margin updated.", de: "Fehlermarge aktualisiert." },
            { en: "Within acceptable variance. Continuing.", de: "Innerhalb akzeptabler Varianz. Weiter geht's." },
            { en: "Wrong. But informative.", de: "Falsch. Aber aufschlussreich." },
            { en: "That's one path eliminated. Good.", de: "Ein Weg weniger. Gut." },
        ],
        mistake_streak: [
            { en: "Three errors in a row isn't randomness anymore, it's a pattern.", de: "Drei Fehler in Folge sind kein Zufall mehr, das ist ein Muster." },
            { en: "Let's slow down and actually read the clues.", de: "Lass uns langsamer machen und die Hinweise wirklich lesen." },
            { en: "I'm seeing a correlation between speed and errors here.", de: "Ich sehe hier eine Korrelation zwischen Tempo und Fehlern." },
            { en: "Maybe we re-verify our assumptions before the next cell.", de: "Vielleicht überprüfen wir unsere Annahmen, bevor wir weitermachen." },
            { en: "This isn't going well. Let's reassess.", de: "Das läuft nicht gut. Lass uns das neu bewerten." },
            { en: "I spent three hundred years of records learning to read patterns. This one is not going to beat me.", de: "Ich hab drei Jahrhunderte Aufzeichnungen studiert. Dieses Muster schlägt mich nicht." },
            { en: "The archive never gave me easy answers either. Adjust and continue.", de: "Das Archiv hat mir auch keine einfachen Antworten gegeben. Anpassen und weitermachen." },
        ],
        mistake_absorbed: [
            { en: "Mitigated. The model accounted for that.", de: "Abgefedert. Das Modell hat das eingeplant." },
            { en: "Contingency held. As designed.", de: "Der Notfallplan hat funktioniert. Wie geplant." },
            { en: "No cost incurred. Good.", de: "Keine Kosten entstanden. Gut." },
        ],
        correct_streak: [
            { en: "Consistent. I like consistent.", de: "Konsistent. Ich mag konsistent." },
            { en: "The error rate is converging nicely.", de: "Die Fehlerrate konvergiert schön." },
            { en: "This is what a stable process looks like.", de: "So sieht ein stabiler Prozess aus." },
            { en: "Precision noted. Keep going.", de: "Präzision notiert. Weiter so." },
            { en: "The data is cooperating. Unusual, but welcome.", de: "Die Daten kooperieren. Ungewöhnlich, aber willkommen." },
            { en: "Cross-referenced and confirmed.", de: "Abgeglichen und bestätigt." },
            { en: "This is what it feels like when the model holds.", de: "So fühlt es sich an, wenn das Modell stimmt." },
        ],
        item_used_generic: [
            { en: "A calculated use of resources.", de: "Ein kalkulierter Einsatz von Ressourcen." },
            { en: "Efficient. I'd have done the same.", de: "Effizient. Das hätte ich genauso gemacht." },
            { en: "Resource allocation: optimal.", de: "Ressourcenverteilung: optimal." },
        ],
        item_used_cursed: [
            { en: "Interesting. High variance, high reward.", de: "Interessant. Hohe Varianz, hohe Belohnung." },
            { en: "Risky. Let's see if the expected value holds up.", de: "Riskant. Mal sehen, ob der Erwartungswert standhält." },
        ],
        lucky_tile: [
            { en: "Luck is just probability you haven't modeled yet.", de: "Glück ist nur Wahrscheinlichkeit, die du noch nicht modelliert hast." },
            { en: "A favorable deviation. I'll take it.", de: "Eine günstige Abweichung. Ich nehm's." },
            { en: "An unexpected variable. Updating the model.", de: "Eine unerwartete Variable. Modell wird aktualisiert." },
        ],
        low_time: [
            { en: "Time is a finite resource. Allocate it wisely.", de: "Zeit ist eine endliche Ressource. Setz sie klug ein." },
            { en: "We're entering the critical window.", de: "Wir betreten das kritische Zeitfenster." },
            { en: "I did not leave the archive to fail out here.", de: "Ich hab das Archiv nicht verlassen, um hier zu scheitern." },
        ],
        win: [
            { en: "As predicted.", de: "Wie vorhergesagt." },
            { en: "Solved. The data never lies.", de: "Gelöst. Die Daten lügen nie." },
            { en: "Hypothesis confirmed.", de: "Hypothese bestätigt." },
            { en: "A clean result. Satisfying.", de: "Ein sauberes Ergebnis. Befriedigend." },
            { en: "One more piece of the pattern.", de: "Noch ein Stück des Musters." },
            { en: "The Collapse was deliberate. Every solved Stoxel makes that clearer.", de: "Der Kollaps war absichtlich. Jeder gelöste Stoxel macht das deutlicher." },
            { en: "Filed. Moving on.", de: "Notiert. Weiter." },
        ],
    },

    trix: {
        level_start: [
            { en: "Oh please, this one's basically solved already.", de: "Bitte, das hier ist quasi schon gelöst." },
            { en: "Watch and learn.", de: "Schau und lern." },
            { en: "Another puzzle that won't stand a chance against me.", de: "Noch ein Rätsel, das gegen mich keine Chance hat." },
            { en: "Step aside, I've got this.", de: "Geh zur Seite, ich hab das." },
            { en: "This'll be fun. For me, anyway.", de: "Das wird lustig. Für mich zumindest." },
            { en: "I've broken into harder things than this.", de: "Ich hab schon härtere Sachen geknackt als das." },
            { en: "The Warden thought he was clever too. He wasn't.", de: "Der Warden dachte auch, er wäre clever. War er nicht." },
            { en: "Another lock. Another key I'll find.", de: "Noch ein Schloss. Noch ein Schlüssel, den ich finden werde." },
        ],
        mistake_single: [
            { en: "Oops. Lucky I'm carrying us.", de: "Oops. Gut, dass ich uns trage." },
            { en: "Pfft, that one didn't count.", de: "Pff, der zählt nicht." },
            { en: "Even I have an off-second sometimes.", de: "Sogar ich hab mal eine schlechte Sekunde." },
            { en: "Barely a scratch on my record.", de: "Kaum ein Kratzer in meiner Bilanz." },
            { en: "I meant to do that. Scouting.", de: "Das war Absicht. Aufklärung." },
            { en: "The Rift taught me worse. I'm fine.", de: "Der Rift hat mich Schlimmeres gelehrt. Mir geht's gut." },
        ],
        mistake_streak: [
            { en: "Okay, dummy... maybe just let me handle this.", de: "Okay, Dummerchen... lass mich das vielleicht einfach machen." },
            { en: "Wow. Just— wow. Move over.", de: "Wow. Einfach... wow. Mach Platz." },
            { en: "Are you doing this on purpose?", de: "Machst du das mit Absicht?" },
            { en: "Okay, I'm taking over now.", de: "Okay, ich übernehme jetzt." },
            { en: "This is painful to watch.", de: "Das ist schmerzhaft anzusehen." },
        ],
        mistake_absorbed: [
            { en: "You're welcome.", de: "Bitte schön." },
            { en: "Saved your skin again.", de: "Hab dich mal wieder gerettet." },
            { en: "That's what I'm here for.", de: "Dafür bin ich ja da." },
        ],
        correct_streak: [
            { en: "See, this is what I'm talking about. Flawless.", de: "Siehst du, genau davon rede ich. Makellos." },
            { en: "Obviously. I make it look easy.", de: "Logisch. Ich mach's einfach aussehen." },
            { en: "We're unstoppable. Well, I am.", de: "Wir sind unaufhaltsam. Also, ich bin's." },
            { en: "Take notes, this is how it's done.", de: "Mach dir Notizen, so macht man das." },
            { en: "My family survived the Regression Rift. I can survive a bad streak.", de: "Meine Familie hat den Regression-Rift überlebt. Ich überlebe auch eine Pechsträhne." },
            { en: "The Guild thinks I'm loyal. The puzzle should be at least as easy to fool.", de: "Die Gilde denkt, ich bin loyal. Das Rätsel sollte genauso leicht zu täuschen sein." },
            { en: "See, when I actually try, it's not even close.", de: "Siehst du, wenn ich mich wirklich anstrenge, ist es nicht mal knapp." },
            { en: "My name was in the archive. Turns out that counts for something.", de: "Mein Name stand im Archiv. Stellt sich raus, das zählt für was." },
        ],
        item_used_generic: [
            { en: "Cheating? No. Optimal play. There's a difference.", de: "Schummeln? Nein. Optimales Spiel. Da ist ein Unterschied." },
            { en: "I deserve this item, honestly.", de: "Ich verdien dieses Item, ehrlich gesagt." },
            { en: "Of course I'd use it perfectly.", de: "Klar nutz ich's perfekt." },
        ],
        item_used_cursed: [
            { en: "Ooh, risky. I love it.", de: "Ooh, riskant. Ich liebe es." },
            { en: "Danger just makes it more fun.", de: "Gefahr macht's nur lustiger." },
            { en: "Risk is just probability you're not afraid of.", de: "Risiko ist nur Wahrscheinlichkeit, vor der man keine Angst hat." },
        ],
        lucky_tile: [
            { en: "Of course I found that. I find everything.", de: "Klar hab ich das gefunden. Ich finde alles." },
            { en: "Lucky? Please, that was skill.", de: "Glück? Bitte, das war Können." },
            { en: "The archive had my name. Of course the grid does too.", de: "Das Archiv hatte meinen Namen. Natürlich hat ihn das Raster auch." },
        ],
        low_time: [
            { en: "Relax, I've got this under control. Probably.", de: "Entspann dich, ich hab das im Griff. Wahrscheinlich." },
            { en: "Pressure makes me better, actually.", de: "Druck macht mich eigentlich nur besser." },
            { en: "I've had tighter escapes. This is nothing.", de: "Ich hab engere Entkommen erlebt. Das ist nichts." },
        ],
        win: [
            { en: "Called it. I'm always right.", de: "Hab ich's doch gesagt. Ich hab immer recht." },
            { en: "Another flawless victory for me.", de: "Noch ein makelloser Sieg für mich." },
            { en: "Easy. Next.", de: "Easy. Nächstes." },
            { en: "Was there ever any doubt?", de: "Gab's da je einen Zweifel?" },
            { en: "Knew exactly which door to pick. Same as always.", de: "Wusste genau, welche Tür ich nehmen soll. Wie immer." },
            { en: "The key always turns for me. It's practically tradition.", de: "Der Schlüssel dreht sich immer für mich. Es ist schon fast Tradition." },
        ],
    },

    syla: {
        level_start: [
            { en: "Ooh, this grid looks like a little garden plot!", de: "Ooh, dieses Raster sieht aus wie ein kleines Gartenbeet!" },
            { en: "Every puzzle's got something nice hiding in it.", de: "In jedem Rätsel steckt was Schönes." },
            { en: "Hi grid! Let's be friends.", de: "Hallo Raster! Lass uns Freunde sein." },
            { en: "I wonder what little picture is hiding in here.", de: "Ich frag mich, welches kleine Bild sich hier versteckt." },
            { en: "New puzzle, new adventure!", de: "Neues Rätsel, neues Abenteuer!" },
            { en: "The fox is waiting. Let's do this quickly.", de: "Der Fuchs wartet. Lass uns das schnell machen." },
            { en: "The Grove taught me to read patterns. This is just a different kind.", de: "Der Hain hat mich gelehrt, Muster zu lesen. Das hier ist nur eine andere Art." },
            { en: "Every Stoxel is something that needs healing. Let's help it.", de: "Jeder Stoxel ist etwas, das Heilung braucht. Lass uns helfen." },
        ],
        mistake_single: [
            { en: "That's okay! Mistakes are just how you learn.", de: "Ist schon okay! Fehler sind einfach Lernen." },
            { en: "Oopsie. No big deal.", de: "Hoppla. Halb so schlimm." },
            { en: "The grid forgives, I'm sure.", de: "Das Raster verzeiht bestimmt." },
            { en: "Aw, close though!", de: "Ach, war aber knapp!" },
            { en: "Even the fox takes the wrong path sometimes!", de: "Auch der Fuchs nimmt manchmal den falschen Weg!" },
            { en: "Papa made mistakes in his logs too. He always found the right answer eventually.", de: "Papa hat auch Fehler in seinen Aufzeichnungen gemacht. Er hat immer irgendwann die richtige Antwort gefunden." },
        ],
        mistake_streak: [
            { en: "No worries, no worries — we'll figure it out together!", de: "Kein Stress, kein Stress — wir kriegen das schon zusammen hin!" },
            { en: "Even the grid doesn't mean to be tricky, I think.", de: "Ich glaub, nicht mal das Raster will uns ärgern." },
            { en: "Let's just take a little breath and try again.", de: "Lass uns kurz durchatmen und's nochmal versuchen." },
            { en: "It's okay! Every flower needs a little rain too.", de: "Ist schon okay! Auch jede Blume braucht mal ein bisschen Regen." },
            { en: "The animals in the Grove were stuck in a loop too. Being patient was how we helped them.", de: "Die Tiere im Hain steckten auch in einer Schleife. Geduld war der Weg, ihnen zu helfen." },
            { en: "Mama always said: when the data doesn't fit, check what you're measuring.", de: "Mama hat immer gesagt: Wenn die Daten nicht stimmen, prüf, was du misst." },
        ],
        mistake_absorbed: [
            { en: "Phew, that was close! Lucky us.", de: "Puh, das war knapp! Glück gehabt." },
            { en: "Something looked out for us there!", de: "Da hat irgendwas auf uns aufgepasst!" },
        ],
        correct_streak: [
            { en: "We're on a little roll! Yay!", de: "Wir sind richtig im Flow! Juhu!" },
            { en: "Look at us go!", de: "Schau uns an, wie wir das hinkriegen!" },
            { en: "This feels really nice, doesn't it?", de: "Das fühlt sich richtig schön an, oder?" },
            { en: "The pattern is starting to sing! Like the birds did before everything went quiet.", de: "Das Muster fängt an zu singen! Wie die Vögel, bevor alles still wurde." },
            { en: "One step closer to bringing them home.", de: "Einen Schritt näher daran, sie nach Hause zu bringen." },

        ],
        item_used_generic: [
            { en: "Ooh, a little helper! Thank you, helper.", de: "Ooh, ein kleiner Helfer! Danke, Helferlein." },
            { en: "Yay, teamwork!", de: "Juhu, Teamarbeit!" },
        ],
        item_used_cursed: [
            { en: "It looks spooky but I'm sure it means well.", de: "Sieht gruselig aus, aber meint's bestimmt gut." },
            { en: "Ooh, a little scary! But exciting too!", de: "Ooh, ein bisschen gruselig! Aber auch aufregend!" },
        ],
        lucky_tile: [
            { en: "A little present from the grid!", de: "Ein kleines Geschenk vom Raster!" },
            { en: "Aw, it's like the puzzle likes us.", de: "Aw, es ist, als würde das Rätsel uns mögen." },
            { en: "Just like the Grove used to give little gifts. I've missed that.", de: "Genau wie der Hain früher kleine Geschenke gemacht hat. Das hab ich vermisst." },
        ],
        low_time: [
            { en: "Time's getting short, but we're doing great!", de: "Die Zeit wird knapp, aber wir machen das super!" },
            { en: "Quick quick, but no need to panic!", de: "Schnell schnell, aber keine Panik!" },
            { en: "My parents are still out there in that loop. I can't afford to fail.", de: "Meine Eltern stecken noch in dieser Schleife. Ich kann es mir nicht leisten zu scheitern." },
        ],
        win: [
            { en: "We did it! I knew the grid believed in us.", de: "Wir haben's geschafft! Ich wusste, das Raster glaubt an uns." },
            { en: "Yay! Another happy ending.", de: "Juhu! Wieder ein Happy End." },
            { en: "See, everything works out!", de: "Siehst du, alles wird gut!" },
            { en: "One more wound closed. The Grove will feel that, I think.", de: "Noch eine Wunde geschlossen. Der Hain wird das spüren, glaube ich." },
            { en: "That's how you heal something. Carefully, piece by piece.", de: "So heilt man etwas. Behutsam, Stück für Stück." },
            { en: "I'm coming, little fox. Just a few more of these.", de: "Ich komme, kleiner Fuchs. Nur noch ein paar davon." },
        ],
    },
};







//------------------------------------------------------------------------
//-------------------TRIGGER CONFIG-----------------------------------------
//------------------------------------------------------------------------
// Per-event chance (0-1) and minimum cooldown (ms) before the SAME event
// key can fire banter again. Events not listed default to chance 1.0
// and the DEFAULT cooldown.
//------------------------------------------------------------------------

const _BANTER_DEFAULT_COOLDOWN_MS = 12000;

const _BANTER_EVENT_CFG = {
    level_start: { chance: 0.6, cooldownMs: 0 },
    mistake_single: { chance: 0.18, cooldownMs: 15000 },
    mistake_streak: { chance: 0.9, cooldownMs: 25000 },
    mistake_absorbed: { chance: 0.35, cooldownMs: 15000 },
    correct_streak: { chance: 0.5, cooldownMs: 30000 },
    item_used_generic: { chance: 0.25, cooldownMs: 15000 },
    item_used_cursed: { chance: 0.6, cooldownMs: 15000 },
    lucky_tile: { chance: 0.5, cooldownMs: 15000 },
    low_time: { chance: 1.0, cooldownMs: 9999999 }, // effectively once per level (gated by flag too)
    win: { chance: 0.7, cooldownMs: 0 },
};

// Global gate: minimum gap between ANY two banter lines, regardless of
// event key, so the bubble never feels spammy even if several different
// triggers fire in quick succession.
const _BANTER_GLOBAL_MIN_GAP_MS = 6000;

// Runtime cooldown tracking. Reset per level in resetBanterState().
let _banterLastShownByEvent = {};
let _banterLastShownAt = 0;
let _banterLowTimeFired = false;


//------------------------------------------------------------------------
//-------------------BUBBLE DOM HELPERS-------------------------------------
//------------------------------------------------------------------------

// Returns the avatar wrapper the bubble should attach to — the simple
// (non-monster level) avatar or the full (monster level) avatar,
// whichever currently exists.
function _banterGetAvatarEl() {
    return document.getElementById('player-avatar-simple')
        || document.getElementById('player-avatar-wrapper');
}

// Creates (if needed) and returns the bubble element, attached to body
// so it can be positioned with fixed coordinates relative to the avatar.
function _banterEnsureBubbleEl() {
    let bubble = document.getElementById('char-speech-bubble');
    if (bubble) return bubble;

    bubble = document.createElement('div');
    bubble.id = 'char-speech-bubble';
    bubble.className = 'char-speech-bubble';
    bubble.innerHTML = `<div class="char-speech-bubble-text" id="char-speech-bubble-text"></div>`;
    document.body.appendChild(bubble);
    return bubble;
}

// Positions the bubble to the top-right of the current avatar element.
function _banterPositionBubble(bubble) {
    const avatar = _banterGetAvatarEl();
    if (!avatar) return false;

    const rect = avatar.getBoundingClientRect();
    // Anchor near the top-right corner of the avatar sprite.
    const left = rect.right - 10;
    const top = rect.top - 8;

    bubble.style.left = `${left}px`;
    bubble.style.top = `${top}px`;
    return true;
}

// Hides and clears the bubble immediately (no fade).
function hideCharacterBanter() {
    const bubble = document.getElementById('char-speech-bubble');
    if (!bubble) return;
    bubble.classList.remove('show');
    if (window._banterHideTimeout) {
        clearTimeout(window._banterHideTimeout);
        window._banterHideTimeout = null;
    }
}

// Shows the bubble with the given text for a few seconds, then fades out.
function _banterShowBubble(text) {
    const bubble = _banterEnsureBubbleEl();
    const textEl = document.getElementById('char-speech-bubble-text');
    if (!textEl) return;

    textEl.textContent = text;

    if (!_banterPositionBubble(bubble)) return; // no avatar on screen — skip

    bubble.classList.add('show');

    if (window._banterHideTimeout) clearTimeout(window._banterHideTimeout);
    window._banterHideTimeout = setTimeout(() => {
        bubble.classList.remove('show');
    }, 4200);
}


// Repositions the bubble (if it's currently visible) without changing its
// text or restarting its hide timer. Called whenever the avatar moves.
function _banterRepositionBubbleIfVisible() {
    const bubble = document.getElementById('char-speech-bubble');
    if (!bubble || !bubble.classList.contains('show')) return;
    _banterPositionBubble(bubble);
}


//------------------------------------------------------------------------
//-------------------LINE SELECTION-----------------------------------------
//------------------------------------------------------------------------

// Picks a random localized line for the given character + event key.
// Returns null if no lines are defined (so callers can no-op safely).
function _banterPickLine(charId, eventKey) {
    const lines = _BANTER_LINES[charId]?.[eventKey];
    if (!lines || lines.length === 0) return null;

    const entry = lines[Math.floor(Math.random() * lines.length)];
    const lang = typeof LANG !== 'undefined' ? LANG : 'en';
    return (lang === 'de' && entry.de) ? entry.de : entry.en;
}


//------------------------------------------------------------------------
//-------------------PUBLIC ENTRY POINT-------------------------------------
//------------------------------------------------------------------------

// Call this from gameplay code whenever a banter-worthy event happens.
// eventKey must match a key used in _BANTER_LINES / _BANTER_EVENT_CFG.
// Handles: character selection check, chance roll, per-event cooldown,
// and the global minimum gap between any two lines.
function triggerBanter(eventKey) {
    const charId = STATE?.playerCharacter;
    if (!charId || !_BANTER_LINES[charId]) return; // no character chosen yet

    const cfg = _BANTER_EVENT_CFG[eventKey] || { chance: 1.0, cooldownMs: _BANTER_DEFAULT_COOLDOWN_MS };
    const now = Date.now();

    // Global gap: don't show two lines back-to-back regardless of source.
    if (now - _banterLastShownAt < _BANTER_GLOBAL_MIN_GAP_MS) return;

    // Per-event cooldown.
    const lastForEvent = _banterLastShownByEvent[eventKey] || 0;
    if (now - lastForEvent < cfg.cooldownMs) return;

    // Chance roll.
    if (Math.random() >= cfg.chance) return;

    const line = _banterPickLine(charId, eventKey);
    if (!line) return;

    _banterLastShownAt = now;
    _banterLastShownByEvent[eventKey] = now;

    _banterShowBubble(line);
}

// Special-cased entry point for the "low time" warning so it only ever
// fires once per level (separate from the normal per-event cooldown,
// since levels can run long and we don't want repeats every cooldown window).
function triggerLowTimeBanterIfNeeded() {
    if (_banterLowTimeFired) return;
    if (typeof timerSecs === 'undefined' || timerSecs > 60 || timerSecs <= 0) return;

    _banterLowTimeFired = true;
    triggerBanter('low_time');
}

// Resets all banter cooldown/flag state. Call at the start of each level
// (alongside the other _reset* helpers in start-level.js).
function resetBanterState() {
    _banterLastShownByEvent = {};
    _banterLastShownAt = 0;
    _banterLowTimeFired = false;
    hideCharacterBanter();
}


//------------------------------------------------------------------------
//-------------------EVENT KEY REFERENCE------------------------------------
//------------------------------------------------------------------------
// level_start        — fired once when a level/puzzle screen opens
// mistake_single      — fired on an ordinary (unabsorbed) wrong fill
// mistake_streak       — fired when several mistakes happen close together
// mistake_absorbed    — fired when a shield/freeze/CI absorbs a mistake
// correct_streak       — fired on a long run of consecutive correct fills
// item_used_generic   — fired when a normal (non-cursed) item is used
// item_used_cursed    — fired when a cursed item is used
// lucky_tile           — fired when a lucky tile reward is claimed
// low_time              — fired once when the timer drops under 60s
// win                       — fired when the puzzle is solved
//------------------------------------------------------------------------