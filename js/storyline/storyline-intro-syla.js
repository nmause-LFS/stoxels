// =============================================================================
// storyline-intro-syla.js — The Cartographers of Chance
// ---------------------------------------------------------------------------
// Character intro data for Syla ("The Field Statistician").
// Depends on: storyline-engine.js (_wordsFromLine, MAX_SONG_SECTION_LINES,
// DEFAULT_SLIDE_DURATION_MS etc.) — must load AFTER that file.
// =============================================================================



// Folder where Syla's intro images live (relative to your index.html)
const SYLA_INTRO_IMAGE_PATH = "images/Intro/Syla_Intro/";


// ---------------------------------------------------------------------------
// SONG BEAT — karaoke-style Syla intro
// ---------------------------------------------------------------------------
//
// SYLA_INTRO_SONG — timed from Syla_Intro_Song.srt. Each line's start time
// is rounded DOWN to the nearest 0.5s (e.g. 12495ms -> 12000ms) so
// line-changes land on a clean half-second beat; end times are kept as the
// real SRT values, same approach as STOX_INTRO_SONG / TRIX_INTRO_SONG.
//
// NOTE on cue 55 ("The Guild man looks at her boots"): the source .srt has
// a broken end timestamp for this cue (00:02:57,617 --> 00:02:57,858, a
// ~240ms span for a full line — almost certainly an export glitch, since
// the next cue doesn't start until 00:03:02,545). The end time below
// is corrected to fill the natural gap before the next line instead of
// using the bad SRT value. Re-check this line if the SRT is ever
// re-exported/fixed upstream.
//
// TIMING ADJUSTMENT (applied to all `lines` entries below): every start/end
// timestamp has been shifted 1000ms earlier, then rounded to the nearest
// 500ms. This was a deliberate manual adjustment layered on top of the
// original SRT-derived values described above — re-derive from the SRT
// first, then re-apply this same -1000ms + round-to-nearest-0.5s step, if
// the source SRT ever changes.
//
// The `images` timeline below uses placeholder filenames (1.jpeg ... 27.jpeg)
// spaced roughly every 9 seconds across the song's ~239s runtime. Replace
// filenames and adjust times once the actual image set exists — the array
// just needs to stay sorted by ascending `time`. (Not touched by the -1s
// line-timing adjustment above — only the `lines` array was shifted.)
const SYLA_INTRO_SONG = {
    audio: "audio/Intro/Syla_Intro_Song.mp3",
    imagePath: SYLA_INTRO_IMAGE_PATH,

    // Image timeline — placeholders, adjust filenames and times once images exist.
    // Each entry fires when playback crosses its `time` (ms from song start).
    images: [
        { image: "1.jpeg", time: 0 },          // establishing shot before vocals
        { image: "2.jpeg", time: 12000 },      // "Born beneath the Normal Grove"
        { image: "3.jpeg", time: 21000 },      // "And the forest was her home"
        { image: "4.jpeg", time: 30000 },      // "Knew the mushrooms' glowing nights"
        { image: "5.jpeg", time: 36000 },      // "But the fox takes the same path now"
        { image: "6.jpeg", time: 45500 },      // "Same branch, same time, same song"
        { image: "7.jpeg", time: 54500 },      // "Something's pulling at the wild"
        { image: "8.jpeg", time: 60500 },      // "She checks her parents' instruments"
        { image: "9.jpeg", time: 70000 },      // "But nobody answers here"
        { image: "10.jpeg", time: 78000 },     // "And near the end it bends too far" (Chorus 1)
        { image: "11.jpeg", time: 90500 },     // "Something deliberate / planned"
        { image: "12.jpeg", time: 96500 },     // "Every wound connects to one point"
        { image: "13.jpeg", time: 112000 },    // "Then she watches her own mother"
        { image: "14.jpeg", time: 124000 },    // "And her father at the window"
        { image: "15.jpeg", time: 133000 },    // "Cold and quiet, like thin ice"
        { image: "16.jpeg", time: 136000 },    // "She's the only one still moving"
        { image: "17.jpeg", time: 145500 },    // "She won't be who she needs to be"
        { image: "18.jpeg", time: 154000 },    // "And near the end it bends too far" (Chorus 2)
        { image: "19.jpeg", time: 169500 },    // "Every wound connects to one point"
        { image: "20.jpeg", time: 177500 },    // "The Guild man looks at her boots"
        { image: "21.jpeg", time: 181500 },    // Not her notebooks, not her proof
        { image: "22.jpeg", time: 190000 },    // There's a program, someone says
        { image: "23.jpeg", time: 196500 },    // She signs her name without a pause
        { image: "24.jpeg", time: 204500 },    // She steps away from everything
        { image: "25.jpeg", time: 207500 },    // The Grove, the logs, the glowing nights
        { image: "26.jpeg", time: 211000 },    // Notebook open, not yet closed
        { image: "27.jpeg", time: 217000 },    // The animals are waiting still
        { image: "28.jpeg", time: 226000 },
        { image: "29.jpeg", time: 232000 },
    ],

    // Lyric timeline — all 70 lines from the SRT, in order. Timestamps here
    // have been shifted 1000ms earlier and rounded to the nearest 500ms
    // (see TIMING ADJUSTMENT note above). Cue 55's end is the manually
    // corrected gap-fill value, also shifted/rounded the same way.
    lines: [
        { section: 'Verse 1', words: _wordsFromLine('Born beneath the Normal Grove', 11000, 14000) },
        { section: 'Verse 1', words: _wordsFromLine('Where the bell curve shapes the stone', 14000, 16500) },
        { section: 'Verse 1', words: _wordsFromLine("Mama's charts, and Papa's logs", 17000, 19500) },
        { section: 'Verse 1', words: _wordsFromLine('And the forest was her home', 20000, 23000) },
        { section: 'Verse 1', words: _wordsFromLine('Knew the fox that lived due east', 23000, 25500) },
        { section: 'Verse 1', words: _wordsFromLine('Knew the beetles, knew the birds', 25500, 29000) },
        { section: 'Verse 1', words: _wordsFromLine("Knew the mushrooms' glowing nights", 29000, 32000) },
        { section: 'Verse 1', words: _wordsFromLine('Better than she knew her words', 32000, 35000) },

        { section: 'Verse 2', words: _wordsFromLine('But the fox takes the same path now', 35000, 38500) },
        { section: 'Verse 2', words: _wordsFromLine('Every morning, never wrong', 38500, 41500) },
        { section: 'Verse 2', words: _wordsFromLine('And the birds sing the same notes', 41500, 44500) },
        { section: 'Verse 2', words: _wordsFromLine('Same branch, same time, same song', 44500, 47500) },
        { section: 'Verse 2', words: _wordsFromLine('Squirrels cache in the same spot', 47500, 50500) },
        { section: 'Verse 2', words: _wordsFromLine('Deer drink from the stagnant stream', 50500, 53500) },
        { section: 'Verse 2', words: _wordsFromLine("Something's pulling at the wild", 53500, 56000) },
        { section: 'Verse 2', words: _wordsFromLine('Draining out the living dream', 56000, 59000) },

        { section: 'Pre-Chorus 1', words: _wordsFromLine("She checks her parents' instruments", 59500, 62500) },
        { section: 'Pre-Chorus 1', words: _wordsFromLine('The numbers back her fear', 62500, 65500) },
        { section: 'Pre-Chorus 1', words: _wordsFromLine('They\'ve been sending Guild reports', 65500, 69000) },
        { section: 'Pre-Chorus 1', words: _wordsFromLine('But nobody answers here', 69000, 74000) },

        { section: 'Chorus 1', words: _wordsFromLine('She draws the line', 74000, 75500) },
        { section: 'Chorus 1', words: _wordsFromLine('She marks the slope', 75500, 77000) },
        { section: 'Chorus 1', words: _wordsFromLine('And near the end it bends too far', 77000, 80500) },
        { section: 'Chorus 1', words: _wordsFromLine('This was never background noise', 80500, 83500) },
        { section: 'Chorus 1', words: _wordsFromLine("Something's pushing from the dark", 83500, 86500) },
        { section: 'Chorus 1', words: _wordsFromLine('Not decay', 86500, 87500) },
        { section: 'Chorus 1', words: _wordsFromLine('Not just the years', 87500, 89500) },
        { section: 'Chorus 1', words: _wordsFromLine('Something deliberate', 89500, 91000) },
        { section: 'Chorus 1', words: _wordsFromLine('Something planned', 91000, 92500) },
        { section: 'Chorus 1', words: _wordsFromLine('Every wound connects to one point', 92500, 95500) },
        { section: 'Chorus 1', words: _wordsFromLine('That someone needs to reach by hand', 95500, 101000) },

        { section: 'Verse 3', words: _wordsFromLine('Then she watches her own mother', 111000, 114000) },
        { section: 'Verse 3', words: _wordsFromLine('Write the same report again', 114000, 116500) },
        { section: 'Verse 3', words: _wordsFromLine('Same words, same hand, same hour', 117000, 120000) },
        { section: 'Verse 3', words: _wordsFromLine("Like she's always just begin", 120000, 123000) },
        { section: 'Verse 3', words: _wordsFromLine('And her father at the window', 123000, 126000) },
        { section: 'Verse 3', words: _wordsFromLine('Counts the pines the same way twice', 126000, 129000) },
        { section: 'Verse 3', words: _wordsFromLine('She can feel it at the edges', 129000, 132000) },
        { section: 'Verse 3', words: _wordsFromLine('Cold and quiet, like thin ice', 132000, 135000) },

        { section: 'Pre-Chorus 2', words: _wordsFromLine("She's the only one still moving", 136500, 139000) },
        { section: 'Pre-Chorus 2', words: _wordsFromLine("She's the only one still free", 139000, 141500) },
        { section: 'Pre-Chorus 2', words: _wordsFromLine('If she waits another morning', 141500, 144500) },
        { section: 'Pre-Chorus 2', words: _wordsFromLine("She won't be who she needs to be", 144500, 150500) },

        { section: 'Chorus 2', words: _wordsFromLine('She draws the line', 150500, 151500) },
        { section: 'Chorus 2', words: _wordsFromLine('She marks the slope', 151500, 153000) },
        { section: 'Chorus 2', words: _wordsFromLine('And near the end it bends too far', 153000, 156500) },
        { section: 'Chorus 2', words: _wordsFromLine('This was never background noise', 156500, 159000) },
        { section: 'Chorus 2', words: _wordsFromLine("Something's pushing from the dark", 159000, 162500) },
        { section: 'Chorus 2', words: _wordsFromLine('Not decay', 162500, 164000) },
        { section: 'Chorus 2', words: _wordsFromLine('Not just the years', 163500, 165500) },
        { section: 'Chorus 2', words: _wordsFromLine('Something deliberate', 165500, 166500) },
        { section: 'Chorus 2', words: _wordsFromLine('Something planned', 166500, 168500) },
        { section: 'Chorus 2', words: _wordsFromLine('Every wound connects to one point', 168500, 171500) },
        { section: 'Chorus 2', words: _wordsFromLine('That someone needs to reach by hand', 171500, 176500) },

        { section: 'Bridge', words: _wordsFromLine('The Guild man looks at her boots', 178500, 181500) },
        { section: 'Bridge', words: _wordsFromLine('Not her notebooks, not her proof', 181500, 184500) },
        { section: 'Bridge', words: _wordsFromLine("But she doesn't need believed", 184500, 187500) },
        { section: 'Bridge', words: _wordsFromLine('She needs someone to move', 187500, 190000) },
        { section: 'Bridge', words: _wordsFromLine("There's a program, someone says", 190000, 193500) },
        { section: 'Bridge', words: _wordsFromLine('People who go out there still', 193500, 196500) },
        { section: 'Bridge', words: _wordsFromLine('She signs her name without a pause', 196500, 199000) },
        { section: 'Bridge', words: _wordsFromLine('She has a fox to heal', 199000, 205000) },

        { section: 'Outro', words: _wordsFromLine('She steps away from everything', 204500, 207500) },
        { section: 'Outro', words: _wordsFromLine('The Grove, the logs, the glowing nights', 207500, 211000) },
        { section: 'Outro', words: _wordsFromLine('Notebook open, not yet closed', 211000, 214000) },
        { section: 'Outro', words: _wordsFromLine("She's following the light", 214000, 217000) },
        { section: 'Outro', words: _wordsFromLine('The animals are waiting still', 217000, 220000) },
        { section: 'Outro', words: _wordsFromLine('Caught inside the same refrain', 220000, 223000) },
        { section: 'Outro', words: _wordsFromLine('She will walk back in someday', 223000, 226000) },
        { section: 'Outro', words: _wordsFromLine('And set them free again', 226000, 238500) },
    ],
};