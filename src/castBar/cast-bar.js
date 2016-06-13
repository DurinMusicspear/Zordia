import {bindable, computedFrom} from 'aurelia-framework';
import {Unit} from '../unit'

export class CastBarCustomElement {
    @bindable action;
    @bindable progress;

    constructor() {
    }

    @computedFrom('progress')
    get progressPercent() {
        if(this.action !== null)
            return (this.progress / this.action.castTime) * 100 + '%';

        return '0';
    }

    attached() {
        //console.log(this.progress.bind(this.unit)());
    }
}
