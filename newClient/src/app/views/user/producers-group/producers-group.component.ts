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

import { AgregarModalComponent } from "./agregar-modal/agregar-modal.component";
import { EditarModalComponent } from "./editar-modal/editar-modal.component";

import {AuthenticationService} from '../../../services/authentication.service';
import { CompanyGroupService } from "../../../services/company-group.service";
import { Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-my-producers',
  templateUrl: 'producers-group.component.html',
  // styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [ToasterModule, NgbModule, FontAwesomeModule, TextColorDirective, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, NgStyle, CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent, CardHeaderComponent, TableDirective, AvatarComponent],
  providers: [AuthenticationService, CompanyGroupService, NgbModal, ToasterService]
})
export class GroupComponent implements OnInit {

  public config: ToasterConfig = new ToasterConfig(
    {
      mouseoverTimerStop: true, 
      timeout: 2000, 
      animation: 'fade', 
      limit: 4
    }
  );

  faPenToSquare = faPenToSquare;
  faTrash= faTrash;

  readonly #authenticationService: AuthenticationService = inject(AuthenticationService);
  readonly #companyGroupService: CompanyGroupService = inject(CompanyGroupService);
  readonly #openModal: NgbModal = inject(NgbModal);
  readonly #notificationsService: ToasterService = inject(ToasterService);


  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = 'name';
  companyGroups: any;

  constructor(
    private router: Router,
    // private authenticationService: AuthenticationService,
  ){}


  ngOnInit() {
    if(this.#authenticationService.isLoggedIn()){
      this.loadCompanyGroups();
    }else{
      this.router.navigate(['/login']);
    }

  }


  loadCompanyGroups() {
    const params = {
        'page[number]': (this.page - 1).toString(),
        'page[size]': this.pageSize.toString(),
        'sort': this.sort
    };
    this.#companyGroupService.getCompanyGroups(params).subscribe(
        (data: any) => {
            this.companyGroups = data.data;
            this.total = data.meta['total-items'];
        }, (error: { message: any; }) => {
          this.#notificationsService.popAsync({
            type:'error', 
            title:'Error', 
            body: error?.message, 
            progressBar: true, 
            progressBarDirection: 'increasing'
          });
            // console.log('error: ', error.message)
        }
    );
  }


  removeCompanyGroup(arg0: any) {

  }


  newOpenModal() {
    const modalRef = this.#openModal.open(AgregarModalComponent, {
      size: "md", 
      backdrop: 'static' 
    });

    //modalRef.componentInstance.data_id = id;

    modalRef.result.then((result) => {
      console.log(`Closed with: ${result.respuesta}`);
      this.loadCompanyGroups();
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

  editModal(miid: string) {
    const modalRef = this.#openModal.open(EditarModalComponent, {
      size: "md", 
      backdrop: 'static' 
    });

    modalRef.componentInstance.miid = miid;

    modalRef.result.then((result) => {
      console.log(`Closed with: ${result.respuesta}`);
      this.loadCompanyGroups();
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
    this.loadCompanyGroups();
  }


}
