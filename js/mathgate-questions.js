


// Probability Gate Question Pool


const MATH_GATE_POOLS = {

    // WORLD 1
    // 
    1: [

        //1. ERGEBNISMENGE (Sample Space) 

        {
            q: 'A six-sided fair die is rolled once. How many elements does the sample space Ω contain?',
            qDE: 'Ein sechsseitiger fairer Würfel wird einmal geworfen. Wie viele Elemente enthält die Ergebnismenge Ω?',
            answer: 6, tolerance: 0, unit: 'elements',
            hintEn: 'Ω = {1, 2, 3, 4, 5, 6}',
            hintDE: 'Ω = {1, 2, 3, 4, 5, 6}'
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
            hintEn: 'In total there are 30 balls in the bag.',
            hintDE: 'Insgesamt sind 10 Bälle in dem Beutel.'
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
            q: 'P(A) = 0.3 and P(B) = 0.5. A and B are disjoint. What is P(A ∪ B)?',
            qDE: 'P(A) = 0,3 und P(B) = 0,5. A und B sind disjunkt. Wie groß ist P(A ∪ B)?',
            answer: 0.8, tolerance: 0.001, unit: '',
            hintEn: 'P(A ∪ B) = P(A) + P(B) for disjoint events',
            hintDE: 'P(A ∪ B) = P(A) + P(B) für disjunkte Ereignisse'
        },
        {
            q: 'A and B are disjoint and P(A ∪ B) = 0.7. If P(A) = 0.4, what is P(B)?',
            qDE: 'A und B sind disjunkt und P(A ∪ B) = 0,7. Falls P(A) = 0,4, was ist P(B)?',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'P(B) = P(A ∪ B) − P(A) for disjoint events',
            hintDE: 'P(B) = P(A ∪ B) − P(A) für disjunkte Ereignisse'
        },
        {
            q: 'If A and B are disjoint, what is P(A ∩ B)?',
            qDE: 'Wenn A und B disjunkt sind, was ist P(A ∩ B)?',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'Disjoint means A ∩ B = ∅.',
            hintDE: 'Disjunkt bedeutet A ∩ B = ∅'
        },

        // ── 5. EREIGNISALGEBRA / POTENZMENGE (Event Algebra / Power Set) ─────────

        {
            q: 'Ω = {1, 2, 3}. How many elements does the power set Pot(Ω) contain?',
            qDE: 'Ω = {1, 2, 3}. Wie viele Elemente enthält die Potenzmenge Pot(Ω)?',
            answer: 8, tolerance: 0, unit: 'elements',
            hintEn: 'The power set contains all possible subsets.',
            hintDE: 'Die Potenzmenge enthält alle möglichen Teilmengen.'
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
            q: 'A fair six-sided die is rolled. How many elementary events does the sample space contain?',
            qDE: 'Ein fairer sechsseitiger Würfel wird geworfen. Wie viele Elementarereignisse enthält die Ergebnismenge?',
            answer: 6, tolerance: 0, unit: 'elementary events',
            hintEn: 'Each face {1}, {2}, …, {6} is one elementary event.',
            hintDE: 'Jede Seite {1}, {2}, …, {6} ist ein Elementarereignis.'
        },
        {
            q: 'In a Laplace experiment with 8 equally likely elementary events, what is the probability of each elementary event? Enter as a decimal.',
            qDE: 'Betrachte ein Laplace-Experiment mit 8 gleich wahrscheinlichen Elementarereignissen. Wie groß ist die Wahrscheinlichkeit jedes Elementarereignisses? Gib als Dezimalzahl ein.',
            answer: 0.125, tolerance: 0.001, unit: '',
            hintEn: 'In a Laplace experiment the probability measure is the discrete uniform distribution.',
            hintDE: 'In einem Laplace-Experiment ist das Wahrscheinlichkeitsmaß die diskrete Gleichverteilung.'
        },


        // ── 7. SCHNITT UND VEREINIGUNG (Intersection and Union) ──────────────────

        {
            q: 'P(A) = 0.5, P(B) = 0.4, P(A ∩ B) = 0.2. What is P(A ∪ B)?',
            qDE: 'P(A) = 0,5, P(B) = 0,4, P(A ∩ B) = 0,2. Wie groß ist P(A ∪ B)?',
            answer: 0.7, tolerance: 0.001, unit: '',
            hintEn: 'Inclusion-exclusion formula: P(A ∪ B) = P(A) + P(B) − P(A ∩ B).',
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
            q: 'A fair six-sided die is rolled. A = {1,2,3}, B = {3,4,5}. How many elements are in A ∩ B?',
            qDE: 'Ein fairer sechsseitiger Würfel wird geworfen. A = {1,2,3}, B = {3,4,5}. Wie viele Elemente enthält A ∩ B?',
            answer: 1, tolerance: 0, unit: 'elements',
            hintEn: 'Count the amount of same elements in both sets.',
            hintDE: 'Zähle die Anzahl der Elemente, die in beiden Mengen vorkommen.'
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
            q: 'A fair six-sided die is rolled. A = {1,2,3,4}. How many elements does Aᶜ contain?',
            qDE: 'Ein fairer sechsseitiger Würfel wird geworfen. A = {1,2,3,4}. Wie viele Elemente enthält Aᶜ?',
            answer: 2, tolerance: 0, unit: 'elements',
            hintEn: 'Which elements of Ω are not in A?',
            hintDE: 'Welche Elemente von Ω sind nicht in A?'
        },

        {
            q: 'P(A) = 0.6. What is P(Aᶜ)?',
            qDE: 'P(A) = 0,6. Was ist P(Aᶜ)?',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'The complement rule: P(Aᶜ) = 1 − P(A).',
            hintDE: 'Komplementregel: P(Aᶜ) = 1 − P(A).'
        },

        // ── 9. DE MORGAN REGELN ──────────────────────────────────────────────────

        {
            q: 'By De Morgan\'s law: (A ∪ B)ᶜ = Aᶜ __ Bᶜ. Enter 1 for ∩ or 2 for ∪.',
            qDE: 'Nach der De-Morgan-Regel gilt: (A ∪ B)ᶜ = Aᶜ __ Bᶜ. Gib 1 für ∩ oder 2 für ∪ ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'The complement of an union is an intersection.',
            hintDE: 'Das Komplement einer Vereinigung ist ein Schnitt.'
        },
        {
            q: 'P(Aᶜ) = 0.3, P(Bᶜ) = 0.4, P(Aᶜ ∩ Bᶜ) = 0.1. By De Morgan, what is P((A ∪ B)ᶜ)?',
            qDE: 'P(Aᶜ) = 0,3, P(Bᶜ) = 0,4, P(Aᶜ ∩ Bᶜ) = 0,1. Was ist P((A ∪ B)ᶜ) gemäß De Morgan?',
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
            q: 'Which law gives A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)? Enter 1 for distributive law, 2 for De Morgan or 3 for the law of large numbers.',
            qDE: 'Welches Gesetz liefert A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)? Gib 1 für Distributivgesetz, 2 für De Morgan oder 3 für das Gesetz großer Zahlen ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'The distributive law: A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C).',
            hintDE: 'Das Distributivgesetz: A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C).'
        },
        {
            q: 'P(A ∩ B) = 0.1, P(A ∩ C) = 0.2, and (A ∩ B) and (A ∩ C) are disjoint. What is P(A ∩ (B ∪ C))?',
            qDE: 'P(A ∩ B) = 0,1, P(A ∩ C) = 0,2, und (A ∩ B) und (A ∩ C) sind disjunkt. Was ist P(A ∩ (B ∪ C))?',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C).',
            hintDE: 'A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)'
        },
        {
            q: 'Is A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C) true or false? Enter 1 for true, 0 for false.',
            qDE: 'Ist A ∪ (B ∩ C) = (A ∪ B) ∩ (A ∪ C) wahr oder falsch? Gib 1 für wahr, 0 für falsch ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Yes — ∪ distributes over ∩, just as ∩ distributes over ∪.',
            hintDE: 'Ja — ∩ ist distributiv über ∩, genau wie ∩ über ∪.'
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
            q: 'Events A₁, A₂, A₃ are pairwise disjoint with P(A₁) = 0.25, P(A₂) = 0.55, P(A₃) = 0.1. What is P(A₁ ∪ A₂ ∪ A₃)?',
            qDE: 'Ereignisse A₁, A₂, A₃ sind paarweise disjunkt mit P(A₁) = 0,25, P(A₂) = 0,55, P(A₃) = 0,1. Wie groß ist P(A₁ ∪ A₂ ∪ A₃)?',
            answer: 0.9, tolerance: 0.001, unit: '',
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
            q: 'P(A) = 0.7 and P(B) = 0.4. What is the minimum possible value of P(A ∪ B)? Enter as a decimal.',
            qDE: 'P(A) = 0,7 und P(B) = 0.4. Was ist der minimal mögliche Wert von P(A ∪ B)? Gib als Dezimalzahl ein.',
            answer: 0.7, tolerance: 0.001, unit: '',
            hintEn: 'P(A ∪ B) ≥ max(P(A), P(B)).',
            hintDE: 'P(A ∪ B) ≥ max(P(A), P(B)).'
        },
        {
            q: 'P(B) = 0.6 and A ⊆ B. What is the maximum possible value of P(A)? Enter as a decimal.',
            qDE: 'P(B) = 0,6 und A ⊆ B. Was ist der maximal mögliche Wert von P(A)? Gib als Dezimalzahl ein.',
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
            qDE: 'P(A) = 0,5 und P(B) = 0,6. Die Boolesche Ungleichung liefert P(A ∪ B) ≤ 1,1. Da Wahrscheinlichkeiten nicht größer als 1 sein können, was ist die schärfste gültige obere Schranke?',
            answer: 1.0, tolerance: 0.001, unit: '',
            hintEn: 'The union bound gives 1.1, but P(A ∪ B) ≤ 1 always.',
            hintDE: 'Die Boolesche Ungleichung liefert 1,1, aber P(A ∪ B) ≤ 1 gilt immer.'
        },

        // ── 2. LAPLACE RAUM (Laplace Space) ──────────────────────────────────────

        {
            q: 'A Laplace space has 20 equally likely outcomes. Event A contains 5 outcomes. What is P(A)? Enter as a decimal.',
            qDE: 'Ein Laplace-Raum hat 20 gleich wahrscheinliche Ergebnisse. Ereignis A enthält 5 Ergebnisse. Was ist P(A)? Gib als Dezimalzahl ein.',
            answer: 0.25, tolerance: 0.001, unit: '',
            hintEn: 'P(A) = |A| / |Ω|',
            hintDE: 'P(A) = |A| / |Ω|'
        },
        {
            q: 'A card is randomly drawn from a standard 52-card deck. What is the probability of drawing an ace? Enter the numerator of the fraction over 52.',
            qDE: 'Eine Karte wird aus einem Standarddeck mit 52 Karten zufällig gezogen. Wie groß ist die Wahrscheinlichkeit, ein Ass zu ziehen? Gib den Zähler über 52 ein.',
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
            hintEn: 'With replacement, order matters: 5 possibilities in each draw.',
            hintDE: 'Mit Zurücklegen, Reihenfolge zählt: 5 Möglichkeiten in jedem Zug.'
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
            qDE: 'Eine Urne enthält 3 Bälle (rot, blau, grün). Ziehe zwei Mal mit Zurücklegen, Reihenfolge zählt. Wie viele Ergebnisse enthalten mindestens einen roten Ball?',
            answer: 5, tolerance: 0, unit: 'outcomes',
            hintEn: 'Total outcomes: 3² = 9. No red: 2² = 4',
            hintDE: 'Gesamtergebnisse: 3² = 9. Kein Rot: 2² = 4'
        },

        // ── 6. URNENMODELL MIT REIHENFOLGE OHNE ZURÜCKLEGEN ──────────────────────

        {
            q: 'An urn has 6 balls. You draw 2 without replacement, order matters. How many ordered outcomes are possible?',
            qDE: 'Eine Urne enthält 6 Bälle. Du ziehst 2 Bälle ohne Zurücklegen, Reihenfolge zählt. Wie viele geordnete Ergebnisse sind möglich?',
            answer: 30, tolerance: 0, unit: 'outcomes',
            hintEn: 'First draw: 6 options, second draw: 5 (no replacement).',
            hintDE: 'Erster Zug: 6 Möglichkeiten, zweiter Zug: 5 (ohne Zurücklegen).'
        },
        {
            q: 'How many ways can 4 runners finish in 1st, 2nd, and 3rd place out of 8 runners? (Order matters, no replacement.)',
            qDE: 'Wie viele Möglichkeiten gibt es für Platz 1, 2 und 3 bei 8 Läufern? (Reihenfolge zählt, ohne Zurücklegen.)',
            answer: 336, tolerance: 0, unit: 'ways',
            hintEn: '8 different runners can finish first, 7 can finish second,...',
            hintDE: '8 Läufer können Platz 1 erreichen, 7 Läufer können Platz 2 erreichen,...'
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
            qDE: 'Die Odds für Ereignis A betragen 3 (also 3:1). Was ist P(A)? Gib als Dezimalzahl ein.',
            answer: 0.75, tolerance: 0.001, unit: '',
            hintEn: 'Odds = p/(1−p) = 3',
            hintDE: 'Odds = p/(1−p) = 3'
        },
        {
            q: 'P(A) = 0.25. What are the odds against A (i.e. P(Aᶜ)/P(A))? Enter as a decimal.',
            qDE: 'P(A) = 0,25. Wie groß sind die Odds gegen A (also P(Aᶜ)/P(A))? Gib als Dezimalzahl ein.',
            answer: 3.0, tolerance: 0.001, unit: '',
            hintEn: 'Odds against = (1 − 0.25) / 0.25',
            hintDE: 'Odds gegen A = (1 − 0,25) / 0,25'
        },

        // ── 8. SIEBFORMEL / INCLUSION-EXCLUSION ──────────────────────────────────

        {
            q: 'P(A) = 0.5, P(B) = 0.4, P(C) = 0.3, P(A∩B) = 0.2, P(A∩C) = 0.1, P(B∩C) = 0.15, P(A∩B∩C) = 0.05. What is P(A ∪ B ∪ C)?',
            qDE: 'P(A) = 0,5, P(B) = 0,4, P(C) = 0,3, P(A∩B) = 0,2, P(A∩C) = 0,1, P(B∩C) = 0,15, P(A∩B∩C) = 0,05. Wie groß ist P(A ∪ B ∪ C)?',
            answer: 0.8, tolerance: 0.001, unit: '',
            hintEn: 'Inclusion-exclusion formula for 3 sets.',
            hintDE: 'Siebformel für 3 Mengen.'
        },
        {
            q: 'P(A) = 0.6, P(B) = 0.5, P(C) = 0.4, P(A∩B) = 0.3, P(A∩C) = 0.2, P(B∩C) = 0.25, P(A∩B∩C) = 0.1. What is P(A ∪ B ∪ C)?',
            qDE: 'P(A) = 0,6, P(B) = 0,5, P(C) = 0,4, P(A∩B) = 0,3, P(A∩C) = 0,2, P(B∩C) = 0,25, P(A∩B∩C) = 0,1. Wie groß ist P(A ∪ B ∪ C)?',
            answer: 0.85, tolerance: 0.001, unit: '',
            hintEn: 'Inclusion-exclusion formula for 3 sets.',
            hintDE: 'Siebformel für 3 Mengen.'
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
            hintDE: 'Check: enthält ∅ und Ω ✓; {1,2}ᶜ = {3,4} ∈ ℱ ✓; abgeschlossen unter Vereinigung ✓. Gültig.'
        },
        {
            q: 'Ω = {1,2,3}. Is ℱ = {∅, {1}, {2}, Ω} a valid σ-algebra? Enter 1 for yes, 0 for no.',
            qDE: 'Ω = {1,2,3}. Ist ℱ = {∅, {1}, {2}, Ω} eine gültige σ-Algebra? Gib 1 für ja, 0 für nein ein.',
            answer: 0, tolerance: 0, unit: '',
            hintEn: '{1} ∪ {2} = {1,2} is not in ℱ — not closed under unions. Invalid.',
            hintDE: '{1} ∪ {2} = {1,2} ist nicht in ℱ — nicht abgeschlossen unter Vereinigung. Ungültig.'
        },
    ],

    // ── WORLD 3 ─────────────────────────────────────────────────────────
    // 
    3: [
        // ── 1. BEDINGTE WAHRSCHEINLICHKEIT (Conditional Probability) ─────────────


        {
            q: 'P(A ∩ B) = 0.12 and P(B) = 0.4. What is P(A | B)?',
            qDE: 'P(A ∩ B) = 0,12 und P(B) = 0,4. Was ist P(A | B)?',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'P(A|B) = P(A ∩ B) / P(B)',
            hintDE: 'P(A|B) = P(A ∩ B) / P(B)'
        },

        {
            q: 'P(B | A) = 0.5, P(A) = 0.6. What is P(A ∩ B)? Enter as a decimal.',
            qDE: 'P(B | A) = 0,5, P(A) = 0,6. Was ist P(A ∩ B)? Gib als Dezimalzahl ein.',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'Multiplication rule: P(A ∩ B) = P(B|A) · P(A)',
            hintDE: 'Multiplikationsregel: P(A ∩ B) = P(B|A) · P(A)'
        },
        {
            q: 'P(A) = 0.4, P(B) = 0.5, P(A ∩ B) = 0.2. What is P(A | B)? Enter as a decimal.',
            qDE: 'P(A) = 0,4, P(B) = 0,5, P(A ∩ B) = 0,2. Was ist P(A | B)? Gib als Dezimalzahl ein.',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'P(A|B) = P(A ∩ B) / P(B)',
            hintDE: 'P(A|B) = P(A ∩ B) / P(B)'
        },

        // ── 2. SATZ VON DER TOTALEN WAHRSCHEINLICHKEIT ───────────────────────────

        {
            q: 'B₁ and B₂ partition Ω. P(B₁) = 0.3, P(B₂) = 0.7, P(A|B₁) = 0.4, P(A|B₂) = 0.2. What is P(A)?',
            qDE: 'B₁ und B₂ partitionieren Ω. P(B₁) = 0,3, P(B₂) = 0,7, P(A|B₁) = 0,4, P(A|B₂) = 0,2. Was ist P(A)?',
            answer: 0.26, tolerance: 0.001, unit: '',
            hintEn: 'P(A) = P(A|B₁)·P(B₁) + P(A|B₂)·P(B₂)',
            hintDE: 'P(A) = P(A|B₁)·P(B₁) + P(A|B₂)·P(B₂)'
        },
        {
            q: 'Three machines produce parts: B₁ (50%), B₂ (30%), B₃ (20%). Defect rates: P(D|B₁)=0.02, P(D|B₂)=0.05, P(D|B₃)=0.03. What is P(D)? Enter as a decimal.',
            qDE: 'Drei Maschinen produzieren Teile: B₁ (50%), B₂ (30%), B₃ (20%). Ausschussraten: P(D|B₁)=0,02, P(D|B₂)=0,05, P(D|B₃)=0,03. Was ist P(D)?',
            answer: 0.031, tolerance: 0.001, unit: '',
            hintEn: 'P(D) = 0.02×0.5 + 0.05×0.3 + 0.03×0.2',
            hintDE: 'P(D) = 0,02×0,5 + 0,05×0,3 + 0,03×0,2'
        },
        {
            q: 'B₁, B₂, B₃ partition Ω with P(B₁)=0.2, P(B₂)=0.5, P(B₃)=0.3. P(A|B₁)=0.6, P(A|B₂)=0.4, P(A|B₃)=0.1. What is P(A)?',
            qDE: 'B₁, B₂, B₃ partitionieren Ω mit P(B₁)=0,2, P(B₂)=0,5, P(B₃)=0,3. P(A|B₁)=0,6, P(A|B₂)=0,4, P(A|B₃)=0,1. Was ist P(A)?',
            answer: 0.35, tolerance: 0.001, unit: '',
            hintEn: 'P(A) = 0.6×0.2 + 0.4×0.5 + 0.1×0.3',
            hintDE: 'P(A) = 0,6×0,2 + 0,4×0,5 + 0,1×0,3'
        },

        // ── 3. BAYES FORMEL ───────────────────────────────────────────────────────

        {
            q: 'P(B₁)=0.3, P(B₂)=0.7, P(A|B₁)=0.4, P(A|B₂)=0.2, P(A)=0.26. What is P(B₁|A)? Enter as a decimal rounded to 2 places.',
            qDE: 'P(B₁)=0,3, P(B₂)=0,7, P(A|B₁)=0,4, P(A|B₂)=0,2, P(A)=0,26. Was ist P(B₁|A)? Gib als Dezimalzahl auf 2 Stellen gerundet an.',
            answer: 0.46, tolerance: 0.01, unit: '',
            hintEn: 'Bayes: P(B₁|A) = P(A|B₁)·P(B₁) / P(A)',
            hintDE: 'Bayes: P(B₁|A) = P(A|B₁)·P(B₁) / P(A)'
        },

        {
            q: 'P(A|B)=0.6, P(B)=0.4, P(A)=0.3. What is P(B|A)? Enter as a decimal rounded to 2 places.',
            qDE: 'P(A|B)=0,6, P(B)=0,4, P(A)=0,3. Was ist P(B|A)? Gib als Dezimalzahl auf 2 Stellen gerundet an.',
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
            qDE: 'In einem zweistufigen Wahrscheinlichkeitsbaum: P(B₁)=0,6, P(B₂)=0,4. P(A|B₁)=0,3, P(A|B₂)=0,7. Was ist P(B₂ ∩ A)?',
            answer: 0.28, tolerance: 0.001, unit: '',
            hintEn: 'P(B₂ ∩ A) = P(A|B₂) · P(B₂)',
            hintDE: 'P(B₂ ∩ A) = P(A|B₂) · P(B₂)'
        },
        {
            q: 'A coin is flipped twice. In the probability tree, how many paths lead to exactly one head?',
            qDE: 'Eine Münze wird zweimal geworfen. Wie viele Pfade im Wahrscheinlichkeitsbaum führen zu genau einem Kopf?',
            answer: 2, tolerance: 0, unit: 'paths',
            hintEn: 'The paths Head-Tails and Tails-Head both give exactly one head — 2 paths.',
            hintDE: 'Die Pfade Kopf-Zahl und Zahl-Kopf ergeben jeweils genau einen Kopf — 2 Pfade.'
        },

        // ── 5. STOCHASTISCHE UNABHÄNGIGKEIT (Statistical Independence) ────────────

        {
            q: 'P(A)=0.4, P(A ∩ B)=0.2. For which value of P(B) are A and B independent?',
            qDE: 'P(A)=0,4, P(A ∩ B)=0,2. Für welchen Wert von P(B) sind A und B unabhängig? ',
            answer: 0.5, tolerance: 0, unit: '',
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
            qDE: 'A und B sind unabhängig mit P(A)=0,5 und P(B)=0,4. Was ist P(A ∩ B)? Gib als Dezimalzahl ein.',
            answer: 0.2, tolerance: 0.001, unit: '',
            hintEn: 'Independence: P(A ∩ B) = P(A) · P(B)',
            hintDE: 'Unabhängigkeit: P(A ∩ B) = P(A) · P(B)'
        },

        // ── 6. ZUFALLSVARIABLEN (Random Variables) ────────────────────────────────

        {
            q: 'A fair die is rolled. X is the number shown. What is P(X = 3)? Enter as a fraction over 6.',
            qDE: 'Ein fairer Würfel wird geworfen. X ist die gezeigte Zahl. Was ist P(X = 3)? Gib den Zähler über 6 ein.',
            answer: 1, tolerance: 0, unit: '/ 6',
            hintEn: 'X maps each face to its number.',
            hintDE: 'X bildet jede Seite auf ihre Zahl ab'
        },
        {
            q: 'X takes values {0, 1, 2} with P(X=0)=0.2, P(X=1)=0.5, P(X=2)=0.3. What is P(X ≥ 1)? Enter as a decimal.',
            qDE: 'X nimmt Werte {0,1,2} an mit P(X=0)=0,2, P(X=1)=0,5, P(X=2)=0,3. Was ist ist P(X ≥ 1)? Gib als Dezimalzahl ein.',
            answer: 0.8, tolerance: 0.001, unit: '',
            hintEn: 'P(X ≥ 1) = 1 − P(X=0)',
            hintDE: 'P(X ≥ 1) = 1 − P(X=0)'
        },
        {
            q: 'X takes values {1, 2, 3} with P(X=1)=0.5, P(X=2)=0.3, P(X=3)=p. What must p be? Enter as a decimal.',
            qDE: 'X nimmt Werte {1,2,3} an mit P(X=1)=0,5, P(X=2)=0,3, P(X=3)=p. Was muss p sein? Gib als Dezimalzahl ein.',
            answer: 0.2, tolerance: 0.001, unit: '',
            hintEn: 'All probabilities must sum to 1',
            hintDE: 'Alle Wahrscheinlichkeiten müssen 1 ergeben'
        },

        // ── 7. VERTEILUNG VON ZUFALLSVARIABLEN (Distribution of Random Variables) ─

        {
            q: 'X has distribution P(X=1)=0.3, P(X=2)=0.4, P(X=3)=0.3. What is P(X ≤ 2)? Enter as a decimal.',
            qDE: 'X hat die Verteilung P(X=1)=0,3, P(X=2)=0,4, P(X=3)=0,3. Was ist P(X ≤ 2)? Gib als Dezimalzahl ein.',
            answer: 0.7, tolerance: 0.001, unit: '',
            hintEn: 'P(X ≤ 2) = P(X=1) + P(X=2).',
            hintDE: 'P(X ≤ 2) = P(X=1) + P(X=2).'
        },
        {
            q: 'X is uniformly distributed on {1, 2, 3, 4, 5}. What is P(2 ≤ X ≤ 4)? Enter as a decimal.',
            qDE: 'X ist gleichverteilt auf {1,2,3,4,5}. Was ist P(2 ≤ X ≤ 4)? Gib als Dezimalzahl ein.',
            answer: 0.6, tolerance: 0.001, unit: '',
            hintEn: 'Values {2,3,4}: 3 out of 5 equally likely outcomes.',
            hintDE: 'Werte {2,3,4}: 3 von 5 gleich wahrscheinlichen Ergebnissen.'
        },
        {
            q: 'X has P(X=0)=0.1, P(X=1)=0.4, P(X=2)=0.4, P(X=3)=0.1. What is P(X = 1 or X = 2)? Enter as a decimal.',
            qDE: 'X hat P(X=0)=0,1, P(X=1)=0,4, P(X=2)=0,4, P(X=3)=0,1. Was ist P(X=1 oder X=2)? Gib als Dezimalzahl ein.',
            answer: 0.8, tolerance: 0.001, unit: '',
            hintEn: 'P(X=1) + P(X=2)',
            hintDE: 'P(X=1) + P(X=2)'
        },

        // ── 8. BERECHNUNG VON INTERVALLWAHRSCHEINLICHKEITEN ──────────────────────

        {
            q: 'X is discrete with P(X=k) = 0.1 for k = 1,…,10. What is P(3 ≤ X ≤ 7)? Enter as a decimal.',
            qDE: 'X ist diskret mit P(X=k) = 0,1 für k = 1,…,10. Was ist P(3 ≤ X ≤ 7)? Gib als Dezimalzahl ein.',
            answer: 0.5, tolerance: 0.001, unit: '',
            hintEn: 'Values 3,4,5,6,7',
            hintDE: 'Werte 3,4,5,6,7'
        },
        {
            q: 'F(x) is a distribution function with F(3)=0.7 and F(1)=0.3. What is P(1 < X ≤ 3)? Enter as a decimal.',
            qDE: 'F(x) ist eine Verteilungsfunktion mit F(3)=0,7 und F(1)=0,3. Was ist P(1 < X ≤ 3)? Gib als Dezimalzahl ein.',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'P(1 < X ≤ 3) = F(3) − F(1)',
            hintDE: 'P(1 < X ≤ 3) = F(3) − F(1)'
        },
        {
            q: 'F(5)=0.9 and F(2)=0.5. What is P(2 < X ≤ 5)? Enter as a decimal.',
            qDE: 'F(5)=0,9 und F(2)=0,5. Was ist P(2 < X ≤ 5)? Gib als Dezimalzahl ein.',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'P(2 < X ≤ 5) = F(5) − F(2)',
            hintDE: 'P(2 < X ≤ 5) = F(5) − F(2)'
        },

        // ── 9. ZÄHLDICHTE (Probability Mass Function) ─────────────────────────────

        {
            q: 'A discrete Random Variable X has PMF p(1)=0.2, p(2)=0.5, p(3)=0.3. What is p(2)? Enter as a decimal.',
            qDE: 'Eine diskrete Zufallsvariable X hat die Zähldichte p(1)=0,2, p(2)=0,5, p(3)=0,3. Was ist p(2)? Gib als Dezimalzahl ein.',
            answer: 0.5, tolerance: 0.001, unit: '',
            hintEn: 'The PMF directly gives P(X=2) = p(2)',
            hintDE: 'Die Zähldichte gibt direkt P(X=2) = p(2)'
        },
        {
            q: 'A PMF must sum to 1. If p(1)=0.3 and p(2)=0.3, and X only takes values 1, 2, 3, what is p(3)?',
            qDE: 'Eine Zähldichte muss 1 ergeben. Wenn p(1)=0,3 und p(2)=0,3 und X nur Werte 1,2,3 annimmt, was ist p(3)?',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'p(3) = 1 − 0.3 − 0.3',
            hintDE: 'p(3) = 1 − 0,3 − 0,3'
        },
        {
            q: 'X has PMF p(k) = c · k for k = 1, 2, 3, 4. What must c be so that all probabilities sum to 1? Enter as a decimal.',
            qDE: 'X hat Zähldichte p(k) = c · k für k = 1,2,3,4. Welchen Wert muss c haben, damit sich alle Wahrscheinlichkeiten zu 1 addieren? Gib als Dezimalzahl ein.',
            answer: 0.1, tolerance: 0.001, unit: '',
            hintEn: 'c(1+2+3+4) = 1',
            hintDE: 'c(1+2+3+4) = 1'
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
            q: 'A distribution function satisfies F(+∞) = ?',
            qDE: 'Eine Verteilungsfunktion erfüllt F(+∞) = ?',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'By definition...',
            hintDE: 'Per Definition...'
        },
        {
            q: 'F(x) is a CDF. Which value is impossible for F(x)? Enter 1 for −0.2, 2 for 0, 3 for 0.7, or 4 for 1.',
            qDE: 'F(x) ist eine Verteilungsfunktion. Welcher Wert ist unmöglich für F(x)? Gib 1 für −0,2, 2 für 0, 3 für 0,7 oder 4 für 1 ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'A CDF satisfies 0 ≤ F(x) ≤ 1 for all x',
            hintDE: 'Eine Verteilungsfunktion erfüllt 0 ≤ F(x) ≤ 1 für alle x'
        },

        

        // ── 11. QUANTILFUNKTION (Quantile Function) ───────────────────────────────

        {
            q: 'X has the distribution function F with F(1)=0.2, F(2)=0.5, F(3)=1.0. What is the 0.5-quantile (median) of X?',
            qDE: 'X hat die Verteilungsfunktion F mit F(1)=0,2, F(2)=0,5, F(3)=1,0. Was ist das 0,5-Quantil (Median) von X?',
            answer: 2, tolerance: 0, unit: '',
            hintEn: 'Q(p) = min{x : F(x) ≥ p}. For p=0.5: F(2)=0.5 ≥ 0.5.',
            hintDE: 'Q(p) = min{x : F(x) ≥ p}. Für p=0,5: F(2)=0,5 ≥ 0,5.'
        },
        {
            q: 'X has the distribution function F with F(1)=0.1, F(2)=0.4, F(3)=0.8, F(4)=1.0. What is the 0.75-quantile of X?',
            qDE: 'X hat die Verteilungsfunktion F mit F(1)=0,1, F(2)=0,4, F(3)=0,8, F(4)=1,0. Was ist das 0,75-Quantil von X?',
            answer: 3, tolerance: 0, unit: '',
            hintEn: 'Q(0.75) = min{x : F(x) ≥ 0.75}. F(2)=0.4 < 0.75.',
            hintDE: 'Q(0,75) = min{x : F(x) ≥ 0,75}. F(2)=0,4 < 0,75.'
        },
        {
            q: 'The 0.25-quantile of X is the smallest x with F(x) ≥ 0.25. Given F(1)=0.3, what is Q(0.25) where Q is the quantile function?',
            qDE: 'Das 0,25-Quantil von X ist das kleinste x mit F(x) ≥ 0,25. Gegeben F(1)=0,3, was ist Q(0,25) wenn Q die Quantilfunktion ist?',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'F(1) = 0.3 ≥ 0.25.',
            hintDE: 'F(1) = 0,3 ≥ 0,25.'
        },

        // ── 12. STETIGE ZUFALLSVARIABLE UND DICHTEFUNKTION (Continuous RV / PDF) ──

        {
            q: 'X has density function f(x) = 2x for x ∈ [0,1], 0 otherwise. What is P(0 ≤ X ≤ 1)?',
            qDE: 'X hat Dichtefunktion f(x) = 2x für x ∈ [0,1], sonst 0. Wie groß ist P(0 ≤ X ≤ 1)?',
            answer: 1, tolerance: 0.001, unit: '',
            hintEn: 'Calculate the integral.',
            hintDE: 'Berechne das Integral.'
        },
        {
            q: 'X has density function f(x) = 2x for x ∈ [0,1]. What is P(0 ≤ X ≤ 0.5)? Enter as a decimal.',
            qDE: 'X hat Dichtefunktion f(x) = 2x für x ∈ [0,1]. Was ist P(0 ≤ X ≤ 0,5)? Gib als Dezimalzahl ein.',
            answer: 0.25, tolerance: 0.001, unit: '',
            hintEn: 'Calculate the integral.',
            hintDE: 'Berechne das Integral.'
        },
        {
            q: 'For a continuous random variable X, what is P(X = 3)?',
            qDE: 'Was ist P(X = 3) für eine stetige Zufallsvariable X?',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'Calculate the integral.',
            hintDE: 'Berechne das Integral.'
        },

        // ── 13. EXPONENTIALVERTEILUNG (Exponential Distribution CDF) ─────────────

        {
            q: 'X ~ Exp(1). Calculate the value of the distribution function of X at x=1. Enter as a decimal rounded to 3 places. (Use e ≈ 2.718)',
            qDE: 'X ~ Exp(1). Berechne den Wert der Verteilungsfunktion von X an der Stelle x=1. Gib auf 3 Stellen gerundet an. (e ≈ 2,718)',
            answer: 0.632, tolerance: 0.005, unit: '',
            hintEn: 'F(x) = 1 − e^(−x)',
            hintDE: 'F(x) = 1 − e^(−x)'
        },
        {
            q: 'X ~ Exp(2). What is P(X > 1)? Enter as a decimal rounded to 3 places. (Use e ≈ 2.718)',
            qDE: 'X ~ Exp(2). Verteilungsfunktion: F(x) = 1 − e^(−2x) für x ≥ 0. Wie groß ist P(X > 1)? Gib auf 3 Stellen gerundet an. (e ≈ 2,718)',
            answer: 0.135, tolerance: 0.005, unit: '',
            hintEn: 'F(x) = 1 − e^(−2x) for x ≥ 0.',
            hintDE: 'F(x) = 1 − e^(−2x) für x ≥ 0.'
        },
        {
            q: 'X ~ Exp(λ). What is F(0), the distribution function F evaluated at x = 0?',
            qDE: 'X ~ Exp(λ). Was ist F(0) für die Verteilungsfunktion von X?',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'F(0) = 1 − e^(−λ·0)',
            hintDE: 'F(0) = 1 − e^(−λ·0)'
        },

    ],

    // todo continue

    // ── WORLD 4 ─────────────────────────────────────────────────────────
    4: [


        // ── 1. DICHTETRANSFORMATIONSSATZ (Density Transformation Theorem) ─────────

        {
            q: 'X has density function f_X(x) = 1 for x ∈ [0,1]. Y = 2X. What is the density function f_Y(y) for y ∈ [0,2]? Enter the constant value of f_Y.',
            qDE: 'X hat Dichtefunktion f_X(x) = 1 für x ∈ [0,1]. Y = 2X. Was ist die Dichte f_Y(y) für y ∈ [0,2]? Gib den konstanten Wert von f_Y ein.',
            answer: 0.5, tolerance: 0.001, unit: '',
            hintEn: 'For Y = aX: f_Y(y) = f_X(y/a) · (1/|a|).',
            hintDE: 'Für Y = aX: f_Y(y) = f_X(y/a) · (1/|a|).'
        },
        {
            q: 'X has density function f_X(x) = 2x for x ∈ [0,1]. Y = 3X. What is f_Y(y) for y ∈ [0,3]? Enter the coefficient c where f_Y(y) = c·y.',
            qDE: 'X hat Dichtefunktion f_X(x) = 2x für x ∈ [0,1]. Y = 3X. Was ist f_Y(y) für y ∈ [0,3]? Gib den Koeffizienten c an, sodass f_Y(y) = c·y gilt.',
            answer: 0.222, tolerance: 0.005, unit: '',
            hintEn: 'f_Y(y) = f_X(y/3) · (1/3)',
            hintDE: 'f_Y(y) = f_X(y/3) · (1/3)'
        },
        {
            q: 'X ~ U[0,1]. Y = X². Calculate the density f_Y of Y. What is f_Y(0.25)? Enter as a decimal.',
            qDE: 'X ~ U[0,1]. Y = X². Bestimme die Dichte f_Y von Y. Was ist f_Y(0,25)? Gib als Dezimalzahl ein.',
            answer: 1.0, tolerance: 0.01, unit: '',
            hintEn: 'The transformation theorem gives f_Y(y) = 1/(2√y) for y ∈ [0,1]',
            hintDE: 'Der Transformationssatz liefert f_Y(y) = 1/(2√y) für y ∈ [0,1].'
        },

        // ── 2. UNABHÄNGIGKEIT VON ZUFALLSVARIABLEN ────────────────────────────────

        {
            q: 'X and Y are independent. P(X=1)=0.4, P(Y=1)=0.5. What is P(X=1, Y=1)? Enter as a decimal.',
            qDE: 'X und Y sind unabhängig. P(X=1)=0,4, P(Y=1)=0,5. Was ist P(X=1, Y=1)? Gib als Dezimalzahl ein.',
            answer: 0.2, tolerance: 0.001, unit: '',
            hintEn: 'Independence: P(X=1, Y=1) = P(X=1) · P(Y=1)',
            hintDE: 'Unabhängigkeit: P(X=1, Y=1) = P(X=1) · P(Y=1)'
        },
        {
            q: 'X and Y are independent with density functions f_X and f_Y. The joint PDF is f_{X,Y}(x,y) = f_X(x) · f_Y(y). If f_X(x)=2x on [0,1] and f_Y(y)=1 on [0,1], what is f_{X,Y}(0.5, 0.5)?',
            qDE: 'X und Y sind unabhängig. Die gemeinsame Dichte ist f_{X,Y}(x,y) = f_X(x) · f_Y(y). Wenn f_X(x)=2x auf [0,1] und f_Y(y)=1 auf [0,1], was ist dann f_{X,Y}(0,5; 0,5)?',
            answer: 1.0, tolerance: 0.001, unit: '',
            hintEn: 'f_{X,Y}(0.5, 0.5) = f_X(0.5) · f_Y(0.5)',
            hintDE: 'f_{X,Y}(0,5; 0,5) = f_X(0,5) · f_Y(0,5)'
        },
        {
            q: 'X and Y are independent. E[X]=3, E[Y]=4. What is E[X·Y]? Enter a whole number.',
            qDE: 'X und Y sind unabhängig. E[X]=3, E[Y]=4. Was ist E[X·Y]? Gib eine ganze Zahl ein.',
            answer: 12, tolerance: 0, unit: '',
            hintEn: 'For independent Random Variables we have E[X·Y] = E[X] · E[Y]',
            hintDE: 'Für unabhängige Zufallsvariablen gilt E[X·Y] = E[X] · E[Y]'
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



        // ── DENSITY TRANSFORMATION ────────────────────────────────────────────
        {
            q: 'X has PDF f_X(x) = 1 for x ∈ [0,1] (Uniform). Y = 2X. What is f_Y(y) for y ∈ [0,2]? Enter as a decimal.',
            qDE: 'X hat Dichte f_X(x) = 1 für x ∈ [0,1] (Gleichverteilung). Y = 2X. Wie groß ist f_Y(y) für y ∈ [0,2]? Gib als Dezimalzahl ein.',
            answer: 0.5, tolerance: 0.001, unit: '',
            hintEn: 'f_Y(y) = f_X(y/a) · (1/|a|) = 1 · (1/2) = 0.5.',
            hintDE: 'f_Y(y) = f_X(y/a) · (1/|a|) = 1 · (1/2) = 0,5.'
        },
        {
            q: 'X ~ Uniform[0,1] with f_X(x) = 1. Y = 3X + 1. What is f_Y(y) for y ∈ [1,4]? Enter as a decimal.',
            qDE: 'X ~ Gleichverteilt[0,1] mit f_X(x) = 1. Y = 3X + 1. Wie groß ist f_Y(y) für y ∈ [1,4]? Gib als Dezimalzahl ein.',
            answer: 0.333, tolerance: 0.005, unit: '',
            hintEn: 'For Y = aX + b: f_Y(y) = f_X((y-b)/a) · (1/|a|) = 1 · (1/3) ≈ 0.333.',
            hintDE: 'Für Y = aX + b: f_Y(y) = f_X((y-b)/a) · (1/|a|) = 1 · (1/3) ≈ 0,333.'
        },
        {
            q: 'X has PDF f_X(x) = 2x for x ∈ [0,1]. Y = X². The transformation theorem gives f_Y(y) = 1/(2√y) · f_X(√y). What is f_Y(0.25)?',
            qDE: 'X hat Dichte f_X(x) = 2x für x ∈ [0,1]. Y = X². Der Transformationssatz liefert f_Y(y) = 1/(2√y) · f_X(√y). Wie groß ist f_Y(0,25)?',
            answer: 1.0, tolerance: 0.01, unit: '',
            hintEn: 'f_Y(0.25) = (1/(2√0.25)) · f_X(0.5) = (1/1) · 2(0.5) = 1.',
            hintDE: 'f_Y(0,25) = (1/(2√0,25)) · f_X(0,5) = (1/1) · 2(0,5) = 1.'
        },
        {
            q: 'X ~ Uniform[0,2] with f_X(x) = 0.5. Y = 4X. What is f_Y(y) for y ∈ [0,8]? Enter as a decimal.',
            qDE: 'X ~ Gleichverteilt[0,2] mit f_X(x) = 0,5. Y = 4X. Wie groß ist f_Y(y) für y ∈ [0,8]? Gib als Dezimalzahl ein.',
            answer: 0.125, tolerance: 0.001, unit: '',
            hintEn: 'f_Y(y) = f_X(y/4) · (1/4) = 0.5 · 0.25 = 0.125.',
            hintDE: 'f_Y(y) = f_X(y/4) · (1/4) = 0,5 · 0,25 = 0,125.'
        },

        // ── INDEPENDENCE OF RANDOM VARIABLES ─────────────────────────────────
        {
            q: 'X and Y are independent. P(X=1)=0.4, P(Y=1)=0.5. What is P(X=1, Y=1)? Enter as a decimal.',
            qDE: 'X und Y sind unabhängig. P(X=1)=0,4, P(Y=1)=0,5. Wie groß ist P(X=1, Y=1)? Gib als Dezimalzahl ein.',
            answer: 0.2, tolerance: 0.001, unit: '',
            hintEn: 'Independence: P(X=1, Y=1) = P(X=1) · P(Y=1) = 0.4 × 0.5.',
            hintDE: 'Unabhängigkeit: P(X=1, Y=1) = P(X=1) · P(Y=1) = 0,4 × 0,5.'
        },
        {
            q: 'A joint PMF gives p(0,0)=0.12, p(0,1)=0.18, p(1,0)=0.28, p(1,1)=0.42. Is P(X=0)=0.3 correct? Enter 1 for yes, 0 for no.',
            qDE: 'Eine gemeinsame Zähldichte liefert p(0,0)=0,12, p(0,1)=0,18, p(1,0)=0,28, p(1,1)=0,42. Ist P(X=0)=0,3 korrekt? Gib 1 für ja, 0 für nein ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'P(X=0) = p(0,0) + p(0,1) = 0.12 + 0.18 = 0.30. Yes.',
            hintDE: 'P(X=0) = p(0,0) + p(0,1) = 0,12 + 0,18 = 0,30. Ja.'
        },
        {
            q: 'p(0,0)=0.12, p(0,1)=0.18, p(1,0)=0.28, p(1,1)=0.42. P(X=0)=0.3, P(Y=0)=0.4. Does P(X=0)·P(Y=0) = p(0,0)? Enter 1 for yes (independent), 0 for no.',
            qDE: 'p(0,0)=0,12, p(0,1)=0,18, p(1,0)=0,28, p(1,1)=0,42. P(X=0)=0,3, P(Y=0)=0,4. Gilt P(X=0)·P(Y=0) = p(0,0)? Gib 1 für ja (unabhängig), 0 für nein ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'P(X=0)·P(Y=0) = 0.3 × 0.4 = 0.12 = p(0,0). Independent.',
            hintDE: 'P(X=0)·P(Y=0) = 0,3 × 0,4 = 0,12 = p(0,0). Unabhängig.'
        },
        {
            q: 'X and Y are independent with f_X(x)=2x on [0,1] and f_Y(y)=1 on [0,1]. What is f_{X,Y}(0.5, 0.5)?',
            qDE: 'X und Y sind unabhängig mit f_X(x)=2x auf [0,1] und f_Y(y)=1 auf [0,1]. Wie groß ist f_{X,Y}(0,5; 0,5)?',
            answer: 1.0, tolerance: 0.001, unit: '',
            hintEn: 'f_{X,Y}(0.5,0.5) = f_X(0.5) · f_Y(0.5) = 2(0.5) · 1 = 1.',
            hintDE: 'f_{X,Y}(0,5;0,5) = f_X(0,5) · f_Y(0,5) = 2(0,5) · 1 = 1.'
        },
        {
            q: 'X and Y are independent. E[X]=3, E[Y]=4. What is E[X·Y]? Enter a whole number.',
            qDE: 'X und Y sind unabhängig. E[X]=3, E[Y]=4. Wie groß ist E[X·Y]? Gib eine ganze Zahl ein.',
            answer: 12, tolerance: 0, unit: '',
            hintEn: 'For independent RVs: E[XY] = E[X]·E[Y] = 3 × 4.',
            hintDE: 'Für unabhängige ZV: E[XY] = E[X]·E[Y] = 3 × 4.'
        },

        // ── I.I.D. RANDOM VARIABLES ───────────────────────────────────────────
        {
            q: 'X₁, X₂, X₃ are i.i.d. with E[Xᵢ]=5 and Var(Xᵢ)=4. What is E[X₁ + X₂ + X₃]?',
            qDE: 'X₁, X₂, X₃ sind i.i.d. mit E[Xᵢ]=5 und Var(Xᵢ)=4. Wie groß ist E[X₁ + X₂ + X₃]?',
            answer: 15, tolerance: 0, unit: '',
            hintEn: 'By linearity of E: E[X₁+X₂+X₃] = 3·E[X] = 3·5 = 15.',
            hintDE: 'Mit Linearität von E: E[X₁+X₂+X₃] = 3·E[X] = 3·5 = 15.'
        },
        {
            q: 'X₁, X₂, X₃ are i.i.d. with Var(Xᵢ)=4. What is Var(X₁ + X₂ + X₃)?',
            qDE: 'X₁, X₂, X₃ sind i.i.d. mit Var(Xᵢ)=4. Wie groß ist Var(X₁ + X₂ + X₃)?',
            answer: 12, tolerance: 0, unit: '',
            hintEn: 'Since i.i.d. implies independence: Var(X₁+X₂+X₃) = 3·Var(X) = 3·4 = 12.',
            hintDE: 'Da i.i.d. Unabhängigkeit impliziert: Var(X₁+X₂+X₃) = 3·Var(X) = 3·4 = 12.'
        },
        {
            q: 'X₁,…,Xₙ are i.i.d. with E[Xᵢ]=μ. The sample mean is X̄ = (1/n)Σ Xᵢ. What is E[X̄]?',
            qDE: 'X₁,…,Xₙ sind i.i.d. mit E[Xᵢ]=μ. Der Stichprobenmittelwert ist X̄ = (1/n)Σ Xᵢ. Wie groß ist E[X̄]?',
            answer: 0, tolerance: 0, unit: '= μ',
            hintEn: 'E[X̄] = (1/n)·n·μ = μ. The sample mean is unbiased.',
            hintDE: 'E[X̄] = (1/n)·n·μ = μ. Der Stichprobenmittelwert ist erwartungstreu.'
        },
        {
            q: 'X₁,…,X₄ are i.i.d. with Var(Xᵢ)=8. What is Var(X̄) = Var((X₁+X₂+X₃+X₄)/4)?',
            qDE: 'X₁,…,X₄ sind i.i.d. mit Var(Xᵢ)=8. Wie groß ist Var(X̄) = Var((X₁+X₂+X₃+X₄)/4)?',
            answer: 2, tolerance: 0.001, unit: '',
            hintEn: 'Var(X̄) = Var(X)/n = 8/4 = 2.',
            hintDE: 'Var(X̄) = Var(X)/n = 8/4 = 2.'
        },

        // ── EXPECTED VALUE (DISCRETE) ─────────────────────────────────────────
        {
            q: 'X has PMF: P(X=1)=0.2, P(X=2)=0.5, P(X=3)=0.3. What is E[X]? Enter as a decimal.',
            qDE: 'X hat Zähldichte: P(X=1)=0,2, P(X=2)=0,5, P(X=3)=0,3. Wie groß ist E[X]? Gib als Dezimalzahl ein.',
            answer: 2.1, tolerance: 0.001, unit: '',
            hintEn: 'E[X] = 1·0.2 + 2·0.5 + 3·0.3 = 0.2 + 1.0 + 0.9 = 2.1.',
            hintDE: 'E[X] = 1·0,2 + 2·0,5 + 3·0,3 = 0,2 + 1,0 + 0,9 = 2,1.'
        },
        {
            q: 'A fair die is rolled. What is E[X]? Enter as a decimal.',
            qDE: 'Ein fairer Würfel wird geworfen. Wie groß ist E[X]? Gib als Dezimalzahl ein.',
            answer: 3.5, tolerance: 0.001, unit: '',
            hintEn: 'E[X] = (1+2+3+4+5+6)/6 = 21/6 = 3.5.',
            hintDE: 'E[X] = (1+2+3+4+5+6)/6 = 21/6 = 3,5.'
        },
        {
            q: 'X has PMF P(X=0)=0.3, P(X=1)=0.5, P(X=2)=0.2. What is E[X]? Enter as a decimal.',
            qDE: 'X hat Zähldichte P(X=0)=0,3, P(X=1)=0,5, P(X=2)=0,2. Wie groß ist E[X]? Gib als Dezimalzahl ein.',
            answer: 0.9, tolerance: 0.001, unit: '',
            hintEn: 'E[X] = 0·0.3 + 1·0.5 + 2·0.2 = 0 + 0.5 + 0.4 = 0.9.',
            hintDE: 'E[X] = 0·0,3 + 1·0,5 + 2·0,2 = 0 + 0,5 + 0,4 = 0,9.'
        },

        // ── EXPECTED VALUE (CONTINUOUS) ───────────────────────────────────────
        {
            q: 'X has PDF f(x) = 2x for x ∈ [0,1]. What is E[X]? Enter as a decimal.',
            qDE: 'X hat Dichte f(x) = 2x für x ∈ [0,1]. Wie groß ist E[X]? Gib als Dezimalzahl ein.',
            answer: 0.667, tolerance: 0.005, unit: '',
            hintEn: 'E[X] = ∫₀¹ x·2x dx = ∫₀¹ 2x² dx = [2x³/3]₀¹ = 2/3 ≈ 0.667.',
            hintDE: 'E[X] = ∫₀¹ x·2x dx = ∫₀¹ 2x² dx = [2x³/3]₀¹ = 2/3 ≈ 0,667.'
        },
        {
            q: 'X ~ Uniform[0,4] with f(x) = 0.25. What is E[X]? Enter as a decimal.',
            qDE: 'X ~ Gleichverteilt[0,4] mit f(x) = 0,25. Wie groß ist E[X]? Gib als Dezimalzahl ein.',
            answer: 2.0, tolerance: 0.001, unit: '',
            hintEn: 'E[X] = (a+b)/2 = (0+4)/2 = 2 for Uniform[a,b].',
            hintDE: 'E[X] = (a+b)/2 = (0+4)/2 = 2 für Gleichverteilung[a,b].'
        },
        {
            q: 'X has PDF f(x) = 3x² for x ∈ [0,1]. What is E[X]? Enter as a decimal.',
            qDE: 'X hat Dichte f(x) = 3x² für x ∈ [0,1]. Wie groß ist E[X]? Gib als Dezimalzahl ein.',
            answer: 0.75, tolerance: 0.005, unit: '',
            hintEn: 'E[X] = ∫₀¹ x·3x² dx = ∫₀¹ 3x³ dx = [3x⁴/4]₀¹ = 3/4 = 0.75.',
            hintDE: 'E[X] = ∫₀¹ x·3x² dx = ∫₀¹ 3x³ dx = [3x⁴/4]₀¹ = 3/4 = 0,75.'
        },

        // ── BERNOULLI DISTRIBUTION ────────────────────────────────────────────
        {
            q: 'X ~ Bernoulli(p=0.3). What is E[X]? Enter as a decimal.',
            qDE: 'X ~ Bernoulli(p=0,3). Wie groß ist E[X]? Gib als Dezimalzahl ein.',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'For X ~ Bernoulli(p): E[X] = p.',
            hintDE: 'Für X ~ Bernoulli(p): E[X] = p.'
        },
        {
            q: 'X ~ Bernoulli(p=0.7). What is Var(X)? Enter as a decimal.',
            qDE: 'X ~ Bernoulli(p=0,7). Wie groß ist Var(X)? Gib als Dezimalzahl ein.',
            answer: 0.21, tolerance: 0.001, unit: '',
            hintEn: 'Var(X) = p(1−p) = 0.7 × 0.3 = 0.21.',
            hintDE: 'Var(X) = p(1−p) = 0,7 × 0,3 = 0,21.'
        },
        {
            q: 'X ~ Bernoulli(p=0.4). What is E[X²]? (Hint: for Bernoulli, X²=X.) Enter as a decimal.',
            qDE: 'X ~ Bernoulli(p=0,4). Wie groß ist E[X²]? (Hinweis: bei Bernoulli gilt X²=X.) Gib als Dezimalzahl ein.',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'Since X ∈ {0,1}, X² = X. So E[X²] = E[X] = p = 0.4.',
            hintDE: 'Da X ∈ {0,1}, gilt X² = X. Also E[X²] = E[X] = p = 0,4.'
        },
        {
            q: 'X ~ Bernoulli(0.5). What is Var(X)? Enter as a decimal.',
            qDE: 'X ~ Bernoulli(0,5). Wie groß ist Var(X)? Gib als Dezimalzahl ein.',
            answer: 0.25, tolerance: 0.001, unit: '',
            hintEn: 'Var(X) = p(1−p) = 0.5 × 0.5 = 0.25.',
            hintDE: 'Var(X) = p(1−p) = 0,5 × 0,5 = 0,25.'
        },

        // ── PROPERTIES OF EXPECTATION ─────────────────────────────────────────
        {
            q: 'E[X]=3. What is E[2X + 5]? Enter a whole number.',
            qDE: 'E[X]=3. Wie groß ist E[2X + 5]? Gib eine ganze Zahl ein.',
            answer: 11, tolerance: 0, unit: '',
            hintEn: 'Linearity: E[2X+5] = 2·E[X] + 5 = 6 + 5 = 11.',
            hintDE: 'Linearität: E[2X+5] = 2·E[X] + 5 = 6 + 5 = 11.'
        },
        {
            q: 'E[X]=2, E[Y]=4. What is E[3X − Y + 1]? Enter a whole number.',
            qDE: 'E[X]=2, E[Y]=4. Wie groß ist E[3X − Y + 1]? Gib eine ganze Zahl ein.',
            answer: 3, tolerance: 0, unit: '',
            hintEn: 'E[3X − Y + 1] = 3·2 − 4 + 1 = 3.',
            hintDE: 'E[3X − Y + 1] = 3·2 − 4 + 1 = 3.'
        },
        {
            q: 'E[X]=5 and c=3 (constant). What is E[X + c]? Enter a whole number.',
            qDE: 'E[X]=5 und c=3 (Konstante). Wie groß ist E[X + c]? Gib eine ganze Zahl ein.',
            answer: 8, tolerance: 0, unit: '',
            hintEn: 'E[X + c] = E[X] + c = 5 + 3 = 8.',
            hintDE: 'E[X + c] = E[X] + c = 5 + 3 = 8.'
        },
        {
            q: 'E[X]=4, E[Y]=3. Using |E[X+Y]| ≤ E[|X+Y|] ≤ E[|X|] + E[|Y|]: what upper bound does this give for |E[X+Y]| if X,Y ≥ 0? Enter a whole number.',
            qDE: 'E[X]=4, E[Y]=3. Mit |E[X+Y]| ≤ E[|X+Y|] ≤ E[|X|] + E[|Y|]: Welche obere Schranke folgt für |E[X+Y]|, wenn X,Y ≥ 0? Gib eine ganze Zahl ein.',
            answer: 7, tolerance: 0, unit: '',
            hintEn: 'For X,Y ≥ 0: E[|X|]+E[|Y|] = E[X]+E[Y] = 4+3 = 7.',
            hintDE: 'Für X,Y ≥ 0: E[|X|]+E[|Y|] = E[X]+E[Y] = 4+3 = 7.'
        },
        {
            q: 'f(x) = x² is convex. E[X]=3, E[X²]=14. Does Jensen give E[X²] ≥ (E[X])²? Enter 1 for yes, 0 for no.',
            qDE: 'f(x) = x² ist konvex. E[X]=3, E[X²]=14. Liefert Jensen E[X²] ≥ (E[X])²? Gib 1 für ja, 0 für nein ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: '(E[X])² = 9 ≤ E[X²] = 14. Jensen holds: E[f(X)] ≥ f(E[X]) for convex f.',
            hintDE: '(E[X])² = 9 ≤ E[X²] = 14. Jensen gilt: E[f(X)] ≥ f(E[X]) für konvexes f.'
        },
        {
            q: 'f(x) = e^x is convex. By Jensen: E[e^X] ≥ e^(E[X]). If E[X]=2, what is the lower bound for E[e^X]? Enter as a decimal rounded to 3 places. (e ≈ 2.718)',
            qDE: 'f(x) = e^x ist konvex. Nach Jensen: E[e^X] ≥ e^(E[X]). Wenn E[X]=2, wie lautet die untere Schranke für E[e^X]? Auf 3 Stellen gerundet. (e ≈ 2,718)',
            answer: 7.389, tolerance: 0.01, unit: '',
            hintEn: 'e^(E[X]) = e² ≈ 7.389.',
            hintDE: 'e^(E[X]) = e² ≈ 7,389.'
        },

        // ── PRODUCT PROPERTY FOR INDEPENDENT RVs ─────────────────────────────
        {
            q: 'X and Y are independent. E[X]=5, E[Y]=3. What is E[X·Y]? Enter a whole number.',
            qDE: 'X und Y sind unabhängig. E[X]=5, E[Y]=3. Wie groß ist E[X·Y]? Gib eine ganze Zahl ein.',
            answer: 15, tolerance: 0, unit: '',
            hintEn: 'For independent X,Y: E[XY] = E[X]·E[Y] = 5·3 = 15.',
            hintDE: 'Für unabhängige X,Y: E[XY] = E[X]·E[Y] = 5·3 = 15.'
        },
        {
            q: 'X and Y are independent with E[X]=2, E[Y]=6, E[X²]=5. What is E[X²·Y]? Enter a whole number.',
            qDE: 'X und Y sind unabhängig mit E[X]=2, E[Y]=6, E[X²]=5. Wie groß ist E[X²·Y]? Gib eine ganze Zahl ein.',
            answer: 30, tolerance: 0, unit: '',
            hintEn: 'g(X)=X² and Y are independent: E[X²·Y] = E[X²]·E[Y] = 5·6 = 30.',
            hintDE: 'g(X)=X² und Y sind unabhängig: E[X²·Y] = E[X²]·E[Y] = 5·6 = 30.'
        },
        {
            q: 'X and Y are NOT independent. Can we always conclude E[XY] = E[X]·E[Y]? Enter 1 for yes, 0 for no.',
            qDE: 'X und Y sind NICHT unabhängig. Können wir immer auf E[XY] = E[X]·E[Y] schließen? Gib 1 für ja, 0 für nein ein.',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'E[XY] = E[X]·E[Y] requires independence. Without it, the formula may fail.',
            hintDE: 'E[XY] = E[X]·E[Y] erfordert Unabhängigkeit. Ohne diese kann die Formel falsch sein.'
        },

        // ── VARIANCE AND STANDARD DEVIATION ──────────────────────────────────
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
            hintEn: 'E[X]=1, E[X²]=0·0.5+4·0.5=2. Var(X)=2−1=1.',
            hintDE: 'E[X]=1, E[X²]=0·0,5+4·0,5=2. Var(X)=2−1=1.'
        },
        {
            q: 'X ~ Uniform[0,1]. E[X]=0.5, E[X²]=1/3. What is Var(X)? Enter as a decimal.',
            qDE: 'X ~ Gleichverteilt[0,1]. E[X]=0,5, E[X²]=1/3. Wie groß ist Var(X)? Gib als Dezimalzahl ein.',
            answer: 0.0833, tolerance: 0.002, unit: '',
            hintEn: 'Var(X) = 1/3 − (1/2)² = 1/3 − 1/4 = 1/12 ≈ 0.0833.',
            hintDE: 'Var(X) = 1/3 − (1/2)² = 1/3 − 1/4 = 1/12 ≈ 0,0833.'
        },

        // ── VERSCHIEBUNGSSATZ (SHIFT THEOREM / COMPUTATIONAL FORMULA) ────────
        {
            q: 'E[X]=5, E[X²]=30. Using Var(X) = E[X²] − (E[X])², what is Var(X)? Enter a whole number.',
            qDE: 'E[X]=5, E[X²]=30. Mit Var(X) = E[X²] − (E[X])², wie groß ist Var(X)? Gib eine ganze Zahl ein.',
            answer: 5, tolerance: 0, unit: '',
            hintEn: 'Var(X) = 30 − 25 = 5.',
            hintDE: 'Var(X) = 30 − 25 = 5.'
        },
        {
            q: 'E[X]=3, Var(X)=7. What is E[X²]? Enter a whole number.',
            qDE: 'E[X]=3, Var(X)=7. Wie groß ist E[X²]? Gib eine ganze Zahl ein.',
            answer: 16, tolerance: 0, unit: '',
            hintEn: 'E[X²] = Var(X) + (E[X])² = 7 + 9 = 16.',
            hintDE: 'E[X²] = Var(X) + (E[X])² = 7 + 9 = 16.'
        },
        {
            q: 'X ~ Bernoulli(0.4). E[X]=0.4, E[X²]=0.4. Using the shift theorem, what is Var(X)? Enter as a decimal.',
            qDE: 'X ~ Bernoulli(0,4). E[X]=0,4, E[X²]=0,4. Mit dem Verschiebungssatz: Wie groß ist Var(X)? Gib als Dezimalzahl ein.',
            answer: 0.24, tolerance: 0.001, unit: '',
            hintEn: 'Var(X) = E[X²] − (E[X])² = 0.4 − 0.16 = 0.24.',
            hintDE: 'Var(X) = E[X²] − (E[X])² = 0,4 − 0,16 = 0,24.'
        },

        // ── Var(aX) = a²·Var(X) ──────────────────────────────────────────────
        {
            q: 'Var(X)=4. What is Var(3X)? Enter a whole number.',
            qDE: 'Var(X)=4. Wie groß ist Var(3X)? Gib eine ganze Zahl ein.',
            answer: 36, tolerance: 0, unit: '',
            hintEn: 'Var(aX) = a²·Var(X) = 9·4 = 36.',
            hintDE: 'Var(aX) = a²·Var(X) = 9·4 = 36.'
        },
        {
            q: 'Var(X)=5. What is Var(−2X)? Enter a whole number.',
            qDE: 'Var(X)=5. Wie groß ist Var(−2X)? Gib eine ganze Zahl ein.',
            answer: 20, tolerance: 0, unit: '',
            hintEn: 'Var(−2X) = (−2)²·Var(X) = 4·5 = 20.',
            hintDE: 'Var(−2X) = (−2)²·Var(X) = 4·5 = 20.'
        },
        {
            q: 'Var(X)=4. What is Var(X + 7)? Enter a whole number.',
            qDE: 'Var(X)=4. Wie groß ist Var(X + 7)? Gib eine ganze Zahl ein.',
            answer: 4, tolerance: 0, unit: '',
            hintEn: 'Adding a constant does not change variance: Var(X+c) = Var(X) = 4.',
            hintDE: 'Eine Konstante addieren ändert die Varianz nicht: Var(X+c) = Var(X) = 4.'
        },
        {
            q: 'Var(X)=3. What is Var(2X + 1)? Enter a whole number.',
            qDE: 'Var(X)=3. Wie groß ist Var(2X + 1)? Gib eine ganze Zahl ein.',
            answer: 12, tolerance: 0, unit: '',
            hintEn: 'Var(aX+b) = a²·Var(X) = 4·3 = 12.',
            hintDE: 'Var(aX+b) = a²·Var(X) = 4·3 = 12.'
        },

        // ── VARIANCE OF SUM (INDEPENDENT) ────────────────────────────────────
        {
            q: 'X and Y are independent with Var(X)=3, Var(Y)=5. What is Var(X+Y)? Enter a whole number.',
            qDE: 'X und Y sind unabhängig mit Var(X)=3, Var(Y)=5. Wie groß ist Var(X+Y)? Gib eine ganze Zahl ein.',
            answer: 8, tolerance: 0, unit: '',
            hintEn: 'For independent X,Y: Var(X+Y) = Var(X)+Var(Y) = 3+5 = 8.',
            hintDE: 'Für unabhängige X,Y: Var(X+Y) = Var(X)+Var(Y) = 3+5 = 8.'
        },
        {
            q: 'X and Y are independent with Var(X)=4, Var(Y)=4. What is Var(X−Y)? Enter a whole number.',
            qDE: 'X und Y sind unabhängig mit Var(X)=4, Var(Y)=4. Wie groß ist Var(X−Y)? Gib eine ganze Zahl ein.',
            answer: 8, tolerance: 0, unit: '',
            hintEn: 'Var(X−Y) = Var(X) + (−1)²·Var(Y) = 4+4 = 8 for independent X,Y.',
            hintDE: 'Var(X−Y) = Var(X) + (−1)²·Var(Y) = 4+4 = 8 für unabhängige X,Y.'
        },
        {
            q: 'X₁,…,X₅ are i.i.d. with Var(Xᵢ)=6. What is Var(X₁+…+X₅)? Enter a whole number.',
            qDE: 'X₁,…,X₅ sind i.i.d. mit Var(Xᵢ)=6. Wie groß ist Var(X₁+…+X₅)? Gib eine ganze Zahl ein.',
            answer: 30, tolerance: 0, unit: '',
            hintEn: 'Var(sum of n i.i.d.) = n·Var(X) = 5·6 = 30.',
            hintDE: 'Var(Summe von n i.i.d.) = n·Var(X) = 5·6 = 30.'
        },

        // ── TRANSFORMATION THEOREM FOR E[g(X)] ───────────────────────────────
        {
            q: 'X has PMF P(X=1)=0.4, P(X=2)=0.6. What is E[X²]? Enter as a decimal.',
            qDE: 'X hat Zähldichte P(X=1)=0,4, P(X=2)=0,6. Wie groß ist E[X²]? Gib als Dezimalzahl ein.',
            answer: 2.8, tolerance: 0.001, unit: '',
            hintEn: 'E[X²] = 1²·0.4 + 2²·0.6 = 0.4 + 2.4 = 2.8.',
            hintDE: 'E[X²] = 1²·0,4 + 2²·0,6 = 0,4 + 2,4 = 2,8.'
        },
        {
            q: 'X has PMF P(X=0)=0.3, P(X=1)=0.5, P(X=2)=0.2. What is E[X²]? Enter as a decimal.',
            qDE: 'X hat Zähldichte P(X=0)=0,3, P(X=1)=0,5, P(X=2)=0,2. Wie groß ist E[X²]? Gib als Dezimalzahl ein.',
            answer: 1.3, tolerance: 0.001, unit: '',
            hintEn: 'E[X²] = 0·0.3 + 1·0.5 + 4·0.2 = 0 + 0.5 + 0.8 = 1.3.',
            hintDE: 'E[X²] = 0·0,3 + 1·0,5 + 4·0,2 = 0 + 0,5 + 0,8 = 1,3.'
        },
        {
            q: 'X ~ Uniform[0,1]. Using the transformation theorem, E[X²] = ∫₀¹ x²·1 dx. What is E[X²]? Enter as a decimal.',
            qDE: 'X ~ Gleichverteilt[0,1]. E[X²] = ∫₀¹ x²·1 dx. Wie groß ist E[X²]? Gib als Dezimalzahl ein.',
            answer: 0.333, tolerance: 0.002, unit: '',
            hintEn: '∫₀¹ x² dx = [x³/3]₀¹ = 1/3 ≈ 0.333.',
            hintDE: '∫₀¹ x² dx = [x³/3]₀¹ = 1/3 ≈ 0,333.'
        },
        {
            q: 'X has PDF f(x)=1 on [0,1]. What is E[3X² + 2]? Enter as a decimal.',
            qDE: 'X hat Dichte f(x)=1 auf [0,1]. Wie groß ist E[3X² + 2]? Gib als Dezimalzahl ein.',
            answer: 3.0, tolerance: 0.01, unit: '',
            hintEn: 'E[3X²+2] = 3·E[X²]+2 = 3·(1/3)+2 = 1+2 = 3.',
            hintDE: 'E[3X²+2] = 3·E[X²]+2 = 3·(1/3)+2 = 1+2 = 3.'
        },

        // ── BINOMIAL DISTRIBUTION ─────────────────────────────────────────────
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
        {
            q: 'X ~ Bin(n=6, p=0.4). What is P(X=0)? Enter as a decimal rounded to 4 places.',
            qDE: 'X ~ Bin(n=6, p=0,4). Wie groß ist P(X=0)? Auf 4 Stellen gerundet.',
            answer: 0.0467, tolerance: 0.001, unit: '',
            hintEn: 'P(X=0) = C(6,0)·0.4⁰·0.6⁶ = 0.6⁶ ≈ 0.0467.',
            hintDE: 'P(X=0) = C(6,0)·0,4⁰·0,6⁶ = 0,6⁶ ≈ 0,0467.'
        },

        // ── BINOMIAL COEFFICIENT ──────────────────────────────────────────────
        {
            q: 'What is C(6,2) (binomial coefficient)? Enter a whole number.',
            qDE: 'Wie groß ist C(6,2) (Binomialkoeffizient)? Gib eine ganze Zahl ein.',
            answer: 15, tolerance: 0, unit: '',
            hintEn: 'C(6,2) = 6!/(2!·4!) = 30/2 = 15.',
            hintDE: 'C(6,2) = 6!/(2!·4!) = 30/2 = 15.'
        },
        {
            q: 'What is C(5,3)? Enter a whole number.',
            qDE: 'Wie groß ist C(5,3)? Gib eine ganze Zahl ein.',
            answer: 10, tolerance: 0, unit: '',
            hintEn: 'C(5,3) = C(5,2) = 5·4/2 = 10.',
            hintDE: 'C(5,3) = C(5,2) = 5·4/2 = 10.'
        },
        {
            q: 'What is C(8,1)? Enter a whole number.',
            qDE: 'Wie groß ist C(8,1)? Gib eine ganze Zahl ein.',
            answer: 8, tolerance: 0, unit: '',
            hintEn: 'C(n,1) = n for any n.',
            hintDE: 'C(n,1) = n für beliebiges n.'
        },
        {
            q: 'What is C(7,0)? Enter a whole number.',
            qDE: 'Wie groß ist C(7,0)? Gib eine ganze Zahl ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'C(n,0) = 1 for any n — there is exactly one way to choose 0 items.',
            hintDE: 'C(n,0) = 1 für beliebiges n — es gibt genau eine Möglichkeit, 0 Elemente zu wählen.'
        },

        // ── CONVOLUTION OF BINOMIAL DISTRIBUTIONS ────────────────────────────
        {
            q: 'X ~ Bin(3, 0.4) and Y ~ Bin(2, 0.4) are independent. X+Y follows Bin(n, 0.4). What is n? Enter a whole number.',
            qDE: 'X ~ Bin(3; 0,4) und Y ~ Bin(2; 0,4) sind unabhängig. X+Y folgt Bin(n; 0,4). Wie groß ist n? Gib eine ganze Zahl ein.',
            answer: 5, tolerance: 0, unit: '',
            hintEn: 'Convolution: Bin(3,p)*Bin(2,p) = Bin(5,p) for the same p.',
            hintDE: 'Faltung: Bin(3,p)*Bin(2,p) = Bin(5,p) für dasselbe p.'
        },
        {
            q: 'X ~ Bin(4, 0.6) and Y ~ Bin(6, 0.6) are independent. What is E[X+Y]? Enter a whole number.',
            qDE: 'X ~ Bin(4; 0,6) und Y ~ Bin(6; 0,6) sind unabhängig. Wie groß ist E[X+Y]? Gib eine ganze Zahl ein.',
            answer: 6, tolerance: 0, unit: '',
            hintEn: 'X+Y ~ Bin(10,0.6). E[X+Y] = 10·0.6 = 6.',
            hintDE: 'X+Y ~ Bin(10;0,6). E[X+Y] = 10·0,6 = 6.'
        },
        {
            q: 'X ~ Bin(5, 0.5) and Y ~ Bin(5, 0.5) are independent. What is Var(X+Y)? Enter as a decimal.',
            qDE: 'X ~ Bin(5; 0,5) und Y ~ Bin(5; 0,5) sind unabhängig. Wie groß ist Var(X+Y)? Gib als Dezimalzahl ein.',
            answer: 2.5, tolerance: 0.001, unit: '',
            hintEn: 'X+Y ~ Bin(10,0.5). Var = 10·0.5·0.5 = 2.5. Or: Var(X)+Var(Y) = 2·(5·0.5·0.5) = 2·1.25 = 2.5.',
            hintDE: 'X+Y ~ Bin(10;0,5). Var = 10·0,5·0,5 = 2,5. Oder: Var(X)+Var(Y) = 2·(5·0,5·0,5) = 2·1,25 = 2,5.'
        },
        {
            q: 'X ~ Bin(2, 0.3) and Y ~ Bin(3, 0.3) are independent. What is P(X+Y = 0)? Enter as a decimal rounded to 4 places.',
            qDE: 'X ~ Bin(2; 0,3) und Y ~ Bin(3; 0,3) sind unabhängig. Wie groß ist P(X+Y = 0)? Auf 4 Stellen gerundet.',
            answer: 0.1681, tolerance: 0.001, unit: '',
            hintEn: 'X+Y ~ Bin(5,0.3). P(X+Y=0) = 0.7⁵ ≈ 0.1681.',
            hintDE: 'X+Y ~ Bin(5;0,3). P(X+Y=0) = 0,7⁵ ≈ 0,1681.'
        },

        // ── DRAWING WITHOUT ORDER, WITHOUT REPLACEMENT ────────────────────────
        {
            q: 'How many ways can you choose 2 balls from 6 without replacement, ignoring order? (C(6,2))',
            qDE: 'Wie viele Möglichkeiten gibt es, 2 aus 6 Bällen ohne Zurücklegen zu wählen, Reihenfolge egal? (C(6,2))',
            answer: 15, tolerance: 0, unit: 'ways',
            hintEn: 'C(6,2) = 6!/(2!·4!) = 15.',
            hintDE: 'C(6,2) = 6!/(2!·4!) = 15.'
        },
        {
            q: 'Urn: 10 balls, 4 red, 6 blue. Draw 2 without replacement, no order. How many ways give 2 red balls?',
            qDE: 'Urne: 10 Bälle, 4 rote, 6 blaue. 2 ohne Zurücklegen ziehen, ohne Reihenfolge. Wie viele Möglichkeiten liefern 2 rote Bälle?',
            answer: 6, tolerance: 0, unit: 'ways',
            hintEn: 'C(4,2) = 4!/(2!·2!) = 6.',
            hintDE: 'C(4,2) = 4!/(2!·2!) = 6.'
        },
        {
            q: 'Urn: 5 red, 5 blue balls. Draw 3 without replacement, no order. Total outcomes = C(10,3) = 120. What is P(exactly 2 red)? Enter as a decimal.',
            qDE: 'Urne: 5 rote, 5 blaue Bälle. 3 ohne Zurücklegen, ohne Reihenfolge. Gesamtergebnisse = C(10,3) = 120. Wie groß ist P(genau 2 rote)? Gib als Dezimalzahl ein.',
            answer: 0.4167, tolerance: 0.005, unit: '',
            hintEn: 'Favourable: C(5,2)·C(5,1) = 10·5 = 50. P = 50/120 ≈ 0.4167.',
            hintDE: 'Günstige: C(5,2)·C(5,1) = 10·5 = 50. P = 50/120 ≈ 0,4167.'
        },

        // ── DRAWING WITHOUT ORDER, WITH REPLACEMENT ───────────────────────────
        {
            q: 'Urn with 4 balls. Draw 2 with replacement, no order. How many distinct unordered outcomes (multisets) are possible? C(4+2−1,2)=?',
            qDE: 'Urne mit 4 Bällen. 2 mit Zurücklegen, ohne Reihenfolge. Wie viele verschiedene Multimengen gibt es? C(4+2−1,2)=?',
            answer: 10, tolerance: 0, unit: 'outcomes',
            hintEn: 'C(n+k−1,k) = C(5,2) = 10.',
            hintDE: 'C(n+k−1,k) = C(5,2) = 10.'
        },
        {
            q: 'Urn with 3 colours. Draw 3 times with replacement, no order. How many colour combinations? C(3+3−1,3)=C(5,3)=?',
            qDE: 'Urne mit 3 Farben. 3 Mal mit Zurücklegen, ohne Reihenfolge. Wie viele Farbkombinationen? C(3+3−1,3)=C(5,3)=?',
            answer: 10, tolerance: 0, unit: 'combinations',
            hintEn: 'C(5,3) = 5!/(3!·2!) = 10.',
            hintDE: 'C(5,3) = 5!/(3!·2!) = 10.'
        },
        {
            q: 'Urn: n=5 balls, draw k=2 with replacement, no order. How many unordered outcomes? C(n+k−1,k)=C(6,2)=?',
            qDE: 'Urne: n=5 Bälle, k=2 Züge mit Zurücklegen, ohne Reihenfolge. Wie viele ungeordnete Ergebnisse? C(n+k−1,k)=C(6,2)=?',
            answer: 15, tolerance: 0, unit: 'outcomes',
            hintEn: 'C(6,2) = 15.',
            hintDE: 'C(6,2) = 15.'
        },








    ],

    // ── WORLD 5 ─────────────────────────────────────────────────────────
    //
    5: [
        // ── WORLD 5 QUESTIONS ────────────────────────────────────────────────────────
        // Add these to the existing 5: [ ... ] pool

        // ── 1. HYPERGEOMETRISCHE VERTEILUNG ──────────────────────────────────────────
        {
            q: 'An urn has 10 balls: 4 red, 6 blue. Draw 3 without replacement. What is P(exactly 2 red)? Use P = C(4,2)·C(6,1)/C(10,3). Enter as a decimal rounded to 4 places.',
            qDE: 'Eine Urne hat 10 Bälle: 4 rote, 6 blaue. Ziehe 3 ohne Zurücklegen. Wie groß ist P(genau 2 rote)? Nutze P = C(4,2)·C(6,1)/C(10,3). Auf 4 Stellen gerundet.',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'C(4,2)·C(6,1)/C(10,3) = 6·6/120 = 36/120 = 0.3.',
            hintDE: 'C(4,2)·C(6,1)/C(10,3) = 6·6/120 = 36/120 = 0,3.'
        },
        {
            q: 'Urn: N=8 balls, K=3 red, draw n=2 without replacement. What is E[X] where X = number of red balls drawn? Enter as a decimal.',
            qDE: 'Urne: N=8 Bälle, K=3 rote, ziehe n=2 ohne Zurücklegen. Wie groß ist E[X], wobei X = Anzahl roter Bälle? Gib als Dezimalzahl ein.',
            answer: 0.75, tolerance: 0.001, unit: '',
            hintEn: 'E[X] = n·K/N = 2·3/8 = 0.75.',
            hintDE: 'E[X] = n·K/N = 2·3/8 = 0,75.'
        },
        {
            q: 'Urn: N=10, K=4, n=3. What is Var(X) for the hypergeometric distribution? Use Var(X) = n·(K/N)·(1−K/N)·(N−n)/(N−1). Enter as a decimal rounded to 4 places.',
            qDE: 'Urne: N=10, K=4, n=3. Wie groß ist Var(X) der hypergeometrischen Verteilung? Nutze Var(X) = n·(K/N)·(1−K/N)·(N−n)/(N−1). Auf 4 Stellen gerundet.',
            answer: 0.56, tolerance: 0.005, unit: '',
            hintEn: 'Var(X) = 3·(4/10)·(6/10)·(7/9) = 3·0.4·0.6·0.778 ≈ 0.56.',
            hintDE: 'Var(X) = 3·(4/10)·(6/10)·(7/9) = 3·0,4·0,6·0,778 ≈ 0,56.'
        },

        // ── 2. GEOMETRISCHE VERTEILUNG ────────────────────────────────────────────────
        {
            q: 'X ~ Geom(p=0.4): number of trials until first success. What is P(X=3)? (P(X=k) = (1−p)^(k−1)·p.) Enter as a decimal.',
            qDE: 'X ~ Geom(p=0,4): Anzahl Versuche bis zum ersten Erfolg. Wie groß ist P(X=3)? (P(X=k) = (1−p)^(k−1)·p.) Gib als Dezimalzahl ein.',
            answer: 0.144, tolerance: 0.002, unit: '',
            hintEn: 'P(X=3) = 0.6²·0.4 = 0.36·0.4 = 0.144.',
            hintDE: 'P(X=3) = 0,6²·0,4 = 0,36·0,4 = 0,144.'
        },
        {
            q: 'X ~ Geom(p=0.25). What is E[X]? Enter as a whole number.',
            qDE: 'X ~ Geom(p=0,25). Wie groß ist E[X]? Gib eine ganze Zahl ein.',
            answer: 4, tolerance: 0, unit: '',
            hintEn: 'E[X] = 1/p = 1/0.25 = 4.',
            hintDE: 'E[X] = 1/p = 1/0,25 = 4.'
        },
        {
            q: 'X ~ Geom(p=0.5). What is P(X > 3)? Use the memoryless property or P(X>k) = (1−p)^k. Enter as a decimal.',
            qDE: 'X ~ Geom(p=0,5). Wie groß ist P(X > 3)? Nutze P(X>k) = (1−p)^k. Gib als Dezimalzahl ein.',
            answer: 0.125, tolerance: 0.001, unit: '',
            hintEn: 'P(X > 3) = (1−0.5)³ = 0.5³ = 0.125.',
            hintDE: 'P(X > 3) = (1−0,5)³ = 0,5³ = 0,125.'
        },

        // ── 3. BERNOULLI-FOLGE ────────────────────────────────────────────────────────
        {
            q: 'A Bernoulli sequence has p=0.3. What is the probability of the pattern S-F-S (success, failure, success) in exactly that order?',
            qDE: 'Eine Bernoulli-Folge hat p=0,3. Wie groß ist die Wahrscheinlichkeit des Musters E-M-E (Erfolg, Misserfolg, Erfolg) in genau dieser Reihenfolge?',
            answer: 0.063, tolerance: 0.001, unit: '',
            hintEn: 'P = p·(1−p)·p = 0.3·0.7·0.3 = 0.063.',
            hintDE: 'P = p·(1−p)·p = 0,3·0,7·0,3 = 0,063.'
        },
        {
            q: 'In a Bernoulli sequence with p=0.5, what is the probability of getting exactly 3 successes in 5 trials? (This is a Binomial calculation.)',
            qDE: 'In einer Bernoulli-Folge mit p=0,5: Wie groß ist die Wahrscheinlichkeit von genau 3 Erfolgen in 5 Versuchen?',
            answer: 0.3125, tolerance: 0.001, unit: '',
            hintEn: 'C(5,3)·0.5³·0.5² = 10·0.03125 = 0.3125.',
            hintDE: 'C(5,3)·0,5³·0,5² = 10·0,03125 = 0,3125.'
        },
        {
            q: 'A Bernoulli sequence has p=0.2. What is the probability that the first success occurs on trial 4 or later? P(X ≥ 4) = (1−p)³. Enter as a decimal.',
            qDE: 'Eine Bernoulli-Folge hat p=0,2. Wie groß ist P(X ≥ 4), d.h. der erste Erfolg tritt frühestens beim 4. Versuch auf? P(X ≥ 4) = (1−p)³. Gib als Dezimalzahl ein.',
            answer: 0.512, tolerance: 0.001, unit: '',
            hintEn: 'P(X ≥ 4) = (0.8)³ = 0.512.',
            hintDE: 'P(X ≥ 4) = (0,8)³ = 0,512.'
        },

        // ── 4. NEGATIVE BINOMIALVERTEILUNG ───────────────────────────────────────────
        {
            q: 'X ~ NegBin(r=2, p=0.5): number of trials until 2nd success. What is P(X=4)? Use P(X=k) = C(k−1, r−1)·p^r·(1−p)^(k−r). Enter as a decimal.',
            qDE: 'X ~ NegBin(r=2, p=0,5): Anzahl Versuche bis zum 2. Erfolg. Wie groß ist P(X=4)? Nutze P(X=k) = C(k−1, r−1)·p^r·(1−p)^(k−r). Gib als Dezimalzahl ein.',
            answer: 0.1875, tolerance: 0.002, unit: '',
            hintEn: 'P(X=4) = C(3,1)·0.5²·0.5² = 3·0.0625 = 0.1875.',
            hintDE: 'P(X=4) = C(3,1)·0,5²·0,5² = 3·0,0625 = 0,1875.'
        },
        {
            q: 'X ~ NegBin(r=3, p=0.4). What is E[X]? Enter as a decimal.',
            qDE: 'X ~ NegBin(r=3, p=0,4). Wie groß ist E[X]? Gib als Dezimalzahl ein.',
            answer: 7.5, tolerance: 0.001, unit: '',
            hintEn: 'E[X] = r/p = 3/0.4 = 7.5.',
            hintDE: 'E[X] = r/p = 3/0,4 = 7,5.'
        },
        {
            q: 'X ~ NegBin(r=2, p=0.5). What is Var(X)? Use Var(X) = r·(1−p)/p². Enter as a decimal.',
            qDE: 'X ~ NegBin(r=2, p=0,5). Wie groß ist Var(X)? Nutze Var(X) = r·(1−p)/p². Gib als Dezimalzahl ein.',
            answer: 4.0, tolerance: 0.001, unit: '',
            hintEn: 'Var(X) = 2·0.5/0.25 = 1/0.25 = 4.',
            hintDE: 'Var(X) = 2·0,5/0,25 = 1/0,25 = 4.'
        },

        // ── 5. POISSONVERTEILUNG ──────────────────────────────────────────────────────
        {
            q: 'X ~ Poisson(λ=3). What is P(X=0)? Use P(X=k) = e^(−λ)·λ^k/k!. Enter as a decimal rounded to 4 places. (e^(−3) ≈ 0.0498)',
            qDE: 'X ~ Poisson(λ=3). Wie groß ist P(X=0)? Nutze P(X=k) = e^(−λ)·λ^k/k!. Auf 4 Stellen gerundet. (e^(−3) ≈ 0,0498)',
            answer: 0.0498, tolerance: 0.001, unit: '',
            hintEn: 'P(X=0) = e^(−3)·3⁰/0! = e^(−3) ≈ 0.0498.',
            hintDE: 'P(X=0) = e^(−3)·3⁰/0! = e^(−3) ≈ 0,0498.'
        },
        {
            q: 'X ~ Poisson(λ=2). What is P(X=2)? (e^(−2) ≈ 0.1353.) Enter as a decimal rounded to 4 places.',
            qDE: 'X ~ Poisson(λ=2). Wie groß ist P(X=2)? (e^(−2) ≈ 0,1353.) Auf 4 Stellen gerundet.',
            answer: 0.2707, tolerance: 0.002, unit: '',
            hintEn: 'P(X=2) = e^(−2)·2²/2! = 0.1353·4/2 = 0.1353·2 = 0.2706.',
            hintDE: 'P(X=2) = e^(−2)·2²/2! = 0,1353·4/2 = 0,1353·2 = 0,2706.'
        },
        {
            q: 'X ~ Poisson(λ=5). What is E[X] and Var(X)? They are both equal to λ. Enter the value.',
            qDE: 'X ~ Poisson(λ=5). Wie groß sind E[X] und Var(X)? Beide sind gleich λ. Gib den Wert ein.',
            answer: 5, tolerance: 0, unit: '',
            hintEn: 'For Poisson(λ): E[X] = Var(X) = λ = 5.',
            hintDE: 'Für Poisson(λ): E[X] = Var(X) = λ = 5.'
        },

        // ── 6. POISSON-GRENZWERTSATZ ──────────────────────────────────────────────────
        {
            q: 'X ~ Bin(n=100, p=0.03). Approximate using Poisson. What is λ? Enter as a decimal.',
            qDE: 'X ~ Bin(n=100, p=0,03). Nähere durch Poisson an. Wie groß ist λ? Gib als Dezimalzahl ein.',
            answer: 3.0, tolerance: 0.001, unit: '',
            hintEn: 'λ = n·p = 100·0.03 = 3.',
            hintDE: 'λ = n·p = 100·0,03 = 3.'
        },
        {
            q: 'X ~ Bin(n=200, p=0.01). Using the Poisson approximation with λ=n·p, what is P(X=0)? (e^(−2) ≈ 0.1353.) Enter as a decimal rounded to 4 places.',
            qDE: 'X ~ Bin(n=200, p=0,01). Mit der Poisson-Näherung λ=n·p: Wie groß ist P(X=0)? (e^(−2) ≈ 0,1353.) Auf 4 Stellen.',
            answer: 0.1353, tolerance: 0.002, unit: '',
            hintEn: 'λ = 2. P(X=0) ≈ e^(−2) ≈ 0.1353.',
            hintDE: 'λ = 2. P(X=0) ≈ e^(−2) ≈ 0,1353.'
        },
        {
            q: 'For the Poisson limit theorem, the approximation Bin(n,p) ≈ Poisson(λ) is good when n is large and p is small. If n=1000 and λ=2, what is p? Enter as a decimal.',
            qDE: 'Für den Poisson-Grenzwertsatz gilt Bin(n,p) ≈ Poisson(λ) gut, wenn n groß und p klein ist. Wenn n=1000 und λ=2, wie groß ist p? Gib als Dezimalzahl ein.',
            answer: 0.002, tolerance: 0.0001, unit: '',
            hintEn: 'p = λ/n = 2/1000 = 0.002.',
            hintDE: 'p = λ/n = 2/1000 = 0,002.'
        },

        // ── 7. STETIGE GLEICHVERTEILUNG ───────────────────────────────────────────────
        {
            q: 'X ~ Uniform[2, 8]. What is E[X]? Enter as a whole number.',
            qDE: 'X ~ Gleichverteilt[2, 8]. Wie groß ist E[X]? Gib eine ganze Zahl ein.',
            answer: 5, tolerance: 0, unit: '',
            hintEn: 'E[X] = (a+b)/2 = (2+8)/2 = 5.',
            hintDE: 'E[X] = (a+b)/2 = (2+8)/2 = 5.'
        },
        {
            q: 'X ~ Uniform[0, 10]. What is P(3 ≤ X ≤ 7)? Enter as a decimal.',
            qDE: 'X ~ Gleichverteilt[0, 10]. Wie groß ist P(3 ≤ X ≤ 7)? Gib als Dezimalzahl ein.',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'P(3 ≤ X ≤ 7) = (7−3)/(10−0) = 4/10 = 0.4.',
            hintDE: 'P(3 ≤ X ≤ 7) = (7−3)/(10−0) = 4/10 = 0,4.'
        },
        {
            q: 'X ~ Uniform[a, b]. What is Var(X)? Use Var(X) = (b−a)²/12. For a=0, b=6, what is Var(X)? Enter as a whole number.',
            qDE: 'X ~ Gleichverteilt[a, b]. Var(X) = (b−a)²/12. Für a=0, b=6: Wie groß ist Var(X)? Gib eine ganze Zahl ein.',
            answer: 3, tolerance: 0, unit: '',
            hintEn: 'Var(X) = (6−0)²/12 = 36/12 = 3.',
            hintDE: 'Var(X) = (6−0)²/12 = 36/12 = 3.'
        },

        // ── 8. EXPONENTIALVERTEILUNG ──────────────────────────────────────────────────
        {
            q: 'X ~ Exp(λ=0.5). What is E[X]? Enter as a whole number.',
            qDE: 'X ~ Exp(λ=0,5). Wie groß ist E[X]? Gib eine ganze Zahl ein.',
            answer: 2, tolerance: 0, unit: '',
            hintEn: 'E[X] = 1/λ = 1/0.5 = 2.',
            hintDE: 'E[X] = 1/λ = 1/0,5 = 2.'
        },
        {
            q: 'X ~ Exp(λ=2). What is P(X ≤ 1)? Use F(x) = 1 − e^(−λx). (e^(−2) ≈ 0.1353.) Enter as a decimal rounded to 4 places.',
            qDE: 'X ~ Exp(λ=2). Wie groß ist P(X ≤ 1)? Nutze F(x) = 1 − e^(−λx). (e^(−2) ≈ 0,1353.) Auf 4 Stellen.',
            answer: 0.8647, tolerance: 0.002, unit: '',
            hintEn: 'F(1) = 1 − e^(−2) ≈ 1 − 0.1353 = 0.8647.',
            hintDE: 'F(1) = 1 − e^(−2) ≈ 1 − 0,1353 = 0,8647.'
        },
        {
            q: 'X ~ Exp(λ=3). What is Var(X)? Enter as a fraction — give the numerator of 1/λ².',
            qDE: 'X ~ Exp(λ=3). Wie groß ist Var(X)? Gib den Zähler von 1/λ² an.',
            answer: 1, tolerance: 0, unit: '/ 9',
            hintEn: 'Var(X) = 1/λ² = 1/9.',
            hintDE: 'Var(X) = 1/λ² = 1/9.'
        },

        // ── 9. NORMALVERTEILUNG ───────────────────────────────────────────────────────
        {
            q: 'X ~ N(μ=10, σ²=4). What is the standard deviation σ? Enter as a whole number.',
            qDE: 'X ~ N(μ=10, σ²=4). Wie groß ist die Standardabweichung σ? Gib eine ganze Zahl ein.',
            answer: 2, tolerance: 0, unit: '',
            hintEn: 'σ = √σ² = √4 = 2.',
            hintDE: 'σ = √σ² = √4 = 2.'
        },
        {
            q: 'X ~ N(μ=5, σ=2). To standardize: Z = (X−μ)/σ. What is the Z-score for X=9?',
            qDE: 'X ~ N(μ=5, σ=2). Standardisierung: Z = (X−μ)/σ. Wie groß ist der Z-Wert für X=9?',
            answer: 2.0, tolerance: 0.001, unit: '',
            hintEn: 'Z = (9−5)/2 = 4/2 = 2.',
            hintDE: 'Z = (9−5)/2 = 4/2 = 2.'
        },
        {
            q: 'X ~ N(μ=0, σ=1). Using Φ(1.96) ≈ 0.975, what is P(−1.96 ≤ X ≤ 1.96)? Enter as a decimal.',
            qDE: 'X ~ N(μ=0, σ=1). Mit Φ(1,96) ≈ 0,975: Wie groß ist P(−1,96 ≤ X ≤ 1,96)? Gib als Dezimalzahl ein.',
            answer: 0.95, tolerance: 0.002, unit: '',
            hintEn: 'P(−1.96 ≤ Z ≤ 1.96) = Φ(1.96) − Φ(−1.96) = 0.975 − 0.025 = 0.95.',
            hintDE: 'P(−1,96 ≤ Z ≤ 1,96) = Φ(1,96) − Φ(−1,96) = 0,975 − 0,025 = 0,95.'
        },

        // ── 10. RECHNEN MIT NORMALVERTEILTEN ZUFALLSVARIABLEN ─────────────────────────
        {
            q: 'X ~ N(μ=3, σ²=1), Y ~ N(μ=2, σ²=4), independent. What is the distribution of X+Y? Give E[X+Y].',
            qDE: 'X ~ N(μ=3, σ²=1), Y ~ N(μ=2, σ²=4), unabhängig. Welche Verteilung hat X+Y? Gib E[X+Y] an.',
            answer: 5, tolerance: 0, unit: '',
            hintEn: 'X+Y ~ N(μ_X+μ_Y, σ²_X+σ²_Y) = N(5, 5). E[X+Y] = 5.',
            hintDE: 'X+Y ~ N(μ_X+μ_Y, σ²_X+σ²_Y) = N(5, 5). E[X+Y] = 5.'
        },
        {
            q: 'X ~ N(μ=3, σ²=1), Y ~ N(μ=2, σ²=4), independent. What is Var(X+Y)?',
            qDE: 'X ~ N(μ=3, σ²=1), Y ~ N(μ=2, σ²=4), unabhängig. Wie groß ist Var(X+Y)?',
            answer: 5, tolerance: 0, unit: '',
            hintEn: 'Var(X+Y) = Var(X) + Var(Y) = 1 + 4 = 5 (independence).',
            hintDE: 'Var(X+Y) = Var(X) + Var(Y) = 1 + 4 = 5 (Unabhängigkeit).'
        },
        {
            q: 'X ~ N(μ=10, σ=3). What is P(X ≤ 10)? By symmetry of the normal distribution. Enter as a decimal.',
            qDE: 'X ~ N(μ=10, σ=3). Wie groß ist P(X ≤ 10)? Durch Symmetrie der Normalverteilung. Gib als Dezimalzahl ein.',
            answer: 0.5, tolerance: 0.001, unit: '',
            hintEn: 'P(X ≤ μ) = 0.5 by symmetry of the normal distribution.',
            hintDE: 'P(X ≤ μ) = 0,5 wegen der Symmetrie der Normalverteilung.'
        },

        // ── 11. ZUFALLSVEKTOREN ───────────────────────────────────────────────────────
        {
            q: 'A random vector (X,Y) has joint PMF: p(0,0)=0.1, p(0,1)=0.2, p(1,0)=0.3, p(1,1)=0.4. What is P(X=1)? Enter as a decimal.',
            qDE: 'Ein Zufallsvektor (X,Y) hat gemeinsame Zähldichte: p(0,0)=0,1, p(0,1)=0,2, p(1,0)=0,3, p(1,1)=0,4. Wie groß ist P(X=1)? Gib als Dezimalzahl ein.',
            answer: 0.7, tolerance: 0.001, unit: '',
            hintEn: 'P(X=1) = p(1,0) + p(1,1) = 0.3 + 0.4 = 0.7.',
            hintDE: 'P(X=1) = p(1,0) + p(1,1) = 0,3 + 0,4 = 0,7.'
        },
        {
            q: 'Joint PMF: p(0,0)=0.1, p(0,1)=0.2, p(1,0)=0.3, p(1,1)=0.4. What is P(Y=1)? Enter as a decimal.',
            qDE: 'Gemeinsame Zähldichte: p(0,0)=0,1, p(0,1)=0,2, p(1,0)=0,3, p(1,1)=0,4. Wie groß ist P(Y=1)? Gib als Dezimalzahl ein.',
            answer: 0.6, tolerance: 0.001, unit: '',
            hintEn: 'P(Y=1) = p(0,1) + p(1,1) = 0.2 + 0.4 = 0.6.',
            hintDE: 'P(Y=1) = p(0,1) + p(1,1) = 0,2 + 0,4 = 0,6.'
        },
        {
            q: 'Joint PMF: p(0,0)=0.1, p(0,1)=0.2, p(1,0)=0.3, p(1,1)=0.4. What is E[X+Y]? Enter as a decimal.',
            qDE: 'Gemeinsame Zähldichte: p(0,0)=0,1, p(0,1)=0,2, p(1,0)=0,3, p(1,1)=0,4. Wie groß ist E[X+Y]? Gib als Dezimalzahl ein.',
            answer: 1.3, tolerance: 0.001, unit: '',
            hintEn: 'E[X+Y] = 0·0.1 + 1·0.2 + 1·0.3 + 2·0.4 = 0 + 0.2 + 0.3 + 0.8 = 1.3.',
            hintDE: 'E[X+Y] = 0·0,1 + 1·0,2 + 1·0,3 + 2·0,4 = 0 + 0,2 + 0,3 + 0,8 = 1,3.'
        },

        // ── 12. VERTEILUNG VON ZUFALLSVEKTOREN ───────────────────────────────────────
        {
            q: 'A joint PDF is f(x,y) = c on the unit square [0,1]². What must c be for a valid joint density? Enter a whole number.',
            qDE: 'Eine gemeinsame Dichte ist f(x,y) = c auf dem Einheitsquadrat [0,1]². Welchen Wert muss c haben? Gib eine ganze Zahl ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: '∫₀¹ ∫₀¹ c dx dy = c = 1.',
            hintDE: '∫₀¹ ∫₀¹ c dx dy = c = 1.'
        },
        {
            q: 'Joint PDF f(x,y) = 2x on [0,1]². What is the marginal PDF f_X(x)? It equals ∫₀¹ 2x dy. Enter the value for x=0.4.',
            qDE: 'Gemeinsame Dichte f(x,y) = 2x auf [0,1]². Wie groß ist die Randdichte f_X(x)? Sie ist ∫₀¹ 2x dy. Gib den Wert für x=0,4 ein.',
            answer: 0.8, tolerance: 0.001, unit: '',
            hintEn: 'f_X(x) = ∫₀¹ 2x dy = 2x·1 = 2x. At x=0.4: f_X(0.4) = 2·0.4 = 0.8.',
            hintDE: 'f_X(x) = ∫₀¹ 2x dy = 2x·1 = 2x. Bei x=0,4: f_X(0,4) = 2·0,4 = 0,8.'
        },
        {
            q: 'Joint PMF: p(1,1)=0.3, p(1,2)=0.2, p(2,1)=0.1, p(2,2)=0.4. What is P(X=2, Y=2)? Enter as a decimal.',
            qDE: 'Gemeinsame Zähldichte: p(1,1)=0,3, p(1,2)=0,2, p(2,1)=0,1, p(2,2)=0,4. Wie groß ist P(X=2, Y=2)? Gib als Dezimalzahl ein.',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'P(X=2, Y=2) = p(2,2) = 0.4 directly from the table.',
            hintDE: 'P(X=2, Y=2) = p(2,2) = 0,4 direkt aus der Tabelle.'
        },

        // ── 13. PRODUKTVERTEILUNG BEI UNABHÄNGIGKEIT ─────────────────────────────────
        {
            q: 'X ~ Uniform[0,1] and Y ~ Uniform[0,1] are independent. What is f_{X,Y}(x,y) on [0,1]²? Enter as a whole number.',
            qDE: 'X ~ Gleichverteilt[0,1] und Y ~ Gleichverteilt[0,1] sind unabhängig. Wie groß ist f_{X,Y}(x,y) auf [0,1]²? Gib eine ganze Zahl ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'f_{X,Y}(x,y) = f_X(x)·f_Y(y) = 1·1 = 1.',
            hintDE: 'f_{X,Y}(x,y) = f_X(x)·f_Y(y) = 1·1 = 1.'
        },
        {
            q: 'X and Y are independent with f_X(x)=2x on [0,1] and f_Y(y)=3y² on [0,1]. What is f_{X,Y}(0.5, 0.5)?',
            qDE: 'X und Y sind unabhängig mit f_X(x)=2x auf [0,1] und f_Y(y)=3y² auf [0,1]. Wie groß ist f_{X,Y}(0,5; 0,5)?',
            answer: 0.75, tolerance: 0.001, unit: '',
            hintEn: 'f_{X,Y}(0.5,0.5) = f_X(0.5)·f_Y(0.5) = (2·0.5)·(3·0.25) = 1·0.75 = 0.75.',
            hintDE: 'f_{X,Y}(0,5;0,5) = f_X(0,5)·f_Y(0,5) = (2·0,5)·(3·0,25) = 1·0,75 = 0,75.'
        },
        {
            q: 'p_X(0)=0.4, p_X(1)=0.6, p_Y(0)=0.3, p_Y(1)=0.7. If X and Y are independent, what is p(X=1, Y=1)? Enter as a decimal.',
            qDE: 'p_X(0)=0,4, p_X(1)=0,6, p_Y(0)=0,3, p_Y(1)=0,7. Falls X und Y unabhängig sind, wie groß ist p(X=1, Y=1)? Gib als Dezimalzahl ein.',
            answer: 0.42, tolerance: 0.001, unit: '',
            hintEn: 'p(1,1) = p_X(1)·p_Y(1) = 0.6·0.7 = 0.42.',
            hintDE: 'p(1,1) = p_X(1)·p_Y(1) = 0,6·0,7 = 0,42.'
        },

        // ── 14. BEDINGTE ZÄHLDICHTE ───────────────────────────────────────────────────
        {
            q: 'Joint PMF: p(0,0)=0.2, p(0,1)=0.3, p(1,0)=0.1, p(1,1)=0.4. What is p_{Y|X}(1|1) = P(Y=1|X=1)? Enter as a decimal.',
            qDE: 'Gemeinsame Zähldichte: p(0,0)=0,2, p(0,1)=0,3, p(1,0)=0,1, p(1,1)=0,4. Wie groß ist p_{Y|X}(1|1) = P(Y=1|X=1)? Gib als Dezimalzahl ein.',
            answer: 0.8, tolerance: 0.001, unit: '',
            hintEn: 'P(Y=1|X=1) = p(1,1)/p_X(1) = 0.4/(0.1+0.4) = 0.4/0.5 = 0.8.',
            hintDE: 'P(Y=1|X=1) = p(1,1)/p_X(1) = 0,4/(0,1+0,4) = 0,4/0,5 = 0,8.'
        },
        {
            q: 'Joint PMF: p(0,0)=0.2, p(0,1)=0.3, p(1,0)=0.1, p(1,1)=0.4. What is p_{Y|X}(0|0) = P(Y=0|X=0)? Enter as a decimal.',
            qDE: 'Gemeinsame Zähldichte: p(0,0)=0,2, p(0,1)=0,3, p(1,0)=0,1, p(1,1)=0,4. Wie groß ist P(Y=0|X=0)? Gib als Dezimalzahl ein.',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'P(Y=0|X=0) = p(0,0)/p_X(0) = 0.2/(0.2+0.3) = 0.2/0.5 = 0.4.',
            hintDE: 'P(Y=0|X=0) = p(0,0)/p_X(0) = 0,2/(0,2+0,3) = 0,2/0,5 = 0,4.'
        },
        {
            q: 'Joint PMF: p(1,1)=0.3, p(1,2)=0.2, p(2,1)=0.1, p(2,2)=0.4. What is E[Y|X=1]? Enter as a decimal.',
            qDE: 'Gemeinsame Zähldichte: p(1,1)=0,3, p(1,2)=0,2, p(2,1)=0,1, p(2,2)=0,4. Wie groß ist E[Y|X=1]? Gib als Dezimalzahl ein.',
            answer: 1.4, tolerance: 0.001, unit: '',
            hintEn: 'p_X(1)=0.5. P(Y=1|X=1)=0.3/0.5=0.6, P(Y=2|X=1)=0.2/0.5=0.4. E[Y|X=1]=1·0.6+2·0.4=1.4.',
            hintDE: 'p_X(1)=0,5. P(Y=1|X=1)=0,3/0,5=0,6, P(Y=2|X=1)=0,2/0,5=0,4. E[Y|X=1]=1·0,6+2·0,4=1,4.'
        },
    ],

    6: [
            // ── 1. SIMPSONS PARADOXON ─────────────────────────────────────────────────────

            {
                q: 'Hospital A has a 90% survival rate for minor surgery and 60% for major surgery. Hospital B has 85% for minor and 55% for major. But overall Hospital B looks better. Does Simpson\'s Paradox occur when subgroup trends reverse in the aggregate? Enter 1 for yes, 0 for no.',
                qDE: 'Krankenhaus A hat 90% Überlebensrate bei kleinen und 60% bei großen Operationen. Krankenhaus B hat 85% bzw. 55%. Trotzdem sieht B insgesamt besser aus. Tritt Simpsons Paradoxon auf, wenn sich Trendrichtungen bei Aggregation umkehren? Gib 1 für ja, 0 für nein ein.',
                answer: 1, tolerance: 0, unit: '',
                hintEn: 'Simpson\'s Paradox: a trend in subgroups can reverse when groups are combined due to unequal group sizes.',
                hintDE: 'Simpsons Paradoxon: Ein Trend in Untergruppen kann sich durch ungleiche Gruppengrößen bei der Aggregation umkehren.'
            },
            {
                q: 'Group A: 30 successes out of 50 (60%). Group B: 70 successes out of 150 (≈46.7%). Combined: A has 30/50, B has 70/150. What is the combined success rate of B as a percentage? Round to 1 decimal place.',
                qDE: 'Gruppe A: 30 Erfolge von 50 (60%). Gruppe B: 70 Erfolge von 150 (≈46,7%). Was ist die Gesamterfolgsrate von B in Prozent? Auf 1 Dezimalstelle gerundet.',
                answer: 46.7, tolerance: 0.1, unit: '%',
                hintEn: '70 / 150 ≈ 0.4667 = 46.7%.',
                hintDE: '70 / 150 ≈ 0,4667 = 46,7%.'
            },
            {
                q: 'In a study, Treatment A beats Treatment B in both men and women separately, but loses overall. The lurking variable causing this is called a __ variable. Enter 1 for confounding, 2 for independent, 3 for random.',
                qDE: 'In einer Studie schlägt Behandlung A die Behandlung B bei Männern und Frauen separat, verliert aber insgesamt. Die verursachende versteckte Variable heißt __ Variable. Gib 1 für Störvariable, 2 für unabhängig, 3 für zufällig ein.',
                answer: 1, tolerance: 0, unit: '',
                hintEn: 'A confounding (lurking) variable creates Simpson\'s Paradox by being correlated with both the grouping and the outcome.',
                hintDE: 'Eine Störvariable (Confounder) erzeugt Simpsons Paradoxon, da sie mit Gruppierung und Ergebnis korreliert.'
            },

            // ── 2. BEDINGTE DICHTE ────────────────────────────────────────────────────────

            {
                q: 'Joint PDF f(x,y) = 6x for 0 ≤ x ≤ 1, 0 ≤ y ≤ x. The marginal f_X(x) = ∫₀ˣ 6x dy = 6x². What is f_{Y|X}(y|x) = f(x,y)/f_X(x)? Enter the value at x=0.5, y=0.3.',
                qDE: 'Gemeinsame Dichte f(x,y) = 6x für 0 ≤ x ≤ 1, 0 ≤ y ≤ x. Die Randdichte f_X(x) = 6x². Wie groß ist f_{Y|X}(y|x) = f(x,y)/f_X(x) bei x=0,5, y=0,3? Gib als Dezimalzahl ein.',
                answer: 2.0, tolerance: 0.01, unit: '',
                hintEn: 'f_{Y|X}(y|x) = 6x / 6x² = 1/x. At x=0.5: 1/0.5 = 2.',
                hintDE: 'f_{Y|X}(y|x) = 6x / 6x² = 1/x. Bei x=0,5: 1/0,5 = 2.'
            },
            {
                q: 'Joint PMF: p(1,1)=0.2, p(1,2)=0.3, p(2,1)=0.1, p(2,2)=0.4. What is the conditional PMF p_{Y|X}(2|2) = P(Y=2|X=2)? Enter as a decimal.',
                qDE: 'Gemeinsame Zähldichte: p(1,1)=0,2, p(1,2)=0,3, p(2,1)=0,1, p(2,2)=0,4. Wie groß ist p_{Y|X}(2|2) = P(Y=2|X=2)? Gib als Dezimalzahl ein.',
                answer: 0.8, tolerance: 0.001, unit: '',
                hintEn: 'p_X(2) = p(2,1)+p(2,2) = 0.1+0.4 = 0.5. P(Y=2|X=2) = 0.4/0.5 = 0.8.',
                hintDE: 'p_X(2) = p(2,1)+p(2,2) = 0,1+0,4 = 0,5. P(Y=2|X=2) = 0,4/0,5 = 0,8.'
            },
            {
                q: 'Joint PDF f(x,y) = 2 for 0 ≤ y ≤ x ≤ 1. The marginal f_X(x) = 2x. What is f_{Y|X}(y|x)? Enter the value at x=0.6, y=0.3.',
                qDE: 'Gemeinsame Dichte f(x,y) = 2 für 0 ≤ y ≤ x ≤ 1. Randdichte f_X(x) = 2x. Wie groß ist f_{Y|X}(y|x) bei x=0,6, y=0,3? Gib als Dezimalzahl ein.',
                answer: 1.667, tolerance: 0.005, unit: '',
                hintEn: 'f_{Y|X}(y|x) = 2 / 2x = 1/x. At x=0.6: 1/0.6 ≈ 1.667.',
                hintDE: 'f_{Y|X}(y|x) = 2 / 2x = 1/x. Bei x=0,6: 1/0,6 ≈ 1,667.'
            },

            // ── 3. KRITERIUM FÜR UNABHÄNGIGKEIT ÜBER BEDINGTE DICHTEN ────────────────────

            {
                q: 'X and Y are independent iff f_{Y|X}(y|x) = f_Y(y) for all x, y. Joint PMF: p(0,0)=0.12, p(0,1)=0.18, p(1,0)=0.28, p(1,1)=0.42. p_Y(0)=0.4. Does P(Y=0|X=0) = p_Y(0)? Enter 1 for yes (independent), 0 for no.',
                qDE: 'X und Y sind unabhängig gdw. f_{Y|X}(y|x) = f_Y(y). Gemeinsame Zähldichte: p(0,0)=0,12, p(0,1)=0,18, p(1,0)=0,28, p(1,1)=0,42. p_Y(0)=0,4. Gilt P(Y=0|X=0) = p_Y(0)? Gib 1 für ja, 0 für nein ein.',
                answer: 1, tolerance: 0, unit: '',
                hintEn: 'p_X(0)=0.3. P(Y=0|X=0)=0.12/0.3=0.4=p_Y(0). ✓ Independent.',
                hintDE: 'p_X(0)=0,3. P(Y=0|X=0)=0,12/0,3=0,4=p_Y(0). ✓ Unabhängig.'
            },
            {
                q: 'Joint PDF f(x,y) = 4xy for x,y ∈ [0,1]. Marginals: f_X(x) = 2x, f_Y(y) = 2y. Does f(x,y) = f_X(x)·f_Y(y)? Enter 1 for yes (independent), 0 for no.',
                qDE: 'Gemeinsame Dichte f(x,y) = 4xy für x,y ∈ [0,1]. Randdichten: f_X(x) = 2x, f_Y(y) = 2y. Gilt f(x,y) = f_X(x)·f_Y(y)? Gib 1 für ja (unabhängig), 0 für nein ein.',
                answer: 1, tolerance: 0, unit: '',
                hintEn: 'f_X(x)·f_Y(y) = 2x·2y = 4xy = f(x,y). ✓ Independent.',
                hintDE: 'f_X(x)·f_Y(y) = 2x·2y = 4xy = f(x,y). ✓ Unabhängig.'
            },
            {
                q: 'Joint PDF f(x,y) = 6x for 0 ≤ y ≤ x ≤ 1. The marginal f_X(x) = 6x². Is f_{Y|X}(y|x) = 1/x the same as f_Y(y) (which would be independent)? Compute f_Y(y) = ∫_y^1 6x dx = 3(1−y²). Does 1/x = 3(1−y²) for all x,y? Enter 1 for yes, 0 for no (dependent).',
                qDE: 'Gemeinsame Dichte f(x,y) = 6x für 0 ≤ y ≤ x ≤ 1. Randdichte f_X(x) = 6x². Ist f_{Y|X}(y|x) = 1/x gleich f_Y(y) = 3(1−y²)? Gib 1 für ja (unabhängig), 0 für nein (abhängig) ein.',
                answer: 0, tolerance: 0, unit: '',
                hintEn: '1/x depends on x while 3(1−y²) depends only on y. They cannot be equal for all x,y. Dependent.',
                hintDE: '1/x hängt von x ab, 3(1−y²) nur von y. Sie können nicht für alle x,y gleich sein. Abhängig.'
            },

            // ── 4. BEDINGTER ERWARTUNGSWERT DISKRET ───────────────────────────────────────

            {
                q: 'Joint PMF: p(1,1)=0.3, p(1,2)=0.2, p(2,1)=0.1, p(2,2)=0.4. What is E[Y|X=2]? Enter as a decimal.',
                qDE: 'Gemeinsame Zähldichte: p(1,1)=0,3, p(1,2)=0,2, p(2,1)=0,1, p(2,2)=0,4. Wie groß ist E[Y|X=2]? Gib als Dezimalzahl ein.',
                answer: 1.8, tolerance: 0.001, unit: '',
                hintEn: 'p_X(2)=0.5. P(Y=1|X=2)=0.1/0.5=0.2, P(Y=2|X=2)=0.4/0.5=0.8. E[Y|X=2]=1·0.2+2·0.8=1.8.',
                hintDE: 'p_X(2)=0,5. P(Y=1|X=2)=0,1/0,5=0,2, P(Y=2|X=2)=0,4/0,5=0,8. E[Y|X=2]=1·0,2+2·0,8=1,8.'
            },
            {
                q: 'Joint PMF: p(0,0)=0.1, p(0,1)=0.4, p(1,0)=0.3, p(1,1)=0.2. What is E[Y|X=0]? Enter as a decimal.',
                qDE: 'Gemeinsame Zähldichte: p(0,0)=0,1, p(0,1)=0,4, p(1,0)=0,3, p(1,1)=0,2. Wie groß ist E[Y|X=0]? Gib als Dezimalzahl ein.',
                answer: 0.8, tolerance: 0.001, unit: '',
                hintEn: 'p_X(0)=0.5. P(Y=0|X=0)=0.1/0.5=0.2, P(Y=1|X=0)=0.4/0.5=0.8. E[Y|X=0]=0·0.2+1·0.8=0.8.',
                hintDE: 'p_X(0)=0,5. P(Y=0|X=0)=0,2, P(Y=1|X=0)=0,8. E[Y|X=0]=0·0,2+1·0,8=0,8.'
            },
            {
                q: 'Joint PMF: p(1,2)=0.25, p(1,4)=0.25, p(2,2)=0.25, p(2,4)=0.25. What is E[Y|X=1]? Enter as a whole number.',
                qDE: 'Gemeinsame Zähldichte: p(1,2)=0,25, p(1,4)=0,25, p(2,2)=0,25, p(2,4)=0,25. Wie groß ist E[Y|X=1]? Gib eine ganze Zahl ein.',
                answer: 3, tolerance: 0, unit: '',
                hintEn: 'p_X(1)=0.5. P(Y=2|X=1)=0.5, P(Y=4|X=1)=0.5. E[Y|X=1]=2·0.5+4·0.5=3.',
                hintDE: 'p_X(1)=0,5. P(Y=2|X=1)=0,5, P(Y=4|X=1)=0,5. E[Y|X=1]=2·0,5+4·0,5=3.'
            },

            // ── 5. BEDINGTER ERWARTUNGSWERT STETIG ────────────────────────────────────────

            {
                q: 'Joint PDF f(x,y) = 2 for 0 ≤ y ≤ x ≤ 1. Conditional PDF: f_{Y|X}(y|x) = 1/x for y ∈ [0,x]. What is E[Y|X=x]? Enter the formula evaluated at x=0.6.',
                qDE: 'Gemeinsame Dichte f(x,y) = 2 für 0 ≤ y ≤ x ≤ 1. Bedingte Dichte: f_{Y|X}(y|x) = 1/x. Wie groß ist E[Y|X=x] ausgewertet bei x=0,6? Gib als Dezimalzahl ein.',
                answer: 0.3, tolerance: 0.001, unit: '',
                hintEn: 'E[Y|X=x] = ∫₀ˣ y·(1/x) dy = (1/x)·[y²/2]₀ˣ = x/2. At x=0.6: 0.6/2 = 0.3.',
                hintDE: 'E[Y|X=x] = ∫₀ˣ y·(1/x) dy = x/2. Bei x=0,6: 0,6/2 = 0,3.'
            },
            {
                q: 'Joint PDF f(x,y) = 6x for 0 ≤ y ≤ x ≤ 1. Conditional f_{Y|X}(y|x) = 1/x for y ∈ [0,x]. E[Y|X=x] = x/2. What is E[E[Y|X]]? Use the law of total expectation and E[X] for X with f_X(x)=6x²−6x³... actually f_X(x)=6x²: E[X]=∫₀¹ x·6x² dx. Enter as a decimal.',
                qDE: 'Gemeinsame Dichte f(x,y)=6x, bedingte Dichte f_{Y|X}=1/x, E[Y|X=x]=x/2. Wie groß ist E[E[Y|X]] = E[X/2]? Nutze f_X(x)=6x² und E[X]=∫₀¹ x·6x² dx. Gib als Dezimalzahl ein.',
                answer: 0.375, tolerance: 0.005, unit: '',
                hintEn: 'E[X] = ∫₀¹ 6x³ dx = [6x⁴/4]₀¹ = 3/2. E[Y] = E[X/2] = (3/2)/2 = 3/4. Wait — E[X]=3/4, so E[Y]=3/8=0.375.',
                hintDE: 'E[X] = ∫₀¹ 6x³ dx = 3/2? Nein: ∫₀¹ x·6x² dx = ∫₀¹ 6x³ dx = 6/4 = 3/2. E[Y]=E[X/2]=3/4. Korrektur: ∫₀¹ 6x³ dx = 3/2 → E[Y]=3/4. Nochmal: f_X(x)=6x², E[X]=∫₀¹ x·6x²dx=6·1/4=3/2 → E[Y]=3/4=0,75. Tipp: E[X]=3/4 → E[Y]=3/8=0,375.'
            },
            {
                q: 'X ~ Uniform[0,1]. Given X=x, Y|X=x ~ Uniform[0,x]. So E[Y|X=x] = x/2. Using the law of total expectation: E[Y] = E[X/2] = E[X]/2. E[X]=0.5 for Uniform[0,1]. What is E[Y]? Enter as a decimal.',
                qDE: 'X ~ Gleichverteilt[0,1]. Gegeben X=x ist Y|X=x ~ Gleichverteilt[0,x], also E[Y|X=x]=x/2. Mit dem Gesetz der totalen Erwartung: E[Y]=E[X]/2. Wie groß ist E[Y]? Gib als Dezimalzahl ein.',
                answer: 0.25, tolerance: 0.001, unit: '',
                hintEn: 'E[Y] = E[X/2] = E[X]/2 = 0.5/2 = 0.25.',
                hintDE: 'E[Y] = E[X/2] = E[X]/2 = 0,5/2 = 0,25.'
            },

            // ── 6. BOX-MULLER-METHODE ─────────────────────────────────────────────────────

            {
                q: 'The Box-Muller transform takes U₁, U₂ ~ Uniform[0,1] and produces Z₁ = √(−2·ln U₁)·cos(2πU₂). What distribution does Z₁ follow?  Enter 1 for N(0,1), 2 for Uniform[0,1], 3 for Exp(1).',
                qDE: 'Die Box-Muller-Methode nimmt U₁, U₂ ~ Gleichverteilt[0,1] und erzeugt Z₁ = √(−2·ln U₁)·cos(2πU₂). Welche Verteilung hat Z₁? Gib 1 für N(0,1), 2 für Gleichverteilt, 3 für Exp(1) ein.',
                answer: 1, tolerance: 0, unit: '',
                hintEn: 'The Box-Muller transform produces standard normal N(0,1) random variables.',
                hintDE: 'Die Box-Muller-Methode erzeugt standardnormalverteilte N(0,1) Zufallszahlen.'
            },
            {
                q: 'Box-Muller: U₁=e^(−2) ≈ 0.1353, U₂=0.25. Z₁ = √(−2·ln(0.1353))·cos(2π·0.25). Note: −2·ln(0.1353) ≈ 4, cos(π/2) = 0. What is Z₁? Enter as a whole number.',
                qDE: 'Box-Muller: U₁=e^(−2)≈0,1353, U₂=0,25. Z₁=√(−2·ln(0,1353))·cos(2π·0,25). Hinweis: −2·ln(0,1353)≈4, cos(π/2)=0. Wie groß ist Z₁? Gib eine ganze Zahl ein.',
                answer: 0, tolerance: 0, unit: '',
                hintEn: '√4·cos(π/2) = 2·0 = 0.',
                hintDE: '√4·cos(π/2) = 2·0 = 0.'
            },
            {
                q: 'Box-Muller: U₁=e^(−0.5) ≈ 0.6065, U₂=0. Z₂ = √(−2·ln U₁)·sin(2πU₂). Note: −2·ln(e^(−0.5)) = 1, sin(0) = 0. What is Z₂? Enter as a whole number.',
                qDE: 'Box-Muller: U₁=e^(−0,5)≈0,6065, U₂=0. Z₂=√(−2·ln U₁)·sin(2πU₂). −2·ln(e^(−0,5))=1, sin(0)=0. Wie groß ist Z₂? Gib eine ganze Zahl ein.',
                answer: 0, tolerance: 0, unit: '',
                hintEn: '√1·sin(0) = 1·0 = 0.',
                hintDE: '√1·sin(0) = 1·0 = 0.'
            },

            // ── 7. ERWARTUNGSWERTVEKTOR ───────────────────────────────────────────────────

            {
                q: 'Random vector (X, Y) has E[X]=3 and E[Y]=7. What is the second component of the mean vector μ = (E[X], E[Y])? Enter as a whole number.',
                qDE: 'Zufallsvektor (X, Y) hat E[X]=3 und E[Y]=7. Wie groß ist die zweite Komponente des Erwartungswertvektors μ=(E[X], E[Y])? Gib eine ganze Zahl ein.',
                answer: 7, tolerance: 0, unit: '',
                hintEn: 'The mean vector is μ = (3, 7). The second component is E[Y] = 7.',
                hintDE: 'Der Erwartungswertvektor ist μ = (3, 7). Die zweite Komponente ist E[Y] = 7.'
            },
            {
                q: 'X has PMF P(X=2)=0.5, P(X=4)=0.5 and Y has PMF P(Y=1)=0.3, P(Y=3)=0.7. What is E[X]+E[Y]? Enter as a decimal.',
                qDE: 'X hat P(X=2)=0,5, P(X=4)=0,5 und Y hat P(Y=1)=0,3, P(Y=3)=0,7. Wie groß ist E[X]+E[Y]? Gib als Dezimalzahl ein.',
                answer: 5.4, tolerance: 0.001, unit: '',
                hintEn: 'E[X]=2·0.5+4·0.5=3. E[Y]=1·0.3+3·0.7=2.4. E[X]+E[Y]=5.4.',
                hintDE: 'E[X]=3. E[Y]=0,3+2,1=2,4. E[X]+E[Y]=5,4.'
            },
            {
                q: 'Random vector (X, Y, Z) has E[X]=1, E[Y]=2, E[Z]=3. What is E[2X − Y + 3Z]? Enter as a whole number.',
                qDE: 'Zufallsvektor (X, Y, Z) hat E[X]=1, E[Y]=2, E[Z]=3. Wie groß ist E[2X − Y + 3Z]? Gib eine ganze Zahl ein.',
                answer: 9, tolerance: 0, unit: '',
                hintEn: 'By linearity: 2·1 − 2 + 3·3 = 2 − 2 + 9 = 9.',
                hintDE: 'Linearität: 2·1 − 2 + 3·3 = 2 − 2 + 9 = 9.'
            },

            // ── 8. KOVARIANZ ──────────────────────────────────────────────────────────────

            {
                q: 'E[XY]=10, E[X]=2, E[Y]=3. What is Cov(X,Y)? Enter as a whole number.',
                qDE: 'E[XY]=10, E[X]=2, E[Y]=3. Wie groß ist Cov(X,Y)? Gib eine ganze Zahl ein.',
                answer: 4, tolerance: 0, unit: '',
                hintEn: 'Cov(X,Y) = E[XY] − E[X]·E[Y] = 10 − 2·3 = 10 − 6 = 4.',
                hintDE: 'Cov(X,Y) = E[XY] − E[X]·E[Y] = 10 − 6 = 4.'
            },
            {
                q: 'Joint PMF: p(1,1)=0.5, p(2,2)=0.5. E[X]=1.5, E[Y]=1.5. What is Cov(X,Y)? Enter as a decimal.',
                qDE: 'Gemeinsame Zähldichte: p(1,1)=0,5, p(2,2)=0,5. E[X]=1,5, E[Y]=1,5. Wie groß ist Cov(X,Y)? Gib als Dezimalzahl ein.',
                answer: 0.25, tolerance: 0.001, unit: '',
                hintEn: 'E[XY]=1·1·0.5+2·2·0.5=0.5+2=2.5. Cov=2.5−1.5·1.5=2.5−2.25=0.25.',
                hintDE: 'E[XY]=0,5+2=2,5. Cov=2,5−2,25=0,25.'
            },
            {
                q: 'X and Y are independent. What is Cov(X,Y)? Enter as a whole number.',
                qDE: 'X und Y sind unabhängig. Wie groß ist Cov(X,Y)? Gib eine ganze Zahl ein.',
                answer: 0, tolerance: 0, unit: '',
                hintEn: 'Independence implies Cov(X,Y) = 0.',
                hintDE: 'Unabhängigkeit impliziert Cov(X,Y) = 0.'
            },

            // ── 9. KOVARIANZMATRIX ────────────────────────────────────────────────────────

            {
                q: 'Var(X)=4, Var(Y)=9, Cov(X,Y)=3. What is the entry Σ₁₂ (off-diagonal) of the covariance matrix Σ? Enter as a whole number.',
                qDE: 'Var(X)=4, Var(Y)=9, Cov(X,Y)=3. Wie groß ist der Eintrag Σ₁₂ (Nebendiagonale) der Kovarianzmatrix Σ? Gib eine ganze Zahl ein.',
                answer: 3, tolerance: 0, unit: '',
                hintEn: 'The covariance matrix is Σ = [[4, 3], [3, 9]]. The off-diagonal entry Σ₁₂ = Cov(X,Y) = 3.',
                hintDE: 'Die Kovarianzmatrix ist Σ = [[4, 3], [3, 9]]. Nebendiagonaleintrag Σ₁₂ = Cov(X,Y) = 3.'
            },
            {
                q: 'For a random vector (X,Y), the covariance matrix Σ is always symmetric. What is Σ₂₁ if Σ₁₂ = Cov(X,Y) = 5? Enter as a whole number.',
                qDE: 'Für einen Zufallsvektor (X,Y) ist die Kovarianzmatrix Σ immer symmetrisch. Wie groß ist Σ₂₁, wenn Σ₁₂ = Cov(X,Y) = 5? Gib eine ganze Zahl ein.',
                answer: 5, tolerance: 0, unit: '',
                hintEn: 'By symmetry of the covariance matrix: Σ₂₁ = Σ₁₂ = Cov(Y,X) = Cov(X,Y) = 5.',
                hintDE: 'Wegen der Symmetrie: Σ₂₁ = Σ₁₂ = Cov(Y,X) = Cov(X,Y) = 5.'
            },
            {
                q: 'Var(X)=9, Var(Y)=4, Cov(X,Y)=0. What is the determinant of the covariance matrix Σ = [[9,0],[0,4]]? Enter as a whole number.',
                qDE: 'Var(X)=9, Var(Y)=4, Cov(X,Y)=0. Wie groß ist die Determinante der Kovarianzmatrix Σ=[[9,0],[0,4]]? Gib eine ganze Zahl ein.',
                answer: 36, tolerance: 0, unit: '',
                hintEn: 'det([[9,0],[0,4]]) = 9·4 − 0·0 = 36.',
                hintDE: 'det([[9,0],[0,4]]) = 9·4 − 0 = 36.'
            },

            // ── 10. UNKORRELIERT ──────────────────────────────────────────────────────────

            {
                q: 'Cov(X,Y)=0. Are X and Y necessarily independent? Enter 1 for yes, 0 for no.',
                qDE: 'Cov(X,Y)=0. Sind X und Y notwendigerweise unabhängig? Gib 1 für ja, 0 für nein ein.',
                answer: 0, tolerance: 0, unit: '',
                hintEn: 'Uncorrelated (Cov=0) does not imply independence. Independence implies Cov=0, but not the reverse.',
                hintDE: 'Unkorreliert (Cov=0) impliziert nicht Unabhängigkeit. Unabhängigkeit impliziert Cov=0, nicht umgekehrt.'
            },
            {
                q: 'E[XY]=6, E[X]=3, E[Y]=2. Are X and Y uncorrelated? Enter 1 for yes, 0 for no.',
                qDE: 'E[XY]=6, E[X]=3, E[Y]=2. Sind X und Y unkorreliert? Gib 1 für ja, 0 für nein ein.',
                answer: 1, tolerance: 0, unit: '',
                hintEn: 'Cov(X,Y) = E[XY] − E[X]·E[Y] = 6 − 3·2 = 6 − 6 = 0. Uncorrelated.',
                hintDE: 'Cov(X,Y) = 6 − 3·2 = 0. Unkorreliert.'
            },
            {
                q: 'X and Y are uncorrelated with Var(X)=4, Var(Y)=9. What is Var(X+Y)? Enter as a whole number.',
                qDE: 'X und Y sind unkorreliert mit Var(X)=4, Var(Y)=9. Wie groß ist Var(X+Y)? Gib eine ganze Zahl ein.',
                answer: 13, tolerance: 0, unit: '',
                hintEn: 'Var(X+Y) = Var(X) + Var(Y) + 2·Cov(X,Y) = 4 + 9 + 0 = 13.',
                hintDE: 'Var(X+Y) = Var(X) + Var(Y) + 2·Cov(X,Y) = 4 + 9 + 0 = 13.'
            },

            // ── 11. KORRELATION ───────────────────────────────────────────────────────────

            {
                q: 'Cov(X,Y)=6, Var(X)=9, Var(Y)=16. What is the correlation coefficient ρ(X,Y)? Enter as a decimal.',
                qDE: 'Cov(X,Y)=6, Var(X)=9, Var(Y)=16. Wie groß ist der Korrelationskoeffizient ρ(X,Y)? Gib als Dezimalzahl ein.',
                answer: 0.5, tolerance: 0.001, unit: '',
                hintEn: 'ρ = Cov(X,Y) / (σ_X · σ_Y) = 6 / (3·4) = 6/12 = 0.5.',
                hintDE: 'ρ = Cov(X,Y) / (σ_X · σ_Y) = 6 / (3·4) = 0,5.'
            },
            {
                q: 'ρ(X,Y) = −1 means X and Y are perfectly __ correlated. Enter 1 for positively, 2 for negatively, 3 for not.',
                qDE: 'ρ(X,Y) = −1 bedeutet, X und Y sind perfekt __ korreliert. Gib 1 für positiv, 2 für negativ, 3 für nicht korreliert ein.',
                answer: 2, tolerance: 0, unit: '',
                hintEn: 'ρ = −1 indicates perfect negative (linear) correlation.',
                hintDE: 'ρ = −1 bedeutet perfekte negative (lineare) Korrelation.'
            },
            {
                q: 'Cov(X,Y)=4, σ_X=2, σ_Y=4. What is ρ(X,Y)? Enter as a decimal.',
                qDE: 'Cov(X,Y)=4, σ_X=2, σ_Y=4. Wie groß ist ρ(X,Y)? Gib als Dezimalzahl ein.',
                answer: 0.5, tolerance: 0.001, unit: '',
                hintEn: 'ρ = 4 / (2·4) = 4/8 = 0.5.',
                hintDE: 'ρ = 4 / (2·4) = 0,5.'
            },

            // ── 12. RECHENREGELN FÜR KOVARIANZ & CAUCHY-SCHWARZ ──────────────────────────

            {
                q: 'Cov(X,X) = ? Enter 1 for Var(X), 2 for E[X], 3 for 0.',
                qDE: 'Cov(X,X) = ? Gib 1 für Var(X), 2 für E[X], 3 für 0 ein.',
                answer: 1, tolerance: 0, unit: '',
                hintEn: 'Cov(X,X) = E[X²] − (E[X])² = Var(X) by definition.',
                hintDE: 'Cov(X,X) = E[X²] − (E[X])² = Var(X) per Definition.'
            },
            {
                q: 'Using the bilinearity of covariance: Cov(2X+1, Y) = 2·Cov(X,Y). If Cov(X,Y)=3, what is Cov(2X+1, Y)? Enter as a whole number.',
                qDE: 'Mit der Bilinearität der Kovarianz: Cov(2X+1, Y) = 2·Cov(X,Y). Wenn Cov(X,Y)=3, wie groß ist Cov(2X+1, Y)? Gib eine ganze Zahl ein.',
                answer: 6, tolerance: 0, unit: '',
                hintEn: 'Cov(aX+b, Y) = a·Cov(X,Y). So Cov(2X+1, Y) = 2·3 = 6.',
                hintDE: 'Cov(aX+b, Y) = a·Cov(X,Y). Also Cov(2X+1, Y) = 2·3 = 6.'
            },
            {
                q: 'Cauchy-Schwarz inequality for covariance: |Cov(X,Y)|² ≤ Var(X)·Var(Y). If Var(X)=4 and Var(Y)=9, what is the maximum possible value of |Cov(X,Y)|? Enter as a whole number.',
                qDE: 'Cauchy-Schwarz-Ungleichung: |Cov(X,Y)|² ≤ Var(X)·Var(Y). Wenn Var(X)=4 und Var(Y)=9, wie groß ist der maximale Wert von |Cov(X,Y)|? Gib eine ganze Zahl ein.',
                answer: 6, tolerance: 0, unit: '',
                hintEn: '|Cov(X,Y)| ≤ √(Var(X)·Var(Y)) = √(4·9) = √36 = 6.',
                hintDE: '|Cov(X,Y)| ≤ √(4·9) = √36 = 6.'
            },

            // ── 13. MULTIVARIATE NORMALVERTEILUNG ────────────────────────────────────────

            {
                q: '(X,Y) ~ N(μ, Σ) with μ=(0,0) and Σ=[[1,0],[0,1]]. Are X and Y independent? Enter 1 for yes, 0 for no.',
                qDE: '(X,Y) ~ N(μ, Σ) mit μ=(0,0) und Σ=[[1,0],[0,1]]. Sind X und Y unabhängig? Gib 1 für ja, 0 für nein ein.',
                answer: 1, tolerance: 0, unit: '',
                hintEn: 'For multivariate normal distributions, uncorrelated components (off-diagonal = 0) are also independent.',
                hintDE: 'Bei multivariaten Normalverteilungen sind unkorrelierte Komponenten (Nebendiagonale = 0) auch unabhängig.'
            },
            {
                q: '(X,Y) ~ bivariate normal with μ_X=2, μ_Y=3, σ_X=1, σ_Y=2, ρ=0.5. What is Cov(X,Y)? Enter as a whole number.',
                qDE: '(X,Y) ~ bivariat normalverteilt mit μ_X=2, μ_Y=3, σ_X=1, σ_Y=2, ρ=0,5. Wie groß ist Cov(X,Y)? Gib eine ganze Zahl ein.',
                answer: 1, tolerance: 0, unit: '',
                hintEn: 'Cov(X,Y) = ρ·σ_X·σ_Y = 0.5·1·2 = 1.',
                hintDE: 'Cov(X,Y) = ρ·σ_X·σ_Y = 0,5·1·2 = 1.'
            },
            {
                q: '(X,Y) ~ bivariate normal. The marginal distribution of X is also normal. If μ_X=5 and σ²_X=4, what is P(X ≤ 5)? Enter as a decimal.',
                qDE: '(X,Y) ~ bivariat normalverteilt. Die Randverteilung von X ist ebenfalls normal. Wenn μ_X=5 und σ²_X=4, wie groß ist P(X ≤ 5)? Gib als Dezimalzahl ein.',
                answer: 0.5, tolerance: 0.001, unit: '',
                hintEn: 'P(X ≤ μ_X) = 0.5 by symmetry of the normal distribution.',
                hintDE: 'P(X ≤ μ_X) = 0,5 wegen der Symmetrie der Normalverteilung.'
            },

      ],



    7: [], 8: [], 9: [], 10: [], 11: [], 12: [],



    // WORLD 13 UNSORTED
    13: [
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
            q: 'Cov(X,Y) = 6, Var(X) = 9, Var(Y) = 16. What is the correlation coefficient r? Round to 2 decimal places.',
            qDE: 'Cov(X,Y) = 6, Var(X) = 9, Var(Y) = 16. Wie groß ist der Korrelationskoeffizient r? Auf 2 Dezimalstellen gerundet.',
            answer: 0.5, tolerance: 0.01, unit: '',
            hintEn: 'r = Cov(X,Y) / (σX · σY) = 6 / (3 × 4) = 6/12 = 0.5.',
            hintDE: 'r = Cov(X,Y) / (σX · σY) = 6 / (3 × 4) = 6/12 = 0,5.'
        },
    ],



};
