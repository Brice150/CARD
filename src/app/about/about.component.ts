import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Good } from '../core/interfaces/good';
import { goods } from '../shared/data/goods';
import { GoodComponent } from './good/good.component';

@Component({
  selector: 'app-about',
  imports: [CommonModule, GoodComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  goods: Good[] = goods;
}
