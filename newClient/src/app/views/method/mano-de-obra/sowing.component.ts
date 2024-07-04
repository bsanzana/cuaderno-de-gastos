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
import { PlantingMethodService } from '../../../services/mano-de-obra.service';
import { Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPenToSquare,
  faTrash,
  faXmark,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

import { AgregarModalComponent } from './agregar-modal/agregar-modal.component';
import { EditarModalComponent } from './editar-modal/editar-modal.component';

import { ToasterService, ToasterModule } from 'angular-toaster';

@Component({
  selector: 'app-sowing',
  templateUrl: 'sowing.component.html',
  // styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [ToasterModule,
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
  providers: [AuthenticationService, PlantingMethodService],
})
export class SowingComponent implements OnInit {
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faCheck = faCheck;
  faXmark = faXmark;

  readonly #authenticationService: AuthenticationService = inject(
    AuthenticationService
  );
  plantingMethodService = inject(PlantingMethodService);
  modalService = inject(NgbModal);
  toasterService = inject(ToasterService);

  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = 'name';

  plantingMethods: any;

  constructor(
    private router: Router // private authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    if (this.#authenticationService.isLoggedIn()) {
      this.loadPlantingMethods();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadPlantingMethods() {
    const params = {
      'page[number]': (this.page - 1).toString(),
      'page[size]': this.pageSize.toString(),
      sort: this.sort,
    };
    this.plantingMethodService.getPlantingMethods(params).subscribe(
      (data: any) => {
        this.plantingMethods = data.data;
        this.total = data.meta['total-items'];
        console.log(this.plantingMethods)
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  addSowing() {
    const modalRef = this.modalService.open(AgregarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadPlantingMethods();
      },
      (reason) => {}
    );
  }


  editSowing(sowing: any) {
    const modalRef = this.modalService.open(EditarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.componentInstance.sowing = sowing;
    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadPlantingMethods();
      },
      (reason) => {}
    );
  }

  onPageChange(event: number) {
    this.page = event;
    this.loadPlantingMethods();
  }
}
