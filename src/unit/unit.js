import {inject, bindable} from 'aurelia-framework';
import {Unit} from '../unit';
import {CombatService} from '../combat.service';

@inject(CombatService)
export class UnitCustomElement {
    @bindable unit;

    constructor(combat) {
        this.combat = combat;
    }

    selectUnit() {
        if (this.combat.activeAction != null) {
            this.combat.castCurrentAction(this.unit);
        } else
            this.combat.selectedUnit = this.unit;
    }

    isSelectedUnit() {
        return this.unit == this.combat.selectedUnit;
    }

    getTarget() {
        if (this.unit.actionTarget != null)
            return this.unit.actionTarget;
        return this.unit.target;
    }

    jsonUnit() {
        return JSON.stringify(this);
    }

    get unitImage() {
        return 'url(images/' + this.unit.image + ')';
    }
}
