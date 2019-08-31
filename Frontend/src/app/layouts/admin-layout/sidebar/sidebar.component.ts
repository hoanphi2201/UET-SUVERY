import { Component, OnInit, Input } from '@angular/core';
import { SettingDrawerService } from '@app/shared';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() isCollapsed: boolean;
  sideNavDark: boolean;
  constructor(private settingDrawerService: SettingDrawerService) {}

  ngOnInit() {
    this.settingDrawerService.getSideNavDark().subscribe(res => {
      this.sideNavDark = res;
    });
  }
}
