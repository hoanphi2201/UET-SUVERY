import { Component, OnInit, Input } from '@angular/core';
import * as Survey from 'survey-angular';
@Component({
  selector: 'app-survey',
  template: '<div id="surveyElement"></div>'
})
export class SurveyComponent implements OnInit {
  @Input()
  set json(surveyJSON: object) {
    Survey.StylesManager.applyTheme('default');
    const surveyModel = new Survey.Model(surveyJSON);
    Survey.SurveyNG.render('surveyElement', {
      model: surveyModel,
      isExpanded: true
    });
  }
  ngOnInit() {}
}
