import { NgStyle, CommonModule } from '@angular/common';
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
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
import { SeasonService } from '../../services/season.service';
import { Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPenToSquare,
  faTrash,
  faFileExcel,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';

import { AgregarModalComponent } from './agregar-modal/agregar-modal.component';
import { EliminarModalComponent } from './eliminar-modal/eliminar-modal.component';
import { EditarModalComponent } from './editar-modal/editar-modal.component';
import { ToasterService, ToasterModule } from 'angular-toaster';

@Component({
  selector: 'app-seasons',
  templateUrl: 'seasons.component.html',
  // styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [
    NgbModule,
    FontAwesomeModule,
    CommonModule,
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
  providers: [AuthenticationService, SeasonService, ToasterService],
})
export class SeasonsComponent implements OnInit {
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faFileExcel = faFileExcel;
  faCheck = faCheck;

  modelService = inject(NgbModal);
  seasonService = inject(SeasonService);
  toasterService = inject(ToasterService);

  readonly #authenticationService: AuthenticationService = inject(
    AuthenticationService
  );

  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = 'name';

  seasons: any;

  constructor(
    private router: Router // private authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    if (this.#authenticationService.isLoggedIn()) {
      this.loadSeasons();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadSeasons() {
    const params = {
      'page[number]': (this.page - 1).toString(),
      'page[size]': this.pageSize.toString(),
      sort: this.sort,
    };
    this.seasonService.getSeasons(params).subscribe(
      (data: any) => {
        this.seasons = data.data;
        this.total = data.meta['total-items'];
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  openModal() {
    const modalRef = this.modelService.open(AgregarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadSeasons();
      },
      (reason) => {
      }
    );
  }

  removeSeason(id: any, name: any) {
    const modalRef = this.modelService.open(EliminarModalComponent, {
      size: 'md',
      backdrop: 'static',
    });

    modalRef.componentInstance.id = id;
    modalRef.componentInstance.nameSeason = name;

    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.respuesta);
        this.loadSeasons();
      },
      (reason) => {
      }
    );
  }

  editSeason(season: any) {
    const modalRef = this.modelService.open(EditarModalComponent, {
      size: 'lg',
      backdrop: 'static',
    });

    modalRef.componentInstance.season = season;

    modalRef.result.then(
      (result) => {
        this.toasterService.pop('success', result.message);
        this.loadSeasons();
      },
      (reason) => {
      }
    );
  }

  generateExcel(dato: any) {}

  onPageChange(event: number) {
    this.page = event;
    this.loadSeasons();
  }
}
