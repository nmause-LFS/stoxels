// ═══════════════════════════════════════════════
//  QUIZ  (quiz.js)
//  Contains the statistics quiz question bank and
//  the Moodle world-completion code definitions.
//  The quiz itself is triggered and rendered by
//  scoring.js (showQuiz / answerQuiz / finishQuiz).
//
//  HOW TO ADD A NEW QUESTION:
//    1. Add an object to QUIZ_QUESTIONS following
//       the existing format.
//    2. Always put the correct answer at index 0
//       in the opts array and set correct: 0.
//       getQuizQuestion() shuffles the options
//       before display so the correct answer won't
//       always appear first to the player.
//
//  HOW TO ADD A NEW WORLD CODE:
//    Add an object to WORLD_CODES with:
//      worldIdx — 0-based index into the WORLDS array (levels.js)
//      code     — the string players enter in Moodle
//      titleEn / titleDE — display name for the modal
// ═══════════════════════════════════════════════


// getQuizQuestion — picks a random question and shuffles its answer options.
//   Steps:
//   1. Picks a random raw question from QUIZ_QUESTIONS.
//   2. Maps each option string into an object that also carries an isCorrect
//      flag, derived from whether its original index equals raw.correct.
//   3. Shuffles the options so the correct answer appears in a random
//      position each time (preventing players from always clicking index 0).
//   4. Returns a clean object { q, opts } where opts is the shuffled array
//      of { text, isCorrect } objects.
//   Called from showQuiz() in scoring.js.
function getQuizQuestion() {
    const raw = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];

    // Use German strings when active, fall back to English if DE fields are missing
    const q = (LANG === 'de' && raw.qDE) ? raw.qDE : raw.q;
    const opts = (LANG === 'de' && raw.optsDE) ? raw.optsDE : raw.opts;

    // Attach isCorrect flag before shuffling so we don't lose track of the answer
    const optsWithIndex = opts.map((o, i) => ({
        text: o,
        isCorrect: i === raw.correct
    }));

    shuffle(optsWithIndex); // shuffle() is defined in inventory.js
    return { q, opts: optsWithIndex };
}


// ═══════════════════════════════════════════════
//  QUESTION BANK
//  Each question object has:
//    q       — the question string shown to the player
//    opts    — array of 4 answer strings
//    correct — index of the correct answer in opts
//              (ALWAYS 0 here — getQuizQuestion shuffles them at runtime)
// ═══════════════════════════════════════════════
const QUIZ_QUESTIONS = [
    {
        q: "What does the Central Limit Theorem state?",
        qDE: "Was besagt der Zentrale Grenzwertsatz?",
        opts: ["Sample means approach normality as n grows", "All distributions are normal", "The variance always equals 1", "Large samples have no skewness"],
        optsDE: ["Stichprobenmittelwerte nähern sich bei wachsendem n der Normalverteilung", "Alle Verteilungen sind normal", "Die Varianz beträgt immer 1", "Große Stichproben haben keine Schiefe"],
        correct: 0
    },
    {
        q: "Which formula gives the mean of a discrete distribution?\nE[X] = ?",
        qDE: "Welche Formel ergibt den Erwartungswert einer diskreten Verteilung?\nE[X] = ?",
        opts: ["Σ x·P(X=x)", "Σ P(X=x)", "√(Σ(xᵢ−μ)²/n)", "P(A)·P(B)"],
        optsDE: ["Σ x·P(X=x)", "Σ P(X=x)", "√(Σ(xᵢ−μ)²/n)", "P(A)·P(B)"],
        correct: 0
    },
    {
        q: "In hypothesis testing, what does a p-value < α mean?",
        qDE: "Was bedeutet ein p-Wert < α beim Hypothesentest?",
        opts: ["Reject H₀", "Accept H₀", "The test is invalid", "n is too small"],
        optsDE: ["H₀ ablehnen", "H₀ annehmen", "Der Test ist ungültig", "n ist zu klein"],
        correct: 0
    },
    {
        q: "What is the variance of a Bernoulli(p) distribution?",
        qDE: "Wie lautet die Varianz einer Bernoulli(p)-Verteilung?",
        opts: ["p(1−p)", "p²", "(1−p)²", "1/p"],
        optsDE: ["p(1−p)", "p²", "(1−p)²", "1/p"],
        correct: 0
    },
    {
        q: "What is the Bayes' theorem formula for P(A|B)?",
        qDE: "Wie lautet die Bayes-Formel für P(A|B)?",
        opts: ["P(B|A)·P(A)/P(B)", "P(A)·P(B)", "P(A∩B)/P(A)", "P(B)/P(A)"],
        optsDE: ["P(B|A)·P(A)/P(B)", "P(A)·P(B)", "P(A∩B)/P(A)", "P(B)/P(A)"],
        correct: 0
    },
    {
        q: "Which measure of central tendency is most robust to extreme outliers?",
        qDE: "Welches Lagemaß ist am robustesten gegenüber extremen Ausreißern?",
        opts: ["Median", "Mean", "Variance", "Standard Deviation"],
        optsDE: ["Median", "Mittelwert", "Varianz", "Standardabweichung"],
        correct: 0
    },
    {
        q: "If X~N(0,1), what is P(X > 0)?",
        qDE: "Wenn X~N(0,1) gilt, wie groß ist P(X > 0)?",
        opts: ["0.5", "0.25", "0.75", "1.0"],
        optsDE: ["0.5", "0.25", "0.75", "1.0"],
        correct: 0
    },
    {
        q: "The standard error of the mean equals:",
        qDE: "Der Standardfehler des Mittelwerts beträgt:",
        opts: ["σ/√n", "σ·n", "σ²/n", "σ/n"],
        optsDE: ["σ/√n", "σ·n", "σ²/n", "σ/n"],
        correct: 0
    },
    {
        q: "A correlation coefficient r = −1 means:",
        qDE: "Ein Korrelationskoeffizient r = −1 bedeutet:",
        opts: ["Perfect negative linear relationship", "No relationship", "Perfect positive relationship", "Weak negative relationship"],
        optsDE: ["Perfekter negativer linearer Zusammenhang", "Kein Zusammenhang", "Perfekter positiver Zusammenhang", "Schwacher negativer Zusammenhang"],
        correct: 0
    },
    {
        q: "In a χ² goodness-of-fit test, what are the degrees of freedom?",
        qDE: "Wie viele Freiheitsgrade hat ein χ²-Anpassungstest?",
        opts: ["k − 1 (k = number of categories)", "n − 1", "n · k", "k + 1"],
        optsDE: ["k − 1 (k = Anzahl der Kategorien)", "n − 1", "n · k", "k + 1"],
        correct: 0
    },
    {
        q: "The logit function maps probabilities to:",
        qDE: "Die Logit-Funktion bildet Wahrscheinlichkeiten ab auf:",
        opts: ["Log-odds (−∞ to +∞)", "Probabilities (0 to 1)", "Integers", "Percentiles"],
        optsDE: ["Log-Odds (−∞ bis +∞)", "Wahrscheinlichkeiten (0 bis 1)", "Ganze Zahlen", "Perzentile"],
        correct: 0
    },
    {
        q: "What does MLE stand for in statistics?",
        qDE: "Wofür steht MLE in der Statistik?",
        opts: ["Maximum Likelihood Estimation", "Mean Linear Error", "Minimum Least Estimation", "Marginal Likelihood Equation"],
        optsDE: ["Maximum-Likelihood-Schätzung", "Mittlerer linearer Fehler", "Minimale Kleinste-Schätzung", "Marginale Likelihood-Gleichung"],
        correct: 0
    },
    {
        q: "If Cov(X,Y) = 0 and X,Y are jointly normal, then:",
        qDE: "Wenn Cov(X,Y) = 0 und X,Y gemeinsam normalverteilt sind, dann:",
        opts: ["X and Y are independent", "X and Y are identical", "E[X]·E[Y]=0", "Var(X+Y)=0"],
        optsDE: ["X und Y sind unabhängig", "X und Y sind identisch", "E[X]·E[Y]=0", "Var(X+Y)=0"],
        correct: 0
    },
    {
        q: "The CDF F(x) = P(X ≤ x). What is F(+∞)?",
        qDE: "Die VKF F(x) = P(X ≤ x). Was ist F(+∞)?",
        opts: ["1", "0", "0.5", "Undefined"],
        optsDE: ["1", "0", "0.5", "Undefiniert"],
        correct: 0
    },
    {
        q: "In ANOVA, the F-ratio compares:",
        qDE: "Was vergleicht der F-Quotient in der ANOVA?",
        opts: ["Between-group variance to within-group variance", "Means to medians", "Sample size to population", "p-values to α"],
        optsDE: ["Varianz zwischen Gruppen zur Varianz innerhalb von Gruppen", "Mittelwerte mit Medianen", "Stichprobengröße mit Population", "p-Werte mit α"],
        correct: 0
    },
    {
        q: "What is the formula for sample variance?",
        qDE: "Wie lautet die Formel für die Stichprobenvarianz?",
        opts: ["Σ(xᵢ−x̄)²/(n−1)", "Σ(xᵢ−x̄)²/n", "Σxᵢ/n", "√(Σxᵢ²/n)"],
        optsDE: ["Σ(xᵢ−x̄)²/(n−1)", "Σ(xᵢ−x̄)²/n", "Σxᵢ/n", "√(Σxᵢ²/n)"],
        correct: 0
    },
];


// ═══════════════════════════════════════════════
//  MOODLE SCORE CODES
//  Codes are unlocked based on total score
//  thresholds instead of world completion.
//  The final code requires near-perfect play
//  (95% of maximum possible points).
// ═══════════════════════════════════════════════
const WORLD_CODES = [
    { threshold: 2500, code: 'STOX-2025-BRONZE', titleEn: 'Bronze Achievement', titleDE: 'Bronze-Leistung' },
    { threshold: 7500, code: 'STOX-2025-SILVER', titleEn: 'Silver Achievement', titleDE: 'Silber-Leistung' },
    { threshold: 12500, code: 'STOX-2025-GOLD', titleEn: 'Gold Achievement', titleDE: 'Gold-Leistung' },
    { threshold: 17500, code: 'STOX-2025-PLATINUM', titleEn: 'Platinum Achievement', titleDE: 'Platin-Leistung' },
    { threshold: 24000, code: 'STOX-2025-MASTER', titleEn: 'Master Achievement', titleDE: 'Meister-Leistung' },
];













