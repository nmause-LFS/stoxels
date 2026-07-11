//------------------------------------------------------------------------
//-------------------SPRITE ANIMATIONS-------------------------------------
//------------------------------------------------------------------------
// Central home for all sprite-frame animation data and playback logic:
//   - Walk cycles (per character, per class/ascendency state)
//   - Combat / puzzle-skill animations (per character, per ascendency, per skill)
//
// player_sprite.js stays responsible for *where* the avatar sits and how
// it's dragged/positioned. This file is responsible for *what frames play
// on the sprite image* and *when*.
//
// Expected filename convention (place in images/animations/<Char>/):
//   <Char>_<state>_<animKey>_<frameIndex>.png
// e.g. images/animations/Trix/Trix_random_walker_swing_1.png
//------------------------------------------------------------------------


//------------------------------------------------------------------------
//-------------------GENERIC FRAME-SEQUENCE RUNNER-------------------------
//------------------------------------------------------------------------

// Plays an ordered list of frame sources on a target <img>, each frame
// shown at the given offset (ms from animation start), then restores
// idleSrc once the sequence finishes (after idleDelayMs).
//
// imgElementId : id of the <img> element to animate
// frames       : array of image src strings, in playback order
// timings      : array of ms offsets, same length as frames (frames[i]
//                shows at timings[i] ms after call)
// idleSrc      : src to restore once the animation completes
// idleDelayMs  : ms after the last frame before restoring idleSrc
// onComplete   : optional callback fired when idleSrc is restored
//
// Returns nothing; all scheduling is done via setTimeout against the
// element id (re-queried each frame) so it's safe even if the element
// is briefly replaced/re-rendered mid-animation.
function _playSpriteAnimation(imgElementId, frames, timings, idleSrc, idleDelayMs, onComplete) {
    if (!frames || frames.length === 0) return;
    if (!timings || timings.length !== frames.length) {
        console.warn(`_playSpriteAnimation: timings length mismatch for ${imgElementId}`);
        return;
    }

    const el = document.getElementById(imgElementId);
    if (!el) return;

    frames.forEach((src, i) => {
        setTimeout(() => {
            const frameEl = document.getElementById(imgElementId);
            if (frameEl) frameEl.src = src;
        }, timings[i]);
    });

    const lastTiming = timings[timings.length - 1];
    setTimeout(() => {
        const finalEl = document.getElementById(imgElementId);
        if (finalEl) finalEl.src = idleSrc;
        if (onComplete) onComplete();
    }, lastTiming + idleDelayMs);
}


//------------------------------------------------------------------------
//-------------------WALK CYCLE FRAME REGISTRY-----------------------------
//------------------------------------------------------------------------
// Keyed by character -> state (noclass / base class / ascendency) -> frames.
// Populate as walk-cycle art is added for each of the 3 characters x 10
// sprite states (no class, 3 base classes, 6 ascendencies).

// PLACEHOLDER FILENAMES — swap these for real walk-cycle art per
// character/state. Order matters: frame 1 = contact (left foot forward),
// frame 2 = passing (mid-stride), frame 3 = contact (right foot forward).
// Playback ping-pongs through these (1,2,3,2,1,2,3,...) rather than
// wrapping straight from the last frame back to the first — see
// _advanceWalkFrameIndex() below.
const _WALK_FRAMES = {
    stox: {
        noclass: [
            'images/animations/Stox/walk/Stox_noclass_walk_1.png', // contact: left foot forward
            'images/animations/Stox/walk/Stox_noclass_walk_2.png', // passing: mid-stride
            'images/animations/Stox/walk/Stox_noclass_walk_3.png', // contact: right foot forward
        ],
        statistician: [
            'images/animations/Stox/walk/Stox_statistician_walk_1.png', // contact: left foot forward
            'images/animations/Stox/walk/Stox_statistician_walk_2.png', // passing: mid-stride
            'images/animations/Stox/walk/Stox_statistician_walk_3.png', // contact: right foot forward
        ],
        outlier: [
            'images/animations/Stox/walk/Stox_outlier_walk_1.png', // contact: left foot forward
            'images/animations/Stox/walk/Stox_outlier_walk_2.png', // passing: mid-stride
            'images/animations/Stox/walk/Stox_outlier_walk_3.png', // contact: right foot forward
        ],
        actuary: [
            'images/animations/Stox/walk/Stox_actuary_walk_1.png', // contact: left foot forward
            'images/animations/Stox/walk/Stox_actuary_walk_2.png', // passing: mid-stride
        ],
        mathmagician: [
            'images/animations/Stox/walk/Stox_mathmagician_walk_1.png', // contact: left foot forward
            'images/animations/Stox/walk/Stox_mathmagician_walk_2.png', // passing: mid-stride
            'images/animations/Stox/walk/Stox_mathmagician_walk_3.png', // contact: right foot forward
        ],
        recursionist: [
            'images/animations/Stox/walk/Stox_recursionist_walk_1.png', // contact: left foot forward
            'images/animations/Stox/walk/Stox_recursionist_walk_2.png', // passing: mid-stride
        ],
        markovian: [
            'images/animations/Stox/walk/Stox_markovian_walk_1.png', // contact: left foot forward
            'images/animations/Stox/walk/Stox_markovian_walk_2.png', // passing: mid-stride
        ],
        probabilist: [
            'images/animations/Stox/walk/Stox_probabilist_walk_1.png', // contact: left foot forward
            'images/animations/Stox/walk/Stox_probabilist_walk_2.png', // passing: mid-stride
            'images/animations/Stox/walk/Stox_probabilist_walk_3.png', // contact: right foot forward
        ],
        bayesian: [
            'images/animations/Stox/walk/Stox_bayesian_walk_1.png', // contact: left foot forward
            'images/animations/Stox/walk/Stox_bayesian_walk_2.png', // passing: mid-stride
            'images/animations/Stox/walk/Stox_bayesian_walk_3.png', // contact: right foot forward
        ],
        random_walker: [
            'images/animations/Stox/walk/Stox_random_walker_walk_1.png', // contact: left foot forward
            'images/animations/Stox/walk/Stox_random_walker_walk_2.png', // passing: mid-stride
            'images/animations/Stox/walk/Stox_random_walker_walk_3.png', // contact: right foot forward
        ],


    },


    trix: {
        noclass: [
            'images/animations/Trix/walk/Trix_noclass_walk_1.png', // contact: left foot forward
            'images/animations/Trix/walk/Trix_noclass_walk_2.png', // passing: mid-stride
            'images/animations/Trix/walk/Trix_noclass_walk_3.png', // contact: right foot forward
        ],
        statistician: [
            'images/animations/Trix/walk/Trix_statistician_walk_1.png', // contact: left foot forward
            'images/animations/Trix/walk/Trix_statistician_walk_2.png', // passing: mid-stride
        ],
        outlier: [
            'images/animations/Trix/walk/Trix_outlier_walk_1.png', // contact: left foot forward
            'images/animations/Trix/walk/Trix_outlier_walk_2.png', // passing: mid-stride
            'images/animations/Trix/walk/Trix_outlier_walk_3.png', // contact: right foot forward
        ],
        actuary: [
            'images/animations/Trix/walk/Trix_actuary_walk_1.png', // contact: left foot forward
            'images/animations/Trix/walk/Trix_actuary_walk_2.png', // passing: mid-stride
            'images/animations/Trix/walk/Trix_actuary_walk_3.png', // contact: right foot forward
        ],
        mathmagician: [
            'images/animations/Trix/walk/Trix_mathmagician_walk_1.png', // contact: left foot forward
            'images/animations/Trix/walk/Trix_mathmagician_walk_2.png', // passing: mid-stride
        ],
        recursionist: [
            'images/animations/Trix/walk/Trix_recursionist_walk_1.png', // contact: left foot forward
            'images/animations/Trix/walk/Trix_recursionist_walk_2.png', // passing: mid-stride
            'images/animations/Trix/walk/Trix_recursionist_walk_3.png', // contact: right foot forward
        ],
        markovian: [
            'images/animations/Trix/walk/Trix_markovian_walk_1.png', // contact: left foot forward
            'images/animations/Trix/walk/Trix_markovian_walk_2.png', // passing: mid-stride
            'images/animations/Trix/walk/Trix_markovian_walk_3.png', // contact: right foot forward
        ],
        probabilist: [
            'images/animations/Trix/walk/Trix_probabilist_walk_1.png', // contact: left foot forward
            'images/animations/Trix/walk/Trix_probabilist_walk_2.png', // passing: mid-stride
            'images/animations/Trix/walk/Trix_probabilist_walk_3.png', // contact: right foot forward
        ],
        bayesian: [
            'images/animations/Trix/walk/Trix_bayesian_walk_1.png', // contact: left foot forward
            'images/animations/Trix/walk/Trix_bayesian_walk_2.png', // passing: mid-stride
            'images/animations/Trix/walk/Trix_bayesian_walk_3.png', // contact: right foot forward
        ],
        random_walker: [
            'images/animations/Trix/walk/Trix_random_walker_walk_1.png', // contact: left foot forward
            'images/animations/Trix/walk/Trix_random_walker_walk_2.png', // passing: mid-stride
            'images/animations/Trix/walk/Trix_random_walker_walk_3.png', // contact: right foot forward
        ],
    },

    syla: {
        noclass: [
            'images/animations/Syla/walk/Syla_noclass_walk_1.png', // contact: left foot forward
            'images/animations/Syla/walk/Syla_noclass_walk_2.png', // passing: mid-stride
            'images/animations/Syla/walk/Syla_noclass_walk_3.png', // contact: right foot forward
        ],
        statistician: [
            'images/animations/Syla/walk/Syla_statistician_walk_1.png', // contact: left foot forward
            'images/animations/Syla/walk/Syla_statistician_walk_2.png', // passing: mid-stride
        ],
        outlier: [
            'images/animations/Syla/walk/Syla_outlier_walk_1.png', // contact: left foot forward
            'images/animations/Syla/walk/Syla_outlier_walk_2.png', // passing: mid-stride
        ],
        actuary: [
            'images/animations/Syla/walk/Syla_actuary_walk_1.png', // contact: left foot forward
            'images/animations/Syla/walk/Syla_actuary_walk_2.png', // passing: mid-stride
            'images/animations/Syla/walk/Syla_actuary_walk_3.png', // contact: right foot forward
        ],
        mathmagician: [
            'images/animations/Syla/walk/Syla_mathmagician_walk_1.png', // contact: left foot forward
            'images/animations/Syla/walk/Syla_mathmagician_walk_2.png', // passing: mid-stride
            'images/animations/Syla/walk/Syla_mathmagician_walk_3.png', // contact: right foot forward
        ],
        recursionist: [
            'images/animations/Syla/walk/Syla_recursionist_walk_1.png', // contact: left foot forward
            'images/animations/Syla/walk/Syla_recursionist_walk_2.png', // passing: mid-stride
            'images/animations/Syla/walk/Syla_recursionist_walk_3.png', // contact: right foot forward
        ],
        markovian: [
            'images/animations/Syla/walk/Syla_markovian_walk_1.png', // contact: left foot forward
            'images/animations/Syla/walk/Syla_markovian_walk_2.png', // passing: mid-stride
        ],
        probabilist: [
            'images/animations/Syla/walk/Syla_probabilist_walk_1.png', // contact: left foot forward
            'images/animations/Syla/walk/Syla_probabilist_walk_2.png', // passing: mid-stride
            'images/animations/Syla/walk/Syla_probabilist_walk_3.png', // contact: right foot forward
        ],
        bayesian: [
            'images/animations/Syla/walk/Syla_bayesian_walk_1.png', // contact: left foot forward
            'images/animations/Syla/walk/Syla_bayesian_walk_2.png', // passing: mid-stride
            'images/animations/Syla/walk/Syla_bayesian_walk_3.png', // contact: right foot forward
        ],
        random_walker: [
            'images/animations/Syla/walk/Syla_random_walker_walk_1.png', // contact: left foot forward
            'images/animations/Syla/walk/Syla_random_walker_walk_2.png', // passing: mid-stride
            'images/animations/Syla/walk/Syla_random_walker_walk_3.png', // contact: right foot forward
        ],
    },

};

const _WALK_FRAME_INTERVAL_MS = 150; // ms between each walk frame while looping
const _WALK_IDLE_DEBOUNCE_MS = 180;  // ms of no movement before snapping back to idle

// Internal loop/debounce state. Keyed nothing — only one avatar walks at
// a time, so a single shared state object is fine.
const _walkState = {
    intervalId: null,
    frameIndex: 0,
    direction: 1, // +1 advancing forward through frames, -1 bouncing back
    idleTimeoutId: null,
    imgElementId: null,
};

// Advances _walkState.frameIndex by one step of a ping-pong sequence
// across the given frame count. For a 3-frame set this produces the
// cycle: 0,1,2,1,0,1,2,1,0,... (i.e. contact,passing,contact,passing,...)
// instead of a hard wrap from the last frame back to the first, which
// would visually "snap" rather than step naturally.
//
// Works for any frame count >= 2. A 2-frame set simply alternates
// 0,1,0,1,... since there's no distinct middle frame to bounce through.
function _advanceWalkFrameIndex(frameCount) {
    if (frameCount <= 1) return 0;

    let next = _walkState.frameIndex + _walkState.direction;

    if (next >= frameCount) {
        _walkState.direction = -1;
        next = frameCount - 2 >= 0 ? frameCount - 2 : 0;
    } else if (next < 0) {
        _walkState.direction = 1;
        next = frameCount > 1 ? 1 : 0;
    }

    return next;
}

// Starts (or keeps alive) the looping walk animation on the current
// character's sprite. Safe to call on every movement tick — it only
// actually starts the interval once, and just resets the idle debounce
// on subsequent calls.
function _startAvatarWalkAnimation(imgElementId = 'avatar-sprite-img-simple') {
    const char = STATE?.playerCharacter;
    const asc = STATE?.playerAscendency || STATE?.playerClass || 'noclass';
    if (!char) return;

    const frames = _WALK_FRAMES[char]?.[asc];
    if (!frames || frames.length === 0) return;

    // Always cancel any pending "return to idle" — we're moving again.
    if (_walkState.idleTimeoutId) {
        clearTimeout(_walkState.idleTimeoutId);
        _walkState.idleTimeoutId = null;
    }

    // Loop already running for this element — nothing else to do.
    if (_walkState.intervalId && _walkState.imgElementId === imgElementId) return;

    // Switching elements (e.g. simple <-> full avatar) — stop the old loop first.
    if (_walkState.intervalId) {
        clearInterval(_walkState.intervalId);
        _walkState.intervalId = null;
    }

    _walkState.imgElementId = imgElementId;
    _walkState.frameIndex = 0;
    _walkState.direction = 1;

    const el = document.getElementById(imgElementId);
    if (!el) return;
    el.src = frames[0];

    _walkState.intervalId = setInterval(() => {
        const frameEl = document.getElementById(imgElementId);
        if (!frameEl) return;
        _walkState.frameIndex = _advanceWalkFrameIndex(frames.length);
        frameEl.src = frames[_walkState.frameIndex];
    }, _WALK_FRAME_INTERVAL_MS);
}

// Call on every movement tick alongside _startAvatarWalkAnimation(). If no
// further movement happens within _WALK_IDLE_DEBOUNCE_MS, the loop stops
// and the sprite returns to its idle image. Re-arms on every call, so
// rapid tap-tap-tap movement keeps the walk cycle going smoothly.
function _scheduleAvatarWalkIdle() {
    if (_walkState.idleTimeoutId) clearTimeout(_walkState.idleTimeoutId);

    _walkState.idleTimeoutId = setTimeout(() => {
        _stopAvatarWalkAnimation();
    }, _WALK_IDLE_DEBOUNCE_MS);
}

// Immediately stops the walk loop and restores the idle sprite.
function _stopAvatarWalkAnimation() {
    if (_walkState.intervalId) {
        clearInterval(_walkState.intervalId);
        _walkState.intervalId = null;
    }
    if (_walkState.idleTimeoutId) {
        clearTimeout(_walkState.idleTimeoutId);
        _walkState.idleTimeoutId = null;
    }

    _walkState.frameIndex = 0;
    _walkState.direction = 1;

    const imgElementId = _walkState.imgElementId;
    _walkState.imgElementId = null;
    if (!imgElementId) return;

    const el = document.getElementById(imgElementId);
    const idleSrc = typeof _getPlayerCharacterImage === 'function'
        ? _getPlayerCharacterImage()
        : undefined;
    if (el && idleSrc) el.src = idleSrc;
}

// Single entry point movement code should call on every position change:
// starts the loop if needed and (re)arms the idle debounce.
function _playAvatarWalkAnimation(imgElementId) {
    _startAvatarWalkAnimation(imgElementId);
    _scheduleAvatarWalkIdle();
}


//------------------------------------------------------------------------
//-------------------SKILL ANIMATION FRAME REGISTRY-------------------------
//------------------------------------------------------------------------
// Keyed by character -> ascendency -> skillKey -> frames. Combat and
// puzzle-skill animations both live here, distinguished by skillKey.

const _SKILL_FRAMES = {
    trix: {
        random_walker: {
            swing: [
                'images/animations/Trix/abilities/Trix_random_walker_swing_1.png',
                'images/animations/Trix/abilities/Trix_random_walker_swing_2.png',
                'images/animations/Trix/abilities/Trix_random_walker_swing_3.png',
            ],
        },
    },
};

// Per-skill timing config: ms offset for each frame, plus delay before
// returning to idle. Keyed the same way as _SKILL_FRAMES so each skill
// can have its own pacing.
const _SKILL_TIMINGS = {
    trix: {
        random_walker: {
            swing: {
                frameOffsets: [0, 500, 1000],
                idleDelay: 1000,
            },
        },
    },
};

// Plays the named skill animation for the current character/ascendency.
// Falls back to doing nothing if no frames are defined (e.g. other
// characters/ascendencies that don't have art yet).
function _playAvatarSkillAnimation(skillKey) {
    const char = STATE?.playerCharacter;
    const asc = STATE?.playerAscendency;
    if (!char || !asc) return;

    const frames = _SKILL_FRAMES[char]?.[asc]?.[skillKey];
    const timingCfg = _SKILL_TIMINGS[char]?.[asc]?.[skillKey];
    if (!frames || frames.length === 0 || !timingCfg) return;

    const idleSrc = typeof _getPlayerCharacterImage === 'function'
        ? _getPlayerCharacterImage()
        : undefined;
    if (!idleSrc) return;

    _playSpriteAnimation(
        'avatar-sprite-img-simple',
        frames,
        timingCfg.frameOffsets,
        idleSrc,
        timingCfg.idleDelay
    );
}

// Backwards-compatible wrapper: existing call sites use
// _playAvatarSwingAnimation() directly for Trix/random_walker's swing.
// Kept as a thin wrapper so player_sprite.js and any other callers don't
// need to change.
function _playAvatarSwingAnimation() {
    _playAvatarSkillAnimation('swing');
}