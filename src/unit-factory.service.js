import {inject} from 'aurelia-framework';
import {SettingService} from './setting.service';
import {Unit, UnitClass} from './unit';
import {Action, TargetType, TargetPriority} from './action';

@inject(SettingService)
export class UnitFactoryService {

    constructor(settings) {
        this.settings = settings;
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
                unit.baseArmor = 20;
                unit.baseDamage = 12;
                unit.attackTime = 3;
                unit.addAction(this.createAction(3)); //Taunt
                break;

            case UnitClass.Rogue:
                unit.name = 'Assassin';
                unit.image = '2hxq2k6.png';
                unit.baseHealth = 200;
                unit.baseDodge = 25;
                unit.baseArmor = 0;
                unit.baseDamage = 15;
                unit.attackTime = 1.5;
                break;

            case UnitClass.Druid:
                unit.name = 'Druid';
                unit.image = '99cae21df58ef0116e534908036332a7.jpg';
                unit.baseHealth = 250;
                unit.baseDodge = 10;
                unit.baseArmor = 10;
                unit.baseDamage = 8;
                unit.attackTime = 2;
                unit.addAction(this.createAction(1)); // HOT
                unit.addAction(this.createAction(2)); // Heal
                break;

            default:
                break;
        }

        unit.resetHealth();
        return unit;
    }

    createAction(actionId) {
        let action = new Action();
        action.id = actionId;

        switch (actionId) {
            case 1:
                action.name = 'HOT';
                action.castTime = 0;
                action.power = 200;
                action.targetType = TargetType.Allied;
                action.targetPriority = TargetPriority.LeastHealth;
                break;

            case 2:
                action.name = 'Heal';
                action.castTime = 2;
                action.power = 100;
                action.targetType = TargetType.Allied;
                action.targetPriority = TargetPriority.LeastHealth;
                break;

            case 3:
                action.name = 'Taunt';
                action.castTime = 1;
                action.targetType = TargetType.Enemy;
                break;

            default:
                break;
        }

        return action;
    }
}
