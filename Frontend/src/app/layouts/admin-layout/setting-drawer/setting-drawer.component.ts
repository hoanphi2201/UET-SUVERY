import { Component, OnInit } from '@angular/core';
import { SettingDrawerService } from '@app/shared';

@Component({
  selector: 'app-setting-drawer',
  templateUrl: './setting-drawer.component.html',
  styleUrls: ['./setting-drawer.component.scss']
})
export class SettingDrawerComponent implements OnInit {
  DEFAULT_COLORS: string[] = ['white', 'primary', 'success', 'secondary', 'danger'];
  visible: boolean;
  headerColor: string;
  sideNavDark: boolean;
  foldedMenu: boolean;
  constructor(private settingDrawerService: SettingDrawerService) {}
  ngOnInit() {
    this.settingDrawerService.getVisible().subscribe(res => {
      this.visible = res;
    });
    this.settingDrawerService.getHeaderColor().subscribe(res => {
      this.headerColor = res;
    });
    this.settingDrawerService.getSideNavDark().subscribe(res => {
      this.sideNavDark = res;
    });
    this.settingDrawerService.getFoldedMenu().subscribe(res => {
      this.foldedMenu = res;
    });
  }
  closeThemeConfig() {
    this.settingDrawerService.setVisible(false);
  }
  changeHeaderColor(color: string) {
    this.settingDrawerService.setHeaderColor(color);
  }
  changeSideNavDark(value: boolean) {
    this.settingDrawerService.setSideNavDark(value);
  }
  changeFoldedMenu(value: boolean) {
    this.settingDrawerService.setFoldedMenu(value);
  }
}
