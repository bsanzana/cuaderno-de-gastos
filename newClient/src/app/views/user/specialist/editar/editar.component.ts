import { NgClass } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {ToasterConfig, ToasterModule, ToasterService} from 'angular-toaster';
import { RutService } from 'rut-chileno';
import { SpecialistService } from 'src/app/services/specialist.service';
import { ButtonModule, FormModule } from '@coreui/angular-pro';
import { UiSwitchModule } from 'ngx-ui-switch';

import { DirectiveModule } from "../../../../utils/uppercase.directive";


@Component({
  selector: 'app-editar',
  standalone: true,
  imports: [
    ToasterModule,
    NgClass,
    UiSwitchModule,
    ReactiveFormsModule,
    FormModule,
    ButtonModule,
    DirectiveModule
  ],
  templateUrl: './editar.component.html'
})
export class EditarComponent {
  @Input() suid: any;

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


  ngOnInit() {
    this.specialistService.viewSpecialist(this.suid).subscribe(
      (data: any) => {
        this.agregarForm.patchValue({
            rut: data.data.rut,
            active: data.data.active,
            name: data.data.name || '',
            lastname: data.data.lastname || '',

            email: data.data.email,
            phone: data.data.phone,
        })
          
      },
      (error: any) => {
          console.log(error);
      }
    );
  }
  
  onSubmit(){
    console.log('se va: ', this.agregarForm.value)
    this.specialistService.editSpecialist({user: this.agregarForm.value}, this.suid)
      .subscribe(
          (data: any) => {
              this.activeModal.close({
                respuesta: data.message
              });
          },
          (error: any) => {
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
