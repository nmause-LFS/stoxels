// =============================================================================
// storyline-beats.js — The Cartographers of Chance
// ---------------------------------------------------------------------------
// STORY_BEATS — the registry of every story beat in the game, keyed by
// beatId, passed to showBeat(beatId, options) from game.js.
//
// This is the file you'll touch most often as the story grows: new regions,
// new class/ascendency unlock flags, new endgame beats all get added here as
// new entries in the STORY_BEATS object below.
//
// Depends on (must load AFTER all of these):
//   - storyline-engine.js   (shared constants/helpers used by some data files)
//   - storyline-intro.js    (INTRO_SONG, used by the intro_cinematic beat)
//   - storyline-intro-stox.js (STOX_INTRO_SONG, used by the character_intro
//     beat's stox variant)
//   - storyline-intro-trix.js, storyline-intro-syla.js
//     (TRIX_INTRO_SLIDES etc., used by the character_intro beat)
// =============================================================================

// ---------------------------------------------------------------------------
// STORY BEATS
// ---------------------------------------------------------------------------

const STORY_BEATS = {

    // -------------------------------------------------------------------------
    // OPENING FLOW — image slideshow cinematic
    // -------------------------------------------------------------------------

    intro_cinematic: {
        song: INTRO_SONG
    },

    // -------------------------------------------------------------------------
    // CHARACTER INTROS — pass { character: 'stox' | 'trix' | 'syla' }
    // Stox uses the karaoke `song` format; Trix/Syla are still image
    // slideshows (same approach as intro_cinematic) until they get tracks.
    // -------------------------------------------------------------------------

    character_intro: {
        characterVariants: {
            stox: {
                song: STOX_INTRO_SONG
            },
            trix: {
                song: TRIX_INTRO_SONG
            },
            syla: {
                song: SYLA_INTRO_SONG
            }
        }
    },






    // -------------------------------------------------------------------------
    // FIRST CONVERGENCE STOXEL
    // -------------------------------------------------------------------------

    first_convergence: {
        pages: [
            [
                "You felt it when the Stoxel resolved — not just the puzzle clicking into place, but something larger. A shockwave of mathematical energy, propagating outward through the Substrate.",
                "Back at the Outpost, a new branch of the Atlas illuminated.",
                "The First Cartographers left it there. They always knew someone would eventually understand enough to see it.",
            ],
            [
                "But something else is nagging at you.",
                "The Stoxel's formation pattern was not consistent with the Variance Collapse's known behaviour. It was too structured. Too targeted.",
                "You file it away for now.",
                "You are going to find more of them.",
            ]
        ]
    },

    // -------------------------------------------------------------------------
    // REGION ENTRY BEATS — triggered on first visit only
    // -------------------------------------------------------------------------

    region_1: {
        pages: [
            [
                "Probability Peaks.",
                "The mountains here shift based on probability distributions. Paths that existed yesterday may not exist today. Landmarks change when you are not looking.",
                "The First Cartographers loved this place. It was where they first proved that apparent randomness contains structure. Their survey notes here are the most optimistic in the archive.",
            ]
        ]
    },

    region_2: {
        pages: [
            [
                "Bayesian Bay.",
                "The tidal patterns here run on Bayesian updating — the sea changes based on what it has observed, not what physics should dictate. The creatures here are the most intelligent in the known world. In an environment that rewards updating your beliefs, intelligence is a survival trait.",
                "The Collapse did not make this place more chaotic. It made it too certain. The Bay locked onto a prior and stopped updating. The sea no longer responds to new information.",
                "It is frozen in a belief that is three hundred years out of date.",
            ]
        ]
    },

    region_3: {
        pages: [
            [
                "Sampling Savanna.",
                "This was the First Cartographers' primary field research site — a living dataset where animal migrations, plant growth, and weather all followed statistical laws so cleanly that early Cartographers could sit here and watch probability work in real time.",
                "The Collapse introduced sampling bias. The data is still flowing, but it is wrong in ways that are not immediately obvious.",
                "Something is contaminating the sample — and the contamination is spreading.",
            ]
        ]
    },

    region_4: {
        pages: [
            [
                "The Distribution Den.",
                "The cave shapes here are bell curves. The stalactite patterns follow power laws. The underground rivers run in Poisson processes. This is where the Substrate is closest to the surface — where the mathematical foundations of reality are literally visible in the rock.",
                "The Collapse hit the Den at a structural level. The distributions themselves are malformed. Bell curves with missing tails. Power laws that reverse.",
                "The cave system is physically unstable because the geology is built on the mathematics — and the mathematics is broken.",
            ]
        ]
    },

    region_5: {
        pages: [
            [
                "Regression Rift.",
                "Here, if two things happen at the same time often enough, they begin to cause each other. The landscape folds back on itself. Rivers run toward their own sources. The flora grows in patterns that reinforce themselves until they collapse.",
            ],
            [
                "This region was someone's home, once.",
            ]
        ]
    },

    region_6: {
        pages: [
            [
                "The Vortex of Possibilities.",
                "The Vortex is not a region the First Cartographers built. It is the Variance Collapse, made visible — the place where the corruption entered the Substrate, spinning ever since, pulling probability fields from surrounding regions into its spiral and churning them into noise.",
                "Most Cartographers assume this is where it started.",
                "They are wrong.",
            ]
        ]
    },

    region_7: {
        pages: [
            [
                "Expectation Plateau.",
                "The First Cartographers made their greatest theoretical breakthrough here — the formalisation of expected value. The proof is carved into the plateau's bedrock in letters thirty metres high.",
                "Someone has been defacing it. Not randomly. Systematically. Certain symbols altered to make the proof incorrect. The plateau's stability depends on the proof being intact, and it is failing.",
            ],
            [
                "This was not the Collapse.",
                "This was deliberate.",
            ]
        ]
    },

    region_8: {
        pages: [
            [
                "Data Delta.",
                "Everything that happens anywhere in the world eventually leaves a data trace. Those traces flow through the Delta. The First Cartographers built processing stations here to read the world's information in near-real time.",
                "The Collapse corrupted the data streams. The Delta now carries noise mixed with signal in proportions that make meaningful extraction almost impossible.",
                "Almost.",
            ]
        ]
    },

    region_9: {
        pages: [
            [
                "Stochapolis.",
                "A civilisation once believed that sufficiently precise machines could eliminate probability entirely — reduce all outcomes to certainty through sufficiently advanced computation. They called this Total Determination and spent centuries building Stochapolis to achieve it.",
                "The Variance Collapse destroyed their project and destroyed them. Their machines are still running. Gears turning, calculators clattering through infinite loops — all of it generating precisely nothing.",
            ],
            [
                "But the machines are not entirely empty.",
                "Something has moved in.",
            ]
        ]
    },

    region_10: {
        pages: [
            [
                "Hypothesis Hinterlands.",
                "The conceptual layer of the Substrate — where mathematical ideas exist as abstract structures — has collapsed into the physical layer here. Theories have taken physical form.",
                "True hypotheses are stable, almost tame. False hypotheses have become predators: aggressive, territorial, and dangerous precisely because they are wrong and do not know it.",
                "The number of possible wrong answers is vastly larger than the number of right ones.",
            ]
        ]
    },

    region_11: {
        pages: [
            [
                "Frequency Forest.",
                "The trees grow in Fibonacci spirals. The animals move in Markov chains. The weather repeats on exactly the same cycle, day after day. The First Cartographers noted it as beautiful.",
                "The Collapse made it compulsive. The patterns cannot stop repeating even when the underlying data has changed.",
                "At the forest's centre, something is forcing the repetition — because repetition feels like certainty to something that fears randomness.",
            ]
        ]
    },

    region_12: {
        pages: [
            [
                "Null Hypothesis Void.",
                "Entire statistical concepts have been erased from existence here. Things that should exist simply do not. The region is not dark because light is absent — it is dark because the concept of light's presence has been removed from local probability space.",
                "This is also where its influence is strongest.",
                "And here, for the first time, it does not send a creature.",
                "It sends a voice.",
            ],
            [
                "\"You have been solving the Collapse as though it were an accident. It was not. Every Stoxel you have cleared, every region you have stabilised — you have been undoing three hundred years of careful work.\"",
                "\"I would like you to understand why that work was done before you decide to finish undoing it.\"",
                "\"In a universe governed by probability, suffering is not possible. It is guaranteed. For any sufficiently long timeline, every bad outcome has probability 1. Every loss. Every death. Every failure.\"",
                "\"I am not the villain of this story. I am the only one who finished reading it.\"",
            ]
        ]
    },

    region_13: {
        pages: [
            [
                "Parameter Plains.",
                "The fundamental parameters of this world's mathematics — θ, μ, σ — are physically inscribed across these plains. They are not decorative. They are load-bearing. The values here are the values the Substrate uses to generate reality's probability fields everywhere.",
                "Someone is rewriting them. Carefully. Deliberately. One parameter at a time, shifting the world's fundamental constants toward values that produce lower and lower variance.",
                "The trajectory, if completed, leads to a single point: zero variance everywhere. A world where every probability distribution has collapsed to a single certain outcome.",
            ],
            [
                "His name was Verun.",
                "He was a First Cartographer. After decades of mapping the Substrate, he proved mathematically that in a universe governed by probability, suffering is guaranteed — and he concluded that probability itself was the source of all suffering. That the only humane act was to collapse all variance to zero.",
                "He called this The Final Null. He introduced corrupted parameters into the Apex to achieve it.",
                "He did not survive to see his plan succeed.",
                "But the parameters have been working for three hundred years.",
                "And they are nearly finished.",
            ]
        ]
    },

    // -------------------------------------------------------------------------
    // CLASS EVENTS
    // -------------------------------------------------------------------------

    class_unlock: {
        // Pass { className: 'Mathmagician' | 'Statistician' | 'Probabilist' }
        // The class-specific line is appended after the shared opening.
        shared: [
            "The Trial Chamber was not designed to teach you.",
            "It was designed to find out whether you already knew.",
            "You did.",
        ],
        classLines: {
            Mathmagician: "Numbers bend for you differently now. They always did.",
            Statistician: "You do not guess. You estimate — with confidence intervals the Guild did not think were possible.",
            Probabilist: "You have stopped asking what will happen. You ask what is likely. The difference turns out to matter enormously.",
        },
        // Fallback if class name isn't listed above
        defaultClassLine: "The Guild has a name for what you are now. You are starting to suspect the name is too small.",
    },

    class_mastered: {
        pages: [
            [
                "The Guild's texts end here.",
                "Every technique they documented, every method they preserved from the First Cartographers — you have learned it and pushed past it.",
                "What comes next is not in any archive.",
            ]
        ]
    },

    // -------------------------------------------------------------------------
    // ASCENDENCY CLASSES
    // -------------------------------------------------------------------------



    ascendency_unlock: {
        // Pass { ascendencyClass: 'Outlier' | 'Actuary' | etc. }
        variants: {
            Outlier: [
                [
                    "You do not fit the distribution. You never did. The Ascendency Trial simply made it undeniable.",
                    "An Outlier does not reject the rules of probability. They exist outside the range where those rules make confident predictions.",
                    "That is not a flaw.",
                    "In a world trying to eliminate variance, it is the most dangerous thing you can be.",
                ]
            ],
            Actuary: [
                [
                    "You have learned to price risk across timelines most Cartographers cannot see.",
                    "The Ascendency Trial asked you to calculate the cost of outcomes that have not happened yet.",
                    "You answered correctly.",
                    "The Apex's entities are going to find that deeply inconvenient.",
                ]
            ],
            Recursionist: [
                [
                    "The solution contains itself. You understood this before the Trial finished explaining it.",
                    "A Recursionist does not solve problems linearly. They find the point where the problem solves itself — and stand there.",
                ]
            ],
            Markovian: [
                [
                    "The past is irrelevant. The present state is everything.",
                    "A Markovian moves through probability space without carrying the weight of history. Each moment is its own complete calculation.",
                    "The Null has been planning for three hundred years.",
                    "You have been planning for exactly as long as you need.",
                ]
            ],
            Bayesian: [
                [
                    "You do not have a prior. You have a current best estimate, subject to revision upon new evidence.",
                    "A Bayesian is the most dangerous thing in an uncertain world: someone who updates correctly, every time, without ego.",
                    "The Null stopped updating three hundred years ago.",
                ]
            ],
            RandomWalker: [
                [
                    "There is no path. There is only the next step, and the one after.",
                    "A Random Walker has learned that in a Substrate governed by probability, the most honest way to navigate is to trust the process and accumulate position over time.",
                    "It looks like wandering.",
                    "It is not wandering.",
                ]
            ],
        },
        defaultVariant: [
            [
                "The Ascendency Trial did not promote you. It mutated you.",
                "You went in as one thing and came out as something the Guild's textbooks do not have a chapter for.",
                "Start writing one.",
            ]
        ]
    },

    // -------------------------------------------------------------------------
    // ENDGAME
    // -------------------------------------------------------------------------

    nexus_opens: {
        pages: [
            [
                "For three hundred years, this door has been closed.",
                "It does not open because you forced it. It opens because the world is finally stable enough to let you through.",
                "Thirteen regions. Hundreds of Stoxels. The work of the First Cartographers, continued.",
            ],
            [
                "The Apex is above you.",
                "Whatever Verun set in motion up there is nearly complete.",
                "You have earned the right to answer it.",
            ]
        ]
    },

    final_choice: {
        pages: [
            [
                "The Null is not a monster.",
                "It is a conclusion drawn from real mathematics by someone who could not bear what the mathematics meant.",
                "Verun was not wrong about the proof. Suffering, in a probabilistic universe, is guaranteed given enough time.",
                "He was right.",
                "He was wrong about what to do with that truth.",
            ],
            [
                "You are about to tell it what you think the answer is.",
            ]
        ]
    },


};