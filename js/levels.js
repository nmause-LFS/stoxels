

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

        // 10x10
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
        bonusHint: "Answer the bonus question correctly",
        bonusHintDE: "Beantworte die Bonusfrage richtig",
        bonusType: "quiz",
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
        bonusHint: "Finish in under 10 Minutes",
        bonusHintDE: "Beende das Level in unter 10 Minuten",
        bonusType: "fast",
        bonusParam: 600,
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
        bonusHint: "Complete the level without using any items",
        bonusHintDE: "Beende das Level ohne Items zu nutzen",
        bonusType: "noitem",
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
        bonusHint: "Complete the level with at most 5 mistakes",
        bonusHintDE: "Beende das Level mit höchstens 5 Fehlern",
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

    {   // 5x5
        hint: "Unequal",
        hintDE: "Ungleich",
        reveal: "The typical notation to denote that two parameters are not equal",
        revealDE: "Die typische Notation für die Ungleichheit zweier Parameter",
        timer: 1800,
        bonusHint: "Finish within 30 seconds",
        bonusHintDE: "Beende das Level in weniger als 30 Sekunden",
        bonusType: "fast",
        bonusParam: 30,
        grid: G(
        [0,0,1,0,0],[1,1,1,1,1],[0,0,1,0,0],
        [1,1,1,1,1],[0,0,1,0,0]
    )
    },

    {
        // 5x5
        hint: "Impossible Event",
        hintDE: "Unmögliches Ereignis",
        reveal: "An event that cannot occur will always have probability 0",
        revealDE: "Ein Ereignis, das nicht eintreten kann, hat immer die Wahrscheinlichkeit 0",
        timer: 1800,
        bonusHint: "Finish with 0 mistakes",
        bonusHintDE: "Ohne Fehler abschließen",
        bonusType: "nomiss",
        bonusParam: 0,
        grid: G([0, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 1, 1, 0])
    },

    {
        // 5x5
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

    {   // 10x10
        hint: "Odds",
        hintDE: "Chance",
        reveal: "The odds of an event A with occurance probability p = P(A) is defined as p/(1-p)",
        revealDE: "Die Chance eines Ereignisses A mit Eintrittswahrscheinlichkeit p=P(A) ist definiert durch p/(1-p)",
        timer: 1800,
        bonusHint: "Anser the bonus question correctly",
        bonusHintDE: "Beantworte die Bonusfrage richtig",
        bonusType: "quiz",
        bonusParam: 0,
        grid: G(
        [0,0,0,1,1,1,0,0,0,0],[0,0,0,1,0,1,0,0,0,0],[0,0,0,1,1,1,0,0,0,0],
        [0,0,0,1,0,0,0,0,0,0],[1,1,1,1,1,1,1,1,1,1],[0,0,0,0,0,0,0,0,0,0],
        [1,0,0,0,0,0,1,1,1,0],[1,0,1,1,1,0,1,0,1,0],[1,0,0,0,0,0,1,1,1,0],
        [1,0,0,0,0,0,1,0,0,0]
    )
    },

    {   // 5x20
        hint: "Draw without Replacement",
        hintDE: "Ziehen ohne Zurücklegen",
        reveal: "When drawing without replacement you need to assume that the elements are different for different i and j",
        revealDE: "Beim Ziehen ohne Zurücklegen muss in der formalen Darstellung angenommen werden, dass die Elemente verschieden sind",
        timer: 1800,
        bonusHint: "Answer the bonus question correctly",
        bonusHintDE: "Beantworte die Bonusfrage richtig",
        bonusType: "quiz",
        bonusParam: 0,
        grid: G(
        [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],[0,0,0,1,1,0,1,0,1,1,1,0,0,0,0,1,1,0,0,0],[1,0,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1],
        [1,0,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1,0,0,1],[1,1,1,1,1,0,1,0,0,1,0,0,1,1,1,1,1,0,1,1]
    )
    },


    {   // 5x20
        hint: "Laplace - Room",
        hintDE: "Laplace-Raum",
        reveal: "A Laplace-Room consists of a finite sample space and the discrete union distribution P",
        revealDE: "Ein Laplace-Room besteht aus einer endlichen Ergebnismenge und der diskreten Gleichverteilung P",
        timer: 1800,
        bonusHint: "Finish with at most 3 mistakes",
        bonusHintDE: "Beende das Level mit höchstens 3 Fehlern",
        bonusType: "lowmiss",
        bonusParam: 3,
        grid: G(
        [0,1,1,0,0,0,1,0,0,0,0,0,0,1,1,1,0,1,1,0],[0,1,0,0,0,1,0,1,0,0,0,0,0,1,0,1,0,0,1,0],[0,1,0,0,1,0,0,0,1,0,0,0,0,1,1,1,0,0,1,0],
        [0,1,0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,1,0],[0,1,1,0,1,1,0,1,1,0,1,0,0,1,0,0,0,1,1,0]
    )
    },


    {
        // 10x10
        hint: "Algebra",
        hintDE: "Algebra",
        reveal: "We usually denote a Sigma-Algebra with A or σ",
        revealDE: "Eine Sigma-Algebra wird üblicherweise mit A oder σ bezeichnet",
        timer: 1800,
        bonusHint: "Use no items",
        bonusHintDE: "Keine Items verwenden",
        bonusType: "noitem",
        bonusParam: 0,
        grid: G([0, 0, 0, 0, 1, 1, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 1, 0, 1, 0], [1, 0, 1, 1, 0, 0, 0, 1, 1, 0], [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 1, 0, 0], [0, 0, 0, 1, 1, 1, 0, 0, 0, 0], [0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 0, 0, 0, 0])
    },


    {   // 15x25
        hint: "Discrete Uniform Distribution",
        hintDE: "Diskrete Gleichverteilung",
        reveal: "For a sample space with K elements the discrete uniform distribution is defined as 1/K",
        revealDE: "Für eine Ergebnismenge mit K Elementen ist die diskrete Gleichverteilung definiert durch 1/K",
        timer: 1800,
        bonusHint: "Finish within 10 Minutes",
        bonusHintDE: "Beende das Level in 10 Minuten",
        bonusType: "fast",
        bonusParam: 600,
        grid: G(
        [0,0,1,1,1,0,1,1,0,1,1,0,0,0,0,0,0,0,1,1,0,1,1,0,0],[0,0,1,0,1,0,1,0,0,1,0,0,0,0,0,1,1,0,0,1,0,0,1,0,0],[0,0,1,1,1,0,1,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0],
        [0,0,1,0,0,0,1,0,0,1,0,0,1,0,1,0,1,0,0,1,0,0,1,0,0],[0,0,1,0,0,0,1,1,0,1,1,0,1,1,1,1,1,0,1,1,0,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,1,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0]
    )
    },

    {   // 15x25
        hint: "Conditional Expectation",
        hintDE: "Bedingte Wahrscheinlichkeit",
        reveal: "This is the definition of P(A|B) when P(B)>0",
        revealDE: "Dies ist die Definition von P(A|B) wenn P(B)>0 ist",
        timer: 1800,
        bonusHint: "Answer the bonus question correctly",
        bonusHintDE: "Beantworte die Bonusfrage richtig",
        bonusType: "quiz",
        bonusParam: 0,
        grid: G(
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,1,0,1,1,0,1,1,1,0,0,0,0,0,1,1,1,0,1,1,0,0],[0,0,1,0,1,0,1,0,0,1,0,1,0,1,1,1,0,1,0,1,0,0,1,0,0],
        [0,0,1,1,1,0,1,0,0,1,1,1,0,1,0,1,0,1,1,1,0,0,1,0,0],[0,0,1,0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,0],[0,0,1,0,0,0,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0],[0,0,0,0,0,0,1,0,0,0,1,1,0,1,1,1,0,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    )
    },

    {
        // 20x20
        hint: "Union Bound",
        hintDE: "Boolesche Ungleichung",
        reveal: "The union bound states that the probability of a union is bounded by the sum of probabilities",
        revealDE: "Die Boolsche Ungleichung besagt, dass die Wahrscheinlichkeit einer Vereinigung beschränkt ist durch die Summe der einzelnen Wahrscheinlichkeiten",
        timer: 1800,
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


    {   // 15x40
        hint: "Inclusion-Exclusion-Principle",
        hintDE: "Siebformel",
        reveal: "The Inclusion-Exclusion-Principle is used for calculating the probability of the union of two events",
        revealDE: "Die Siebformel kann zur Berechnung der Wahrscheinlichkeit einer Vereinigung verwendet werden",
        timer: 1800,
        bonusHint: "Finish with at most 10 mistakes",
        bonusHintDE: "Beende das Level mit höchstens 10 Fehlern",
        bonusType: "lowmiss",
        bonusParam: 10,
        grid: G(
        [0,0,0,0,0,0,0,1,1,1,0,1,1,0,1,1,1,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,1,0,0,1,1,1,0,1,0,1,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,0,0,0,1,1,0,1,0,1,0,1,1,1,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,0,0,0,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,0,0,0],
        [0,1,1,1,0,1,0,1,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0,1,0,1,0,0,1,0,1,0,0,1,0,0,0,0],[0,0,0,0,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,1,1,1,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,0,0,0],[0,1,1,1,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0],
        [0,0,0,0,0,1,0,0,0,1,1,0,1,0,1,0,1,1,0,0,0,0,0,1,0,0,0,1,1,0,1,1,1,0,1,1,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,0,1,1,1,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,1,1,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,1,0,0,1,1,1,0,1,0,0,1,1,1,0,1,0,1,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0]
    )
    },

];


const W3 = [

    {
        // 5x5
        hint: "Random Variable",
        hintDE: "Zufallsvariable",
        reveal: "X is typically a random variable",
        revealDE: "X ist typischerweise eine Zufallsvariable",
        timer: 1800,
        bonusHint: "Finish with 0 mistakes",
        bonusHintDE: "Ohne Fehler abschließen",
        bonusType: "nomiss",
        bonusParam: 0,
        grid: G([1, 0, 0, 0, 1], [0, 1, 0, 1, 0], [0, 0, 1, 0, 0], [0, 1, 0, 1, 0], [1, 0, 0, 0, 1])
    },


    {   // 5x10
        hint: "Infinity",
        hintDE: "Unendlichkeit",
        reveal: "The typical notation for infinity",
        revealDE: "Die typische Notation für unendlich",
        timer: 1800,
        bonusHint: "Finish with 0 mistakes",
        bonusHintDE: "Beende das Level ohne Fehler",
        bonusType: "nomiss",
        bonusParam: 0,
        grid: G(
        [1,1,1,0,0,0,0,1,1,1],[1,0,0,1,0,0,1,0,0,1],[1,0,0,0,1,1,0,0,0,1],
        [1,0,0,1,0,0,1,0,0,1],[1,1,1,1,0,0,1,1,1,1]
    )
    },

    {   // 5x20
        hint: "Distribution Function",
        hintDE: "Verteilungsfunktion",
        reveal: "This is the definition of the distribution function of X",
        revealDE: "Dies ist die Definition der Verteilungsfunktion von X",
        timer: 1800,
        bonusHint: "Finish without any mistakes",
        bonusHintDE: "Beende das Level ohne Fehler",
        bonusType: "nomiss",
        bonusParam: 0,
        grid: G(
        [1,1,1,0,1,1,0,1,0,0,0,1,0,0,0,0,0,0,1,1],[1,0,1,0,1,0,0,0,1,0,1,0,0,1,0,1,0,1,0,1],[1,1,1,0,1,0,0,0,0,1,0,0,1,0,0,0,1,0,0,1],
        [1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,1,0,1,0,1],[1,0,0,0,1,1,0,1,0,0,0,1,0,0,0,0,0,0,1,1]
    )
    },

    {
        // 5x25
        hint: "Distribution of a Random Variable",
        hintDE: "Verteilung einer Zufallsvariable",
        reveal: "This is the definition of the distribution of a random variable",
        revealDE: "Dies ist die Definition der Verteilung einer Zufallsvariable",
        timer: 1800,
        bonusHint: "Finish with at most 3 mistakes",
        bonusHintDE: "Beende das Level mit höchstens 3 Fehlern",
        bonusType: "lowmiss",
        bonusParam: 3,
        grid: G(
        [1,1,1,0,1,1,0,1,0,0,0,1,0,1,1,1,0,1,1,1,1,0,1,1,0],[1,0,1,0,1,0,0,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0],[1,1,1,0,1,0,0,0,0,1,0,0,0,1,1,1,0,1,1,1,1,0,0,1,0],
        [1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0],[1,0,0,0,1,1,0,1,0,0,0,1,0,1,1,1,0,1,0,0,1,0,1,1,0]
    )
    },

    {   // 10x15
        hint: "Exponential Distribution",
        hintDE: "Exponentialverteilung",
        reveal: "This is the distribution function of an exponential distribution for x>0",
        revealDE: "Dies ist die Verteilungsfunktion einer Exponentialverteilung im Fall x > 0",
        timer: 1800,
        bonusHint: "Answer the bonus question correctly",
        bonusHintDE: "Beantworte die Bonusfrage richtig",
        bonusType: "quiz",
        bonusParam: 0,
        grid: G(
        [1,1,1,0,1,1,0,0,0,1,1,0,0,0,0],[1,0,0,0,1,0,1,0,1,0,1,0,1,1,1],[1,1,1,0,1,0,0,1,0,0,1,0,0,0,0],
        [1,0,0,0,1,0,1,0,1,0,1,0,1,1,1],[1,0,0,0,1,1,0,0,0,1,1,0,0,0,0],[1,0,0,0,0,0,1,1,1,0,0,0,1,0,1],
        [1,0,0,0,0,0,1,0,1,0,1,1,0,1,0],[1,0,1,1,0,0,1,1,1,0,0,0,1,0,1],[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
        [1,0,0,0,0,0,1,1,1,0,0,0,0,0,0]
    )
    },


    {
        // 15x15
        hint: "Probability Tree",
        hintDE: "Wahrscheinlichkeitsbaum",
        reveal: "This is a graphical representation of a probability tree",
        revealDE: "Dies ist eine graphische Darstellung eines Wahrscheinlichkeitsbaumes",
        timer: 1800,
        bonusHint: "Finish within 10 Minutes",
        bonusHintDE: "Beende das Level in weniger als 10 Minuten",
        bonusType: "fast",
        bonusParam: 600,
        grid: G(
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
        [0,0,0,0,0,1,0,0,0,1,0,0,0,0,0],[0,0,0,0,1,0,0,0,0,0,1,0,0,0,0],[0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
        [0,1,1,1,0,0,0,0,0,0,0,1,1,1,0],[0,1,1,1,0,0,0,0,0,0,0,1,1,1,0],[0,1,0,1,1,0,0,0,0,0,1,1,0,1,0],
        [0,1,0,0,1,0,0,0,0,0,1,0,0,1,0],[0,1,0,0,1,0,0,0,0,0,1,0,0,1,0],[1,1,1,0,1,1,1,0,1,1,1,0,1,1,1],
        [1,1,1,0,1,1,1,0,1,1,1,0,1,1,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    )
    },
    


    {   // 15x25
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

    {   // 20x20
        hint: "Quantile Function",
        hintDE: "Quantilfunktion",
        reveal: "This is the definition of the quantile function",
        revealDE: "Dies ist die Definition der Quantilfunktion",
        timer: 1800,
        bonusHint: "Finish in under 10 minutes",
        bonusHintDE: "Beende das Level in weniger als 10 Minuten",
        bonusType: "fast",
        bonusParam: 600,
        grid: G(
        [1,1,1,0,0,0,1,0,1,1,0,0,0,0,0,1,1,0,0,0],[1,0,0,1,1,0,1,0,1,0,0,1,1,1,0,0,1,0,0,0],[1,1,1,0,0,0,1,0,1,0,0,1,0,1,0,0,1,0,0,0],
        [1,0,0,0,0,0,0,0,1,0,0,1,1,1,0,0,1,0,0,0],[1,0,0,0,0,0,0,0,1,1,0,1,0,0,0,1,1,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
        [0,1,1,1,0,1,1,1,1,1,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0],[0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,1,0,0,0,0,0,1,1,0,1,1,1,0,0,0,1,1,1,0],[0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,0,0],
        [1,0,0,0,1,0,0,1,1,0,1,1,1,0,0,0,1,1,1,0],[0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,0,0],[0,1,0,0,0,0,0,1,1,0,1,0,0,1,0,0,1,0,0,0],
        [1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0],[1,0,1,0,1,0,1,0,1,0,0,1,1,1,0,1,0,0,0,0],[1,0,0,1,0,0,1,0,0,1,0,1,0,1,0,0,1,0,0,0],
        [1,0,1,0,1,0,1,0,1,0,0,1,1,1,0,1,0,0,0,0],[1,1,0,0,0,1,1,0,0,0,0,1,0,0,0,1,0,0,0,0]
    )
    }, 


    {   // 13x40
        hint: "P(A_i | B) = ?",
        hintDE: "P(A_i | B) = ?",
        reveal: "This is the Bayes - Theorem",
        revealDE: "Dies ist der Satz von Bayes",
        timer: 1800,
        bonusHint: "Answer the bonus question correctly",
        bonusHintDE: "Beantworte die Bonusfrage richtig",
        bonusType: "quiz",
        bonusParam: 0,
        grid: G(
        [1,1,1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,0,0,1,1,0,0,0,1,1,1,0,1,1,0,1,1,1,0,0,0,1,1,0],[1,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1,0],[1,1,1,0,1,0,0,1,1,1,0,1,0,1,1,1,0,0,0,0,1,0,1,0,1,1,1,0,1,0,0,1,1,1,0,0,0,0,1,0],
        [1,0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,1,0,1,0,0,1,0],[1,0,0,0,1,1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,1,0,0,0,1,0,0,0,1,1,0,1,0,1,0,1,0,1,1,0],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    )
    },

    {
        // 10x35
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
        [0,0,0,0,0,0,0,1,1,1,0,1,1,0,1,1,1,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,1,1,0,1,0,1,0,0,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,1,0,0,1,1,1,0,1,0,1,0,1,1,1,0,0,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,0,0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,0,0,0,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1,1,0,0,0,0,0,0,0],[0,0,0,0,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,0,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0],
        [0,1,1,1,0,1,0,1,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0,1,0,1,0,0,1,0,1,0,0,1,0],[0,0,0,0,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0,1,0,1,1,1,0,1,0,0,1,1,1,0,0,1,0],[0,1,1,1,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,1,0,1,0,0,1,0],
        [0,0,0,0,0,1,0,0,0,1,1,0,1,0,1,0,1,1,0,0,0,1,0,0,0,1,1,0,1,1,1,0,1,1,0]
    )
    },


    {
            //15x30
        hint: "Interval Probability",
        hintDE: "Intervallwahrscheinlichkeit",
        reveal: "This is how you can calculate the probability of a (continuous) random variable X being in an interval [a,b]",
        revealDE: "Mit dieser Formel lässt sich die Wahrscheinlichkeit berechnen, dass eine stetige Zufallsvariable X im Intervall [a,b] liegt",
        timer: 1800,
        bonusHint: "Answer the bonus question correctly",
        bonusHintDE: "Beantworte die Bonusfrage richtig",
        bonusType: "quiz",
        bonusParam: 0,
        grid: G(
        [1,1,1,0,1,1,0,1,1,0,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,0,0,0,1,1],[1,0,1,0,1,0,0,0,0,1,0,0,1,0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,1],[1,1,1,0,1,0,0,1,1,1,0,1,0,0,0,0,0,1,0,0,1,0,0,0,1,1,1,0,0,1],
        [1,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1],[1,0,0,0,1,1,0,1,1,1,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,1,1,0,1,1],[0,0,0,0,0,0,1,1,1,0,1,1,0,1,0,0,0,1,0,0,1,0,1,0,0,0,1,1,0,0],
        [0,0,1,1,1,0,1,0,1,0,1,0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,1,0,0],[0,0,0,0,0,0,1,1,1,0,1,0,0,0,0,1,0,0,1,0,0,0,1,1,1,0,0,1,0,0],[0,0,1,1,1,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0],
        [0,0,0,0,0,0,1,0,0,0,1,1,0,1,0,0,0,1,0,0,1,0,1,1,1,0,1,1,0,0],[0,0,0,0,0,0,1,1,1,0,1,1,0,1,0,0,0,1,0,0,1,0,1,1,0,0,1,1,0,0],[0,0,0,0,0,0,1,0,1,0,1,0,0,0,1,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0],
        [0,0,1,1,1,0,1,1,1,0,1,0,0,0,0,1,0,0,1,0,0,0,1,1,1,0,0,1,0,0],[0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0,1,0,0],[0,0,0,0,0,0,1,0,0,0,1,1,0,1,0,0,0,1,0,0,1,0,1,1,1,0,1,1,0,0]
    )
    },






];




const W4 = [
    {
        // 5x5
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
                
                     
];




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