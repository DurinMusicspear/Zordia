'use strict';

let settings = require('../services/game-settings');
let CombatLog = require('../services/combat-log');
let UnitFactory = require('../services/unit-factory');
let MonsterFactory = require('../services/monster-factory');
let CombatEngine = require('../services/combat-engine');

class Game {

    constructor() {
        this.settings = settings;
        this.combatLog = new CombatLog(this.settings);
        this.unitFactory = new UnitFactory(this.settings, null);
        this.monsterFactory = new MonsterFactory(this.settings, null);
        this.combat = new CombatEngine(this.settings, this.combatLog);
        this.players = [];

        this.combat.start();
    }

    setNetworkEngine(networkEngine) {
        this.network = networkEngine;
    }

    playerConnected(player) {
        this.players.push(player);
    }

    createCharacter(name, unitClass) {
        let character = this.unitFactory.createUnit(unitClass);
        character.name = name;
        // this.players.push(player);
        return character;
    }
}

module.exports = Game;
