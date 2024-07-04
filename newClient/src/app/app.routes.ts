import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'panel',
    pathMatch: 'full'
  },
  
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Inicio'
    },
    children: [
      {
        path: 'panel',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },

      {
        path: 'cuaderno',
        loadChildren: () => import('./views/field-notebook/routes').then((m) => m.routes)
      },

      {
        path: 'metodos',
        loadChildren: () => import('./views/method/routes').then((m) => m.routes)
      },
      {
        path: 'semillas',
        loadChildren: () => import('./views/seeds/routes').then((m) => m.routes)
      },
      {
        path: 'productos',
        loadChildren: () => import('./views/products/routes').then((m) => m.routes)
      },

      {
        path: 'administracion/gestion',
        loadChildren: () => import('./views/user/routes').then((m) => m.routes)
      },
      {
        path: 'labores',
        loadChildren: () => import('./views/labors/routes').then((m) => m.routes)
      },
      {
        path: 'maquinarias',
        loadChildren: () => import('./views/machinery/routes').then((m) => m.routes)
      },
      {
        path: 'administracion/temporadas',
        loadChildren: () => import('./views/seasons/routes').then((m) => m.routes)
      },
      
      // {
      //   path: 'trabajadores',
      //   loadChildren: () => import('./views/trabajadores/routes').then((m) => m.routes)
      // },
      
    ]
  },
  {
    path: 'view-producer',
    loadComponent: () => import('./views/view-producer/view-producer.component').then(m => m.ViewProducerComponent),
    data: {
      title: 'Página de productor'
    }
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  { path: '**', redirectTo: '404' }
];
