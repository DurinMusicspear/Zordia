

export class Party {

    constructor(name) {
        this.name = name;
        this.id = null;
        this.players = [];
    }

    addPlayer(unit) {
        this.players.push(unit);
    }
}
