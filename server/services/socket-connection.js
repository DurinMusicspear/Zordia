'use strict';

var uuid = require('node-uuid');
let Party = require('../models/party');

class SocketConnection {

    constructor(io, socket, game, networkEngine) {
        this.io = io;
        this.socket = socket;
        this.game = game;
        this.network = networkEngine;
        this.name = 'Unknown';

        this.id = uuid.v4();
        socket.emit('setId', this.id);

        console.log('Player connected: ' + this.id);

        this.listenForEvents();
    }

    listenForEvents() {
        var s = this.socket;

        s.on('disconnect', () => this.disconnect());
        s.on('setName', (player) => this.setName(player.name));
        s.on('createParty', (party) => this.createParty(party.name));
        s.on('joinParty', (party) => this.joinParty(party.id));
        s.on('addAIPlayerToParty', (data) => this.game.addAIPlayerToParty(data.unitClass, data.partyId));
    }

    disconnect() {
        console.log(this.name + ' disconected');
    }

    setName(name) {
        this.name = name;
        this.network.broadcastNewPlayer(this);
        console.log(this.id + ' is known as: ' + this.name);
    }

    createParty(name) {
        let party = new Party(name, this.io);
        party.addPlayer(this);
        this.game.addParty(party);
        this.socket.emit('partyCreated', { id: party.id });
        console.log('Create party: ' + name);
    }

    joinParty(partyId) {
        let party = this.game.getPartyById(partyId);
        party.addPlayer(this);
        this.socket.emit('partyJoined', {
            id: party.id,
            name: party.name,
            players: party.players
        });
        console.log('Join party: ' + partyId);
    }
}

module.exports = SocketConnection;
