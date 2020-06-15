import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UnitListComponent } from '../configuration/units/unit-list/unit-list.component';
import { ShopListComponent } from '../configuration/shop-list/shop-list.component';
import { UnitFormComponent } from '../configuration/units/unit-form/unit-form.component';
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
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class RoutingModule {}
