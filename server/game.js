'use strict';
let settings = require('./game-settings');
let UnitFactory = require('./unit-factory');
// let UnitClass = require('./unit').UnitClass;

class Game {

    constructor() {
        this.settings = settings;
        this.unitFactory = new UnitFactory(this.settings, null);
        this.players = [];
    }

    createCharacter(name, unitClass) {
        let character = this.unitFactory.createUnit(unitClass);
        character.name = name;
        // this.players.push(player);
        return character;
    }
}

module.exports = Game;
