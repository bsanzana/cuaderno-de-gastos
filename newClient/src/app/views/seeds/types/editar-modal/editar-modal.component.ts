import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective, ButtonGroupComponent, FormModule, GridModule } from '@coreui/angular-pro';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterModule, ToasterService } from 'angular-toaster';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SeedTypeService } from 'src/app/services/seed-type.service';

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
    UiSwitchModule,
    GridModule,],
  templateUrl: './editar-modal.component.html',
  providers: [SeedTypeService, ToasterService],
})
export class EditarModalComponent {

  @Input() seedType: any;

  editForm!: FormGroup;

  activeModal = inject(NgbActiveModal);
  seedTypeService = inject(SeedTypeService);
  toasterService = inject(ToasterService);

  ngOnInit() {
    this.editForm = new FormGroup({
      name: new FormControl(this.seedType.name, Validators.required),
      active: new FormControl(this.seedType.active, Validators.required),
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }

    this.seedTypeService
      .editSeedType({ seedType: this.editForm.value }, this.seedType._id)
      .subscribe(
        (data: any) => {
          console.log(data)
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
