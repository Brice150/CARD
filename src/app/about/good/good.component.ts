import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Good } from '../../core/interfaces/good';

@Component({
  selector: 'app-good',
  templateUrl: './good.component.html',
  styleUrl: './good.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoodComponent {
  readonly good = input.required<Good>();
  readonly imagePath = environment.imagePath + 'goods/';
}
