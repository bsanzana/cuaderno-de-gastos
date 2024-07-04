import { Component, Input, inject } from '@angular/core';
import { ButtonModule } from '@coreui/angular-pro';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { CategoryService } from 'src/app/services/category.service';
import { ExcelService } from 'src/app/services/excel.service';
import { ProductService } from 'src/app/services/product.service';
import { SeedService } from 'src/app/services/seed.service';
import { UserService } from 'src/app/services/user.service';
import { WorkService } from 'src/app/services/work.service';

@Component({
  selector: 'app-export-excel',
  standalone: true,
  imports: [FontAwesomeModule, ButtonModule],
  templateUrl: './export-excel.component.html',
  providers: [
    WorkService,
    ExcelService,
    SeedService,
    ProductService,
    CategoryService,
    UserService
  ],
})
export class ExportExcelComponent {
  @Input() cuaderno: any;
  faFileExcel = faFileExcel;

  workService = inject(WorkService);
  excelService = inject(ExcelService);
  seedService = inject(SeedService);
  productService = inject(ProductService);
  categoryProductService = inject(CategoryService);
  userService = inject(UserService);

  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = 'name';

  dataUser:any;

  works: any = [];
  seeds: any = [];
  products: any = [];
  categorys: any = [];

  ngOnInit(): void {

    this.userService.viewUser(this.cuaderno.informacion_del_campo.company.group.advisors[0]).subscribe(
      (data: any) => {
        this.dataUser = data.data;
        console.log(this.dataUser)
      },
      (error: { message: any }) => {
        console.log('error: ', error.message);
      }
    );


    this.loadProducts();
    this.loadWorks();
    this.loadSeeds();
    this.loadCategory();
  }
  exportExcel() {
    const encabezado = this.crearEncabezado(this.cuaderno);
    let data: any = [];
    let maquinarias: any = [];
    maquinarias.push({ item: 'MAQUINARIA' });
    this.works.forEach((work: any) => {
      if (this.hasForId(this.cuaderno.maquinarias, work._id, 'labor')) {
        let row = [];
        row.push({ subitem: work.name });
        this.cuaderno.maquinarias.forEach((maquinaria: any) => {
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
      if (this.hasForId(this.cuaderno.insumos, category._id, 'category')) {
        let row = [];
        row.push({ subitem: category.name });
        this.cuaderno.insumos.forEach((insumo: any) => {
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
      if (this.hasForId(this.cuaderno.mano_de_obra, work._id, 'labor')) {
        let row = [];
        row.push({ subitem: work.name });
        this.cuaderno.mano_de_obra.forEach((mo: any) => {
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
      if (this.hasForId(this.cuaderno.otros_costos, work._id, 'labor')) {
        let row = [];
        row.push({ subitem: work.name });
        this.cuaderno.otros_costos.forEach((oc: any) => {
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
    console.log(data);
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
      season: this.cuaderno.informacion_del_campo.season.name,
      type_crop: this.cuaderno.informacion_del_campo.crop.type_crop?.name,
    };

    const pathImages = {
      logo: this.dataUser.logo,
      avatar: this.dataUser.avatar,
      firma: this.dataUser.firma,
    };

    console.log(data, encabezado, resumenContable, pathImages);
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
    this.cuaderno.informacion_del_campo.company.fields.forEach((element: any) => {
      if (this.cuaderno.informacion_del_campo.company_field == element._id) {
        infoCampo = element;
      }
    });
    return {
      'Nombre del productor': `${this.cuaderno.informacion_del_campo.company.name}  ${this.cuaderno.informacion_del_campo.company.lastname}`,
      RUT: this.cuaderno.informacion_del_campo.company.rut,
      Dirección: infoCampo?.address,
      Sector: `${infoCampo?.sector}  ${infoCampo?.rol}`,
      Tenencia: this.cuaderno.informacion_del_campo?.possession,
      Industria: this.cuaderno?.guia_analisis?.industria,
      'Superficie cultivada': this.cuaderno.informacion_del_campo.cultivated_area,
      'Peso bruto (qq/ha)': this.cuaderno?.guia_analisis?.pesoBrutoHA,
      'Limpio seco (qq/ha)': this.cuaderno?.guia_analisis?.limpioSecoHA,
      'Precio venta': this.cuaderno?.guia_analisis?.precioVenta,
      'Kg Totales':
        this.cuaderno.informacion_del_campo.cultivated_area *
        this.cuaderno?.guia_analisis?.limpioSecoHA *
        100,
    };
  }

  hasForId(data: any, id: string, type: string): boolean {
    return data.some((item: any) => item[type]._id === id);
  }
  loadWorks() {
    const params = {
      'page[number]': 0,
      'page[size]': 9999999999,
      sort: 'name',
    };
    this.workService.getWorks(params).subscribe(
      (data: any) => {
        this.works = data.data;
      },
      (error: { message: any }) => {
        console.log('error: ', error.message);
      }
    );
  }
  loadProducts() {
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      sort: 'name',
      'fields[active]': true,
    };
    this.productService.getProducts(params).subscribe(
      (data: any) => {
        this.products = data.data;
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  loadCategory() {
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      sort: 'name',
      'fields[active]': true,
    };
    this.categoryProductService.getCategorys(params).subscribe(
      (data: any) => {
        this.categorys = data.data;
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  loadSeeds() {
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      sort: 'name',
      'fields[active]': true,
    };
    this.seedService.getSeeds(params).subscribe(
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
}
