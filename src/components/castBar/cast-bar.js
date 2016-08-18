import {bindable, computedFrom} from 'aurelia-framework';

export class CastBarCustomElement {
    @bindable action;
    @bindable progress;

    constructor() {
    }

    @computedFrom('progress')
    get progressPercent() {
        if (this.action)
            return (this.progress / this.action.castTime) * 100 + '%';

        return '0';
    }

    attached() {
        //console.log(this.progress.bind(this.unit)());
    }
}
