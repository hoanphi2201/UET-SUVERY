import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NzModalService } from 'ng-zorro-antd';
import { UserService } from '@app/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.less']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  layout = {
    collapsed: true,
    siderMode: 'side',
    topMode: function() {
      return this.siderMode != 'over' && this.setting.mode == 'top';
    },
    setting: {
      theme: 'dark',
      color: 'daybreak',
      mode: 'side',
      fixedWidth: false,
      colorweak: false
    }
  };

  menu = [
    {
      title: '我的面板',
      icon: 'user',
      children: [
        {
          title: '个人中心',
          routerLink: '/account/center'
        },
        {
          title: '个人设置',
          routerLink: '/account/setting'
        }
      ]
    },
    {
      title: '我的面板',
      icon: 'user',
      children: [
        {
          title: '个人中心',
          routerLink: '/account/center'
        },
        {
          title: '个人设置',
          routerLink: '/account/setting'
        }
      ]
    },
    {
      title: '我的面板',
      icon: 'user',
      children: [
        {
          title: '个人中心',
          routerLink: '/account/center'
        },
        {
          title: '个人设置',
          routerLink: '/account/setting'
        }
      ]
    },
    {
      title: '系统设置',
      icon: 'setting',
      children: [
        { title: '角色管理', routerLink: '/system/role' },
        { title: '用户管理', routerLink: '/system/user' }
      ]
    },
    {
      title: '异常页面',
      icon: 'warning',
      children: [
        { title: '403', routerLink: '/exception/403' },
        { title: '404', routerLink: '/exception/404' },
        { title: '500', routerLink: '/exception/500' }
      ]
    },
    {
      title: '使用帮助',
      icon: 'question-circle',
      routerLink: '/page/help'
    }
  ];

  constructor(
    breakpointObserver: BreakpointObserver,
    router: Router,
    public user: UserService,
    private modal: NzModalService
  ) {
    breakpointObserver
      .observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe(result => {
        this.layout.siderMode = result.matches ? 'over' : 'side';
        this.layout.collapsed = result.matches;
      });

    router.events
      .pipe(filter(event => event instanceof ActivationStart))
      .subscribe(() => {
        if (this.layout.siderMode == 'over') {
          this.layout.collapsed = true;
        }
      });
  }
  ngOnInit() {}

  logout() {
    this.modal.confirm({
      nzTitle: '确定要退出登录吗？',
      nzMaskClosable: true,
      nzOnOk: () => this.user.logout()
    });
  }
  ngOnDestroy() {}
}
