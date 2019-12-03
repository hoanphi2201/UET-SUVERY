import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './modules/create-form/layout/layout.component';
import { CreateSurveyComponent } from './pages/create-survey/create-survey.component';
import { AuthGuard, extract } from '@app/core';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
    data: { title: extract('Welcome to SurveyMonkey!') }
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    component: HomeComponent,
    data: { title: extract('Welcome to SurveyMonkey!') }
  },
  {
    path: 'create-survey',
    canActivate: [AuthGuard],
    component: CreateSurveyComponent,
    data: { title: extract('UetSurvey - New Survey') }
  },
  {
    path: 'create',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    loadChildren: () => import('./modules/create-form/create-form.module').then(m => m.CreateFormModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultRouting {}
