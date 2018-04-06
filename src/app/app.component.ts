import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from "angularfire2/auth";
import { NativeStorage } from '@ionic-native/native-storage';
import { HomePage } from '../pages/home/home';
import { TopUpPage } from '../pages/top-up/top-up';
import { ProfileEditPage } from '../pages/profile-edit/profile-edit';
import { HistoryPage } from '../pages/history/history';
import { FCM } from '@ionic-native/fcm';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2/database";
import { MessageServiceProvider } from '../providers/message-service/message-service';


@Component({
  selector: 'app-page',
  templateUrl: 'app.html'

})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  //rootPage: any = HomePage;
  //rootPage: any = 'LoginPage';

  pages: Array<{title: string, icon: string, component: any}>;

  tokenFB: FirebaseListObservable<any>;
  token = {} as{
    token: string;
    fcmToken: string;
  }

  constructor(private afAuth: AngularFireAuth, private loadingCtrl: LoadingController, private alertCtrl: AlertController,
    public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private nativeStorage: NativeStorage,
    private fcm: FCM ,private geolocation: Geolocation, private afDatabase: AngularFireDatabase,
    private msgService: MessageServiceProvider) {
    

        this.afAuth.authState.take(1).subscribe(FBdata => {
          if(FBdata && FBdata.email && FBdata.uid) {
            try{
              this.fcm.getToken().then(token=>{
                this.token.token = FBdata.uid;
                this.token.fcmToken = token;
                this.msgService.updateFcmToken(this.token).subscribe(resp=> {
                console.log(resp)
                  if (resp.status=='0') {
                    this.nav.setRoot('LoginPage');
                  }else{
                    this.nav.setRoot('HomePage');
                  }
                });
              });
            }catch(e){
              this.nav.setRoot('LoginPage');
            }
             //this.nav.setRoot('HomePage');
          }else{
            this.nav.setRoot('LoginPage');
          } 
        });
        


      try {
        this.geolocation.getCurrentPosition().then((resp) => {
          console.log('lat: '+resp.coords.latitude);
        }).catch((error) => {
          console.log('Error getting location', error);
        });
      } catch (error) {
        console.error('getCurrentPosition ERROR: '+error);
      }

       
    this.initializeApp();

    //used for an example of ngFor and navigation
    this.pages = [
      { title: 'หน้าหลัก', icon: 'ios-home' , component: HomePage },
      { title: 'เติมเงิน',  icon: 'ios-card' , component: TopUpPage },
      { title: 'ประวัติ', icon: 'ios-list-box' , component: HistoryPage },
      { title: 'ข้อมูลส่วนตัว',  icon: 'ios-contact' , component: ProfileEditPage },
     //{ title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(true)
      this.statusBar.backgroundColorByHexString('#0091EA');
      // this.platform.registerBackButtonAction(() => {
      //   // Disble HW back button
      // });

      this.splashScreen.hide();

    });
  }


  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.title == 'หน้าหลัก'){
      //this.presentLoadingCircles();
      this.nav.setRoot(page.component);
    }else{
      this.nav.push(page.component);
    }
    
    // this.nav.setRoot(page);
  }

  logout() {
    this.afAuth.auth.signOut().then(() => this.nav.setRoot('LoginPage'));
  }

  presentLoadingCircles() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'กรุณารอสักครู่',
      duration: 2000
    });

    loading.present();
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'ต้องการออกจากระบบหรือไม่?',
      //subTitle: '_subTitle',
      buttons:[
        {
          text: 'ตกลง',
          handler: () => {
            this.presentLoadingCircles();
            console.log('OK clicked');
            this.logout();
          }
        },
        {
          text: 'ยกเลิก',
          handler: () => {
            console.log('cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }


}
