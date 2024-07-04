import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupName,
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
  selector: 'app-editar-modal',
  standalone: true,
  imports: [
    ToasterModule,
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
    ToasterModule,
  ],
  templateUrl: './editar-modal.component.html',
  providers: [SeasonService],
})
export class EditarModalComponent {
  @Input() season: any;

  editForm!: FormGroup;

  activeModal = inject(NgbActiveModal);
  seasonService = inject(SeasonService);
  toasterService = inject(ToasterService);

  ngOnInit() {
    this.editForm = new FormGroup({
      name: new FormControl(this.season.name, Validators.required),
      init_date: new FormControl(this.season.init_date, [Validators.required]),
      end_date: new FormControl(this.season.end_date, [Validators.required]),
      active: new FormControl(this.season.active, [Validators.required]),
    });
  }

  onSubmit() {
    if (this.editForm.invalid) {
      return;
    }

    this.seasonService
      .editSeason({ season: this.editForm.value }, this.season._id)
      .subscribe(
        (data: any) => {
          this.activeModal.close({
            message: data.message,
          });
        },
        (error: any) => {
          this.toasterService.pop('error', error.error.message);
        }
      );
  }
}
