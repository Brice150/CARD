import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Client } from '../../../core/interfaces/client';

@Component({
  selector: 'app-client',
  imports: [RouterLink],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientComponent {
  readonly client = input.required<Client>();
}
