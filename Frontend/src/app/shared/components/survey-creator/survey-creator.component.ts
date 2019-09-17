import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit
} from '@angular/core';
import * as SurveyCreator from 'survey-creator';
import * as Survey from 'survey-angular';

import 'inputmask/dist/inputmask/phone-codes/phone.js';
@Component({
  selector: 'survey-creator',
  template: `
    <div id="surveyCreatorContainer"></div>
  `
})
export class SurveyCreatorComponent implements OnInit, AfterViewInit {
  surveyCreator: SurveyCreator.SurveyCreator;

  @Input() json: any;
  @Output() surveySaved: EventEmitter<Object> = new EventEmitter();
  ngOnInit() {}
  ngAfterViewInit() {
    // Change theme
    var mainColor = '#001629';
    var mainHoverColor = '#6fe06f';
    var textColor = '#4a4a4a';
    var headerColor = '#001629';
    var headerBackgroundColor = '#4a4a4a';
    var bodyContainerBackgroundColor = '#f8f8f8';

    var defaultThemeColorsSurvey = Survey.StylesManager.ThemeColors['default'];
    defaultThemeColorsSurvey['$main-color'] = mainColor;
    defaultThemeColorsSurvey['$main-hover-color'] = mainHoverColor;
    defaultThemeColorsSurvey['$text-color'] = textColor;
    defaultThemeColorsSurvey['$header-color'] = headerColor;
    defaultThemeColorsSurvey[
      '$header-background-color'
    ] = headerBackgroundColor;
    defaultThemeColorsSurvey[
      '$body-container-background-color'
    ] = bodyContainerBackgroundColor;

    var defaultThemeColorsEditor =
      SurveyCreator.StylesManager.ThemeColors['default'];
    defaultThemeColorsEditor['$primary-color'] = mainColor;
    defaultThemeColorsEditor['$secondary-color'] = mainColor;
    defaultThemeColorsEditor['$primary-hover-color'] = mainHoverColor;
    defaultThemeColorsEditor['$primary-text-color'] = textColor;
    defaultThemeColorsEditor['$selection-border-color'] = mainColor;

    Survey.StylesManager.applyTheme();
    SurveyCreator.StylesManager.applyTheme();

    let options = {
      showJSONEditorTab: false,
      generateValidJSON: false,
      showTestSurveyTab: true,
      showTranslationTab: true,
      showLogicTab: true
    };
    this.surveyCreator = new SurveyCreator.SurveyCreator(
      'surveyCreatorContainer',
      options
    );
    this.surveyCreator.text = JSON.stringify(this.json);
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
  }

  saveMySurvey = () => {
    console.log(this.surveyCreator.text);
    this.surveySaved.emit(JSON.parse(this.surveyCreator.text));
  };
}
