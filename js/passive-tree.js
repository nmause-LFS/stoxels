

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





//------------------------------------------------------------------------
//--------------PASSIVE TREE PT MODULE------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// Special node IDs 
// The Start node is always considered reachable / pre-allocated.
// Set this to match the "id" of your Start node in Probability Tree Data.json
const PT_START_ID = 1;


//------------------------------------------------------------------------
//--------------PASSIVE TREE PT MODULE------------------------------------
//------------------------------------------------------------------------

const PT = (() => {

    let _data = null;   // raw parsed JSON from new format

    return {

        // Load tree data from the new Probability Tree Data JSON format.
        // Expects:  { nodes: [...], connections: [...] }
        // Each node: { id, x, y, nameEn, nameDe, descEn, descDe, icon, statKey }
        // Each conn: { id, from, to, dotted }
        loadInline(json) {
            _data = json;

            // Map nodes → internal skill objects
            _pt_skills = (json.nodes || []).map(n => ({
                id:    n.id,
                x:     n.x,
                y:     n.y,
                name:  n.nameEn,          // fallback display name
                image: n.icon || '',
                // keep the full node def so tooltip can read it
                _def:  n,
            }));

            _pt_conns = (json.connections || []).map(c => ({
                id:     c.id,
                from:   c.from,
                to:     c.to,
                dotted: !!c.dotted,
            }));

            _pt_skillMap = {};
            _pt_skills.forEach(s => { _pt_skillMap[s.id] = s; });
        },

        // Re-render the tree
        reload: _ptRender,

        // Returns true if the player has allocated the node with the given statKey
        hasSkill: ptHasSkill,

        get data() { return _data; },
    };
})();


//------------------------------------------------------------------------
//------------------BUILD PASSIVE TREE------------------------------------
//------------------------------------------------------------------------

async function buildPassiveTreeScreen() {
    const lang = (typeof LANG !== 'undefined') ? LANG : 'en';
    const points = (typeof STATE !== 'undefined' && STATE.passiveTreePoints) || 0;

    const pointsEl = document.getElementById('pt-points');
    if (pointsEl) {
        pointsEl.textContent = lang === 'de'
            ? `Verfügbare Punkte: ${points}`
            : `Available points: ${points}`;
    }

    const canvas = document.getElementById('pt-canvas');
    if (canvas) {
        canvas.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;
                height:100%;font-family:var(--PX,monospace);font-size:12px;
                color:var(--accent2,#aaa);letter-spacing:2px;opacity:0.6;">
                ${lang === 'de' ? 'LADE BAUM…' : 'LOADING TREE…'}
            </div>`;
    }

    if (!PT.data) {
        PT.loadInline(TALENT_TREE_DATA);   // ← new constant name (see below)
    }
    PT.reload();
}


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
//----------PASSIVE TREE SKILL EFFECTS — STATISTICIAN--------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// _ptGrantItem — adds one item to the player's inventory by defId.
function _ptGrantItem(defId) {
    const def = ITEM_DEFS[defId];
    if (!def) return;
    STATE.inventory.push({
        uid: `item_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        defId: defId
    });
    save();
    buildInventoryPanel();
}


//------------------------------------------------------------------------
// _ptApplyLevelCompleteRewards
// Handles gear nodes that grant bonus item drops on level completion.
//------------------------------------------------------------------------

function _ptApplyLevelCompleteRewards() {

    // Statistician 
    if (STATE.playerClass === 'statistician') {
        if (ptHasSkill('gear_of_the_statistician') && Math.random() < 0.33) {
            _ptGrantItem('reveal2');
            showToast(LANG === 'de'
                ? '🔍 Statistiker Bonus: Lupe erhalten!'
                : '🔍 Statistician Bonus: Magnifier received!');
        }
        if (ptHasSkill('improved_gear_of_the_statistician') && Math.random() < 0.33) {
            _ptGrantItem('markWrong8');
            showToast(LANG === 'de'
                ? '💎 Statistiker Bonus: Fehlerstein erhalten!'
                : '💎 Statistician Bonus: Error Gem received!');
        }
    }

    // Mathmagician 
    if (STATE.playerClass === 'mathmagician') {
        if (ptHasSkill('gear_of_the_mathmagician') && Math.random() < 0.25) {
            _ptGrantItem('mistakeEraser4');
            showToast(LANG === 'de'
                ? '📚 Mathematgier Bonus: Professor erhalten!'
                : '📚 Mathmagician Bonus: Professor received');
        }
        if (ptHasSkill('improved_gear_of_the_mathmagician') && Math.random() < 0.15) {
            _ptGrantItem('addTime900');
            showToast(LANG === 'de'
                ? '⚡ Mathemagier Bonus: Chronoblitz erhalten!'
                : '⚡ Mathmagician Bonus: Chronobolt received!');
        }
    }

    // Probabilist 
    if (STATE.playerClass === 'probabilist') {
        if (ptHasSkill('gear_of_the_probabilist') && Math.random() < 0.25) {
            _ptGrantItem('markWrong4');
            showToast(LANG === 'de'
                ? '🧹 Probabilist Bonus: Besen erhalten!'
                : '🧹 Probabilist Bonus: Sweeper received!');
        }
        if (ptHasSkill('improved_gear_of_the_probabilist') && Math.random() < 0.15) {
            _ptGrantItem('markWrong6');
            showToast(LANG === 'de'
                ? '🧲 Probabilist Bonus: Fehlermagnet erhalten!'
                : '🧲 Probabilist Bonus: Error Magnet received!');
        }
    }
}






//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------




