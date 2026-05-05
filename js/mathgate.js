// ═══════════════════════════════════════════════
//  MATH GATE  (mathgate.js)
//  Certain levels are locked behind a short
//  calculation exercise. The student must type a
//  numeric answer (exact or within a tolerance)
//  before the level launches.
//
// ── Gated level index set ─────────────────────────────────────────────────
// Gates are defined as { worldIdx (1-based), levelIdx (1-based) } pairs.
// This is computed dynamically from WORLD_START_GI so it stays correct
// even when you add/remove levels from any world.
const MATH_GATE_RULES = [
    { world: 1, level: 6  },   // W1-L6
    { world: 2, level: 1  },   // W2-L1
    { world: 2, level: 6  },   // W2-L6
    { world: 3, level: 1  },   // W3-L1
    { world: 3, level: 4  },   // W3-L4
    { world: 3, level: 7  },   // W3-L7
    { world: 4, level: 1  },   // W4-L1
    { world: 4, level: 3  },   // W4-L3 (if it exists)
    { world: 4, level: 5  },   // W4-L5 (if it exists)
    { world: 4, level: 7  },   // W4-L7 (if it exists)
    { world: 4, level: 9  },   // W4-L9 (if it exists)
    { world: 5, level: 1  },   // all of W5
    { world: 5, level: 2  },
    { world: 5, level: 3  },
    { world: 5, level: 4  },
    { world: 5, level: 5  },
    { world: 5, level: 6  },
    { world: 5, level: 7  },
    { world: 5, level: 8  },
    { world: 5, level: 9  },
    { world: 5, level: 10 },
];

// Build the actual Set of gated gi values at runtime, skipping any rules
// that refer to levels that don't exist yet (world too small).
function buildMathGateSet() {
    const s = new Set();
    MATH_GATE_RULES.forEach(({ world, level }) => {
        const wi = world - 1;                        // 0-based world index
        const worldData = WORLDS[wi];
        if (!worldData) return;                      // world doesn't exist
        if (level > worldData.data.length) return;   // level doesn't exist yet
        const gi = WORLD_START_GI[wi] + (level - 1); // convert to global index
        s.add(gi);
    });
    return s;
}

// MATH_GATE_GI is populated after WORLDS and WORLD_START_GI are defined.
// Because mathgate.js loads after levels.js, WORLDS is already available here.
let MATH_GATE_GI = buildMathGateSet();

// isGatedLevel(gi) — returns true if this level requires a math gate.
function isGatedLevel(gi) {
    return MATH_GATE_GI.has(gi);
}

// isMathGatePassed(gi) — true if the player has already passed the gate.
function isMathGatePassed(gi) {
    return STATE.mathGatePassed && STATE.mathGatePassed.includes(gi);
}


// ═══════════════════════════════════════════════
//  QUESTION POOLS  (one per world)
// ═══════════════════════════════════════════════

const MATH_GATE_POOLS = {

    // ── WORLD 1 ─────────────────────────────────────────────────────────
    // Basic probability: sample spaces, simple event probabilities
    1: [

        // ── 1. ERGEBNISMENGE (Sample Space) ──────────────────────────────────────

        {
            q: 'A regular fair die is rolled once. How many elements does the sample space Ω contain?',
            qDE: 'Ein fairer Würfel wird einmal geworfen. Wie viele Elemente enthält die Ergebnismenge Ω?',
            answer: 6, tolerance: 0, unit: 'elements',
            hintEn: 'Ω = {1, 2, 3, 4, 5, 6} — one outcome per face.',
            hintDE: 'Ω = {1, 2, 3, 4, 5, 6} — ein Ergebnis pro Seite.'
        },
        {
            q: 'A fair coin is flipped three times. How many elements are in the sample space?',
            qDE: 'Eine faire Münze wird dreimal geworfen. Wie viele Elemente enthält die Ergebnismenge?',
            answer: 8, tolerance: 0, unit: 'elements',
            hintEn: 'Each flip has 2 outcomes, head or tails.',
            hintDE: 'Jeder Wurf hat 2 mögliche Ergebnisse, Kopf oder Zahl.'
        },

        {
            q: 'A fair coin is flipped twice. How many outcomes are in the sample space?',
            qDE: 'Eine faire Münze wird zweimal geworfen. Wie viele Ergebnisse enthält die Ergebnismenge?',
            answer: 4, tolerance: 0, unit: 'outcomes',
            hintEn: 'Each flip has 2 outcomes, head or tails.',
            hintDE: 'Jeder Wurf hat 2 mögliche Ergebnisse, Kopf oder Zahl.'
        },

        {
            q: 'Two regular fair dice are rolled simultaneously. How many elements does the sample space Ω contain?',
            qDE: 'Zwei reguläre faire Würfel werden gleichzeitig geworfen. Wie viele Elemente enthält die Ergebnismenge Ω?',
            answer: 36, tolerance: 0, unit: 'elements',
            hintEn: 'Count the amount of ordered pairs (i, j) with i, j ∈ {1,…,6}.',
            hintDE: 'Zähle die geordneten Paare (i, j) mit i, j ∈ {1,…,6}.'
        },

        // ── 2. EREIGNIS (Event) ──────────────────────────────────────────────────

        {
            q: 'A fair die is rolled. Event A = "even number". How many elementary outcomes does A contain?',
            qDE: 'Ein fairer Würfel wird geworfen. Ereignis A = „gerade Zahl". Wie viele Elementarereignisse enthält A?',
            answer: 3, tolerance: 0, unit: 'outcomes',
            hintEn: 'A = {2, 4, 6}',
            hintDE: 'A = {2, 4, 6}'
        },
        {
            q: 'A fair die is rolled. Event B = "number greater than 4". What is P(B)? Enter the numerator of the occuring fraction over 6.',
            qDE: 'Ein fairer Würfel wird geworfen. Ereignis B = „Zahl größer als 4". Berechne P(B)? Gib den Zähler des Bruches über 6 ein.',
            answer: 2, tolerance: 0, unit: '/ 6',
            hintEn: 'B = {5, 6}',
            hintDE: 'B = {5, 6}'
        },

        {
            q: 'A card is drawn from a standard 52-card deck. Event B = "Drawn card is Heart". What is P(B)? Enter the numerator of the occuring fraction over 52.',
            qDE: 'Eine Karte wird aus einem Standarddeck mit 52 Karten gezogen. Ereignis B = „gezogene Karte ist Herz". Berechne P(B). Gib den Zähler des Bruches über 52 ein.  ',
            answer: 13, tolerance: 0, unit: 'cards',
            hintEn: 'A standard deck has 4 suits of 13 cards each.',
            hintDE: 'Ein Standarddeck hat 4 Farben mit je 13 Karten.'
        },

        {
            q: 'A bag has 3 red and 7 blue balls. What is the probability of drawing a red ball? Enter as a percentage.',
            qDE: 'Ein Beutel enthält 3 rote und 7 blaue Bälle. Wie groß ist die Wahrscheinlichkeit, einen roten Ball zu ziehen? Gib als Prozentzahl ein.',
            answer: 30, tolerance: 0, unit: '%',
            hintEn: '',
            hintDE: ''
        },




        // ── 3. ZUFALLSEXPERIMENT (Random Experiment) ────────────────────────────

        {
            q: 'A spinner has 5 equally sized sectors. Two spins are performed. How many possible outcomes are there?',
            qDE: 'Ein Glücksrad hat 5 gleich große Felder. Es wird zweimal gedreht. Wie viele mögliche Ergebnisse gibt es?',
            answer: 25, tolerance: 0, unit: 'outcomes',
            hintEn: 'Each spin has 5 different outcomes.',
            hintDE: 'Jede Drehung hat 5 Möglichkeiten.'
        },

        {
            q: 'A random experiment has sample space Ω = {a, b, c, d}. How many elements does Pot(Ω) have?',
            qDE: 'Ein Zufallsexperiment hat die Ergebnismenge Ω = {a, b, c, d}. Wie viele Elemente hat Pot(Ω)?',
            answer: 16, tolerance: 0, unit: 'subsets',
            hintEn: 'A set with n elements has 2ⁿ subsets.',
            hintDE: 'Eine Menge mit n Elementen hat 2ⁿ Teilmengen.'
        },


        // ── 4. DISJUNKTE EREIGNISSE (Mutually Exclusive Events) ─────────────────

        {
            q: 'P(A) = 0.3 and P(B) = 0.5. A and B are mutually exclusive. What is P(A ∪ B)?',
            qDE: 'P(A) = 0,3 und P(B) = 0,5. A und B sind disjunkt. Wie groß ist P(A ∪ B)?',
            answer: 0.8, tolerance: 0.001, unit: '',
            hintEn: 'Disjoint: P(A ∪ B) = P(A) + P(B)',
            hintDE: 'Disjunkt: P(A ∪ B) = P(A) + P(B)'
        },
        {
            q: 'A and B are mutually exclusive and P(A ∪ B) = 0.7. If P(A) = 0.4, what is P(B)?',
            qDE: 'A und B sind disjunkt und P(A ∪ B) = 0,7. Falls P(A) = 0,4, was ist P(B)?',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'P(B) = P(A ∪ B) − P(A)',
            hintDE: 'P(B) = P(A ∪ B) − P(A)'
        },
        {
            q: 'If A and B are mutually exclusive, what is P(A ∩ B)?',
            qDE: 'Wenn A und B disjunkt sind, was ist P(A ∩ B)?',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'Mutually exclusive means A ∩ B = ∅.',
            hintDE: 'Disjunkt bedeutet A ∩ B = ∅'
        },

        // ── 5. EREIGNISALGEBRA / POTENZMENGE (Event Algebra / Power Set) ─────────

        {
            q: 'Ω = {1, 2, 3}. How many elements does the power set Pot(Ω) contain?',
            qDE: 'Ω = {1, 2, 3}. Wie viele Elemente enthält die Potenzmenge Pot(Ω)?',
            answer: 8, tolerance: 0, unit: 'elements',
            hintEn: '',
            hintDE: ''
        },

        {
            q: 'Ω = {H, T} (coin flip). How many events does the full event algebra contain?',
            qDE: 'Ω = {K, Z} (Münzwurf). Wie viele Ereignisse enthält die vollständige Ereignisalgebra?',
            answer: 4, tolerance: 0, unit: 'events',
            hintEn: 'Pot(Ω) = {∅, {H}, {T}, {H,T}}',
            hintDE: 'Pot(Ω) = {∅, {K}, {Z}, {K,Z}}'
        },

        // ── 6. ELEMENTAREREIGNIS (Elementary Event) ──────────────────────────────

        {
            q: 'A die is rolled. How many elementary events does the sample space contain?',
            qDE: 'Ein Würfel wird geworfen. Wie viele Elementarereignisse enthält die Ergebnismenge?',
            answer: 6, tolerance: 0, unit: 'elementary events',
            hintEn: 'Each face {1}, {2}, …, {6} is one elementary event.',
            hintDE: 'Jede Seite {1}, {2}, …, {6} ist ein Elementarereignis.'
        },
        {
            q: 'In a Laplace experiment with 8 equally likely elementary events, what is the probability of each elementary event? Enter as a decimal.',
            qDE: 'In einem Laplace-Experiment mit 8 gleich wahrscheinlichen Elementarereignissen: Wie groß ist die Wahrscheinlichkeit jedes Elementarereignisses? Gib als Dezimalzahl ein.',
            answer: 0.125, tolerance: 0.001, unit: '',
            hintEn: 'P(ω) = 1/8 = 0.125 for each elementary event.',
            hintDE: 'P(ω) = 1/8 = 0,125 für jedes Elementarereignis.'
        },


        // ── 7. SCHNITT UND VEREINIGUNG (Intersection and Union) ──────────────────

        {
            q: 'P(A) = 0.5, P(B) = 0.4, P(A ∩ B) = 0.2. What is P(A ∪ B)?',
            qDE: 'P(A) = 0,5, P(B) = 0,4, P(A ∩ B) = 0,2. Wie groß ist P(A ∪ B)?',
            answer: 0.7, tolerance: 0.001, unit: '',
            hintEn: 'Inclusion-exclusion: P(A ∪ B) = P(A) + P(B) − P(A ∩ B).',
            hintDE: 'Siebformel: P(A ∪ B) = P(A) + P(B) − P(A ∩ B).'
        },
        {
            q: 'P(A ∪ B) = 0.8, P(A) = 0.5, P(B) = 0.6. What is P(A ∩ B)?',
            qDE: 'P(A ∪ B) = 0,8, P(A) = 0,5, P(B) = 0,6. Wie groß ist P(A ∩ B)?',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'Rearrange: P(A ∩ B) = P(A) + P(B) − P(A ∪ B).',
            hintDE: 'Umstellen: P(A ∩ B) = P(A) + P(B) − P(A ∪ B).'
        },
        {
            q: 'A die is rolled. A = {1,2,3}, B = {3,4,5}. How many elements are in A ∩ B?',
            qDE: 'Ein Würfel wird geworfen. A = {1,2,3}, B = {3,4,5}. Wie viele Elemente enthält A ∩ B?',
            answer: 1, tolerance: 0, unit: 'elements',
            hintEn: 'A ∩ B = {3}.',
            hintDE: 'A ∩ B = {3}.'
        },

        // ── 8. KOMPLEMENT (Complement) ───────────────────────────────────────────

        {
            q: 'P(A) = 0.35. What is P(Aᶜ)? Enter as a decimal.',
            qDE: 'P(A) = 0,35. Wie groß ist P(Aᶜ)? Gib als Dezimalzahl ein.',
            answer: 0.65, tolerance: 0.001, unit: '',
            hintEn: 'P(Aᶜ) = 1 − P(A)',
            hintDE: 'P(Aᶜ) = 1 − P(A)'
        },
        {
            q: 'P(Aᶜ) = 0.72. What is P(A)? Enter as a decimal.',
            qDE: 'P(Aᶜ) = 0,72. Wie groß ist P(A)? Gib als Dezimalzahl ein.',
            answer: 0.28, tolerance: 0.001, unit: '',
            hintEn: 'P(A) = 1 − P(Aᶜ)',
            hintDE: 'P(A) = 1 − P(Aᶜ)'
        },
        {
            q: 'A die is rolled. A = {1,2,3,4}. How many elements does Aᶜ contain?',
            qDE: 'Ein Würfel wird geworfen. A = {1,2,3,4}. Wie viele Elemente enthält Aᶜ?',
            answer: 2, tolerance: 0, unit: 'elements',
            hintEn: 'Aᶜ = {5, 6} — the elements of Ω not in A.',
            hintDE: 'Aᶜ = {5, 6} — die Elemente von Ω, die nicht in A liegen.'
        },

        {
            q: 'P(A) = 0.6. What is P(Aᶜ)?',
            qDE: 'P(A) = 0,6. Wie groß ist P(Aᶜ)?',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'The complement rule: P(Aᶜ) = 1 − P(A).',
            hintDE: 'Komplementregel: P(Aᶜ) = 1 − P(A).'
        },

        // ── 9. DE MORGAN REGELN ──────────────────────────────────────────────────

        {
            q: 'By De Morgan\'s law: (A ∪ B)ᶜ = Aᶜ __ Bᶜ. Enter 1 for ∩ or 2 for ∪.',
            qDE: 'Nach der De-Morgan-Regel gilt: (A ∪ B)ᶜ = Aᶜ __ Bᶜ. Gib 1 für ∩ oder 2 für ∪ ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: '(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ — De Morgan\'s first law.',
            hintDE: '(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ — erste De-Morgan-Regel.'
        },
        {
            q: 'P(Aᶜ) = 0.3, P(Bᶜ) = 0.4, P(Aᶜ ∩ Bᶜ) = 0.1. By De Morgan, what is P((A ∪ B)ᶜ)?',
            qDE: 'P(Aᶜ) = 0,3, P(Bᶜ) = 0,4, P(Aᶜ ∩ Bᶜ) = 0,1. Nach De Morgan: Wie groß ist P((A ∪ B)ᶜ)?',
            answer: 0.1, tolerance: 0.001, unit: '',
            hintEn: '(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ, so P((A ∪ B)ᶜ) = P(Aᶜ ∩ Bᶜ)',
            hintDE: '(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ, also P((A ∪ B)ᶜ) = P(Aᶜ ∩ Bᶜ)'
        },
        {
            q: 'P(A ∩ B) = 0.2. By De Morgan, what is P((Aᶜ ∪ Bᶜ)ᶜ)? Enter as a decimal.',
            qDE: 'P(A ∩ B) = 0,2. Nach De Morgan: Wie groß ist P((Aᶜ ∪ Bᶜ)ᶜ)? Gib als Dezimalzahl ein.',
            answer: 0.2, tolerance: 0.001, unit: '',
            hintEn: '(Aᶜ ∪ Bᶜ)ᶜ = A ∩ B by De Morgan.',
            hintDE: '(Aᶜ ∪ Bᶜ)ᶜ = A ∩ B nach De Morgan.'
        },

        // ── 10. DISTRIBUTIVGESETZ (Distributive Law) ─────────────────────────────

        {
            q: 'Simplify: A ∩ (B ∪ C). Which law gives A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)? Enter 1 for distributive law, 2 for De Morgan.',
            qDE: 'Vereinfache: A ∩ (B ∪ C). Welches Gesetz liefert A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)? Gib 1 für Distributivgesetz, 2 für De Morgan ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'The distributive law: A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C).',
            hintDE: 'Das Distributivgesetz: A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C).'
        },
        {
            q: 'P(A ∩ B) = 0.1, P(A ∩ C) = 0.2, and (A ∩ B) and (A ∩ C) are disjoint. Using the distributive law, what is P(A ∩ (B ∪ C))?',
            qDE: 'P(A ∩ B) = 0,1, P(A ∩ C) = 0,2, und (A ∩ B) und (A ∩ C) sind disjunkt. Mit dem Distributivgesetz: Wie groß ist P(A ∩ (B ∪ C))?',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C).',
            hintDE: 'A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)'
        },
        {
            q: 'Using the distributive law: A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C). True or false? Enter 1 for true, 0 for false.',
            qDE: 'Mit dem Distributivgesetz: A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C). Wahr oder falsch? Gib 1 für wahr, 0 für falsch ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Yes — union distributes over intersection, just as ∩ distributes over ∪.',
            hintDE: 'Ja — die Vereinigung ist distributiv über den Schnitt, genau wie ∩ über ∪.'
        },

        // ── 11. WAHRSCHEINLICHKEITSMASS (Probability Measure) ────────────────────

        {
            q: 'A probability measure P must satisfy P(Ω) = ?',
            qDE: 'Ein Wahrscheinlichkeitsmaß P muss P(Ω) = ? erfüllen.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Kolmogorov axiom.',
            hintDE: 'Kolmogorov-Axiom.'
        },
        {
            q: 'Events A₁, A₂, A₃ are pairwise disjoint with P(A₁) = 0.2, P(A₂) = 0.5, P(A₃) = 0.3. What is P(A₁ ∪ A₂ ∪ A₃)?',
            qDE: 'Ereignisse A₁, A₂, A₃ sind paarweise disjunkt mit P(A₁) = 0,2, P(A₂) = 0,5, P(A₃) = 0,3. Wie groß ist P(A₁ ∪ A₂ ∪ A₃)?',
            answer: 1.0, tolerance: 0.001, unit: '',
            hintEn: 'σ-additivity.',
            hintDE: 'σ-Additivität.'
        },
        {
            q: 'Which value CANNOT be a valid probability? Enter 1 for −0.1, 2 for 0, 3 for 0.5, or 4 for 1.',
            qDE: 'Welcher Wert kann KEINE gültige Wahrscheinlichkeit sein? Gib 1 für −0,1, 2 für 0, 3 für 0,5 oder 4 für 1 ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Probabilities must satisfy 0 ≤ P(A) ≤ 1. Negative values are impossible.',
            hintDE: 'Wahrscheinlichkeiten müssen 0 ≤ P(A) ≤ 1 erfüllen. Negative Werte sind unmöglich.'
        },

        // ── 12. RECHENREGELN FÜR DAS WAHRSCHEINLICHKEITSMASS ─────────────────────

        {
            q: 'P(A) = 0.6 and P(B) = 0.5. What is the maximum possible value of P(A ∩ B)? Enter as a decimal.',
            qDE: 'P(A) = 0,6 und P(B) = 0,5. Was ist der maximal mögliche Wert von P(A ∩ B)? Gib als Dezimalzahl ein.',
            answer: 0.5, tolerance: 0.001, unit: '',
            hintEn: 'P(A ∩ B) ≤ min(P(A), P(B)).',
            hintDE: 'P(A ∩ B) ≤ min(P(A), P(B)).'
        },
        {
            q: 'P(A) = 0.7. What is the minimum possible value of P(A ∪ B) if P(B) = 0.4? Enter as a decimal.',
            qDE: 'P(A) = 0,7. Was ist der minimal mögliche Wert von P(A ∪ B), wenn P(B) = 0,4? Gib als Dezimalzahl ein.',
            answer: 0.7, tolerance: 0.001, unit: '',
            hintEn: 'P(A ∪ B) ≥ max(P(A), P(B)).',
            hintDE: 'P(A ∪ B) ≥ max(P(A), P(B)).'
        },
        {
            q: 'If A ⊆ B, then P(A) ≤ P(B). P(B) = 0.6 and A ⊆ B. What is the maximum possible value of P(A)? Enter as a decimal.',
            qDE: 'Falls A ⊆ B, gilt P(A) ≤ P(B). P(B) = 0,6 und A ⊆ B. Was ist der maximal mögliche Wert von P(A)? Gib als Dezimalzahl ein.',
            answer: 0.6, tolerance: 0.001, unit: '',
            hintEn: 'Since A ⊆ B, P(A) ≤ P(B).',
            hintDE: 'Da A ⊆ B, gilt P(A) ≤ P(B).'
        },

    ],

    // WORLD 2
    // 
    2: [


        // ── 1. BOOLESCHE UNGLEICHUNG / UNION BOUND ───────────────────────────────

        {
            q: 'P(A) = 0.3 and P(B) = 0.4. Using the union bound, what is the upper bound for P(A ∪ B)? Enter as a decimal.',
            qDE: 'P(A) = 0,3 und P(B) = 0,4. Was ist mit der Booleschen Ungleichung die obere Schranke für P(A ∪ B)? Gib als Dezimalzahl ein.',
            answer: 0.7, tolerance: 0.001, unit: '',
            hintEn: 'Union bound: P(A ∪ B) ≤ P(A) + P(B)',
            hintDE: 'Boolesche Ungleichung: P(A ∪ B) ≤ P(A) + P(B)'
        },
        {
            q: 'Three events have probabilities P(A₁) = 0.2, P(A₂) = 0.3, P(A₃) = 0.25. What does the union bound give as an upper bound for P(A₁ ∪ A₂ ∪ A₃)?',
            qDE: 'Drei Ereignisse haben Wahrscheinlichkeiten P(A₁) = 0,2, P(A₂) = 0,3, P(A₃) = 0,25. Was liefert die Boolesche Ungleichung als obere Schranke für P(A₁ ∪ A₂ ∪ A₃)?',
            answer: 0.75, tolerance: 0.001, unit: '',
            hintEn: 'Union bound: P(A₁ ∪ A₂ ∪ A₃) ≤ 0.2 + 0.3 + 0.25',
            hintDE: 'Boolesche Ungleichung: P(A₁ ∪ A₂ ∪ A₃) ≤ 0,2 + 0,3 + 0,25'
        },
        {
            q: 'P(A) = 0.5 and P(B) = 0.6. The union bound gives P(A ∪ B) ≤ 1.1. But probabilities cannot exceed 1. So the tightest valid upper bound is?',
            qDE: 'P(A) = 0,5 und P(B) = 0,6. Die Boolesche Ungleichung liefert P(A ∪ B) ≤ 1,1. Da Wahrscheinlichkeiten nicht größer als 1 sein können, ist die schärfste gültige obere Schranke?',
            answer: 1.0, tolerance: 0.001, unit: '',
            hintEn: 'The union bound gives 1.1, but P(A ∪ B) ≤ 1 always.',
            hintDE: 'Die Boolesche Ungleichung liefert 1,1, aber P(A ∪ B) ≤ 1 gilt immer.'
        },

        // ── 2. LAPLACE RAUM (Laplace Space) ──────────────────────────────────────

        {
            q: 'A Laplace space has 20 equally likely outcomes. Event A contains 5 outcomes. What is P(A)? Enter as a decimal.',
            qDE: 'Ein Laplace-Raum hat 20 gleich wahrscheinliche Ergebnisse. Ereignis A enthält 5 Ergebnisse. Wie groß ist P(A)? Gib als Dezimalzahl ein.',
            answer: 0.25, tolerance: 0.001, unit: '',
            hintEn: 'P(A) = |A| / |Ω| = 5 / 20',
            hintDE: 'P(A) = |A| / |Ω| = 5 / 20'
        },
        {
            q: 'A card is drawn from a standard 52-card deck (Laplace space). What is the probability of drawing an ace? Enter the numerator of the fraction over 52.',
            qDE: 'Eine Karte wird aus einem Standarddeck mit 52 Karten gezogen (Laplace-Raum). Wie groß ist die Wahrscheinlichkeit, ein Ass zu ziehen? Gib den Zähler über 52 ein.',
            answer: 4, tolerance: 0, unit: '/ 52',
            hintEn: 'There are 4 aces in 52 cards.',
            hintDE: 'Es gibt 4 Asse in 52 Karten.'
        },


        // ── 3. DISKRETE GLEICHVERTEILUNG (Discrete Uniform Distribution) ──────────

        {
            q: 'A random number is chosen uniformly from {1, 2, 3, 4, 5}. What is the probability of choosing a number ≤ 3? Enter as a decimal.',
            qDE: 'Eine Zahl wird gleichmäßig aus {1, 2, 3, 4, 5} gezogen. Wie groß ist die Wahrscheinlichkeit, eine Zahl ≤ 3 zu wählen? Gib als Dezimalzahl ein.',
            answer: 0.6, tolerance: 0.001, unit: '',
            hintEn: '3 favourable outcomes out of 5.',
            hintDE: '3 günstige Ergebnisse von 5.'
        },
        {
            q: 'On a discrete uniform distribution over {1, 2, …, 10}, what is the probability of drawing an even number? Enter as a decimal.',
            qDE: 'Bei diskreter Gleichverteilung über {1, 2, …, 10}: Wie groß ist die Wahrscheinlichkeit, eine gerade Zahl zu ziehen? Gib als Dezimalzahl ein.',
            answer: 0.5, tolerance: 0.001, unit: '',
            hintEn: 'Even numbers: {2,4,6,8,10}.',
            hintDE: 'Gerade Zahlen: {2,4,6,8,10}.'
        },
        {
            q: 'A fair die is a discrete uniform distribution over {1,…,6}. What is P(X ≥ 5) where X is the dice number? Enter as a fraction over 6.',
            qDE: 'Ein fairer Würfel ist diskret gleichverteilt über {1,…,6}. Wie groß ist P(X ≥ 5) wobei X die Augenzahl ist? Gib den Zähler über 6 ein.',
            answer: 2, tolerance: 0, unit: '/ 6',
            hintEn: 'Favourable outcomes: {5, 6} — 2 out of 6.',
            hintDE: 'Günstige Ergebnisse: {5, 6} — 2 von 6.'
        },

        // ── 4. MULTIPLIKATIONSREGEL DER KOMBINATORIK ─────────────────────────────

        {
            q: 'A menu has 3 starters, 4 mains, and 2 desserts. How many different 3-course meals are possible?',
            qDE: 'Eine Speisekarte hat 3 Vorspeisen, 4 Hauptgerichte und 2 Desserts. Wie viele verschiedene 3-Gänge-Menüs sind möglich?',
            answer: 24, tolerance: 0, unit: 'meals',
            hintEn: 'Multiplication rule',
            hintDE: 'Multiplikationsregel'
        },
        {
            q: 'A password consists of 2 letters (A–Z, 26 options each) followed by 1 digit (0–9). How many passwords are possible?',
            qDE: 'Ein Passwort besteht aus 2 Buchstaben (A–Z, je 26 Möglichkeiten) gefolgt von 1 Ziffer (0–9). Wie viele Passwörter sind möglich?',
            answer: 6760, tolerance: 0, unit: 'passwords',
            hintEn: 'Multiplication rule.',
            hintDE: 'Multiplikationsregel.'
        },
        {
            q: 'You roll a die and flip a coin. How many different combined outcomes are possible?',
            qDE: 'Du wirfst einen Würfel und eine Münze. Wie viele verschiedene kombinierte Ergebnisse gibt es?',
            answer: 12, tolerance: 0, unit: 'outcomes',
            hintEn: 'Multiplication rule.',
            hintDE: 'Multiplikationsregel.'
        },

        // ── 5. URNENMODELL MIT ZURÜCKLEGEN MIT REIHENFOLGE ───────────────────────

        {
            q: 'An urn contains 5 balls labelled 1–5. You draw 3 times with replacement, order matters. How many outcomes are possible?',
            qDE: 'Eine Urne enthält 5 Bälle (1–5). Du ziehst 3 Mal mit Zurücklegen, Reihenfolge zählt. Wie viele Ergebnisse sind möglich?',
            answer: 125, tolerance: 0, unit: 'outcomes',
            hintEn: 'With replacement, order matters: 5³',
            hintDE: 'Mit Zurücklegen, Reihenfolge zählt: 5³.'
        },
        {
            q: 'An urn has 4 balls. Drawing 2 times with replacement and order matters: what is the probability of drawing ball #1 both times? Enter as a fraction over 16.',
            qDE: 'Eine Urne hat 4 Bälle. 2 Mal mit Zurücklegen ziehen, Reihenfolge zählt: Wie groß ist die Wahrscheinlichkeit, beide Male Ball Nr. 1 zu ziehen? Gib den Zähler über 16 ein.',
            answer: 1, tolerance: 0, unit: '/ 16',
            hintEn: 'Total outcomes: 4² = 16. Favourable: draw 1, then 1 again.',
            hintDE: 'Gesamtergebnisse: 4² = 16. Günstige: zuerst 1, dann nochmal 1.'
        },
        {
            q: 'An urn contains 3 balls (red, blue, green). Drawing 2 times with replacement, order matters. How many outcomes contain at least one red ball?',
            qDE: 'Eine Urne enthält 3 Bälle (rot, blau, grün). 2 Mal mit Zurücklegen, Reihenfolge zählt. Wie viele Ergebnisse enthalten mindestens einen roten Ball?',
            answer: 5, tolerance: 0, unit: 'outcomes',
            hintEn: 'Total: 3² = 9. No red: 2² = 4',
            hintDE: 'Gesamt: 3² = 9. Kein Rot: 2² = 4'
        },

        // ── 6. URNENMODELL MIT REIHENFOLGE OHNE ZURÜCKLEGEN ──────────────────────

        {
            q: 'An urn has 6 balls. You draw 2 without replacement, order matters. How many ordered outcomes are possible?',
            qDE: 'Eine Urne hat 6 Bälle. Du ziehst 2 ohne Zurücklegen, Reihenfolge zählt. Wie viele geordnete Ergebnisse sind möglich?',
            answer: 30, tolerance: 0, unit: 'outcomes',
            hintEn: '6 × 5 = 30. First draw: 6 options, second: 5 (no replacement).',
            hintDE: '6 × 5 = 30. Erster Zug: 6 Möglichkeiten, zweiter: 5 (ohne Zurücklegen).'
        },
        {
            q: 'How many ways can 4 runners finish in 1st, 2nd, and 3rd place out of 8 runners? (Order matters, no replacement.)',
            qDE: 'Wie viele Möglichkeiten gibt es für Platz 1, 2 und 3 bei 8 Läufern? (Reihenfolge zählt, ohne Zurücklegen.)',
            answer: 336, tolerance: 0, unit: 'ways',
            hintEn: '8 × 7 × 6 = 336 ordered arrangements.',
            hintDE: '8 × 7 × 6 = 336 geordnete Anordnungen.'
        },
        {
            q: 'An urn has 5 balls numbered 1–5. Two are drawn without replacement, order matters. What is the probability of drawing (1, 2) in exactly that order? Enter as a fraction over 20.',
            qDE: 'Eine Urne hat 5 Bälle (1–5). Zwei werden ohne Zurücklegen gezogen, Reihenfolge zählt. Wie groß ist P(zuerst 1, dann 2)? Gib den Zähler über 20 ein.',
            answer: 1, tolerance: 0, unit: '/ 20',
            hintEn: 'Total ordered outcomes: 5 × 4 = 20. Only 1 favourable: (1,2).',
            hintDE: 'Geordnete Ergebnisse gesamt: 5 × 4 = 20. Nur 1 günstig: (1,2).'
        },

        // ── 7. CHANCEN / ODDS ─────────────────────────────────────────────────────

        {
            q: 'P(A) = 0.8. What are the odds in favour of A? Enter the numerator x of x/y where odds = p/(1−p) as a decimal.',
            qDE: 'P(A) = 0,8. Wie groß sind die Chancen (Odds) für A? Gib den Wert von p/(1−p) als Dezimalzahl ein.',
            answer: 4.0, tolerance: 0.001, unit: '',
            hintEn: 'Odds = P(A) / P(Aᶜ)',
            hintDE: 'Odds = P(A) / P(Aᶜ)'
        },
        {
            q: 'The odds in favour of event A are 3 (i.e. 3:1). What is P(A)? Enter as a decimal.',
            qDE: 'Die Odds für Ereignis A betragen 3 (also 3:1). Wie groß ist P(A)? Gib als Dezimalzahl ein.',
            answer: 0.75, tolerance: 0.001, unit: '',
            hintEn: 'Odds = p/(1−p) = 3 → p = 3/4 = 0.75.',
            hintDE: 'Odds = p/(1−p) = 3 → p = 3/4 = 0,75.'
        },
        {
            q: 'P(A) = 0.25. What are the odds against A (i.e. P(Aᶜ)/P(A))? Enter as a decimal.',
            qDE: 'P(A) = 0,25. Wie groß sind die Odds gegen A (also P(Aᶜ)/P(A))? Gib als Dezimalzahl ein.',
            answer: 3.0, tolerance: 0.001, unit: '',
            hintEn: 'Odds against = (1 − 0.25) / 0.25 = 0.75 / 0.25 = 3.',
            hintDE: 'Odds gegen A = (1 − 0,25) / 0,25 = 0,75 / 0,25 = 3.'
        },

        // ── 8. SIEBFORMEL / INCLUSION-EXCLUSION ──────────────────────────────────

        {
            q: 'P(A) = 0.5, P(B) = 0.4, P(C) = 0.3, P(A∩B) = 0.2, P(A∩C) = 0.1, P(B∩C) = 0.15, P(A∩B∩C) = 0.05. What is P(A ∪ B ∪ C)?',
            qDE: 'P(A) = 0,5, P(B) = 0,4, P(C) = 0,3, P(A∩B) = 0,2, P(A∩C) = 0,1, P(B∩C) = 0,15, P(A∩B∩C) = 0,05. Wie groß ist P(A ∪ B ∪ C)?',
            answer: 0.8, tolerance: 0.001, unit: '',
            hintEn: 'Inclusion-exclusion: (0.5+0.4+0.3) − (0.2+0.1+0.15) + 0.05 = 1.2 − 0.45 + 0.05 = 0.8.',
            hintDE: 'Siebformel: (0,5+0,4+0,3) − (0,2+0,1+0,15) + 0,05 = 1,2 − 0,45 + 0,05 = 0,8.'
        },
        {
            q: 'P(A) = 0.6, P(B) = 0.5, P(C) = 0.4, P(A∩B) = 0.3, P(A∩C) = 0.2, P(B∩C) = 0.25, P(A∩B∩C) = 0.1. What is P(A ∪ B ∪ C)?',
            qDE: 'P(A) = 0,6, P(B) = 0,5, P(C) = 0,4, P(A∩B) = 0,3, P(A∩C) = 0,2, P(B∩C) = 0,25, P(A∩B∩C) = 0,1. Wie groß ist P(A ∪ B ∪ C)?',
            answer: 0.85, tolerance: 0.001, unit: '',
            hintEn: 'Inclusion-exclusion: (0.6+0.5+0.4) − (0.3+0.2+0.25) + 0.1 = 1.5 − 0.75 + 0.1 = 0.85.',
            hintDE: 'Siebformel: (0,6+0,5+0,4) − (0,3+0,2+0,25) + 0,1 = 1,5 − 0,75 + 0,1 = 0,85.'
        },
        {
            q: 'In the inclusion-exclusion formula for 3 sets, how many pairwise intersection terms are subtracted? Enter a whole number.',
            qDE: 'In der Siebformel für 3 Mengen: Wie viele paarweise Schnittterme werden subtrahiert? Gib eine ganze Zahl ein.',
            answer: 3, tolerance: 0, unit: 'terms',
            hintEn: 'The three pairwise intersections are P(A∩B), P(A∩C), P(B∩C) — 3 terms.',
            hintDE: 'Die drei paarweisen Schnitte sind P(A∩B), P(A∩C), P(B∩C) — 3 Terme.'
        },

        // ── 9. EREIGNISALGEBRA / SIGMA-ALGEBRA ───────────────────────────────────

        {
            q: 'Ω = {1,2,3,4}. Is ℱ = {∅, {1,2}, {3,4}, Ω} a valid σ-algebra? Enter 1 for yes, 0 for no.',
            qDE: 'Ω = {1,2,3,4}. Ist ℱ = {∅, {1,2}, {3,4}, Ω} eine gültige σ-Algebra? Gib 1 für ja, 0 für nein ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Check: contains ∅ and Ω ✓; {1,2}ᶜ = {3,4} ∈ ℱ ✓; closed under unions ✓. Valid.',
            hintDE: 'Prüfung: enthält ∅ und Ω ✓; {1,2}ᶜ = {3,4} ∈ ℱ ✓; abgeschlossen unter Vereinigung ✓. Gültig.'
        },
        {
            q: 'Ω = {1,2,3}. Is ℱ = {∅, {1}, {2}, Ω} a valid σ-algebra? Enter 1 for yes, 0 for no.',
            qDE: 'Ω = {1,2,3}. Ist ℱ = {∅, {1}, {2}, Ω} eine gültige σ-Algebra? Gib 1 für ja, 0 für nein ein.',
            answer: 0, tolerance: 0, unit: '',
            hintEn: '{1} ∪ {2} = {1,2} is not in ℱ — not closed under unions. Invalid.',
            hintDE: '{1} ∪ {2} = {1,2} ist nicht in ℱ — nicht abgeschlossen unter Vereinigung. Ungültig.'
        },
        {
            q: 'What is the smallest possible σ-algebra on any non-empty Ω? Enter 1 for {∅, Ω} or 2 for the full power set.',
            qDE: 'Was ist die kleinste mögliche σ-Algebra auf einem beliebigen nicht-leeren Ω? Gib 1 für {∅, Ω} oder 2 für die volle Potenzmenge ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'The trivial σ-algebra {∅, Ω} is always the smallest. The power set is the largest.',
            hintDE: 'Die triviale σ-Algebra {∅, Ω} ist immer die kleinste. Die Potenzmenge ist die größte.'
        },
    ],

    // ── WORLD 3 ─────────────────────────────────────────────────────────
    // 
    3: [



        {
            q: 'P(A ∩ B) = 0.12 and P(B) = 0.4. What is P(A | B)?',
            qDE: 'P(A ∩ B) = 0,12 und P(B) = 0,4. Wie groß ist P(A | B)?',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'P(A|B) = P(A ∩ B) / P(B) = 0.12 / 0.4.',
            hintDE: 'P(A|B) = P(A ∩ B) / P(B) = 0,12 / 0,4.'
        },

        // ── 1. BEDINGTE WAHRSCHEINLICHKEIT (Conditional Probability) ─────────────

        {
            q: 'P(A ∩ B) = 0.12, P(B) = 0.4. What is P(A | B)? Enter as a decimal.',
            qDE: 'P(A ∩ B) = 0,12, P(B) = 0,4. Wie groß ist P(A | B)? Gib als Dezimalzahl ein.',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'P(A|B) = P(A ∩ B) / P(B).',
            hintDE: 'P(A|B) = P(A ∩ B) / P(B).'
        },
        {
            q: 'P(B | A) = 0.5, P(A) = 0.6. What is P(A ∩ B)? Enter as a decimal.',
            qDE: 'P(B | A) = 0,5, P(A) = 0,6. Wie groß ist P(A ∩ B)? Gib als Dezimalzahl ein.',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'Multiplication rule: P(A ∩ B) = P(B|A) · P(A)',
            hintDE: 'Multiplikationsregel: P(A ∩ B) = P(B|A) · P(A)'
        },
        {
            q: 'P(A) = 0.4, P(B) = 0.5, P(A ∩ B) = 0.2. What is P(A | B)? Enter as a decimal.',
            qDE: 'P(A) = 0,4, P(B) = 0,5, P(A ∩ B) = 0,2. Wie groß ist P(A | B)? Gib als Dezimalzahl ein.',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'P(A|B) = P(A ∩ B) / P(B)',
            hintDE: 'P(A|B) = P(A ∩ B) / P(B)'
        },

        // ── 2. SATZ VON DER TOTALEN WAHRSCHEINLICHKEIT ───────────────────────────

        {
            q: 'B₁ and B₂ partition Ω. P(B₁) = 0.3, P(B₂) = 0.7, P(A|B₁) = 0.4, P(A|B₂) = 0.2. What is P(A)?',
            qDE: 'B₁ und B₂ partitionieren Ω. P(B₁) = 0,3, P(B₂) = 0,7, P(A|B₁) = 0,4, P(A|B₂) = 0,2. Wie groß ist P(A)?',
            answer: 0.26, tolerance: 0.001, unit: '',
            hintEn: 'P(A) = P(A|B₁)·P(B₁) + P(A|B₂)·P(B₂).',
            hintDE: 'P(A) = P(A|B₁)·P(B₁) + P(A|B₂)·P(B₂)'
        },
        {
            q: 'Three machines produce parts: B₁ (50%), B₂ (30%), B₃ (20%). Defect rates: P(D|B₁)=0.02, P(D|B₂)=0.05, P(D|B₃)=0.03. What is P(D)? Enter as a decimal.',
            qDE: 'Drei Maschinen produzieren Teile: B₁ (50%), B₂ (30%), B₃ (20%). Ausschussraten: P(D|B₁)=0,02, P(D|B₂)=0,05, P(D|B₃)=0,03. Wie groß ist P(D)?',
            answer: 0.031, tolerance: 0.001, unit: '',
            hintEn: 'P(D) = 0.02×0.5 + 0.05×0.3 + 0.03×0.2',
            hintDE: 'P(D) = 0,02×0,5 + 0,05×0,3 + 0,03×0,2'
        },
        {
            q: 'B₁, B₂, B₃ partition Ω with P(B₁)=0.2, P(B₂)=0.5, P(B₃)=0.3. P(A|B₁)=0.6, P(A|B₂)=0.4, P(A|B₃)=0.1. What is P(A)?',
            qDE: 'B₁, B₂, B₃ partitionieren Ω mit P(B₁)=0,2, P(B₂)=0,5, P(B₃)=0,3. P(A|B₁)=0,6, P(A|B₂)=0,4, P(A|B₃)=0,1. Wie groß ist P(A)?',
            answer: 0.35, tolerance: 0.001, unit: '',
            hintEn: 'P(A) = 0.6×0.2 + 0.4×0.5 + 0.1×0.3',
            hintDE: 'P(A) = 0,6×0,2 + 0,4×0,5 + 0,1×0,3'
        },

        // ── 3. BAYES FORMEL ───────────────────────────────────────────────────────

        {
            q: 'P(B₁)=0.3, P(B₂)=0.7, P(A|B₁)=0.4, P(A|B₂)=0.2, P(A)=0.26. What is P(B₁|A)? Enter as a decimal rounded to 2 places.',
            qDE: 'P(B₁)=0,3, P(B₂)=0,7, P(A|B₁)=0,4, P(A|B₂)=0,2, P(A)=0,26. Wie groß ist P(B₁|A)? Gib als Dezimalzahl auf 2 Stellen gerundet an.',
            answer: 0.46, tolerance: 0.01, unit: '',
            hintEn: 'Bayes: P(B₁|A) = P(A|B₁)·P(B₁) / P(A)',
            hintDE: 'Bayes: P(B₁|A) = P(A|B₁)·P(B₁) / P(A)'
        },
        {
            q: 'A test for a disease is 90% sensitive: P(+|D)=0.9. Specificity: P(−|Dᶜ)=0.95, so P(+|Dᶜ)=0.05. Prevalence P(D)=0.01. What is P(D|+)? Enter as a decimal rounded to 3 places.',
            qDE: 'Ein Test hat Sensitivität P(+|K)=0,9 und Spezifität P(−|Kᶜ)=0,95, also P(+|Kᶜ)=0,05. Prävalenz P(K)=0,01. Wie groß ist P(K|+)? Gib als Dezimalzahl auf 3 Stellen gerundet an.',
            answer: 0.154, tolerance: 0.005, unit: '',
            hintEn: 'P(+) = 0.9×0.01 + 0.05×0.99 = 0.009 + 0.0495',
            hintDE: 'P(+) = 0,9×0,01 + 0,05×0,99 = 0,009 + 0,0495 = 0,0585. P(K|+)'
        },
        {
            q: 'P(A|B)=0.6, P(B)=0.4, P(A)=0.3. What is P(B|A)? Enter as a decimal rounded to 2 places.',
            qDE: 'P(A|B)=0,6, P(B)=0,4, P(A)=0,3. Wie groß ist P(B|A)? Gib als Dezimalzahl auf 2 Stellen gerundet an.',
            answer: 0.8, tolerance: 0.01, unit: '',
            hintEn: 'Bayes: P(B|A) = P(A|B)·P(B)/P(A)',
            hintDE: 'Bayes: P(B|A) = P(A|B)·P(B)/P(A)'
        },

        // ── 4. MEHRSTUFIGE WAHRSCHEINLICHKEITSRÄUME / WAHRSCHEINLICHKEITSBAUM ────

        {
            q: 'A bag has 3 red and 2 blue balls. You draw twice without replacement. What is P(red, then red)? Enter as a decimal.',
            qDE: 'Ein Beutel enthält 3 rote und 2 blaue Bälle. Du ziehst zweimal ohne Zurücklegen. Wie groß ist P(rot, dann rot)? Gib als Dezimalzahl ein.',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'P(R₁)=3/5, P(R₂|R₁)=2/4.',
            hintDE: 'P(R₁)=3/5, P(R₂|R₁)=2/4.'
        },
        {
            q: 'In a two-stage probability tree, P(B₁)=0.6, P(B₂)=0.4. P(A|B₁)=0.3, P(A|B₂)=0.7. What is P(B₂ ∩ A)?',
            qDE: 'In einem zweistufigen Wahrscheinlichkeitsbaum: P(B₁)=0,6, P(B₂)=0,4. P(A|B₁)=0,3, P(A|B₂)=0,7. Wie groß ist P(B₂ ∩ A)?',
            answer: 0.28, tolerance: 0.001, unit: '',
            hintEn: 'P(B₂ ∩ A) = P(A|B₂) · P(B₂)',
            hintDE: 'P(B₂ ∩ A) = P(A|B₂) · P(B₂)'
        },
        {
            q: 'A coin is flipped twice. In the probability tree, how many paths lead to exactly one head?',
            qDE: 'Eine Münze wird zweimal geworfen. Wie viele Pfade im Wahrscheinlichkeitsbaum führen zu genau einem Kopf?',
            answer: 2, tolerance: 0, unit: 'paths',
            hintEn: 'The paths HT and TH both give exactly one head — 2 paths.',
            hintDE: 'Die Pfade KZ und ZK ergeben jeweils genau einen Kopf — 2 Pfade.'
        },

        // ── 5. STOCHASTISCHE UNABHÄNGIGKEIT (Statistical Independence) ────────────

        {
            q: 'P(A)=0.4, P(B)=0.5, P(A ∩ B)=0.2. Are A and B independent? Enter 1 for yes, 0 for no.',
            qDE: 'P(A)=0,4, P(B)=0,5, P(A ∩ B)=0,2. Sind A und B unabhängig? Gib 1 für ja, 0 für nein ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Independent if P(A ∩ B) = P(A)·P(B).',
            hintDE: 'Unabhängig wenn P(A ∩ B) = P(A)·P(B).'
        },
        {
            q: 'P(A)=0.3, P(B)=0.6, P(A ∩ B)=0.2. Are A and B independent? Enter 1 for yes, 0 for no.',
            qDE: 'P(A)=0,3, P(B)=0,6, P(A ∩ B)=0,2. Sind A und B unabhängig? Gib 1 für ja, 0 für nein ein.',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'P(A)·P(B) = 0.3 × 0.6 = 0.18',
            hintDE: 'P(A)·P(B) = 0,3 × 0,6 = 0,18'
        },
        {
            q: 'A and B are independent with P(A)=0.5 and P(B)=0.4. What is P(A ∩ B)? Enter as a decimal.',
            qDE: 'A und B sind unabhängig mit P(A)=0,5 und P(B)=0,4. Wie groß ist P(A ∩ B)? Gib als Dezimalzahl ein.',
            answer: 0.2, tolerance: 0.001, unit: '',
            hintEn: 'Independence: P(A ∩ B) = P(A) · P(B)',
            hintDE: 'Unabhängigkeit: P(A ∩ B) = P(A) · P(B)'
        },

        // ── 6. ZUFALLSVARIABLEN (Random Variables) ────────────────────────────────

        {
            q: 'A fair die is rolled. X is the number shown. What is P(X = 3)? Enter as a fraction over 6.',
            qDE: 'Ein fairer Würfel wird geworfen. X ist die gezeigte Zahl. Wie groß ist P(X = 3)? Gib den Zähler über 6 ein.',
            answer: 1, tolerance: 0, unit: '/ 6',
            hintEn: 'X maps each face to its number. P(X=3) = 1/6 in a Laplace space.',
            hintDE: 'X bildet jede Seite auf ihre Zahl ab. P(X=3) = 1/6 im Laplace-Raum.'
        },
        {
            q: 'X takes values {0, 1, 2} with P(X=0)=0.2, P(X=1)=0.5, P(X=2)=0.3. What is P(X ≥ 1)? Enter as a decimal.',
            qDE: 'X nimmt Werte {0,1,2} an mit P(X=0)=0,2, P(X=1)=0,5, P(X=2)=0,3. Wie groß ist P(X ≥ 1)? Gib als Dezimalzahl ein.',
            answer: 0.8, tolerance: 0.001, unit: '',
            hintEn: 'P(X ≥ 1) = 1 − P(X=0) = 1 − 0.2 = 0.8.',
            hintDE: 'P(X ≥ 1) = 1 − P(X=0) = 1 − 0,2 = 0,8.'
        },
        {
            q: 'X takes values {1, 2, 3} with P(X=1)=0.5, P(X=2)=0.3, P(X=3)=p. What must p be? Enter as a decimal.',
            qDE: 'X nimmt Werte {1,2,3} an mit P(X=1)=0,5, P(X=2)=0,3, P(X=3)=p. Wie groß muss p sein? Gib als Dezimalzahl ein.',
            answer: 0.2, tolerance: 0.001, unit: '',
            hintEn: 'All probabilities must sum to 1: p = 1 − 0.5 − 0.3 = 0.2.',
            hintDE: 'Alle Wahrscheinlichkeiten müssen 1 ergeben: p = 1 − 0,5 − 0,3 = 0,2.'
        },

        // ── 7. VERTEILUNG VON ZUFALLSVARIABLEN (Distribution of Random Variables) ─

        {
            q: 'X has distribution P(X=1)=0.3, P(X=2)=0.4, P(X=3)=0.3. What is P(X ≤ 2)? Enter as a decimal.',
            qDE: 'X hat die Verteilung P(X=1)=0,3, P(X=2)=0,4, P(X=3)=0,3. Wie groß ist P(X ≤ 2)? Gib als Dezimalzahl ein.',
            answer: 0.7, tolerance: 0.001, unit: '',
            hintEn: 'P(X ≤ 2) = P(X=1) + P(X=2).',
            hintDE: 'P(X ≤ 2) = P(X=1) + P(X=2).'
        },
        {
            q: 'X is uniformly distributed on {1, 2, 3, 4, 5}. What is P(2 ≤ X ≤ 4)? Enter as a decimal.',
            qDE: 'X ist gleichverteilt auf {1,2,3,4,5}. Wie groß ist P(2 ≤ X ≤ 4)? Gib als Dezimalzahl ein.',
            answer: 0.6, tolerance: 0.001, unit: '',
            hintEn: 'Values {2,3,4}: 3 out of 5 equally likely outcomes.',
            hintDE: 'Werte {2,3,4}: 3 von 5 gleich wahrscheinlichen Ergebnissen.'
        },
        {
            q: 'X has P(X=0)=0.1, P(X=1)=0.4, P(X=2)=0.4, P(X=3)=0.1. What is P(X = 1 or X = 2)? Enter as a decimal.',
            qDE: 'X hat P(X=0)=0,1, P(X=1)=0,4, P(X=2)=0,4, P(X=3)=0,1. Wie groß ist P(X=1 oder X=2)? Gib als Dezimalzahl ein.',
            answer: 0.8, tolerance: 0.001, unit: '',
            hintEn: 'P(X=1) + P(X=2)',
            hintDE: 'P(X=1) + P(X=2)'
        },

        // ── 8. BERECHNUNG VON INTERVALLWAHRSCHEINLICHKEITEN ──────────────────────

        {
            q: 'X is discrete with P(X=k) = 0.1 for k = 1,…,10. What is P(3 ≤ X ≤ 7)? Enter as a decimal.',
            qDE: 'X ist diskret mit P(X=k) = 0,1 für k = 1,…,10. Wie groß ist P(3 ≤ X ≤ 7)? Gib als Dezimalzahl ein.',
            answer: 0.5, tolerance: 0.001, unit: '',
            hintEn: 'Values 3,4,5,6,7: 5 outcomes × 0.1',
            hintDE: 'Werte 3,4,5,6,7: 5 Ergebnisse × 0,1'
        },
        {
            q: 'F(x) is a CDF with F(3)=0.7 and F(1)=0.3. What is P(1 < X ≤ 3)? Enter as a decimal.',
            qDE: 'F(x) ist eine Verteilungsfunktion mit F(3)=0,7 und F(1)=0,3. Wie groß ist P(1 < X ≤ 3)? Gib als Dezimalzahl ein.',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'P(1 < X ≤ 3) = F(3) − F(1)',
            hintDE: 'P(1 < X ≤ 3) = F(3) − F(1)'
        },
        {
            q: 'F(5)=0.9 and F(2)=0.5. What is P(2 < X ≤ 5)? Enter as a decimal.',
            qDE: 'F(5)=0,9 und F(2)=0,5. Wie groß ist P(2 < X ≤ 5)? Gib als Dezimalzahl ein.',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'P(2 < X ≤ 5) = F(5) − F(2)',
            hintDE: 'P(2 < X ≤ 5) = F(5) − F(2)'
        },

        // ── 9. ZÄHLDICHTE (Probability Mass Function) ─────────────────────────────

        {
            q: 'A discrete RV X has PMF p(1)=0.2, p(2)=0.5, p(3)=0.3. What is p(2)? Enter as a decimal.',
            qDE: 'Eine diskrete ZV X hat Zähldichte p(1)=0,2, p(2)=0,5, p(3)=0,3. Wie groß ist p(2)? Gib als Dezimalzahl ein.',
            answer: 0.5, tolerance: 0.001, unit: '',
            hintEn: 'The PMF directly gives P(X=2) = p(2) = 0.5.',
            hintDE: 'Die Zähldichte gibt direkt P(X=2) = p(2) = 0,5.'
        },
        {
            q: 'A PMF must sum to 1. If p(1)=0.3 and p(2)=0.3, and X only takes values 1, 2, 3, what is p(3)?',
            qDE: 'Eine Zähldichte muss 1 ergeben. Wenn p(1)=0,3 und p(2)=0,3 und X nur Werte 1,2,3 annimmt, wie groß ist p(3)?',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'p(3) = 1 − 0.3 − 0.3',
            hintDE: 'p(3) = 1 − 0,3 − 0,3'
        },
        {
            q: 'X has PMF p(k) = c · k for k = 1, 2, 3, 4. What must c be so that all probabilities sum to 1? Enter as a decimal.',
            qDE: 'X hat Zähldichte p(k) = c · k für k = 1,2,3,4. Welchen Wert muss c haben, damit sich alle Wahrscheinlichkeiten zu 1 addieren? Gib als Dezimalzahl ein.',
            answer: 0.1, tolerance: 0.001, unit: '',
            hintEn: 'c(1+2+3+4) = 1 → 10c = 1',
            hintDE: 'c(1+2+3+4) = 1 → 10c = 1'
        },

        // ── 10. VERTEILUNGSFUNKTION (Cumulative Distribution Function) ────────────

        {
            q: 'X has PMF p(1)=0.2, p(2)=0.3, p(3)=0.5. What is F(2) = P(X ≤ 2)? Enter as a decimal.',
            qDE: 'X hat Zähldichte p(1)=0,2, p(2)=0,3, p(3)=0,5. Wie groß ist F(2) = P(X ≤ 2)? Gib als Dezimalzahl ein.',
            answer: 0.5, tolerance: 0.001, unit: '',
            hintEn: 'F(2) = p(1) + p(2)',
            hintDE: 'F(2) = p(1) + p(2)'
        },
        {
            q: 'A CDF satisfies F(+∞) = ?',
            qDE: 'Eine Verteilungsfunktion erfüllt F(+∞) = ?',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'By definition the CDF approaches 1 as x → +∞.',
            hintDE: 'Per Definition nähert sich die Verteilungsfunktion 1 an für x → +∞.'
        },
        {
            q: 'F(x) is a CDF. Which value is impossible for F(x)? Enter 1 for −0.2, 2 for 0, 3 for 0.7, or 4 for 1.',
            qDE: 'F(x) ist eine Verteilungsfunktion. Welcher Wert ist unmöglich für F(x)? Gib 1 für −0,2, 2 für 0, 3 für 0,7 oder 4 für 1 ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'A CDF satisfies 0 ≤ F(x) ≤ 1 for all x. Negative values are impossible.',
            hintDE: 'Eine Verteilungsfunktion erfüllt 0 ≤ F(x) ≤ 1 für alle x. Negative Werte sind unmöglich.'
        },

        // ── 11. QUANTILFUNKTION (Quantile Function) ───────────────────────────────

        {
            q: 'X has CDF: F(1)=0.2, F(2)=0.5, F(3)=1.0. What is the 0.5-quantile (median) of X?',
            qDE: 'X hat Verteilungsfunktion: F(1)=0,2, F(2)=0,5, F(3)=1,0. Was ist das 0,5-Quantil (Median) von X?',
            answer: 2, tolerance: 0, unit: '',
            hintEn: 'Q(p) = min{x : F(x) ≥ p}. For p=0.5: F(2)=0.5 ≥ 0.5, so Q(0.5) = 2.',
            hintDE: 'Q(p) = min{x : F(x) ≥ p}. Für p=0,5: F(2)=0,5 ≥ 0,5, also Q(0,5) = 2.'
        },
        {
            q: 'X has CDF F(1)=0.1, F(2)=0.4, F(3)=0.8, F(4)=1.0. What is the 0.75-quantile of X?',
            qDE: 'X hat Verteilungsfunktion F(1)=0,1, F(2)=0,4, F(3)=0,8, F(4)=1,0. Was ist das 0,75-Quantil von X?',
            answer: 3, tolerance: 0, unit: '',
            hintEn: 'Q(0.75) = min{x : F(x) ≥ 0.75}. F(2)=0.4 < 0.75, F(3)=0.8 ≥ 0.75 → Q = 3.',
            hintDE: 'Q(0,75) = min{x : F(x) ≥ 0,75}. F(2)=0,4 < 0,75, F(3)=0,8 ≥ 0,75 → Q = 3.'
        },
        {
            q: 'The 0.25-quantile of X is the smallest x with F(x) ≥ 0.25. Given F(1)=0.3, what is Q(0.25)?',
            qDE: 'Das 0,25-Quantil von X ist das kleinste x mit F(x) ≥ 0,25. Gegeben F(1)=0,3, wie groß ist Q(0,25)?',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'F(1) = 0.3 ≥ 0.25 and 1 is the smallest such value, so Q(0.25) = 1.',
            hintDE: 'F(1) = 0,3 ≥ 0,25 und 1 ist der kleinste solche Wert, also Q(0,25) = 1.'
        },

        // ── 12. STETIGE ZUFALLSVARIABLE UND DICHTEFUNKTION (Continuous RV / PDF) ──

        {
            q: 'X has PDF f(x) = 2x for x ∈ [0,1], 0 otherwise. What is P(0 ≤ X ≤ 1)? (This must equal what value for f to be valid?)',
            qDE: 'X hat Dichtefunktion f(x) = 2x für x ∈ [0,1], sonst 0. Wie groß ist P(0 ≤ X ≤ 1)? (Welchen Wert muss dies für eine gültige Dichte ergeben?)',
            answer: 1, tolerance: 0.001, unit: '',
            hintEn: '∫₀¹ 2x dx = [x²]₀¹ = 1. A valid PDF must integrate to 1 over ℝ.',
            hintDE: '∫₀¹ 2x dx = [x²]₀¹ = 1. Eine gültige Dichtefunktion muss über ℝ auf 1 integrieren.'
        },
        {
            q: 'X has PDF f(x) = 2x for x ∈ [0,1]. What is P(0 ≤ X ≤ 0.5)? Enter as a decimal.',
            qDE: 'X hat Dichtefunktion f(x) = 2x für x ∈ [0,1]. Wie groß ist P(0 ≤ X ≤ 0,5)? Gib als Dezimalzahl ein.',
            answer: 0.25, tolerance: 0.001, unit: '',
            hintEn: '∫₀^0.5 2x dx = [x²]₀^0.5 = 0.25.',
            hintDE: '∫₀^0,5 2x dx = [x²]₀^0,5 = 0,25.'
        },
        {
            q: 'For a continuous RV, what is P(X = 3) (the probability of one exact value)?',
            qDE: 'Für eine stetige Zufallsvariable: Wie groß ist P(X = 3) (die Wahrscheinlichkeit eines exakten Wertes)?',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'For continuous RVs, P(X = c) = 0 for any single point c — the integral over a single point is 0.',
            hintDE: 'Bei stetigen ZV gilt P(X = c) = 0 für jeden einzelnen Punkt c — das Integral über einen Punkt ist 0.'
        },

        // ── 13. EXPONENTIALVERTEILUNG (Exponential Distribution CDF) ─────────────

        {
            q: 'X ~ Exp(λ=1). The CDF is F(x) = 1 − e^(−x). What is F(1)? Enter as a decimal rounded to 3 places. (Use e ≈ 2.718)',
            qDE: 'X ~ Exp(λ=1). Die Verteilungsfunktion ist F(x) = 1 − e^(−x). Wie groß ist F(1)? Gib auf 3 Stellen gerundet an. (e ≈ 2,718)',
            answer: 0.632, tolerance: 0.005, unit: '',
            hintEn: 'F(1) = 1 − e^(−1) = 1 − 1/e ≈ 1 − 0.368 = 0.632.',
            hintDE: 'F(1) = 1 − e^(−1) = 1 − 1/e ≈ 1 − 0,368 = 0,632.'
        },
        {
            q: 'X ~ Exp(λ=2). CDF: F(x) = 1 − e^(−2x) for x ≥ 0. What is P(X > 1)? Enter as a decimal rounded to 3 places. (e ≈ 2.718)',
            qDE: 'X ~ Exp(λ=2). Verteilungsfunktion: F(x) = 1 − e^(−2x) für x ≥ 0. Wie groß ist P(X > 1)? Gib auf 3 Stellen gerundet an. (e ≈ 2,718)',
            answer: 0.135, tolerance: 0.005, unit: '',
            hintEn: 'P(X > 1) = 1 − F(1) = e^(−2) ≈ 0.135.',
            hintDE: 'P(X > 1) = 1 − F(1) = e^(−2) ≈ 0,135.'
        },
        {
            q: 'X ~ Exp(λ). What is F(0), the CDF evaluated at x = 0?',
            qDE: 'X ~ Exp(λ). Wie groß ist F(0), die Verteilungsfunktion ausgewertet bei x = 0?',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'F(0) = 1 − e^(−λ·0) = 1 − e⁰ = 1 − 1 = 0. The distribution starts at 0.',
            hintDE: 'F(0) = 1 − e^(−λ·0) = 1 − e⁰ = 1 − 1 = 0. Die Verteilung beginnt bei 0.'
        },
       
    ],

    // ── WORLD 4 ─────────────────────────────────────────────────────────
    4: [


        // ── 1. DICHTETRANSFORMATIONSSATZ (Density Transformation Theorem) ─────────

        {
            q: 'X has PDF f_X(x) = 1 for x ∈ [0,1]. Y = 2X. What is the PDF f_Y(y) for y ∈ [0,2]? Enter the constant value of f_Y.',
            qDE: 'X hat Dichte f_X(x) = 1 für x ∈ [0,1]. Y = 2X. Wie groß ist die Dichte f_Y(y) für y ∈ [0,2]? Gib den konstanten Wert von f_Y ein.',
            answer: 0.5, tolerance: 0.001, unit: '',
            hintEn: 'For Y = aX: f_Y(y) = f_X(y/a) · (1/|a|) = 1 · (1/2) = 0.5.',
            hintDE: 'Für Y = aX: f_Y(y) = f_X(y/a) · (1/|a|) = 1 · (1/2) = 0,5.'
        },
        {
            q: 'X has PDF f_X(x) = 2x for x ∈ [0,1]. Y = 3X. What is f_Y(y) for y ∈ [0,3]? Enter the coefficient c where f_Y(y) = c·y.',
            qDE: 'X hat Dichte f_X(x) = 2x für x ∈ [0,1]. Y = 3X. Wie groß ist f_Y(y) für y ∈ [0,3]? Gib den Koeffizienten c an, sodass f_Y(y) = c·y.',
            answer: 0.222, tolerance: 0.005, unit: '',
            hintEn: 'f_Y(y) = f_X(y/3) · (1/3) = 2(y/3) · (1/3) = 2y/9 ≈ 0.222·y.',
            hintDE: 'f_Y(y) = f_X(y/3) · (1/3) = 2(y/3) · (1/3) = 2y/9 ≈ 0,222·y.'
        },
        {
            q: 'X ~ Uniform[0,1]. Y = X². The transformation theorem gives f_Y(y) = 1/(2√y) for y ∈ [0,1]. What is f_Y(0.25)? Enter as a decimal.',
            qDE: 'X ~ Gleichverteilt[0,1]. Y = X². Der Transformationssatz liefert f_Y(y) = 1/(2√y) für y ∈ [0,1]. Wie groß ist f_Y(0,25)? Gib als Dezimalzahl ein.',
            answer: 1.0, tolerance: 0.01, unit: '',
            hintEn: 'f_Y(0.25) = 1 / (2√0.25) = 1 / (2 · 0.5) = 1 / 1 = 1.',
            hintDE: 'f_Y(0,25) = 1 / (2√0,25) = 1 / (2 · 0,5) = 1 / 1 = 1.'
        },

        // ── 2. UNABHÄNGIGKEIT VON ZUFALLSVARIABLEN ────────────────────────────────

        {
            q: 'X and Y are independent. P(X=1)=0.4, P(Y=1)=0.5. What is P(X=1, Y=1)? Enter as a decimal.',
            qDE: 'X und Y sind unabhängig. P(X=1)=0,4, P(Y=1)=0,5. Wie groß ist P(X=1, Y=1)? Gib als Dezimalzahl ein.',
            answer: 0.2, tolerance: 0.001, unit: '',
            hintEn: 'Independence: P(X=1, Y=1) = P(X=1) · P(Y=1) = 0.4 × 0.5.',
            hintDE: 'Unabhängigkeit: P(X=1, Y=1) = P(X=1) · P(Y=1) = 0,4 × 0,5.'
        },
        {
            q: 'X and Y are independent with PDFs f_X and f_Y. The joint PDF is f_{X,Y}(x,y) = f_X(x) · f_Y(y). If f_X(x)=2x on [0,1] and f_Y(y)=1 on [0,1], what is f_{X,Y}(0.5, 0.5)?',
            qDE: 'X und Y sind unabhängig. Die gemeinsame Dichte ist f_{X,Y}(x,y) = f_X(x) · f_Y(y). Wenn f_X(x)=2x auf [0,1] und f_Y(y)=1 auf [0,1], wie groß ist f_{X,Y}(0,5; 0,5)?',
            answer: 1.0, tolerance: 0.001, unit: '',
            hintEn: 'f_{X,Y}(0.5, 0.5) = f_X(0.5) · f_Y(0.5) = 2(0.5) · 1 = 1.',
            hintDE: 'f_{X,Y}(0,5; 0,5) = f_X(0,5) · f_Y(0,5) = 2(0,5) · 1 = 1.'
        },
        {
            q: 'X and Y are independent. E[X]=3, E[Y]=4. What is E[X·Y]? Enter a whole number.',
            qDE: 'X und Y sind unabhängig. E[X]=3, E[Y]=4. Wie groß ist E[X·Y]? Gib eine ganze Zahl ein.',
            answer: 12, tolerance: 0, unit: '',
            hintEn: 'For independent RVs: E[X·Y] = E[X] · E[Y] = 3 × 4 = 12.',
            hintDE: 'Für unabhängige ZV: E[X·Y] = E[X] · E[Y] = 3 × 4 = 12.'
        },

        // ── 3. KONTINGENZTABELLE FÜR UNABHÄNGIGKEIT ──────────────────────────────

        {
            q: 'A contingency table gives P(X=0,Y=0)=0.12, P(X=0)=0.4, P(Y=0)=0.3. Does P(X=0,Y=0) = P(X=0)·P(Y=0)? Enter 1 for yes (independent), 0 for no.',
            qDE: 'Eine Kontingenztabelle gibt P(X=0,Y=0)=0,12, P(X=0)=0,4, P(Y=0)=0,3. Gilt P(X=0,Y=0) = P(X=0)·P(Y=0)? Gib 1 für ja (unabhängig), 0 für nein ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'P(X=0)·P(Y=0) = 0.4 × 0.3 = 0.12 = P(X=0, Y=0) ✓ Independent.',
            hintDE: 'P(X=0)·P(Y=0) = 0,4 × 0,3 = 0,12 = P(X=0, Y=0) ✓ Unabhängig.'
        },
        {
            q: 'A contingency table gives P(X=1,Y=1)=0.3, P(X=1)=0.5, P(Y=1)=0.5. Are X and Y independent? Enter 1 for yes, 0 for no.',
            qDE: 'Eine Kontingenztabelle gibt P(X=1,Y=1)=0,3, P(X=1)=0,5, P(Y=1)=0,5. Sind X und Y unabhängig? Gib 1 für ja, 0 für nein ein.',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'P(X=1)·P(Y=1) = 0.5 × 0.5 = 0.25 ≠ 0.3. Not independent.',
            hintDE: 'P(X=1)·P(Y=1) = 0,5 × 0,5 = 0,25 ≠ 0,3. Nicht unabhängig.'
        },
        {
            q: 'In a 2×2 contingency table, P(X=0)=0.6, P(Y=1)=0.4. If X and Y are independent, what must P(X=0, Y=1) equal? Enter as a decimal.',
            qDE: 'In einer 2×2-Kontingenztabelle: P(X=0)=0,6, P(Y=1)=0,4. Wenn X und Y unabhängig sind, welchen Wert muss P(X=0, Y=1) haben? Gib als Dezimalzahl ein.',
            answer: 0.24, tolerance: 0.001, unit: '',
            hintEn: 'Independence criterion: P(X=0, Y=1) = P(X=0) · P(Y=1) = 0.6 × 0.4.',
            hintDE: 'Unabhängigkeitskriterium: P(X=0, Y=1) = P(X=0) · P(Y=1) = 0,6 × 0,4.'
        },

        // ── 4. KRITERIUM FÜR UNABHÄNGIGKEIT ──────────────────────────────────────

        {
            q: 'For X and Y to be independent, the joint PMF must equal what? Enter 1 for p(x,y)=p_X(x)·p_Y(y), or 2 for p(x,y)=p_X(x)+p_Y(y).',
            qDE: 'Damit X und Y unabhängig sind, muss die gemeinsame Verteilung was erfüllen? Gib 1 für p(x,y)=p_X(x)·p_Y(y) oder 2 für p(x,y)=p_X(x)+p_Y(y) ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Independence criterion: the joint probability equals the product of the marginals.',
            hintDE: 'Unabhängigkeitskriterium: die gemeinsame Wahrscheinlichkeit ist gleich dem Produkt der Randwahrscheinlichkeiten.'
        },
        {
            q: 'p_X(0)=0.5, p_X(1)=0.5, p_Y(0)=0.4, p_Y(1)=0.6. If independent, what is p(X=1, Y=0)? Enter as a decimal.',
            qDE: 'p_X(0)=0,5, p_X(1)=0,5, p_Y(0)=0,4, p_Y(1)=0,6. Bei Unabhängigkeit: Wie groß ist p(X=1, Y=0)? Gib als Dezimalzahl ein.',
            answer: 0.2, tolerance: 0.001, unit: '',
            hintEn: 'p(X=1, Y=0) = p_X(1) · p_Y(0) = 0.5 × 0.4 = 0.2.',
            hintDE: 'p(X=1, Y=0) = p_X(1) · p_Y(0) = 0,5 × 0,4 = 0,2.'
        },
        {
            q: 'To verify independence from a contingency table with values p(0,0)=0.2, p(0,1)=0.3, p(1,0)=0.2, p(1,1)=0.3, first find p_X(0). Enter as a decimal.',
            qDE: 'Zur Unabhängigkeitsprüfung einer Kontingenztabelle mit p(0,0)=0,2, p(0,1)=0,3, p(1,0)=0,2, p(1,1)=0,3: Bestimme zuerst p_X(0). Gib als Dezimalzahl ein.',
            answer: 0.5, tolerance: 0.001, unit: '',
            hintEn: 'Marginal: p_X(0) = p(0,0) + p(0,1) = 0.2 + 0.3 = 0.5.',
            hintDE: 'Randverteilung: p_X(0) = p(0,0) + p(0,1) = 0,2 + 0,3 = 0,5.'
        },

        // ── 5. STANDARDNORMALVERTEILUNG ───────────────────────────────────────────

        {
            q: 'Z ~ N(0,1). Using the standard normal table: Φ(1.0) ≈ 0.841. What is P(Z ≤ 1.0)? Enter as a decimal.',
            qDE: 'Z ~ N(0,1). Aus der Standardnormaltabelle: Φ(1,0) ≈ 0,841. Wie groß ist P(Z ≤ 1,0)? Gib als Dezimalzahl ein.',
            answer: 0.841, tolerance: 0.001, unit: '',
            hintEn: 'Φ(z) = P(Z ≤ z) by definition. P(Z ≤ 1) = Φ(1) ≈ 0.841.',
            hintDE: 'Φ(z) = P(Z ≤ z) per Definition. P(Z ≤ 1) = Φ(1) ≈ 0,841.'
        },
        {
            q: 'Z ~ N(0,1). Φ(1.0) ≈ 0.841. What is P(Z > 1.0)? Enter as a decimal.',
            qDE: 'Z ~ N(0,1). Φ(1,0) ≈ 0,841. Wie groß ist P(Z > 1,0)? Gib als Dezimalzahl ein.',
            answer: 0.159, tolerance: 0.002, unit: '',
            hintEn: 'P(Z > 1) = 1 − Φ(1) = 1 − 0.841 = 0.159.',
            hintDE: 'P(Z > 1) = 1 − Φ(1) = 1 − 0,841 = 0,159.'
        },
        {
            q: 'Z ~ N(0,1). Using symmetry Φ(−z) = 1 − Φ(z) and Φ(1.0) ≈ 0.841. What is P(−1 ≤ Z ≤ 1)? Enter as a decimal.',
            qDE: 'Z ~ N(0,1). Mit Φ(−z) = 1 − Φ(z) und Φ(1,0) ≈ 0,841. Wie groß ist P(−1 ≤ Z ≤ 1)? Gib als Dezimalzahl ein.',
            answer: 0.682, tolerance: 0.002, unit: '',
            hintEn: 'P(−1 ≤ Z ≤ 1) = Φ(1) − Φ(−1) = 0.841 − (1−0.841) = 0.841 − 0.159 = 0.682.',
            hintDE: 'P(−1 ≤ Z ≤ 1) = Φ(1) − Φ(−1) = 0,841 − (1−0,841) = 0,841 − 0,159 = 0,682.'
        },

        // ── 6. ERWARTUNGSWERT DISKRET UND STETIG ──────────────────────────────────

        {
            q: 'X has PMF: P(X=1)=0.2, P(X=2)=0.5, P(X=3)=0.3. What is E[X]? Enter as a decimal.',
            qDE: 'X hat Zähldichte: P(X=1)=0,2, P(X=2)=0,5, P(X=3)=0,3. Wie groß ist E[X]? Gib als Dezimalzahl ein.',
            answer: 2.1, tolerance: 0.001, unit: '',
            hintEn: 'E[X] = 1·0.2 + 2·0.5 + 3·0.3 = 0.2 + 1.0 + 0.9 = 2.1.',
            hintDE: 'E[X] = 1·0,2 + 2·0,5 + 3·0,3 = 0,2 + 1,0 + 0,9 = 2,1.'
        },
        {
            q: 'X has PDF f(x) = 2x for x ∈ [0,1]. What is E[X]? Enter as a decimal.',
            qDE: 'X hat Dichtefunktion f(x) = 2x für x ∈ [0,1]. Wie groß ist E[X]? Gib als Dezimalzahl ein.',
            answer: 0.667, tolerance: 0.005, unit: '',
            hintEn: 'E[X] = ∫₀¹ x · 2x dx = ∫₀¹ 2x² dx = [2x³/3]₀¹ = 2/3 ≈ 0.667.',
            hintDE: 'E[X] = ∫₀¹ x · 2x dx = ∫₀¹ 2x² dx = [2x³/3]₀¹ = 2/3 ≈ 0,667.'
        },
        {
            q: 'A fair die is rolled. What is E[X]? Enter as a decimal.',
            qDE: 'Ein fairer Würfel wird geworfen. Wie groß ist E[X]? Gib als Dezimalzahl ein.',
            answer: 3.5, tolerance: 0.001, unit: '',
            hintEn: 'E[X] = (1+2+3+4+5+6)/6 = 21/6 = 3.5.',
            hintDE: 'E[X] = (1+2+3+4+5+6)/6 = 21/6 = 3,5.'
        },

        // ── 7. BERNOULLI VERTEILUNG ───────────────────────────────────────────────

        {
            q: 'X ~ Bernoulli(p=0.3). What is E[X]? Enter as a decimal.',
            qDE: 'X ~ Bernoulli(p=0,3). Wie groß ist E[X]? Gib als Dezimalzahl ein.',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'For X ~ Bernoulli(p): E[X] = p = 0.3.',
            hintDE: 'Für X ~ Bernoulli(p): E[X] = p = 0,3.'
        },
        {
            q: 'X ~ Bernoulli(p=0.7). What is Var(X)? Enter as a decimal.',
            qDE: 'X ~ Bernoulli(p=0,7). Wie groß ist Var(X)? Gib als Dezimalzahl ein.',
            answer: 0.21, tolerance: 0.001, unit: '',
            hintEn: 'Var(X) = p(1−p) = 0.7 × 0.3 = 0.21.',
            hintDE: 'Var(X) = p(1−p) = 0,7 × 0,3 = 0,21.'
        },
        {
            q: 'X ~ Bernoulli(p). X only takes values 0 and 1. What is P(X=1)? Enter 1 for p, 2 for 1−p, 3 for p².',
            qDE: 'X ~ Bernoulli(p). X nimmt nur Werte 0 und 1 an. Wie groß ist P(X=1)? Gib 1 für p, 2 für 1−p, 3 für p² ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'By definition of the Bernoulli distribution: P(X=1) = p.',
            hintDE: 'Per Definition der Bernoulli-Verteilung: P(X=1) = p.'
        },

        // ── 8. ERWARTUNGSWERT RECHENREGELN ────────────────────────────────────────

        {
            q: 'E[X]=3. What is E[2X + 5]? Enter a whole number.',
            qDE: 'E[X]=3. Wie groß ist E[2X + 5]? Gib eine ganze Zahl ein.',
            answer: 11, tolerance: 0, unit: '',
            hintEn: 'Linearity: E[2X+5] = 2·E[X] + 5 = 2·3 + 5 = 11.',
            hintDE: 'Linearität: E[2X+5] = 2·E[X] + 5 = 2·3 + 5 = 11.'
        },
        {
            q: 'E[X]=2, E[Y]=4. What is E[3X − Y + 1]? Enter a whole number.',
            qDE: 'E[X]=2, E[Y]=4. Wie groß ist E[3X − Y + 1]? Gib eine ganze Zahl ein.',
            answer: 3, tolerance: 0, unit: '',
            hintEn: 'Linearity: E[3X − Y + 1] = 3·2 − 4 + 1 = 6 − 4 + 1 = 3.',
            hintDE: 'Linearität: E[3X − Y + 1] = 3·2 − 4 + 1 = 6 − 4 + 1 = 3.'
        },
        {
            q: 'f is convex. Jensen\'s inequality states E[f(X)] ≥ f(E[X]). If f(x)=x², E[X]=3, E[X²]=14. Does E[X²] ≥ (E[X])²? Enter 1 for yes, 0 for no.',
            qDE: 'f ist konvex. Die Jensen-Ungleichung besagt E[f(X)] ≥ f(E[X]). Wenn f(x)=x², E[X]=3, E[X²]=14. Gilt E[X²] ≥ (E[X])²? Gib 1 für ja, 0 für nein ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: '(E[X])² = 9, E[X²] = 14 ≥ 9 ✓. Jensen holds for convex f.',
            hintDE: '(E[X])² = 9, E[X²] = 14 ≥ 9 ✓. Jensen gilt für konvexes f.'
        },

        // ── 9. PRODUKTEIGENSCHAFT FÜR UNABHÄNGIGE ZV ─────────────────────────────

        {
            q: 'X and Y are independent. E[X]=5, E[Y]=3. What is E[X·Y]? Enter a whole number.',
            qDE: 'X und Y sind unabhängig. E[X]=5, E[Y]=3. Wie groß ist E[X·Y]? Gib eine ganze Zahl ein.',
            answer: 15, tolerance: 0, unit: '',
            hintEn: 'For independent X, Y: E[XY] = E[X]·E[Y] = 5·3 = 15.',
            hintDE: 'Für unabhängige X, Y: E[XY] = E[X]·E[Y] = 5·3 = 15.'
        },
        {
            q: 'X and Y are independent with E[X]=2, E[Y]=6, E[X²]=5. What is E[X²·Y]? Enter a whole number.',
            qDE: 'X und Y sind unabhängig mit E[X]=2, E[Y]=6, E[X²]=5. Wie groß ist E[X²·Y]? Gib eine ganze Zahl ein.',
            answer: 30, tolerance: 0, unit: '',
            hintEn: 'g(X)=X² and Y are also independent: E[X²·Y] = E[X²]·E[Y] = 5·6 = 30.',
            hintDE: 'g(X)=X² und Y sind ebenfalls unabhängig: E[X²·Y] = E[X²]·E[Y] = 5·6 = 30.'
        },
        {
            q: 'X and Y are NOT independent and E[X]=2, E[Y]=3. Can we conclude E[XY]=6? Enter 1 for yes, 0 for no.',
            qDE: 'X und Y sind NICHT unabhängig und E[X]=2, E[Y]=3. Können wir E[XY]=6 schlussfolgern? Gib 1 für ja, 0 für nein ein.',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'E[XY] = E[X]·E[Y] holds only for independent RVs. Without independence we cannot conclude this.',
            hintDE: 'E[XY] = E[X]·E[Y] gilt nur für unabhängige ZV. Ohne Unabhängigkeit können wir das nicht schlussfolgern.'
        },

        // ── 10. VARIANZ UND STANDARDABWEICHUNG ───────────────────────────────────

        {
            q: 'X has E[X]=4, E[X²]=20. What is Var(X)? Enter a whole number.',
            qDE: 'X hat E[X]=4, E[X²]=20. Wie groß ist Var(X)? Gib eine ganze Zahl ein.',
            answer: 4, tolerance: 0, unit: '',
            hintEn: 'Var(X) = E[X²] − (E[X])² = 20 − 16 = 4.',
            hintDE: 'Var(X) = E[X²] − (E[X])² = 20 − 16 = 4.'
        },
        {
            q: 'Var(X) = 9. What is the standard deviation σ(X)? Enter a whole number.',
            qDE: 'Var(X) = 9. Wie groß ist die Standardabweichung σ(X)? Gib eine ganze Zahl ein.',
            answer: 3, tolerance: 0, unit: '',
            hintEn: 'σ(X) = √Var(X) = √9 = 3.',
            hintDE: 'σ(X) = √Var(X) = √9 = 3.'
        },
        {
            q: 'X has PMF P(X=0)=0.5, P(X=2)=0.5. What is Var(X)? Enter a whole number.',
            qDE: 'X hat Zähldichte P(X=0)=0,5, P(X=2)=0,5. Wie groß ist Var(X)? Gib eine ganze Zahl ein.',
            answer: 1, tolerance: 0.001, unit: '',
            hintEn: 'E[X]=1, E[X²]=0·0.5+4·0.5=2. Var(X)=2−1²=1.',
            hintDE: 'E[X]=1, E[X²]=0·0,5+4·0,5=2. Var(X)=2−1²=1.'
        },

        // ── 11. VERSCHIEBUNGSSATZ (Computational Formula for Variance) ────────────

        {
            q: 'E[X]=5, E[X²]=30. Use the shift theorem: Var(X) = E[X²] − (E[X])². What is Var(X)?',
            qDE: 'E[X]=5, E[X²]=30. Verwende den Verschiebungssatz: Var(X) = E[X²] − (E[X])². Wie groß ist Var(X)?',
            answer: 5, tolerance: 0, unit: '',
            hintEn: 'Var(X) = 30 − 5² = 30 − 25 = 5.',
            hintDE: 'Var(X) = 30 − 5² = 30 − 25 = 5.'
        },
        {
            q: 'E[X]=3, Var(X)=7. Using the shift theorem, what is E[X²]?',
            qDE: 'E[X]=3, Var(X)=7. Wie groß ist E[X²] nach dem Verschiebungssatz?',
            answer: 16, tolerance: 0, unit: '',
            hintEn: 'E[X²] = Var(X) + (E[X])² = 7 + 9 = 16.',
            hintDE: 'E[X²] = Var(X) + (E[X])² = 7 + 9 = 16.'
        },
        {
            q: 'X ~ Bernoulli(0.4). E[X]=0.4, E[X²]=0.4 (since X²=X for 0/1 values). What is Var(X) by the shift theorem?',
            qDE: 'X ~ Bernoulli(0,4). E[X]=0,4, E[X²]=0,4 (da X²=X für 0/1-Werte). Wie groß ist Var(X) nach dem Verschiebungssatz?',
            answer: 0.24, tolerance: 0.001, unit: '',
            hintEn: 'Var(X) = E[X²] − (E[X])² = 0.4 − 0.16 = 0.24.',
            hintDE: 'Var(X) = E[X²] − (E[X])² = 0,4 − 0,16 = 0,24.'
        },

        // ── 12. RECHENREGELN FÜR VARIANZ ─────────────────────────────────────────

        {
            q: 'Var(X)=4. What is Var(3X)? Enter a whole number.',
            qDE: 'Var(X)=4. Wie groß ist Var(3X)? Gib eine ganze Zahl ein.',
            answer: 36, tolerance: 0, unit: '',
            hintEn: 'Var(aX) = a²·Var(X) = 9·4 = 36.',
            hintDE: 'Var(aX) = a²·Var(X) = 9·4 = 36.'
        },
        {
            q: 'Var(X)=4. What is Var(X + 7)? Enter a whole number.',
            qDE: 'Var(X)=4. Wie groß ist Var(X + 7)? Gib eine ganze Zahl ein.',
            answer: 4, tolerance: 0, unit: '',
            hintEn: 'Adding a constant does not change variance: Var(X+c) = Var(X) = 4.',
            hintDE: 'Eine Konstante addieren ändert die Varianz nicht: Var(X+c) = Var(X) = 4.'
        },
        {
            q: 'X and Y are independent with Var(X)=3, Var(Y)=5. What is Var(X+Y)?',
            qDE: 'X und Y sind unabhängig mit Var(X)=3, Var(Y)=5. Wie groß ist Var(X+Y)?',
            answer: 8, tolerance: 0, unit: '',
            hintEn: 'For independent X, Y: Var(X+Y) = Var(X) + Var(Y) = 3 + 5 = 8.',
            hintDE: 'Für unabhängige X, Y: Var(X+Y) = Var(X) + Var(Y) = 3 + 5 = 8.'
        },

        // ── 13. TRANSFORMATIONSSATZ FÜR ERWARTUNGSWERT ───────────────────────────

        {
            q: 'X has PMF P(X=1)=0.4, P(X=2)=0.6. What is E[X²]? Enter as a decimal.',
            qDE: 'X hat Zähldichte P(X=1)=0,4, P(X=2)=0,6. Wie groß ist E[X²]? Gib als Dezimalzahl ein.',
            answer: 3.2, tolerance: 0.001, unit: '',
            hintEn: 'E[g(X)] = Σ g(x)·p(x). E[X²] = 1²·0.4 + 2²·0.6 = 0.4 + 2.4 = 2.8. Wait — 4·0.6=2.4, 1·0.4=0.4 → 2.8.',
            hintDE: 'E[g(X)] = Σ g(x)·p(x). E[X²] = 1²·0,4 + 2²·0,6 = 0,4 + 2,4 = 2,8.'
        },
        {
            q: 'X has PMF P(X=0)=0.3, P(X=1)=0.5, P(X=2)=0.2. What is E[X²]? Enter as a decimal.',
            qDE: 'X hat Zähldichte P(X=0)=0,3, P(X=1)=0,5, P(X=2)=0,2. Wie groß ist E[X²]? Gib als Dezimalzahl ein.',
            answer: 1.3, tolerance: 0.001, unit: '',
            hintEn: 'E[X²] = 0²·0.3 + 1²·0.5 + 2²·0.2 = 0 + 0.5 + 0.8 = 1.3.',
            hintDE: 'E[X²] = 0²·0,3 + 1²·0,5 + 2²·0,2 = 0 + 0,5 + 0,8 = 1,3.'
        },
        {
            q: 'X ~ Uniform[0,1]. Using the transformation theorem, E[X²] = ∫₀¹ x²·1 dx. What is E[X²]? Enter as a decimal rounded to 3 places.',
            qDE: 'X ~ Gleichverteilt[0,1]. Mit dem Transformationssatz: E[X²] = ∫₀¹ x²·1 dx. Wie groß ist E[X²]? Gib auf 3 Dezimalstellen gerundet an.',
            answer: 0.333, tolerance: 0.002, unit: '',
            hintEn: '∫₀¹ x² dx = [x³/3]₀¹ = 1/3 ≈ 0.333.',
            hintDE: '∫₀¹ x² dx = [x³/3]₀¹ = 1/3 ≈ 0,333.'
        },

        // ── 14. BINOMIALVERTEILUNG ────────────────────────────────────────────────

        {
            q: 'X ~ Bin(n=5, p=0.5). What is E[X]? Enter as a decimal.',
            qDE: 'X ~ Bin(n=5, p=0,5). Wie groß ist E[X]? Gib als Dezimalzahl ein.',
            answer: 2.5, tolerance: 0.001, unit: '',
            hintEn: 'E[X] = n·p = 5·0.5 = 2.5.',
            hintDE: 'E[X] = n·p = 5·0,5 = 2,5.'
        },
        {
            q: 'X ~ Bin(n=4, p=0.5). What is P(X=2)? Enter as a decimal.',
            qDE: 'X ~ Bin(n=4, p=0,5). Wie groß ist P(X=2)? Gib als Dezimalzahl ein.',
            answer: 0.375, tolerance: 0.002, unit: '',
            hintEn: 'P(X=2) = C(4,2)·0.5²·0.5² = 6·0.0625 = 0.375.',
            hintDE: 'P(X=2) = C(4,2)·0,5²·0,5² = 6·0,0625 = 0,375.'
        },
        {
            q: 'X ~ Bin(n=10, p=0.3). What is Var(X)? Enter as a decimal.',
            qDE: 'X ~ Bin(n=10, p=0,3). Wie groß ist Var(X)? Gib als Dezimalzahl ein.',
            answer: 2.1, tolerance: 0.001, unit: '',
            hintEn: 'Var(X) = n·p·(1−p) = 10·0.3·0.7 = 2.1.',
            hintDE: 'Var(X) = n·p·(1−p) = 10·0,3·0,7 = 2,1.'
        },

        // ── 15. FALTUNG BEI BINOMIALVERTEILUNG (Convolution) ─────────────────────

        {
            q: 'X ~ Bin(3, 0.4) and Y ~ Bin(2, 0.4) are independent. What is the distribution of X+Y? Enter n for Bin(n, 0.4).',
            qDE: 'X ~ Bin(3; 0,4) und Y ~ Bin(2; 0,4) sind unabhängig. Welche Verteilung hat X+Y? Gib n für Bin(n; 0,4) ein.',
            answer: 5, tolerance: 0, unit: '',
            hintEn: 'Convolution of binomials with same p: Bin(3,0.4) * Bin(2,0.4) = Bin(5, 0.4).',
            hintDE: 'Faltung von Binomialverteilungen mit gleichem p: Bin(3;0,4) * Bin(2;0,4) = Bin(5; 0,4).'
        },
        {
            q: 'X ~ Bin(4, 0.6) and Y ~ Bin(6, 0.6) are independent. E[X+Y] = ? Enter a whole number.',
            qDE: 'X ~ Bin(4; 0,6) und Y ~ Bin(6; 0,6) sind unabhängig. E[X+Y] = ? Gib eine ganze Zahl ein.',
            answer: 6, tolerance: 0, unit: '',
            hintEn: 'X+Y ~ Bin(10, 0.6). E[X+Y] = 10·0.6 = 6.',
            hintDE: 'X+Y ~ Bin(10; 0,6). E[X+Y] = 10·0,6 = 6.'
        },
        {
            q: 'X ~ Bin(n, p) and Y ~ Bin(m, p) are independent. X+Y follows Bin(?, p). Enter the first parameter.',
            qDE: 'X ~ Bin(n, p) und Y ~ Bin(m, p) sind unabhängig. X+Y folgt Bin(?, p). Gib den ersten Parameter ein.',
            answer: 0, tolerance: 0, unit: '= n + m',
            hintEn: 'The convolution of two binomials with the same p gives Bin(n+m, p).',
            hintDE: 'Die Faltung zweier Binomialverteilungen mit gleichem p ergibt Bin(n+m, p).'
        },

        // ── 16. URNENMODELL OHNE REIHENFOLGE OHNE ZURÜCKLEGEN ────────────────────

        {
            q: 'An urn has 6 balls. How many ways can you choose 2 balls without replacement, ignoring order? (i.e. C(6,2))',
            qDE: 'Eine Urne hat 6 Bälle. Wie viele Möglichkeiten gibt es, 2 Bälle ohne Zurücklegen zu ziehen, Reihenfolge egal? (d.h. C(6,2))',
            answer: 15, tolerance: 0, unit: 'ways',
            hintEn: 'C(6,2) = 6! / (2! · 4!) = 15.',
            hintDE: 'C(6,2) = 6! / (2! · 4!) = 15.'
        },
        {
            q: 'An urn has 10 balls: 4 red, 6 blue. Two balls are drawn without replacement, order ignored. How many ways give 2 red balls?',
            qDE: 'Eine Urne hat 10 Bälle: 4 rote, 6 blaue. Zwei Bälle werden ohne Zurücklegen gezogen, Reihenfolge egal. Wie viele Möglichkeiten liefern 2 rote Bälle?',
            answer: 6, tolerance: 0, unit: 'ways',
            hintEn: 'C(4,2) = 4! / (2!·2!) = 6.',
            hintDE: 'C(4,2) = 4! / (2!·2!) = 6.'
        },
        {
            q: 'Urn: 5 red, 5 blue balls; draw 3 without replacement, order ignored. Total outcomes = C(10,3) = 120. How many outcomes have exactly 2 red balls?',
            qDE: 'Urne: 5 rote, 5 blaue Bälle; 3 ohne Zurücklegen ziehen, Reihenfolge egal. Gesamtergebnisse = C(10,3) = 120. Wie viele Ergebnisse haben genau 2 rote Bälle?',
            answer: 50, tolerance: 0, unit: 'outcomes',
            hintEn: 'C(5,2)·C(5,1) = 10·5 = 50.',
            hintDE: 'C(5,2)·C(5,1) = 10·5 = 50.'
        },

        // ── 17. URNENMODELL OHNE REIHENFOLGE MIT ZURÜCKLEGEN ─────────────────────

        {
            q: 'An urn has 4 balls. You draw 2 with replacement, ignoring order. How many distinct multisets (unordered outcomes) are possible?',
            qDE: 'Eine Urne hat 4 Bälle. Du ziehst 2 mit Zurücklegen, Reihenfolge egal. Wie viele verschiedene Multimengen (ungeordnete Ergebnisse) sind möglich?',
            answer: 10, tolerance: 0, unit: 'outcomes',
            hintEn: 'With replacement, no order: C(n+k−1, k) = C(4+2−1, 2) = C(5,2) = 10.',
            hintDE: 'Mit Zurücklegen, ohne Reihenfolge: C(n+k−1, k) = C(4+2−1, 2) = C(5,2) = 10.'
        },
        {
            q: 'An urn has 3 colours. You draw 3 times with replacement, order ignored. How many distinct colour combinations are possible?',
            qDE: 'Eine Urne hat 3 Farben. Du ziehst 3 Mal mit Zurücklegen, Reihenfolge egal. Wie viele verschiedene Farbkombinationen sind möglich?',
            answer: 10, tolerance: 0, unit: 'combinations',
            hintEn: 'C(n+k−1, k) = C(3+3−1, 3) = C(5,3) = 10.',
            hintDE: 'C(n+k−1, k) = C(3+3−1, 3) = C(5,3) = 10.'
        },
        {
            q: 'Urn with replacement, no order: n=5 balls, draw k=2. How many unordered outcomes? C(n+k−1, k) = C(6,2) = ?',
            qDE: 'Urne mit Zurücklegen, ohne Reihenfolge: n=5 Bälle, k=2 Züge. Wie viele ungeordnete Ergebnisse? C(n+k−1, k) = C(6,2) = ?',
            answer: 15, tolerance: 0, unit: 'outcomes',
            hintEn: 'C(6,2) = 6! / (2!·4!) = 15.',
            hintDE: 'C(6,2) = 6! / (2!·4!) = 15.'
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

        {
            q: 'Cov(X,Y) = 6, Var(X) = 9, Var(Y) = 16. What is the correlation coefficient r? Round to 2 decimal places.',
            qDE: 'Cov(X,Y) = 6, Var(X) = 9, Var(Y) = 16. Wie groß ist der Korrelationskoeffizient r? Auf 2 Dezimalstellen gerundet.',
            answer: 0.5, tolerance: 0.01, unit: '',
            hintEn: 'r = Cov(X,Y) / (σX · σY) = 6 / (3 × 4) = 6/12 = 0.5.',
            hintDE: 'r = Cov(X,Y) / (σX · σY) = 6 / (3 × 4) = 6/12 = 0,5.'
        },
    ],
};

// worldOfGi(gi) — returns which world pool (1-based) to use for this gi.
function worldOfGi(gi) {
    for (let wi = WORLDS.length - 1; wi >= 0; wi--) {
        if (WORLDS[wi].data.length > 0 && gi >= WORLD_START_GI[wi]) return wi + 1;
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
            trackEvent('math_gate_passed', {
            level_id: `${cur ? cur.world + '-' + cur.li : '?'}`,
            gate_gi: pendingGateGi,
            attempts: gateAttempts + 1,
            });
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