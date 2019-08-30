import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';
@NgModule({
  imports: [SharedModule, AuthRoutingModule],
  declarations: [LoginComponent]
})
export class AuthModule {}
