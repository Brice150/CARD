import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Enterprise } from '../core/interfaces/enterprise';
import { enterprise } from '../shared/data/enterprise';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  imagePath: string = environment.imagePath;
  enterprise: Enterprise = enterprise;
}
