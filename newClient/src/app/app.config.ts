import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';

import { registerLocaleData } from '@angular/common';
import localeEsCL from '@angular/common/locales/es-CL';

import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';

import { DropdownModule, SidebarModule } from '@coreui/angular-pro';
import { IconSetService } from '@coreui/icons-angular';
import { routes } from './app.routes';

// import { authInterceptor } from "./interceptor/auth";
import { AuthInterceptor } from './interceptor/auth';
import { DatePipe } from '@angular/common';

registerLocaleData(localeEsCL, 'es-CL');

export const appConfig: ApplicationConfig = {
  providers: [

    { provide: LOCALE_ID, useValue: 'es-CL' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideRouter(
      routes,

      withRouterConfig({
        onSameUrlNavigation: 'reload',
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    importProvidersFrom(
      SidebarModule,
      DropdownModule,
      HttpClientModule,
      BrowserAnimationsModule
    ),
    // NotificationsService,
    IconSetService,
    DatePipe,
    provideAnimations(),
  ],
};
