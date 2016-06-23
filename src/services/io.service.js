import io from 'socket.io';
// import {inject} from 'aurelia-framework';
// import {GameService} from 'services/game.service';

// @inject(GameService)
export class IOService {

    constructor() {
        this.uuid = null;
    }

    setGame(game) {
        this.game = game;
    }

    connect() {
        this.socket = io('http://localhost:9000');
        this.socket.on('uuid', (data) => this.setUUID(data));
        this.socket.on('characterCreated', (character) => this.game.onCharacterCreated(character));
        this.socket.on('newPlayer', (player) => this.game.newPlayer(player));
    }

    setUUID(uuid) {
        this.uuid = uuid;
        this.socket.emit('setName', { name: 'Durin' });
    }

    createCharacter(name, unitClass) {
        this.socket.emit('createCharacter', { name: name, unitClass: unitClass });
    }
}
