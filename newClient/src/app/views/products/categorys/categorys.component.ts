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
import { CategoryService } from '../../../services/category.service';
import { Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPenToSquare,
  faTrash,
  faXmark,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import { ToasterModule, ToasterService } from 'angular-toaster';
import { AgregarModalComponent } from './agregar-modal/agregar-modal.component';
import { EditarModalComponent } from './editar-modal/editar-modal.component';
@Component({
  selector: 'app-categorys',
  templateUrl: 'categorys.component.html',
  // styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [
    ToasterModule,
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
  ],
  providers: [AuthenticationService, CategoryService],
})
export class CategorysComponent implements OnInit {
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faCheck = faCheck;
  faXmark = faXmark;

  readonly #authenticationService: AuthenticationService = inject(
    AuthenticationService
  );
  categoryProductService = inject(CategoryService);
  modalService = inject(NgbModal);
  toasterService = inject(ToasterService);

  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = 'name';

  categorys: any;

  constructor(
    private router: Router
  ) // private authenticationService: AuthenticationService,
  {}

  ngOnInit() {
    if (this.#authenticationService.isLoggedIn()) {
      this.loadCategory();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadCategory() {
    const params = {
      'page[number]': (this.page - 1).toString(),
      'page[size]': this.pageSize.toString(),
      sort: this.sort,
    };
    this.categoryProductService.getCategorys(params).subscribe(
      (data: any) => {
        this.categorys = data.data;
        this.total = data.meta['total-items'];
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  addCategory() {
    const modalRef = this.modalService.open(AgregarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadCategory();
      },
      (reason) => {}
    );
  }

  editCategory(category: any) {
    const modalRef = this.modalService.open(EditarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.componentInstance.category = category;
    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadCategory();
      },
      (reason) => {}
    );
  }
  onPageChange(event: number) {
    this.page = event;
    this.loadCategory();
  }
}
