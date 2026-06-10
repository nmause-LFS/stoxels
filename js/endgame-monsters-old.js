// endgame-monsters.js
// ─────────────────────────────────────────────────────────────────────────────
// Self-contained monster + pickup system for the endgame sandbox.
// Activated ONLY when cur.isEndgameSandbox === true OR cur.isMonsterLevel === true.
// All public names are prefixed _eg_ to avoid collision with campaign code.
//
// EXTERNAL CALLS INTO THIS FILE (from mouse-button-handlers.js and others):
//   _egOnCorrectCell(row, col)      — call on every correct cell fill
//   _egCheckPickupClaim(row, col)   — call before crediting a correct action
//   _egDiscardPickup(row, col)      — call on a wrong action that had a pickup
//   _egDispelCorruption(row, col)   — call when player clicks a corrupted cell
//   _egIsCellCorrupted(row, col)    — returns true if cell is boss-corrupted
//   _egStartEncounter()             — call when a monster level begins
//   _egStopEncounter()              — call when leaving a monster level
//   _egSelectTarget(monsterId)      — called by onclick on monster cards
// ─────────────────────────────────────────────────────────────────────────────

















