import { NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterConfig, ToasterModule, ToasterService } from 'angular-toaster';

import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  FormModule,
  GutterDirective,
  MultiSelectModule,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  SharedModule,
  TableDirective,
  TextColorDirective,
} from '@coreui/angular-pro';

import { AuthenticationService } from '../../services/authentication.service';
import { ExcelService } from '../../services/excel.service';
import { fieldNotebookService } from '../../services/field-notebook.service';
import { Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEye,
  faPenToSquare,
  faTrash,
  faFileExcel,
  faPlus,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';

import { AgregarModalComponent } from './agregar-modal/agregar-modal.component';
import { VerModalComponent } from './ver-modal/ver-modal.component';
import { EditarModalComponent } from './editar-modal/editar-modal.component';

import { DescargarSabanaComponent } from './descargar-sabana/descargar-sabana.component';
import { WorkService } from 'src/app/services/work.service';
import { SeedService } from 'src/app/services/seed.service';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { CompanyGroupService } from 'src/app/services/company-group.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-field-notebook',
  templateUrl: 'field-notebook.component.html',
  // styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [
    ToasterModule,
    NgbModule,
    FontAwesomeModule,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    ReactiveFormsModule,
    ButtonGroupComponent,
    FormCheckLabelDirective,
    NgStyle,
    CardFooterComponent,
    GutterDirective,
    ProgressBarDirective,
    ProgressComponent,
    CardHeaderComponent,
    TableDirective,
    AvatarComponent,
    DescargarSabanaComponent,
    FormsModule,
    FormModule,
    MultiSelectModule,
    SharedModule,
  ],
  providers: [
    WorkService,
    AuthenticationService,
    fieldNotebookService,
    ExcelService,
    SeedService,
    ProductService,
    CategoryService,
    CompanyGroupService,
    UserService,
  ],
})
export class fieldNotebookComponent implements OnInit {
  faEye = faEye;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faFileExcel = faFileExcel;
  faPlus = faPlus;
  faDownload = faDownload;

  public config: ToasterConfig = new ToasterConfig({
    mouseoverTimerStop: true,
    timeout: 2000,
    animation: 'fade',
    limit: 4,
  });

  readonly #authenticationService: AuthenticationService = inject(
    AuthenticationService
  );
  readonly #fieldNotebookService: fieldNotebookService =
    inject(fieldNotebookService);
  readonly #openModal: NgbModal = inject(NgbModal);
  readonly #notificationsService: ToasterService = inject(ToasterService);

  workService = inject(WorkService);
  excelService = inject(ExcelService);
  seedService = inject(SeedService);
  productService = inject(ProductService);
  categoryProductService = inject(CategoryService);
  companyGroupService = inject(CompanyGroupService);
  userService = inject(UserService);

  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = 'name';

  forms: any;
  originalForms: any;
  searchForm: any;

  user: any;
  dataUser: any;

  works: any = [];
  seeds: any = [];
  products: any = [];
  categorys: any = [];
  companyGroups: any = [];

  filtros: any = {
    rut: '',
    name: '',
  };
  companyGroupsName: any = [];
  constructor(
    private router: Router // private authenticationService: AuthenticationService,
  ) {
    this.user = this.#authenticationService.getCurrentUser();
    this.userService.viewUser(this.user.id).subscribe(
      (data: any) => {
        this.dataUser = data.data;
      },
      (error: { message: any }) => {
        console.log('error: ', error.message);
      }
    );
  }

  ngOnInit() {
    if (this.#authenticationService.isLoggedIn()) {
      this.loadForms();
      this.loadProducts();
      this.loadWorks();
      this.loadSeeds();
      this.loadCategory();
      this.loadCompanyGroups();
    } else {
      this.router.navigate(['/login']);
    }
  }

  filtrar() {
    this.forms = this.originalForms;
    if (this.filtros.rut != '') {
      this.forms = this.fDataFilter(
        this.forms,
        'informacion_del_campo.company.rut',
        this.filtros.rut
      );
    }

    if (this.filtros.name != '') {
      this.forms = this.fDataFilter(
        this.forms,
        'informacion_del_campo.company.name',
        this.filtros.name
      );
    }
  }

  fDataFilter(dataFilter: any, nameColumn: string, stringSearch: string) {
    let resultados: any[] = [];
    dataFilter.forEach((data: any) => {
      let originalData = data;
      const routersKeys = nameColumn.split('.');
      for (const key of routersKeys) {
        data = data[key];
      }

      const dataLowerCase = data.toString().toLowerCase();
      const stringSearchLowerCase = stringSearch.toString().toLowerCase();
      if (dataLowerCase.includes(stringSearchLowerCase)) {
        resultados.push(originalData);
      }
    });
    return resultados;
  }
  async loadForms(search = false) {
    const params: any = {
      'page[number]': (this.page - 1).toString(),
      'page[size]': this.pageSize.toString(),
      sort: this.sort,
    };

    if (search) {
      for (const k in this.searchForm) {
        if (this.searchForm.hasOwnProperty(k)) {
          if (this.searchForm[k] !== '') {
            params['fields[' + k + ']'] = this.searchForm[k];
          }
        }
      }
    }

    await this.#fieldNotebookService.getForms(params).subscribe(
      (data: any) => {
        this.forms = data.data;
        this.originalForms = data.data;
        this.filtrar();
        this.total = data.meta['total-items'];
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  editarModal(cuaderno: any) {
    const modalRef = this.#openModal.open(EditarModalComponent, {
      size: 'xl',
      backdrop: 'static',
    });

    modalRef.componentInstance.cuaderno = cuaderno;

    modalRef.result.then(
      (result) => {
        this.loadForms();
        this.#notificationsService.popAsync({
          type: 'success',
          title: 'Acción Exitosa',
          body: result.respuesta,
          progressBar: true,
          progressBarDirection: 'increasing',
        });
      },
      (reason) => {}
    );
  }
  openModal(cuaderno: any) {
    const modalRef = this.#openModal.open(VerModalComponent, {
      size: 'xl',
      backdrop: 'static',
    });

    modalRef.componentInstance.cuaderno = cuaderno;

    modalRef.result.then(
      (result) => {
        this.loadForms();
        this.#notificationsService.popAsync({
          type: 'success',
          title: 'Acción Exitosa',
          body: result.respuesta,
          progressBar: true,
          progressBarDirection: 'increasing',
        });
      },
      (reason) => {}
    );
  }

  newOpenModal() {
    const modalRef = this.#openModal.open(AgregarModalComponent, {
      size: 'xl',
      backdrop: 'static',
    });

    //modalRef.componentInstance.data_id = id;

    modalRef.result.then(
      (result) => {
        this.loadForms();
        this.#notificationsService.popAsync({
          type: 'success',
          title: 'Acción Exitosa',
          body: result.respuesta,
          progressBar: true,
          progressBarDirection: 'increasing',
        });
      },
      (reason) => {}
    );
  }

  exportExcel(cuaderno: any) {
    const encabezado = this.crearEncabezado(cuaderno);
    let data: any = [];
    let maquinarias: any = [];
    maquinarias.push({ item: 'MAQUINARIA' });
    this.works.forEach((work: any) => {
      if (this.hasForId(cuaderno.maquinarias, work._id, 'labor')) {
        let row = [];
        row.push({ subitem: work.name });
        cuaderno.maquinarias.forEach((maquinaria: any) => {
          if (work._id == maquinaria.labor._id) {
            row.push({
              Nombre: maquinaria.machinery.name,
              Epoca: maquinaria.epoca.toString(),
              Cantidad: maquinaria.amount,
              Unidad: maquinaria.unit,
              Costo: maquinaria.price,
              'Costo/ha': maquinaria.total_cost_ha,
              'Costo total': maquinaria.total_cost,
            });
          }
        });
        maquinarias.push(row);
      }
    });
    data.push(maquinarias);

    let insumos: any = [];
    insumos.push({ item: 'INSUMOS' });
    this.categorys.forEach((category: any) => {
      if (this.hasForId(cuaderno.insumos, category._id, 'category')) {
        let row = [];
        row.push({ subitem: category.name });
        cuaderno.insumos.forEach((insumo: any) => {
          if (category._id == insumo.category._id) {
            const product_name = this.products.find(
              (item: any) => item._id === insumo.product
            );
            row.push({
              Nombre: product_name?.name,
              Epoca: insumo.epoca.toString(),
              Cantidad: insumo.amount,
              Unidad: insumo.unit,
              Costo: insumo.price,
              'Costo/ha': insumo.total_cost_ha,
              'Costo total': insumo.total_cost,
            });
          }
        });
        insumos.push(row);
      }
    });
    data.push(insumos);

    let MOS: any = [];
    MOS.push({ item: 'MANO DE OBRA' });
    this.works.forEach((work: any) => {
      if (this.hasForId(cuaderno.mano_de_obra, work._id, 'labor')) {
        let row = [];
        row.push({ subitem: work.name });
        cuaderno.mano_de_obra.forEach((mo: any) => {
          if (work._id == mo.labor._id) {
            row.push({
              Nombre: mo.mo.name,
              Epoca: mo.epoca.toString(),
              Cantidad: mo.amount,
              Unidad: mo.unit,
              Costo: mo.price,
              'Costo/ha': mo.total_cost_ha,
              'Costo total': mo.total_cost,
            });
          }
        });
        MOS.push(row);
      }
    });
    data.push(MOS);

    let OCS: any = [];
    OCS.push({ item: 'OTROS COSTOS' });
    this.works.forEach((work: any) => {
      if (this.hasForId(cuaderno.otros_costos, work._id, 'labor')) {
        let row = [];
        row.push({ subitem: work.name });
        cuaderno.otros_costos.forEach((oc: any) => {
          if (work._id == oc.labor._id) {
            row.push({
              Nombre: oc.otro_costo.name,
              Epoca: oc.epoca.toString(),
              Cantidad: oc.amount,
              Unidad: oc.unit,
              Costo: oc.price,
              'Costo/ha': oc.total_cost_ha,
              'Costo total': oc.total_cost,
            });
          }
        });
        OCS.push(row);
      }
    });
    data.push(OCS);
    data.forEach((element: any) => {
      let itemTotalCostoHa = 0;
      let itemTotalCostoTotal = 0;

      element.slice(1).forEach((set: any[]) => {
        let subitemTotalCostoHa = 0;
        let subitemTotalCostoTotal = 0;

        set.slice(1).forEach((item) => {
          subitemTotalCostoHa += item['Costo/ha'];
          subitemTotalCostoTotal += item['Costo total'];
        });

        // Insertar el diccionario de totales por subitem
        set.push({
          'subitemTotalCosto/ha': subitemTotalCostoHa,
          'subitemTotalCosto total': subitemTotalCostoTotal,
        });

        itemTotalCostoHa += subitemTotalCostoHa;
        itemTotalCostoTotal += subitemTotalCostoTotal;
      });

      // Insertar el diccionario de totales por item
      element.push({
        'itemTotalCosto/ha': itemTotalCostoHa,
        'itemTotalCosto total': itemTotalCostoTotal,
      });
    });

    const resumenContable = this.resumenContable(data, encabezado);

    const titulo = {
      season: cuaderno.informacion_del_campo.season.name,
      type_crop: cuaderno.informacion_del_campo.crop.type_crop?.name,
    };

    const pathImages = {
      logo: this.dataUser.logo,
      avatar: this.dataUser.avatar,
      firma: this.dataUser.firma,
    };
    // this.excelService.exportAsExcelFile(
    //   data,
    //   encabezado,
    //   resumenContable,
    //   titulo,
    //   pathImages
    // );

    this.excelService.excelTest(
      data,
      encabezado,
      resumenContable,
      titulo,
      pathImages
    );
  }

  resumenContable(data: any, encabezado: any) {
    let sumCostoHa = 0;
    let totalCostoHaConOtros = 0;

    data.forEach((category: any) => {
      const item = category[0].item;
      const itemTotalCostoHa =
        category[category.length - 1]['itemTotalCosto/ha'];

      if (
        item === 'MAQUINARIA' ||
        item === 'INSUMOS' ||
        item === 'MANO DE OBRA'
      ) {
        sumCostoHa += itemTotalCostoHa;
      }
      totalCostoHaConOtros += itemTotalCostoHa;
    });

    const ingresoHA =
      encabezado['Precio venta'] * encabezado['Limpio seco (qq/ha)'];
    const margenBruto = ingresoHA - sumCostoHa;
    const margenNeto = ingresoHA - totalCostoHaConOtros;
    const costoUnitario =
      totalCostoHaConOtros / encabezado['Limpio seco (qq/ha)'];
    const ganancia = margenBruto / encabezado['Superficie cultivada'];
    return {
      'Ingreso por ha (f)': parseInt(ingresoHA.toString()),
      'Costos directos por hectárea (a+b+c)': parseInt(sumCostoHa.toString()),
      'Costos totales por hectárea (a+b+c+d)': parseInt(
        totalCostoHaConOtros.toString()
      ),
      'Margen bruto por hectárea (f - (a+b+c+))': parseInt(
        margenBruto.toString()
      ),
      'Margen neto por hectárea (f - (a+b+c+d))': parseInt(
        margenNeto.toString()
      ),
      'Costo unitario (a+b+c+d)/ L/S': parseInt(costoUnitario.toString()),
      'Margen bruto por ha (f - (a+b+c+)/SC ': parseInt(ganancia.toString()),
    };
  }
  crearEncabezado(cuaderno: any) {
    let infoCampo: any = [];
    cuaderno.informacion_del_campo.company.fields.forEach((element: any) => {
      if (cuaderno.informacion_del_campo.company_field == element._id) {
        infoCampo = element;
      }
    });
    return {
      'Nombre del productor': `${cuaderno.informacion_del_campo.company.name}  ${cuaderno.informacion_del_campo.company.lastname}`,
      RUT: cuaderno.informacion_del_campo.company.rut,
      Dirección: infoCampo?.address,
      Sector: `${infoCampo?.sector}  ${infoCampo?.rol}`,
      Tenencia: cuaderno.informacion_del_campo?.possession,
      Industria: cuaderno?.guia_analisis?.industria,
      'Superficie cultivada': cuaderno.informacion_del_campo.cultivated_area,
      'Peso bruto (qq/ha)': cuaderno?.guia_analisis?.pesoBrutoHA,
      'Limpio seco (qq/ha)': cuaderno?.guia_analisis?.limpioSecoHA,
      'Precio venta': cuaderno?.guia_analisis?.precioVenta,
      'Kg Totales':
        cuaderno.informacion_del_campo.cultivated_area *
        cuaderno?.guia_analisis?.limpioSecoHA *
        100,
    };
  }

  hasForId(data: any, id: string, type: string): boolean {
    return data.some((item: any) => item[type]._id === id);
  }

  async loadWorks() {
    const params = {
      'page[number]': 0,
      'page[size]': 9999999999,
      sort: 'name',
    };
    await this.workService.getWorks(params).subscribe(
      (data: any) => {
        this.works = data.data;
      },
      (error: { message: any }) => {
        console.log('error: ', error.message);
      }
    );
  }

  async loadSeeds() {
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      sort: 'name',
      'fields[active]': true,
    };
    await this.seedService.getSeeds(params).subscribe(
      (data: any) => {
        this.seeds = data.data;
        this.products = [...this.products, ...this.seeds];
        //console.log(this.products);
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  async loadProducts() {
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      sort: 'name',
      'fields[active]': true,
    };
    await this.productService.getProducts(params).subscribe(
      (data: any) => {
        this.products = data.data;
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }
  async loadCompanyGroups() {
    const params = {
      'page[number]': (this.page - 1).toString(),
      'page[size]': this.pageSize.toString(),
      sort: this.sort,
    };
    await this.companyGroupService.getCompanyGroups(params).subscribe(
      (data: any) => {
        this.companyGroups = data.data;
        this.total = data.meta['total-items'];
      },
      (error: { message: any }) => {
        this.#notificationsService.popAsync({
          type: 'error',
          title: 'Error',
          body: error?.message,
          progressBar: true,
          progressBarDirection: 'increasing',
        });
        // console.log('error: ', error.message)
      }
    );
  }

  async loadCategory() {
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      sort: 'name',
      'fields[active]': true,
    };
    await this.categoryProductService.getCategorys(params).subscribe(
      (data: any) => {
        this.categorys = data.data;
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }
  onPageChange(event: number) {
    this.page = event;
    this.loadForms();
  }
}
