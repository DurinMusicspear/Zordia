import {inject} from 'aurelia-framework';
import {SettingService} from './setting.service';
import {ActionFactoryService} from './action-factory.service';
import {Unit, UnitClass} from './unit';

@inject(SettingService, ActionFactoryService)
export class UnitFactoryService {

    constructor(settings, actionFactory) {
        this.settings = settings;
        this.actionFactory = actionFactory;
    }

    createUnit(unitClass) {
        let unit = new Unit(this.settings);
        unit.unitClass = unitClass;

        switch (unitClass) {
            case UnitClass.Warrior:
                unit.name = 'Warrior';
                unit.image = 'Gillian.jpg';
                unit.baseHealth = 300;
                unit.baseDodge = 20;
                unit.baseArmor = 100;
                unit.baseDamage = 12;
                unit.attackTime = 3;
                unit.addAction(this.actionFactory.createAction(3)); // Taunt
                unit.addAction(this.actionFactory.createAction(8)); // Shield wall
                break;

            case UnitClass.Rogue:
                unit.name = 'Assassin';
                unit.image = '2hxq2k6.png';
                unit.baseHealth = 200;
                unit.baseDodge = 25;
                unit.baseArmor = 10;
                unit.baseDamage = 15;
                unit.attackTime = 1.5;
                unit.addAction(this.actionFactory.createAction(4)); // Poison
                unit.addAction(this.actionFactory.createAction(5)); // Consume poison
                break;

            case UnitClass.Druid:
                unit.name = 'Druid';
                unit.image = '99cae21df58ef0116e534908036332a7.jpg';
                unit.baseHealth = 250;
                unit.baseDodge = 10;
                unit.baseArmor = 25;
                unit.baseDamage = 8;
                unit.attackTime = 2;
                unit.addAction(this.actionFactory.createAction(1)); // HOT
                unit.addAction(this.actionFactory.createAction(2)); // Heal
                unit.addAction(this.actionFactory.createAction(6)); // Heal & HOT
                break;

            default:
                break;
        }

        unit.resetHealth();
        return unit;
    }
}
