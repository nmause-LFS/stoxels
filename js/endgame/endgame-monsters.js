//------------------------------------------------------------------------
//-------------------CONSTANTS & DATA DEFINITIONS-------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Monster level scaling 
// Applied per level above 1. 
const EG_LEVEL_HP_SCALE = 0.02; // +2% HP per level above 1
const EG_LEVEL_DAMAGE_SCALE = 0.01; // +1% damage per level above 1

// Hard cap on how many monsters (including bosses) can be alive simultaneously.
// New spawns are silently dropped until a slot opens.
const EG_MAX_CONCURRENT_MONSTERS = 4;



//------------------------------------------------------------------------
//-------------------MONSTER DEFINITIONS----------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------



// baseHP / baseDamage are level-1 values.
// chargeMax (seconds to fill the attack bar) does NOT scale with level.
// isBoss: true entries are only spawned via cur.hasBoss / cur.bosses.

const EG_MONSTER_DEFS = {
    // TIER 1 — Weak / fast
    slime: {
        id: 'slime', name: 'Probability Slime', emoji: '🟢',
        baseHP: 30, baseDamage: 5, chargeMax: 10, attackType: 'melee' // Melee only
    },
    ghost: {
        id: 'ghost', name: 'Variance Ghost', emoji: '👻',
        baseHP: 50, baseDamage: 1, chargeMax: 6 // Defaults to ranged
    },
    bat: {
        id: 'bat', name: 'Outlier Bat', emoji: '🦇',
        baseHP: 25, baseDamage: 3, chargeMax: 5, attackType: 'melee' // Melee only
    },
    rat: {
        id: 'rat', name: 'Sample Rat', emoji: '🐀',
        baseHP: 20, baseDamage: 2, chargeMax: 4, attackType: 'melee'
    },

    // TIER 2 — Medium / balanced
    crab: {
        id: 'crab', name: 'Correlation Crab', emoji: '🦀',
        baseHP: 65, baseDamage: 7, chargeMax: 12, attackType: 'melee'
    },
    snake: {
        id: 'snake', name: 'Regression Snake', emoji: '🐍',
        baseHP: 55, baseDamage: 9, chargeMax: 14, attackType: 'both' // Uses random mix!
    },
    skull: {
        id: 'skull', name: 'Null Hypothesis Skull', emoji: '💀',
        baseHP: 70, baseDamage: 6, chargeMax: 9
    },

    // TIER 3 — Tanky / hard-hitting
    golem: {
        id: 'golem', name: 'Sigma Golem', emoji: '🗿',
        baseHP: 80, baseDamage: 10, chargeMax: 20, attackType: 'melee'
    },
    dragon: {
        id: 'dragon', name: 'Bayes Dragon', emoji: '🐉',
        baseHP: 120, baseDamage: 14, chargeMax: 18, attackType: 'both' // Uses random mix!
    },
    demon: {
        id: 'demon', name: 'P-Value Demon', emoji: '😈',
        baseHP: 100, baseDamage: 18, chargeMax: 22
    },
    golem_iron: {
        id: 'golem_iron', name: 'Iron Golem', emoji: '🤖',
        baseHP: 150, baseDamage: 8, chargeMax: 16, attackType: 'melee'
    },
    werewolf: {
        id: 'werewolf', name: 'Stochastic Wolf', emoji: '🐺',
        baseHP: 90, baseDamage: 12, chargeMax: 11, attackType: 'both' // Uses random mix!
    },
    ogre: {
        id: 'ogre', name: 'Chi-Square Ogre', emoji: '👹',
        baseHP: 110, baseDamage: 16, chargeMax: 25, attackType: 'melee'
    },
};






//------------------------------------------------------------------------
//-------------------MONSTER FACTORY--------------------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Returns the scaled stats for a monster at the given level.
// Accepts either a string id (looks up EG_MONSTER_DEFS) or a def object directly.
function _egBuildMonster(defOrId, level = 1) {
    const def = (typeof defOrId === 'string') ? EG_MONSTER_DEFS[defOrId] : defOrId;

    // FIX: If it's not a standard monster, check if it's a boss and route to the boss factory
    if (!def && typeof defOrId === 'string' && typeof EG_BOSS_DEFS !== 'undefined' && EG_BOSS_DEFS[defOrId]) {
        return _egBuildBoss(defOrId, level);
    }

    if (!def) { console.warn('Unknown monster id:', defOrId); return null; }

    const lvl = Math.max(1, level);
    const hpScale = 1 + EG_LEVEL_HP_SCALE * (lvl - 1);
    const dmgScale = 1 + EG_LEVEL_DAMAGE_SCALE * (lvl - 1);

    const maxHP = Math.round(def.baseHP * hpScale);
    const damage = Math.round(def.baseDamage * dmgScale);

    return {
        id: `${def.id}_${++_egMonsterSpawnCounter}`,
        name: def.name,
        emoji: def.emoji,
        level: lvl,
        maxHP,
        currentHP: maxHP,
        chargeMax: def.chargeMax,
        currentCharge: 0,
        damageValue: damage,
        attackType: def.attackType || 'ranged' // Added fallback tracking
    };
}