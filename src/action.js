import {Unit} from './unit';

export var TargetType = {
    Allied: 0,
    Enemy: 1,
    Self: 2
}

export var TargetPriority = {
    LeastHealth: 0
}

export class Action {
    id = 0;
    name = '';
    castTime = 0;
    power = 0;
    cooldown = 0;
    cooldownRemaining = 0;
    owner = null;
    targetType = 0;
    targetPriority = 0;

    constructor() {

    }

    startCooldown() {
        this.cooldownRemaining = this.cooldown;
    }

    reduceCooldown(dt) {
        if (this.cooldownRemaining > 0) {
            this.cooldownRemaining -= dt;
            if (this.cooldownRemaining < 0)
                this.cooldownRemaining = 0;
        }
    }
}