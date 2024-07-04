import { NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AgregarModalComponent } from './agregar-modal/agregar-modal.component';
import { EliminarModalComponent } from './eliminar-modal/eliminar-modal.component';
import { EditarModalComponent } from './editar-modal/editar-modal.component';
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

import { AuthenticationService } from '../../services/authentication.service';
import { MachineryService } from '../../services/machinery.service';
import { Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPenToSquare,
  faTrash,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { ToasterModule, ToasterService } from 'angular-toaster';

@Component({
  selector: 'app-machinery',
  templateUrl: 'machinery.component.html',
  // styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [
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
    ToasterModule,
  ],
  providers: [AuthenticationService, MachineryService],
})
export class MachineryComponent implements OnInit {
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faCheck = faCheck;
  faXmark = faXmark;

  modelService = inject(NgbModal);
  authenticationService = inject(AuthenticationService);
  machineryService = inject(MachineryService);
  toasterService = inject(ToasterService);

  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = 'name';

  machines: any;

  constructor(
    private router: Router // private authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    if (this.authenticationService.isLoggedIn()) {
      this.loadMachinery();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadMachinery() {
    const params = {
      'page[number]': (this.page - 1).toString(),
      'page[size]': this.pageSize.toString(),
      
      sort: this.sort,
    };
    this.machineryService.getMachines(params).subscribe(
      (data: any) => {
        this.machines = data.data;
        this.total = data.meta['total-items'];
        console.log(this.machines)
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );


  }

  addMachinery() {
    const modalRef = this.modelService.open(AgregarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadMachinery();
      },
      (reason) => {}
    );
  }

  removeMachinery(machinery: any) {
    const modalRef = this.modelService.open(EliminarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.componentInstance.machinery = machinery;
    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadMachinery();
      },
      (reason) => {}
    );
  }

  editMachinery(machinery: any) {
    const modalRef = this.modelService.open(EditarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.componentInstance.machinery = machinery;
    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.message);
        this.loadMachinery();
      },
      (reason) => {}
    );
  }

  onPageChange(event: number) {
    this.page = event;
    this.loadMachinery();
  }
}
