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
import { UnitFormComponent } from './configuration/units/unit-form/unit-form.component';
import { ShopFormComponent } from './configuration/shops/shop-form/shop-form.component';
import { ShopListComponent } from './configuration/shops/shop-list/shop-list.component';
import { IngredientFormComponent } from './configuration/ingredients/ingredient-form/ingredient-form.component';
import { IngredientListComponent } from './configuration/ingredients/ingredient-list/ingredient-list.component';
import { TableComponent } from './shared/table/table.component';
import { RoutingModule } from './routing/routing.module';
import { DeleteConfirmationComponent } from './shared/delete-confirmation/delete-confirmation.component';
import { LoginComponent } from './auth/login/login.component';
import { ErrorComponent } from './shared/error/error.component';
import { ErrorInterceptor } from './shared/error-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    UnitFormComponent,
    UnitListComponent,
    ShopFormComponent,
    ShopListComponent,
    IngredientFormComponent,
    IngredientListComponent,
    TableComponent,
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
