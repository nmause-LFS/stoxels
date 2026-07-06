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
            descCursorEn: 'Select a cell to reveal a limited amount of correct neighhbours.',
            descCursorDE: 'Wähle eine Zelle, um eine begrenzte Anzahl korrekter Nachbarn zu enthüllen.',
            cooldownSeconds: 300,
            levels: [
                {
                    level: 1,
                    descEn: 'Select a cell to reveal up to 4 correct neighbours within 1 step. Cooldown: 5 minutes.',
                    descDE: 'Wähle eine Zelle, um bis zu 4 korrekte Nachbarn im Umkreis von 1 Schritt zu enthüllen. Abklingzeit: 5 Minuten.',
                    effect: { radius: 1, maxReveals: 4}
                },
                {
                    level: 2,
                    descEn: 'Select a cell to reveal up to 5 correct neighbours within 2 steps. Cooldown: 5 minutes.',
                    descDE: 'Wähle eine Zelle, um bis zu 5 korrekte Nachbarn im Umkreis von 2 Schritten zu enthüllen. Abklingzeit: 5 Minuten.',
                    effect: { radius: 2, maxReveals: 5 }
                },
                {
                    level: 3,
                    descEn: 'Select a cell to reveal up to 6 correct neighbours within 3 steps. Cooldown: 5 minutes.',
                    descDE: 'Wähle eine Zelle, um bis zu 6 korrekte Nachbarn im Umkreis von 3 Schritten zu enthüllen. Abklingzeit: 5 Minuten.',
                    effect: { radius: 3, maxReveals: 6 }
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
            nameDE: 'Momentum',
            levels: [
                {
                    level: 1,
                    descEn: 'Every 15 correct fills in a row without mistake grant +10 seconds added to the timer.',
                    descDE: '15 korrekte Klicks hintereinander ohne Fehler geben +10 Sekunden mehr Zeit.',
                    effect: { streakForBonus: 15, bonusSeconds: 10 }
                },
                {
                    level: 2,
                    descEn: 'Every 15 correct fills in a row without mistake grant +15 seconds added to the timer.',
                    descDE: '15 korrekte Klicks hintereinander ohne Fehler geben +15 Sekunden mehr Zeit.',
                    effect: { streakForBonus: 15, bonusSeconds: 15 }
                },
                {
                    level: 3,
                    descEn: 'Every 15 correct fills in a row without mistake grant +20 seconds added to the timer.',
                    descDE: '15 korrekte Klicks hintereinander ohne Fehler geben +20 Sekunden mehr Zeit.',
                    effect: { streakForBonus: 15, bonusSeconds: 20 }
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
                    descEn: 'Choose between instantly revealing 5 unfilled correct cells in 1 random unsolved row or column. Cooldown: 5 minutes.',
                    descDE: 'Wähle zwischen dem sofortigen Lösen von 5 ungelösten Zellen in einer zufälligen ungelösten Zeile oder Spalte. Abklingzeit: 5 Minuten.',
                    effect: { solveCount: 1, revealCap: 5 }
                },
                {
                    level: 2,
                    descEn: 'Choose between instantly revealing 6 unfilled correct cells in 2 random unsolved rows or columns each. Cooldown: 5 minutes.',
                    descDE: 'Wähle zwischen dem sofortigen Lösen von jeweils 6 ungelösten Zellen in 2 zufälligen ungelösten Zeilen oder Spalten. Abklingzeit: 5 Minuten.',
                    effect: { solveCount: 2, revealCap: 6 }
                },
                {
                    level: 3,
                    descEn: 'Choose between instantly revealing 7 unfilled correct cells in 3 random unsolved rows or columns each. Cooldown: 5 minutes.',
                    descDE: 'Wähle zwischen dem sofortigen Lösen von jeweils 7 ungelösten Zellen in 3 zufälligen ungelösten Zeilen oder Spalten. Abklingzeit: 5 Minuten.',
                    effect: { solveCount: 3, revealCap: 7 }
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
                    descEn: 'Strike diagonally through a cell. Reveals up to 5 unfilled correct cells. Cooldown: 3 minutes.',
                    descDE: 'Gehe diagonal durch eine Zelle. Löst bis zu 5 ungelöste Zellen. Abklingzeit: 3 Minuten.',
                    effect: { diagonals: 1, revealCap: 5 }
                },
                {
                    level: 2,
                    descEn: 'Strike diagonally through a cell. Covers both diagonals. Reveals up to 7 unfilled correct cells. Cooldown: 3 minutes.',
                    descDE: 'Gehe diagonal durch eine Zelle. Erfasst beide Diagonalen. Löst bis zu 7 ungelöste Zellen. Abklingzeit: 3 Minuten.',
                    effect: { diagonals: 2, revealCap: 7 }
                },
                {
                    level: 3,
                    descEn: 'Strike diagonally, horizontally and vertically through a cell. Reveals up to 10 unfilled correct cells. Cooldown: 3 minutes.',
                    descDE: 'Gehe diagonal, horizontal und vertikal durch eine Zelle. Löst bis zu 10 ungelöste Zellen. Abklingzeit: 3 Minuten.',
                    effect: { diagonals: 4, revealCap: 10 }
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
            nameEn: 'Precision Shot',
            nameDE: 'Präzisionsschuss',
            descCursorEn: 'Click a cell to mark up to 5 wrong cells in its row and column with ✕',
            descCursorDE: 'Klicke eine Zelle, um bis zu 5 falsche Zellen in Zeile und Spalte mit ✕ zu markieren',
            cooldownSeconds: 300,
            levels: [
                {
                    level: 1,
                    descEn: 'Click a cell to mark up to 5 wrong cells in that row and column with ✕. Cooldown: 5 minutes.',
                    descDE: 'Klicke eine Zelle um bis zu 5 falsche Zellen in dieser Zeile und Spalte mit einem ✕ zu markieren. Abklingzeit: 5 Minuten.',
                    effect: { crossMark: true, extraLines: 0 }
                },
                {
                    level: 2,
                    descEn: 'Click a cell to mark up to 6 wrong cells in that row, column and 1 adjacent row and column with ✕. Cooldown: 5 minutes.',
                    descDE: 'Klicke eine Zelle um bis zu 6 falsche Zellen in dieser Zeile, Spalte, und 1 angrenzende Zeile und Spalte mit ✕ zu markieren. Abklingzeit: 5 Minuten',
                    effect: { crossMark: true, extraLines: 1 }
                },
                {
                    level: 3,
                    descEn: 'Click a cell to mark up to 7 wrong cells in that row, column and 2 adjacent rows and columns with ✕. Cooldown: 5 minutes.',
                    descDE: 'Klicke eine Zelle um bis zu 7 falsche Zellen in dieser Zeile, Spalte, und 2 angrenzenden Zeilen und Spalten mit ✕ zu markieren. Abklingzeit: 5 Minuten',
                    effect: { crossMark: true, extraLines: 2 }
                },
            ]
        },

        active2: {
            nameEn: 'Rain of Arrows',
            nameDE: 'Pfeilregen',
            descCursorEn: 'Click a cell to scan that area',
            descCursorDE: 'Klicke eine Zelle an, um diesen Bereich zu scannen',
            cooldownSeconds: 300,
            levels: [
                {
                    level: 1,
                    descEn: 'Scans a 2×2 region on the grid for 1 second. Cooldown: 5 minutes.',
                    descDE: 'Scannt eine 2×2-Region auf dem Spielfeld für 1 Sekunde. Abklingzeit: 5 Minuten.',
                    effect: { scanSize: 2, scanDuration: 1000 }
                },
                {
                    level: 2,
                    descEn: 'Scans a 3×3 region on the grid for 1.5 seconds. Cooldown: 5 minutes.',
                    descDE: 'Enthüllt eine 3×3-Region auf dem Spielfeld für 1,5 Sekunden. Abklingzeit: 5 Minuten.',
                    effect: { scanSize: 3, scanDuration: 1500 }
                },
                {
                    level: 3,
                    descEn: 'Reveals a 4×4 region on the grid for 2 seconds. Cooldown: 5 minutes.',
                    descDE: 'Enthüllt eine 4×4-Region auf dem Spielfeld für 2 Sekunden. Abklingzeit: 5 Minuten.',
                    effect: { scanSize: 4, scanDuration: 2000 }
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
            descCursorEn: 'Make a deal with the Infinite Hunger. Sacrifice your time for reveals. Every second counts. ',
            descCursorDE: 'Mache einen Handel mit dem Unendlichen Hunger. Opfere deine Zeit für Enthüllungen. Jede Sekunde zählt.',
            cooldownSeconds: 240,
            levels: [
                {
                    level: 1,
                    descEn: 'Make a deal with the Infinite Hunger. Sacrifice 90 seconds of your time per cell in exchange for up to 10 revealed cells. Cooldown: 4 minutes.',
                    descDE: 'Mache einen Handel mit dem Unendlichen Hunger. Opfere 90 Sekunden deiner Zeit pro Zelle im Tausch für bis zu 10 enthüllte Zellen. Abklingzeit: 4 Minuten.',
                    effect: { secondsPerCell: 90, maxCells: 10 }
                },
                {
                    level: 2,
                    descEn: 'Make a deal with the Infinite Hunger. Sacrifice 75 seconds of your time per cell in exchange for up to 15 revealed cells. Cooldown: 4 minutes.',
                    descDE: 'Mache einen Handel mit dem Unendlichen Hunger. Opfere 75 Sekunden deiner Zeit pro Zelle im Tausch für bis zu 15 enthüllte Zellen. Abklingzeit: 4 Minuten.',
                    effect: { secondsPerCell: 75, maxCells: 15 }
                },
                {
                    level: 3,
                    descEn: 'Make a deal with the Infinite Hunger. Sacrifice 60 seconds of your time per cell in exchange for up to 20 revealed cells. Cooldown: 4 minutes.',
                    descDE: 'Mache einen Handel mit dem Unendlichen Hunger. Opfere 60 Sekunden deiner Zeit pro Zelle im Tausch für bis zu 20 enthüllte Zellen. Abklingzeit: 4 Minuten.',
                    effect: { secondsPerCell: 60, maxCells: 20 }
                },
            ]
        },

        active2: {
            nameEn: 'SPEEDFORCE',
            nameDE: 'SPEEDFORCE',
            descCursorEn: 'Enter the SPEEDFORCE: Every correct fill triggers a Momentum bonus. Time passes ten times as quickly.',
            descCursorDE: 'Betrete die SPEEDFORCE: Jede korrekte Füllung löst einen Momentum-Bonus aus. Die Zeit vergeht zehn mal so schnell.',
            cooldownSeconds: 120,
            levels: [
                {
                    level: 1,
                    descEn: 'Enter the SPEEDFORCE. Every correct fill triggers a Momentum bonus. Any mistake is five times as severe and ends the effect. Time passes ten times as fast while in the SPEEDFORCE. Lasts for 5 seconds Cooldown: 2 minutes.',
                    descDE: 'Betrete die SPEEDFORCE: Jede korrekte Füllung löst einen Momentum-Bonus aus. Fehler verfünffachen die Strafe und beenden den Effekt. Die Zeit vergeht zehn mal so schnell solange du in der SPEEDFORCE bist. Aktiv für 5 Sekunden. Abklingzeit: 2 Minuten.',
                    effect: { duration: 5000, streakThreshold: 1 }
                },
                {
                    level: 2,
                    descEn: 'Enter the SPEEDFORCE: Every correct fill triggers a Momentum bonus. Any mistake is five times as severe and ends the effect.Time passes ten times as fast while in the SPEEDFORCE. Lasts for 10 seconds. Cooldown: 2 minutes.',
                    descDE: 'Betrete die SPEEDFORCE: Jede korrekte Füllung löst einen Momentum-Bonus aus. Fehler verfünffachen die Strafe und beenden den Effekt. Die Zeit vergeht zehn mal so schnell solange du in der SPEEDFORCE bist. Aktiv für 10 Sekunden. Abklingzeit: 2 Minuten.',
                    effect: { duration: 10000, streakThreshold: 1 }
                },
                {
                    level: 3,
                    descEn: 'Enter the SPEEDFORCE: Every correct fill triggers a Momentum bonus. Any mistake is five times as severe and ends the effect. Time passes ten times as fast while in the SPEEDFORCE.Lasts for 15 seconds. Cooldown: 2 minutes.',
                    descDE: 'Betrete die SPEEDFORCE: Jede korrekte Füllung löst einen Momentum-Bonus aus. Fehler verfünffachen die Strafe und beenden den Effekt. Die Zeit vergeht zehn mal so schnell solange du in der SPEEDFORCE bist. Aktiv für 15 Sekunden. Abklingzeit: 2 Minuten.',
                    effect: { duration: 15000, streakThreshold: 1 }
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
            descCursorEn: 'Correct your most recent mistakes and recover lost time.',
            descCursorDE: 'Korrigiere deine letzten Fehler und erhalte verlorene Zeit zurück.',
            cooldownSeconds: 120,
            levels: [
                {
                    level: 1,
                    descEn: 'Correct the most recent mistake. Recover 50% of the lost time. Cooldown: 2 minutes.',
                    descDE: 'Korrigiere den letzten Fehler. Erhalte 50% der verlorenen Zeit zurück. Abklingzeit: 2 Minuten.',
                    effect: { correctCount: 1, recoverPct: 0.5 }
                },
                {
                    level: 2,
                    descEn: 'Correct the two most recent mistakes. Recover 50% of the lost time. Cooldown: 2 minutes.',
                    descDE: 'Korrigiere die letzten zwei Fehler. Erhalte 50% der verlorenen Zeit zurück. Abklingzeit: 2 Minuten.',
                    effect: { correctCount: 2, recoverPct: 0.5 }
                },
                {
                    level: 3,
                    descEn: 'Correct the three most recent mistakes. Recover 100% of the lost time. Cooldown: 2 minutes.',
                    descDE: 'Korrigiere die letzten drei Fehler. Erhalte 100% der verlorenen Zeit zurück. Abklingzeit: 2 Minuten.',
                    effect: { correctCount: 3, recoverPct: 1.0 }
                },
            ]
        },

        active2: {
            nameEn: 'Significance Threshold',
            nameDE: 'Signifikanzschwelle',
            descCursorEn: 'Select a row or column to protect. Mistakes in affected cells will cause no penalties.',
            descCursorDE: 'Wähle eine Zeile oder Spalte zum Beschützen aus. Fehler in den betroffenen Zellen verursachen keine Strafen.',
            cooldownSeconds: 180,
            levels: [
                {
                    level: 1,
                    descEn: 'Select a row or column to protect. Mistakes in affected cells will cause no penalties. Cooldown: 4 minutes.',
                    descDE: 'Wähle eine Zeile oder Spalte zum Beschützen aus. Fehler in den betroffenden Zellen verursachen keine Strafen. Abklingzeit: 3 Minuten.',
                    effect: { protectCount: 1, bonusReveal: false }
                },
                {
                    level: 2,
                    descEn: 'Select two rows or columns to protect. Mistakes in affected cells will cause no penalties. Cooldown: 4 minutes.',
                    descDE: 'Wähle zwei Zeilen oder Spalten zum Beschützen aus. Fehler in den betroffenen Zellen verursachen keine Strafen. Abklingzeit: 3 Minuten.',
                    effect: { protectCount: 2, bonusReveal: false }
                },
                {
                    level: 3,
                    descEn: 'Select up to 3 rows or columns to protect. When triggered, also reveals 1 random correct cell in that line. Cooldown: 4 minutes.',
                    descDE: 'Wähle bis zu 3 Zeilen oder Spalten zum Beschützen aus. Bei Auslösung wird auch 1 zufällige korrekte Zelle in dieser Linie enthüllt. Abklingzeit: 3 Minuten.',
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
                    descEn: 'Plant a Residual Totem on a mistake cell. It fires a Revealing Beam every 20s to unfilled correct cells around it with radius 2. 3 Beam Charges. Max. 1 Totem. Cooldown: 2 minutes.',
                    descDE: 'Setze ein Residual-Totem auf eine Fehlerzelle. Es feuert einen Enthüllungs-Strahl alle 20s auf ungefüllte Zellen um sich herum mit Radius 2 ab. 3 Ladungen. Max. 1 Totem. Abklingzeit: 2 Minuten.',
                    effect: { beamRadius: 2, charges: 3, fires: 20, maxTotems: 1 }
                },
                {
                    level: 2,
                    descEn: 'Plant a Residual Totem on a mistake cell. It fires a Revealing Beam every 15s to unfilled correct cells around it with radius 3. 4 Beam Charges. Max. 2 Totems. Cooldown: 2 minutes.',
                    descDE: 'Setze ein Residual-Totem auf eine Fehlerzelle. Es feuert einen Enthüllungs-Strahl alle 15s auf ungefüllte Zellen um sich herum mit Radius 3 ab. 4 Ladungen. Max. 2 Totems. Abklingzeit: 2 Minuten.',
                    effect: { beamRadius: 3, charges: 3, fires: 15, maxTotems: 2 }
                },
                {
                    level: 3,
                    descEn: 'Plant a Residual Totem on a mistake cell. It fires a Revealing Beam every 10s to unfilled correct cells around it with radius 4. 6 Beam Charges. Max. 3 Totems. Cooldown: 2 minutes.',
                    descDE: 'Setze ein Residual-Totem auf eine Fehlerzelle. Es feuert einen Enthüllungs-Strahl alle 10s auf ungefüllte Zellen um sich herum mit Radius 4 ab. 6 Ladungen. Max. 3 Totems. Abklingzeit: 2 Minuten.',
                    effect: { beamRadius: 4, charges: 5, fires: 10, maxTotems: 3 }
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
                    descEn: 'Rewind Time by 10 seconds, undoing fills, marks and mistakes. Cooldown: 7 minutes.',
                    descDE: 'Setze die Zeit um 10 Sekunden zurück. Abklingzeit: 7 Minuten.',
                    effect: { windowSeconds: 10, rewindSeconds: 10, clearOldMistakes: false }
                },
                {
                    level: 2,
                    descEn: 'Rewind Time by 20 seconds, undoing fills, marks and mistakes. Cooldown: 7 minutes.',
                    descDE: 'Setze die Zeit um 20 Sekunden zurück, wobei Füllungen, Markierungen und Fehler rückgängig gemacht werden. Abklingzeit: 7 Minuten.',
                    effect: { windowSeconds: 20, rewindSeconds: 20, clearOldMistakes: false }
                },
                {
                    level: 3,
                    descEn: 'Rewind Time by 30 seconds, undoing fills, marks and mistakes. Cooldown: 7 minutes.',
                    descDE: 'Setze die Zeit um 30 Sekunden zurück, wobei Füllungen, Markierungen und Fehler rückgängig gemacht werden. Abklingzeit: 7 Minuten.',
                    effect: { windowSeconds: 30, rewindSeconds: 30, clearOldMistakes: true }
                },
            ]
        },

        active2: {
            nameEn: 'Transition Matrix',
            nameDE: 'Übergangsmatrix',
            descCursorEn: 'Enter Transition Mode - each correct fill may cascade to a neighbouring cell.',
            descCursorDE: 'Betrete Übergangsmodus - jede korrekte Füllung kann auf eine benachbarte Zelle übertragen werden.',
            cooldownSeconds: 300,
            levels: [
                {
                    level: 1,
                    descEn: 'Enter the Matrix. Each correct fill has a 25% chance to cascade to a random unfilled neighbour. Lasts for 10 seconds. Cooldown: 5 minutes.',
                    descDE: 'Betrete die Matrix. Jede korrekte Füllung hat 25% Chance, auf eine zufällige ungefüllte Nachbarzelle übertragen zu werden. Aktiv für 10 Sekunden. Abklingzeit: 5 Minuten.',
                    effect: { duration: 10000, cascadeChance: 0.25, maxDepth: 1 }
                },
                {
                    level: 2,
                    descEn: 'Enter the Matrix. Each correct fill has a 40% chance to cascade to a random unfilled neighbour. Lasts for 15 seconds. Cooldown: 5 minutes.',
                    descDE: 'Betrete die Matrix. Jede korrekte Füllung hat 40% Chance, auf eine zufällige ungefüllte Nachbarzelle übertragen zu werden. Aktiv für 15 Sekunden. Abklingzeit: 5 Minuten.',
                    effect: { duration: 15000, cascadeChance: 0.40, maxDepth: 1 }
                },
                {
                    level: 3,
                    descEn: 'Enter the Matrix. Each correct fill has a 50% chance to cascade to a random unfilled neighbour. Cascaded fills can themselves cascade once (max chain depth 2). Lasts for 20 seconds. Cooldown: 5 minutes.',
                    descDE: 'Betrete die Matrix. Jede korrekte Füllung hat 50% Chance, auf eine zufällige ungefüllte Nachbarzelle übertragen zu werden. Übertragende Füllungen können selbst einmal übertragen werden (max. Kettentiefe 2). Aktiv für 20 Sekunden. Abklingzeit: 5 Minuten.',
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
            nameEn: 'Bayes Traps',
            nameDE: 'Bayes-Fallen',
            descCursorEn: 'Choose and arm a specialized trap. Place it before the fuse expires or it detonates in your hands, reducing remaining time.',
            descCursorDE: 'Wähle und aktiviere eine spezialisierte Falle. Platziere sie vor Ablauf der Zündschnur, sonst explodiert sie in deinen Händen und reduziert die verbleibende Zeit.',
            cooldownSeconds: 240,
            levels: [
                {
                    level: 1,
                    descEn: 'Place a Reveal Trap onto the grid before its fuse expires. After a short delay, the trap activates automatically. Reveal Traps reveal nearby correct cells in a 1-step radius. Cooldown: 4 minutes.',
                    descDE: 'Platziere eine Enthüllungsfalle auf dem Feld bevor Ablauf der Zündschnur. Nach kurzer Verzögerung aktiviert sich die Falle automatisch. Die Enthüllungsfalle deckt korrekte Zellen in einem 1-Schritt Radius auf. Abklingzeit: 4 Minuten.',
                    effect: {
                        trapCount: 1,
                        availableTraps: ['reveal']
                    }
                },
                {
                    level: 2,
                    descEn: 'Choose between Reveal Traps and Elimination Traps. Place 2 traps before the fuse expires or they detonate in your hands, reducing remaining Time. Reveal Traps reveal nearby correct cells in a 1-step radius. Elimination Traps mark incorrect empty cells horizontally and vertically up to 5 cells away. Cooldown: 4 minutes.',
                    descDE: 'Wähle zwischen Enthüllungsfallen und Eliminierungsfallen. Platziere 2 Fallen vor Ablauf der Zündschnur, sonst explodieren sie in deinen Händen und reduzieren die verbleibende Zeit. Enthüllungsfallen decken nahe korrekte Zellen in einem 1-Schritt Radius auf. Eliminierungsfallen markieren falsche leere Zellen horizontal und vertikal bis zu 5 Zellen entfernt. Abklingzeit: 4 Minuten.',
                    effect: {
                        trapCount: 2,
                        availableTraps: ['reveal', 'elimination']
                    }
                },
                {
                    level: 3,
                    descEn: 'Choose between Reveal Traps, Elimination Traps and Protection Traps. Place 3 traps before the fuse expires or they detonate in your hands, reducing remaining Time. Reveal Traps reveal nearby correct cells in a 1-step radius. Elimination Traps mark incorrect empty cells horizontally and vertically up to 5 cells away. Protection Trap prevents mistake penalties on its row and column. Cooldown: 4 minutes.',
                    descDE: 'Wähle zwischen Enthüllungsfallen, Eliminierungsfallen und Schutzfallen. Platziere 3 Fallen vor Ablauf der Zündschnur, sonst explodieren sie in deinen Händen und reduzieren die verbleibende Zeit. Enthüllungsfallen decken nahe korrekte Zellen in einem 1-Schritt radius auf. Eliminierungsfallen markieren falsche leere Zellen horizontal und vertikal bis zu 5 Zellen entfernt. Schutzfallen verhindern Fehlerstrafen in ihrer Zeile und Spalte. Abklingzeit: 4 Minuten.',
                    effect: {
                        trapCount: 3,
                        availableTraps: ['reveal', 'elimination', 'protection']
                    }
                },
            ]
        },

        active2: {
            nameEn: 'Type I Error Shield',
            nameDE: 'Typ-I-Fehlerschutz',
            descCursorEn: 'Seeds random empty cells with invisible shields - incorrectly revealing a shielded cell will protect you from the mistake.',
            descCursorDE: 'Versieht zufällige leere Zellen mit unsichtbaren Schilden, die dich vor Fehlern schützen werden.',
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
            cooldownSeconds: 300,
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




//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Per-spell locker icons for the class-upgrade screen (base classes only).
// Keyed by classId -> ability type ('passive' | 'active1' | 'active2').
const CLASS_SPELL_ICONS = {
    mathmagician: {
        passive: '💠',   // Variance Shield
        active1: '👁️',   // Arcane Reveal
        active2: '❄️',   // Absolute Zero
    },
    statistician: {
        passive: '♻️',   // Momentum
        active1: '🗡️',   // Data Strike
        active2: '✖️',   // Diagonal Strike
    },
    probabilist: {
        passive: '♟️',   // Bayesian Insight
        active1: '➶',   // Precision Shot
        active2: '🌠',   // Rain of Arrows
    },
};

// Per-skill locker icons for the ascendency-upgrade screen.
// Keyed by ascendencyId -> 'active1' | 'active2'.
const ASCENDENCY_SPELL_ICONS = {
    outlier: { active1: '🩸', active2: '⚡' },   // Tail Risk / SPEEDFORCE
    actuary: { active1: '⏱️', active2: '🚧' },   // Regression to Prior / Significance Threshold
    recursionist: { active1: '🗿', active2: '♾️' },   // Residual / Degrees of Freedom
    markovian: { active1: '⏪', active2: '🔗' },   // State Rollback / Transition Matrix
    bayesian: { active1: '🪤', active2: '🔰' },   // Bayes Traps / Type I Error Shield
    random_walker: { active1: '🐾', active2: '🌬️' },   // Brownian Motion / Drifter
};