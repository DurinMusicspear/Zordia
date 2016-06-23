import io from 'socket.io';
import {log} from '../services/log.js';
// import {inject} from 'aurelia-framework';
// import {GameService} from 'services/game.service';

// @inject(GameService)
export class IOService {

    constructor() {
        this.id = null;
    }

    setGame(game) {
        this.game = game;
    }

    connect() {
        this.socket = io('http://localhost:9000');
        this.socket.on('setId', (id) => this.setId(id));
        this.socket.on('characterCreated', (character) => this.game.onCharacterCreated(character));
        this.socket.on('newPlayer', (player) => this.game.onNewPlayerConnected(player));
        this.socket.on('partyCreated', (party) => this.game.onPartyCreated(party.id));
        this.socket.on('partyJoined', (party) => this.game.onPartyJoined(party.id, party.name, party.players));
        this.socket.on('playerJoinedParty', (player) => this.game.onPlayerJoinedParty(player.id));
        this.socket.on('aiPlayerJoinedParty', (data) => this.game.onAiPlayerJoinedParty(data.unitClass));
    }

    setId(id) {
        this.id = id;
        this.socket.emit('setName', { name: 'Durin' });
    }

    createCharacter(name, unitClass) {
        this.socket.emit('createCharacter', { name: name, unitClass: unitClass });
    }

    createParty(name) {
        this.socket.emit('createParty', { name: name });
    }

    joinParty(id) {
        this.socket.emit('joinParty', { id: id });
    }

    addAIPlayerToParty(unitClass, partyId) {
        this.socket.emit('addAIPlayerToParty', {
            unitClass: unitClass,
            partyId: partyId
        });
    }
}
