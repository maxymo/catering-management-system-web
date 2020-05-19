import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UnitListComponent } from '../unit-list/unit-list.component';

const routes = [{ path: 'units', component: UnitListComponent }];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutingModule {}
