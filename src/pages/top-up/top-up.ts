import { Component,EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the TopUpPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-top-up',
  templateUrl: 'top-up.html',
})
export class TopUpPage {
  public onLangChange: EventEmitter<any> = new EventEmitter();
  public onTranslationChange: EventEmitter<any> = new EventEmitter(); 
  public onDefaultLangChange: EventEmitter<any> = new EventEmitter();
  constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController,
    public navCtrl: NavController, public navParams: NavParams
    ,private translate: TranslateService,private storage: Storage) {
      this.ionViewDidLoad();
      try{
        this.storage.get('lang').then((data)=>{
          this.translate.setDefaultLang(data);
          this.translate.use(data);
          console.log(data);
        });
      }catch(e){
        console.error('Error : '+e);
      }
       console.log(this.translate);
  }

  ionViewDidLoad() {
    this.presentLoadingCircles();
    console.log('ionViewDidLoad TopUpPage');
      this.translate.setTranslation('en', {
        card: 'By card',
        coin: 'By coin machine',
      });
      this.translate.setTranslation('th', {
        card: 'เติมเงินผ่านบัตร',
        coin: 'เติมเงินผ่านกล่องหยอดเหรียญ',
       });
  }
  
  topUpCard() {
    this.navCtrl.push('TopUpCardPage');
  }

  topUpMachine() {
    this.navCtrl.push('TopUpMachinePage');
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
