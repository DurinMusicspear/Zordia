import {inject} from 'aurelia-framework';
import {Unit, UnitClass} from './unit';
import {SettingService} from './setting.service';
import {CombatService} from './combat.service';
import {UnitFactoryService} from './unit-factory.service';

@inject(SettingService, CombatService, UnitFactoryService)
export class App {

    constructor(settings, combat, unitFactory) {
        this.settings = settings;
        this.combat = combat;
        this.unitFactory = unitFactory;

        this.playerUnits = [];
        this.enemyUnits = [];
        this.actions = [];

        for (let i = 0; i < 3; i++) {
            let enemy = new Unit(this.settings);
            enemy.name = 'monster' + i;
            enemy.image = '11a89b2cf393f23c3f6c11dec106c2e8.jpg';
            this.enemyUnits.push(enemy);
            enemy.resetHealth();
        }

        this.createPlayerUnit(UnitClass.Warrior);
        this.createPlayerUnit(UnitClass.Rogue);
        this.createPlayerUnit(UnitClass.Druid);

        this.combat.playerUnits = this.playerUnits;
        this.combat.enemyUnits = this.enemyUnits;

        this.myKeyupCallback = this.hotkeyPress.bind(this);
    }

    createPlayerUnit(unitClass) {
        let player = this.unitFactory.createUnit(unitClass);
        player.actions.forEach(action => {
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

        switch (event.keyCode) {
            case 81:
                this.combat.setActiveAction(this.actions[0]);
                break;
            case 87:
                this.combat.setActiveAction(this.actions[1]);
                break;
            case 69:
                this.combat.setActiveAction(this.actions[2]);
                break;
            case 82:
                this.combat.setActiveAction(this.actions[3]);
                break;

            default:
                break;
        }
    }
}
