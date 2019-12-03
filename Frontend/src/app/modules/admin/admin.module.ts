import { SurveyFormsCreatorComponent } from './pages/survey-forms/survey-forms-creator/survey-forms-creator.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { AdminRouting } from './admin.routing';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RolesComponent } from './pages/roles/roles.component';
import { UsersComponent } from './pages/users/users.component';
import { RoleGrantsComponent } from './pages/role-grants/role-grants.component';
import { UserGrantsComponent } from './pages/user-grants/user-grants.component';
import { SurveyFoldersComponent } from './pages/survey-folders/survey-folders.component';
import { SurveyResponsesComponent } from './pages/survey-responses/survey-responses.component';
import { SurveyFormsComponent } from './pages/survey-forms/survey-forms/survey-forms.component';
import { SurveyCollectorsComponent } from './pages/survey-collectors/survey-collectors.component';
import { SurveySendsComponent } from './pages/survey-sends/survey-sends.component';
import { SurveyRecipientsComponent } from './pages/survey-recipients/survey-recipients.component';

const COMPONENTS = [
  DashboardComponent,
  RolesComponent,
  UsersComponent,
  RoleGrantsComponent,
  UserGrantsComponent,
  SurveyFoldersComponent,
  SurveyFormsComponent,
  SurveyResponsesComponent,
  SurveyFormsCreatorComponent,
  SurveyCollectorsComponent,
  SurveySendsComponent,
  SurveyRecipientsComponent
];

@NgModule({
  imports: [SharedModule, AdminRouting],
  declarations: [...COMPONENTS]
})
export class AdminModule { }
