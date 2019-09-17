import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SettingDrawerComponent } from './shared/setting-drawer/setting-drawer.component';
import { FullScreenComponent } from './shared/header/components/fullscreen.component';
import { I18nComponent } from './shared/header/components/i18n.component';
import { StorageComponent } from './shared/header/components/storage.component';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { NoticePopoverComponent } from './shared/notice-popover/notice-popover.component';

const ADMIN_LAYOUT = [
  AdminLayoutComponent,
  SidebarComponent,
  HeaderComponent,
  FooterComponent,
  SettingDrawerComponent,
  FullScreenComponent,
  I18nComponent,
  StorageComponent,
  LayoutComponent,
  NoticePopoverComponent
];

const DEFAULT_LAYOUT = [DefaultLayoutComponent];

@NgModule({
  imports: [SharedModule],
  declarations: [AuthLayoutComponent, ...ADMIN_LAYOUT, ...DEFAULT_LAYOUT],
  exports: [AuthLayoutComponent, ...ADMIN_LAYOUT, ...DEFAULT_LAYOUT]
})
export class LayoutsModule {}
