// passive-tracker.js
// Passive Tree Effect Tracker Panel
// Shows live countdowns, counters, and summaries of active passive-tree effects.
// Displayed bottom-left of the game screen during gameplay.

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// MODULE STATE
// ─────────────────────────────────────────────────────────────────────────────

const PassiveTracker = (() => {

    let _panel = null;
    let _tickInterval = null;
    let _visible = true;

    // Per-level runtime state tracked here (mirrors game state)
    const _state = {
        randomWalkTimer: 0,       // seconds until next random walk tick
        poissonTimer: 0,          // seconds until next poisson process tick
        timedStasisTimer: 0,      // seconds until next timed stasis tick
        lawOfLargeNumbersTimer: 0,// seconds until next auto-reveal
        binomialBurstFills: 0,    // correct fills since last binomial burst check
        streakBonusFills: 0,      // consecutive correct fills for streak_bonus
        sampleEffFills: 0,        // consecutive correct fills for sample_efficiency
        asymptoticReductions: 0,  // completed lines × 5s penalty reduction
        gamblersFills: 0,         // correct fills × 3s for gambler's ruin
        residualAnalysisLast: 0,  // last completed lines count
        bayesianBonus: 0,         // stacked bayesian bonus %
        poissonInterval: 120,     // dynamic: can be 120 / 90 / 60
        randomWalkInterval: 30,
        lolnInterval: 300,
        timedStasisInterval: 600,
    };

    // ─────────────────────────────────────────────────────────────────────────
    // HELPER: which rows are active
    // ─────────────────────────────────────────────────────────────────────────

    function _getActiveRows() {
        const rows = [];

        // ── COUNTDOWN BARS ────────────────────────────────────────────────────

        if (ptHasSkill('keystone_random_walk')) {
            rows.push({
                id: 'random_walk',
                icon: '🚶',
                label: 'Random Walk',
                type: 'countdown',
                current: _state.randomWalkTimer,
                max: _state.randomWalkInterval,
                tooltip: 'Every 30 seconds, 1 random unfilled cell is automatically filled or marked. <span class="tip-warn">⚠ Level fails on 2 mistakes!</span>',
                color: '#e8a020',
            });
        }

        if (ptHasSkill('poisson_process_1')) {
            const interval = ptHasSkill('poisson_process_3') ? 60
                : ptHasSkill('poisson_process_2') ? 90 : 120;
            rows.push({
                id: 'poisson',
                icon: '⚗️',
                label: 'Poisson Process',
                type: 'countdown',
                current: _state.poissonTimer,
                max: interval,
                tooltip: `Every <b>${interval}s</b> a random incorrect empty cell is automatically marked ✕.`,
                color: '#66fcf1',
            });
        }

        if (ptHasSkill('timed_stasis_1')) {
            let dur = 1;
            if (ptHasSkill('timed_stasis_2')) dur += 0.5;
            if (ptHasSkill('timed_stasis_3')) dur += 0.5;
            rows.push({
                id: 'timed_stasis',
                icon: '⏸️',
                label: 'Timed Stasis',
                type: 'countdown',
                current: _state.timedStasisTimer,
                max: 600,
                tooltip: `Every 10 minutes the level freezes for <b>${dur}s</b>.`,
                color: '#a0c8ff',
            });
        }

        if (ptHasSkill('keystone_law_of_large_numbers')) {
            rows.push({
                id: 'loln',
                icon: '📉',
                label: 'Law of Large Numbers',
                type: 'countdown',
                current: _state.lawOfLargeNumbersTimer,
                max: 300,
                tooltip: 'Every 5 minutes, auto-reveals 1 row and column with &lt;2 filled cells. <span class="tip-mute">Does not fire in last 15 min.</span>',
                color: '#c8a0ff',
            });
        }

        // ── FILL COUNTERS ─────────────────────────────────────────────────────

        if (ptHasSkill('binomial_burst_1')) {
            let chance = 20;
            if (ptHasSkill('binomial_burst_2')) chance += 10;
            if (ptHasSkill('binomial_burst_3')) chance += 20;
            rows.push({
                id: 'binomial',
                icon: '💢',
                label: 'Binomial Burst',
                type: 'fill_counter',
                current: _state.binomialBurstFills % 10,
                max: 10,
                tooltip: `Every 10 correct fills: <b>${chance}%</b> chance to auto-mark 1 wrong cell.`,
                color: '#ff9060',
            });
        }

        if (ptHasSkill('sample_efficiency_1')) {
            let threshold = 20;
            if (ptHasSkill('sample_efficiency_2')) threshold -= 2;
            if (ptHasSkill('sample_efficiency_3')) threshold -= 3;
            rows.push({
                id: 'sample_eff',
                icon: '📈',
                label: 'Sample Efficiency',
                type: 'fill_counter',
                current: _state.sampleEffFills,
                max: threshold,
                tooltip: `Every <b>${threshold}</b> consecutive correct fills without a mistake: reveal 1 random correct cell. Resets on mistake.`,
                color: '#6dbf40',
            });
        }

        if (ptHasSkill('streak_bonus_1')) {
            let bonus = 15;
            if (ptHasSkill('streak_bonus_2')) bonus += 5;
            if (ptHasSkill('streak_bonus_3')) bonus += 10;
            rows.push({
                id: 'streak',
                icon: '🔥',
                label: 'Focused Momentum',
                type: 'fill_counter',
                current: _state.streakBonusFills,
                max: 15,
                tooltip: `Every <b>15</b> consecutive correct fills without a mistake: gain <b>+${bonus}s</b>. Resets on mistake.`,
                color: '#ffb830',
            });
        }

        if (ptHasSkill('keystone_gamblers_ruin')) {
            const perFill = 3;
            rows.push({
                id: 'gamblers',
                icon: '🎰',
                label: "Gambler's Ruin",
                type: 'fill_counter',
                current: _state.gamblersFills,
                max: 20,
                noReset: true,
                tooltip: `Each correct fill: <b>+${perFill}s</b> to timer. Each mistake: <b>−60s extra</b>. All bonus time from other sources disabled.`,
                color: '#e8a020',
                showCount: true,
            });
        }

        // ── BAYESIAN BONUS ────────────────────────────────────────────────────

        if (ptHasSkill('bayesian_update_1') || ptHasSkill('bayesian_update_2') || ptHasSkill('bayesian_update_3')) {
            const bonus = _state.bayesianBonus;
            rows.push({
                id: 'bayesian',
                icon: '🔃',
                label: 'Bayesian Adjustment',
                type: 'stacked_bonus',
                current: bonus,
                max: 100,
                tooltip: 'Each mistake stacks +5% chance on the next auto-mark or auto-reveal. Resets to 0 after it triggers.',
                color: '#d4b870',
                unit: '%',
            });
        }

        // ── ASYMPTOTIC MASTERY ────────────────────────────────────────────────

        if (ptHasSkill('keystone_asymptotic_mastery')) {
            const lines = window._asymptoticLinesCompleted || 0;
            const reduction = lines * 5;
            rows.push({
                id: 'asymptotic',
                icon: '♾️',
                label: 'Asymptotic Mastery',
                type: 'stacked_bonus',
                current: lines,
                max: null,
                tooltip: `Completed lines: <b>${lines}</b>. Mistake time cost reduced by <b>${reduction}s</b> total. Shields disabled.`,
                color: '#ff6080',
                unit: ' lines',
            });
        }

        // ── PASSIVE SUMMARIES ─────────────────────────────────────────────────

        const summaries = _buildSummaries();
        rows.push(...summaries);

        return rows;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PASSIVE SUMMARIES
    // ─────────────────────────────────────────────────────────────────────────

    function _buildSummaries() {
        const s = [];

        // Momentum
        const hasMomentum = ptHasSkill('chain_reaction') || ptHasSkill('precise_momentum')
            || ptHasSkill('exponential_growth') || ptHasSkill('god_of_statistics');
        if (hasMomentum) {
            let bonusParts = [];
            if (ptHasSkill('chain_reaction')) bonusParts.push('+1s/trigger');
            if (ptHasSkill('precise_momentum')) bonusParts.push('+2s/trigger');
            if (ptHasSkill('exponential_growth')) bonusParts.push('+1s stack');
            if (ptHasSkill('god_of_statistics')) bonusParts.push('×2 bonus');
            const penalty = ptHasSkill('learning_from_mistakes') && ptHasSkill('mistakes_no_matter') ? '−10'
                : (ptHasSkill('learning_from_mistakes') || ptHasSkill('mistakes_no_matter')) ? '−12' : 'reset';
            s.push({
                id: 'momentum',
                icon: '⚡',
                label: 'Momentum',
                type: 'summary',
                tooltip: `Momentum bonuses: <b>${bonusParts.join(', ')}</b>. Mistake penalty: streak <b>${penalty}</b>.`,
                color: '#6dbf40',
            });
        }

        // Shield boosts
        if (ptHasSkill('reinforced_shield') || ptHasSkill('fortified_shield') || ptHasSkill('frozen_resilience')) {
            let extra = (ptHasSkill('reinforced_shield') ? 1 : 0) + (ptHasSkill('fortified_shield') ? 1 : 0);
            const parts = [];
            if (extra > 0) parts.push(`Shield absorbs +${extra} extra mistakes`);
            if (ptHasSkill('frozen_resilience')) parts.push('5 fills during Absolute Zero → +1 shield charge');
            s.push({
                id: 'shield_boost',
                icon: '🛡️',
                label: 'Shield Boost',
                type: 'summary',
                tooltip: parts.join('<br>'),
                color: '#a0c8ff',
            });
        }

        // Bayesian Insight auto-marks
        if (ptHasSkill('prior_knowledge') || ptHasSkill('updated_beliefs') || ptHasSkill('posterior_insight') || ptHasSkill('convergent_evidence') || ptHasSkill('god_of_probabilities')) {
            let marks = (ptHasSkill('prior_knowledge') ? 1 : 0)
                + (ptHasSkill('updated_beliefs') ? 1 : 0)
                + (ptHasSkill('posterior_insight') ? 1 : 0)
                + (ptHasSkill('convergent_evidence') ? 1 : 0);
            let reveals = ptHasSkill('confirmed_hypothesis') ? 1 : 0;
            if (ptHasSkill('god_of_probabilities')) reveals++;
            s.push({
                id: 'bayesian_insight',
                icon: '🧪',
                label: 'Bayesian Insight',
                type: 'summary',
                tooltip: `Start of level: auto-marks <b>${marks}</b> random wrong cells${reveals > 0 ? ` + reveals <b>${reveals}</b> correct cell(s)` : ''}.`,
                color: '#66fcf1',
            });
        }

        // Keystone: Veil of Purity
        if (ptHasSkill('keystone_veil_of_purity')) {
            s.push({
                id: 'veil_purity',
                icon: '✨',
                label: 'Veil of Purity',
                type: 'summary',
                tooltip: 'First cursed item each level: <b>no downside</b>. Further cursed items: <b>double downside</b>.',
                color: '#d4b870',
            });
        }

        // Keystone: Blinding Truth
        if (ptHasSkill('keystone_blinding_truth')) {
            s.push({
                id: 'blinding_truth',
                icon: '💡',
                label: 'Blinding Truth',
                type: 'summary',
                tooltip: 'Reveal items <b>50% more effective</b>. Mark-wrong items <b>cannot be used</b>.',
                color: '#ffb830',
            });
        }

        // Keystone: Apex Collector
        if (ptHasSkill('keystone_apex_collector')) {
            s.push({
                id: 'apex_collector',
                icon: '🌟',
                label: 'Apex Collector',
                type: 'summary',
                tooltip: 'Codex of Completion can drop (3%). Items <b>below Epic cannot be obtained</b> as rewards.',
                color: '#d4b870',
            });
        }

        // Keystone: Iron Doctrine
        if (ptHasSkill('keystone_iron_doctrine')) {
            s.push({
                id: 'iron_doctrine',
                icon: '⚔️',
                label: 'Iron Doctrine',
                type: 'summary',
                tooltip: 'Shields disabled. Each mistake <b>−60s extra</b>. Tutor and Timer items: <b>+300% effectiveness</b>.',
                color: '#ff6080',
                warn: true,
            });
        }

        // Keystone: Curse Embrace
        if (ptHasSkill('keystone_curse_embrace')) {
            s.push({
                id: 'curse_embrace',
                icon: '👁️',
                label: 'Curse Embrace',
                type: 'summary',
                tooltip: 'Immune to cursed item downsides. Non-cursed items <b>50% weaker</b>.',
                color: '#c080ff',
            });
        }

        // Keystone: Countdown Crisis
        if (ptHasSkill('keystone_countdown_crisis')) {
            s.push({
                id: 'countdown_crisis',
                icon: '⚡',
                label: 'Countdown Crisis',
                type: 'summary',
                tooltip: 'Timer items <b>reduce</b> the timer. Reveal items are <b>5× stronger</b> while timer &lt;3 min.',
                color: '#ff9060',
                warn: true,
            });
        }

        // Keystone: Stochastic Resonance
        if (ptHasSkill('keystone_stochastic_resonance')) {
            s.push({
                id: 'stochastic_res',
                icon: '〰️',
                label: 'Stochastic Resonance',
                type: 'summary',
                tooltip: 'Each mistake: <b>20% chance</b> to reveal 1 correct cell instead of counting as mistake. Cannot trigger twice in a row.',
                color: '#66fcf1',
            });
        }

        // Keystone: Null Hypothesis
        if (ptHasSkill('keystone_null_hypothesis')) {
            s.push({
                id: 'null_hyp',
                icon: '🔬',
                label: 'Null Hypothesis',
                type: 'summary',
                tooltip: 'Level start: all wrong cells in the sparsest row and column are auto-marked. <b>No mistake shields</b> of any kind.',
                color: '#ff9060',
                warn: true,
            });
        }

        // Keystone: Variance Collapse
        if (ptHasSkill('keystone_variance_collapse')) {
            s.push({
                id: 'variance_collapse',
                icon: '💥',
                label: 'Variance Collapse',
                type: 'summary',
                tooltip: 'Lucky Tiles appear on ALL grid sizes. Revealing one <b>−10 minutes</b> from timer.',
                color: '#e8a020',
                warn: true,
            });
        }

        // Keystone: Overfitting
        if (ptHasSkill('keystone_overfitting')) {
            s.push({
                id: 'overfitting',
                icon: '📉',
                label: 'Overfitting',
                type: 'summary',
                tooltip: 'First 50% of fills: free (no mistake penalty). After 50%: mistakes cost <b>triple time</b>.',
                color: '#ffb830',
            });
        }

        // Keystone: The Oracle
        if (ptHasSkill('keystone_the_oracle')) {
            s.push({
                id: 'oracle',
                icon: '👁️',
                label: 'The Oracle',
                type: 'summary',
                tooltip: 'Solution shown for 5s at start, then hidden. All clues hidden. Auto-reveals disabled (class abilities only). <b>Large/Massive grids only.</b>',
                color: '#c080ff',
                warn: true,
            });
        }

        // Keystone: Maximum Likelihood
        if (ptHasSkill('keystone_maximum_likelihood')) {
            s.push({
                id: 'max_likelihood',
                icon: '🏔️',
                label: 'Maximum Likelihood',
                type: 'summary',
                tooltip: 'Level start: densest row and column auto-solved. <b>−15 minutes</b> from timer.',
                color: '#ff6080',
                warn: true,
            });
        }

        // Keystone: Signal to Noise
        if (ptHasSkill('keystone_signal_to_noise')) {
            s.push({
                id: 'signal_noise',
                icon: '📡',
                label: 'Signal to Noise',
                type: 'summary',
                tooltip: '15% of clues randomized at start. Completing 75% of grid reveals true values. Class cooldowns −15s.',
                color: '#a0c8ff',
            });
        }

        // Keystone: Dead Reckoning
        if (ptHasSkill('keystone_dead_reckoning')) {
            s.push({
                id: 'dead_reckoning',
                icon: '🧭',
                label: 'Dead Reckoning',
                type: 'summary',
                tooltip: 'Clues shown as row/col sums instead of exact runs. <b>25% completion</b> reveals exact clues. +10 min to timer.',
                color: '#d4b870',
            });
        }

        // Keystone: Frequentist's Burden
        if (ptHasSkill('keystone_frequentists_burden')) {
            s.push({
                id: 'freq_burden',
                icon: '📜',
                label: "Frequentist's Burden",
                type: 'summary',
                tooltip: 'All clues hidden. Every <b>5 correct fills</b> reveals 1 random clue. Class cooldowns −15s.',
                color: '#c080ff',
            });
        }

        // Keystone: Sparse Prior
        if (ptHasSkill('keystone_sparse_prior')) {
            s.push({
                id: 'sparse_prior',
                icon: '🫥',
                label: 'Sparse Prior',
                type: 'summary',
                tooltip: 'All clues hidden at start. Completing a row/column reveals adjacent clues.',
                color: '#a0c8ff',
            });
        }

        // Keystone: Ergodic Field
        if (ptHasSkill('keystone_ergodic_field')) {
            s.push({
                id: 'ergodic',
                icon: '🌊',
                label: 'Ergodic Field',
                type: 'summary',
                tooltip: 'All auto-reveals, marks, and field scans disabled. Every 3 min: full solution flashes for <b>1 second</b>.',
                color: '#66fcf1',
                warn: true,
            });
        }

        // Keystone: Degrees of Freedom
        if (ptHasSkill('keystone_degrees_of_freedom')) {
            s.push({
                id: 'dof',
                icon: '🎛️',
                label: 'Degrees of Freedom',
                type: 'summary',
                tooltip: 'Either all row or all column clues are hidden. They flash visible every 30s for 5s. Class cooldowns −30s.',
                color: '#d4b870',
            });
        }

        // Keystone: Adjacency Matrix
        if (ptHasSkill('adjacency_matrix')) {
            s.push({
                id: 'adj_matrix',
                icon: '🔢',
                label: 'Adjacency Matrix',
                type: 'summary',
                tooltip: 'Row/column clues hidden. Each empty cell shows count of its 8 neighbours that are solution cells.',
                color: '#66fcf1',
            });
        }

        // Confidence Interval
        if (ptHasSkill('confidence_interval_1')) {
            let secs = 1;
            if (ptHasSkill('confidence_interval_2')) secs++;
            if (ptHasSkill('confidence_interval_3')) secs++;
            s.push({
                id: 'conf_interval',
                icon: '📐',
                label: 'Confidence Interval',
                type: 'summary',
                tooltip: `After a mistake: next mistake within <b>${secs}s</b> is ignored. Cannot trigger back-to-back.`,
                color: '#a0c8ff',
            });
        }

        // Pattern Momentum (regression_reward)
        if (ptHasSkill('regression_reward_1')) {
            let time = 5;
            if (ptHasSkill('regression_reward_2')) time += 5;
            if (ptHasSkill('regression_reward_3')) time += 5;
            s.push({
                id: 'pattern_momentum',
                icon: '📉',
                label: 'Pattern Momentum',
                type: 'summary',
                tooltip: `Completing a full row or column: <b>+${time}s</b>.`,
                color: '#6dbf40',
            });
        }

        // Residual Analysis
        if (ptHasSkill('residual_analysis_1')) {
            let chance = 25;
            if (ptHasSkill('residual_analysis_2')) chance += 5;
            if (ptHasSkill('residual_analysis_3')) chance += 10;
            s.push({
                id: 'residual',
                icon: '🔄',
                label: 'Residual Analysis',
                type: 'summary',
                tooltip: `Completing a row/column: <b>${chance}%</b> chance to auto-mark 1 wrong cell in an adjacent line.`,
                color: '#66fcf1',
            });
        }

        return s;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DOM BUILDING
    // ─────────────────────────────────────────────────────────────────────────

    function _build() {
        // Remove existing panel
        const existing = document.getElementById('pt-tracker-panel');
        if (existing) existing.remove();

        const rows = _getActiveRows();
        if (rows.length === 0) return;

        _panel = document.createElement('div');
        _panel.id = 'pt-tracker-panel';
        _panel.className = 'pt-tracker-panel';



        // Header
        const header = document.createElement('div');
        header.className = 'pt-tracker-header';
        header.innerHTML = `
            <span class="pt-tracker-title">🌿 PASSIVES</span>
            <button class="pt-tracker-collapse" title="Toggle panel">−</button>
        `;
        _panel.appendChild(header);

        // Collapse button
        header.querySelector('.pt-tracker-collapse').addEventListener('click', () => {
            _visible = !_visible;
            const body = _panel.querySelector('.pt-tracker-body');
            body.style.display = _visible ? '' : 'none';
            header.querySelector('.pt-tracker-collapse').textContent = _visible ? '−' : '+';
            _panel.classList.toggle('pt-tracker-collapsed', !_visible);
        });

        // Body
        const body = document.createElement('div');
        body.className = 'pt-tracker-body';
        _panel.appendChild(body);

        // Restore saved position or use default
        const savedPos = _loadPos();
        if (savedPos) {
            _panel.style.left = savedPos.x + 'px';
            _panel.style.top = savedPos.y + 'px';
            _panel.style.bottom = 'auto';
        } else {
            // Default: bottom-left but higher up
            const defaultY = window.innerHeight - 400;
            _panel.style.left = '20px';
            _panel.style.top = Math.max(20, defaultY) + 'px';
            _panel.style.bottom = 'auto';
        }

        _makeDraggable(_panel);


        // Tooltip singleton
        let _tip = document.getElementById('pt-tracker-tooltip');
        if (!_tip) {
            _tip = document.createElement('div');
            _tip.id = 'pt-tracker-tooltip';
            _tip.className = 'pt-tracker-tooltip';
            document.body.appendChild(_tip);
        }

        rows.forEach(row => {
            const el = _buildRow(row);
            body.appendChild(el);
        });

        // Place panel in game screen
        const gameMain = document.querySelector('.game-main');
        if (gameMain) {
            gameMain.appendChild(_panel);
        } else {
            document.body.appendChild(_panel);
        }

        _bindTooltips();
    }

    function _buildRow(row) {
        const el = document.createElement('div');
        el.className = 'pt-tracker-row';
        el.dataset.id = row.id;
        if (row.warn) el.classList.add('pt-tracker-row--warn');

        const iconEl = document.createElement('span');
        iconEl.className = 'pt-tracker-icon';
        iconEl.textContent = row.icon;

        const labelEl = document.createElement('span');
        labelEl.className = 'pt-tracker-label';
        labelEl.textContent = row.label;

        el.appendChild(iconEl);
        el.appendChild(labelEl);

        if (row.type === 'countdown') {
            const barWrap = document.createElement('div');
            barWrap.className = 'pt-tracker-bar-wrap';
            const bar = document.createElement('div');
            bar.className = 'pt-tracker-bar';
            bar.style.setProperty('--bar-color', row.color || '#6dbf40');
            const fill = document.createElement('div');
            fill.className = 'pt-tracker-bar-fill';
            const pct = row.max > 0 ? ((row.max - row.current) / row.max) * 100 : 100;
            fill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
            bar.appendChild(fill);
            const timerLabel = document.createElement('span');
            timerLabel.className = 'pt-tracker-bar-label';
            timerLabel.textContent = _fmtSecs(row.current);
            barWrap.appendChild(bar);
            barWrap.appendChild(timerLabel);
            el.appendChild(barWrap);

        } else if (row.type === 'fill_counter') {
            const barWrap = document.createElement('div');
            barWrap.className = 'pt-tracker-bar-wrap';
            const bar = document.createElement('div');
            bar.className = 'pt-tracker-bar pt-tracker-bar--fills';
            bar.style.setProperty('--bar-color', row.color || '#6dbf40');
            const fill = document.createElement('div');
            fill.className = 'pt-tracker-bar-fill';
            const pct = row.max > 0 ? (row.current / row.max) * 100 : 0;
            fill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
            bar.appendChild(fill);
            const countLabel = document.createElement('span');
            countLabel.className = 'pt-tracker-bar-label';
            countLabel.textContent = row.showCount
                ? `${row.current}`
                : `${row.current}/${row.max}`;
            barWrap.appendChild(bar);
            barWrap.appendChild(countLabel);
            el.appendChild(barWrap);

        } else if (row.type === 'stacked_bonus') {
            const valEl = document.createElement('span');
            valEl.className = 'pt-tracker-value';
            valEl.style.color = row.color || '#d4b870';
            valEl.textContent = `${row.current}${row.unit || ''}`;
            el.appendChild(valEl);

        } else if (row.type === 'summary') {
            const dotEl = document.createElement('span');
            dotEl.className = 'pt-tracker-dot';
            dotEl.style.background = row.color || '#6dbf40';
            el.insertBefore(dotEl, iconEl);
        }

        return el;
    }

    function _bindTooltips() {
        if (!_panel) return;
        const tip = document.getElementById('pt-tracker-tooltip');
        if (!tip) return;

        _panel.addEventListener('mouseenter', e => {
            const row = e.target.closest('.pt-tracker-row');
            if (!row) return;
            const id = row.dataset.id;
            const rows = _getActiveRows();
            const def = rows.find(r => r.id === id);
            if (!def) return;
            tip.innerHTML = `<div class="pt-tip-title">${def.icon} ${def.label}</div><div class="pt-tip-body">${def.tooltip}</div>`;
            tip.classList.add('visible');
            _positionTip(tip, row);
        }, true);

        _panel.addEventListener('mousemove', e => {
            const row = e.target.closest('.pt-tracker-row');
            if (row && tip.classList.contains('visible')) _positionTip(tip, row);
        }, true);

        _panel.addEventListener('mouseleave', () => {
            tip.classList.remove('visible');
        }, true);
    }

    function _positionTip(tip, anchor) {
        const ar = anchor.getBoundingClientRect();
        tip.style.left = '0px';
        tip.style.top = '0px';
        const tw = tip.offsetWidth || 260;
        const th = tip.offsetHeight || 80;
        let left = ar.right + 10;
        let top = ar.top + ar.height / 2 - th / 2;
        if (left + tw > window.innerWidth - 8) left = ar.left - tw - 10;
        if (top < 6) top = 6;
        if (top + th > window.innerHeight - 6) top = window.innerHeight - th - 6;
        tip.style.left = `${left}px`;
        tip.style.top = `${top}px`;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UPDATE (called every second from timer tick)
    // ─────────────────────────────────────────────────────────────────────────

    function _update() {
        if (!_panel) return;
        const rows = _getActiveRows();
        rows.forEach(row => {
            const el = _panel.querySelector(`.pt-tracker-row[data-id="${row.id}"]`);
            if (!el) return;

            if (row.type === 'countdown') {
                const fill = el.querySelector('.pt-tracker-bar-fill');
                const label = el.querySelector('.pt-tracker-bar-label');
                const pct = row.max > 0 ? ((row.max - row.current) / row.max) * 100 : 100;
                if (fill) fill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
                if (label) label.textContent = _fmtSecs(row.current);

            } else if (row.type === 'fill_counter') {
                const fill = el.querySelector('.pt-tracker-bar-fill');
                const label = el.querySelector('.pt-tracker-bar-label');
                const pct = row.max > 0 ? (row.current / row.max) * 100 : 0;
                if (fill) fill.style.width = `${Math.max(0, Math.min(100, pct))}%`;
                if (label) {
                    label.textContent = row.showCount
                        ? `${row.current}`
                        : `${row.current}/${row.max}`;
                }

            } else if (row.type === 'stacked_bonus') {
                const valEl = el.querySelector('.pt-tracker-value');
                if (valEl) valEl.textContent = `${row.current}${row.unit || ''}`;
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // TIMER TICK HOOK (call from timer.js every second)
    // ─────────────────────────────────────────────────────────────────────────

    function onTimerTick() {
        // Decrement countdown timers
        if (ptHasSkill('keystone_random_walk')) {
            _state.randomWalkTimer = Math.max(0, _state.randomWalkTimer - 1);
            if (_state.randomWalkTimer === 0) {
                _state.randomWalkTimer = _state.randomWalkInterval;
                _flashRow('random_walk');
            }
        }

        if (ptHasSkill('poisson_process_1')) {
            const interval = ptHasSkill('poisson_process_3') ? 60
                : ptHasSkill('poisson_process_2') ? 90 : 120;
            _state.poissonTimer = Math.max(0, _state.poissonTimer - 1);
            if (_state.poissonTimer === 0) {
                _state.poissonTimer = interval;
                _flashRow('poisson');
            }
        }

        if (ptHasSkill('timed_stasis_1')) {
            _state.timedStasisTimer = Math.max(0, _state.timedStasisTimer - 1);
            if (_state.timedStasisTimer === 0) {
                _state.timedStasisTimer = 600;
                _flashRow('timed_stasis');
            }
        }

        if (ptHasSkill('keystone_law_of_large_numbers')) {
            _state.lawOfLargeNumbersTimer = Math.max(0, _state.lawOfLargeNumbersTimer - 1);
            if (_state.lawOfLargeNumbersTimer === 0) {
                _state.lawOfLargeNumbersTimer = 300;
                _flashRow('loln');
            }
        }

        // Sync Bayesian bonus from game state
        if (typeof _getBayesianBonus === 'function') {
            _state.bayesianBonus = Math.round(_getBayesianBonus() * 100);
        }

        // Sync asymptotic lines
        _state.asymptoticReductions = window._asymptoticLinesCompleted || 0;

        _update();
    }

    function _flashRow(id) {
        if (!_panel) return;
        const el = _panel.querySelector(`.pt-tracker-row[data-id="${id}"]`);
        if (!el) return;
        el.classList.remove('pt-tracker-row--flash');
        void el.offsetWidth; // force reflow
        el.classList.add('pt-tracker-row--flash');
        setTimeout(() => el.classList.remove('pt-tracker-row--flash'), 1000);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GAME EVENT HOOKS (call these from game code)
    // ─────────────────────────────────────────────────────────────────────────

    function onCorrectFill() {
        _state.binomialBurstFills++;
        _state.streakBonusFills++;
        _state.sampleEffFills++;
        _state.gamblersFills++;
        _update();
    }

    function onMistake() {
        _state.streakBonusFills = 0;
        _state.sampleEffFills = 0;
        // Bayesian auto-syncs from getBayesianBonus
        _update();
    }

    function onStreakReset() {
        _state.streakBonusFills = 0;
        _state.sampleEffFills = 0;
        _update();
    }

    function onBinomialTrigger() {
        _state.binomialBurstFills = 0;
        _flashRow('binomial');
        _update();
    }

    function onStreakBonusTrigger() {
        _state.streakBonusFills = 0;
        _flashRow('streak');
        _update();
    }

    function onSampleEffTrigger() {
        _state.sampleEffFills = 0;
        _flashRow('sample_eff');
        _update();
    }

    function onBayesianTrigger() {
        _state.bayesianBonus = 0;
        _flashRow('bayesian');
        _update();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PUBLIC INIT (call at level start)
    // ─────────────────────────────────────────────────────────────────────────

    function init() {
        // Reset state
        const poissonInterval = ptHasSkill('poisson_process_3') ? 60
            : ptHasSkill('poisson_process_2') ? 90 : 120;

        _state.randomWalkTimer = 30;
        _state.poissonTimer = poissonInterval;
        _state.timedStasisTimer = 600;
        _state.lawOfLargeNumbersTimer = 300;
        _state.binomialBurstFills = 0;
        _state.streakBonusFills = 0;
        _state.sampleEffFills = 0;
        _state.gamblersFills = 0;
        _state.bayesianBonus = 0;
        _state.asymptoticReductions = 0;
        _state.poissonInterval = poissonInterval;
        _visible = true;

        _build();
    }

    function destroy() {
        const existing = document.getElementById('pt-tracker-panel');
        if (existing) existing.remove();
        _panel = null;
        const tip = document.getElementById('pt-tracker-tooltip');
        if (tip) tip.remove();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UTIL
    // ─────────────────────────────────────────────────────────────────────────

    function _fmtSecs(s) {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return m > 0
            ? `${m}:${String(sec).padStart(2, '0')}`
            : `${sec}s`;
    }

    function _makeDraggable(el) {
        let dragging = false;
        let ox = 0, oy = 0; // offset from mouse to panel top-left

        const header = el.querySelector('.pt-tracker-header');
        header.style.cursor = 'grab';

        header.addEventListener('mousedown', e => {
            if (e.target.closest('.pt-tracker-collapse')) return; // don't drag on button
            dragging = true;
            const rect = el.getBoundingClientRect();
            ox = e.clientX - rect.left;
            oy = e.clientY - rect.top;
            header.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', e => {
            if (!dragging) return;
            const W = window.innerWidth;
            const H = window.innerHeight;
            const pw = el.offsetWidth;
            const ph = el.offsetHeight;
            let nx = e.clientX - ox;
            let ny = e.clientY - oy;
            // Clamp to screen
            nx = Math.max(0, Math.min(nx, W - pw));
            ny = Math.max(0, Math.min(ny, H - ph));
            el.style.left = nx + 'px';
            el.style.top = ny + 'px';
            el.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (!dragging) return;
            dragging = false;
            header.style.cursor = 'grab';
            // Save position
            _savePos(parseFloat(el.style.left), parseFloat(el.style.top));
        });
    }

    function _savePos(x, y) {
        try { localStorage.setItem('pt_tracker_pos', JSON.stringify({ x, y })); } catch (_) { }
    }

    function _loadPos() {
        try {
            const raw = localStorage.getItem('pt_tracker_pos');
            if (!raw) return null;
            const p = JSON.parse(raw);
            // Clamp to current viewport in case window was resized
            const W = window.innerWidth;
            const H = window.innerHeight;
            return {
                x: Math.max(0, Math.min(p.x, W - 240)),
                y: Math.max(0, Math.min(p.y, H - 80)),
            };
        } catch (_) { return null; }
    }




    return { init, destroy, onTimerTick, onCorrectFill, onMistake, onStreakReset, onBinomialTrigger, onStreakBonusTrigger, onSampleEffTrigger, onBayesianTrigger };
})();