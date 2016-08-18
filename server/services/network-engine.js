'use strict';

let SocketConnection = require('../services/socket-connection');

class NetworkEngine {

    constructor(io, game) {
        this.io = io;
        this.game = game;

        this.listenForEvents();
    }

    listenForEvents() {
        this.io.on('connection', (socket) => this.socketConnected(socket));
    }

    socketConnected(socket) {
        new SocketConnection(this.io, socket, this.game, this, this.game.unitFactory);
    }

    broadcastCharacterCreated(unit) {
        this.io.emit('broadcast.characterCreated', {
            id: unit.id,
            name: unit.name
        });
    }
}

module.exports = NetworkEngine;
