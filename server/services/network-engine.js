'use strict';

let SocketConnection = require('../services/socket-connection');

class NetworkEngine {

    constructor(io, game) {
        this.io = io;
        this.game = game;

        this.listenForEvents();
    }

    listenForEvents() {
        this.io.on('connection', (socket) => this.playerConnected(socket));
    }

    playerConnected(socket) {
        var player = new SocketConnection(this.io, socket, this.game, this);
        this.game.playerConnected(player);
    }

    broadcastNewPlayer(player) {
        this.io.emit('newPlayer', {
            uuid: player.uuid,
            name: player.name
        });
    }
}

module.exports = NetworkEngine;
