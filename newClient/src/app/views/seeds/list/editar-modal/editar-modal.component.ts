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
import { CropService } from 'src/app/services/crop.service';
import { SeedService } from 'src/app/services/seed.service';

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
  providers: [SeedService, ToasterService, CropService, CategoryService],
})
export class EditarModalComponent {
  @Input() seed: any;

  crops: any;
  total: any;
  categorys:any

  editForm!: FormGroup;

  activeModal = inject(NgbActiveModal);
  seedService = inject(SeedService);
  toasterService = inject(ToasterService);
  cropService = inject(CropService);
  categoryProductService = inject(CategoryService);


  ngOnInit() {
    this.editForm = new FormGroup({
      name: new FormControl(this.seed.name, Validators.required),
      active: new FormControl(this.seed.active, Validators.required),
      crop: new FormControl(this.seed.crop?._id, Validators.required),
      category: new FormControl(this.seed.category?._id, Validators.required),
    });
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      sort: 'name',
      'fields[active]': true,
    };
    this.cropService.getCrops(params).subscribe(
      (data: any) => {
        this.crops = data.data;
      },
      (error: { message: any }) => {
        this.toasterService.pop('error', error.message);
      }
    );
    this.categoryProductService.getCategorys(params).subscribe(
      (data: any) => {
        this.categorys = data.data;
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

    this.seedService
      .editSeed({ seed: this.editForm.value }, this.seed._id)
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
