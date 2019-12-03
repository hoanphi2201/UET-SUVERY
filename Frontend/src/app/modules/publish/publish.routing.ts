import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnswerSurveyComponent } from './pages/answer-survey/answer-survey.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'answer-survey',
    pathMatch: 'full'
  },
  {
    path: 'answer-survey/:url',
    component: AnswerSurveyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishRouting {}
