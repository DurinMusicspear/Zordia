import io from 'socket.io';
import {inject} from 'aurelia-framework';
import {log} from 'services/log.js';
import {SettingService} from 'services/setting.service';
import {Unit} from 'models/unit';
// import {UnitFactoryService} from 'services/unit-factory.service';

@inject(SettingService)
export class IOService {

    constructor(settings) {
        this.id = null;
        this.settings = settings;
    }

    setGame(game) {
        this.game = game;
    }

    connect() {
        this.socket = io('http://localhost:9000');
        this.socket.on('socket.setId', (id) => this.setId(id));

        this.socket.on('player.onCreateCharacter', (unitBase) => this.playerOnCharacterCreated(unitBase));

        this.socket.on('party.onCreate', (party) => this.partyOnCreate(party.id));
        this.socket.on('party.onJoin', (party) => this.partyOnJoin(party.name, party.id, party.players));
        this.socket.on('party.onPlayerJoin', (unitBase) => this.partyOnPlayerJoin(unitBase));
        this.socket.on('party.onAiPlayerJoin', (unitBase) => this.partyOnAiPlayerJoin(unitBase));

        this.socket.on('broadcast.onCharacterCreated', (unitBase) => this.broadcastOnCharacterCreated(unitBase));

        this.socket.on('combat.onStart', (enemyUnitBases) => this.combatOnStart(enemyUnitBases));
    }

    setId(id) {
        this.id = id;

        this.game.createCharacter('Durin', 2);
    }

    playerOnCharacterCreated(unitBase) {
        this.game.player = new Unit(this.settings, unitBase);
        log.debug('Character created ', unitBase);

        this.game.createParty('Durins party');
    }


    // Party
    partyOnCreate(id) {
        let party = this.game.party;
        party.id = id;
        log.debug('Party created: ' + id);

        this.game.addAIPlayerToParty(0);
        this.game.addAIPlayerToParty(1);
    }

    partyOnJoin(name, id, players) {
        this.party = new Party(name);
        this.party.id = id;
        this.party.players = players;
        log.debug('Party joined: ' + id);
    }

    partyOnPlayerJoin(unit) {
        log.debug('Player joined party', unit);
    }

    partyOnAiPlayerJoin(unitBase) {
        // Create unit
        // Add to party
        let unit = new Unit(this.settings, unitBase);
        this.game.party.addPlayer(unit);
        log.debug('Add ai player: ', unitBase);

        if(this.game.party.players.length === 3)
            this.startCombat();
    }


    // Combat
    combatOnStart(enemyUnitBases) {
        enemyUnitBases.forEach(unitBase => {
            let unit = new Unit(this.settings, unitBase);
            this.game.combat.addEnemy(unit);
        })
        this.game.combat.start();
        log.debug('Combat started with: ', enemyUnitBases);
    }


    // Broadcasts
    broadcastOnCharacterCreated(unit) {
        log.debug('Player created character: ', unit);
    }


    // Commands
    createCharacter(name, unitClass) {
        this.socket.emit('player.createCharacter', { name: name, class: unitClass });
    }

    createParty(name) {
        this.socket.emit('party.create', { name: name });
    }

    joinParty(id) {
        this.socket.emit('party.join', { id: id });
    }

    addAIPlayerToParty(unitClass, partyId) {
        this.socket.emit('party.addAiPlayer', {
            unitClass: unitClass,
            partyId: partyId
        });
    }

    startCombat() {
        this.socket.emit('combat.start');
    }
}
