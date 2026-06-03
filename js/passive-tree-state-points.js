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
        ? `Verfügbare Konvergenzpunkte: ${p}`
        : `Available Convergence Points: ${p}`;
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
            if (typeof trackAchStat === 'function') {
                trackAchStat('treeNodesDeallocated');
            }
        }
        return;
    }

    if (!_ptIsUnlockable(id)) return;
    if (_ptPoints() < 1) return;

    alloc.add(id);
    _ptSpendPoint();
    save();
    _ptRefreshAllStyles();

    if (typeof trackAchStat === 'function') {
        const skill = _pt_skillMap[id];
        const def = skill ? skill._def : null;
        const statKey = def ? def.statKey : '';

        // Cumulative allocation counts
        trackAchStat('treeNodesAllocated');
        trackAchStat('treePointsSpent');

        // Keystone nodes (statKey starts with 'keystone_')
        if (statKey.startsWith('keystone_')) {
            trackAchStat('treeKeystonesAllocated');
        }

        // Individual God nodes
        if (statKey === 'god_of_statistics') trackAchStat('treeGodStatisticsAllocated');
        if (statKey === 'god_of_math') trackAchStat('treeGodMathAllocated');
        if (statKey === 'god_of_probabilities') trackAchStat('treeGodProbabilitiesAllocated');

        // All three God nodes allocated (set-style: use setAchStat with live count)
        if (typeof setAchStat === 'function') {
            const godsOwned = [
                'god_of_statistics',
                'god_of_math',
                'god_of_probabilities',
            ].filter(k => ptHasSkill(k)).length;
            setAchStat('treeAllGodsAllocated', godsOwned);
        }

        // Keystone duo: count how many keystones are currently active
        if (typeof setAchStat === 'function') {
            const keystoneCount = [...alloc].filter(nid => {
                const s = _pt_skillMap[nid];
                const d = s ? s._def : null;
                return d && d.statKey && d.statKey.startsWith('keystone_');
            }).length;
            if (keystoneCount >= 2) {
                trackAchStat('treeKeystoneDuoActive');
            }
        }

        // Full class branch detection
        // Statistician branch: all node IDs whose statKeys belong to that branch
        const STATISTICIAN_BRANCH = new Set([
            'gear_of_the_statistician', 'improved_gear_of_the_statistician',
            'chain_reaction', 'precise_momentum', 'exponential_growth',
            'learning_from_mistakes', 'mistakes_no_matter',
            'monte_carlo', 'correlation_matrix', 'advanced_data_strike',
            'swift_strike', 'accelerated_computation',
            'random_diagonal', 'diagonal_witch', 'diagonally_wrong',
            'quick_strike', 'accelerated_striking',
            'god_of_statistics',
        ]);
        const MATHMAGICIAN_BRANCH = new Set([
            'gear_of_the_mathmagician', 'improved_gear_of_the_mathmagician',
            'arcane_echo', 'resonant_reveal', 'arcane_exposure',
            'rapid_revelation', 'accelerated_revelation',
            'reinforced_shield', 'fortified_shield',
            'calculated_error', 'error_dividend', 'lucky_lapse',
            'prolonged_frost', 'deep_freeze', 'frozen_resilience',
            'hastened_zero', 'accelerated_zero',
            'god_of_math',
        ]);
        const PROBABILIST_BRANCH = new Set([
            'gear_of_the_probabilist', 'improved_gear_of_the_probabilist',
            'probabilistic_sweep', 'expanded_inference', 'momentum_of_certainty',
            'swift_marking', 'accelerated_marking',
            'prior_knowledge', 'updated_beliefs', 'confirmed_hypothesis',
            'posterior_insight', 'convergent_evidence',
            'wider_lens', 'panoramic_view', 'photographic_memory',
            'swift_scan', 'accelerated_scan',
            'god_of_probabilities',
        ]);

        const allocatedKeys = new Set([...alloc].map(nid => {
            const s = _pt_skillMap[nid];
            return s && s._def ? s._def.statKey : null;
        }).filter(Boolean));

        if (typeof setAchStat === 'function') {
            if ([...STATISTICIAN_BRANCH].every(k => allocatedKeys.has(k))) {
                setAchStat('treeStatisticianBranchComplete', 1);
            }
            if ([...MATHMAGICIAN_BRANCH].every(k => allocatedKeys.has(k))) {
                setAchStat('treeMathmagicianBranchComplete', 1);
            }
            if ([...PROBABILIST_BRANCH].every(k => allocatedKeys.has(k))) {
                setAchStat('treeProbabilistBranchComplete', 1);
            }
        }

        // Lucky tile build: grid_awareness + all lucky tile sub-nodes
        const LUCKY_BUILD_KEYS = [
            'grid_awareness',
            'fortunes_tile_1', 'fortunes_tile_2', 'fortunes_tile_3',
            'generous_fortune_1', 'generous_fortune_2', 'generous_fortune_3',
            'outlier_detection_1', 'outlier_detection_2',
            'covariance_shift_1', 'covariance_shift_2', 'covariance_shift_3',
        ];
        if (LUCKY_BUILD_KEYS.every(k => allocatedKeys.has(k))) {
            trackAchStat('treeLuckyBuildActive');
        }

        // ── Single-cluster completions ───────────────────────────────────

        const _clusterCheck = (keys, stat) => {
            if (keys.every(k => allocatedKeys.has(k))) {
                if (typeof setAchStat === 'function') setAchStat(stat, 1);
            }
        };

        _clusterCheck(
            ['tutor_enable', 'careful_study', 'stochastics_tutor', 'efficient_tutoring',
                'statistics_tutor', 'endless_instructions', 'maths_tutor', 'professor_tutor'],
            'treeTutorBranchComplete'
        );

        _clusterCheck(
            ['expanding_front', 'widened_formation', 'extended_horizon', 'total_coverage',
                'vertical_insight', 'rising_structure', 'elevated_scope', 'total_survey', 'primed_scout'],
            'treePrimerBranchComplete'
        );

        _clusterCheck(
            ['extended_session_1', 'extended_session_2', 'extended_session_3'],
            'treeTimeExtensionComplete'
        );

        _clusterCheck(
            ['timed_stasis_1', 'timed_stasis_2', 'timed_stasis_3'],
            'treeTimedStasisComplete'
        );

        _clusterCheck(
            ['regression_reward_1', 'regression_reward_2', 'regression_reward_3'],
            'treePatternMomentumComplete'
        );

        _clusterCheck(
            ['bayesian_update_1', 'bayesian_update_2', 'bayesian_update_3'],
            'treeBayesianUpdateComplete'
        );

        _clusterCheck(
            ['confidence_interval_1', 'confidence_interval_2', 'confidence_interval_3'],
            'treeConfidenceIntervalComplete'
        );

        _clusterCheck(
            ['sample_efficiency_1', 'sample_efficiency_2', 'sample_efficiency_3'],
            'treeSampleEfficiencyComplete'
        );

        _clusterCheck(
            ['streak_bonus_1', 'streak_bonus_2', 'streak_bonus_3'],
            'treeStreakBonusComplete'
        );

        _clusterCheck(
            ['emergency_scan_1', 'emergency_scan_2', 'emergency_scan_3'],
            'treeEmergencyScanComplete'
        );

        _clusterCheck(
            ['blackout_ward_1', 'blackout_ward_2', 'blackout_ward_3'],
            'treeBlackoutWardComplete'
        );

        _clusterCheck(
            ['removal_ward_1', 'removal_ward_2', 'removal_ward_3'],
            'treeRemovalWardComplete'
        );

        _clusterCheck(
            ['interquartile_vision_1', 'interquartile_vision_2', 'interquartile_vision_3'],
            'treeInterquartileComplete'
        );

        _clusterCheck(
            ['stronger_light_1', 'stronger_light_2', 'stronger_light_3',
                'seeker_of_light_1', 'seeker_of_light_2', 'seeker_of_light_3',
                'targeted_reveal_1', 'targeted_reveal_2', 'targeted_reveal_3'],
            'treeRevealItemsComplete'
        );

        _clusterCheck(
            ['reinforced_ward_1', 'reinforced_ward_2', 'reinforced_ward_3',
                'wardens_stockpile_1', 'wardens_stockpile_2', 'wardens_stockpile_3'],
            'treeShieldItemsComplete'
        );

        _clusterCheck(
            ['stronger_marks_1', 'stronger_marks_2', 'stronger_marks_3',
                'error_collector_1', 'error_collector_2', 'error_collector_3',
                'dense_marker_1', 'dense_marker_2', 'dense_marker_3'],
            'treeMarkItemsComplete'
        );

        _clusterCheck(
            ['poisson_process_1', 'poisson_process_2', 'poisson_process_3'],
            'treePoissonComplete'
        );

        _clusterCheck(
            ['expected_value_1', 'expected_value_2', 'expected_value_3'],
            'treeExpectedValueComplete'
        );

        _clusterCheck(
            ['marginal_distribution_1', 'marginal_distribution_2', 'marginal_distribution_3'],
            'treeMarginalDistComplete'
        );

        // ── Outer rim: count how many x > 3400 nodes are allocated ───────
        const OUTER_RIM_KEYS = new Set([
            'timed_stasis_1', 'timed_stasis_2', 'timed_stasis_3',
            'interquartile_vision_1', 'interquartile_vision_2', 'interquartile_vision_3',
            'bayesian_update_2',
            'keystone_frequentists_burden', 'keystone_ergodic_field',
            'keystone_sparse_prior',
            'confidence_interval_1', 'confidence_interval_2', 'confidence_interval_3',
            'adjacency_matrix',
        ]);
        const outerRimCount = [...OUTER_RIM_KEYS].filter(k => allocatedKeys.has(k)).length;
        if (typeof setAchStat === 'function') setAchStat('treeOuterRimNodes', outerRimCount);
    }
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
    // Treeless modifier: treat all nodes as unallocated
    if (typeof isTreeless === 'function' && isTreeless()) return false;

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