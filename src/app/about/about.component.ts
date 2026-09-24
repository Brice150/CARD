import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Good } from '../core/interfaces/good';
import { goods } from '../shared/data/goods';
import { GoodComponent } from './good/good.component';

@Component({
  selector: 'app-about',
  imports: [GoodComponent, RouterLink],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  readonly goods: Good[] = goods;
}
