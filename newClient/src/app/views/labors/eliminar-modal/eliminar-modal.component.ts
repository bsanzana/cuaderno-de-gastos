import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  ButtonDirective,
  ButtonGroupComponent,
  FormModule,
} from '@coreui/angular-pro';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterModule, ToasterService } from 'angular-toaster';
import { WorkService } from 'src/app/services/work.service';

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
  templateUrl: './eliminar-modal.component.html',
  providers: [ToasterService, WorkService],
})
export class EliminarModalComponent {
  @Input() labor: any;

  activeModal = inject(NgbActiveModal);
  workService = inject(WorkService);
  toasterService = inject(ToasterService);

  onSubmit() {
    this.workService.deleteWork(this.labor._id).subscribe(
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
