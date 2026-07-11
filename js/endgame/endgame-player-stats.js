//------------------------------------------------------------------------
//-------------------CONSTANTS & DATA DEFINITIONS-------------------------
//------------------------------------------------------------------------
//------------------------------------------------------------------------


// Player base stats
// These are the level-1 values before any equipment or passive bonuses apply.
// Future expansion: critChance, critMultiplier, fireDamage, coldDamage, lightningDamage, 
// fireResist, coldResist, lightningResist, armor, evasion, energyShield, strength, dexterity, intelligence, ...

// Life Regen, + Life from Hearts

const EG_PLAYER_STATS = {
    baseHP: 1000, // Starting HP for all monster levels
    baseDamage: 100, // Damage dealt per correct cell fill
    chargePushback: 1.5, // Seconds removed from a monster's charge bar on hit
};







/*

Regular modifier Stats that make sense in Stoxels (there can be some very special ones later on maybe)

Attributes: 
+Strength, +Agility, +Intelligence
     Strength gives +2 Life and +1 Armor per point of Strength
     Agility gives +1 Accuracy and + 1 Evasion per point of Agility
    Intelligence gives +2 Mana and +1 Spell Damage per point of Intelligence

Life:    
    +Health, 
    +Life Regeneration per Second, 
    + Life Leech on hit (small percentage of damage gets returned as life)
    + HeartHeal: increases the amount of health that heart items give (flat and multiplier?)

Mana: (TODO: Class Abilities will need to have a mana cost added for endgame)
     +Mana flat value 
     ManaRegen: Regenerate X mana every 5 seconds
     + Mana on kill

Defensives:
     +Armor (flat additive value), 
     local armor multiplier on item base (multiplies the item armor value of the item equipped in that slot), 
    armor reduces incoming damage of monster attacks by a certain amount, from ranged and melee monster attacks
 
    +Evasion(flat additive value), 
    local evasion multiplier on item base(multiplies the item evasion value of the item equipped in that slot)
    Evasion gives a chance (with poe like entropy?) that a monster misses the player when it attacks with ranged or melee attacks 

    + Absorption - a secondary layer of values on top of life (some monsters can ignore this absorption layer)
                - absorption starts slowly automatically regenrating back to full after 5 seconds of not taking a hit, but this regeneration is interrupted if the player gets attacked
                can have +Absorption, +fasterStartOfAbsorptionRegeneration, AbsorptionRegenrationRate (makes the absorption protection regenrate back up to full quicker)
                + absorption on kill


    + Block Chance and +Spell Block Chance - block completely negates the incoming damage for regular attacks or monster spells (monster abilities, spellblock)
                                            but when the player blocks he can no longer damage monsters for the next 5 seconds. So we can introduce a +BlockRecovery stat that reduces this time
                                            should be more deterministic than dodge/spell dodge
    + Dodge and +SpellDodge - chance to fully dodge and void damage from attacks or spells - similar to block but must be more random cause no block recovery downside

    + resistances against fire, cold, lightning, shadow damage (reduces the incoming elemental damage from monsters)



Puzzle Modifiers
    + AllowedMistakeCount - maps have limited mistake counts, players can increase this by wearing gear with +mistakecount
    + ChanceForMistakesToNotCount - percentage chance that a mistake does not count as mistake and does not increase the mistake counter (basically shield item effect?)
    + Time - maps have limited amount of time, players can increase that by using +time items
    + Focus - mistakes consume less time
    + Precision: each correctly revealed cell gives a small damage buff or mana regen or crit damage or life regen. lose all stacks of the buff on mistake


Quiz & Input Exercise Modifiers
    + Chance to receive a new question after failing a question 
    + Chance to automatically remove one wrong answer on multiple choice questions (shall stack with passive tree effect for chance to remove up to 2 wrong answers)
    + chance to show reveal hint on exercise questions




Damage stats: (damage of player projectiles should scale with ranged weapon slot damage, melee weapon is for "counterattack" damage when a monster strikes the player in melee (or attempts to incase we dodge or block or evade))
    + local physical damage flat value
    + local physical damage multiplier
    + critical strike chance for melee counterattacks or ranged attacks
    + critical damage for melee counterattacks or ranged attacks
    + multishot (since attack speed makes no sense) - chance to shoot two projectiles instead of one per reveal, maybe this can go higher than 100% to have 1 extra guaranteed and +chance for 2?)
    + splash damage - chance to hit multiple monsters in the same spawn location
    + fire damage
    + cold damage
    + lightning damage
    + shadow damage
    + Accuracy: less chance to miss the monster with counterattacks and projectiles

    + chance to ignite (ignite does fire damage over time to monster)
    + chance to freeze (freeze freezes the monster so it can not attack for X seconds)
    + chance to shock (shock increases the damage the monster receives for X seconds)
    + chance to convert (shadow damage status effect, converted monsters can shoot each other and deal damage to each other, for X seconds)
    + chance to blind: reduces monster accuracy

    +chain: chance to have projectiles bounce to a monster in a different spawn location (shall chains of chains occur?)

    + pushback: pushes monsters attack timer back by X additional seconds

    + overkill: chance to have overkill damage spread to a nearby monster



Damage of Spells: (TODO: All class abilities shall have a way to affect monsters on the screen, some deal damage, some apply status effects and other debuffs)
// +SpellDamage - flat increase to class ability damage against monsters
// *SpellDamage - multiplier of spell damage (should be lower values)




*/