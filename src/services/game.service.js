import {inject} from 'aurelia-framework';
import {log} from '../services/log.js';
import {SettingService} from 'services/setting.service';
import {CombatService} from 'services/combat.service';
import {UnitFactoryService} from 'services/unit-factory.service';
import {MonsterFactoryService} from 'services/monster-factory.service';
import {IOService} from 'services/io.service';
import {Party} from 'models/party';
import {UnitClass} from 'models/unit';


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
        this.party = null;

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

    createParty(name) {
        this.ioService.createParty(name);
        this.party = new Party(name);
        this.party.addPlayer(this.player);
    }

    joinParty(id) {
        this.ioService.joinParty(id);
    }

    addAIPlayerToParty(unitClass) {
        this.ioService.addAIPlayerToParty(unitClass, this.party.id);
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
