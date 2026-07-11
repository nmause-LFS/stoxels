// =============================================================================
// storyline-intro-trix.js — The Cartographers of Chance
// ---------------------------------------------------------------------------
// Character intro data for Trix ("The Trickster").
// Depends on: storyline-engine.js (_wordsFromLine, MAX_SONG_SECTION_LINES,
// DEFAULT_SLIDE_DURATION_MS etc.) — must load AFTER that file.
//
// =============================================================================



// Folder where Trix's intro images live (relative to your index.html)
const TRIX_INTRO_IMAGE_PATH = "images/Intro/Trix_Intro/";


// ---------------------------------------------------------------------------
// SONG BEAT — karaoke-style Trix intro
// ---------------------------------------------------------------------------
//
// TRIX_INTRO_SONG — timed from Trix_Intro_Song.srt. Each line's start AND
// end time is rounded DOWN to the nearest 0.5s (e.g. 12223ms -> 12000ms)
// so line-changes land on clean half-second beats. Word-level reveal within
// each line is interpolated evenly across that line's window via
// _wordsFromLine, same approach as STOX_INTRO_SONG in storyline-intro-stox.js.
//
// Regenerate this block any time the SRT changes by re-parsing it the same
// way: round each cue's start AND end down to the nearest 500ms, and emit
// one _wordsFromLine(...) call per cue.
//
// The `images` timeline below uses placeholder filenames (1.jpeg ... 30.jpeg)
// spaced roughly every 10 seconds across the song's ~300s runtime. Replace
// filenames and adjust times once the actual image set exists — the array
// just needs to stay sorted by ascending `time`.
const TRIX_INTRO_SONG = {
    audio: "audio/Intro/Trix_Intro_Song.mp3",
    imagePath: TRIX_INTRO_IMAGE_PATH,

    // Image timeline — placeholders, adjust filenames and times once images exist.
    // Each entry fires when playback crosses its `time` (ms from song start).
    images: [
        { image: "1.jpeg", time: 0 },          // establishing shot before vocals
        { image: "2.jpeg", time: 12000 },      // "Three hundred years since the world came apart"
        { image: "3.jpeg", time: 22500 },      // "A handful of Cartographers stood up and swore"
        { image: "4.jpeg", time: 33500 },      // "The Guild called it heresy"
        { image: "5.jpeg", time: 44000 },      // "A fold in the world" / Regression Rift
        { image: "6.jpeg", time: 57000 },      // "Generations learned to live on borrowed time"
        { image: "7.jpeg", time: 68500 },      // "But the Rift was a teacher"
        { image: "8.jpeg", time: 90500 },      // "Trix was born in the one room still burning light"
        { image: "9.jpeg", time: 101000 },     // "Raised on ruins, raised on questions"
        { image: "10.jpeg", time: 111500 },     // "Then the readings started sliding"
        { image: "11.jpeg", time: 122000 },     // "Zero isn't quiet — zero's a verdict"
        { image: "12.jpeg", time: 135500 },     // "She knew her family wasn't wrong"
        { image: "13.jpeg", time: 146500 },     // "So she packed a lantern"
        { image: "14.jpeg", time: 158000 },     // "The guards brought her in to a man called the Warden"
        { image: "15.jpeg", time: 163000 },     // "Are you here to join us?"
        { image: "16.jpeg", time: 174000 },     // "Of course — easier than fighting"
        { image: "17.jpeg", time: 184500 },     // "A key around his neck, gone before he closed the door"
        { image: "18.jpeg", time: 194500 },     // "Already counting down the days"
        { image: "19.jpeg", time: 202000 },     // "She hid the key beneath her pillow"
        { image: "20.jpeg", time: 212500 },     // "Then one night she walked the halls"
        { image: "21.jpeg", time: 217500 },     // "Found a door in the archive"
        { image: "22.jpeg", time: 223500 },     // "The key turned like it knew her"
        { image: "23.jpeg", time: 228500 },     // "Behind it: every answer"
        { image: "24.jpeg", time: 234000 },     // "Her name was in those pages"
        { image: "25.jpeg", time: 245500 },     // "Watch and learn"
        { image: "26.jpeg", time: 255500 },     // "But the door behind the door changed why she came to stay"
        { image: "27.jpeg", time: 261000 },     // "Not loyalty, not duty"
        { image: "28.jpeg", time: 266500 },     // "So she keeps the uniform"
        { image: "29.jpeg", time: 276500 },     // "Walks among Cartographers now"
        { image: "30.jpeg", time: 298000 },     // TRIX nameplate
    ],

    // Lyric timeline — all 46 lines from the SRT, in order. Both start and
    // end times are rounded down to the nearest 0.5s from the real SRT values.
    lines: [
        { section: 'Verse 1', words: _wordsFromLine('Three hundred years since the world came apart', 10500, 15000) }, 
        { section: 'Verse 1', words: _wordsFromLine('Since the Apex cracked open and the sky lost its math', 15500, 21000) },
        { section: 'Verse 1', words: _wordsFromLine('A handful of Cartographers stood up and swore', 21500, 26500) },
        { section: 'Verse 1', words: _wordsFromLine('Somebody broke this - and we want to know what for', 26500, 32500) },

        { section: 'Verse 2', words: _wordsFromLine('The Guild called it heresy, struck them from the page', 33500, 37500) },
        { section: 'Verse 2', words: _wordsFromLine("Walked them past the border into someone else's cage", 38000, 44000) },
        { section: 'Verse 2', words: _wordsFromLine("A fold in the world where the numbers don't behave", 44000, 48500) },
        { section: 'Verse 2', words: _wordsFromLine('The Regression Rift - half a colony, half a grave', 48500, 56500) },

        { section: 'Chorus 1', words: _wordsFromLine('Generations learned to live on borrowed time', 57000, 62000) },
        { section: 'Chorus 1', words: _wordsFromLine('Counting what was left of them, line by fading line', 62000, 68500) },
        { section: 'Chorus 1', words: _wordsFromLine('But the Rift was a teacher and it taught them something true', 68500, 72000) },
        { section: 'Chorus 1', words: _wordsFromLine('Get close enough to anything, it starts to learn from you', 72000, 88000) },

        { section: 'Verse 3', words: _wordsFromLine('Trix was born in the one room still burning light', 90000, 93500) },
        { section: 'Verse 3', words: _wordsFromLine('The OLS Observatory, watching numbers half the night', 94000, 100500) },
        { section: 'Verse 3', words: _wordsFromLine('Raised on ruins, raised on questions no one round her could answer', 100501, 106000) },
        { section: 'Verse 3', words: _wordsFromLine('Why her name was poison, why her blood was called a cancer', 106000, 111500) },

        { section: 'Verse 4', words: _wordsFromLine('Then the readings started sliding, drifting toward a wall', 111500, 115500) },
        { section: 'Verse 4', words: _wordsFromLine('Every variance collapsing into nothing left at all', 115500, 120500) },
        { section: 'Verse 4', words: _wordsFromLine("Zero isn't quiet - zero's a verdict, not a pause", 121000, 127000) },
        { section: 'Verse 4', words: _wordsFromLine('A world with zero chance in it was a world erasing cause', 127500, 134000) },

        { section: 'Chorus 2', words: _wordsFromLine("She knew her family wasn't wrong, not for one single day", 134500, 140500) },
        { section: 'Chorus 2', words: _wordsFromLine("Something never finished what it started - and it's still finding its way", 140500, 145500) },
        { section: 'Chorus 2', words: _wordsFromLine('So she packed a lantern, left the Rift behind for good', 145500, 151500) },
        { section: 'Chorus 2', words: _wordsFromLine('Walked out to prove the thing they always said she should', 151501, 157500) },

        { section: 'Bridge', words: _wordsFromLine('The guards brought her in to a man called the Warden', 158000, 162000) },
        { section: 'Bridge', words: _wordsFromLine('Are you here to join us? - not a question, more a warning', 162500, 167500) },
        { section: 'Bridge', words: _wordsFromLine("She'd never heard the name before that very day", 167500, 173000) },
        { section: 'Bridge', words: _wordsFromLine('Of course - easier than fighting, easier than locked away', 173500, 179000) },
        { section: 'Bridge', words: _wordsFromLine('He talked of duty while she counted what he wore', 179000, 184000) },
        { section: 'Bridge', words: _wordsFromLine('A key around his neck, gone before he closed the door', 184001, 189000) },
        { section: 'Bridge', words: _wordsFromLine('She took her oath with both hands clean and bowed her head just right', 189500, 194000) },
        { section: 'Bridge', words: _wordsFromLine("Already counting down the days until she'd leave at first light", 194500, 201500) },

        { section: 'Final Verse', words: _wordsFromLine('She hid the key beneath her pillow, kept her face a perfect blank', 202000, 206500) },
        { section: 'Final Verse', words: _wordsFromLine('Played the dutiful student, took her seat, took her rank', 207000, 212000) },
        { section: 'Final Verse', words: _wordsFromLine('Then one night she walked the halls where no one walked at all', 212500, 217500) },
        { section: 'Final Verse', words: _wordsFromLine("Found a door in the archive that wasn't on the wall", 217500, 222000) },
        { section: 'Final Verse', words: _wordsFromLine('The key turned like it knew her, like it had waited just for this', 222500, 228000) },
        { section: 'Final Verse', words: _wordsFromLine('Behind it: every answer that her family ever missed', 228500, 233500) },
        { section: 'Final Verse', words: _wordsFromLine('Her name was in those pages - not as exile, not as ghost', 234000, 238500) },
        { section: 'Final Verse', words: _wordsFromLine("But as the reason she'd been right to want this most", 238500, 245500) },

        { section: 'Outro', words: _wordsFromLine("Watch and learn - that's what she'd say", 245500, 249500) },
        { section: 'Outro', words: _wordsFromLine('She came here with an exit already halfway planned away', 250000, 255000) },
        { section: 'Outro', words: _wordsFromLine('But the door behind the door changed why she came to stay', 255500, 260500) },
        { section: 'Outro', words: _wordsFromLine('Not loyalty, not duty - just a debt she means to repay', 261000, 266500) },
        { section: 'Outro', words: _wordsFromLine('So she keeps the uniform, keeps the key, keeps her secrets unsaid', 266500, 273000) },
        { section: 'Outro', words: _wordsFromLine('Walks among Cartographers now... chasing ghosts inside her head', 273500, 298500) },
    ],
};