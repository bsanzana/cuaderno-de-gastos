import { Routes } from '@angular/router';

import { SeedsComponent } from "./seeds.component";


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
      redirectTo: 'listado'
    },
    {path: '',
    data: {
      title: 'Semillas'
    },
    component: SeedsComponent,
    children: [
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   redirectTo: 'usuarios',
      // },
      
      {
        path: 'listado',
        loadComponent: () => import('./list/list.component').then(m => m.SeedsComponent),
        data: {
          title: $localize`Listado de semillas`
        },
      },
      {
        path: 'tipos',
        loadComponent: () => import('./types/types.component').then(m => m.TypesComponent),
        data: {
          title: $localize`Tipos de semilla`
        },
      }
      ,
      {
        path: 'cultivos',
        loadComponent: () => import('./crop/crop.component').then(m => m.CropComponent),
        data: {
          title: $localize`Tipos de cultivos`
        },
      }
    ]
  }
];

