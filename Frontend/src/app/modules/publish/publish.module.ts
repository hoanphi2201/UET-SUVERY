import { NgModule } from '@angular/core';
import { AnswerSurveyComponent } from './pages/answer-survey/answer-survey.component';
import { PublishRouting } from './publish.routing';
import { SharedModule } from '@app/shared';

const COMPONENTS = [AnswerSurveyComponent];

@NgModule({
  imports: [SharedModule, PublishRouting],
  declarations: [...COMPONENTS]
})
export class PublishModule {}
