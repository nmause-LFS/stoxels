

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
        // 5x5
        hint: "Sample Space",
        hintDE: "Ergebnismenge",
        reveal: "The sample space is usually denoted by Ω",
        revealDE: "Der Stichprobenraum wird üblicherweise mit Ω bezeichnet",
        timer: 1800,
        bonusHint: "Answer the bonus question correctly",
        bonusHintDE: "Beantworte die Bonusfrage richtig",
        bonusType: "quiz",
        bonusParam: 0,
        grid: G([0, 0, 1, 0, 0], [0, 1, 0, 1, 0], [1, 0, 0, 0, 1],[0, 1, 0, 1, 0], [1, 1, 0, 1, 1])
    },


    {
        // 5x5
        hint: "Result",
        hintDE: "Ergebnis",
        reveal: "omega is a possible result in a random experiment",
        revealDE: "omega ist ein mögliches Ergebnis eines Zufallsexperiments",
        timer: 1800,
        bonusHint: "Finish in 20 seconds",
        bonusHintDE: "In 20 Sekunden abschließen",
        bonusType: "fast",
        bonusParam: 20,
        grid: G([0, 0, 0, 0, 0], [0, 0, 0, 1, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1], [1, 1, 1, 1, 1])
    },

    {
        // 5x5
        hint: "Probability",
        hintDE: "Wahrscheinlichkeit",
        reveal: "P is commonly used to denote a probability measure",
        revealDE: "P wird häufig zur Bezeichnung eines Wahrscheinlichkeitsmaßes verwendet",
        timer: 1800,
        bonusHint: "Answer the bonus question correctly",
        bonusHintDE: "Beantworte die Bonusfrage richtig",
        bonusType: "quiz",
        bonusParam: 0,
        grid: G([1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0])
    },

    {
        // 5x10
        hint: "Events",
        hintDE: "Ereignisse",
        reveal: "Typical notation for events in stochastics",
        revealDE: "Typische Notation für Ereignisse in der Stochastik",
        timer: 1800,
        bonusHint: "Finish without using items",
        bonusHintDE: "Beende das Level ohne Items zu nutzen",
        bonusType: "noitem",
        bonusParam: 0,
        grid: G(
            [1, 1, 1, 0, 1, 1, 1, 0, 1, 1], [1, 0, 1, 0, 1, 0, 1, 0, 1, 0], [1, 1, 1, 0, 1, 1, 1, 0, 1, 0],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0], [1, 0, 1, 0, 1, 1, 1, 0, 1, 1]
        )
    },


    {
        // 5x15
        hint: "Elementary Event",
        hintDE: "Elementarereignis",
        reveal: "Smallest event in a sample space",
        revealDE: "Kleinste Ereignis in der Ergebnismenge",
        timer: 1800,
        bonusHint: "Finish in 30 seconds",
        bonusHintDE: "In 30 Sekunden abschließen",
        bonusType: "fast",
        bonusParam: 30,
        grid: G(
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0], [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0]
        )
    },


    {
        // 5x25
        hint: "Complementary",
        hintDE: "Komplement",
        reveal: "This is the definition of a complementary of an event",
        revealDE: "Dies ist die Definition des Komplements eines Ereignisses",
        timer: 1800,
        bonusHint: "Answer the bonus question correctly",
        bonusHintDE: "Beantworte die Bonusfrage richtig",
        bonusType: "quiz",
        bonusParam: 0,
        grid: G(
            [1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1], [1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1], [1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1],
            [1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1], [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1]
        )
    },




    {
        //5x25
        hint: "Event Algebra",
        hintDE: "Ereignisalgebra",
        reveal: "This is the typical sigma-Algebra for a countable Omega",
        revealDE: "Dies ist die typische sigma - Algebra bei einem abzählbaren Omega",
        timer: 1800,
        bonusHint: "Finish without mistakes",
        bonusHintDE: "Beende das Level ohne Fehler zu machen",
        bonusType: "nomiss",
        bonusParam: 0,
        grid: G(
            [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0], [0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0], [0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
            [0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0], [0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0]
        )
    },



    {
        // 5x30
        hint: "Disjoint",
        hintDE: "Disjunkt",
        reveal: "Two sets are disjoint if their intersection has no elements",
        revealDE: "Zwei Mengen sind disjunkt wenn ihr Schnitt keine Elemente enthält",
        timer: 1800,
        bonusHint: "Finish without using items",
        bonusHintDE: "Beende das Level ohne Items zu verwenden",
        bonusType: "noitem",
        bonusParam: 0,
        grid: G(
            [1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1], [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1], [1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
        )
    },


    {
        // 5x45
        hint: "De Morgan",
        hintDE: "De Morgan",
        reveal: "This is De Morgan's rule for the intersection of two sets",
        revealDE: "Dies ist die Regel von De Morgan für den Schnitt zweier Mengen",
        timer: 1800,
        bonusHint: "Complete level",
        bonusHintDE: "Complete level (DE)",
        bonusType: "nomiss",
        bonusParam: 0,
        grid: G(
            [1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0], [1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0], [1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0],
            [1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0], [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0]
        )
    },


    {
        // 10x35
        hint: "Probability of disjoint Events",
        hintDE: "Wahrscheinlichkeit von disjunkten Ereignissen",
        reveal: "If P is a probability measure and A,B are disjoint, then the probability of a union is just the sum of probabilities",
        revealDE: "Wenn P ein Wahrscheinlichkeitsmaß und A,B disjunkte Ereignisse sind, dann entspricht die Wahrscheinlichkeit einer Vereinigung der Summe der Wahrscheinlichkeiten",
        timer: 1800,
        bonusHint: "Complete level",
        bonusHintDE: "Complete level (DE)",
        bonusType: "nomiss",
        bonusParam: 0,
        grid: G(
            [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
            [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1], [0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1], [1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
            [0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1]
        )
    },



    {
        // 10x35
        hint: "Probability of Difference",
        hintDE: "Wahrscheinlichkeit einer Differenzmenge",
        reveal: "This property only holds if A is a subset of B",
        revealDE: "Diese Eigenschaft gilt nur, wenn A eine Teilmenge von B ist",
        timer: 1800,
        bonusHint: "Complete level",
        bonusHintDE: "Complete level (DE)",
        bonusType: "nomiss",
        bonusParam: 0,
        grid: G(
            [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1],
            [0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1], [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1], [0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
            [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1]
        )
    },




    {
        // 15x30
        hint: "Geometric Series",
        hintDE: "Geometrische Reihe",
        reveal: "This is the formula of the Geometric Series in case |q|<1",
        revealDE: "Dies ist die Formel der Geometrischen Reihe für |q|<1",
        timer: 1800,
        bonusHint: "Complete level",
        bonusHintDE: "Complete level (DE)",
        bonusType: "lowmiss",
        bonusParam: 5,
        grid: G(
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1], [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1], [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        )
    },


    
];



// World 2

const W2 = [

];


const W3 = [

            




];




const W4 = [
                
            






            
];






// World 5
const W5 = [















];



const W6 = [

];


const W7 = [

];


const W8 = [

];



const W9 = [

];


const W10 = [

];



const W11 = [

];



const W12 = [

];


const W13 = [


   



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
        grid: G([0, 0, 1, 0, 0], [0, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1], [1, 0, 0, 0, 1])
    },

    {
        // Level 1-4
        hint: "Impossible Event",
        hintDE: "Unmögliches Ereignis",
        reveal: "An event that cannot occur will always have probability 0",
        revealDE: "Ein Ereignis, das nicht eintreten kann, hat immer die Wahrscheinlichkeit 0",
        timer: 300,
        bonusHint: "Finish with 0 mistakes",
        bonusHintDE: "Ohne Fehler abschließen",
        bonusType: "nomiss",
        bonusParam: 0,
        grid: G([0, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 1, 1, 0])
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
        grid: G([1, 1, 1, 1, 1], [0, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 1, 0, 0, 0], [1, 1, 1, 1, 1])
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
        grid: G([0, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1])
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
        grid: G([1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 1, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1])
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
        grid: G([1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1])
    },

    {

        // Level 1-10
        hint: "Random Variable",
        hintDE: "Zufallsvariable",
        reveal: "X is typically a random variable",
        revealDE: "X ist typischerweise eine Zufallsvariable",
        timer: 300,
        bonusHint: "Finish with 0 mistakes",
        bonusHintDE: "Ohne Fehler abschließen",
        bonusType: "nomiss",
        bonusParam: 0,
        grid: G([1, 0, 0, 0, 1], [0, 1, 0, 1, 0], [0, 0, 1, 0, 0], [0, 1, 0, 1, 0], [1, 0, 0, 0, 1])
    },


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
        grid: G([0, 1, 1, 1, 1, 1, 1, 1, 1, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 1, 0, 1], [0, 1, 0, 0, 0, 0, 0, 0, 1, 0], [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
            [1, 0, 1, 1, 1, 1, 1, 1, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0])
    },



    {
        // Level 2-4
        hint: "Random Variables",
        hintDE: "Zufallsvariablen",
        reveal: "W,X,Y,Z are commonly used for random variables",
        revealDE: "Mit W,X,Y,Z werden üblicherweise Zufallsvariablen notiert",
        timer: 600,
        bonusHint: "Answer the bonus question correctly",
        bonusHintDE: "Beantworte die Bonusfrage richtig",
        bonusType: "quiz",
        bonusParam: 0,
        grid: G(
            [1, 0, 1, 0, 1, 1, 0, 0, 0, 1], [1, 0, 1, 0, 1, 0, 1, 0, 1, 0], [1, 0, 1, 0, 1, 0, 0, 1, 0, 0],
            [1, 0, 1, 0, 1, 0, 1, 0, 1, 0], [1, 1, 1, 1, 1, 1, 0, 0, 0, 1], [1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
            [0, 1, 0, 1, 0, 0, 0, 0, 1, 0], [0, 0, 1, 0, 0, 0, 0, 1, 0, 0], [0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 1, 0, 0, 1, 1, 1, 1, 1]
        )
    },



    {
        hint: "Exponential Distribution",
        hintDE: "Exponentialverteilung",
        reveal: "This is the distribution function of an exponential distribution",
        revealDE: "Dies ist die Verteilungsfunktion einer Exponentialverteilung",
        timer: 900,
        bonusHint: "Answer the bonus question correctly",
        bonusHintDE: "Beantworte die Bonusfrage richtig",
        bonusType: "quiz",
        bonusParam: 0,
        grid: G(
            [1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0], [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0], [1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
            [1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0], [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1], [0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
            [0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1], [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0]
        )
    },



    {
        hint: "Union Bound",
        hintDE: "Boolesche Ungleichung",
        reveal: "The union bound states that the probability of a union is bounded by the sum of probabilities",
        revealDE: "Die Boolsche Ungleichung besagt, dass die Wahrscheinlichkeit einer Vereinigung beschränkt ist durch die Summe der einzelnen Wahrscheinlichkeiten",
        timer: 1200,
        bonusHint: "Use no items",
        bonusHintDE: "Verwende keine Gegenstände",
        bonusType: "noitem",
        bonusParam: 0,
        grid: G(
            [1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0], [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0], [1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0],
            [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0], [1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1], [1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1], [0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1], [1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1]
        )
    },


    {
        hint: "Quantile Function",
        hintDE: "Quantilfunktion",
        reveal: "This is the definition of the quantile function",
        revealDE: "Dies ist die Definition der Quantilfunktion",
        timer: 1200,
        bonusHint: "Finish in under 10 minutes",
        bonusHintDE: "Löse das Puzzle in weniger als 10 Minuten",
        bonusType: "fast",
        bonusParam: 600,
        grid: G(
            [1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0], [1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0], [1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0], [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
            [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0], [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0],
            [1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0], [1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0],
            [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0], [1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0]
        )
    },



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
        grid: G(
            [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0],
            [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0], [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0], [1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0],
            [1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0], [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0],
            [1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0])
    },

    {
        hint: "Total Probability",
        hintDE: "Totale Wahrscheinlichkeit",
        reveal: "This is the formula of the total probability theorem",
        revealDE: "Dies ist die Formel aus dem Satz der totalen Wahrscheinlichkeit",
        timer: 1800,
        bonusHint: "Answer the bonus question correctly",
        bonusHintDE: "Beantworte die Bonusfrage richtig",
        bonusType: "quiz",
        bonusParam: 0,
        grid: G(
            [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1],
            [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1], [0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1], [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1], [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0]
        )
    },






];









const WORLDS = [
    { label: 'WORLD 1', labelDE: 'WELT 1', size: 5, data: W1 },
    { label: 'WORLD 2', labelDE: 'WELT 2', size: 10, data: W2 },
    { label: 'WORLD 3', labelDE: 'WELT 3', size: 15, data: W3 },
    { label: 'WORLD 4', labelDE: 'WELT 4', size: 20, data: W4 },
    { label: 'WORLD 5', labelDE: 'WELT 5', size: null, data: W5 },
    { label: 'World 6', labelDE: 'Welt 6', data: W6 },
    { label: 'World 7', labelDE: 'Welt 7', data: W7 },
    { label: 'World 8', labelDE: 'Welt 8', data: W8 },
    { label: 'World 9', labelDE: 'Welt 9', data: W9 },
    { label: 'World 10', labelDE: 'Welt 10', data: W10 },
    { label: 'World 11', labelDE: 'Welt 11', data: W11 },
    { label: 'World 12', labelDE: 'Welt 12', data: W12 },
    { label: 'World 13', labelDE: 'Welt 13', data: W13 },

];






// Build ALL with correct gi values regardless of world size
const ALL = [];
WORLDS.forEach((w, wi) => {
    w.data.forEach((p, li) => {
        const gi = ALL.length; // sequential, no gaps
        ALL.push({ world: wi + 1, li: li + 1, gIdx: gi, size: w.size, ...p });
    });
});


const WORLD_START_GI = WORLDS.reduce((acc, w, wi) => {
    acc[wi] = wi === 0 ? 0 : acc[wi - 1] + WORLDS[wi - 1].data.length;
    return acc;
}, {});