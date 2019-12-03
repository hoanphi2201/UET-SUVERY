import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { DSurveyFormService, SurveyForm, Pagging, AuthService, User, SlideInOutAnimation, appConfig, DSurveyResponseService, DUserService } from '@app/core';
import { LoaderService } from '@app/shared';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, interval, Subscription, Subject } from 'rxjs';
import { map, debounceTime, switchMap, startWith, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ManageProfileComponent } from '@app/shared/modals/manage-profile/manage-profile.component';
import { environment as env } from '@env/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [SlideInOutAnimation]
})
export class DashboardComponent implements OnInit, OnDestroy {
  searchChange$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  destroyInterval$: Subject<boolean> = new Subject<boolean>();
  listOfSurvey: any[] = [];
  listOfAllData: SurveyForm[] = [];
  isLoading = false;
  pagging: Pagging = {
    page: 1,
    total: 0,
    pageSize: 10
  };
  searchKey = 'title';
  searchValue: string;
  sortField: string | null = 'createdAt';
  sortType: string | null = 'desc';
  filterKey = '';
  filterValue: any[] = [];
  isSeachNew = false;
  countStatus: any[];
  currentUser: User;
  folderSelectId = 'all';
  surveyFormDelete: SurveyForm;
  modalForm: NzModalRef;
  listOfAllJobRole = env.jobRole;
  progressPanelState: 'in' | 'out' = 'in';
  totalResponse: number;
  typicalTimeSpent: number;
  averageCompletionRate: number;
  private subscriptions: Subscription[] = [];
  constructor(
    private dSurveyFormService: DSurveyFormService,
    private dSurveyResponseService: DSurveyResponseService,
    private dUserService: DUserService,
    private nzMessageService: NzMessageService,
    private translateService: TranslateService,
    private loaderService: LoaderService,
    private modalService: NzModalService,
    private authService: AuthService,
    private router: Router
  ) { }
  ngOnInit() {
    this.subscriptions.push(
      this.authService.getCurrentUser().subscribe(userData => {
        this.currentUser = userData;
        if (this.currentUser && !this.currentUser.accountComplete) {
          const sourceInterval = interval(
            appConfig.completeAccountRefreshInterval
          );
          this.subscriptions.push(sourceInterval.pipe(
            startWith(0),
            takeUntil(this.destroyInterval$)).subscribe(() => this.updateIfCompleteAccount()));
        } else {
          this.progressPanelState = 'out';
        }
      })
    );

    this.getListSurvey();
    this.countSurveyFormStatus();
    this.countAllResponsesAndTypicalTimeSpent();
    const getUserList = (title: string) =>
      this.dSurveyFormService.searchDashboardSurveyFormList(title, 5).pipe(
        map((res: any) => {
          if (res.status.code === 200) {
            return res.results;
          }
          return [];
        })
      );
    const listOfSurvey$: Observable<any[]> = this.searchChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(getUserList));
    listOfSurvey$.subscribe(users => {
      this.listOfSurvey = users;
      this.isLoading = false;
    });
  }
  private countAllResponsesAndTypicalTimeSpent() {
    this.dSurveyResponseService.countAllResponsesAndTypicalTimeSpent().subscribe(res => {
      if (res.status.code === 200) {
        this.typicalTimeSpent = res.results[0].typicalTimeSpent;
        this.totalResponse = res.results[0].totalResponse;
        this.averageCompletionRate = Math.floor(
          (res.results[0].totalResponseComplete / this.totalResponse) * 100
        );
      }
    });
  }

  private updateIfCompleteAccount() {
    if (this.percentDoneProfile === 100 && this.countStatus && this.countStatus.length > 0) {
      this.destroyInterval$.next(true);
      const updateData = {
        accountComplete: true,
        userName: this.currentUser.userName
      };
      this.dUserService.updateUser(updateData, this.currentUser.id).subscribe(res => {
        if (res.status.code === 200) {
          this.authService.setCurrentUser({...this.currentUser, updateData}, true);
        }
      }, err => {
        this.nzMessageService.error(
          this.translateService.instant(err.message)
        );
      }
      );
    }
  }
  countSurveyFormStatus() {
    this.loaderService.display(true);
    this.dSurveyFormService.countSurveyFormStatus().subscribe(res => {
      if (res.status.code === 200) {
        this.countStatus = res.results;
      }
    }, err => {
      this.loaderService.display(false);
      this.nzMessageService.error(this.translateService.instant(err.message));
    }, () => {
      this.loaderService.display(false);
    }
    );
  }
  getListSurvey() {
    if (this.folderSelectId !== 'all') {
      this.filterValue = [this.folderSelectId];
      this.filterKey = 'surveyFolderId';
    } else {
      this.filterValue = [];
      this.filterKey = '';
    }
    this.loaderService.display(true);
    const countColumn = 'collector';
    this.dSurveyFormService.getDefaultSurveyFormList(this.pagging.page, this.pagging.pageSize, this.sortField, this.sortType, this.searchKey, this.searchValue || '', this.filterKey, JSON.stringify(this.filterValue), countColumn).subscribe(res => {
      if (res.status.code === 200) {
        if (this.isSeachNew) {
          this.listOfAllData = res.results;
          this.isSeachNew = false;
        } else {
          this.listOfAllData = [...this.listOfAllData, ...res.results];
        }
        this.pagging.total = res.paging.total;
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
  onSearchSelect(value: string): void {
    this.isLoading = true;
    this.searchChange$.next(value);
    if (value === '') {
      this.getNewSurveyList();
    }
  }
  onSearchList(value: string) {
    this.searchValue = value;
    this.getNewSurveyList();
  }
  getNewSurveyList() {
    this.pagging.page = 1;
    this.isSeachNew = true;
    this.getListSurvey();
  }
  loadMoreSurvey() {
    this.pagging.page += 1;
    this.getListSurvey();
  }
  countQuestionSurvey(json: any) {
    const defaultValue = 0;
    if (!json) {
      return defaultValue;
    }
    let total = 0;
    try {
      json.pages.forEach(o => {
        if (o.elements && Array.isArray(o.elements)) {
          total += o.elements.length;
        }
      });
    } catch (error) {
      return defaultValue;
    }
    return total >= defaultValue ? total : defaultValue;
  }
  displayCountStatus(status: string) {
    const defaultValue = 0;
    if (!this.countStatus) {
      return defaultValue;
    }
    const cStatus = this.countStatus.filter(o => o.status === status)[0];
    if (!cStatus) {
      return defaultValue;
    }
    return cStatus.total ? cStatus.total : defaultValue;
  }
  calculateTimeComplete(json: any) {
    const defaultValue = '—';
    if (!json) {
      return defaultValue;
    }
    let total = 0;
    let questions = 0;
    let decisions = 0;
    const openQuestions = ['comment', 'text', 'tagbox', 'sortablelist', 'html', 'multipletext'];
    json.pages.forEach(o => {
      if (o.elements && Array.isArray(o.elements)) {
        questions += o.elements.length;
        total += o.elements.length * 5;
        o.elements.forEach(element => {
          total += element.name.split(' ').length / 5;
          if (openQuestions.includes(element.type)) {
            total += 15;
          }
          if (element.choices) {
            decisions += element.choices.length;
          }
          if (element.columns) {
            decisions += element.columns.length;
          }
          if (element.items) {
            decisions += element.items.length;
          }
        });
      }

    });
    total += (decisions - questions) * 2;
    return (total / 60).toFixed(2) + ' min';
  }
  setClicked($event: any, survey: any) {
    survey.clicked = $event;
  }
  showDeleteConfirm(surveyForm: SurveyForm, tplContent: TemplateRef<{}>): void {
    this.surveyFormDelete = surveyForm;
    this.modalService.confirm({
      nzTitle: this.translateService.instant('default.layout.ARE_YOU_SURE_YOU_WANT_TO_DELETE_THIS_SURVEY'),
      nzCancelText: this.translateService.instant('default.layout.CANCEL'),
      nzOkText: this.translateService.instant('default.layout.DELETE'),
      nzContent: tplContent,
      nzOnOk: () => {
        if (surveyForm) {
          return this.onDeleteSurveyForm(surveyForm.id);
        }
      }
    });
  }

  private onDeleteSurveyForm(surveyFormId: string) {
    this.loaderService.display(true);
    this.dSurveyFormService.deleteSurveyForm(surveyFormId).subscribe(res => {
      if (res.status.code === 200) {
        this.nzMessageService.success(
          this.translateService.instant(res.status.message)
        );
        this.getNewSurveyList();
      }
    }, err => {
      this.loaderService.display(false);
      this.nzMessageService.error(this.translateService.instant(err.message));
    }, () => {
      this.loaderService.display(false);
    }
    );
  }
  onMakeCopy(surveyForm: SurveyForm) {
    const copySurvey = {
      json: surveyForm.json,
      title: `Copy of ${surveyForm.title}`,
      description: surveyForm.description,
      userId: this.currentUser.id
    };
    return this.dSurveyFormService.addSurveyForm(copySurvey).subscribe(res => {
      if (res.status.code === 200) {
        this.nzMessageService.success(
          this.translateService.instant(res.status.message)
        );
        this.router.navigate(['/create', 'design-survey', res.results[0].id]);
      }
    }, err => {
      this.loaderService.display(false);
      this.nzMessageService.error(this.translateService.instant(err.message));
    }, () => {
      this.loaderService.display(false);
    }
    );
  }
  showProfile(current: number): void {
    this.modalForm = this.modalService.create({
      nzTitle: '',
      nzFooter: null,
      nzContent: ManageProfileComponent,
      nzCancelDisabled: true,
      nzMaskClosable: true,
      nzClosable: true,
      nzWidth: 700,
      nzClassName: 'manage-profile-dialog',
      nzComponentParams: { current }
    });
  }
  get percentDoneProfile() {
    const fields = ['firstName', 'lastName', 'avatar', 'email', 'jobRole', 'jobLevel', 'organization.organizationType', 'organization.industry', 'organization.location', 'organization.size'];
    const totalProfileQuality = Math.floor((<number>fields.reduce((result, next: any) => {
      return ((<number>result) += <number>(
        this.notCompletedField(this.resolve(this.currentUser, next))
      ));
    }, 0) * 100) / fields.length);
    return totalProfileQuality;
  }
  private notCompletedField(value) {
    if (!value || value === '' || (Array.isArray(value) && value.length === 0)) {
      return 0;
    }
    return 1;
  }
  private resolve(obj, path) {
    path = path.split('.');
    let current = obj;
    while (path.length) {
      try {
        if (typeof current !== 'object') return undefined;
        current = current[path.shift()];
      } catch (error) {
        return undefined;
      }
    }
    return current;
  }
  formatInfoProgress = (percent: number) => `${percent}%`;
  get msToHMSTypicalTimeSpent() {
    function pad(n, z = 2) {
      z = z || 2;
      return ('00' + n).slice(-z);
    }
    if (this.typicalTimeSpent) {
      let s = +this.typicalTimeSpent;


      var ms = s % 1000;
      s = (s - ms) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;
      var hrs = (s - mins) / 60;
      return `${pad(hrs)}h:${pad(mins)}m:${pad(secs)}s`;
    }
  }
  ngOnDestroy() {
    this.destroyInterval$.next(true);
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
