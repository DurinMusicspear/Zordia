'use strict';

var uuid = require('node-uuid');

class Party {

    constructor(name, io) {
        this.io = io;
        this.id = uuid.v4();
        this.name = name;
        this.players = [];
    }

    addPlayer(socket, unit) {
        this.players.push(unit);
        socket.join(this.id);
        this.broadcast('party.onPlayerJoin', unit.getBaseUnit());
    }

    addAiPlayer(unit) {
        this.players.push(unit);
        this.broadcast('party.onAiPlayerJoin', unit.getBaseUnit());
    }

    removePlayer(player) {
        // removeFromArray
        player.socket.leave(this.id);
    }

    broadcast(action, data) {
        this.io.to(this.id).emit(action, data);
    }
}

module.exports = Party;
