import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./labors.component').then(m => m.LaborsComponent),
    data: {
      title: $localize`Labores`
    }
  }
];

