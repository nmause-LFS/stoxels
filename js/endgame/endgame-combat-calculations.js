//------------------------------------------------------------------------
//-------------------PLAYER DAMAGE CALCULATION----------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Central function for all outgoing player damage.
// Add equipment bonuses, crits, and buff stacks here when the time comes.
function _egCalcPlayerDamage() {
    let dmg = EG_PLAYER_STATS.baseDamage;
    // TODO: dmg += _egGetEquipmentBonus('damage');
    // TODO: if (Math.random() < _egGetCritChance()) dmg = Math.floor(dmg * 1.2);
    return Math.max(1, Math.round(dmg));
}