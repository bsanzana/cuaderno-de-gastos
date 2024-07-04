import { Routes } from '@angular/router';

import { ProductsComponent } from "./products.component";


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
      title: 'Productos'
    },
    component: ProductsComponent,
    children: [
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   redirectTo: 'usuarios',
      // },
      
      {
        path: 'listado',
        loadComponent: () => import('./list/list.component').then(m => m.ProductsComponent),
        data: {
          title: $localize`Listado de productos`
        },
      },
      {
        path: 'categorias',
        loadComponent: () => import('./categorys/categorys.component').then(m => m.CategorysComponent),
        data: {
          title: $localize`Categorias`
        },
      }
    ]
  }
];

