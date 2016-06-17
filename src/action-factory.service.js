import {inject} from 'aurelia-framework';
import {SettingService} from './setting.service';
import {Action, ActionType, TargetType, TargetPriority} from './action';

@inject(SettingService)
export class ActionFactoryService {

    constructor(settings) {
        this.settings = settings;
    }

    createAction(actionId) {
        let action = new Action();
        action.id = actionId;

        switch (actionId) {
            case 1:
                action.name = 'HOT';
                action.castTime = 1;
                action.duration = 10;
                action.power = 200;
                action.targetType = TargetType.Allied;
                action.targetPriority = TargetPriority.LeastHealth;
                action.actionType = ActionType.OverTimeEffect;
                break;

            case 2:
                action.name = 'Heal';
                action.castTime = 3;
                action.power = 150;
                action.targetType = TargetType.Allied;
                action.targetPriority = TargetPriority.LeastHealth;
                break;

            case 3:
                action.name = 'Taunt';
                action.castTime = 1;
                action.targetType = TargetType.Enemy;
                break;

            case 4:
                action.name = 'Poison';
                action.power = 20;
                action.actionType = ActionType.OnHit;
                action.maxStacks = 5;
                action.duration = 10;
                break;

            case 5:
                action.name = 'Consume poison';
                action.power = 50;
                action.targetType = TargetType.Enemy;
                action.targetPriority = TargetPriority.CurrentTarget;
                action.actionType = ActionType.Direct;
                break;

            case 6:
                action.name = 'Heal & HOT';
                action.castTime = 1.5;
                action.power = 200;
                action.duration = 15;
                action.targetType = TargetType.Allied;
                action.targetPriority = TargetPriority.LeastHealth;
                action.actionType = ActionType.DirectAndOverTime;
                break;

            case 7:
                action.name = 'Frenzy';
                action.castTime = 0.5;
                action.duration = 10;
                action.power = 2;
                action.cooldown = 20;
                action.targetType = TargetType.Self;
                action.actionType = ActionType.OverTimeEffect;
                action.startCooldown();
                break;

            case 8:
                action.name = 'Shield wall';
                action.castTime = 0;
                action.power = 100;
                action.duration = 10;
                action.targetType = TargetType.Self;
                action.actionType = ActionType.OverTimeEffect;
                break;

            default:
                break;
        }

        return action;
    }
}
