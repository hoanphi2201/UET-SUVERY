import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SurveyFormService, SurveyForm } from '@app/core';
import { LoaderService } from '@app/shared';
import { NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-survey-forms-creator',
  templateUrl: './survey-forms-creator.component.html',
  styleUrls: ['./survey-forms-creator.component.scss']
})
export class SurveyFormsCreatorComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  surveyFormDetail: SurveyForm;
  constructor(
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private nzMessageService: NzMessageService,
    private translateService: TranslateService,
    private surveyFormService: SurveyFormService,
    private router: Router
  ) {}
  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.getSurveyFormById(params['surveyFormId']);
      }
    );
  }
  getSurveyFormById(surveyFormId: string) {
    this.loaderService.display(true);
    this.surveyFormService.getSurveyFormById(surveyFormId).subscribe(
      res => {
        if (res.status.code === 200) {
          if (res.results && res.results[0]) {
            this.surveyFormDetail = res.results[0];
          } else {
            this.nzMessageService.warning(
              this.translateService.instant(
                'admin.layout.SURVEY_FORM_NOT_EXIST'
              )
            );
            this.router.navigate(['/admin', 'survey-forms']);
          }
        }
      },
      err => {
        this.loaderService.display(false);
        this.nzMessageService.error(this.translateService.instant(err.message));
      },
      () => {
        this.loaderService.display(false);
      }
    );
  }
  onSurveySaved(json: any) {
    if (!json) {
      return;
    }
    this.nzMessageService.loading(
      this.translateService.instant('admin.layout.SAVING')
    );
    return this.surveyFormService
      .updateSurveyForm({ json }, this.surveyFormDetail.id)
      .subscribe(
        res => {
          if (res.status.code === 200) {
            this.nzMessageService.success(
              this.translateService.instant('admin.layout.SAVED')
            );
          }
        },
        err => {
          this.nzMessageService.error(
            this.translateService.instant(err.message)
          );
        }
      );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
