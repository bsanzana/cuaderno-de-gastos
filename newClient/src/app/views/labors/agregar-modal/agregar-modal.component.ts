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
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService, ToasterModule } from 'angular-toaster';
import { UiSwitchModule } from 'ngx-ui-switch';
import { WorkService } from 'src/app/services/work.service';

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
    GridModule
  ],
  templateUrl: './agregar-modal.component.html',
  providers: [ToasterService, WorkService],
})
export class AgregarModalComponent {
  activeModal = inject(NgbActiveModal);
  workService = inject(WorkService);
  toasterService = inject(ToasterService);

  agregarForm = new FormGroup({
    name: new FormControl('', Validators.required),
    active: new FormControl(true, Validators.required),
  });

  onSubmit() {
    this.workService.createWork({work:this.agregarForm.value}).subscribe(
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
