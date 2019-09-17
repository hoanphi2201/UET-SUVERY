import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { TranslateModule } from '@ngx-translate/core';
import { SurveyCreatorComponent } from './components/survey-creator/survey-creator.component';
import { SurveyComponent } from './components/survey/survey.component';
import { PageComponent } from './components/page/page.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgZorroAntdModule,
    PerfectScrollbarModule,
    TranslateModule
  ],
  declarations: [SurveyComponent, SurveyCreatorComponent, PageComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgZorroAntdModule,
    PerfectScrollbarModule,
    TranslateModule,
    SurveyComponent,
    SurveyCreatorComponent,
    PageComponent
  ]
})
export class SharedModule {}
