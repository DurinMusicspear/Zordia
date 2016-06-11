import {SettingService} from './setting.service';
import {Action} from './action';
 
export enum UnitClass {
    Warrior,
    Druid,
    Rogue
}

export class Unit {
    name: string;
    image: string;
    level: number = 1;
    health: number;
    class: UnitClass;

    attackTime: number = 1;

    hasteRating: number = 0;
    armorPenentration: number = 0;
    bleedChance: number = 0;
    bleedDamage: number = 0;

    dodgeChance: number = 0;

    attackProgress: number = 0;
    bleedStacks = 0;
    bleedStackDamage = 0;
    dodgeTimer = 0;
    bleedTimer = 0;
    target: Unit;

    actions: Action[] = [];
    castProgress: number = 0;
    castingAction: Action;
    actionTarget: Unit;

    damageLog: Array<string> = [];

    constructor(protected settings: SettingService) {
        this.attackTime = settings.defaultAttackSpeed;
        this.resetHealth();
    }

    resetHealth() {
        this.health = this.getMaxHealth();
    }

    prepareForCombat() {
        this.dodgeTimer = 0;
        this.dodgeAttack();
        this.attackProgress = 0;
        this.bleedStacks = 0;
        this.bleedTimer = this.settings.bleedTimer;
    }

    decreaseHealth(amount: number) {
        this.health -= amount;
        if (this.health < 0)
            this.health = 0;
    }

    increaseHealth(amount: number) {
        this.health += amount;
        if (this.health > this.getMaxHealth())
            this.health = this.getMaxHealth();
    }

    getHealthPercent() {
        return (this.health / this.getMaxHealth()) * 100;
    }

    getAttackProgressPercent() {
        return (this.attackProgress / this.getAttackSpeed()) * 100;
    }

    getCastProgressPercent() {
        if (this.castingAction == null)
            return 0;

        return (this.castProgress / this.castingAction.castTime) * 100;
    }

    reduceCastProgress(dt: number) {
        if (this.castingAction != null) {
            this.castProgress -= dt;
            if (this.castProgress < 0)
                this.castProgress = 0
        }
    }

    canDodgeAttack() {
        return this.dodgeTimer == 0 && this.dodgeChance > 0;
    }

    dodgeAttack() {
        if (this.dodgeChance > 0)
            this.dodgeTimer = this.settings.defaultAttackSpeed / (this.dodgeChance / 100);
    }


    // Virtual methods
    getMaxHealth() { return 300; }
    getDamage() { return 5; }
    getArmor() { return 1; }
    getAttackSpeed() { return this.attackTime; }
    getArmorPenentration() { return this.armorPenentration; }
    getHaste() { return this.hasteRating; }
    getBleedChance() { return this.bleedChance; }
    getBleedDamagePercent() { return this.bleedDamage; }

    addDamageLogValue(value: string) {
        this.damageLog.push(value);
        //console.log(value);
        // var log = this.damageLog;
        // setTimeout(function() {
        //   log.shift();
        // }, 2000);
    }

    setTarget(unit: Unit) {
        this.target = unit;
    }

    setCastingAction(action: Action) {
        this.castingAction = action;
        this.castProgress = 0;
    }

    addAction(action: Action) {
        this.actions.push(action);
        action.owner = this;
    }
}