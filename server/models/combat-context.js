'use strict';

// var uuid = require('node-uuid');
let Player = require('./player');
let Monster = require('./monster');

class CombatContext {

    constructor(party) {
        this.party = party;
        this.players = this.party.players;
        this.enemies = [];
    }

    addEnemy(unit) {
        this.enemies.push(unit);
    }

    findNewPlayerTarget(player) {
        player.target = null;
        this.enemies.forEach(enemy => {
            if (player.target === null && enemy.health > 0)
                player.setTarget(enemy);
        });
        if (player.target === null)
            this.stop();
    }

    findNewEnemyTarget(enemy) {
        enemy.target = null;
        this.players.forEach(player => {
            if (enemy.target === null && player.health > 0)
                enemy.setTarget(player);
        });
        if (enemy.target === null)
            this.stop();
    }

     findAllyWithLeastHealth(unit) {
        let leastUnit = null;
        let allies = this.players;
        if (!unit instanceof Player) {
            allies = this.enemies;
        }
        allies.forEach(u => {
            if (u.health > 0 && (leastUnit === null || u.getHealthPercent() < leastUnit.getHealthPercent())) {
                leastUnit = u;
            }
        });
        return leastUnit;
    }

    findRandomEnemy(unit) {
        let enemies = this.players;
        if (unit instanceof Player) {
            enemies = this.enemies;
        }
        let possibleTargets = [];
        enemies.forEach(enemy => {
            if (enemy.health > 0) {
                possibleTargets.push(enemy);
            }
        });

        if (possibleTargets.length > 0)
            return possibleTargets[this.getRandomIntInclusive(0, possibleTargets.length - 1)];

        return null;
    }

    getRandomIntInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

module.exports = CombatContext;
