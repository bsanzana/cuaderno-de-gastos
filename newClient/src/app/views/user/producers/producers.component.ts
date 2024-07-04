import { NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {ToasterConfig, ToasterModule, ToasterService} from 'angular-toaster';

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
  TextColorDirective
} from '@coreui/angular-pro';

import {AuthenticationService} from '../../../services/authentication.service';
import { CompanyService } from "../../../services/company.service";
import { Router } from '@angular/router';

import { AgregarModalComponent } from "./agregar-modal/agregar-modal.component";
import { VerProducersModalComponent } from "./ver-modal/ver-modal.component";
import { EditarModalComponent } from "./editar-modal/editar-modal.component";


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock, faPenToSquare, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-producers',
  templateUrl: 'producers.component.html',
  // styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [ToasterModule, NgbModule, FontAwesomeModule, TextColorDirective, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, NgStyle, CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent, CardHeaderComponent, TableDirective, AvatarComponent],
  providers: [AuthenticationService, CompanyService]
})
export class ProducersComponent implements OnInit {

  public config: ToasterConfig = new ToasterConfig(
    {
      mouseoverTimerStop: true, 
      timeout: 2000, 
      animation: 'fade', 
      limit: 4
    }
  );

  faPenToSquare = faPenToSquare;
  faLock= faLock;
  faTrash= faTrash;
  faEye= faEye;

  readonly #authenticationService: AuthenticationService = inject(AuthenticationService);
  readonly #producersService: CompanyService = inject(CompanyService);
  readonly #openModal: NgbModal = inject(NgbModal);
  readonly #notificationsService: ToasterService = inject(ToasterService);

  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = 'name';

  companies: any;
  user:any
  constructor(
    private router: Router,
    // private authenticationService: AuthenticationService,
  ){
    this.user = this.#authenticationService.getCurrentUser();
    console.log(this.user)
  }


  ngOnInit() {
    if(this.#authenticationService.isLoggedIn()){
      // hola
      this.loadCompanies();
    }else{
      this.router.navigate(['/login']);
    }

  }

  loadCompanies() {
    const params = {
        'page[number]': (this.page - 1).toString(),
        'page[size]': this.pageSize.toString(),
        'sort': this.sort
    };
    this.#producersService.getCompanies(params).subscribe(
        (data: any) => {
            this.companies = data.data;
            console.log(this.companies)
            this.total = data.meta['total-items'];
        }, (error: { message: any; }) => {
            // this.notificationsService.error('Error', error.message);
            console.log('error x: ', error.message)
        }
    );
}

  editModal(miid: string) {
    const modalRef = this.#openModal.open(EditarModalComponent, {
      size: "lg", 
      backdrop: 'static' 
    });

    modalRef.componentInstance.miid = miid;

    modalRef.result.then((result) => {
      console.log(`Closed with: ${result.respuesta}`);
      this.loadCompanies();
      this.#notificationsService.popAsync({
        type:'success', 
        title:'Acción Exitosa', 
        body: result.respuesta, 
        progressBar: true, 
        progressBarDirection: 'increasing'
      });
    }, (reason) => {
      console.log(`Salida `, reason);
    });
  }

  viewCompany(data: any){
    const modalRef = this.#openModal.open(VerProducersModalComponent, {
      size: "lg", 
      backdrop: 'static' 
    });

    modalRef.componentInstance.data = data;

    // modalRef.result.then((result) => {
    //   console.log(`Closed with: ${result.respuesta}`);
    //   this.loadCompanies();
    //   this.#notificationsService.popAsync({
    //     type:'success', 
    //     title:'Acción Exitosa', 
    //     body: result.respuesta, 
    //     progressBar: true, 
    //     progressBarDirection: 'increasing'
    //   });
    // }, (reason) => {
    //   console.log(`Salida `, reason);
    // });
  }

  removeCompany(data: string){

  }

  newOpenModal() {
    const modalRef = this.#openModal.open(AgregarModalComponent, {
      size: "lg", 
      backdrop: 'static' 
    });

    //modalRef.componentInstance.data_id = id;

    modalRef.result.then((result) => {
      console.log(`Closed with: ${result.respuesta}`);
      this.loadCompanies();
      this.#notificationsService.popAsync({
        type:'success', 
        title:'Acción Exitosa', 
        body: result.respuesta, 
        progressBar: true, 
        progressBarDirection: 'increasing'
      });
    }, (reason) => {
      console.log(`Salida `, reason);
    });
  }
  

  onPageChange(event: number){
    this.page = event
    this.loadCompanies();
  }

}
