import {Unit} from './unit';

export enum TargetType {
    Allied,
    Enemy,
    Self
}

export enum TargetPriority {
    LeastHealth
}

export class Action {
    id: number;
    name: string;
    castTime: number;
    power: number;
    cooldown: number;
    cooldownRemaining: number;
    owner: Unit;
    targetType: TargetType;
    targetPriority: TargetPriority;

    constructor() {

    }

    startCooldown() {
        this.cooldownRemaining = this.cooldown;
    }

    reduceCooldown(dt: number) {
        if (this.cooldownRemaining > 0) {
            this.cooldownRemaining -= dt;
            if (this.cooldownRemaining < 0)
                this.cooldownRemaining = 0;
        }
    }
}