// =============================================================================
// storyline-intro-stox.js — The Cartographers of Chance
// ---------------------------------------------------------------------------
// Character intro data for Stox ("The Analyst").
// Depends on: storyline-engine.js (_wordsFromLine, MAX_SONG_SECTION_LINES,
// DEFAULT_SLIDE_DURATION_MS etc.) — must load AFTER that file.

// Folder where Stox's intro images live (relative to your index.html)
const STOX_INTRO_IMAGE_PATH = "images/Intro/Stox_Intro/";


// ---------------------------------------------------------------------------
// SONG BEAT — karaoke-style Stox intro
// ---------------------------------------------------------------------------
//
// STOX_INTRO_SONG — timed from Stox_Intro_Song.srt. Each line's start/end
// comes directly from the SRT (real vocal timing), with start times rounded
// DOWN to the nearest 0.5s (e.g. 9367 -> 9000) so line-changes land on a
// clean half-second beat. End times are left as-is from the SRT. Word-level
// reveal within each line is interpolated evenly across that line's window
// via _wordsFromLine, same approach as INTRO_SONG in storyline-intro.js.
//
// Regenerate this block any time the SRT changes by re-parsing it the same
// way: round each cue's start down to the nearest 500ms, keep its real end,
// and emit one _wordsFromLine(...) call per cue.
//
// The `images` timeline below is the final 30-image set (see
// stox-intro-image-prompts.md for what each one depicts and why it's timed
// where it is). Filenames are matched to their original shot-list slot
// numbers, but the array is ordered chronologically by `time` (slot 27 fires
// before slot 26, since "He is finished waiting" lands earlier in the song
// than "The archive kept its secrets..."). If you regenerate or reorder any
// images, keep this array sorted by ascending `time`.
const STOX_INTRO_SONG = {
    audio: "audio/Intro/Stox_Intro_Song.mp3",
    imagePath: STOX_INTRO_IMAGE_PATH,

    images: [
        { image: "1.jpeg", time: 0 },           // establishing: alone in the archive
        { image: "2.jpeg", time: 9000 },        // "Inside this archive"
        { image: "3.jpeg", time: 16000 },       // "He didn't write a word of it"
        { image: "4.jpeg", time: 20500 },       // "But he's read every line"
        { image: "5.jpeg", time: 25500 },       // "Every note, every survey log"
        { image: "6.jpeg", time: 29500 },       // "Every parameter they made"
        { image: "7.jpeg", time: 36000 },       // "Everything the First Cartographers"
        { image: "8.jpeg", time: 40500 },       // "Ever left in their wake"
        { image: "9.jpeg", time: 46500 },       // "He's been through it all"
        { image: "10.jpeg", time: 68000 },      // "The timeline never added up"
        { image: "11.jpeg", time: 73000 },      // "The failures came too clean"
        { image: "12.jpeg", time: 79500 },      // "The corruption spread in a pattern"
        { image: "13.jpeg", time: 89500 },      // "He's mapped every connection"
        { image: "14.jpeg", time: 105000 },     // "Understood it down to every part"
        { image: "15.jpeg", time: 124000 },     // "One of the First Cartographers"
        { image: "16.jpeg", time: 133500 },     // "He cannot find who, or why"
        { image: "17.jpeg", time: 140000 },     // "The archive won't tell him how"
        { image: "18.jpeg", time: 151000 },     // "The shelves have run dry"
        { image: "19.jpeg", time: 161500 },     // "He's read everything they kept"
        { image: "20.jpeg", time: 171000 },     // "Whatever's still hidden"
        { image: "21.jpeg", time: 182000 },     // "In the regions, in the Stoxels"
        { image: "22.jpeg", time: 194500 },     // "The records all point inward" (Chorus 2)
        { image: "23.jpeg", time: 208000 },     // "Not from someone who won't stop"
        { image: "24.jpeg", time: 221500 },     // "But he knows where the answers drop"
        { image: "25.jpeg", time: 233000 },     // "The archive ran out of answers"
        { image: "26.jpeg", time: 247000 },     // "He is finished waiting"
        { image: "27.jpeg", time: 273500 },     // "The archive kept its secrets..."
        { image: "28.jpeg", time: 282000 },     // "Now he steps out past it"
        { image: "29.jpeg", time: 291000 },     // "He'll trade his pages..."
        { image: "30.jpeg", time: 313000 },     // "Ready to learn what he can't understand"
        { image: "31.jpeg", time: 325000 },
    ],

    // Lyric timeline — all 57 lines from the SRT, in order. Start times are
    // rounded down to the nearest 0.5s; end times are the real SRT end.
    lines: [
        { section: 'Verse 1', words: _wordsFromLine('Stox has spent his whole life', 4000, 6999) },
        { section: 'Verse 1', words: _wordsFromLine('Inside this archive', 7000, 14999) },
        { section: 'Verse 1', words: _wordsFromLine('He didn\'t write a word of it', 15000, 19499) },
        { section: 'Verse 1', words: _wordsFromLine('But he\'s read every line', 19500, 24499) },
        { section: 'Verse 1', words: _wordsFromLine('Every note, every survey log', 24500, 27999) },
        { section: 'Verse 1', words: _wordsFromLine('Every parameter they made', 28000, 34999) },
        { section: 'Verse 1', words: _wordsFromLine('Everything the First Cartographers', 35000, 39499) },
        { section: 'Verse 1', words: _wordsFromLine('Ever left in their wake', 39500, 45000) },

        { section: 'Verse 2', words: _wordsFromLine('He\'s been through it all', 45500, 50999) },
        { section: 'Verse 2', words: _wordsFromLine('Again and again', 51000, 54642) },
        { section: 'Verse 2', words: _wordsFromLine('Studying a catastrophe', 57000, 61617) },
        { section: 'Verse 2', words: _wordsFromLine('From three hundred years back then', 62000, 65374) },
        { section: 'Verse 2', words: _wordsFromLine('The timeline never added up', 67000, 70933) },
        { section: 'Verse 2', words: _wordsFromLine('The failures came too clean', 73000, 77235) },
        { section: 'Verse 2', words: _wordsFromLine('The corruption spread in a pattern', 79500, 81999) },
        { section: 'Verse 2', words: _wordsFromLine('Too deliberate to be unseen', 82000, 86444) },

        { section: 'Verse 3', words: _wordsFromLine('He\'s mapped every connection', 89500, 92528) },
        { section: 'Verse 3', words: _wordsFromLine('Cross-referenced every log', 94500, 98199) },
        { section: 'Verse 3', words: _wordsFromLine('Every maintenance record', 99500, 102499) },
        { section: 'Verse 3', words: _wordsFromLine('Against every failure he could log', 102500, 112693) },

        { section: 'Chorus', words: _wordsFromLine('The records all point inward', 112500, 114999) },
        { section: 'Chorus', words: _wordsFromLine('Someone knew it from the start', 115000, 118181) },
        { section: 'Chorus', words: _wordsFromLine('Whoever broke the Apex', 118500, 120726) },
        { section: 'Chorus', words: _wordsFromLine('Understood it down to every part', 120500, 123717) },
        { section: 'Chorus', words: _wordsFromLine('One of the First Cartographers', 124000, 126479) },
        { section: 'Chorus', words: _wordsFromLine('Did this, he\'s sure of it now', 126500, 132499) },
        { section: 'Chorus', words: _wordsFromLine('He cannot find who, or why', 132500, 138999) },
        { section: 'Chorus', words: _wordsFromLine('The archive won\'t tell him how', 139000, 147235) },

        { section: 'Verse 4', words: _wordsFromLine('The shelves have run dry', 151000, 153353) },
        { section: 'Verse 4', words: _wordsFromLine('No more pages left to turn', 153500, 158620) },
        { section: 'Verse 4', words: _wordsFromLine('He\'s read everything they kept', 161500, 163499) },
        { section: 'Verse 4', words: _wordsFromLine('Every secret, every burn', 163500, 169999) },
        { section: 'Verse 4', words: _wordsFromLine('Whatever\'s still hidden', 170000, 175101) },
        { section: 'Verse 4', words: _wordsFromLine('It\'s out there, past these walls', 176500, 180292) },
        { section: 'Verse 4', words: _wordsFromLine('In the regions, in the Stoxels', 182000, 184948) },
        { section: 'Verse 4', words: _wordsFromLine('In whatever\'s left when something falls', 185000, 194296) },

        { section: 'Chorus 2', words: _wordsFromLine('The records all point inward', 194500, 196971) },
        { section: 'Chorus 2', words: _wordsFromLine('Someone knew it from the start', 197000, 199681) },
        { section: 'Chorus 2', words: _wordsFromLine('Whoever broke the Apex', 200000, 202447) },
        { section: 'Chorus 2', words: _wordsFromLine('Understood it down to every part', 202500, 205367) },
        { section: 'Chorus 2', words: _wordsFromLine('A truth can\'t stay buried', 205500, 206999) },
        { section: 'Chorus 2', words: _wordsFromLine('Not from someone who won\'t stop', 207000, 214499) },
        { section: 'Chorus 2', words: _wordsFromLine('He cannot find who, or why', 214500, 219999) },
        { section: 'Chorus 2', words: _wordsFromLine('But he knows where the answers drop', 220000, 232863) },

        { section: 'Bridge', words: _wordsFromLine('The archive ran out of answers', 233000, 235778) },
        { section: 'Bridge', words: _wordsFromLine('A long time ago', 236000, 241379) },
        { section: 'Bridge', words: _wordsFromLine('He has decided', 241500, 244999) },
        { section: 'Bridge', words: _wordsFromLine('He is finished waiting', 245000, 254810) },

        { section: 'Final Verse', words: _wordsFromLine('The answer exists, somewhere past these doors', 254000, 259499) },
        { section: 'Final Verse', words: _wordsFromLine('He is going to find it, he won\'t search anymore', 259500, 264499) },
        { section: 'Final Verse', words: _wordsFromLine('Every page he\'s learn was a door left ajar', 264500, 270635) },
        { section: 'Final Verse', words: _wordsFromLine('Now he\'s done with paper', 270500, 272999) },
        { section: 'Final Verse', words: _wordsFromLine('Now he follows the scar', 273000, 280999) },

        { section: 'Outro', words: _wordsFromLine('The archive kept its secrets for three hundred years', 281000, 288785) },
        { section: 'Outro', words: _wordsFromLine('Now he steps out past it, leaving the fears', 291500, 294499) },
        { section: 'Outro', words: _wordsFromLine('He\'ll trade his pages for a teacher\'s hand', 299500, 311683) },
        { section: 'Outro', words: _wordsFromLine('Ready to learn what he can\'t understand', 313000, 321012) },
    ],
};