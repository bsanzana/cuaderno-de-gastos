import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { ToasterConfig, ToasterModule, ToasterService } from 'angular-toaster';
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
import { SeedTypeService } from 'src/app/services/seed-type.service';
import { PlantingMethodService } from 'src/app/services/mano-de-obra.service';
import { ApplicationMethodService } from 'src/app/services/application-method.service';
import { MachineryService } from 'src/app/services/machinery.service';
import { SeasonService } from 'src/app/services/season.service';
import { CropService } from 'src/app/services/crop.service';
import { FormService } from 'src/app/services/form.service';
import { CompanyService } from 'src/app/services/company.service';
import { RutService } from 'rut-chileno';
import { CompanyGroupService } from 'src/app/services/company-group.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { PieChartComponent } from '../../charts/pie-chart/pie-chart.component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-editar-modal',
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
    PieChartComponent,
  ],
  templateUrl: './editar-modal.component.html',
  providers: [
    FormBuilder,
    CompanyGroupService,
    RutService,
    ToasterService,
    CompanyService,
    ProductService,
    SeedService,
    SeedTypeService,
    PlantingMethodService,
    ApplicationMethodService,
    WorkService,
    MachineryService,
    FormService,
    SeasonService,
    CropService,
    CategoryService,
    ApplicationMethodService,
    DatePipe,
  ],
})
export class EditarModalComponent {
  months = [
    { name: 'Enero' },
    { name: 'Febrero' },
    { name: 'Marzo' },
    { name: 'Abril' },
    { name: 'Mayo' },
    { name: 'Junio' },
    { name: 'Julio' },
    { name: 'Agosto' },
    { name: 'Septiembre' },
    { name: 'Octubre' },
    { name: 'Noviembre' },
    { name: 'Diciembre' },
  ];

  faXmark = faXmark;
  faCheck = faCheck;
  faDownload = faDownload;
  faTrash = faTrash;
  @Input() cuaderno: any;

  formBuilder = inject(FormBuilder);
  workService = inject(WorkService);
  activeModal = inject(NgbActiveModal);
  seedService = inject(SeedService);
  productService = inject(ProductService);
  categoryProductService = inject(CategoryService);
  seedTypeService = inject(SeedTypeService);
  manoDeObraService = inject(PlantingMethodService);
  otrosCostosService = inject(ApplicationMethodService);
  machineryService = inject(MachineryService);
  seasonService = inject(SeasonService);
  cropService = inject(CropService);
  formService = inject(FormService);
  companyService = inject(CompanyService);
  notificationsService = inject(ToasterService);
  datePipe = inject(DatePipe);

  infoCampoForm!: FormGroup;
  machinerysForm!: FormGroup;
  insumosForm!: FormGroup;
  MOForm!: FormGroup;
  otrosCostosForm!: FormGroup;
  formGA!: FormGroup;

  mostrarAnalisisSuelo: any;
  mostrarTenencia: any;

  seedTypes: any;
  manoDeObras: any;
  works: any;
  machines: any;
  crops: any;
  otrosCostos: any;
  seasons: any;
  seeds: any;
  products: any;
  categorys: any;

  seedsFiltered: any;
  machinesFiltered: any;
  productsFiltered: any;
  otrosCostosFiltrado: any;
  manoDeObrasFilter: any;

  dataMachines: any;
  machinesByLabor: any;
  dataChartMachinery: any = {};

  dataInsumos: any;
  insumosByCategory: any;
  dataChartInsumos: any = {};

  dataMO: any;
  dataChartMO: any = {};
  MOByLabor: any;

  dataOC: any;
  dataChartOC: any = {};
  otrosCostosByLabor: any;

  dataGA: any;

  guiaAnalisisFile: any;
  analisisSueloFile: any;
  adopcionFile1: any;
  adopcionFile2: any;

  formPagoCosecha: any;
  mostrarPagoCosecha: boolean = false;
  pagoCosechaForm: any;
  costoTotalDeInsumos: any;

  public config = new ToasterConfig({
    mouseoverTimerStop: true,
    timeout: 2000,
    animation: 'fade',
    limit: 4,
  });

  ngOnInit(): void {
    //Cargando datos de tabla de maquinaria
    this.dataMachines = [...this.cuaderno.maquinarias];
    this.dataInsumos = [...this.cuaderno.insumos];
    this.dataMO = [...this.cuaderno.mano_de_obra];
    this.dataOC = [...this.cuaderno.otros_costos];
    //Creando Formularios
    this.createForm();
    this.createFormMachinery();
    this.createFormInsumos();
    this.createFormMO();
    this.createFormOtrosCostos();
    this.createFormGA();

    //Cargar data del server
    this.loadProducts();
    //this.loadSeeds();
    this.loadSeedTypes();
    this.loadPlantingMethods();
    this.loadWorks();
    this.loadMachinery();
    this.loadSeasons();
    this.loadCrops();
    this.loadCategory();
    this.loadOtrosCostos();

    //Mostrar elementos dependiendo si existe la data
    this.mostrarAnalisisSuelo =
      this.cuaderno.informacion_del_campo.soil_analysis;
    this.mostrarTenencia = this.cuaderno.informacion_del_campo.possession;
  }
  createFormOtrosCostos() {
    this.otrosCostosForm = this.formBuilder.group({
      labor: [null, [Validators.required]],
      otro_costo: [null, [Validators.required]],
      epoca: [null, [Validators.required]],
      amount: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      price: ['', [Validators.required]],
      total_cost: [],
      total_cost_ha: [],
    });
  }
  createFormMO() {
    this.MOForm = this.formBuilder.group({
      mo: [null, [Validators.required]],
      labor: [null, [Validators.required]],
      epoca: [null, [Validators.required]],
      amount: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      price: ['', [Validators.required]],
      total_cost: [],
      total_cost_ha: [],
    });
  }
  createFormGA() {
    this.formGA = this.formBuilder.group({
      limpioSeco: [this.cuaderno.guia_analisis?.limpioSeco],
      pesoBruto: [this.cuaderno.guia_analisis?.pesoBruto],
      precioVenta: [this.cuaderno.guia_analisis?.precioVenta],
      industria: [this.cuaderno.guia_analisis?.industria],
    });
  }
  createFormInsumos() {
    this.insumosForm = this.formBuilder.group({
      category: [null, [Validators.required]],
      product: [null, [Validators.required]],
      epoca: [null, [Validators.required]],
      amount: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      price: ['', [Validators.required]],
      total_cost: [],
      total_cost_ha: [],
    });
  }
  createFormMachinery() {
    this.machinerysForm = this.formBuilder.group({
      labor: [null, [Validators.required]],
      machinery: [null, [Validators.required]],
      epoca: [null, [Validators.required]],
      amount: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      price: ['', [Validators.required]],
      total_cost: [],
      total_cost_ha: [],
    });
  }

  createForm() {
    this.infoCampoForm = this.formBuilder.group({
      active: [this.cuaderno.informacion_del_campo.active],
      season: [
        this.cuaderno.informacion_del_campo.season._id,
        Validators.required,
      ],
      company: [
        this.cuaderno.informacion_del_campo.company._id,
        Validators.required,
      ],
      company_field: [
        this.cuaderno.informacion_del_campo.company_field,
        Validators.required,
      ],
      soil_analysis: [this.cuaderno.informacion_del_campo.soil_analysis],
      total_ha: [
        this.cuaderno.informacion_del_campo.total_ha,
        Validators.required,
      ], //superficie total capturada del campo
      cultivated_area: [
        this.cuaderno.informacion_del_campo.cultivated_area,
        Validators.required,
      ], //superficie cultivada
      possession: [
        this.cuaderno.informacion_del_campo.possession,
        Validators.required,
      ],

      possession_rent: this.formBuilder.group({
        cost: [this.cuaderno.informacion_del_campo.possession_rent.cost],
        start_date: [
          this.cuaderno.informacion_del_campo.possession_rent.start_date,
        ],
        end_date: [
          this.cuaderno.informacion_del_campo.possession_rent.end_date,
        ],
      }),

      crop: this.formBuilder.group({
        // cultivo
        type_crop: [this.cuaderno.informacion_del_campo.crop.type_crop?._id],
        variety: [this.cuaderno.informacion_del_campo.crop.variety?._id],
        seed_type: [this.cuaderno.informacion_del_campo.crop.seed_type?._id],
        agricultural_insurance: [
          this.cuaderno.informacion_del_campo.crop.agricultural_insurance,
        ],
        fecha_cosecha: [
          this.datePipe.transform(
            this.cuaderno.informacion_del_campo.crop.fecha_cosecha,
            'yyyy-MM-dd',
            '+000'
          ),
        ],
        fecha_siembra: [
          this.datePipe.transform(
            this.cuaderno.informacion_del_campo.crop?.fecha_siembra,
            'yyyy-MM-dd',
            '+000'
          ),
        ],
      }),

      water: this.formBuilder.group({
        // agua
        water_source: [this.cuaderno.informacion_del_campo.water.water_source],
        possession: [this.cuaderno.informacion_del_campo.water.possession],
        power_source: [this.cuaderno.informacion_del_campo.water.power_source],
        irrigation_system: [
          this.cuaderno.informacion_del_campo.water.irrigation_system,
        ],
        obs: [this.cuaderno.informacion_del_campo.water.obs],
      }),
    });
  }
  onSubmit() {
    const formValues = {
      informacion_del_campo: this.infoCampoForm.value,
      maquinarias: this.dataMachines,
      insumos: this.dataInsumos,
      mano_de_obra: this.dataMO,
      otros_costos: this.dataOC,
      guia_analisis: this.dataGA,
      _id: this.cuaderno._id,
    };

    const formData = new FormData();

    if (this.guiaAnalisisFile) {
      formData.append('guia_analisis', this.guiaAnalisisFile);
    }
    if (this.analisisSueloFile) {
      formData.append('analisis_suelo', this.analisisSueloFile);
    }
    if (this.adopcionFile1) {
      formData.append('adopcion1', this.adopcionFile1);
    }
    if (this.adopcionFile2) {
      formData.append('adopcion2', this.adopcionFile2);
    }
    formData.append('datos', JSON.stringify(formValues));
    this.formService.editForm(formData).subscribe(
      (data: any) => {
        this.activeModal.close({
          respuesta: data.message,
        });
      },
      (error: { message: any }) => {
        console.log('error: ', error.message);
      }
    );
  }

  addValueTablaOtrosCostos() {
    const total_cost =
      this.otrosCostosForm.controls['price'].value *
      this.otrosCostosForm.controls['amount'].value;

    const total_cost_ha =
      total_cost / this.infoCampoForm.value['cultivated_area'];

    this.otrosCostosForm.get('total_cost')?.setValue(total_cost);
    this.otrosCostosForm
      .get('total_cost_ha')
      ?.setValue(total_cost_ha.toFixed(2));

    this.otrosCostosForm.get('labor')?.setValue({
      _id: this.otrosCostosForm.controls['labor'].value,
      name: this.searchNameLabor(this.otrosCostosForm.controls['labor'].value),
    });

    this.otrosCostosForm.get('otro_costo')?.setValue({
      _id: this.otrosCostosForm.controls['otro_costo'].value,
      name: this.searchNameOtroCosto(
        this.otrosCostosForm.controls['otro_costo'].value
      ),
    });
    this.dataOC.push(this.otrosCostosForm.value);

    this.otrosCostosByLabor = this.groupByKey(this.dataOC, 'labor');

    this.dataChartOC = this.createChart(this.otrosCostosByLabor);
    this.otrosCostosForm.reset();
  }

  removeValueTableOtrosCostos(field: number) {
    const temp = this.dataOC[field];
    this.dataOC.splice(field, 1);
    this.otrosCostosByLabor = this.groupByKey(this.dataOC, 'labor');
    this.dataChartOC = this.createChart(this.otrosCostosByLabor);
    this.notificationsService.popAsync({
      type: 'success',
      title: 'Acción Exitosa',
      body:
        'Se ha eliminado ' + temp.otro_costo.name + ' del cuaderno de campo',
      progressBar: true,
      progressBarDirection: 'increasing',
    });
  }
  addFields() {
    const total_cost =
      this.machinerysForm.controls['price'].value *
      this.machinerysForm.controls['amount'].value;
    const total_cost_ha =
      total_cost / this.infoCampoForm.value['cultivated_area'];

    this.machinerysForm.get('total_cost')?.setValue(total_cost);
    this.machinerysForm
      .get('total_cost_ha')
      ?.setValue(parseFloat(total_cost_ha.toFixed(2)));

    this.machinerysForm.get('machinery')?.setValue({
      _id: this.machinerysForm.controls['machinery'].value,
      name: this.searchNameMachinery(
        this.machinerysForm.controls['machinery'].value
      ),
    });
    this.machinerysForm.get('labor')?.setValue({
      _id: this.machinerysForm.controls['labor'].value,
      name: this.searchNameLabor(this.machinerysForm.controls['labor'].value),
    });

    this.dataMachines.push(this.machinerysForm.value);

    this.machinesByLabor = this.groupByKey(this.dataMachines, 'labor');
    this.dataChartMachinery = this.createChart(this.machinesByLabor);
    this.machinerysForm.reset();
  }

  removeField(field: number) {
    const fieldTemp = this.dataMachines[field];
    this.dataMachines.splice(field, 1);
    this.machinesByLabor = this.groupByKey(this.dataMachines, 'labor');
    this.dataChartMachinery = this.createChart(this.machinesByLabor);
    this.notificationsService.popAsync({
      type: 'success',
      title: 'Acción Exitosa',
      body:
        'Se ha eliminado ' +
        fieldTemp.machinery.name +
        ' del cuaderno de campo',
      progressBar: true,
      progressBarDirection: 'increasing',
    });
  }

  addProduct() {
    const total_cost =
      this.insumosForm.controls['price'].value *
      this.insumosForm.controls['amount'].value;

    const total_cost_ha =
      total_cost / this.infoCampoForm.value['cultivated_area'];

    this.insumosForm.get('total_cost')?.setValue(total_cost);
    this.insumosForm
      .get('total_cost_ha')
      ?.setValue(parseFloat(total_cost_ha.toFixed(2)));

    this.insumosForm.get('category')?.setValue({
      _id: this.insumosForm.controls['category'].value,
      name: this.searchNameCategory(
        this.insumosForm.controls['category'].value
      ),
    });

    this.dataInsumos.push(this.insumosForm.value);
    this.insumosByCategory = this.groupByKey(this.dataInsumos, 'category');

    this.dataChartInsumos = this.createChart(this.insumosByCategory);

    this.insumosForm.reset();
  }
  removeProduct(index: number) {
    const insumoTemp = this.dataInsumos[index];
    this.dataInsumos.splice(index, 1);
    this.insumosByCategory = this.groupByKey(this.dataInsumos, 'category');
    this.dataChartInsumos = this.createChart(this.insumosByCategory);
    this.notificationsService.popAsync({
      type: 'success',
      title: 'Acción Exitosa',
      body:
        'Se ha eliminado ' +
        this.searchNameProduct(insumoTemp.product) +
        ' del cuaderno de campo',
      progressBar: true,
      progressBarDirection: 'increasing',
    });
  }

  addMO() {
    const total_cost =
      this.MOForm.controls['price'].value *
      this.MOForm.controls['amount'].value;

    const total_cost_ha =
      total_cost / this.infoCampoForm.value['cultivated_area'];

    this.MOForm.get('total_cost')?.setValue(total_cost);
    this.MOForm.get('total_cost_ha')?.setValue(
      parseFloat(total_cost_ha.toFixed(2))
    );

    this.MOForm.get('labor')?.setValue({
      _id: this.MOForm.controls['labor'].value,
      name: this.searchNameLabor(this.MOForm.controls['labor'].value),
    });

    this.MOForm.get('mo')?.setValue({
      _id: this.MOForm.controls['mo'].value,
      name: this.searchNameMO(this.MOForm.controls['mo'].value),
    });

    this.dataMO.push(this.MOForm.value);
    this.MOByLabor = this.groupByKey(this.dataMO, 'labor');
    this.dataChartMO = this.createChart(this.MOByLabor);

    this.MOForm.reset();
  }

  removeMO(field: number) {
    const fieldTemp = this.dataMO[field];
    this.dataMO.splice(field, 1);
    this.MOByLabor = this.groupByKey(this.dataMO, 'labor');
    this.dataChartMO = this.createChart(this.MOByLabor);
    this.notificationsService.popAsync({
      type: 'success',
      title: 'Acción Exitosa',
      body: 'Se ha eliminado el campo ' + fieldTemp.name + ' del productor',
      progressBar: true,
      progressBarDirection: 'increasing',
    });
  }

  saveFormGA() {
    const CA = this.infoCampoForm.value['cultivated_area'];
    this.dataGA = this.formGA.value;
    this.dataGA['limpioSecoHA'] = this.formGA.value.limpioSeco / CA;
    this.dataGA['pesoBrutoHA'] = this.formGA.value.pesoBruto / CA;
  }

  SelectAnalisisSuelo(value: any) {
    const booleanValue = value === 'true';
    if (booleanValue) {
      this.mostrarAnalisisSuelo = true;
      this.infoCampoForm.get('soil_analysis')?.setValue(true);
    } else {
      this.infoCampoForm.get('soil_analysis')?.setValue(false);
      this.mostrarAnalisisSuelo = false;
    }
  }
  searchNameMachinery(id: string) {
    const machineryFinded = this.machines.find((item: any) => item._id === id);
    return machineryFinded.name;
  }

  createChart(array: any) {
    let sums: any = {};
    for (let key in array) {
      let totalCostHaSum = 0.0;
      for (let item of array[key]) {
        let costHa = parseFloat(item.total_cost_ha);
        if (!isNaN(costHa)) {
          totalCostHaSum += costHa;
        }
      }
      sums[key] = totalCostHaSum;
    }

    return {
      labels: Object.keys(sums),
      datasets: [
        {
          data: Object.values(sums),
        },
      ],
    };
  }
  SelectTenencia(value: any) {
    this.mostrarTenencia = value;
    this.infoCampoForm.get('possession')?.setValue(value);
  }
  selectWorkForOtrosCostos(id: string) {
    this.otrosCostosFiltrado = this.otrosCostos.filter(
      (item: any) => item.labor?._id === id
    );
  }

  hasForId(data: any, id: string, type: string): boolean {
    return data.some((item: any) => item[type]._id === id);
  }
  selectTypeCrop(id: string) {
    this.seedsFiltered = this.seeds.filter(
      (item: any) => item.crop?._id === id
    );
  }

  selectCategory(id: string) {
    this.productsFiltered = this.products.filter(
      (item: any) => item.category?._id === id
    );
  }

  selectWorkForMachines(id: string) {
    this.machinesFiltered = this.machines.filter(
      (item: any) => item.labor?._id === id
    );
  }

  selectWorkForMO(id: string) {
    this.manoDeObrasFilter = this.manoDeObras.filter(
      (item: any) => item.labor?._id === id
    );
  }

  sumarTotalCostPorMO(data: any) {
    const result: { [key: string]: number } = {};

    data.forEach((item: any) => {
      const mo = item.mo.name;
      const totalCost: number = item.total_cost_ha;

      if (!result[mo]) {
        result[mo] = 0;
      }
      result[mo] += totalCost;
    });

    return result;
  }
  groupByKey(array: any, key: string) {
    const newArray = array.reduce((groups: any, insumo: any) => {
      const category = insumo[key].name;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(insumo);
      return groups;
    }, {});

    return newArray;
  }
  searchNameOtroCosto(id: string) {
    const tmp = this.otrosCostos.find((item: any) => item._id === id);
    return tmp.name;
  }
  searchNameLabor(id: string) {
    const workFinded = this.works.find((item: any) => item._id === id);
    return workFinded.name;
  }
  searchNameProduct(id: string) {
    const productFinded = this.products.find((item: any) => item._id === id);
    return productFinded.name;
  }
  searchNameMO(id: string) {
    const manoDeObraName = this.manoDeObras.find(
      (item: any) => item._id === id
    );
    return manoDeObraName.name;
  }

  searchNameCategory(id: string) {
    const categoryFinded = this.categorys.find((item: any) => item._id === id);
    return categoryFinded.name;
  }

  getKeys(array: any): string[] {
    if (array) {
      return Object.keys(array);
    } else {
      return [];
    }
  }
  async loadSeedTypes() {
    const params = {
      'page[number]': 0,
      'page[size]': 9999999999,
      sort: 'name',
      'fields[active]': true,
    };
    await this.seedTypeService.getSeedTypes(params).subscribe(
      (data: any) => {
        this.seedTypes = data.data;
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  pagoCosecha() {
    this.mostrarPagoCosecha = !this.mostrarPagoCosecha;
    this.costoTotalDeInsumos = this.dataInsumos.reduce(
      (sum: any, item: { total_cost: any }) => sum + item.total_cost,
      0
    );

    this.pagoCosechaForm = this.formBuilder.group({
      labor: [null, [Validators.required]],
      otro_costo: [null, [Validators.required]],
      epoca: [null, [Validators.required]],
      amount: ['', [Validators.required]],
      unit: ['%', [Validators.required]],
      price: ['', [Validators.required]],
      total_cost: [],
      total_cost_ha: [],
    });
  }

  addValuePagoCosecha() {
    const total_cost =
      (this.pagoCosechaForm.value.price / 100) *
      this.pagoCosechaForm.value.amount *
      this.costoTotalDeInsumos;

    const total_cost_ha =
      total_cost / this.infoCampoForm.value['cultivated_area'];

    this.pagoCosechaForm.get('total_cost')?.setValue(total_cost);
    this.pagoCosechaForm.get('total_cost_ha')?.setValue(total_cost_ha);

    this.mostrarPagoCosecha = !this.mostrarPagoCosecha;

    this.pagoCosechaForm.get('labor')?.setValue({
      _id: this.pagoCosechaForm.controls['labor'].value,
      name: this.searchNameLabor(this.pagoCosechaForm.controls['labor'].value),
    });

    this.pagoCosechaForm.get('otro_costo')?.setValue({
      _id: this.pagoCosechaForm.controls['otro_costo'].value,
      name: this.searchNameOtroCosto(
        this.pagoCosechaForm.controls['otro_costo'].value
      ),
    });
    this.dataOC.push(this.pagoCosechaForm.value);
    this.otrosCostosByLabor = this.groupByKey(this.dataOC, 'labor');

    this.dataChartOC = this.createChart(this.otrosCostosByLabor);
  }

  async loadPlantingMethods() {
    const params = {
      'page[number]': 0,
      'page[size]': 9999999999,
      sort: 'name',
      'fields[active]': true,
    };
    await this.manoDeObraService.getPlantingMethods(params).subscribe(
      (data: any) => {
        this.manoDeObras = data.data;
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  async loadOtrosCostos() {
    const params = {
      'page[number]': 0,
      'page[size]': 9999999999,
      sort: 'name',
      'fields[active]': true,
    };
    await this.otrosCostosService.getApplicationMethods(params).subscribe(
      (data: any) => {
        this.otrosCostos = data.data;
      },
      (error: { message: any }) => {
        console.log('error: ', error.message);
      }
    );
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

  async loadMachinery() {
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      sort: 'name',
      'fields[active]': true,
    };
    await this.machineryService.getMachines(params).subscribe(
      (data: any) => {
        this.machines = data.data;
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  async loadSeasons() {
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      sort: 'name',
      'fields[active]': true,
    };
    await this.seasonService.getSeasons(params).subscribe(
      (data: any) => {
        this.seasons = data.data;
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  async loadCrops() {
    await this.cropService.getCropList().subscribe(
      (data: any) => {
        this.crops = data.data;
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
        // Si el cultivo esta de antes, que se actualice el select
        if (this.cuaderno.informacion_del_campo.crop.type_crop?._id) {
          this.selectTypeCrop(
            this.cuaderno.informacion_del_campo.crop.type_crop?._id
          );
        }
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  // async loadProducts() {
  //   const params = {
  //     'page[number]': 0,
  //     'page[size]': 999999999,
  //     sort: 'name',
  //     'fields[active]': true,
  //   };
  //   await this.productService.getProducts(params).subscribe(
  //     async (data: any) => {
  //       this.products = data.data;
  //       await this.seedService.getSeeds(params).subscribe((data: any) => {
  //         this.seeds = data.data;
  //         this.products = [...this.products, ...this.seeds];
  //         // Si el cultivo esta de antes, que se actualice el select
  //         if (this.cuaderno.informacion_del_campo.crop.type_crop?._id) {
  //           this.selectTypeCrop(
  //             this.cuaderno.informacion_del_campo.crop.type_crop?._id
  //           );
  //         }
  //       });
  //     },
  //     (error: { message: any }) => {
  //       // this.notificationsService.error('Error', error.message);
  //       console.log('error: ', error.message);
  //     }
  //   );
  // }

  async loadProducts() {
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      sort: 'name',
      'fields[active]': true,
    };

    try {
      const productsResponse: any = await lastValueFrom(
        this.productService.getProducts(params)
      );
      this.products = productsResponse.data;

      const seedsResponse: any = await lastValueFrom(
        this.seedService.getSeeds(params)
      );
      this.seeds = seedsResponse.data;

      this.products = [...this.products, ...this.seeds];
      // Si el cultivo esta de antes, que se actualice el select
      if (this.cuaderno.informacion_del_campo.crop.type_crop?._id) {
        this.selectTypeCrop(
          this.cuaderno.informacion_del_campo.crop.type_crop._id
        );
      }
    } catch (error: any) {
    }
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

  uploadGuiaAnalisis(event: any, type: string) {
    const file = event.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      this.notificationsService.popAsync({
        type: 'error',
        title: 'Error',
        body: `El tamaño del archivo ${type} no debe superar los 2 MB`,
        progressBar: true,
        progressBarDirection: 'increasing',
      });
      return;
    } else {
      this.guiaAnalisisFile = file;
    }
  }

  uploadAnalisisSuelo(event: any, type: string) {
    const file = event.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      this.notificationsService.popAsync({
        type: 'error',
        title: 'Error',
        body: `El tamaño del archivo ${type} no debe superar los 2 MB`,
        progressBar: true,
        progressBarDirection: 'increasing',
      });
      return;
    } else {
      this.analisisSueloFile = file;
    }
  }

  uploadAdopcion1(event: any, type: string) {
    const file = event.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      this.notificationsService.popAsync({
        type: 'error',
        title: 'Error',
        body: `El tamaño del archivo ${type} no debe superar los 2 MB`,
        progressBar: true,
        progressBarDirection: 'increasing',
      });
      return;
    } else {
      this.adopcionFile1 = file;
    }
  }

  uploadAdopcion2(event: any, type: string) {
    const file = event.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      this.notificationsService.popAsync({
        type: 'error',
        title: 'Error',
        body: `El tamaño del archivo ${type} no debe superar los 2 MB`,
        progressBar: true,
        progressBarDirection: 'increasing',
      });
      return;
    } else {
      this.adopcionFile2 = file;
    }
  }
}
