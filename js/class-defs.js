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


/*
    ------------------------------------------------------------------------
    -------------------ASCENDENCY CLASS DEFINITIONS-------------------------
    ------------------------------------------------------------------------
    Unlocked after all 3 base class skills reach Rank 3.
    Each base class has exactly 2 ascendency options.
    Each ascendency has 2 active skills, each with 3 ranks.
    ------------------------------------------------------------------------
*/

const ASCENDENCY_DEFS = {

    // ── STATISTICIAN ASCENDENCIES ────────────────────────────────────────

    outlier: {
        id: 'outlier',
        parentClass: 'statistician',
        icon: '📈',
        nameEn: 'Outlier',
        nameDE: 'Ausreißer',
        descEn: 'You are not an anomaly. You are the only data point that matters.',
        descDE: 'Du bist keine Anomalie. Du bist der einzige Datenpunkt, der zählt.',
        color: '#e74c3c',
        colorLight: '#f1948a',
        archetype: 'Berserker',

        active1: {
            nameEn: 'Tail Risk',
            nameDE: 'Tail-Risiko',
            descCursorEn: 'Opens an input panel — choose how many seconds to sacrifice for reveals.',
            descCursorDE: 'Öffnet ein Eingabefenster — wähle, wie viele Sekunden du für Enthüllungen opferst.',
            cooldownSeconds: 240,
            levels: [
                {
                    level: 1,
                    descEn: 'Trade 60s per cell revealed. Maximum 3 cells. Cooldown: 4 minutes.',
                    descDE: 'Opfere 60s pro enthüllter Zelle. Maximal 3 Zellen. Abklingzeit: 4 Minuten.',
                    effect: { secondsPerCell: 60, maxCells: 3 }
                },
                {
                    level: 2,
                    descEn: 'Trade 45s per cell revealed. Maximum 5 cells. Cooldown: 4 minutes.',
                    descDE: 'Opfere 45s pro enthüllter Zelle. Maximal 5 Zellen. Abklingzeit: 4 Minuten.',
                    effect: { secondsPerCell: 45, maxCells: 5 }
                },
                {
                    level: 3,
                    descEn: 'Trade 30s per cell revealed. Maximum 8 cells. Cooldown: 4 minutes.',
                    descDE: 'Opfere 30s pro enthüllter Zelle. Maximal 8 Zellen. Abklingzeit: 4 Minuten.',
                    effect: { secondsPerCell: 30, maxCells: 8 }
                },
            ]
        },

        active2: {
            nameEn: 'Black Swan',
            nameDE: 'Schwarzer Schwan',
            descCursorEn: 'Enter hyper-momentum — every correct fill triggers a Momentum bonus.',
            descCursorDE: 'Betrete Hyper-Schwung — jede korrekte Füllung löst einen Schwung-Bonus aus.',
            cooldownSeconds: 300,
            levels: [
                {
                    level: 1,
                    descEn: 'Active for 10s. Every correct fill triggers Momentum. Any mistake triples penalty and ends the effect. Cooldown: 5 minutes.',
                    descDE: 'Aktiv für 10s. Jede korrekte Füllung löst Schwung aus. Fehler verdreifachen die Strafe und beenden den Effekt. Abklingzeit: 5 Minuten.',
                    effect: { duration: 10000, streakThreshold: 1 }
                },
                {
                    level: 2,
                    descEn: 'Active for 20s. Every correct fill triggers Momentum. Any mistake triples penalty and ends the effect. Cooldown: 5 minutes.',
                    descDE: 'Aktiv für 20s. Jede korrekte Füllung löst Schwung aus. Fehler verdreifachen die Strafe und beenden den Effekt. Abklingzeit: 5 Minuten.',
                    effect: { duration: 20000, streakThreshold: 1 }
                },
                {
                    level: 3,
                    descEn: 'Active for 30s. Every single correct fill triggers Momentum. Any mistake triples penalty and ends the effect. Cooldown: 5 minutes.',
                    descDE: 'Aktiv für 30s. Jede einzelne korrekte Füllung löst Schwung aus. Fehler verdreifachen die Strafe und beenden den Effekt. Abklingzeit: 5 Minuten.',
                    effect: { duration: 30000, streakThreshold: 1 }
                },
            ]
        },
    },

    actuary: {
        id: 'actuary',
        parentClass: 'statistician',
        icon: '🛡️',
        nameEn: 'Actuary',
        nameDE: 'Aktuar',
        descEn: 'Risk is not something to avoid. It is something to price correctly.',
        descDE: 'Risiko ist nichts, das man vermeidet. Es ist etwas, das man richtig bewertet.',
        color: '#e67e22',
        colorLight: '#f0a500',
        archetype: 'Paladin',

        active1: {
            nameEn: 'Regression to Prior',
            nameDE: 'Regression zum Prior',
            descCursorEn: 'Correct your most recent mistake cells and recover time penalties.',
            descCursorDE: 'Korrigiere deine letzten Fehlerzellen und erhalte Zeitstrafen zurück.',
            cooldownSeconds: 120,
            levels: [
                {
                    level: 1,
                    descEn: 'Correct the most recent 1 mistake cell. Recover 50% of the time penalty paid. Cooldown: 2 minutes.',
                    descDE: 'Korrigiere die letzte 1 Fehlerzelle. Erhalte 50% der gezahlten Zeitstrafe zurück. Abklingzeit: 2 Minuten.',
                    effect: { correctCount: 1, recoverPct: 0.5 }
                },
                {
                    level: 2,
                    descEn: 'Correct the most recent 2 mistake cells. Recover 50% of time penalties paid. Cooldown: 2 minutes.',
                    descDE: 'Korrigiere die letzten 2 Fehlerzellen. Erhalte 50% der gezahlten Zeitstrafen zurück. Abklingzeit: 2 Minuten.',
                    effect: { correctCount: 2, recoverPct: 0.5 }
                },
                {
                    level: 3,
                    descEn: 'Correct the most recent 3 mistake cells. Recover 100% of time penalties paid. Cooldown: 2 minutes.',
                    descDE: 'Korrigiere die letzten 3 Fehlerzellen. Erhalte 100% der gezahlten Zeitstrafen zurück. Abklingzeit: 2 Minuten.',
                    effect: { correctCount: 3, recoverPct: 1.0 }
                },
            ]
        },

        active2: {
            nameEn: 'Significance Threshold',
            nameDE: 'Signifikanzschwelle',
            descCursorEn: 'Click a row or column to protect — the next mistake there auto-corrects.',
            descCursorDE: 'Klicke eine Zeile oder Spalte zum Schützen — der nächste Fehler dort wird automatisch korrigiert.',
            cooldownSeconds: 180,
            levels: [
                {
                    level: 1,
                    descEn: 'Protect 1 row or column. The next mistake there is blocked and auto-corrects. Cooldown: 4 minutes.',
                    descDE: 'Schütze 1 Zeile oder Spalte. Der nächste Fehler dort wird blockiert und automatisch korrigiert. Abklingzeit: 3 Minuten.',
                    effect: { protectCount: 1, bonusReveal: false }
                },
                {
                    level: 2,
                    descEn: 'Protect up to 2 rows or columns simultaneously. Cooldown: 4 minutes.',
                    descDE: 'Schütze bis zu 2 Zeilen oder Spalten gleichzeitig. Abklingzeit: 3 Minuten.',
                    effect: { protectCount: 2, bonusReveal: false }
                },
                {
                    level: 3,
                    descEn: 'Protect up to 3 rows or columns. When triggered, also reveals 1 random correct cell in that line. Cooldown: 4 minutes.',
                    descDE: 'Schütze bis zu 3 Zeilen oder Spalten. Bei Auslösung wird auch 1 zufällige korrekte Zelle in dieser Linie enthüllt. Abklingzeit: 3 Minuten.',
                    effect: { protectCount: 3, bonusReveal: true }
                },
            ]
        },
    },

    // ── MATHMAGICIAN ASCENDENCIES ─────────────────────────────────────────

    recursionist: {
        id: 'recursionist',
        parentClass: 'mathmagician',
        icon: '💀',
        nameEn: 'Recursionist',
        nameDE: 'Rekursionist',
        descEn: 'Every error contains the seed of its own correction.',
        descDE: 'Jeder Fehler enthält den Keim seiner eigenen Korrektur.',
        color: '#8e44ad',
        colorLight: '#bb8fce',
        archetype: 'Necromancer',

        active1: {
            nameEn: 'Residual',
            nameDE: 'Residual',
            descCursorEn: 'Select a mistake cell to plant a Residual Totem - it fires a revealing beam every 20s to cells around it.',
            descCursorDE: 'Klicke eine Fehlerzelle, um einen Residual-Totem zu setzen - es feuert alle 20s einen Enthüllungs-Strahl auf Zellen um sich herum.',
            cooldownSeconds: 120,
            levels: [
                {
                    level: 1,
                    descEn: 'Plant a Residual Totem on a mistake cell. It fires a Revealing Beam every 20s to unfilled correct cells around it with radius 1. 3 Beam Charges. Cooldown: 2 minutes.',
                    descDE: 'Setze ein Residual-Totem auf eine Fehlerzelle. Es feuert einen Enthüllungs-Strahl alle 20s auf ungefüllte Zellen um sich herum mit Radius 1 ab. 3 Ladungen. Abklingzeit: 2 Minuten.',
                    effect: { beamRadius: 1, charges: 3, fires: 20 }
                },
                {
                    level: 2,
                    descEn: 'Plant a Residual Totem on a mistake cell. It fires a Revealing Beam every 15s to unfilled correct cells around it with radius 2. 4 Beam Charges. Cooldown: 2 minutes.',
                    descDE: 'Setze ein Residual-Totem auf eine Fehlerzelle. Es feuert einen Enthüllungs-Strahl alle 15s auf ungefüllte Zellen um sich herum mit Radius 2 ab. 4 Ladungen. Abklingzeit: 2 Minuten.',
                    effect: { beamRadius: 2, charges: 3, fires: 15 }
                },
                {
                    level: 3,
                    descEn: 'Plant a Residual Totem on a mistake cell. It fires a Revealing Beam every 10s to unfilled correct cells around it with radius 3. 6 Beam Charges. Cooldown: 2 minutes.',
                    descDE: 'Setze ein Residual-Totem auf eine Fehlerzelle. Es feuert einen Enthüllungs-Strahl alle 10s auf ungefüllte Zellen um sich herum mit Radius 3 ab. 6 Ladungen. Abklingzeit: 2 Minuten.',
                    effect: { beamRadius: 3, charges: 5, fires: 10 }
                },
            ]
        },

        active2: {
            nameEn: 'Degrees of Freedom',
            nameDE: 'Freiheitsgrade',
            descCursorEn: 'Select mistake cells to correct them and recover the paid time penalties.',
            descCursorDE: 'Wähle Fehlerzellen aus, um sie zu korrigieren und die gezahlten Zeitstrafen zurückzuerhalten.',
            cooldownSeconds: 180,
            levels: [
                {
                    level: 1,
                    descEn: 'Select 1 mistake cell to correct. Recover 50% of the time penalty paid. Cooldown: 3 minutes.',
                    descDE: 'Wähle 1 Fehlerzelle aus. Erhalte 50% der gezahlten Zeitstrafe zurück. Abklingzeit: 3 Minuten.',
                    effect: { correctCount: 1, recoverPct: 0.5 }
                },
                {
                    level: 2,
                    descEn: 'Select up to 2 mistake cells to correct. Recover 75% of time penalties paid. Cooldown: 3 minutes.',
                    descDE: 'Wähle bis zu 2 Fehlerzellen aus. Erhalte 75% der gezahlten Zeitstrafen zurück. Abklingzeit: 3 Minuten.',
                    effect: { correctCount: 2, recoverPct: 0.5 }
                },
                {
                    level: 3,
                    descEn: 'Select up to 3 mistake cells to correct. Recover 100% of time penalties paid. Cooldown: 3 minutes.',
                    descDE: 'Wähle bis zu 3 Fehlerzellen aus. Erhalte 100% der gezahlten Zeitstrafen zurück. Abklingzeit: 3 Minuten.',
                    effect: { correctCount: 3, recoverPct: 1.0 }
                },
            ]
        },
    },

    markovian: {
        id: 'markovian',
        parentClass: 'mathmagician',
        icon: '⏳',
        nameEn: 'Markovian',
        nameDE: 'Markovianer',
        descEn: 'The future depends only on the present. So change the present.',
        descDE: 'Die Zukunft hängt nur von der Gegenwart ab. Also ändere die Gegenwart.',
        color: '#2980b9',
        colorLight: '#7fb3d3',
        archetype: 'Chronomancer',

        active1: {
            nameEn: 'State Rollback',
            nameDE: 'Zustandsrücksetzer',
            descCursorEn: 'Roll back the puzzle to a previous state, undoing fills, marks and mistakes, and rewinding the timer.',
            descCursorDE: 'Setze das Rätsel auf einen früheren Zustand zurück, wobei Füllungen, Markierungen und Fehler rückgängig gemacht werden, und spule die Zeit zurück.',
            cooldownSeconds: 420,
            levels: [
                {
                    level: 1,
                    descEn: 'Rollback window 10s. Timer rewinds 10s. Mistakes within the window are erased. Cooldown: 7 minutes.',
                    descDE: 'Rücksetzfenster 10s. Timer spult 10s zurück. Fehler im Fenster werden gelöscht. Abklingzeit: 7 Minuten.',
                    effect: { windowSeconds: 10, rewindSeconds: 10, clearOldMistakes: false }
                },
                {
                    level: 2,
                    descEn: 'Rollback window 20s. Timer rewinds 20s. Mistakes within the window are erased. Cooldown: 7 minutes.',
                    descDE: 'Rücksetzfenster 20s. Timer spult 20s zurück. Fehler im Fenster werden gelöscht. Abklingzeit: 7 Minuten.',
                    effect: { windowSeconds: 20, rewindSeconds: 20, clearOldMistakes: false }
                },
                {
                    level: 3,
                    descEn: 'Rollback window 30s. Timer rewinds 30s. Also corrects mistake cells from before the window. Cooldown: 7 minutes.',
                    descDE: 'Rücksetzfenster 30s. Timer spult 30s zurück. Korrigiert auch Fehlerzellen von vor dem Fenster. Abklingzeit: 7 Minuten.',
                    effect: { windowSeconds: 30, rewindSeconds: 30, clearOldMistakes: true }
                },
            ]
        },

        active2: {
            nameEn: 'Transition Matrix',
            nameDE: 'Übergangsmatrix',
            descCursorEn: 'Enter Transition Mode — each correct fill may cascade to a neighbouring cell.',
            descCursorDE: 'Betrete Übergangsmodus — jede korrekte Füllung kann auf eine benachbarte Zelle übertragen werden.',
            cooldownSeconds: 300,
            levels: [
                {
                    level: 1,
                    descEn: 'Active 10s. Each correct fill has a 25% chance to cascade to a random unfilled neighbour. Cooldown: 5 minutes.',
                    descDE: 'Aktiv 10s. Jede korrekte Füllung hat 25% Chance, auf eine zufällige ungefüllte Nachbarzelle zu übertragen. Abklingzeit: 5 Minuten.',
                    effect: { duration: 10000, cascadeChance: 0.25, maxDepth: 1 }
                },
                {
                    level: 2,
                    descEn: 'Active 15s. Each correct fill has a 40% chance to cascade to a random unfilled neighbour. Cooldown: 5 minutes.',
                    descDE: 'Aktiv 15s. Jede korrekte Füllung hat 40% Chance zur Übertragung. Abklingzeit: 5 Minuten.',
                    effect: { duration: 15000, cascadeChance: 0.40, maxDepth: 1 }
                },
                {
                    level: 3,
                    descEn: 'Active 20s. 50% cascade chance. Cascaded fills can themselves cascade once (max chain depth 2). Cooldown: 5 minutes.',
                    descDE: 'Aktiv 20s. 50% Übertragungschance. Übertragende Füllungen können selbst einmal übertragen werden (max. Kettentiefe 2). Abklingzeit: 5 Minuten.',
                    effect: { duration: 20000, cascadeChance: 0.50, maxDepth: 2 }
                },
            ]
        },
    },

    // ── PROBABILIST ASCENDENCIES ─────────────────────────────────────────

    bayesian: {
        id: 'bayesian',
        parentClass: 'probabilist',
        icon: '🧪',
        nameEn: 'Bayesian',
        nameDE: 'Bayesianer',
        descEn: 'Your prior was a guess. Your posterior is a weapon.',
        descDE: 'Dein Prior war eine Vermutung. Dein Posterior ist eine Waffe.',
        color: '#27ae60',
        colorLight: '#58d68d',
        archetype: 'Trapper',

        active1: {
            nameEn: 'Reject the Null',
            nameDE: 'Nullhypothese ablehnen',
            descCursorEn: 'Select a row or column — each correct ✕ mark reveals a correct cell in that line.',
            descCursorDE: 'Wähle eine Zeile oder Spalte — jedes korrekte ✕ enthüllt eine korrekte Zelle in dieser Linie.',
            cooldownSeconds: 240,
            levels: [
                {
                    level: 1,
                    descEn: 'Select 1 row or column. Each correct ✕ in that line reveals 1 correct cell. Cooldown: 4 minutes.',
                    descDE: 'Wähle 1 Zeile oder Spalte. Jedes korrekte ✕ enthüllt 1 korrekte Zelle. Abklingzeit: 4 Minuten.',
                    effect: { lineCount: 1, revealsPerMark: 1 }
                },
                {
                    level: 2,
                    descEn: 'Select up to 2 rows or columns. Each correct ✕ reveals 1 correct cell. Cooldown: 4 minutes.',
                    descDE: 'Wähle bis zu 2 Zeilen oder Spalten. Jedes korrekte ✕ enthüllt 1 korrekte Zelle. Abklingzeit: 4 Minuten.',
                    effect: { lineCount: 2, revealsPerMark: 1 }
                },
                {
                    level: 3,
                    descEn: 'Select up to 3 rows or columns. Each correct ✕ reveals 2 correct cells. Cooldown: 4 minutes.',
                    descDE: 'Wähle bis zu 3 Zeilen oder Spalten. Jedes korrekte ✕ enthüllt 2 korrekte Zellen. Abklingzeit: 4 Minuten.',
                    effect: { lineCount: 3, revealsPerMark: 2 }
                },
            ]
        },

        active2: {
            nameEn: 'Type I Error Shield',
            nameDE: 'Typ-I-Fehlerschutz',
            descCursorEn: 'Seeds random empty cells with invisible shields — accidental clicks auto-mark ✕ instead of counting as mistakes.',
            descCursorDE: 'Versieht zufällige leere Zellen mit unsichtbaren Schilden — versehentliche Klicks markieren ✕ statt als Fehler zu zählen.',
            cooldownSeconds: 180,
            levels: [
                {
                    level: 1,
                    descEn: 'Seed 5 empty cells with shields. Clicking one auto-marks ✕ instead of a mistake. Cooldown: 3 minutes.',
                    descDE: '5 leere Zellen werden mit Schilden versehen. Klicken markiert ✕ statt Fehler. Abklingzeit: 3 Minuten.',
                    effect: { seedCount: 5, bonusReveal: false }
                },
                {
                    level: 2,
                    descEn: 'Seed 10 empty cells with shields. Cooldown: 3 minutes.',
                    descDE: '10 leere Zellen werden mit Schilden versehen. Abklingzeit: 3 Minuten.',
                    effect: { seedCount: 10, bonusReveal: false }
                },
                {
                    level: 3,
                    descEn: 'Seed 15 cells. When a shield triggers, also reveals 1 correct cell in the same row or column. Cooldown: 3 minutes.',
                    descDE: '15 Zellen werden versehen. Bei Auslösung wird 1 korrekte Zelle in derselben Zeile oder Spalte enthüllt. Abklingzeit: 3 Minuten.',
                    effect: { seedCount: 15, bonusReveal: true }
                },
            ]
        },
    },

    // done
    random_walker: {
        id: 'random_walker',
        parentClass: 'probabilist',
        icon: '🐻',
        nameEn: 'Random Walker',
        nameDE: 'Zufallswanderer',
        descEn: 'Not all who wander are lost. Some are converging.',
        descDE: 'Nicht alle, die wandern, sind verloren. Manche konvergieren.',
        color: '#16a085',
        colorLight: '#48c9b0',
        archetype: 'Beastmaster',

        active1: {
            nameEn: 'Brownian Motion',
            nameDE: 'Brownsche Bewegung',
            descCursorEn: 'Calls Browney, your loyal companion, who walks through the grid following a Brownian Motion path.',
            descCursorDE: 'Ruft Browney, deinen treuen Begleiter, der durch das Puzzle wandert. Browney folgt dem Pfad einer Brownschen Bewegung.',
            cooldownSeconds: 600,
            levels: [
                {
                    level: 1,
                    descEn: 'Browney walks through the grid every 5 seconds and reveals all correct cells along his path. Doing a mistake will make Browney return back to his cave. Cooldown: 10 minutes. ',
                    descDE: 'Browney wandert durch das Puzzle alle 5 Sekunden und enthüllt alle richtigen Zellen entlang seines Pfades. Fehler sorgen dafür, dass Browney zu seiner Höhle zurückkehrt. Abklingzeit: 10 Minuten.',
                    effect: { paths: 1, rank: 1}
                },
                {
                    level: 2,
                    descEn: 'Browney walks through the grid every 4 seconds and reveals all correct cells along his path. Doing a mistake will make Browney return back to his cave. Cooldown: 10 minutes. ',
                    descDE: 'Browney wandert durch das Puzzle alle 4 Sekunden und enthüllt alle richtigen Zellen entlang seines Pfades. Fehler sorgen dafür, dass Browney zu seiner Höhle zurückkehrt. Abklingzeit: 10 Minuten.',
                    effect: { paths: 1, rank: 2 }
                },
                {
                    level: 3,
                    descEn: 'Browney and his brother Wiener walk through the grid every 3 seconds and reveal all correct cells along their paths. Doing a mistake will make Browney and Wiener return to their cave. Cooldown: 10 minutes.',
                    descDE: 'Browney und sein Bruder Wiener wandern alle 3 Sekunden durch das Puzzle und enthüllen alle richtigen Zellen entlang ihrer Pfade. Fehler sorgen dafür, dass Browney und Wiener zu ihrer Höhle zurückkehren. Abklingzeit: 10 Minuten.',
                    effect: { paths: 2, rank: 3 }
                },
            ]
        },

        active2: {
            nameEn: 'Drifter',
            nameDE: 'Drifter',
            descCursorEn: 'Calls Drifter, your loyal companion. Drifter will walk through the grid and can be fed to increase his speed and duration.',
            descCursorDE: 'Ruft Drifter, deinen treuen Begleiter, um sich durch das Puzzle zu bewegen. Drifter kann gefüttert werden, um seine Geschwindigkeit und Dauer zu erhöhen.',
            cooldownSeconds: 600,
            levels: [
                {
                    level: 1,
                    descEn: 'Drifter lasts for 15 seconds. He will walk through the grid and periodically reveal or mark cells. Manually revealing correct cells will feed Drifter and increase his duration. When the timer runs out Drifter will leave behind a present for you. Mistakes will make him leave without present. Cooldown: 10 minutes.',
                    descDE: 'Drifter bleibt für 15 Sekunden. Er läuft durch das Gitter und deckt Zellen auf oder markiert sie. Manuelles Aufdecken von richtigen Zellen füttert Drifter und verlängert die Dauer. Wenn die Zeit abläuft wird Drifter ein Geschenk hinterlassen. Fehler führen dazu, dass er ohne Geschenk geht. Abklingzeit: 10 Minuten.',
                    effect: { duration: 15000, interval: 10000, smartTarget: false, finalHowl: true }
                },
                {
                    level: 2,
                    descEn: 'Drifter lasts for 20 seconds. He will walk through the grid and periodically reveal or mark cells. Manually revealing correct cells will feed Drifter and increase his duration. When the timer runs out Drifter will leave behind a present for you. Mistakes will make him leave without present. Cooldown: 10 minutes.',
                    descDE: 'Drifter bleibt für 20 Sekunden. Er läuft durch das Gitter und deckt Zellen auf oder markiert sie. Manuelles Aufdecken von richtigen Zellen füttert Drifter und verlängert die Dauer. Wenn die Zeit abläuft wird Drifter ein Geschenk hinterlassen. Fehler führen dazu, dass er ohne Geschenk geht. Abklingzeit: 10 Minuten.',
                    effect: { duration: 20000, interval: 10000, smartTarget: true, finalHowl: true }
                },
                {
                    level: 3,
                    descEn: 'Drifter lasts for 25 seconds. He will walk through the grid and periodically reveal or mark cells. Manually revealing correct cells will feed Drifter and increase his duration. When the timer runs out Drifter will leave behind a present for you. Mistakes will make him leave without present. Cooldown: 10 minutes.',
                    descDE: 'Drifter bleibt für 25 Sekunden. Er läuft durch das Gitter und deckt Zellen auf oder markiert sie. Manuelles Aufdecken von richtigen Zellen füttert Drifter und verlängert die Dauer. Wenn die Zeit abläuft wird Drifter ein Geschenk hinterlassen. Fehler führen dazu, dass er ohne Geschenk geht. Abklingzeit: 10 Minuten.',
                    effect: { duration: 25000, interval: 10000, smartTarget: true, finalHowl: true }
                },
            ]
        },
    },
};

// Maps each base class to its two ascendency options (IDs)
const ASCENDENCY_LIST = {
    statistician: ['outlier', 'actuary'],
    mathmagician: ['recursionist', 'markovian'],
    probabilist: ['bayesian', 'random_walker'],
};

// Returns true if all 3 base class skills are at max level (Rank 3)
function isBaseClassMaxed() {
    if (!STATE.playerClass) return false;
    return (STATE.classPassiveLevel || 1) >= 3 &&
        (STATE.classActive1Level || 1) >= 3 &&
        (STATE.classActive2Level || 1) >= 3;
}

// Returns true if the player has chosen an ascendency
function hasAscendency() {
    return !!STATE.playerAscendency;
}

// Returns true if both ascendency skills are at max level (Rank 3)
function isAscendencyMaxed() {
    if (!STATE.playerAscendency) return false;
    return (STATE.ascendencySkill1Level || 1) >= 3 &&
        (STATE.ascendencySkill2Level || 1) >= 3;
}


//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------