import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Good } from '../../core/interfaces/good';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-good',
  imports: [CommonModule],
  templateUrl: './good.component.html',
  styleUrl: './good.component.css',
})
export class GoodComponent {
  @Input() good!: Good;
  imagePath: string = environment.imagePath + 'goods/';
}
