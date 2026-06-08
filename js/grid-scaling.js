//------------------------------------------------------------------------
//----------------------------CONSTANTS-----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Fraction of the viewport WIDTH the puzzle should occupy.
// 0.90 means the puzzle can use up to 90% of the window width.
// Lower = narrower / smaller puzzle.
const SCALE_FILL_W = 0.90;

// Hard upper ceiling on the auto-scale factor.
// Prevents tiny 5x5 puzzles from becoming enormous on large monitors.
const SCALE_MAX = 2.4;

// How many scale units change per Ctrl+Wheel scroll tick.
const ZOOM_SPEED = 0.15;

// Minimum and maximum zoom values allowed during manual Ctrl+Wheel zoom.
const ZOOM_MANUAL_MIN = 0.3;
const ZOOM_MANUAL_MAX = 5.0;

// How many pixels the puzzle or inventory scrolls per arrow key press.
const ARROW_SCROLL_STEP = 40;

// Small breathing room multiplier so the puzzle never touches the very
// bottom edge of the available vertical space.
const SCALE_BREATHING_ROOM = 0.97;


//------------------------------------------------------------------------
//----------------------------STATE VARIABLES-----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// The zoom level currently applied to the puzzle scaler element.
let currentZoom = 1;

// The zoom level that was last calculated by the auto-fit scaler.
// Used as a reference point when scaling secondary elements (e.g. HUD)
// relative to the default fit, so they only change on manual zoom.
let baselineZoom = 1;

// True when the player has manually zoomed via Ctrl+Wheel.
// Prevents scalePuzzle() from overriding the player's chosen zoom level
// on resize events or grid rebuilds.
let manualZoomActive = false;

// Tracks which UI zone the mouse is currently hovering over.
// Used by the arrow-key scroll router to decide which element to scroll.
// Possible values: 'puzzle' | 'inventory' | 'none'
let mouseZone = 'none';

// Reference to the puzzle wrapper element used by the freeze-pane scroll sync.
// Stored here so it doesn't need to be re-queried on every scroll event.
let _freezePaneScrollWrap = null;


//------------------------------------------------------------------------
//----------------------------ZOOM HELPERS--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Resets the puzzle scaler element's transform to scale(1) and temporarily
// clears the wrapper's forced dimensions so the browser can report the
// scaler's true natural (unscaled) pixel size via offsetWidth/Height.
//
// Why clear the wrapper? applyZoom() sets wrap.style.height and minWidth to
// the post-scale pixel values. If those are left in place while we measure,
// the browser constrains the scaler's reported size to fit inside those stale
// dimensions — which means each resize event measures a progressively smaller
// "natural" size and calculates a progressively smaller scale. This was the
// cause of the F12 devtools-open/close shrink bug.
//
// The wrapper dimensions are restored immediately by the applyZoom() call
// that always follows this function in scalePuzzle().
function measureNaturalSize(scaler) {
    const wrap = document.getElementById('puzzle-scaler-wrap');
    if (wrap) {
        wrap.style.height = '';
        wrap.style.minWidth = '';
    }

    // Temporarily remove the scaler from flex flow so its offsetWidth
    // reflects true content width, not the flex container's available space.
    const prevPosition = scaler.style.position;
    const prevLeft = scaler.style.left;
    scaler.style.position = 'absolute';
    scaler.style.left = '-99999px';
    scaler.style.transform = 'scale(1)';

    const result = {
        w: scaler.offsetWidth,
        h: scaler.offsetHeight
    };

    scaler.style.position = prevPosition;
    scaler.style.left = prevLeft;

    return result;
}

// Calculates how much space is available for the puzzle in the viewport.
// Subtracts the actual pixel heights of the top bar and inventory strip
// so the puzzle always fits the real remaining space, regardless of
// inventory content or window size.
// Returns the available width and height as an object.
function calcAvailableSpace() {
    const metaBar = document.querySelector('.game-meta');
    const invStrip = document.querySelector('.inv-strip');
    const usedH = (metaBar ? metaBar.offsetHeight : 0)
        + (invStrip ? invStrip.offsetHeight : 0);

    return {
        w: window.innerWidth * SCALE_FILL_W,
        h: (window.innerHeight - usedH) * SCALE_BREATHING_ROOM
    };
}

// Writes currentZoom to the scaler's CSS transform and resizes the wrapper
// div so the browser's scrollbars appear correctly when zoomed in.
//
// Why resize the wrapper? CSS transform does NOT affect layout flow — the
// element keeps its original footprint in the document even after scaling.
// By explicitly setting the wrapper's height and minWidth to the post-scale
// dimensions, we force the page to scroll properly when the player has
// zoomed in beyond the viewport bounds.
function applyZoom() {
    const scaler = document.getElementById('puzzle-scaler');
    const wrap = document.getElementById('puzzle-scaler-wrap');
    if (!scaler || !wrap) return;

    scaler.style.transform = `scale(${currentZoom})`;

    wrap.style.height = (scaler.offsetHeight * currentZoom) + 'px';
    wrap.style.minWidth = (scaler.offsetWidth * currentZoom) + 'px';

    // Reposition the shield border (if active) after every zoom change,
    // since it uses position:fixed and getBoundingClientRect screen coords.
    const border = document.getElementById('fx-shield-border');
    if (border?._reposition) border._reposition();
}


//------------------------------------------------------------------------
//----------------------------PUZZLE SCALER-------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Clears all zoom state and removes leftover wrapper dimensions from the
// previous level so scalePuzzle() can measure the new grid's natural size
// correctly on the next call.
// Call this whenever a new puzzle level is loaded.
function resetZoom() {
    manualZoomActive = false;
    currentZoom = 1;
    baselineZoom = 1;

    const wrap = document.getElementById('puzzle-scaler-wrap');
    if (wrap) {
        wrap.style.height = '';
        wrap.style.minWidth = '';
    }
}

// Calculates and applies the best-fit scale for the current puzzle grid
// relative to the viewport.
//   1. Measures the element's natural (unscaled) pixel dimensions.
//   2. Calculates the maximum scale that fits within SCALE_FILL_W of the
//      viewport width and the remaining height, capped at SCALE_MAX.
//   3. Only updates currentZoom if the player hasn't manually zoomed —
//      this preserves the player's chosen zoom across resize events.
//   4. Calls applyZoom() to write the transform and fix wrapper dimensions.
//
// Called by: buildGrid() after DOM paint, the resize listener in main.js,
// and implicitly when Ctrl+Wheel resets zoom via applyZoom() directly.
function scalePuzzle() {
    const scaler = document.getElementById('puzzle-scaler');
    if (!scaler) return;

    const natural = measureNaturalSize(scaler);
    const avail = calcAvailableSpace();
    const autoScale = Math.min(avail.w / natural.w, avail.h / natural.h, SCALE_MAX);

    // Only override zoom if the player hasn't manually set one.
    if (!manualZoomActive) {
        currentZoom = autoScale;
        baselineZoom = autoScale;
    }

    applyZoom();
}


//------------------------------------------------------------------------
//----------------------------MOUSE WHEEL ZOOM----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Handles Ctrl+Wheel events over the puzzle wrapper.
// Adjusts currentZoom by ZOOM_SPEED per scroll tick, clamps it to the
// allowed range, and marks manualZoomActive so scalePuzzle() stops
// overriding the player's chosen zoom level.
function onCtrlWheelZoom(e) {
    if (!e.ctrlKey) return;

    const wrap = e.target.closest('#puzzle-scaler-wrap');
    if (!wrap) return;

    e.preventDefault(); // Block the browser's own Ctrl+Wheel page-zoom.

    manualZoomActive = true;

    if (e.deltaY < 0) {
        currentZoom += ZOOM_SPEED; // Scroll up = zoom in.
    } else {
        currentZoom -= ZOOM_SPEED; // Scroll down = zoom out.
    }

    currentZoom = Math.max(ZOOM_MANUAL_MIN, Math.min(currentZoom, ZOOM_MANUAL_MAX));
    applyZoom();
}

// passive:false is required here to allow e.preventDefault() inside the handler.
document.addEventListener('wheel', onCtrlWheelZoom, { passive: false });


//------------------------------------------------------------------------
//----------------------------FREEZE-PANE SCROLL SYNC--------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Because position:sticky does not work inside CSS-transformed elements,
// we manually translate the row-clue cells (td.rct) on horizontal scroll
// to simulate freeze-pane behaviour.

// Returns all row-clue cells that need to be kept in place on scroll.
function getFreezePaneCells() {
    return document.querySelectorAll('td.rct');
}

// Translates all freeze-pane cells by the current horizontal scroll offset
// so they appear pinned to the left edge regardless of scroll position.
function onFreezePaneScroll() {
    const scrollX = _freezePaneScrollWrap.scrollLeft;
    getFreezePaneCells().forEach(td => {
        td.style.transform = `translateX(${scrollX}px)`;
    });
}

// Attaches the scroll listener to the puzzle wrapper.
// Safe to call multiple times — removes any existing listener first to
// avoid duplicate handlers after grid rebuilds.
function attachFreezePaneScrollListener() {
    _freezePaneScrollWrap = document.getElementById('puzzle-scaler-wrap');
    if (!_freezePaneScrollWrap) return;

    _freezePaneScrollWrap.removeEventListener('scroll', onFreezePaneScroll);
    _freezePaneScrollWrap.addEventListener('scroll', onFreezePaneScroll, { passive: true });
}

// Initialises the freeze-pane scroll sync.
// Uses a MutationObserver to re-attach the scroll listener every time the
// grid is rebuilt, since a new grid replaces the DOM nodes.
function initFreezePaneSync() {
    const observer = new MutationObserver(() => {
        attachFreezePaneScrollListener();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Also attach immediately for the initial page load.
    attachFreezePaneScrollListener();
}


//------------------------------------------------------------------------
//----------------------------ARROW KEY SCROLL ROUTING-------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Routes left/right arrow keys to either the puzzle or the inventory
// scroll container, depending on which zone the mouse is currently in.
// This way the player can scroll either panel without clicking into it first.

// Updates mouseZone based on which element the cursor is hovering over.
function onMouseMoveUpdateZone(e) {
    const puzzleWrap = document.getElementById('puzzle-scaler-wrap');
    const invList = document.getElementById('inv-list');

    if (puzzleWrap && puzzleWrap.matches(':hover')) {
        mouseZone = 'puzzle';
    } else if (invList && invList.matches(':hover')) {
        mouseZone = 'inventory';
    } else {
        mouseZone = 'none';
    }
}

// Scrolls the active zone left or right when an arrow key is pressed.
function onArrowKeyScroll(e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const puzzleWrap = document.getElementById('puzzle-scaler-wrap');
    const invList = document.getElementById('inv-list');

    if (mouseZone === 'puzzle' && puzzleWrap) {
        e.preventDefault();
        puzzleWrap.scrollLeft += dir * ARROW_SCROLL_STEP;
    } else if (mouseZone === 'inventory' && invList) {
        e.preventDefault();
        invList.scrollLeft += dir * ARROW_SCROLL_STEP;
    }
}

// Registers the mouse-move zone tracker and the arrow-key scroll handler.
function initArrowKeyScrollRouting() {
    document.addEventListener('mousemove', onMouseMoveUpdateZone, { passive: true });
    document.addEventListener('keydown', onArrowKeyScroll);
}


//------------------------------------------------------------------------
//----------------------------INIT----------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

initFreezePaneSync();
initArrowKeyScrollRouting();