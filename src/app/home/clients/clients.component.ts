import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClientComponent } from './client/client.component';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, ClientComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent {}
