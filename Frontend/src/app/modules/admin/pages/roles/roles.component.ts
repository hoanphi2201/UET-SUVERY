import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators, FormGroupDirective, } from '@angular/forms';
import { Role, RoleService, IValidators, TableListColumn, Pagging, ExcelService } from '@app/core';
import { LoaderService, Helpers } from '@app/shared';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  @ViewChild('formDirective', { static: false }) private formDirective: NgForm;
  form: FormGroup;
  listOfAllData: Role[] = [];
  sortField: string | null = 'id';
  sortType: string | null = 'asc';
  searchValue = '';
  searchKey = '';
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mapOfCheckedId: { [key: string]: boolean } = {};
  numberOfChecked = 0;
  visible = false;
  editing = false;
  selectedEdit: Role;
  columns: TableListColumn[] = [];
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
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private excelService: ExcelService
  ) { }
  ngOnInit() {
    this.selectedEdit = {} as Role;
    this.buildForm();
    this.getRoleList();
  }
  ngAfterContentInit(): void {
    this.initTable();
  }
  initTable() {
    // tslint:disable-next-line:max-line-length
    this.columns = [
      { id: 'id', type: 'text', hidden: true, header: 'admin.layout.ID' },
      { id: 'name', type: 'text', sortable: true, header: 'admin.layout.NAME' },
      { id: 'lastName', type: 'select', header: 'admin.layout.ROLE_ACP' },
      { id: 'defaultSignUp', type: 'checkbox', header: 'admin.layout.SIGN_UP_DEFAULT' },
      { id: 'createdAt', type: 'date', sortable: true, header: 'admin.layout.CREATED_AT' },
      { id: 'createdAt', type: 'date', sortable: true, header: 'admin.layout.UPDATED_AT' }
    ];
  }
  buildForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, IValidators.spaceStringValidator()]]
    });
  }
  get f() {
    return this.form.controls;
  }
  getRoleList() {
    this.loaderService.display(true);
    this.roleService.getRoleList(this.pagging.page, this.pagging.pageSize, this.sortField, this.sortType, this.searchKey, this.searchValue).subscribe(res => {
      if (res.status.code === 200) {
        this.listOfAllData = res.results;
        this.pagging.total = res.paging.total;
        this.refreshStatus();
      }
    }, err => {
      this.loaderService.display(false);
      this.nzMessageService.error(err.message);
    }, () => {
      this.loaderService.display(false);
    }
    );
  }
  sort(sort: { key: string; value: string }): void {
    this.sortField = sort.key;
    if (sort.value === 'ascend') {
      this.sortType = 'asc';
    } else {
      this.sortType = 'desc';
    }
    this.getRoleList();
  }
  search(): void {
    this.getRoleList();
  }
  reset(): void {
    this.searchKey = '';
    this.searchValue = '';
    this.getRoleList();
  }
  pageIndexChange($event: any) {
    this.pagging.page = $event;
    this.getRoleList();
    this.mapOfCheckedId = {};
    this.refreshStatus();
  }
  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfAllData.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate = this.listOfAllData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
    this.numberOfChecked = this.listOfAllData.filter(item => this.mapOfCheckedId[item.id]).length;
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
    this.getRoleList();
  }
  showDeleteConfirm(roleId?: string): void {
    this.modalService.confirm({
      nzTitle: this.translateService.instant('admin.layout.DELETE_ROLE_TITLE'),
      nzCancelText: this.translateService.instant('admin.layout.NO'),
      nzOkText: this.translateService.instant('admin.layout.YES'),
      nzOnOk: () => {
        if (roleId) {
          return this.onDeleteRole(roleId);
        }
        return this.onDeleteMultyRole();
      }
    });
  }
  openForm(role: Role) {
    this.visible = true;
    this.editing = false;
    this.selectedEdit = {} as Role;
    if (role) {
      this.editing = true;
      this.selectedEdit = {...role}
    }
  }
  closeForm(): void {
    this.visible = false;
  }
  onAddRole(formData: any, formDirective: FormGroupDirective) {
    if (this.form.invalid) {
      Helpers.validateAllFormFields(formData);
      return;
    }
    this.loaderService.display(true);
    Object.keys(formData.value).forEach(key => {
      if (Helpers.isString(formData.value[key])) {
        formData.value[key] = formData.value[key].trim();
      }
    });
    if (!this.editing) {
      return this.roleService.addRole(formData.value).subscribe(res => {
        this.resetFormAfterSubmit(formDirective);
        this.nzMessageService.success(this.translateService.instant(res.status.message));
      }, err => {
        this.loaderService.display(false);
        this.nzMessageService.error(
          this.translateService.instant(err.message)
        );
      }, () => {
        this.loaderService.display(false);
      });
    }
    return this.roleService.updateRole(formData.value, this.selectedEdit.id).subscribe(res => {
      this.resetFormAfterSubmit(formDirective);
      this.nzMessageService.success(this.translateService.instant(res.status.message));
    }, err => {
      this.loaderService.display(false);
      this.nzMessageService.error(this.translateService.instant(err.message));
    }, () => {
      this.loaderService.display(false);
    });
  }
  resetFormAfterSubmit(formDirective: FormGroupDirective) {
    this.getRoleList();
    this.editing = false;
    formDirective.resetForm();
    this.form.reset();
    this.closeForm();
  }
  onDeleteRole(roleId: string) {
    this.loaderService.display(true);
    this.roleService.deleteRole(roleId).subscribe(res => {
      if (res.status.code === 200) {
        this.nzMessageService.success(this.translateService.instant(res.status.message));
        this.getRoleList();
      }
    }, err => {
      this.loaderService.display(false);
      this.nzMessageService.error(this.translateService.instant(err.message));
    }, () => {
      this.loaderService.display(false);
    }
    );
  }
  onDeleteMultyRole() {
    const roleIds = _.keys(_.pickBy(this.mapOfCheckedId));
    this.roleService.deleteMultyRole({ roleIds }).subscribe(res => {
      if (res.status.code === 200) {
        this.mapOfCheckedId = {};
        this.nzMessageService.success(this.translateService.instant(res.status.message));
        this.getRoleList();
      }
    }, err => {
      this.loaderService.display(false);
      this.nzMessageService.error(this.translateService.instant(err.message));
    }, () => {
      this.loaderService.display(false);
    }
    );
  }
  onChangeRoleAcp(roleId: string) {
    this.loaderService.display(true);
    this.roleService.changeRoleAcp(roleId).subscribe(
      res => {
        if (res.status.code === 200) {
          this.nzMessageService.success(this.translateService.instant(res.status.message));
          this.getRoleList();
        }
      }, err => {
        this.loaderService.display(false);
        this.nzMessageService.error(this.translateService.instant(err.message));
      }, () => {
        this.loaderService.display(false);
      }
    );
  }
  onUpdateDefaultSignUp(role: Role) {
    if (!role) {
      return
    }
    this.loaderService.display(true);
    this.roleService.changeDefaultSignUp(role.id).subscribe(res => {
      this.nzMessageService.success(this.translateService.instant(res.status.message));
    }, err => {
      role.defaultSignUp = !role.defaultSignUp;
      this.loaderService.display(false);
      this.nzMessageService.error(this.translateService.instant(err.message));
    }, () => {
      this.loaderService.display(false);
    });
  }
  isFieldValid(form: FormGroup, field: string) {
    return !form.get(field).valid && form.get(field).dirty;
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
    this.excelService.exportAsExcelFile(data, 'roles', type);
  }
}
