import {inject} from 'aurelia-framework';
import {UnitClass} from 'models/unit';
import {GameService} from 'services/game.service';

@inject(GameService)
export class CreateCharacter {

    constructor(game) {
        this.game = game;
    }

    attached() {
        // this.game.createCharacter('Durin', UnitClass.Assassin);
        // this.game.createParty('Durins party');
    }

    get player() {
        return this.game.player;
    }

    get players() {
        return this.game.players;
    }

    get party() {
        return this.game.party;
    }
}
