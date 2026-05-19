const TALENT_TREE_DATA = {
    "nodes": [
        {
            "id": 1,
            "x": 1,
            "y": 1,
            "nameEn": "Start",
            "nameDe": "Start",
            "descEn": "Start",
            "descDe": "Start",
            "icon": "",
            "statKey": "start"
        },
        {
            "id": 2,
            "x": 1,
            "y": -400,
            "nameEn": "Tutor",
            "nameDe": "Tutor",
            "descEn": "Tutor Items can now be used during an Excercise or Multiple Choice question. The Tutor has a 10% chance of automatically answering the question for you. Requires a Tutor item to be in the inventory and consumes the item on use.",
            "descDe": "Tutor Gegenstände können nun während Übungsaufgaben und Multiple - Choice Fragen verwendet werden. Der Tutor beantwortet die Frage mit 10% Wahrscheinlichkeit automatisch korrekt. Benötigt einen Tutor Gegenstand im Inventar und entfernt den Gegenstand danach aus dem Inventar.",
            "icon": "🎓",
            "statKey": "tutor_enable"
        },
        {
            "id": 3,
            "x": -500,
            "y": -500,
            "nameEn": "Wisdom Through Failure",
            "nameDe": "Weisheit durch Fehler",
            "descEn": "Excercises will show a hint after 5 unsuccessfull attempts.\n10% probability of receiving an additional Item reward when completing an Excercise.",
            "descDe": "Übungsaufgaben zeigen einen Hinweis nach 5 Fehlversuchen.\n10% Wahrscheinlichkeit einen zusätzlichen Gegenstand als Belohnung für das Absolvieren einer Übungsaufgabe zu erhalten.",
            "icon": "👾",
            "statKey": "wisdom_through_failure"
        },
        {
            "id": 4,
            "x": -750,
            "y": -500,
            "nameEn": "Promising Answers",
            "nameDe": "Vielversprechende Antworten",
            "descEn": "20% probability of receiving an additional item when completing an Excercise.",
            "descDe": "20% Wahrscheinlichkeit einen zusätzlichen Gegenstand als Belohnung für das Lösen einer Übungsaufgabe zu erhalten.",
            "icon": "👃",
            "statKey": "promising_answers"
        },
        {
            "id": 5,
            "x": -1000,
            "y": -500,
            "nameEn": "Rewarding Insight",
            "nameDe": "Belohnende Einsicht",
            "descEn": "20% probability of receiving an additional item when completing an Excercise.",
            "descDe": "20% Wahrscheinlichkeit einen zusätzlichen Gegenstand als Belohnung für das Lösen einer Übungsaufgabe zu erhalten.",
            "icon": "👃",
            "statKey": "rewarding_insight"
        },
        {
            "id": 6,
            "x": -1250,
            "y": -500,
            "nameEn": "Scholar's Fortune",
            "nameDe": "Vermögen des Gelehrten",
            "descEn": "20% probability of receiving an additional item when completing an Excercise.",
            "descDe": "20% Wahrscheinlichkeit einen zusätzlichen Gegenstand als Belohnung für das Lösen einer Übungsaufgabe zu erhalten.",
            "icon": "👃",
            "statKey": "scholars_fortune"
        },
        {
            "id": 7,
            "x": -1375,
            "y": -650,
            "nameEn": "Excercise Mastery",
            "nameDe": "Meister der Übungsaufgaben",
            "descEn": "Excercise hints now show up after one less unsuccessfull attempt.\n30% chance of receiving an additional Item reward when completing an Excercise.",
            "descDe": "Hinweise bei Übungsaufgaben erscheinen einen Fehlversuch früher.\n30% Wahrscheinlichkeit einen zusätzlichen Gegenstand als Belohnung für das Lösen einer Übungsaufgabe zu erhalten.",
            "icon": "🌏",
            "statKey": "probability_gate_mastery"
        },
        {
            "id": 8,
            "x": -500,
            "y": -700,
            "nameEn": "Quick Study",
            "nameDe": "Schnelle Studie",
            "descEn": "Excercise hints now show up after one less unsuccessfull attempt.",
            "descDe": "Hinweise bei Übungsaufgaben erscheinen einen Fehlversuch früher.",
            "icon": "👁️",
            "statKey": "quick_study"
        },
        {
            "id": 9,
            "x": -873,
            "y": -802,
            "nameEn": "Accelerated Insight",
            "nameDe": "Beschleunigte Erkenntnis",
            "descEn": "Excercise hints now show up after one less unsuccessfull attempt.",
            "descDe": "Hinweise bei Übungsaufgaben erscheinen einen Fehlversuch früher.",
            "icon": "👁️",
            "statKey": "accelerated_insight"
        },
        {
            "id": 10,
            "x": -1125,
            "y": -800,
            "nameEn": "Instant Comprehension",
            "nameDe": "Sofortiges Verständnis",
            "descEn": "Excercise hints now show up after one less unsuccessfull attempt.",
            "descDe": "Hinweise bei Übungsaufgaben erscheinen einen Fehlversuch früher.",
            "icon": "👁️",
            "statKey": "instant_comprehension"
        },
        {
            "id": 11,
            "x": 500,
            "y": -500,
            "nameEn": "Predictive Intelligence",
            "nameDe": "Vorhersehende Erkenntnis",
            "descEn": "10% chance to automatically remove one wrong answer from a Multiple Choice question.\n10% chance to receive an additional Item when answering a Multiple Choice question correctly.",
            "descDe": "10% Chance automatisch eine falsche Antwort bei Multiple Choice Fragen zu entfernen.\n10% Chance einen zusätzlichen Gegenstand für die korrekte Beantwortung von Multiple Choice Fragen zu erhalten.",
            "icon": "🗺️",
            "statKey": "predictive_intelligence"
        },
        {
            "id": 12,
            "x": 750,
            "y": -500,
            "nameEn": "Bonus Acquisition",
            "nameDe": "Vermehrte Gewinne",
            "descEn": "10% chance to receive an additional Item when answering a Multiple Choice question correctly.",
            "descDe": "10% Chance einen zusätzlichen Gegenstand für die korrekte Beantwortung von Multiple Choice Fragen zu erhalten.",
            "icon": "🎖️",
            "statKey": "bonus_acquisition"
        },
        {
            "id": 13,
            "x": 1000,
            "y": -500,
            "nameEn": "Enhanced Rewards",
            "nameDe": "Verbesserte Belohnungen",
            "descEn": "10% chance to receive an additional Item when answering a Multiple Choice question correctly.",
            "descDe": "10% Chance einen zusätzlichen Gegenstand für die korrekte Beantwortung von Multiple Choice Fragen zu erhalten.",
            "icon": "🎖️",
            "statKey": "enhanced_rewards"
        },
        {
            "id": 14,
            "x": 1250,
            "y": -500,
            "nameEn": "Overflowing Spoils",
            "nameDe": "Überfluss an Beute",
            "descEn": "10% chance to receive an additional Item when answering a Multiple Choice question correctly.",
            "descDe": "10% Chance einen zusätzlichen Gegenstand für die korrekte Beantwortung von Multiple Choice Fragen zu erhalten.",
            "icon": "🎖️",
            "statKey": "overflowing_spoils"
        },
        {
            "id": 15,
            "x": 500,
            "y": -700,
            "nameEn": "Elimination Clue",
            "nameDe": "Mörderische Eingebung",
            "descEn": "10% chance to automatically remove one wrong answer from a Multiple Choice question.",
            "descDe": "10% Wahrscheinlichkeit, dass eine falsche Antwort bei Multiple - Choice Fragen automatisch entfernt wird.",
            "icon": "💣",
            "statKey": "elimination_clue"
        },
        {
            "id": 16,
            "x": 875,
            "y": -800,
            "nameEn": "Narrowed Options",
            "nameDe": "Eingeschränkte Optionen",
            "descEn": "20% chance to automatically remove one wrong answer from a Multiple Choice question.",
            "descDe": "20% Wahrscheinlichkeit, dass eine falsche Antwort bei Multiple - Choice Fragen automatisch entfernt wird.",
            "icon": "💣",
            "statKey": "narrowed_options"
        },
        {
            "id": 17,
            "x": 1125,
            "y": -800,
            "nameEn": "Logical Deductions",
            "nameDe": "Logische Schlussfolgerungen",
            "descEn": "20% chance to automatically remove one wrong answer from a Multiple Choice question.",
            "descDe": "20% Wahrscheinlichkeit, dass eine falsche Antwort bei Multiple - Choice Fragen automatisch entfernt wird.",
            "icon": "💣",
            "statKey": "logical_deductions"
        },
        {
            "id": 18,
            "x": 1375,
            "y": -650,
            "nameEn": "Multiple Choice Mastery",
            "nameDe": "Multiple Choice Beherrschung",
            "descEn": "40% chance to automatically remove one wrong answer from a Multiple Choice question.\n10% chance to receive an additional Item when answering a Multiple Choice question correctly.",
            "descDe": "40% Chance, dass eine falsche Antwort bei Multiple - Choice Fragen automatisch entfernt wird.\n10% Chance einen zusätzlichen Gegenstand nach der Beantwortung einer Multiple Choice Frage zu erhalten.",
            "icon": "🔱",
            "statKey": "multiple_choice_mastery"
        },
        {
            "id": 19,
            "x": -150,
            "y": -750,
            "nameEn": "Careful Study",
            "nameDe": "Vorsichtige Studie",
            "descEn": "10% chance of not spending the Tutor item when using a Tutor to answer a question.",
            "descDe": "10% Chance, dass der Tutor Gegenstand beim Beantworten einer Frage nicht verbraucht wird.",
            "icon": "🎰",
            "statKey": "careful_study"
        },
        {
            "id": 20,
            "x": 150,
            "y": -750,
            "nameEn": "Stochastics Tutor",
            "nameDe": "Stochastik Tutor",
            "descEn": "Increases the chance that the tutor can solve the question by an additional 10%.",
            "descDe": "Erhöht die Chance, dass der Tutor die Frage beantworten kann, um weitere 10%.",
            "icon": "♟️",
            "statKey": "stochastics_tutor"
        },
        {
            "id": 21,
            "x": -150,
            "y": -900,
            "nameEn": "Efficient Tutoring",
            "nameDe": "Effiziente Betreuung",
            "descEn": "15% chance of not spending the Tutor item when using a Tutor to answer a question.",
            "descDe": "15% Chance, dass der Tutor Gegenstand beim Beantworten einer Frage nicht verbraucht wird.",
            "icon": "🎰",
            "statKey": "efficient_tutoring"
        },
        {
            "id": 22,
            "x": 150,
            "y": -900,
            "nameEn": "Statistics Tutor",
            "nameDe": "Statistik Tutor",
            "descEn": "Increases the chance that the tutor can solve the question by an additional 10%.",
            "descDe": "Erhöht die Chance, dass der Tutor die Frage beantworten kann, um weitere 10%.",
            "icon": "♟️",
            "statKey": "statistics_tutor"
        },
        {
            "id": 23,
            "x": -150,
            "y": -1050,
            "nameEn": "Endless Instructions",
            "nameDe": "Endlose Anweisungen",
            "descEn": "20% chance of not spending the Tutor item when using a Tutor to answer a question.",
            "descDe": "20% Chance, dass der Tutor Gegenstand beim Beantworten einer Frage nicht verbraucht wird.",
            "icon": "🎰",
            "statKey": "endless_instructions"
        },
        {
            "id": 24,
            "x": 150,
            "y": -1050,
            "nameEn": "Maths Tutor",
            "nameDe": "Mathe Tutor",
            "descEn": "Increases the chance that the tutor can solve the question by an additional 10%.",
            "descDe": "Erhöht die Chance, dass der Tutor die Frage beantworten kann, um weitere 10%.",
            "icon": "♟️",
            "statKey": "maths_tutor"
        },
        {
            "id": 25,
            "x": 1,
            "y": -1250,
            "nameEn": "Professor Tutor",
            "nameDe": "Professor Tutor",
            "descEn": "Increases the chance that the tutor can solve the question by an additional 20%.\n20% chance of not spending the Tutor item when using a Tutor to answer a question.",
            "descDe": "Erhöht die Chance, dass der Tutor die Frage beantworten kann, um weitere 20%.\n20% Chance, dass der Tutor Gegenstand beim Beantworten einer Frage nicht verbraucht wird.",
            "icon": "🧸",
            "statKey": "professor_tutor"
        },
        {
            "id": 26,
            "x": -500,
            "y": -900,
            "nameEn": "Expanding Front",
            "nameDe": "Erweiterte Front",
            "descEn": "Scout's Primer have a 50% chance of revealing an additional row.",
            "descDe": "Pfadfinder Kompasse haben eine 50% Chance eine weitere Spalte aufzudecken.",
            "icon": "🎯",
            "statKey": "expanding_front"
        },
        {
            "id": 27,
            "x": -500,
            "y": -1102,
            "nameEn": "Widened Formation",
            "nameDe": "Erweiterte Formation",
            "descEn": "Scout's Primer have a 25% chance of revealing two additional rows.",
            "descDe": "Pfadfinder Kompasse haben eine 25% Chance zwei weitere Zeilen aufzudecken. ",
            "icon": "🎯",
            "statKey": "widened_formation"
        },
        {
            "id": 28,
            "x": -500,
            "y": -1300,
            "nameEn": "Extended Horizon",
            "nameDe": "Erweiterter Horizont",
            "descEn": "Scout's Primer have a 12.5% chance of revealing three additional rows.",
            "descDe": "Pfadfinder Kompasse haben eine 12.5% Chance drei weitere Zeilen aufzudecken. ",
            "icon": "🎯",
            "statKey": "extended_horizon"
        },
        {
            "id": 29,
            "x": -200,
            "y": -1350,
            "nameEn": "Total Coverage",
            "nameDe": "Maximale Abdeckung",
            "descEn": "Scout's Primer have a 5% chance of revealing four additional rows",
            "descDe": "Pfadfinder Kompasse haben eine 5% Chance vier weitere Zeilen aufzudecken. ",
            "icon": "🎯",
            "statKey": "total_coverage"
        },
        {
            "id": 30,
            "x": 500,
            "y": -900,
            "nameEn": "Vertical Insight",
            "nameDe": "Vertikale Einsicht",
            "descEn": "Scout's Primer have a 50% chance of revealing an additional column.",
            "descDe": "Pfadfinder Kompasse haben eine 50% Chance eine weitere Spalte aufzudecken.",
            "icon": "🦴",
            "statKey": "vertical_insight"
        },
        {
            "id": 31,
            "x": 500,
            "y": -1100,
            "nameEn": "Rising Structure",
            "nameDe": "Aufsteigende Struktur",
            "descEn": "Scout's Primer have a 25% chance of revealing two additional columns.",
            "descDe": "Pfadfinder Kompasse haben eine 25% Chance zwei weitere Spalten aufzudecken. ",
            "icon": "🦴",
            "statKey": "rising_structure"
        },
        {
            "id": 32,
            "x": 500,
            "y": -1300,
            "nameEn": "Elevated Scope",
            "nameDe": "Erhöhte Reichweite",
            "descEn": "Scout's Primer have a 12.5% chance of revealing three additional columns.",
            "descDe": "Pfadfinder Kompasse haben eine 12.5% Chance drei weitere Spalten aufzudecken. ",
            "icon": "🦴",
            "statKey": "elevated_scope"
        },
        {
            "id": 33,
            "x": 200,
            "y": -1350,
            "nameEn": "Total Survey",
            "nameDe": "Vollständige Erkundung",
            "descEn": "Scout's Primer have a 5% chance of revealing four additional columns.",
            "descDe": "Pfadfinder Kompasse haben eine 5% Chance vier weitere Spalten aufzudecken. ",
            "icon": "🦴",
            "statKey": "total_survey"
        },
        {
            "id": 34,
            "x": 1,
            "y": -1500,
            "nameEn": "Primed Scout",
            "nameDe": "Vorbereiteter Pfadfinder",
            "descEn": "Doubles the amount of rows and columns Scout's Primer items reveal.",
            "descDe": "Verdoppelt die Anzahl der Zeilen und Spalten, die von Pfadfinder Kompass Gegenständen aufgedeckt werden.",
            "icon": "⭐",
            "statKey": "primed_scout"
        },
        {
            "id": 35,
            "x": -400,
            "y": 1,
            "nameEn": "Celerity",
            "nameDe": "Gewandtheit",
            "descEn": "All active class abilities have their cooldowns reduced by 30 seconds.",
            "descDe": "Alle aktiven Klassenfähigkeiten haben 30 Sekunden weniger Abklingzeit.",
            "icon": "",
            "statKey": "celerity"
        },
        {
            "id": 36,
            "x": -875,
            "y": -181,
            "nameEn": "Gear of the Statistician",
            "nameDe": "Ausrüstung des Statistikers",
            "descEn": "Statisticians have a 33% chance to receive an additional Magnifier after completing a level.",
            "descDe": "Statistiker haben eine 33% Chance eine Lupe nach dem Abschluss eines Levels zu erhalten.",
            "icon": "",
            "statKey": "gear_of_the_statistician"
        },
        {
            "id": 37,
            "x": -740,
            "y": 4,
            "nameEn": "Gear of the Mathmagician",
            "nameDe": "Ausrüstung des Mathemagiers",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "gear_of_the_mathmagician"
        },
        {
            "id": 38,
            "x": -677,
            "y": 185,
            "nameEn": "Gear of the Probabilist",
            "nameDe": "Ausrüstung des Probabilisten",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "gear_of_the_probabilist"
        },
        {
            "id": 39,
            "x": -1182,
            "y": -278,
            "nameEn": "Improved Gear of the Statistician",
            "nameDe": "Verbesserte Ausrüstung des Statistikers",
            "descEn": "Statisticians have a 33% chance to receive an additional Error Gem after completing a level.",
            "descDe": "Statistiker haben eine 33% Chance einen Fehlerstein nach dem Abschluss eines Levels zu erhalten.",
            "icon": "",
            "statKey": "improved_gear_of_the_statistician"
        },
        {
            "id": 40,
            "x": -1391,
            "y": -359,
            "nameEn": "Chain Reaction",
            "nameDe": "Kettenreaktion",
            "descEn": "Gain +2 seconds whenever Momentum triggers.",
            "descDe": "Erhalte +2 Sekunden wenn Schwung ausgelöst wird.",
            "icon": "",
            "statKey": "chain_reaction"
        },
        {
            "id": 41,
            "x": -1564,
            "y": -433,
            "nameEn": "Precise Momentum",
            "nameDe": "Präziser Schwung",
            "descEn": "Gain +3 seconds whenever Momentum triggers.",
            "descDe": "Erhalte +3 Sekunden wenn Schwung ausgelöst wird.",
            "icon": "",
            "statKey": "precise_momentum"
        },
        {
            "id": 42,
            "x": -1692,
            "y": -495,
            "nameEn": "Exponential Growth",
            "nameDe": "Exponentielles Wachstum",
            "descEn": "Each Momentum activation increases future Momentums by +1 seconds",
            "descDe": "Jede Schwung - Aktivierung erhöht zukünftige Schwünge um 1 Sekunde.",
            "icon": "",
            "statKey": "exponential_growth"
        },
        {
            "id": 43,
            "x": -1837,
            "y": -554,
            "nameEn": "Learning from Mistakes",
            "nameDe": "Lernen aus Fehlern",
            "descEn": "Mistakes reduce the Momentum Streak - Counter by 3 instead of fully resetting it.",
            "descDe": "Fehler verringern den Schwung-Zähler um 3 statt ihn vollständig zurückzusetzen.",
            "icon": "",
            "statKey": "learning_from_mistakes"
        },
        {
            "id": 44,
            "x": -1975,
            "y": -609,
            "nameEn": "Mistakes no Matter",
            "nameDe": "Fehler zählen nicht",
            "descEn": "Mistakes reduce the Momentum Streak - Counter by 3 instead of fully resetting it.",
            "descDe": "Fehler verringern den Schwung-Zähler um 3 statt ihn vollständig zurückzusetzen.",
            "icon": "",
            "statKey": "mistakes_no_matter"
        },
        {
            "id": 45,
            "x": -1283,
            "y": -408,
            "nameEn": "Monte Carlo",
            "nameDe": "Monte Carlo Simulation",
            "descEn": "Data Strike has a 25% chance to solve an additional random row or column.",
            "descDe": "Datenhieb hat eine 25% Chance eine weitere zufällige Zeile oder Spalte aufzudecken.",
            "icon": "",
            "statKey": "monte_carlo"
        },
        {
            "id": 46,
            "x": -1388,
            "y": -454,
            "nameEn": "Correlation Matrix",
            "nameDe": "Korrelationsmatrix",
            "descEn": "Data Strike has a 25% chance to solve an additional random row or column.",
            "descDe": "Datenhieb hat eine 25% Chance eine weitere zufällige Zeile oder Spalte aufzudecken.",
            "icon": "",
            "statKey": "correlation_matrix"
        },
        {
            "id": 47,
            "x": -1525,
            "y": -530,
            "nameEn": "Advanced Data Strike",
            "nameDe": "Verbesserter Datenhieb",
            "descEn": "Data Strike has a 25% chance to solve an additional random row or column.\nReduces the cooldown of Data Strike by 30 seconds.",
            "descDe": "Datenhieb hat eine 25% Chance eine weitere zufällige Zeile oder Spalte aufzudecken.\nReduziert die Abklingzeit von Datenhieb um 30 Sekunden.",
            "icon": "",
            "statKey": "advanced_data_strike"
        },
        {
            "id": 48,
            "x": -1694,
            "y": -605,
            "nameEn": "Swift Strike",
            "nameDe": "Schneller Hieb",
            "descEn": "Reduces the cooldown of Data Strike by 30 seconds.",
            "descDe": "Reduziert die Abklingzeit von Datenhieb um 30 Sekunden.",
            "icon": "",
            "statKey": "swift_strike"
        },
        {
            "id": 49,
            "x": -1888,
            "y": -667,
            "nameEn": "Accelerated Computation",
            "nameDe": "Beschleunigte Berechnung",
            "descEn": "Reduces the cooldown of Data Strike by 30 seconds.",
            "descDe": "Reduziert die Abklingzeit von Datenhieb um 30 Sekunden.",
            "icon": "",
            "statKey": "accelerated_computation"
        },
        {
            "id": 50,
            "x": -1452,
            "y": -244,
            "nameEn": "Random Diagonal",
            "nameDe": "Zufällige Diagonale",
            "descEn": "Diagonal Strike has a 25% chance to be repeated on another random cell.",
            "descDe": "Diagonalschlag hat eine Chance von 25% zusätzlich auf eine andere zufällige Zelle angewendet zu werden.",
            "icon": "",
            "statKey": "random_diagonal"
        },
        {
            "id": 51,
            "x": -1640,
            "y": -311,
            "nameEn": "Diagonal Witch",
            "nameDe": "Diagonale Hexe",
            "descEn": "Diagonal Strike has a 25% chance to be repeated on another random cell.",
            "descDe": "Diagonalschlag hat eine Chance von 25% zusätzlich auf eine andere zufällige Zelle angewendet zu werden.",
            "icon": "",
            "statKey": "diagonal_witch"
        },
        {
            "id": 52,
            "x": -1809,
            "y": -376,
            "nameEn": "Diagonally Wrong",
            "nameDe": "Diagonal Falsch",
            "descEn": "Diagonal Strike now also marks incorrect cells as incorrect.",
            "descDe": "Diagonalschlag markiert nun auch falsche Zellen als falsch.",
            "icon": "",
            "statKey": "diagonally_wrong"
        },
        {
            "id": 53,
            "x": -1934,
            "y": -434,
            "nameEn": "Quick Strike",
            "nameDe": "Schneller Schlag",
            "descEn": "Reduces the cooldown of Diagonal Strike by 30 seconds.",
            "descDe": "Reduziert die Abklingzeit von Diagonalschlag um 30 Sekunden",
            "icon": "",
            "statKey": "quick_strike"
        },
        {
            "id": 54,
            "x": -2063,
            "y": -508,
            "nameEn": "Accelerated Striking",
            "nameDe": "Verschnellertes Schlagen",
            "descEn": "Reduces the cooldown of Diagonal Strike by 30 seconds.",
            "descDe": "Reduziert die Abklingzeit von Diagonalschlag um 30 Sekunden",
            "icon": "",
            "statKey": "accelerated_striking"
        },
        {
            "id": 55,
            "x": -2191,
            "y": -658,
            "nameEn": "God of Statistics",
            "nameDe": "Gott der Statistik",
            "descEn": "Each Data Strike beyond the first one in a level gains one additional choice of solving a random unsolved row or column.\nDoubles the Momentum Bonus.\nDiagonal Strike has a 50% chance to be repeated on another random cell.",
            "descDe": "Jeder Datenhieb nach dem Ersten erhält eine weitere Entscheidung zwischen dem Lösen einer ungelösten Zeile oder Spalte.\nVerdoppelt den Schwung - Bonus.\nDiagonalschlag hat eine Chance von 50% zusätzlich auf eine andere zufällige Zelle angewendet zu werden.",
            "icon": "",
            "statKey": "god_of_statistics"
        },
        {
            "id": 56,
            "x": -1116,
            "y": 8,
            "nameEn": "Improved Gear of the Mathmatigican",
            "nameDe": "Verbesserte Ausrüstung des Mathemagiers",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "improved_gear_of_the_mathmagician"
        },
        {
            "id": 57,
            "x": -1349,
            "y": -75,
            "nameEn": "Skill 57",
            "nameDe": "Fähigkeit 57",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_57"
        },
        {
            "id": 58,
            "x": -1488,
            "y": -82,
            "nameEn": "Skill 58",
            "nameDe": "Fähigkeit 58",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_58"
        },
        {
            "id": 59,
            "x": -1645,
            "y": -92,
            "nameEn": "Skill 59",
            "nameDe": "Fähigkeit 59",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_59"
        },
        {
            "id": 60,
            "x": -1781,
            "y": -108,
            "nameEn": "Skill 60",
            "nameDe": "Fähigkeit 60",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_60"
        },
        {
            "id": 61,
            "x": -1962,
            "y": -111,
            "nameEn": "Skill 61",
            "nameDe": "Fähigkeit 61",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_61"
        },
        {
            "id": 62,
            "x": -1364,
            "y": 34,
            "nameEn": "Skill 62",
            "nameDe": "Fähigkeit 62",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_62"
        },
        {
            "id": 63,
            "x": -1491,
            "y": 31,
            "nameEn": "Skill 63",
            "nameDe": "Fähigkeit 63",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_63"
        },
        {
            "id": 64,
            "x": -1639,
            "y": 25,
            "nameEn": "Skill 64",
            "nameDe": "Fähigkeit 64",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_64"
        },
        {
            "id": 65,
            "x": -1778,
            "y": 21,
            "nameEn": "Skill 65",
            "nameDe": "Fähigkeit 65",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_65"
        },
        {
            "id": 66,
            "x": -1968,
            "y": 18,
            "nameEn": "Skill 66",
            "nameDe": "Fähigkeit 66",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_66"
        },
        {
            "id": 67,
            "x": -1376,
            "y": 157,
            "nameEn": "Skill 67",
            "nameDe": "Fähigkeit 67",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_67"
        },
        {
            "id": 68,
            "x": -1510,
            "y": 152,
            "nameEn": "Skill 68",
            "nameDe": "Fähigkeit 68",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_68"
        },
        {
            "id": 69,
            "x": -1651,
            "y": 155,
            "nameEn": "Skill 69",
            "nameDe": "Fähigkeit 69",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_69"
        },
        {
            "id": 70,
            "x": -1789,
            "y": 149,
            "nameEn": "Skill 70",
            "nameDe": "Fähigkeit 70",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_70"
        },
        {
            "id": 71,
            "x": -1981,
            "y": 151,
            "nameEn": "Skill 71",
            "nameDe": "Fähigkeit 71",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_71"
        },
        {
            "id": 72,
            "x": -2161,
            "y": 19,
            "nameEn": "God of Math",
            "nameDe": "Gott der Mathematik",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "god_of_math"
        },
        {
            "id": 73,
            "x": -1092,
            "y": 282,
            "nameEn": "Skill 73",
            "nameDe": "Fähigkeit 73",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_73"
        },
        {
            "id": 74,
            "x": -1278,
            "y": 289,
            "nameEn": "Skill 74",
            "nameDe": "Fähigkeit 74",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_74"
        },
        {
            "id": 75,
            "x": -1447,
            "y": 286,
            "nameEn": "Skill 75",
            "nameDe": "Fähigkeit 75",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_75"
        },
        {
            "id": 76,
            "x": -1625,
            "y": 292,
            "nameEn": "Skill 76",
            "nameDe": "Fähigkeit 76",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_76"
        },
        {
            "id": 77,
            "x": -1777,
            "y": 286,
            "nameEn": "Skill 77",
            "nameDe": "Fähigkeit 77",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_77"
        },
        {
            "id": 78,
            "x": -1042,
            "y": 414,
            "nameEn": "Skill 78",
            "nameDe": "Fähigkeit 78",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_78"
        },
        {
            "id": 79,
            "x": -1264,
            "y": 415,
            "nameEn": "Skill 79",
            "nameDe": "Fähigkeit 79",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_79"
        },
        {
            "id": 80,
            "x": -1434,
            "y": 416,
            "nameEn": "Skill 80",
            "nameDe": "Fähigkeit 80",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_80"
        },
        {
            "id": 81,
            "x": -1597,
            "y": 416,
            "nameEn": "Skill 81",
            "nameDe": "Fähigkeit 81",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_81"
        },
        {
            "id": 82,
            "x": -1771,
            "y": 410,
            "nameEn": "Skill 82",
            "nameDe": "Fähigkeit 82",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_82"
        },
        {
            "id": 83,
            "x": -1026,
            "y": 572,
            "nameEn": "Skill 83",
            "nameDe": "Fähigkeit 83",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_83"
        },
        {
            "id": 84,
            "x": -1207,
            "y": 582,
            "nameEn": "Skill 84",
            "nameDe": "Fähigkeit 84",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_84"
        },
        {
            "id": 85,
            "x": -1408,
            "y": 565,
            "nameEn": "Skill 85",
            "nameDe": "Fähigkeit 85",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_85"
        },
        {
            "id": 86,
            "x": -1584,
            "y": 567,
            "nameEn": "Skill 86",
            "nameDe": "Fähigkeit 86",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_86"
        },
        {
            "id": 87,
            "x": -1781,
            "y": 551,
            "nameEn": "Skill 87",
            "nameDe": "Fähigkeit 87",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "skill_87"
        },
        {
            "id": 88,
            "x": -2184,
            "y": 417,
            "nameEn": "God of Probabilities",
            "nameDe": "Gott der Wahrscheinlichkeiten",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "god_of_probabilities"
        },
        {
            "id": 89,
            "x": -859,
            "y": 300,
            "nameEn": "Improved Gear of the Probabilist",
            "nameDe": "Verbesserte Ausrüstung des Probabilisten",
            "descEn": "",
            "descDe": "",
            "icon": "",
            "statKey": "improved_gear_of_the_probabilist"
        }
    ],
    "connections": [
        {
            "id": 10,
            "from": 1,
            "to": 2,
            "dotted": false
        },
        {
            "id": 11,
            "from": 2,
            "to": 3,
            "dotted": false
        },
        {
            "id": 12,
            "from": 3,
            "to": 4,
            "dotted": false
        },
        {
            "id": 13,
            "from": 4,
            "to": 5,
            "dotted": false
        },
        {
            "id": 14,
            "from": 5,
            "to": 6,
            "dotted": false
        },
        {
            "id": 15,
            "from": 6,
            "to": 7,
            "dotted": false
        },
        {
            "id": 16,
            "from": 3,
            "to": 8,
            "dotted": false
        },
        {
            "id": 17,
            "from": 8,
            "to": 9,
            "dotted": false
        },
        {
            "id": 18,
            "from": 9,
            "to": 10,
            "dotted": false
        },
        {
            "id": 19,
            "from": 10,
            "to": 7,
            "dotted": false
        },
        {
            "id": 20,
            "from": 2,
            "to": 11,
            "dotted": false
        },
        {
            "id": 21,
            "from": 11,
            "to": 12,
            "dotted": false
        },
        {
            "id": 22,
            "from": 12,
            "to": 13,
            "dotted": false
        },
        {
            "id": 23,
            "from": 13,
            "to": 14,
            "dotted": false
        },
        {
            "id": 24,
            "from": 14,
            "to": 18,
            "dotted": false
        },
        {
            "id": 25,
            "from": 11,
            "to": 15,
            "dotted": false
        },
        {
            "id": 26,
            "from": 15,
            "to": 16,
            "dotted": false
        },
        {
            "id": 27,
            "from": 16,
            "to": 17,
            "dotted": false
        },
        {
            "id": 28,
            "from": 17,
            "to": 18,
            "dotted": false
        },
        {
            "id": 29,
            "from": 8,
            "to": 26,
            "dotted": false
        },
        {
            "id": 30,
            "from": 26,
            "to": 27,
            "dotted": false
        },
        {
            "id": 31,
            "from": 27,
            "to": 28,
            "dotted": false
        },
        {
            "id": 32,
            "from": 28,
            "to": 29,
            "dotted": false
        },
        {
            "id": 33,
            "from": 29,
            "to": 34,
            "dotted": false
        },
        {
            "id": 34,
            "from": 15,
            "to": 30,
            "dotted": false
        },
        {
            "id": 35,
            "from": 30,
            "to": 31,
            "dotted": false
        },
        {
            "id": 36,
            "from": 31,
            "to": 32,
            "dotted": false
        },
        {
            "id": 37,
            "from": 32,
            "to": 33,
            "dotted": false
        },
        {
            "id": 38,
            "from": 33,
            "to": 34,
            "dotted": false
        },
        {
            "id": 39,
            "from": 2,
            "to": 19,
            "dotted": false
        },
        {
            "id": 40,
            "from": 2,
            "to": 20,
            "dotted": false
        },
        {
            "id": 41,
            "from": 20,
            "to": 22,
            "dotted": false
        },
        {
            "id": 42,
            "from": 22,
            "to": 24,
            "dotted": false
        },
        {
            "id": 43,
            "from": 24,
            "to": 25,
            "dotted": false
        },
        {
            "id": 44,
            "from": 19,
            "to": 21,
            "dotted": false
        },
        {
            "id": 45,
            "from": 21,
            "to": 23,
            "dotted": false
        },
        {
            "id": 46,
            "from": 23,
            "to": 25,
            "dotted": false
        },
        {
            "id": 47,
            "from": 1,
            "to": 35,
            "dotted": false
        },
        {
            "id": 48,
            "from": 35,
            "to": 36,
            "dotted": false
        },
        {
            "id": 49,
            "from": 35,
            "to": 37,
            "dotted": false
        },
        {
            "id": 50,
            "from": 35,
            "to": 38,
            "dotted": false
        },
        {
            "id": 51,
            "from": 36,
            "to": 39,
            "dotted": false
        },
        {
            "id": 52,
            "from": 39,
            "to": 40,
            "dotted": false
        },
        {
            "id": 53,
            "from": 40,
            "to": 41,
            "dotted": false
        },
        {
            "id": 54,
            "from": 41,
            "to": 42,
            "dotted": false
        },
        {
            "id": 55,
            "from": 42,
            "to": 43,
            "dotted": false
        },
        {
            "id": 56,
            "from": 43,
            "to": 44,
            "dotted": false
        },
        {
            "id": 57,
            "from": 39,
            "to": 45,
            "dotted": false
        },
        {
            "id": 58,
            "from": 45,
            "to": 46,
            "dotted": false
        },
        {
            "id": 59,
            "from": 46,
            "to": 47,
            "dotted": false
        },
        {
            "id": 60,
            "from": 47,
            "to": 48,
            "dotted": false
        },
        {
            "id": 61,
            "from": 48,
            "to": 49,
            "dotted": false
        },
        {
            "id": 62,
            "from": 39,
            "to": 50,
            "dotted": false
        },
        {
            "id": 63,
            "from": 50,
            "to": 51,
            "dotted": false
        },
        {
            "id": 64,
            "from": 51,
            "to": 52,
            "dotted": false
        },
        {
            "id": 65,
            "from": 52,
            "to": 53,
            "dotted": false
        },
        {
            "id": 66,
            "from": 53,
            "to": 54,
            "dotted": false
        },
        {
            "id": 67,
            "from": 49,
            "to": 55,
            "dotted": false
        },
        {
            "id": 68,
            "from": 44,
            "to": 55,
            "dotted": false
        },
        {
            "id": 69,
            "from": 54,
            "to": 55,
            "dotted": false
        },
        {
            "id": 70,
            "from": 37,
            "to": 56,
            "dotted": false
        },
        {
            "id": 71,
            "from": 56,
            "to": 57,
            "dotted": false
        },
        {
            "id": 72,
            "from": 57,
            "to": 58,
            "dotted": false
        },
        {
            "id": 73,
            "from": 58,
            "to": 59,
            "dotted": false
        },
        {
            "id": 74,
            "from": 59,
            "to": 60,
            "dotted": false
        },
        {
            "id": 75,
            "from": 60,
            "to": 61,
            "dotted": false
        },
        {
            "id": 76,
            "from": 61,
            "to": 72,
            "dotted": false
        },
        {
            "id": 77,
            "from": 56,
            "to": 62,
            "dotted": false
        },
        {
            "id": 78,
            "from": 62,
            "to": 63,
            "dotted": false
        },
        {
            "id": 79,
            "from": 63,
            "to": 64,
            "dotted": false
        },
        {
            "id": 80,
            "from": 64,
            "to": 65,
            "dotted": false
        },
        {
            "id": 81,
            "from": 65,
            "to": 66,
            "dotted": false
        },
        {
            "id": 82,
            "from": 66,
            "to": 72,
            "dotted": false
        },
        {
            "id": 83,
            "from": 56,
            "to": 67,
            "dotted": false
        },
        {
            "id": 84,
            "from": 67,
            "to": 68,
            "dotted": false
        },
        {
            "id": 85,
            "from": 68,
            "to": 69,
            "dotted": false
        },
        {
            "id": 86,
            "from": 69,
            "to": 70,
            "dotted": false
        },
        {
            "id": 87,
            "from": 70,
            "to": 71,
            "dotted": false
        },
        {
            "id": 88,
            "from": 71,
            "to": 72,
            "dotted": false
        },
        {
            "id": 90,
            "from": 73,
            "to": 74,
            "dotted": false
        },
        {
            "id": 91,
            "from": 74,
            "to": 75,
            "dotted": false
        },
        {
            "id": 92,
            "from": 75,
            "to": 76,
            "dotted": false
        },
        {
            "id": 93,
            "from": 76,
            "to": 77,
            "dotted": false
        },
        {
            "id": 95,
            "from": 78,
            "to": 79,
            "dotted": false
        },
        {
            "id": 96,
            "from": 79,
            "to": 80,
            "dotted": false
        },
        {
            "id": 97,
            "from": 80,
            "to": 81,
            "dotted": false
        },
        {
            "id": 98,
            "from": 81,
            "to": 82,
            "dotted": false
        },
        {
            "id": 99,
            "from": 82,
            "to": 88,
            "dotted": false
        },
        {
            "id": 100,
            "from": 77,
            "to": 88,
            "dotted": false
        },
        {
            "id": 102,
            "from": 83,
            "to": 84,
            "dotted": false
        },
        {
            "id": 103,
            "from": 84,
            "to": 85,
            "dotted": false
        },
        {
            "id": 104,
            "from": 85,
            "to": 86,
            "dotted": false
        },
        {
            "id": 105,
            "from": 86,
            "to": 87,
            "dotted": false
        },
        {
            "id": 106,
            "from": 87,
            "to": 88,
            "dotted": false
        },
        {
            "id": 107,
            "from": 38,
            "to": 89,
            "dotted": false
        },
        {
            "id": 108,
            "from": 89,
            "to": 73,
            "dotted": false
        },
        {
            "id": 109,
            "from": 89,
            "to": 78,
            "dotted": false
        },
        {
            "id": 110,
            "from": 89,
            "to": 83,
            "dotted": false
        }
    ]
};