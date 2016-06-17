import {inject} from 'aurelia-framework';
import {SettingService} from './setting.service';

@inject(SettingService)
export class CombatLogService {

    constructor(settings) {
        this.settings = settings;
        this.logEntries = [];
        this.units = [];
    }

    logDamage(attacker, defender, damage) {
        let entry = {
            attacker: attacker.id,
            defender: defender.id,
            isDamageEntry: true,
            damage: damage
        };
        this.logEntries.push(entry);
        this.logDamageDoneByUnit(attacker, damage);
        this.logDamageTakenByUnit(defender, damage);
    }

    logDamageDoneByUnit(unit, damage) {
        let logUnit = this.getExistingOrNewLogUnit(unit);
        logUnit.totalDamage += damage;
    }

    logDamageTakenByUnit(unit, damage) {
        let logUnit = this.getExistingOrNewLogUnit(unit);
        logUnit.totalDamageTaken += damage;
    }

    getExistingOrNewLogUnit(unit) {
        let logUnit = this.getUnitById(unit.id);
        if (logUnit === null) {
            logUnit = this.createNewUnit(unit);
        }
        return logUnit;
    }

    createNewUnit(unit) {
        let logUnit = {
            id: unit.id,
            unit: unit,
            totalDamage: 0,
            totalHealing: 0,
            totalDamageTaken: 0,
            totalHealingTaken: 0
        };
        this.units.push(logUnit);
        return logUnit;
    }

    getUnitById(unitId) {
        let result = null;
        this.units.forEach(unit => {
            if (unit.id === unitId)
                result = unit;
        });
        return result;
    }

    get statisticsPerUnit() {
        return this.units;
    }

    get allLogEntries() {
        return this.logEntries;
    }
}
