import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { AndroidPermissions } from '@ionic-native/android-permissions';
import Omise from 'omise-react-native';
import {omise as omiseNode} from 'omise';
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
  token = {} as{
    token: string;
  }
  sourceId : string; 

  constructor(private afAuth : AngularFireAuth,public navCtrl: NavController, public navParams: NavParams,
    public platform: Platform, public androidPermissions: AndroidPermissions) {
    //  this.OmiseToken();
      this.OmiseSource();
      //this.Charge();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestOmisePage');
  }

  async OmiseToken(){
    Omise.config('pkey_test_5cno5ln70vmjub9whsa', '2017-11-02');
    const data = await Omise.createToken({
      'card': {
          'name': 'JOHN DOE',
          'city': 'Bangkok',
          'postal_code': 10320,
          'number': '4242424242424242',
          'expiration_month': 10,
          'expiration_year': 2018,
          'security_code': 123
      }
  });
  
  console.log("data", data);
  }

  async OmiseSource(){
  //   Omise.config('pkey_test_5cno5ln70vmjub9whsa', '2017-11-02');
  //   const data = await Omise.createSource({
  //     'type': 'internet_banking_bbl',
  //     'amount': 100000,
  //     'currency': 'thb'
  // });
  
  // console.log("data", data);
  // this.sourceId = data.id;
  
    const amount = 500000;
    const currency = 'thb';

    const omise = omiseNode({
        publicKey: 'pkey_test_5cno5ln70vmjub9whsa',
        secretKey: 'skey_test_5cno4zu7q4k1febhyao',
    });

    const source = {
      type:     'internet_banking_bbl',
      amount:   500000,
      currency: 'thb',
    };

    omise.sources.create(source).then((resSource) => {
        return omise.charges.create({
          amount,
          // Use responded source's ID as a charge's parameter
          source: resSource.id,
          currency,
          return_uri:'https://omise.co',
        });
      }).then((charge) => {
        console.log(charge);
      });
      }

  // Charge(){
  //   var omise = require('omise/types/index.')({
  //     'secretKey': 'skey_test_5cno4zu7q4k1febhyao',
  //     'omiseVersion': '2017-11-02'
  //   });
  //   omise.charges.create({
  //     'amount': '100000',
  //   'currency': 'thb',
  //   'return_uri': 'http://www.example.com',
  //   'source': this.sourceId
  //   }, function(error, charge) {
  //     /* Response. */
  //   });
  // }

 
}
