import { Component, Input, inject } from '@angular/core';
import { FormService } from '../../../../services/form.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { saveAs } from 'file-saver';
import { ButtonModule } from '@coreui/angular-pro';
@Component({
  selector: 'app-btn-descargar',
  standalone: true,
  imports: [FontAwesomeModule, ButtonModule],
  templateUrl: './btn-descargar.component.html',
  providers: [FormService],
})
export class BtnDescargarComponent {
  @Input() cuaderno: any;
  @Input() typeFile: any; 
  faDownload = faDownload;
  formService = inject(FormService);

  ngOnInit(): void {
    console.log(this.cuaderno);
  }

  descargarArchivos() {
    this.formService
      .downloadFile({ id: this.cuaderno._id, typeFile: this.typeFile })
      .subscribe(
        (data: any) => {
          console.log(data); 
          saveAs(data, this.typeFile+'_'+this.cuaderno.informacion_del_campo.company.name);
          // const fileURL = URL.createObjectURL(data);
          // window.open(fileURL);
        },
        (error: { message: any }) => {
          console.log('error: ', error.message);
        }
      );
  }
}
