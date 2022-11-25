import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularMaterialModule } from './shared/angular-material/angular-material.module';
import { MainNavComponent } from './shared/main-nav/main-nav.component';
import { RoutingModule } from './routing/routing.module';
import { LoginComponent } from './auth/login/login.component';
import { ErrorComponent } from './shared/error/error.component';
import { ErrorInterceptor } from './shared/error-interceptor';


@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    LoginComponent,
    ErrorComponent,
  ],
  imports: [
    AngularMaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RoutingModule,
    BrowserModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
