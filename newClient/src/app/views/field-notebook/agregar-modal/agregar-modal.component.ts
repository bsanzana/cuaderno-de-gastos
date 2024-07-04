import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RutService } from 'rut-chileno';
import { ToasterConfig, ToasterModule, ToasterService } from 'angular-toaster';
import { UiSwitchModule } from 'ngx-ui-switch';
import {
  NavComponent,
  NavItemComponent,
  NavLinkDirective,
  TabContentComponent,
  TabContentRefDirective,
  TabPaneComponent,
  CardHeaderComponent,
  CardBodyComponent,
  CardComponent,
  ButtonDirective,
  ButtonGroupComponent,
  FormModule,
  TableModule,
  DatePickerModule,
  MultiSelectComponent,
  MultiSelectOptionComponent,
  SharedModule,
  GridModule,
  UtilitiesModule,
} from '@coreui/angular-pro';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faLock,
  faPenToSquare,
  faTrash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';

import { ProductService } from '../../../services/product.service';
import { SeedService } from '../../../services/seed.service';
import { SeedTypeService } from '../../../services/seed-type.service';
import { PlantingMethodService } from '../../../services/mano-de-obra.service';
import { ApplicationMethodService } from '../../../services/application-method.service';
import { WorkService } from '../../../services/work.service';
import { MachineryService } from '../../../services/machinery.service';
import { FormService } from '../../../services/form.service';
import { SeasonService } from '../../../services/season.service';
import { CropService } from '../../../services/crop.service';

import { DirectiveModule } from '../../../utils/uppercase.directive';
import { CompanyGroupService } from '../../../services/company-group.service';
import { CompanyService } from '../../../services/company.service';
import { RouterLink } from '@angular/router';
import { forEach } from 'lodash-es';
import { CategoryService } from 'src/app/services/category.service';
import { PieChartComponent } from '../../charts/pie-chart/pie-chart.component';

@Component({
  selector: 'app-agregar-field-notebook-modal',
  templateUrl: './agregar-modal.component.html',
  standalone: true,
  styles: [
    `
      h3 {
        color: #3399ff;
        border-bottom: 1.5px solid #39f !important;
      }
    `,
  ],
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
  ],
})
export class AgregarModalComponent implements OnInit {
  faTrash = faTrash;

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

  public config: ToasterConfig = new ToasterConfig({
    mouseoverTimerStop: true,
    timeout: 2000,
    animation: 'fade',
    limit: 4,
  });

  companyField: any = [];
  seasons: any = [];

  // readonly #companyGroupService: CompanyGroupService = inject(CompanyGroupService);
  readonly #rutService: RutService = inject(RutService);
  readonly #notificationsService: ToasterService = inject(ToasterService);
  readonly #companyService: CompanyService = inject(CompanyService);
  readonly #productService: ProductService = inject(ProductService);
  readonly #seedTypeService: SeedTypeService = inject(SeedTypeService);
  readonly #seedService: SeedService = inject(SeedService);
  readonly #manoDeObraService: PlantingMethodService = inject(
    PlantingMethodService
  );
  readonly #applicationMethodService: ApplicationMethodService = inject(
    ApplicationMethodService
  );
  readonly #workService: WorkService = inject(WorkService);
  readonly #machineryService: MachineryService = inject(MachineryService);
  readonly #formService: FormService = inject(FormService);
  readonly #seasonService: SeasonService = inject(SeasonService);
  readonly #cropService: CropService = inject(CropService);

  categoryProductService = inject(CategoryService);
  otrosCostosService = inject(ApplicationMethodService);

  agregarForm!: FormGroup;
  fieldsLabor!: FormGroup;
  fieldsProduct!: FormGroup;
  fieldsMO!: FormGroup;
  formGA!: FormGroup;

  formError: boolean = false;
  errorMessage: string = '';

  groups: any;

  Labors: any[] = [];
  insumos: any[] = [];
  machinerys: any[] = [];

  showPossession: boolean = false;
  mostrarSubirAnalisisSuelo: boolean = false;

  products: any = [];
  productsFiltered: any = [];
  insumosByCategory: any;
  categorys: any = [];

  dataChartMachinery: any = {};
  dataChartInsumos: any = {};
  dataChartMO: any = {};
  dataChartOC: any = {};

  crops: any = [];
  seeds: any = [];
  seedsFiltered: any = [];
  seedTypes: any = [];

  manoDeObras: any = [];
  manoDeObrasFiltered: any;

  applicationMethods: any = [];

  works: any = [];

  machines: any = [];
  machinesFiltered: any = [];
  machinesByLabor: any;

  MOList: any = [];
  totalCostPorMO: any;
  previousSeasons: any = [];

  otrosCostosData: any;
  formOtrosCostos!: FormGroup;
  ValuesTableOtrosCostos: any = [];
  otrosCostosByLabor: any;
  otrosCostosFiltrado: any;

  dataGA: any;

  habilitarForms = false;

  analisisSueloFile: any;
  guiaFile: any;
  adopcionFile1: any;
  adopcionFile2: any;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.createForm();
    this.createLabor();
    this.createProduct();
    this.createFormMO();
    this.createFormOtrosCostos();
    this.createFormGA();
  }

  selectWorkForMO(id: string) {
    if (id != 'null') {
      this.manoDeObrasFiltered = this.manoDeObras.filter(
        (item: any) => item.labor?._id === id
      );
      this.fieldsMO.get('mo')?.enable();
    } else {
      this.fieldsMO.get('mo')?.disable();
      this.fieldsMO.get('mo')?.setValue(null);
    }
  }

  selectWorkForMachines(id: string) {
    if (id != 'null') {
      this.machinesFiltered = this.machines.filter(
        (item: any) => item.labor?._id === id
      );
      this.fieldsLabor.get('machinery')?.enable();
    } else {
      this.fieldsLabor.get('machinery')?.disable();
      this.fieldsLabor.get('machinery')?.setValue(null);
    }
  }

  selectWorkForOtrosCostos(id: string) {
    if (id != 'null') {
      this.otrosCostosFiltrado = this.otrosCostosData.filter(
        (item: any) => item.labor?._id === id
      );
      this.formOtrosCostos.get('otro_costo')?.enable();
    } else {
      this.formOtrosCostos.get('otro_costo')?.disable();
      this.formOtrosCostos.get('otro_costo')?.setValue(null);
    }
  }
  selectTypeCrop(id: string) {
    if (id != 'null') {
      this.seedsFiltered = this.seeds.filter(
        (item: any) => item.crop?._id === id
      );
      this.agregarForm.get('crop.variety')?.enable();
    } else {
      this.agregarForm.get('crop.variety')?.disable();
      this.agregarForm.get('crop.variety')?.setValue(null);
    }
  }

  selectCategory(id: string) {
    if (id != 'null') {
      this.productsFiltered = this.products.filter(
        (item: any) => item.category?._id === id
      );
      this.fieldsProduct.get('product')?.enable();
    } else {
      this.fieldsProduct.get('product')?.disable();
      this.fieldsProduct.get('product')?.setValue(null);
    }
  }

  saveFormGA() {
    const CA = this.agregarForm.value['cultivated_area'];
    this.dataGA = this.formGA.value;
    this.dataGA['limpioSecoHA'] = this.formGA.value.limpioSeco / CA;
    this.dataGA['pesoBrutoHA'] = this.formGA.value.pesoBruto / CA;
  }
  createForm() {
    this.agregarForm = this.formBuilder.group({
      active: [true],
      season: [null, Validators.required],
      company: [null, Validators.required],
      company_field: [null, Validators.required],
      soil_analysis: [false],
      total_ha: ['', Validators.required], //superficie total capturada del campo
      cultivated_area: ['', Validators.required], //superficie cultivada
      possession: [null, Validators.required],

      possession_rent: this.formBuilder.group({
        cost: [0],
        start_date: [''],
        end_date: [''],
      }),

      crop: this.formBuilder.group({
        // cultivo
        type_crop: [null],
        variety: [{ value: null, disabled: true }],
        seed_type: [null],
        agricultural_insurance: [false],
        fecha_cosecha: [''],
        fecha_siembra: [''],
      }),

      water: this.formBuilder.group({
        // agua
        water_source: [null],
        possession: [null],
        power_source: [null],
        irrigation_system: [null],
        obs: [''],
      }),
    });
  }
  createLabor() {
    this.fieldsLabor = this.formBuilder.group({
      labor: [null, [Validators.required]],
      machinery: [{ value: null, disabled: true }, [Validators.required]],
      epoca: [null, [Validators.required]],
      amount: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      price: ['', [Validators.required]],
      total_cost: [],
      total_cost_ha: [],
    });
  }

  createFormOtrosCostos() {
    this.formOtrosCostos = this.formBuilder.group({
      labor: [null, [Validators.required]],
      otro_costo: [{ value: null, disabled: true }, [Validators.required]],
      epoca: [null, [Validators.required]],
      amount: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      price: ['', [Validators.required]],
      total_cost: [],
      total_cost_ha: [],
    });
  }

  createProduct() {
    this.fieldsProduct = this.formBuilder.group({
      category: [null, [Validators.required]],
      product: [{ value: null, disabled: true }, [Validators.required]],
      epoca: [null, [Validators.required]],
      amount: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      price: ['', [Validators.required]],
      total_cost: [],
      total_cost_ha: [],
    });
  }

  createFormMO() {
    this.fieldsMO = this.formBuilder.group({
      labor: [null, [Validators.required]],
      mo: [null, [Validators.required]],
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
      limpioSeco: [''],
      pesoBruto: [''],
      precioVenta: [''],
      industria: [''],
    });
  }

  ngOnInit() {
    this.loadProducers();
    this.loadProducts();
    this.loadSeeds();
    this.loadSeedTypes();
    this.loadPlantingMethods();
    this.loadWorks();
    this.loadMachinery();
    this.loadSeasons();
    this.loadCrops();
    this.loadCategory();
    this.loadOtrosCostos();
  }

  onSubmit() {
    const formValues = {
      informacion_del_campo: this.agregarForm.value,
      maquinarias: this.Labors,
      insumos: this.insumos,
      mano_de_obra: this.MOList,
      otros_costos: this.ValuesTableOtrosCostos,
      guia_analisis: this.dataGA,
    };

    const formData = new FormData();
    if (this.analisisSueloFile) {
      formData.append('analisis_suelo', this.analisisSueloFile);
    }
    if (this.guiaFile) {
      formData.append('guia_analisis', this.guiaFile);
    }
    if (this.adopcionFile1) {
      formData.append('adopcion1', this.adopcionFile1);
    }
    if (this.adopcionFile2) {
      formData.append('adopcion2', this.adopcionFile2);
    }
    formData.append('datos', JSON.stringify(formValues));
    this.#formService.createForm(formData).subscribe(
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
      this.formOtrosCostos.controls['price'].value *
      this.formOtrosCostos.controls['amount'].value;

    const total_cost_ha =
      total_cost / this.agregarForm.value['cultivated_area'];

    this.formOtrosCostos.get('total_cost')?.setValue(total_cost);
    this.formOtrosCostos
      .get('total_cost_ha')
      ?.setValue(total_cost_ha.toFixed(2));
    this.ValuesTableOtrosCostos.push(this.formOtrosCostos.value);
    this.otrosCostosByLabor = this.groupByKeyLabors(
      this.ValuesTableOtrosCostos,
      'labor'
    );

    this.dataChartOC = this.createChart(this.otrosCostosByLabor);
    this.formOtrosCostos.reset();
  }

  removeValueTableOtrosCostos(field: number) {
    const temp = this.ValuesTableOtrosCostos[field];
    this.ValuesTableOtrosCostos.splice(field, 1);
    this.otrosCostosByLabor = this.groupByKeyLabors(
      this.ValuesTableOtrosCostos,
      'labor'
    );
    this.dataChartOC = this.createChart(this.otrosCostosByLabor);
    this.#notificationsService.popAsync({
      type: 'success',
      title: 'Acción Exitosa',
      body:
        'Se ha eliminado ' +
        this.searchNameOtroCosto(temp.otro_costo) +
        ' del cuaderno de campo',
      progressBar: true,
      progressBarDirection: 'increasing',
    });
  }

  addFields() {
    const total_cost =
      this.fieldsLabor.controls['price'].value *
      this.fieldsLabor.controls['amount'].value;

    const total_cost_ha =
      total_cost / this.agregarForm.value['cultivated_area'];

    this.fieldsLabor.get('total_cost')?.setValue(total_cost);
    this.fieldsLabor.get('total_cost_ha')?.setValue(total_cost_ha.toFixed(2));
    this.Labors.push(this.fieldsLabor.value);

    this.machinesByLabor = this.groupByKeyLabors(this.Labors, 'labor');

    this.dataChartMachinery = this.createChart(this.machinesByLabor);
    this.fieldsLabor.reset();
  }

  removeField(field: number) {
    const fieldTemp = this.Labors[field];
    this.Labors.splice(field, 1);
    this.machinesByLabor = this.groupByKeyLabors(this.Labors, 'labor');
    this.dataChartMachinery = this.createChart(this.machinesByLabor);
    this.#notificationsService.popAsync({
      type: 'success',
      title: 'Acción Exitosa',
      body:
        'Se ha eliminado ' +
        this.searchNameMachinery(fieldTemp.machinery) +
        ' del cuaderno de campo',
      progressBar: true,
      progressBarDirection: 'increasing',
    });
  }

  addProduct() {
    const total_cost =
      this.fieldsProduct.controls['price'].value *
      this.fieldsProduct.controls['amount'].value;

    const total_cost_ha =
      total_cost / this.agregarForm.value['cultivated_area'];

    this.fieldsProduct.get('total_cost')?.setValue(total_cost);
    this.fieldsProduct.get('total_cost_ha')?.setValue(total_cost_ha.toFixed(2));
    this.insumos.push(this.fieldsProduct.value);
    this.insumosByCategory = this.groupByKey(this.insumos, 'category');
    this.dataChartInsumos = this.createChart(this.insumosByCategory);

    this.fieldsProduct.reset();
  }
  removeProduct(index: number) {
    const insumoTemp = this.insumos[index];
    this.insumos.splice(index, 1);
    this.insumosByCategory = this.groupByKey(this.insumos, 'category');
    this.dataChartInsumos = this.createChart(this.insumosByCategory);
    this.#notificationsService.popAsync({
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
      this.fieldsMO.controls['price'].value *
      this.fieldsMO.controls['amount'].value;

    const total_cost_ha =
      total_cost / this.agregarForm.value['cultivated_area'];

    this.fieldsMO.get('total_cost')?.setValue(total_cost);
    this.fieldsMO.get('total_cost_ha')?.setValue(total_cost_ha.toFixed(2));
    this.MOList.push(this.fieldsMO.value);
    this.totalCostPorMO = this.groupByKeyLabors(this.MOList, 'labor');

    this.dataChartMO = this.createChart(this.totalCostPorMO);

    this.fieldsMO.reset();
  }

  removeMO(field: number) {
    const fieldTemp = this.MOList[field];
    this.MOList.splice(field, 1);
    this.totalCostPorMO = this.groupByKeyLabors(this.MOList, 'labor');
    this.dataChartMO = this.createChart(this.totalCostPorMO);
    this.#notificationsService.popAsync({
      type: 'success',
      title: 'Acción Exitosa',
      body: 'Se ha eliminado el campo ' + fieldTemp.name + ' del productor',
      progressBar: true,
      progressBarDirection: 'increasing',
    });
  }

  inputEvent(event: Event) {
    let rut = this.#rutService.getRutChileForm(
      2,
      (event.target as HTMLInputElement).value
    );
    if (rut)
      this.agregarForm.controls['rut'].patchValue(rut, { emitEvent: false });
  }

  async loadProducers() {
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      'fields[active]': 'true',
    };
    await this.#companyService.getCompanies(params).subscribe(
       (data: any) => {
        this.groups =  data.data;
      },
      (error: { message: any }) => {
        console.log('error x: ', error.message);
      }
    );
  }

  onSelect(data: any) {
    if (data == 'Arriendo') {
      this.showPossession = true;
    } else {
      this.showPossession = false;
    }
  }

  async changeProductor(suid: any) {
    let search_index = await this.groups
      .map((e: { _id: any }) => e._id)
      .indexOf(suid);

    this.agregarForm.patchValue({
      company_field: null,
    });

    this.companyField = this.groups[search_index].fields;

    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      sort: 'createdAt',
      'fields[company]': suid,
    };
    this.#formService.getForms(params).subscribe((data: any) => {
      this.previousSeasons = data.data;
    });
  }

  hasForId(data: any, id: string, type: string): boolean {
    return data.some((item: any) => item[type] === id);
  }

  selectPredio(searhFields: string) {
    if (this.agregarForm.value.season != null) {
      this.#formService
        .existForm(
          this.agregarForm.value.company,
          this.agregarForm.value.season,
          this.agregarForm.value.company_field
        )
        .subscribe(
          async (data: any) => {
            if (data.data !== null) {
              this.#notificationsService.popAsync({
                type: 'error',
                title: 'Error',
                body: 'Ya existe un cuaderno para el campo del productor seleccionado en esta temporada.',
                progressBar: true,
                progressBarDirection: 'increasing',
              });
              // this.notificationsService.error('Error', 'Ya existe un cuaderno para el campo del productor seleccionado en esta temporada.');
              setTimeout(() => {
                this.agregarForm.patchValue({ company_field: null });
              }, 500);
            } else {
              let search_index = await this.companyField
                .map((e: { _id: any }) => e._id)
                .indexOf(searhFields);

              this.agregarForm.patchValue({
                total_ha: this.companyField[search_index].ha,
              });
            }
          },
          (error: any) => {
            console.log('error: ', error);
          }
        );
    } else {
      this.#notificationsService.popAsync({
        type: 'error',
        title: 'Error',
        body: 'Debe seleccionar una temporada',
        progressBar: true,
        progressBarDirection: 'increasing',
      });
      setTimeout(() => {
        this.agregarForm.patchValue({ company_field: null });
      }, 500);
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
  async loadProducts() {
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      sort: 'name',
      'fields[active]': true,
    };
    await this.#productService.getProducts(params).subscribe(
      (data: any) => {
        this.products = data.data;
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
    await this.#seedService.getSeeds(params).subscribe(
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

  async loadSeedTypes() {
    const params = {
      'page[number]': 0,
      'page[size]': 9999999999,
      sort: 'name',
      'fields[active]': true,
    };
    await this.#seedTypeService.getSeedTypes(params).subscribe(
      (data: any) => {
        this.seedTypes = data.data;
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  async loadPlantingMethods() {
    const params = {
      'page[number]': 0,
      'page[size]': 9999999999,
      sort: 'name',
      'fields[active]': true,
    };
    await this.#manoDeObraService.getPlantingMethods(params).subscribe(
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
        this.otrosCostosData = data.data;
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
    await this.#workService.getWorks(params).subscribe(
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
    await this.#machineryService.getMachines(params).subscribe(
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
    await this.#seasonService.getSeasons(params).subscribe(
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
    await this.#cropService.getCropList().subscribe(
      (data: any) => {
        this.crops = data.data;
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  searchNameLabor(id: string) {
    const workFinded = this.works.find((item: any) => item._id === id);
    return workFinded.name;
  }

  searchNameOtroCosto(id: string) {
    const tmp = this.otrosCostosData.find((item: any) => item._id === id);
    return tmp.name;
  }

  searchNameMachinery(id: string) {
    const machineryFinded = this.machines.find((item: any) => item._id === id);
    return machineryFinded.name;
  }

  searchNameProduct(id: string) {
    const productFinded = this.products.find((item: any) => item._id === id);
    return productFinded.name;
  }

  searchNameCategory(id: string) {
    const categoryFinded = this.categorys.find((item: any) => item._id === id);
    return categoryFinded.name;
  }

  searchNameMO(id: string) {
    const manoDeObraName = this.manoDeObras.find(
      (item: any) => item._id === id
    );
    return manoDeObraName.name;
  }

  getKeys(array: any): string[] {
    if (array) {
      return Object.keys(array);
    } else {
      return [];
    }
  }

  groupByKey(array: any, key: string) {
    const newArray = array.reduce((groups: any, insumo: any) => {
      const category = this.searchNameCategory(insumo[key]);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(insumo);
      return groups;
    }, {});

    return newArray;
  }

  groupByKeyLabors(array: any, key: string) {
    const newArray = array.reduce((groups: any, insumo: any) => {
      const category = this.searchNameLabor(insumo[key]);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(insumo);
      return groups;
    }, {});

    return newArray;
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

  sumarTotalCostPorMO(data: any) {
    const result: { [key: string]: number } = {};

    data.forEach((item: any) => {
      const mo = this.searchNameMO(item.mo);
      const totalCost = item.total_cost;

      if (!result[mo]) {
        result[mo] = 0;
      }
      result[mo] += totalCost;
    });

    return result;
  }

  habilitarFormularios(value: any) {
    if (value != '') {
      this.habilitarForms = true;
    } else {
      this.habilitarForms = false;
    }
  }

  onSelectAnalisisSuelo(value: any) {
    const booleanValue = value === 'true';
    if (booleanValue) {
      this.mostrarSubirAnalisisSuelo = true;
      this.agregarForm.get('soil_analysis')?.setValue(true);
    } else {
      this.agregarForm.get('soil_analysis')?.setValue(false);
      this.mostrarSubirAnalisisSuelo = false;
    }
  }

  onFileSelected(event: any) {
    this.analisisSueloFile = event.target.files[0];
  }

  uploadGuiaAnalisis(event: any) {
    this.guiaFile = event.target.files[0];
  }

  uploadAdopcion1(event: any) {
    this.adopcionFile1 = event.target.files[0];
  }

  uploadAdopcion2(event: any) {
    this.adopcionFile2 = event.target.files[0];
  }
}
