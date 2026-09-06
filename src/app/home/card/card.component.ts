import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Enterprise } from '../../core/interfaces/enterprise';
import { enterprise } from '../../shared/data/enterprise';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly imagePath = environment.imagePath;
  readonly enterprise: Enterprise = enterprise;
}
