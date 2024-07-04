import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  ButtonDirective,
  ButtonGroupComponent,
  FormModule,
} from '@coreui/angular-pro';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService, ToasterModule } from 'angular-toaster';
import { MachineryService } from 'src/app/services/machinery.service';

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
  styleUrl: './eliminar-modal.component.scss',
  providers: [ToasterService, MachineryService],
})
export class EliminarModalComponent {
  @Input() machinery: any;

  activeModal = inject(NgbActiveModal);
  machineryService = inject(MachineryService);
  toasterService = inject(ToasterService);

  onSubmit() {
    this.machineryService.deleteMachinery(this.machinery._id).subscribe(
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
