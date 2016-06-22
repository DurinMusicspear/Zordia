'use strict';

var uuid = require('node-uuid');

class SocketConnection {

    constructor(socket) {
        this.socket = socket;
        this.uuid = uuid.v4();
        socket.emit('uuid', this.uuid);
    }



}

module.exports = SocketConnection;
