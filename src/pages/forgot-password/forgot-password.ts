import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, App } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  constructor(private afAuth: AngularFireAuth, private alertCtrl: AlertController,
    private menu: MenuController, private app: App,
    public navCtrl: NavController, public navParams: NavParams
    ,private translate: TranslateService,private storage: Storage) {
      this.storage.get('lang').then((data)=>{
        this.translate.setDefaultLang(data);
        this.translate.use(data);
      });
      this.translate.setTranslation('en', {
        Title: 'Forgot your password ?',
        Text: 'Please enter your email address',
        Email: 'Email',
        Send: 'Send',
      });
      this.translate.setTranslation('th', {
        Title: 'ลืมรหัสผ่าน',
        Text: 'กรุณากรอกอีเมลที่ต้องการกู้คืนรหัสผ่าน',
        Email: 'อีเมลล์',
        Send: 'ส่ง',
       });
  }

  ngAfterViewInit(){
    this.menu.swipeEnable(false);
    this.app._setDisableScroll(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  forgotPassword(email) {
    var flag;
    this.storage.get('lang').then((data)=>{
      if(data=='en'){
        if(email==undefined || email=='') {
          this.showAlert('Please enter a valid email address.', 0);
         } else {
           this.afAuth.auth.sendPasswordResetEmail(email).then(function() {
             // Email sent.
             flag = 1;
           }, function(error) {
             flag = 0;
             console.error(error);
             // An error happened.
           }).then(() =>{
             if(flag==1){
              this.showAlert(`The email verification link has been sent to ${email}.`,1);
             }else{
              this.showAlert('Please enter a valid email address.', 0);
             }
           });
         }
      }else if(data=='th'){
        if(email==undefined || email=='') {
          this.showAlert('กรุณากรอกอีเมลให้ถูกต้อง', 0);
         } else {
           this.afAuth.auth.sendPasswordResetEmail(email).then(function() {
             // Email sent.
             flag = 1;
           }, function(error) {
             //this.showAlert('กรุณากรอกอีเมลให้ถูกต้อง', 0);
             flag = 0;
             console.error(error);
             // An error happened.
           }).then(() =>{
             if(flag==1){
                 this.showAlert(`ระบบได้ส่งลิงก์เปลี่ยนรหัสผ่านไปที่ ${email} เรียบร้อยแล้ว`,1)
             }else{
                 this.showAlert('กรุณากรอกอีเมลให้ถูกต้อง', 0);
             }
           });
         }
      }
    });
    
  }

  showAlert(_subTitle,_flag) {
    let alert = this.alertCtrl.create({
      subTitle: _subTitle,
      buttons: [
        {
          text: 'ตกลง',
          handler: () => {
          console.log('Agree clicked');
          if(_flag==1)
           this.navCtrl.setRoot('LoginPage');
          }
        }
      ]
    });
    alert.present();
  }

  // showAlert(_title, _subTitle) {
  //   let alert = this.alertCtrl.create({
  //     title: _title,
  //     subTitle: _subTitle,
  //     buttons: ['ตกลง']
  //   });
  //   alert.present();
  // }

}
