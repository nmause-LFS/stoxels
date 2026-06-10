


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
            qDE: 'Ein Beutel enthält 3 rote und 7 blaue Bälle. Was ist die Wahrscheinlichkeit, einen roten Ball zu ziehen? Gib als Prozentzahl ein.',
            answer: 30, tolerance: 0, unit: '%',
            hintEn: 'In total there are 10 balls in the bag.',
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
            qDE: 'P(A) = 0,3 und P(B) = 0,5. A und B sind disjunkt. Was ist P(A ∪ B)?',
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
            qDE: 'Betrachte ein Laplace-Experiment mit 8 gleich wahrscheinlichen Elementarereignissen. Was ist die Wahrscheinlichkeit jedes Elementarereignisses? Gib als Dezimalzahl ein.',
            answer: 0.125, tolerance: 0.001, unit: '',
            hintEn: 'In a Laplace experiment the probability measure is the discrete uniform distribution.',
            hintDE: 'In einem Laplace-Experiment ist das Wahrscheinlichkeitsmaß die diskrete Gleichverteilung.'
        },


        // ── 7. SCHNITT UND VEREINIGUNG (Intersection and Union) ──────────────────

        {
            q: 'P(A) = 0.5, P(B) = 0.4, P(A ∩ B) = 0.2. What is P(A ∪ B)?',
            qDE: 'P(A) = 0,5, P(B) = 0,4, P(A ∩ B) = 0,2. Was ist P(A ∪ B)?',
            answer: 0.7, tolerance: 0.001, unit: '',
            hintEn: 'Inclusion-exclusion formula: P(A ∪ B) = P(A) + P(B) − P(A ∩ B).',
            hintDE: 'Siebformel: P(A ∪ B) = P(A) + P(B) − P(A ∩ B).'
        },
        {
            q: 'P(A ∪ B) = 0.8, P(A) = 0.5, P(B) = 0.6. What is P(A ∩ B)?',
            qDE: 'P(A ∪ B) = 0,8, P(A) = 0,5, P(B) = 0,6. Was ist P(A ∩ B)?',
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
            qDE: 'P(A) = 0,35. Was ist P(Aᶜ)? Gib als Dezimalzahl ein.',
            answer: 0.65, tolerance: 0.001, unit: '',
            hintEn: 'P(Aᶜ) = 1 − P(A)',
            hintDE: 'P(Aᶜ) = 1 − P(A)'
        },
        {
            q: 'P(Aᶜ) = 0.72. What is P(A)? Enter as a decimal.',
            qDE: 'P(Aᶜ) = 0,72. Was ist P(A)? Gib als Dezimalzahl ein.',
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
            qDE: 'P(A ∩ B) = 0,2. Nach De Morgan: Was ist P((Aᶜ ∪ Bᶜ)ᶜ)? Gib als Dezimalzahl ein.',
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
            qDE: 'Ereignisse A₁, A₂, A₃ sind paarweise disjunkt mit P(A₁) = 0,25, P(A₂) = 0,55, P(A₃) = 0,1. Was ist P(A₁ ∪ A₂ ∪ A₃)?',
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
            qDE: 'Eine Karte wird aus einem Standarddeck mit 52 Karten zufällig gezogen. Was ist die Wahrscheinlichkeit, ein Ass zu ziehen? Gib den Zähler über 52 ein.',
            answer: 4, tolerance: 0, unit: '/ 52',
            hintEn: 'There are 4 aces in 52 cards.',
            hintDE: 'Es gibt 4 Asse in 52 Karten.'
        },


        // ── 3. DISKRETE GLEICHVERTEILUNG (Discrete Uniform Distribution) ──────────

        {
            q: 'A random number is chosen uniformly from {1, 2, 3, 4, 5}. What is the probability of choosing a number ≤ 3? Enter as a decimal.',
            qDE: 'Eine Zahl wird gleichmäßig aus {1, 2, 3, 4, 5} gezogen. Was ist die Wahrscheinlichkeit, eine Zahl ≤ 3 zu wählen? Gib als Dezimalzahl ein.',
            answer: 0.6, tolerance: 0.001, unit: '',
            hintEn: '3 favourable outcomes out of 5.',
            hintDE: '3 günstige Ergebnisse von 5.'
        },
        {
            q: 'On a discrete uniform distribution over {1, 2, …, 10}, what is the probability of drawing an even number? Enter as a decimal.',
            qDE: 'Bei diskreter Gleichverteilung über {1, 2, …, 10}: Was ist die Wahrscheinlichkeit, eine gerade Zahl zu ziehen? Gib als Dezimalzahl ein.',
            answer: 0.5, tolerance: 0.001, unit: '',
            hintEn: 'Even numbers: {2,4,6,8,10}.',
            hintDE: 'Gerade Zahlen: {2,4,6,8,10}.'
        },
        {
            q: 'A fair die is a discrete uniform distribution over {1,…,6}. What is P(X ≥ 5) where X is the dice number? Enter as a fraction over 6.',
            qDE: 'Ein fairer Würfel ist diskret gleichverteilt über {1,…,6}. Was ist P(X ≥ 5) wobei X die Augenzahl ist? Gib den Zähler über 6 ein.',
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
            q: 'You roll a six-sided fair die and flip a coin. How many different combined outcomes are possible?',
            qDE: 'Du wirfst einen sechsseitigen fairen Würfel und eine Münze. Wie viele verschiedene kombinierte Ergebnisse gibt es?',
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
            qDE: 'Eine Urne hat 4 Bälle. 2 Mal mit Zurücklegen ziehen, Reihenfolge zählt: Was ist die Wahrscheinlichkeit, beide Male Ball Nr. 1 zu ziehen? Gib den Zähler über 16 ein.',
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
            q: 'An urn has 5 balls numbered 1–5. Two are drawn without replacement, order matters. What is the probability of drawing ball #1 first and then #2 second? Enter as a fraction over 20.',
            qDE: 'Eine Urne hat 5 Bälle (1–5). Zwei werden ohne Zurücklegen gezogen, Reihenfolge zählt. Was ist P(zuerst #1, dann #2)? Gib den Zähler über 20 ein.',
            answer: 1, tolerance: 0, unit: '/ 20',
            hintEn: 'Total ordered outcomes: 5 × 4 = 20. Only 1 favourable: (1,2).',
            hintDE: 'Geordnete Ergebnisse gesamt: 5 × 4 = 20. Nur 1 günstig: (1,2).'
        },

        // ── 7. CHANCEN / ODDS ─────────────────────────────────────────────────────

        {
            q: 'P(A) = 0.8. What are the odds in favour of A? Enter the numerator x of x/y where odds = p/(1−p) as a decimal.',
            qDE: 'P(A) = 0,8. Was sind die Chancen (Odds) für A? Gib den Wert von p/(1−p) als Dezimalzahl ein.',
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
            qDE: 'P(A) = 0,25. Wie sind die Odds gegen A (also P(Aᶜ)/P(A))? Gib als Dezimalzahl ein.',
            answer: 3.0, tolerance: 0.001, unit: '',
            hintEn: 'Odds against = (1 − 0.25) / 0.25',
            hintDE: 'Odds gegen A = (1 − 0,25) / 0,25'
        },

        // ── 8. SIEBFORMEL / INCLUSION-EXCLUSION ──────────────────────────────────

        {
            q: 'P(A) = 0.5, P(B) = 0.4, P(C) = 0.3, P(A∩B) = 0.2, P(A∩C) = 0.1, P(B∩C) = 0.15, P(A∩B∩C) = 0.05. What is P(A ∪ B ∪ C)?',
            qDE: 'P(A) = 0,5, P(B) = 0,4, P(C) = 0,3, P(A∩B) = 0,2, P(A∩C) = 0,1, P(B∩C) = 0,15, P(A∩B∩C) = 0,05. Was ist P(A ∪ B ∪ C)?',
            answer: 0.8, tolerance: 0.001, unit: '',
            hintEn: 'Inclusion-exclusion formula for 3 sets.',
            hintDE: 'Siebformel für 3 Mengen.'
        },
        {
            q: 'P(A) = 0.6, P(B) = 0.5, P(C) = 0.4, P(A∩B) = 0.3, P(A∩C) = 0.2, P(B∩C) = 0.25, P(A∩B∩C) = 0.1. What is P(A ∪ B ∪ C)?',
            qDE: 'P(A) = 0,6, P(B) = 0,5, P(C) = 0,4, P(A∩B) = 0,3, P(A∩C) = 0,2, P(B∩C) = 0,25, P(A∩B∩C) = 0,1. Was ist P(A ∪ B ∪ C)?',
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
            qDE: 'Ein Beutel enthält 3 rote und 2 blaue Bälle. Du ziehst zweimal ohne Zurücklegen. Was ist P(rot, dann rot)? Gib als Dezimalzahl ein.',
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
            qDE: 'X hat Zähldichte p(1)=0,2, p(2)=0,3, p(3)=0,5. Was ist F(2) = P(X ≤ 2)? Gib als Dezimalzahl ein.',
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
            qDE: 'X hat Dichtefunktion f(x) = 2x für x ∈ [0,1], sonst 0. Was ist P(0 ≤ X ≤ 1)?',
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
            qDE: 'X ~ Exp(2). Verteilungsfunktion: F(x) = 1 − e^(−2x) für x ≥ 0. Was ist P(X > 1)? Gib auf 3 Stellen gerundet an. (e ≈ 2,718)',
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
            q: 'X and Y are independent with density functions f_X and f_Y. If f_X(x)=2x on [0,1] and f_Y(y)=1 on [0,1], what is f_{X,Y}(1, 0.5)?',
            qDE: 'X und Y sind unabhängig. Wenn f_X(x)=2x auf [0,1] und f_Y(y)=1 auf [0,1], was ist dann f_{X,Y}(1; 0,5)?',
            answer: 2.0, tolerance: 0.001, unit: '',
            hintEn: 'f_{X,Y}(1, 0.5) = f_X(1) · f_Y(0.5)',
            hintDE: 'f_{X,Y}(1; 0,5) = f_X(1) · f_Y(0,5)'
        },
        {
            q: 'X and Y are independent. E[X]=3, E[Y]=4. What is E[X·Y]?',
            qDE: 'X und Y sind unabhängig. E[X]=3, E[Y]=4. Was ist E[X·Y]?',
            answer: 12, tolerance: 0, unit: '',
            hintEn: 'For independent Random Variables we have E[X·Y] = E[X] · E[Y]',
            hintDE: 'Für unabhängige Zufallsvariablen gilt E[X·Y] = E[X] · E[Y]'
        },

        // ── 3. KONTINGENZTABELLE FÜR UNABHÄNGIGKEIT ──────────────────────────────

        {
            q: 'We have P(X=0,Y=0)=0.12, P(X=0)=0.4, P(Y=0)=0.3. Are X,Y independent?Enter 1 for yes (independent), 0 for no (dependent).',
            qDE: 'Wir haben P(X=0,Y=0)=0,12, P(X=0)=0,4, P(Y=0)=0,3. Sind X,Y unabhängig? Gib 1 für ja (unabhängig), 0 für nein (abhängig) ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'P(X=0)·P(Y=0) = 0.4 × 0.3 = 0.12 = P(X=0, Y=0)',
            hintDE: 'P(X=0)·P(Y=0) = 0,4 × 0,3 = 0,12 = P(X=0, Y=0)'
        },
        {
            q: 'We have P(X=1,Y=1)=0.3, P(X=1)=0.5, P(Y=1)=0.5. Are X and Y independent? Enter 1 for yes, 0 for no.',
            qDE: 'Wir haben P(X=1,Y=1)=0,3, P(X=1)=0,5, P(Y=1)=0,5. Sind X und Y unabhängig? Gib 1 für ja, 0 für nein ein.',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'P(X=1)·P(Y=1) = 0.5 × 0.5 = 0.25 ≠ 0.3',
            hintDE: 'P(X=1)·P(Y=1) = 0,5 × 0,5 = 0,25 ≠ 0,3'
        },
        {
            q: 'In a 2×2 contingency table, P(X=0)=0.6, P(Y=1)=0.4. If X and Y are independent, what must P(X=0, Y=1) equal? Enter as a decimal.',
            qDE: 'In einer 2×2-Kontingenztabelle: P(X=0)=0,6, P(Y=1)=0,4. Wenn X und Y unabhängig sind, welchen Wert muss P(X=0, Y=1) haben? Gib als Dezimalzahl ein.',
            answer: 0.24, tolerance: 0.001, unit: '',
            hintEn: 'Independence criterion: P(X=0, Y=1) = P(X=0) · P(Y=1)',
            hintDE: 'Unabhängigkeitskriterium: P(X=0, Y=1) = P(X=0) · P(Y=1)'
        },

        // ── 4. KRITERIUM FÜR UNABHÄNGIGKEIT ──────────────────────────────────────

        {
            q: 'For X and Y to be independent, the joint density must equal what? Enter 1 for p(x,y)=p_X(x)·p_Y(y), or 2 for p(x,y)=p_X(x)+p_Y(y).',
            qDE: 'Damit X und Y unabhängig sind, muss die gemeinsame Zähldichte was erfüllen? Gib 1 für p(x,y)=p_X(x)·p_Y(y) oder 2 für p(x,y)=p_X(x)+p_Y(y) ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Independence criterion: the joint probability equals the product of the marginals.',
            hintDE: 'Unabhängigkeitskriterium: die gemeinsame Wahrscheinlichkeit ist gleich dem Produkt der Randwahrscheinlichkeiten.'
        },
        {
            q: 'p_X(0)=0.5, p_X(1)=0.5, p_Y(0)=0.4, p_Y(1)=0.6. If independent, what is p(X=1, Y=0)? Enter as a decimal.',
            qDE: 'p_X(0)=0,5, p_X(1)=0,5, p_Y(0)=0,4, p_Y(1)=0,6. Falls X,Y unabhängig sind, was ist dann p(X=1, Y=0)? Gib als Dezimalzahl ein.',
            answer: 0.2, tolerance: 0.001, unit: '',
            hintEn: 'p(X=1, Y=0) = p_X(1) · p_Y(0)',
            hintDE: 'p(X=1, Y=0) = p_X(1) · p_Y(0)'
        },
        {
            q: 'To verify independence from a contingency table with values p(0,0)=0.2, p(0,1)=0.3, p(1,0)=0.2, p(1,1)=0.3, first find p_X(0). Enter as a decimal.',
            qDE: 'Zur Unabhängigkeitsprüfung in einer Kontingenztabelle mit p(0,0)=0,2, p(0,1)=0,3, p(1,0)=0,2, p(1,1)=0,3 bestimme zuerst p_X(0). Gib als Dezimalzahl ein.',
            answer: 0.5, tolerance: 0.001, unit: '',
            hintEn: 'Marginal: p_X(0) = p(0,0) + p(0,1)',
            hintDE: 'Randverteilung: p_X(0) = p(0,0) + p(0,1)'
        },

        // ── 5. STANDARDNORMALVERTEILUNG ───────────────────────────────────────────

        {
            q: 'Z ~ N(0,1). What is P(Z ≤ 1.0)? Enter as a decimal.',
            qDE: 'Z ~ N(0,1). Was ist P(Z ≤ 1,0)? Gib als Dezimalzahl ein.',
            answer: 0.841, tolerance: 0.001, unit: '',
            hintEn: 'Φ(z) = P(Z ≤ z) by definition. Check a quantile table.',
            hintDE: 'Φ(z) = P(Z ≤ z) per Definition. Schaue in einer Quantiltabelle nach.'
        },
        {
            q: 'Z ~ N(0,1). What is P(Z > 1.0)? Enter as a decimal.',
            qDE: 'Z ~ N(0,1). Was ist P(Z > 1,0)? Gib als Dezimalzahl ein.',
            answer: 0.159, tolerance: 0.002, unit: '',
            hintEn: 'P(Z > 1) = 1 − Φ(1) = 1 − 0.841',
            hintDE: 'P(Z > 1) = 1 − Φ(1) = 1 − 0,841'
        },
        {
            q: 'Z ~ N(0,1). Using symmetry Φ(−z) = 1 − Φ(z) and Φ(1.0) ≈ 0.841. What is P(−1 ≤ Z ≤ 1)? Enter as a decimal.',
            qDE: 'Z ~ N(0,1). Mit Φ(−z) = 1 − Φ(z) und Φ(1,0) ≈ 0,841, was ist P(−1 ≤ Z ≤ 1)? Gib als Dezimalzahl ein.',
            answer: 0.682, tolerance: 0.002, unit: '',
            hintEn: 'P(−1 ≤ Z ≤ 1) = Φ(1) − Φ(−1) = 0.841 − (1−0.841)',
            hintDE: 'P(−1 ≤ Z ≤ 1) = Φ(1) − Φ(−1) = 0,841 − (1−0,841)'
        },

        // ── 6. ERWARTUNGSWERT DISKRET UND STETIG ──────────────────────────────────

        {
            q: 'X has density P(X=1)=0.2, P(X=2)=0.5, P(X=3)=0.3. What is E[X]? Enter as a decimal.',
            qDE: 'X hat Zähldichte P(X=1)=0,2, P(X=2)=0,5, P(X=3)=0,3. Was ist E[X]? Gib als Dezimalzahl ein.',
            answer: 2.1, tolerance: 0.001, unit: '',
            hintEn: 'E[X] = 1·0.2 + 2·0.5 + 3·0.3',
            hintDE: 'E[X] = 1·0,2 + 2·0,5 + 3·0,3'
        },
        {
            q: 'X has density f(x) = 2x for x ∈ [0,1]. What is E[X]? Enter as a decimal.',
            qDE: 'X hat Dichtefunktion f(x) = 2x für x ∈ [0,1]. Was ist E[X]? Gib als Dezimalzahl ein.',
            answer: 0.667, tolerance: 0.005, unit: '',
            hintEn: 'Integrate x*2x from 0 to 1',
            hintDE: 'Integriere x*2x von 0 bis 1'
        },
        {
            q: 'A fair die is rolled. What is E[X]? Enter as a decimal.',
            qDE: 'Ein fairer Würfel wird geworfen. Was ist E[X]? Gib als Dezimalzahl ein.',
            answer: 3.5, tolerance: 0.001, unit: '',
            hintEn: 'E[X] = (1+2+3+4+5+6)/6',
            hintDE: 'E[X] = (1+2+3+4+5+6)/6'
        },

        // ── 7. BERNOULLI VERTEILUNG ───────────────────────────────────────────────

        {
            q: 'X ~ Ber(p) with p=0.3. What is E[X]? Enter as a decimal.',
            qDE: 'X ~ Ber(p) mit p=0.3. Was ist E[X]? Gib als Dezimalzahl ein.',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'For X ~ Ber(p): E[X] = p',
            hintDE: 'Für X ~ Ber(p): E[X] = p'
        },
        {
            q: 'X ~ Ber(p) with p=0.7. What is Var(X)? Enter as a decimal.',
            qDE: 'X ~ Ber(p=0,7) mit p=0.7. Was ist Var(X)? Gib als Dezimalzahl ein.',
            answer: 0.21, tolerance: 0.001, unit: '',
            hintEn: 'Var(X) = p(1−p)',
            hintDE: 'Var(X) = p(1−p)'
        },
        {
            q: 'X ~ Ber(p). What is P(X=1)? Enter 1 for p, 2 for 1−p, 3 for p².',
            qDE: 'X ~ Ber(p). Was ist P(X=1)? Gib 1 für p, 2 für 1−p, 3 für p² ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Definition of the Bernoulli distribution',
            hintDE: 'Definition der Bernoulli-Verteilung'
        },

        // ── 8. ERWARTUNGSWERT RECHENREGELN ────────────────────────────────────────

        {
            q: 'E[X]=3. What is E[2X + 5]?',
            qDE: 'E[X]=3. Was ist E[2X + 5]?',
            answer: 11, tolerance: 0, unit: '',
            hintEn: 'Linearity',
            hintDE: 'Linearität'
        },
        {
            q: 'E[X]=2, E[Y]=4. What is E[3X − Y + 1]?',
            qDE: 'E[X]=2, E[Y]=4. Was ist ist E[3X − Y + 1]? ',
            answer: 3, tolerance: 0, unit: '',
            hintEn: 'Linearity',
            hintDE: 'Linearität'
        },
        {
            q: 'f is convex. Jensen\'s inequality states E[f(X)] ≥ f(E[X]). If f(x)=x², E[X]=3, E[X²]=14. Does E[X²] ≥ (E[X])²? Enter 1 for yes, 0 for no.',
            qDE: 'f ist konvex. Die Jensen-Ungleichung besagt E[f(X)] ≥ f(E[X]). Wenn f(x)=x², E[X]=3, E[X²]=14, gilt dann E[X²] ≥ (E[X])²? Gib 1 für ja, 0 für nein ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: '(E[X])² = 9, E[X²] = 14 ≥ 9 ✓. Jensen holds for convex f.',
            hintDE: '(E[X])² = 9, E[X²] = 14 ≥ 9 ✓. Jensen gilt für konvexes f.'
        },

        // ── 9. PRODUKTEIGENSCHAFT FÜR UNABHÄNGIGE ZV ─────────────────────────────

        {
            q: 'X and Y are independent. E[X]=5, E[Y]=3. What is E[X·Y]?',
            qDE: 'X und Y sind unabhängig. E[X]=5, E[Y]=3. Was ist E[X·Y]?',
            answer: 15, tolerance: 0, unit: '',
            hintEn: 'For independent X, Y: E[XY] = E[X]·E[Y]',
            hintDE: 'Für unabhängige X, Y: E[XY] = E[X]·E[Y]'
        },
        {
            q: 'X and Y are independent with E[X]=2, E[Y]=6, E[X²]=5. What is E[X²·Y]?',
            qDE: 'X und Y sind unabhängig mit E[X]=2, E[Y]=6, E[X²]=5. Was ist E[X²·Y]?',
            answer: 30, tolerance: 0, unit: '',
            hintEn: 'g(X)=X² and Y are also independent',
            hintDE: 'g(X)=X² und Y sind ebenfalls unabhängig'
        },
        {
            q: 'X and Y are NOT independent and E[X]=2, E[Y]=3. Can we conclude E[XY]=6? Enter 1 for yes, 0 for no.',
            qDE: 'X und Y sind NICHT unabhängig und E[X]=2, E[Y]=3. Können wir E[XY]=6 schlussfolgern? Gib 1 für ja, 0 für nein ein.',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'E[XY] = E[X]·E[Y] holds only for independent random variables',
            hintDE: 'E[XY] = E[X]·E[Y] gilt nur für unabhängige Zufallsvariablen'
        },

        // ── 10. VARIANZ UND STANDARDABWEICHUNG ───────────────────────────────────

        {
            q: 'X has E[X]=4, E[X²]=20. What is Var(X)?',
            qDE: 'X hat E[X]=4, E[X²]=20. Was ist Var(X)?',
            answer: 4, tolerance: 0, unit: '',
            hintEn: 'Var(X) = E[X²] − (E[X])²',
            hintDE: 'Var(X) = E[X²] − (E[X])²'
        },
        {
            q: 'Var(X) = 9. What is the standard deviation σ(X)?',
            qDE: 'Var(X) = 9. Was ist die Standardabweichung σ(X)?',
            answer: 3, tolerance: 0, unit: '',
            hintEn: 'σ(X) = √Var(X)',
            hintDE: 'σ(X) = √Var(X)'
        },
        {
            q: 'X has density P(X=0)=0.5, P(X=2)=0.5. What is Var(X)?',
            qDE: 'X hat Zähldichte P(X=0)=0,5, P(X=2)=0,5. Was ist Var(X)?',
            answer: 1, tolerance: 0.001, unit: '',
            hintEn: 'E[X]=1, E[X²]=0·0.5+4·0.5=2',
            hintDE: 'E[X]=1, E[X²]=0·0,5+4·0,5=2'
        },

        // ── 11. VERSCHIEBUNGSSATZ (Computational Formula for Variance) ────────────

        {
            q: 'E[X]=5, E[X²]=30. What is Var(X)?',
            qDE: 'E[X]=5, E[X²]=30. Was ist Var(X)?',
            answer: 5, tolerance: 0, unit: '',
            hintEn: 'Shift Theorem',
            hintDE: 'Verschiebungssatz'
        },
        {
            q: 'E[X]=3, Var(X)=7. What is E[X²]?',
            qDE: 'E[X]=3, Var(X)=7. Was ist E[X²]?',
            answer: 16, tolerance: 0, unit: '',
            hintEn: 'E[X²] = Var(X) + (E[X])²',
            hintDE: 'E[X²] = Var(X) + (E[X])²'
        },
        {
            q: 'X ~ Ber(0.4), E[X]=0.4, E[X²]=0.4. What is Var(X)?',
            qDE: 'X ~ Ber(0,4), E[X]=0,4, E[X²]=0,4. Was ist Var(X)?',
            answer: 0.24, tolerance: 0.001, unit: '',
            hintEn: 'Var(X) = E[X²] − (E[X])²',
            hintDE: 'Var(X) = E[X²] − (E[X])²'
        },

        // ── 12. RECHENREGELN FÜR VARIANZ ─────────────────────────────────────────

        {
            q: 'Var(X)=4. What is Var(3X)?',
            qDE: 'Var(X)=4. Was ist Var(3X)?',
            answer: 36, tolerance: 0, unit: '',
            hintEn: 'Var(aX) = a²·Var(X)',
            hintDE: 'Var(aX) = a²·Var(X)'
        },
        {
            q: 'Var(X)=4. What is Var(X + 7)?',
            qDE: 'Var(X)=4. Was ist Var(X + 7)?',
            answer: 4, tolerance: 0, unit: '',
            hintEn: 'Adding a constant does not change variance: Var(X+c) = Var(X).',
            hintDE: 'Eine Konstante addieren ändert die Varianz nicht: Var(X+c) = Var(X).'
        },
        {
            q: 'X and Y are independent with Var(X)=3, Var(Y)=5. What is Var(X+Y)?',
            qDE: 'X und Y sind unabhängig mit Var(X)=3, Var(Y)=5. Was ist Var(X+Y)?',
            answer: 8, tolerance: 0, unit: '',
            hintEn: 'For independent X, Y: Var(X+Y) = Var(X) + Var(Y)',
            hintDE: 'Für unabhängige X, Y: Var(X+Y) = Var(X) + Var(Y)'
        },

        // ── 13. TRANSFORMATIONSSATZ FÜR ERWARTUNGSWERT ───────────────────────────

        {
            q: 'X has density P(X=1)=0.4, P(X=2)=0.6. What is E[X²]? Enter as a decimal.',
            qDE: 'X hat Zähldichte P(X=1)=0,4, P(X=2)=0,6. Was ist E[X²]? Gib als Dezimalzahl ein.',
            answer: 2.8, tolerance: 0.001, unit: '',
            hintEn: 'E[g(X)] = Σ g(x)·p(x). E[X²]',
            hintDE: 'E[g(X)] = Σ g(x)·p(x). E[X²]'
        },
        {
            q: 'X has density P(X=0)=0.3, P(X=1)=0.5, P(X=2)=0.2. What is E[X²]? Enter as a decimal.',
            qDE: 'X hat Zähldichte P(X=0)=0,3, P(X=1)=0,5, P(X=2)=0,2. Was ist E[X²]? Gib als Dezimalzahl ein.',
            answer: 1.3, tolerance: 0.001, unit: '',
            hintEn: 'E[X²] = 0²·0.3 + 1²·0.5 + 2²·0.2',
            hintDE: 'E[X²] = 0²·0,3 + 1²·0,5 + 2²·0,2'
        },
        {
            q: 'X ~ U[0,1]. What is E[X²]? Enter as a decimal rounded to 3 places.',
            qDE: 'X ~ U[0,1]. Was ist E[X²]? Gib auf 3 Dezimalstellen gerundet an.',
            answer: 0.333, tolerance: 0.002, unit: '',
            hintEn: 'Transformation Theorem',
            hintDE: 'Transformationssatz'
        },

        // ── 14. BINOMIALVERTEILUNG ────────────────────────────────────────────────

        {
            q: 'X ~ Bin(5,0.5). What is E[X]? Enter as a decimal.',
            qDE: 'X ~ Bin(5,0,5). Was ist E[X]? Gib als Dezimalzahl ein.',
            answer: 2.5, tolerance: 0.001, unit: '',
            hintEn: 'E[X] = n·p',
            hintDE: 'E[X] = n·p'
        },
        {
            q: 'X ~ Bin(4,0.5). What is P(X=2)? Enter as a decimal.',
            qDE: 'X ~ Bin(4,0,5). Was ist P(X=2)? Gib als Dezimalzahl ein.',
            answer: 0.375, tolerance: 0.002, unit: '',
            hintEn: 'P(X=2) = binomialcoefficient(4,2)·0.5²·0.5²',
            hintDE: 'P(X=2) = binomialkoeffizient(4,2)·0,5²·0,5²'
        },
        {
            q: 'X ~ Bin(10,0.3). What is Var(X)? Enter as a decimal.',
            qDE: 'X ~ Bin(10,0,3). Was ist Var(X)? Gib als Dezimalzahl ein.',
            answer: 2.1, tolerance: 0.001, unit: '',
            hintEn: 'Var(X) = n·p·(1−p)',
            hintDE: 'Var(X) = n·p·(1−p)'
        },

        // ── 15. FALTUNG BEI BINOMIALVERTEILUNG (Convolution) ─────────────────────

        {
            q: 'X ~ Bin(3, 0.4) and Y ~ Bin(2, 0.4) are independent. The distribution of X+Y is then Bin(n,0.4). What is n?',
            qDE: 'X ~ Bin(3; 0,4) und Y ~ Bin(2; 0,4) sind unabhängig. Die Verteilung von X+Y ist dann Bin(n,0.4). Was ist n?',
            answer: 5, tolerance: 0, unit: '',
            hintEn: 'Convolution',
            hintDE: 'Faltung'
        },
        {
            q: 'X ~ Bin(4, 0.6) and Y ~ Bin(6, 0.6) are independent. E[X+Y] = ?',
            qDE: 'X ~ Bin(4; 0,6) und Y ~ Bin(6; 0,6) sind unabhängig. E[X+Y] = ?',
            answer: 6, tolerance: 0, unit: '',
            hintEn: 'X+Y ~ Bin(10, 0.6)',
            hintDE: 'X+Y ~ Bin(10; 0,6)'
        },
        {
            q: 'X ~ Bin(8, p) and Y ~ Bin(3, p) are independent. X+Y follows Bin(?, p). Enter the first parameter.',
            qDE: 'X ~ Bin(n, p) und Y ~ Bin(m, p) sind unabhängig. X+Y folgt Bin(?, p). Gib den ersten Parameter ein.',
            answer: 11, tolerance: 0, unit: '',
            hintEn: 'The convolution of two binomials with the same p gives Bin(n+m, p).',
            hintDE: 'Die Faltung zweier Binomialverteilungen mit gleichem p ergibt Bin(n+m, p).'
        },

        // ── 16. URNENMODELL OHNE REIHENFOLGE OHNE ZURÜCKLEGEN ────────────────────

        {
            q: 'An urn has 6 balls. How many ways can you choose 2 balls without replacement, ignoring order?',
            qDE: 'Eine Urne hat 6 Bälle. Wie viele Möglichkeiten gibt es, 2 Bälle ohne Zurücklegen zu ziehen, wenn die Reihenfolge egal ist?',
            answer: 15, tolerance: 0, unit: 'ways',
            hintEn: 'C(6,2) for the binomial coefficient C',
            hintDE: 'C(6,2) für den Binomialkoeffizient C'
        },
        {
            q: 'An urn has 10 balls: 4 red, 6 blue. Two balls are drawn without replacement, order ignored. How many ways give 2 red balls?',
            qDE: 'Eine Urne hat 10 Bälle: 4 rote, 6 blaue. Zwei Bälle werden ohne Zurücklegen gezogen, Reihenfolge egal. Wie viele Möglichkeiten liefern 2 rote Bälle?',
            answer: 6, tolerance: 0, unit: 'ways',
            hintEn: 'C(4,2) for the binomial coefficient C',
            hintDE: 'C(4,2) für den Binomialkoeffizient C'
        },
        {
            q: 'Urn: 5 red, 5 blue balls; draw 3 without replacement, order ignored. Total outcomes 120. How many outcomes have exactly 2 red balls?',
            qDE: 'Urne: 5 rote, 5 blaue Bälle; 3 ohne Zurücklegen ziehen, Reihenfolge egal. 120 Gesamtergebnisse. Wie viele Ergebnisse haben genau 2 rote Bälle?',
            answer: 50, tolerance: 0, unit: 'outcomes',
            hintEn: 'C(5,2)·C(5,1) for the binomial coefficient C',
            hintDE: 'C(5,2)·C(5,1) für den Binomialkoeffizient C'
        },

        // ── 17. URNENMODELL OHNE REIHENFOLGE MIT ZURÜCKLEGEN ─────────────────────

        {
            q: 'An urn has 4 balls. You draw 2 with replacement, ignoring order. How many distinc unordered outcomes are possible?',
            qDE: 'Eine Urne hat 4 Bälle. Du ziehst 2 mit Zurücklegen, Reihenfolge egal. Wie viele verschiedene ungeordnete Ergebnisse sind möglich?',
            answer: 10, tolerance: 0, unit: 'outcomes',
            hintEn: 'With replacement, no order: C(n+k−1, k) = C(4+2−1, 2) for the binomial coefficient C',
            hintDE: 'Mit Zurücklegen, ohne Reihenfolge: C(n+k−1, k) = C(4+2−1, 2) für den Binomialkoeffizient C.'
        },
        {
            q: 'An urn has 3 colours. You draw 3 times with replacement, order ignored. How many distinct colour combinations are possible?',
            qDE: 'Eine Urne hat 3 Farben. Du ziehst 3 Mal mit Zurücklegen, Reihenfolge egal. Wie viele verschiedene Farbkombinationen sind möglich?',
            answer: 10, tolerance: 0, unit: 'combinations',
            hintEn: 'C(n+k−1, k) = C(3+3−1, 3) for the binomial coefficient C',
            hintDE: 'C(n+k−1, k) = C(3+3−1, 3) für den Binomialkoeffizient C'
        },
        {
            q: 'Urn with replacement, no order: n=5 balls, draw k=2. How many unordered outcomes? C(n+k−1, k) = C(6,2) = ?',
            qDE: 'Urne mit Zurücklegen, ohne Reihenfolge: n=5 Bälle, k=2 Züge. Wie viele ungeordnete Ergebnisse? C(n+k−1, k) = C(6,2) = ?',
            answer: 15, tolerance: 0, unit: 'outcomes',
            hintEn: 'C(6,2) for the binomial coefficient C',
            hintDE: 'C(6,2) für den Binomialkoeffizienten C '
        },
    ],





    // ── WORLD 5 ─────────────────────────────────────────────────────────
    //
    5: [

        // ── 1. HYPERGEOMETRISCHE VERTEILUNG ──────────────────────────────────────────
        {
            q: 'An urn has 10 balls: 4 red, 6 blue. Draw 3 without replacement. What is P(exactly 2 red)? Enter as a decimal rounded to 4 places.',
            qDE: 'Eine Urne hat 10 Bälle: 4 rote, 6 blaue. Ziehe 3 ohne Zurücklegen. Was ist P(genau 2 rote)? Runde auf 4 Stellen.',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'C(4,2)·C(6,1)/C(10,3) for the binomial coefficient C',
            hintDE: 'C(4,2)·C(6,1)/C(10,3) für den Binomialkoeffizient C'
        },
        {
            q: 'Urn with N=8 balls, K=3 red, draw n=2 without replacement. What is E[X] where X = number of red balls drawn? Enter as a decimal.',
            qDE: 'Urne mit N=8 Bälle, K=3 rote, ziehe n=2 ohne Zurücklegen. Was ist E[X], wobei X = Anzahl roter Bälle? Gib als Dezimalzahl ein.',
            answer: 0.75, tolerance: 0.001, unit: '',
            hintEn: 'E[X] = n·K/N',
            hintDE: 'E[X] = n·K/N'
        },

        // ── 2. GEOMETRISCHE VERTEILUNG ────────────────────────────────────────────────
        {
            q: 'X ~ Ge(0.4): number of trials until first success. What is P(X=3)? Enter as a decimal.',
            qDE: 'X ~ Geo(0,4): Anzahl Versuche bis zum ersten Erfolg. Was ist P(X=3)? Gib als Dezimalzahl ein.',
            answer: 0.144, tolerance: 0.002, unit: '',
            hintEn: 'P(X=3) = 0.6²·0.4',
            hintDE: 'P(X=3) = 0,6²·0,4'
        },
        {
            q: 'X ~ Geom(0.25). What is E[X]?',
            qDE: 'X ~ Geo(0,25). Was ist E[X]?',
            answer: 4, tolerance: 0, unit: '',
            hintEn: 'E[X] = 1/p',
            hintDE: 'E[X] = 1/p'
        },
        {
            q: 'X ~ Geo(0.5). What is P(X > 3)? Enter as a decimal.',
            qDE: 'X ~ Geo(p=0,5). Was ist P(X > 3)? Gib als Dezimalzahl ein.',
            answer: 0.125, tolerance: 0.001, unit: '',
            hintEn: 'P(X > 3) = (1−0.5)³.',
            hintDE: 'P(X > 3) = (1−0,5)³'
        },

        // ── 3. BERNOULLI-FOLGE ────────────────────────────────────────────────────────
        {
            q: 'A Bernoulli sequence has p=0.3. What is the probability of the pattern S-F-S (success, failure, success) in exactly that order?',
            qDE: 'Eine Bernoulli-Folge hat p=0,3. Was ist die Wahrscheinlichkeit des Musters E-M-E (Erfolg, Misserfolg, Erfolg) in genau dieser Reihenfolge?',
            answer: 0.063, tolerance: 0.001, unit: '',
            hintEn: 'P = p·(1−p)·p',
            hintDE: 'P = p·(1−p)·p'
        },
        {
            q: 'In a Bernoulli sequence with p=0.5, what is the probability of getting exactly 3 successes in 5 trials?',
            qDE: 'In einer Bernoulli-Folge mit p=0,5: Was ist die Wahrscheinlichkeit von genau 3 Erfolgen in 5 Versuchen?',
            answer: 0.3125, tolerance: 0.001, unit: '',
            hintEn: 'C(5,3)·0.5³·0.5² with C as binomial coefficient.',
            hintDE: 'C(5,3)·0,5³·0,5² mit C als Binomialkoeffizient'
        },
        {
            q: 'A Bernoulli sequence has p=0.2. What is the probability that the first success occurs on trial 4 or later? . Enter as a decimal.',
            qDE: 'Eine Bernoulli-Folge hat p=0,2. Was ist P(X ≥ 4), d.h. der erste Erfolg tritt frühestens beim 4. Versuch auf? Gib als Dezimalzahl ein.',
            answer: 0.512, tolerance: 0.001, unit: '',
            hintEn: 'P(X ≥ 4) = (1−p)³',
            hintDE: 'P(X ≥ 4) = (1−p)³'
        },

        // ── 4. NEGATIVE BINOMIALVERTEILUNG ───────────────────────────────────────────
        {
            q: 'X ~ NegBin(r=2, p=0.5): number of trials until 2nd success. What is P(X=4)? Enter as a decimal.',
            qDE: 'X ~ NegBin(r=2, p=0,5): Anzahl Versuche bis zum 2. Erfolg. Was ist P(X=4)? Gib als Dezimalzahl ein.',
            answer: 0.1875, tolerance: 0.002, unit: '',
            hintEn: 'P(X=4) = C(3,1)·0.5²·0.5² with C as binomial coefficient',
            hintDE: 'P(X=4) = C(3,1)·0,5²·0,5² mit C als Binomialkoeffizient'
        },
        {
            q: 'X ~ NegBin(r=3, p=0.4). What is E[X]? Enter as a decimal.',
            qDE: 'X ~ NegBin(r=3, p=0,4). Was ist E[X]? Gib als Dezimalzahl ein.',
            answer: 7.5, tolerance: 0.001, unit: '',
            hintEn: 'E[X] = r/p',
            hintDE: 'E[X] = r/p'
        },
        {
            q: 'X ~ NegBin(r=2, p=0.5). What is Var(X)? Enter as a decimal.',
            qDE: 'X ~ NegBin(r=2, p=0,5). Was ist Var(X)? Gib als Dezimalzahl ein.',
            answer: 4.0, tolerance: 0.001, unit: '',
            hintEn: 'Var(X) = 2·0.5/0.25.',
            hintDE: 'Var(X) = 2·0,5/0,25.'
        },

        // ── 5. POISSONVERTEILUNG ──────────────────────────────────────────────────────
        {
            q: 'X ~ Poi(3). What is P(X=0)? Enter as a decimal rounded to 4 places.',
            qDE: 'X ~ Poi(3). Was ist P(X=0)? Auf 4 Stellen gerundet.',
            answer: 0.0498, tolerance: 0.001, unit: '',
            hintEn: 'P(X=0) = e^(−3)·3⁰/0!',
            hintDE: 'P(X=0) = e^(−3)·3⁰/0!'
        },
        {
            q: 'X ~ Poi(2). What is P(X=2)? Enter as a decimal rounded to 4 places.',
            qDE: 'X ~ Poi(2). Was ist P(X=2)? Auf 4 Stellen gerundet.',
            answer: 0.2707, tolerance: 0.002, unit: '',
            hintEn: 'P(X=2) = e^(−2)·2²/2!',
            hintDE: 'P(X=2) = e^(−2)·2²/2!'
        },
        {
            q: 'X ~ Poi(5). What is E[X] and Var(X)? Enter the value.',
            qDE: 'X ~ Poi(5). Was sind E[X] und Var(X)? Gib den Wert ein.',
            answer: 5, tolerance: 0, unit: '',
            hintEn: 'For Poi(λ): E[X] = Var(X)',
            hintDE: 'Für Poi(λ): E[X] = Var(X)'
        },

        // ── 6. POISSON-GRENZWERTSATZ ──────────────────────────────────────────────────
        {
            q: 'X ~ Bin(100,0.03). Approximate using Poisson. What is λ? Enter as a decimal.',
            qDE: 'X ~ Bin(100,0,03). Approximiere durch die Poissonverteilung an. Was ist λ? Gib als Dezimalzahl ein.',
            answer: 3.0, tolerance: 0.001, unit: '',
            hintEn: 'λ = n·p = 100·0.03.',
            hintDE: 'λ = n·p = 100·0,03.'
        },
        {
            q: 'X ~ Bin(200,0.01). Using the Poisson approximation with λ=n·p, what is P(X=0)? Enter as a decimal rounded to 4 places.',
            qDE: 'X ~ Bin(200,0,01). Mit der Poisson-Näherung λ=n·p: Was ist P(X=0)? Auf 4 Stellen runden.',
            answer: 0.1353, tolerance: 0.002, unit: '',
            hintEn: 'λ = 2. P(X=0).',
            hintDE: 'λ = 2. P(X=0).'
        },
        {
            q: 'For the Poisson limit theorem, the approximation Bin(n,p) ≈ Poi(λ) is good when n is large and p is small. If n=1000 and λ=2, what is p? Enter as a decimal.',
            qDE: 'Für den Poisson-Grenzwertsatz gilt Bin(n,p) ≈ Poi(λ) gut, wenn n groß und p klein ist. Wenn n=1000 und λ=2, was ist p? Gib als Dezimalzahl ein.',
            answer: 0.002, tolerance: 0.0001, unit: '',
            hintEn: 'p = λ/n',
            hintDE: 'p = λ/n'
        },

        // ── 7. STETIGE GLEICHVERTEILUNG ───────────────────────────────────────────────
        {
            q: 'X ~ U[2, 8]. What is E[X]? Enter as a whole number.',
            qDE: 'X ~ U[2, 8]. Was ist E[X]? Gib eine ganze Zahl ein.',
            answer: 5, tolerance: 0, unit: '',
            hintEn: 'E[X] = (a+b)/2',
            hintDE: 'E[X] = (a+b)/2'
        },
        {
            q: 'X ~ U[0, 10]. What is P(3 ≤ X ≤ 7)? Enter as a decimal.',
            qDE: 'X ~ U[0, 10]. Was ist P(3 ≤ X ≤ 7)? Gib als Dezimalzahl ein.',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'P(3 ≤ X ≤ 7) = (7−3)/(10−0)',
            hintDE: 'P(3 ≤ X ≤ 7) = (7−3)/(10−0)'
        },
        {
            q: 'X ~ U[a, b]. For a=0, b=6, what is Var(X)? Enter as a whole number.',
            qDE: 'X ~ U[a, b].Für a=0, b=6: Was ist Var(X)? Gib eine ganze Zahl ein.',
            answer: 3, tolerance: 0, unit: '',
            hintEn: 'Var(X) = (6−0)²/12',
            hintDE: 'Var(X) = (6−0)²/12'
        },

        // ── 8. EXPONENTIALVERTEILUNG ──────────────────────────────────────────────────
        {
            q: 'X ~ Exp(0.5). What is E[X]? Enter as a whole number.',
            qDE: 'X ~ Exp(0,5). Was ist E[X]? Gib eine ganze Zahl ein.',
            answer: 2, tolerance: 0, unit: '',
            hintEn: 'E[X] = 1/λ',
            hintDE: 'E[X] = 1/λ'
        },
        {
            q: 'X ~ Exp(2). What is P(X ≤ 1)? Enter as a decimal rounded to 4 places.',
            qDE: 'X ~ Exp(λ=2). Was ist P(X ≤ 1)? Auf 4 Stellen runden.',
            answer: 0.8647, tolerance: 0.002, unit: '',
            hintEn: 'F(1) = 1 − e^(−2)',
            hintDE: 'F(1) = 1 − e^(−2)'
        },
        {
            q: 'X ~ Exp(3). What is Var(X)? Enter as a decimal rounded to 2 places.',
            qDE: 'X ~ Exp(3). Was ist Var(X)? Auf 2 Stellen runden',
            answer: 0.11, tolerance: 0.02, unit: '',
            hintEn: 'Var(X) = 1/λ² = 1/9.',
            hintDE: 'Var(X) = 1/λ² = 1/9.'
        },

        // ── 9. NORMALVERTEILUNG ───────────────────────────────────────────────────────
        {
            q: 'X ~ N(10, 4). What is the standard deviation σ? Enter as a whole number.',
            qDE: 'X ~ N(10, 4). Was ist die Standardabweichung σ? Gib eine ganze Zahl ein.',
            answer: 2, tolerance: 0, unit: '',
            hintEn: 'σ = √σ²',
            hintDE: 'σ = √σ²'
        },

        {
            q: 'X ~ N(0,1). What is P(−1.96 ≤ X ≤ 1.96)? Enter as a decimal.',
            qDE: 'X ~ N(μ=0, σ=1). Was ist P(−1,96 ≤ X ≤ 1,96)? Gib als Dezimalzahl ein.',
            answer: 0.95, tolerance: 0.002, unit: '',
            hintEn: 'P(−1.96 ≤ Z ≤ 1.96) = Φ(1.96) − Φ(−1.96) ',
            hintDE: 'P(−1,96 ≤ Z ≤ 1,96) = Φ(1,96) − Φ(−1,96) '
        },

        // ── 10. RECHNEN MIT NORMALVERTEILTEN ZUFALLSVARIABLEN ─────────────────────────
        {
            q: 'X ~ N(3,1), Y ~ N(2,4), independent. What is the distribution of X+Y? Give E[X+Y].',
            qDE: 'X ~ N(3, 1), Y ~ N(2,4), unabhängig. Welche Verteilung hat X+Y? Gib E[X+Y] an.',
            answer: 5, tolerance: 0, unit: '',
            hintEn: 'E(X+Y)=E(X)+E(Y)',
            hintDE: 'E(X+Y)=E(X)+E(Y)',
        },
        {
            q: 'X ~ N(3,1), Y ~ N(2,4), independent. What is Var(X+Y)?',
            qDE: 'X ~ N(3,1), Y ~ N(2,4), unabhängig. Was ist Var(X+Y)?',
            answer: 5, tolerance: 0, unit: '',
            hintEn: 'Var(X+Y) = Var(X) + Var(Y)',
            hintDE: 'Var(X+Y) = Var(X) + Var(Y)'
        },
        {
            q: 'X ~ N(10,3). What is P(X ≤ 10)? Enter as a decimal.',
            qDE: 'X ~ N(10,3). Was ist P(X ≤ 10)? Gib als Dezimalzahl ein.',
            answer: 0.5, tolerance: 0.001, unit: '',
            hintEn: 'Symmetry',
            hintDE: 'Symmetrie'
        },

        // ── 11. ZUFALLSVEKTOREN ───────────────────────────────────────────────────────
        {
            q: 'A random vector (X,Y) has joint density: p(0,0)=0.1, p(0,1)=0.2, p(1,0)=0.3, p(1,1)=0.4. What is P(X=1)? Enter as a decimal.',
            qDE: 'Ein Zufallsvektor (X,Y) hat gemeinsame Zähldichte: p(0,0)=0,1, p(0,1)=0,2, p(1,0)=0,3, p(1,1)=0,4. Was ist P(X=1)? Gib als Dezimalzahl ein.',
            answer: 0.7, tolerance: 0.001, unit: '',
            hintEn: 'P(X=1) = p(1,0) + p(1,1)',
            hintDE: 'P(X=1) = p(1,0) + p(1,1)'
        },
        {
            q: 'A random vector (X,Y) has joint density p(0,0)=0.1, p(0,1)=0.2, p(1,0)=0.3, p(1,1)=0.4. What is P(Y=1)? Enter as a decimal.',
            qDE: 'Ein Zufallsvektor (X,Y) hat die gemeinsame Zähldichte: p(0,0)=0,1, p(0,1)=0,2, p(1,0)=0,3, p(1,1)=0,4. Was ist P(Y=1)? Gib als Dezimalzahl ein.',
            answer: 0.6, tolerance: 0.001, unit: '',
            hintEn: 'P(Y=1) = p(0,1) + p(1,1)',
            hintDE: 'P(Y=1) = p(0,1) + p(1,1)'
        },
        {
            q: 'A random vector (X,Y) has joint density: p(0,0)=0.1, p(0,1)=0.2, p(1,0)=0.3, p(1,1)=0.4. What is E[X+Y]? Enter as a decimal.',
            qDE: 'Ein Zufallsvektor (X,Y) hat die gemeinsame Zähldichte: p(0,0)=0,1, p(0,1)=0,2, p(1,0)=0,3, p(1,1)=0,4. Was ist E[X+Y]? Gib als Dezimalzahl ein.',
            answer: 1.3, tolerance: 0.001, unit: '',
            hintEn: 'E[X+Y] = 0·0.1 + 1·0.2 + 1·0.3 + 2·0.4',
            hintDE: 'E[X+Y] = 0·0,1 + 1·0,2 + 1·0,3 + 2·0,4'
        },

        // ── 12. VERTEILUNG VON ZUFALLSVEKTOREN ───────────────────────────────────────

        {
            q: 'Joint density f(x,y) = 2x on [0,1]². What is the marginal density f_X(x)? Enter the value for x=0.4.',
            qDE: 'Gemeinsame Dichte f(x,y) = 2x auf [0,1]². Was ist die Randdichte f_X(x)? Gib den Wert für x=0,4 ein.',
            answer: 0.8, tolerance: 0.001, unit: '',
            hintEn: 'Integrate the joint density with respect to y to receive the marginal density f_X(x).',
            hintDE: 'Integriere die gemeinsame Dichte bezüglich y um die Randdichte f_X(x) zu erhalten.'
        },
        {
            q: 'Joint density: p(1,1)=0.3, p(1,2)=0.2, p(2,1)=0.1, p(2,2)=0.4. What is P(X=2, Y=2)? Enter as a decimal.',
            qDE: 'Gemeinsame Zähldichte: p(1,1)=0,3, p(1,2)=0,2, p(2,1)=0,1, p(2,2)=0,4. Was ist P(X=2, Y=2)? Gib als Dezimalzahl ein.',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'P(X=2, Y=2) = p(2,2)',
            hintDE: 'P(X=2, Y=2) = p(2,2)'
        },

        // ── 13. PRODUKTVERTEILUNG BEI UNABHÄNGIGKEIT ─────────────────────────────────

        {
            q: 'X and Y are independent with f_X(x)=2x on [0,1] and f_Y(y)=3y² on [0,1]. What is f_{X,Y}(0.5, 0.5)?',
            qDE: 'X und Y sind unabhängig mit f_X(x)=2x auf [0,1] und f_Y(y)=3y² auf [0,1]. Was ist f_{X,Y}(0,5; 0,5)?',
            answer: 0.75, tolerance: 0.001, unit: '',
            hintEn: 'f_{X,Y}(0.5,0.5) = f_X(0.5)·f_Y(0.5)',
            hintDE: 'f_{X,Y}(0,5;0,5) = f_X(0,5)·f_Y(0,5)'
        },
        {
            q: 'p_X(0)=0.4, p_X(1)=0.6, p_Y(0)=0.3, p_Y(1)=0.7. If X and Y are independent, what is p(X=1, Y=1)? Enter as a decimal.',
            qDE: 'p_X(0)=0,4, p_X(1)=0,6, p_Y(0)=0,3, p_Y(1)=0,7. Falls X und Y unabhängig sind, was ist p(X=1, Y=1)? Gib als Dezimalzahl ein.',
            answer: 0.42, tolerance: 0.001, unit: '',
            hintEn: 'p(1,1) = p_X(1)·p_Y(1)',
            hintDE: 'p(1,1) = p_X(1)·p_Y(1)'
        },

        // ── 14. BEDINGTE ZÄHLDICHTE ───────────────────────────────────────────────────
        {
            q: 'Joint density: p(0,0)=0.2, p(0,1)=0.3, p(1,0)=0.1, p(1,1)=0.4. What is p_{Y|X}(1|1) = P(Y=1|X=1)? Enter as a decimal.',
            qDE: 'Gemeinsame Zähldichte: p(0,0)=0,2, p(0,1)=0,3, p(1,0)=0,1, p(1,1)=0,4. Was ist p_{Y|X}(1|1) = P(Y=1|X=1)? Gib als Dezimalzahl ein.',
            answer: 0.8, tolerance: 0.001, unit: '',
            hintEn: 'P(Y=1|X=1) = p(1,1)/p_X(1)',
            hintDE: 'P(Y=1|X=1) = p(1,1)/p_X(1)'
        },
        {
            q: 'Joint density p(0,0)=0.2, p(0,1)=0.3, p(1,0)=0.1, p(1,1)=0.4. What is p_{Y|X}(0|0) = P(Y=0|X=0)? Enter as a decimal.',
            qDE: 'Gemeinsame Zähldichte: p(0,0)=0,2, p(0,1)=0,3, p(1,0)=0,1, p(1,1)=0,4. Was ist P(Y=0|X=0)? Gib als Dezimalzahl ein.',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'P(Y=0|X=0) = p(0,0)/p_X(0)',
            hintDE: 'P(Y=0|X=0) = p(0,0)/p_X(0)'
        },
        {
            q: 'Joint density: p(1,1)=0.3, p(1,2)=0.2, p(2,1)=0.1, p(2,2)=0.4. What is E[Y|X=1]? Enter as a decimal.',
            qDE: 'Gemeinsame Zähldichte: p(1,1)=0,3, p(1,2)=0,2, p(2,1)=0,1, p(2,2)=0,4. Was ist E[Y|X=1]? Gib als Dezimalzahl ein.',
            answer: 1.4, tolerance: 0.001, unit: '',
            hintEn: 'p_X(1)=0.5. P(Y=1|X=1)=0.3/0.5=0.6, P(Y=2|X=1)=0.2/0.5=0.4',
            hintDE: 'p_X(1)=0,5. P(Y=1|X=1)=0,3/0,5=0,6, P(Y=2|X=1)=0,2/0,5=0,4'
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
                hintEn: '70 / 150',
                hintDE: '70 / 150'
            },
            {
                q: 'In a study, Treatment A beats Treatment B in both men and women separately, but loses overall. The lurking variable causing this is called a __ variable. Enter 1 for confounding, 2 for independent, 3 for random.',
                qDE: 'In einer Studie schlägt Behandlung A die Behandlung B bei Männern und Frauen separat, verliert aber insgesamt. Die verursachende versteckte Variable heißt __ Variable. Gib 1 für Störvariable, 2 für unabhängige, 3 für zufällige ein.',
                answer: 1, tolerance: 0, unit: '',
                hintEn: 'A confounding (lurking) variable creates Simpson\'s Paradox by being correlated with both the grouping and the outcome.',
                hintDE: 'Eine Störvariable (Confounder) erzeugt Simpsons Paradoxon, da sie mit Gruppierung und Ergebnis korreliert.'
            },

            // ── 2. BEDINGTE DICHTE ────────────────────────────────────────────────────────

            {
                q: 'Joint density f(x,y) = 6x for 0 ≤ x ≤ 1, 0 ≤ y ≤ x. What is f_{Y|X}(y|x) = f(x,y)/f_X(x)? Enter the value at x=0.5, y=0.3.',
                qDE: 'Gemeinsame Dichte f(x,y) = 6x für 0 ≤ x ≤ 1, 0 ≤ y ≤ x. Was ist f_{Y|X}(y|x) = f(x,y)/f_X(x) bei x=0,5, y=0,3? Gib als Dezimalzahl ein.',
                answer: 2.0, tolerance: 0.01, unit: '',
                hintEn: 'Calculate the marginal density',
                hintDE: 'Bestimme die Randdichte'
            },
            {
                q: 'Joint density: p(1,1)=0.2, p(1,2)=0.3, p(2,1)=0.1, p(2,2)=0.4. What is the conditional density p_{Y|X}(2|2) = P(Y=2|X=2)? Enter as a decimal.',
                qDE: 'Gemeinsame Zähldichte: p(1,1)=0,2, p(1,2)=0,3, p(2,1)=0,1, p(2,2)=0,4. Was ist p_{Y|X}(2|2) = P(Y=2|X=2)? Gib als Dezimalzahl ein.',
                answer: 0.8, tolerance: 0.001, unit: '',
                hintEn: 'p_X(2) = p(2,1)+p(2,2)',
                hintDE: 'p_X(2) = p(2,1)+p(2,2)'
            },
            {
                q: 'Joint density f(x,y) = 2 for 0 ≤ y ≤ x ≤ 1. The marginal f_X(x) = 2x. What is f_{Y|X}(y|x)? Enter the value at x=0.6, y=0.3.',
                qDE: 'Gemeinsame Dichte f(x,y) = 2 für 0 ≤ y ≤ x ≤ 1. Randdichte f_X(x) = 2x. Was ist f_{Y|X}(y|x) bei x=0,6, y=0,3? Gib als Dezimalzahl ein.',
                answer: 1.667, tolerance: 0.005, unit: '',
                hintEn: 'f_{Y|X}(y|x) = 2 / 2x = 1/x.',
                hintDE: 'f_{Y|X}(y|x) = 2 / 2x = 1/x.'
            },

           // -- 3


            // ── 4. BEDINGTER ERWARTUNGSWERT DISKRET ───────────────────────────────────────

            {
                q: 'Joint density: p(1,1)=0.3, p(1,2)=0.2, p(2,1)=0.1, p(2,2)=0.4. What is E[Y|X=2]? Enter as a decimal.',
                qDE: 'Gemeinsame Zähldichte: p(1,1)=0,3, p(1,2)=0,2, p(2,1)=0,1, p(2,2)=0,4. Was ist ist E[Y|X=2]? Gib als Dezimalzahl ein.',
                answer: 1.8, tolerance: 0.001, unit: '',
                hintEn: 'p_X(2)=0.5. P(Y=1|X=2)=0.1/0.5=0.2, P(Y=2|X=2)=0.4/0.5=0.8.',
                hintDE: 'p_X(2)=0,5. P(Y=1|X=2)=0,1/0,5=0,2, P(Y=2|X=2)=0,4/0,5=0,8.'
            },
            {
                q: 'Joint density: p(0,0)=0.1, p(0,1)=0.4, p(1,0)=0.3, p(1,1)=0.2. What is E[Y|X=0]? Enter as a decimal.',
                qDE: 'Gemeinsame Zähldichte: p(0,0)=0,1, p(0,1)=0,4, p(1,0)=0,3, p(1,1)=0,2. Was ist E[Y|X=0]? Gib als Dezimalzahl ein.',
                answer: 0.8, tolerance: 0.001, unit: '',
                hintEn: 'p_X(0)=0.5. P(Y=0|X=0)=0.2',
                hintDE: 'p_X(0)=0,5. P(Y=0|X=0)=0,2'
            },
            {
                q: 'Joint density: p(1,2)=0.25, p(1,4)=0.25, p(2,2)=0.25, p(2,4)=0.25. What is E[Y|X=1]? Enter as a whole number.',
                qDE: 'Gemeinsame Zähldichte: p(1,2)=0,25, p(1,4)=0,25, p(2,2)=0,25, p(2,4)=0,25. Was ist E[Y|X=1]? Gib eine ganze Zahl ein.',
                answer: 3, tolerance: 0, unit: '',
                hintEn: 'p_X(1)=0.5. P(Y=2|X=1)=0.5, P(Y=4|X=1)=0.5',
                hintDE: 'p_X(1)=0,5. P(Y=2|X=1)=0,5, P(Y=4|X=1)=0,5'
            },

            // ── 5. BEDINGTER ERWARTUNGSWERT STETIG ────────────────────────────────────────

            {
                q: 'Joint density f(x,y) = 2 for 0 ≤ y ≤ x ≤ 1. Conditional density: f_{Y|X}(y|x) = 1/x for y ∈ [0,x]. What is E[Y|X=x]? Enter the formula evaluated at x=0.6.',
                qDE: 'Gemeinsame Dichte f(x,y) = 2 für 0 ≤ y ≤ x ≤ 1. Bedingte Dichte: f_{Y|X}(y|x) = 1/x. Was ist E[Y|X=x] ausgewertet bei x=0,6? Gib als Dezimalzahl ein.',
                answer: 0.3, tolerance: 0.001, unit: '',
                hintEn: 'E[Y|X=x] = x/2',
                hintDE: 'E[Y|X=x] = x/2'
            },

            // ── 6. BOX-MULLER-METHODE ─────────────────────────────────────────────────────

            {
                q: 'The Box-Muller transform takes U₁, U₂ ~ U[0,1] and produces Z₁ = √(−2·ln U₁)·cos(2πU₂). What distribution does Z₁ follow?  Enter 1 for N(0,1), 2 for Uniform[0,1], 3 for Exp(1).',
                qDE: 'Die Box-Muller-Methode nimmt U₁, U₂ ~ U[0,1] und erzeugt Z₁ = √(−2·ln U₁)·cos(2πU₂). Welche Verteilung hat Z₁? Gib 1 für N(0,1), 2 für Gleichverteilt, 3 für Exp(1) ein.',
                answer: 1, tolerance: 0, unit: '',
                hintEn: 'The Box-Muller transform produces standard normal N(0,1) random variables.',
                hintDE: 'Die Box-Muller-Methode erzeugt standardnormalverteilte N(0,1) Zufallszahlen.'
            },


            // ── 7. ERWARTUNGSWERTVEKTOR ───────────────────────────────────────────────────

            {
                q: 'Random vector (X, Y) has E[X]=3 and E[Y]=7. What is the second component of the mean vector μ = (E[X], E[Y])? Enter as a whole number.',
                qDE: 'Zufallsvektor (X, Y) hat E[X]=3 und E[Y]=7. Was ist die zweite Komponente des Erwartungswertvektors μ=(E[X], E[Y])? Gib eine ganze Zahl ein.',
                answer: 7, tolerance: 0, unit: '',
                hintEn: 'The mean vector is μ = (3, 7)',
                hintDE: 'Der Erwartungswertvektor ist μ = (3, 7)'
            },
            {
                q: 'X has density P(X=2)=0.5, P(X=4)=0.5 and Y has density P(Y=1)=0.3, P(Y=3)=0.7. What is E[X]+E[Y]? Enter as a decimal.',
                qDE: 'X hat P(X=2)=0,5, P(X=4)=0,5 und Y hat P(Y=1)=0,3, P(Y=3)=0,7. Was ist E[X]+E[Y]? Gib als Dezimalzahl ein.',
                answer: 5.4, tolerance: 0.001, unit: '',
                hintEn: 'E[X]=2·0.5+4·0.5=3. E[Y]=1·0.3+3·0.7=2.4',
                hintDE: 'E[X]=3. E[Y]=0,3+2,1=2,4'
            },
            {
                q: 'Random vector (X, Y, Z) has E[X]=1, E[Y]=2, E[Z]=3. What is E[2X − Y + 3Z]? Enter as a whole number.',
                qDE: 'Zufallsvektor (X, Y, Z) hat E[X]=1, E[Y]=2, E[Z]=3. Was ist E[2X − Y + 3Z]? Gib eine ganze Zahl ein.',
                answer: 9, tolerance: 0, unit: '',
                hintEn: 'Linearity',
                hintDE: 'Linearität'
            },

            // ── 8. KOVARIANZ ──────────────────────────────────────────────────────────────

            {
                q: 'E[XY]=10, E[X]=2, E[Y]=3. What is Cov(X,Y)? Enter as a whole number.',
                qDE: 'E[XY]=10, E[X]=2, E[Y]=3. Was ist Cov(X,Y)? Gib eine ganze Zahl ein.',
                answer: 4, tolerance: 0, unit: '',
                hintEn: 'Cov(X,Y) = E[XY] − E[X]·E[Y]',
                hintDE: 'Cov(X,Y) = E[XY] − E[X]·E[Y]'
            },
            {
                q: 'Joint density: p(1,1)=0.5, p(2,2)=0.5. E[X]=1.5, E[Y]=1.5. What is Cov(X,Y)? Enter as a decimal.',
                qDE: 'Gemeinsame Zähldichte: p(1,1)=0,5, p(2,2)=0,5. E[X]=1,5, E[Y]=1,5. Was ist Cov(X,Y)? Gib als Dezimalzahl ein.',
                answer: 0.25, tolerance: 0.001, unit: '',
                hintEn: 'E[XY]=2.5',
                hintDE: 'E[XY]=2,5'
            },
            {
                q: 'X and Y are independent. What is Cov(X,Y)? Enter as a whole number.',
                qDE: 'X und Y sind unabhängig. Was ist Cov(X,Y)? Gib eine ganze Zahl ein.',
                answer: 0, tolerance: 0, unit: '',
                hintEn: 'Independence...',
                hintDE: 'Unabhängigkeit...'
            },

            // ── 9. KOVARIANZMATRIX ────────────────────────────────────────────────────────

            {
                q: 'Var(X)=4, Var(Y)=9, Cov(X,Y)=3. What is the entry Σ₁₂ (off-diagonal) of the covariance matrix Σ? Enter as a whole number.',
                qDE: 'Var(X)=4, Var(Y)=9, Cov(X,Y)=3. Was ist der Eintrag Σ₁₂ (Nebendiagonale) der Kovarianzmatrix Σ? Gib eine ganze Zahl ein.',
                answer: 3, tolerance: 0, unit: '',
                hintEn: 'The covariance matrix is Σ = [[4, 3], [3, 9]].',
                hintDE: 'Die Kovarianzmatrix ist Σ = [[4, 3], [3, 9]].'
            },
            {
                q: 'For a random vector (X,Y), the covariance matrix Σ is always symmetric. What is Σ₂₁ if Σ₁₂ = Cov(X,Y) = 5? Enter as a whole number.',
                qDE: 'Für einen Zufallsvektor (X,Y) ist die Kovarianzmatrix Σ immer symmetrisch. Was ist Σ₂₁, wenn Σ₁₂ = Cov(X,Y) = 5? Gib eine ganze Zahl ein.',
                answer: 5, tolerance: 0, unit: '',
                hintEn: 'Symmetry',
                hintDE: 'Symmetrie'
            },
            {
                q: 'Var(X)=9, Var(Y)=4, Cov(X,Y)=0. What is the determinant of the covariance matrix Σ? Enter as a whole number.',
                qDE: 'Var(X)=9, Var(Y)=4, Cov(X,Y)=0. Was ist die Determinante der Kovarianzmatrix Σ? Gib eine ganze Zahl ein.',
                answer: 36, tolerance: 0, unit: '',
                hintEn: 'det([[9,0],[0,4]])',
                hintDE: 'det([[9,0],[0,4]])'
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
                hintEn: 'Cov(X,Y) = E[XY] − E[X]·E[Y] = 6 − 3·2 = 6 − 6 = 0',
                hintDE: 'Cov(X,Y) = 6 − 3·2 = 0'
            },
            {
                q: 'X and Y are uncorrelated with Var(X)=4, Var(Y)=9. What is Var(X+Y)? Enter as a whole number.',
                qDE: 'X und Y sind unkorreliert mit Var(X)=4, Var(Y)=9. Was ist Var(X+Y)? Gib eine ganze Zahl ein.',
                answer: 13, tolerance: 0, unit: '',
                hintEn: 'Var(X+Y) = Var(X) + Var(Y) + 2·Cov(X,Y)',
                hintDE: 'Var(X+Y) = Var(X) + Var(Y) + 2·Cov(X,Y)'
            },

            // ── 11. KORRELATION ───────────────────────────────────────────────────────────

            {
                q: 'Cov(X,Y)=6, Var(X)=9, Var(Y)=16. What is the correlation coefficient ρ(X,Y)? Enter as a decimal.',
                qDE: 'Cov(X,Y)=6, Var(X)=9, Var(Y)=16. Was ist der Korrelationskoeffizient ρ(X,Y)? Gib als Dezimalzahl ein.',
                answer: 0.5, tolerance: 0.001, unit: '',
                hintEn: 'ρ = Cov(X,Y) / (σ_X · σ_Y)',
                hintDE: 'ρ = Cov(X,Y) / (σ_X · σ_Y)'
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
                qDE: 'Cov(X,Y)=4, σ_X=2, σ_Y=4. Was ist ρ(X,Y)? Gib als Dezimalzahl ein.',
                answer: 0.5, tolerance: 0.001, unit: '',
                hintEn: 'ρ = 4 / (2·4)',
                hintDE: 'ρ = 4 / (2·4)'
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
                q: 'Cov(2X+1, Y) = 2·Cov(X,Y). If Cov(X,Y)=3, what is Cov(2X+1, Y)? Enter as a whole number.',
                qDE: 'Cov(2X+1, Y) = 2·Cov(X,Y). Wenn Cov(X,Y)=3, was ist dann Cov(2X+1, Y)? Gib eine ganze Zahl ein.',
                answer: 6, tolerance: 0, unit: '',
                hintEn: 'Cov(aX+b, Y) = a·Cov(X,Y)',
                hintDE: 'Cov(aX+b, Y) = a·Cov(X,Y)'
            },
            {
                q: 'If Var(X)=4 and Var(Y)=9, what is the maximum possible value of |Cov(X,Y)|? Enter as a whole number.',
                qDE: 'Wenn Var(X)=4 und Var(Y)=9, was ist der maximale Wert von |Cov(X,Y)|? Gib eine ganze Zahl ein.',
                answer: 6, tolerance: 0, unit: '',
                hintEn: '|Cov(X,Y)| ≤ √(Var(X)·Var(Y)) by Cauchy-Schwarz',
                hintDE: '|Cov(X,Y)| ≤ √(Var(X)·Var(Y)) nach Cauchy-Schwarz '
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
                qDE: '(X,Y) ~ bivariat normalverteilt mit μ_X=2, μ_Y=3, σ_X=1, σ_Y=2, ρ=0,5. Was ist Cov(X,Y)? Gib eine ganze Zahl ein.',
                answer: 1, tolerance: 0, unit: '',
                hintEn: 'Cov(X,Y) = ρ·σ_X·σ_Y = 0.5·1·2 = 1.',
                hintDE: 'Cov(X,Y) = ρ·σ_X·σ_Y = 0,5·1·2 = 1.'
            },
            {
                q: '(X,Y) ~ bivariate normal. The marginal distribution of X is also normal. If μ_X=5 and σ²_X=4, what is P(X ≤ 5)? Enter as a decimal.',
                qDE: '(X,Y) ~ bivariat normalverteilt. Die Randverteilung von X ist ebenfalls normal. Wenn μ_X=5 und σ²_X=4, was ist P(X ≤ 5)? Gib als Dezimalzahl ein.',
                answer: 0.5, tolerance: 0.001, unit: '',
                hintEn: 'P(X ≤ μ_X) = 0.5 by symmetry of the normal distribution.',
                hintDE: 'P(X ≤ μ_X) = 0,5 wegen der Symmetrie der Normalverteilung.'
            },

    ],

    //TODO: continue

    // ── WORLD 7 — Convergence & Limit Theorems ────────────────────────────────
    // Topics: Arithmetisches Mittel, Schwaches GGZ, Tschebyscheff-Ungleichung,
    //         Stochastische Konvergenz, Starkes GGZ, Hauptsatz der Statistik,
    //         Fast sichere Konvergenz, Zentraler Grenzwertsatz


    7: [

        // ── 1. ARITHMETISCHES MITTEL ─────────────────────────────────────────────

        {
            q: 'You observe x₁=2, x₂=5, x₃=8, x₄=1, x₅=4. What is the sample mean X̄?',
            qDE: 'Sie beobachten x₁=2, x₂=5, x₃=8, x₄=1, x₅=4. Was ist das arithmetische Mittel X̄?',
            answer: 4, tolerance: 0.001, unit: '',
            hintEn: 'Add all values and divide by the number of observations.',
            hintDE: 'Addiere alle Werte und teile durch die Anzahl der Beobachtungen.'
        },
        {
            q: 'X₁, …, Xₙ are i.i.d. with E[Xᵢ] = 7. What is E[X̄ₙ]?',
            qDE: 'X₁, …, Xₙ sind i.i.d. mit E[Xᵢ] = 7. Was ist E[X̄ₙ]?',
            answer: 7, tolerance: 0.001, unit: '',
            hintEn: 'The expected value of the sample mean equals the expected value of each individual variable.',
            hintDE: 'Der Erwartungswert des Stichprobenmittelwerts entspricht dem Erwartungswert jeder einzelnen Variable.'
        },
        {
            q: 'X₁, …, X₂₅ are i.i.d. with Var(Xᵢ) = 100. What is Var(X̄₂₅)?',
            qDE: 'X₁, …, X₂₅ sind i.i.d. mit Var(Xᵢ) = 100. Was ist Var(X̄₂₅)?',
            answer: 4, tolerance: 0.001, unit: '',
            hintEn: 'The variance of the sample mean is σ² divided by n.',
            hintDE: 'Die Varianz des Stichprobenmittelwerts ist σ² geteilt durch n.'
        },
        {
            q: 'X₁, …, X₄ are i.i.d. with Var(Xᵢ) = 16. What is the standard deviation of X̄₄?',
            qDE: 'X₁, …, X₄ sind i.i.d. mit Var(Xᵢ) = 16. Was ist die Standardabweichung von X̄₄?',
            answer: 2, tolerance: 0.001, unit: '',
            hintEn: 'First compute Var(X̄ₙ) = σ²/n, then take the square root.',
            hintDE: 'Berechne zunächst Var(X̄ₙ) = σ²/n und ziehe dann die Wurzel.'
        },

        // ── 2. TSCHEBYSCHEFF-UNGLEICHUNG ─────────────────────────────────────────

        {
            q: 'X has E[X]=10 and Var(X)=9. Use Chebyshev to find an upper bound for P(|X−10| ≥ 3). Enter as a decimal.',
            qDE: 'X hat E[X]=10 und Var(X)=9. Was ist die Tschebyscheff-Schranke für P(|X−10| ≥ 3)? Gib als Dezimalzahl ein.',
            answer: 1, tolerance: 0.001, unit: '',
            hintEn: 'The Chebyshev bound is Var(X) / ε².',
            hintDE: 'Die Tschebyscheff-Schranke ist Var(X) / ε².'
        },
        {
            q: 'X has E[X]=0 and Var(X)=4. Use Chebyshev to find an upper bound for P(|X| ≥ 4). Enter as a decimal.',
            qDE: 'X hat E[X]=0 und Var(X)=4. Was ist die Tschebyscheff-Schranke für P(|X| ≥ 4)? Gib als Dezimalzahl ein.',
            answer: 0.25, tolerance: 0.001, unit: '',
            hintEn: 'The Chebyshev bound is Var(X) / ε².',
            hintDE: 'Die Tschebyscheff-Schranke ist Var(X) / ε².'
        },
        {
            q: 'X̄ₙ is the mean of n=100 i.i.d. variables with σ²=25 and μ=50. Use Chebyshev to bound P(|X̄ₙ−50| ≥ 1). Enter as a decimal.',
            qDE: 'X̄ₙ ist der Mittelwert von n=100 i.i.d. Variablen mit σ²=25 und μ=50. Was ist die Tschebyscheff-Schranke für P(|X̄ₙ−50| ≥ 1)? Gib als Dezimalzahl ein.',
            answer: 0.25, tolerance: 0.001, unit: '',
            hintEn: 'First find Var(X̄ₙ) = σ²/n, then apply the Chebyshev bound.',
            hintDE: 'Bestimme zunächst Var(X̄ₙ) = σ²/n und wende dann die Tschebyscheff-Ungleichung an.'
        },
        {
            q: 'Var(X) = 16. What is the Chebyshev upper bound for P(|X − μ| ≥ 2)? Enter as a decimal.',
            qDE: 'Var(X) = 16. Was ist die Tschebyscheff-Schranke für P(|X − μ| ≥ 2)? Gib als Dezimalzahl ein.',
            answer: 4, tolerance: 0.001, unit: '',
            hintEn: 'The Chebyshev bound is Var(X) / ε².',
            hintDE: 'Die Tschebyscheff-Schranke ist Var(X) / ε².'
        },

        // ── 3. SCHWACHES GESETZ DER GROSSEN ZAHLEN ───────────────────────────────

        {
            q: 'X₁, …, Xₙ are i.i.d. with E[Xᵢ]=3 and Var(Xᵢ)=9. The weak law guarantees X̄ₙ converges in probability to which value?',
            qDE: 'X₁, …, Xₙ sind i.i.d. mit E[Xᵢ]=3 und Var(Xᵢ)=9. Das schwache Gesetz garantiert, dass X̄ₙ stochastisch gegen welchen Wert konvergiert?',
            answer: 3, tolerance: 0.001, unit: '',
            hintEn: 'The sample mean converges to the true expected value of each variable.',
            hintDE: 'Der Stichprobenmittelwert konvergiert gegen den wahren Erwartungswert jeder Variable.'
        },
        {
            q: 'By the weak law, P(|X̄ₙ − μ| ≥ ε) approaches which value as n → ∞?',
            qDE: 'Nach dem schwachen Gesetz: Gegen welchen Wert strebt P(|X̄ₙ − μ| ≥ ε) für n → ∞?',
            answer: 0, tolerance: 0.001, unit: '',
            hintEn: 'This is what convergence in probability to μ means.',
            hintDE: 'Das ist genau die Bedeutung der stochastischen Konvergenz gegen μ.'
        },
        {
            q: 'For σ²=1, ε=0.1, n=100: what is the Chebyshev bound on P(|X̄ₙ − μ| ≥ ε)?',
            qDE: 'Für σ²=1, ε=0,1, n=100: Was ist die Tschebyscheff-Schranke für P(|X̄ₙ − μ| ≥ ε)?',
            answer: 1, tolerance: 0.001, unit: '',
            hintEn: 'Plug the values directly into σ²/(n·ε²).',
            hintDE: 'Setze die Werte direkt in σ²/(n·ε²) ein.'
        },

        // ── 4. STOCHASTISCHE KONVERGENZ ──────────────────────────────────────────

        {
            q: 'Does almost sure convergence imply convergence in probability? Enter 1 for yes, 0 for no.',
            qDE: 'Impliziert fast sichere Konvergenz die stochastische Konvergenz? Gib 1 für ja, 0 für nein ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Think about which convergence type is the stronger one.',
            hintDE: 'Überlege, welche Konvergenzart die stärkere ist.'
        },
        {
            q: 'Does convergence in probability imply almost sure convergence? Enter 1 for yes, 0 for no.',
            qDE: 'Impliziert stochastische Konvergenz fast sichere Konvergenz? Gib 1 für ja, 0 für nein ein.',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'Think about which convergence type is the stronger one.',
            hintDE: 'Überlege, welche Konvergenzart die stärkere ist.'
        },
        {
            q: 'Xₙ converges in probability to c means P(|Xₙ − c| ≥ ε) → ? for all ε > 0. Enter the limit.',
            qDE: 'Xₙ konvergiert stochastisch gegen c bedeutet P(|Xₙ − c| ≥ ε) → ? für alle ε > 0. Gib den Grenzwert ein.',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'This is the definition — the probability of any deviation vanishes.',
            hintDE: 'Das ist die Definition — die Wahrscheinlichkeit jeder Abweichung verschwindet.'
        },

        // ── 5. STARKES GESETZ DER GROSSEN ZAHLEN ────────────────────────────────

        {
            q: 'The strong law of large numbers guarantees X̄ₙ → μ with probability equal to?',
            qDE: 'Das starke Gesetz der großen Zahlen garantiert X̄ₙ → μ mit welcher Wahrscheinlichkeit?',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'The strong law guarantees almost sure convergence.',
            hintDE: 'Das starke Gesetz garantiert fast sichere Konvergenz.'
        },
        {
            q: 'Which convergence type is stronger: convergence in probability (enter 1) or almost sure convergence (enter 2)?',
            qDE: 'Welche Konvergenzart ist stärker: stochastische Konvergenz (gib 1 ein) oder fast sichere Konvergenz (gib 2 ein)?',
            answer: 2, tolerance: 0, unit: '',
            hintEn: 'One of the two implies the other, but not vice versa.',
            hintDE: 'Eine der beiden impliziert die andere, aber nicht umgekehrt.'
        },
        {
            q: 'You simulate X̄ₙ for i.i.d. Ber(0.4) variables. As n → ∞, X̄ₙ converges almost surely to which value?',
            qDE: 'Sie simulieren X̄ₙ für i.i.d. Ber(0,4)-Variablen. Für n → ∞ konvergiert X̄ₙ fast sicher gegen welchen Wert?',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'The sample mean converges to the true mean of the distribution.',
            hintDE: 'Der Stichprobenmittelwert konvergiert gegen den wahren Erwartungswert der Verteilung.'
        },

        // ── 6. HAUPTSATZ DER STATISTIK (GLIVENKO–CANTELLI) ──────────────────────

        {
            q: 'You draw n=5 i.i.d. observations: 1, 3, 3, 5, 8. What is the empirical CDF value F̂₅(3)?',
            qDE: 'Sie ziehen n=5 i.i.d. Beobachtungen: 1, 3, 3, 5, 8. Was ist der Wert der empirischen Verteilungsfunktion F̂₅(3)?',
            answer: 0.6, tolerance: 0.001, unit: '',
            hintEn: 'Count how many observations are ≤ 3, then divide by n.',
            hintDE: 'Zähle die Beobachtungen, die ≤ 3 sind, und teile durch n.'
        },
        {
            q: 'You draw n=4 i.i.d. observations: 2, 5, 7, 9. What is F̂₄(5)?',
            qDE: 'Sie ziehen n=4 i.i.d. Beobachtungen: 2, 5, 7, 9. Was ist F̂₄(5)?',
            answer: 0.5, tolerance: 0.001, unit: '',
            hintEn: 'Count how many observations are ≤ 5, then divide by n.',
            hintDE: 'Zähle die Beobachtungen, die ≤ 5 sind, und teile durch n.'
        },
        {
            q: 'The Glivenko–Cantelli theorem states sup_x |F̂ₙ(x) − F(x)| → ? almost surely. Enter the limit.',
            qDE: 'Der Satz von Glivenko–Cantelli besagt sup_x |F̂ₙ(x) − F(x)| → ? fast sicher. Gib den Grenzwert ein.',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'The empirical CDF gets arbitrarily close to the true CDF everywhere.',
            hintDE: 'Die empirische Verteilungsfunktion nähert sich überall beliebig nah an die wahre an.'
        },

        // ── 7. FAST SICHERE KONVERGENZ ───────────────────────────────────────────

        {
            q: 'Xₙ converges almost surely to X means P(lim_{n→∞} Xₙ = X) = ? Enter the value.',
            qDE: 'Xₙ konvergiert fast sicher gegen X bedeutet P(lim_{n→∞} Xₙ = X) = ? Gib den Wert ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Almost sure means the convergence event has probability one.',
            hintDE: 'Fast sicher bedeutet, dass das Konvergenzereignis Wahrscheinlichkeit eins hat.'
        },
        {
            q: 'Xₙ = 1/n for all outcomes ω. Does Xₙ converge almost surely? If yes enter the limit, if no enter −1.',
            qDE: 'Xₙ = 1/n für alle Ergebnisse ω. Konvergiert Xₙ fast sicher? Falls ja, gib den Grenzwert ein; falls nein, gib −1 ein.',
            answer: 0, tolerance: 0.001, unit: '',
            hintEn: 'Ask yourself what 1/n approaches as n grows, for any fixed outcome.',
            hintDE: 'Überlege, gegen was 1/n strebt, wenn n wächst, für ein beliebiges festes Ergebnis.'
        },
        {
            q: 'If Xₙ converges almost surely to 5, what does P(|Xₙ − 5| ≥ ε) converge to for any ε > 0?',
            qDE: 'Wenn Xₙ fast sicher gegen 5 konvergiert, gegen was strebt P(|Xₙ − 5| ≥ ε) für beliebiges ε > 0?',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'Almost sure convergence is stronger than convergence in probability.',
            hintDE: 'Fast sichere Konvergenz ist stärker als stochastische Konvergenz.'
        },

        // ── 8. ZENTRALER GRENZWERTSATZ ───────────────────────────────────────────

        {
            q: 'X₁, …, X₃₆ are i.i.d. with μ=10 and σ²=9. By the CLT, X̄₃₆ is approximately normal. What is Var(X̄₃₆)?',
            qDE: 'X₁, …, X₃₆ sind i.i.d. mit μ=10 und σ²=9. Nach dem ZGS ist X̄₃₆ näherungsweise normalverteilt. Was ist Var(X̄₃₆)?',
            answer: 0.25, tolerance: 0.001, unit: '',
            hintEn: 'Var(X̄ₙ) = σ²/n.',
            hintDE: 'Var(X̄ₙ) = σ²/n.'
        },
        {
            q: 'X₁,…,Xₙ i.i.d. with μ=5, σ²=16, n=64. The standardised mean Zₙ = (X̄ₙ − μ)/(σ/√n) follows approximately which distribution? Enter 1 for N(0,1), 2 for N(μ,σ²), 3 for Exp(1).',
            qDE: 'X₁,…,Xₙ i.i.d. mit μ=5, σ²=16, n=64. Die standardisierte Größe Zₙ = (X̄ₙ − μ)/(σ/√n) folgt näherungsweise welcher Verteilung? Gib 1 für N(0,1), 2 für N(μ,σ²), 3 für Exp(1) ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Standardising a sum of i.i.d. variables always leads to the same limit distribution.',
            hintDE: 'Die Standardisierung einer Summe i.i.d. Variablen führt stets zur selben Grenzverteilung.'
        },
        {
            q: 'X₁, …, X₁₀₀ are i.i.d. Ber(0.3). The Central Limit Theorem approximates X̄₁₀₀ as normal with variance σ²/n. What is σ²/n here? Enter as a decimal.',
            qDE: 'X₁, …, X₁₀₀ sind i.i.d. Ber(0,3). Der zentrale Grenzwertsatz nähert X̄₁₀₀ durch eine Normalverteilung mit Varianz σ²/n an. Was ist σ²/n? Gib als Dezimalzahl ein.',
            answer: 0.0021, tolerance: 0.0001, unit: '',
            hintEn: 'For a Bernoulli(p) variable, σ² = p·(1−p).',
            hintDE: 'Für eine Bernoulli(p)-Variable gilt σ² = p·(1−p).'
        },
        {
            q: 'X₁,…,X₄₉ are i.i.d. with μ=0 and σ=7. What is the standard deviation of X̄₄₉?',
            qDE: 'X₁,…,X₄₉ sind i.i.d. mit μ=0 und σ=7. Was ist die Standardabweichung von X̄₄₉?',
            answer: 1, tolerance: 0.001, unit: '',
            hintEn: 'SD(X̄ₙ) = σ/√n.',
            hintDE: 'SD(X̄ₙ) = σ/√n.'
        },

    ],

    8: [

        // ── 1. ALLGEMEINE IDEE DER SCHLIEßENDEN STATISTIK ────────────────────────

        {
            q: 'In inferential statistics, we observe a sample to draw conclusions about a larger group. This larger group is called the __. Enter 1 for population, 2 for sample, 3 for estimator.',
            qDE: 'In der schließenden Statistik beobachten wir eine Stichprobe, um Rückschlüsse auf eine größere Gruppe zu ziehen. Diese größere Gruppe heißt __. Gib 1 für Grundgesamtheit, 2 für Stichprobe, 3 für Schätzer ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Think about what we are ultimately trying to learn about — it is not what we directly measure.',
            hintDE: 'Überlege, worüber wir letztlich etwas herausfinden wollen — es ist nicht das, was wir direkt messen.'
        },
        {
            q: 'The four core tasks of inferential statistics are: modelling, estimation, testing, and model validation. Which task asks "Does our assumed model fit the data at all?" Enter 1 for modelling, 2 for estimation, 3 for testing, 4 for model validation.',
            qDE: 'Die vier Kernaufgaben der schließenden Statistik sind: Modellierung, Schätzen, Testen und Modellvalidierung. Welche Aufgabe fragt "Passt unser angenommenes Modell überhaupt zu den Daten?" Gib 1 für Modellierung, 2 für Schätzen, 3 für Testen, 4 für Modellvalidierung ein.',
            answer: 4, tolerance: 0, unit: '',
            hintEn: 'This task comes after we have already fit a model and checks whether the whole approach was reasonable.',
            hintDE: 'Diese Aufgabe kommt, nachdem wir ein Modell angepasst haben, und prüft, ob der gesamte Ansatz sinnvoll war.'
        },
        {
            q: 'We want to know whether a new drug lowers blood pressure. We measure 50 patients and compute a test result. Which core task are we performing? Enter 1 for modelling, 2 for estimation, 3 for testing, 4 for model validation.',
            qDE: 'Wir wollen wissen, ob ein neues Medikament den Blutdruck senkt. Wir messen 50 Patienten und berechnen ein Testergebnis. Welche Kernaufgabe führen wir durch? Gib 1 für Modellierung, 2 für Schätzen, 3 für Testen, 4 für Modellvalidierung ein.',
            answer: 3, tolerance: 0, unit: '',
            hintEn: 'We are making a yes/no decision about a claim — that is different from just computing a numerical value for an unknown quantity.',
            hintDE: 'Wir treffen eine Ja/Nein-Entscheidung über eine Behauptung — das ist etwas anderes, als nur einen numerischen Wert für eine unbekannte Größe zu berechnen.'
        },
        {
            q: 'We observe data and want to find the most plausible value for an unknown quantity, such as the average height in a country. Which core task is this? Enter 1 for modelling, 2 for estimation, 3 for testing, 4 for model validation.',
            qDE: 'Wir beobachten Daten und wollen den plausibelsten Wert für eine unbekannte Größe finden, z.B. die durchschnittliche Körpergröße in einem Land. Welche Kernaufgabe ist das? Gib 1 für Modellierung, 2 für Schätzen, 3 für Testen, 4 für Modellvalidierung ein.',
            answer: 2, tolerance: 0, unit: '',
            hintEn: 'We are producing a concrete numerical guess for something we cannot observe directly.',
            hintDE: 'Wir erzeugen eine konkrete numerische Vermutung für etwas, das wir nicht direkt beobachten können.'
        },

        // ── 2. STICHPROBENUMFANG UND STICHPROBENRAUM ─────────────────────────────

        {
            q: 'We draw 30 people from a population and record their age. What is the sample size? Enter the number.',
            qDE: 'Wir ziehen 30 Personen aus einer Grundgesamtheit und erfassen ihr Alter. Was ist der Stichprobenumfang? Gib die Zahl ein.',
            answer: 30, tolerance: 0, unit: '',
            hintEn: 'The sample size is simply the count of individual observations we collected.',
            hintDE: 'Der Stichprobenumfang ist einfach die Anzahl der einzelnen Beobachtungen, die wir erhoben haben.'
        },

        {
            q: 'The sample space of a statistical model is the set of all possible values a single observation can take. A person is asked how many siblings they have; this value can be 0, 1, 2, 3, … Is the sample space here discrete or continuous? Enter 1 for discrete, 2 for continuous.',
            qDE: 'Der Stichprobenraum eines statistischen Modells ist die Menge aller möglichen Werte, die eine einzelne Beobachtung annehmen kann. Eine Person wird gefragt, wie viele Geschwister sie hat; dieser Wert kann 0, 1, 2, 3, … sein. Ist der Stichprobenraum hier diskret oder stetig? Gib 1 für diskret, 2 für stetig ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Ask yourself: can the observation only take whole-number values, or can it take any value in an interval?',
            hintDE: 'Frage dich: Kann die Beobachtung nur ganze Zahlen annehmen, oder jeden Wert in einem Intervall?'
        },
        {
            q: 'We measure the exact weight of a randomly chosen apple. Is the sample space here discrete or continuous? Enter 1 for discrete, 2 for continuous.',
            qDE: 'Wir messen das genaue Gewicht eines zufällig gewählten Apfels. Ist der Stichprobenraum hier diskret oder stetig? Gib 1 für diskret, 2 für stetig ein.',
            answer: 2, tolerance: 0, unit: '',
            hintEn: 'Weight can take any value within a range, not just isolated whole numbers.',
            hintDE: 'Gewicht kann jeden Wert in einem Bereich annehmen, nicht nur einzelne ganze Zahlen.'
        },

        // ── 3. PARAMETRISCHES VERTEILUNGSMODELL UND PARAMETERRAUM ────────────────

        {
            q: 'In a parametric model, we assume the data follows a specific family of distributions that is described by one or more unknown values. These unknown values are called __. Enter 1 for parameters, 2 for estimators, 3 for observations.',
            qDE: 'In einem parametrischen Modell nehmen wir an, dass die Daten einer bestimmten Verteilungsfamilie folgen, die durch einen oder mehrere unbekannte Werte beschrieben wird. Diese unbekannten Werte heißen __. Gib 1 für Parameter, 2 für Schätzer, 3 für Beobachtungen ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'These are the fixed but unknown quantities that completely determine which distribution from the family we are dealing with.',
            hintDE: 'Das sind die festen, aber unbekannten Größen, die vollständig bestimmen, mit welcher Verteilung aus der Familie wir es zu tun haben.'
        },
        {
            q: 'We model the number of defective items in a production line using a Binomial distribution. The Binomial family is described by n (known) and p (unknown). The parameter space for p is the interval [0, 1]. Is p = 1.3 a valid value in this parameter space? Enter 1 for yes, 0 for no.',
            qDE: 'Wir modellieren die Anzahl defekter Teile an einer Produktionslinie mit einer Binomialverteilung. Die Binomialfamilie wird durch n (bekannt) und p (unbekannt) beschrieben. Der Parameterraum für p ist das Intervall [0, 1]. Ist p = 1,3 ein gültiger Wert in diesem Parameterraum? Gib 1 für ja, 0 für nein ein.',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'The parameter space defines all values the parameter is allowed to take — check whether 1.3 lies within [0, 1].',
            hintDE: 'Der Parameterraum legt alle zulässigen Werte des Parameters fest — prüfe, ob 1,3 im Intervall [0, 1] liegt.'
        },
        {
            q: 'We assume waiting times follow an Exponential distribution with unknown rate parameter λ. Since λ must be strictly positive, the parameter space is the set of all positive real numbers. Is λ = 0 a valid element of this parameter space? Enter 1 for yes, 0 for no.',
            qDE: 'Wir nehmen an, dass Wartezeiten einer Exponentialverteilung mit unbekanntem Ratenparameter λ folgen. Da λ strikt positiv sein muss, ist der Parameterraum die Menge aller positiven reellen Zahlen. Ist λ = 0 ein gültiges Element dieses Parameterraums? Gib 1 für ja, 0 für nein ein.',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'The parameter space only contains values that make the model well-defined — check whether 0 is strictly positive.',
            hintDE: 'Der Parameterraum enthält nur Werte, für die das Modell wohldefiniert ist — prüfe, ob 0 strikt positiv ist.'
        },
        {
            q: 'A parametric model for coin flips assumes each flip follows a Bernoulli distribution with unknown probability of heads p. Two researchers use the same model family but estimate different values of p from their data. How many parameters does this model have?',
            qDE: 'Ein parametrisches Modell für Münzwürfe nimmt an, dass jeder Wurf einer Bernoulli-Verteilung mit unbekannter Kopfwahrscheinlichkeit p folgt. Zwei Forscher verwenden dieselbe Modellfamilie, schätzen aber unterschiedliche Werte von p aus ihren Daten. Wie viele Parameter hat dieses Modell?',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Count how many unknown quantities fully describe which distribution from the Bernoulli family we are using.',
            hintDE: 'Zähle, wie viele unbekannte Größen vollständig beschreiben, welche Verteilung aus der Bernoulli-Familie wir verwenden.'
        },

        // ── 4. STATISTIK UND SCHÄTZER ─────────────────────────────────────────────

        {
            q: 'A statistic is a function that takes the observed data as input and produces a numerical output. It must NOT use any unknown parameters. We observe x₁=3, x₂=5, x₄=7. Is the sample mean (3+5+7)/3 a valid statistic? Enter 1 for yes, 0 for no.',
            qDE: 'Eine Statistik ist eine Funktion, die die beobachteten Daten als Eingabe nimmt und eine numerische Ausgabe produziert. Sie darf KEINE unbekannten Parameter verwenden. Wir beobachten x₁=3, x₂=5, x₃=7. Ist der Stichprobenmittelwert (3+5+7)/3 eine gültige Statistik? Gib 1 für ja, 0 für nein ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Check whether the formula only uses the data values themselves, without any unknown quantities.',
            hintDE: 'Prüfe, ob die Formel nur die Datenwerte selbst verwendet, ohne unbekannte Größen.'
        },
        {
            q: 'We observe data and compute a statistic to guess the value of an unknown parameter. When a statistic is used for this purpose it is called an __. Enter 1 for estimator, 2 for test statistic, 3 for parameter.',
            qDE: 'Wir beobachten Daten und berechnen eine Statistik, um den Wert eines unbekannten Parameters zu schätzen. Wenn eine Statistik für diesen Zweck verwendet wird, heißt sie __. Gib 1 für Schätzer, 2 für Teststatistik, 3 für Parameter ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'The name reflects that we are using data to make an educated guess about the true unknown value.',
            hintDE: 'Der Name spiegelt wider, dass wir Daten verwenden, um eine fundierte Vermutung über den wahren unbekannten Wert anzustellen.'
        },
        {
            q: 'An estimator is itself a random variable because it depends on the random sample. Before collecting data, the estimator can take many possible values. After collecting data and computing a specific number, this specific number is called the __. Enter 1 for estimate, 2 for parameter, 3 for population mean.',
            qDE: 'Ein Schätzer ist selbst eine Zufallsvariable, weil er von der zufälligen Stichprobe abhängt. Bevor Daten erhoben werden, kann der Schätzer viele mögliche Werte annehmen. Nachdem Daten erhoben und eine konkrete Zahl berechnet wurde, nennt man diese konkrete Zahl __. Gib 1 für Schätzwert, 2 für Parameter, 3 für Erwartungswert der Grundgesamtheit ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'There is a distinction between the rule for computing (which is random) and the specific number you get after inserting your data.',
            hintDE: 'Es gibt einen Unterschied zwischen der Berechnungsregel (die zufällig ist) und der konkreten Zahl, die man erhält, wenn man die Daten einsetzt.'
        },
        {
            q: 'A desirable property of an estimator is that its expected value equals the true parameter value. Such an estimator is called unbiased. If the expected value of an estimator equals the true parameter, is the estimator unbiased? Enter 1 for yes, 0 for no.',
            qDE: 'Eine wünschenswerte Eigenschaft eines Schätzers ist, dass sein Erwartungswert dem wahren Parameterwert entspricht. Ein solcher Schätzer heißt erwartungstreu. Wenn der Erwartungswert eines Schätzers dem wahren Parameter entspricht, ist der Schätzer erwartungstreu? Gib 1 für ja, 0 für nein ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'The definition of unbiasedness is exactly that the estimator is correct on average.',
            hintDE: 'Die Definition von Erwartungstreue ist genau, dass der Schätzer im Durchschnitt korrekt ist.'
        },

        // ── 5. EMPIRISCHE VERTEILUNGSFUNKTION ALS SCHÄTZER ───────────────────────

        {
            q: 'The empirical distribution function assigns to each value x the fraction of observations that are less than or equal to x. We observe: 2, 5, 5, 8. What is the value of the empirical distribution function at x = 5?',
            qDE: 'Die empirische Verteilungsfunktion weist jedem Wert x den Anteil der Beobachtungen zu, die kleiner oder gleich x sind. Wir beobachten: 2, 5, 5, 8. Was ist der Wert der empirischen Verteilungsfunktion bei x = 5?',
            answer: 0.75, tolerance: 0.001, unit: '',
            hintEn: 'Count how many of the four observations are at most 5, then divide by the total number of observations.',
            hintDE: 'Zähle, wie viele der vier Beobachtungen höchstens 5 sind, und teile durch die Gesamtanzahl der Beobachtungen.'
        },
        {
            q: 'We observe: 1, 3, 7, 9, 10. What is the value of the empirical distribution function at x = 3?',
            qDE: 'Wir beobachten: 1, 3, 7, 9, 10. Was ist der Wert der empirischen Verteilungsfunktion bei x = 3?',
            answer: 0.4, tolerance: 0.001, unit: '',
            hintEn: 'Count all observations that are less than or equal to 3 and divide by the total number.',
            hintDE: 'Zähle alle Beobachtungen, die kleiner oder gleich 3 sind, und teile durch die Gesamtanzahl.'
        },
        {
            q: 'We observe: 4, 6, 6, 8. What is the value of the empirical distribution function at x = 5?',
            qDE: 'Wir beobachten: 4, 6, 6, 8. Was ist der Wert der empirischen Verteilungsfunktion bei x = 5?',
            answer: 0.25, tolerance: 0.001, unit: '',
            hintEn: 'Check which observations are less than or equal to 5.',
            hintDE: 'Prüfe, welche Beobachtungen kleiner oder gleich 5 sind.'
        },
        {
            q: 'The empirical distribution function is used as an estimator for the true (unknown) distribution function. As the sample size grows, the empirical distribution function gets closer and closer to the true one. This result is known as the Glivenko-Cantelli theorem. Does a larger sample size generally lead to a better estimate? Enter 1 for yes, 0 for no.',
            qDE: 'Die empirische Verteilungsfunktion wird als Schätzer für die wahre (unbekannte) Verteilungsfunktion verwendet. Mit wachsendem Stichprobenumfang nähert sich die empirische Verteilungsfunktion immer mehr der wahren an. Führt ein größerer Stichprobenumfang im Allgemeinen zu einem besseren Schätzer? Gib 1 für ja, 0 für nein ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Think about what happens to the gap between the empirical and the true distribution function as we collect more and more data.',
            hintDE: 'Überlege, was mit der Lücke zwischen der empirischen und der wahren Verteilungsfunktion passiert, wenn wir immer mehr Daten sammeln.'
        },

        // ── 6. LIKELIHOOD-PRINZIP UND MAXIMUM-LIKELIHOOD-SCHÄTZER ────────────────

        {
            q: 'The likelihood of a parameter value θ given observed data is defined as the probability (or probability density) of observing that data assuming θ is the true value. If a higher likelihood means the data is more probable under that parameter value, do we prefer parameter values with higher or lower likelihood? Enter 1 for higher, 2 for lower.',
            qDE: 'Die Likelihood eines Parameterwertes θ gegeben beobachteten Daten ist definiert als die Wahrscheinlichkeit (oder Wahrscheinlichkeitsdichte), diese Daten zu beobachten, wenn θ der wahre Wert ist. Wenn eine höhere Likelihood bedeutet, dass die Daten unter diesem Parameterwert wahrscheinlicher sind, bevorzugen wir Parameterwerte mit höherer oder niedrigerer Likelihood? Gib 1 für höherer, 2 für niedrigerer ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'We want the parameter value that makes our observed data as probable as possible.',
            hintDE: 'Wir wollen den Parameterwert, der unsere beobachteten Daten so wahrscheinlich wie möglich macht.'
        },
        {
            q: 'The maximum likelihood estimator chooses the parameter value that maximises the likelihood function. Is the maximum likelihood estimator always the same as the sample mean? Enter 1 for yes, 0 for no.',
            qDE: 'Der Maximum-Likelihood-Schätzer wählt den Parameterwert, der die Likelihood-Funktion maximiert. Ist der Maximum-Likelihood-Schätzer immer gleich dem Stichprobenmittelwert? Gib 1 für ja, 0 für nein ein.',
            answer: 0, tolerance: 0, unit: '',
            hintEn: 'The maximum likelihood estimator depends on the assumed distribution family — for some families the answer changes.',
            hintDE: 'Der Maximum-Likelihood-Schätzer hängt von der angenommenen Verteilungsfamilie ab — für manche Familien ändert sich die Antwort.'
        },
        {
            q: 'We observe one coin flip and it comes up heads. We model this as Bernoulli with unknown probability p. The likelihood of observing heads is equal to p. Which value of p maximises this likelihood? Enter as a whole number.',
            qDE: 'Wir beobachten einen Münzwurf und er zeigt Kopf. Wir modellieren dies als Bernoulli mit unbekannter Wahrscheinlichkeit p. Die Likelihood, Kopf zu beobachten, ist gleich p. Welcher Wert von p maximiert diese Likelihood? Gib als ganze Zahl ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'Within the allowed parameter space [0,1], ask yourself: for which value of p is the expression p as large as possible?',
            hintDE: 'Im erlaubten Parameterraum [0,1]: für welchen Wert von p ist der Ausdruck p so groß wie möglich?'
        },
        {
            q: 'We observe n independent coin flips with k heads. The maximum likelihood estimator for the probability of heads p is k/n. We observe 3 heads in 10 flips. What is the maximum likelihood estimate? Enter as a decimal.',
            qDE: 'Wir beobachten n unabhängige Münzwürfe mit k Kopf-Ergebnissen. Der Maximum-Likelihood-Schätzer für die Kopfwahrscheinlichkeit p ist k/n. Wir beobachten 3 Kopf in 10 Würfen. Was ist der Maximum-Likelihood-Schätzwert? Gib als Dezimalzahl ein.',
            answer: 0.3, tolerance: 0.001, unit: '',
            hintEn: 'Insert the observed values of k and n into the formula for the maximum likelihood estimator.',
            hintDE: 'Setze die beobachteten Werte von k und n in die Formel für den Maximum-Likelihood-Schätzer ein.'
        },
        {
            q: 'The likelihood principle says that all information about the parameter contained in the data is captured by the likelihood function. Two datasets that produce the same likelihood function for all parameter values should lead to the same conclusion about the parameter. Is this the core idea of the likelihood principle? Enter 1 for yes, 0 for no.',
            qDE: 'Das Likelihood-Prinzip besagt, dass alle Information über den Parameter, die in den Daten steckt, durch die Likelihood-Funktion erfasst wird. Zwei Datensätze, die für alle Parameterwerte dieselbe Likelihood-Funktion erzeugen, sollten zur selben Schlussfolgerung über den Parameter führen. Ist das die Kernidee des Likelihood-Prinzips? Gib 1 für ja, 0 für nein ein.',
            answer: 1, tolerance: 0, unit: '',
            hintEn: 'The likelihood principle focuses on what the data tell us about the parameter, summarised entirely through the likelihood function.',
            hintDE: 'Das Likelihood-Prinzip konzentriert sich darauf, was die Daten über den Parameter aussagen, zusammengefasst vollständig durch die Likelihood-Funktion.'
        },
    ],




    9: [], 10: [], 11: [], 12: [],



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
