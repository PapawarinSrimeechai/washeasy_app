import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { TopUpPage } from '../pages/top-up/top-up';
import { HistoryPage } from '../pages/history/history';
import { ProfileEditPage } from '../pages/profile-edit/profile-edit';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from "angularfire2/database";

import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { LocalNotifications } from '@ionic-native/local-notifications';
import { MessageServiceProvider } from '../providers/message-service/message-service';
import { Geolocation } from '@ionic-native/geolocation';
import { FCM } from '@ionic-native/fcm';
import { NativeStorage } from '@ionic-native/native-storage';


import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule } from '@ionic/storage';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    MyApp,
    TopUpPage,
    ProfileEditPage,
    HistoryPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpModule,
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
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TopUpPage,
    ProfileEditPage,
    HistoryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BarcodeScanner,
    LocalNotifications,
    MessageServiceProvider,
    Geolocation,
    FCM, 
    NativeStorage,
  ]
})
export class AppModule {}
