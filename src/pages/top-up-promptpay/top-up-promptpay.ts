import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';

import { AndroidPermissions } from '@ionic-native/android-permissions';
/**
 * Generated class for the TopUpPromptpayPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-top-up-promptpay',
  templateUrl: 'top-up-promptpay.html',
})
export class TopUpPromptpayPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public platform: Platform, public androidPermissions: AndroidPermissions) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TopUpPromptpayPage');
  }


}
