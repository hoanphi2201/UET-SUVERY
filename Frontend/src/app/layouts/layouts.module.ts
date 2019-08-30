import { DashboardComponent } from './../modules/dashboard/pages/dashboard.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { SidebarComponent } from './admin-layout/sidebar/sidebar.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { HeaderComponent } from './admin-layout/header/header.component';
import { FooterComponent } from './admin-layout/footer/footer.component';

@NgModule({
  imports: [SharedModule],
  declarations: [AuthLayoutComponent, AdminLayoutComponent, SidebarComponent, HeaderComponent, FooterComponent],
  exports: [AuthLayoutComponent, AdminLayoutComponent, SidebarComponent, HeaderComponent, FooterComponent]
})
export class LayoutsModule {}
