// ═══════════════════════════════════════════════
//  MATH GATE  (mathgate.js)
//  Certain levels are locked behind a short
//  calculation exercise. The student must type a
//  numeric answer (exact or within a tolerance)
//  before the level launches.
//
//  Gated levels (gi = worldIdx * 10 + levelIdx):
//    World 1: level 6  → gi  5
//    World 2: level 1  → gi 10   level 6 → gi 15
//    World 3: level 1  → gi 20   level 4 → gi 23   level 7 → gi 26
//    World 4: level 1  → gi 30   level 3 → gi 32   level 5 → gi 34
//             level 7  → gi 36   level 9 → gi 38
//    World 5: ALL      → gi 40–49
//
//  Each question pool is an array of objects:
//    { q, qDE, answer, tolerance, unit, hintEn, hintDE }
//    answer    — the correct numeric value
//    tolerance — max allowed deviation (0 = exact integer)
//    unit      — string appended after the input field (e.g. '%', 'pts')
//    hintEn/DE — shown after a wrong attempt
// ═══════════════════════════════════════════════


// ── Gated level index set ─────────────────────────────────────────────────
const MATH_GATE_GI = new Set([
    5,                          // W1-L6
    10, 15,                     // W2-L1, W2-L6
    20, 23, 26,                 // W3-L1, W3-L4, W3-L7
    30, 32, 34, 36, 38,         // W4 odd gates
    40, 41, 42, 43, 44,         // W5
    45, 46, 47, 48, 49          // W5 (continued)
]);

// isGatedLevel(gi) — returns true if this level requires a math gate.
function isGatedLevel(gi) {
    return MATH_GATE_GI.has(gi);
}

// isMathGatePassed(gi) — true if the player has already passed the gate
//   for this level in this session OR it is stored in STATE.
function isMathGatePassed(gi) {
    return STATE.mathGatePassed && STATE.mathGatePassed.includes(gi);
}


// ═══════════════════════════════════════════════
//  QUESTION POOLS  (one per world)
//  Difficulty increases across worlds:
//    World 1 — basic probability calculations
//    World 2 — set theory & simple distributions
//    World 3 — hypothesis testing & integration concepts
//    World 4 — advanced inference & regression
//    World 5 — mixed graduate-level problems
// ═══════════════════════════════════════════════

const MATH_GATE_POOLS = {

    // ── WORLD 1 ─────────────────────────────────────────────────────────
    // Basic probability: sample spaces, simple event probabilities
    1: [
        {
            q: 'A fair die is rolled once. What is the probability of rolling a 4? Enter as a fraction numerator over 6 (e.g. type 1 for 1/6).',
            qDE: 'Ein fairer Würfel wird einmal geworfen. Wie groß ist die Wahrscheinlichkeit, eine 4 zu würfeln? Gib den Zähler über 6 ein (z.B. 1 für 1/6).',
            answer: 1, tolerance: 0, unit: '/ 6',
            hintEn: 'There is exactly 1 favourable outcome out of 6 equally likely outcomes.',
            hintDE: 'Es gibt genau 1 günstiges Ergebnis von 6 gleich wahrscheinlichen Ergebnissen.'
        },
        {
            q: 'A bag has 3 red and 7 blue balls. What is the probability of drawing a red ball? Enter as a percentage (e.g. 30).',
            qDE: 'Ein Beutel enthält 3 rote und 7 blaue Bälle. Wie groß ist die Wahrscheinlichkeit, einen roten Ball zu ziehen? Gib als Prozent ein (z.B. 30).',
            answer: 30, tolerance: 0, unit: '%',
            hintEn: 'P(red) = 3 / (3+7) = 3/10 = 30%.',
            hintDE: 'P(rot) = 3 / (3+7) = 3/10 = 30 %.'
        },
        {
            q: 'P(A) = 0.4 and P(B) = 0.5. A and B are mutually exclusive. What is P(A ∪ B)? Enter as a decimal (e.g. 0.9).',
            qDE: 'P(A) = 0,4 und P(B) = 0,5. A und B sind disjunkt. Wie groß ist P(A ∪ B)? Gib als Dezimalzahl ein (z.B. 0,9).',
            answer: 0.9, tolerance: 0.001, unit: '',
            hintEn: 'For mutually exclusive events: P(A ∪ B) = P(A) + P(B).',
            hintDE: 'Für disjunkte Ereignisse: P(A ∪ B) = P(A) + P(B).'
        },
        {
            q: 'A fair coin is flipped twice. How many outcomes are in the sample space?',
            qDE: 'Eine faire Münze wird zweimal geworfen. Wie viele Ergebnisse enthält der Stichprobenraum?',
            answer: 4, tolerance: 0, unit: 'outcomes',
            hintEn: 'Each flip has 2 outcomes; total = 2 × 2 = 4.',
            hintDE: 'Jeder Wurf hat 2 Ergebnisse; insgesamt = 2 × 2 = 4.'
        },
        {
            q: 'P(A) = 0.6. What is P(Aᶜ)?',
            qDE: 'P(A) = 0,6. Wie groß ist P(Aᶜ)?',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'The complement rule: P(Aᶜ) = 1 − P(A).',
            hintDE: 'Komplementregel: P(Aᶜ) = 1 − P(A).'
        },
        {
            q: 'A card is drawn from a standard 52-card deck. How many cards are hearts?',
            qDE: 'Eine Karte wird aus einem Standarddeck mit 52 Karten gezogen. Wie viele Karten sind Herz?',
            answer: 13, tolerance: 0, unit: 'cards',
            hintEn: 'A standard deck has 4 suits of 13 cards each.',
            hintDE: 'Ein Standarddeck hat 4 Farben mit je 13 Karten.'
        },
        {
            q: 'P(A ∩ B) = 0.12 and P(B) = 0.4. What is P(A | B)?',
            qDE: 'P(A ∩ B) = 0,12 und P(B) = 0,4. Wie groß ist P(A | B)?',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'P(A|B) = P(A ∩ B) / P(B) = 0.12 / 0.4.',
            hintDE: 'P(A|B) = P(A ∩ B) / P(B) = 0,12 / 0,4.'
        },
    ],

    // ── WORLD 2 ─────────────────────────────────────────────────────────
    // Set theory, sigma-algebras, combinatorics, basic distributions
    2: [
        {
            q: 'How many subsets does a set with 4 elements have? (Include the empty set.)',
            qDE: 'Wie viele Teilmengen hat eine Menge mit 4 Elementen? (Leere Menge einschließen.)',
            answer: 16, tolerance: 0, unit: 'subsets',
            hintEn: 'A set with n elements has 2ⁿ subsets. 2⁴ = 16.',
            hintDE: 'Eine Menge mit n Elementen hat 2ⁿ Teilmengen. 2⁴ = 16.'
        },
        {
            q: 'In how many ways can you arrange the letters A, B, C in a row? (Permutations of 3)',
            qDE: 'Auf wie viele Arten kann man die Buchstaben A, B, C in einer Reihe anordnen? (Permutationen von 3)',
            answer: 6, tolerance: 0, unit: 'ways',
            hintEn: '3! = 3 × 2 × 1 = 6.',
            hintDE: '3! = 3 × 2 × 1 = 6.'
        },
        {
            q: 'X ~ Bin(5, 0.4). What is E[X]? Enter as a decimal.',
            qDE: 'X ~ Bin(5; 0,4). Wie groß ist E[X]? Als Dezimalzahl.',
            answer: 2, tolerance: 0.01, unit: '',
            hintEn: 'For Binomial: E[X] = n·p = 5 × 0.4 = 2.',
            hintDE: 'Für Binomial: E[X] = n·p = 5 × 0,4 = 2.'
        },
        {
            q: 'P(A) = 0.5, P(B) = 0.4, P(A ∩ B) = 0.2. What is P(A ∪ B)?',
            qDE: 'P(A) = 0,5, P(B) = 0,4, P(A ∩ B) = 0,2. Wie groß ist P(A ∪ B)?',
            answer: 0.7, tolerance: 0.001, unit: '',
            hintEn: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B) = 0.5 + 0.4 − 0.2.',
            hintDE: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B) = 0,5 + 0,4 − 0,2.'
        },
        {
            q: 'X ~ Bin(10, 0.3). What is Var(X)? Enter as a decimal.',
            qDE: 'X ~ Bin(10; 0,3). Wie groß ist Var(X)? Als Dezimalzahl.',
            answer: 2.1, tolerance: 0.01, unit: '',
            hintEn: 'For Binomial: Var(X) = n·p·(1−p) = 10 × 0.3 × 0.7 = 2.1.',
            hintDE: 'Für Binomial: Var(X) = n·p·(1−p) = 10 × 0,3 × 0,7 = 2,1.'
        },
        {
            q: 'In how many ways can you choose 2 items from 5 (order does not matter)? C(5,2) = ?',
            qDE: 'Auf wie viele Arten kann man 2 Elemente aus 5 wählen (Reihenfolge egal)? C(5,2) = ?',
            answer: 10, tolerance: 0, unit: '',
            hintEn: 'C(5,2) = 5! / (2! · 3!) = 10.',
            hintDE: 'C(5,2) = 5! / (2! · 3!) = 10.'
        },
        {
            q: 'A Poisson random variable has λ = 3. What is its expected value?',
            qDE: 'Eine Poisson-Zufallsvariable hat λ = 3. Wie groß ist ihr Erwartungswert?',
            answer: 3, tolerance: 0, unit: '',
            hintEn: 'For Poisson(λ): E[X] = λ.',
            hintDE: 'Für Poisson(λ): E[X] = λ.'
        },
    ],

    // ── WORLD 3 ─────────────────────────────────────────────────────────
    // Hypothesis testing, integration intuition, inference concepts
    3: [
        {
            q: 'The standard normal Z-score formula is Z = (X − μ) / σ. If X = 110, μ = 100, σ = 10, what is Z?',
            qDE: 'Die Standard-Normalwert-Formel ist Z = (X − μ) / σ. Wenn X = 110, μ = 100, σ = 10, wie groß ist Z?',
            answer: 1, tolerance: 0.01, unit: '',
            hintEn: 'Z = (110 − 100) / 10 = 10 / 10 = 1.',
            hintDE: 'Z = (110 − 100) / 10 = 10 / 10 = 1.'
        },
        {
            q: 'A sample of n=25 has a sample mean of 80 and σ=10. What is the standard error of the mean?',
            qDE: 'Eine Stichprobe mit n=25 hat ein Stichprobenmittel von 80 und σ=10. Wie groß ist der Standardfehler des Mittelwerts?',
            answer: 2, tolerance: 0.01, unit: '',
            hintEn: 'SE = σ / √n = 10 / √25 = 10 / 5 = 2.',
            hintDE: 'SE = σ / √n = 10 / √25 = 10 / 5 = 2.'
        },
        {
            q: 'For a χ² test with 5 categories, what are the degrees of freedom?',
            qDE: 'Bei einem χ²-Test mit 5 Kategorien, wie viele Freiheitsgrade gibt es?',
            answer: 4, tolerance: 0, unit: 'df',
            hintEn: 'Degrees of freedom = k − 1 = 5 − 1 = 4.',
            hintDE: 'Freiheitsgrade = k − 1 = 5 − 1 = 4.'
        },
        {
            q: 'P(A) = 0.6, P(B|A) = 0.5. What is P(A ∩ B)?',
            qDE: 'P(A) = 0,6, P(B|A) = 0,5. Wie groß ist P(A ∩ B)?',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'P(A ∩ B) = P(A) · P(B|A) = 0.6 × 0.5 = 0.3.',
            hintDE: 'P(A ∩ B) = P(A) · P(B|A) = 0,6 × 0,5 = 0,3.'
        },
        {
            q: 'A 95% confidence interval is calculated as x̄ ± 1.96 · SE. If x̄ = 50 and SE = 2, what is the upper bound?',
            qDE: 'Ein 95%-Konfidenzintervall wird als x̄ ± 1,96 · SE berechnet. Wenn x̄ = 50 und SE = 2, wie groß ist die obere Grenze?',
            answer: 53.92, tolerance: 0.05, unit: '',
            hintEn: 'Upper = 50 + 1.96 × 2 = 50 + 3.92 = 53.92.',
            hintDE: 'Obere Grenze = 50 + 1,96 × 2 = 50 + 3,92 = 53,92.'
        },
        {
            q: 'The sample variance formula divides by (n−1). For n=6, what is the denominator?',
            qDE: 'Die Stichprobenvarianz-Formel teilt durch (n−1). Für n=6, wie groß ist der Nenner?',
            answer: 5, tolerance: 0, unit: '',
            hintEn: 'n − 1 = 6 − 1 = 5.',
            hintDE: 'n − 1 = 6 − 1 = 5.'
        },
        {
            q: 'In a two-sided t-test at α = 0.05, what is the significance level for each tail? Enter as a decimal.',
            qDE: 'Bei einem zweiseitigen t-Test mit α = 0,05, wie groß ist das Signifikanzniveau für jeden Schwanz? Als Dezimalzahl.',
            answer: 0.025, tolerance: 0.0001, unit: '',
            hintEn: 'α/2 = 0.05 / 2 = 0.025.',
            hintDE: 'α/2 = 0,05 / 2 = 0,025.'
        },
    ],

    // ── WORLD 4 ─────────────────────────────────────────────────────────
    // Advanced inference: MLE, regression, ANOVA, CDF/PDF, logit
    4: [
        {
            q: 'For a normal distribution N(μ, σ²) the MLE of μ is the sample mean. For data {2, 4, 6, 8}, what is the MLE of μ?',
            qDE: 'Für eine Normalverteilung N(μ, σ²) ist der MLE von μ der Stichprobenmittelwert. Für die Daten {2, 4, 6, 8}, wie groß ist der MLE von μ?',
            answer: 5, tolerance: 0.01, unit: '',
            hintEn: 'x̄ = (2+4+6+8)/4 = 20/4 = 5.',
            hintDE: 'x̄ = (2+4+6+8)/4 = 20/4 = 5.'
        },
        {
            q: 'R² = 0.81 for a linear regression. What percentage of variance is explained by the model? Enter as a whole number.',
            qDE: 'R² = 0,81 für eine lineare Regression. Wie viel Prozent der Varianz wird durch das Modell erklärt? Als ganze Zahl.',
            answer: 81, tolerance: 0, unit: '%',
            hintEn: 'R² directly gives the proportion of explained variance: 0.81 = 81%.',
            hintDE: 'R² gibt direkt den Anteil der erklärten Varianz an: 0,81 = 81 %.'
        },
        {
            q: 'logit(p) = log(p / (1−p)). What is logit(0.5)? Enter as a decimal.',
            qDE: 'logit(p) = log(p / (1−p)). Wie groß ist logit(0,5)? Als Dezimalzahl.',
            answer: 0, tolerance: 0.001, unit: '',
            hintEn: 'logit(0.5) = log(0.5/0.5) = log(1) = 0.',
            hintDE: 'logit(0,5) = log(0,5/0,5) = log(1) = 0.'
        },
        {
            q: 'In ANOVA with 3 groups of 10 observations each (N=30), what are the between-group degrees of freedom?',
            qDE: 'Bei einer ANOVA mit 3 Gruppen à 10 Beobachtungen (N=30), wie viele Freiheitsgrade liegen zwischen den Gruppen?',
            answer: 2, tolerance: 0, unit: 'df',
            hintEn: 'Between-group df = k − 1 = 3 − 1 = 2.',
            hintDE: 'Zwischen-Gruppen-Freiheitsgrade = k − 1 = 3 − 1 = 2.'
        },
        {
            q: 'If the F-statistic is 4.0 and the critical value at α=0.05 is 3.5, do you reject H₀? Enter 1 for yes, 0 for no.',
            qDE: 'Wenn die F-Statistik 4,0 beträgt und der kritische Wert bei α=0,05 gleich 3,5 ist, wird H₀ abgelehnt? 1 für Ja, 0 für Nein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'F > critical value → reject H₀.',
            hintDE: 'F > kritischer Wert → H₀ ablehnen.'
        },
        {
            q: 'A confidence interval for μ is [46.1, 53.9]. What is the sample mean (midpoint)?',
            qDE: 'Ein Konfidenzintervall für μ ist [46,1; 53,9]. Wie groß ist der Stichprobenmittelwert (Mittelpunkt)?',
            answer: 50, tolerance: 0.01, unit: '',
            hintEn: 'Midpoint = (46.1 + 53.9) / 2 = 100 / 2 = 50.',
            hintDE: 'Mittelpunkt = (46,1 + 53,9) / 2 = 100 / 2 = 50.'
        },
        {
            q: 'Cov(X,Y) = 6, Var(X) = 9, Var(Y) = 16. What is the correlation coefficient r? Round to 2 decimal places.',
            qDE: 'Cov(X,Y) = 6, Var(X) = 9, Var(Y) = 16. Wie groß ist der Korrelationskoeffizient r? Auf 2 Dezimalstellen gerundet.',
            answer: 0.5, tolerance: 0.01, unit: '',
            hintEn: 'r = Cov(X,Y) / (σX · σY) = 6 / (3 × 4) = 6/12 = 0.5.',
            hintDE: 'r = Cov(X,Y) / (σX · σY) = 6 / (3 × 4) = 6/12 = 0,5.'
        },
    ],

    // ── WORLD 5 ─────────────────────────────────────────────────────────
    // Mixed graduate-level: conditioning, variance identities, multivariate
    5: [
        {
            q: 'Var(2X) = ? if Var(X) = 9. Enter the numeric value.',
            qDE: 'Var(2X) = ? wenn Var(X) = 9. Gib den numerischen Wert ein.',
            answer: 36, tolerance: 0, unit: '',
            hintEn: 'Var(aX) = a² · Var(X) = 4 × 9 = 36.',
            hintDE: 'Var(aX) = a² · Var(X) = 4 × 9 = 36.'
        },
        {
            q: 'E[X²] = 10 and E[X] = 2. What is Var(X)? (Use Var(X) = E[X²] − (E[X])²)',
            qDE: 'E[X²] = 10 und E[X] = 2. Wie groß ist Var(X)? (Var(X) = E[X²] − (E[X])²)',
            answer: 6, tolerance: 0.01, unit: '',
            hintEn: 'Var(X) = 10 − 2² = 10 − 4 = 6.',
            hintDE: 'Var(X) = 10 − 2² = 10 − 4 = 6.'
        },
        {
            q: 'P(A|B) = 0.4, P(B) = 0.5, P(A) = 0.3. What is P(B|A)? Use Bayes. Round to 2 decimal places.',
            qDE: 'P(A|B) = 0,4, P(B) = 0,5, P(A) = 0,3. Wie groß ist P(B|A)? Bayesregel. Auf 2 Dezimalstellen.',
            answer: 0.67, tolerance: 0.01, unit: '',
            hintEn: 'P(B|A) = P(A|B)·P(B)/P(A) = (0.4 × 0.5)/0.3 = 0.2/0.3 ≈ 0.67.',
            hintDE: 'P(B|A) = P(A|B)·P(B)/P(A) = (0,4 × 0,5)/0,3 = 0,2/0,3 ≈ 0,67.'
        },
        {
            q: 'X and Y are independent with E[X]=3 and E[Y]=4. What is E[X·Y]?',
            qDE: 'X und Y sind unabhängig mit E[X]=3 und E[Y]=4. Wie groß ist E[X·Y]?',
            answer: 12, tolerance: 0, unit: '',
            hintEn: 'For independent RVs: E[XY] = E[X]·E[Y] = 3 × 4 = 12.',
            hintDE: 'Für unabhängige ZVs: E[XY] = E[X]·E[Y] = 3 × 4 = 12.'
        },
        {
            q: 'What is the variance of a standard normal distribution N(0,1)?',
            qDE: 'Wie groß ist die Varianz der Standardnormalverteilung N(0,1)?',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'By definition, N(0,1) has mean 0 and variance 1.',
            hintDE: 'Per Definition hat N(0,1) Mittelwert 0 und Varianz 1.'
        },
        {
            q: 'MSE = Bias² + Variance. If Bias = 2 and Variance = 3, what is the MSE?',
            qDE: 'MSE = Bias² + Varianz. Wenn Bias = 2 und Varianz = 3, wie groß ist der MSE?',
            answer: 7, tolerance: 0, unit: '',
            hintEn: 'MSE = 2² + 3 = 4 + 3 = 7.',
            hintDE: 'MSE = 2² + 3 = 4 + 3 = 7.'
        },
        {
            q: 'For a Poisson process with rate λ=2 per hour, what is the expected number of events in 3 hours?',
            qDE: 'Für einen Poisson-Prozess mit Rate λ=2 pro Stunde, wie viele Ereignisse werden in 3 Stunden erwartet?',
            answer: 6, tolerance: 0, unit: 'events',
            hintEn: 'E[events] = λ · t = 2 × 3 = 6.',
            hintDE: 'E[Ereignisse] = λ · t = 2 × 3 = 6.'
        },
        {
            q: 'The law of total expectation: E[X] = E[E[X|Y]]. If E[X|Y=0]=2 and E[X|Y=1]=8 and P(Y=1)=0.5, what is E[X]?',
            qDE: 'Das Gesetz der totalen Erwartung: E[X] = E[E[X|Y]]. Wenn E[X|Y=0]=2, E[X|Y=1]=8 und P(Y=1)=0,5, wie groß ist E[X]?',
            answer: 5, tolerance: 0.01, unit: '',
            hintEn: 'E[X] = 2×0.5 + 8×0.5 = 1 + 4 = 5.',
            hintDE: 'E[X] = 2×0,5 + 8×0,5 = 1 + 4 = 5.'
        },
    ],
};

// worldOfGi(gi) — returns which world pool (1-5) to use for this gi.
function worldOfGi(gi) {
    for (let wi = WORLDS.length - 1; wi >= 0; wi--) {
        if (gi >= WORLD_START_GI[wi]) return wi + 1;
    }
    return 1;
}

// pendingGateGi — the gi waiting to be launched after a correct answer
let pendingGateGi = null;
// currentGateQuestion — the question object currently shown
let currentGateQuestion = null;
// gateAttempts — number of wrong tries on the current question
let gateAttempts = 0;


// ═══════════════════════════════════════════════
//  PUBLIC ENTRY POINT
// ═══════════════════════════════════════════════

// tryStartGatedLevel(gi) — called by startLevel() instead of launching
//   directly. If the gate is already passed (or not gated), launches
//   immediately. Otherwise shows the math gate modal.
function tryStartGatedLevel(gi, launchFn) {
    if (!isGatedLevel(gi) || isMathGatePassed(gi)) {
        launchFn();
        return;
    }
    pendingGateGi = gi;
    showMathGate(gi, launchFn);
}


// ═══════════════════════════════════════════════
//  MODAL SHOW / HIDE
// ═══════════════════════════════════════════════

function showMathGate(gi, launchFn) {
    const world = worldOfGi(gi);
    const pool = MATH_GATE_POOLS[world] || MATH_GATE_POOLS[1];
    // Pick a random question each time (repeatable, different questions possible)
    currentGateQuestion = pool[Math.floor(Math.random() * pool.length)];
    gateAttempts = 0;

    const q = (LANG === 'de' && currentGateQuestion.qDE)
        ? currentGateQuestion.qDE
        : currentGateQuestion.q;

    // Populate modal
    document.getElementById('mg-world-badge').textContent =
        `🔐 ${LANG === 'de' ? 'WELT' : 'WORLD'} ${world} — ${t('mg_gate_badge')}`;
    document.getElementById('mg-question').textContent = q;
    document.getElementById('mg-answer-input').value = '';
    document.getElementById('mg-feedback').textContent = '';
    document.getElementById('mg-feedback').className = 'mg-feedback';
    document.getElementById('mg-hint-box').style.display = 'none';
    document.getElementById('mg-hint-text').textContent = '';
    document.getElementById('mg-submit-btn').disabled = false;

    // Store launch callback on the modal so submit can call it
    document.getElementById('mg-modal').dataset.launchGi = gi;

    // Show the unit label
    const unitEl = document.getElementById('mg-unit');
    unitEl.textContent = currentGateQuestion.unit || '';
    unitEl.style.display = currentGateQuestion.unit ? 'inline' : 'none';

    showModal('mg-modal');

    // Focus the input after a short delay (modal animation)
    setTimeout(() => {
        const inp = document.getElementById('mg-answer-input');
        if (inp) inp.focus();
    }, 120);
}

function hideMathGate() {
    hideModal('mg-modal');
    currentGateQuestion = null;
    pendingGateGi = null;
}


// ═══════════════════════════════════════════════
//  ANSWER CHECKING
// ═══════════════════════════════════════════════

// submitMathGate — reads the player's input and checks it.
//   Accepts both '.' and ',' as decimal separator.
//   On correct: marks gate as passed, hides modal, launches level.
//   On wrong:   increments attempts, shows feedback + hint after 2 tries.
function submitMathGate() {
    if (!currentGateQuestion) return;

    const raw = document.getElementById('mg-answer-input').value
        .trim()
        .replace(',', '.'); // allow European decimal comma
    const entered = parseFloat(raw);

    if (isNaN(entered)) {
        showMgFeedback(t('mg_not_a_number'), false);
        return;
    }

    const diff = Math.abs(entered - currentGateQuestion.answer);
    const correct = diff <= currentGateQuestion.tolerance;

    if (correct) {
        // Mark gate as passed persistently
        if (!STATE.mathGatePassed) STATE.mathGatePassed = [];
        if (!STATE.mathGatePassed.includes(pendingGateGi)) {
            STATE.mathGatePassed.push(pendingGateGi);
            save();
        }
        showMgFeedback(t('mg_correct'), true);
        document.getElementById('mg-submit-btn').disabled = true;
        // Brief celebration then launch
        const giToLaunch = pendingGateGi; // capture before hideMathGate() nulls it
        setTimeout(() => {
            hideMathGate();
            startLevel(giToLaunch);
        }, 900);
    } else {
        gateAttempts++;
        showMgFeedback(t('mg_wrong').replace('{n}', gateAttempts), false);

        // After 2 wrong attempts show the hint
        if (gateAttempts >= 2) {
            const hint = (LANG === 'de' && currentGateQuestion.hintDE)
                ? currentGateQuestion.hintDE
                : currentGateQuestion.hintEn;
            document.getElementById('mg-hint-text').textContent = '💡 ' + hint;
            document.getElementById('mg-hint-box').style.display = 'block';
        }

        // Let them try a new question after 3 failed attempts
        if (gateAttempts >= 3) {
            document.getElementById('mg-new-q-btn').style.display = 'inline-block';
        }
    }
}

function showMgFeedback(msg, ok) {
    const el = document.getElementById('mg-feedback');
    el.textContent = msg;
    el.className = 'mg-feedback ' + (ok ? 'mg-ok' : 'mg-bad');
}

// mgNewQuestion — draws a different question from the pool (available after 3 fails)
function mgNewQuestion() {
    const world = worldOfGi(pendingGateGi);
    const pool = MATH_GATE_POOLS[world] || MATH_GATE_POOLS[1];
    // Pick a different question than the current one
    let newQ;
    do {
        newQ = pool[Math.floor(Math.random() * pool.length)];
    } while (newQ === currentGateQuestion && pool.length > 1);
    currentGateQuestion = newQ;
    gateAttempts = 0;

    const q = (LANG === 'de' && currentGateQuestion.qDE)
        ? currentGateQuestion.qDE
        : currentGateQuestion.q;

    document.getElementById('mg-question').textContent = q;
    document.getElementById('mg-answer-input').value = '';
    document.getElementById('mg-feedback').textContent = '';
    document.getElementById('mg-feedback').className = 'mg-feedback';
    document.getElementById('mg-hint-box').style.display = 'none';
    document.getElementById('mg-hint-text').textContent = '';
    document.getElementById('mg-new-q-btn').style.display = 'none';
    document.getElementById('mg-submit-btn').disabled = false;

    const unitEl = document.getElementById('mg-unit');
    unitEl.textContent = currentGateQuestion.unit || '';
    unitEl.style.display = currentGateQuestion.unit ? 'inline' : 'none';

    document.getElementById('mg-answer-input').focus();
}

// Allow pressing Enter in the input field to submit
document.addEventListener('DOMContentLoaded', () => {
    const inp = document.getElementById('mg-answer-input');
    if (inp) {
        inp.addEventListener('keydown', e => {
            if (e.key === 'Enter') submitMathGate();
        });
    }
});