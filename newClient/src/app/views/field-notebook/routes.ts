import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./field-notebook.component').then(m => m.fieldNotebookComponent),
    data: {
      title: $localize`Cuaderno de campo`
    }
  }
];

