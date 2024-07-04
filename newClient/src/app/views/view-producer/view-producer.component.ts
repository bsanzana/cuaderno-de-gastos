import { Component, inject } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { fieldNotebookService } from 'src/app/services/field-notebook.service';
import { jwtDecode } from 'jwt-decode';
import {
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  GridModule,
  TableModule,
} from '@coreui/angular-pro';
import { VerModalComponent } from '../../views/field-notebook/ver-modal/ver-modal.component';
import { ExportExcelComponent } from '../../views/export-excel/export-excel.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEye,
  faPenToSquare,
  faTrash,
  faFileExcel,
  faPlus,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-producer',
  standalone: true,
  imports: [
    GridModule,
    CardModule,
    TableModule,
    ButtonModule,
    ButtonGroupModule,
    FontAwesomeModule,
    ExportExcelComponent
  ],
  templateUrl: './view-producer.component.html',
  providers: [fieldNotebookService, AuthenticationService],
})
export class ViewProducerComponent {
  faEye = faEye;
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;
  faFileExcel = faFileExcel;
  faPlus = faPlus;
  faDownload = faDownload;

  fieldNotebookService = inject(fieldNotebookService);
  authenticationService = inject(AuthenticationService);
  openModal = inject(NgbModal);
  router = inject(Router);

  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = 'name';

  token: any;
  cuadernos: any;
  ngOnInit(): void {
    this.token = jwtDecode(this.authenticationService.getToken());
    console.log(jwtDecode(this.authenticationService.getToken()));
    this.loadForms();
  }

  openCuaderno(cuaderno: any) {
    const modalRef = this.openModal.open(VerModalComponent, {
      size: 'xl',
      backdrop: 'static',
    });

    modalRef.componentInstance.cuaderno = cuaderno;
  }
  

  logOut(){
    this.authenticationService.logout({}).subscribe(
      (response: any) => {
        localStorage.removeItem('consulagro-user-token')
        this.router.navigate(['/login']);
      }, (error: any) => {
      }
    );
  }
  loadForms() {
    const params: any = {
      'page[number]': (this.page - 1).toString(),
      'page[size]': this.pageSize.toString(),
      sort: this.sort,
      'fields[rut]': this.token.rut,
    };

    this.fieldNotebookService.getForms(params).subscribe(
      (data: any) => {
        this.cuadernos = data.data;
        console.log(this.cuadernos);
        this.total = data.meta['total-items'];
      },
      (error: { message: any }) => {
        console.log('error: ', error.message);
      }
    );
  }
}
