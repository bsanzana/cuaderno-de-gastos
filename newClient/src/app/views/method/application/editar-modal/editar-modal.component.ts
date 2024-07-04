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
import { ApplicationMethodService } from 'src/app/services/application-method.service';
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
  providers: [ApplicationMethodService, ToasterService, WorkService],
})
export class EditarModalComponent {
  @Input() application: any;

  works:any

  applicationMethodService = inject(ApplicationMethodService);
  activeModal = inject(NgbActiveModal);
  toasterService = inject(ToasterService);
  workService = inject(WorkService);

  editForm!: FormGroup;

  ngOnInit() {
    console.log(this.application)
    this.editForm = new FormGroup({
      name: new FormControl(this.application.name, Validators.required),
      active: new FormControl(this.application.active, [Validators.required]),
      labor: new FormControl(this.application.labor?._id, Validators.required),
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

    this.applicationMethodService
      .editApplicationMethod(
        { applicationMethod: this.editForm.value },
        this.application._id
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
