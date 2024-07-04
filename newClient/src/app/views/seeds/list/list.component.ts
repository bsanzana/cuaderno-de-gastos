import { NgStyle } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
} from '@angular/core';
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
import { SeedService } from '../../../services/seed.service';
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
  selector: 'app-list-seeds',
  templateUrl: 'list.component.html',
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
  providers: [AuthenticationService, SeedService, ToasterService],
})
export class SeedsComponent implements OnInit {
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faXmark = faXmark
  faCheck = faCheck
  readonly #authenticationService: AuthenticationService = inject(
    AuthenticationService
  );
  seedService = inject(SeedService);
  modalService = inject(NgbModal);
  toasterService = inject(ToasterService);
  router = inject(Router);

  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = 'name';

  seeds: any;

  constructor() {} // private authenticationService: AuthenticationService,

  ngOnInit() {
    if (this.#authenticationService.isLoggedIn()) {
      this.loadSeeds();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadSeeds() {
    const params = {
      'page[number]': (this.page - 1).toString(),
      'page[size]': this.pageSize.toString(),
      sort: this.sort,
      fields: ['active']
    };
    this.seedService.getSeeds(params).subscribe(
      (data: any) => {
        this.seeds = data.data;
        console.log(this.seeds)
        this.total = data.meta['total-items'];
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  addSeed() {
    const modalRef = this.modalService.open(AgregarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadSeeds();
      },
      (reason) => {}
    );
  }

  removeSeed(seed: any) {
    const modalRef = this.modalService.open(EliminarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.componentInstance.seed = seed;
    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadSeeds();
      },
      (reason) => {}
    );
  }

  editSeed(seed: any) {
    const modalRef = this.modalService.open(EditarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.componentInstance.seed = seed;
    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadSeeds();
      },
      (reason) => {}
    );
  }

  onPageChange(event: number) {
    this.page = event;
    this.loadSeeds();
  }
}
