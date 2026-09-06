import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Client } from '../../core/interfaces/client';
import { clients } from '../../shared/data/clients';
import { ClientComponent } from './client/client.component';

@Component({
  selector: 'app-clients',
  imports: [ClientComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsComponent {
  readonly clients: Client[] = clients;
}
