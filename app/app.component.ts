import {Directive, Component, OnInit, OnDestroy} from '@angular/core';
import {UnitComponent} from './unit/index';
import {ActionBarComponent} from './actionBar/index';
import {Unit, UnitClass} from './unit';
import {Action, TargetType, TargetPriority} from './action';
import {SettingService} from './setting.service';
import {CombatService} from './combat.service';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    directives: [UnitComponent, ActionBarComponent],
    host: { '(document:keyup)': 'hotkeyPress($event)' }
})

export class AppComponent implements OnInit, OnDestroy {
    playerUnits: Unit[] = [];
    enemyUnits: Unit[] = [];
    actions: Action[] = [];

    constructor(
        private settings: SettingService,
        private combat: CombatService) {
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
        this.playerUnits.push(player);

        player = new Unit(this.settings);
        player.name = "Frerin";
        player.class = UnitClass.Warrior;
        this.playerUnits.push(player);

        player = new Unit(this.settings);
        player.name = "DT";
        player.class = UnitClass.Druid;
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

    ngOnInit() {
        this.combat.start()
    }

    ngOnDestroy() {
        this.combat.stop();
    }

    hotkeyPress(event: KeyboardEvent) {
        switch (event.keyCode) {
            case 81:
                this.combat.setActiveAction(this.actions[0]);
                break;
            case 87:
                this.combat.setActiveAction(this.actions[1]);
                break;
            case 69:
                this.combat.setActiveAction(this.actions[2]);
                break;
            case 82:
                this.combat.setActiveAction(this.actions[3]);
                break;
        }
    }
};
