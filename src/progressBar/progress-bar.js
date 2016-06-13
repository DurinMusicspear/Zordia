import {bindable, computedFrom} from 'aurelia-framework';
import {Unit} from '../unit'

export class ProgressBarCustomElement {
    @bindable currentValue;
    @bindable maxValue;

    constructor() {
    }

    @computedFrom('currentValue', 'maxValue')
    get progressPercent() {
        if(this.maxValue > 0)
            return (this.currentValue / this.maxValue) * 100 + '%';

        return '0';
    }

    attached() {
        //console.log(this.progress.bind(this.unit)());
    }
}
