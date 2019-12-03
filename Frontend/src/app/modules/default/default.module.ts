import { NgModule } from '@angular/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SharedModule } from '@app/shared';
import { HomeComponent } from './pages/home/home.component';
import { LayoutComponent } from './modules/create-form/layout/layout.component';
import { DefaultRouting } from './default.routing';
import { CreateSurveyComponent } from './pages/create-survey/create-survey.component';
import { PastSurveyComponent } from './pages/create-survey/components/past-survey/past-survey.component';
import { TemplateSurveyComponent } from './pages/create-survey/components/template-survey/template-survey.component';
import { GridSurveyComponent } from './pages/create-survey/components/grid-survey/grid-survey.component';
import { ListSurveyComponent } from './pages/create-survey/components/list-survey/list-survey.component';

const COMPONENTS = [
  LayoutComponent,
  DashboardComponent,
  HomeComponent,
  CreateSurveyComponent,
  PastSurveyComponent,
  TemplateSurveyComponent,
  GridSurveyComponent,
  ListSurveyComponent
];

@NgModule({
  imports: [SharedModule, DefaultRouting],
  declarations: [...COMPONENTS]
})
export class DefaultModule {}
