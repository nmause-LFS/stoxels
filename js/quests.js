// ═══════════════════════════════════════════════════════════════════════════════
//
//  THE STOCHASTIC LEDGER  –  Progression System
//
//  A full replacement for the former Quest Log.
//  Public API (unchanged names, called from other modules):
//    migrateQuestState(s)
//    updateQuestStats(event, payload)
//    buildQuestLogButton()
//    showQuestLog()  /  hideQuestLog()
//    renderQuestLog()
//    claimQuest(questId)
//    _refreshQuestBadge()
//
//  Callers that feed data in:
//    scoring.js            checkWin()                  → 'levelComplete'
//    quiz.js               _resolveQuizAnswer()        → 'questionCorrect'  source:'quiz'
//    mathgate.js           mgHandleCorrectAnswer()     → 'questionCorrect'  source:'gate'
//    scouts-primer.js      showPrimerResult()          → 'questionCorrect'  source:'primer'
//    scouts-primer.js      (full-solve branch)         → 'primerFullSolve'
//    inventory-use-item.js _consumeItem()              → 'itemUsed'
//    class-abilities.js    _dispatchActiveAbility      → 'classAbilityUsed'
//    class-abilities.js    _statisticianTriggerMomentum→ 'momentumTriggered'
//    class-abilities.js    _executeArcaneReveal        → 'tilesRevealed'
//    game / class-select   (class chosen)              → 'classChosen'
//    game / ascension      (upgrade applied)           → 'classUpgradeApplied'
//    passive-tree-state-points.js (_ptSpendPoint)      → 'passivePointSpent'
//    achievements.js       (on any ach unlocked)       → 'achievementUnlocked'
//
// ═══════════════════════════════════════════════════════════════════════════════


function _ptCurrentSpentCount() {
    const alloc = (typeof _ptAllocated === 'function') ? _ptAllocated() : new Set();
    // Subtract 1 for the start node, which is always allocated for free
    const count = Math.max(0, alloc.size - 1);
    return count;
}


// ─────────────────────────────────────────────────────────────
//  STATE MIGRATION
// ─────────────────────────────────────────────────────────────

function migrateQuestState(s) {
    if (!s.questStats) s.questStats = {};
    if (!s.questsClaimed) s.questsClaimed = [];
}


// ─────────────────────────────────────────────────────────────
//  updateQuestStats — single hook for all other modules
// ─────────────────────────────────────────────────────────────

function updateQuestStats(event, payload = {}) {
    if (!STATE.questStats) STATE.questStats = {};
    const qs = STATE.questStats;
    const inc = (key, by = 1) => { qs[key] = (qs[key] || 0) + by; };

    switch (event) {

        case 'levelComplete': {
            // payload: { gi, world, diff, mods, mistakeCount, itemsUsed,
            //            isConvergence, worldJustCompleted, luckyDropTriggered,
            //            elapsed, timerSecs, pts }
            inc('levelsCompleted');
            if (payload.mistakeCount === 0) inc('levelsNomiss');
            if (payload.itemsUsed === 0) inc('levelsNoitem');
            if (payload.mods && payload.mods.hardcore) inc('levelsHardcore');
            if (payload.mods && payload.mods.timetrial) inc('levelsTimetrial');
            if (payload.mods && payload.mods.ironman) inc('levelsIronman');
            if (payload.diff === 'hard') inc('levelsHard');

            // Triple-modifier: hard difficulty + all three modifiers simultaneously
            if (payload.diff === 'hard' &&
                payload.mods && payload.mods.hardcore &&
                payload.mods.timetrial && payload.mods.ironman) {
                inc('levelsTripleModifier');
            }

            if (payload.gi !== undefined) inc(`levelReplays_${payload.gi}`);

            // Levels completed while specific passive-tree nodes are active
            const ptChecks = [
                'lucky_drops', 'tutor_enable', 'celerity',
                'keystone_apex_collector', 'keystone_curse_embrace',
                'keystone_iron_doctrine', 'keystone_countdown_crisis',
            ];
            ptChecks.forEach(node => {
                if (typeof ptHasSkill === 'function' && ptHasSkill(node)) {
                    inc(`levelsWithPTNode_${node}`);
                }
            });

            // Levels completed while any of the bonus_replay nodes are active
            const hasAnyReplayNode = ['bonus_replay_1', 'bonus_replay_2', 'bonus_replay_3']
                .some(n => typeof ptHasSkill === 'function' && ptHasSkill(n));
            if (hasAnyReplayNode) inc('levelsWithReplayNode');

            if (payload.isConvergence) inc('convergenceLevels');
            if (payload.worldJustCompleted) inc('worldsCompleted');
            if (payload.luckyDropTriggered) inc('luckyDropsClaimed');
            break;
        }

        case 'questionCorrect':
            inc('questionsCorrect');
            if (payload.source === 'quiz') inc('quizCorrect');
            if (payload.source === 'gate') inc('gatesPassed');
            if (payload.source === 'primer') inc('primerCorrect');
            break;

        case 'primerFullSolve':
            // Called when the Scout's Primer item pre-solves the ENTIRE puzzle
            inc('primerFullSolves');
            break;

        case 'itemUsed':
            inc('itemsUsedTotal');
            if (payload.rarity === 'cursed') inc('cursedItemsUsed');
            if (payload.defId && payload.defId.startsWith('reveal') &&
                payload.defId !== 'cursedReveal') inc('revealItemsUsed');
            if (payload.defId && (payload.defId === 'mistakeEraser' ||
                payload.defId === 'mistakeEraser4' ||
                payload.defId === 'mistakeEraser6' ||
                payload.defId === 'mistakeEraserAll')) inc('tutorItemsUsed');
            if (payload.defId === 'scoutPrimer') inc('primerItemsUsed');
            break;

        case 'classAbilityUsed':
            inc('classAbilitiesUsed');
            break;

        case 'momentumTriggered':
            inc('momentumTriggers');
            break;

        case 'tilesRevealed':
            inc('tilesRevealedByAbility', payload.count || 1);
            break;

        case 'luckyDrop':
            inc('luckyDropsClaimed');
            break;

        case 'classChosen':
            // One-time flag — just mark it done
            if (!qs.classChosen) qs.classChosen = 1;
            break;

        case 'classUpgradeApplied':
            inc('classUpgradesApplied');
            break;

        case 'passivePointSpent':
            inc('passivePointsSpent');
            break;

        case 'achievementUnlocked':
            inc('achievementsUnlocked');
            break;
    }

    save();
    _refreshQuestBadge();
}


// ═══════════════════════════════════════════════════════════════════════════════
//
//  THE STOCHASTIC LEDGER — CATEGORY DEFINITIONS
//
//  Structure per category:
//    id          — unique string
//    icon        — emoji
//    titleEn/DE  — category name
//    descEn/DE   — flavour blurb
//    milestones  — array of { id, labelEn, labelDE, check(qs), reward }
//                  reward: { ptPoints?, items? }
//
//  26 categories total.
//
// ═══════════════════════════════════════════════════════════════════════════════

const LEDGER_CATEGORIES = [

    // ── 1. SAMPLE SIZE ───────────────────────────────────────────────────────
    //  Theme: "the more observations you collect, the better"
    {
        id: 'sample_size',
        icon: '📊',
        titleEn: 'Sample Size',
        titleDE: 'Stichprobengröße',
        descEn: 'Every solved puzzle adds to your sample. Larger samples reveal the truth.',
        descDE: 'Jedes gelöste Rätsel vergrößert deine Stichprobe. Größere Stichproben enthüllen die Wahrheit.',
        milestones: [
            {
                id: 'sample_size_1',
                labelEn: 'n = 10', labelDE: 'n = 10',
                check: qs => ({ current: qs.levelsCompleted || 0, target: 10 }),
                reward: { items: ['reveal3'] }
            },
            {
                id: 'sample_size_2',
                labelEn: 'n = 50', labelDE: 'n = 50',
                check: qs => ({ current: qs.levelsCompleted || 0, target: 50 }),
                reward: { items: ['reveal4', 'markWrong6'] }
            },
            {
                id: 'sample_size_3',
                labelEn: 'n = 100', labelDE: 'n = 100',
                check: qs => ({ current: qs.levelsCompleted || 0, target: 100 }),
                reward: { items: ['rowSolve'] }
            },
            {
                id: 'sample_size_4',
                labelEn: 'n = 200', labelDE: 'n = 200',
                check: qs => ({ current: qs.levelsCompleted || 0, target: 200 }),
                reward: { items: ['colSolve', 'mistakeEraser4'] }
            },
            {
                id: 'sample_size_5',
                labelEn: 'n = 500', labelDE: 'n = 500',
                check: qs => ({ current: qs.levelsCompleted || 0, target: 500 }),
                reward: { ptPoints: 1, items: ['rowSolve', 'colSolve'] }
            },
        ]
    },

    // ── 2. ZERO VARIANCE ─────────────────────────────────────────────────────
    //  Theme: perfect consistency, no deviation from the correct answer
    {
        id: 'zero_variance',
        icon: '📉',
        titleEn: 'Zero Variance',
        titleDE: 'Null-Varianz',
        descEn: 'A dataset with zero variance has no error. Solve flawlessly.',
        descDE: 'Ein Datensatz ohne Varianz hat keinen Fehler. Löse makellos.',
        milestones: [
            {
                id: 'zero_var_1',
                labelEn: '10 flawless levels', labelDE: '10 fehlerfreie Level',
                check: qs => ({ current: qs.levelsNomiss || 0, target: 10 }),
                reward: { items: ['shield', 'mistakeEraser'] }
            },
            {
                id: 'zero_var_2',
                labelEn: '30 flawless levels', labelDE: '30 fehlerfreie Level',
                check: qs => ({ current: qs.levelsNomiss || 0, target: 30 }),
                reward: { items: ['mistakeEraser6', 'shield'] }
            },
            {
                id: 'zero_var_3',
                labelEn: '60 flawless levels', labelDE: '60 fehlerfreie Level',
                check: qs => ({ current: qs.levelsNomiss || 0, target: 60 }),
                reward: { items: ['mistakeEraserAll', 'reveal4'] }
            },
            {
                id: 'zero_var_4',
                labelEn: '100 flawless levels', labelDE: '100 fehlerfreie Level',
                check: qs => ({ current: qs.levelsNomiss || 0, target: 100 }),
                reward: { ptPoints: 1, items: ['mistakeEraserAll'] }
            },
        ]
    },

    // ── 3. NULL HYPOTHESIS ───────────────────────────────────────────────────
    //  Theme: "assume nothing helps" — win without using any items
    {
        id: 'null_hypothesis',
        icon: '🔬',
        titleEn: 'Null Hypothesis',
        titleDE: 'Nullhypothese',
        descEn: 'Test whether items are truly necessary. Reject the null by going without them.',
        descDE: 'Teste, ob Items wirklich notwendig sind. Beweise das Gegenteil, indem du ohne sie spielst.',
        milestones: [
            {
                id: 'null_hyp_1',
                labelEn: '10 levels without items', labelDE: '10 Level ohne Items',
                check: qs => ({ current: qs.levelsNoitem || 0, target: 10 }),
                reward: { items: ['markWrong6', 'reveal3'] }
            },
            {
                id: 'null_hyp_2',
                labelEn: '25 levels without items', labelDE: '25 Level ohne Items',
                check: qs => ({ current: qs.levelsNoitem || 0, target: 25 }),
                reward: { items: ['rowSolve', 'markWrong8'] }
            },
            {
                id: 'null_hyp_3',
                labelEn: '60 levels without items', labelDE: '60 Level ohne Items',
                check: qs => ({ current: qs.levelsNoitem || 0, target: 60 }),
                reward: { ptPoints: 1, items: ['reveal4', 'colSolve'] }
            },
        ]
    },

    // ── 4. CONFIDENCE INTERVAL ───────────────────────────────────────────────
    //  Theme: answering questions correctly (narrowing the interval of uncertainty)
    {
        id: 'confidence_interval',
        icon: '🎯',
        titleEn: 'Confidence Interval',
        titleDE: 'Konfidenzintervall',
        descEn: 'Each correct answer tightens your confidence interval. Approach certainty.',
        descDE: 'Jede richtige Antwort verengt dein Konfidenzintervall. Nähere dich der Gewissheit.',
        milestones: [
            {
                id: 'ci_1',
                labelEn: '20 correct answers', labelDE: '20 richtige Antworten',
                check: qs => ({ current: qs.questionsCorrect || 0, target: 20 }),
                reward: { items: ['reveal3'] }
            },
            {
                id: 'ci_2',
                labelEn: '50 correct answers', labelDE: '50 richtige Antworten',
                check: qs => ({ current: qs.questionsCorrect || 0, target: 50 }),
                reward: { items: ['reveal4', 'markWrong6'] }
            },
            {
                id: 'ci_3',
                labelEn: '150 correct answers', labelDE: '150 richtige Antworten',
                check: qs => ({ current: qs.questionsCorrect || 0, target: 150 }),
                reward: { items: ['markWrong8', 'scoutPrimer'] }
            },
            {
                id: 'ci_4',
                labelEn: '300 correct answers', labelDE: '300 richtige Antworten',
                check: qs => ({ current: qs.questionsCorrect || 0, target: 300 }),
                reward: { items: ['rowSolve', 'reveal4'] }
            },
            {
                id: 'ci_5',
                labelEn: '500 correct answers', labelDE: '500 richtige Antworten',
                check: qs => ({ current: qs.questionsCorrect || 0, target: 500 }),
                reward: { ptPoints: 1, items: ['rowSolve', 'colSolve'] }
            },
        ]
    },

    // ── 5. PROBABILITY GATE ───────────────────────────────────────────────────
    //  Theme: passing gates = conditioning on the right event
    {
        id: 'probability_gate',
        icon: '🔐',
        titleEn: 'Conditional Probability',
        titleDE: 'Bedingte Wahrscheinlichkeit',
        descEn: 'Given that you reach a gate — what are the odds you pass it?',
        descDE: 'Gegeben, dass du ein Tor erreichst — wie hoch sind deine Chancen es zu bestehen?',
        milestones: [
            {
                id: 'cond_prob_1',
                labelEn: '5 gates passed', labelDE: '5 Tore bestanden',
                check: qs => ({ current: qs.gatesPassed || 0, target: 5 }),
                reward: { items: ['reveal3', 'markWrong6'] }
            },
            {
                id: 'cond_prob_2',
                labelEn: '15 gates passed', labelDE: '15 Tore bestanden',
                check: qs => ({ current: qs.gatesPassed || 0, target: 15 }),
                reward: { items: ['scoutPrimer', 'markWrong8'] }
            },
            {
                id: 'cond_prob_3',
                labelEn: '35 gates passed', labelDE: '35 Tore bestanden',
                check: qs => ({ current: qs.gatesPassed || 0, target: 35 }),
                reward: { ptPoints: 1, items: ['rowSolve', 'markWrong8'] }
            },
        ]
    },

    // ── 6. EXPECTED VALUE ────────────────────────────────────────────────────
    //  Theme: your score is the expected value of your decisions
    {
        id: 'expected_value',
        icon: '💰',
        titleEn: 'Expected Value',
        titleDE: 'Erwartungswert',
        descEn: 'E[X] = Σ x·p(x). Accumulate the expected return of every run.',
        descDE: 'E[X] = Σ x·p(x). Häufe den erwarteten Ertrag jedes Durchlaufs an.',
        milestones: [
            {
                id: 'ev_1',
                labelEn: '5,000 total score', labelDE: '5.000 Gesamtpunkte',
                check: () => ({ current: STATE.totalScore || 0, target: 5000 }),
                reward: { items: ['addTime300', 'reveal3'] }
            },
            {
                id: 'ev_2',
                labelEn: '20,000 total score', labelDE: '20.000 Gesamtpunkte',
                check: () => ({ current: STATE.totalScore || 0, target: 20000 }),
                reward: { items: ['addTime600', 'markWrong8'] }
            },
            {
                id: 'ev_3',
                labelEn: '50,000 total score', labelDE: '50.000 Gesamtpunkte',
                check: () => ({ current: STATE.totalScore || 0, target: 50000 }),
                reward: { items: ['addTime900', 'rowSolve'] }
            },
            {
                id: 'ev_4',
                labelEn: '100,000 total score', labelDE: '100.000 Gesamtpunkte',
                check: () => ({ current: STATE.totalScore || 0, target: 100000 }),
                reward: { ptPoints: 1, items: ['addTime900', 'colSolve'] }
            },
        ]
    },

    // ── 7. CONVERGENCE ────────────────────────────────────────────────────────
    //  Theme: the series converges — clearing convergence levels
    {
        id: 'convergence',
        icon: '🌿',
        titleEn: 'Convergence',
        titleDE: 'Konvergenz',
        descEn: 'As n → ∞, the sequence converges to truth. Clear convergence levels.',
        descDE: 'Wenn n → ∞, konvergiert die Folge zur Wahrheit. Schließe Konvergenz-Level ab.',
        milestones: [
            {
                id: 'conv_1',
                labelEn: '5 convergence levels', labelDE: '5 Konvergenz-Level',
                check: qs => ({ current: qs.convergenceLevels || 0, target: 5 }),
                reward: { items: ['reveal4', 'markWrong6'] }
            },
            {
                id: 'conv_2',
                labelEn: '13 convergence levels', labelDE: '13 Konvergenz-Level',
                check: qs => ({ current: qs.convergenceLevels || 0, target: 13 }),
                reward: { items: ['colSolve', 'mistakeEraser4'] }
            },
            {
                id: 'conv_3',
                labelEn: '26 convergence levels', labelDE: '26 Konvergenz-Level',
                check: qs => ({ current: qs.convergenceLevels || 0, target: 26 }),
                reward: { ptPoints: 1, items: ['rowSolve', 'colSolve'] }
            },
        ]
    },

    // ── 8. OUTLIER RESISTANCE ────────────────────────────────────────────────
    //  Theme: Hardcore mode — surviving extreme outlier conditions
    {
        id: 'outlier_resistance',
        icon: '💀',
        titleEn: 'Outlier Resistance',
        titleDE: 'Ausreißerresistenz',
        descEn: 'Robust estimators ignore extreme outliers. Survive Hardcore mode.',
        descDE: 'Robuste Schätzer ignorieren extreme Ausreißer. Überlebe den Hardcore-Modus.',
        milestones: [
            {
                id: 'hc_1',
                labelEn: '5 Hardcore levels', labelDE: '5 Hardcore-Level',
                check: qs => ({ current: qs.levelsHardcore || 0, target: 5 }),
                reward: { items: ['mistakeEraser4', 'shield'] }
            },
            {
                id: 'hc_2',
                labelEn: '20 Hardcore levels', labelDE: '20 Hardcore-Level',
                check: qs => ({ current: qs.levelsHardcore || 0, target: 20 }),
                reward: { items: ['mistakeEraser6', 'mistakeEraser4'] }
            },
            {
                id: 'hc_3',
                labelEn: '50 Hardcore levels', labelDE: '50 Hardcore-Level',
                check: qs => ({ current: qs.levelsHardcore || 0, target: 50 }),
                reward: { ptPoints: 1, items: ['mistakeEraserAll', 'mistakeEraser6'] }
            },
        ]
    },

    // ── 9. SAMPLING UNDER TIME PRESSURE ──────────────────────────────────────
    //  Theme: Time Trial — statistics under deadlines
    {
        id: 'time_pressure',
        icon: '⏱️',
        titleEn: 'Sampling Under Pressure',
        titleDE: 'Stichproben unter Druck',
        descEn: 'Real analysts work to deadlines. Conquer Time Trial mode.',
        descDE: 'Echte Analysten arbeiten unter Zeitdruck. Bewältige den Time Trial-Modus.',
        milestones: [
            {
                id: 'tt_1',
                labelEn: '5 Time Trial levels', labelDE: '5 Time Trial-Level',
                check: qs => ({ current: qs.levelsTimetrial || 0, target: 5 }),
                reward: { items: ['addTime600', 'addTime300'] }
            },
            {
                id: 'tt_2',
                labelEn: '20 Time Trial levels', labelDE: '20 Time Trial-Level',
                check: qs => ({ current: qs.levelsTimetrial || 0, target: 20 }),
                reward: { items: ['addTime900', 'addTime600'] }
            },
            {
                id: 'tt_3',
                labelEn: '50 Time Trial levels', labelDE: '50 Time Trial-Level',
                check: qs => ({ current: qs.levelsTimetrial || 0, target: 50 }),
                reward: { ptPoints: 1, items: ['addTime900', 'addTime900'] }
            },
        ]
    },

    // ── 10. IRONMAN DISTRIBUTION ──────────────────────────────────────────────
    //  Theme: Ironman — no item support, full distribution of outcomes
    {
        id: 'ironman_dist',
        icon: '⚔️',
        titleEn: 'Full Distribution',
        titleDE: 'Vollständige Verteilung',
        descEn: 'See the full range of outcomes — Ironman mode, no buffers allowed.',
        descDE: 'Sieh die volle Bandbreite der Ergebnisse — Ironman-Modus, keine Puffer erlaubt.',
        milestones: [
            {
                id: 'iron_1',
                labelEn: '3 Ironman levels', labelDE: '3 Ironman-Level',
                check: qs => ({ current: qs.levelsIronman || 0, target: 3 }),
                reward: { items: ['mistakeEraser4', 'reveal4'] }
            },
            {
                id: 'iron_2',
                labelEn: '15 Ironman levels', labelDE: '15 Ironman-Level',
                check: qs => ({ current: qs.levelsIronman || 0, target: 15 }),
                reward: { items: ['mistakeEraser6', 'rowSolve'] }
            },
            {
                id: 'iron_3',
                labelEn: '33 Ironman levels', labelDE: '33 Ironman-Level',
                check: qs => ({ current: qs.levelsIronman || 0, target: 33 }),
                reward: { ptPoints: 1, items: ['mistakeEraserAll', 'rowSolve'] }
            },
        ]
    },

    // ── 11. SIGNIFICANCE LEVEL (α) ────────────────────────────────────────────
    //  Theme: Hard difficulty — operating below α, where the stakes are highest
    {
        id: 'significance_level',
        icon: '🔥',
        titleEn: 'Significance Level α',
        titleDE: 'Signifikanzniveau α',
        descEn: 'Below α, results are statistically significant — and merciless. Clear Hard levels.',
        descDE: 'Unterhalb von α sind Ergebnisse signifikant — und gnadenlos. Schließe Schwer-Level ab.',
        milestones: [
            {
                id: 'hard_1',
                labelEn: '10 Hard levels', labelDE: '10 Schwer-Level',
                check: qs => ({ current: qs.levelsHard || 0, target: 10 }),
                reward: { items: ['shield', 'reveal4'] }
            },
            {
                id: 'hard_2',
                labelEn: '30 Hard levels', labelDE: '30 Schwer-Level',
                check: qs => ({ current: qs.levelsHard || 0, target: 30 }),
                reward: { items: ['mistakeEraser6', 'markWrong8'] }
            },
            {
                id: 'hard_3',
                labelEn: '60 Hard levels', labelDE: '60 Schwer-Level',
                check: qs => ({ current: qs.levelsHard || 0, target: 60 }),
                reward: { ptPoints: 1, items: ['mistakeEraserAll', 'reveal4'] }
            },
        ]
    },

    // ── 12. MONTE CARLO METHOD ────────────────────────────────────────────────
    //  Theme: Hard + ALL THREE modifiers simultaneously (the extreme simulation)
    {
        id: 'monte_carlo',
        icon: '🎲',
        titleEn: 'Monte Carlo Method',
        titleDE: 'Monte-Carlo-Methode',
        descEn: 'Simulate every worst case at once. Hard difficulty with all three modifiers active.',
        descDE: 'Simuliere jeden schlimmsten Fall gleichzeitig. Schwer mit allen drei Modifikatoren aktiv.',
        milestones: [
            {
                id: 'mc_1',
                labelEn: '1 Triple-Modifier level', labelDE: '1 Dreifach-Modifikator-Level',
                check: qs => ({ current: qs.levelsTripleModifier || 0, target: 1 }),
                reward: { items: ['mistakeEraser6', 'addTime600'] }
            },
            {
                id: 'mc_2',
                labelEn: '5 Triple-Modifier levels', labelDE: '5 Dreifach-Modifikator-Level',
                check: qs => ({ current: qs.levelsTripleModifier || 0, target: 5 }),
                reward: { items: ['mistakeEraserAll', 'addTime900'] }
            },
            {
                id: 'mc_3',
                labelEn: '15 Triple-Modifier levels', labelDE: '15 Dreifach-Modifikator-Level',
                check: qs => ({ current: qs.levelsTripleModifier || 0, target: 15 }),
                reward: { ptPoints: 1, items: ['mistakeEraserAll', 'rowSolve', 'colSolve'] }
            },
        ]
    },

    // ── 13. ITEM DISTRIBUTION ─────────────────────────────────────────────────
    //  Theme: using items = distributing your resources across the probability space
    {
        id: 'item_distribution',
        icon: '🎒',
        titleEn: 'Resource Distribution',
        titleDE: 'Ressourcenverteilung',
        descEn: 'Allocate your resources wisely across the sample space. Use items.',
        descDE: 'Verteile deine Ressourcen weise über den Stichprobenraum. Setze Items ein.',
        milestones: [
            {
                id: 'item_1',
                labelEn: '25 items used', labelDE: '25 Items verwendet',
                check: qs => ({ current: qs.itemsUsedTotal || 0, target: 25 }),
                reward: { items: ['reveal4', 'markWrong6'] }
            },
            {
                id: 'item_2',
                labelEn: '100 items used', labelDE: '100 Items verwendet',
                check: qs => ({ current: qs.itemsUsedTotal || 0, target: 100 }),
                reward: { items: ['rowSolve', 'markWrong8'] }
            },
            {
                id: 'item_3',
                labelEn: '250 items used', labelDE: '250 Items verwendet',
                check: qs => ({ current: qs.itemsUsedTotal || 0, target: 250 }),
                reward: { items: ['rowSolve', 'colSolve', 'reveal4'] }
            },
            {
                id: 'item_4',
                labelEn: '500 items used', labelDE: '500 Items verwendet',
                check: qs => ({ current: qs.itemsUsedTotal || 0, target: 500 }),
                reward: { ptPoints: 1, items: ['scoutPrimer', 'rowSolve'] }
            },
        ]
    },

    // ── 14. CURSE OF DIMENSIONALITY ───────────────────────────────────────────
    //  Theme: cursed items — high-dimensional spaces are dangerous but powerful
    {
        id: 'curse_dimensionality',
        icon: '☠️',
        titleEn: 'Curse of Dimensionality',
        titleDE: 'Fluch der Dimensionalität',
        descEn: 'In high dimensions, strange things happen. Embrace cursed items.',
        descDE: 'In hohen Dimensionen passieren seltsame Dinge. Umarme verfluchte Items.',
        milestones: [
            {
                id: 'curse_1',
                labelEn: '5 cursed items used', labelDE: '5 verfluchte Items verwendet',
                check: qs => ({ current: qs.cursedItemsUsed || 0, target: 5 }),
                reward: { items: ['cursedShield', 'cursedReveal'] }
            },
            {
                id: 'curse_2',
                labelEn: '25 cursed items used', labelDE: '25 verfluchte Items verwendet',
                check: qs => ({ current: qs.cursedItemsUsed || 0, target: 25 }),
                reward: { items: ['cursedRowSolve', 'cursedColSolve'] }
            },
            {
                id: 'curse_3',
                labelEn: '75 cursed items used', labelDE: '75 verfluchte Items verwendet',
                check: qs => ({ current: qs.cursedItemsUsed || 0, target: 75 }),
                reward: { ptPoints: 1, items: ['cursedRowCol', 'cursedTime'] }
            },
        ]
    },

    // ── 15. PRIOR DISTRIBUTION (BAYES) ────────────────────────────────────────
    //  Theme: Scout's Primer — entering a level with prior knowledge pre-loaded
    {
        id: 'prior_distribution',
        icon: '📜',
        titleEn: 'Prior Distribution',
        titleDE: 'A-priori-Verteilung',
        descEn: "Bayesian inference starts with a prior. The Scout's Primer is your prior.",
        descDE: 'Bayesianische Inferenz beginnt mit einem Prior. Der Pfadfinder-Kompass ist dein Prior.',
        milestones: [
            {
                id: 'prior_1',
                labelEn: '5 Primer questions correct', labelDE: '5 Kompass-Fragen richtig',
                check: qs => ({ current: qs.primerCorrect || 0, target: 5 }),
                reward: { items: ['reveal4', 'scoutPrimer'] }
            },
            {
                id: 'prior_2',
                labelEn: '30 Primer questions correct', labelDE: '30 Kompass-Fragen richtig',
                check: qs => ({ current: qs.primerCorrect || 0, target: 30 }),
                reward: { items: ['scoutPrimer', 'scoutPrimer'] }
            },
            {
                id: 'prior_3',
                labelEn: '75 Primer questions correct', labelDE: '75 Kompass-Fragen richtig',
                check: qs => ({ current: qs.primerCorrect || 0, target: 75 }),
                reward: { items: ['rowSolve', 'scoutPrimer'] }
            },
            {
                id: 'prior_4',
                labelEn: '1 full-puzzle Primer solve', labelDE: '1 vollständige Primer-Lösung',
                check: qs => ({ current: qs.primerFullSolves || 0, target: 1 }),
                reward: { items: ['scoutPrimer', 'reveal4'] }
            },
            {
                id: 'prior_5',
                labelEn: '5 full-puzzle Primer solves', labelDE: '5 vollständige Primer-Lösungen',
                check: qs => ({ current: qs.primerFullSolves || 0, target: 5 }),
                reward: { ptPoints: 1, items: ['scoutPrimer', 'rowSolve'] }
            },
        ]
    },

    // ── 16. TUTOR REGRESSION ─────────────────────────────────────────────────
    //  Theme: Tutor/mistake-eraser items as regression toward the mean
    {
        id: 'tutor_regression',
        icon: '🎓',
        titleEn: 'Regression to the Mean',
        titleDE: 'Regression zur Mitte',
        descEn: 'Extreme mistakes regress toward the mean. Use Tutor items to correct your path.',
        descDE: 'Extreme Fehler kehren zur Mitte zurück. Nutze Tutor-Items, um deinen Weg zu korrigieren.',
        milestones: [
            {
                id: 'tutor_1',
                labelEn: '5 Tutor items used', labelDE: '5 Tutor-Items verwendet',
                check: qs => ({ current: qs.tutorItemsUsed || 0, target: 5 }),
                reward: { items: ['mistakeEraser4', 'mistakeEraser'] }
            },
            {
                id: 'tutor_2',
                labelEn: '20 Tutor items used', labelDE: '20 Tutor-Items verwendet',
                check: qs => ({ current: qs.tutorItemsUsed || 0, target: 20 }),
                reward: { items: ['mistakeEraser6', 'mistakeEraser4'] }
            },
            {
                id: 'tutor_3',
                labelEn: '50 Tutor items used', labelDE: '50 Tutor-Items verwendet',
                check: qs => ({ current: qs.tutorItemsUsed || 0, target: 50 }),
                reward: { ptPoints: 1, items: ['mistakeEraserAll', 'mistakeEraser6'] }
            },
        ]
    },

    // ── 17. CLASS ABILITY (ACTIVE INFERENCE) ─────────────────────────────────
    //  Theme: active inference — using class abilities to actively update beliefs
    {
        id: 'active_inference',
        icon: '⚡',
        titleEn: 'Active Inference',
        titleDE: 'Aktive Inferenz',
        descEn: 'An active agent continuously updates its model. Fire class abilities.',
        descDE: 'Ein aktiver Agent aktualisiert kontinuierlich sein Modell. Setze Klassenfähigkeiten ein.',
        milestones: [
            {
                id: 'ai_1',
                labelEn: '10 abilities used', labelDE: '10 Fähigkeiten verwendet',
                check: qs => ({ current: qs.classAbilitiesUsed || 0, target: 10 }),
                reward: { items: ['markWrong8', 'reveal4'] }
            },
            {
                id: 'ai_2',
                labelEn: '50 abilities used', labelDE: '50 Fähigkeiten verwendet',
                check: qs => ({ current: qs.classAbilitiesUsed || 0, target: 50 }),
                reward: { items: ['pearlOfHaste', 'reveal4'] }
            },
            {
                id: 'ai_3',
                labelEn: '150 abilities used', labelDE: '150 Fähigkeiten verwendet',
                check: qs => ({ current: qs.classAbilitiesUsed || 0, target: 150 }),
                reward: { items: ['pearlOfSwiftness', 'rowSolve'] }
            },
            {
                id: 'ai_4',
                labelEn: '300 abilities used', labelDE: '300 Fähigkeiten verwendet',
                check: qs => ({ current: qs.classAbilitiesUsed || 0, target: 300 }),
                reward: { ptPoints: 1, items: ['grandPearl'] }
            },
        ]
    },

    // ── 18. LAW OF LARGE NUMBERS ──────────────────────────────────────────────
    //  Theme: ability-revealed tiles; as N increases, results converge
    {
        id: 'law_large_numbers',
        icon: '🔭',
        titleEn: 'Law of Large Numbers',
        titleDE: 'Gesetz der großen Zahlen',
        descEn: 'With enough observations, the mean converges. Reveal tiles through class abilities.',
        descDE: 'Mit genügend Beobachtungen konvergiert das Mittel. Enthülle Felder durch Fähigkeiten.',
        milestones: [
            {
                id: 'lln_1',
                labelEn: '50 tiles revealed', labelDE: '50 Felder enthüllt',
                check: qs => ({ current: qs.tilesRevealedByAbility || 0, target: 50 }),
                reward: { items: ['reveal4', 'markWrong8'] }
            },
            {
                id: 'lln_2',
                labelEn: '200 tiles revealed', labelDE: '200 Felder enthüllt',
                check: qs => ({ current: qs.tilesRevealedByAbility || 0, target: 200 }),
                reward: { items: ['rowSolve', 'reveal4'] }
            },
            {
                id: 'lln_3',
                labelEn: '500 tiles revealed', labelDE: '500 Felder enthüllt',
                check: qs => ({ current: qs.tilesRevealedByAbility || 0, target: 500 }),
                reward: { ptPoints: 1, items: ['rowSolve', 'colSolve'] }
            },
        ]
    },

    // ── 19. LUCKY DROP EVENT ─────────────────────────────────────────────────
    //  Theme: rare event probability — lucky drops are low-probability events
    {
        id: 'lucky_drop_event',
        icon: '🍀',
        titleEn: 'Rare Event Probability',
        titleDE: 'Seltene Ereigniswahrscheinlichkeit',
        descEn: 'Rare events do occur. Activate the Lucky Drops node and collect the drops.',
        descDE: 'Seltene Ereignisse treten ein. Aktiviere den Glücksfunde-Knoten und sammle die Drops.',
        milestones: [
            {
                id: 'lucky_1',
                labelEn: '1 Lucky Drop', labelDE: '1 Glücksfund',
                check: qs => ({ current: qs.luckyDropsClaimed || 0, target: 1 }),
                reward: { items: ['__random__', '__random__'] }
            },
            {
                id: 'lucky_2',
                labelEn: '10 Lucky Drops', labelDE: '10 Glücksfunde',
                check: qs => ({ current: qs.luckyDropsClaimed || 0, target: 10 }),
                reward: { items: ['__random__', '__random__', '__random__'] }
            },
            {
                id: 'lucky_3',
                labelEn: '40 Lucky Drops', labelDE: '40 Glücksfunde',
                check: qs => ({ current: qs.luckyDropsClaimed || 0, target: 40 }),
                reward: { items: ['__random__', '__random__', '__random__'] }
            },
            {
                id: 'lucky_4',
                labelEn: '77 Lucky Drops', labelDE: '77 Glücksfunde',
                check: qs => ({ current: qs.luckyDropsClaimed || 0, target: 77 }),
                reward: { ptPoints: 1, items: ['__random__', '__random__', '__random__'] }
            },
        ]
    },

    // ── 20. WORLD EXPLORATION (PARAMETER SPACE) ───────────────────────────────
    //  Theme: parameter space — exploring all worlds = covering the parameter space
    {
        id: 'parameter_space',
        icon: '🌍',
        titleEn: 'Parameter Space',
        titleDE: 'Parameterraum',
        descEn: 'A complete analysis covers the entire parameter space. Finish every world.',
        descDE: 'Eine vollständige Analyse deckt den gesamten Parameterraum ab. Beende jede Welt.',
        milestones: [
            {
                id: 'world_1',
                labelEn: '1 world completed', labelDE: '1 Welt abgeschlossen',
                check: qs => ({ current: qs.worldsCompleted || 0, target: 1 }),
                reward: { items: ['rowSolve', 'colSolve'] }
            },
            {
                id: 'world_2',
                labelEn: '2 worlds completed', labelDE: '2 Welten abgeschlossen',
                check: qs => ({ current: qs.worldsCompleted || 0, target: 2 }),
                reward: { items: ['rowSolve', 'colSolve', 'scoutPrimer'] }
            },
            {
                id: 'world_3',
                labelEn: '3 worlds completed', labelDE: '3 Welten abgeschlossen',
                check: qs => ({ current: qs.worldsCompleted || 0, target: 3 }),
                reward: { items: ['rowSolve', 'colSolve', 'mistakeEraserAll'] }
            },
            {
                id: 'world_4',
                labelEn: 'All worlds completed', labelDE: 'Alle Welten abgeschlossen',
                check: qs => ({ current: qs.worldsCompleted || 0, target: 5 }),
                reward: { ptPoints: 1, items: ['rowSolve', 'colSolve', 'mistakeEraserAll', 'addTime900'] }
            },
        ]
    },

    // ── 21. MARKOV CHAIN (REPLAY NODES) ───────────────────────────────────────
    //  Theme: Markov property — the next state depends only on the current state
    //         Replay nodes let you re-enter previous states
    {
        id: 'markov_chain',
        icon: '🔁',
        titleEn: 'Markov Chain',
        titleDE: 'Markov-Kette',
        descEn: 'The Markov property: the future depends only on the present. Use Replay nodes.',
        descDE: 'Die Markov-Eigenschaft: Die Zukunft hängt nur von der Gegenwart ab. Nutze Replay-Knoten.',
        milestones: [
            {
                id: 'markov_1',
                labelEn: '10 levels with Replay node active', labelDE: '10 Level mit aktivem Replay-Knoten',
                check: qs => ({ current: qs.levelsWithReplayNode || 0, target: 10 }),
                reward: { items: ['__random__', '__random__'] }
            },
            {
                id: 'markov_2',
                labelEn: '30 levels with Replay node active', labelDE: '30 Level mit aktivem Replay-Knoten',
                check: qs => ({ current: qs.levelsWithReplayNode || 0, target: 30 }),
                reward: { items: ['__random__', '__random__', '__random__'] }
            },
            {
                id: 'markov_3',
                labelEn: '75 levels with Replay node active', labelDE: '75 Level mit aktivem Replay-Knoten',
                check: qs => ({ current: qs.levelsWithReplayNode || 0, target: 75 }),
                reward: { ptPoints: 1, items: ['__random__', '__random__', '__random__'] }
            },
        ]
    },

    // ── 22. PROBABILITY TREE (PASSIVE POINTS) ─────────────────────────────────
    //  Theme: the passive skill tree IS a probability tree
    {
        id: 'probability_tree',
        icon: '🌳',
        titleEn: 'Probability Tree',
        titleDE: 'Wahrscheinlichkeitsbaum',
        descEn: 'Branch through the probability tree. Spend passive skill points.',
        descDE: 'Verzweige dich durch den Wahrscheinlichkeitsbaum. Gib passive Fähigkeitspunkte aus.',
        milestones: [
            {
                id: 'pt_1',
                labelEn: '5 points spent', labelDE: '5 Punkte ausgegeben',
                check: () => ({ current: _ptCurrentSpentCount(), target: 5 }),
                reward: { items: ['reveal4', 'markWrong8'] }
            },
            {
                id: 'pt_2',
                labelEn: '15 points spent', labelDE: '15 Punkte ausgegeben',
                check: () => ({ current: _ptCurrentSpentCount(), target: 15 }),
                reward: { items: ['rowSolve', 'scoutPrimer'] }
            },
            {
                id: 'pt_3',
                labelEn: '30 points spent', labelDE: '30 Punkte ausgegeben',
                check: () => ({ current: _ptCurrentSpentCount(), target: 30 }),
                reward: { ptPoints: 1, items: ['rowSolve', 'colSolve', 'grandPearl'] }
            },
        ]
    },

    // ── 23. DESCRIPTIVE STATISTICS (ACHIEVEMENTS) ─────────────────────────────
    //  Theme: achievements are the descriptive statistics of your play
    {
        id: 'descriptive_stats',
        icon: '📋',
        titleEn: 'Descriptive Statistics',
        titleDE: 'Deskriptive Statistik',
        descEn: 'Describe your performance with hard data. Unlock achievements.',
        descDE: 'Beschreibe deine Leistung mit harten Daten. Schalte Erfolge frei.',
        milestones: [
            {
                id: 'ach_1',
                labelEn: '10 achievements unlocked', labelDE: '10 Erfolge freigeschaltet',
                check: qs => ({ current: qs.achievementsUnlocked || 0, target: 10 }),
                reward: { items: ['reveal4', 'markWrong8'] }
            },
            {
                id: 'ach_2',
                labelEn: '25 achievements unlocked', labelDE: '25 Erfolge freigeschaltet',
                check: qs => ({ current: qs.achievementsUnlocked || 0, target: 25 }),
                reward: { items: ['rowSolve', 'mistakeEraser6'] }
            },
            {
                id: 'ach_3',
                labelEn: '50 achievements unlocked', labelDE: '50 Erfolge freigeschaltet',
                check: qs => ({ current: qs.achievementsUnlocked || 0, target: 50 }),
                reward: { ptPoints: 1, items: ['colSolve', 'mistakeEraserAll'] }
            },
        ]
    },

    // ── 24. STRATIFIED SAMPLING (QUIZ) ────────────────────────────────────────
    //  Theme: quiz bonus questions — sampling from stratified question pools
    {
        id: 'stratified_sampling',
        icon: '📚',
        titleEn: 'Stratified Sampling',
        titleDE: 'Geschichtete Stichprobe',
        descEn: 'Sample from every stratum of knowledge. Answer bonus quiz questions correctly.',
        descDE: 'Stichproben aus jeder Wissensschicht. Beantworte Bonus-Quizfragen korrekt.',
        milestones: [
            {
                id: 'quiz_1',
                labelEn: '5 quiz answers correct', labelDE: '5 Quizfragen richtig',
                check: qs => ({ current: qs.quizCorrect || 0, target: 5 }),
                reward: { items: ['reveal4', 'markWrong6'] }
            },
            {
                id: 'quiz_2',
                labelEn: '20 quiz answers correct', labelDE: '20 Quizfragen richtig',
                check: qs => ({ current: qs.quizCorrect || 0, target: 20 }),
                reward: { items: ['scoutPrimer', 'markWrong8'] }
            },
            {
                id: 'quiz_3',
                labelEn: '50 quiz answers correct', labelDE: '50 Quizfragen richtig',
                check: qs => ({ current: qs.quizCorrect || 0, target: 50 }),
                reward: { ptPoints: 1, items: ['rowSolve', 'markWrong8'] }
            },
        ]
    },

    // ── 25. CHOOSE YOUR ESTIMATOR ────────────────────────────────────────────
    //  Theme: choosing a class = choosing your statistical estimator
    //         Single milestone, no counter — instant reward on class selection
    {
        id: 'choose_estimator',
        icon: '🧮',
        titleEn: 'Choose Your Estimator',
        titleDE: 'Wähle deinen Schätzer',
        descEn: 'Every analysis requires choosing an estimator. Select your class to begin.',
        descDE: 'Jede Analyse erfordert einen Schätzer. Wähle deine Klasse um zu beginnen.',
        milestones: [
            {
                id: 'class_chosen',
                labelEn: 'Select a class', labelDE: 'Wähle eine Klasse',
                check: qs => ({ current: qs.classChosen ? 1 : 0, target: 1 }),
                reward: { ptPoints: 1, items: ['reveal4', 'scoutPrimer'] }
            },
        ]
    },

    // ── 26. MAXIMUM LIKELIHOOD ESTIMATION ─────────────────────────────────────
    //  Theme: class upgrades = finding the maximum likelihood parameters
    {
        id: 'max_likelihood',
        icon: '⬆️',
        titleEn: 'Maximum Likelihood',
        titleDE: 'Maximum-Likelihood',
        descEn: 'Find the parameters that maximise the likelihood. Unlock all class skill upgrades.',
        descDE: 'Finde die Parameter, die die Likelihood maximieren. Schalte alle Klassen-Upgrades frei.',
        milestones: [
            {
                id: 'mle_1',
                labelEn: '1 class upgrade applied', labelDE: '1 Klassen-Upgrade angewendet',
                check: qs => ({ current: qs.classUpgradesApplied || 0, target: 1 }),
                reward: { items: ['reveal4', 'markWrong8'] }
            },
            {
                id: 'mle_2',
                labelEn: '3 class upgrades applied', labelDE: '3 Klassen-Upgrades angewendet',
                check: qs => ({ current: qs.classUpgradesApplied || 0, target: 3 }),
                reward: { items: ['pearlOfHaste', 'pearlOfSwiftness'] }
            },
            {
                id: 'mle_3',
                labelEn: 'All 6 upgrades applied', labelDE: 'Alle 6 Upgrades angewendet',
                check: qs => ({ current: qs.classUpgradesApplied || 0, target: 6 }),
                reward: { ptPoints: 1, items: ['grandPearl', 'mistakeEraserAll'] }
            },
        ]
    },

];


// ─────────────────────────────────────────────────────────────
//  BUILD A FLAT MILESTONE LOOKUP  (id → milestone + category)
// ─────────────────────────────────────────────────────────────

const _MILESTONE_MAP = {};
LEDGER_CATEGORIES.forEach(cat => {
    cat.milestones.forEach(ms => {
        _MILESTONE_MAP[ms.id] = { milestone: ms, category: cat };
    });
});


// ─────────────────────────────────────────────────────────────
//  EVALUATION HELPERS
// ─────────────────────────────────────────────────────────────

function _milestoneIsComplete(ms) {
    const qs = STATE.questStats || {};
    const { current, target } = ms.check(qs);
    return current >= target;
}

function _milestoneIsClaimed(ms) {
    return (STATE.questsClaimed || []).includes(ms.id);
}

function _anyMilestoneClaimable() {
    return LEDGER_CATEGORIES.some(cat =>
        cat.milestones.some(ms => _milestoneIsComplete(ms) && !_milestoneIsClaimed(ms))
    );
}

function _msProgress(ms) {
    const qs = STATE.questStats || {};
    const { current, target } = ms.check(qs);
    const clamped = Math.min(current, target);
    return { current: clamped, target, pct: Math.min(100, Math.round((clamped / target) * 100)) };
}


// ─────────────────────────────────────────────────────────────
//  CLAIM A MILESTONE
// ─────────────────────────────────────────────────────────────

function claimQuest(milestoneId) {
    const entry = _MILESTONE_MAP[milestoneId];
    if (!entry) return;
    const { milestone: ms } = entry;
    if (_milestoneIsClaimed(ms) || !_milestoneIsComplete(ms)) return;

    if (!STATE.questsClaimed) STATE.questsClaimed = [];
    STATE.questsClaimed.push(milestoneId);

    if (ms.reward.ptPoints) {
        STATE.passiveTreePoints = (STATE.passiveTreePoints || 0) + ms.reward.ptPoints;
    }

    if (ms.reward.items) {
        ms.reward.items.forEach(defId => {
            const actualId = defId === '__random__' ? pickRandomItem() : defId;
            const def = ITEM_DEFS[actualId];
            if (def) {
                STATE.inventory.push({
                    uid: `ledger_${Date.now()}_${Math.random().toString(36).slice(2)}`,
                    defId: actualId,
                });
            }
        });
    }

    save();
    showToast(_ledgerClaimToast(ms, entry.category));
    _refreshQuestBadge();
    renderQuestLog();
}

function _ledgerClaimToast(ms, cat) {
    const de = LANG === 'de';
    const name = de ? cat.titleDE : cat.titleEn;
    const label = de ? ms.labelDE : ms.labelEn;
    const parts = [];
    if (ms.reward.ptPoints) {
        parts.push(`+${ms.reward.ptPoints} ${de ? 'Wahrscheinlichkeitsbaum-Punkt(e)' : 'Probability Tree point(s)'}`);
    }
    if (ms.reward.items) {
        ms.reward.items.forEach(defId => {
            const actualId = defId === '__random__' ? pickRandomItem() : defId;
            const def = ITEM_DEFS[actualId];
            if (def) parts.push(`${def.icon} ${de ? def.nameDE : def.nameEn}`);
            else parts.push('🎁 Item');
        });
    }
    return `${cat.icon} ${name}: ${label} — ${parts.join(', ')}`;
}


// ─────────────────────────────────────────────────────────────
//  BADGE
// ─────────────────────────────────────────────────────────────

function _refreshQuestBadge() {
    const badge = document.getElementById('quest-log-badge');
    if (!badge) return;
    badge.style.display = _anyMilestoneClaimable() ? 'inline-block' : 'none';
}


// ─────────────────────────────────────────────────────────────
//  BUTTON (external hook — unchanged)
// ─────────────────────────────────────────────────────────────

function buildQuestLogButton() {
    _refreshQuestBadge();
}


// ─────────────────────────────────────────────────────────────
//  MODAL
// ─────────────────────────────────────────────────────────────

let _ledgerActiveCategory = null;   // null = grid overview, string = category id

function showQuestLog() {
    let modal = document.getElementById('quest-log-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quest-log-modal';
        modal.className = 'modal-bg';
        document.body.appendChild(modal);
    }
    modal.classList.add('show');
    renderQuestLog();
}

function hideQuestLog() {
    const modal = document.getElementById('quest-log-modal');
    if (modal) modal.classList.remove('show');
}

// Called from inline onclick — open a specific category detail view
function _ledgerOpenCategory(id) {
    _ledgerActiveCategory = id;
    renderQuestLog();
}

// Called from inline onclick — back to grid overview
function _ledgerBack() {
    _ledgerActiveCategory = null;
    renderQuestLog();
}

// ── ENTRY POINT ──────────────────────────────────────────────

function renderQuestLog() {
    const modal = document.getElementById('quest-log-modal');
    if (!modal || !modal.classList.contains('show')) return;

    if (_ledgerActiveCategory) {
        _renderLedgerDetail(modal);
    } else {
        _renderLedgerGrid(modal);
    }
}

// ── GRID OVERVIEW ────────────────────────────────────────────

function _renderLedgerGrid(modal) {
    const de = LANG === 'de';

    // Summary counts
    let totalMs = 0, claimedMs = 0, claimableMs = 0;
    LEDGER_CATEGORIES.forEach(cat => {
        cat.milestones.forEach(ms => {
            totalMs++;
            if (_milestoneIsClaimed(ms)) claimedMs++;
            else if (_milestoneIsComplete(ms)) claimableMs++;
        });
    });

    const ptFromLedger = (() => {
        let pts = 0;
        LEDGER_CATEGORIES.forEach(cat =>
            cat.milestones.forEach(ms => {
                if (_milestoneIsClaimed(ms) && ms.reward.ptPoints) pts += ms.reward.ptPoints;
            })
        );
        return pts;
    })();

    const cards = LEDGER_CATEGORIES.map(cat => {
        const total = cat.milestones.length;
        const claimed = cat.milestones.filter(ms => _milestoneIsClaimed(ms)).length;
        const hasReady = cat.milestones.some(ms => _milestoneIsComplete(ms) && !_milestoneIsClaimed(ms));

        // Progress: how far is the player through the NEXT unclaimed milestone
        const nextMs = cat.milestones.find(ms => !_milestoneIsClaimed(ms));
        let barPct = nextMs ? _msProgress(nextMs).pct : 100;

        const cardClass = hasReady
            ? 'ledger-card ledger-card-ready'
            : claimed === total
                ? 'ledger-card ledger-card-done'
                : 'ledger-card';

        const badgeDot = hasReady ? `<span class="ledger-card-dot"></span>` : '';

        return `
            <div class="${cardClass}" onclick="_ledgerOpenCategory('${cat.id}')">
                ${badgeDot}
                <div class="ledger-card-icon">${cat.icon}</div>
                <div class="ledger-card-title">${de ? cat.titleDE : cat.titleEn}</div>
                <div class="ledger-card-prog-bar">
                    <div class="ledger-card-prog-fill ${claimed === total ? 'ledger-prog-done' : ''}"
                         style="width:${barPct}%"></div>
                </div>
                <div class="ledger-card-sub">${claimed} / ${total} ${de ? 'abgeholt' : 'claimed'}</div>
            </div>`;
    }).join('');

    modal.innerHTML = `
        <div class="modal-box ledger-modal-box">
            <button class="modal-close" onclick="hideQuestLog()">✕ ${de ? 'SCHLIESSEN' : 'CLOSE'}</button>
            <div class="modal-title">📒 ${de ? 'INFERENZ' : 'INFERENCE'}</div>

            <div class="ledger-summary-strip">
                <div>
                    🌳 ${de ? 'Wahrscheinlichkeitsbaum-Punkte aus der Inferenz' : 'Probability Tree Points from Inference'}:
                    <strong style="color:#2ecc71">${ptFromLedger}</strong>
                </div>
                <div style="margin-top: 4px;">
                    🎖️ ${de ? 'Meilensteine abgeholt' : 'Milestones claimed'}:
                    <strong style="color:#3498db">${claimedMs} / ${totalMs}</strong>
                    ${claimableMs > 0
            ? ` &nbsp;·&nbsp;<strong style="color:#f39c12;animation:questPulse 1.2s ease-in-out infinite;display:inline-block;">
                            ⭐ ${claimableMs} ${de ? 'einlösbar' : 'claimable'}
                           </strong>`
            : ''
        }
                </div>
            </div>

            <div class="ledger-grid">${cards}</div>
        </div>`;
}

// ── CATEGORY DETAIL ──────────────────────────────────────────

function _renderLedgerDetail(modal) {
    const de = LANG === 'de';
    const cat = LEDGER_CATEGORIES.find(c => c.id === _ledgerActiveCategory);
    if (!cat) { _ledgerBack(); return; }

    const rows = cat.milestones.map(ms => {
        const claimed = _milestoneIsClaimed(ms);
        const complete = _milestoneIsComplete(ms);
        const claimable = complete && !claimed;
        const { current, target, pct } = _msProgress(ms);

        const rowClass = claimed ? 'quest-row quest-done'
            : claimable ? 'quest-row quest-claimable'
                : 'quest-row quest-active';

        const statusText = claimed ? (de ? '✓ Abgeholt' : '✓ Claimed')
            : claimable ? (de ? '⭐ Jetzt abholen!' : '⭐ Claim now!')
                : (de ? 'In Bearbeitung…' : 'In progress…');

        // Reward chips
        const rewardParts = [];
        if (ms.reward.ptPoints) {
            rewardParts.push(`<span class="quest-reward-pt">🌳 +${ms.reward.ptPoints} ${de ? 'Baum-Punkt(e)' : 'Tree point(s)'}</span>`);
        }
        if (ms.reward.items) {
            ms.reward.items.forEach(defId => {
                if (defId === '__random__') {
                    rewardParts.push(`<span class="quest-reward-item">🎁 ${de ? 'Zufälliges Item' : 'Random Item'}</span>`);
                } else {
                    const def = ITEM_DEFS[defId];
                    if (def) rewardParts.push(`<span class="quest-reward-item">${def.icon} ${de ? def.nameDE : def.nameEn}</span>`);
                }
            });
        }

        const claimBtn = claimable
            ? `<button class="quest-claim-btn" onclick="claimQuest('${ms.id}')">🎁 ${de ? 'ABHOLEN' : 'CLAIM'}</button>`
            : claimed
                ? `<button class="quest-claim-btn quest-claimed-btn" disabled>✓ ${de ? 'ABGEHOLT' : 'CLAIMED'}</button>`
                : '';

        return `
            <div class="${rowClass}">
                <div class="quest-row-header">
                    <div class="quest-title-block">
                        <span class="quest-title">${de ? ms.labelDE : ms.labelEn}</span>
                    </div>
                    <span class="quest-status-label">${statusText}</span>
                </div>
                <div class="quest-objectives">
                    <div class="quest-obj ${complete ? 'quest-obj-done' : ''}">
                        <div class="quest-obj-top">
                            <span class="quest-obj-label">
                                ${complete ? '✓ ' : ''}${de ? ms.labelDE : ms.labelEn}
                            </span>
                            <span class="quest-obj-count">${current.toLocaleString()} / ${target.toLocaleString()}</span>
                        </div>
                        <div class="quest-prog-bar">
                            <div class="quest-prog-fill ${complete ? 'quest-prog-done' : ''}" style="width:${pct}%"></div>
                        </div>
                    </div>
                </div>
                <div class="quest-reward-row">
                    <div class="quest-rewards">${rewardParts.join('')}</div>
                    ${claimBtn}
                </div>
            </div>`;
    }).join('');

    modal.innerHTML = `
        <div class="modal-box quest-log-box">
            <button class="modal-close" onclick="hideQuestLog()">✕ ${de ? 'SCHLIESSEN' : 'CLOSE'}</button>
            <div class="modal-title">${cat.icon} ${de ? cat.titleDE : cat.titleEn}</div>

            <button class="ledger-back-btn" onclick="_ledgerBack()">
                ← ${de ? 'Zurück zur Übersicht' : 'Back to Overview'}
            </button>

            <div class="ledger-cat-desc">${de ? cat.descDE : cat.descEn}</div>

            <div class="quest-list">${rows}</div>
        </div>`;
}


// ─────────────────────────────────────────────────────────────
//  WORLD-COMPLETION HELPER  (unchanged, used by updateQuestStats)
// ─────────────────────────────────────────────────────────────

function _countCompletedWorlds() {
    let n = 0;
    WORLDS.forEach((w, wi) => {
        const start = WORLD_START_GI[wi];
        if (w.data.every((_, li) => STATE.done.includes(start + li))) n++;
    });
    return n;
}


// ═══════════════════════════════════════════════════════════════════════════════
//  CSS  — injected once
// ═══════════════════════════════════════════════════════════════════════════════

(function _injectLedgerCSS() {
    if (document.getElementById('quest-styles')) return;
    const s = document.createElement('style');
    s.id = 'quest-styles';
    s.textContent = `

    /* ── Badge on button ── */
    .quest-badge {
        display: inline-block;
        background: #e74c3c;
        color: #fff;
        font-family: var(--PX, monospace);
        font-size: 9px;
        padding: 1px 5px;
        border-radius: 2px;
        margin-left: 4px;
        vertical-align: middle;
        animation: questPulse 1.2s ease-in-out infinite;
    }
    @keyframes questPulse {
        0%,100% { opacity:1; }
        50%      { opacity:0.45; }
    }

    /* ── Modal sizing ── */
    .ledger-modal-box {
        width: min(760px, 96vw);
        max-height: 88vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0;
        padding-bottom: 20px;
    }
    .quest-log-box {
        width: min(680px, 96vw);
        max-height: 86vh;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0;
        padding-bottom: 16px;
    }

    /* ── Summary strip ── */
    .ledger-summary-strip {
        font-family: var(--PX, monospace);
        font-size: 10px;
        color: var(--accent2, #aaa);
        background: rgba(46,204,113,0.06);
        border: 1px solid rgba(46,204,113,0.2);
        padding: 8px 12px;
        margin-bottom: 16px;
        line-height: 1.8;
    }

    /* ── Category grid ── */
    .ledger-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 8px;
    }

    /* ── Category card ── */
    .ledger-card {
        position: relative;
        border: 1px solid var(--border2, #333);
        padding: 12px 10px 10px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        transition: border-color 0.18s, background 0.18s;
        text-align: center;
    }
    .ledger-card:hover {
        border-color: var(--accent, #fff);
        background: rgba(255,255,255,0.03);
    }
    .ledger-card-done {
        border-color: #2ecc71;
        opacity: 0.55;
    }
    .ledger-card-ready {
        border-color: #f39c12;
        background: rgba(243,156,18,0.04);
        animation: questGlow 2s ease-in-out infinite;
    }
    @keyframes questGlow {
        0%,100% { box-shadow: 0 0 0 0 rgba(243,156,18,0); }
        50%      { box-shadow: 0 0 8px 2px rgba(243,156,18,0.2); }
    }

    .ledger-card-dot {
        position: absolute;
        top: 6px;
        right: 7px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #f39c12;
        animation: questPulse 1.2s ease-in-out infinite;
    }

    .ledger-card-icon {
        font-size: 22px;
        line-height: 1;
    }
    .ledger-card-title {
        font-family: var(--PX, monospace);
        font-size: 9px;
        color: var(--accent, #fff);
        letter-spacing: 0.6px;
        line-height: 1.4;
    }
    .ledger-card-prog-bar {
        width: 100%;
        height: 3px;
        background: var(--border2, #2a2a2a);
        border-radius: 2px;
        overflow: hidden;
        margin-top: 2px;
    }
    .ledger-card-prog-fill {
        height: 100%;
        background: #3498db;
        border-radius: 2px;
        transition: width 0.3s;
    }
    .ledger-prog-done { background: #2ecc71; }
    .ledger-card-sub {
        font-family: var(--PX, monospace);
        font-size: 8px;
        color: var(--accent2, #666);
    }

    /* ── Back button ── */
    .ledger-back-btn {
        font-family: var(--PX, monospace);
        font-size: 9px;
        letter-spacing: 1px;
        background: transparent;
        border: 1px solid var(--border2, #333);
        color: var(--accent2, #aaa);
        padding: 6px 12px;
        cursor: pointer;
        align-self: flex-start;
        margin-bottom: 10px;
        transition: border-color 0.15s, color 0.15s;
    }
    .ledger-back-btn:hover { border-color: var(--accent,#fff); color: var(--accent,#fff); }

    /* ── Category description ── */
    .ledger-cat-desc {
        font-family: var(--PX, monospace);
        font-size: 9px;
        color: var(--accent2, #aaa);
        border-left: 2px solid rgba(52,152,219,0.4);
        padding: 6px 10px;
        margin-bottom: 12px;
        line-height: 1.7;
        font-style: italic;
    }

    /* ── Quest row (reused from original, kept identical) ── */
    .quest-list { display:flex; flex-direction:column; gap:9px; }

    .quest-row {
        border: 1px solid var(--border2, #333);
        padding: 12px 13px;
        display: flex;
        flex-direction: column;
        gap: 7px;
    }
    .quest-row.quest-done     { border-color:#2ecc71; opacity:0.6; }
    .quest-row.quest-claimable{
        border-color:#f39c12;
        background:rgba(243,156,18,0.05);
        animation: questGlow 2s ease-in-out infinite;
    }

    .quest-row-header {
        display: flex;
        align-items: flex-start;
        gap: 10px;
    }
    .quest-icon { font-size:20px; flex-shrink:0; line-height:1; margin-top:1px; }
    .quest-title-block { flex:1; display:flex; flex-direction:column; gap:2px; }
    .quest-title {
        font-family: var(--PX, monospace);
        font-size: 11px;
        color: var(--accent, #fff);
        letter-spacing: 1px;
    }
    .quest-desc {
        font-family: var(--PX, monospace);
        font-size: 9px;
        color: var(--accent2, #aaa);
        line-height: 1.65;
    }
    .quest-status-label {
        font-family: var(--PX, monospace);
        font-size: 9px;
        color: var(--accent2, #aaa);
        white-space: nowrap;
        flex-shrink: 0;
    }
    .quest-claimable .quest-status-label { color:#f39c12; }
    .quest-done      .quest-status-label { color:#2ecc71; }

    .quest-objectives {
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding-left: 0;
    }
    .quest-obj { display:flex; flex-direction:column; gap:2px; }
    .quest-obj-top {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 6px;
    }
    .quest-obj-label {
        font-family: var(--PX, monospace);
        font-size: 9px;
        color: var(--accent2, #aaa);
    }
    .quest-obj-count {
        font-family: var(--PX, monospace);
        font-size: 8px;
        color: #555;
        white-space: nowrap;
    }
    .quest-obj-done .quest-obj-label { color:#2ecc71; }
    .quest-obj-done .quest-obj-count { color:#2ecc71; }

    .quest-prog-bar {
        height: 3px;
        background: var(--border2, #2a2a2a);
        border-radius: 2px;
        overflow: hidden;
        width: 100%;
    }
    .quest-prog-fill { height:100%; background:#3498db; border-radius:2px; transition:width 0.3s; }
    .quest-prog-done { background:#2ecc71; }

    .quest-reward-row {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }
    .quest-rewards { display:flex; gap:6px; flex-wrap:wrap; flex:1; }
    .quest-reward-pt {
        font-family: var(--PX, monospace);
        font-size: 9px;
        color: #2ecc71;
        background: rgba(46,204,113,0.1);
        border: 1px solid rgba(46,204,113,0.28);
        padding: 2px 7px;
    }
    .quest-reward-item {
        font-family: var(--PX, monospace);
        font-size: 9px;
        color: #f39c12;
        background: rgba(243,156,18,0.09);
        border: 1px solid rgba(243,156,18,0.28);
        padding: 2px 7px;
    }

    .quest-claim-btn {
        font-family: var(--PX, monospace);
        font-size: 9px;
        letter-spacing: 1px;
        padding: 5px 13px;
        border: 1px solid #f39c12;
        background: rgba(243,156,18,0.1);
        color: #f39c12;
        cursor: pointer;
        flex-shrink: 0;
        transition: background 0.15s;
    }
    .quest-claim-btn:hover { background:rgba(243,156,18,0.24); }
    .quest-claimed-btn {
        border-color:#2ecc71;
        background: rgba(46,204,113,0.07);
        color: #2ecc71;
        cursor: default;
    }
    .quest-claimed-btn:hover { background:rgba(46,204,113,0.07); }

    `;
    document.head.appendChild(s);
})();