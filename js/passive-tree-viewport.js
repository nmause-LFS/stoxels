
// Viewport state
let _pt_scale = 1.0;
let _pt_tx = 0;
let _pt_ty = 0;

// Drag state 
let _pt_dragging = false;
let _pt_dragStartX = 0;
let _pt_dragStartY = 0;
let _pt_dragTxStart = 0;
let _pt_dragTyStart = 0;
let _pt_mouseDownTime = 0;   // shared with renderer to distinguish click vs drag



//------------------------------------------------------------------------
//--------------------------TRANSFORM-------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


function _ptApplyTransform() {
    if (_pt_world) {
        _pt_world.style.transform =
            `translate(${_pt_tx}px, ${_pt_ty}px) scale(${_pt_scale})`;
    }
}


//------------------------------------------------------------------------
//---------------------------FIT TO VIEW----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Scales and centres the tree inside the container on first load
// @param {object} bounds  – { minX, minY, maxX, maxY } from _ptGetBounds()

function _ptFitToView(bounds) {
    const treeW = bounds.maxX - bounds.minX + PT_PADDING * 2 + PT_NODE_RADIUS * 2;
    const treeH = bounds.maxY - bounds.minY + PT_PADDING * 2 + PT_NODE_RADIUS * 2;
    const cW = _pt_container.clientWidth || 800;
    const cH = _pt_container.clientHeight || 600;

    const sx = cW / treeW;
    const sy = cH / treeH;
    _pt_scale = Math.max(Math.min(sx, sy, 1.0), PT_ZOOM_MIN);

    const offsetY = PT_PADDING + PT_NODE_RADIUS - bounds.minY;
    const scaledW = treeW * _pt_scale;
    const scaledH = treeH * _pt_scale;

    _pt_tx = (cW - scaledW) / 2;
    _pt_ty = (cH - scaledH) / 2;

    // Horizontal offset carried over from original code
    _pt_tx += 500;
    _pt_ty += offsetY * _pt_scale;

    _ptApplyTransform();
}

//------------------------------------------------------------------------
//-----------------------------EVENT BINDING------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------





function _ptBindEvents() {

    //  Wheel -> zoom 
    _pt_container.addEventListener('wheel', e => {
        e.preventDefault();
        const dir = e.deltaY < 0 ? 1 : -1;
        const factor = 1 + dir * PT_ZOOM_STEP;
        const newScale = Math.min(PT_ZOOM_MAX, Math.max(PT_ZOOM_MIN, _pt_scale * factor));
        const rect = _pt_container.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const ratio = newScale / _pt_scale;
        _pt_tx = mx - ratio * (mx - _pt_tx);
        _pt_ty = my - ratio * (my - _pt_ty);
        _pt_scale = newScale;
        _ptApplyTransform();
    }, { passive: false });

    //  Mouse drag -> pan 
    _pt_container.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        if (e.target.closest('.pt-node')) return;
        _pt_dragging = true;
        _pt_dragStartX = e.clientX;
        _pt_dragStartY = e.clientY;
        _pt_dragTxStart = _pt_tx;
        _pt_dragTyStart = _pt_ty;
        _pt_container.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', e => {
        if (!_pt_dragging) return;
        _pt_tx = _pt_dragTxStart + (e.clientX - _pt_dragStartX);
        _pt_ty = _pt_dragTyStart + (e.clientY - _pt_dragStartY);
        _ptApplyTransform();
    });

    window.addEventListener('mouseup', () => {
        if (_pt_dragging) {
            _pt_dragging = false;
            _pt_container.style.cursor = 'grab';
        }
    });

    // Touch drag + pinch-zoom 
    let lastDist = null;

    _pt_container.addEventListener('touchstart', e => {
        if (e.touches.length === 1) {
            _pt_dragging = true;
            _pt_dragStartX = e.touches[0].clientX;
            _pt_dragStartY = e.touches[0].clientY;
            _pt_dragTxStart = _pt_tx;
            _pt_dragTyStart = _pt_ty;
        }
        if (e.touches.length === 2) {
            _pt_dragging = false;
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            lastDist = Math.hypot(dx, dy);
        }
    }, { passive: true });

    _pt_container.addEventListener('touchmove', e => {
        e.preventDefault();
        if (e.touches.length === 1 && _pt_dragging) {
            _pt_tx = _pt_dragTxStart + (e.touches[0].clientX - _pt_dragStartX);
            _pt_ty = _pt_dragTyStart + (e.touches[0].clientY - _pt_dragStartY);
            _ptApplyTransform();
        }
        if (e.touches.length === 2 && lastDist !== null) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.hypot(dx, dy);
            const factor = dist / lastDist;
            _pt_scale = Math.min(PT_ZOOM_MAX, Math.max(PT_ZOOM_MIN, _pt_scale * factor));
            lastDist = dist;
            _ptApplyTransform();
        }
    }, { passive: false });

    _pt_container.addEventListener('touchend', () => {
        _pt_dragging = false;
        lastDist = null;
    });

    // Click on empty canvas -> hide tooltip 
    _pt_container.addEventListener('click', () => _ptHideTooltip());
}

//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------




