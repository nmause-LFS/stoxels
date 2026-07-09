// =============================================================================
// storyline-engine.js — The Cartographers of Chance
// ---------------------------------------------------------------------------
// The rendering engine for story beats: text pages, image slideshows, and
// karaoke-style songs. Contains no story CONTENT — only the machinery that
// plays it back.
//
// Load order: this file (or its shared constants, see below) must be loaded
// AFTER all storyline-intro-*.js / storyline-beats.js data files, since
// showBeat()/StorylineRenderer read STORY_BEATS, INTRO_SONG, etc. lazily
// inside function bodies — so technically order vs. those doesn't matter at
// parse time. The one thing that DOES matter: this file defines
// _wordsFromLine(), DEFAULT_SLIDE_DURATION_MS, and
// SLIDE_FADE_MS, which the data files (e.g. storyline-intro.js) call/reference
// directly inside their own top-level const declarations — so THIS file must
// load BEFORE storyline-intro.js and any other file that calls
// _wordsFromLine(...) or references these constants at parse time.
//
// Suggested <script> order in index.html:
//   1. storyline-engine.js          (this file)
//   2. storyline-intro.js           (main game intro song)
//   3. storyline-intro-stox.js      (Stox character intro)
//   4. storyline-intro-trix.js      (Trix character intro)
//   5. storyline-intro-syla.js      (Syla character intro)
//   6. storyline-beats.js           (STORY_BEATS — references all of the above)
// =============================================================================

// ---------------------------------------------------------------------------
// SHARED CONSTANTS — used by storyline-intro*.js data files
// ---------------------------------------------------------------------------

// Default time each slide stays on screen (ms) for image-slideshow beats.
// Override per-slide via the optional `duration` field on a slide object.
const DEFAULT_SLIDE_DURATION_MS = 10000;

// How long the text/image fade transition takes (ms) for slideshow beats.
const SLIDE_FADE_MS = 500;

// _wordsFromLine — PLACEHOLDER-STYLE timestamp generator for karaoke song
// beats. Splits a line into words and spaces their "fully revealed" times
// evenly between lineStartMs and lineEndMs. When fed real per-LINE timing
// (e.g. parsed from an .srt file), this still gives accurate line-level
// sync — only the word-by-word pace within a line is estimated/even, since
// SRT files don't carry per-word timestamps. Swap in literal per-word
// timestamps for any line where you have them.
function _wordsFromLine(text, lineStartMs, lineEndMs) {
    const words = text.split(' ').filter(Boolean);
    const span = lineEndMs - lineStartMs;
    return words.map((word, i) => ({
        word,
        time: Math.round(lineStartMs + span * ((i + 1) / words.length)),
    }));
}



const _imgCache = new Map(); // url -> Promise<HTMLImageElement>

function _preloadImage(url) {
    if (_imgCache.has(url)) return _imgCache.get(url);
    const img = new Image();
    const p = new Promise((resolve) => {
        img.onload = () => {
            if (img.decode) img.decode().then(() => resolve(img)).catch(() => resolve(img));
            else resolve(img);
        };
        img.onerror = () => resolve(img); // don't hang the queue on one bad file
    });
    img.src = url;
    _imgCache.set(url, p);
    return p;
}



// ---------------------------------------------------------------------------
// RENDERER
// ---------------------------------------------------------------------------

const StorylineRenderer = (() => {

    // -- Styling constants --
    const STYLES = {
        overlay: `
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: #000;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            overflow: hidden;
        `,
        textBox: `
            max-width: 680px;
            width: 90%;
            text-align: center;
        `,
        line: `
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: clamp(14px, 2.2vw, 18px);
            line-height: 1.85;
            color: rgba(255, 255, 255, 0);
            margin: 0 0 1.1em 0;
            transition: color 2s ease;
        `,
        // Lines that open with a quote mark are styled differently
        quotedLine: `
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: clamp(13px, 2vw, 16px);
            line-height: 1.9;
            color: rgba(255, 255, 255, 0);
            margin: 0 0 1em 0;
            font-style: italic;
            transition: color 2s ease;
        `,
        hint: `
            position: absolute;
            bottom: clamp(14px, 4vh, 36px);
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: clamp(11px, 2.4vw, 20px);
            letter-spacing: 0.18em;
            color: rgba(255, 255, 255, 0);
            text-transform: uppercase;
            transition: color 2s ease;
            white-space: nowrap;
            pointer-events: none;
        `,
        skipBtn: `
            position: absolute;
            bottom: clamp(10px, 3.2vh, 28px);
            right: clamp(10px, 3.6vw, 36px);
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: clamp(13px, 3vw, 30px);
            letter-spacing: 0.18em;
            color: rgba(255, 255, 255, 0.75);
            text-transform: uppercase;
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.5);
            cursor: pointer;
            border-radius: 4px;
            padding: clamp(4px, 1vh, 6px) clamp(8px, 2vw, 12px);
            pointer-events: all;
        `,
        pageIndicator: `
            position: absolute;
            top: clamp(10px, 3.2vh, 28px);
            right: clamp(10px, 3.6vw, 36px);
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: clamp(13px, 3vw, 30px);
            letter-spacing: 0.14em;
            color: rgba(255, 255, 255, 0.75);
        `,
        // -- Media frame: locked to the source images' native aspect ratio
        // (1376x768 = 1.791667). Sized via calc() so it always fits fully
        // inside the viewport on whichever axis is the tighter constraint —
        // letterboxed/pillarboxed as needed — the same "contain"-style fix
        // used for the title screen's .title-canvas. Both slideshow and
        // song beats render their <img> layers inside this frame instead of
        // directly against the full-viewport overlay, so object-fit: cover
        // on the images never has to crop content to fill a mismatched box.
        mediaFrame: `
            position: relative;
            aspect-ratio: 1376 / 768;
            width: min(100%, calc(100vh * 1.791667));
            height: auto;
            max-height: 100%;
            overflow: hidden;
        `,
        // -- Slideshow-specific styles --
        slideImage: `
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity ${SLIDE_FADE_MS}ms ease;
            pointer-events: none;
        `,
        slideTextWrap: `
            position: absolute;
            left: 0; right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            padding: 0 clamp(10px, 4vw, 24px) clamp(28px, 10vh, 64px) clamp(10px, 4vw, 24px);
            box-sizing: border-box;
            pointer-events: none;
        `,
        slideTextBox: `
            max-width: 760px;
            width: 100%;
            text-align: center;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            padding: clamp(10px, 2.4vh, 18px) clamp(12px, 4vw, 28px);
            box-sizing: border-box;
        `,
        //rgba(0, 0, 0, 0);
        slideText: `
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: clamp(15px, 2.4vw, 20px);
            line-height: 1.7;
            color: rgba(0, 0, 0, 0);    
            margin: 0;
            transition: color ${SLIDE_FADE_MS}ms ease;
        `,
        // -- Song / karaoke-specific styles --
        songTextWrap: `
            position: absolute;
            left: 0; right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            padding: 0 clamp(10px, 4vw, 24px) clamp(28px, 10vh, 64px) clamp(10px, 4vw, 24px);
            box-sizing: border-box;
            pointer-events: none;
        `,
        songTextBox: `
            max-width: min(520px, 92vw);
            min-width: min(280px, 92vw);
            text-align: center;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 10px;
            padding: clamp(10px, 2.4vh, 18px) clamp(12px, 4vw, 28px);
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        `,
        // One row per lyric line within the current section.
        songLineRow: `
            font-family: 'Georgia', 'Times New Roman', serif;
            font-weight: bold;
            font-size: clamp(15px, 2.4vw, 20px);
            line-height: 1.6;
            margin: 0;
            min-height: 1.6em;
            transition: opacity 400ms ease;
        `,
        // Letters not yet reached by playback in the active line.
        songLineUnrevealed: `
            color: rgba(0, 0, 0, 0.95);
        `,
        // Letters already sung in the currently-active line.
        songLineRevealedActive: `
            color: rgba(0, 0, 0, 0.95);
        `,
        // Full lines from earlier in the section, already sung — dimmed but
        // still visible, so the whole section builds up rather than vanishing.
        songLineRevealedPast: `
            color: rgba(0, 0, 0, 0.95);
        `,
    };

    const FADE_IN_DELAY_MS = 5000;  // stagger between lines appearing (text-page beats)
    const HINT_DELAY_MS = 1800;    // how long before "click to continue" appears

    let overlay = null;
    let currentPages = [];
    let currentPage = 0;
    let onComplete = null;
    let hintTimeout = null;

    // -- Slideshow-specific state --
    let currentSlides = [];
    let currentSlide = 0;
    let currentSlideImagePath = ''; // set per-beat in show(); see usage sites below for fallback
    let slideAdvanceTimeout = null;
    let slideImgEls = {}; // index -> <img> element (for crossfade between two layers)

    // -- Song / karaoke-specific state --
    let songAudioEl = null;      // the <audio> element driving the karaoke clock
    let songImages = [];         // [{ image, time }] sorted by time
    let songLines = [];          // [{ section, words: [{word, time}] }] sorted by time
    let songImagePath = '';
    let songImgEls = {};         // dom refs, same shape as slideImgEls
    let songRafId = null;        // requestAnimationFrame handle for the sync loop
    let songCurrentImageIdx = -1;
    let songCurrentLineIdx = -1;
    let songLineRowEls = [];     // <p> row element for the line currently being sung

    // buildSlideshow — returns { slides, imagePath } for a slideshow beat,
    // or null if the requested beat/variant isn't a slideshow.
    function buildSlideshow(beatId, options = {}) {
        const beat = STORY_BEATS[beatId];
        if (!beat) {
            console.warn(`[Storyline] Unknown beat: "${beatId}"`);
            return null;
        }

        // Top-level slideshow beats (e.g. intro_cinematic)
        if (beat.slides) {
            return { slides: beat.slides, imagePath: beat.imagePath || INTRO_CINEMATIC_IMAGE_PATH };
        }

        // Character-variant slideshow beats (e.g. character_intro)
        if (beat.characterVariants) {
            const char = (options.character || '').toLowerCase();
            const variant = beat.characterVariants[char];
            if (!variant) {
                console.warn(`[Storyline] No character variant "${char}" for beat "${beatId}"`);
                return null;
            }
            if (variant.slides) {
                return { slides: variant.slides, imagePath: variant.imagePath || INTRO_CINEMATIC_IMAGE_PATH };
            }
        }

        return null;
    }

    // buildSong — returns { audio, images, lines, imagePath } for a song beat,
    // or null if the requested beat/variant isn't a song.
    function buildSong(beatId, options = {}) {
        const beat = STORY_BEATS[beatId];
        if (!beat) {
            console.warn(`[Storyline] Unknown beat: "${beatId}"`);
            return null;
        }

        // Top-level song beats
        if (beat.song) {
            return beat.song;
        }

        // Character-variant song beats (e.g. character_intro using songs)
        if (beat.characterVariants) {
            const char = (options.character || '').toLowerCase();
            const variant = beat.characterVariants[char];
            if (!variant) {
                console.warn(`[Storyline] No character variant "${char}" for beat "${beatId}"`);
                return null;
            }
            if (variant.song) {
                return variant.song;
            }
        }

        return null;
    }


    function buildPages(beatId, options = {}) {
        const beat = STORY_BEATS[beatId];
        if (!beat) {
            console.warn(`[Storyline] Unknown beat: "${beatId}"`);
            return null;
        }

        // Slideshow beats (e.g. intro_cinematic) are handled via buildSlideshow
        if (beat.slides) {
            return beat.slides;
        }

        // Character-variant beats
        if (beat.characterVariants) {
            const char = (options.character || '').toLowerCase();
            const variant = beat.characterVariants[char];
            if (!variant) {
                console.warn(`[Storyline] No character variant "${char}" for beat "${beatId}"`);
                return null;
            }
            // Slideshow-style character variants are handled via buildSlideshow
            if (variant.slides) {
                return variant.slides;
            }
            return variant.pages;
        }

        // Class unlock beat (special structure)
        if (beatId === 'class_unlock') {
            const className = options.className || '';
            const classLine = beat.classLines[className] || beat.defaultClassLine;
            return [
                [...beat.shared, classLine]
            ];
        }

        // Ascendency unlock beat (special structure)
        if (beatId === 'ascendency_unlock') {
            const key = (options.ascendencyClass || '').replace(/\s+/g, '');
            return beat.variants[key] || beat.defaultVariant;
        }

        return beat.pages;
    }

    // isSlideshowBeat — true if this beat (given options) should render as
    // an image slideshow rather than a text-page sequence.
    function isSlideshowBeat(beatId, options = {}) {
        const beat = STORY_BEATS[beatId];
        if (!beat) return false;
        if (beat.slides) return true;
        if (beat.characterVariants) {
            const char = (options.character || '').toLowerCase();
            const variant = beat.characterVariants[char];
            return !!(variant && variant.slides);
        }
        return false;
    }

    // isSongBeat — true if this beat (given options) should render as a
    // karaoke-style song (independent image timeline + word-by-word lyric reveal).
    function isSongBeat(beatId, options = {}) {
        const beat = STORY_BEATS[beatId];
        if (!beat) return false;
        if (beat.song) return true;
        if (beat.characterVariants) {
            const char = (options.character || '').toLowerCase();
            const variant = beat.characterVariants[char];
            return !!(variant && variant.song);
        }
        return false;
    }

    function createOverlay() {
        const el = document.createElement('div');
        el.style.cssText = STYLES.overlay;
        return el;
    }

    // -------------------------------------------------------------------
    // TEXT-PAGE RENDERING (multi-line pages, click/space to advance)
    // -------------------------------------------------------------------

    function renderPage(pages, pageIndex) {
        if (!overlay) return;
        overlay.innerHTML = '';

        const lines = pages[pageIndex];
        const box = document.createElement('div');
        box.style.cssText = STYLES.textBox;

        lines.forEach((text, i) => {
            const p = document.createElement('p');
            const isQuote = text.startsWith('"');
            p.style.cssText = isQuote ? STYLES.quotedLine : STYLES.line;
            p.textContent = text;
            box.appendChild(p);

            // Stagger fade-in
            setTimeout(() => {
                p.style.color = isQuote
                    ? 'rgba(255, 255, 255, 0.82)'
                    : 'rgba(255, 255, 255, 0.95)';
            }, i * FADE_IN_DELAY_MS + 80);
        });

        overlay.appendChild(box);

        // Page indicator (only when multi-page)
        if (pages.length > 1) {
            const indicator = document.createElement('div');
            indicator.style.cssText = STYLES.pageIndicator;
            indicator.textContent = `${pageIndex + 1} / ${pages.length}`;
            overlay.appendChild(indicator);
        }

        // "Click to continue" hint
        const hint = document.createElement('div');
        hint.style.cssText = STYLES.hint;
        const isLast = pageIndex === pages.length - 1;
        hint.textContent = isLast ? 'click to continue' : 'click for next';
        overlay.appendChild(hint);

        if (hintTimeout) clearTimeout(hintTimeout);
        const lastLineFadeIn = lines.length * FADE_IN_DELAY_MS + 80;
        const dynamicHintDelay = Math.max(HINT_DELAY_MS, lastLineFadeIn + 600);
        hintTimeout = setTimeout(() => {
            hint.style.color = 'rgba(255, 255, 255, 0.28)';
        }, dynamicHintDelay);
    }

    function advance() {
        currentPage++;
        if (currentPage < currentPages.length) {
            renderPage(currentPages, currentPage);
        } else {
            close();
        }
    }

    // -------------------------------------------------------------------
    // SLIDESHOW RENDERING (image + overlay text, auto-advances by timer)
    // -------------------------------------------------------------------

    function renderSlideshow(slides) {
        if (!overlay) return;
        overlay.innerHTML = '';
        slideImgEls = {};

        // Media frame — locked to the images' native aspect ratio so they're
        // never cropped to fill a mismatched viewport shape (letterboxed/
        // pillarboxed as needed instead).
        const frame = document.createElement('div');
        frame.style.cssText = STYLES.mediaFrame;
        overlay.appendChild(frame);
        slideImgEls.frame = frame;

        // Two stacked <img> layers so we can crossfade between slides.
        const imgA = document.createElement('img');
        const imgB = document.createElement('img');
        imgA.style.cssText = STYLES.slideImage;
        imgB.style.cssText = STYLES.slideImage;
        frame.appendChild(imgA);
        frame.appendChild(imgB);
        slideImgEls.layers = [imgA, imgB];
        slideImgEls.activeLayer = 0;

        // Text overlay box (sits above the images, inside the frame so it
        // always tracks the visible image rather than the full viewport)
        const textWrap = document.createElement('div');
        textWrap.style.cssText = STYLES.slideTextWrap;
        const textBox = document.createElement('div');
        textBox.style.cssText = STYLES.slideTextBox;
        const textP = document.createElement('p');
        textP.style.cssText = STYLES.slideText;
        textBox.appendChild(textP);
        textWrap.appendChild(textBox);
        frame.appendChild(textWrap);
        slideImgEls.textP = textP;

        // Page indicator
        const indicator = document.createElement('div');
        indicator.style.cssText = STYLES.pageIndicator;
        overlay.appendChild(indicator);
        slideImgEls.indicator = indicator;

        // "Click for next" hint
        const hint = document.createElement('div');
        hint.style.cssText = STYLES.hint;
        hint.textContent = 'click for next';
        overlay.appendChild(hint);
        slideImgEls.hint = hint;

        // Skip button
        const skipBtn = document.createElement('button');
        skipBtn.style.cssText = STYLES.skipBtn;
        skipBtn.textContent = 'skip';
        skipBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // don't also advance the slide
            close();
        });
        overlay.appendChild(skipBtn);
        slideImgEls.skipBtn = skipBtn;

        showSlide(slides, 0);
    }

    function showSlide(slides, index) {
        if (!overlay) return;
        if (slideAdvanceTimeout) {
            clearTimeout(slideAdvanceTimeout);
            slideAdvanceTimeout = null;
        }

        const slide = slides[index];
        const duration = slide.duration || DEFAULT_SLIDE_DURATION_MS;

        // Crossfade images: fade out the active layer, fade in the other one.
        const layers = slideImgEls.layers;
        const activeIdx = slideImgEls.activeLayer;
        const nextIdx = activeIdx === 0 ? 1 : 0;

        const outgoing = layers[activeIdx];
        const incoming = layers[nextIdx];

        incoming.src = currentSlideImagePath + slide.image;
        incoming.style.opacity = '0';
        outgoing.style.opacity = '0';

        // Force the new image in front once loaded (or immediately as fallback)
        requestAnimationFrame(() => {
            incoming.style.opacity = '1';
        });

        slideImgEls.activeLayer = nextIdx;

        // Update text (fade out then in)
        const textP = slideImgEls.textP;
        textP.style.color = 'rgba(0, 0, 0, 0)';
        setTimeout(() => {
            textP.textContent = slide.text || '';
            requestAnimationFrame(() => {
                textP.style.color = 'rgba(0, 0, 0, 0.95)';
            });
        }, SLIDE_FADE_MS);

        // Update page indicator
        slideImgEls.indicator.textContent = `${index + 1} / ${slides.length}`;

        // Hint text + style
        const isLast = index === slides.length - 1;
        slideImgEls.hint.textContent = isLast ? 'click to continue' : 'click for next';
        slideImgEls.hint.style.color = 'rgba(255, 255, 255, 0)';
        if (hintTimeout) clearTimeout(hintTimeout);
        hintTimeout = setTimeout(() => {
            slideImgEls.hint.style.color = 'rgba(255, 255, 255, 0.28)';
        }, HINT_DELAY_MS);

        // Auto-advance after `duration` ms
        slideAdvanceTimeout = setTimeout(() => {
            advanceSlide(slides);
        }, duration);
    }

    function advanceSlide(slides) {
        currentSlide++;
        if (currentSlide < slides.length) {
            showSlide(slides, currentSlide);
        } else {
            close();
        }
    }

    // -------------------------------------------------------------------
    // SONG RENDERING (karaoke-style: independent image timeline +
    // word-by-word lyric reveal, both driven off audio.currentTime)
    // -------------------------------------------------------------------

    // Escapes text so it's safe to drop into innerHTML for the per-letter spans.
    function _escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Measures the rendered width (px) of the widest line of lyric text,
    // using the same font as the visible rows (STYLES.songLineRow), so the
    // box can be sized once up front and never resize as lines change.
    // Capped between the box's min/max-width so very short or very long
    // songs still get a sane box. `padding` accounts for the textBox's own
    // left+right padding (28px each side, per STYLES.songTextBox).
    function _measureWidestLineWidth(lines) {
        const MIN_PX = 280;
        const MAX_PX = 520;
        const PADDING_PX = 28 * 2;

        const measurer = document.createElement('span');
        measurer.style.cssText = STYLES.songLineRow;
        measurer.style.position = 'absolute';
        measurer.style.visibility = 'hidden';
        measurer.style.whiteSpace = 'nowrap';
        measurer.style.left = '-9999px';
        document.body.appendChild(measurer);

        let widest = 0;
        for (const line of lines) {
            const text = line.words.map(w => w.word).join(' ');
            measurer.textContent = text;
            widest = Math.max(widest, measurer.getBoundingClientRect().width);
        }

        document.body.removeChild(measurer);

        const target = widest + PADDING_PX;
        return Math.min(MAX_PX, Math.max(MIN_PX, target));
    }

    function renderSong(song) {
        if (!overlay) return;
        overlay.innerHTML = '';
        songImgEls = {};

        // Media frame — locked to the images' native aspect ratio, same
        // fix as the regular slideshow, so song backgrounds aren't cropped.
        const frame = document.createElement('div');
        frame.style.cssText = STYLES.mediaFrame;
        overlay.appendChild(frame);
        songImgEls.frame = frame;

        // Two stacked <img> layers so we can crossfade between images,
        // same approach as the regular slideshow.
        const imgA = document.createElement('img');
        const imgB = document.createElement('img');
        imgA.style.cssText = STYLES.slideImage;
        imgB.style.cssText = STYLES.slideImage;
        frame.appendChild(imgA);
        frame.appendChild(imgB);
        songImgEls.layers = [imgA, imgB];
        songImgEls.activeLayer = 0;

        // Text overlay box. Holds exactly one row — the line currently
        // being sung — rebuilt fresh each time the active line changes
        // (see _buildSingleLineRow). Width is fixed once here (based on the
        // widest line in the whole song) so the box doesn't resize as
        // different lines appear. Lives inside the frame so it tracks the
        // visible image rather than the full viewport.
        const textWrap = document.createElement('div');
        textWrap.style.cssText = STYLES.songTextWrap;
        const textBox = document.createElement('div');
        textBox.style.cssText = STYLES.songTextBox;
        textBox.style.width = _measureWidestLineWidth(songLines) + 'px';
        textWrap.appendChild(textBox);
        frame.appendChild(textWrap);
        songImgEls.textBox = textBox;

        // Skip button (no page indicator / click-to-advance hint — song beats
        // are driven by audio playback, not click-through)
        const skipBtn = document.createElement('button');
        skipBtn.style.cssText = STYLES.skipBtn;
        skipBtn.textContent = 'skip';
        skipBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            close();
        });
        overlay.appendChild(skipBtn);
        songImgEls.skipBtn = skipBtn;

        // Show the first image immediately (don't wait for the RAF loop's
        // first tick) so there's no blank flash at time 0.
        if (songImages.length > 0) {
            const firstLayer = songImgEls.layers[0];
            firstLayer.src = songImagePath + songImages[0].image;
            firstLayer.style.opacity = '1';
            songImgEls.activeLayer = 0;
            songCurrentImageIdx = 0;
        }
        songCurrentLineIdx = -1;
        songLineRowEls = [];
    }

    // Swaps to a new image with a crossfade. Mirrors showSlide's image logic
    // but is driven by elapsed playback time rather than a fixed timer.
    function _songSwapImage(imageFile) {
        const layers = songImgEls.layers;
        const activeIdx = songImgEls.activeLayer;
        const nextIdx = activeIdx === 0 ? 1 : 0;
        const outgoing = layers[activeIdx];
        const incoming = layers[nextIdx];
        const url = songImagePath + imageFile;

        _preloadImage(url).then((img) => {
            incoming.src = img.src;
            requestAnimationFrame(() => {
                incoming.style.opacity = '1';
                outgoing.style.opacity = '0';
            });
        });

        songImgEls.activeLayer = nextIdx;
    }

    // Builds the letter-revealable inner markup for one lyric line (a row's
    // innerHTML). Each word is wrapped in a span holding its own letters,
    // each letter its own span, so we can toggle "revealed" vs "unrevealed"
    // per letter without re-building the DOM every frame.
    function _buildLineMarkup(line) {
        return line.words.map((w, wi) => {
            const letters = w.word.split('').map(ch =>
                `<span class="ka-letter" data-revealed="0" style="color: rgba(0, 0, 0, 0.95);">${_escapeHtml(ch)}</span>`
            ).join('');
            const space = wi < line.words.length - 1 ? ' ' : '';
            return `<span class="ka-word">${letters}</span>${space}`;
        }).join('');
    }

    // Rebuilds the text block to hold exactly one row, for the line
    // currently being sung. Called every time the active line changes —
    // the box always shows just the current line, never accumulating
    // earlier lines from the same section.
    function _buildSingleLineRow() {
        const textBox = songImgEls.textBox;
        textBox.innerHTML = '';
        songLineRowEls = [];

        const row = document.createElement('p');
        row.style.cssText = STYLES.songLineRow;
        row.style.opacity = '0';
        textBox.appendChild(row);
        songLineRowEls.push(row);
    }

    // Given a line's row element and the current playback time, reveals
    // letters up through the word that should be fully sung by now.
    // Interpolates within the current word so it types out smoothly.
    function _updateLineReveal(rowEl, line, nowMs, lineStartMs) {
        const words = line.words;
        const letterSpans = rowEl.querySelectorAll('.ka-letter');
        let letterCursor = 0;

        for (let wi = 0; wi < words.length; wi++) {
            const word = words[wi];
            const wordLen = word.word.length;
            const wordStart = wi === 0 ? lineStartMs : words[wi - 1].time;
            const wordEnd = word.time;

            let revealCount;
            if (nowMs >= wordEnd) {
                revealCount = wordLen; // fully sung
            } else if (nowMs <= wordStart) {
                revealCount = 0; // not started yet
            } else {
                const progress = (nowMs - wordStart) / Math.max(1, wordEnd - wordStart);
                revealCount = Math.floor(progress * wordLen);
            }

            for (let li = 0; li < wordLen; li++) {
                const span = letterSpans[letterCursor + li];
                if (!span) continue;
                const shouldReveal = li < revealCount;
                if (shouldReveal && span.dataset.revealed !== '1') {
                    span.dataset.revealed = '1';
                    span.style.color = 'rgba(0, 0, 0, 0.95)';
                } else if (!shouldReveal && span.dataset.revealed !== '0') {
                    span.dataset.revealed = '0';
                    span.style.color = 'rgba(0, 0, 0, 0.95)';
                }
            }
            letterCursor += wordLen;
        }
    }

    // The main sync loop — ticks every animation frame while the song plays.
    // Reads the audio element's real playback time and updates whichever
    // image / lyric line should be showing at that moment.
    function _songSyncTick() {
        if (!overlay || !songAudioEl) return;

        const nowMs = songAudioEl.currentTime * 1000;

        // -- Image timeline: advance to the latest image whose time has passed --
        let targetImageIdx = songCurrentImageIdx;
        for (let i = 0; i < songImages.length; i++) {
            if (songImages[i].time <= nowMs) targetImageIdx = i;
            else break;
        }
        if (targetImageIdx !== songCurrentImageIdx && targetImageIdx >= 0) {
            songCurrentImageIdx = targetImageIdx;
            _songSwapImage(songImages[targetImageIdx].image);
        }

        // -- Lyric timeline: find the active line (the last line whose first
        //    word has started). Stays -1 ("nothing yet") until playback
        //    actually reaches the first line's start time, so there's a
        //    silent/blank lead-in instead of showing line 0 immediately. --
        let targetLineIdx = -1;
        for (let i = 0; i < songLines.length; i++) {
            const firstWordTime = songLines[i].words[0] ? songLines[i].words[0].time : 0;
            if (firstWordTime <= nowMs) {
                targetLineIdx = i;
            } else {
                break;
            }
        }

        if (targetLineIdx >= 0 && targetLineIdx !== songCurrentLineIdx && songLines.length > 0) {
            songCurrentLineIdx = targetLineIdx;

            // Always a fresh single-row box — the box only ever shows the
            // line currently being sung, never accumulating past lines.
            _buildSingleLineRow();

            const row = songLineRowEls[0];
            if (row) {
                row.innerHTML = _buildLineMarkup(songLines[targetLineIdx]);
                requestAnimationFrame(() => { row.style.opacity = '1'; });
            }
        }

        // Progressively reveal letters within the active line
        if (songCurrentLineIdx >= 0) {
            const line = songLines[songCurrentLineIdx];
            const prevLine = songLines[songCurrentLineIdx - 1];
            const lineStartMs = prevLine ? prevLine.words.slice(-1)[0].time : 0;
            const row = songLineRowEls[0];
            if (row) _updateLineReveal(row, line, nowMs, lineStartMs);
        }

        // Stop the loop once the track ends (or once it's paused/closed elsewhere)
        if (songAudioEl.ended) {
            close();
            return;
        }

        songRafId = requestAnimationFrame(_songSyncTick);
    }

    // Starts a song beat: plays the audio and kicks off the sync loop.
    // Falls back to a timer-driven close if autoplay is blocked, so the
    // beat doesn't hang forever waiting on a play() promise that never resolves.
    function startSong(song) {
        songImages = (song.images || []).slice().sort((a, b) => a.time - b.time);
        songLines = (song.lines || []).slice().sort((a, b) => {
            const at = a.words[0] ? a.words[0].time : 0;
            const bt = b.words[0] ? b.words[0].time : 0;
            return at - bt;
        });
        songImagePath = song.imagePath || INTRO_CINEMATIC_IMAGE_PATH;
        songCurrentImageIdx = -1;
        songCurrentLineIdx = -1;
        songLineRowEls = [];

        songImages.forEach(entry => _preloadImage(songImagePath + entry.image));

        renderSong(song);

        songAudioEl = new Audio(song.audio);
        songAudioEl.volume = 1.0;

        songAudioEl.addEventListener('ended', close);

        songAudioEl.play().then(() => {
            songRafId = requestAnimationFrame(_songSyncTick);
        }).catch(() => {
            // Autoplay blocked — resume on first user interaction, same
            // pattern as Audio_Manager's BGM autoplay-resume fallback.
            const resume = () => {
                songAudioEl.play().then(() => {
                    songRafId = requestAnimationFrame(_songSyncTick);
                }).catch(() => { });
                document.removeEventListener('click', resume);
                document.removeEventListener('keydown', resume);
            };
            document.addEventListener('click', resume, { once: true });
            document.addEventListener('keydown', resume, { once: true });
        });
    }

    function stopSong() {
        if (songRafId) {
            cancelAnimationFrame(songRafId);
            songRafId = null;
        }
        if (songAudioEl) {
            songAudioEl.removeEventListener('ended', close);
            songAudioEl.pause();
            songAudioEl.currentTime = 0;
            songAudioEl = null;
        }
    }

    function close() {
        if (!overlay) return;
        if (slideAdvanceTimeout) {
            clearTimeout(slideAdvanceTimeout);
            slideAdvanceTimeout = null;
        }
        stopSong();
        overlay.style.transition = 'opacity 0.7s ease';
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
            overlay = null;
            if (typeof onComplete === 'function') onComplete();
            if (typeof Audio_Manager !== 'undefined') {
                Audio_Manager.playBGM(Audio_Manager._lastBGMKey || 'title');
            }
        }, 720);
    }

    // -------------------------------------------------------------------
    // PUBLIC
    // -------------------------------------------------------------------

    function show(beatId, options = {}) {
        const isSong = isSongBeat(beatId, options);
        const isSlideshow = !isSong && isSlideshowBeat(beatId, options);

        let pages = null;
        let slideshow = null;
        let song = null;




        if (isSong) {
            song = buildSong(beatId, options);
            if (!song || !song.audio) return;
        } else if (isSlideshow) {
            slideshow = buildSlideshow(beatId, options);
            if (!slideshow || !slideshow.slides || slideshow.slides.length === 0) return;
        } else {
            pages = buildPages(beatId, options);
            if (!pages || pages.length === 0) return;
        }

        // Skip if already seen (unless forced)
        if (!options.force && hasSeen(beatId, options)) return;
        markSeen(beatId, options);

        onComplete = options.onComplete || null;

        overlay = createOverlay();
        document.body.appendChild(overlay);
        if (typeof Audio_Manager !== 'undefined') {
            Audio_Manager.stopBGM(300); // short fade so it doesn't cut harshly
        }

        if (isSong) {
            startSong(song);
            // Clicking/space does NOT skip a song beat — playback drives it.
            // Only the explicit skip button (rendered in renderSong) closes it early.
        } else if (isSlideshow) {
            currentSlides = slideshow.slides;
            currentSlideImagePath = slideshow.imagePath || INTRO_CINEMATIC_IMAGE_PATH;
            currentSlide = 0;
            renderSlideshow(currentSlides);

            // Click anywhere to advance / close
            overlay.addEventListener('click', () => advanceSlide(currentSlides));

            function onKeySlide(e) {
                if (e.code === 'Space' || e.code === 'Enter') {
                    e.preventDefault();
                    advanceSlide(currentSlides);
                }
            }
            document.addEventListener('keydown', onKeySlide);
        } else {
            currentPages = pages;
            currentPage = 0;
            renderPage(currentPages, currentPage);

            // Click anywhere to advance / close
            overlay.addEventListener('click', advance);

            // Keyboard: Space or Enter also advance
            function onKey(e) {
                if (e.code === 'Space' || e.code === 'Enter') {
                    e.preventDefault();
                    advance();
                }
            }
            document.addEventListener('keydown', onKey);
            // Remove listener when overlay closes
            // (listener is cleaned up when overlay is removed from DOM — acceptable for this use case)
        }
    }

    return { show };

})();


// ---------------------------------------------------------------------------
// SEEN-STATE — uses localStorage so beats only show once per save
// ---------------------------------------------------------------------------

function _seenKey(beatId, options = {}) {
    // For character beats, include character id in key
    const suffix = options.character
        ? `_${options.character}`
        : options.className
            ? `_${options.className}`
            : options.ascendencyClass
                ? `_${options.ascendencyClass}`
                : '';
    return `storyline_seen_${beatId}${suffix}`;
}

function hasSeen(beatId, options = {}) {
    try {
        return localStorage.getItem(_seenKey(beatId, options)) === '1';
    } catch (e) {
        return false;
    }
}

function markSeen(beatId, options = {}) {
    try {
        localStorage.setItem(_seenKey(beatId, options), '1');
    } catch (e) { /* storage unavailable */ }
}

// Allow resetting a specific beat (useful for testing)
function resetBeat(beatId, options = {}) {
    try {
        localStorage.removeItem(_seenKey(beatId, options));
    } catch (e) { /* noop */ }
}

// Reset all story beats at once (e.g. new game)
function resetAllBeats() {
    try {
        Object.keys(localStorage)
            .filter(k => k.startsWith('storyline_seen_'))
            .forEach(k => localStorage.removeItem(k));
    } catch (e) { /* noop */ }
}


// ---------------------------------------------------------------------------
// PUBLIC API
// ---------------------------------------------------------------------------

/**
 * showBeat(beatId, options)
 *
 * beatId      — key from STORY_BEATS (e.g. 'intro_cinematic', 'region_5')
 * options     — {
 *   character:       'stox' | 'trix' | 'syla'      (for character_intro)
 *   className:       'Mathmagician' | ...           (for class_unlock)
 *   ascendencyClass: 'Outlier' | ...                 (for ascendency_unlock)
 *   force:           true                           (show even if already seen)
 *   onComplete:      function                       (called after the beat closes)
 * }
 *
 * Beats are shown only once per save by default (localStorage flag).
 * Pass { force: true } to override — handy for replaying in a codex / gallery.
 */
function showBeat(beatId, options = {}) {
    StorylineRenderer.show(beatId, options);
}