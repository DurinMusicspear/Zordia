import {inject} from 'aurelia-framework';
import {UnitClass} from './unit';
import {ActionType} from './action';
import {SettingService} from './setting.service';
import {CombatService} from './combat.service';
import {UnitFactoryService} from './unit-factory.service';
import {MonsterFactoryService} from './monster-factory.service';

@inject(SettingService, CombatService, UnitFactoryService, MonsterFactoryService)
export class App {

    constructor(settings, combat, unitFactory, monsterFactory) {
        this.settings = settings;
        this.combat = combat;
        this.unitFactory = unitFactory;
        this.monsterFactory = monsterFactory;

        this.playerUnits = [];
        this.enemyUnits = [];
        this.actions = [];

        this.createMonsterUnit(1);

        this.createPlayerUnit(UnitClass.Warrior);
        this.createPlayerUnit(UnitClass.Rogue);
        this.createPlayerUnit(UnitClass.Druid);

        this.combat.playerUnits = this.playerUnits;
        this.combat.enemyUnits = this.enemyUnits;

        this.myKeyupCallback = this.hotkeyPress.bind(this);
    }

    createMonsterUnit(monsterId) {
        let monster = this.monsterFactory.createMonster(monsterId);
        this.enemyUnits.push(monster);
    }

    createPlayerUnit(unitClass) {
        let player = this.unitFactory.createUnit(unitClass);
        player.actions.forEach(action => {
            if (action.actionType !== ActionType.OnHit)
                this.actions.push(action);
        });
        this.playerUnits.push(player);
    }

    attached() {
        this.combat.start();
        window.addEventListener('keyup', this.myKeyupCallback, false);
    }

    detached() {
        this.combat.stop();
        window.removeEventListener('keyup', this.myKeyupCallback);
    }

    hotkeyPress(event) {
        console.log(event);

        switch (event.code) {
            case 'KeyQ':
                this.combat.castAction(this.actions[0]);
                break;
            case 'KeyW':
                this.combat.castAction(this.actions[1]);
                break;
            case 'KeyE':
                this.combat.castAction(this.actions[2]);
                break;
            case 'KeyR':
                this.combat.castAction(this.actions[3]);
                break;
            case 'KeyA':
                this.combat.castAction(this.actions[4]);
                break;
            case 'KeyS':
                this.combat.castAction(this.actions[5]);
                break;
            case 'KeyD':
                this.combat.castAction(this.actions[6]);
                break;
            case 'KeyF':
                this.combat.castAction(this.actions[7]);
                break;

            default:
                break;
        }
    }
}
