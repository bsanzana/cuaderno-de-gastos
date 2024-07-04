import { Routes } from '@angular/router';

import { UsersComponent } from "./user.component";


export const routes: Routes = [
  // {
  //   path: '',
  //   loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
  //   data: {
  //     title: $localize`Usuarios de sistema`
  //   }
  // }
  // {
    // path: '',
    // data: {
    //   title: 'Administración',
    // },
    {
      path: '', 
      pathMatch: 'full', 
      redirectTo: 'usuarios'
    },
    {path: '',
    data: {
      title: 'Gestión de personas'
    },
    component: UsersComponent,
    children: [
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   redirectTo: 'usuarios',
      // },
      {
        path: 'usuarios',
        loadComponent: () => import('./workers/workers.component').then(m => m.WorkersComponent),
        data: {
          title: $localize`Usuarios`
        },
      },
      {
        path: 'productores',
        loadComponent: () => import('./producers/producers.component').then(m => m.ProducersComponent),
        data: {
          title: $localize`Productores`
        },
      },
      {
        path: 'grupo-productores',
        loadComponent: () => import('./producers-group/producers-group.component').then(m => m.GroupComponent),
        data: {
          title: $localize`Grupo de Productores`
        },
      },
      {
        path: 'especialistas',
        loadComponent: () => import('./specialist/specialist.component').then(m => m.SpecialistComponent),
        data: {
          title: $localize`Especialistas`
        },
      },
    ]
  }
];

