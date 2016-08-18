'use strict';

var uuid = require('node-uuid');
let Party = require('../models/party');
let CombatContext = require('../models/combat-context');

class SocketConnection {

    constructor(io, socket, game, networkEngine, unitFactory) {
        this.io = io;
        this.socket = socket;
        this.game = game;
        this.network = networkEngine;
        this.unitFactory = unitFactory;
        this.id = uuid.v4();
        this.unit = null;
        this.party = null;

        socket.emit('socket.setId', this.id);

        console.log('Socket connected: ' + this.id);

        this.listenForEvents();
    }

    listenForEvents() {
        var s = this.socket;

        s.on('disconnect', () => this.disconnected());

        s.on('player.createCharacter', (unit) => this.createCharacter(unit.class, unit.name));

        s.on('party.create', (party) => this.createParty(party.name));
        s.on('party.join', (party) => this.joinParty(party.id));
        s.on('party.addAiPlayer', (data) => this.addAIPlayerToParty(data.unitClass, data.partyId));

        s.on('combat.start', () => this.combatStart());
    }

    disconnected() {
        console.log('Socket disconnected: ' + this.id);
    }

    createCharacter(unitClass, name) {
        console.log('Created character ' + name + ' class: ' + unitClass);
        let unit = this.unitFactory.createUnit(unitClass);
        this.unit = unit;
        unit.name = name;
        this.network.broadcastCharacterCreated(unit);
        this.game.addPlayer(unit);
        this.socket.emit('player.onCreateCharacter', unit.getBaseUnit());
    }


    // Party
    createParty(name) {
        console.log('Create party: ' + name);
        let party = new Party(name, this.io);
        party.addPlayer(this.socket, this.unit);
        this.game.addParty(party);
        this.party = party;
        this.socket.emit('party.onCreate', { id: party.id });
    }

    joinParty(partyId) {
        let party = this.game.getPartyById(partyId);
        party.addPlayer(this.unit);
        this.party = party;
        this.socket.emit('party.onJoin', {
            id: party.id,
            name: party.name,
            players: party.players
        });
        console.log(this.unit.name + ' joined party ' + party.name);
    }

    addAIPlayerToParty(unitClass, partyId) {
        let party = this.game.getPartyById(partyId);
        let unit = this.game.unitFactory.createUnit(unitClass);
        unit.isAiPlayer = true;
        party.addAiPlayer(unit);
        console.log('Add ai player to party: ' + unit.class + ' ' + party.name);
    }


    // Combat
    combatStart() {
        let enemy = this.game.monsterFactory.createMonster(1);
        let combatContext = new CombatContext(this.party);
        combatContext.addEnemy(enemy);
        this.game.combat.addCombatContext(combatContext);
        let enemies = [];
        enemies.push(enemy.getBaseUnit());
        this.party.broadcast('combat.onStart', enemies);
    }
}

module.exports = SocketConnection;
