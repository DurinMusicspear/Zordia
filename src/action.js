export const TargetType = {
    Allied: 0,
    Enemy: 1,
    Self: 2
};

export const TargetPriority = {
    LeastHealth: 0
};

export class Action {

    constructor() {
        this.id = 0;
        this.name = '';
        this.castTime = 0;
        this.power = 0;
        this.cooldown = 0;
        this.cooldownRemaining = 0;
        this.owner = null;
        this.targetType = 0;
        this.targetPriority = 0;
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
