import { SeedTypeService } from './../../../../services/seed-type.service';
import { UiSwitchModule } from 'ngx-ui-switch';
import {
  ButtonDirective,
  ButtonGroupComponent,
  FormModule,
  GridModule,
} from '@coreui/angular-pro';
import { ToasterModule, ToasterService } from 'angular-toaster';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SeedService } from 'src/app/services/seed.service';

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
    GridModule,
  ],
  templateUrl: './agregar-modal.component.html',
  providers: [SeedTypeService, ToasterService],
})
export class AgregarModalComponent {

  activeModal = inject(NgbActiveModal);
  seedTypeService = inject(SeedTypeService)
  toasterService = inject(ToasterService)

  agregarForm = new FormGroup({
    name: new FormControl('', Validators.required),
    active: new FormControl(true, Validators.required),
  });

  onSubmit() {
    this.seedTypeService.createSeedType({ seedType: this.agregarForm.value })
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
