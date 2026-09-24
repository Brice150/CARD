import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Enterprise } from '../core/interfaces/enterprise';
import { enterprise } from '../shared/data/enterprise';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  readonly enterprise: Enterprise = enterprise;
  readonly year = new Date().getFullYear();
}
