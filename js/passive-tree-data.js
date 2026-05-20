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
            "icon": "💡",
            "statKey": "wisdom_through_failure"
        },
        {
            "id": 4,
            "x": -800,
            "y": -600,
            "nameEn": "Promising Answers",
            "nameDe": "Vielversprechende Antworten",
            "descEn": "20% probability of receiving an additional item when completing an Excercise.",
            "descDe": "20% Wahrscheinlichkeit einen zusätzlichen Gegenstand als Belohnung für das Lösen einer Übungsaufgabe zu erhalten.",
            "icon": "🎁",
            "statKey": "promising_answers"
        },
        {
            "id": 5,
            "x": -1100,
            "y": -750,
            "nameEn": "Rewarding Insight",
            "nameDe": "Belohnende Einsicht",
            "descEn": "20% probability of receiving an additional item when completing an Excercise.",
            "descDe": "20% Wahrscheinlichkeit einen zusätzlichen Gegenstand als Belohnung für das Lösen einer Übungsaufgabe zu erhalten.",
            "icon": "🎀",
            "statKey": "rewarding_insight"
        },
        {
            "id": 6,
            "x": -1227,
            "y": -1000,
            "nameEn": "Scholar's Fortune",
            "nameDe": "Vermögen des Gelehrten",
            "descEn": "20% probability of receiving an additional item when completing an Excercise.",
            "descDe": "20% Wahrscheinlichkeit einen zusätzlichen Gegenstand als Belohnung für das Lösen einer Übungsaufgabe zu erhalten.",
            "icon": "🪙",
            "statKey": "scholars_fortune"
        },
        {
            "id": 7,
            "x": -1300,
            "y": -1200,
            "nameEn": "Excercise Mastery",
            "nameDe": "Meister der Übungsaufgaben",
            "descEn": "Excercise hints now show up after one less unsuccessfull attempt.\n30% chance of receiving an additional Item reward when completing an Excercise.",
            "descDe": "Hinweise bei Übungsaufgaben erscheinen einen Fehlversuch früher.\n30% Wahrscheinlichkeit einen zusätzlichen Gegenstand als Belohnung für das Lösen einer Übungsaufgabe zu erhalten.",
            "icon": "🏆",
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
            "icon": "💬",
            "statKey": "quick_study"
        },
        {
            "id": 9,
            "x": -800,
            "y": -1000,
            "nameEn": "Accelerated Insight",
            "nameDe": "Beschleunigte Erkenntnis",
            "descEn": "Excercise hints now show up after one less unsuccessfull attempt.",
            "descDe": "Hinweise bei Übungsaufgaben erscheinen einen Fehlversuch früher.",
            "icon": "🧩",
            "statKey": "accelerated_insight"
        },
        {
            "id": 10,
            "x": -1000,
            "y": -1100,
            "nameEn": "Instant Comprehension",
            "nameDe": "Sofortiges Verständnis",
            "descEn": "Excercise hints now show up after one less unsuccessfull attempt.",
            "descDe": "Hinweise bei Übungsaufgaben erscheinen einen Fehlversuch früher.",
            "icon": "⚡",
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
            "icon": "🧠",
            "statKey": "predictive_intelligence"
        },
        {
            "id": 12,
            "x": 800,
            "y": -600,
            "nameEn": "Bonus Acquisition",
            "nameDe": "Vermehrte Gewinne",
            "descEn": "10% chance to receive an additional Item when answering a Multiple Choice question correctly.",
            "descDe": "10% Chance einen zusätzlichen Gegenstand für die korrekte Beantwortung von Multiple Choice Fragen zu erhalten.",
            "icon": "🎁",
            "statKey": "bonus_acquisition"
        },
        {
            "id": 13,
            "x": 1100,
            "y": -750,
            "nameEn": "Enhanced Rewards",
            "nameDe": "Verbesserte Belohnungen",
            "descEn": "10% chance to receive an additional Item when answering a Multiple Choice question correctly.",
            "descDe": "10% Chance einen zusätzlichen Gegenstand für die korrekte Beantwortung von Multiple Choice Fragen zu erhalten.",
            "icon": "🎀",
            "statKey": "enhanced_rewards"
        },
        {
            "id": 14,
            "x": 1225,
            "y": -1000,
            "nameEn": "Overflowing Spoils",
            "nameDe": "Überfluss an Beute",
            "descEn": "10% chance to receive an additional Item when answering a Multiple Choice question correctly.",
            "descDe": "10% Chance einen zusätzlichen Gegenstand für die korrekte Beantwortung von Multiple Choice Fragen zu erhalten.",
            "icon": "🪙",
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
            "icon": "✂️",
            "statKey": "elimination_clue"
        },
        {
            "id": 16,
            "x": 800,
            "y": -1000,
            "nameEn": "Narrowed Options",
            "nameDe": "Eingeschränkte Optionen",
            "descEn": "20% chance to automatically remove one wrong answer from a Multiple Choice question.",
            "descDe": "20% Wahrscheinlichkeit, dass eine falsche Antwort bei Multiple - Choice Fragen automatisch entfernt wird.",
            "icon": "🗑️",
            "statKey": "narrowed_options"
        },
        {
            "id": 17,
            "x": 1000,
            "y": -1100,
            "nameEn": "Logical Deductions",
            "nameDe": "Logische Schlussfolgerungen",
            "descEn": "20% chance to automatically remove one wrong answer from a Multiple Choice question.",
            "descDe": "20% Wahrscheinlichkeit, dass eine falsche Antwort bei Multiple - Choice Fragen automatisch entfernt wird.",
            "icon": "🔬",
            "statKey": "logical_deductions"
        },
        {
            "id": 18,
            "x": 1300,
            "y": -1200,
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
            "icon": "📖",
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
            "icon": "📐",
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
            "icon": "📗",
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
            "icon": "📏",
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
            "icon": "📘",
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
            "icon": "🔢",
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
            "icon": "🎩",
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
            "icon": "📜",
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
            "icon": "🗺️",
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
            "icon": "🌅",
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
            "icon": "🌐",
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
            "icon": "📜",
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
            "icon": "🗺️",
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
            "icon": "🏗️",
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
            "icon": "🔭",
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
            "icon": "💫",
            "statKey": "celerity"
        },
        {
            "id": 36,
            "x": -750,
            "y": -200,
            "nameEn": "Gear of the Statistician",
            "nameDe": "Ausrüstung des Statistikers",
            "descEn": "Statisticians have a 33% chance to receive an additional Magnifier after completing a level.",
            "descDe": "Statistiker haben eine 33% Chance eine Lupe nach dem Abschluss eines Levels zu erhalten.",
            "icon": "📊",
            "statKey": "gear_of_the_statistician"
        },
        {
            "id": 37,
            "x": -750,
            "y": 1,
            "nameEn": "Gear of the Mathmagician",
            "nameDe": "Ausrüstung des Mathemagiers",
            "descEn": "Mathmagicians have a 10% chance to receive an additional Professor after completing a level.",
            "descDe": "Mathemagier haben eine 10% Chance einen Professor nach dem Abschluss eines Levels zu erhalten.",
            "icon": "🧮",
            "statKey": "gear_of_the_mathmagician"
        },
        {
            "id": 38,
            "x": -750,
            "y": 200,
            "nameEn": "Gear of the Probabilist",
            "nameDe": "Ausrüstung des Probabilisten",
            "descEn": "Probabilists have a 25% chance to receive an additional Sweeper after completing a level.",
            "descDe": "Probabilisten haben eine 25% Chance einen Besen nach dem Abschluss eines Levels zu erhalten.",
            "icon": "🎲",
            "statKey": "gear_of_the_probabilist"
        },
        {
            "id": 39,
            "x": -1200,
            "y": -500,
            "nameEn": "Improved Gear of the Statistician",
            "nameDe": "Verbesserte Ausrüstung des Statistikers",
            "descEn": "Statisticians have a 33% chance to receive an additional Error Gem after completing a level.",
            "descDe": "Statistiker haben eine 33% Chance einen Fehlerstein nach dem Abschluss eines Levels zu erhalten.",
            "icon": "📈",
            "statKey": "improved_gear_of_the_statistician"
        },
        {
            "id": 40,
            "x": -1500,
            "y": -500,
            "nameEn": "Chain Reaction",
            "nameDe": "Kettenreaktion",
            "descEn": "Gain +2 seconds whenever Momentum triggers.",
            "descDe": "Erhalte +2 Sekunden wenn Schwung ausgelöst wird.",
            "icon": "⛓️",
            "statKey": "chain_reaction"
        },
        {
            "id": 41,
            "x": -1800,
            "y": -500,
            "nameEn": "Precise Momentum",
            "nameDe": "Präziser Schwung",
            "descEn": "Gain +3 seconds whenever Momentum triggers.",
            "descDe": "Erhalte +3 Sekunden wenn Schwung ausgelöst wird.",
            "icon": "🏹",
            "statKey": "precise_momentum"
        },
        {
            "id": 42,
            "x": -2100,
            "y": -500,
            "nameEn": "Exponential Growth",
            "nameDe": "Exponentielles Wachstum",
            "descEn": "Each Momentum activation increases future Momentums by +1 seconds",
            "descDe": "Jede Schwung - Aktivierung erhöht zukünftige Schwünge um 1 Sekunde.",
            "icon": "🚀",
            "statKey": "exponential_growth"
        },
        {
            "id": 43,
            "x": -2400,
            "y": -500,
            "nameEn": "Learning from Mistakes",
            "nameDe": "Lernen aus Fehlern",
            "descEn": "Mistakes reduce the Momentum Streak - Counter by 3 instead of fully resetting it.",
            "descDe": "Fehler verringern den Schwung-Zähler um 3 statt ihn vollständig zurückzusetzen.",
            "icon": "🩹",
            "statKey": "learning_from_mistakes"
        },
        {
            "id": 44,
            "x": -2700,
            "y": -500,
            "nameEn": "Mistakes no Matter",
            "nameDe": "Fehler zählen nicht",
            "descEn": "Mistakes reduce the Momentum Streak - Counter by 3 instead of fully resetting it.",
            "descDe": "Fehler verringern den Schwung-Zähler um 3 statt ihn vollständig zurückzusetzen.",
            "icon": "💪",
            "statKey": "mistakes_no_matter"
        },
        {
            "id": 45,
            "x": -1500,
            "y": -650,
            "nameEn": "Monte Carlo",
            "nameDe": "Monte Carlo Simulation",
            "descEn": "Data Strike has a 25% chance to solve an additional random row or column.",
            "descDe": "Datenhieb hat eine 25% Chance eine weitere zufällige Zeile oder Spalte aufzudecken.",
            "icon": "🎰",
            "statKey": "monte_carlo"
        },
        {
            "id": 46,
            "x": -1800,
            "y": -651,
            "nameEn": "Correlation Matrix",
            "nameDe": "Korrelationsmatrix",
            "descEn": "Data Strike has a 25% chance to solve an additional random row or column.",
            "descDe": "Datenhieb hat eine 25% Chance eine weitere zufällige Zeile oder Spalte aufzudecken.",
            "icon": "🔗",
            "statKey": "correlation_matrix"
        },
        {
            "id": 47,
            "x": -2100,
            "y": -650,
            "nameEn": "Advanced Data Strike",
            "nameDe": "Verbesserter Datenhieb",
            "descEn": "Data Strike has a 25% chance to solve an additional random row or column.\nReduces the cooldown of Data Strike by 30 seconds.",
            "descDe": "Datenhieb hat eine 25% Chance eine weitere zufällige Zeile oder Spalte aufzudecken.\nReduziert die Abklingzeit von Datenhieb um 30 Sekunden.",
            "icon": "⚙️",
            "statKey": "advanced_data_strike"
        },
        {
            "id": 48,
            "x": -2400,
            "y": -650,
            "nameEn": "Swift Strike",
            "nameDe": "Schneller Hieb",
            "descEn": "Reduces the cooldown of Data Strike by 30 seconds.",
            "descDe": "Reduziert die Abklingzeit von Datenhieb um 30 Sekunden.",
            "icon": "⚡",
            "statKey": "swift_strike"
        },
        {
            "id": 49,
            "x": -2700,
            "y": -650,
            "nameEn": "Accelerated Computation",
            "nameDe": "Beschleunigte Berechnung",
            "descEn": "Reduces the cooldown of Data Strike by 30 seconds.",
            "descDe": "Reduziert die Abklingzeit von Datenhieb um 30 Sekunden.",
            "icon": "🖥️",
            "statKey": "accelerated_computation"
        },
        {
            "id": 50,
            "x": -1500,
            "y": -350,
            "nameEn": "Random Diagonal",
            "nameDe": "Zufällige Diagonale",
            "descEn": "Diagonal Strike has a 25% chance to be repeated on another random cell.",
            "descDe": "Diagonalschlag hat eine Chance von 25% zusätzlich auf eine andere zufällige Zelle angewendet zu werden.",
            "icon": "↗️",
            "statKey": "random_diagonal"
        },
        {
            "id": 51,
            "x": -1800,
            "y": -350,
            "nameEn": "Diagonal Witch",
            "nameDe": "Diagonale Hexe",
            "descEn": "Diagonal Strike has a 25% chance to be repeated on another random cell.",
            "descDe": "Diagonalschlag hat eine Chance von 25% zusätzlich auf eine andere zufällige Zelle angewendet zu werden.",
            "icon": "🔀",
            "statKey": "diagonal_witch"
        },
        {
            "id": 52,
            "x": -2100,
            "y": -350,
            "nameEn": "Diagonally Wrong",
            "nameDe": "Diagonal Falsch",
            "descEn": "Diagonal Strike now also marks incorrect cells as incorrect.",
            "descDe": "Diagonalschlag markiert nun auch falsche Zellen als falsch.",
            "icon": "✖️",
            "statKey": "diagonally_wrong"
        },
        {
            "id": 53,
            "x": -2400,
            "y": -350,
            "nameEn": "Quick Strike",
            "nameDe": "Schneller Schlag",
            "descEn": "Reduces the cooldown of Diagonal Strike by 30 seconds.",
            "descDe": "Reduziert die Abklingzeit von Diagonalschlag um 30 Sekunden",
            "icon": "🏃",
            "statKey": "quick_strike"
        },
        {
            "id": 54,
            "x": -2700,
            "y": -350,
            "nameEn": "Accelerated Striking",
            "nameDe": "Verschnellertes Schlagen",
            "descEn": "Reduces the cooldown of Diagonal Strike by 30 seconds.",
            "descDe": "Reduziert die Abklingzeit von Diagonalschlag um 30 Sekunden",
            "icon": "💨",
            "statKey": "accelerated_striking"
        },
        {
            "id": 55,
            "x": -3000,
            "y": -502,
            "nameEn": "God of Statistics",
            "nameDe": "Gott der Statistik",
            "descEn": "Each Data Strike beyond the first one in a level gains one additional choice of solving a random unsolved row or column.\nDoubles the Momentum Bonus.\nDiagonal Strike has a 50% chance to be repeated on another random cell.",
            "descDe": "Jeder Datenhieb nach dem Ersten erhält eine weitere Entscheidung zwischen dem Lösen einer ungelösten Zeile oder Spalte.\nVerdoppelt den Schwung - Bonus.\nDiagonalschlag hat eine Chance von 50% zusätzlich auf eine andere zufällige Zelle angewendet zu werden.",
            "icon": "✨",
            "statKey": "god_of_statistics"
        },
        {
            "id": 56,
            "x": -1200,
            "y": 1,
            "nameEn": "Improved Gear of the Mathmatigican",
            "nameDe": "Verbesserte Ausrüstung des Mathemagiers",
            "descEn": "Mathmagicians have a 5% chance to receive an additional Chronobolt after completing a level.",
            "descDe": "Mathemagier haben eine 5% Chance einen Chronoblitz nach dem Abschluss eines Levels zu erhalten.",
            "icon": "⚡",
            "statKey": "improved_gear_of_the_mathmagician"
        },
        {
            "id": 57,
            "x": -1500,
            "y": -150,
            "nameEn": "Arcane Echo",
            "nameDe": "Arkanes Echo",
            "descEn": "Arcane Reveal has a 25% chance to reveal one additional random unsolved filled cell.",
            "descDe": "Arkane Enthüllung hat eine 25% Chance, eine weitere zufällige ungelöste gefüllte Zelle aufzudecken.",
            "icon": "🔮",
            "statKey": "arcane_echo"
        },
        {
            "id": 58,
            "x": -1800,
            "y": -150,
            "nameEn": "Resonant Reveal",
            "nameDe": "Resonante Enthüllung",
            "descEn": "Arcane Reveal has a 25% chance to reveal one additional random unsolved filled cell.",
            "descDe": "Arkane Enthüllung hat eine 25% Chance, eine weitere zufällige ungelöste gefüllte Zelle aufzudecken.",
            "icon": "🌀",
            "statKey": "resonant_reveal"
        },
        {
            "id": 59,
            "x": -2100,
            "y": -150,
            "nameEn": "Arcane Exposure",
            "nameDe": "Arkane Bloßstellung",
            "descEn": "Arcane Reveal now also marks all empty cells in the affected area as incorrect.",
            "descDe": "Arkane Enthüllung markiert nun auch alle leeren Zellen im betroffenen Bereich als falsch.",
            "icon": "💥",
            "statKey": "arcane_exposure"
        },
        {
            "id": 60,
            "x": -2400,
            "y": -150,
            "nameEn": "Rapid Revelation",
            "nameDe": "Schnelle Offenbarung",
            "descEn": "Reduces the cooldown of Arcane Reveal by 30 seconds.",
            "descDe": "Reduziert die Abklingzeit von Arkaner Enthüllung um 30 Sekunden.",
            "icon": "🔵",
            "statKey": "rapid_revelation"
        },
        {
            "id": 61,
            "x": -2700,
            "y": -150,
            "nameEn": "Accelerated Revelation",
            "nameDe": "Beschleunigte Offenbarung",
            "descEn": "Reduces the cooldown of Arcane Reveal by 30 seconds.",
            "descDe": "Reduziert die Abklingzeit von Arkaner Enthüllung um 30 Sekunden.",
            "icon": "🔷",
            "statKey": "accelerated_revelation"
        },
        {
            "id": 62,
            "x": -1500,
            "y": 1,
            "nameEn": "Reinforced Shield",
            "nameDe": "Verstärkter Schild",
            "descEn": "Variance Shield absorbs 1 additional mistake per level.",
            "descDe": "Varianzschild absorbiert 1 weiteren Fehler pro Level.",
            "icon": "🛡️",
            "statKey": "reinforced_shield"
        },
        {
            "id": 63,
            "x": -1800,
            "y": 1,
            "nameEn": "Fortified Shield",
            "nameDe": "Gefestigter Schild",
            "descEn": "Variance Shield absorbs 1 additional mistake per level.",
            "descDe": "Varianzschild absorbiert 1 weiteren Fehler pro Level.",
            "icon": "🪖",
            "statKey": "fortified_shield"
        },
        {
            "id": 64,
            "x": -2100,
            "y": 1,
            "nameEn": "Calculated Error",
            "nameDe": "Kalkulierter Fehler",
            "descEn": "Absorbed mistakes have a 50% chance to add +5 seconds to the timer.",
            "descDe": "Absorbierte Fehler haben eine 50% Chance, +5 Sekunden zum Timer hinzuzufügen.",
            "icon": "⏳",
            "statKey": "calculated_error"
        },
        {
            "id": 65,
            "x": -2400,
            "y": 1,
            "nameEn": "Error Dividend",
            "nameDe": "Fehler-Dividende",
            "descEn": "Absorbed mistakes have a 25% chance to add +3 seconds to the timer.",
            "descDe": "Absorbierte Fehler haben eine 25% Chance, +3 Sekunden zum Timer hinzuzufügen.",
            "icon": "💰",
            "statKey": "error_dividend"
        },
        {
            "id": 66,
            "x": -2700,
            "y": 1,
            "nameEn": "Lucky Lapse",
            "nameDe": "Glücklicher Lapsus",
            "descEn": "Absorbed mistakes have a 25% chance to add +3 seconds to the timer.",
            "descDe": "Absorbierte Fehler haben eine 25% Chance, +3 Sekunden zum Timer hinzuzufügen.",
            "icon": "🍀",
            "statKey": "lucky_lapse"
        },
        {
            "id": 67,
            "x": -1500,
            "y": 150,
            "nameEn": "Prolonged Frost",
            "nameDe": "Verlängerter Frost",
            "descEn": "Absolute Zero lasts 0.5 seconds longer.",
            "descDe": "Absoluter Nullpunkt hält 0,5 Sekunden länger an.",
            "icon": "❄️",
            "statKey": "prolonged_frost"
        },
        {
            "id": 68,
            "x": -1800,
            "y": 150,
            "nameEn": "Deep Freeze",
            "nameDe": "Tiefgefroren",
            "descEn": "Absolute Zero lasts 0.5 seconds longer.",
            "descDe": "Absoluter Nullpunkt hält 0,5 Sekunden länger an.",
            "icon": "🧊",
            "statKey": "deep_freeze"
        },
        {
            "id": 69,
            "x": -2100,
            "y": 150,
            "nameEn": "Frozen Resilience",
            "nameDe": "Gefrorene Widerstandskraft",
            "descEn": "Every 5 correct cell fills during Absolute Zero allows the Variance Shield to absorb 1 additional mistake.",
            "descDe": "Alle 5 korrekt ausgefüllten Zellen während des Absoluten Nullpunkts laden den Varianzschild um 1 absorbierten Fehler auf.",
            "icon": "🛡️",
            "statKey": "frozen_resilience"
        },
        {
            "id": 70,
            "x": -2400,
            "y": 150,
            "nameEn": "Hastened Zero",
            "nameDe": "Beschleunigter Nullpunkt",
            "descEn": "Reduces the cooldown of Absolute Zero by 30 seconds.",
            "descDe": "Reduziert die Abklingzeit von Absolutem Nullpunkt um 30 Sekunden.",
            "icon": "🔵",
            "statKey": "hastened_zero"
        },
        {
            "id": 71,
            "x": -2700,
            "y": 150,
            "nameEn": "Accelerated Zero",
            "nameDe": "Beschleunigter Nullpunkt II",
            "descEn": "Reduces the cooldown of Absolute Zero by 30 seconds.",
            "descDe": "Reduziert die Abklingzeit von Absolutem Nullpunkt um 30 Sekunden.",
            "icon": "🔷",
            "statKey": "accelerated_zero"
        },
        {
            "id": 72,
            "x": -3000,
            "y": 1,
            "nameEn": "God of Math",
            "nameDe": "Gott der Mathematik",
            "descEn": "Arcane Reveal's radius is increased by 1.\nDoubles the amount of seconds absorbed mistakes add to the timer.\nEach correct cell fill during Absolute Zero reduces the remaining cooldown of Arcane Reveal by 1 second.",
            "descDe": "Der Radius von Arkaner Enthüllung wird um 1 erhöht.\nVerdoppelt die Sekunden, die absorbierte Fehler zum Timer hinzufügen.\nJedes korrekt ausgefüllte Feld während des Absoluten Nullpunkts reduziert die verbleibende Abklingzeit von Arkaner Enthüllung um 1 Sekunde.",
            "icon": "✨",
            "statKey": "god_of_math"
        },
        {
            "id": 73,
            "x": -1500,
            "y": 350,
            "nameEn": "Probabilistic Sweep",
            "nameDe": "Probabilistischer Schwung",
            "descEn": "Precision Mark has a 25% chance to also mark one additional random row or column of empty cells.",
            "descDe": "Präzisionsmarkierung hat eine 25% Chance, eine weitere zufällige Zeile oder Spalte mit leeren Zellen zu markieren.",
            "icon": "🖊️",
            "statKey": "probabilistic_sweep"
        },
        {
            "id": 74,
            "x": -1800,
            "y": 346,
            "nameEn": "Expanded Inference",
            "nameDe": "Erweiterte Schlussfolgerung",
            "descEn": "Precision Mark has a 25% chance to also mark one additional random row or column of empty cells.",
            "descDe": "Präzisionsmarkierung hat eine 25% Chance, eine weitere zufällige Zeile oder Spalte mit leeren Zellen zu markieren.",
            "icon": "📝",
            "statKey": "expanded_inference"
        },
        {
            "id": 75,
            "x": -2100,
            "y": 345,
            "nameEn": "Momentum of Certainty",
            "nameDe": "Schwung der Gewissheit",
            "descEn": "After Precision Mark resolves, correctly filling any cell in the affected rows or columns within 10 seconds grants +3 minutes to the timer.",
            "descDe": "Nach der Präzisionsmarkierung gibt das korrekte Ausfüllen einer Zelle in den betroffenen Zeilen oder Spalten innerhalb von 10 Sekunden +3 Minuten auf den Timer.",
            "icon": "⚡",
            "statKey": "momentum_of_certainty"
        },
        {
            "id": 76,
            "x": -2400,
            "y": 343,
            "nameEn": "Swift Marking",
            "nameDe": "Schnelle Markierung",
            "descEn": "Reduces the cooldown of Precision Mark by 30 seconds.",
            "descDe": "Reduziert die Abklingzeit von Präzisionsmarkierung um 30 Sekunden.",
            "icon": "🔵",
            "statKey": "swift_marking"
        },
        {
            "id": 77,
            "x": -2700,
            "y": 349,
            "nameEn": "Accelerated Marking",
            "nameDe": "Beschleunigte Markierung",
            "descEn": "Reduces the cooldown of Precision Mark by 30 seconds.",
            "descDe": "Reduziert die Abklingzeit von Präzisionsmarkierung um 30 Sekunden.",
            "icon": "🔷",
            "statKey": "accelerated_marking"
        },
        {
            "id": 78,
            "x": -1500,
            "y": 500,
            "nameEn": "Prior Knowledge",
            "nameDe": "Vorwissen",
            "descEn": "Bayesian Insight auto-marks 2 additional random wrong tiles at the start of each level.",
            "descDe": "Bayesianische Intuition markiert zu Beginn jedes Levels 2 zusätzliche zufällige falsche Zellen automatisch.",
            "icon": "🧪",
            "statKey": "prior_knowledge"
        },
        {
            "id": 79,
            "x": -1800,
            "y": 500,
            "nameEn": "Updated Beliefs",
            "nameDe": "Aktualisierte Überzeugungen",
            "descEn": "Bayesian Insight auto-marks 2 additional random wrong tiles at the start of each level.",
            "descDe": "Bayesianische Intuition markiert zu Beginn jedes Levels 2 zusätzliche zufällige falsche Zellen automatisch.",
            "icon": "🔬",
            "statKey": "updated_beliefs"
        },
        {
            "id": 80,
            "x": -2100,
            "y": 500,
            "nameEn": "Confirmed Hypothesis",
            "nameDe": "Bestätigte Hypothese",
            "descEn": "Bayesian Insight also reveals 1 random correct filled cell at the start of each level.",
            "descDe": "Bayesianische Intuition enthüllt zu Beginn jedes Levels auch 1 zufällige korrekte gefüllte Zelle.",
            "icon": "💡",
            "statKey": "confirmed_hypothesis"
        },
        {
            "id": 81,
            "x": -2400,
            "y": 500,
            "nameEn": "Posterior Insight",
            "nameDe": "Nachträgliche Erkenntnis",
            "descEn": "Bayesian Insight auto-marks 2 additional random wrong tiles at the start of each level.",
            "descDe": "Bayesianische Intuition markiert zu Beginn jedes Levels 2 zusätzliche zufällige falsche Zellen automatisch.",
            "icon": "📋",
            "statKey": "posterior_insight"
        },
        {
            "id": 82,
            "x": -2700,
            "y": 500,
            "nameEn": "Convergent Evidence",
            "nameDe": "Konvergente Beweise",
            "descEn": "Bayesian Insight auto-marks 2 additional random wrong tiles at the start of each level.",
            "descDe": "Bayesianische Intuition markiert zu Beginn jedes Levels 2 zusätzliche zufällige falsche Zellen automatisch.",
            "icon": "🗂️",
            "statKey": "convergent_evidence"
        },
        {
            "id": 83,
            "x": -1500,
            "y": 650,
            "nameEn": "Wider Lens",
            "nameDe": "Weiteres Sichtfeld",
            "descEn": "Field Scan's region is increased by 1 in both width and height.",
            "descDe": "Der Bereich des Feldscan wird um 1 in Breite und Höhe vergrößert.",
            "icon": "🔍",
            "statKey": "wider_lens"
        },
        {
            "id": 84,
            "x": -1800,
            "y": 650,
            "nameEn": "Panoramic View",
            "nameDe": "Panoramablick",
            "descEn": "Field Scan's region is increased by 1 in both width and height.",
            "descDe": "Der Bereich des Feldscans wird um 1 in Breite und Höhe vergrößert.",
            "icon": "🌄",
            "statKey": "panoramic_view"
        },
        {
            "id": 85,
            "x": -2100,
            "y": 650,
            "nameEn": "Photographic Memory",
            "nameDe": "Fotografisches Gedächtnis",
            "descEn": "Field Scan lasts 5 seconds longer.",
            "descDe": "Feldscan hält 5 Sekunden länger an.",
            "icon": "📸",
            "statKey": "photographic_memory"
        },
        {
            "id": 86,
            "x": -2400,
            "y": 650,
            "nameEn": "Swift Scan",
            "nameDe": "Schneller Scan",
            "descEn": "Reduces the cooldown of Field Scan by 30 seconds.",
            "descDe": "Reduziert die Abklingzeit von Feldscan um 30 Sekunden.",
            "icon": "🔵",
            "statKey": "swift_scan"
        },
        {
            "id": 87,
            "x": -2700,
            "y": 650,
            "nameEn": "Accelerated Scan",
            "nameDe": "Beschleunigter Scan",
            "descEn": "Reduces the cooldown of Field Scan by 30 seconds.",
            "descDe": "Reduziert die Abklingzeit von Feldscan um 30 Sekunden.",
            "icon": "🔷",
            "statKey": "accelerated_scan"
        },
        {
            "id": 88,
            "x": -3000,
            "y": 504,
            "nameEn": "God of Probabilities",
            "nameDe": "Gott der Wahrscheinlichkeiten",
            "descEn": "Precision Mark has a 25% chance to mark one additional random row or column of empty cells.\nBayesian Insight reveals 1 additional random correct filled cell at the start of each level.\nFilled cells during a field scan are still filled after the field scan.",
            "descDe": "Präzisionsmarkierung hat eine 25% Chance, eine weitere zufällige Zeile oder Spalte mit leeren Zellen zu markieren.\nBayesianische Intuition enthüllt zu Beginn jedes Levels 1 weitere zufällige korrekte gefüllte Zelle.\nAusgefüllte Zellen, die durch den Feldscan aufgedeckt werden, sind auch nach dem Feldscan ausgefüllt.",
            "icon": "✨",
            "statKey": "god_of_probabilities"
        },
        {
            "id": 89,
            "x": -1200,
            "y": 500,
            "nameEn": "Improved Gear of the Probabilist",
            "nameDe": "Verbesserte Ausrüstung des Probabilisten",
            "descEn": "Probabilists have a 15% chance to receive an additional Error Magnet after completing a level.",
            "descDe": "Probabilisten haben eine 15% Chance einen Fehler-Magneten nach dem Abschluss eines Levels zu erhalten.",
            "icon": "🎯",
            "statKey": "improved_gear_of_the_probabilist"
        },
        {
            "id": 90,
            "x": -1,
            "y": 400,
            "nameEn": "Lucky Drops",
            "nameDe": "Glücksfunde",
            "descEn": "Completing an already completed level has a 20% chance of granting an item.",
            "descDe": "Das erneute Abschließen eines bereits abgeschlossenen Levels gewährt mit 20 % Wahrscheinlichkeit einen Gegenstand.",
            "icon": "🍀",
            "statKey": "lucky_drops"
        },
        {
            "id": 91,
            "x": 260,
            "y": 443,
            "nameEn": "Lucky Replay",
            "nameDe": "Glückliche Wiederholung",
            "descEn": "10% increased chance of obtaining two instead of one additional items when Lucky Drops triggers.",
            "descDe": "10% erhöhte Chance zwei anstatt einem weiteren Gegenstand zu erhalten wenn Glücksfunde aktiviert werden.",
            "icon": "🎲",
            "statKey": "lucky_replay_1"
        },
        {
            "id": 92,
            "x": 491,
            "y": 569,
            "nameEn": "Lucky Replay",
            "nameDe": "Glückliche Wiederholung",
            "descEn": "10% increased chance of obtaining two instead of one additional items when Lucky Drops triggers.",
            "descDe": "10% erhöhte Chance zwei anstatt einem weiteren Gegenstand zu erhalten wenn Glücksfunde aktiviert werden.",
            "icon": "🎲",
            "statKey": "lucky_replay_2"
        },
        {
            "id": 93,
            "x": 670,
            "y": 762,
            "nameEn": "Lucky Replay",
            "nameDe": "Glückliche Wiederholung",
            "descEn": "10% increased chance of obtaining two instead of one additional items when Lucky Drops triggers.",
            "descDe": "10% erhöhte Chance zwei anstatt einem weiteren Gegenstand zu erhalten wenn Glücksfunde aktiviert werden.",
            "icon": "🎲",
            "statKey": "lucky_replay_3"
        },
        {
            "id": 94,
            "x": -260,
            "y": 443,
            "nameEn": "Bonus Replay",
            "nameDe": "Bonuswiederholung",
            "descEn": "10% increased chance of Lucky Drops happening.",
            "descDe": "10% erhöhte Chance dass Glücksfunde aktiviert werden.",
            "icon": "🎁",
            "statKey": "bonus_replay_1"
        },
        {
            "id": 95,
            "x": -491,
            "y": 569,
            "nameEn": "Bonus Replay",
            "nameDe": "Bonuswiederholung",
            "descEn": "10% increased chance of Lucky Drops happening.",
            "descDe": "10% erhöhte Chance dass Glücksfunde aktiviert werden.",
            "icon": "🎁",
            "statKey": "bonus_replay_2"
        },
        {
            "id": 96,
            "x": -670,
            "y": 762,
            "nameEn": "Bonus Replay",
            "nameDe": "Bonuswiederholung",
            "descEn": "10% increased chance of Lucky Drops happening.",
            "descDe": "10% erhöhte Chance dass Glücksfunde aktiviert werden.",
            "icon": "🎁",
            "statKey": "bonus_replay_3"
        },
        {
            "id": 97,
            "x": -100,
            "y": 1200,
            "nameEn": "Quality Loot",
            "nameDe": "Hochwertige Beute",
            "descEn": "10% increased chance of receiving Epic, or Legendary items.",
            "descDe": "10% erhöhte Chance auf Epische oder Legendäre Gegenstände.",
            "icon": "💎",
            "statKey": "quality_loot_1"
        },
        {
            "id": 98,
            "x": 100,
            "y": 1200,
            "nameEn": "Quality Loot",
            "nameDe": "Hochwertige Beute",
            "descEn": "10% increased chance of receiving Epic, or Legendary items.",
            "descDe": "10% erhöhte Chance auf Epische oder Legendäre Gegenstände.",
            "icon": "💎",
            "statKey": "quality_loot_2"
        },
        {
            "id": 99,
            "x": -1,
            "y": 1100,
            "nameEn": "Quality Loot",
            "nameDe": "Hochwertige Beute",
            "descEn": "10% increased chance of receiving Epic, or Legendary items.",
            "descDe": "10% erhöhte Chance auf Epische oder Legendäre Gegenstände.",
            "icon": "💎",
            "statKey": "quality_loot_3"
        },
        {
            "id": 100,
            "x": 350,
            "y": 1830,
            "nameEn": "Cursed Attraction",
            "nameDe": "Verfluchte Anziehung",
            "descEn": "5% increased chance of receiving Cursed items.",
            "descDe": "5% erhöhte Chance auf verfluchte Gegenstände.",
            "icon": "☠️",
            "statKey": "cursed_attraction_1"
        },
        {
            "id": 101,
            "x": 320,
            "y": 1725,
            "nameEn": "Cursed Attraction",
            "nameDe": "Verfluchte Anziehung",
            "descEn": "5% increased chance of receiving Cursed items.",
            "descDe": "5% erhöhte Chance auf verfluchte Gegenstände.",
            "icon": "☠️",
            "statKey": "cursed_attraction_2"
        },
        {
            "id": 102,
            "x": 300,
            "y": 1620,
            "nameEn": "Cursed Attraction",
            "nameDe": "Verfluchte Anziehung",
            "descEn": "10% increased chance of receiving Cursed items.",
            "descDe": "10% erhöhte Chance auf verfluchte Gegenstände.",
            "icon": "☠️",
            "statKey": "cursed_attraction_3"
        },
        {
            "id": 103,
            "x": -350,
            "y": 1830,
            "nameEn": "Frugal Use",
            "nameDe": "Sparsamer Einsatz",
            "descEn": "5% chance that an item is not consumed when used.",
            "descDe": "5% Chance, dass ein Gegenstand beim Benutzen nicht verbraucht wird.",
            "icon": "♻️",
            "statKey": "frugal_use_1"
        },
        {
            "id": 104,
            "x": -320,
            "y": 1725,
            "nameEn": "Frugal Use",
            "nameDe": "Sparsamer Einsatz",
            "descEn": "5% chance that an item is not consumed when used.",
            "descDe": "5% Chance, dass ein Gegenstand beim Benutzen nicht verbraucht wird.",
            "icon": "♻️",
            "statKey": "frugal_use_2"
        },
        {
            "id": 105,
            "x": -300,
            "y": 1620,
            "nameEn": "Frugal Use",
            "nameDe": "Sparsamer Einsatz",
            "descEn": "7% chance that an item is not consumed when used.",
            "descDe": "7% Chance, dass ein Gegenstand beim Benutzen nicht verbraucht wird.",
            "icon": "♻️",
            "statKey": "frugal_use_3"
        },
        {
            "id": 106,
            "x": -776,
            "y": 1004,
            "nameEn": "Stronger Light",
            "nameDe": "Stärkeres Licht",
            "descEn": "Reveal items reveal 1 additional cell.",
            "descDe": "Enthüllungsgegenstände enthüllen 1 zusätzliche Zelle.",
            "icon": "🕯️",
            "statKey": "stronger_light_1"
        },
        {
            "id": 107,
            "x": -797,
            "y": 1266,
            "nameEn": "Stronger Light",
            "nameDe": "Stärkeres Licht",
            "descEn": "Reveal items reveal 1 additional cell.",
            "descDe": "Enthüllungsgegenstände enthüllen 1 zusätzliche Zelle.",
            "icon": "🕯️",
            "statKey": "stronger_light_2"
        },
        {
            "id": 108,
            "x": -733,
            "y": 1521,
            "nameEn": "Stronger Light",
            "nameDe": "Stärkeres Licht",
            "descEn": "Reveal items reveal 1 additional cell.",
            "descDe": "Enthüllungsgegenstände enthüllen 1 zusätzliche Zelle.",
            "icon": "🕯️",
            "statKey": "stronger_light_3"
        },
        {
            "id": 109,
            "x": 700,
            "y": 1200,
            "nameEn": "Stronger Marks",
            "nameDe": "Stärkere Markierungen",
            "descEn": "Mark-wrong items mark 1 additional cell.",
            "descDe": "Markierungsgegenstände markieren 1 zusätzliche Zelle.",
            "icon": "✏️",
            "statKey": "stronger_marks_1"
        },
        {
            "id": 110,
            "x": 600,
            "y": 1200,
            "nameEn": "Stronger Marks",
            "nameDe": "Stärkere Markierungen",
            "descEn": "Mark-wrong items mark 1 additional cell.",
            "descDe": "Markierungsgegenstände markieren 1 zusätzliche Zelle.",
            "icon": "✏️",
            "statKey": "stronger_marks_2"
        },
        {
            "id": 111,
            "x": 500,
            "y": 1200,
            "nameEn": "Stronger Marks",
            "nameDe": "Stärkere Markierungen",
            "descEn": "Mark-wrong items mark 1 additional cell.",
            "descDe": "Markierungsgegenstände markieren 1 zusätzliche Zelle.",
            "icon": "✏️",
            "statKey": "stronger_marks_3"
        },
        {
            "id": 112,
            "x": 776,
            "y": 1004,
            "nameEn": "Scholarly Aid",
            "nameDe": "Gelehrte Hilfe",
            "descEn": "Tutor items reduce an additional mistake when used.",
            "descDe": "Tutor-Gegenstände reduzieren beim Benutzen einen zusätzlichen Fehler.",
            "icon": "🎓",
            "statKey": "scholarly_aid_1"
        },
        {
            "id": 113,
            "x": 797,
            "y": 1266,
            "nameEn": "Scholarly Aid",
            "nameDe": "Gelehrte Hilfe",
            "descEn": "Tutor items reduce an additional mistake when used.",
            "descDe": "Tutor-Gegenstände reduzieren beim Benutzen einen zusätzlichen Fehler.",
            "icon": "🎓",
            "statKey": "scholarly_aid_2"
        },
        {
            "id": 114,
            "x": 733,
            "y": 1521,
            "nameEn": "Scholarly Aid",
            "nameDe": "Gelehrte Hilfe",
            "descEn": "Tutor items reduce an additional mistake when used.",
            "descDe": "Tutor-Gegenstände reduzieren beim Benutzen einen zusätzlichen Fehler.",
            "icon": "🎓",
            "statKey": "scholarly_aid_3"
        },
        {
            "id": 115,
            "x": -589,
            "y": 1742,
            "nameEn": "Reinforced Ward",
            "nameDe": "Verstärkte Abwehr",
            "descEn": "Shield items absorb 1 additional mistake.",
            "descDe": "Schild-Gegenstände absorbieren 1 zusätzlichen Fehler.",
            "icon": "🛡️",
            "statKey": "reinforced_ward_1"
        },
        {
            "id": 116,
            "x": -381,
            "y": 1904,
            "nameEn": "Reinforced Ward",
            "nameDe": "Verstärkte Abwehr",
            "descEn": "Shield items absorb 1 additional mistake.",
            "descDe": "Schild-Gegenstände absorbieren 1 zusätzlichen Fehler.",
            "icon": "🛡️",
            "statKey": "reinforced_ward_2"
        },
        {
            "id": 117,
            "x": -132,
            "y": 1989,
            "nameEn": "Reinforced Ward",
            "nameDe": "Verstärkte Abwehr",
            "descEn": "Shield items absorb 1 additional mistake.",
            "descDe": "Schild-Gegenstände absorbieren 1 zusätzlichen Fehler.",
            "icon": "🛡️",
            "statKey": "reinforced_ward_3"
        },
        {
            "id": 118,
            "x": 132,
            "y": 1989,
            "nameEn": "Extended Hour",
            "nameDe": "Verlängerte Stunde",
            "descEn": "Timer items grant 10% more time.",
            "descDe": "Timer-Gegenstände gewähren 10% mehr Zeit.",
            "icon": "⏳",
            "statKey": "extended_hour_1"
        },
        {
            "id": 119,
            "x": 381,
            "y": 1904,
            "nameEn": "Extended Hour",
            "nameDe": "Verlängerte Stunde",
            "descEn": "Timer items grant 10% more time.",
            "descDe": "Timer-Gegenstände gewähren 10% mehr Zeit.",
            "icon": "⏳",
            "statKey": "extended_hour_2"
        },
        {
            "id": 120,
            "x": 589,
            "y": 1742,
            "nameEn": "Extended Hour",
            "nameDe": "Verlängerte Stunde",
            "descEn": "Timer items grant 15% more time.",
            "descDe": "Timer-Gegenstände gewähren 15% mehr Zeit.",
            "icon": "⏳",
            "statKey": "extended_hour_3"
        },
        {
            "id": 121,
            "x": -700,
            "y": 1200,
            "nameEn": "Dampened Curse",
            "nameDe": "Gedämpfter Fluch",
            "descEn": "Cursed item downsides are 10% less severe (shorter durations, fewer tiles affected).",
            "descDe": "Negative Effekte von verfluchten Gegenständen sind 10% schwächer (kürzere Dauer, weniger betroffene Felder).",
            "icon": "🌫️",
            "statKey": "dampened_curse_1"
        },
        {
            "id": 122,
            "x": -600,
            "y": 1200,
            "nameEn": "Dampened Curse",
            "nameDe": "Gedämpfter Fluch",
            "descEn": "Cursed item downsides are 10% less severe (shorter durations, fewer tiles affected).",
            "descDe": "Negative Effekte von verfluchten Gegenständen sind 10% schwächer (kürzere Dauer, weniger betroffene Felder).",
            "icon": "🌫️",
            "statKey": "dampened_curse_2"
        },
        {
            "id": 123,
            "x": -500,
            "y": 1200,
            "nameEn": "Dampened Curse",
            "nameDe": "Gedämpfter Fluch",
            "descEn": "Cursed item downsides are 15% less severe (shorter durations, fewer tiles affected).",
            "descDe": "Negative Effekte von verfluchten Gegenständen sind 15% schwächer (kürzere Dauer, weniger betroffene Felder).",
            "icon": "🌫️",
            "statKey": "dampened_curse_3"
        },
        {
            "id": 124,
            "x": -1,
            "y": 500,
            "nameEn": "Common Refinement",
            "nameDe": "Gemeine Verfeinerung",
            "descEn": "Common items have a 5% chance to be upgraded to Uncommon when granted as a reward.",
            "descDe": "Gewöhnliche Gegenstände haben beim Erhalt als Belohnung eine 5% Chance, auf Ungewöhnlich aufgewertet zu werden.",
            "icon": "⬆️",
            "statKey": "common_refinement_1"
        },
        {
            "id": 125,
            "x": -1,
            "y": 600,
            "nameEn": "Common Refinement",
            "nameDe": "Gemeine Verfeinerung",
            "descEn": "Common items have a 5% chance to be upgraded to Uncommon when granted as a reward.",
            "descDe": "Gewöhnliche Gegenstände haben beim Erhalt als Belohnung eine 5% Chance, auf Ungewöhnlich aufgewertet zu werden.",
            "icon": "⬆️",
            "statKey": "common_refinement_2"
        },
        {
            "id": 126,
            "x": -1,
            "y": 700,
            "nameEn": "Common Refinement",
            "nameDe": "Gemeine Verfeinerung",
            "descEn": "Common items have a 10% chance to be upgraded to Uncommon when granted as a reward.",
            "descDe": "Gewöhnliche Gegenstände haben beim Erhalt als Belohnung eine 10% Chance, auf Ungewöhnlich aufgewertet zu werden.",
            "icon": "⬆️",
            "statKey": "common_refinement_3"
        },
        {
            "id": 127,
            "x": 400,
            "y": 1200,
            "nameEn": "Targeted Reveal I",
            "nameDe": "Gezielte Enthüllung I",
            "descEn": "Reveal items have a 20% chance to prioritize cells in the unsolved row or column with the fewest filled cells.",
            "descDe": "Enthüllungsgegenstände haben eine 20% Chance, Zellen in der ungelösten Zeile oder Spalte mit den wenigsten gefüllten Zellen zu priorisieren.",
            "icon": "🕯️",
            "statKey": "targeted_reveal_1"
        },
        {
            "id": 128,
            "x": 300,
            "y": 1200,
            "nameEn": "Targeted Reveal II",
            "nameDe": "Gezielte Enthüllung II",
            "descEn": "Reveal items have a 20% chance to prioritize cells in the unsolved row or column with the fewest filled cells.",
            "descDe": "Enthüllungsgegenstände haben eine 20% Chance, Zellen in der ungelösten Zeile oder Spalte mit den wenigsten gefüllten Zellen zu priorisieren.",
            "icon": "🔍",
            "statKey": "targeted_reveal_2"
        },
        {
            "id": 129,
            "x": 200,
            "y": 1112,
            "nameEn": "Targeted Reveal III",
            "nameDe": "Gezielte Enthüllung III",
            "descEn": "Reveal items have a 30% chance to prioritize cells in the unsolved row or column with the fewest filled cells.",
            "descDe": "Enthüllungsgegenstände haben eine 30% Chance, Zellen in der ungelösten Zeile oder Spalte mit den wenigsten gefüllten Zellen zu priorisieren.",
            "icon": "🔭",
            "statKey": "targeted_reveal_3"
        },
        {
            "id": 130,
            "x": -800,
            "y": 700,
            "nameEn": "Dense Marker I",
            "nameDe": "Dichter Markierer I",
            "descEn": "Mark-wrong items have a 20% chance to prioritize cells in rows or columns that already have many filled cells (but are not yet complete).",
            "descDe": "Markierungsgegenstände haben eine 20% Chance, Zellen in Zeilen oder Spalten mit vielen bereits gefüllten Zellen zu priorisieren (sofern diese noch nicht vollständig sind).",
            "icon": "✏️",
            "statKey": "dense_marker_1"
        },
        {
            "id": 131,
            "x": -950,
            "y": 700,
            "nameEn": "Dense Marker II",
            "nameDe": "Dichter Markierer II",
            "descEn": "Mark-wrong items have a 20% chance to prioritize cells in rows or columns that already have many filled cells (but are not yet complete).",
            "descDe": "Markierungsgegenstände haben eine 20% Chance, Zellen in Zeilen oder Spalten mit vielen bereits gefüllten Zellen zu priorisieren (sofern diese noch nicht vollständig sind).",
            "icon": "🧹",
            "statKey": "dense_marker_2"
        },
        {
            "id": 132,
            "x": -850,
            "y": 600,
            "nameEn": "Dense Marker III",
            "nameDe": "Dichter Markierer III",
            "descEn": "Mark-wrong items have a 30% chance to prioritize cells in rows or columns that already have many filled cells (but are not yet complete).",
            "descDe": "Markierungsgegenstände haben eine 30% Chance, Zellen in Zeilen oder Spalten mit vielen bereits gefüllten Zellen zu priorisieren (sofern diese noch nicht vollständig sind).",
            "icon": "🧲",
            "statKey": "dense_marker_3"
        },
        {
            "id": 133,
            "x": 800,
            "y": 700,
            "nameEn": "Seeker of Light I",
            "nameDe": "Sucher des Lichts I",
            "descEn": "15% increased chance of obtaining Reveal items as rewards.",
            "descDe": "15% erhöhte Chance, Enthüllungsgegenstände als Belohnung zu erhalten.",
            "icon": "🕯️",
            "statKey": "seeker_of_light_1"
        },
        {
            "id": 134,
            "x": 950,
            "y": 700,
            "nameEn": "Seeker of Light II",
            "nameDe": "Sucher des Lichts II",
            "descEn": "15% increased chance of obtaining Reveal items as rewards.",
            "descDe": "15% erhöhte Chance, Enthüllungsgegenstände als Belohnung zu erhalten.",
            "icon": "🔍",
            "statKey": "seeker_of_light_2"
        },
        {
            "id": 135,
            "x": 850,
            "y": 600,
            "nameEn": "Seeker of Light III",
            "nameDe": "Sucher des Lichts III",
            "descEn": "20% increased chance of obtaining Reveal items as rewards.",
            "descDe": "20% erhöhte Chance, Enthüllungsgegenstände als Belohnung zu erhalten.",
            "icon": "🔭",
            "statKey": "seeker_of_light_3"
        },
        {
            "id": 136,
            "x": -250,
            "y": 1500,
            "nameEn": "Error Collector I",
            "nameDe": "Fehlersammler I",
            "descEn": "15% increased chance of obtaining Mark-wrong items as rewards.",
            "descDe": "15% erhöhte Chance, Markierungsgegenstände als Belohnung zu erhalten.",
            "icon": "✏️",
            "statKey": "error_collector_1"
        },
        {
            "id": 137,
            "x": -200,
            "y": 1350,
            "nameEn": "Error Collector II",
            "nameDe": "Fehlersammler II",
            "descEn": "15% increased chance of obtaining Mark-wrong items as rewards.",
            "descDe": "15% erhöhte Chance, Markierungsgegenstände als Belohnung zu erhalten.",
            "icon": "🧹",
            "statKey": "error_collector_2"
        },
        {
            "id": 138,
            "x": -300,
            "y": 1300,
            "nameEn": "Error Collector III",
            "nameDe": "Fehlersammler III",
            "descEn": "20% increased chance of obtaining Mark-wrong items as rewards.",
            "descDe": "20% erhöhte Chance, Markierungsgegenstände als Belohnung zu erhalten.",
            "icon": "🧲",
            "statKey": "error_collector_3"
        },
        {
            "id": 139,
            "x": 250,
            "y": 1500,
            "nameEn": "Mentor's Following I",
            "nameDe": "Mentors Gefolgschaft I",
            "descEn": "15% increased chance of obtaining Tutor items as rewards.",
            "descDe": "15% erhöhte Chance, Tutor-Gegenstände als Belohnung zu erhalten.",
            "icon": "🎓",
            "statKey": "mentors_following_1"
        },
        {
            "id": 140,
            "x": 200,
            "y": 1350,
            "nameEn": "Mentor's Following II",
            "nameDe": "Mentors Gefolgschaft II",
            "descEn": "15% increased chance of obtaining Tutor items as rewards.",
            "descDe": "15% erhöhte Chance, Tutor-Gegenstände als Belohnung zu erhalten.",
            "icon": "📚",
            "statKey": "mentors_following_2"
        },
        {
            "id": 141,
            "x": 300,
            "y": 1300,
            "nameEn": "Mentor's Following III",
            "nameDe": "Mentors Gefolgschaft III",
            "descEn": "20% increased chance of obtaining Tutor items as rewards.",
            "descDe": "20% erhöhte Chance, Tutor-Gegenstände als Belohnung zu erhalten.",
            "icon": "🏛️",
            "statKey": "mentors_following_3"
        },
        {
            "id": 142,
            "x": 800,
            "y": 1800,
            "nameEn": "Warden's Stockpile I",
            "nameDe": "Vorrat des Wächters I",
            "descEn": "15% increased chance of obtaining Shield items as rewards.",
            "descDe": "15% erhöhte Chance, Schild-Gegenstände als Belohnung zu erhalten.",
            "icon": "🛡️",
            "statKey": "wardens_stockpile_1"
        },
        {
            "id": 143,
            "x": 700,
            "y": 1900,
            "nameEn": "Warden's Stockpile II",
            "nameDe": "Vorrat des Wächters II",
            "descEn": "15% increased chance of obtaining Shield items as rewards.",
            "descDe": "15% erhöhte Chance, Schild-Gegenstände als Belohnung zu erhalten.",
            "icon": "🛡️",
            "statKey": "wardens_stockpile_2"
        },
        {
            "id": 144,
            "x": 850,
            "y": 1900,
            "nameEn": "Warden's Stockpile III",
            "nameDe": "Vorrat des Wächters III",
            "descEn": "20% increased chance of obtaining Shield items as rewards.",
            "descDe": "20% erhöhte Chance, Schild-Gegenstände als Belohnung zu erhalten.",
            "icon": "🛡️",
            "statKey": "wardens_stockpile_3"
        },
        {
            "id": 145,
            "x": -800,
            "y": 1800,
            "nameEn": "Utility Hoarder I",
            "nameDe": "Nützlichkeitssammler I",
            "descEn": "15% increased chance of obtaining Utility items as rewards.",
            "descDe": "15% erhöhte Chance, Nützlichkeitsgegenstände als Belohnung zu erhalten.",
            "icon": "🔧",
            "statKey": "utility_hoarder_1"
        },
        {
            "id": 146,
            "x": -700,
            "y": 1900,
            "nameEn": "Utility Hoarder II",
            "nameDe": "Nützlichkeitssammler II",
            "descEn": "15% increased chance of obtaining Utility items as rewards.",
            "descDe": "15% erhöhte Chance, Nützlichkeitsgegenstände als Belohnung zu erhalten.",
            "icon": "🔧",
            "statKey": "utility_hoarder_2"
        },
        {
            "id": 147,
            "x": -850,
            "y": 1900,
            "nameEn": "Utility Hoarder III",
            "nameDe": "Nützlichkeitssammler III",
            "descEn": "20% increased chance of obtaining Utility items as rewards.",
            "descDe": "20% erhöhte Chance, Nützlichkeitsgegenstände als Belohnung zu erhalten.",
            "icon": "🔧",
            "statKey": "utility_hoarder_3"
        },
        {
            "id": 148,
            "x": -400,
            "y": 1200,
            "nameEn": "Time Well Spent I",
            "nameDe": "Zeit gut genutzt I",
            "descEn": "Using a Tutor item to remove a mistake also adds 30 seconds to the timer.",
            "descDe": "Das Benutzen eines Tutor-Gegenstands zum Entfernen eines Fehlers fügt dem Timer zusätzlich 30 Sekunden hinzu.",
            "icon": "⏱️",
            "statKey": "time_well_spent_1"
        },
        {
            "id": 149,
            "x": -300,
            "y": 1200,
            "nameEn": "Time Well Spent II",
            "nameDe": "Zeit gut genutzt II",
            "descEn": "Using a Tutor item to remove a mistake also adds 60 seconds to the timer.",
            "descDe": "Das Benutzen eines Tutor-Gegenstands zum Entfernen eines Fehlers fügt dem Timer zusätzlich 60 Sekunden hinzu.",
            "icon": "⏱️",
            "statKey": "time_well_spent_2"
        },
        {
            "id": 150,
            "x": -200,
            "y": 1100,
            "nameEn": "Time Well Spent III",
            "nameDe": "Zeit gut genutzt III",
            "descEn": "Using a Tutor item to remove a mistake also adds 90 seconds to the timer.",
            "descDe": "Das Benutzen eines Tutor-Gegenstands zum Entfernen eines Fehlers fügt dem Timer zusätzlich 90 Sekunden hinzu.",
            "icon": "⏱️",
            "statKey": "time_well_spent_3"
        },
        {
            "id": 151,
            "x": -1,
            "y": 800,
            "nameEn": "Cursed Ward I",
            "nameDe": "Verfluchte Schutzaura I",
            "descEn": "Using a Shield item also protects you from cursed item downsides for 5 seconds.",
            "descDe": "Das Benutzen eines Schild-Gegenstands schützt dich außerdem für 5 Sekunden vor negativen Effekten verfluchter Gegenstände.",
            "icon": "🛡️",
            "statKey": "cursed_ward_1"
        },
        {
            "id": 152,
            "x": -1,
            "y": 900,
            "nameEn": "Cursed Ward II",
            "nameDe": "Verfluchte Schutzaura II",
            "descEn": "Using a Shield item also protects you from cursed item downsides for 5 seconds.",
            "descDe": "Das Benutzen eines Schild-Gegenstands schützt dich außerdem für 5 Sekunden vor negativen Effekten verfluchter Gegenstände.",
            "icon": "🛡️",
            "statKey": "cursed_ward_2"
        },
        {
            "id": 153,
            "x": 100,
            "y": 1000,
            "nameEn": "Cursed Ward III",
            "nameDe": "Verfluchte Schutzaura III",
            "descEn": "Using a Shield item also protects you from cursed item downsides for 5 seconds.",
            "descDe": "Das Benutzen eines Schild-Gegenstands schützt dich außerdem für 5 Sekunden vor negativen Effekten verfluchter Gegenstände.",
            "icon": "🛡️",
            "statKey": "cursed_ward_3"
        },
        {
            "id": 154,
            "x": 180,
            "y": 900,
            "nameEn": "Veil of Purity",
            "nameDe": "Schleier der Reinheit",
            "descEn": "The first cursed item used each level has no downside. Any cursed item used beyond those four has double the downside (doubled duration, twice as many tiles affected).",
            "descDe": "Der erste verfluchte Gegenstand pro Level hat keine negativen Effekte. Jeder weitere verfluchte Gegenstand hat doppelt so starke negative Effekte (doppelte Dauer, doppelt so viele betroffene Felder).",
            "icon": "✨",
            "statKey": "keystone_veil_of_purity"
        },
        {
            "id": 155,
            "x": 750,
            "y": 600,
            "nameEn": "Blinding Truth",
            "nameDe": "Blendende Wahrheit",
            "descEn": "Reveal items are 50% more effective. Mark-wrong items cannot be used.",
            "descDe": "Enthüllungsgegenstände sind 50% effektiver. Markierungsgegenstände können nicht benutzt werden.",
            "icon": "💡",
            "statKey": "keystone_blinding_truth"
        },
        {
            "id": 156,
            "x": -100,
            "y": 1000,
            "nameEn": "Apex Collector",
            "nameDe": "Spitzenwert-Sammler",
            "descEn": "Adds a small chance to obtain the Codex of Completion as a bonus reward. Items below Epic grade cannot be obtained as rewards.",
            "descDe": "Fügt eine geringe Chance hinzu, den Kodex der Fertigstellung als Bonusbelohnung zu erhalten. Gegenstände unterhalb der Epischen Qualitätsstufe können nicht als Belohnungen erhalten werden.",
            "icon": "🌟",
            "statKey": "keystone_apex_collector"
        },
        {
            "id": 157,
            "x": 420,
            "y": 2000,
            "nameEn": "Countdown Crisis",
            "nameDe": "Countdown-Krise",
            "descEn": "Timer items reduce the timer instead of increasing it. Reveal items are 5 times as strong while the timer is below 3 minutes.",
            "descDe": "Timer-Gegenstände reduzieren den Timer anstatt ihn zu erhöhen. Enthüllungsgegenstände sind 5-mal so stark, während der Timer unter 3 Minuten liegt.",
            "icon": "⚡",
            "statKey": "keystone_countdown_crisis"
        },
        {
            "id": 158,
            "x": 420,
            "y": 1300,
            "nameEn": "Iron Doctrine",
            "nameDe": "Eiserne Doktrin",
            "descEn": "Shield items cannot be used. Each mistake costs 60 extra seconds. Tutor and Timer items have 300% increased effectiveness.",
            "descDe": "Schild-Gegenstände können nicht benutzt werden. Jeder Fehler kostet 60 zusätzliche Sekunden. Tutor- und Timer-Gegenstände haben 300% erhöhte Effektivität.",
            "icon": "⚔️",
            "statKey": "keystone_iron_doctrine"
        },
        {
            "id": 159,
            "x": 180,
            "y": 1650,
            "nameEn": "Curse Embrace",
            "nameDe": "Fluchsumarmung",
            "descEn": "You are immune to cursed item downsides. All non-cursed items are 50% weaker.",
            "descDe": "Du bist immun gegen negative Effekte verfluchter Gegenstände. Alle nicht-verfluchten Gegenstände sind 50% schwächer.",
            "icon": "👁️",
            "statKey": "keystone_curse_embrace"
        },
        {
            "id": 160,
            "x": 400,
            "y": 1650,
            "nameEn": "The Witch",
            "nameDe": "Die Hexe",
            "descEn": "Enables The Witch as an item reward. Using The Witch grants immunity to all cursed item downsides for 60 seconds, but reduces the timer by 10 minutes.",
            "descDe": "Ermöglicht Die Hexe als Gegenstandsbelohnung. Das Benutzen der Hexe gewährt 60 Sekunden Immunität gegen alle negativen Effekte verfluchter Gegenstände, reduziert aber den Timer um 10 Minuten.",
            "icon": "🧙",
            "statKey": "keystone_the_witch"
        },
        {
            "id": 161,
            "x": 1,
            "y": 1400,
            "nameEn": "Golden Clock",
            "nameDe": "Goldene Uhr",
            "descEn": "Enables the Golden Clock as an item reward. The Golden Clock stops the timer — it can no longer decrease, only increase. Timer items are 100% more effective for the remainder of the level. However, the player may only make 3 more mistakes before the level fails.",
            "descDe": "Ermöglicht die Goldene Uhr als Gegenstandsbelohnung. Die Goldene Uhr stoppt den Timer — er kann nicht mehr sinken, nur noch steigen. Timer-Gegenstände sind für den Rest des Levels 100% effektiver. Allerdings darf der Spieler nur noch 3 weitere Fehler machen, bevor das Level fehlschlägt.",
            "icon": "🕰️",
            "statKey": "keystone_golden_clock"
        },
        {
            "id": 162,
            "x": 280,
            "y": 1050,
            "nameEn": "Shadow Seal",
            "nameDe": "Schattensiegel",
            "descEn": "Enables the Shadow Seal as an item reward. Using the Shadow Seal permanently hides all row and column clues for the rest of the level, but instantly marks 75% of all wrong empty tiles on the entire board. Lowers the timer to 5 minutes.",
            "descDe": "Ermöglicht das Schattensiegel als Gegenstandsbelohnung. Das Benutzen des Schattensiegels versteckt dauerhaft alle Zeilen- und Spaltenhinweise für den Rest des Levels, markiert aber sofort 75% aller falschen leeren Felder auf dem gesamten Spielfeld. Reduziert die verbleibende Zeit auf 5 Minuten.",
            "icon": "🌑",
            "statKey": "keystone_shadow_seal"
        },
        {
            "id": 164,
            "x": -400,
            "y": 850,
            "nameEn": "Pearl of Haste",
            "nameDe": "Perle der Schnelligkeit",
            "descEn": "Enables the Pearl of Haste as an item reward. Using a Pearl of Haste reduces the cooldown of your first active class skill to 1 second.",
            "descDe": "Ermöglicht die Perle der Schnelligkeit als Gegenstandsbelohnung. Das Benutzen einer Perle der Schnelligkeit reduziert die Abklingzeit deiner ersten aktiven Klassenfähigkeit auf 1 Sekunde.",
            "icon": "🔵",
            "statKey": "pearl_of_haste"
        },
        {
            "id": 165,
            "x": 400,
            "y": 850,
            "nameEn": "Pearl of Swiftness",
            "nameDe": "Perle der Gewandheit",
            "descEn": "Enables the Pearl of Swiftness as an item reward. Using a Pearl of Swiftness reduces the cooldown of your second active class skill to 1 second.",
            "descDe": "Ermöglicht die Perle der Gewandtheit als Gegenstandsbelohnung. Das Benutzen einer Perle der Gewandtheit setzt die Abklingzeit deiner zweiten aktiven Klassenfähigkeit auf 1 Sekunde.",
            "icon": "🟣",
            "statKey": "pearl_of_swiftness"
        },
        {
            "id": 166,
            "x": 1,
            "y": 1800,
            "nameEn": "Grand Pearl",
            "nameDe": "Große Perle",
            "descEn": "Enables the Grand Pearl as an item reward. Using a Grand Pearl reduces the cooldowns of both active class skills to 1 second.",
            "descDe": "Ermöglicht die Große Perle als Gegenstandsbelohnung. Das Benutzen einer Großen Perle setzt die Abklingzeit beider aktiver Klassenfähigkeiten auf 1 Sekunde.",
            "icon": "⚪",
            "statKey": "grand_pearl"
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
        },
        {
            "id": 111,
            "from": 5,
            "to": 9,
            "dotted": false
        },
        {
            "id": 112,
            "from": 21,
            "to": 22,
            "dotted": false
        },
        {
            "id": 113,
            "from": 17,
            "to": 13,
            "dotted": false
        },
        {
            "id": 114,
            "from": 45,
            "to": 41,
            "dotted": false
        },
        {
            "id": 115,
            "from": 50,
            "to": 41,
            "dotted": false
        },
        {
            "id": 116,
            "from": 46,
            "to": 42,
            "dotted": false
        },
        {
            "id": 117,
            "from": 41,
            "to": 52,
            "dotted": false
        },
        {
            "id": 118,
            "from": 47,
            "to": 43,
            "dotted": false
        },
        {
            "id": 119,
            "from": 42,
            "to": 53,
            "dotted": false
        },
        {
            "id": 120,
            "from": 48,
            "to": 44,
            "dotted": false
        },
        {
            "id": 121,
            "from": 43,
            "to": 54,
            "dotted": false
        },
        {
            "id": 122,
            "from": 57,
            "to": 63,
            "dotted": false
        },
        {
            "id": 123,
            "from": 62,
            "to": 68,
            "dotted": false
        },
        {
            "id": 124,
            "from": 58,
            "to": 64,
            "dotted": false
        },
        {
            "id": 125,
            "from": 59,
            "to": 65,
            "dotted": false
        },
        {
            "id": 126,
            "from": 64,
            "to": 70,
            "dotted": false
        },
        {
            "id": 127,
            "from": 60,
            "to": 66,
            "dotted": false
        },
        {
            "id": 128,
            "from": 65,
            "to": 71,
            "dotted": false
        },
        {
            "id": 129,
            "from": 73,
            "to": 79,
            "dotted": false
        },
        {
            "id": 130,
            "from": 78,
            "to": 84,
            "dotted": false
        },
        {
            "id": 131,
            "from": 74,
            "to": 80,
            "dotted": false
        },
        {
            "id": 132,
            "from": 75,
            "to": 81,
            "dotted": false
        },
        {
            "id": 133,
            "from": 80,
            "to": 86,
            "dotted": false
        },
        {
            "id": 134,
            "from": 79,
            "to": 85,
            "dotted": false
        },
        {
            "id": 135,
            "from": 63,
            "to": 69,
            "dotted": false
        },
        {
            "id": 136,
            "from": 76,
            "to": 82,
            "dotted": false
        },
        {
            "id": 137,
            "from": 81,
            "to": 87,
            "dotted": false
        },
        {
            "id": 138,
            "from": 1,
            "to": 90,
            "dotted": false
        },
        {
            "id": 139,
            "from": 90,
            "to": 94,
            "dotted": false
        },
        {
            "id": 140,
            "from": 94,
            "to": 95,
            "dotted": false
        },
        {
            "id": 141,
            "from": 95,
            "to": 96,
            "dotted": false
        },
        {
            "id": 142,
            "from": 90,
            "to": 91,
            "dotted": false
        },
        {
            "id": 143,
            "from": 91,
            "to": 92,
            "dotted": false
        },
        {
            "id": 144,
            "from": 92,
            "to": 93,
            "dotted": false
        },
        {
            "id": 145,
            "from": 96,
            "to": 106,
            "dotted": false
        },
        {
            "id": 146,
            "from": 106,
            "to": 107,
            "dotted": false
        },
        {
            "id": 147,
            "from": 107,
            "to": 108,
            "dotted": false
        },
        {
            "id": 151,
            "from": 108,
            "to": 115,
            "dotted": false
        },
        {
            "id": 152,
            "from": 115,
            "to": 116,
            "dotted": false
        },
        {
            "id": 153,
            "from": 116,
            "to": 117,
            "dotted": false
        },
        {
            "id": 155,
            "from": 112,
            "to": 113,
            "dotted": false
        },
        {
            "id": 156,
            "from": 113,
            "to": 114,
            "dotted": false
        },
        {
            "id": 166,
            "from": 97,
            "to": 99,
            "dotted": false
        },
        {
            "id": 167,
            "from": 97,
            "to": 98,
            "dotted": false
        },
        {
            "id": 168,
            "from": 98,
            "to": 99,
            "dotted": false
        },
        {
            "id": 169,
            "from": 149,
            "to": 97,
            "dotted": false
        },
        {
            "id": 170,
            "from": 149,
            "to": 150,
            "dotted": false
        },
        {
            "id": 171,
            "from": 148,
            "to": 149,
            "dotted": false
        },
        {
            "id": 172,
            "from": 127,
            "to": 128,
            "dotted": false
        },
        {
            "id": 173,
            "from": 128,
            "to": 129,
            "dotted": false
        },
        {
            "id": 174,
            "from": 128,
            "to": 98,
            "dotted": false
        },
        {
            "id": 175,
            "from": 151,
            "to": 152,
            "dotted": false
        },
        {
            "id": 176,
            "from": 152,
            "to": 153,
            "dotted": false
        },
        {
            "id": 177,
            "from": 152,
            "to": 99,
            "dotted": false
        },
        {
            "id": 178,
            "from": 136,
            "to": 137,
            "dotted": false
        },
        {
            "id": 179,
            "from": 137,
            "to": 138,
            "dotted": false
        },
        {
            "id": 180,
            "from": 137,
            "to": 97,
            "dotted": false
        },
        {
            "id": 181,
            "from": 139,
            "to": 140,
            "dotted": false
        },
        {
            "id": 182,
            "from": 140,
            "to": 141,
            "dotted": false
        },
        {
            "id": 183,
            "from": 140,
            "to": 98,
            "dotted": false
        },
        {
            "id": 186,
            "from": 118,
            "to": 119,
            "dotted": false
        },
        {
            "id": 195,
            "from": 90,
            "to": 124,
            "dotted": false
        },
        {
            "id": 196,
            "from": 124,
            "to": 125,
            "dotted": false
        },
        {
            "id": 197,
            "from": 125,
            "to": 126,
            "dotted": false
        },
        {
            "id": 198,
            "from": 126,
            "to": 151,
            "dotted": false
        },
        {
            "id": 199,
            "from": 103,
            "to": 104,
            "dotted": false
        },
        {
            "id": 200,
            "from": 104,
            "to": 105,
            "dotted": false
        },
        {
            "id": 201,
            "from": 105,
            "to": 136,
            "dotted": false
        },
        {
            "id": 203,
            "from": 121,
            "to": 122,
            "dotted": false
        },
        {
            "id": 204,
            "from": 122,
            "to": 123,
            "dotted": false
        },
        {
            "id": 205,
            "from": 123,
            "to": 148,
            "dotted": false
        },
        {
            "id": 206,
            "from": 114,
            "to": 120,
            "dotted": false
        },
        {
            "id": 208,
            "from": 100,
            "to": 101,
            "dotted": false
        },
        {
            "id": 209,
            "from": 101,
            "to": 102,
            "dotted": false
        },
        {
            "id": 210,
            "from": 102,
            "to": 139,
            "dotted": false
        },
        {
            "id": 211,
            "from": 109,
            "to": 110,
            "dotted": false
        },
        {
            "id": 212,
            "from": 110,
            "to": 111,
            "dotted": false
        },
        {
            "id": 213,
            "from": 111,
            "to": 127,
            "dotted": false
        },
        {
            "id": 214,
            "from": 120,
            "to": 119,
            "dotted": false
        },
        {
            "id": 215,
            "from": 93,
            "to": 112,
            "dotted": false
        },
        {
            "id": 216,
            "from": 117,
            "to": 118,
            "dotted": false
        },
        {
            "id": 220,
            "from": 107,
            "to": 121,
            "dotted": false
        },
        {
            "id": 221,
            "from": 113,
            "to": 109,
            "dotted": false
        },
        {
            "id": 222,
            "from": 103,
            "to": 116,
            "dotted": false
        },
        {
            "id": 223,
            "from": 100,
            "to": 119,
            "dotted": false
        },
        {
            "id": 224,
            "from": 130,
            "to": 131,
            "dotted": false
        },
        {
            "id": 225,
            "from": 131,
            "to": 132,
            "dotted": false
        },
        {
            "id": 226,
            "from": 96,
            "to": 130,
            "dotted": false
        },
        {
            "id": 227,
            "from": 93,
            "to": 133,
            "dotted": false
        },
        {
            "id": 228,
            "from": 133,
            "to": 134,
            "dotted": false
        },
        {
            "id": 229,
            "from": 134,
            "to": 135,
            "dotted": false
        },
        {
            "id": 230,
            "from": 115,
            "to": 145,
            "dotted": false
        },
        {
            "id": 231,
            "from": 145,
            "to": 146,
            "dotted": false
        },
        {
            "id": 232,
            "from": 146,
            "to": 147,
            "dotted": false
        },
        {
            "id": 233,
            "from": 120,
            "to": 142,
            "dotted": false
        },
        {
            "id": 234,
            "from": 142,
            "to": 143,
            "dotted": false
        },
        {
            "id": 235,
            "from": 143,
            "to": 144,
            "dotted": false
        },
        {
            "id": 237,
            "from": 101,
            "to": 160,
            "dotted": false
        },
        {
            "id": 238,
            "from": 141,
            "to": 158,
            "dotted": false
        },
        {
            "id": 239,
            "from": 162,
            "to": 129,
            "dotted": false
        },
        {
            "id": 240,
            "from": 153,
            "to": 154,
            "dotted": false
        },
        {
            "id": 241,
            "from": 135,
            "to": 155,
            "dotted": false
        },
        {
            "id": 242,
            "from": 99,
            "to": 156,
            "dotted": false
        },
        {
            "id": 243,
            "from": 119,
            "to": 157,
            "dotted": false
        },
        {
            "id": 244,
            "from": 101,
            "to": 159,
            "dotted": false
        },
        {
            "id": 248,
            "from": 97,
            "to": 161,
            "dotted": false
        },
        {
            "id": 249,
            "from": 96,
            "to": 164,
            "dotted": false
        },
        {
            "id": 250,
            "from": 93,
            "to": 165,
            "dotted": false
        },
        {
            "id": 251,
            "from": 166,
            "to": 117,
            "dotted": false
        },
        {
            "id": 252,
            "from": 118,
            "to": 166,
            "dotted": false
        }
    ]
};