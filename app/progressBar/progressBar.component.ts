import {Component, Input} from '@angular/core'
import {Unit} from '../unit'

@Component({
    selector: 'progress-bar',
    directives: [],
    template: `
        <div class="progress-bar">
            <div class="bar" [style.width]="percentStyle()"></div>
        </div>`,
    styles: [`
        progress-bar {
            display: block;
        }
        .progress-bar {
            height: 20px;
            width: 200px;
            position: relative;
            background: #eee
            border-radius: 2px;
            box-shadow:
                inset 1px 1px 5px rgba(0,0,0,0.1),
                inset 0px 0px 1px rgba(0,0,0,0.4);
        }
        .bar {
            height: 20px;
            border-radius: 2px;
            background-color: rgb(220,0,0);
            box-shadow: 
                inset 0 2px 9px  rgba(255,255,255,0.3),
                inset 0 -2px 6px rgba(0,0,0,0.4);
            position: relative;
            overflow: hidden;
        }
        .animate-bar .bar {
            transition: 0.2s ease-out;
            transition-property: width;
        }
    `],
})

export class ProgressBarComponent {
    @Input() unit: Unit;
    @Input() progress: Function;

    constructor() {}

    percentStyle() {
        return this.progress.bind(this.unit)() + '%';
    }
}
