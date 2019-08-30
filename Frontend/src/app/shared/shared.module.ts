import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgZorroAntdModule, PerfectScrollbarModule],
  declarations: [],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgZorroAntdModule, PerfectScrollbarModule]
})
export class SharedModule {}
