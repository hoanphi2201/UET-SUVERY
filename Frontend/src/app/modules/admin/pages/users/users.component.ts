import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators, FormGroupDirective } from '@angular/forms';
import { User, UserService, IValidators, RoleService, Role, TableListColumn, Pagging, ExcelService } from '@app/core';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { LoaderService, WindowresizeService, Helpers } from '@app/shared';
import * as _ from 'lodash';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterContentInit {
  @ViewChild('formDirective', { static: false }) private formDirective: NgForm;
  form: FormGroup;
  listOfAllData: User[] = [];
  listOfAllRole: Role[] = [];
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
  selectedEdit: User;
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
    private userService: UserService,
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private windowresizeService: WindowresizeService,
    private excelService: ExcelService
  ) { }
  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.windowresizeService.getSize().subscribe(size => {
      this.screenWidth = +size.innerWidth;
    });
    this.selectedEdit = {} as User;
    this.selectedEdit.role = {} as Role;
    this.buildForm();
    this.getUserList();
    this.getRoleList();
  }
  ngAfterContentInit(): void {
    this.initTable();
  }
  initTable() {
    this.columns = [
      { id: 'id', type: 'text', hidden: true, header: 'admin.layout.ID' },
      { id: 'firstName', type: 'text', sortable: true, search: true, header: 'admin.layout.FIRST_NAME' },
      { id: 'lastName', type: 'text', sortable: true, search: true, header: 'admin.layout.LAST_NAME' },
      { id: 'userName', type: 'text', sortable: true, search: true, header: 'admin.layout.USER_NAME' },
      { id: 'email', type: 'text', hidden: true, search: true, header: 'admin.layout.EMAIL' },
      { id: 'roleName', type: 'select', filter: [], filterKey: 'roleId', header: 'admin.layout.ROLE' },
      { id: 'createdAt', type: 'date', sortable: true, header: 'admin.layout.CREATED_AT' },
      { id: 'updatedAt', type: 'date', sortable: true, header: 'admin.layout.UPDATED_AT' }
    ];
  }
  buildForm() {
    this.form = this.formBuilder.group(
      {
        firstName: ['', [Validators.required, IValidators.spaceStringValidator()]],
        lastName: ['', [Validators.required, IValidators.spaceStringValidator()]],
        userName: ['', [Validators.required, IValidators.spaceStringValidator()]],
        email: ['', [
          Validators.required,
          IValidators.emailValidator(),
          IValidators.spaceStringValidator()
        ]
        ],
        roleId: ['', [Validators.required]],
        password: ['', [Validators.compose([Validators.required, Validators.minLength(5)])]],
        confirmPassword: ['', [Validators.compose([Validators.required])]]
      },
      {
        validator: IValidators.passwordMatchValidator
      }
    );
  }
  getRoleList() {
    this.loaderService.display(true);
    this.roleService.getAllRoleList().subscribe(res => {
      if (res.status.code === 200) {
        this.listOfAllRole = res.results.map((o: any) => {
          return { text: o.name, value: o.id };
        });
        this.mapOptionsFilter('roleId', this.listOfAllRole);
      }
    }, err => {
      this.loaderService.display(false);
      this.nzMessageService.error(this.translateService.instant(err.message));
    }, () => {
      this.loaderService.display(false);
    }
    );
  }
  mapOptionsFilter(id: string, options: any) {
    const column = this.columns.filter(col => col.filterKey === id || col.id === id)[0];
    if (column) {
      column.filter = options;
    }
  }
  getUserList() {
    this.loaderService.display(true);
    this.userService.getUserList(this.pagging.page, this.pagging.pageSize, this.sortField, this.sortType, this.searchKey, this.searchValue, this.filterKey, JSON.stringify(this.filterValue)).subscribe(res => {
      if (res.status.code === 200) {
        this.listOfAllData = res.results.map((o: any) => {
          return {...o, roleName: o.role.name }
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
    this.getUserList();
  }
  search(): void {
    this.getUserList();
  }
  reset(): void {
    this.searchKey = '';
    this.searchValue = '';
    this.getUserList();
  }
  filter($event: any, key: string) {
    this.filterKey = key;
    this.filterValue = $event;
    this.getUserList();
  }
  pageIndexChange($event: any) {
    this.pagging.page = $event;
    this.getUserList();
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
    this.getUserList();
  }
  showDeleteConfirm(userId?: string): void {
    this.modalService.confirm({
      nzTitle: this.translateService.instant('admin.layout.DELETE_USER_TITLE'),
      nzCancelText: this.translateService.instant('admin.layout.NO'),
      nzOkText: this.translateService.instant('admin.layout.YES'),
      nzOnOk: () => {
        if (userId) {
          return this.onDeleteUser(userId);
        }
        return this.onDeleteMultyUser();
      }
    });
  }
  openForm(user: User) {
    this.visible = true;
    this.editing = false;
    this.selectedEdit = {} as User;
    this.selectedEdit.role = {} as Role;
    if (user) {
      this.editing = true;
      this.selectedEdit = {...user}
    }
  }
  closeForm(): void {
    this.visible = false;
  }
  onAddUser(formData: any, formDirective: FormGroupDirective) {
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
      return this.userService.addUser(formData.value).subscribe(res => {
        if (res.status.code === 200) {
          this.resetFormAfterSubmit(formDirective);
          this.nzMessageService.success(
            this.translateService.instant(res.status.message)
          );
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
    return this.userService.updateUser(formData.value, this.selectedEdit.id).subscribe(res => {
      if (res.status.code === 200) {
        this.resetFormAfterSubmit(formDirective);
        this.nzMessageService.success(
          this.translateService.instant(res.status.message)
        );
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
  resetFormAfterSubmit(formDirective: FormGroupDirective) {
    this.getUserList();
    this.editing = false;
    formDirective.resetForm();
    this.form.reset();
    this.selectedEdit = {} as User;
    this.selectedEdit.role = {} as Role;
    this.closeForm();
  }
  onDeleteUser(userId: string) {
    this.loaderService.display(true);
    this.userService.deleteUser(userId).subscribe(res => {
      if (res.status.code === 200) {
        this.nzMessageService.success(
          this.translateService.instant(res.status.message)
        );
        this.getUserList();
      }
    }, err => {
      this.loaderService.display(false);
      this.nzMessageService.error(this.translateService.instant(err.message));
    }, () => {
      this.loaderService.display(false);
    }
    );
  }
  onDeleteMultyUser() {
    const userIds = _.keys(_.pickBy(this.mapOfCheckedId));
    this.loaderService.display(true);
    this.userService.deleteMultyUser({ userIds }).subscribe(res => {
      if (res.status.code === 200) {
        this.nzMessageService.success(
          this.translateService.instant(res.status.message)
        );
        this.getUserList();
      }
    }, err => {
      this.loaderService.display(false);
      this.nzMessageService.error(this.translateService.instant(err.message));
    }, () => {
      this.loaderService.display(false);
    }
    );
  }
  onChangeRole(roleId: string, userId: string) {
    this.loaderService.display(true);
    this.userService.changeRole(userId, roleId).subscribe(res => {
      if (res.status.code === 200) {
        this.nzMessageService.success(
          this.translateService.instant(res.status.message)
        );
        this.getUserList();
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
  onExport(type: string) {
    const data = [];
    this.listOfAllData.forEach(row => {
      const intance = {};
      this.columns.forEach(col => {
        intance[this.translateService.instant(col.header)] = row[col.id]; 
      })
      data.push(intance);
    })
    this.excelService.exportAsExcelFile(data, 'users', type);
  }
  
}
