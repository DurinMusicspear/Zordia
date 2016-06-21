// import {AppComponent} from './app.component';
import {inject} from 'aurelia-framework';
import {OverTimeEffect, ActionType, TargetType, TargetPriority} from './action';
import {SettingService} from './setting.service';
import {CombatLogService} from './combat-log.service';

@inject(SettingService, CombatLogService)
export class CombatService {

    constructor(settings, combatLog) {
        this.settings = settings;
        this.combatLog = combatLog;
        this.playerUnits = [];
        this.enemyUnits = [];
        this.activeAction = null;
        this.actionTarget = null;
        this.selectedUnit = null;
        this.combatActive = false;
        this.now = 0;
        this.dt = 0;
        this.step = 1 / 60;
        this.last = 0;
    }

    start() {
	    // this.meter = new FPSMeter();
        this.combatActive = true;
        this.animationFrame();
    }

    stop() {
        this.combatActive = false;
    }

    animationFrame() {
        this.now = this.timestamp();
        this.dt = this.dt + Math.min(1, (this.now - this.last) / 1000);
        while (this.dt > this.step) {
            this.dt = this.dt - this.step;
            this.tick(this.step);
        }
        this.last = this.now;

        if (this.combatActive)
            requestAnimationFrame(() => this.animationFrame());

        // this.meter.tick();
    }

    timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

    tick(dt) {
        this.playerUnits.forEach(unit => {
            if (unit.health > 0) {
                this.checkPlayerTargetDead(unit);
                this.progressAttack(unit, dt);
                this.processOverTimeEffects(unit, dt);
                this.reduceCooldowns(unit, dt);
            }
        });
        this.enemyUnits.forEach(unit => {
            if (unit.health > 0) {
                this.runEnemyAI(unit);
                this.checkEnemyTargetDead(unit);
                this.progressAttack(unit, dt);
                this.processOverTimeEffects(unit, dt);
                this.reduceCooldowns(unit, dt);
            }
        });
    }

    runEnemyAI(unit) {
        if (unit.castingAction === null) {
            if (unit.actions[0].cooldownRemaining === 0) {
                unit.setCastingAction(unit.actions[0]);
            } else if (unit.actions[1].cooldownRemaining === 0) {
                unit.setCastingAction(unit.actions[1]);
            }
            // let actionToCast = null;
            // unit.actions.forEach(action => {
            //     if (action.cooldownRemaining === 0) {
            //         actionToCast = action;
            //     }
            // });
            // if (actionToCast !== null) {
            //     unit.setCastingAction(actionToCast);
            // }
        }

        let highestThreat = unit.findHighestThreatExcludingTarget();
        let targetThreat = unit.findThreat(unit.target);
        if (highestThreat !== null && targetThreat !== null &&
            highestThreat.threat > targetThreat.threat * 1.1) {
            unit.target = highestThreat.unit;
        }
    }

    checkPlayerTargetDead(player) {
        if (player.target === null || player.target.health === 0)
            this.findNewPlayerTarget(player);
    }

    findNewPlayerTarget(player) {
        player.target = null;
        this.enemyUnits.forEach(enemy => {
            if (player.target === null && enemy.health > 0)
                player.setTarget(enemy);
        });
        if (player.target === null)
            this.stop();
    }

    checkEnemyTargetDead(enemy) {
        if (enemy.target === null || enemy.target.health === 0)
            this.findNewEnemyTarget(enemy);
    }

    findNewEnemyTarget(enemy) {
        enemy.target = null;
        this.playerUnits.forEach(player => {
            if (enemy.target === null && player.health > 0)
                enemy.setTarget(player);
        });
        if (enemy.target === null)
            this.stop();
    }

    progressAttack(attacker, dt) {
        if (attacker.castingAction !== null) {
            attacker.castProgress += dt;
            if (attacker.castProgress >= attacker.castingAction.castTime) {
                this.executeAction(attacker);
            }
        } else {
            attacker.attackProgress += dt;
            if (attacker.attackProgress >= attacker.getAttackSpeed()) {
                attacker.attackProgress -= attacker.getAttackSpeed();
                this.executeAttack(attacker, attacker.target);
            }
        }
    }

    processOverTimeEffects(unit, dt) {
        unit.overTimeEffects.forEach(effect => {
            effect.reduceRemaningDuration(dt);
            if (effect.tickReady) {
                this.executeOverTimeTick(unit, effect);
                effect.tickReady = false;
            }
            if (effect.remainingDuration === 0) {
                unit.removeOverTimeEffect(effect);
            }
        });
    }

    executeAttack(attacker, defender) {
        let dmg = attacker.damage;

        dmg = dmg * (1 - defender.armorDamageReduction);

        if (dmg < 0)
            dmg = 0;

        dmg = Math.round(dmg);

        if (this.roll(defender.dodgeChance)) {
            // Dodge
            // defender.addDamageLogValue('Dodge');
        } else {
            // Hit
            defender.reduceCastProgress(0.5);
            defender.decreaseHealth(dmg);

            // Apply on hit actions
            let onHitActions = attacker.getOnHitActions();
            onHitActions.forEach(action => {
                if (action.id === 4) { // Poison
                    this.applyOverTimeEffect(attacker, defender, action);
                }
            });

            this.combatLog.logDamage(attacker, defender, dmg);
            defender.increaseThreat(attacker, dmg);
        }
    }

    executeOverTimeTick(target, overTimeEffect) {
        if (overTimeEffect.id === 1 || overTimeEffect.id === 6) { // HOT
            let numTicks = Math.floor(overTimeEffect.duration);
            if (numTicks > 0) {
                let heal = overTimeEffect.power / numTicks;
                target.increaseHealth(Math.round(heal));
            }
        }

        if (overTimeEffect.id === 4 || overTimeEffect.id === 9) { // Poison
            let numTicks = Math.floor(overTimeEffect.duration);
            if (numTicks > 0) {
                let damage = (overTimeEffect.power / numTicks) * overTimeEffect.stacks;
                damage = Math.round(damage);
                target.decreaseHealth(damage);
                this.combatLog.logDamage(overTimeEffect.caster, target, damage);
                target.increaseThreat(overTimeEffect.caster, damage);
            }
        }
    }

    reduceCooldowns(unit, dt) {
        unit.actions.forEach(action => {
            action.reduceCooldown(dt);
        });
    }

    roll(percentChance) {
        return Math.random() < (percentChance / 100);
    }

    setActiveAction(action) {
        this.activeAction = action;
    }

    castCurrentAction() {
        let caster = this.activeAction.owner;
        caster.setCastingAction(this.activeAction);
    }

    castAction(action) {
        this.activeAction = action;
        this.castCurrentAction();
    }

    executeAction(attacker) {
        let action = attacker.castingAction;
        let target = null;

        if (action.targetType === TargetType.Self) {
            target = attacker;
        } else if (action.targetPriority === TargetPriority.CurrentTarget) {
            target = attacker.target;
        } else if (action.targetType === TargetType.Allied) {
            if (action.targetPriority === TargetPriority.LeastHealth)
                target = this.findAllyWithLeastHealth(attacker);
        } else if (action.targetType === TargetType.Enemy) {
            if (action.targetPriority === TargetPriority.Random) {
                target = this.findRandomEnemy(attacker);
            }
        }

        if (action.actionType === ActionType.OverTimeEffect || action.actionType === ActionType.DirectAndOverTime) {
            this.applyOverTimeEffect(attacker, target, action);
        }

        if (action.id === 2) { // Heal
            target.increaseHealth(action.power);
            // target.addDamageLogValue('+' + action.power);
        }

        if (action.id === 3) { // Taunt
            let targets = this.playerUnits;
            if (this.isPlayerUnit(attacker)) {
                targets = this.enemyUnits;
            }
            targets.forEach(t => {
                t.setTarget(attacker);
                t.setThreatEqualToHighestThreat(attacker);
            });
        }

        if (action.id === 5) { // Consume poison
            let poisonEffect = target.getOverTimeEffectById(4);
            if (poisonEffect !== null) {
                target.removeOverTimeEffect(poisonEffect);
                let dmg = poisonEffect.stacks * action.power;
                target.decreaseHealth(dmg);
                this.combatLog.logDamage(attacker, target, dmg);
                target.increaseThreat(attacker, dmg);
            }
        }

        if (action.id === 6) { // Heal
            target.increaseHealth(Math.floor(action.power / 2));
            // target.addDamageLogValue('+' + action.power);
        }

        attacker.castingAction.startCooldown();
        attacker.castProgress = 0;
        attacker.castingAction = null;
        attacker.actionTarget = null;
    }

    applyOverTimeEffect(caster, target, action) {
        let overTimeEffect = new OverTimeEffect(caster, action);
        if (target.hasOverTimeEffect(overTimeEffect)) {
            let existingEffect = target.getOverTimeEffect(overTimeEffect);
            existingEffect.addStack();
        } else {
            target.addOverTimeEffect(overTimeEffect);
        }
    }

    isPlayerUnit(unit) {
        return this.playerUnits.indexOf(unit) !== -1;
    }

    findAllyWithLeastHealth(unit) {
        let leastUnit = null;
        let allies = this.playerUnits;
        if (!this.isPlayerUnit(unit)) {
            allies = this.enemyUnits;
        }
        allies.forEach(u => {
            if (u.health > 0 && (leastUnit === null || u.getHealthPercent() < leastUnit.getHealthPercent())) {
                leastUnit = u;
            }
        });
        return leastUnit;
    }

    findRandomEnemy(unit) {
        let enemies = this.playerUnits;
        if (this.isPlayerUnit(unit)) {
            enemies = this.enemyUnits;
        }
        let possibleTargets = [];
        enemies.forEach(enemy => {
            if (enemy.health > 0) {
                possibleTargets.push(enemy);
            }
        });

        if (possibleTargets.length > 0)
            return possibleTargets[this.getRandomIntInclusive(0, possibleTargets.length - 1)];

        return null;
    }

    getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
