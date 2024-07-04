import { Component, inject, Input } from '@angular/core';
import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  ProgressBarDirective,
  ProgressComponent,
  SidebarToggleDirective,
  TextColorDirective,
  ThemeDirective
} from '@coreui/angular-pro';
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';

import {Router} from '@angular/router';
import {AuthenticationService} from '../../../services/authentication.service';


@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
  standalone: true,
  imports: [ContainerComponent, HeaderTogglerDirective, SidebarToggleDirective, IconDirective, HeaderNavComponent, NavItemComponent, NavLinkDirective, RouterLink, RouterLinkActive, NgTemplateOutlet, BreadcrumbRouterComponent, ThemeDirective, DropdownComponent, DropdownToggleDirective, TextColorDirective, AvatarComponent, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective, BadgeComponent, DropdownDividerDirective, ProgressBarDirective, ProgressComponent, NgStyle],
  providers: [AuthenticationService]
})
export class DefaultHeaderComponent extends HeaderComponent {

  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;
  user: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    super();
    this.#colorModeService.localStorageItemName.set('AppConsulagro');
    this.#colorModeService.eventName.set('ColorSchemeChange');

    this.user = this.authenticationService.getCurrentUser();
  }

  @Input() sidebarId: string = 'sidebar1';

  ngOnInit(){
    // console.log('user: ', this.user?.rut)
  }
  
  logout() {
    this.authenticationService.logout({ user: this.user?.rut }).subscribe(
        (response: any) => {
          console.log('mensaje de respuesta: ', response)
          localStorage.removeItem('consulagro-user-token')
          this.router.navigate(['/login']);
        }, (error: any) => {
          console.log('mi error: ', error)
        }
      );
  }


}
