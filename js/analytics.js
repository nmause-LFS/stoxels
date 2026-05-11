// ═══════════════════════════════════════════════
//  ANALYTICS  (analytics.js)
//  Thin wrapper around PostHog for game-specific
//  event tracking. All tracked events go through
//  trackEvent() so it's easy to disable or swap
//  the analytics provider in one place.
//
//  TRACKED EVENTS:
//    level_completed       — every time a puzzle is solved
//    level_failed          — time ran out or Hardcore mistake
//    bonus_met             — bonus objective was achieved
//    quiz_answered         — bonus quiz was shown and answered/skipped
//    item_used             — an item was activated from inventory
//    item_earned           — an item was awarded (bonus or lucky drop)
//    math_gate_passed      — a probability gate was unlocked
//    world_completed       — all levels in a world are done
//    achievement_unlocked  — a Moodle score code was unlocked
// ═══════════════════════════════════════════════

// trackEvent(eventName, properties) — fires a PostHog custom event.
//   Guards against PostHog not being loaded (e.g. ad-blocker, slow network).
//   All events automatically include a session_id so you can correlate
//   events from the same play session without identifying the user.
function trackEvent(eventName, properties = {}) {
    if (typeof posthog === 'undefined') return;
    try {
        posthog.capture(eventName, {
            ...properties,
            game_version: '1.0',
            lang: LANG,
        });
    } catch (e) {
        // fail silently — analytics should never break the game
    }
}