import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './pages/roles/roles.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { RoleGrantsComponent } from './pages/role-grants/role-grants.component';
import { UserGrantsComponent } from './pages/user-grants/user-grants.component';
import { SurveyFoldersComponent } from './pages/survey-folders/survey-folders.component';
import { SurveyResponsesComponent } from './pages/survey-responses/survey-responses.component';
import { AuthGuard } from '@app/core';
import { SurveyFormsComponent } from './pages/survey-forms/survey-forms/survey-forms.component';
import { SurveyFormsCreatorComponent } from './pages/survey-forms/survey-forms-creator/survey-forms-creator.component';
import { SurveyCollectorsComponent } from './pages/survey-collectors/survey-collectors.component';
import { SurveySendsComponent } from './pages/survey-sends/survey-sends.component';
import { SurveyRecipientsComponent } from './pages/survey-recipients/survey-recipients.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    canActivateChild: [AuthGuard],
    component: DashboardComponent
  },
  {
    path: 'roles',
    canActivateChild: [AuthGuard],
    component: RolesComponent
  },
  {
    path: 'users',
    canActivateChild: [AuthGuard],
    component: UsersComponent
  },
  {
    path: 'role-grants',
    canActivateChild: [AuthGuard],
    component: RoleGrantsComponent
  },
  {
    path: 'user-grants',
    canActivateChild: [AuthGuard],
    component: UserGrantsComponent
  },
  {
    path: 'survey-folders',
    canActivateChild: [AuthGuard],
    component: SurveyFoldersComponent
  },
  {
    path: 'survey-forms',
    canActivateChild: [AuthGuard],
    component: SurveyFormsComponent
  },
  {
    path: 'survey-forms/:surveyFormId',
    canActivateChild: [AuthGuard],
    component: SurveyFormsCreatorComponent
  },
  {
    path: 'survey-responses',
    canActivateChild: [AuthGuard],
    component: SurveyResponsesComponent   
  },
  {
    path: 'survey-collectors',
    canActivateChild: [AuthGuard],
    component: SurveyCollectorsComponent
  },
  {
    path: 'survey-sends',
    canActivateChild: [AuthGuard],
    component: SurveySendsComponent
  } ,
  {
    path: 'survey-recipients',
    canActivateChild: [AuthGuard],
    component: SurveyRecipientsComponent
  }    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRouting { }
