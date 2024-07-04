import { NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
import { SeedTypeService } from '../../../services/seed-type.service';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPenToSquare,
  faTrash,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { ToasterService, ToasterModule } from 'angular-toaster';
import { AgregarModalComponent } from './agregar-modal/agregar-modal.component';
import { EliminarModalComponent } from './eliminar-modal/eliminar-modal.component';
import { EditarModalComponent } from './editar-modal/editar-modal.component';
@Component({
  selector: 'app-types',
  templateUrl: 'types.component.html',
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
  providers: [AuthenticationService, SeedTypeService, ToasterService],
})
export class TypesComponent implements OnInit {
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faCheck = faCheck;
  faXmark = faXmark;

  readonly #authenticationService: AuthenticationService = inject(
    AuthenticationService
  );

  seedTypeService = inject(SeedTypeService);
  modalService = inject(NgbModal);
  toasterService = inject(ToasterService);

  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = 'name';

  seedTypes: any;

  constructor(
    private router: Router // private authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    if (this.#authenticationService.isLoggedIn()) {
      this.loadSeedTypes();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadSeedTypes() {
    const params = {
      'page[number]': (this.page - 1).toString(),
      'page[size]': this.pageSize.toString(),
      sort: this.sort,
    };
    this.seedTypeService.getSeedTypes(params).subscribe(
      (data: any) => {
        this.seedTypes = data.data;
        this.total = data.meta['total-items'];
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  addSeedType() {
    const modalRef = this.modalService.open(AgregarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadSeedTypes();
      },
      (reason) => {}
    );
  }

  removeSeedType(seedType: any) {
    const modalRef = this.modalService.open(EliminarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.componentInstance.seedType = seedType;
    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadSeedTypes();
      },
      (reason) => {}
    );
  }

  editSeedType(seedType: any) {
    const modalRef = this.modalService.open(EditarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.componentInstance.seedType = seedType;
    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadSeedTypes();
      },
      (reason) => {}
    );
  }

  onPageChange(event: number) {
    this.page = event;
    this.loadSeedTypes();
  }
}
