import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, App,
  LoadingController } from 'ionic-angular';
import { User } from "../../models/user";
import { AngularFireAuth } from "angularfire2/auth";
import { NativeStorage } from '@ionic-native/native-storage';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user = {} as User;
  var;
  constructor(private afAuth: AngularFireAuth, public alertCtrl: AlertController,
    private menu: MenuController, private app: App, private loadingCtrl: LoadingController,
    public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage
    ,private translate: TranslateService,private storage: Storage) {
      this.storage.get('lang').then((data)=>{
        this.translate.setDefaultLang(data);
      });
      translate.setTranslation('en', {
        Email: 'Email',
        Password: 'Password',
        Confirm: 'Confirm Password',
        Next: 'Next',
        Signup: 'Sign up'
     });
    translate.setTranslation('th', {
      Email: 'อีเมลล์',
      Password: 'รหัสผ่าน',
      Confirm: 'ยืนยันรหัสผ่าน',
      Next: 'ต่อไป',
      Signup: 'สมัครสมาชิก'
    });
    }

  ngAfterViewInit(){
    this.menu.swipeEnable(false);
    this.app._setDisableScroll(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  async register(user: User, rePassword) {
    //his.presentLoadingCircles();
    console.log(user.email);
    console.log(user.password);
    console.log(rePassword);

    
    this.storage.get('lang').then((data)=>{
      if(data=='en'){
        if(user.email==undefined||user.password==undefined||rePassword==undefined) {
      this.showAlert('Incomplete information','Please fill in all information.');
     }else if(user.email!=undefined && Object.keys(user.password).length>=6 && user.password==rePassword) {
 
       this.nativeStorage.setItem('user', {email: user.email, password: user.password})
         .then(
           () => {
             console.log('Stored item USER!');
             //this.navCtrl.setRoot('ProfilePage');
             this.navCtrl.push('ProfilePage');
         },
           error => console.error('Error storing item', error)
         );
 
     } else if(Object.keys(user.password).length>=6 && user.password!=rePassword) {
      this.showAlert('Password is incorrect','Please make sure your passwords match');
     } else if(Object.keys(user.password).length <6) {
      this.showAlert('Password is incorrect','Please enter a password that is longer than or equal to 6 characters.');
     }
      }else if(data=='th'){
        if(user.email==undefined||user.password==undefined||rePassword==undefined) {
         this.showAlert('ข้อมูลไม่ครบถ้วน','กรุณากรอกข้อมูลให้ครบทุกถ้วน');
     }else if(user.email!=undefined && Object.keys(user.password).length>=6 && user.password==rePassword) {
 
       this.nativeStorage.setItem('user', {email: user.email, password: user.password})
         .then(
           () => {
             console.log('Stored item USER!');
             //this.navCtrl.setRoot('ProfilePage');
             this.navCtrl.push('ProfilePage');
         },
           error => console.error('Error storing item', error)
         );
 
     } else if(Object.keys(user.password).length>=6 && user.password!=rePassword) {
      this.showAlert('รหัสผ่านไม่ถูกต้อง','กรุณากรอกรหัสผ่านให้ตรงกัน');
     } else if(Object.keys(user.password).length <6) {
      this.showAlert('รหัสผ่านไม่ถูกต้อง','กรุณากรอกรหัสผ่านที่มีความยาวมากกว่าหรือเท่ากับ 6 ตัวอักษร');
     }
      }
    });
   
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
      duration: 2000
    });

    loading.present();
  }

}
