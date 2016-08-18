'use strict';

let Monster = require('../models/monster');

class MonsterFactory {

    constructor(settings, actionFactory) {
        this.settings = settings;
        this.actionFactory = actionFactory;
    }

    createMonster(monsterId) {
        let unit = new Monster(this.settings);
        unit.id = monsterId + 10;
        unit.isPlayer = false;

        switch (monsterId) {
            case 1:
                unit.name = 'Giant spider';
                unit.image = 'poison_spider_by_hunqwert-d4xn84e.jpg';
                unit.baseHealth = 3000;
                unit.baseDodge = 30;
                unit.baseArmor = 0;
                unit.baseDamage = 60;
                unit.attackTime = 1;
                unit.addAction(this.actionFactory.createAction(7)); // Frenzy
                unit.addAction(this.actionFactory.createAction(9)); // Poison sting
                break;

            default:
                break;
        }

        unit.resetHealth();
        return unit;
    }
}

module.exports = MonsterFactory;
