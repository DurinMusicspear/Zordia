'use strict';

let Unit = require('./unit').Unit;

class Monster extends Unit {

    constructor(settings) {
        super(settings);
        this.threats = [];
    }

    increaseThreat(unit, threatValue) {
        let threat = this.findThreat(unit);
        if (threat === null) {
            threat = this.createNewThreat(unit);
        }
        threat.threat += threatValue * unit.threatMultiplier;
    }

    createNewThreat(unit) {
        let threat = {
            unit: unit,
            threat: 0
        };
        this.threats.push(threat);
        return threat;
    }

    findThreat(unit) {
        let result = null;
        this.threats.forEach(threat => {
            if (threat.unit === unit)
                result = threat;
        });
        return result;
    }

    findHighestThreatExcludingTarget() {
        let highest = null;
        this.threats.forEach(threat => {
            if ((highest === null || highest.threat < threat.threat) &&
                (threat.unit !== this.target && threat.unit.health > 0))
                highest = threat;
        });
        return highest;
    }

    findHighestThreat() {
        let highest = null;
        this.threats.forEach(threat => {
            if ((highest === null || highest.threat < threat.threat) &&
                threat.unit.health > 0)
                highest = threat;
        });
        return highest;
    }

    setThreatEqualToHighestThreat(unit) {
        let unitThreat = this.findThreat(unit);
        if (unitThreat === null) {
            unitThreat = this.createNewThreat(unit);
        }

        let highestThreat = this.findHighestThreat();
        if (highestThreat !== null) {
            unitThreat.threat = highestThreat.threat;
        }
    }
}

module.exports = Monster;
