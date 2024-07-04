import { NgStyle } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  Renderer2,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective,
} from '@coreui/angular-pro';

import { AuthenticationService } from '../../../services/authentication.service';
import { ApplicationMethodService } from '../../../services/application-method.service';
import { Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPenToSquare,
  faTrash,
  faXmark,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { ToasterService, ToasterModule } from 'angular-toaster';

import { AgregarModalComponent } from './agregar-modal/agregar-modal.component';
import { EliminarModalComponent } from './eliminar-modal/eliminar-modal.component';
import { EditarModalComponent } from './editar-modal/editar-modal.component';
@Component({
  selector: 'app-application',
  templateUrl: 'application.component.html',
  // styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [
    ToasterModule,
    FontAwesomeModule,
    NgbModule,
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
  ],
  providers: [AuthenticationService, ApplicationMethodService],
})
export class ApplicationComponent implements OnInit {
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faCheck = faCheck;
  faXmark = faXmark;

  readonly #authenticationService: AuthenticationService = inject(
    AuthenticationService
  );
  applicationMethodService = inject(ApplicationMethodService);
  modalService = inject(NgbModal);
  toasterService = inject(ToasterService);

  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = 'name';

  applicationMethods: any;

  constructor(
    private router: Router
  ) // private authenticationService: AuthenticationService,
  {}

  ngOnInit() {
    if (this.#authenticationService.isLoggedIn()) {
      this.loadApplicationMethods();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadApplicationMethods() {
    const params = {
      'page[number]': (this.page - 1).toString(),
      'page[size]': this.pageSize.toString(),
      sort: this.sort,
    };
    this.applicationMethodService.getApplicationMethods(params).subscribe(
      (data: any) => {
        this.applicationMethods = data.data;
        this.total = data.meta['total-items'];
        console.log(this.applicationMethods)
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  addApplication() {
    const modalRef = this.modalService.open(AgregarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadApplicationMethods();
      },
      (reason) => {}
    );
  }

  removeApplication(application: any) {
    const modalRef = this.modalService.open(EliminarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.componentInstance.application = application;
    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadApplicationMethods();
      },
      (reason) => {}
    );
  }

  editApplication(application: any) {
    const modalRef = this.modalService.open(EditarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.componentInstance.application = application;
    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadApplicationMethods();
      },
      (reason) => {}
    );
  }

  onPageChange(event: number) {
    this.page = event;
    this.loadApplicationMethods();
  }
}
