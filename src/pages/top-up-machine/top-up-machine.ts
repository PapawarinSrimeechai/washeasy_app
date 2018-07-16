import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner";
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the TopUpMachinePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-top-up-machine',
  templateUrl: 'top-up-machine.html',
})
export class TopUpMachinePage {
  public getLang;
  constructor(private barcode: BarcodeScanner, public navCtrl: NavController, public navParams: NavParams,
    private afAuth : AngularFireAuth, private alertCtrl: AlertController, private msgService: MessageServiceProvider
    ,private translate: TranslateService,private storage: Storage) {
      this.storage.get('lang').then((data)=>{
        this.translate.setDefaultLang(data);
        this.translate.use(data);
      });
      this.translate.setTranslation('en', {
        title: 'Top up by coin machine',
        scan: 'Scan QR Code for coin',
      });
      this.translate.setTranslation('th', {
        title: 'เติมเงินผ่านกล่องหยอดเหรียญ',
        scan: 'สแกนเพื่อหยอดเหรียญ',
       });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TopUpMachinePage');
  }

  price = 20;

  scanBarcode() {
    try {
      this.afAuth.authState.take(1).subscribe(data => {
        this.barcode.scan().then((barcodeData) => {
            console.log(barcodeData);
            var tmp = String(barcodeData.text);
            var washingId = tmp.split(',',2);
            if(washingId[0]!=undefined && washingId[1]!=undefined) {
            //this.navCtrl.setRoot('TopUpMachine2Page',{token: data.uid, idWashing: washingId[0], idDorm: washingId[1]});
              this.showAlert(data.uid, washingId[0], washingId[1]);
            }
          
        }, (err) => {
          //this.navCtrl.setRoot('TopUpMachine2Page',{token: data.uid, idWashing: 'W4000200101', idDorm: 'D40002001'});
          this.showAlert(data.uid, 'W4000200101', 'D40002001');
        });
      });

    } catch (error) {
      console.error('scanBarcode ERROR: '+error);
    }
  }

  showAlert(_token, _idWashing, _idDorm) {
    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to top-up?',
      subTitle: '',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.msgService.topUpRequest({token: _token, idWashing: _idWashing, idDorm: _idDorm}).subscribe(data => {
              if(data.status==1){
                this.navCtrl.setRoot('TopUpMachine2Page',{token: _token, idWashing: _idWashing, idDorm: _idDorm});
              }else if(data.status==0){
                this.showError();
              }
            });
            console.log('ok clicked');
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }

  showError() {
      if(this.getLang=='en'){
        let alert = this.alertCtrl.create({
          title: 'Can not make transaction',
          subTitle: 'Please try again',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                console.log('ok clicked');
              }
            }
          ]
        });
        alert.present();
      }else if(this.getLang=='th'){
        let alert = this.alertCtrl.create({
          title: 'ไม่สามารถทำรายการได้',
          subTitle: 'กรุณาลองใหม่อีกครั้ง',
          buttons: [
            {
              text: 'ตกลง',
              handler: () => {
                console.log('ok clicked');
              }
            }
          ]
        });
        alert.present();
      }
  }

}
