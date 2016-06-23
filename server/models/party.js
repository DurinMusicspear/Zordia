'use strict';

var uuid = require('node-uuid');

class Party {

    constructor(name, io) {
        this.io = io;
        this.id = uuid.v4();
        this.name = name;
        this.players = [];
    }

    addPlayer(player) {
        // this.players.push(player);
        player.socket.join(this.id);
        this.broadcast('playerJoinedParty', { id: player.id });
    }

    addAiPlayer(player) {
        this.broadcast('aiPlayerJoinedParty', { unitClass: player.class });
    }

    removePlayer(player) {
        player.socket.leave(this.id);
    }

    broadcast(action, data) {
        this.io.to(this.id).emit(action, data);
    }
}

module.exports = Party;
