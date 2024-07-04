import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ToasterConfig, ToasterModule, ToasterService} from 'angular-toaster';


import {
  CardComponent,
  ButtonDirective,
  ButtonGroupComponent,
  FormModule
} from '@coreui/angular-pro';



import { UserService } from "../../../../services/user.service";

@Component({
  selector: 'app-password-worker-modal',
  templateUrl: './password-modal.component.html',
  standalone: true,
  styles: [],
  imports: [
    ToasterModule,
    CardComponent,
    CommonModule,
    FormModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonDirective,
    ButtonGroupComponent,
  ],
  providers: [FormBuilder, UserService, ToasterService]
})


export class PasswordModalComponent implements OnInit {

    @Input() miid:any;

    readonly #userService: UserService = inject(UserService);
    readonly activeModal: NgbActiveModal = inject(NgbActiveModal);
    readonly formBuilder: FormBuilder = inject(FormBuilder);


    editPasswordForm!: FormGroup;

    public config: ToasterConfig = new ToasterConfig(
        {
          mouseoverTimerStop: true, 
          timeout: 2000, 
          animation: 'fade', 
          limit: 4
        }
    );


    createForm(){
        this.editPasswordForm = this.formBuilder.group({
            password : ['', [Validators.required, Validators.minLength(3)]]
        })
    }

    ngOnInit() {
        this.createForm();
    }

    onSubmit(){
        this.#userService.setUserPassword(this.miid, this.editPasswordForm.value.password).subscribe(
            (data: any) => {
                this.activeModal.close({
                    respuesta: data.message
                });
            },
            (error: { message: any; }) => {
                console.log('error: ',error.message);
            }
        );
    }
}