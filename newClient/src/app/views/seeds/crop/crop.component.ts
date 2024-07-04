import { NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { CropService } from '../../../services/crop.service';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faTrash,
  faXmark,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { ToasterService, ToasterModule } from 'angular-toaster';
import { AgregarModalComponent } from './agregar-modal/agregar-modal.component';
import { EditarModalComponent } from './editar-modal/editar-modal.component';

@Component({
  selector: 'app-crop',
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
  templateUrl: './crop.component.html',
  providers: [AuthenticationService, CropService, ToasterService],
})
export class CropComponent {
  faCheck = faCheck;
  faTrash = faTrash;
  faXmark = faXmark;
  faPenToSquare = faPenToSquare;

  readonly #authenticationService: AuthenticationService = inject(
    AuthenticationService
  );

  cropService = inject(CropService);
  modalService = inject(NgbModal);
  toasterService = inject(ToasterService);

  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = 'name';

  crops: any;

  constructor(
    private router: Router // private authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    if (this.#authenticationService.isLoggedIn()) {
      this.loadCrops();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadCrops() {
    const params = {
      'page[number]': (this.page - 1).toString(),
      'page[size]': this.pageSize.toString(),
      sort: this.sort,
    };
    this.cropService.getCrops(params).subscribe(
      (data: any) => {
        this.crops = data.data;
        this.total = data.meta['total-items'];
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  addCrop() {
    const modalRef = this.modalService.open(AgregarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadCrops();
      },
      (reason) => {}
    );
  }

  // removeSeedType(seedType: any) {
  //   const modalRef = this.modalService.open(EliminarModalComponent, {
  //     size: 'lg',
  //     backdrop: 'static',
  //   });

  //   modalRef.componentInstance.seedType = seedType;
  //   modalRef.result.then(
  //     (result) => {
  //       this.toasterService.pop('success', result.respuesta);
  //       this.loadSeedTypes();
  //     },
  //     (reason) => {}
  //   );
  // }

  editCrop(crop: any) {
    const modalRef = this.modalService.open(EditarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.componentInstance.crop = crop;
    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadCrops();
      },
      (reason) => {}
    );
  }

  onPageChange(event: number) {
    this.page = event;
    this.loadCrops();
  }
}
