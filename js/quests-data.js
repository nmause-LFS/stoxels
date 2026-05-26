


const LEDGER_CATEGORIES = [

    // ── 1. SAMPLE SIZE ───────────────────────────────────────────────────────
    //  Theme: the more observations you collect, the better
    {
        id: 'sample_size',
        icon: '📊',
        titleEn: 'Sample Size', titleDE: 'Stichprobengröße',
        descEn: 'Every solved puzzle adds to your sample. Larger samples reveal the truth.',
        descDE: 'Jedes gelöste Rätsel vergrößert deine Stichprobe. Größere Stichproben enthüllen die Wahrheit.',
        milestones: [
            {
                id: 'sample_size_1', labelEn: 'n = 10', labelDE: 'n = 10',
                check: qs => ({ current: qs.levelsCompleted || 0, target: 10 }),
                reward: { items: ['reveal3'] }
            },
            {
                id: 'sample_size_2', labelEn: 'n = 50', labelDE: 'n = 50',
                check: qs => ({ current: qs.levelsCompleted || 0, target: 50 }),
                reward: { items: ['reveal4', 'markWrong6'] }
            },
            {
                id: 'sample_size_3', labelEn: 'n = 100', labelDE: 'n = 100',
                check: qs => ({ current: qs.levelsCompleted || 0, target: 100 }),
                reward: { items: ['rowSolve'] }
            },
            {
                id: 'sample_size_4', labelEn: 'n = 200', labelDE: 'n = 200',
                check: qs => ({ current: qs.levelsCompleted || 0, target: 200 }),
                reward: { items: ['colSolve', 'mistakeEraser4'] }
            },
            {
                id: 'sample_size_5', labelEn: 'n = 500', labelDE: 'n = 500',
                check: qs => ({ current: qs.levelsCompleted || 0, target: 500 }),
                reward: { ptPoints: 1, items: ['rowSolve', 'colSolve'] }
            },
        ]
    },

    // ── 2. ZERO VARIANCE ─────────────────────────────────────────────────────
    //  Theme: perfect consistency — no deviation from the correct answer
    {
        id: 'zero_variance',
        icon: '📉',
        titleEn: 'Zero Variance', titleDE: 'Null-Varianz',
        descEn: 'A dataset with zero variance has no error. Solve flawlessly.',
        descDE: 'Ein Datensatz ohne Varianz hat keinen Fehler. Löse makellos.',
        milestones: [
            {
                id: 'zero_var_1', labelEn: '10 flawless levels', labelDE: '10 fehlerfreie Level',
                check: qs => ({ current: qs.levelsNomiss || 0, target: 10 }),
                reward: { items: ['shield', 'mistakeEraser'] }
            },
            {
                id: 'zero_var_2', labelEn: '30 flawless levels', labelDE: '30 fehlerfreie Level',
                check: qs => ({ current: qs.levelsNomiss || 0, target: 30 }),
                reward: { items: ['mistakeEraser6', 'shield'] }
            },
            {
                id: 'zero_var_3', labelEn: '60 flawless levels', labelDE: '60 fehlerfreie Level',
                check: qs => ({ current: qs.levelsNomiss || 0, target: 60 }),
                reward: { items: ['mistakeEraserAll', 'reveal4'] }
            },
            {
                id: 'zero_var_4', labelEn: '100 flawless levels', labelDE: '100 fehlerfreie Level',
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
        titleEn: 'Null Hypothesis', titleDE: 'Nullhypothese',
        descEn: 'Test whether items are truly necessary. Reject the null by going without them.',
        descDE: 'Teste, ob Items wirklich notwendig sind. Beweise das Gegenteil, indem du ohne sie spielst.',
        milestones: [
            {
                id: 'null_hyp_1', labelEn: '10 levels without items', labelDE: '10 Level ohne Items',
                check: qs => ({ current: qs.levelsNoitem || 0, target: 10 }),
                reward: { items: ['markWrong6', 'reveal3'] }
            },
            {
                id: 'null_hyp_2', labelEn: '25 levels without items', labelDE: '25 Level ohne Items',
                check: qs => ({ current: qs.levelsNoitem || 0, target: 25 }),
                reward: { items: ['rowSolve', 'markWrong8'] }
            },
            {
                id: 'null_hyp_3', labelEn: '60 levels without items', labelDE: '60 Level ohne Items',
                check: qs => ({ current: qs.levelsNoitem || 0, target: 60 }),
                reward: { ptPoints: 1, items: ['reveal4', 'colSolve'] }
            },
        ]
    },

    // ── 4. CONFIDENCE INTERVAL ───────────────────────────────────────────────
    //  Theme: answering questions correctly = narrowing the interval of uncertainty
    {
        id: 'confidence_interval',
        icon: '🎯',
        titleEn: 'Confidence Interval', titleDE: 'Konfidenzintervall',
        descEn: 'Each correct answer tightens your confidence interval. Approach certainty.',
        descDE: 'Jede richtige Antwort verengt dein Konfidenzintervall. Nähere dich der Gewissheit.',
        milestones: [
            {
                id: 'ci_1', labelEn: '20 correct answers', labelDE: '20 richtige Antworten',
                check: qs => ({ current: qs.questionsCorrect || 0, target: 20 }),
                reward: { items: ['reveal3'] }
            },
            {
                id: 'ci_2', labelEn: '50 correct answers', labelDE: '50 richtige Antworten',
                check: qs => ({ current: qs.questionsCorrect || 0, target: 50 }),
                reward: { items: ['reveal4', 'markWrong6'] }
            },
            {
                id: 'ci_3', labelEn: '150 correct answers', labelDE: '150 richtige Antworten',
                check: qs => ({ current: qs.questionsCorrect || 0, target: 150 }),
                reward: { items: ['markWrong8', 'scoutPrimer'] }
            },
            {
                id: 'ci_4', labelEn: '300 correct answers', labelDE: '300 richtige Antworten',
                check: qs => ({ current: qs.questionsCorrect || 0, target: 300 }),
                reward: { items: ['rowSolve', 'reveal4'] }
            },
            {
                id: 'ci_5', labelEn: '500 correct answers', labelDE: '500 richtige Antworten',
                check: qs => ({ current: qs.questionsCorrect || 0, target: 500 }),
                reward: { ptPoints: 1, items: ['rowSolve', 'colSolve'] }
            },
        ]
    },

    // ── 5. CONDITIONAL PROBABILITY (GATES) ───────────────────────────────────
    //  Theme: passing gates = conditioning on the right event
    {
        id: 'probability_gate',
        icon: '🔐',
        titleEn: 'Conditional Probability', titleDE: 'Bedingte Wahrscheinlichkeit',
        descEn: 'Given that you reach a gate — what are the odds you pass it?',
        descDE: 'Gegeben, dass du ein Tor erreichst — wie hoch sind deine Chancen es zu bestehen?',
        milestones: [
            {
                id: 'cond_prob_1', labelEn: '5 gates passed', labelDE: '5 Tore bestanden',
                check: qs => ({ current: qs.gatesPassed || 0, target: 5 }),
                reward: { items: ['reveal3', 'markWrong6'] }
            },
            {
                id: 'cond_prob_2', labelEn: '15 gates passed', labelDE: '15 Tore bestanden',
                check: qs => ({ current: qs.gatesPassed || 0, target: 15 }),
                reward: { items: ['scoutPrimer', 'markWrong8'] }
            },
            {
                id: 'cond_prob_3', labelEn: '35 gates passed', labelDE: '35 Tore bestanden',
                check: qs => ({ current: qs.gatesPassed || 0, target: 35 }),
                reward: { ptPoints: 1, items: ['rowSolve', 'markWrong8'] }
            },
        ]
    },

    // ── 6. EXPECTED VALUE ────────────────────────────────────────────────────
    //  Theme: your total score is the expected value of your decisions
    {
        id: 'expected_value',
        icon: '💰',
        titleEn: 'Expected Value', titleDE: 'Erwartungswert',
        descEn: 'E[X] = Σ x·p(x). Accumulate the expected return of every run.',
        descDE: 'E[X] = Σ x·p(x). Häufe den erwarteten Ertrag jedes Durchlaufs an.',
        milestones: [
            {
                id: 'ev_1', labelEn: '5,000 total score', labelDE: '5.000 Gesamtpunkte',
                check: () => ({ current: STATE.totalScore || 0, target: 5000 }),
                reward: { items: ['addTime300', 'reveal3'] }
            },
            {
                id: 'ev_2', labelEn: '20,000 total score', labelDE: '20.000 Gesamtpunkte',
                check: () => ({ current: STATE.totalScore || 0, target: 20000 }),
                reward: { items: ['addTime600', 'markWrong8'] }
            },
            {
                id: 'ev_3', labelEn: '50,000 total score', labelDE: '50.000 Gesamtpunkte',
                check: () => ({ current: STATE.totalScore || 0, target: 50000 }),
                reward: { items: ['addTime900', 'rowSolve'] }
            },
            {
                id: 'ev_4', labelEn: '100,000 total score', labelDE: '100.000 Gesamtpunkte',
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
        titleEn: 'Convergence', titleDE: 'Konvergenz',
        descEn: 'As n → ∞, the sequence converges to truth. Clear convergence levels.',
        descDE: 'Wenn n → ∞, konvergiert die Folge zur Wahrheit. Schließe Konvergenz-Level ab.',
        milestones: [
            {
                id: 'conv_1', labelEn: '5 convergence levels', labelDE: '5 Konvergenz-Level',
                check: qs => ({ current: qs.convergenceLevels || 0, target: 5 }),
                reward: { items: ['reveal4', 'markWrong6'] }
            },
            {
                id: 'conv_2', labelEn: '13 convergence levels', labelDE: '13 Konvergenz-Level',
                check: qs => ({ current: qs.convergenceLevels || 0, target: 13 }),
                reward: { items: ['colSolve', 'mistakeEraser4'] }
            },
            {
                id: 'conv_3', labelEn: '26 convergence levels', labelDE: '26 Konvergenz-Level',
                check: qs => ({ current: qs.convergenceLevels || 0, target: 26 }),
                reward: { ptPoints: 1, items: ['rowSolve', 'colSolve'] }
            },
        ]
    },

    // ── 8. OUTLIER RESISTANCE (HARDCORE) ─────────────────────────────────────
    //  Theme: robust estimators ignore extreme outliers — survive Hardcore mode
    {
        id: 'outlier_resistance',
        icon: '💀',
        titleEn: 'Outlier Resistance', titleDE: 'Ausreißerresistenz',
        descEn: 'Robust estimators ignore extreme outliers. Survive Hardcore mode.',
        descDE: 'Robuste Schätzer ignorieren extreme Ausreißer. Überlebe den Hardcore-Modus.',
        milestones: [
            {
                id: 'hc_1', labelEn: '5 Hardcore levels', labelDE: '5 Hardcore-Level',
                check: qs => ({ current: qs.levelsHardcore || 0, target: 5 }),
                reward: { items: ['mistakeEraser4', 'shield'] }
            },
            {
                id: 'hc_2', labelEn: '20 Hardcore levels', labelDE: '20 Hardcore-Level',
                check: qs => ({ current: qs.levelsHardcore || 0, target: 20 }),
                reward: { items: ['mistakeEraser6', 'mistakeEraser4'] }
            },
            {
                id: 'hc_3', labelEn: '50 Hardcore levels', labelDE: '50 Hardcore-Level',
                check: qs => ({ current: qs.levelsHardcore || 0, target: 50 }),
                reward: { ptPoints: 1, items: ['mistakeEraserAll', 'mistakeEraser6'] }
            },
        ]
    },

    // ── 9. SAMPLING UNDER TIME PRESSURE (TIME TRIAL) ─────────────────────────
    //  Theme: real analysts work to deadlines — conquer Time Trial mode
    {
        id: 'time_pressure',
        icon: '⏱️',
        titleEn: 'Sampling Under Pressure', titleDE: 'Stichproben unter Druck',
        descEn: 'Real analysts work to deadlines. Conquer Time Trial mode.',
        descDE: 'Echte Analysten arbeiten unter Zeitdruck. Bewältige den Time Trial-Modus.',
        milestones: [
            {
                id: 'tt_1', labelEn: '5 Time Trial levels', labelDE: '5 Time Trial-Level',
                check: qs => ({ current: qs.levelsTimetrial || 0, target: 5 }),
                reward: { items: ['addTime600', 'addTime300'] }
            },
            {
                id: 'tt_2', labelEn: '20 Time Trial levels', labelDE: '20 Time Trial-Level',
                check: qs => ({ current: qs.levelsTimetrial || 0, target: 20 }),
                reward: { items: ['addTime900', 'addTime600'] }
            },
            {
                id: 'tt_3', labelEn: '50 Time Trial levels', labelDE: '50 Time Trial-Level',
                check: qs => ({ current: qs.levelsTimetrial || 0, target: 50 }),
                reward: { ptPoints: 1, items: ['addTime900', 'addTime900'] }
            },
        ]
    },

    // ── 10. FULL DISTRIBUTION (IRONMAN) ──────────────────────────────────────
    //  Theme: no buffers — see the full range of outcomes in Ironman mode
    {
        id: 'ironman_dist',
        icon: '⚔️',
        titleEn: 'Full Distribution', titleDE: 'Vollständige Verteilung',
        descEn: 'See the full range of outcomes — Ironman mode, no buffers allowed.',
        descDE: 'Sieh die volle Bandbreite der Ergebnisse — Ironman-Modus, keine Puffer erlaubt.',
        milestones: [
            {
                id: 'iron_1', labelEn: '3 Ironman levels', labelDE: '3 Ironman-Level',
                check: qs => ({ current: qs.levelsIronman || 0, target: 3 }),
                reward: { items: ['mistakeEraser4', 'reveal4'] }
            },
            {
                id: 'iron_2', labelEn: '15 Ironman levels', labelDE: '15 Ironman-Level',
                check: qs => ({ current: qs.levelsIronman || 0, target: 15 }),
                reward: { items: ['mistakeEraser6', 'rowSolve'] }
            },
            {
                id: 'iron_3', labelEn: '33 Ironman levels', labelDE: '33 Ironman-Level',
                check: qs => ({ current: qs.levelsIronman || 0, target: 33 }),
                reward: { ptPoints: 1, items: ['mistakeEraserAll', 'rowSolve'] }
            },
        ]
    },

    // ── 11. SIGNIFICANCE LEVEL α (HARD DIFFICULTY) ───────────────────────────
    //  Theme: below α, results are statistically significant — and merciless
    {
        id: 'significance_level',
        icon: '🔥',
        titleEn: 'Significance Level α', titleDE: 'Signifikanzniveau α',
        descEn: 'Below α, results are statistically significant — and merciless. Clear Hard levels.',
        descDE: 'Unterhalb von α sind Ergebnisse signifikant — und gnadenlos. Schließe Schwer-Level ab.',
        milestones: [
            {
                id: 'hard_1', labelEn: '10 Hard levels', labelDE: '10 Schwer-Level',
                check: qs => ({ current: qs.levelsHard || 0, target: 10 }),
                reward: { items: ['shield', 'reveal4'] }
            },
            {
                id: 'hard_2', labelEn: '30 Hard levels', labelDE: '30 Schwer-Level',
                check: qs => ({ current: qs.levelsHard || 0, target: 30 }),
                reward: { items: ['mistakeEraser6', 'markWrong8'] }
            },
            {
                id: 'hard_3', labelEn: '60 Hard levels', labelDE: '60 Schwer-Level',
                check: qs => ({ current: qs.levelsHard || 0, target: 60 }),
                reward: { ptPoints: 1, items: ['mistakeEraserAll', 'reveal4'] }
            },
        ]
    },

    // ── 12. MONTE CARLO METHOD (TRIPLE MODIFIER) ─────────────────────────────
    //  Theme: simulate every worst case at once — Hard + all three modifiers
    {
        id: 'monte_carlo',
        icon: '🎲',
        titleEn: 'Monte Carlo Method', titleDE: 'Monte-Carlo-Methode',
        descEn: 'Simulate every worst case at once. Hard difficulty with all three modifiers active.',
        descDE: 'Simuliere jeden schlimmsten Fall gleichzeitig. Schwer mit allen drei Modifikatoren aktiv.',
        milestones: [
            {
                id: 'mc_1', labelEn: '1 Triple-Modifier level', labelDE: '1 Dreifach-Modifikator-Level',
                check: qs => ({ current: qs.levelsTripleModifier || 0, target: 1 }),
                reward: { items: ['mistakeEraser6', 'addTime600'] }
            },
            {
                id: 'mc_2', labelEn: '5 Triple-Modifier levels', labelDE: '5 Dreifach-Modifikator-Level',
                check: qs => ({ current: qs.levelsTripleModifier || 0, target: 5 }),
                reward: { items: ['mistakeEraserAll', 'addTime900'] }
            },
            {
                id: 'mc_3', labelEn: '15 Triple-Modifier levels', labelDE: '15 Dreifach-Modifikator-Level',
                check: qs => ({ current: qs.levelsTripleModifier || 0, target: 15 }),
                reward: { ptPoints: 1, items: ['mistakeEraserAll', 'rowSolve', 'colSolve'] }
            },
        ]
    },

    // ── 13. RESOURCE DISTRIBUTION (ITEM USAGE) ───────────────────────────────
    //  Theme: allocating resources across the probability space — use items
    {
        id: 'item_distribution',
        icon: '🎒',
        titleEn: 'Resource Distribution', titleDE: 'Ressourcenverteilung',
        descEn: 'Allocate your resources wisely across the sample space. Use items.',
        descDE: 'Verteile deine Ressourcen weise über den Stichprobenraum. Setze Items ein.',
        milestones: [
            {
                id: 'item_1', labelEn: '25 items used', labelDE: '25 Items verwendet',
                check: qs => ({ current: qs.itemsUsedTotal || 0, target: 25 }),
                reward: { items: ['reveal4', 'markWrong6'] }
            },
            {
                id: 'item_2', labelEn: '100 items used', labelDE: '100 Items verwendet',
                check: qs => ({ current: qs.itemsUsedTotal || 0, target: 100 }),
                reward: { items: ['rowSolve', 'markWrong8'] }
            },
            {
                id: 'item_3', labelEn: '250 items used', labelDE: '250 Items verwendet',
                check: qs => ({ current: qs.itemsUsedTotal || 0, target: 250 }),
                reward: { items: ['rowSolve', 'colSolve', 'reveal4'] }
            },
            {
                id: 'item_4', labelEn: '500 items used', labelDE: '500 Items verwendet',
                check: qs => ({ current: qs.itemsUsedTotal || 0, target: 500 }),
                reward: { ptPoints: 1, items: ['scoutPrimer', 'rowSolve'] }
            },
        ]
    },

    // ── 14. CURSE OF DIMENSIONALITY (CURSED ITEMS) ───────────────────────────
    //  Theme: in high dimensions, strange things happen — embrace cursed items
    {
        id: 'curse_dimensionality',
        icon: '☠️',
        titleEn: 'Curse of Dimensionality', titleDE: 'Fluch der Dimensionalität',
        descEn: 'In high dimensions, strange things happen. Embrace cursed items.',
        descDE: 'In hohen Dimensionen passieren seltsame Dinge. Umarme verfluchte Items.',
        milestones: [
            {
                id: 'curse_1', labelEn: '5 cursed items used', labelDE: '5 verfluchte Items verwendet',
                check: qs => ({ current: qs.cursedItemsUsed || 0, target: 5 }),
                reward: { items: ['cursedShield', 'cursedReveal'] }
            },
            {
                id: 'curse_2', labelEn: '25 cursed items used', labelDE: '25 verfluchte Items verwendet',
                check: qs => ({ current: qs.cursedItemsUsed || 0, target: 25 }),
                reward: { items: ['cursedRowSolve', 'cursedColSolve'] }
            },
            {
                id: 'curse_3', labelEn: '75 cursed items used', labelDE: '75 verfluchte Items verwendet',
                check: qs => ({ current: qs.cursedItemsUsed || 0, target: 75 }),
                reward: { ptPoints: 1, items: ['cursedRowCol', 'cursedTime'] }
            },
        ]
    },

    // ── 15. PRIOR DISTRIBUTION (SCOUT'S PRIMER) ──────────────────────────────
    //  Theme: Bayesian inference starts with a prior — the Primer is your prior
    {
        id: 'prior_distribution',
        icon: '📜',
        titleEn: "Prior Distribution", titleDE: 'A-priori-Verteilung',
        descEn: "Bayesian inference starts with a prior. The Scout's Primer is your prior.",
        descDE: 'Bayesianische Inferenz beginnt mit einem Prior. Der Pfadfinder-Kompass ist dein Prior.',
        milestones: [
            {
                id: 'prior_1', labelEn: '5 Primer questions correct', labelDE: '5 Kompass-Fragen richtig',
                check: qs => ({ current: qs.primerCorrect || 0, target: 5 }),
                reward: { items: ['reveal4', 'scoutPrimer'] }
            },
            {
                id: 'prior_2', labelEn: '30 Primer questions correct', labelDE: '30 Kompass-Fragen richtig',
                check: qs => ({ current: qs.primerCorrect || 0, target: 30 }),
                reward: { items: ['scoutPrimer', 'scoutPrimer'] }
            },
            {
                id: 'prior_3', labelEn: '75 Primer questions correct', labelDE: '75 Kompass-Fragen richtig',
                check: qs => ({ current: qs.primerCorrect || 0, target: 75 }),
                reward: { items: ['rowSolve', 'scoutPrimer'] }
            },
            {
                id: 'prior_4', labelEn: '1 full-puzzle Primer solve', labelDE: '1 vollständige Primer-Lösung',
                check: qs => ({ current: qs.primerFullSolves || 0, target: 1 }),
                reward: { items: ['scoutPrimer', 'reveal4'] }
            },
            {
                id: 'prior_5', labelEn: '5 full-puzzle Primer solves', labelDE: '5 vollständige Primer-Lösungen',
                check: qs => ({ current: qs.primerFullSolves || 0, target: 5 }),
                reward: { ptPoints: 1, items: ['scoutPrimer', 'rowSolve'] }
            },
        ]
    },

    // ── 16. REGRESSION TO THE MEAN (TUTOR ITEMS) ─────────────────────────────
    //  Theme: extreme mistakes regress toward the mean — use Tutor items
    {
        id: 'tutor_regression',
        icon: '🎓',
        titleEn: 'Regression to the Mean', titleDE: 'Regression zur Mitte',
        descEn: 'Extreme mistakes regress toward the mean. Use Tutor items to correct your path.',
        descDE: 'Extreme Fehler kehren zur Mitte zurück. Nutze Tutor-Items, um deinen Weg zu korrigieren.',
        milestones: [
            {
                id: 'tutor_1', labelEn: '5 Tutor items used', labelDE: '5 Tutor-Items verwendet',
                check: qs => ({ current: qs.tutorItemsUsed || 0, target: 5 }),
                reward: { items: ['mistakeEraser4', 'mistakeEraser'] }
            },
            {
                id: 'tutor_2', labelEn: '20 Tutor items used', labelDE: '20 Tutor-Items verwendet',
                check: qs => ({ current: qs.tutorItemsUsed || 0, target: 20 }),
                reward: { items: ['mistakeEraser6', 'mistakeEraser4'] }
            },
            {
                id: 'tutor_3', labelEn: '50 Tutor items used', labelDE: '50 Tutor-Items verwendet',
                check: qs => ({ current: qs.tutorItemsUsed || 0, target: 50 }),
                reward: { ptPoints: 1, items: ['mistakeEraserAll', 'mistakeEraser6'] }
            },
        ]
    },

    // ── 17. ACTIVE INFERENCE (CLASS ABILITIES) ───────────────────────────────
    //  Theme: an active agent continuously updates its model — fire class abilities
    {
        id: 'active_inference',
        icon: '⚡',
        titleEn: 'Active Inference', titleDE: 'Aktive Inferenz',
        descEn: 'An active agent continuously updates its model. Fire class abilities.',
        descDE: 'Ein aktiver Agent aktualisiert kontinuierlich sein Modell. Setze Klassenfähigkeiten ein.',
        milestones: [
            {
                id: 'ai_1', labelEn: '10 abilities used', labelDE: '10 Fähigkeiten verwendet',
                check: qs => ({ current: qs.classAbilitiesUsed || 0, target: 10 }),
                reward: { items: ['markWrong8', 'reveal4'] }
            },
            {
                id: 'ai_2', labelEn: '50 abilities used', labelDE: '50 Fähigkeiten verwendet',
                check: qs => ({ current: qs.classAbilitiesUsed || 0, target: 50 }),
                reward: { items: ['pearlOfHaste', 'reveal4'] }
            },
            {
                id: 'ai_3', labelEn: '150 abilities used', labelDE: '150 Fähigkeiten verwendet',
                check: qs => ({ current: qs.classAbilitiesUsed || 0, target: 150 }),
                reward: { items: ['pearlOfSwiftness', 'rowSolve'] }
            },
            {
                id: 'ai_4', labelEn: '300 abilities used', labelDE: '300 Fähigkeiten verwendet',
                check: qs => ({ current: qs.classAbilitiesUsed || 0, target: 300 }),
                reward: { ptPoints: 1, items: ['grandPearl'] }
            },
        ]
    },

    // ── 18. LAW OF LARGE NUMBERS (TILES REVEALED) ────────────────────────────
    //  Theme: as N increases, the sample mean converges — reveal tiles via abilities
    {
        id: 'law_large_numbers',
        icon: '🔭',
        titleEn: 'Law of Large Numbers', titleDE: 'Gesetz der großen Zahlen',
        descEn: 'With enough observations, the mean converges. Reveal tiles through class abilities.',
        descDE: 'Mit genügend Beobachtungen konvergiert das Mittel. Enthülle Felder durch Fähigkeiten.',
        milestones: [
            {
                id: 'lln_1', labelEn: '50 tiles revealed', labelDE: '50 Felder enthüllt',
                check: qs => ({ current: qs.tilesRevealedByAbility || 0, target: 50 }),
                reward: { items: ['reveal4', 'markWrong8'] }
            },
            {
                id: 'lln_2', labelEn: '200 tiles revealed', labelDE: '200 Felder enthüllt',
                check: qs => ({ current: qs.tilesRevealedByAbility || 0, target: 200 }),
                reward: { items: ['rowSolve', 'reveal4'] }
            },
            {
                id: 'lln_3', labelEn: '500 tiles revealed', labelDE: '500 Felder enthüllt',
                check: qs => ({ current: qs.tilesRevealedByAbility || 0, target: 500 }),
                reward: { ptPoints: 1, items: ['rowSolve', 'colSolve'] }
            },
        ]
    },

    // ── 19. RARE EVENT PROBABILITY (LUCKY DROPS) ─────────────────────────────
    //  Theme: lucky drops are low-probability events that do occur
    {
        id: 'lucky_drop_event',
        icon: '🍀',
        titleEn: 'Rare Event Probability', titleDE: 'Seltene Ereigniswahrscheinlichkeit',
        descEn: 'Rare events do occur. Activate the Lucky Drops node and collect the drops.',
        descDE: 'Seltene Ereignisse treten ein. Aktiviere den Glücksfunde-Knoten und sammle die Drops.',
        milestones: [
            {
                id: 'lucky_1', labelEn: '1 Lucky Drop', labelDE: '1 Glücksfund',
                check: qs => ({ current: qs.luckyDropsClaimed || 0, target: 1 }),
                reward: { items: ['__random__', '__random__'] }
            },
            {
                id: 'lucky_2', labelEn: '10 Lucky Drops', labelDE: '10 Glücksfunde',
                check: qs => ({ current: qs.luckyDropsClaimed || 0, target: 10 }),
                reward: { items: ['__random__', '__random__', '__random__'] }
            },
            {
                id: 'lucky_3', labelEn: '40 Lucky Drops', labelDE: '40 Glücksfunde',
                check: qs => ({ current: qs.luckyDropsClaimed || 0, target: 40 }),
                reward: { items: ['__random__', '__random__', '__random__'] }
            },
            {
                id: 'lucky_4', labelEn: '77 Lucky Drops', labelDE: '77 Glücksfunde',
                check: qs => ({ current: qs.luckyDropsClaimed || 0, target: 77 }),
                reward: { ptPoints: 1, items: ['__random__', '__random__', '__random__'] }
            },
        ]
    },

    // ── 20. PARAMETER SPACE (WORLD EXPLORATION) ──────────────────────────────
    //  Theme: a complete analysis covers the entire parameter space — finish every world
    {
        id: 'parameter_space',
        icon: '🌍',
        titleEn: 'Parameter Space', titleDE: 'Parameterraum',
        descEn: 'A complete analysis covers the entire parameter space. Finish every world.',
        descDE: 'Eine vollständige Analyse deckt den gesamten Parameterraum ab. Beende jede Welt.',
        milestones: [
            {
                id: 'world_1', labelEn: '1 world completed', labelDE: '1 Welt abgeschlossen',
                check: qs => ({ current: qs.worldsCompleted || 0, target: 1 }),
                reward: { items: ['rowSolve', 'colSolve'] }
            },
            {
                id: 'world_2', labelEn: '2 worlds completed', labelDE: '2 Welten abgeschlossen',
                check: qs => ({ current: qs.worldsCompleted || 0, target: 2 }),
                reward: { items: ['rowSolve', 'colSolve', 'scoutPrimer'] }
            },
            {
                id: 'world_3', labelEn: '3 worlds completed', labelDE: '3 Welten abgeschlossen',
                check: qs => ({ current: qs.worldsCompleted || 0, target: 3 }),
                reward: { items: ['rowSolve', 'colSolve', 'mistakeEraserAll'] }
            },
            {
                id: 'world_4', labelEn: 'All worlds completed', labelDE: 'Alle Welten abgeschlossen',
                check: qs => ({ current: qs.worldsCompleted || 0, target: 5 }),
                reward: { ptPoints: 1, items: ['rowSolve', 'colSolve', 'mistakeEraserAll', 'addTime900'] }
            },
        ]
    },

    // ── 21. MARKOV CHAIN (REPLAY NODES) ──────────────────────────────────────
    //  Theme: the future depends only on the present — replay nodes re-enter states
    {
        id: 'markov_chain',
        icon: '🔁',
        titleEn: 'Markov Chain', titleDE: 'Markov-Kette',
        descEn: 'The Markov property: the future depends only on the present. Replay Levels while having the Lucky Drops node.',
        descDE: 'Die Markov-Eigenschaft: Die Zukunft hängt nur von der Gegenwart ab. Spiele Level erneut, während der Glücksfunde-Knoten aktiv ist.',
        milestones: [
            {
                id: 'markov_1', labelEn: '10 levels with Lucky Drops node active', labelDE: '10 Level mit aktivem Glücksfunde-Knoten',
                check: qs => ({ current: qs.levelsWithReplayNode || 0, target: 10 }),
                reward: { items: ['__random__', '__random__'] }
            },
            {
                id: 'markov_2', labelEn: '30 levels with Lucky Drops node active', labelDE: '30 Level mit aktivem Glücksfunde-Knoten',
                check: qs => ({ current: qs.levelsWithReplayNode || 0, target: 30 }),
                reward: { items: ['__random__', '__random__', '__random__'] }
            },
            {
                id: 'markov_3', labelEn: '75 levels with Lucky Drops node active', labelDE: '75 Level mit aktivem Glücksfunde-Knoten',
                check: qs => ({ current: qs.levelsWithReplayNode || 0, target: 75 }),
                reward: { ptPoints: 1, items: ['__random__', '__random__', '__random__'] }
            },
        ]
    },

    // ── 22. PROBABILITY TREE (PASSIVE SKILL POINTS) ───────────────────────────
    //  Theme: the passive skill tree IS a probability tree — branch through it
    {
        id: 'probability_tree',
        icon: '🌳',
        titleEn: 'Probability Tree', titleDE: 'Wahrscheinlichkeitsbaum',
        descEn: 'Branch through the probability tree. Spend passive skill points.',
        descDE: 'Verzweige dich durch den Wahrscheinlichkeitsbaum. Gib passive Fähigkeitspunkte aus.',
        milestones: [
            {
                id: 'pt_1', labelEn: '5 points spent', labelDE: '5 Punkte ausgegeben',
                check: () => ({ current: _ptCurrentSpentCount(), target: 5 }),
                reward: { items: ['reveal4', 'markWrong8'] }
            },
            {
                id: 'pt_2', labelEn: '15 points spent', labelDE: '15 Punkte ausgegeben',
                check: () => ({ current: _ptCurrentSpentCount(), target: 15 }),
                reward: { items: ['rowSolve', 'scoutPrimer'] }
            },
            {
                id: 'pt_3', labelEn: '30 points spent', labelDE: '30 Punkte ausgegeben',
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
        titleEn: 'Descriptive Statistics', titleDE: 'Deskriptive Statistik',
        descEn: 'Describe your performance with hard data. Unlock achievements.',
        descDE: 'Beschreibe deine Leistung mit harten Daten. Schalte Erfolge frei.',
        milestones: [
            {
                id: 'ach_1', labelEn: '10 achievements unlocked', labelDE: '10 Erfolge freigeschaltet',
                check: qs => ({ current: qs.achievementsUnlocked || 0, target: 10 }),
                reward: { items: ['reveal4', 'markWrong8'] }
            },
            {
                id: 'ach_2', labelEn: '25 achievements unlocked', labelDE: '25 Erfolge freigeschaltet',
                check: qs => ({ current: qs.achievementsUnlocked || 0, target: 25 }),
                reward: { items: ['rowSolve', 'mistakeEraser6'] }
            },
            {
                id: 'ach_3', labelEn: '50 achievements unlocked', labelDE: '50 Erfolge freigeschaltet',
                check: qs => ({ current: qs.achievementsUnlocked || 0, target: 50 }),
                reward: { ptPoints: 1, items: ['colSolve', 'mistakeEraserAll'] }
            },
        ]
    },

    // ── 24. STRATIFIED SAMPLING (QUIZ QUESTIONS) ──────────────────────────────
    //  Theme: sample from every stratum of knowledge — answer bonus quiz questions
    {
        id: 'stratified_sampling',
        icon: '📚',
        titleEn: 'Stratified Sampling', titleDE: 'Geschichtete Stichprobe',
        descEn: 'Sample from every stratum of knowledge. Answer bonus quiz questions correctly.',
        descDE: 'Stichproben aus jeder Wissensschicht. Beantworte Bonus-Quizfragen korrekt.',
        milestones: [
            {
                id: 'quiz_1', labelEn: '5 quiz answers correct', labelDE: '5 Quizfragen richtig',
                check: qs => ({ current: qs.quizCorrect || 0, target: 5 }),
                reward: { items: ['reveal4', 'markWrong6'] }
            },
            {
                id: 'quiz_2', labelEn: '20 quiz answers correct', labelDE: '20 Quizfragen richtig',
                check: qs => ({ current: qs.quizCorrect || 0, target: 20 }),
                reward: { items: ['scoutPrimer', 'markWrong8'] }
            },
            {
                id: 'quiz_3', labelEn: '50 quiz answers correct', labelDE: '50 Quizfragen richtig',
                check: qs => ({ current: qs.quizCorrect || 0, target: 50 }),
                reward: { ptPoints: 1, items: ['rowSolve', 'markWrong8'] }
            },
        ]
    },

    // ── 25. CHOOSE YOUR ESTIMATOR (CLASS SELECTION) ───────────────────────────
    //  Theme: every analysis requires choosing an estimator — select your class
    //  Single milestone, instant reward on first class selection.
    {
        id: 'choose_estimator',
        icon: '🧮',
        titleEn: 'Choose Your Estimator', titleDE: 'Wähle deinen Schätzer',
        descEn: 'Every analysis requires choosing an estimator. Select your class to begin.',
        descDE: 'Jede Analyse erfordert einen Schätzer. Wähle deine Klasse um zu beginnen.',
        milestones: [
            {
                id: 'class_chosen', labelEn: 'Select a class', labelDE: 'Wähle eine Klasse',
                check: qs => ({ current: qs.classChosen ? 1 : 0, target: 1 }),
                reward: { ptPoints: 1, items: ['reveal4', 'scoutPrimer'] }
            },
        ]
    },

    // ── 26. MAXIMUM LIKELIHOOD (CLASS UPGRADES) ───────────────────────────────
    //  Theme: find the parameters that maximise the likelihood — unlock all upgrades
    {
        id: 'max_likelihood',
        icon: '⬆️',
        titleEn: 'Maximum Likelihood', titleDE: 'Maximum-Likelihood',
        descEn: 'Find the parameters that maximise the likelihood. Unlock all class skill upgrades.',
        descDE: 'Finde die Parameter, die die Likelihood maximieren. Schalte alle Klassen-Upgrades frei.',
        milestones: [
            {
                id: 'mle_1', labelEn: '1 class upgrade applied', labelDE: '1 Klassen-Upgrade angewendet',
                check: qs => ({ current: qs.classUpgradesApplied || 0, target: 1 }),
                reward: { items: ['reveal4', 'markWrong8'] }
            },
            {
                id: 'mle_2', labelEn: '3 class upgrades applied', labelDE: '3 Klassen-Upgrades angewendet',
                check: qs => ({ current: qs.classUpgradesApplied || 0, target: 3 }),
                reward: { items: ['pearlOfHaste', 'pearlOfSwiftness'] }
            },
            {
                id: 'mle_3', labelEn: 'All 6 upgrades applied', labelDE: 'Alle 6 Upgrades angewendet',
                check: qs => ({ current: qs.classUpgradesApplied || 0, target: 6 }),
                reward: { ptPoints: 1, items: ['grandPearl', 'mistakeEraserAll'] }
            },
        ]
    },

    // ── 27. WITCH'S IMMUNITY (CURSED UNDER IMMUNITY) ─────────────────────────────
    //  Theme: using the Witch's protection to safely harvest cursed item upsides
    {
        id: 'witch_immunity',
        icon: '🧙',
        titleEn: "Witch's Immunity", titleDE: 'Hexenimmunität',
        descEn: "Activate The Witch's immunity, then use cursed items safely — and win the level.",
        descDE: 'Aktiviere die Hexenimmunität und nutze dann verfuchte Items sicher — und gewinne das Level.',
        milestones: [
            {
                id: 'witch_imm_1', labelEn: '5 cursed items under immunity (in a won level)', labelDE: '5 verfluchte Items unter Immunität (in einem gewonnenen Level)',
                check: qs => ({ current: qs.cursedUnderImmunityWon || 0, target: 5 }),
                reward: { items: ['cursedShield', 'theWitch'] }
            },
            {
                id: 'witch_imm_2', labelEn: '10 cursed items under immunity (in a won level)', labelDE: '10 verfluchte Items unter Immunität (in einem gewonnenen Level)',
                check: qs => ({ current: qs.cursedUnderImmunityWon || 0, target: 10 }),
                reward: { items: ['theWitch', 'mistakeEraser6'] }
            },
            {
                id: 'witch_imm_3', labelEn: '15 cursed items under immunity (in a won level)', labelDE: '15 verfluchte Items unter Immunität (in einem gewonnenen Level)',
                check: qs => ({ current: qs.cursedUnderImmunityWon || 0, target: 15 }),
                reward: { items: ['theWitch', 'rowSolve'] }
            },
            {
                id: 'witch_imm_4', labelEn: '20 cursed items under immunity (in a won level)', labelDE: '20 verfluchte Items unter Immunität (in einem gewonnenen Level)',
                check: qs => ({ current: qs.cursedUnderImmunityWon || 0, target: 20 }),
                reward: { ptPoints: 1, items: ['theWitch', 'cursedRowCol'] }
            },
        ]
    },

    // ── 28. MINESWEEPER MIND (ADJACENCY MATRIX + LARGE GRIDS) ────────────────
    //  Theme: the adjacency matrix turns every cell into a conditional clue —
    //  master it on large grids where every number counts
    {
        id: 'minesweeper_mind',
        icon: '🧩',
        titleEn: 'Minesweeper Mind', titleDE: 'Minesweeper-Denken',
        descEn: 'The adjacency matrix turns every empty cell into a conditional clue. Solve large puzzles (200+ tiles) with the Adjacency Matrix node active.',
        descDE: 'Die Adjazenzmatrix macht jede leere Zelle zu einem bedingten Hinweis. Löse große Rätsel (200+ Felder) mit aktivem Adjazenzmatrix-Knoten.',
        milestones: [
            {
                id: 'adjmat_large_1', labelEn: '3 large grids with Adjacency Matrix', labelDE: '3 große Raster mit Adjazenzmatrix',
                check: qs => ({ current: qs.levelsLargeAdjMatrix || 0, target: 3 }),
                reward: { items: ['reveal4', 'markWrong8'] }
            },
            {
                id: 'adjmat_large_2', labelEn: '10 large grids with Adjacency Matrix', labelDE: '10 große Raster mit Adjazenzmatrix',
                check: qs => ({ current: qs.levelsLargeAdjMatrix || 0, target: 10 }),
                reward: { items: ['rowSolve', 'reveal4'] }
            },
            {
                id: 'adjmat_large_3', labelEn: '25 large grids with Adjacency Matrix', labelDE: '25 große Raster mit Adjazenzmatrix',
                check: qs => ({ current: qs.levelsLargeAdjMatrix || 0, target: 25 }),
                reward: { ptPoints: 1, items: ['rowSolve', 'colSolve'] }
            },
        ]
    },



];


// ─────────────────────────────────────────────────────────────
//  FLAT MILESTONE LOOKUP  —  O(1) access by milestone id
//  Populated once at load time.  { milestoneId → { milestone, category } }
// ─────────────────────────────────────────────────────────────

const _MILESTONE_MAP = {};

(function _buildMilestoneMap() {
    LEDGER_CATEGORIES.forEach(cat => {
        cat.milestones.forEach(ms => {
            _MILESTONE_MAP[ms.id] = { milestone: ms, category: cat };
        });
    });
})();