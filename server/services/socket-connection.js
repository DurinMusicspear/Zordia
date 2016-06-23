'use strict';

var uuid = require('node-uuid');

class SocketConnection {

    constructor(io, socket, game, networkEngine) {
        this.io = io;
        this.socket = socket;
        this.game = game;
        this.network = networkEngine;
        this.name = 'Unknown';

        this.uuid = uuid.v4();
        socket.emit('uuid', this.uuid);

        console.log('Player connected: ' + this.uuid);

        this.listenForEvents();
    }

    listenForEvents() {
        var s = this.socket;

        s.on('disconnect', () => this.disconnect);
        s.on('setName', (data) => this.setName(data));
    }

    disconnect() {
        console.log(this.name + ' disconected');
    }

    setName(data) {
        this.name = data.name;
        console.log(this.uuid + ' is known as: ' + this.name);
        this.network.broadcastNewPlayer(this);
    }
}

module.exports = SocketConnection;
