import {inject, bindable, BindingEngine} from 'aurelia-framework';
import {CombatService} from 'services/combat.service';
import {CombatLogService} from 'services/combat-log.service';

@inject(BindingEngine, CombatService, CombatLogService)
export class UnitCustomElement {
    @bindable unit;

    constructor(bindingEngine, combat, combatLog) {
        this.bindingEngine = bindingEngine;
        this.combat = combat;
        this.combatLog = combatLog;
        this.unit = null;
        this.combatLogDisplay = [];

        let callback = this.onChangeUnit.bind(this);
        this.bindingEngine
            .propertyObserver(this, 'unit')
            .subscribe(callback);
    }

    onChangeUnit(newValue, oldValue) {
        if (this.unit !== null) {
            let callback = this.onAddCombatLogItem.bind(this);
            let unitLog = this.combatLog.createNewUnit(this.unit);
            this.combatLogItems = unitLog.displayLog;
            this.bindingEngine
                .collectionObserver(this.combatLogItems)
                .subscribe(callback);
        }
    }

    onAddCombatLogItem(splices) {
        splices.forEach(splice => {
            for (let i = splice.index; i < splice.index + splice.addedCount; i++) {
                // console.log(this.combatLogItems[i]);
                let displayItem = {
                    text: '-' + this.combatLogItems[i].damage,
                    xPos: this.getRandomInt(0, 75) + '%'
                };
                this.combatLogDisplay.push(displayItem);
                setTimeout(() => {
                    this.combatLogDisplay.shift();
                }, 2000);
            }
        });
    }

    selectUnit() {
        if (this.combat.activeAction !== null) {
            this.combat.castCurrentAction(this.unit);
        } else
            this.combat.selectedUnit = this.unit;
    }

    isSelectedUnit() {
        return this.unit === this.combat.selectedUnit;
    }

    getTarget() {
        if (this.unit.actionTarget !== null)
            return this.unit.actionTarget;
        return this.unit.target;
    }

    jsonUnit() {
        return JSON.stringify(this);
    }

    get unitImage() {
        return 'url(images/' + this.unit.image + ')';
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
