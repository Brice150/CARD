import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Client } from '../../../core/interfaces/client';

@Component({
  selector: 'app-client',
  imports: [CommonModule, RouterModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent {
  readonly client = input.required<Client>();
}
