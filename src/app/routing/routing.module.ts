import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { UnitFormComponent } from '../configuration/units/unit-form/unit-form.component';
import { UnitListComponent } from '../configuration/units/unit-list/unit-list.component';
import { LoginComponent } from "../auth/login/login.component";
import {ShopListComponent} from "../configuration/shops/shop-list/shop-list.component";
import {ShopFormComponent} from "../configuration/shops/shop-form/shop-form.component";
import {IngredientListComponent} from "../configuration/ingredients/ingredient-list/ingredient-list.component";
import {IngredientFormComponent} from "../configuration/ingredients/ingredient-form/ingredient-form.component";
import {DishListComponent} from "../configuration/dishes/dish-list/dish-list.component";
import {DishFormComponent} from "../configuration/dishes/dish-form/dish-form.component";
import {OrderListComponent} from "../configuration/orders/order-list/order-list.component";
import {OrderFormComponent} from "../configuration/orders/order-form/order-form.component";

const routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'units', component: UnitListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'units/create',
    component: UnitFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'units/edit/:id',
    component: UnitFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shops', component: ShopListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'shops/create',
    component: ShopFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shops/edit/:id',
    component: ShopFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ingredients', component: IngredientListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ingredients/create',
    component: IngredientFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ingredients/edit/:id',
    component: IngredientFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dishes', component: DishListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dishes/create',
    component: DishFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dishes/edit/:id',
    component: DishFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders', component: OrderListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders/create',
    component: OrderFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orders/edit/:id',
    component: OrderFormComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class RoutingModule { }
