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
import { PlantingMethodService } from 'src/app/services/mano-de-obra.service';
import { WorkService } from 'src/app/services/work.service';

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
    UiSwitchModule,
  ],
  templateUrl: './editar-modal.component.html',
  providers: [PlantingMethodService, ToasterService, WorkService],
})
export class EditarModalComponent {
  @Input() sowing: any;

  works:any

  plantingMethodService = inject(PlantingMethodService);
  activeModal = inject(NgbActiveModal);
  toasterService = inject(ToasterService);
  workService = inject(WorkService);

  editForm!: FormGroup;

  ngOnInit() {
    this.editForm = new FormGroup({
      name: new FormControl(this.sowing.name, Validators.required),
      active: new FormControl(this.sowing.active, [Validators.required]),
      labor: new FormControl(this.sowing.labor?._id, Validators.required),
    });

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
    if (this.editForm.invalid) {
      return;
    }

    this.plantingMethodService
      .editPlantingMethod(
        { plantingMethod: this.editForm.value },
        this.sowing._id
      )
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
