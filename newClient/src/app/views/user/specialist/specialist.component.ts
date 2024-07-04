import { Component, inject } from '@angular/core';
import { AvatarComponent, ButtonGroupComponent, ButtonModule, GridModule, TableModule } from '@coreui/angular-pro';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ToasterConfig, ToasterModule, ToasterService} from 'angular-toaster';

import { AuthenticationService } from "../../../services/authentication.service";
import { SpecialistService } from "../../../services/specialist.service";

import { AgregarComponent } from "./agregar/agregar.component";
import { EditarComponent } from "./editar/editar.component";

import { environment } from '../../../../environments/environment';
import { IconModule } from '@coreui/icons-angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-specialist',
  standalone: true,
  imports: [
    AvatarComponent,
    GridModule,
    TableModule,
    IconModule,
    NgbModule,
    ToasterModule,
    ButtonModule,
    ButtonGroupComponent,
    FontAwesomeModule
  ],
  templateUrl: './specialist.component.html',
  providers:[
    ToasterService,
    AuthenticationService
  ]
})
export class SpecialistComponent {

  openModal = inject(NgbModal);
  authenticationService = inject(AuthenticationService);
  specialistService = inject(SpecialistService);
  router = inject(Router);
  notificationsService = inject(ToasterService);

  
  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = 'name';
  specialists: any = [];

  ENDPOINT_USER_IMAGE: string;
  faPenToSquare = faPenToSquare;

  public config: ToasterConfig = new ToasterConfig(
    {
      mouseoverTimerStop: true, 
      timeout: 2000, 
      animation: 'fade', 
      limit: 4
    }
  );

  constructor(){
    this.ENDPOINT_USER_IMAGE = environment.apiURL + '/api/v1/assets/user-image/';
  }

  ngOnInit() {
    if(this.authenticationService.isLoggedIn()){
      this.loadSpecialists();
    }else{
      this.router.navigate(['/login']);
    }

    
  }

  loadSpecialists(){
    const params = {
      'page[number]': (this.page - 1).toString(),
      'page[size]': this.pageSize.toString(),
      'sort': this.sort
  };
  this.specialistService.getSpecialists(params).subscribe(
      (data: any) => {
          this.specialists = data.data;
          this.total = data.meta['total-items'];
      },
      (error: { message: any; }) => {
          // this.notificationsService.error('Error', error.message);
          console.log('error 1: ', error.message)
      }
  );
  }

  newOpenModal(){
    const modalRef = this.openModal.open(AgregarComponent, {
      size: "lg", 
      backdrop: 'static' 
    });

    modalRef.result.then((result) => {
      // console.log(`Closed with: ${result.respuesta}`);
      this.notificationsService.popAsync({
        type:'success', 
        title:'Acción Exitosa', 
        body: result.respuesta, 
        progressBar: true, 
        progressBarDirection: 'increasing'
      });
      this.loadSpecialists();
    }, (reason) => {
      console.log(`Salida `, reason);
    });
  }

  editModal(suid: string){
    const modalRef = this.openModal.open(EditarComponent, {
      size: "lg", 
      backdrop: 'static' 
    });

    modalRef.componentInstance.suid = suid;

    modalRef.result.then((result) => {
      console.log(`Closed with: ${result.respuesta}`);
      this.loadSpecialists();
      this.notificationsService.popAsync({
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
    this.loadSpecialists();
  }

}
