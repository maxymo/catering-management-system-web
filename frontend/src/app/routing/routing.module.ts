import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { UnitFormComponent } from '../configuration/units/unit-form/unit-form.component';
import { UnitListComponent } from '../configuration/units/unit-list/unit-list.component';
import { LoginComponent } from "../auth/login/login.component";
import {ShopListComponent} from "../configuration/shops/shop-list/shop-list.component";
import {ShopFormComponent} from "../configuration/shops/shop-form/shop-form.component";

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
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class RoutingModule { }
