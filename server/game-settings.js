'use strict';

const GameSetting = {

    armorBaseLevel: 100,

    // Player
    baseHealth: 50,
    healthPerToughness: 10,

    baseDamage: 20,
    damagePerStrength: 1,

    armorPerHeadLevel: 1,
    armorPerChestLevel: 1,
    armorPerLegsLevel: 1,

    goldPerEnemyLevel: 1,
    xpPerEnemyLevel: 2,

    requiredXPPerLevel: 10,

    weaponUpgradeCostPerLevel: 2,
    armorUpgradeCostPerLevel: 1,

    bleedDamagePercent: 0.5,
    axeBaseBleedChance: 50,
    axeBleedChancePerLevel: 2,
    spearBaseArmorPen: 2,
    spearArmorPenPerLevel: 1,
    daggerBaseHaste: 10,
    daggerHastePerLevel: 5,
    weaponDamagePerLevel: 1,

    actionPointsPerDay: 10,
    actionPointsPerStamina: 0.5,

    baseHealthRegen: 5,
    healthRegenPerStamina: 1,

    defaultAttackSpeed: 1.5,
    bleedTimer: 2,

    // Monsters
    monsterBaseHealth: 100,
    monsterBaseDamage: 10,
    monsterBaseArmor: 2,
    monsterBaseDodge: 10,

    healthPerLevel: 10,
    damagePerLevel: 1,
    armorPerLevel: 1,

    // Tough
    toughArmor: 2,

    // Fast
    fastDodge: 20,

    // Strong
    strongHealth: 20
};

module.exports = GameSetting;
