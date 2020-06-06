import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UnitListComponent } from '../units/unit-list/unit-list.component';
import { ShopListComponent } from '../shop-list/shop-list.component';
import { UnitFormComponent } from '../units/unit-form/unit-form.component';

const routes = [
  { path: 'units', component: UnitListComponent },
  { path: 'units/create', component: UnitFormComponent },
  { path: 'units/edit/:id', component: UnitFormComponent },
  { path: 'shops', component: ShopListComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
