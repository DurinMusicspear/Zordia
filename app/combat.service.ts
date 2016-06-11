// import {AppComponent} from './app.component';
import {Injectable} from '@angular/core';
import {Unit} from './unit';
import {Action, TargetType, TargetPriority} from './action';
import {SettingService} from './setting.service';

@Injectable()
export class CombatService {
    playerUnits: Unit[];
    enemyUnits: Unit[];
    activeAction: Action;
    actionTarget: Unit;
    selectedUnit: Unit;

    private combatActive = false;
    private now = 0;
    private dt = 0;
    private step = 1 / 60;
    private last = 0;

    constructor(private settings: SettingService) {

    }

    start() {
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
    }

    tick(dt: number) {
        this.playerUnits.forEach(unit => {
            if (unit.health > 0) {
                this.checkPlayerTargetDead(unit);
                this.progressAttack(unit, dt);
            }
        });
        this.enemyUnits.forEach(unit => {
            if (unit.health > 0) {
                this.checkEnemyTargetDead(unit);
                this.progressAttack(unit, dt);
            }
        });
    }

    checkPlayerTargetDead(player: Unit) {
        if (player.target == null || player.target.health == 0)
            this.findNewPlayerTarget(player);
    }

    findNewPlayerTarget(player: Unit) {
        player.target = null;
        this.enemyUnits.forEach(enemy => {
            if (player.target == null && enemy.health > 0)
                player.setTarget(enemy);
        });
        if (player.target == null)
            this.stop();
    }

    checkEnemyTargetDead(enemy: Unit) {
        if (enemy.target == null || enemy.target.health == 0)
            this.findNewEnemyTarget(enemy);
    }

    findNewEnemyTarget(enemy: Unit) {
        enemy.target = null;
        this.playerUnits.forEach(player => {
            if (enemy.target == null && player.health > 0)
                enemy.setTarget(player);
        });
        if (enemy.target == null)
            this.stop();
    }

    progressAttack(attacker: Unit, dt: number) {
        if (attacker.castingAction != null) {
            attacker.castProgress += dt;
            if(attacker.castProgress >= attacker.castingAction.castTime) {
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

    executeAttack(attacker: Unit, defender: Unit) {
        var dmg = attacker.getDamage();

        //var block = defender.getArmor();
        //block -= attacker.getArmorPenentration();

        // if (block < 0)
        //     block = 0;

        // dmg -= block;

        if (dmg < 0)
            dmg = 0;

        // this.causeBleeding(attacker, defender, dmg);

        if (defender.canDodgeAttack()) {
            defender.dodgeAttack();
            defender.addDamageLogValue('Dodge');
        } else {
            defender.reduceCastProgress(0.5);
            defender.decreaseHealth(dmg);
            defender.addDamageLogValue(dmg + ' (-' + 0 + ')');
        }
    }

    causeBleeding(attacker: Unit, defender: Unit, damage: number) {
        if (attacker.getBleedChance() == 0)
            return;

        if (this.roll(attacker.getBleedChance())) {
            defender.bleedStacks += 1;
            defender.bleedStackDamage = damage * attacker.getBleedDamagePercent();
        }
    }

    reduceTimers(unit: Unit, dt: number) {
        if (unit.dodgeChance > 0 && unit.dodgeTimer > 0) {
            unit.dodgeTimer -= dt;
            if (unit.dodgeTimer < 0)
                unit.dodgeTimer = 0;
        }

        if (unit.bleedStacks > 0) {
            unit.bleedTimer -= dt;
            if (unit.bleedTimer <= 0) {
                this.applyBleedTick(unit);
                unit.bleedTimer += this.settings.bleedTimer;
            }
        }

        unit.actions.forEach(action => {
            action.reduceCooldown(dt);
        });
    }

    applyBleedTick(unit: Unit) {
        var bleed = unit.bleedStackDamage * unit.bleedStacks;
        unit.decreaseHealth(bleed);
        unit.addDamageLogValue(bleed + ' (Bleed)');
    }

    timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

    roll(percentChance: number) {
        return Math.random() < (percentChance / 100);
    }

    setActiveAction(action: Action) {
        this.activeAction = action;
    }

    castCurrentAction() {
        var caster = this.activeAction.owner;
        // if(target != null) {
        //     caster.actionTarget = target;
        // }
        caster.setCastingAction(this.activeAction);
    }

    executeAction(attacker: Unit) {
        var action = attacker.castingAction;
        var target: Unit;// attacker.actionTarget;
        if(action.targetType == TargetType.Allied) {
            if(action.targetPriority == TargetPriority.LeastHealth)
                target = this.findAllyWithLeastHealth(attacker);
        }

        // if(target == null) {
        //     target = attacker.target;
        // }

        if (action.id == 2) { // Heal
            target.increaseHealth(action.power);
            target.addDamageLogValue('+' + action.power);
        }

        if(action.id == 3) { // Taunt
            var targets = this.playerUnits;
            if(this.isPlayerUnit(attacker))
                targets = this.enemyUnits;
            targets.forEach(target => {
                target.setTarget(attacker);
            })
        }        

        attacker.castingAction.startCooldown();
        attacker.castProgress = 0;
        attacker.castingAction = null;
        attacker.actionTarget = null;
    }

    isPlayerUnit(unit: Unit) {
        return this.playerUnits.indexOf(unit) != -1;
    }

    findAllyWithLeastHealth(unit: Unit) {
        var leastUnit: Unit;
        var allies = this.playerUnits;
        if(!this.isPlayerUnit(unit)) {
            allies = this.enemyUnits;   
        }
        allies.forEach(unit => {
            if(leastUnit == null || unit.health < leastUnit.health) {
                leastUnit = unit;
            }
        });
        return leastUnit;
    }
}
