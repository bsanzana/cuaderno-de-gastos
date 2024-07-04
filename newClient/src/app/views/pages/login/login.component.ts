import { Component, Injectable, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
  FormModule,
} from '@coreui/angular-pro';

import { ToasterConfig, ToasterModule, ToasterService } from 'angular-toaster';

import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    NgStyle,
    ReactiveFormsModule,
    ToasterModule,
    FormModule,
  ],
  providers: [AuthenticationService, ToasterService],
})
export class LoginComponent {
  btnLoad: boolean = true;

  loginForm!: FormGroup;

  public config: ToasterConfig = new ToasterConfig({
    mouseoverTimerStop: true,
    timeout: 2000,
    animation: 'fade',
    limit: 4,
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private notificationsService: ToasterService
  ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      rut: ['', [Validators.minLength(1), Validators.required]],
      typeUser: ['asesor', [Validators.minLength(1), Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(40),
        ],
      ],
    });
  }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigate(['/panel']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.btnLoad = false;
      if(this.loginForm.value.typeUser == 'asesor'){
      this.authenticationService.login(this.loginForm.value).subscribe(
        (data: { token: any }) => {
          this.btnLoad = true;
          // console.log('new data login: ', data)
          this.authenticationService.saveToken(data.token);
          this.router.navigate(['/panel']);
        },
        (error: { message: string }) => {
          this.btnLoad = true;
          // console.log('error: ', error.message)
          this.notificationsService.popAsync({
            type: 'error',
            title: 'Error',
            body: error?.message,
            progressBar: true,
            progressBarDirection: 'increasing',
          });
        }
      );
      }else{
        console.log('Ingresando productor', this.loginForm.value)
        this.authenticationService.loginProducer(this.loginForm.value).subscribe(
          (data:any) => {
            this.btnLoad = true;
            this.authenticationService.saveToken(data.token);
            this.router.navigate(['/view-producer']);  
          },
          (error:any) => {
            this.btnLoad = true;
            console.log(error.error.message)
            this.notificationsService.popAsync({
              type: 'error',
              title: 'Error',
              body: error.error.message,
              progressBar: true,
              progressBarDirection: 'increasing',
            });
          }
        )
      }
    }
  }
}
