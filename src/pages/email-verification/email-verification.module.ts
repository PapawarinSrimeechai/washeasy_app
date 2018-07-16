import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmailVerificationPage } from './email-verification';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule } from '@ionic/storage';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    EmailVerificationPage,
  ],
  imports: [
    IonicPageModule.forChild(EmailVerificationPage),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot()
  ],
})
export class EmailVerificationPageModule {}
