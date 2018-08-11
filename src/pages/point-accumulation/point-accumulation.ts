import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController  } from 'ionic-angular';

import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { AngularFireAuth } from "angularfire2/auth";
import { Profile } from "../../models/profile";

import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the PointAccumulationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-point-accumulation',
  templateUrl: 'point-accumulation.html',
})
export class PointAccumulationPage {


  profileData = {} as Profile  
  data = {} as {
    token: string;
  }

  point : number; //get point data

  detergent:boolean=false;
  softener:boolean=false;
  wash:boolean=false;
  dry:boolean=false;

  couponID : string;
  couponType : string;
  timestamp : number;

  constructor(public navCtrl: NavController, public navParams: NavParams,private alertCtrl: AlertController
    , private msgService: MessageServiceProvider,private loadingCtrl: LoadingController,private translate: TranslateService
    ,private storage: Storage,private afAuth: AngularFireAuth) {
    this.storage.get('lang').then((data)=>{
      this.translate.setDefaultLang(data);
      this.translate.use(data);
    });

    this.translate.setTranslation('en', {
      uipoint : 'You have',
      uipoint2 : 'points.',
      detergent : 'Use 10 points to get a detergent coupon',
      softener : 'Use 10 points to get a softener coupon',
      wash : 'Use 30 points to get a wash coupon',
      dry : 'Use 30 points to get a dry coupon',
    });

    this.translate.setTranslation('th', {
      uipoint : 'คุณมี',
      uipoint2 : 'แต้ม.',
      detergent : 'ใช้ 10 แต้มเพื่อรับคูปองใช้น้ำยาซักผ้าฟรี 1 ครั้ง',
      softener : 'ใช้ 10 แต้มเพื่อรับคูปองใช้ผงซักฟอกฟรี 1 ครั้ง',
      wash : 'ใช้ 30 แต้มเพื่อใช้คูปองเครื่องซักผ้าฟรี 1 ครั้ง',
      dry : 'ใช้ 30 แต้มเพื่อใช้คูปองอบผ้าฟรี 1 ครั้ง',
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PointAccumulationPage');
    this.presentLoadingCircles();
    this.afAuth.authState.take(1).subscribe(data => {
      if(data && data.email && data.uid) {
        // this.profileData = this.afDatabase.object(`profile/${data.uid}`);
        this.data.token = data.uid;
        this.msgService.getProfile(this.data).subscribe(resp=>{
          this.getProfile(data);
          let timeout = setTimeout( () => {
            this.checkPoints();
          }, 1000);
        })
      } 
     });
  }  

  checkPoints(){
    
    if (this.point >= 30){
      this.detergent = true;
      this.softener = true;
      this.wash = true;
      this.dry = true;
    }
    else if(this.point >= 10) {
      this.detergent = true;
      this.softener = true;
      this.wash = false;
      this.dry = false;
    }
    else{
      this.wash = false;
      this.dry = false;
      this.detergent = false;
      this.softener = false;
    }
    console.log("checkpoint",this.point);
  }
  
  homePage(){
    this.navCtrl.setRoot('HomePage');
  }

  async getProfile(data) {
    this.msgService.getProfile({token: data.uid}).subscribe(resp=>{
      this.profileData = resp.profile;
      this.getPoint();
    });
    
  }

  getPoint(){
    this.point =  this.profileData.uPoint;
    console.log("getpoint",this.point);
  }

  async updatePointProfile(data) {
    this.msgService.updatePointProfile({token: data.uid, uPoint: this.point}).subscribe(resp=>{});
  }

  async addCoupon(data){
    this.msgService.addCoupon({couponID: this.couponID, couponType: this.couponType, timestamp: this.timestamp, token:data.uid}).subscribe(resp=>{
    console.log("addcoupon",resp);      
    });
  }

  setCoupon(couponType){
    this.couponType = couponType;
    this.timestamp = new Date().getTime();
    this.couponID = this.couponType+this.timestamp;
    console.log(this.couponType,this.timestamp,this.couponID,this.data.token);
  }
  

  getDetergent(){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'Do you want to use 10 points to get a detergent?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log('Buy clicked');
            this.point = this.point-10; 
            this.setCoupon("A")
            this.afAuth.authState.take(1).subscribe(data => {
              if(data && data.email && data.uid) {
                this.updatePointProfile(data);
                this.addCoupon(data);
                this.doRefresh(data);
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

  getSoftener(){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'Do you want to use 10 points to get a softener?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log('Buy clicked');
            this.point = this.point-10;
            this.setCoupon("B")
            this.afAuth.authState.take(1).subscribe(data => {
              if(data && data.email && data.uid) {
                this.updatePointProfile(data);
                this.addCoupon(data);
                this.doRefresh(data);
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

  getWash(){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'Do you want to use 30 points to get free wash?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log('Buy clicked');
            this.point = this.point-30;
            this.setCoupon("C")
            this.afAuth.authState.take(1).subscribe(data => {
              if(data && data.email && data.uid) {
                this.updatePointProfile(data);
                this.addCoupon(data);
                this.doRefresh(data);
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

  getDry(){
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'Do you want to use 30 points to get free dry?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log('Buy clicked');
            this.point = this.point-30;
            this.setCoupon("D")
            this.afAuth.authState.take(1).subscribe(data => {
              if(data && data.email && data.uid) {
                this.updatePointProfile(data);
                this.addCoupon(data);
                this.doRefresh(data);
              }
            });
          }
        }
      ]
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

