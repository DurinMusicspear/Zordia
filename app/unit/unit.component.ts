import {Component, Input} from '@angular/core'
import {Unit} from '../unit'
import {ProgressBarComponent} from '../progressBar/index'
import {CombatService} from '../combat.service'

@Component({
    selector: 'unit',
    directives: [ProgressBarComponent],
    templateUrl: 'app/unit/unit.html',
    styleUrls: ['app/unit/unit.css'],
})

export class UnitComponent {
    @Input() unit: Unit;

    constructor(private combat: CombatService) {

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
}
