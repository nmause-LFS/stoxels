

//  Handles all allocation / deallocation logic, point accounting, and the
//  adjacency graph that the connectivity checks rely on.



// Internal shared references (set by PT.loadInline) 
// These are populated by the main PT module so all sub-files share the same
// arrays without passing them around on every call.
let _pt_skills = [];   // layout skill objects
let _pt_conns = [];   // connection objects
let _pt_skillMap = {};   // id → layout skill object
let _pt_adjacency = {};   // id → Set of adjacent ids


// Language helper 
function _ptLang() {
    return (typeof LANG !== 'undefined' && LANG === 'de') ? 'de' : 'en';
}




//------------------------------------------------------------------------
//-------------------------STATE accessors--------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// Returns the live Set of allocated node IDs, auto-creating it if absent
function _ptAllocated() {
    if (typeof STATE === 'undefined') return new Set();
    if (!(STATE.passiveTreeAllocated instanceof Set)) {
        STATE.passiveTreeAllocated = new Set();
    }
    return STATE.passiveTreeAllocated;
}

// Current number of spendable points
function _ptPoints() {
    return (typeof STATE !== 'undefined' && STATE.passiveTreePoints) || 0;
}

// Spend one point and refresh the on-screen counter
function _ptSpendPoint() {
    if (typeof STATE !== 'undefined') {
        STATE.passiveTreePoints = Math.max(0, _ptPoints() - 1);
    }
    _ptRefreshPointsDisplay();
}

// Refund one point and refresh the on-screen counter
function _ptRefundPoint() {
    if (typeof STATE !== 'undefined') {
        STATE.passiveTreePoints = _ptPoints() + 1;
    }
    _ptRefreshPointsDisplay();
}

// Update the #pt-points label with the current point count 
function _ptRefreshPointsDisplay() {
    const el = document.getElementById('pt-points');
    if (!el) return;
    const p = _ptPoints();
    el.textContent = _ptLang() === 'de'
        ? `Verfügbare Punkte: ${p}`
        : `Available points: ${p}`;
}





//------------------------------------------------------------------------
//------------------------ADJACENCY GRAPH---------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------




// Rebuilds _pt_adjacency from _pt_conns.
// Must be called after loadInline() and before any unlock checks
 
function _ptBuildAdjacency() {
    _pt_adjacency = {};
    _pt_skills.forEach(s => { _pt_adjacency[s.id] = new Set(); });
    _pt_conns.forEach(c => {
        if (_pt_adjacency[c.from]) _pt_adjacency[c.from].add(c.to);
        if (_pt_adjacency[c.to]) _pt_adjacency[c.to].add(c.from);
    });
}






//------------------------------------------------------------------------
//------------------UNLOCK / DE-ALLOCATE RULES----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



/*
A node is UNLOCKABLE when:
  – it is not already allocated
  – at least one adjacent node IS allocated, OR it is the Start node
 */
function _ptIsUnlockable(id) {
    const alloc = _ptAllocated();
    if (alloc.has(id)) return false;
    if (id === PT_START_ID) return true;
    const neighbours = _pt_adjacency[id] || new Set();
    for (const nid of neighbours) {
        if (alloc.has(nid)) return true;
    }
    return false;
}

/*
 A node can be DE-ALLOCATED when:
  – it IS currently allocated
  – removing it would NOT strand any other allocated node (BFS from Start)
 */
function _ptIsDeallocatable(id) {
    const alloc = _ptAllocated();
    if (!alloc.has(id)) return false;

    if (id === PT_START_ID) return false;       // do not allow removing the start node

    // Simulate removal, then verify every remaining allocated node is still
    // reachable from Start through the remaining allocated set.
    const testSet = new Set(alloc);
    testSet.delete(id);

    function reachable(from, available) {
        const visited = new Set();
        const queue = [from];
        while (queue.length) {
            const cur = queue.pop();
            if (visited.has(cur)) continue;
            visited.add(cur);
            const adj = _pt_adjacency[cur] || new Set();
            for (const n of adj) {
                if (available.has(n) && !visited.has(n)) queue.push(n);
            }
        }
        return visited;
    }

    if (!testSet.has(PT_START_ID)) return true; // Start wasn't kept anyway
    const reachableSet = reachable(PT_START_ID, testSet);
    for (const aid of testSet) {
        if (!reachableSet.has(aid)) return false; // someone got stranded
    }
    return true;
}






//------------------------------------------------------------------------
//----------CLICK HANDLERS FOR ALLOCATION AND DEALLOCATION----------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


/*
 Called when the player clicks a node.
 Allocates or de-allocates the node, then triggers a full style refresh.
 */
function _ptOnNodeClick(id) {
    const alloc = _ptAllocated();

    if (alloc.has(id)) {
        if (_ptIsDeallocatable(id)) {
            alloc.delete(id);
            _ptRefundPoint();
            save();                  
            _ptRefreshAllStyles();
        }
        return;
    }

    if (!_ptIsUnlockable(id)) return;
    if (_ptPoints() < 1) return;

    alloc.add(id);
    _ptSpendPoint();
    save();                          
    _ptRefreshAllStyles();
}





//------------------------------------------------------------------------
//-----------------VISUAL STATE QUERY-------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// used by passive-tree-ui.js

/*
 Returns 'allocated' | 'unlockable' | 'locked' for a given node ID.
 Renderer uses this to decide which colour set to apply.
 */
function _ptGetNodeVisualState(id) {
    const alloc = _ptAllocated();
    if (alloc.has(id)) return 'allocated';
    if (_ptIsUnlockable(id)) return 'unlockable';
    return 'locked';
}







//------------------------------------------------------------------------
//-----------PUBLIC QUERY TO CHECK IF PLAYER HAS ALLOCATED A NODE---------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


/*
 Returns true if the player has a skill with the given statKey allocated.
 Example:  if (ptHasSkill('tutor_enable')) { ... }
 */
function ptHasSkill(statKey) {
    // Ensure tree data is loaded even if the player never opened the PT screen
    if (!_pt_skills.length && typeof TALENT_TREE_DATA !== 'undefined') {
        PT.loadInline(TALENT_TREE_DATA);
    }
    const alloc = _ptAllocated();
    for (const id of alloc) {
        const skill = _pt_skillMap[id];
        const def = skill ? skill._def : null;
        if (def && def.statKey === statKey) return true;
    }
    return false;
}











