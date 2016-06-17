import numeral from 'numeral';
import {inject, bindable} from 'aurelia-framework';
import {CombatLogService} from '../combat-log.service';
import {BindingSignaler} from 'aurelia-templating-resources';


@inject(CombatLogService, BindingSignaler)
export class CombatLogCustomElement {

    constructor(combatLog, signaler) {
        this.combatLog = combatLog;
        this.units = this.combatLog.statisticsPerUnit;
        setInterval(() => signaler.signal("sort-signal"), 1000);  
    }

    // @computedFrom('progress')
    get maxUnitDamage() {
        let max = 0;
        this.units.forEach(unit => {
            if (unit.totalDamage > max)
                max = unit.totalDamage;
        });
        return max;
    }

    get maxUnitDamageTaken() {
        let max = 0;
        this.units.forEach(unit => {
            if (unit.totalDamageTaken > max)
                max = unit.totalDamageTaken;
        });
        return max;
    }

    totalDamagePercent(unit) {
        return numeral((unit.totalDamage / this.maxUnitDamage) * 100).format('0.0') + '%';
    }

    totalDamageTakenPercent(unit) {
        return numeral((unit.totalDamageTaken / this.maxUnitDamageTaken) * 100).format('0.0') + '%';
    }
}
