import { Routes } from '@angular/router';
import { CardComponent } from './card/card.component';

export const routes: Routes = [
  { path: '', component: CardComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
