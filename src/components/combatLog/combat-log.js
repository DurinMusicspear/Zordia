import numeral from 'numeral';
import {inject, computedFrom} from 'aurelia-framework';
import {CombatLogService} from '../combat-log.service';
import {BindingSignaler} from 'aurelia-templating-resources';


@inject(CombatLogService, BindingSignaler)
export class CombatLogCustomElement {

    constructor(combatLog, signaler) {
        this.combatLog = combatLog;
        this.units = this.combatLog.statisticsPerUnit;
        setInterval(() => signaler.signal('sort-signal'), 1000);
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

    // @computedFrom('maxUnitDamage')
    totalDamagePercent(unit) {
        if (this.maxUnitDamage > 0)
            return numeral((unit.totalDamage / this.maxUnitDamage) * 100).format('0.0') + '%';
        return '0';
    }

    // @computedFrom('maxUnitDamageTaken')
    totalDamageTakenPercent(unit) {
        if (this.maxUnitDamageTaken > 0)
            return numeral((unit.totalDamageTaken / this.maxUnitDamageTaken) * 100).format('0.0') + '%';
        return '0';
    }
}
