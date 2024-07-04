
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  FormModule,
  GridModule,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective,
} from '@coreui/angular-pro';
import { IconDirective } from '@coreui/icons-angular';

import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { fieldNotebookService } from 'src/app/services/field-notebook.service';
import { SeasonService } from 'src/app/services/season.service';
import { UserService } from 'src/app/services/user.service';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { BarChartComponent } from '../charts/bar-chart/bar-chart.component';
@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    IconDirective,
    ReactiveFormsModule,
    ButtonGroupComponent,
    FormCheckLabelDirective,
    CardFooterComponent,
    GutterDirective,
    ProgressBarDirective,
    ProgressComponent,
    CardHeaderComponent,
    TableDirective,
    AvatarComponent,
    FormModule,
    GridModule,
    FormsModule,
    PieChartComponent,
    BarChartComponent
  ],
  providers: [
    AuthenticationService,
    fieldNotebookService,
    SeasonService,
    UserService,
  ],
})
export class DashboardComponent implements OnInit {
  authenticationService = inject(AuthenticationService);
  fieldNotebookService = inject(fieldNotebookService);
  seasonService = inject(SeasonService);
  userService = inject(UserService);

  router = inject(Router);

  total: number = 1;
  page: number = 1;
  pageSize: number = 10;
  sort: string = '';

  forms: any;
  seasons: any;
  users: any;

  search: boolean = false;
  searchForm: any = { 'informacion_del_campo.season': '', advisor: '' };

  chartGender: any;
  chartAges: any;
  chartPossession: any;
  chartCropType: any;

  ngOnInit() {
    if (this.authenticationService.isLoggedIn()) {
      this.loadForms(this.search);
      this.loadSeasons();
      this.loadUsers();
    } else {
      this.router.navigate(['/login']);
    }
  }

  filtro() {
    this.loadForms(true);
  }

  loadUsers() {
    const params = {
      'page[number]': (this.page - 1).toString(),
      'page[size]': this.pageSize.toString(),
      sort: this.sort,
    };
    this.userService.getUsers(params).subscribe(
      (data: any) => {
        this.users = data.data;
        this.total = data.meta['total-items'];
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error 1: ', error.message);
      }
    );
  }

  countGenders() {
    const genderCounts: any = {};

    for (const item of this.forms) {
      const gender = item.informacion_del_campo.company.gender;
      if (gender in genderCounts) {
        genderCounts[gender] += 1;
      } else {
        genderCounts[gender] = 1;
      }
    }

    this.chartGender = {
      labels: Object.keys(genderCounts),
      datasets: [
        {
          data: Object.values(genderCounts),
        },
      ],
    };

    console.log(this.chartGender)
  }

  countAges() {
    const ranges = {
      '20-30': 0,
      '31-40': 0,
      '41-50': 0,
      '51-60': 0,
      '61-70': 0,
      '70+': 0,
    };
    const currentYear = new Date().getFullYear();

    for (const item of this.forms) {
      const birthDate = new Date(item.informacion_del_campo.company.birth_date);
      var age = currentYear - birthDate.getFullYear();
      if (age >= 20 && age <= 30) ranges['20-30']++;
      else if (age > 30 && age <= 40) ranges['31-40']++;
      else if (age > 40 && age <= 50) ranges['41-50']++;
      else if (age > 50 && age <= 60) ranges['51-60']++;
      else if (age > 60 && age <= 70) ranges['61-70']++;
      else if (age >= 70) ranges['70+']++;
    }

    this.chartAges = {
      labels: Object.keys(ranges),
      datasets: [
        {
          data: Object.values(ranges),
        },
      ],
    };

    
  }

  countPossessions() {
    const possessionCounts: any = {};

    for (const item of this.forms) {
      const possession = item.informacion_del_campo.possession;

      if (possession in possessionCounts) {
        possessionCounts[possession] += 1;
      } else {
        possessionCounts[possession] = 1;
      }
    }
    this.chartPossession = {
      labels: Object.keys(possessionCounts),
      datasets: [
        {
          data: Object.values(possessionCounts),
        },
      ],
    };

    console.log(this.chartPossession, 'tenencia')
  }

  countCropTypes() {
    const cropTypeCounts: any = {};

    for (const item of this.forms) {
      const cropType = item.informacion_del_campo.crop.type_crop?.name;

      if (cropType != null) {
        if (cropType in cropTypeCounts) {
          cropTypeCounts[cropType] += 1;
        } else {
          cropTypeCounts[cropType] = 1;
        }
      }
    }

    this.chartCropType = {
      labels: Object.keys(cropTypeCounts),
      datasets: [
        {
          data: Object.values(cropTypeCounts),
        },
      ],
    };
  }
  loadSeasons() {
    const params = {
      'page[number]': (this.page - 1).toString(),
      'page[size]': this.pageSize.toString(),
      sort: this.sort,
    };
    this.seasonService.getSeasons(params).subscribe(
      (data: any) => {
        this.seasons = data.data;
        this.total = data.meta['total-items'];
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }

  loadForms(search: boolean) {
    const params: any = {
      'page[number]': (this.page - 1).toString(),
      'page[size]': this.pageSize.toString(),
      sort: this.sort,
    };

    if (search) {
      for (const k in this.searchForm) {
        if (this.searchForm.hasOwnProperty(k)) {
          if (this.searchForm[k] !== '') {
            params['fields[' + k + ']'] = this.searchForm[k];
          }
        }
      }
    }

    this.fieldNotebookService.getForms(params).subscribe(
      (data: any) => {
        this.forms = data.data;
        console.log(this.forms);
        this.countGenders();
        this.countAges();
        this.countPossessions();
        this.countCropTypes();
        this.total = data.meta['total-items'];
      },
      (error: { message: any }) => {
        // this.notificationsService.error('Error', error.message);
        console.log('error: ', error.message);
      }
    );
  }
}
