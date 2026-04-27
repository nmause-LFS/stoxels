

// Helper to convert shorthand rows [1,0,1] into objects {v:1, m:0}
function G(...rows) {
    return rows.map(r => r.map(v => v));
}

// lvText(obj, field) — returns the DE variant of a level content field
//   when German is active, falling back to the English field if DE is missing.
//   Usage: lvText(cur, 'hint')  →  cur.hintDE  (in German)  or  cur.hint  (in English)
function lvText(obj, field) {
    if (LANG === 'de') {
        const de = obj[field + 'DE'];
        if (de) return de;
    }
    return obj[field];
}

// ═══════════════════════════════════════════════
//  PUZZLE DATA



// World 1

const W1 = [
    {
        // Level 1-1
        hint: "Probability",
        hintDE: "Wahrscheinlichkeit",
        reveal: "P is commonly used to denote a probability measure",
        revealDE: "P wird häufig zur Bezeichnung eines Wahrscheinlichkeitsmaßes verwendet",
        timer: 300,
        bonusHint: "Answer the bonus questions correctly",
        bonusHintDE: "Beantworte die Bonusfragen richtig",
        bonusType: "quiz",
        bonusParam: 0,
        grid:G([1,1,1,1,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0])
    },

    {

        // Level 1-2
        hint: "Element",
        hintDE: "Element",
        reveal: "omega is commonly used to denote an element of the sample space",
        revealDE: "Omega wird häufig zur Bezeichnung eines Elements des Stichprobenraums verwendet",
        timer: 300,
        bonusHint: "Finish in 20 seconds",
        bonusHintDE: "In 20 Sekunden abschließen",
        bonusType: "fast",
        bonusParam: 20,
        grid:G([0,0,0,0,0],[0,0,0,1,1],[1,0,0,0,1],[1,0,1,0,1],[1,1,1,1,1])
    },

    {

        // Level 1-3
        hint: "Event",
        hintDE: "Ereignis",
        reveal: "Typically events are denoted by A,B,C,...",
        revealDE: "Ereignisse werden typischerweise mit A, B, C, ... bezeichnet",
        timer: 300,
        bonusHint: "Use no items",
        bonusHintDE: "Keine Items verwenden",
        bonusType: "noitem",
        bonusParam: 0,
        grid:G([0,0,1,0,0],[0,1,1,1,0],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1])
    },

    {
        // Level 1-4
        hint: "Impossible",
        hintDE: "Unmöglich",
        reveal: "An event that cannot occur will always have probability 0",
        revealDE: "Ein Ereignis, das nicht eintreten kann, hat immer die Wahrscheinlichkeit 0",
        timer: 300,
        bonusHint: "Finish with 0 mistakes",
        bonusHintDE: "Ohne Fehler abschließen",
        bonusType: "nomiss",
        bonusParam: 0,
        grid:G([0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0])
    },

    {
        // Level 1-5
        hint: "Sample Space",
        hintDE: "Ergebnismenge",
        reveal: "The sample space is usually denoted by Ω",
        revealDE: "Der Stichprobenraum wird üblicherweise mit Ω bezeichnet",
        timer: 300,
        bonusHint: "Answer the bonus questions correctly",
        bonusHintDE: "Beantworte die Bonusfragen richtig",
        bonusType: "quiz",
        bonusParam: 0,
        grid:G([0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1],[0,1,0,1,0],[1,1,0,1,1])
    },

    {
        // Level 1-6
        hint: "Sum",
        hintDE: "Summe",
        reveal: "The notation for a sum/series is Σ",
        revealDE: "Die Notation für eine Summe/Reihe ist Σ",
        timer: 300,
        bonusHint: "Finish in under 15 seconds",
        bonusHintDE: "In unter 15 Sekunden abschließen",
        bonusType: "fast",
        bonusParam: 15,
        grid:G([1,1,1,1,1],[0,1,0,0,0],[0,0,1,0,0],[0,1,0,0,0],[1,1,1,1,1])
    },

    {
        // Level 1-7
        hint: "Intersection",
        hintDE: "Schnitt",
        reveal: "This is the typical notation for an intersection of two events",
        revealDE: "Dies ist die typische Notation für den Schnitt zweier Ereignisse",
        timer: 300,
        bonusHint: "Finish under 20s with 0 mistakes",
        bonusHintDE: "Unter 20 Sek. ohne Fehler abschließen",
        bonusType: "combo",
        bonusParam: 20,
        grid: G([0, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1],[1, 0, 0, 0, 1], [1, 0, 0, 0, 1])
    },

    {
        // Level 1-8
        hint: "Order",
        hintDE: "Mächtigkeit",
        reveal: "|A| is the notation for the order of the set A",
        revealDE: "|A| ist die Notation für die Mächtigkeit der Menge A",
        timer: 300,
        bonusHint: "Finish in 10 seconds",
        bonusHintDE: "In 10 Sekunden abschließen",
        bonusType: "fast",
        bonusParam: 10,
        grid: G([1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1],[1, 0, 0, 0, 1], [1, 0, 0, 0, 1])
    },
            
    {
        // Level 1-9
        hint: "Expected Value",
        hintDE: "Erwartungswert",
        reveal: "E is the typical notation for the expected value",
        revealDE: "E ist die typische Notation für den Erwartungswert",
        timer: 300,
        bonusHint: "Answer the bonus question correctly",
        bonusHintDE: "Beantworte die Bonusfrage richtig",
        bonusType: "quiz",
        bonusParam: 0,
        grid: G([1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1],[1, 0, 0, 0, 0], [1, 1, 1, 1, 1])
    },

    {

        // Level 1-10
        hint: "Brackets",
        hintDE: "Klammern",
        reveal: "{ } is the notation for a set",
        revealDE: "{ } ist die Notation für eine Menge",
        timer: 300,
        bonusHint: "Finish with 0 mistakes",
        bonusHintDE: "Ohne Fehler abschließen",
        bonusType: "nomiss",
        bonusParam: 0,
        grid: G([0, 1, 0, 1, 0], [0, 1, 0, 1, 0], [1, 0, 0, 0, 1],[0, 1, 0, 1, 0], [0, 1, 0, 1, 0])
    },
];



// World 2

const W2 = [

    {

        // Level 2-1
        hint: "Algebra",
        hintDE: "Algebra",
        reveal: "We usually denote a Sigma-Algebra with A or σ",
        revealDE: "Eine Sigma-Algebra wird üblicherweise mit A oder σ bezeichnet",
        timer: 600,
        bonusHint: "Use no items",
        bonusHintDE: "Keine Items verwenden",
        bonusType: "noitem",
        bonusParam: 0,
        grid: G([0, 0, 0, 0, 1, 1, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
                [0, 0, 0, 1, 0, 0, 1, 0, 1, 0], [1, 0, 1, 1, 0, 0, 0, 1, 1, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 1, 0, 0, 0, 0], [0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
                [0, 0, 0, 1, 1, 1, 0, 0, 0, 0])
    },

    {

        // Level 2-2
        hint: "Venn",
        hintDE: "Venn",
        reveal: "A Venn-Diagram is a graphical presentation of two or more sets",
        revealDE: "Ein Venn-Diagramm ist eine grafische Darstellung von zwei oder mehr Mengen",
        timer: 600,
        bonusHint: "Finish in under 2 minutes",
        bonusHintDE: "In unter 2 Minuten abschließen",
        bonusType: "fast",
        bonusParam: 120,
        grid:G([0,1,1,1,1,1,1,1,1,0],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],
                [1,0,1,1,1,1,1,1,0,1],[0,1,0,0,0,0,0,0,1,0],[0,1,0,0,0,0,0,0,1,0],
                [1,0,1,1,1,1,1,1,0,1],[1,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,1],
                [0, 1, 1, 1, 1, 1, 1, 1, 1, 0])
    },

    {

        // Level 2-3
        hint: "Complementary",
        hintDE: "Komplement",
        reveal: "This is the notation for the complement of a set",
        revealDE: "Dies ist die Notation für das Komplement einer Menge",
        timer: 600,
        bonusHint: "Finish under 3 min with 0 mistakes",
        bonusHintDE: "Unter 3 Min. ohne Fehler abschließen",
        bonusType: "combo",
        bonusParam: 180,
        bonusParam: 0,
        grid: G([0, 1, 1, 1, 1, 1, 0, 0, 1, 1], [1, 0, 0, 0, 0, 0, 1, 0, 1, 0], [1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
                [1, 0, 0, 0, 0, 1, 0, 0, 1, 1], [1, 1, 1, 1, 1, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                [1, 0, 0, 0, 0, 1, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 1, 0, 0, 0], [1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                [0, 1, 1, 1, 1, 1, 0, 0, 0, 0])
    },



    //Ab hier neu machen
 

    {
        hint: "rate of rare events in a fixed interval", reveal: "λ — Poisson Rate",
        bonusHint: "Answer the bonus question correctly", bonusType: "quiz", bonusParam: 0,
        grid: G([0, 1, 0, 0, 0, 1, 0, 0, 0, 0], [0, 1, 0, 0, 0, 1, 0, 0, 0, 0], [0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 1, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    },
    {
        hint: "the ratio of circumference to diameter", reveal: "π ≈ 3.14159",
        bonusHint: "Use no items", bonusType: "noitem", bonusParam: 0,
        grid: G([0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 1, 1, 0, 0], [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    },
    {
        hint: "reject or fail to reject this", reveal: "H₀ — Null Hypothesis",
        bonusHint: "At most 2 mistakes", bonusType: "lowmiss", bonusParam: 2,
        grid: G([0, 1, 0, 0, 1, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 1, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 1, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    },
    {
        hint: "data displayed as adjacent frequency rectangles", reveal: "Histogram",
        bonusHint: "Finish with 0 mistakes", bonusType: "nomiss",
        grid: G([0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 0, 0, 0], [0, 0, 1, 1, 1, 1, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 0, 0, 0], [0, 1, 1, 1, 1, 1, 1, 1, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    },
    {
        hint: "the number of ways to arrange without repetition", reveal: "n! — Factorial / Combinatorics",
        bonusHint: "Finish in under 2 minutes", bonusType: "fast", bonusParam: 120,
        grid: G([0, 1, 0, 0, 0, 1, 0, 0, 0, 0], [0, 1, 1, 0, 0, 1, 0, 0, 0, 0], [0, 1, 0, 1, 0, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 1, 1, 0, 0, 0, 0], [0, 1, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    },
    {
        hint: "it measures the strength of a linear association", reveal: "r — Correlation Coefficient",
        bonusHint: "Finish with 0 mistakes", bonusType: "nomiss",
        grid: G([0, 1, 0, 0, 0, 1, 0, 0, 0, 0], [0, 1, 0, 0, 1, 0, 0, 0, 0, 0], [0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 1, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    },
    {
        hint: "a two-outcome experiment repeated n times", reveal: "Binomial Distribution (B/n)",
        bonusHint: "Answer the bonus question correctly", bonusType: "quiz", bonusParam: 0,
        grid: G([0, 1, 1, 0, 0, 0, 0, 1, 0, 0], [0, 1, 0, 1, 0, 0, 0, 1, 0, 0], [0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
            [0, 1, 1, 0, 0, 0, 0, 1, 0, 0], [0, 1, 0, 1, 0, 0, 0, 1, 0, 0], [0, 1, 0, 1, 0, 0, 0, 1, 0, 0],
            [0, 1, 0, 1, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    },
];
        const W3 = [
            {
                hint: "the continuous analog of Σ — area under a curve", reveal: "∫ — Integral",
                bonusHint: "Answer the bonus question correctly", bonusType: "quiz", bonusParam: 0, bonusParam: 0,
                grid: G([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            },
            {
                hint: "the capital Greek letter for total variation", reveal: "Σ — Summation (large)",
                bonusHint: "Finish in under 5 minutes", bonusType: "fast", bonusParam: 300,
                grid: G([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            },
            {
                hint: "a five-number summary: min, Q1, median, Q3, max", reveal: "Box Plot",
                bonusHint: "At most 1 mistake", bonusType: "lowmiss", bonusParam: 1,
                grid: G([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0], [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            },
            {
                hint: "the probability of observing data as extreme as yours, assuming H₀", reveal: "p-value",
                bonusHint: "Use no items", bonusType: "noitem", bonusParam: 0,
                grid: G([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            },
            {
                hint: "update prior beliefs using observed evidence", reveal: "Bayes — P(A|B)",
                bonusHint: "Answer the bonus question correctly", bonusType: "quiz", bonusParam: 0, bonusParam: 0,
                grid: G([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
                    [0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0], [0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            },
            {
                hint: "the significance threshold guarding against false positives", reveal: "α — Significance Level",
                bonusHint: "Finish under 5 min with 0 mistakes", bonusType: "combo", bonusParam: 300,
                grid: G([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            },
            {
                hint: "a test statistic with heavier tails than normal, for small samples", reveal: "t — Student's t",
                bonusHint: "Finish with 0 mistakes", bonusType: "nomiss",
                grid: G([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            },
            {
                hint: "measures goodness-of-fit; always non-negative", reveal: "χ² — Chi-squared",
                bonusHint: "Finish in under 4 minutes", bonusType: "fast", bonusParam: 240,
                grid: G([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            },
            {
                hint: "proportion of variance explained by the model", reveal: "R² — Coefficient of Determination",
                bonusHint: "Finish with 0 mistakes", bonusType: "nomiss",
                grid: G([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
                    [0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            },
            {
                hint: "a scatter diagram showing two correlated variables", reveal: "Scatter Plot",
                bonusHint: "Use no items", bonusType: "noitem", bonusParam: 0,
                grid: G([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            },
        ];
        const W4 = [
            {
                hint: "the big theta — parameter space in full", reveal: "θ — Theta (large)",
                bonusHint: "Use no items", bonusType: "noitem", bonusParam: 0, bonusParam: 0,
                grid: (() => {
                    const g = Array.from({ length: 20 }, () => Array(20).fill(0));
                    for (let r = 0; r < 20; r++) for (let c = 0; c < 20; c++) { const d = Math.sqrt((r - 9.5) ** 2 + (c - 9.5) ** 2); if (d >= 6.5 && d <= 8) g[r][c] = 1; }
                    for (let c = 3; c <= 16; c++) { g[9][c] = 1; g[10][c] = 1; } return g;
                })()
            },
            {
                hint: "samples large enough? then distributions converge", reveal: "CLT — Central Limit Theorem",
                bonusHint: "Finish in under 7 minutes", bonusType: "fast", bonusParam: 420,
                grid: (() => {
                    const g = Array.from({ length: 20 }, () => Array(20).fill(0));
                    for (let c = 1; c <= 3; c++) for (let r = 13; r <= 16; r++) g[r][c] = 1;
                    [[1, 5, 16], [2, 6, 15], [3, 7, 14], [2, 8, 15], [1, 9, 16]].forEach(([h, c]) => { for (let r = 16 - h; r <= 16; r++) g[r][c] = 1; });
                    [1, 2, 4, 6, 6, 4, 2, 1].forEach((h, i) => { for (let r = 16 - h; r <= 16; r++) g[r][12 + i] = 1; });
                    g[8][5] = 1; g[8][6] = 1; g[8][7] = 1; g[7][7] = 1; g[9][7] = 1; return g;
                })()
            },
            {
                hint: "maximises the probability of observing the data", reveal: "MLE — Maximum Likelihood",
                bonusHint: "At most 2 mistakes", bonusType: "lowmiss", bonusParam: 2,
                grid: (() => {
                    const g = Array.from({ length: 20 }, () => Array(20).fill(0));
                    const ys = [0, 1, 2, 3, 5, 7, 9, 11, 13, 14, 14, 13, 11, 9, 7, 5, 3, 2, 1, 0];
                    for (let c = 0; c < 20; c++) for (let r = 17 - ys[c]; r <= 17; r++) g[r][c] = 1;
                    for (let c = 0; c < 20; c++) g[17][c] = 1;
                    g[1][9] = 1; g[1][10] = 1; g[2][9] = 1; g[2][10] = 1;
                    for (let r = 3; r <= 5; r++) g[r][10] = 1; return g;
                })()
            },
            {
                hint: "the probability density of a continuous distribution", reveal: "PDF — Probability Density Function",
                bonusHint: "Answer the bonus question correctly", bonusType: "quiz", bonusParam: 0,
                grid: (() => {
                    const g = Array.from({ length: 20 }, () => Array(20).fill(0));
                    const h = [0, 0, 1, 2, 3, 5, 7, 9, 12, 14, 14, 12, 9, 7, 5, 3, 2, 1, 0, 0];
                    for (let c = 0; c < 20; c++) for (let r = 17 - h[c]; r <= 17; r++) g[r][c] = 1;
                    for (let c = 1; c <= 18; c++) g[17][c] = 1; return g;
                })()
            },
            {
                hint: "the log-odds; the link function in logistic regression", reveal: "logit — log(p / 1−p)",
                bonusHint: "Answer the bonus question correctly", bonusType: "quiz", bonusParam: 0, bonusParam: 0,
                grid: (() => {
                    const g = Array.from({ length: 20 }, () => Array(20).fill(0));
                    const sx = [2, 2, 3, 3, 4, 5, 6, 8, 10, 11, 13, 14, 15, 16, 17, 17, 17, 17, 17, 17];
                    for (let c = 1; c <= 18; c++) { const r = Math.round(17 - sx[Math.min(c - 1, sx.length - 1)]); if (r >= 0 && r < 20) g[r][c] = 1; }
                    for (let i = 1; i <= 18; i++) g[18][i] = 1;
                    for (let i = 1; i <= 17; i++) g[i][1] = 1; return g;
                })()
            },
            {
                hint: "a curve that ranks classifiers by true positive vs false positive rate", reveal: "ROC Curve",
                bonusHint: "Finish under 8 min with 0 mistakes", bonusType: "combo", bonusParam: 480,
                grid: (() => {
                    const g = Array.from({ length: 20 }, () => Array(20).fill(0));
                    for (let i = 1; i <= 17; i++) g[17][i] = 1;
                    for (let i = 2; i <= 17; i++) g[i][1] = 1;
                    for (let i = 0; i <= 14; i++) g[16 - i][2 + i] = 1;
                    [[15, 2], [13, 3], [11, 4], [9, 5], [7, 7], [5, 9], [4, 11], [3, 13], [2, 15]].forEach(([r, c]) => g[r][c] = 1);
                    return g;
                })()
            },
            {
                hint: "estimator desiderata: unbiasedness, consistency, efficiency", reveal: "Estimator Properties: U / C / E",
                bonusHint: "Finish with 0 mistakes", bonusType: "nomiss",
                grid: (() => {
                    const g = Array.from({ length: 20 }, () => Array(20).fill(0));
                    for (let r = 3; r <= 13; r++) { g[r][1] = 1; g[r][4] = 1; }
                    g[14][2] = 1; g[14][3] = 1;
                    for (let c = 7; c <= 10; c++) { g[3][c] = 1; g[13][c] = 1; }
                    for (let r = 4; r <= 12; r++) g[r][7] = 1;
                    for (let r = 3; r <= 13; r++) g[r][13] = 1;
                    for (let c = 13; c <= 16; c++) { g[3][c] = 1; g[8][c] = 1; g[13][c] = 1; }
                    return g;
                })()
            },
            {
                hint: "P(A and B) = P(A)·P(B|A)", reveal: "Joint Probability",
                bonusHint: "Finish in under 6 minutes", bonusType: "fast", bonusParam: 360,
                grid: (() => {
                    const g = Array.from({ length: 20 }, () => Array(20).fill(0));
                    for (let r = 2; r <= 17; r++) g[r][2] = 1;
                    for (let c = 2; c <= 17; c++) g[17][c] = 1;
                    for (let r = 2; r <= 8; r++) { g[r][8] = 1; g[r][14] = 1; }
                    for (let c = 8; c <= 14; c++) g[8][c] = 1;
                    for (let r = 8; r <= 14; r++) g[r][14] = 1;
                    for (let c = 8; c <= 17; c++) g[14][c] = 1;
                    return g;
                })()
            },
            {
                hint: "probability that the interval contains the true parameter", reveal: "Confidence Interval",
                bonusHint: "Finish with 0 mistakes", bonusType: "nomiss",
                grid: (() => {
                    const g = Array.from({ length: 20 }, () => Array(20).fill(0));
                    for (let c = 1; c <= 18; c++) g[9][c] = 1;
                    for (let r = 5; r <= 13; r++) { g[r][5] = 1; g[r][15] = 1; }
                    for (let c = 5; c <= 15; c++) { g[5][c] = 1; g[13][c] = 1; }
                    for (let r = 3; r <= 16; r++) g[r][10] = 1;
                    return g;
                })()
            },
            {
                hint: "decompose total variation: between groups versus within groups", reveal: "ANOVA — Analysis of Variance",
                bonusHint: "Use no items", bonusType: "noitem", bonusParam: 0,
                grid: (() => {
                    const g = Array.from({ length: 20 }, () => Array(20).fill(0));
                    const b1 = [0, 1, 2, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    const b2 = [0, 0, 0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    const b3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 1, 0, 0, 0, 0];
                    [b1, b2, b3].forEach(b => b.forEach((h, c) => { for (let r = 16 - h; r <= 16; r++) if (h > 0) g[r][c] = 1; }));
                    for (let c = 0; c <= 19; c++) g[16][c] = 1;
                    return g;
                })()
            },
        ];
        // World 5: non-square grids
        const W5 = [
            {

                // Level 5-1
                hint: "Independence",
                hintDE: "Unabhängigkeit",
                reveal: "If A and B are independent events, then the probability of A AND B is just the product of the two separate probabilities",
                revealDE: "Wenn A und B unabhängige Ereignisse sind, ist die Wahrscheinlichkeit von A UND B das Produkt der beiden Einzelwahrscheinlichkeiten",
                timer: 1800,
                bonusHint: "Complete level",
                bonusHintDE: "Level abschließen",
                bonusType: "nomiss",
                bonusParam: 0,
                grid:G(
                    [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,0,0,0,1,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0],[1,0,0,0,1,0,1,0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0],
                    [1,1,1,1,1,0,1,0,0,0,1,1,0,1,1,0,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1,0,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0],
                    [1,0,0,0,0,0,1,0,0,0,1,1,1,1,1,0,1,0,0,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,0,0,1,0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,0,0,0],
                    [1,0,0,0,0,0,1,1,0,0,1,0,0,0,1,0,1,0,0,0,0,1,0,0,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[1,1,1,1,1,0,1,1,1,0,0,0,1,0,0,0,1,1,0,0,0,0,1,1,1,1,1,0,0,1,1,0,1,1,1,1,0,1,1,0],
                    [1,0,0,0,1,0,1,0,0,0,0,1,1,1,0,0,0,1,0,0,0,0,1,0,0,0,1,1,0,1,0,0,1,0,0,0,1,0,1,0],[1,0,0,0,1,0,1,0,0,0,1,1,0,1,1,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,0,0,1,0,0,0,1,0,1,0],[1,0,0,1,1,0,1,0,0,0,1,0,0,0,1,0,0,1,0,1,1,0,1,1,1,1,1,0,0,1,0,0,1,1,1,1,1,0,1,0],
                    [1,1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,1,1,0,1,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0],[1,0,0,0,0,0,1,0,0,0,1,1,1,1,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,1,0],[1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,1,0,0,1,1,0,1,0],
                    [1,0,0,0,0,0,1,1,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,0,0,0,0,0,1,1,0,1,1,1,0,0,1,1,0])
            },


                // ab hier neu machen
            {
                hint: "average squared distance from the mean", reveal: "Var(X) — Variance",
                bonusHint: "Answer the bonus question correctly", bonusType: "quiz", bonusParam: 0,
                grid: G(
                    [1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 0], [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
                    [1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0], [1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0],
                    [0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0])
            },
            {
                hint: "the probability that one event occurs given another has occurred", reveal: "P(A|B) — Conditional Probability",
                bonusHint: "Finish under 4 min with 0 mistakes", bonusType: "combo", bonusParam: 240,
                grid: G(
                    [1, 0, 1, 0, 1, 0, 1, 1, 1], [1, 0, 1, 0, 1, 0, 1, 0, 0], [1, 1, 1, 0, 1, 0, 1, 1, 0],
                    [1, 0, 1, 0, 1, 0, 1, 0, 0], [1, 0, 1, 0, 1, 0, 1, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 0, 1, 0, 0, 1, 0], [0, 0, 0, 0, 1, 1, 1, 1, 0], [0, 0, 0, 0, 1, 0, 0, 1, 0], [0, 0, 0, 0, 1, 0, 0, 1, 0])
            },
            {
                hint: "a measure of how two variables move together", reveal: "Cov(X,Y) — Covariance",
                bonusHint: "At most 1 mistake", bonusType: "lowmiss", bonusParam: 1,
                grid: G(
                    [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0], [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
                    [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1])
            },
            {
                hint: "the probability that X takes a value less than or equal to x", reveal: "F(x) — CDF",
                bonusHint: "Finish with 0 mistakes", bonusType: "nomiss",
                grid: G(
                    [1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1], [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                    [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                    [1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0])
            },


            // ── NEW LEVELS ────────────────────────────────────────────────────────

            {
                // Level 5-6  (8 rows × 20 cols)  — "μ" (population mean)
                hint: "population mean notation",
                hintDE: "Notation des Populationsmittelwerts",
                reveal: "μ (mu) denotes the population mean in statistics",
                revealDE: "μ (Mu) bezeichnet den Populationsmittelwert in der Statistik",
                bonusHint: "Finish with 0 mistakes",
                bonusHintDE: "Ohne Fehler abschließen",
                bonusType: "nomiss",
                bonusParam: 0,
                grid: G(
                    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0],
                    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
                    [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
                    [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
                    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
                    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0],
                    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1]
                )
            },

            {
                // Level 5-7  (6 rows × 15 cols)  — "σ²" (variance symbol)
                hint: "variance notation using Greek letters",
                hintDE: "Varianznotation mit griechischen Buchstaben",
                reveal: "σ² (sigma squared) is the standard notation for variance",
                revealDE: "σ² (Sigma zum Quadrat) ist die Standardnotation für die Varianz",
                bonusHint: "Finish in under 90 seconds",
                bonusHintDE: "In unter 90 Sekunden abschließen",
                bonusType: "fast",
                bonusParam: 90,
                grid: G(
                    [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0],
                    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
                    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
                    [0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
                    [0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0],
                    [1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]
                )
            },

            {
                // Level 5-8  (10 rows × 12 cols)  — the word "MODE"
                hint: "the most frequently occurring value in a dataset",
                hintDE: "Der am häufigsten vorkommende Wert in einem Datensatz",
                reveal: "The mode is the value that appears most often in a data set",
                revealDE: "Der Modus ist der Wert, der in einem Datensatz am häufigsten vorkommt",
                bonusHint: "Use no items",
                bonusHintDE: "Keine Items verwenden",
                bonusType: "noitem",
                bonusParam: 0,
                grid: G(
                    [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0],
                    [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0],
                    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                    [1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0],
                    [1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1],
                    [1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1],
                    [1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0]
                )
            },

            {
                // Level 5-9  (12 rows × 9 cols)  — an hourglass / normal-distribution silhouette
                hint: "the bell-shaped continuous probability distribution",
                hintDE: "Die glockenförmige stetige Wahrscheinlichkeitsverteilung",
                reveal: "The normal distribution is symmetric and bell-shaped, centred at its mean μ",
                revealDE: "Die Normalverteilung ist symmetrisch und glockenförmig, zentriert bei ihrem Mittelwert μ",
                bonusHint: "Answer the bonus question correctly",
                bonusHintDE: "Beantworte die Bonusfrage richtig",
                bonusType: "quiz",
                bonusParam: 0,
                grid: G(
                    [1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [0, 1, 1, 1, 1, 1, 1, 1, 0],
                    [0, 0, 1, 1, 1, 1, 1, 0, 0],
                    [0, 0, 0, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0],
                    [0, 0, 0, 0, 1, 0, 0, 0, 0],
                    [0, 0, 0, 1, 1, 1, 0, 0, 0],
                    [0, 0, 1, 1, 1, 1, 1, 0, 0],
                    [0, 1, 1, 1, 1, 1, 1, 1, 0],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [0, 0, 0, 1, 1, 1, 0, 0, 0]
                )
            },

            {
                // Level 5-10  (7 rows × 18 cols)  — "1/n · Σxᵢ" (sample mean formula)
                hint: "the formula for the arithmetic sample mean",
                hintDE: "Die Formel für das arithmetische Stichprobenmittel",
                reveal: "The sample mean x̄ = (1/n)·Σxᵢ averages all observed values",
                revealDE: "Das Stichprobenmittel x̄ = (1/n)·Σxᵢ mittelt alle beobachteten Werte",
                bonusHint: "Finish under 2 min with 0 mistakes",
                bonusHintDE: "Unter 2 Min. ohne Fehler abschließen",
                bonusType: "combo",
                bonusParam: 120,
                grid: G(
                    [1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1],
                    [1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                    [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0],
                    [0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0],
                    [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0],
                    [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
                    [0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1]
                )
            },











];








const WORLDS = [
    { label: 'WORLD 1 — 5×5  BEGINNER', labelDE: 'WELT 1 — 5×5  ANFÄNGER', size: 5, data: W1 },
    { label: 'WORLD 2 — 10×10 STANDARD', labelDE: 'WELT 2 — 10×10 STANDARD', size: 10, data: W2 },
    { label: 'WORLD 3 — 15×15 ADVANCED', labelDE: 'WELT 3 — 15×15 FORTGESCHR.', size: 15, data: W3 },
    { label: 'WORLD 4 — 20×20 EXPERT', labelDE: 'WELT 4 — 20×20 EXPERTE', size: 20, data: W4 },
    { label: 'WORLD 5 — NON-SQUARE SHAPES', labelDE: 'WELT 5 — NICHT-QUADRATISCH', size: null, data: W5 },
];



const ALL = WORLDS.flatMap((w, wi) => w.data.map((p, li) => ({ world: wi + 1, li: li + 1, gIdx: wi * 10 + li, size: w.size, ...p })));