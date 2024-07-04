import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule, FormModule } from '@coreui/angular-pro';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UiSwitchModule } from 'ngx-ui-switch';
import { RutService } from 'rut-chileno';
import {ToasterConfig, ToasterModule, ToasterService} from 'angular-toaster';

import { SpecialistService } from "../../../../services/specialist.service";
import { DirectiveModule } from "../../../../utils/uppercase.directive";

@Component({
  selector: 'app-agregar',
  standalone: true,
  imports: [
    NgClass,
    UiSwitchModule,
    ReactiveFormsModule,
    FormModule,
    ButtonModule,
    NgIf,
    ToasterModule,
    DirectiveModule
  ],
  templateUrl: './agregar.component.html',
  providers: [
    ToasterService, SpecialistService
  ]
})
export class AgregarComponent {

  activeModal = inject(NgbActiveModal);
  formBuilder = inject(FormBuilder);
  rutService = inject(RutService);
  notificationsService = inject(ToasterService);
  specialistService = inject(SpecialistService);

  agregarForm!: FormGroup;

  public config: ToasterConfig = new ToasterConfig(
    {
      mouseoverTimerStop: true, 
      timeout: 2000, 
      animation: 'fade', 
      limit: 4
    }
  );

  constructor(){
    this.createForm();
  }

  createForm(){
    this.agregarForm = this.formBuilder.group({
      rut: ['', [Validators.required, this.rutService.validaRutForm]],
      active: [true],
      name : ['', [Validators.required, Validators.minLength(3)]],
      lastname : ['', [Validators.minLength(3)]],
      email : ['', [Validators.email]],
      phone : [''],
    })
  }

  
  onSubmit(){
    console.log('se va: ', this.agregarForm.value)
    this.specialistService.createSpecialist({user: this.agregarForm.value})
      .subscribe(
          (data: any) => {
              this.activeModal.close({
                respuesta: data.message
              });
          },
          (error: any ) => {
            // console.log('mii: ',error.error.message)
              this.notificationsService.popAsync({
                type:'error', 
                title:'Error', 
                body: error?.error.message, 
                progressBar: true, 
                progressBarDirection: 'increasing'
              });
          }
      );
  }


  inputEvent(event : Event) {
    let rut = this.rutService.getRutChileForm(2, (event.target as HTMLInputElement).value)
    if (rut)
      this.agregarForm.controls['rut'].patchValue(rut, {emitEvent :false});
  }


}
