import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import { UserHistoryLaundry } from "../../models/userHistoryLaundry";
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the HistoryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {

  userHistory ={} as UserHistoryLaundry[];
  cash: number;
  historyLaundry = [];
  historyTopup = [];
  historyBooking= [];
  segment = 'topUp';
  getLang ;
  constructor(private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,
    private msgService: MessageServiceProvider,
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
    console.log('ionViewDidLoad HistoryPage');
    this.translate.setTranslation('en', {
      Title: 'History',
      Balance: 'Balance',
      TU: 'Top-Up',
      LD: 'Laundry',
      BK: 'Booking',
      Reference: 'Reference number:',
      THB: 'THB',
    });
    this.translate.setTranslation('th', {
      Title: 'ประวัติ',
      Balance: 'ยอดเงินคงเหลือ',
      TU: 'เติมเงิน',
      LD: 'ซักผ้า',
      BK: 'จองเครื่อง',
      Reference: 'รหัสอ้างอิง:',
      THB: 'บาท',
     });
    this.afAuth.authState.take(1).subscribe(data => {
      if(data && data.email && data.uid) {
          this.msgService.getProfile({token: data.uid}).subscribe(resp=>{
            console.log(resp);
            this.cash = resp.profile.cash;
          });
          this.msgService.getHistoryLaundry({token: data.uid}).subscribe(resp=>{
            this.historyLaundry = resp.history;
          });
          this.msgService.getHistoryTopup({token: data.uid}).subscribe(resp=>{
            this.historyTopup = resp.history;
          });
          this.msgService.getHistoryBooking({token: data.uid}).subscribe(resp=>{
            this.historyBooking = resp.bookings;
          });
      }
    });
  }

}
