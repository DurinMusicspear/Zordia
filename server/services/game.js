'use strict';

let settings = require('../services/game-settings');
let CombatLog = require('../services/combat-log');
let ActionFactory = require('../services/action-factory');
let UnitFactory = require('../services/unit-factory');
let MonsterFactory = require('../services/monster-factory');
let CombatEngine = require('../services/combat-engine');

class Game {

    constructor() {
        this.settings = settings;
        this.combatLog = new CombatLog(this.settings);
        this.actionFactory = new ActionFactory(this.settings);
        this.unitFactory = new UnitFactory(this.settings, this.actionFactory);
        this.monsterFactory = new MonsterFactory(this.settings, this.actionFactory);
        this.combat = new CombatEngine(this.settings, this.combatLog);
        this.players = [];
        this.parties = [];

        this.combat.start();
    }

    setNetworkEngine(networkEngine) {
        this.network = networkEngine;
    }

    addPlayer(unit) {
        this.players.push(unit);
    }

    addParty(party) {
        this.parties.push(party);
    }

    getPartyById(partyId) {
        return this.parties.find(party => party.id === partyId);
    }

}

module.exports = Game;
