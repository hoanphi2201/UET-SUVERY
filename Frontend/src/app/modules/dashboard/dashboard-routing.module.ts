import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';
import { extract } from '@app/core';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: { title: extract('Dashboard') }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
