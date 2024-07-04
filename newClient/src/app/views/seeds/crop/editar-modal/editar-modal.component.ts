import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterModule, ToasterService } from 'angular-toaster';
import { UiSwitchModule } from 'ngx-ui-switch';
import { CropService } from 'src/app/services/crop.service';

@Component({
  selector: 'app-editar-modal',
  standalone: true,
  imports: [
    CommonModule,
    ToasterModule,
    ButtonDirective,
    ButtonGroupComponent,
    FormModule,
    ReactiveFormsModule,
    GridModule,
    UiSwitchModule,],
  templateUrl: './editar-modal.component.html',
  providers: [CropService, ToasterService, ],
})
export class EditarModalComponent {

  @Input() crop: any;
  cropService = inject(CropService);
  activeModal = inject(NgbActiveModal);
  toasterService = inject(ToasterService);

  crops: any;
  total: any;

  editForm!: FormGroup;

  ngOnInit() {
    this.editForm = new FormGroup({
      name: new FormControl(this.crop.name, Validators.required),
      active: new FormControl(this.crop.active, [Validators.required]),
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }

    this.cropService
      .editCrop({ crop: this.editForm.value }, this.crop._id)
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
