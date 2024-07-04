import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ButtonDirective,
  ButtonGroupComponent,
  FormModule,
  GridModule,
} from '@coreui/angular-pro';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterModule, ToasterService } from 'angular-toaster';
import { UiSwitchModule } from 'ngx-ui-switch';
import { CropService } from 'src/app/services/crop.service';

@Component({
  selector: 'app-agregar-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ToasterModule,
    ButtonDirective,
    ButtonGroupComponent,
    FormModule,
    UiSwitchModule,
    GridModule,],
  templateUrl: './agregar-modal.component.html',
  providers: [CropService, ToasterService, ],
})
export class AgregarModalComponent {
  cropService = inject(CropService);
  activeModal = inject(NgbActiveModal);
  toasterService = inject(ToasterService);

  categorys: any;
  total: any;

  agregarForm = new FormGroup({
    name: new FormControl('', Validators.required),
    active: new FormControl(true, Validators.required),
  });
  
  ngOnInit() {}

  onSubmit() {
    this.cropService
      .createCrop({ crop: this.agregarForm.value })
      .subscribe(
        (data: any) => {
          this.activeModal.close({
            respuesta: data.message,
          });
        },
        (error: any) => {
          this.toasterService.pop('error', error.error.message);
        }
      );
  }

}
