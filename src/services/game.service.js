import {inject} from 'aurelia-framework';
// import {UnitClass} from 'unit';
// import {ActionType} from 'action';
import {SettingService} from 'services/setting.service';
import {CombatService} from 'services/combat.service';
import {UnitFactoryService} from 'services/unit-factory.service';
import {MonsterFactoryService} from 'services/monster-factory.service';
import {IOService} from 'services/io.service';

@inject(SettingService, CombatService, UnitFactoryService, MonsterFactoryService, IOService)
export class GameService {

    constructor(settings, combat, unitFactory, monsterFactory, ioService) {
        this.settings = settings;
        this.combat = combat;
        this.unitFactory = unitFactory;
        this.monsterFactory = monsterFactory;
        this.ioService = ioService;

        this.player = null;
        this.players = [];
        this.playerUnits = [];
        this.enemyUnits = [];
        this.actions = [];

        this.ioService.setGame(this);
        this.ioService.connect();

        // this.createMonsterUnit(1);

        // this.createPlayerUnit(UnitClass.Warrior);
        // this.createPlayerUnit(UnitClass.Rogue);
        // this.createPlayerUnit(UnitClass.Druid);

        // this.combat.playerUnits = this.playerUnits;
        // this.combat.enemyUnits = this.enemyUnits;

        // this.myKeyupCallback = this.hotkeyPress.bind(this);
    }

    createCharacter(name, unitClass) {
        this.ioService.createCharacter(name, unitClass);
    }

    onCharacterCreated(character) {
        this.player = character;
        console.log(character);
    }

    createParty(name) {

    }

    addAIPlayerToParty(unitClass) {

    }

    newPlayer(player) {
        this.players.push(player);
        console.log('Player connected: ', player);
    }

    // createMonsterUnit(monsterId) {
    //     let monster = this.monsterFactory.createMonster(monsterId);
    //     this.enemyUnits.push(monster);
    // }

    // createPlayerUnit(unitClass) {
    //     let player = this.unitFactory.createUnit(unitClass);
    //     player.actions.forEach(action => {
    //         if (action.actionType !== ActionType.OnHit)
    //             this.actions.push(action);
    //     });
    //     this.playerUnits.push(player);
    // }
}
