

// All visual constants and colour palette used across the passive tree


// Layout 
const PT_NODE_RADIUS = 22;
const PT_PADDING = 80;
const PT_CONN_WIDTH = 2;

// Zoom
const PT_ZOOM_MIN = 0.25;
const PT_ZOOM_MAX = 3.0;
const PT_ZOOM_STEP = 0.12;

// Node colours — locked / unlocked / allocated / start 
const PT_COL_LOCKED_BG = '#111120';
const PT_COL_LOCKED_BORDER = '#3a3350';
const PT_COL_LOCKED_DOT = '#3a3350';
const PT_COL_UNLOCKED_BG = '#1a1a2e';
const PT_COL_UNLOCKED_BORDER = '#b89a50';
const PT_COL_UNLOCKED_DOT = '#b89a50';
const PT_COL_ALLOCATED_BG = '#1e2a10';
const PT_COL_ALLOCATED_BORDER = '#6dbf40';
const PT_COL_ALLOCATED_DOT = '#6dbf40';
const PT_COL_START = '#ffd700';

// Connection colours
const PT_CONN_LOCKED = 'rgba(80,70,110,0.3)';
const PT_CONN_UNLOCKED = 'rgba(160,130,80,0.45)';
const PT_CONN_ALLOCATED = 'rgba(109,191,64,0.7)';

// Special node IDs 
// The Start node is always considered reachable / pre-allocated.
const PT_START_ID = 11;




//------------------------------------------------------------------------
//--------------PASSIVE TREE PT MODULE------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// PT module (public facade) 
const PT = (() => {

    let _data = null;

    return {

        // Load tree data from the inline TALENT_TREE_DATA object
        loadInline(json) {
            _data = json.FullData;
            // Populate the shared arrays used by passive-tree-state-points.js and passive-tree-ui.js
            _pt_skills = _data.skills || [];
            _pt_conns = _data.connections || [];
            _pt_skillMap = {};
            _pt_skills.forEach(s => { _pt_skillMap[s.id] = s; });
        },

        // Re-render the tree (call after loadInline, or to refresh after state changes)
        reload: _ptRender,

        /**
         * Returns true if the player has a skill with the given statKey allocated.
         * Delegates to the function in passive-tree-state-points.js.
         *
         * Example:
         *   if (PT.hasSkill('tutor_enable')) { ... }
         */
        hasSkill: ptHasSkill,

        get data() { return _data; },
    };
})();





//------------------------------------------------------------------------
//------------------BUILD PASSIVE TREE------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Entry point called by UI

async function buildPassiveTreeScreen() {
    const lang = (typeof LANG !== 'undefined') ? LANG : 'en';
    const points = (typeof STATE !== 'undefined' && STATE.passiveTreePoints) || 0;

    // Update points counter immediately (before render, so it's never blank)
    const pointsEl = document.getElementById('pt-points');
    if (pointsEl) {
        pointsEl.textContent = lang === 'de'
            ? `Verfügbare Punkte: ${points}`
            : `Available points: ${points}`;
    }

    // Brief loading state while the tree builds
    const canvas = document.getElementById('pt-canvas');
    if (canvas) {
        canvas.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;
                height:100%;font-family:var(--PX,monospace);font-size:12px;
                color:var(--accent2,#aaa);letter-spacing:2px;opacity:0.6;">
                ${lang === 'de' ? 'LADE BAUM…' : 'LOADING TREE…'}
            </div>`;
    }

    // Load data only once per session
    if (!PT.data) {
        PT.loadInline(TALENT_TREE_DATA);
    }
    PT.reload();
}






//------------------------------------------------------------------------
//-----------------SHOW PASSIVE TREE SCREEN NAVIGATION--------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// showPassiveTree — opens the Passive Tree screen.
// Rebuilds the display so newly earned points are always reflected.

function showPassiveTree() {
    buildPassiveTreeScreen();
    screenHistory.push('screen-levels');
    ss('screen-passive-tree');
}







//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------









//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------




