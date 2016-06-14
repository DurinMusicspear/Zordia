import {inject} from 'aurelia-framework';
import {SettingService} from './setting.service';

export const UnitClass = {
    Warrior: 0,
    Druid: 1,
    Rogue: 2
};

@inject(SettingService)
export class Unit {

    constructor(settings) {
        this.settings = settings;

        this.name = '';
        this.image = '';
        this.level = 1;
        this.class = UnitClass.Warrior;

        this.baseHealth = 400;
        this.baseDamage = 10;
        this.health = 0;
        this.dodgeChance = 0;
        this.baseArmor = 0;

        this.actions = [];
        this.attackTime = settings.defaultAttackSpeed;
        this.hasteRating = 0;
        this.armorPenentration = 0;
        this.bleedChance = 0;
        this.bleedDamage = 0;

        this.attackProgress = 0;
        this.bleedStacks = 0;
        this.bleedStackDamage = 0;
        this.dodgeTimer = 0;
        this.bleedTimer = 0;
        this.target = null;
        this.castProgress = 0;
        this.castingAction = null;
        this.actionTarget = null;
        this.damageLog = [];
    }

    resetHealth() {
        this.health = this.maxHealth;
    }

    prepareForCombat() {
        this.dodgeTimer = 0;
        this.dodgeAttack();
        this.attackProgress = 0;
        this.bleedStacks = 0;
        this.bleedTimer = this.settings.bleedTimer;
    }

    decreaseHealth(amount) {
        this.health -= amount;
        if (this.health < 0)
            this.health = 0;
    }

    increaseHealth(amount) {
        this.health += amount;
        if (this.health > this.maxHealth)
            this.health = this.maxHealth;
    }

    getHealthPercent() {
        return (this.health / this.maxHealth) * 100;
    }

    getAttackProgressPercent() {
        return (this.attackProgress / this.getAttackSpeed()) * 100;
    }

    getCastProgressPercent() {
        if (this.castingAction === null)
            return 0;

        return (this.castProgress / this.castingAction.castTime) * 100;
    }

    get castTime() {
        if (this.castingAction !== null)
            return this.castingAction.castTime;
        return 0;
    }

    reduceCastProgress(dt) {
        if (this.castingAction !== null) {
            this.castProgress -= dt;
            if (this.castProgress < 0)
                this.castProgress = 0;
        }
    }

    canDodgeAttack() {
        return this.dodgeTimer === 0 && this.dodgeChance > 0;
    }

    dodgeAttack() {
        if (this.dodgeChance > 0)
            this.dodgeTimer = this.settings.defaultAttackSpeed / (this.dodgeChance / 100);
    }


    // Virtual methods
    get maxHealth() { return this.baseHealth; }
    get damage() { return this.baseDamage; }
    get armor() { return this.baseArmor; }
    getAttackSpeed() { return this.attackTime; }
    getArmorPenentration() { return this.armorPenentration; }
    getHaste() { return this.hasteRating; }
    getBleedChance() { return this.bleedChance; }
    getBleedDamagePercent() { return this.bleedDamage; }

    addDamageLogValue(value) {
        this.damageLog.push(value);
        //console.log(value);
        // var log = this.damageLog;
        // setTimeout(function() {
        //   log.shift();
        // }, 2000);
    }

    setTarget(unit) {
        this.target = unit;
    }

    setCastingAction(action) {
        this.castingAction = action;
        this.castProgress = 0;
    }

    addAction(action) {
        this.actions.push(action);
        action.owner = this;
    }
}