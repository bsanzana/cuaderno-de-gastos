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
import { ToasterModule, ToasterService } from 'angular-toaster';
import { UiSwitchModule } from 'ngx-ui-switch';
import { PlantingMethodService } from 'src/app/services/mano-de-obra.service';
import { WorkService } from 'src/app/services/work.service';

@Component({
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
  providers: [PlantingMethodService, ToasterService, WorkService],
})
export class AgregarModalComponent {
  works: any;

  activeModal = inject(NgbActiveModal);
  plantingMethodService = inject(PlantingMethodService);
  toasterService = inject(ToasterService);
  workService = inject(WorkService);

  agregarForm = new FormGroup({
    name: new FormControl('', Validators.required),
    active: new FormControl(true, Validators.required),
    labor: new FormControl(null, Validators.required),
  });

  ngOnInit(): void {
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      'fields[active]': true,
      sort: 'name',
    };
    this.workService.getWorks(params).subscribe(
      (data: any) => {
        this.works = data.data;
      },
      (error: { message: any }) => {
        this.toasterService.pop('error', error.message);
      }
    );
  }
  onSubmit() {
    this.plantingMethodService
      .createPlantingMethod({ plantingMethod: this.agregarForm.value })
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
