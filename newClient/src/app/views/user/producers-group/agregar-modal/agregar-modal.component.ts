import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  ButtonDirective,
  ButtonGroupComponent,
  MultiSelectComponent,
  MultiSelectOptionComponent,
  FormModule
} from '@coreui/angular-pro';



import { DirectiveModule } from "../../../../utils/uppercase.directive";
import { CompanyGroupService } from "../../../../services/company-group.service";
import { UserService } from "../../../../services/user.service";

@Component({
  selector: 'app-agregar-producer-group-modal',
  templateUrl: './agregar-modal.component.html',
  standalone: true,
  styles: [],
  imports: [
    CommonModule,
    FormModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonDirective,
    ButtonGroupComponent,
    DirectiveModule,
    MultiSelectComponent,
    MultiSelectOptionComponent
  ],
  providers: [FormBuilder, UserService]
})


export class AgregarModalComponent implements OnInit {

  
  readonly #companyGroupService: CompanyGroupService = inject(CompanyGroupService);
  readonly #userService: UserService = inject(UserService);

  usuarios: any = []
  agregarForm!: FormGroup;

  formError: boolean = false;
  errorMessage: string = "";
  
  constructor( 
    public activeModal : NgbActiveModal,
    private formBuilder: FormBuilder,
    // public _loginService: AuthenticationService,
    // public companyGroupService: CompanyGroupService,
  ) { 
    this.createForm();
  }

  createForm(){
    this.agregarForm = this.formBuilder.group({
      name : ['', [Validators.required, Validators.minLength(3)]],
      advisors : [],
    })
  }

  ngOnInit() {
    this.loadUsers();
  }
  
  onSubmit(){
    console.log('se va group v2: ', this.agregarForm.value)
    this.#companyGroupService.createCompanyGroup({companyGroup: this.agregarForm.value}).subscribe(
      (data: any) => {
          this.activeModal.close({
            respuesta: data.message
          });
      }, (error: { message: any; }) => {
          // this.notificationsService.error('Error.', error.message);
          console.log('error: ', error.message)
      }
    );

  }

  loadUsers(search = false) {
    const params = {
        'page[number]': 0,
        'page[size]': 999999999,
        'fields[active]': true
    };
    this.#userService.getUsers(params).subscribe(
        (data: any) => {
            this.usuarios = data.data;
            // this.total = data.meta['total-items'];
        },
        (error: { message: any; }) => {
            // this.notificationsService.error('Error', error.message);
            console.log('error 1: ', error.message)
        }
    );
}

}