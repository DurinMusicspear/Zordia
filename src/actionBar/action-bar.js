import {inject, bindable, computedFrom} from 'aurelia-framework';
import {CombatService} from '../combat.service';

@inject(CombatService)
export class ActionBarCustomElement {
   @bindable actions;

    constructor(combat) {
        this.combat = combat;
    }

    executeAction(action) {
        this.combat.setActiveAction(action);
        this.combat.castCurrentAction();
    }

    // @computedFrom('combat.activeAction')
    isActiveAction(action) {
        return this.combat.activeAction === action;
    }

    attached() {

    }
}
