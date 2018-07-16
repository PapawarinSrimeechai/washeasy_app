import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, App } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, FirebaseObjectObservable} from "angularfire2/database";
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the EmailVerificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-email-verification',
  templateUrl: 'email-verification.html',
})
export class EmailVerificationPage {

  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,
    private menu: MenuController, private app: App, private nativeStorage: NativeStorage,
    public navCtrl: NavController, public navParams: NavParams
    ,private translate: TranslateService,private storage: Storage) {
      this.storage.get('lang').then((data)=>{
        this.translate.setDefaultLang(data);
      });
    }


  ngAfterViewInit(){
    this.menu.swipeEnable(false);
    this.app._setDisableScroll(true);
  }

  private email: string;
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.nativeStorage.getItem('user')
        .then(
          user => {
            this.email = user.email;
            this.translate.setTranslation('en', {
              Text: 'The email verification link has been sent to '+this.email+', please confirm your email before login.',
           });
          this.translate.setTranslation('th', {
            Text: 'ระบบได้ส่งลิงก์ยืนยันอีเมลไปที่ '+this.email+' เรียบร้อยแล้ว กรุณายืนยันอีเมลที่ก่อนเข้าสู่ระบบ',
          });
          },
          error => console.error(error)
        );

    // this.afAuth.authState.take(1).subscribe(data => {
    //   if(data && data.email && data.uid) {
    //       this.email = data.email;
    //   } 
    // });
  }

  okay() {
    this.navCtrl.setRoot('LoginPage');
    //this.afAuth.auth.signOut().then(() => this.navCtrl.setRoot('LoginPage'));
  }
}
