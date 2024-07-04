import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ButtonDirective,
  ButtonGroupComponent,
  FormModule,
  GridModule,
} from '@coreui/angular-pro';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterModule,ToasterService } from 'angular-toaster';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SeedTypeService } from 'src/app/services/seed-type.service';

@Component({
  selector: 'app-eliminar-modal',
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
  templateUrl: './eliminar-modal.component.html',
  providers: [SeedTypeService, ToasterService],
})
export class EliminarModalComponent {
  @Input() seedType: any;

  activeModal = inject(NgbActiveModal);
  seedTypeService = inject(SeedTypeService);
  toasterService = inject(ToasterService);

  onSubmit() {
    this.seedTypeService.deleteSeedType(this.seedType._id).subscribe(
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
