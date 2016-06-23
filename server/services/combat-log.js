'use strict';

class CombatLog {

    constructor(settings) {
        this.settings = settings;
        this.logEntries = [];
        this.units = [];
    }

    clearLog() {
        this.units = [];
        this.logEntries = [];
    }

    logDamage(attacker, defender, damage) {
        let entry = {
            attacker: attacker.id,
            defender: defender.id,
            isDamageEntry: true,
            damage: damage
        };
        this.logEntries.push(entry);
        this.logDamageDoneByUnit(attacker, entry);
        this.logDamageTakenByUnit(defender, entry);
    }

    logDamageDoneByUnit(unit, entry) {
        let logUnit = this.getExistingOrNewLogUnit(unit);
        logUnit.totalDamage += entry.damage;
    }

    logDamageTakenByUnit(unit, entry) {
        let logUnit = this.getExistingOrNewLogUnit(unit);
        logUnit.totalDamageTaken += entry.damage;
        logUnit.displayLog.push(entry);
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
            totalHealingTaken: 0,
            displayLog: []
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

module.exports = CombatLog;
