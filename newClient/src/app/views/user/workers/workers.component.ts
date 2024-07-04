import { DOCUMENT, NgStyle } from '@angular/common';
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
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { environment } from '../../../../environments/environment';
import {AuthenticationService} from '../../../services/authentication.service';
import { UserService } from "../../../services/user.service";

import { Router } from '@angular/router';

import { AgregarModalComponent } from "./agregar-modal/agregar-modal.component";
import { EditarModalComponent } from './editar-modal/editar-modal.component';
import { PasswordModalComponent } from "./password-modal/password-modal.component";

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  templateUrl: 'workers.component.html',
  standalone: true,
  imports: [ToasterModule, NgbModule,FontAwesomeModule, TextColorDirective, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, ChartjsComponent, NgStyle, CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent, CardHeaderComponent, TableDirective, AvatarComponent],
  providers: [AuthenticationService, UserService, NgbModal, ToasterService]
})
export class WorkersComponent implements OnInit {

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

  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = 'name';
  users: any;
  userActual: any;
  ENDPOINT_USER_IMAGE: string;

  readonly #authenticationService: AuthenticationService = inject(AuthenticationService);
  readonly #userService: UserService = inject(UserService);
  readonly #openModal: NgbModal = inject(NgbModal);
  readonly #notificationsService: ToasterService = inject(ToasterService);

  constructor(
    private router: Router,
    // private authenticationService: AuthenticationService,
  ){
    this.ENDPOINT_USER_IMAGE = environment.apiURL + '/api/v1/assets/avatar/';
    this.userActual = this.#authenticationService.getCurrentUser();
  }
  

  ngOnInit() {
    if(this.#authenticationService.isLoggedIn()){

      this.loadUsers();

    }else{
      this.router.navigate(['/login']);
    }

    
  }

 
  loadData() {
      // this.loadAddress();
      // this.loadUsers();
  }

  // loadAddress() {
  //     this.regionService.getRegions().subscribe(
  //         data => {
  //             this.address_regions = data.data;
  //             this.address_provinces = this.address_regions[0].provinces;
  //             this.address_communes = this.address_provinces[0].communes;
  //             this.clearUser();
  //         },
  //         error => {
  //             console.log(error.json());
  //         }
  //     );
  // }

  loadUsers(search = false) {
      const params = {
          'page[number]': (this.page - 1).toString(),
          'page[size]': this.pageSize.toString(),
          'sort': this.sort
      };
      this.#userService.getUsers(params).subscribe(
          (data: any) => {
            console.log('cosas: ', data.data)
              this.users = data.data;
              this.total = data.meta['total-items'];
          },
          (error: { message: any; }) => {
              // this.notificationsService.error('Error', error.message);
              console.log('error 1: ', error.message)
          }
      );
  }

  // clearUser() {
  //     this.user = {
  //         rut: '',
  //         name: '',
  //         role: '',
  //         company: '',
  //         address: {
  //             address: '',
  //             region: '',
  //             province: '',
  //             commune: ''
  //         },
  //         email: '',
  //         phone: '',
  //         password: '',
  //         active: true,
  //         show: false,
  //         image: null
  //     };
  // }

   openModal(modalClass: string, modalID: string, objectID: string) {
  //     this.clearUser();

  //     this.companyService.getCompanyList().subscribe(
  //         data => {
  //             this.companies = data.data;
  //         },
  //         error => {
  //             this.notificationsService.error('Error', 'Se ha producido un error al cargar los productores.');
  //             console.log(error);
  //         }
  //     );

  //     const modalConfig: any = {
  //         class: modalClass,
  //         backdrop: 'static',
  //         keyboard: false
  //     };
  //     switch (modalID) {
  //         case 'modalNew':
  //             this.modalRef = this.modalService.show(this.modalNew, modalConfig);
  //             break;
  //         case 'modalEdit':
  //             this.userService.viewUser(objectID).subscribe(
  //                 data => {
  //                     this.user = data.data;
  //                     this.gerAddressByUser();
  //                 },
  //                 error => {
  //                     this.notificationsService.error('Error', 'Se ha producido un error');
  //                     console.log(error);
  //                 }
  //             );
  //             this.modalRef = this.modalService.show(this.modalEdit, modalConfig);
  //             break;
  //         case 'modalPassword':
  //             this.userService.viewUser(objectID).subscribe(
  //                 data => {
  //                     this.user = data.data;
  //                 },
  //                 error => {
  //                     this.notificationsService.error('Error', 'Se ha producido un error');
  //                     console.log(error);
  //                 }
  //             );
  //             this.modalRef = this.modalService.show(this.modalPassword, modalConfig);
  //             break;
  //         default:
  //             break;
  //     }
  }

  // closeModal() {
  //     this.modalRef.hide();
  //     this.loadData();
  // }

  // submit() {
  //     const user = new FormData();
  //     user.append('user[rut]', this.user.rut);
  //     user.append('user[name]', this.user.name);
  //     user.append('user[email]', this.user.email);
  //     user.append('user[phone]', this.user.phone);
  //     user.append('user[role]', this.user.role);
  //     user.append('user[company]', this.user.company);
  //     user.append('user[active]', this.user.active);
  //     user.append('user[password]', this.user.password);
  //     user.append('user[show]', this.user.show);
  //     user.append('user[address]', this.user.address.address);
  //     user.append('user[address_region]', this.user.address.region);
  //     user.append('user[address_province]', this.user.address.province);
  //     user.append('user[address_commune]', this.user.address.commune);
  //     user.append('image', this.user.image);
  //     this.userService.createUser(user)
  //         .subscribe(
  //             data => {
  //                 this.loadData();
  //                 this.notificationsService.success('Usuario creado', 'Se ha creado el usuario exitosamente');
  //                 this.closeModal();
  //             },
  //             error => {
  //                 this.notificationsService.error('Error', error.message);
  //             }
  //         );
  // }

  // editUser(uid: string) {
  //     const user = new FormData();
  //     user.append('user[rut]', this.user.rut);
  //     user.append('user[name]', this.user.name);
  //     user.append('user[email]', this.user.email);
  //     user.append('user[phone]', this.user.phone);
  //     user.append('user[role]', this.user.role);
  //     user.append('user[company]', this.user.company);
  //     user.append('user[active]', this.user.active);
  //     user.append('user[show]', this.user.show);
  //     user.append('user[address]', this.user.address.address);
  //     user.append('user[address_region]', this.user.address.region);
  //     user.append('user[address_province]', this.user.address.province);
  //     user.append('user[address_commune]', this.user.address.commune);
  //     user.append('image', this.user.image);
  //     this.userService.editUser(user, uid).subscribe(
  //         data => {
  //             this.loadData();
  //             this.notificationsService.success('Usuario editado', 'El usuario ha sido editado exitosamente');
  //             this.closeModal();
  //         },
  //         error => {
  //             console.log(error);
  //             this.notificationsService.error('Error', error.message);
  //         }
  //     );
  // }

  removeUser(uid: string) {
  //     const conf = confirm('¿Desea eliminar el usuario?. Esto no se puede revertir');
  //     if (conf) {
  //         this.userService.deleteUser(uid).subscribe(
  //             data => {
  //                 this.notificationsService.success('Usuario eliminado', 'El usuario ha sido eliminado exitosamente');
  //                 this.loadData();
  //             },
  //             error => {
  //                 this.notificationsService.error('Error', 'Se produjo un error al eliminar el usuario');
  //             }
  //         );
  //     }
  }

  // editPassword(uid: string, newPassword: string) {
  //     this.userService.setUserPassword(uid, newPassword).subscribe(
  //         data => {
  //             this.notificationsService.success('Contraseña cambiada', 'Se ha cambiado la contraseña exitosamente');
  //             this.closeModal();
  //         },
  //         error => {
  //             console.log(error);
  //             this.notificationsService.error('Error', error.message);
  //         }
  //     );
  // }

  // pageChanged(event: any): void {
  //     this.page = event['page'];
  //     this.loadData();
  // }

  // sortAction(target: HTMLElement, sort: string) {
  //     for (let i = 0; i < target.parentElement.children.length; i++) {
  //         target.parentElement.children[i].className = '';
  //     }
  //     if (this.sort === sort) {
  //         if (this.sort.slice(0, 1) === '-') {
  //             this.sort = sort;
  //             target.className = 'desc';
  //         } else {
  //             this.sort = '-' + sort;
  //             target.className = 'asc';
  //         }
  //     } else {
  //         this.sort = sort;
  //         target.className = 'desc';
  //     }
  //     this.page = 1;
  //     this.loadUsers();
  // }

  // changeProvinces(region: any) {
  //     this.address_provinces = this.address_regions[region.target.selectedIndex - 1].provinces;
  //     this.user.address.province = this.address_provinces[0].name;
  //     this.address_communes = this.address_provinces[0].communes;
  //     this.user.address.commune = this.address_communes[0].name;
  // }

  // changeCommunes(province: any) {
  //     this.address_communes = this.address_provinces[province.target.selectedIndex - 1].communes;
  // }

  // gerAddressByUser() {
  //     const region_index = this.address_regions.map(function (e) {
  //         return e.name;
  //     }).indexOf(this.user.address.region);
  //     this.address_provinces = this.address_regions[region_index].provinces;
  //     const province_index = this.address_provinces.map(function (e) {
  //         return e.name;
  //     }).indexOf(this.user.address.province);
  //     this.address_communes = this.address_provinces[province_index].communes;
  // }

  // changeCompany() {
  //     this.user.company = '';
  // }

  // fileChanged(event) {
  //     this.user.image = event.target.files[0];
  // }

  newOpenModal() {
    const modalRef = this.#openModal.open(AgregarModalComponent, {
      size: "lg", 
      backdrop: 'static' 
    });

    //modalRef.componentInstance.data_id = id;

    modalRef.result.then((result) => {
      console.log(`Closed with: ${result.respuesta}`);
      this.loadUsers();
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
      size: "lg", 
      backdrop: 'static' 
    });

    modalRef.componentInstance.miid = miid;

    modalRef.result.then((result) => {
      console.log(`Closed with: ${result.respuesta}`);
      this.loadUsers();
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


  passwordModal(miid: string) {
    const modalRef = this.#openModal.open(PasswordModalComponent, {
      size: "lg", 
      backdrop: 'static' 
    });

    modalRef.componentInstance.miid = miid;

    modalRef.result.then((result) => {
      console.log(`Closed with: ${result.respuesta}`);
      this.loadUsers();
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
    this.loadUsers();
  }

}
