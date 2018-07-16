import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, App,LoadingController } from 'ionic-angular';
import { Profile } from "../../models/profile";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { NativeStorage } from '@ionic-native/native-storage';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  profile ={} as Profile;

  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, private alertCtrl: AlertController,
    private menu: MenuController, private app: App, private msgService: MessageServiceProvider, private loadingCtrl: LoadingController,
    public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage
    ,private translate: TranslateService,private storage: Storage) {
      this.storage.get('lang').then((data)=>{
        this.translate.setDefaultLang(data);
        this.translate.use(data);
      });
      this.translate.setTranslation('en', {
        Fname: 'First name',
        Lname: 'Last name',
        TextWitem: 'Washer items not found',
        Phone: 'Phone number',
        SSN: 'Identification Number/Passport',
        Signup: 'Sign up',
      });
      this.translate.setTranslation('th', {
        Fname: 'ชื่อ',
        Lname: 'นามสกุล',
        TextWitem: 'ไม่พบรายการซักผ้า',
        Phone: 'หมายเลขโทรศัพท์',
        SSN: 'รหัสบัตรประจำตัวประชาชน',
        Signup: 'สมัครสมาชิก',
       });
  }

  ngAfterViewInit(){
    this.menu.swipeEnable(false);
    this.app._setDisableScroll(true);
  }

  createProfile(profile: Profile) {

      this.presentLoadingCircles();
      this.storage.get('lang').then((data)=>{
        if(data=='en'){ 
          if(profile.uFname==null||profile.uLname==null||profile.phoneNo==null||profile.SSN==null) {
            this.showAlert('Incomplete information','Please fill in all information.');
        } else if (Object.keys(profile.phoneNo).length!=10) {
            this.showAlert('Invalid phone number','Please enter a valid phone number.');
        } else if (Object.keys(profile.SSN).length!=13) {
          this.showAlert('Invalid ID card/Passport','Please enter a ID card/Passport.');
        } else if(profile.uFname!=null&&profile.uLname!=null&&Object.keys(profile.phoneNo).length==10&&Object.keys(profile.SSN).length==13) {
          profile.uPoint = 0;
          profile.cash = 0;
  
          this.nativeStorage.getItem('user')
            .then(
              user => {
                this.register(user);
              },
              error => console.error(error)
            );
        }
        }else if(data=='th'){ 
          if(profile.uFname==null||profile.uLname==null||profile.phoneNo==null||profile.SSN==null) {
          this.showAlert('ข้อมูลไม่ครบถ้วน','กรุณากรอกข้อมูลให้ครบทุกถ้วน');
        } else if (Object.keys(profile.phoneNo).length!=10) {
          this.showAlert('หมายเลขโทรศัพท์ไม่ถูกต้อง','กรุณากรอกหมายเลขโทรศัพท์ให้ถูกต้อง');
        } else if (Object.keys(profile.SSN).length!=13) {
        this.showAlert('รหัสบัตรประจำตัวประชาชนไม่ถูกต้อง','กรุณากรอกรหัสบัตรประจำตัวประชาชนให้ถูกต้อง');
        } else if(profile.uFname!=null&&profile.uLname!=null&&Object.keys(profile.phoneNo).length==10&&Object.keys(profile.SSN).length==13) {
          profile.uPoint = 0;
          profile.cash = 0;
  
          this.nativeStorage.getItem('user')
            .then(
              user => {
                this.register(user);
              },
              error => console.error(error)
            );
        }
        }
      });
    

  }

  async register(user){

    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
      console.log('register success');

        const result_login = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
          // try{
            this.afAuth.authState.take(1).subscribe(data => {
            
              if(data && data.email && data.uid) {
                this.profile.token = data.uid;
                this.profile.uEmail = data.email;
      
                // Reguster API
                
                this.msgService.register(this.profile).subscribe(resp=> {
                  console.log(resp)
                  if (resp.status=='0') {
                    this.storage.get('lang').then((data)=>{
                      if(data=='en'){
                        this.showAlert('Please try again','Email or password is incorrect.');
                      }else if(data=='th'){
                        this.showAlert('ไม่สามมารถทำรายการได้','กรุณาลองใหม่อีกครั้ง');
                      }
                    });
                  }
                });
      
                const user_f = this.afAuth.auth.currentUser;
                  user_f.sendEmailVerification().then(function() {
                    // Email sent.
                    console.log('Email was send');
                  }).catch(function(error) {       
                    console.error(error);
                    // An error happened.
                  }).then(() => {
                    this.afAuth.auth.signOut().then(() => this.navCtrl.setRoot('EmailVerificationPage'));
                  }); 
              }
              
            });

          // } catch(e) {
          //     console.error(e);
          // }
    } catch (e) {
      this.storage.get('lang').then((data)=>{
        if(data=='en'){
          this.showAlert('Email is incorrect','Please enter a valid email address.');
        }else if(data=='th'){
          this.showAlert('อีเมลไม่ถูกต้อง','กรุณากรอกอีเมลให้ถูกต้อง');
        }
      });
      console.error('register error');
      console.error(e);
    }
  }

  showAlert(_title, _subTitle) {
    let alert = this.alertCtrl.create({
      title: _title,
      subTitle: _subTitle,
      buttons: ['ตกลง']
    });
    alert.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  presentLoadingCircles() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Please wait',
      duration: 4000
    });

    loading.present();
  }

}
