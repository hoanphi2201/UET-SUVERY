import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { LoaderService, Helpers } from '@app/shared';
import { SurveyForm, SurveyCollector, VisitorsService, PSurveyCollectorService, PSurveyResponseService } from '@app/core';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-answer-survey',
  templateUrl: './answer-survey.component.html',
  styleUrls: ['./answer-survey.component.scss']
})
export class AnswerSurveyComponent implements OnInit {
  private subscriptions: Subscription[] = [];
  surveyFormDetail: SurveyForm;
  surveyCollectorDetail: SurveyCollector;
  ipAddress: string;
  geoLocation: any;
  startTime: Date;
  displaySurveyResults: boolean;
  dataSurveyResults: any;
  collectorPassword: string;
  isCorrectPassword: boolean;
  form: FormGroup;
  errorPasswordMessage: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private nzMessageService: NzMessageService,
    private translateService: TranslateService,
    private pSurveyCollectorService: PSurveyCollectorService,
    private pSurveyResponseService: PSurveyResponseService,
    private visitorsService: VisitorsService,
    private formBuilder: FormBuilder,
    private titleService: Title
  ) { }

  ngOnInit() {
    this.getIpAndGeoLocation();
    this.subscriptions.push(
      this.activatedRoute.params.subscribe((params: Params) => {
        const { url } = params;
        this.getSurveyCollectorByUrl(url);
      })
    );
    this.startTime = new Date();
  }

  getIpAndGeoLocation() {
    this.visitorsService.getIpAddress().subscribe(res => {
      this.ipAddress = res['ip'];
      this.visitorsService.getGeoLocation(this.ipAddress).subscribe(res => {
        this.geoLocation = res;
      });
    });
  }

  getSurveyCollectorByUrl(url: string) {
    this.loaderService.display(true);
    this.pSurveyCollectorService.getSurveyCollectorByUrl(url).subscribe(res => {
      if (res.status.code === 200) {
        this.surveyCollectorDetail = res.results[0];
        if (this.surveyCollectorDetail.surveyForm) {
          this.surveyFormDetail = this.surveyCollectorDetail.surveyForm;
          this.titleService.setTitle('UetSurvey - ' + this.surveyFormDetail.title);
          this.customFormByCollector();
        }
      }
    }, err => {
      this.loaderService.display(false);
      this.nzMessageService.error(this.translateService.instant(err.message));
    }, () => {
      this.loaderService.display(false);
    }
    );
  }
  customFormByCollector() {
    if (this.surveyCollectorDetail.passwordEnabled) {
      this.isCorrectPassword = false;
      this.buildForm();
    } else {
      this.isCorrectPassword = true;
    }
    if (this.surveyCollectorDetail.thankYouMessage && this.surveyFormDetail.json) {
      this.surveyFormDetail.json.completedHtml = `<h3>${this.surveyCollectorDetail.thankYouMessage}</h3>`;
    }
    if (!this.surveyCollectorDetail.allowMultipleResponses && this.surveyFormDetail.json) {
      this.surveyFormDetail.json.cookieName = this.surveyCollectorDetail.url;
    }
    
  }

  onSubmitSurveyResponse(json: any) {
    if (!json) {
      return;
    }
    const endTime = new Date();
    const surveyResponse: any = {
      surveyFormId: this.surveyFormDetail.id,
      surveyCollectorId: this.surveyCollectorDetail.id,
      totalTime: endTime.getTime() - this.startTime.getTime(),
      startTime: this.startTime,
      endTime: endTime,
      ipAddress: this.ipAddress,
      json: json && Object.keys(json).length > 0 ? json : null,
      geoLocation: this.geoLocation,
      collectorPassword: this.collectorPassword
    };
    this.loaderService.display(true);
    this.pSurveyResponseService.addSurveySurveyResponse(surveyResponse).subscribe(res => {
      if (res.status.code === 200) {
        if (this.surveyCollectorDetail.displaySurveyResults) {
          this.displaySurveyResults = true;
          this.dataSurveyResults = json;
        }
      }
    }, err => {
      this.loaderService.display(false);
      this.nzMessageService.error(
        this.translateService.instant(err.message)
      );
    }, () => {
      this.loaderService.display(false);
    }
    );
  }

  get f() {
    return this.form.controls;
  }

  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).dirty;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmitPassword(formData: FormGroup) {
    this.errorPasswordMessage = null;
    if (formData.invalid) {
      Helpers.validateAllFormFields(formData);
      return;
    }
    this.errorPasswordMessage = null;
    this.loaderService.display(true);
    Object.keys(formData.value).forEach(key => {
      if (Helpers.isString(formData.value[key])) {
        formData.value[key] = formData.value[key].trim();
      }
    });
    const data = {...formData.value,
      surveyCollectorId: this.surveyCollectorDetail.id
    }
    this.pSurveyCollectorService.compareSurveyCollectorPassword(data).subscribe(res => {
      if (
        res.status.code === 200 &&
        res.results[0].id === this.surveyCollectorDetail.id
      ) {
        this.nzMessageService.success(
          this.translateService.instant(res.status.message)
        );
        this.isCorrectPassword = true;
        this.collectorPassword = formData.value.password;
      }
    }, err => {
      this.errorPasswordMessage = this.translateService.instant(
        'default.layout.THE_PASSWORD_ENTERED_WAS_INCORRECT_PLEASE_CHECK_YOUR_DATA_AND_TRY_AGAIN'
      );
      this.isCorrectPassword = false;
      this.loaderService.display(false);
    }, () => {
      this.loaderService.display(false);
    }
    );
  }
}
