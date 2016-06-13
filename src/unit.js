import {inject} from 'aurelia-framework';
import {SettingService} from './setting.service';
import {Action} from './action';

export const UnitClass = {
    Warrior: 0,
    Druid: 1,
    Rogue: 2
};

@inject(SettingService)
export class Unit {
    name;
    image;
    level = 1;
    health;
    class;

    attackTime = 1;

    hasteRating = 0;
    armorPenentration = 0;
    bleedChance = 0;
    bleedDamage = 0;

    dodgeChance = 0;

    attackProgress = 0;
    bleedStacks = 0;
    bleedStackDamage = 0;
    dodgeTimer = 0;
    bleedTimer = 0;
    target = null;

    actions = [];
    castProgress = 0;
    castingAction = null;
    actionTarget = null;

    damageLog = [];

    constructor(settings) {
        this.settings = settings;
        this.attackTime = settings.defaultAttackSpeed;
        this.resetHealth();
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
        if(this.castingAction !== null)
            return this.castingAction.castTime;
        return 0;
    }

    reduceCastProgress(dt) {
        if (this.castingAction !== null) {
            this.castProgress -= dt;
            if (this.castProgress < 0)
                this.castProgress = 0
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
    get maxHealth() { return 300; }
    getDamage() { return 5; }
    getArmor() { return 1; }
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