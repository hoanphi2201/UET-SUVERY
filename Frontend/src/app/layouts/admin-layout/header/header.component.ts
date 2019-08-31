import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SettingDrawerService } from '@app/shared';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() collapsedDesktopEvent = new EventEmitter<boolean>();
  @Output() collapsedMobileEvent = new EventEmitter<boolean>();
  isCollapsedDesktop = false;
  isCollapsedMobile = false;

  constructor(private settingDrawerService: SettingDrawerService) {}

  ngOnInit() {
    this.settingDrawerService.getFoldedMenu().subscribe(res => {
      this.isCollapsedDesktop = res;
      this.collapsedDesktopEvent.emit(this.isCollapsedDesktop);
    });
  }
  toggleCollapsedDesktop() {
    this.isCollapsedDesktop = !this.isCollapsedDesktop;
    this.collapsedDesktopEvent.emit(this.isCollapsedDesktop);
  }

  toggleCollapsedMobile() {
    this.isCollapsedMobile = !this.isCollapsedMobile;
    this.collapsedMobileEvent.emit(this.isCollapsedMobile);
  }

  openThemeConfig(): void {
    this.settingDrawerService.setVisible(true);
  }
}
