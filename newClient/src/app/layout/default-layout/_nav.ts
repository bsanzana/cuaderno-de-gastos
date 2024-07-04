import { INavData } from '@coreui/angular-pro';

export const navItems: INavData[] = [
  // {
  //   name: 'Panel',
  //   url: '/panel',
  //   iconComponent: { name: 'cil-speedometer' },
  //   // badge: {
  //   //   color: 'info',
  //   //   text: 'NEW'
  //   // }
  // },

  {
    title: true,
    name: 'Registros',
  },
  {
    name: 'Cuaderno de campo',
    url: '/cuaderno',
    iconComponent: { name: 'cil-speedometer' },
  },

  {
    title: true,
    name: 'Mantenedores',
  },
  {
    name: 'Labores',
    url: '/labores',
  },
  {
    name: 'Insumos',
    url: '/productos',
  },
  {
    name: 'Semillas',
    url: '/semillas',
  },
  {
    name: 'Maquinarias',
    url: '/maquinarias',
  },
  {
    name: 'Otros costos',
    url: '/metodos',
  },
  {
    name: 'Administración',
    url: '/administracion',
    iconComponent: { name: 'cil-star' },
    children: [
      // {
      //   name: 'Productores',
      //   url: '/login',
      // },
      {
        name: 'Gestión de personas',
        url: '/administracion/gestion/productores',
      },
      {
        name: 'Temporadas',
        url: '/administracion/temporadas',
      },
    ],
  },

  // {
  //   title: true,
  //   name: 'Extras'
  // },
  // {
  //   name: 'Pages',
  //   url: '/login',
  //   iconComponent: { name: 'cil-star' },
  //   children: [
  //     {
  //       name: 'Login',
  //       url: '/login',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Error 404',
  //       url: '/404',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Error 500',
  //       url: '/500',
  //       icon: 'nav-icon-bullet'
  //     }
  //   ]
  // }
];
