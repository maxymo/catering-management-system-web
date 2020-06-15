import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AngularMaterialModule } from './shared/angular-material/angular-material.module';
import { MainNavComponent } from './shared/main-nav/main-nav.component';
import { UnitListComponent } from './configuration/units/unit-list/unit-list.component';
import { RoutingModule } from './routing/routing.module';
import { TableComponent } from './shared/table/table.component';
import { ShopListComponent } from './configuration/shop-list/shop-list.component';
import { UnitFormComponent } from './configuration/units/unit-form/unit-form.component';
import { DeleteConfirmationComponent } from './shared/delete-confirmation/delete-confirmation.component';
import { LoginComponent } from './auth/login/login.component';
import { ErrorComponent } from './shared/error/error.component';
import { ErrorInterceptor } from './shared/error-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    UnitListComponent,
    TableComponent,
    ShopListComponent,
    UnitFormComponent,
    DeleteConfirmationComponent,
    LoginComponent,
    ErrorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RoutingModule,
    HttpClientModule,
    AngularMaterialModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
