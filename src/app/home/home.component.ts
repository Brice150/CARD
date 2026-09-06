import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from './card/card.component';
import { ClientsComponent } from './clients/clients.component';

@Component({
  selector: 'app-home',
  imports: [CardComponent, ClientsComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
