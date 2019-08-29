import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { NgModule } from '@angular/core';
import { HeaderComponent } from './admin-layout/header/header.component';
import { HeaderSearchComponent } from './admin-layout/header/components/search.component';
import { HeaderNotifyComponent } from './admin-layout/header/components/notify.component';
import { HeaderTaskComponent } from './admin-layout/header/components/task.component';
import { HeaderIconComponent } from './admin-layout/header/components/icon.component';
import { HeaderFullScreenComponent } from './admin-layout/header/components/fullscreen.component';
import { HeaderI18nComponent } from './admin-layout/header/components/i18n.component';
import { HeaderStorageComponent } from './admin-layout/header/components/storage.component';
import { HeaderUserComponent } from './admin-layout/header/components/user.component';
import { SharedModule } from '@app/shared';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { SidebarComponent } from './admin-layout/sidebar/sidebar.component';
import { SettingDrawerItemComponent } from './admin-layout/setting-drawer/setting-drawer-item.component';
import { SettingDrawerComponent } from './admin-layout/setting-drawer/setting-drawer.component';

const SETTINGDRAWER = [SettingDrawerComponent, SettingDrawerItemComponent];
const COMPONENTS = [
  HeaderComponent, 
  AdminLayoutComponent,
  AuthLayoutComponent,
  SidebarComponent,
  ...SETTINGDRAWER
];

const HEADERCOMPONENTS = [
  HeaderSearchComponent,
  HeaderNotifyComponent,
  HeaderTaskComponent,
  HeaderIconComponent,
  HeaderFullScreenComponent,
  HeaderI18nComponent,
  HeaderStorageComponent,
  HeaderUserComponent
];

@NgModule({
  imports: [SharedModule],
  entryComponents: SETTINGDRAWER,
  declarations: [...COMPONENTS, ...HEADERCOMPONENTS],
  exports: [...COMPONENTS]
})
export class LayoutModule {}
