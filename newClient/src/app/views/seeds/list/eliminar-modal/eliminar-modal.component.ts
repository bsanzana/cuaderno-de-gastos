import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  ButtonDirective,
  ButtonGroupComponent,
  FormModule,
} from '@coreui/angular-pro';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterModule, ToasterService } from 'angular-toaster';
import { SeedService } from 'src/app/services/seed.service';

@Component({
  selector: 'app-eliminar-modal',
  standalone: true,
  imports: [
    CommonModule,
    ToasterModule,
    ButtonDirective,
    ButtonGroupComponent,
    FormModule,
  ],
  providers: [SeedService, ToasterService],
  templateUrl: './eliminar-modal.component.html',
})
export class EliminarModalComponent {
  @Input() seed: any;

  activeModal = inject(NgbActiveModal);
  seedService = inject(SeedService);
  toasterService = inject(ToasterService);

  onSubmit() {
    this.seedService.deleteSeed(this.seed._id).subscribe(
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
