// ═══════════════════════════════════════════════
//  getQuizQuestion(worldNum)
//
//  Draws ONE question from a combined pool of:
//    1. QUIZ_QUESTIONS          — global multiple-choice questions (all worlds)
//    2. BONUS_QUIZ_POOLS[world] — world-specific multiple-choice questions
//    3. MATH_GATE_POOLS[world]  — world-specific numeric-input questions
//
//  Returns one of two shapes:
//    { type: 'mc',    q, opts }              — multiple choice
//    { type: 'input', q, answer, tolerance, unit, hintEn, hintDE }  — text input
// ═══════════════════════════════════════════════
function getQuizQuestion(worldNum) {
    const pool = [];

    // 1. Global MC questions
    QUIZ_QUESTIONS.forEach(raw => pool.push({ _src: 'mc_global', raw }));

    // 2. World-specific MC questions
    if (worldNum && BONUS_QUIZ_POOLS[worldNum]) {
        BONUS_QUIZ_POOLS[worldNum].forEach(raw => pool.push({ _src: 'mc_world', raw }));
    }

    // 3. World-specific input questions (from math gate pool)
    if (worldNum && MATH_GATE_POOLS[worldNum]) {
        MATH_GATE_POOLS[worldNum].forEach(raw => pool.push({ _src: 'input', raw }));
    }

    if (!pool.length) {
        // Absolute fallback — should never happen
        return { type: 'mc', q: '?', opts: [{ text: '?', isCorrect: true }] };
    }

    const entry = pool[Math.floor(Math.random() * pool.length)];

    // ── Input question ────────────────────────────────────────────────────
    if (entry._src === 'input') {
        const raw = entry.raw;
        return {
            type: 'input',
            q: (LANG === 'de' && raw.qDE) ? raw.qDE : raw.q,
            answer: raw.answer,
            tolerance: raw.tolerance ?? 0,
            unit: raw.unit || '',
            hintEn: raw.hintEn || '',
            hintDE: raw.hintDE || '',
        };
    }

    // ── Multiple-choice question ──────────────────────────────────────────
    const raw = entry.raw;
    const q = (LANG === 'de' && raw.qDE) ? raw.qDE : raw.q;
    const opts = (LANG === 'de' && raw.optsDE) ? raw.optsDE : raw.opts;
    const optsWithFlag = opts.map((o, i) => ({ text: o, isCorrect: i === raw.correct }));
    shuffle(optsWithFlag);
    return { type: 'mc', q, opts: optsWithFlag };
}


// ═══════════════════════════════════════════════
//  GLOBAL MULTIPLE-CHOICE QUESTION BANK
//  These questions appear as bonus quiz questions
//  in ANY world (drawn together with world-specific
//  pools). Add purely conceptual / definition
//  questions here that fit all worlds.
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
        q: "If X~N(0,1), what is P(X > 0)?",
        qDE: "Wenn X~N(0,1) gilt, wie groß ist P(X > 0)?",
        opts: ["0.5", "0.25", "0.75", "1.0"],
        optsDE: ["0.5", "0.25", "0.75", "1.0"],
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
];


// ═══════════════════════════════════════════════
//  WORLD-SPECIFIC MULTIPLE-CHOICE BONUS QUIZ POOLS
//  Each key is a world number (1-based).
//  Questions here are drawn only when the player
//  is in that world. Keep topic-specific questions
//  here (e.g. World 1 = basic probability).
//
//  FORMAT per question:
//    q       — English question text
//    qDE     — German question text
//    opts    — array of 4 answer strings (English)
//    optsDE  — array of 4 answer strings (German)
//    correct — index (0-based) of the correct option
// ═══════════════════════════════════════════════
const BONUS_QUIZ_POOLS = {

    // ── WORLD 1 — Basic Probability ───────────────────────────────────────
    // Topics: sample spaces, events, power sets, mutually exclusive events,
    //         complement, De Morgan, intersection/union, probability measure

    1: [
        {
            q: "What does the sample space Ω represent?",
            qDE: "Was repräsentiert die Ergebnismenge Ω?",
            opts: ["All possible outcomes of an experiment", "Only the likely outcomes", "The set of impossible events", "A single random outcome"],
            optsDE: ["Alle möglichen Ergebnisse eines Experiments", "Nur die wahrscheinlichen Ergebnisse", "Die Menge der unmöglichen Ereignisse", "Ein einzelnes zufälliges Ergebnis"],
            correct: 0
        },
        {
            q: "The complement of event A (written Aᶜ) contains:",
            qDE: "Das Komplement des Ereignisses A (Aᶜ) enthält:",
            opts: ["All outcomes NOT in A", "All outcomes in A", "Only impossible outcomes", "The intersection of A with Ω"],
            optsDE: ["Alle Ergebnisse, die NICHT in A liegen", "Alle Ergebnisse in A", "Nur unmögliche Ergebnisse", "Den Schnitt von A mit Ω"],
            correct: 0
        },
        {
            q: "If A and B are disjoint (mutually exclusive), then P(A ∩ B) equals:",
            qDE: "Wenn A und B disjunkt sind, gilt P(A ∩ B) =",
            opts: ["0", "P(A) + P(B)", "P(A) · P(B)", "1"],
            optsDE: ["0", "P(A) + P(B)", "P(A) · P(B)", "1"],
            correct: 0
        },
        {
            q: "De Morgan's first law states that (A ∪ B)ᶜ equals:",
            qDE: "Die erste De-Morgan-Regel besagt, dass (A ∪ B)ᶜ gleich ist:",
            opts: ["Aᶜ ∩ Bᶜ", "Aᶜ ∪ Bᶜ", "A ∩ B", "A ∪ B"],
            optsDE: ["Aᶜ ∩ Bᶜ", "Aᶜ ∪ Bᶜ", "A ∩ B", "A ∪ B"],
            correct: 0
        },
        {
            q: "A probability measure P must satisfy P(Ω) =",
            qDE: "Ein Wahrscheinlichkeitsmaß P muss P(Ω) = erfüllen:",
            opts: ["1", "0", "0.5", "Any positive number"],
            optsDE: ["1", "0", "0.5", "Eine beliebige positive Zahl"],
            correct: 0
        },
        {
            q: "Which of these CANNOT be a valid probability value?",
            qDE: "Welcher dieser Werte kann KEINE gültige Wahrscheinlichkeit sein?",
            opts: ["−0.1", "0", "0.5", "1"],
            optsDE: ["−0,1", "0", "0,5", "1"],
            correct: 0
        },
        {
            q: "The smallest possible σ-algebra on any non-empty Ω is:",
            qDE: "Die kleinste mögliche σ-Algebra auf einem nicht-leeren Ω ist:",
            opts: ["{∅, Ω}", "The full power set of Ω", "{Ω}", "{∅}"],
            optsDE: ["{∅, Ω}", "Die volle Potenzmenge von Ω", "{Ω}", "{∅}"],
            correct: 0
        },
        {
            q: "The inclusion-exclusion formula for P(A ∪ B) is:",
            qDE: "Die Siebformel für P(A ∪ B) lautet:",
            opts: ["P(A) + P(B) − P(A ∩ B)", "P(A) + P(B) + P(A ∩ B)", "P(A) · P(B)", "P(A) − P(B)"],
            optsDE: ["P(A) + P(B) − P(A ∩ B)", "P(A) + P(B) + P(A ∩ B)", "P(A) · P(B)", "P(A) − P(B)"],
            correct: 0
        },

        {
            q: "Two fair dice are rolled. How many outcomes are in the sample space Ω?",
            qDE: "Zwei faire Würfel werden geworfen. Wie viele Ergebnisse hat die Ergebnismenge Ω?",
            opts: ["36", "12", "6", "18"],
            optsDE: ["36", "12", "6", "18"],
            correct: 0
        },
        {
            q: "A set Ω has 4 elements. How many subsets does its power set Pot(Ω) contain?",
            qDE: "Eine Menge Ω hat 4 Elemente. Wie viele Teilmengen enthält die Potenzmenge Pot(Ω)?",
            opts: ["16", "8", "4", "12"],
            optsDE: ["16", "8", "4", "12"],
            correct: 0
        },
        {
            q: "Which of the following is always true for any event A?",
            qDE: "Welche Aussage gilt immer für ein beliebiges Ereignis A?",
            opts: ["P(A) + P(Aᶜ) = 1", "P(A) = P(Aᶜ)", "P(A) · P(Aᶜ) = 1", "P(A) − P(Aᶜ) = 0"],
            optsDE: ["P(A) + P(Aᶜ) = 1", "P(A) = P(Aᶜ)", "P(A) · P(Aᶜ) = 1", "P(A) − P(Aᶜ) = 0"],
            correct: 0
        },
        {
            q: "De Morgan's second law states that (A ∩ B)ᶜ equals:",
            qDE: "Die zweite De-Morgan-Regel besagt, dass (A ∩ B)ᶜ gleich ist:",
            opts: ["Aᶜ ∪ Bᶜ", "Aᶜ ∩ Bᶜ", "A ∪ B", "A ∩ B"],
            optsDE: ["Aᶜ ∪ Bᶜ", "Aᶜ ∩ Bᶜ", "A ∪ B", "A ∩ B"],
            correct: 0
        },
        {
            q: "In a Laplace experiment, all elementary events have:",
            qDE: "In einem Laplace-Experiment haben alle Elementarereignisse:",
            opts: ["Equal probability", "Probability 0", "Probability 1", "Different probabilities"],
            optsDE: ["Gleiche Wahrscheinlichkeit", "Wahrscheinlichkeit 0", "Wahrscheinlichkeit 1", "Unterschiedliche Wahrscheinlichkeiten"],
            correct: 0
        },
        {
            q: "Events A and B are mutually exclusive. P(A) = 0.3. What can you say about P(A ∪ B)?",
            qDE: "Die Ereignisse A und B sind disjunkt. P(A) = 0,3. Was gilt für P(A ∪ B)?",
            opts: ["P(A ∪ B) = P(A) + P(B)", "P(A ∪ B) = P(A) · P(B)", "P(A ∪ B) = P(A) − P(B)", "P(A ∪ B) = P(A ∩ B)"],
            optsDE: ["P(A ∪ B) = P(A) + P(B)", "P(A ∪ B) = P(A) · P(B)", "P(A ∪ B) = P(A) − P(B)", "P(A ∪ B) = P(A ∩ B)"],
            correct: 0
        },
        {
            q: "The impossible event ∅ has probability:",
            qDE: "Das unmögliche Ereignis ∅ hat die Wahrscheinlichkeit:",
            opts: ["0", "1", "0.5", "Undefined"],
            optsDE: ["0", "1", "0,5", "Undefiniert"],
            correct: 0
        },
        {
            q: "Which Kolmogorov axiom states that probabilities are non-negative?",
            qDE: "Welches Kolmogorov-Axiom besagt, dass Wahrscheinlichkeiten nicht-negativ sind?",
            opts: ["First axiom: P(A) ≥ 0 for all A", "Second axiom: P(Ω) = 1", "Third axiom: σ-additivity", "There is no such axiom"],
            optsDE: ["Erstes Axiom: P(A) ≥ 0 für alle A", "Zweites Axiom: P(Ω) = 1", "Drittes Axiom: σ-Additivität", "Es gibt kein solches Axiom"],
            correct: 0
        },
        {
            q: "A coin is flipped twice. How many elementary events are in the sample space?",
            qDE: "Eine Münze wird zweimal geworfen. Wie viele Elementarereignisse hat die Ergebnismenge?",
            opts: ["4", "2", "8", "6"],
            optsDE: ["4", "2", "8", "6"],
            correct: 0
        },
        {
            q: "P(A) = 0.4, P(B) = 0.5, P(A ∩ B) = 0.2. What is P(A ∪ B)?",
            qDE: "P(A) = 0,4, P(B) = 0,5, P(A ∩ B) = 0,2. Wie groß ist P(A ∪ B)?",
            opts: ["0.7", "0.9", "0.2", "0.45"],
            optsDE: ["0,7", "0,9", "0,2", "0,45"],
            correct: 0
        },






    ],

    // ── WORLD 2 — Combinatorics & Distributions ───────────────────────────
    // Topics: Laplace probability, combinatorics (ordered/unordered, with/without
    //         replacement), inclusion-exclusion for 3 sets, σ-algebra, binomial coefficient

    2: [
        {
            q: "In a Laplace space with |Ω| equally likely outcomes, P(A) equals:",
            qDE: "In einem Laplace-Raum mit |Ω| gleich wahrscheinlichen Ergebnissen gilt P(A) =",
            opts: ["|A| / |Ω|", "|Ω| / |A|", "|A| · |Ω|", "1 / |A|"],
            optsDE: ["|A| / |Ω|", "|Ω| / |A|", "|A| · |Ω|", "1 / |A|"],
            correct: 0
        },
        {
            q: "Drawing WITHOUT replacement means:",
            qDE: "Ziehen OHNE Zurücklegen bedeutet:",
            opts: ["Each element can only be drawn once", "Elements can be drawn multiple times", "The order does not matter", "The sample space is infinite"],
            optsDE: ["Jedes Element kann nur einmal gezogen werden", "Elemente können mehrfach gezogen werden", "Die Reihenfolge spielt keine Rolle", "Die Ergebnismenge ist unendlich"],
            correct: 0
        },
        {
            q: "The union bound (Boolesche Ungleichung) states P(A ∪ B) ≤",
            qDE: "Die Boolesche Ungleichung besagt P(A ∪ B) ≤",
            opts: ["P(A) + P(B)", "P(A) · P(B)", "P(A) − P(B)", "min(P(A), P(B))"],
            optsDE: ["P(A) + P(B)", "P(A) · P(B)", "P(A) − P(B)", "min(P(A), P(B))"],
            correct: 0
        },
        {
            q: "The number of ordered draws of k items from n WITHOUT replacement is:",
            qDE: "Die Anzahl geordneter Züge von k Elementen aus n OHNE Zurücklegen ist:",
            opts: ["n! / (n−k)!", "n! / k!", "nᵏ", "C(n,k)"],
            optsDE: ["n! / (n−k)!", "n! / k!", "nᵏ", "C(n,k)"],
            correct: 0
        },
        {
            q: "The odds in favour of event A with P(A) = p are defined as:",
            qDE: "Die Chance (Odds) für Ereignis A mit P(A) = p sind definiert als:",
            opts: ["p / (1−p)", "(1−p) / p", "p · (1−p)", "1 / p"],
            optsDE: ["p / (1−p)", "(1−p) / p", "p · (1−p)", "1 / p"],
            correct: 0
        },
        {
            q: "In a Laplace space, if every elementary event has probability 1/8, how many outcomes does Ω contain?",
            qDE: "In einem Laplace-Raum hat jedes Elementarereignis die Wahrscheinlichkeit 1/8. Wie viele Ergebnisse enthält Ω?",
            opts: ["8", "4", "16", "2"],
            optsDE: ["8", "4", "16", "2"],
            correct: 0
        },
        {
            q: "With replacement, order matters: drawing k items from n gives how many outcomes?",
            qDE: "Mit Zurücklegen, Reihenfolge zählt: k Züge aus n ergeben wie viele Ergebnisse?",
            opts: ["nᵏ", "n! / (n−k)!", "C(n,k)", "k!"],
            optsDE: ["nᵏ", "n! / (n−k)!", "C(n,k)", "k!"],
            correct: 0
        },
        {
            q: "A σ-algebra must be closed under which operations?",
            qDE: "Eine σ-Algebra muss abgeschlossen sein unter welchen Operationen?",
            opts: ["Complement and countable union", "Only intersection", "Only complement", "Complement and finite intersection"],
            optsDE: ["Komplement und abzählbare Vereinigung", "Nur Schnitt", "Nur Komplement", "Komplement und endlichem Schnitt"],
            correct: 0
        },

        {
            q: "The binomial coefficient C(n, k) counts the number of ways to choose k items from n where:",
            qDE: "Der Binomialkoeffizient C(n, k) zählt die Möglichkeiten, k Elemente aus n zu wählen, wobei:",
            opts: ["Order does NOT matter and draws are without replacement", "Order matters and draws are with replacement", "Order matters and draws are without replacement", "Order does NOT matter and draws are with replacement"],
            optsDE: ["Reihenfolge KEINE Rolle spielt und ohne Zurücklegen gezogen wird", "Reihenfolge zählt und mit Zurücklegen gezogen wird", "Reihenfolge zählt und ohne Zurücklegen gezogen wird", "Reihenfolge KEINE Rolle spielt und mit Zurücklegen gezogen wird"],
            correct: 0
        },
        {
            q: "How many ways are there to arrange all 5 elements of a set in a row (permutations)?",
            qDE: "Auf wie viele Arten lassen sich alle 5 Elemente einer Menge in einer Reihe anordnen (Permutationen)?",
            opts: ["120", "25", "5", "60"],
            optsDE: ["120", "25", "5", "60"],
            correct: 0
        },
        {
            q: "Boole's inequality (union bound) states that for any events A₁, …, Aₙ:",
            qDE: "Die Boolesche Ungleichung besagt, dass für beliebige Ereignisse A₁, …, Aₙ gilt:",
            opts: ["P(A₁ ∪ … ∪ Aₙ) ≤ P(A₁) + … + P(Aₙ)", "P(A₁ ∪ … ∪ Aₙ) = P(A₁) + … + P(Aₙ)", "P(A₁ ∩ … ∩ Aₙ) ≤ P(A₁) + … + P(Aₙ)", "P(A₁ ∪ … ∪ Aₙ) ≥ P(A₁) + … + P(Aₙ)"],
            optsDE: ["P(A₁ ∪ … ∪ Aₙ) ≤ P(A₁) + … + P(Aₙ)", "P(A₁ ∪ … ∪ Aₙ) = P(A₁) + … + P(Aₙ)", "P(A₁ ∩ … ∩ Aₙ) ≤ P(A₁) + … + P(Aₙ)", "P(A₁ ∪ … ∪ Aₙ) ≥ P(A₁) + … + P(Aₙ)"],
            correct: 0
        },
        {
            q: "For the inclusion-exclusion principle applied to three sets, you add P(A), P(B), P(C), then subtract the pairwise intersections, then:",
            qDE: "Bei der Siebformel für drei Mengen addiert man P(A), P(B), P(C), subtrahiert die paarweisen Schnitte und dann:",
            opts: ["Add back P(A ∩ B ∩ C)", "Subtract P(A ∩ B ∩ C) again", "Do nothing further", "Subtract P(A ∪ B ∪ C)"],
            optsDE: ["Addiert P(A ∩ B ∩ C) wieder", "Subtrahiert P(A ∩ B ∩ C) erneut", "Tut nichts weiteres", "Subtrahiert P(A ∪ B ∪ C)"],
            correct: 0
        },
        {
            q: "C(6, 2) equals:",
            qDE: "C(6, 2) ergibt:",
            opts: ["15", "12", "30", "6"],
            optsDE: ["15", "12", "30", "6"],
            correct: 0
        },
        {
            q: "In a Laplace space, a bag holds 3 red and 7 blue balls. What is P(drawing a red ball)?",
            qDE: "Im Laplace-Raum enthält ein Beutel 3 rote und 7 blaue Bälle. Wie groß ist P(rote Kugel ziehen)?",
            opts: ["3/10", "7/10", "3/7", "1/3"],
            optsDE: ["3/10", "7/10", "3/7", "1/3"],
            correct: 0
        },
        {
            q: "Drawing k items from n WITH replacement and order matters gives how many outcomes?",
            qDE: "k Elemente aus n MIT Zurücklegen ziehen, Reihenfolge zählt: wie viele Ergebnisse?",
            opts: ["nᵏ", "C(n,k)", "n! / (n−k)!", "k!"],
            optsDE: ["nᵏ", "C(n,k)", "n! / (n−k)!", "k!"],
            correct: 0
        },
        {
            q: "A valid σ-algebra on Ω must contain:",
            qDE: "Eine gültige σ-Algebra auf Ω muss enthalten:",
            opts: ["∅ and Ω", "Only Ω", "Only ∅", "All non-empty subsets of Ω"],
            optsDE: ["∅ und Ω", "Nur Ω", "Nur ∅", "Alle nicht-leeren Teilmengen von Ω"],
            correct: 0
        },
        {
            q: "The odds in favour of an event with probability p = 0.25 are:",
            qDE: "Die Chance (Odds) für ein Ereignis mit Wahrscheinlichkeit p = 0,25 betragen:",
            opts: ["1/3", "1/4", "3/4", "4"],
            optsDE: ["1/3", "1/4", "3/4", "4"],
            correct: 0
        },
        {
            q: "How many unordered selections of 3 items from 10 (without replacement) are there?",
            qDE: "Wie viele ungeordnete Auswahlen von 3 aus 10 Elementen (ohne Zurücklegen) gibt es?",
            opts: ["120", "720", "30", "1000"],
            optsDE: ["120", "720", "30", "1000"],
            correct: 0
        },



    ],

    // ── WORLD 3 — Random Variables & Distributions ────────────────────────
    // Topics: conditional probability, law of total probability, Bayes' theorem,
    //         multi-stage probability trees, independence, random variables,
    //         distributions, CDF, quantile function, continuous RV/PDF, exponential distribution

    3: [
        {
            q: "The conditional probability P(A|B) is defined as:",
            qDE: "Die bedingte Wahrscheinlichkeit P(A|B) ist definiert als:",
            opts: ["P(A ∩ B) / P(B)", "P(A) · P(B)", "P(B) / P(A)", "P(A) + P(B)"],
            optsDE: ["P(A ∩ B) / P(B)", "P(A) · P(B)", "P(B) / P(A)", "P(A) + P(B)"],
            correct: 0
        },
        {
            q: "Events A and B are independent if and only if:",
            qDE: "Ereignisse A und B sind unabhängig genau dann, wenn:",
            opts: ["P(A ∩ B) = P(A) · P(B)", "P(A ∩ B) = 0", "P(A|B) = P(B)", "P(A ∪ B) = 1"],
            optsDE: ["P(A ∩ B) = P(A) · P(B)", "P(A ∩ B) = 0", "P(A|B) = P(B)", "P(A ∪ B) = 1"],
            correct: 0
        },
        {
            q: "The law of total probability states that P(A) equals:",
            qDE: "Der Satz der totalen Wahrscheinlichkeit besagt, dass P(A) gleich ist:",
            opts: ["Σ P(A|Bᵢ)·P(Bᵢ) over a partition {Bᵢ}", "P(A|B) · P(B)", "P(A) · P(B)", "P(A ∩ B) / P(B)"],
            optsDE: ["Σ P(A|Bᵢ)·P(Bᵢ) über eine Partition {Bᵢ}", "P(A|B) · P(B)", "P(A) · P(B)", "P(A ∩ B) / P(B)"],
            correct: 0
        },
        {
            q: "Bayes' theorem gives P(B|A) in terms of P(A|B) as:",
            qDE: "Der Satz von Bayes gibt P(B|A) in Abhängigkeit von P(A|B) als:",
            opts: ["P(A|B)·P(B) / P(A)", "P(A|B) / P(B)", "P(A|B) + P(B)", "P(B) / P(A)"],
            optsDE: ["P(A|B)·P(B) / P(A)", "P(A|B) / P(B)", "P(A|B) + P(B)", "P(B) / P(A)"],
            correct: 0
        },
        {
            q: "For a continuous random variable X, P(X = c) for any single value c equals:",
            qDE: "Für eine stetige Zufallsvariable X gilt P(X = c) für jeden einzelnen Wert c:",
            opts: ["0", "f(c) where f is the PDF", "F(c) where F is the CDF", "1 / range"],
            optsDE: ["0", "f(c), wobei f die Dichte ist", "F(c), wobei F die VKF ist", "1 / Bereich"],
            correct: 0
        },
        {
            q: "The CDF F(x) of a random variable X is defined as:",
            qDE: "Die Verteilungsfunktion F(x) einer Zufallsvariable X ist definiert als:",
            opts: ["P(X ≤ x)", "P(X = x)", "P(X > x)", "d/dx P(X ≤ x)"],
            optsDE: ["P(X ≤ x)", "P(X = x)", "P(X > x)", "d/dx P(X ≤ x)"],
            correct: 0
        },
        {
            q: "The quantile function Q(p) is the smallest x such that:",
            qDE: "Die Quantilfunktion Q(p) ist das kleinste x, sodass:",
            opts: ["F(x) ≥ p", "F(x) ≤ p", "f(x) = p", "P(X > x) = p"],
            optsDE: ["F(x) ≥ p", "F(x) ≤ p", "f(x) = p", "P(X > x) = p"],
            correct: 0
        },
        {
            q: "For an exponential distribution with rate λ, the CDF for x ≥ 0 is:",
            qDE: "Für eine Exponentialverteilung mit Rate λ lautet die VKF für x ≥ 0:",
            opts: ["1 − e^(−λx)", "e^(−λx)", "λ·e^(−λx)", "1 − λ·e^(−x)"],
            optsDE: ["1 − e^(−λx)", "e^(−λx)", "λ·e^(−λx)", "1 − λ·e^(−x)"],
            correct: 0
        },


        {
            q: "The multiplication rule for conditional probability states that P(A ∩ B) equals:",
            qDE: "Die Multiplikationsregel für bedingte Wahrscheinlichkeiten besagt, dass P(A ∩ B) gleich ist:",
            opts: ["P(A|B) · P(B)", "P(A) + P(B)", "P(A) / P(B)", "P(A|B) + P(B)"],
            optsDE: ["P(A|B) · P(B)", "P(A) + P(B)", "P(A) / P(B)", "P(A|B) + P(B)"],
            correct: 0
        },
        {
            q: "In a two-stage probability tree, the probability of a path equals:",
            qDE: "In einem zweistufigen Wahrscheinlichkeitsbaum ist die Wahrscheinlichkeit eines Pfades gleich:",
            opts: ["The product of the probabilities along the path", "The sum of the probabilities along the path", "The probability of the final branch only", "1 divided by the number of paths"],
            optsDE: ["Das Produkt der Wahrscheinlichkeiten entlang des Pfades", "Die Summe der Wahrscheinlichkeiten entlang des Pfades", "Nur die Wahrscheinlichkeit des letzten Asts", "1 geteilt durch die Anzahl der Pfade"],
            correct: 0
        },
        {
            q: "Which statement about independent events A and B is correct?",
            qDE: "Welche Aussage über unabhängige Ereignisse A und B ist korrekt?",
            opts: ["P(A|B) = P(A)", "P(A|B) = P(B)", "P(A ∩ B) = 0", "P(A ∪ B) = 1"],
            optsDE: ["P(A|B) = P(A)", "P(A|B) = P(B)", "P(A ∩ B) = 0", "P(A ∪ B) = 1"],
            correct: 0
        },
        {
            q: "Bayes' theorem is used to:",
            qDE: "Der Satz von Bayes wird verwendet, um:",
            opts: ["Update a prior probability given new evidence", "Add two probabilities together", "Calculate the probability of the complement", "Find the expected value of a random variable"],
            optsDE: ["Eine A-priori-Wahrscheinlichkeit angesichts neuer Evidenz zu aktualisieren", "Zwei Wahrscheinlichkeiten zu addieren", "Die Wahrscheinlichkeit des Komplements zu berechnen", "Den Erwartungswert einer Zufallsvariable zu finden"],
            correct: 0
        },
        {
            q: "A discrete random variable X assigns:",
            qDE: "Eine diskrete Zufallsvariable X ordnet zu:",
            opts: ["A real number to each outcome in Ω", "A probability to each event", "A set to each outcome", "An interval to each outcome"],
            optsDE: ["Jedem Ergebnis in Ω eine reelle Zahl", "Jedem Ereignis eine Wahrscheinlichkeit", "Jedem Ergebnis eine Menge", "Jedem Ergebnis ein Intervall"],
            correct: 0
        },
        {
            q: "For the exponential distribution Exp(λ), the mean (expected value) is:",
            qDE: "Für die Exponentialverteilung Exp(λ) gilt als Erwartungswert:",
            opts: ["1/λ", "λ", "λ²", "1/λ²"],
            optsDE: ["1/λ", "λ", "λ²", "1/λ²"],
            correct: 0
        },
        {
            q: "The probability mass function (PMF) p(x) of a discrete RV must satisfy:",
            qDE: "Die Zähldichte p(x) einer diskreten ZV muss erfüllen:",
            opts: ["Σ p(x) = 1 and p(x) ≥ 0 for all x", "Σ p(x) = 0", "p(x) = 1 for all x", "∫ p(x) dx = 1"],
            optsDE: ["Σ p(x) = 1 und p(x) ≥ 0 für alle x", "Σ p(x) = 0", "p(x) = 1 für alle x", "∫ p(x) dx = 1"],
            correct: 0
        },
        {
            q: "The CDF F(x) is non-decreasing. What does this mean?",
            qDE: "Die Verteilungsfunktion F(x) ist monoton nicht-fallend. Was bedeutet das?",
            opts: ["If x₁ < x₂, then F(x₁) ≤ F(x₂)", "If x₁ < x₂, then F(x₁) > F(x₂)", "F(x) is constant for all x", "F(x) can be negative for small x"],
            optsDE: ["Wenn x₁ < x₂, dann F(x₁) ≤ F(x₂)", "Wenn x₁ < x₂, dann F(x₁) > F(x₂)", "F(x) ist für alle x konstant", "F(x) kann für kleine x negativ sein"],
            correct: 0
        },
        {
            q: "The probability density function (PDF) f(x) of a continuous RV satisfies:",
            qDE: "Die Dichtefunktion f(x) einer stetigen ZV erfüllt:",
            opts: ["∫ f(x) dx = 1 over ℝ, and f(x) ≥ 0", "f(x) = P(X = x)", "Σ f(x) = 1", "f(x) > 1 is not allowed"],
            optsDE: ["∫ f(x) dx = 1 über ℝ, und f(x) ≥ 0", "f(x) = P(X = x)", "Σ f(x) = 1", "f(x) > 1 ist nicht erlaubt"],
            correct: 0
        },
        {
            q: "The quantile Q(0.5) of a distribution is called the:",
            qDE: "Das Quantil Q(0,5) einer Verteilung heißt:",
            opts: ["Median", "Mean", "Mode", "Variance"],
            optsDE: ["Median", "Erwartungswert", "Modus", "Varianz"],
            correct: 0
        },



    ],

    // ── WORLD 4
    // Topics: density transformation, independence of RVs, contingency tables,
    //         standard normal distribution, expected value (discrete + continuous),
    //         Bernoulli distribution, linearity of E, variance rules, covariance, correlation

    4: [
        {
            q: "The expected value of a discrete random variable X is:",
            qDE: "Der Erwartungswert einer diskreten Zufallsvariable X ist:",
            opts: ["Σ x · P(X = x)", "Σ P(X = x)", "max P(X = x)", "Σ x² · P(X = x)"],
            optsDE: ["Σ x · P(X = x)", "Σ P(X = x)", "max P(X = x)", "Σ x² · P(X = x)"],
            correct: 0
        },
        {
            q: "The variance of X using the shift theorem equals:",
            qDE: "Die Varianz von X nach dem Verschiebungssatz lautet:",
            opts: ["E[X²] − (E[X])²", "E[X²] + (E[X])²", "(E[X])² − E[X²]", "E[(X − E[X]³)]"],
            optsDE: ["E[X²] − (E[X])²", "E[X²] + (E[X])²", "(E[X])² − E[X²]", "E[(X − E[X]³)]"],
            correct: 0
        },
        {
            q: "For independent X and Y, E[X·Y] equals:",
            qDE: "Für unabhängige X und Y gilt E[X·Y] =",
            opts: ["E[X] · E[Y]", "E[X] + E[Y]", "E[X²] · E[Y²]", "Cov(X,Y)"],
            optsDE: ["E[X] · E[Y]", "E[X] + E[Y]", "E[X²] · E[Y²]", "Cov(X,Y)"],
            correct: 0
        },
        {
            q: "For a Bernoulli(p) random variable, E[X] equals:",
            qDE: "Für eine Bernoulli(p)-Zufallsvariable gilt E[X] =",
            opts: ["p", "p(1−p)", "p²", "1−p"],
            optsDE: ["p", "p(1−p)", "p²", "1−p"],
            correct: 0
        },
        {
            q: "Var(aX) for a constant a equals:",
            qDE: "Var(aX) für eine Konstante a ergibt:",
            opts: ["a² · Var(X)", "a · Var(X)", "Var(X)", "a² + Var(X)"],
            optsDE: ["a² · Var(X)", "a · Var(X)", "Var(X)", "a² + Var(X)"],
            correct: 0
        },
        {
            q: "For X ~ Bin(n, p), the expected value E[X] is:",
            qDE: "Für X ~ Bin(n, p) gilt E[X] =",
            opts: ["n · p", "n · p · (1−p)", "p / n", "n / p"],
            optsDE: ["n · p", "n · p · (1−p)", "p / n", "n / p"],
            correct: 0
        },
        {
            q: "Adding a constant c to X changes the variance by:",
            qDE: "Das Addieren einer Konstante c zu X verändert die Varianz um:",
            opts: ["0 — variance is unchanged", "c", "c²", "2c · Var(X)"],
            optsDE: ["0 — die Varianz ändert sich nicht", "c", "c²", "2c · Var(X)"],
            correct: 0
        },
        {
            q: "For independent X and Y, Var(X + Y) equals:",
            qDE: "Für unabhängige X und Y gilt Var(X + Y) =",
            opts: ["Var(X) + Var(Y)", "Var(X) · Var(Y)", "Var(X) − Var(Y)", "Var(X) + Var(Y) + 2·Cov(X,Y)"],
            optsDE: ["Var(X) + Var(Y)", "Var(X) · Var(Y)", "Var(X) − Var(Y)", "Var(X) + Var(Y) + 2·Cov(X,Y)"],
            correct: 0
        },


        {
            q: "For Y = aX + b with constants a and b, E[Y] equals:",
            qDE: "Für Y = aX + b mit Konstanten a und b gilt E[Y] =",
            opts: ["a·E[X] + b", "a·E[X]", "E[X] + b", "a + b"],
            optsDE: ["a·E[X] + b", "a·E[X]", "E[X] + b", "a + b"],
            correct: 0
        },
        {
            q: "The covariance Cov(X, Y) is defined as:",
            qDE: "Die Kovarianz Cov(X, Y) ist definiert als:",
            opts: ["E[(X−E[X])(Y−E[Y])]", "E[X] · E[Y]", "E[X + Y]", "Var(X) + Var(Y)"],
            optsDE: ["E[(X−E[X])(Y−E[Y])]", "E[X] · E[Y]", "E[X + Y]", "Var(X) + Var(Y)"],
            correct: 0
        },
        {
            q: "The Pearson correlation coefficient r between X and Y lies in the range:",
            qDE: "Der Pearson-Korrelationskoeffizient r zwischen X und Y liegt im Bereich:",
            opts: ["[−1, 1]", "[0, 1]", "[0, ∞)", "(−∞, ∞)"],
            optsDE: ["[−1, 1]", "[0, 1]", "[0, ∞)", "(−∞, ∞)"],
            correct: 0
        },
        {
            q: "If X and Y are independent, their covariance Cov(X, Y) equals:",
            qDE: "Wenn X und Y unabhängig sind, gilt für ihre Kovarianz Cov(X, Y):",
            opts: ["0", "1", "Var(X) · Var(Y)", "E[X] · E[Y]"],
            optsDE: ["0", "1", "Var(X) · Var(Y)", "E[X] · E[Y]"],
            correct: 0
        },
        {
            q: "For X ~ N(μ, σ²), the standardised variable Z = (X − μ)/σ follows:",
            qDE: "Für X ~ N(μ, σ²) folgt die standardisierte Variable Z = (X − μ)/σ der:",
            opts: ["Standard normal distribution N(0,1)", "Normal distribution N(μ, σ²)", "Uniform distribution on [0,1]", "Exponential distribution Exp(1)"],
            optsDE: ["Standardnormalverteilung N(0,1)", "Normalverteilung N(μ, σ²)", "Gleichverteilung auf [0,1]", "Exponentialverteilung Exp(1)"],
            correct: 0
        },
        {
            q: "The standard normal distribution N(0,1) is symmetric around:",
            qDE: "Die Standardnormalverteilung N(0,1) ist symmetrisch um:",
            opts: ["0", "1", "0.5", "−1"],
            optsDE: ["0", "1", "0,5", "−1"],
            correct: 0
        },
        {
            q: "Var(X + Y) when X and Y are NOT independent equals:",
            qDE: "Var(X + Y) wenn X und Y NICHT unabhängig sind, lautet:",
            opts: ["Var(X) + Var(Y) + 2·Cov(X,Y)", "Var(X) + Var(Y)", "Var(X) · Var(Y)", "Var(X) − Var(Y)"],
            optsDE: ["Var(X) + Var(Y) + 2·Cov(X,Y)", "Var(X) + Var(Y)", "Var(X) · Var(Y)", "Var(X) − Var(Y)"],
            correct: 0
        },
        {
            q: "For X ~ Bin(n, p), what is Var(X)?",
            qDE: "Für X ~ Bin(n, p) gilt Var(X) =",
            opts: ["n·p·(1−p)", "n·p", "p·(1−p)", "n²·p"],
            optsDE: ["n·p·(1−p)", "n·p", "p·(1−p)", "n²·p"],
            correct: 0
        },
        {
            q: "Jensen's inequality for a convex function f states that:",
            qDE: "Die Jensensche Ungleichung für eine konvexe Funktion f besagt:",
            opts: ["E[f(X)] ≥ f(E[X])", "E[f(X)] ≤ f(E[X])", "E[f(X)] = f(E[X])", "E[f(X)] = 0"],
            optsDE: ["E[f(X)] ≥ f(E[X])", "E[f(X)] ≤ f(E[X])", "E[f(X)] = f(E[X])", "E[f(X)] = 0"],
            correct: 0
        },
        {
            q: "The density transformation theorem is used when:",
            qDE: "Der Dichtetransformationssatz wird verwendet, wenn:",
            opts: ["You know the PDF of X and want the PDF of Y = g(X)", "You need to compute E[X]", "You want to standardise a normal variable", "You need to find the CDF from a PMF"],
            optsDE: ["Man die Dichte von X kennt und die Dichte von Y = g(X) sucht", "Man E[X] berechnen möchte", "Man eine Normalvariable standardisieren möchte", "Man die VKF aus einer Zähldichte bestimmen möchte"],
            correct: 0
        },



    ],

    // Worlds 5–13: empty for now — add questions here as you build those worlds.
    5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [], 12: [],




    13: [

        // Topics (inferred from World 5 being all gated — advanced): multivariate
        //         distributions, covariance matrix, correlation, law of large numbers,
        //         central limit theorem, moment generating functions, estimators

        {
            q: "The Law of Large Numbers states that as the sample size n → ∞, the sample mean:",
            qDE: "Das Gesetz der großen Zahlen besagt, dass mit wachsendem Stichprobenumfang n der Stichprobenmittelwert:",
            opts: ["Converges to the true population mean μ", "Converges to 0", "Increases without bound", "Equals the median"],
            optsDE: ["Gegen den wahren Erwartungswert μ konvergiert", "Gegen 0 konvergiert", "Unbeschränkt wächst", "Dem Median entspricht"],
            correct: 0
        },
        {
            q: "The Central Limit Theorem requires that the random variables are:",
            qDE: "Der Zentrale Grenzwertsatz setzt voraus, dass die Zufallsvariablen:",
            opts: ["Independent and identically distributed (i.i.d.) with finite variance", "Normally distributed", "Discrete", "All equal to their mean"],
            optsDE: ["Unabhängig und identisch verteilt (i.i.d.) mit endlicher Varianz", "Normalverteilt", "Diskret", "Alle gleich ihrem Erwartungswert"],
            correct: 0
        },
        {
            q: "The covariance matrix Σ of a random vector is always:",
            qDE: "Die Kovarianzmatrix Σ eines Zufallsvektors ist stets:",
            opts: ["Symmetric and positive semi-definite", "Diagonal", "Invertible", "A scalar"],
            optsDE: ["Symmetrisch und positiv semidefinit", "Diagonal", "Invertierbar", "Ein Skalar"],
            correct: 0
        },
        {
            q: "A Poisson distribution with parameter λ has which expected value?",
            qDE: "Eine Poisson-Verteilung mit Parameter λ hat welchen Erwartungswert?",
            opts: ["λ", "1/λ", "λ²", "√λ"],
            optsDE: ["λ", "1/λ", "λ²", "√λ"],
            correct: 0
        },
        {
            q: "An unbiased estimator θ̂ for a parameter θ satisfies:",
            qDE: "Ein erwartungstreuer Schätzer θ̂ für einen Parameter θ erfüllt:",
            opts: ["E[θ̂] = θ", "Var(θ̂) = 0", "θ̂ = θ always", "E[θ̂] = 0"],
            optsDE: ["E[θ̂] = θ", "Var(θ̂) = 0", "θ̂ = θ immer", "E[θ̂] = 0"],
            correct: 0
        },
        {
            q: "For a random variable X, the moment generating function (MGF) is defined as:",
            qDE: "Für eine Zufallsvariable X ist die momenterzeugende Funktion (MGF) definiert als:",
            opts: ["M_X(t) = E[e^(tX)]", "M_X(t) = E[X^t]", "M_X(t) = ln E[X]", "M_X(t) = E[X] · t"],
            optsDE: ["M_X(t) = E[e^(tX)]", "M_X(t) = E[X^t]", "M_X(t) = ln E[X]", "M_X(t) = E[X] · t"],
            correct: 0
        },
        {
            q: "The marginal distribution of X is obtained from the joint distribution f(x, y) by:",
            qDE: "Die Randverteilung von X wird aus der gemeinsamen Verteilung f(x, y) durch folgendes erhalten:",
            opts: ["Integrating (or summing) over all values of Y", "Dividing by f(y)", "Subtracting f(y) from f(x,y)", "Multiplying f(x,y) by f(y)"],
            optsDE: ["Integration (oder Summation) über alle Werte von Y", "Division durch f(y)", "Subtraktion von f(y) aus f(x,y)", "Multiplikation von f(x,y) mit f(y)"],
            correct: 0
        },
        {
            q: "The variance of the sample mean X̄ of n i.i.d. variables with variance σ² is:",
            qDE: "Die Varianz des Stichprobenmittelwerts X̄ von n i.i.d. Variablen mit Varianz σ² beträgt:",
            opts: ["σ² / n", "σ²", "n · σ²", "σ / n"],
            optsDE: ["σ² / n", "σ²", "n · σ²", "σ / n"],
            correct: 0
        },
        {
            q: "Markov's inequality states that for a non-negative RV X and a > 0:",
            qDE: "Die Markov-Ungleichung besagt für eine nicht-negative ZV X und a > 0:",
            opts: ["P(X ≥ a) ≤ E[X] / a", "P(X ≥ a) ≥ E[X] / a", "P(X ≥ a) = E[X] / a", "P(X ≤ a) ≤ E[X] / a"],
            optsDE: ["P(X ≥ a) ≤ E[X] / a", "P(X ≥ a) ≥ E[X] / a", "P(X ≥ a) = E[X] / a", "P(X ≤ a) ≤ E[X] / a"],
            correct: 0
        },
        {
            q: "Chebyshev's inequality states that P(|X − μ| ≥ k·σ) is bounded by:",
            qDE: "Die Tschebyschow-Ungleichung begrenzt P(|X − μ| ≥ k·σ) durch:",
            opts: ["1 / k²", "1 / k", "k²", "σ / k"],
            optsDE: ["1 / k²", "1 / k", "k²", "σ / k"],
            correct: 0
        },







    ],
};


// ═══════════════════════════════════════════════
//  MOODLE SCORE CODES
//  Codes are unlocked based on total score
//  thresholds instead of world completion.
//  The final code requires near-perfect play
//  (95% of maximum possible points).
// ═══════════════════════════════════════════════





function buildWorldCodes() {
    const levelCount = ALL.length;

    // Estimate average points per level (adjust these to taste)
    const avgPtsPerLevel = 290; // rough expected score per level on Normal
    const totalPotential = levelCount * avgPtsPerLevel;

    const tiers = [
        { pct: 0.15, code: 'TY_4_P14Y1N_5T0XE15', titleEn: 'Bronze Achievement', titleDE: 'Bronze-Achievement' },
        { pct: 0.35, code: '570CH4ST1CS_15_FUN', titleEn: 'Silver Achievement', titleDE: 'Silber-Achievement' },
        { pct: 0.55, code: 'p>0.05_DENIED', titleEn: 'Gold Achievement', titleDE: 'Gold-Achievement' },
        { pct: 0.75, code: 'E(X)=WIN', titleEn: 'Platinum Achievement', titleDE: 'Platin-Achievement' },
        { pct: 0.95, code: 'CentralLimitTheorem', titleEn: 'Master Achievement', titleDE: 'Meister-Achievement' },
    ];

    return tiers.map(tier => ({
        ...tier,
        threshold: Math.round(totalPotential * tier.pct)
    }));
}

const WORLD_CODES = buildWorldCodes();