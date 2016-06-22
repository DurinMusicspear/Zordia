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
        this.socket.on('uuid', (data) => {
            console.log(data);
            this.uuid = data;
        });

        this.socket.on('characterCreated', (character) => {
            this.game.onCharacterCreated(character);
        });
    }

    createCharacter(name, unitClass) {
        this.socket.emit('createCharacter', { name: name, unitClass: unitClass });
    }
}
