import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./seasons.component').then(m => m.SeasonsComponent),
    data: {
      title: $localize`Temporadas`
    }
  }
];

