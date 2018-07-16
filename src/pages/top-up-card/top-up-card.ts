import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, MenuController, App  } from 'ionic-angular';

import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2/database";
import { Profile } from "../../models/profile";
import { TopUpCard } from "../../models/topUpCard";
import { LocalNotifications } from '@ionic-native/local-notifications';
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { NativeStorage } from '@ionic-native/native-storage';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the TopUpCardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-top-up-card',
  templateUrl: 'top-up-card.html',
})
export class TopUpCardPage {

  topUpItemRef$: FirebaseObjectObservable<TopUpCard>;
  topUpItem = {} as TopUpCard;
  profileDataRef$: FirebaseObjectObservable<Profile>;
  profileData = {} as Profile;
  topUpID: number;
  getLang;
  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase, private localNotifications: LocalNotifications,
    private alertCtrl: AlertController, private msgService: MessageServiceProvider, private loadingCtrl: LoadingController,
    public navCtrl: NavController, public navParams: NavParams, private menu: MenuController, private app: App,private nativeStorage: NativeStorage
    ,private translate: TranslateService,private storage: Storage) {
      this.storage.get('lang').then((data)=>{
        this.translate.setDefaultLang(data);
        this.translate.use(data);
      });
      this.translate.setTranslation('en', {
        title: 'Top up by card',
        code: 'Card code',
        topup: 'top-up',
      });
      this.translate.setTranslation('th', {
        title: 'เติมเงินผ่านบัตร',
        code: 'รหัสบัตรเติมเงิน',
        topup: 'เติมเงิน',
       });
  }

  ngAfterViewInit(){
    this.menu.swipeEnable(false);
    this.app._setDisableScroll(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TopUpPage');
  }
  
  topUpData = {} as {
    idTopUpCard: string;
    token: string;
  }

  topUp(topUpID) {
    this.presentLoadingCircles();
    this.afAuth.authState.take(1).subscribe(data => {
      if(data && data.email && data.uid) {
        
        this.topUpData.token = data.uid;
        this.topUpData.idTopUpCard = topUpID
        var timeStamp = new Date().getTime();
          this.msgService.topUp(this.topUpData).subscribe(resp=>{
            console.log(resp.error);
            this.storage.get('lang').then((data)=>{
              if(data=='en'){
                if (resp.status == '1') {
                   this.showAlert('Top up success', `Transaction code: ${resp.data.idHistory} \n : ${resp.data.price} bath`);
                } else if (resp.status == '01') {
                   this.showAlert('Please try again', 'Invalid card code.');
                 } else if (resp.status == '02') {
                  this.showAlert('Please try again', 'Can not make transaction.');
                 } else {
                   this.showAlert('Please try again', 'Can not make transaction.');
                 }
              }else if(data=='th'){
                if (resp.status == '1') {
                  this.showAlert('เติมเงินสำเร็จ', `รหัสการทำรายการ: ${resp.data.idHistory} \n จำนวน: ${resp.data.price} บาท`);
                } else if (resp.status == '01') {
                  this.showAlert('ไม่สามารถทำรายการได้', 'รหัสบัตรเติมเงินไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
                 } else if (resp.status == '02') {
                  this.showAlert('ไม่สามารถทำรายการได้', 'กรุณาลองใหม่อีกครั้ง');
                 } else {
                  this.showAlert('ไม่สามารถทำรายการได้', 'กรุณาลองใหม่อีกครั้ง');
                 }
              }
            });
          });
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
      duration: 1000
    });

    loading.present();
  }

}
