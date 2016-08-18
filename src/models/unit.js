// import {inject} from 'aurelia-framework';
// import {SettingService} from 'services/setting.service';
import {ActionType} from 'models/action';

export const UnitClass = {
    Warrior: 0,
    Druid: 1,
    Rogue: 2
};

// @inject(SettingService)
export class Unit {

    constructor(settings, base) {
        this.settings = settings;

        this.isPlayer = true;
        this.id = 0;
        // this.name = '';
        // this.image = '';
        // this.level = 1;
        // this.class = UnitClass.Warrior;

        this.base = base;
        this.health = 0;
        // this.baseHealth = 400;
        // this.baseDamage = 10;
        // this.baseDodge = 0;
        // this.baseArmor = 0;

        // this.actions = [];

        this.overTimeEffects = [];
        // this.attackTime = settings.defaultAttackSpeed;
        // this.hasteRating = 0;
        // this.armorPenentration = 0;

        this.attackProgress = 0;
        this.target = null;
        this.castProgress = 0;
        this.castingAction = null;
        this.actionTarget = null;
        this.resetHealth();
    }

    get name() { return this.base.name; }
    get image() { return this.base.image; }
    get actions() { return this.base.actions; }
    get unitClass() { return this.base.unitClass; }
    get maxHealth() { return this.base.health; }
    get damage() { return this.base.damage; }
    get armor() { return this.base.armor; }
    get dodgeChance() { return this.base.dodgeChance; }
    get attackTime() { return this.base.attackTime; }
    get castTime() {
        if (this.castingAction !== null)
            return this.castingAction.castTime;
        return 0;
    }

    resetHealth() {
        this.health = this.maxHealth;
    }

    prepareForCombat() {
        this.attackProgress = 0;
        this.castProgress = 0;
        this.overTimeEffects = [];
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
        return (this.attackProgress / this.attackTime) * 100;
    }

    getCastProgressPercent() {
        if (this.castingAction === null)
            return 0;

        return (this.castProgress / this.castingAction.castTime) * 100;
    }

    reduceCastProgress(dt) {
        if (this.castingAction !== null) {
            this.castProgress -= dt;
            if (this.castProgress < 0)
                this.castProgress = 0;
        }
    }

    get armorDamageReduction() {
        return this.armor / (this.armor + this.settings.armorBaseLevel);
    }

    get armorDamageReductionPercent() {
        return this.armorDamageReduction * 100;
    }

    get totalDamageReductionPercent() {
        let dmgAfterArmorDR = 1 * (1 - this.armorDamageReduction);
        let dodgeDR = dmgAfterArmorDR * (this.dodgeChance / 100);
        return (this.armorDamageReduction + dodgeDR) * 100;
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

    addOverTimeEffect(overTimeEffect) {
        this.overTimeEffects.push(overTimeEffect);

        if (overTimeEffect.id === 7) {
            this.attackTime = this.attackTime / overTimeEffect.power;
        }

        if (overTimeEffect.id === 8) { // Shield wall
            this.baseArmor += overTimeEffect.power;
        }
    }

    removeOverTimeEffect(overTimeEffect) {
        let i = this.overTimeEffects.indexOf(overTimeEffect);

        if (i !== -1) {
            this.overTimeEffects.splice(i, 1);

            if (overTimeEffect.id === 7) { // Frenzy
                this.attackTime = this.attackTime * overTimeEffect.power;
            }

            if (overTimeEffect.id === 8) { // Shield wall
                this.baseArmor -= overTimeEffect.power;
            }
        }
    }

    hasOverTimeEffect(overTimeEffect) {
        return this.hasOverTimeEffectById(overTimeEffect.id);
    }

    hasOverTimeEffectById(effectId) {
        return this.getOverTimeEffectById(effectId) !== undefined;
    }

    getOverTimeEffect(overTimeEffect) {
        return this.getOverTimeEffectById(overTimeEffect.id);
    }

    getOverTimeEffectById(effectId) {
        return this.overTimeEffects.find(effect => effect.id === effectId);
    }

    getOnHitActions() {
        let actions = [];
        this.actions.forEach(action => {
            if (action.actionType === ActionType.OnHit)
                actions.push(action);
        });
        return actions;
    }
}
