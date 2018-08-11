import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, List  } from 'ionic-angular';

import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { AngularFireAuth } from "angularfire2/auth";
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the CouponPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-coupon',
  templateUrl: 'coupon.html',
})
export class CouponPage {

  dataObj ;
  couponsList ;
  data = {} as {
    token: string;
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController
    , private msgService: MessageServiceProvider,private loadingCtrl: LoadingController,private translate: TranslateService
    ,private storage: Storage,private afAuth: AngularFireAuth) {
      this.storage.get('lang').then((data)=>{
        this.translate.setDefaultLang(data);
        this.translate.use(data);
      });
  
      this.translate.setTranslation('en', {
        coupon : 'Coupon',
      });
  
      this.translate.setTranslation('th', {
        coupon : 'คูปอง',
      });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CouponPage');
    this.presentLoadingCircles() 
    this.afAuth.authState.take(1).subscribe(data => {
      if(data && data.email && data.uid) {
        this.data.token = data.uid;
        this.msgService.getCoupon(this.data).subscribe(resp=>{
          this.getCoupon(data);
        })
      } 
     });
  }  

  homePage(){
    this.navCtrl.setRoot('HomePage');
  }

  async getCoupon(data){
    this.msgService.getCoupon(this.data).subscribe(data=>{
      this.dataObj = data.list;
      console.log("couponslist",this.dataObj);
      for (let i in this.dataObj){
        console.log(this.dataObj[i]);
      }
    },
    err => console.error(err), 
    () => console.log('SUCCESS') 
    );
  }

    // console.log("response",resp.list);
    // this.couponslist = resp.list;
    // console.log(this.couponslist[1].couponType);
    // this.getCouponList();

  // getCouponList(){
  //     for (let i in this.dataObj){
  //       if (this.dataObj[i].couponType == "A"){
  //         this.couponsList.push(couponID: this.dataObj[i].couponID)
  //       }
  //       else if (this.dataObj[i].couponType == "B"){

  //       }
  //       else if (this.dataObj[i].couponType == "C"){

  //       }
  //       else{

  //       }

  //     }
  // }

  itemSelected(coupon){
    console.log("Clicked")
    let alert = this.alertCtrl.create({
      title: 'Coming Soon!',
      subTitle: 'This feature is not finished yet.',
      buttons: ['OK']
    });
    alert.present();
  }





////////////////////////////////

doRefresh(refresher) {
  console.log('DOREFRESH', refresher);

    this.ionViewDidLoad();

    setTimeout(() => {
      refresher.complete();
    }, 1000)

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

