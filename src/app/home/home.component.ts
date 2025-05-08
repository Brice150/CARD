import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardComponent } from './card/card.component';
import { ClientsComponent } from './clients/clients.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, CardComponent, ClientsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
