import {inject} from 'aurelia-framework';
import {UnitClass} from 'unit';
import {GameService} from 'services/game.service';

@inject(GameService)
export class CreateCharacter {

    constructor(game) {
        this.game = game;
    }

    attached() {
        this.game.createCharacter('Durin', UnitClass.Assassin);
        this.game.createParty('Durins party');
        this.game.addAIPlayerToParty(UnitClass.Warrior);
        this.game.addAIPlayerToParty(UnitClass.Druid);
    }

    get player() {
        return this.game.player;
    }
}
