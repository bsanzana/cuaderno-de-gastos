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
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';

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
  providers: [ProductService, ToasterService, CategoryService],
})
export class AgregarModalComponent {
  productService = inject(ProductService);
  activeModal = inject(NgbActiveModal);
  toasterService = inject(ToasterService);
  categoryProductService = inject(CategoryService);

  agregarForm = new FormGroup({
    name: new FormControl('', Validators.required),
    category: new FormControl(null,Validators.required),
    active: new FormControl(true, Validators.required),
  });

  categorys: any;
  total: any;

  ngOnInit() {
    const params = {
      'page[number]': 0,
      'page[size]': 999999999,
      sort: 'name',
      'fields[active]': true,
    };
    this.categoryProductService.getCategorys(params).subscribe(
      (data: any) => {
        this.categorys = data.data;
        this.total = data.meta['total-items'];
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  onSubmit() {

    this.productService
      .createProduct({ product: this.agregarForm.value })
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
