import {Component, Input} from '@angular/core'
import {Action} from '../action'
import {CombatService} from '../combat.service'

@Component({
    selector: 'action-bar',
    directives: [],
    templateUrl: 'app/actionBar/actionBar.html',
    styleUrls: ['app/actionBar/actionBar.css'],
})

export class ActionBarComponent {
    @Input() actions: Action[];

    constructor(private combat: CombatService) {

    }

    executeAction(action: Action) {
        this.combat.setActiveAction(action);
        this.combat.castCurrentAction();
    }

    isActiveAction(action: Action) {
        return this.combat.activeAction == action;
    }
}
