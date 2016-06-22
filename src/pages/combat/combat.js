import {inject} from 'aurelia-framework';
import {UnitClass} from 'unit';
import {ActionType} from 'action';
import {SettingService} from 'services/setting.service';
import {CombatService} from 'services/combat.service';
import {UnitFactoryService} from 'services/unit-factory.service';
import {MonsterFactoryService} from 'services/monster-factory.service';
import {IOService} from 'services/io.service';

@inject(SettingService, CombatService, UnitFactoryService, MonsterFactoryService, IOService)
export class App {

    constructor(settings, combat, unitFactory, monsterFactory, ioService) {
        this.settings = settings;
        this.combat = combat;
        this.unitFactory = unitFactory;
        this.monsterFactory = monsterFactory;
        this.ioService = ioService;

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
