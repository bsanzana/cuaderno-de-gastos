import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./machinery.component').then(m => m.MachineryComponent),
    data: {
      title: $localize`Maquinarias`
    }
  }
];

