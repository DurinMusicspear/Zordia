import {bootstrap}    from '@angular/platform-browser-dynamic';
import {AppComponent} from './app.component';
import {SettingService} from './setting.service';
import {CombatService} from './combat.service';

bootstrap(AppComponent, [SettingService, CombatService]);
