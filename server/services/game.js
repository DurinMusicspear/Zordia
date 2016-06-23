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
        this.parties = [];

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

    addParty(party) {
        this.parties.push(party);
    }

    addAIPlayerToParty(unitClass, partyId) {
        console.log('Add ai player to party: ' + unitClass + ' ' + partyId);
        let party = this.getPartyById(partyId);
        let unit = this.unitFactory.createUnit(unitClass);
        unit.isAiPlayer = true;
        party.addAiPlayer(unit);
    }

    getPartyById(partyId) {
        let result = null;
        this.parties.forEach(party => {
            if (party.id === partyId)
                result = party;
        });
        return result;
    }

}

module.exports = Game;
