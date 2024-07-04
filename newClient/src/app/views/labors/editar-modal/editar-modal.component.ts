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
  providers: [WorkService, ToasterService],
})
export class EditarModalComponent {
  @Input() labor: any;

  editForm!: FormGroup;

  activeModal = inject(NgbActiveModal);
  workService = inject(WorkService);
  toasterService = inject(ToasterService);

  ngOnInit() {
    this.editForm = new FormGroup({
      name: new FormControl(this.labor.name, Validators.required),
      active: new FormControl(this.labor?.active, Validators.required),
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }

    this.workService
      .editWork({ work: this.editForm.value }, this.labor._id)
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
