import {inject} from 'aurelia-framework';
import {SettingService} from './setting.service';
import {ActionFactoryService} from './action-factory.service';
import {Unit} from './unit';

@inject(SettingService, ActionFactoryService)
export class MonsterFactoryService {

    constructor(settings, actionFactory) {
        this.settings = settings;
        this.actionFactory = actionFactory;
    }

    createMonster(monsterId) {
        let unit = new Unit(this.settings);
        unit.id = monsterId;
        unit.isPlayer = false;

        switch (monsterId) {
            case 1:
                unit.name = 'Giant spider';
                unit.image = 'poison_spider_by_hunqwert-d4xn84e.jpg';
                unit.baseHealth = 3000;
                unit.baseDodge = 30;
                unit.baseArmor = 0;
                unit.baseDamage = 80;
                unit.attackTime = 1;
                unit.addAction(this.actionFactory.createAction(7)); // Frenzy
                break;

            default:
                break;
        }

        unit.resetHealth();
        return unit;
    }
}
