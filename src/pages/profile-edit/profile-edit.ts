import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { Profile } from "../../models/profile";
import { MessageServiceProvider } from '../../providers/message-service/message-service';

/**
 * Generated class for the ProfileEditPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEditPage {

  //profileData: FirebaseObjectObservable<Profile>
  profileData = {} as Profile;
  data = {} as {
    token: string;
  }

  constructor(private afAuth: AngularFireAuth, private app: App, private msgService: MessageServiceProvider,
    public navCtrl: NavController, public navParams: NavParams) {
  }

  ngAfterViewInit(){
    //this.menu.swipeEnable(true);
    this.app._setDisableScroll(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileEditPage');
    this.afAuth.authState.take(1).subscribe(data => {
      if(data && data.email && data.uid) {
        // this.profileData = this.afDatabase.object(`profile/${data.uid}`);
        this.data.token = data.uid;
        this.msgService.getProfile(this.data).subscribe(resp=>{
          console.log(resp);
          this.profileData = resp.profile;
          
          if(resp.profile.U_Point!=0){
            console.log(resp.profile.U_Point);
          }
        })
      } 
     });
  }

}
