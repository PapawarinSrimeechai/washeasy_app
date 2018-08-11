import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TopUpPromptpayPage } from './top-up-promptpay';
import { AndroidPermissions} from '@ionic-native/android-permissions';

@NgModule({
  declarations: [
    TopUpPromptpayPage,
  ],
  imports: [
    IonicPageModule.forChild(TopUpPromptpayPage),
  ],
  providers: [
    AndroidPermissions
  ],
})
export class TopUpPromptpayPageModule {}
