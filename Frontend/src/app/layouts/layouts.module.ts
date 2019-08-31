import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { SidebarComponent } from './admin-layout/sidebar/sidebar.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { HeaderComponent } from './admin-layout/header/header.component';
import { FooterComponent } from './admin-layout/footer/footer.component';
import { SettingDrawerComponent } from './admin-layout/setting-drawer/setting-drawer.component';
import { FullScreenComponent } from './admin-layout/header/components/fullscreen.component';
import { I18nComponent } from './admin-layout/header/components/i18n.component';
import { StorageComponent } from './admin-layout/header/components/storage.component';

const ADMIN_LAYOUT = [
  AdminLayoutComponent,
  SidebarComponent,
  HeaderComponent,
  FooterComponent,
  SettingDrawerComponent,
  FullScreenComponent,
  I18nComponent,
  StorageComponent
];

@NgModule({
  imports: [SharedModule],
  declarations: [AuthLayoutComponent, ...ADMIN_LAYOUT],
  exports: [AuthLayoutComponent, ...ADMIN_LAYOUT]
})
export class LayoutsModule {}
