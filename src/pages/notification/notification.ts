import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { ThrowStmt } from '@angular/compiler';
import { AngularFireAuth } from "angularfire2/auth";

/**
 * Generated class for the NotificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  notificationNewData = [];
  notificationOldData = [];
  notiNumber: Number;
  numNewNoti: Number;
  numOldNoti: Number;
  constructor(public navCtrl: NavController, public navParams: NavParams, private msgService: MessageServiceProvider,
    private afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    this.afAuth.authState.take(1).subscribe(data => {
      if(data && data.email && data.uid) {
        console.log('ionViewDidLoad NotificationPage');
        this.getNotification(data);
        this.updateNotificationReadFlag(data);
      } 
    });

  }

  homePage(){
    this.navCtrl.setRoot('HomePage');
  }

  async getNotification(data){
    await this.msgService.getNotificationNew({token: data.uid}).subscribe(resp=>{
      console.log(resp);
      this.notificationNewData = resp.notification;
      this.numNewNoti = resp.notification.length;
    });
    await this.msgService.getNotificationOld({token: data.uid}).subscribe(resp=>{
      console.log(resp);
      this.notificationOldData = resp.notification;
      this.numOldNoti = resp.notification.length;
    });
  }

  updateNotificationReadFlag(data){
    this.msgService.updateNotificationReadFlag({token: data.uid}).subscribe(resp=>{
      console.log(resp);
    });
  }
  getNotificationNumber(data){
    this.msgService.getNotificationNumber({token: data.uid}).subscribe(resp=>{
      console.log(resp);
      this.notiNumber = resp.notification;
    });
  }

}
