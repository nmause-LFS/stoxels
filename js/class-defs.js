
/*
    ------------------------------------------------------------------------
    -----------------------CLASS DEFINITIONS--------------------------------
    ------------------------------------------------------------------------
    ------------------------------------------------------------------------
*/


const CLASS_DEFS = {

    // MATHMAGICIAN (Mage archetype) 
    mathmagician: {
        id: 'mathmagician',
        icon: '🔮',
        nameEn: 'Mathmagician',
        nameDE: 'Mathemagier',
        descEn: 'Wield the arcane power of probability. Master of chance and revelation.',
        descDE: 'Führe die arkane Macht der Wahrscheinlichkeit. Meister des Zufalls und Chancen.',
        color: '#9b59b6',
        colorLight: '#c39bd3',

        passive: {
            nameEn: 'Variance Shield',
            nameDE: 'Varianzschild',
            levels: [
                {
                    level: 1,
                    descEn: 'Start each level with 1 free mistake.',
                    descDE: 'Beginne jedes Level mit 1 freiem Fehler.',
                    effect: { freeMistakes: 1 }
                },
                {
                    level: 2,
                    descEn: 'Start each level with 2 free mistakes.',
                    descDE: 'Beginne jedes Level mit 2 freien Fehlern.',
                    effect: { freeMistakes: 2 }
                },
                {
                    level: 3,
                    descEn: 'Start each level with 3 free mistakes.',
                    descDE: 'Beginne jedes Level mit 3 freien Fehlern.',
                    effect: { freeMistakes: 3 }
                },
            ]
        },

        active1: {
            nameEn: 'Arcane Reveal',
            nameDE: 'Arkane Enthüllung',
            descCursorEn: 'Click a cell to reveal it and its neighbours',
            descCursorDE: 'Klicke eine Zelle, um sie und ihre Nachbarn zu enthüllen',
            cooldownSeconds: 420, //
            levels: [
                {
                    level: 1,
                    descEn: 'Click a cell to reveal the correct state of all cells within 1 step. Cooldown: 7 minutes.',
                    descDE: 'Klicke eine Zelle, um alle Zellen im Umkreis von 1 Schritt zu enthüllen. Abklingzeit: 7 Minuten.',
                    effect: { radius: 1 }
                },
                {
                    level: 2,
                    descEn: 'Click a cell to reveal the correct state of all cells within 2 steps. Cooldown: 7 minutes.',
                    descDE: 'Klicke eine Zelle, um alle Zellen im Umkreis von 2 Schritten zu enthüllen. Abklingzeit: 7 Minuten.',
                    effect: { radius: 2 }
                },
                {
                    level: 3,
                    descEn: 'Click a cell to reveal the correct state of all cells within 3 steps. Cooldown: 7 minutes.',
                    descDE: 'Klicke eine Zelle, um alle Zellen im Umkreis von 3 Schritten zu enthüllen. Abklingzeit: 7 Minuten.',
                    effect: { radius: 3 }
                },
            ]
        },

        active2: {
            nameEn: 'Absolute Zero',
            nameDE: 'Absoluter Nullpunkt',
            descCursorEn: 'Click a cell to freeze time and click without causing mistakes',
            descCursorDE: 'Klicke eine Zelle zum Einfrieren der Zeit und klicke danach schnell ohne Fehler zu verursachen',
            cooldownSeconds: 300,
            levels: [
                {
                    level: 1,
                    descEn: 'Freeze the timer for 1s. Mistakes cause no penalties. Cooldown: 5 minutes.',
                    descDE: 'Friere die Zeit für 1s ein. Fehler verursachen keine Strafen. Abklingzeit: 5 Minuten.',
                    effect: { freezeDuration: 1000 }
                },
                {
                    level: 2,
                    descEn: 'Freeze the timer for 1.5s. Mistakes cause no penalties. Cooldown: 5 minutes.',
                    descDE: 'Friere die Zeit für 1.5 ein. Fehler verursachen keine Strafen. Abklingzeit: 5 Minuten.',
                    effect: { freezeDuration: 1500 }
                },
                {
                    level: 3,
                    descEn: 'Freeze the timer for 2s. Mistakes cause no penalties. Cooldown: 5 minutes.',
                    descDE: 'Friere die Zeit für 2s ein. Fehler verursachen keine Strafen. Abklingzeit: 5 Minuten.',
                    effect: { freezeDuration: 2000 }
                },
            ]
        },

    },

    // STATISTICIAN (Warrior archetype)
    statistician: {
        id: 'statistician',
        icon: '⚔️',
        nameEn: 'Statistician',
        nameDE: 'Statistiker',
        descEn: 'Harness the power of data. Every mistake is a sample. Every victory is a distribution.',
        descDE: 'Nutze die Macht der Daten aus. Jeder Fehler ist eine Stichprobe. Jeder Sieg eine Verteilung.',
        color: '#e74c3c',
        colorLight: '#f1948a',

        passive: {
            nameEn: 'Momentum',
            nameDE: 'Schwung',
            levels: [
                {
                    level: 1,
                    descEn: 'Every 10 correct fills in a row grant +10 seconds added to the timer.',
                    descDE: '10 korrekte Klicks hintereinander geben +10 Sekunden mehr Zeit.',
                    effect: { streakForBonus: 10, bonusSeconds: 10 }
                },
                {
                    level: 2,
                    descEn: 'Every 9 correct fills in a row grant +15 seconds added to the timer.',
                    descDE: '9 korrekte Klicks hintereinander geben +15 Sekunden mehr Zeit.',
                    effect: { streakForBonus: 9, bonusSeconds: 15 }
                },
                {
                    level: 3,
                    descEn: 'Every 8 correct fills in a row grant +20 seconds added to the timer.',
                    descDE: '8 korrekte Klicks hintereinander geben +20 Sekunden mehr Zeit.',
                    effect: { streakForBonus: 8, bonusSeconds: 20 }
                },
            ]
        },

        active1: {
            nameEn: 'Data Strike',
            nameDE: 'Datenhieb',
            descCursorEn: 'Click a cell to make your choice between row or column.',
            descCursorDE: 'Klicke auf eine Zelle um deine Wahl zwischen Zeile oder Spalte zu treffen.',
            cooldownSeconds: 300,
            levels: [
                {
                    level: 1,
                    descEn: 'Choose between instantly solving 1 random unsolved row or column. Cooldown: 5 minutes.',
                    descDE: 'Wähle zwischen dem sofortigen Lösen einer ungelösten Zeile oder Spalte. Abklingzeit: 5 Minuten.',
                    effect: { solveCount: 1 }
                },
                {
                    level: 2,
                    descEn: 'Choose between instantly solving 2 random unsolved rows or columns. Cooldown: 5 minutes.',
                    descDE: 'Wähle zwischen dem sofortigen Lösen von 2 ungelösten Zeilen oder Spalten. Abklingzeit: 5 Minuten.',
                    effect: { solveCount: 2 }
                },
                {
                    level: 3,
                    descEn: 'Choose between instantly solving 3 random unsolved rows or columns. Cooldown: 5 minutes.',
                    descDE: 'Wähle zwischen dem sofortigen Lösen von 3 ungelösten Zeilen oder Spalten. Abklingzeit: 5 Minuten.',
                    effect: { solveCount: 3 }
                },
            ]
        },

        active2: {
            nameEn: 'Diagonal Strike',
            nameDE: 'Diagonalschlag',
            descCursorEn: 'Select a cell to strike.',
            descCursorDE: 'Wähle eine Zelle zum Zuschlagen aus.',
            cooldownSeconds: 180,
            levels: [
                {
                    level: 1,
                    descEn: 'Strike diagonally through a cell. Cooldown: 3 minutes.',
                    descDE: 'Gehe diagonal durch eine Zelle. Abklingzeit: 3 Minuten.',
                    effect: { diagonals: 1 }
                },
                {
                    level: 2,
                    descEn: 'Strike diagonally through a cell. Covers both diagonals. Cooldown: 3 minutes.',
                    descDE: 'Gehe diagonal durch eine Zelle. Erfasst beide Diagonalen. Abklingzeit: 3 Minuten.',
                    effect: { diagonals: 2 }
                },
                {
                    level: 3,  
                    descEn: 'Strike diagonally, horizontally and vertically through a cell. Cooldown: 3 minutes.',
                    descDE: 'Gehe diagonal, horizontal und vertikal durch eine Zelle. Abklingzeit: 3 Minuten.',
                    effect: { diagonals: 4 }
                },
            ]
        },

    },

    // PROBABILIST (Ranger archetype) 
    probabilist: {
        id: 'probabilist',
        icon: '🎯',
        nameEn: 'Probabilist',
        nameDE: 'Probabilist',
        descEn: 'Calculate the odds. Strike with precision. The sample space is your hunting ground.',
        descDE: 'Berechne die Chancen. Schlage präzise zu. Die Ergebnismenge ist dein Jagdrevier.',
        color: '#27ae60',
        colorLight: '#58d68d',

        passive: {
            nameEn: 'Bayesian Insight',
            nameDE: 'Bayesianische Einsicht',
            levels: [
                {
                    level: 1,
                    descEn: 'When the level loads, 2 random empty cells are automatically marked with ✕.',
                    descDE: 'Beim Laden des Levels werden 2 zufällige leere Zellen automatisch mit ✕ markiert.',
                    effect: { autoMarkCount: 2 }
                },
                {
                    level: 2,
                    descEn: 'When the level loads, 5 random empty cells are automatically marked with ✕.',
                    descDE: 'Beim Laden des Levels werden 5 zufällige leere Zellen automatisch mit ✕ markiert.',
                    effect: { autoMarkCount: 5 }
                },
                {
                    level: 3,
                    descEn: 'When the level loads, 10 random empty cells are automatically marked with ✕.',
                    descDE: 'Beim Laden des Levels werden 10 zufällige leere Zellen automatisch mit ✕ markiert.',
                    effect: { autoMarkCount: 10 }
                },
            ]
        },

        active1: {
            nameEn: 'Precision Mark',
            nameDE: 'Präzisionsmarkierung',
            descCursorEn: 'Click a cell to mark all wrong cells in its row and column with ✕',
            descCursorDE: 'Klicke eine Zelle, um alle falschen Zellen in Zeile und Spalte mit ✕ zu markieren',
            cooldownSeconds: 300,
            levels: [
                {
                    level: 1,
                    descEn: 'Click a cell to mark all wrong cells in that row and column with ✕. Cooldown: 5 minutes.',
                    descDE: 'Klicke eine Zelle um alle falschen Zellen in dieser Zeile und Spalte mit einem ✕ zu markieren. Abklingzeit: 5 Minuten.',
                    effect: { crossMark: true, extraLines: 0 }
                },
                {
                    level: 2,
                    descEn: 'Click a cell to mark all wrong cells in that row, column and 1 adjacent row and column with ✕. Cooldown: 5 minutes.',
                    descDE: 'Klicke eine Zelle um alle falschen Zellen in dieser Zeile, Spalte, und 1 angrenzende Zeile und Spalte mit ✕ zu markieren. Abklingzeit: 5 Minuten',
                    effect: { crossMark: true, extraLines: 1 }
                },
                {
                    level: 3,
                    descEn: 'Click a cell to mark all wrong cells in that row, column and 2 adjacent rows and columns with ✕. Cooldown: 5 minutes.',
                    descDE: 'Klicke eine Zelle um alle falschen Zellen in dieser Zeile, Spalte, und 2 angrenzenden Zeilen und Spalten mit ✕ zu markieren. Abklingzeit: 5 Minuten',
                    effect: { crossMark: true, extraLines: 2 }
                },
            ]
        },

        active2: {
            nameEn: 'Field Scan',
            nameDE: 'Feldscan',
            descCursorEn: 'Click a cell to scan a random region',
            descCursorDE: 'Klicke eine Zelle zum Scannen einer zufälligen Region!',
            cooldownSeconds: 120,
            levels: [
                {
                    level: 1,
                    descEn: 'Reveals a random 4×4 region for 1 second — correct tiles glow green, empty tiles show ✕. Cooldown: 2 minutes.',
                    descDE: 'Enthüllt eine zufällige 4×4-Region für 1 Sekunde — richtige Felder leuchten grün, leere zeigen ✕. Abklingzeit: 2 Minuten.',
                    effect: { scanSize: 4, scanDuration: 1000 }
                },
                {
                    level: 2,
                    descEn: 'Reveals a random 6×6 region for 2 seconds — correct tiles glow green, empty tiles show ✕. Cooldown: 2 minutes.',
                    descDE: 'Enthüllt eine zufällige 6×6-Region für 2 Sekunden — richtige Felder leuchten grün, leere zeigen ✕. Abklingzeit: 2 Minuten.',
                    effect: { scanSize: 6, scanDuration: 2000 }
                },
                {
                    level: 3,
                    descEn: 'Reveals a random 8×8 region for 3 seconds — correct tiles glow green, empty tiles show ✕. Cooldown: 2 minutes.',
                    descDE: 'Enthüllt eine zufällige 8×8-Region für 3 Sekunden — richtige Felder leuchten grün, leere zeigen ✕. Abklingzeit: 2 Minuten.',
                    effect: { scanSize: 8, scanDuration: 3000 }
                },
            ]
        },
    }
};

const CLASS_LIST = ['statistician', 'mathmagician', 'probabilist'];




//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


