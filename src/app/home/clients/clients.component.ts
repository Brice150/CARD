import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClientComponent } from './client/client.component';
import { Client } from '../../core/interfaces/client';
import { clients } from '../../shared/data/clients';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, ClientComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent {
  clients: Client[] = clients;
}
