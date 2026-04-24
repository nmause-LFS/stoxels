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

    // Attach isCorrect flag before shuffling so we don't lose track of the answer
    const optsWithIndex = raw.opts.map((o, i) => ({
        text: o,
        isCorrect: i === raw.correct
    }));

    shuffle(optsWithIndex); // shuffle() is defined in inventory.js
    return { q: raw.q, opts: optsWithIndex };
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
        opts: ["Sample means approach normality as n grows", "All distributions are normal", "The variance always equals 1", "Large samples have no skewness"],
        correct: 0
    },
    {
        q: "Which formula gives the mean of a discrete distribution?\nE[X] = ?",
        opts: ["Σ x·P(X=x)", "Σ P(X=x)", "√(Σ(xᵢ−μ)²/n)", "P(A)·P(B)"],
        correct: 0
    },
    {
        q: "In hypothesis testing, what does a p-value < α mean?",
        opts: ["Reject H₀", "Accept H₀", "The test is invalid", "n is too small"],
        correct: 0
    },
    {
        q: "What is the variance of a Bernoulli(p) distribution?",
        opts: ["p(1−p)", "p²", "(1−p)²", "1/p"],
        correct: 0
    },
    {
        q: "What is the Bayes' theorem formula for P(A|B)?",
        opts: ["P(B|A)·P(A)/P(B)", "P(A)·P(B)", "P(A∩B)/P(A)", "P(B)/P(A)"],
        correct: 0
    },
    {
        q: "Which measure of central tendency is most robust to extreme outliers?",
        opts: ["Median", "Mean", "Variance", "Standard Deviation"],
        correct: 0
    },
    {
        q: "If X~N(0,1), what is P(X > 0)?",
        opts: ["0.5", "0.25", "0.75", "1.0"],
        correct: 0
    },
    {
        q: "The standard error of the mean equals:",
        opts: ["σ/√n", "σ·n", "σ²/n", "σ/n"],
        correct: 0
    },
    {
        q: "A correlation coefficient r = −1 means:",
        opts: ["Perfect negative linear relationship", "No relationship", "Perfect positive relationship", "Weak negative relationship"],
        correct: 0
    },
    {
        q: "In a χ² goodness-of-fit test, what are the degrees of freedom?",
        opts: ["k − 1 (k = number of categories)", "n − 1", "n · k", "k + 1"],
        correct: 0
    },
    {
        q: "The logit function maps probabilities to:",
        opts: ["Log-odds (−∞ to +∞)", "Probabilities (0 to 1)", "Integers", "Percentiles"],
        correct: 0
    },
    {
        q: "What does MLE stand for in statistics?",
        opts: ["Maximum Likelihood Estimation", "Mean Linear Error", "Minimum Least Estimation", "Marginal Likelihood Equation"],
        correct: 0
    },
    {
        q: "If Cov(X,Y) = 0 and X,Y are jointly normal, then:",
        opts: ["X and Y are independent", "X and Y are identical", "E[X]·E[Y]=0", "Var(X+Y)=0"],
        correct: 0
    },
    {
        q: "The CDF F(x) = P(X ≤ x). What is F(+∞)?",
        opts: ["1", "0", "0.5", "Undefined"],
        correct: 0
    },
    {
        q: "In ANOVA, the F-ratio compares:",
        opts: ["Between-group variance to within-group variance", "Means to medians", "Sample size to population", "p-values to α"],
        correct: 0
    },
    {
        q: "What is the formula for sample variance?",
        opts: ["Σ(xᵢ−x̄)²/(n−1)", "Σ(xᵢ−x̄)²/n", "Σxᵢ/n", "√(Σxᵢ²/n)"],
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













