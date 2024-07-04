import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  DatePickerModule,
  FormModule,
  GridModule,
  MultiSelectComponent,
  MultiSelectOptionComponent,
  NavComponent,
  NavItemComponent,
  NavLinkDirective,
  SharedModule,
  TabContentComponent,
  TabContentRefDirective,
  TabPaneComponent,
  TableModule,
  UtilitiesModule,
} from '@coreui/angular-pro';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterConfig, ToasterModule } from 'angular-toaster';
import { UiSwitchModule } from 'ngx-ui-switch';
import { WorkService } from 'src/app/services/work.service';
import { DirectiveModule } from 'src/app/utils/uppercase.directive';
import {
  faPenToSquare,
  faTrash,
  faXmark,
  faCheck,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { SeedService } from 'src/app/services/seed.service';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { BtnDescargarComponent } from './btn-descargar/btn-descargar.component';
import { PieChartComponent } from '../../charts/pie-chart/pie-chart.component';
@Component({
  selector: 'app-ver-modal',
  standalone: true,
  imports: [
    RouterLink,
    FontAwesomeModule,
    NavComponent,
    NavItemComponent,
    NavLinkDirective,
    TabContentComponent,
    TabContentRefDirective,
    TabPaneComponent,
    TableModule,
    CardHeaderComponent,
    CardBodyComponent,
    CardComponent,
    CommonModule,
    FormModule,
    FormsModule,
    DatePickerModule,
    ReactiveFormsModule,
    ButtonDirective,
    ButtonGroupComponent,
    DirectiveModule,
    ToasterModule,
    UiSwitchModule,
    MultiSelectComponent,
    MultiSelectOptionComponent,
    SharedModule,
    GridModule,
    UtilitiesModule,
    BtnDescargarComponent,
    PieChartComponent,
  ],
  templateUrl: './ver-modal.component.html',
  providers: [
    WorkService,
    SeedService,
    ProductService,
    CategoryService,
    DatePipe,
  ],
})
export class VerModalComponent {
  faXmark = faXmark;
  faCheck = faCheck;
  faDownload = faDownload;
  @Input() cuaderno: any;

  workService = inject(WorkService);
  activeModal = inject(NgbActiveModal);
  seedService = inject(SeedService);
  productService = inject(ProductService);
  categoryProductService = inject(CategoryService);
  datePipe = inject(DatePipe);

  works: any;
  seeds: any;
  products: any;
  categorys: any;

  chartMachines: any;
  chartInsumos: any;
  chartMO: any;
  chartOC: any;
  chartTest: any;

  public config = new ToasterConfig({
    mouseoverTimerStop: true,
    timeout: 2000,
    animation: 'fade',
    limit: 4,
  });

  ngOnInit(): void {
    this.loadWorks();
    this.loadProducts();
    // this.loadSeeds();
    this.loadCategory();
    this.loadCharts();
  }

  loadCharts() {
    this.chartMachines = this.createChartMachines(
      this.cuaderno.maquinarias,
      'labor'
    );
    this.chartInsumos = this.createChartMachines(
      this.cuaderno.insumos,
      'category'
    );
    this.chartMO = this.createChartMachines(this.cuaderno.mano_de_obra, 'mo');

    this.chartOC = this.createChartMachines(
      this.cuaderno.otros_costos,
      'labor'
    );
  }
  createChartMachines(data: any, type: any) {
    let dataChart: any = {};

    for (let item of data) {
      const laborName = item[type].name;
      if (!dataChart[laborName]) {
        dataChart[laborName] = 0;
      }
      dataChart[laborName] += item.total_cost_ha;
    }

    return {
      labels: Object.keys(dataChart),
      datasets: [
        {
          data: Object.values(dataChart),
        },
      ],
    };
  }
  worksOfMachines(workId: string): boolean {
    return this.cuaderno.maquinarias.some(
      (maquinaria: any) => maquinaria.labor._id === workId
    );
  }

  categorysOfInsumos(categoryId: string): boolean {
    return this.cuaderno.insumos.some(
      (insumo: any) => insumo.category._id === categoryId
    );
  }

  hasForId(data: any, id: string, type: string): boolean {
    return data.some((item: any) => item[type]._id === id);
  }

  getKeys(array: any): string[] {
    if (array) {
      return Object.keys(array);
    } else {
      return [];
    }
  }
  async loadWorks() {
    const params = {
      'page[number]': 0,
      'page[size]': 9999999999,
      sort: 'name',
      'fields[active]': true,
    };
    await this.workService.getWorks(params).subscribe(
      (data: any) => {
        this.works = data.data;
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
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
      (result: any) => {
        // this.products = data.data;
        this.seedService.getSeeds(params).subscribe((data: any) => {
          this.seeds = data.data;
          this.products = [...result.data, ...this.seeds];
        });
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
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
}
