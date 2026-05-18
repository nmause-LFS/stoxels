
// SCALE_FILL_W — fraction of the viewport WIDTH the puzzle should occupy.
//   0.90 means the puzzle can use up to 90 % of the window width.
//   Lower = narrower / smaller puzzle.
const SCALE_FILL_W = 0.90;


// SCALE_MAX — hard upper ceiling on the auto-scale factor.
//   Prevents tiny 5×5 puzzles from becoming enormous on large monitors.
const SCALE_MAX = 2.4;


let currentZoom = 1;           
let baselineZoom = 1;
let manualZoomActive = false;










//------------------------------------------------------------------------
//-------------------------PUZZLE SCALER----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// scalePuzzle — calculates and applies the best-fit scale for the current
//   puzzle grid relative to the viewport.
//   Steps:
//   1. Temporarily resets the transform to scale(1) so we can measure the
//      element's natural (unscaled) pixel dimensions.
//   2. Calculates the maximum scale that fits within SCALE_FILL_W/H of the
//      viewport, capped at SCALE_MAX.
//   3. Only updates currentZoom if the player hasn't manually zoomed —
//      this preserves manual zoom across e.g. window resize events.
//   4. Calls applyZoom() to write the transform and fix wrapper dimensions.
//   Called by: buildGrid() (after DOM paint), the resize listener (main.js),
//   and the Ctrl+Wheel handler resets zoom via applyZoom() directly.




function scalePuzzle() {
    const scaler = document.getElementById('puzzle-scaler');
    if (!scaler) return;

    // Measure natural size with no transform applied
    scaler.style.transform = 'scale(1)';
    const naturalW = scaler.offsetWidth;
    const naturalH = scaler.offsetHeight;

    // Subtract the actual heights of the top bar and inventory strip
    // so the puzzle always fits the real remaining space, regardless of
    // inventory content or window size.
    const metaBar = document.querySelector('.game-meta');
    const invStrip = document.querySelector('.inv-strip');
    const usedH = (metaBar ? metaBar.offsetHeight : 0)
        + (invStrip ? invStrip.offsetHeight : 0);

    const availW = window.innerWidth * SCALE_FILL_W;
    const availH = (window.innerHeight - usedH) * 0.97; // 0.97 = small breathing room

    const autoScale = Math.min(availW / naturalW, availH / naturalH, SCALE_MAX);

    if (!manualZoomActive) {
        currentZoom = autoScale;
        baselineZoom = autoScale;
    }

    applyZoom();
}








//------------------------------------------------------------------------
//---------------------------ZOOM APPLICATION-----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// applyZoom — writes currentZoom to the CSS transform and resizes the
//   wrapper div so the browser's scrollbars appear correctly when zoomed in.
//   Why resize the wrapper?  CSS transform does NOT affect layout flow —
//   the element keeps its original footprint in the document even after
//   scaling. By explicitly setting the wrapper's height and minWidth to
//   the post-scale dimensions, we force the page to scroll properly when
//   the player has zoomed in beyond the viewport bounds.
//   The class HUD panel (#class-hud-panel) is also scaled in sync so it
//   doesn't appear mismatched when the player uses Ctrl+Wheel zoom.
//   The HUD scale is relative to the baseline (auto-fit) zoom so it always
//   starts at its natural CSS size and only changes on manual zoom.
function applyZoom() {
    const scaler = document.getElementById('puzzle-scaler');
    const wrap = document.getElementById('puzzle-scaler-wrap');
    if (!scaler || !wrap) return;

    scaler.style.transform = `scale(${currentZoom})`;

    // Make the wrapper occupy the actual rendered footprint of the scaled content
    wrap.style.height = (scaler.offsetHeight * currentZoom) + 'px';
    wrap.style.minWidth = (scaler.offsetWidth * currentZoom) + 'px';

    // Scale the class HUD relative to the baseline auto-fit zoom.
    // hudScale = 1.0 at default zoom, <1 when zoomed out, >1 when zoomed in.
    const hud = document.getElementById('class-hud-panel');
    if (hud) {
        const hudScale = baselineZoom > 0 ? currentZoom / baselineZoom : 1;
        hud.style.transformOrigin = 'top left';
        hud.style.transform = `scale(${hudScale})`;
    }
}






//------------------------------------------------------------------------
//--------------------MOUSE WHEEL ZOOM------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


document.addEventListener('wheel', (e) => {
    // Only intercept if Ctrl/Cmd is held
    if (!e.ctrlKey) return;

    // Only intercept if the cursor is inside the puzzle wrapper
    const wrap = e.target.closest('#puzzle-scaler-wrap');
    if (!wrap) return;

    e.preventDefault(); // block the browser's own Ctrl+Wheel page-zoom

    manualZoomActive = true; // flag so scalePuzzle() stops overriding zoom

    const zoomSpeed = 0.15; // scale units changed per scroll tick
    if (e.deltaY < 0) {
        currentZoom += zoomSpeed; // scroll up = zoom in
    } else {
        currentZoom -= zoomSpeed; // scroll down = zoom out
    }

    // Clamp: 0.3 prevents flipping to negative scale; 5.0 is a sensible max
    currentZoom = Math.max(0.3, Math.min(currentZoom, 5.0));
    applyZoom();
}, { passive: false }); // passive:false is required to allow e.preventDefault()



//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------







