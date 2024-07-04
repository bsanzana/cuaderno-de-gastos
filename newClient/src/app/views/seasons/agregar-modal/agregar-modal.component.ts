import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ButtonDirective,
  ButtonGroupComponent,
  CardComponent,
  DatePickerComponent,
  DropdownModule,
  FormModule,
  SharedModule,
} from '@coreui/angular-pro';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterModule, ToasterService } from 'angular-toaster';
import { UiSwitchModule } from 'ngx-ui-switch';
import { SeasonService } from 'src/app/services/season.service';
import { DirectiveModule } from 'src/app/utils/uppercase.directive';

@Component({
  selector: 'app-agregar-modal',
  standalone: true,
  imports: [
    CardComponent,
    CommonModule,
    FormModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonDirective,
    ButtonGroupComponent,
    DirectiveModule,
    UiSwitchModule,
    DatePickerComponent,
    DropdownModule,
    SharedModule,
    ToasterModule
  ],
  templateUrl: './agregar-modal.component.html',
  providers: [SeasonService, ToasterService],
  //styleUrl: './agregar-modal.component.scss'
})
export class AgregarModalComponent {
  activeModal = inject(NgbActiveModal);
  seasonService = inject(SeasonService);
  toasterService = inject(ToasterService);

  dateRange = { startDate: new Date(), endDate: new Date() };

  agregarForm = new FormGroup({
    name: new FormControl('', Validators.required),
    init_date: new FormControl('', [Validators.required]),
    end_date: new FormControl('', [Validators.required]),
    active: new FormControl(true, [Validators.required]),
  });

  onSubmit() {
    this.seasonService.createSeason({season:this.agregarForm.value}).subscribe(
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
