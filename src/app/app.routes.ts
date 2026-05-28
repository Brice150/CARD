import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    data: { preload: true },
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'about',
    data: { preload: true },
    loadComponent: () =>
      import('./about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'contact',
    data: { preload: true },
    loadComponent: () =>
      import('./contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'contact/:category',
    data: { preload: true },
    loadComponent: () =>
      import('./contact/contact.component').then((m) => m.ContactComponent),
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
