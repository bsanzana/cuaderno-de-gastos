import { Component, Input, inject } from '@angular/core';
import { ButtonModule, CardModule, ModalModule } from '@coreui/angular-pro';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterModule, ToasterService } from 'angular-toaster';
import { SeasonService } from 'src/app/services/season.service';

@Component({
  selector: 'app-eliminar-modal',
  standalone: true,
  imports: [ModalModule, ButtonModule, CardModule, ToasterModule],
  templateUrl: './eliminar-modal.component.html',
  providers: [SeasonService, ToasterService],
})
export class EliminarModalComponent {
  activeModal = inject(NgbActiveModal);
  seasonService = inject(SeasonService);
  toasterService = inject(ToasterService);
  @Input() id: any;
  @Input() nameSeason: any;

  onSubmit() {
    this.seasonService.deleteSeason(this.id).subscribe(
      (data: any) => {
        this.activeModal.close({
          respuesta: data.message,
        });
      },
      (error: any) => {
        this.toasterService.pop('error', error.error.message)
      }
    );
  }
}
