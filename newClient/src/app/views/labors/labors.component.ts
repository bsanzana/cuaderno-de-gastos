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

import { AuthenticationService } from '../../services/authentication.service';
import { WorkService } from '../../services/work.service';
import { Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPenToSquare,
  faTrash,
  faXmark,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

import { AgregarModalComponent } from './agregar-modal/agregar-modal.component';
import { EliminarModalComponent } from './eliminar-modal/eliminar-modal.component';
import { EditarModalComponent } from './editar-modal/editar-modal.component';
import { ToasterModule, ToasterService } from 'angular-toaster';

@Component({
  selector: 'labors',
  templateUrl: 'labors.component.html',
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
  providers: [AuthenticationService, WorkService, ToasterService],
})
export class LaborsComponent implements OnInit {
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faXmark = faXmark;
  faCheck = faCheck;

  readonly #authenticationService: AuthenticationService = inject(
    AuthenticationService
  );
  workService = inject(WorkService);
  modalService = inject(NgbModal);
  toasterService = inject(ToasterService);

  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = 'name';

  works: any;

  constructor(
    private router: Router // private authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    if (this.#authenticationService.isLoggedIn()) {
      this.loadWorks();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadWorks() {
    const params = {
      'page[number]': (this.page - 1).toString(),
      'page[size]': this.pageSize.toString(), 
      sort: this.sort,
    };
    this.workService.getWorks(params).subscribe(
      (data: any) => {
        this.works = data.data;
        this.total = data.meta['total-items'];
        console.log(this.works)
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  addLabor() {
    const modalRef = this.modalService.open(AgregarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadWorks();
      },
      (reason) => {}
    );
  }

  editLabor(labor: any) {
    const modalRef = this.modalService.open(EditarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.componentInstance.labor = labor;

    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.message);
        this.loadWorks();
      },
      (reason) => {}
    );
  }

  removeLabor(labor: any) {
    const modalRef = this.modalService.open(EliminarModalComponent, {
      size: 'md',
      backdrop: 'static',
    });

    modalRef.componentInstance.labor = labor;

    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadWorks();
      },
      (reason) => {}
    );
  }

  onPageChange(event: number) {
    this.page = event;
    this.loadWorks();
  }
}
