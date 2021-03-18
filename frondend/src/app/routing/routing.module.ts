import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UnitFormComponent } from '../configuration/units/unit-form/unit-form.component';
import { UnitListComponent } from '../configuration/units/unit-list/unit-list.component';
import { ShopFormComponent } from '../configuration/shops/shop-form/shop-form.component';
import { ShopListComponent } from '../configuration/shops/shop-list/shop-list.component';
import { IngredientFormComponent } from '../configuration/ingredients/ingredient-form/ingredient-form.component';
import { IngredientListComponent } from '../configuration/ingredients/ingredient-list/ingredient-list.component';
import { LoginComponent } from '../auth/login/login.component';
import { AuthGuard } from '../auth/auth.guard';
import { AppComponent } from '../app.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

const routes = [
  { path: 'login', component: LoginComponent },
  { path: 'units', component: UnitListComponent, canActivate: [AuthGuard] },
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
  { path: 'shops', component: ShopListComponent, canActivate: [AuthGuard] },
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
  { path: 'ingredients', component: IngredientListComponent, canActivate: [AuthGuard] },
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
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class RoutingModule {}
