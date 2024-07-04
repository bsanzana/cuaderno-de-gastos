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
import { CategoryService } from 'src/app/services/category.service';

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
  providers: [CategoryService, ToasterService],
})
export class EditarModalComponent {
  @Input() category: any;
  categoryService = inject(CategoryService);
  activeModal = inject(NgbActiveModal);
  toasterService = inject(ToasterService);

  editForm!: FormGroup;

  ngOnInit() {
    this.editForm = new FormGroup({
      name: new FormControl(this.category.name, Validators.required),
      active: new FormControl(this.category.active, [Validators.required]),
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }

    this.categoryService
      .editCategorys({ category: this.editForm.value }, this.category._id)
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
