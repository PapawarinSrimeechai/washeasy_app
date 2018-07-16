import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, App, AlertController, LoadingController } from 'ionic-angular';
import { User } from "../../models/user";
import { NativeStorage } from '@ionic-native/native-storage';
import { AngularFireAuth } from "angularfire2/auth";
import { FCM } from '@ionic-native/fcm';
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;

  token = {} as{
    token: string;
    fcmToken: string;
  }

  constructor(private afAuth : AngularFireAuth, private menu: MenuController, private app: App,  private alertCtrl: AlertController,
    private loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage,
    private fcm: FCM , private msgService: MessageServiceProvider,private translate: TranslateService
    ,private storage: Storage) {
    console.log(this.translate);
     translate.setTranslation('en', {
        HELLO: 'hello hoo hey',
        Email: 'Email',
        Password: 'Password',
        Signin: 'Sign in',
        Forgot: 'Forgot your password ?',
        Signup: 'Sign up',
    });
    translate.setTranslation('th', {
      HELLO: 'สวัสดีจ้า',
      Email: 'อีเมลล์',
      Password: 'รหัสผ่าน',
      Signin: 'เข้าสู่ระบบ',
        Forgot: 'ลืมหรัสผ่าน ?',
        Signup: 'สมัครสมาชิก',
  });
    translate.setDefaultLang('th');
    this.storage.set('lang','th');
      //this.menu.swipeEnable(false);
      //this.app._setDisableScroll(true);
  }
  
  ngAfterViewInit(){
    this.menu.swipeEnable(false);
    this.app._setDisableScroll(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    
  }
  switchLanguage(language: string) {
    this.translate.use(language);
    this.storage.get('lang').then((data)=>{
      if(data != null || data != undefined){
        this.storage.remove('lang');
        this.storage.set('lang',language);
      }else{
        this.storage.set('lang',language);
      }
    });
  }

  async login(user: User) {
    try{
      this.presentLoadingCircles();
      const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      console.log(result);
        if(result.emailVerified==true) {
            // crerate token section
          this.fcm.getToken().then(token=>{
            this.afAuth.authState.take(1).subscribe(data => {
              this.token.token = data.uid;
              this.token.fcmToken = token;
              this.msgService.updateFcmToken(this.token).subscribe(resp=> {
              console.log(resp)
                if (resp.status=='0') {
                  this.storage.get('lang').then((value)=>{
                    if(value=='en'){
                      this.showAlert('Please try again','Email or password is incorrect.');
                    }else if(value=='th'){
                      this.showAlert('ไม่สามารถทำรายการได้','กรุณาลองใหม่อีกครั้ง');
                    }
                  });
                }else{
                  this.navCtrl.setRoot('HomePage');
                }
              });
            });
          });
          
       // this.navCtrl.setRoot('HomePage');
        
        } else { //logout
          this.storage.get('lang').then((data)=>{
            if(data=='en'){
              this.showAlert('Verify email address','Your email address must be verified before you can sign in.');
            }else if(data=='th'){
              this.showAlert('ท่านยังไม่ยืนยันอีเมล','กรุณายืนยันรหัสผ่านก่อนเข้าสู่ระบบ');
            }
          });
           
          this.afAuth.auth.signOut();
        }
    } catch(e) {
      this.storage.get('lang').then((data)=>{
        if(data=='en'){
          this.showAlert('Please try again','Email or password is incorrect.');
        }else if(data=='th'){
          this.showAlert('ไม่สามารถทำรายการได้','กรุณาลองใหม่อีกครั้ง');
        }
      });
      console.error(e);
    }
    
  }

  register() {
    this.navCtrl.push('RegisterPage');
  }

  forgotPassword(){
    this.navCtrl.push('ForgotPasswordPage');
  }

  showAlert(_title, _subTitle) {
    let alert = this.alertCtrl.create({
      title: _title,
      subTitle: _subTitle,
      buttons: ['ตกลง']
    });
    alert.present();
  }

  presentLoadingCircles() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait',
      duration: 3000
    });
    //content: 'กรุณารอสักครู่',
    loading.present();
  }

}
