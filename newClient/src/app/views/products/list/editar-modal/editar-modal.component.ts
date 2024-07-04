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
import { ProductService } from 'src/app/services/product.service';

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
  providers: [CategoryService, ToasterService, ProductService],
})
export class EditarModalComponent {
  @Input() product: any;
  categoryService = inject(CategoryService);
  activeModal = inject(NgbActiveModal);
  toasterService = inject(ToasterService);
  productService = inject(ProductService);

  categorys: any;
  total: any;

  editForm!: FormGroup;

  ngOnInit() {
    console.log(this.product)
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      sort: 'name',
    };
    this.categoryService.getCategorys(params).subscribe(
      (data: any) => {
        this.categorys = data.data;
        this.total = data.meta['total-items'];
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );

    this.editForm = new FormGroup({
      name: new FormControl(this.product.name, Validators.required),
      active: new FormControl(this.product.active, [Validators.required]),
      category: new FormControl(this.product.category._id, Validators.required),
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }

    this.productService
      .editProduct({ product: this.editForm.value }, this.product._id)
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
