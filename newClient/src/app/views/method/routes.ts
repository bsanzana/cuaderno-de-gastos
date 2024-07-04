import { Routes } from '@angular/router';

import { MethodComponent } from "./method.component";


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
      redirectTo: 'aplicacion'
    },
    {path: '',
    data: {
      title: 'Otros costos'
    },
    component: MethodComponent,
    children: [
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   redirectTo: 'usuarios',
      // },
      
      {
        path: 'aplicacion',
        loadComponent: () => import('./application/application.component').then(m => m.ApplicationComponent),
        data: {
          title: $localize`Otros costos`
        },
      },
      {
        path: 'mano-de-obra',
        loadComponent: () => import('./mano-de-obra/sowing.component').then(m => m.SowingComponent),
        data: {
          title: $localize`Mano de obra`
        },
      }
    ]
  }
];

