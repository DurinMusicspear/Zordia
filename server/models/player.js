'use strict';

let Unit = require('./unit').Unit;
let UnitClass = require('./unit').UnitClass;

class Player extends Unit {

    constructor(settings, socket) {
        super(settings);
        this.socket = socket;
        this.isAiPlayer = false;

        this.class = UnitClass.Warrior;
        this.threatMultiplier = 1;
    }

}

module.exports = Player;
