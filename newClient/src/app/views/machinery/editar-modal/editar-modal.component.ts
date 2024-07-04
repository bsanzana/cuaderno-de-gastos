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
import { MachineryService } from 'src/app/services/machinery.service';
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
    UiSwitchModule,
    GridModule,
  ],
  templateUrl: './editar-modal.component.html',
  styleUrl: './editar-modal.component.scss',
  providers: [MachineryService, ToasterService, WorkService],
})
export class EditarModalComponent {
  @Input() machinery: any;

  works:any

  editForm!: FormGroup;

  activeModal = inject(NgbActiveModal);
  machineryService = inject(MachineryService);
  toasterService = inject(ToasterService);
  workService = inject(WorkService);
  ngOnInit() {
    this.editForm = new FormGroup({
      name: new FormControl(this.machinery.name, Validators.required),
      active: new FormControl(this.machinery.active, Validators.required),
      labor: new FormControl(this.machinery.labor?._id, Validators.required),
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

    this.machineryService
      .editMachinery({ machinery: this.editForm.value }, this.machinery._id)
      .subscribe(
        (data: any) => {
          this.activeModal.close({
            message: data.message,
          });
        },
        (error: any) => {
          this.toasterService.pop('error', error.error.message);
        }
      );
  }
}
