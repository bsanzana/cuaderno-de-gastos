import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ToasterModule, ToasterService } from 'angular-toaster';
import {
  ButtonDirective,
  ButtonGroupComponent,
  FormModule,
  GridModule,
} from '@coreui/angular-pro';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SeedService } from 'src/app/services/seed.service';
import { CropService } from 'src/app/services/crop.service';
import { CategoryService } from 'src/app/services/category.service';
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
    GridModule,
  ],
  templateUrl: './agregar-modal.component.html',
  providers: [SeedService, ToasterService, CropService, CategoryService],
})
export class AgregarModalComponent {
  crops: any;
  total: any;
  categorys: any;

  activeModal = inject(NgbActiveModal);
  seedService = inject(SeedService);
  toasterService = inject(ToasterService);
  cropService = inject(CropService);
  categoryProductService = inject(CategoryService);

  agregarForm = new FormGroup({
    name: new FormControl('', Validators.required),
    active: new FormControl(true, Validators.required),
    crop: new FormControl(null, Validators.required),
    category: new FormControl(null, Validators.required),
  });

  ngOnInit(): void {
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      'fields[active]': true,
      sort: 'name',
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
    this.seedService.createSeed({ seed: this.agregarForm.value }).subscribe(
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
