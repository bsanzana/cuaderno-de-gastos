import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular-pro';
import moment from 'moment';
moment.locale('es-cl');

@Component({
    selector: 'app-default-footer',
    templateUrl: './default-footer.component.html',
    styleUrls: ['./default-footer.component.scss'],
    standalone: true
})
export class DefaultFooterComponent extends FooterComponent {
  constructor() {
    super();
  }

  dateValue = moment(new Date()).format('YYYY')

  message: string = '2024';

  ngOnInit() {
    if(this.dateValue == '2024'){
      this.message = '2024';
    }else{
      this.message = '2024 - '+this.dateValue;
    }
  }
  
}
