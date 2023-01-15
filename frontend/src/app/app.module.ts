import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { AppComponent } from './app.component';
import { AngularMaterialModule } from './shared/angular-material/angular-material.module';
import { MainNavComponent } from './shared/main-nav/main-nav.component';
import { UnitListComponent } from './configuration/units/unit-list/unit-list.component';
import { RoutingModule } from './routing/routing.module';
import { TableComponent } from './shared/table/table.component';
import { DeleteConfirmationComponent } from './shared/delete-confirmation/delete-confirmation.component';
import { ErrorInterceptor } from './shared/error-interceptor';
import { ErrorComponent } from './shared/error/error.component';
import { UnitFormComponent } from './configuration/units/unit-form/unit-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import {ShopListComponent} from "./configuration/shops/shop-list/shop-list.component";
import {ShopFormComponent} from "./configuration/shops/shop-form/shop-form.component";
import {IngredientListComponent} from "./configuration/ingredients/ingredient-list/ingredient-list.component";
import {IngredientFormComponent} from "./configuration/ingredients/ingredient-form/ingredient-form.component";
import {GroupByPipe} from "./shared/pipes/group-by-unit-type";

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    UnitListComponent,
    TableComponent,
    DeleteConfirmationComponent,
    ErrorComponent,
    UnitFormComponent,
    LoginComponent,
    ShopListComponent,
    ShopFormComponent,
    IngredientListComponent,
    IngredientFormComponent,
    GroupByPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    RoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatAutocompleteModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
