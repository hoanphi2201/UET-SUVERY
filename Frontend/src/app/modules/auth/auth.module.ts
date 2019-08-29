import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [AuthRoutingModule, SharedModule],
  declarations: [LoginComponent]
})
export class AuthModule {}
