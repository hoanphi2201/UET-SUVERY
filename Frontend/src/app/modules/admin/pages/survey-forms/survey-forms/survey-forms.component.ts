import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormGroupDirective, Validators, NgForm, FormBuilder } from '@angular/forms';
import { SurveyForm, User, SurveyFolder, IValidators, Pagging, TableListColumn, SurveyFormService, AuthService, ExcelService } from '@app/core';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService, NzModalService, NzModalRef } from 'ng-zorro-antd';
import { LoaderService, WindowresizeService, Helpers } from '@app/shared';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-forms',
  templateUrl: './survey-forms.component.html',
  styleUrls: ['./survey-forms.component.scss']
})
export class SurveyFormsComponent implements OnInit {
  @ViewChild('formDirective', { static: false }) private formDirective: NgForm;
  @ViewChild('tplTitleModalView', { static: false }) tplTitleModalView: TemplateRef<any>;
  @ViewChild('tplContentModalView', { static: false }) tplContentModalView: TemplateRef<any>;
  @ViewChild('tplFooterModalView', { static: false }) tplFooterModalView: TemplateRef<any>;
  form: FormGroup;
  listOfAllData: SurveyForm[] = [];
  sortField: string | null = 'id';
  sortType: string | null = 'asc';
  filterKey = '';
  filterValue: any[] = [];
  searchKey = '';
  searchValue = '';
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mapOfCheckedId: { [key: string]: boolean } = {};
  numberOfChecked = 0;
  screenWidth: number;
  visible = false;
  editing = false;
  selectedEdit: SurveyForm;
  columns: TableListColumn[] = [];
  buttonLoading = false;
  currentUser: any;
  modalForm: NzModalRef;
  selectSurveyView: SurveyForm;
  pagging: Pagging = {
    page: 1,
    total: 0,
    pageSize: 10
  };
  constructor(
    private translateService: TranslateService,
    private nzMessageService: NzMessageService,
    private modalService: NzModalService,
    private loaderService: LoaderService,
    private surveyFormService: SurveyFormService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private windowresizeService: WindowresizeService,
    private router: Router,
    private excelService: ExcelService
  ) { }
  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.windowresizeService.getSize().subscribe(size => {
      this.screenWidth = +size.innerWidth;
    });
    this.authService.getCurrentUser().subscribe(userData => {
      if (userData) {
        this.currentUser = userData;
      }
    });
    this.selectedEdit = {} as SurveyForm;
    this.selectedEdit.user = {} as User;
    this.selectedEdit.surveyFolder = {} as SurveyFolder;
    this.buildForm();
    this.getSurveyFormList();
  }
  ngAfterContentInit(): void {
    this.initTable();
  }
  initTable() {
    this.columns = [
      { id: 'id', type: 'text', hidden: true, header: 'admin.layout.ID' },
      { id: 'title', type: 'text', sortable: true, search: true, header: 'admin.layout.TITLE' },
      { id: 'userName', type: 'text', header: 'admin.layout.USER_NAME' },
      { id: 'surveyFolderTitle', type: 'text', header: 'admin.layout.SURVEY_FOLDER' },
      { id: 'createdAt', type: 'date', sortable: true, header: 'admin.layout.CREATED_AT' },
      { id: 'createdAt', type: 'date', sortable: true, header: 'admin.layout.UPDATED_AT' }
    ];
  }
  buildForm() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, IValidators.spaceStringValidator()]],
      description: ['']
    });
  }
  getSurveyFormList() {
    this.loaderService.display(true);
    this.surveyFormService.getSurveyFormList(this.pagging.page, this.pagging.pageSize, this.sortField, this.sortType, this.searchKey, this.searchValue, this.filterKey, JSON.stringify(this.filterValue)).subscribe(res => {
      if (res.status.code === 200) {
        this.listOfAllData = res.results.map((o: any) => {
          return {...o,
            userName: o.user.userName,
            surveyFolderTitle: o.surveyFolder ? o.surveyFolder.title : 'N/A'
          };
        });
        this.pagging.total = res.paging.total;
        this.refreshStatus();
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
  sort(sort: { key: string; value: string }): void {
    this.sortField = sort.key;
    if (sort.value === 'ascend') {
      this.sortType = 'asc';
    } else {
      this.sortType = 'desc';
    }
    this.getSurveyFormList();
  }
  search(): void {
    this.getSurveyFormList();
  }
  reset(): void {
    this.searchKey = '';
    this.searchValue = '';
    this.getSurveyFormList();
  }
  filter($event: any, key: string) {
    this.filterKey = key;
    this.filterValue = $event;
    this.getSurveyFormList();
  }
  pageIndexChange($event: any) {
    this.pagging.page = $event;
    this.getSurveyFormList();
    this.mapOfCheckedId = {};
    this.refreshStatus();
  }
  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfAllData.every(
      item => this.mapOfCheckedId[item.id]
    );
    this.isIndeterminate =
      this.listOfAllData.some(item => this.mapOfCheckedId[item.id]) &&
      !this.isAllDisplayDataChecked;
    this.numberOfChecked = this.listOfAllData.filter(
      item => this.mapOfCheckedId[item.id]
    ).length;
  }
  checkItem(id: string, $event: any) {
    this.mapOfCheckedId[id] = $event;
    this.refreshStatus();
  }
  checkAll(value: boolean): void {
    this.listOfAllData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }
  pageSizeChange($event: any) {
    this.pagging.pageSize = $event;
    this.getSurveyFormList();
  }
  showDeleteConfirm(surveyFormId?: string): void {
    this.modalService.confirm({
      nzTitle: this.translateService.instant('admin.layout.DELETE_USER_TITLE'),
      nzCancelText: this.translateService.instant('admin.layout.NO'),
      nzOkText: this.translateService.instant('admin.layout.YES'),
      nzOnOk: () => {
        if (surveyFormId) {
          return this.onDeleteSurveyForm(surveyFormId);
        }
        return this.onDeleteMultySurveyForm();
      }
    });
  }
  openModal(tplTitle: TemplateRef<{}>, tplContent: TemplateRef<{}>, tplFooter: TemplateRef<{}>, surveyForm?: SurveyForm): void {
    if (surveyForm) {
      this.editing = true;
      this.selectedEdit = {...surveyForm};
    }
    this.modalForm = this.modalService.create({
      nzTitle: tplTitle,
      nzContent: tplContent,
      nzFooter: tplFooter,
      nzMaskClosable: false,
      nzClosable: true
    });
  }
  onAddSurveyForm(formData: any, formDirective: FormGroupDirective) {
    if (this.form.invalid) {
      Helpers.validateAllFormFields(formData);
      return;
    }
    this.buttonLoading = true;
    this.loaderService.display(true);
    Object.keys(formData.value).forEach(key => {
      if (Helpers.isString(formData.value[key])) {
        formData.value[key] = formData.value[key].trim();
      }
    });
    if (!this.editing) {
      return this.surveyFormService.addSurveyForm({...formData.value,  userId: this.currentUser.id }).subscribe(res => {
        this.resetFormAfterSubmit(formDirective);
        this.nzMessageService.success(
          this.translateService.instant(res.status.message)
        );
      }, err => {
        this.loaderService.display(false);
        this.buttonLoading = false;
        this.nzMessageService.error(
          this.translateService.instant(err.message)
        );
      }, () => {
        this.loaderService.display(false);
        this.buttonLoading = false;
      }
      );
    }
    return this.surveyFormService.updateSurveyForm(formData.value, this.selectedEdit.id).subscribe(res => {
      this.resetFormAfterSubmit(formDirective);
      this.nzMessageService.success(
        this.translateService.instant(res.status.message)
      );
    }, err => {
      this.loaderService.display(false);
      this.buttonLoading = false;
      this.nzMessageService.error(
        this.translateService.instant(err.message)
      );
    }, () => {
      this.loaderService.display(false);
      this.buttonLoading = false;
    }
    );
  }
  resetFormAfterSubmit(formDirective: FormGroupDirective) {
    this.editing = false;
    this.selectedEdit = {} as SurveyForm;
    this.selectedEdit.user = {} as User;
    this.selectedEdit.surveyFolder = {} as SurveyFolder;
    this.getSurveyFormList();
    formDirective.resetForm();
    this.form.reset();
    this.closeModal();
  }
  closeModal() {
    this.modalForm.destroy();
  }
  onDeleteSurveyForm(surveyFormId: string) {
    this.loaderService.display(true);
    this.surveyFormService.deleteSurveyForm(surveyFormId).subscribe(res => {
      if (res.status.code === 200) {
        this.nzMessageService.success(
          this.translateService.instant(res.status.message)
        );
        this.getSurveyFormList();
      }
    }, err => {
      this.loaderService.display(false);
      this.nzMessageService.error(this.translateService.instant(err.message));
    }, () => {
      this.loaderService.display(false);
    }
    );
  }
  onDeleteMultySurveyForm() {
    const surveyFormIds = _.keys(_.pickBy(this.mapOfCheckedId));
    this.loaderService.display(true);
    this.surveyFormService.deleteMultySurveyForm({ surveyFormIds }).subscribe(res => {
      if (res.status.code === 200) {
        this.nzMessageService.success(
          this.translateService.instant(res.status.message)
        );
        this.getSurveyFormList();
      }
    }, err => {
      this.loaderService.display(false);
      this.nzMessageService.error(this.translateService.instant(err.message));
    }, () => {
      this.loaderService.display(false);
    }
    );
  }
  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).dirty;
  }
  gotoSurveyCreator() {
    if (this.selectedEdit.id) {
      this.closeModal();
      this.router.navigate(['/admin', 'survey-forms', this.selectedEdit.id]);
    }
  }
  viewSurveyForm(surveyForm: SurveyForm) {
    this.selectSurveyView = surveyForm;
    this.modalForm = this.modalService.create({
      nzTitle: this.tplTitleModalView,
      nzContent: this.tplContentModalView,
      nzFooter: this.tplFooterModalView,
      nzWidth: 768,
      nzMaskClosable: true,
      nzClosable: true
    });
  }
  onExport(type: string) {
    const data = [];
    this.listOfAllData.forEach(row => {
      const intance = {};
      this.columns.forEach(col => {
        intance[this.translateService.instant(col.header)] = row[col.id]; 
      })
      data.push(intance);
    })
    this.excelService.exportAsExcelFile(data, 'survey_forms', type);
  }
}
