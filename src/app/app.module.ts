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
import {DishListComponent} from "./configuration/dishes/dish-list/dish-list.component";
import {DishFormComponent} from "./configuration/dishes/dish-form/dish-form.component";
import {IngredientDialogComponent} from "./configuration/dishes/dish-form/ingredient-dialog/ingredient-dialog.component";
import {OrderListComponent} from "./configuration/orders/order-list/order-list.component";
import {OrderFormComponent} from "./configuration/orders/order-form/order-form.component";
import {OrderDialogComponent} from "./configuration/orders/order-form/order-dialog/order-dialog.component";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MY_FORMATS } from './shared/custom-date-adapter';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

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
    DishListComponent,
    DishFormComponent,
    IngredientDialogComponent,
    OrderListComponent,
    OrderFormComponent,
    OrderDialogComponent
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
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
