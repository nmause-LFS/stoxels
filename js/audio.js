// ============================================================
//  audio.js  —  Sound effects and background music manager
// ============================================================

const Audio_Manager = (() => {

    // ── Config ───────────────────────────────────────────────

    let BGM_VOLUME = 0.4;  
    let SFX_VOLUME = 0.7;   

    let bgmEnabled = true;
    let sfxEnabled = true;
    let currentBGM = null;   // currently playing HTMLAudioElement
    let currentBGMSrc = '';  // path of the currently playing track

    let _lastBGMKey = '';

    let _pendingResumeCleanup = null;

    const _sfxInstances = {};

    // ── BGM Registry ─────────────────────────────────────────
    // Map track names to file paths.
    // Put your mp3 files in an /audio/ folder next to index.html.

    const BGM_TRACKS = {
        title: 'audio/bgm_title.mp3',
        level_1_1: 'audio/bgm_1.mp3',
        level_1_2: 'audio/bgm_1.mp3',
        level_1_3: 'audio/bgm_1.mp3',
        level_1_4: 'audio/bgm_2.mp3',
        level_1_5: 'audio/bgm_title.mp3',
        level_1_6: 'audio/bgm_2.mp3',
        level_1_7: 'audio/bgm_2.mp3',
        level_1_8: 'audio/bgm_4.mp3',
        level_1_9: 'audio/bgm_title.mp3',
        level_1_10: 'audio/bgm_4.mp3',
        level_1_11: 'audio/bgm_4.mp3',
        level_1_12: 'audio/bgm_5.mp3',
        level_1_13: 'audio/bgm_title.mp3',
        level_2_1: 'audio/bgm_6.mp3',
        level_2_2: 'audio/bgm_6.mp3', 
        level_2_3: 'audio/bgm_6.mp3',
        level_2_4: 'audio/bgm_title.mp3',
        level_2_5: 'audio/bgm_7.mp3',
        level_2_6: 'audio/bgm_7.mp3',
        level_2_7: 'audio/bgm_title.mp3',
        level_2_8: 'audio/bgm_8.mp3',
        level_2_9: 'audio/bgm_8.mp3',
        level_2_10: 'audio/bgm_9.mp3',
        level_2_11: 'audio/bgm_title.mp3',
        level_3_1: 'audio/bgm_10.mp3', 
        level_3_2: 'audio/bgm_10.mp3',
        level_3_3: 'audio/bgm_10.mp3',
        level_3_4: 'audio/bgm_title.mp3', 
        level_3_5: 'audio/bgm_11.mp3',
        level_3_6: 'audio/bgm_11.mp3',
        level_3_7: 'audio/bgm_title.mp3',
        level_3_8: 'audio/bgm_12.mp3',
        level_3_9: 'audio/bgm_12.mp3',
        level_3_10: 'audio/bgm_13.mp3',
        level_3_11: 'audio/bgm_title.mp3',
        level_4_1: 'audio/bgm_14.mp3', 
        level_4_2: 'audio/bgm_14.mp3',
        level_4_3: 'audio/bgm_14.mp3',
        level_4_4: 'audio/bgm_15.mp3',
        level_4_5: 'audio/bgm_15.mp3',
        level_4_6: 'audio/bgm_15.mp3',
        level_4_7: 'audio/bgm_title.mp3',
        level_4_8: 'audio/bgm_17.mp3',
        level_4_9: 'audio/bgm_17.mp3',
        level_4_10: 'audio/bgm_16.mp3',
        level_4_11: 'audio/bgm_16.mp3',
        level_4_12: 'audio/bgm_17.mp3',
        level_4_13: 'audio/bgm_title.mp3',
        level_4_14: 'audio/bgm_16.mp3',
        level_4_15: 'audio/bgm_16.mp3',
        level_4_16: 'audio/bgm_17.mp3',
        level_4_17: 'audio/bgm_17.mp3',
        level_4_18: 'audio/bgm_16.mp3',
        level_4_19: 'audio/bgm_title.mp3',
        level_5_1: 'audio/bgm_18.mp3', 
        level_5_2: 'audio/bgm_18.mp3',
        level_5_3: 'audio/bgm_18.mp3',
        level_5_4: 'audio/bgm_19.mp3',
        level_5_5: 'audio/bgm_title.mp3',
        level_5_6: 'audio/bgm_19.mp3',
        level_5_7: 'audio/bgm_20.mp3',
        level_5_8: 'audio/bgm_20.mp3',
        level_5_9: 'audio/bgm_title.mp3',
        level_5_10: 'audio/bgm_21.mp3',
        level_5_11: 'audio/bgm_21.mp3',
        level_5_12: 'audio/bgm_21.mp3',
        level_5_13: 'audio/bgm_title.mp3',
        level_6_1: 'audio/bgm_23.mp3',
        level_6_2: 'audio/bgm_23.mp3',
        level_6_3: 'audio/bgm_23.mp3',
        level_6_4: 'audio/bgm_24.mp3',
        level_6_5: 'audio/bgm_24.mp3',
        level_6_6: 'audio/bgm_24.mp3',
    };



    // ── Per-level BGM overrides ───────────────────────────────
    // Format: 'world-level' : 'trackKey'
    // If a level is not listed here, falls back to the world default below.
    // Track keys must exist in BGM_TRACKS.

    const LEVEL_BGM = {
        // World 1
        '1-1': 'level_1_1',
        '1-2': 'level_1_2',
        '1-3': 'level_1_3',
        '1-4': 'level_1_4',
        '1-5': 'level_1_5',
        '1-6': 'level_1_6',
        '1-7': 'level_1_7',
        '1-8': 'level_1_8',
        '1-9': 'level_1_9',
        '1-10': 'level_1_10',
        '1-11': 'level_1_11',
        '1-12': 'level_1_12',
        '1-13': 'level_1_13',

        // World 2
        '2-1': 'level_2_1',
        '2-2': 'level_2_2',
        '2-3': 'level_2_3',
        '2-4': 'level_2_4',
        '2-5': 'level_2_5',
        '2-6': 'level_2_6', 
        '2-7': 'level_2_7',
        '2-8': 'level_2_8',
        '2-9': 'level_2_9',
        '2-10': 'level_2_10',
        '2-11': 'level_2_11',

        // World 3
        '3-1': 'level_3_1', 
        '3-2': 'level_3_2',
        '3-3': 'level_3_3',
        '3-4': 'level_3_4', 
        '3-5': 'level_3_5',
        '3-6': 'level_3_6',
        '3-7': 'level_3_7',
        '3-8': 'level_3_8',
        '3-9': 'level_3_9',
        '3-10': 'level_3_10',
        '3-11': 'level_3_11',


        // World 4
        '4-1': 'level_4_1', 
        '4-2': 'level_4_2',
        '4-3': 'level_4_3',
        '4-4': 'level_4_4',
        '4-5': 'level_4_5',
        '4-6': 'level_4_6',
        '4-7': 'level_4_7',
        '4-8': 'level_4_8',
        '4-9': 'level_4_9',
        '4-10': 'level_4_10',
        '4-11': 'level_4_11',
        '4-12': 'level_4_12',
        '4-13': 'level_4_13',
        '4-14': 'level_4_14',
        '4-15': 'level_4_15',
        '4-16': 'level_4_16',
        '4-17': 'level_4_17',
        '4-18': 'level_4_18',
        '4-19': 'level_4_19',


        // World 5
        '5-1': 'level_5_1', 
        '5-2': 'level_5_2',
        '5-3': 'level_5_3',
        '5-4': 'level_5_4',
        '5-5': 'level_5_5',
        '5-6': 'level_5_6',
        '5-7': 'level_5_7',
        '5-8': 'level_5_8',
        '5-9': 'level_5_9',
        '5-10': 'level_5_10',
        '5-11': 'level_5_11',
        '5-12': 'level_5_12',
        '5-13': 'level_5_13',

        // World 6
        '6-1': 'level_6_1', 
        '6-2': 'level_6_2',
        '6-3': 'level_6_3',
        '6-4': 'level_6_4',
        '6-5': 'level_6_5',
        '6-6': 'level_6_6',

    };

    // ── World fallback BGM ────────────────────────────────────
    // If a level has no entry in LEVEL_BGM, this is used instead.

    const WORLD_BGM = {
        1: 'world1',
        //2: 'world2',
        //3: 'world3',
        //4: 'world4',
        //5: 'world5',
        //6: 'world6',
    };


    // ── SFX Registry ─────────────────────────────────────────

    const SFX = {
        // UI
        click: 'audio/sfx_click.mp3',
        back: 'audio/sfx_back.mp3',
        button: 'audio/sfx_button.mp3',
        showtoast: 'audio/sfx_showtoast.mp3',

        // Puzzle
        cellFill: 'audio/sfx_cell_fill.mp3',
        cellMark: 'audio/sfx_cell_mark.mp3',
        cellWrong: 'audio/sfx_wrong.mp3',
        win: 'audio/sfx_win.mp3',
        lose: 'audio/sfx_lose.mp3',

        // Quiz & Mathgate
        quizCorrect: 'audio/sfx_quiz_correct.mp3',
        quizWrong: 'audio/sfx_quiz_wrong.mp3',

        // Items
        candle: 'audio/sfx_candle.mp3',
        magnifier: 'audio/sfx_magnifier.mp3',
        spyglass: 'audio/sfx_spyglass.mp3',
        scanner: 'audio/sfx_scanner.mp3',
        eraser: 'audio/sfx_eraser.mp3',
        sweeper: 'audio/sfx_sweeper.mp3',
        magnet: 'audio/sfx_magnet.mp3',
        error_gem: 'audio/sfx_error_gem.mp3',
        hourglass: 'audio/sfx_hourglass.mp3',
        stopwatch: 'audio/sfx_stopwatch.mp3',
        clock: 'audio/sfx_clock.mp3',
        chronobolt: 'audio/sfx_chronobolt.mp3',
        shield: 'audio/sfx_shield.mp3',
        time_freeze: 'audio/sfx_time_freeze.mp3',
        tutor: 'audio/sfx_tutor.mp3',
        professor: 'audio/sfx_professor.mp3',
        scholar: 'audio/sfx_scholar.mp3',
        grand_mentor: 'audio/sfx_grand_mentor.mp3',
        scouts_primer: 'audio/sfx_scouts_primer.mp3',
        set_square: 'audio/sfx_set_square.mp3',
        ruler: 'audio/sfx_ruler.mp3',
        codex_of_completion: 'audio/sfx_codex_of_completion.mp3',
        cursed_lens: 'audio/sfx_cursed_lens.mp3',
        cursed_clock: 'audio/sfx_cursed_clock.mp3',
        demon_eye: 'audio/sfx_demon_eye.mp3',
        tidal_wave: 'audio/sfx_tidal_wave.mp3',
        vortex: 'audio/sfx_vortex.mp3',
        chaos_grid: 'audio/sfx_chaos_grid.mp3',
        pearl_of_haste: 'audio/sfx_pearl_of_haste.mp3',
        pearl_of_swiftness: 'audio/sfx_pearl_of_swiftness.mp3',
        grand_pearl: 'audio/sfx_grand_pearl.mp3',
        the_witch: 'audio/sfx_the_witch.mp3',
        golden_clock: 'audio/sfx_golden_clock.mp3',
        shadow_seal: 'audio/sfx_shadow_seal.mp3',

        // Class Selection / Upgrade
        classSelected: 'audio/sfx_class_selected.mp3',
        classUpgraded: 'audio/sfx_class_upgraded.mp3',

        // Class abilities
        momentum: 'audio/sfx_momentum.mp3',
        dataStrike: 'audio/sfx_data_strike.mp3',
        diagonalStrike: 'audio/sfx_diagonal_strike.mp3',


        varianceShield: 'audio/sfx_variance_shield.mp3',
        arcaneReveal: 'audio/sfx_arcane_reveal.mp3',
        absoluteZero: 'audio/sfx_absolute_zero.mp3',

        bayesianInsight: 'audio/sfx_bayesian_insight.mp3',
        fieldScan: 'audio/sfx_field_scan.mp3',
        precisionMark: 'audio/sfx_precision_mark.mp3',

        // Ascendancy Class Abilities

        // Random Walker
        browneySummon: 'audio/sfx_browney_summon.mp3',
        browneyReveal: 'audio/sfx_browney_reveal.mp3',
        drifterSummon: 'audio/sfx_drifter_summon.mp3',
        drifterBark: 'audio/sfx_drifter_bark.mp3',
        drifterFinal: 'audio/sfx_drifter_final.mp3',
        drifterPoop: 'audio/sfx_drifter_poop.mp3',
        drifterExplosion: 'audio/sfx_drifter_explosion.mp3',
        drifterLevelUp: 'audio/sfx_drifter_level_up.mp3',

        // Recursionist
        residualSummon: 'audio/sfx_residual_summon.mp3',
        residualDespawn: 'audio/sfx_residual_despawn.mp3',
        residualReveal: 'audio/sfx_residual_reveal.mp3',
        dofBurn: 'audio/sfx_dof_burn.mp3',


        // Bayesian
        bayesTrapSelect: 'audio/sfx_bayes_traps_select.mp3',
        bayesTrapExplosion: 'audio/sfx_bayes_traps_explosion.mp3',
        type1errorShieldBreak: 'audio/sfx_type1error_shield_break.mp3',
        type1errorShieldHide: 'audio/sfx_type1error_shield_hide.mp3',


        // Markovian
        stateReversal: 'audio/sfx_state_reversal.mp3',
        transitionMatrix: 'audio/sfx_transition_matrix.mp3',
        transitionCascade: 'audio/sfx_transition_cascade.mp3',

        // Outlaw
        tailRiskResolve: 'audio/sfx_tail_risk_resolve.mp3',
        tailRiskStart: 'audio/sfx_tail_risk_start.mp3',
        speedforceEnter: 'audio/sfx_speedforce_enter.mp3',

        // Actuary
        holyHealing: 'audio/sfx_holy_healing.mp3',
        holySpell: 'audio/sfx_holy_spell.mp3',


        // Achievements / milestones / quest milestones
        achievement: 'audio/sfx_achievement.mp3',
        convergence: 'audio/sfx_convergence.mp3',
        milesstone: 'audio/sfx_milestone.mp3',

        abilityReady: 'audio/sfx_ability_ready.mp3',
    };

    // ── Pre-load SFX into cache ───────────────────────────────
    // Creates Audio objects early so first playback has no delay.

    const _sfxCache = {};

    function preload() {
        Object.entries(SFX).forEach(([key, src]) => {
            const a = new Audio(src);
            a.preload = 'auto';
            _sfxCache[key] = a;
        });
    }


    // ── BGM ───────────────────────────────────────────────────

    function playBGM(trackKey) {
        if (!bgmEnabled) return;
        const src = BGM_TRACKS[trackKey];
        if (!src) return;
        _lastBGMKey = trackKey;
        if (currentBGMSrc === src && currentBGM && !currentBGM.paused) return;

        // Cancel any pending autoplay-resume listener from a previous track
        if (_pendingResumeCleanup) {
            _pendingResumeCleanup();
            _pendingResumeCleanup = null;
        }

        stopBGM();

        const audio = new Audio(src);
        audio.loop = true;
        audio.volume = BGM_VOLUME;
        currentBGM = audio;
        currentBGMSrc = src;

        audio.play().catch(() => {
            const resume = () => {
                // Only resume if this audio object is still the active one
                if (currentBGM === audio) {
                    audio.play().catch(() => { });
                }
                document.removeEventListener('click', resume);
                document.removeEventListener('keydown', resume);
                _pendingResumeCleanup = null;
            };
            _pendingResumeCleanup = () => {
                document.removeEventListener('click', resume);
                document.removeEventListener('keydown', resume);
            };
            document.addEventListener('click', resume, { once: true });
            document.addEventListener('keydown', resume, { once: true });
        });
    }

    function stopBGM(fadeMs = 500) {
        if (!currentBGM) return;
        const dying = currentBGM;
        currentBGM = null;
        currentBGMSrc = '';

        if (fadeMs <= 0) { dying.pause(); return; }

        // Simple linear fade-out
        const step = dying.volume / (fadeMs / 50);
        const fade = setInterval(() => {
            if (dying.volume > step) {
                dying.volume -= step;
            } else {
                dying.pause();
                clearInterval(fade);
            }
        }, 50);
    }


    function stopSFX(key) {
        const a = _sfxInstances[key];
        if (!a) return;
        a.pause();
        a.currentTime = 0;
        delete _sfxInstances[key];
    }


    // ── SFX ───────────────────────────────────────────────────
    function playSFX(key) {
        if (!sfxEnabled) return;
        const src = SFX[key];
        if (!src) return;

        const base = _sfxCache[key];
        const a = base ? base.cloneNode() : new Audio(src);
        a.volume = SFX_VOLUME;
        a.play().catch(() => { });

        // Store last instance so it can be cancelled
        _sfxInstances[key] = a;
    }


    // Returns the BGM track key for a specific world + level number.
    // Checks LEVEL_BGM first, then falls back to WORLD_BGM, then 'world1'.
    function trackForLevel(worldNum, levelNum) {
        const levelKey = `${worldNum}-${levelNum}`;
        if (LEVEL_BGM[levelKey]) return LEVEL_BGM[levelKey];
        return WORLD_BGM[worldNum] || 'world1';
    }


    // ── Volume / toggle helpers ───────────────────────────────

    function setBGMVolume(v) {
        BGM_VOLUME = Math.max(0, Math.min(1, v));
        if (currentBGM) currentBGM.volume = BGM_VOLUME;
    }

    function toggleBGM(enabled) {
        bgmEnabled = enabled;
        if (!bgmEnabled) {
            stopBGM(0);
        } else {
            // Re-enable: resume whatever track was playing before it was muted.
            // _lastBGMKey is saved whenever playBGM is called.
            if (_lastBGMKey) playBGM(_lastBGMKey);
        }
    }

    function toggleSFX(enabled) {
        sfxEnabled = enabled;
    }

    function setSFXVolume(v) {
        SFX_VOLUME = Math.max(0, Math.min(1, v));
    }


    // ── Public API ────────────────────────────────────────────
    return {
        playBGM, stopBGM, playSFX, stopSFX, preload, trackForLevel,
        toggleBGM, toggleSFX, setBGMVolume, setSFXVolume
    };

})();