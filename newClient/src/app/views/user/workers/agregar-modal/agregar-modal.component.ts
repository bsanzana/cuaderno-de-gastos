import { Component, OnInit, inject } from '@angular/core';
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
import { UiSwitchModule } from 'ngx-ui-switch';
import { ToasterConfig, ToasterModule, ToasterService } from 'angular-toaster';

import {
  CardComponent,
  ButtonDirective,
  ButtonGroupComponent,
  FormModule,
  MultiSelectComponent,
  MultiSelectOptionComponent,
} from '@coreui/angular-pro';

import { DirectiveModule } from '../../../../utils/uppercase.directive';
import { UserService } from '../../../../services/user.service';
import { SpecialistService } from '../../../../services/specialist.service';

@Component({
  selector: 'app-agregar-worker-modal',
  templateUrl: './agregar-modal.component.html',
  standalone: true,
  styles: [],
  imports: [
    ToasterModule,
    CardComponent,
    CommonModule,
    FormModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonDirective,
    ButtonGroupComponent,
    DirectiveModule,
    UiSwitchModule,
    MultiSelectComponent,
    MultiSelectOptionComponent,
  ],
  providers: [FormBuilder, UserService, RutService, ToasterService],
})
export class AgregarModalComponent implements OnInit {
  roleList: string[] = ['adviser', 'admin'];

  public config: ToasterConfig = new ToasterConfig({
    mouseoverTimerStop: true,
    timeout: 2000,
    animation: 'fade',
    limit: 4,
  });

  readonly #specialistService: SpecialistService = inject(SpecialistService);
  readonly #userService: UserService = inject(UserService);
  readonly #rutService: RutService = inject(RutService);
  readonly #notificationsService: ToasterService = inject(ToasterService);

  agregarForm!: FormGroup;
  especialistas: any = [];

  formError: boolean = false;
  errorMessage: string = '';

  avatar: any;
  logo: any;
  firma: any;
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) // public _loginService: AuthenticationService,
  // public companyGroupService: CompanyGroupService,
  {
    this.createForm();
  }

  createForm() {
    this.agregarForm = this.formBuilder.group({
      rut: ['', [Validators.required, this.#rutService.validaRutForm]],
      active: [true],
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.minLength(3)]],
      show: [true],

      address: this.formBuilder.group({
        address: ['', [Validators.minLength(5), Validators.maxLength(50)]],
        region: ['', [Validators.required]],
        province: ['', [Validators.required]],
        commune: ['', [Validators.required]],
      }),

      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: [null, Validators.required],
      password: ['', [Validators.minLength(3), Validators.required]],

      specialists: [],
    });
  }

  ngOnInit() {
    this.loadSpecialist();
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('avatar', this.avatar);
    formData.append('logo', this.logo);
    formData.append('firma', this.firma);
    formData.append('data', JSON.stringify(this.agregarForm.value));
    this.#userService.createUser(formData).subscribe(
      (data: any) => {
        this.activeModal.close({
          respuesta: data.message,
        });
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
        this.#notificationsService.popAsync({
          type: 'error',
          title: 'Error',
          body: error.message,
          progressBar: true,
          progressBarDirection: 'increasing',
        });
      }
    );
  }

  uploadImage(event: any, type: any) {
    const file = event.target.files[0];

    const validTypes = ['image/jpeg', 'image/png'];

    if (!validTypes.includes(file.type)) {
      this.#notificationsService.popAsync({
        type: 'error',
        title: 'Error',
        body: `El archivo ${type} debe ser una imagen en formato JPEG o PNG`,
        progressBar: true,
        progressBarDirection: 'increasing',
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.#notificationsService.popAsync({
        type: 'error',
        title: 'Error',
        body: `El tamaño del archivo ${type} no debe superar los 2 MB`,
        progressBar: true,
        progressBarDirection: 'increasing',
      });
      return;
    } else {
      if (type == 'avatar') {
        this.avatar = file;
        console.log(this.avatar);
      }
      if (type == 'logo') {
        this.logo = file;
      }
      if (type == 'firma') {
        this.firma = file;
      }
    }
  }
  inputEvent(event: Event) {
    let rut = this.#rutService.getRutChileForm(
      2,
      (event.target as HTMLInputElement).value
    );
    if (rut)
      this.agregarForm.controls['rut'].patchValue(rut, { emitEvent: false });
  }

  loadSpecialist() {
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      'fields[active]': true,
    };
    this.#specialistService.getSpecialists(params).subscribe(
      (data: any) => {
        this.especialistas = data.data;
        // this.total = data.meta['total-items'];
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error 1: ', error.message);
      }
    );
  }
}
