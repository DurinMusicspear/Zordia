import {inject} from 'aurelia-framework';
import {Unit, UnitClass} from './unit';
import {Action, TargetType, TargetPriority} from './action';
import {SettingService} from './setting.service';
import {CombatService} from './combat.service';

@inject(SettingService, CombatService)
export class App {
    playerUnits = [];
    enemyUnits = [];
    actions = [];

    constructor(settings, combat) {
        this.settings = settings;
        this.combat = combat;

        for (var i = 0; i < 3; i++) {
            // var player = new Unit(this.settings);
            var enemy = new Unit(this.settings);
            // player.name = "player" + i;
            //enemy.setTarget(player);
            enemy.name = "monster" + i;
            // this.playerUnits.push(player);
            this.enemyUnits.push(enemy);
            //player.setTarget(this.enemyUnits[0]);
        }

        var player = new Unit(this.settings);
        player.name = "Durin";
        player.class = UnitClass.Rogue;
        player.image = "2hxq2k6.png";
        this.playerUnits.push(player);

        player = new Unit(this.settings);
        player.name = "Frerin";
        player.class = UnitClass.Warrior;
        player.image = "Gillian.jpg";
        this.playerUnits.push(player);

        player = new Unit(this.settings);
        player.name = "DT";
        player.class = UnitClass.Druid;
        player.image = "So_66097f_5598514.jpg";
        this.playerUnits.push(player);

        var action = new Action();
        action.id = 1;
        action.name = "HOT";
        action.castTime = 0;
        action.power = 200;
        action.targetType = TargetType.Allied;
        action.targetPriority = TargetPriority.LeastHealth;
        this.actions.push(action);
        this.playerUnits[0].addAction(action);

        action = new Action();
        action.id = 2;
        action.name = "Heal";
        action.castTime = 2;
        action.power = 100;
        action.targetType = TargetType.Allied;
        action.targetPriority = TargetPriority.LeastHealth;
        this.actions.push(action);
        this.playerUnits[0].addAction(action);

        action = new Action();
        action.id = 3;
        action.name = "Taunt";
        action.castTime = 1;
        action.targetType = TargetType.Enemy;
        this.actions.push(action);
        this.playerUnits[2].addAction(action);

        this.combat.playerUnits = this.playerUnits;
        this.combat.enemyUnits = this.enemyUnits;
    }

    attached() {
        this.combat.start()
    }

    detached() {
        this.combat.stop();
    }

    // hotkeyPress(event: KeyboardEvent) {
    //     switch (event.keyCode) {
    //         case 81:
    //             this.combat.setActiveAction(this.actions[0]);
    //             break;
    //         case 87:
    //             this.combat.setActiveAction(this.actions[1]);
    //             break;
    //         case 69:
    //             this.combat.setActiveAction(this.actions[2]);
    //             break;
    //         case 82:
    //             this.combat.setActiveAction(this.actions[3]);
    //             break;
    //     }
    // }
}
