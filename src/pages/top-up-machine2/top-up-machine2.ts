import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Token } from '@angular/compiler';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2/database";
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the TopUpMachine2Page page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-top-up-machine2',
  templateUrl: 'top-up-machine2.html',
})
export class TopUpMachine2Page {

  topUpData = {} as {
    token: string;
    idWashing: string;
    idDorm: string;
  }
  topUpData_$: FirebaseObjectObservable<any>;
  topUpBalance = 0 as number;
  topUpStatus = 1 as number;
  flagTimeout = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afDatabase: AngularFireDatabase,
    private msgService: MessageServiceProvider, private alertCtrl: AlertController
    ,private translate: TranslateService,private storage: Storage) {
      this.storage.get('lang').then((data)=>{
        this.translate.setDefaultLang(data);
        this.translate.use(data);
      });
      this.translate.setTranslation('en', {
        title: 'Top up by coin machine',
        thb: 'THB',
        cancel:'Cancel',
        ok:'OK',
      });
      this.translate.setTranslation('th', {
        title: 'เติมเงินผ่านกล่องหยอดเหรียญ',
        thb: 'บาท',
        cancel:'ยกเลิก',
        ok:'ตกลง',
       });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TopUpMachine2Page');
    this.topUpData.token = this.navParams.get('token');
    this.topUpData.idWashing = this.navParams.get('idWashing');
    this.topUpData.idDorm = this.navParams.get('idDorm');
    console.log(this.topUpData);
    this.topUpData_$ = this.afDatabase.object(`washingMachine/${this.topUpData.idDorm}/machine/${this.topUpData.idWashing}/topUp`);
      this.topUpData_$.subscribe(data=>{
          this.topUpBalance = data.topUpBalance;
          this.topUpStatus = data.topUpStatus;      
      });
      this.checkTimeout();
    
  }

  async checkTimeout(){
    if(this.flagTimeout=true){
      this.flagTimeout=false;
       setTimeout(() => {
        if(this.topUpBalance==0 && this.topUpStatus==1){
          this.msgService.topUpByBox(this.topUpData).subscribe(data=>{
            console.log(data);
            if(data.status==2){
             
            }
          });
          this.storage.get('lang').then((data)=>{
            if(data=='en'){
              this.showError2('Can not make transaction','Please coin within 10 seconds.');
            }else if(data=='th'){
              this.showError2('ไม่สามารถทำรายการได้','กรุณาหยอดเหรียญภายใน 10 วินาที');
            }
          });
        }
      }, 10000);
    } 
  }

  cancelTopUp(){
    this.msgService.topUpByBox(this.topUpData).subscribe(data=>{
      console.log(data);
      if(data.status==2){
       this.navCtrl.setRoot('HomePage');
      }else{
        this.navCtrl.setRoot('HomePage');
      }
    });
  }

  confirmTopUp(){
    this.msgService.topUpByBox(this.topUpData).subscribe(data=>{
      console.log(data);
      this.storage.get('lang').then(value=>{
        if(value=='en'){
          if(data.status==1){
             this.showError('Top up success',`Transaction code: ${data.message.timestamp} \n :  ${data.message.priceByBox} THB`);
           }else if(data.status==0){
             this.showError('Error','Please contact the service provider for a refund.');
           }
        }else if(value=='th'){
          if(data.status==1){
            this.showError('เติมเงินสำเร็จ',`เลขที่อ้างอิง: ${data.message.timestamp} \nจำนวนเงิน:  ${data.message.priceByBox}`);
           }else if(data.status==0){
            this.showError('เกิดข้อผิดพลาด','กรุณาติดต่อผู้ให้บริการเพื่อรับเงินคืน');
           }
        }
      });
    });
  }

  showError(_title, _subTitle) {
    this.storage.get('lang').then((data)=>{
      if(data=='en'){
        let alert = this.alertCtrl.create({
          title: _title,
          subTitle: _subTitle,
          buttons: [
            {
              text: 'OK',
              handler: () => {
                console.log('ok clicked');
                this.navCtrl.setRoot('HomePage');
              }
            }
          ]
        });
        alert.present();
      }else if(data=='th'){
        let alert = this.alertCtrl.create({
        title: _title,
        subTitle: _subTitle,
        buttons: [
          {
            text: 'ตกลง',
            handler: () => {
              console.log('ok clicked');
              this.navCtrl.setRoot('HomePage');
            }
          }
        ]
      });
      alert.present();
      }
    });
  }

  showError2(_title, _subTitle) {
    this.storage.get('lang').then((data)=>{
      if(data=='en'){
        let alert = this.alertCtrl.create({
          title: _title,
          subTitle: _subTitle,
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.navCtrl.setRoot('HomePage');
              }
            }
          ]
        });
        alert.present();
      }else if(data=='th'){
        let alert = this.alertCtrl.create({
          title: _title,
          subTitle: _subTitle,
          buttons: [
            {
              text: 'ตกลง',
              handler: () => {
                this.navCtrl.setRoot('HomePage');
              }
            }
          ]
        });
        alert.present();
      }
    });
  
  }

}
