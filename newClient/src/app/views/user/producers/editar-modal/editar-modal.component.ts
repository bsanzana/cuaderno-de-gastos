import { Component, Input, OnInit, inject } from '@angular/core';
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
  DropdownModule,
  SharedModule,
} from '@coreui/angular-pro';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faLock,
  faPenToSquare,
  faTrash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';

import { DirectiveModule } from '../../../../utils/uppercase.directive';
import { CompanyGroupService } from '../../../../services/company-group.service';
import { CompanyService } from '../../../../services/company.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-editar-producer-modal',
  templateUrl: './editar-modal.component.html',
  standalone: true,
  styles: [],
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
    ReactiveFormsModule,
    ButtonDirective,
    ButtonGroupComponent,
    DirectiveModule,
    ToasterModule,
    UiSwitchModule,
    DatePickerModule,
    DropdownModule,
    SharedModule,
  ],
  providers: [
    FormBuilder,
    CompanyGroupService,
    RutService,
    ToasterService,
    CompanyService,
  ],
})
export class EditarModalComponent implements OnInit {
  @Input() miid: any;

  faTrash = faTrash;
  public config: ToasterConfig = new ToasterConfig({
    mouseoverTimerStop: true,
    timeout: 2000,
    animation: 'fade',
    limit: 4,
  });

  readonly #companyGroupService: CompanyGroupService =
    inject(CompanyGroupService);
  readonly #rutService: RutService = inject(RutService);
  readonly #notificationsService: ToasterService = inject(ToasterService);
  readonly #companyService: CompanyService = inject(CompanyService);

  agregarForm!: FormGroup;
  fieldsForm!: FormGroup;
  machineryForm!: FormGroup;

  formError: boolean = false;
  errorMessage: string = '';

  producer: any;
  groups: any;
  fields: any[] = [];
  machinerys: any[] = [];

  genders = ['Masculino', 'Femenino', 'Otro'];

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder // public _loginService: AuthenticationService, // public companyGroupService: CompanyGroupService,
  ) {
    this.createForm();
    this.createFields();
    this.createMachinery();
  }

  createForm() {
    this.agregarForm = this.formBuilder.group({
      rut: ['', [Validators.required, this.#rutService.validaRutForm]],
      active: [true],
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required,Validators.minLength(3)]],
      group: [null, Validators.required],
      activities_sii: [true],
      gender: [null],
      birth_date: [null],
      password: [null],
    });
  }

  createFields() {
    this.fieldsForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ],
      ],
      sector: ['', [Validators.required]],
      rol: ['', [Validators.required]],
      address: ['', [Validators.required]],
      ha: ['', [Validators.required]],
    });
  }

  createMachinery() {
    this.machineryForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
        ],
      ],
      brand: ['', [Validators.required]],
      hp: [''],
    });
  }

  ngOnInit() {
    this.loadGroups();

    this.#companyService.viewCompany(this.miid).subscribe(
      (data: any) => {
        this.agregarForm.patchValue({
          rut: data.data.rut,
          active: data.data.active,
          name: data.data.name || '',
          lastname: data.data.lastname || '',
          gender: data.data.gender || '',
          birth_date: data.data.birth_date || '',
          activities_sii: data.data.activities_sii,
          group: data.data.group._id || null,
        });
        this.fields = data.data.fields;
        this.machinerys = data.data.machinery;
        this.producer = data.data;
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  onSubmit() {
    var seEnvia = {
      name: this.agregarForm.value.name,
      lastname: this.agregarForm.value.lastname,
      rut: this.agregarForm.value.rut,
      birth_date: this.agregarForm.value.birth_date,
      gender: this.agregarForm.value.gender,
      activities_sii: this.agregarForm.value.activities_sii,
      group: this.agregarForm.value.group,
      active: this.agregarForm.value.active,
      fields: this.fields,
      machinery: this.machinerys,
    };
    this.#companyService.editCompany({ company: seEnvia }, this.miid).subscribe(
      (data: any) => {
        this.activeModal.close({
          respuesta: data.message,
        });
      },
      (error: { message: any }) => {
        this.#notificationsService.popAsync({
          type: 'error',
          title: 'Error',
          body: error.message,
          progressBar: true,
          progressBarDirection: 'increasing',
        });
      }
    );
    // this.#companyService.createCompany({company: seEnvia})
    //   .subscribe(
    //       (data: any) => {
    //         this.activeModal.close({
    //           respuesta: data.message
    //         });
    //       },
    //       (error: { message: any; }) => {
    //         this.#notificationsService.popAsync({
    //           type:'error',
    //           title:'Error',
    //           body: error.message,
    //           progressBar: true,
    //           progressBarDirection: 'increasing'
    //         });
    //         console.log(error);
    //       }
    //   );
  }

  addFields() {
    // console.log('campos: ', this.fieldsForm.value)
    this.fields.push(this.fieldsForm.value);
    this.fieldsForm.reset();
  }
  removeField(field: number) {
    const fieldTemp = this.fields[field];
    this.fields.splice(field, 1);
    this.#notificationsService.popAsync({
      type: 'success',
      title: 'Acción Exitosa',
      body: 'Se ha eliminado el campo ' + fieldTemp.name + ' del productor',
      progressBar: true,
      progressBarDirection: 'increasing',
    });
  }

  addMachinery() {
    // console.log('maquinarias: ', this.machineryForm.value)
    this.machinerys.push(this.machineryForm.value);
    this.machineryForm.reset();
  }
  removeMachinery(machine: number) {
    const machineTemp = this.machinerys[machine];
    this.machinerys.splice(machine, 1);
    this.#notificationsService.popAsync({
      type: 'success',
      title: 'Acción Exitosa',
      body:
        'Se ha eliminado la maquinaria ' + machineTemp.name + ' del productor',
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

  loadGroups() {
    this.#companyGroupService.getCompanyGroupList().subscribe(
      (data: any) => {
        // console.log('llega grupo: ', data.data)
        this.groups = data.data;
        // for (const group of data.data) {
        //     this.groups.push({
        //         _id: group._id.toString(),
        //         name: group.name.toString(),
        //         toString: function () {
        //             return this.name;
        //         }
        //     });
        // }
      },
      (error: { message: any }) => {
        console.log('error: ', error.message);
      }
    );
  }
}
