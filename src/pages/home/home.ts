import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController, App ,AlertController,
  ActionSheetController,LoadingController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable} from "angularfire2/database";
import { Profile } from "../../models/profile";
import { WashingMachine } from "../../models/washingMachine";
import { WashingList } from "../../models/washingList";
import { WashingAPI } from "../../models/washingAPI";
import { BookingAPI } from "../../models/bookingAPI";
import { ITimer } from "../../models/ITimer";
import { BarcodeScanner, BarcodeScannerOptions } from "@ionic-native/barcode-scanner";
import { LocalNotifications } from '@ionic-native/local-notifications';
import { MessageServiceProvider } from '../../providers/message-service/message-service';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular/platform/platform';
import { FCM } from '@ionic-native/fcm';
import { NativeStorage } from '@ionic-native/native-storage';
import { Title } from '@angular/platform-browser';

/**
 * Generated class for the HomePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  options: BarcodeScannerOptions;

  washing = {} as WashingAPI;
  booking = {} as BookingAPI;
  washingRef$:  FirebaseObjectObservable<WashingMachine>;
  washingRef = {} as WashingMachine;

  washingRef2$:  FirebaseObjectObservable<WashingMachine>;
  washingRef2 = {} as WashingMachine;

  //timeInSeconds = 3000 as number;
  //timeInSeconds = 120 as number;
  timeInSeconds = 120 as number;
  public timer: ITimer;

  //profileData: FirebaseObjectObservable<Profile>;
  profileData = {} as Profile

  washingMachineRef_1$: FirebaseListObservable<WashingMachine[]>;
  washingMachineRef_2$: FirebaseListObservable<WashingMachine[]>;
  washingMachineRef_3$: FirebaseListObservable<WashingMachine[]>;
  washingMachineRef_4$: FirebaseListObservable<WashingMachine[]>;


  dormRef_1$: FirebaseObjectObservable<any>;
  dormRef_2$: FirebaseObjectObservable<any>;
  dormRef_3$: FirebaseObjectObservable<any>;
  dormRef_4$: FirebaseObjectObservable<any>;

  dorm1_name: string;
  dorm2_name: string;
  dorm3_name: string;
  dorm4_name: string;

  dorm1_id: string;
  dorm2_id: string;
  dorm3_id: string;
  dorm4_id: string;

  notiNumber: Number;

  //wahingListItem: FirebaseObjectObservable<WashingMachine>;
  wahingListItem: string[] = [];
  queueListItem: string[] = [];

  tokenFB: FirebaseListObservable<any>;


  constructor(private afAuth: AngularFireAuth, private toast: ToastController, private afDatabase: AngularFireDatabase,
    private menu: MenuController, private app: App, private barcode: BarcodeScanner, private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController, private geolocation: Geolocation, private loadingCtrl: LoadingController,
    private localNotifications: LocalNotifications, private msgService: MessageServiceProvider,
    public navCtrl: NavController, public navParams: NavParams, private platform: Platform, private fcm: FCM, private nativeStorage: NativeStorage) {

      // Pointing machinelistRef$ at firebase -> 'washingMachine' node
      // washing machine list
      // this.washingMachineRef$ = this.afDatabase.list('washingMachine');
  }

  ngAfterViewInit(){
     this.menu.swipeEnable(true);
     this.app._setDisableScroll(true);
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad HomePage');

   this.afAuth.authState.take(1).subscribe(data => {
    if(data && data.email && data.uid) {
      //this.profileData = this.afDatabase.object(`profile/${data.uid}`);
      this.onNotification(data);
      this.getProfile(data);
      this.getWashingList(data);
      this.getQueueList(data);
      this.getListWashingNearest();
      this.getNotification(data);
    } 
   });

  }
  // end of ionViewDidLoad

  notificationPage(){
    this.navCtrl.setRoot('NotificationPage');
  }

  async getNotification(data){
    this.msgService.getNotificationNumber({token: data.uid}).subscribe(resp=>{
      console.log(resp);
      this.notiNumber = resp.notification;
    });
  }
  
  onNotification(dataFB) {
    try {
      this.fcm.onNotification().subscribe(data=>{

        this.getNotification(dataFB);
        
        if(data.wasTapped){
          console.log("Received in background");
          var myObjStr = JSON.stringify(data);
          //this.showAlertErr(data.title, data.body);
          //alert(myObjStr);
        } else {
          console.log("Received in foreground");
          var myObjStr = JSON.stringify(data);
          //this.showAlertErr(data.title, data.body);
          this.localNotifications.schedule({
            title: data.title,
            text: data.body,
            icon: 'file://assetts/icon/icon.png',
            smallIcon: 'file://assetts/icon/icon.png',
            at: new Date(new Date().getTime()),
            led: 'FF0000',
          });
        }

      });
    } catch (err){
      console.error('onNotification ERROR: '+err);  
    }

  }
  

  async getProfile(data) {
    this.msgService.getProfile({token: data.uid}).subscribe(resp=>{
      console.log(resp);
      this.profileData = resp.profile;
    });
  }

  async getWashingList(data) {
    try{
      this.msgService.getWashingList({token: data.uid}).subscribe(resp=>{
        console.log(resp);
        console.log(resp.washing.length);
        //resp.washing.forEach(item=>{
          if(resp.washing.length==0) {
            this.wahingListItem =[];
            console.log('ไม่มีรายการซัก');
          }
          for(let i=0; i<resp.washing.length; i++){
            
            console.log(resp.washing[i].idWashing)
            
            this.afDatabase.object(`washingMachine/${resp.washing[i].idDorm}/machine/${resp.washing[i].idWashing_Machine}`)
            .subscribe( data => {
              console.log(data);
              this.afDatabase.object(`washingMachine/${resp.washing[i].idDorm}/data`).subscribe(dorm=>{
                data.dormName = dorm.name;
                this.wahingListItem[i] = data;
                // this.wahingListItem.push(data);
                console.log(this.wahingListItem);
              });
              
            });
          }
        //})
      });
    }catch(err){
      console.error('getWashingList ERROR: '+err);
    }
    
  }

  async getQueueList(data) {
    try{
      this.msgService.getQueueList({token: data.uid}).subscribe(resp=>{
        console.log(resp)
        if(resp.status!=1) {
          this.queueListItem =[];
          console.log('ไม่มีรายการจอง');
        }
        for(let i=0; i<resp.queue.length; i++){
          
          console.log(resp.queue[i].idWashing_Machine);
          this.queueListItem[i] = resp.queue[i]
          // this.afDatabase.object(`washingMachine/${resp.queue[i].idDorm}/machine/${resp.queue[i].idWashing_Machine}`)
          // .subscribe( data => {
          //   console.log(data);
          //   this.afDatabase.object(`washingMachine/${resp.queue[i].idDorm}/data`).subscribe(dorm=>{
          //     data.dormName = dorm.name;
          //     this.queueListItem[i] = data;
          //     console.log(this.queueListItem);
          //   });
            
          // });
        }
      });
    }catch(err){
      console.error('getQueueList ERROR: '+err);
    }
  }

  async getListWashingNearest() {
    try {
       //this.findMachineByDormID('D40002001', 'D40002002', 'D40002003', 'D40002004');
      this.geolocation.getCurrentPosition().then((resp) => {
        this.msgService.getListWashingNearest({lat: resp.coords.latitude, long: resp.coords.longitude}).subscribe(resp=>{
        console.log(resp.list.length)
        if(resp.status==1){
          if(resp.list.length==1)
            this.findMachineByDormID(resp.list[0].idDorm, '', '', '');
          else if(resp.list.length==2)
            this.findMachineByDormID(resp.list[0].idDorm, resp.list[1].idDorm, '', '');
          else if(resp.list.length==3)
            this.findMachineByDormID(resp.list[0].idDorm, resp.list[1].idDorm, resp.list[2].idDorm, '');
          else if(resp.list.length==4)
            this.findMachineByDormID(resp.list[0].idDorm, resp.list[1].idDorm, resp.list[2].idDorm, resp.list[3].idDorm);
          //this.findMachineByDormID(resp.list[0].idDorm, resp.list[1].idDorm, resp.list[2].idDorm, resp.list[3].idDorm);
        } 
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
    } catch (error) {
      console.error('getListWashingNearest ERROR: '+error);
    }
  }
  
 
  async findMachineByDormID(dormID_1, dormID_2, dormID_3, dormID_4){
    try {
      this.dormRef_1$ = this.afDatabase.object(`washingMachine/${dormID_1}/data`);
      this.dormRef_1$.subscribe(data=>{
          this.dorm1_name = data.name;
          this.dorm1_id = dormID_1;
      });
      this.dormRef_2$ = this.afDatabase.object(`washingMachine/${dormID_2}/data`);
      this.dormRef_2$.subscribe(data=>{
        this.dorm2_name = data.name;
        this.dorm2_id = dormID_2;
      });
      this.dormRef_3$ = this.afDatabase.object(`washingMachine/${dormID_3}/data`);
      this.dormRef_3$.subscribe(data=>{
        this.dorm3_name = data.name;
        this.dorm3_id = dormID_3;
      });
      this.dormRef_4$ = this.afDatabase.object(`washingMachine/${dormID_4}/data`);
      this.dormRef_4$.subscribe(data=>{
        this.dorm4_name = data.name;
        this.dorm4_id = dormID_4;
      });

      this.washingMachineRef_1$ = this.afDatabase.list(`washingMachine/${dormID_1}/machine`);
      this.washingMachineRef_2$ = this.afDatabase.list(`washingMachine/${dormID_2}/machine`);
      this.washingMachineRef_3$ = this.afDatabase.list(`washingMachine/${dormID_3}/machine`);
      this.washingMachineRef_4$ = this.afDatabase.list(`washingMachine/${dormID_4}/machine`);   
    } catch (error) {
      console.error('findMachineByDormID ERROR: '+error);
    }
  }
  washingMachineRef_4
  scanBarcode() {
    try {
      if (this.wahingListItem.length == 0) {
        this.barcode.scan().then((barcodeData) => {
  
          console.log(barcodeData);
          var tmp = String(barcodeData.text);
          var washingId = tmp.split(',',2);
  
          if(washingId[0]!=undefined && washingId[1]!=undefined) {
            //this.washingFn(washingId[0], washingId[1]);
            this.showProgramRadio(washingId[0], washingId[1]);
          }
        }, (err) => {
          // alert('เกิดข้อผิดพลาด');
          // this.washingFn("W4000200101", "D40002001");
          this.showProgramRadio("W4000200101", "D40002001");
        });
      } else {
        this.showAlertErr('ไม่สามารถซักผ้าได้','เนื่องจากท่านมีรายการซักอยู่');
      }
    } catch (error) {
      console.error('scanBarcode ERROR: '+error);
    }
  }

  modeRadioOpen = true;
  showProgramRadio(_washingId, _dormId) {
    let alert = this.alertCtrl.create();
    alert.setTitle('เลือกโหมดการซัก');

    alert.addInput({
      type: 'radio',
      label: 'อัตโนมัติ',
      value: '1',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'ผ้าห่ม',
      value: '2',
    });

    alert.addInput({
      type: 'radio',
      label: 'ถนอมผ้า',
      value: '3',
    });

    alert.addButton({
      text: 'ตกลง',
      handler: data => {
        this.modeRadioOpen = false;
        console.log(data);
        this.showlevelRadio(_washingId, _dormId, data);
      }
    });
    alert.present();
  }

  levelRadioOpen = true;
  showlevelRadio(_washingId, _dormId, _program) {
    let alert = this.alertCtrl.create();
    alert.setTitle('เลือกระดับน้ำ');

    alert.addInput({
      type: 'radio',
      label: 'สูง',
      value: '4'
    });

    alert.addInput({
      type: 'radio',
      label: 'กลาง',
      value: '3',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'ต่ำ',
      value: '2',
    });

    alert.addInput({
      type: 'radio',
      label: 'ต่ำสุด',
      value: '1',
    });

    alert.addButton({
      text: 'ตกลง',
      handler: data => {
        this.levelRadioOpen = false;
        console.log(data);
        this.washingFn(_washingId, _dormId, _program, data);
      }
    });
    alert.present();
  }

  washingFn(idWashing, idDorm, _program, _waterLevel) {
     //alert(idWashing);
     //alert(idDorm);
    this.afAuth.authState.take(1).subscribe(data => {
      

      if(data && data.email && data.uid) {
        console.log(data.uid, data , data.email);
        this.washing.token = data.uid;
        this.washing.idWashing_Machine = idWashing;
        this.washing.idDorm = idDorm;
        var timeStamp = new Date().getTime();
        this.washing.function = 'ask';
        this.washing.programWashing = _program;
        this.washing.waterLevel = _waterLevel;
        

        console.log(this.washing)

        // check money
        this.msgService.washing(this.washing).subscribe(resp=>{
          //alert(resp.status)
          console.log(resp);
          if(resp.status == '1') {
              this.showAlert('ยืนยันการซักผ้า', `ค่าบริการ ${resp.price} บาท`, idWashing , idDorm, this.washing, data)
          } else if(resp.status == '01') {
              this.showAlertErr('ยอดเงินของคุณไม่เพียงพอ','กรุณาลองใหม่อีกครั้ง');
          } else if(resp.status == '02') {
            this.showAlertErr('ไม่พบผู้ใช้','กรุณาลองใหม่อีกครั้ง');
          } else if(resp.status == '03') {
            this.showAlertErr('ไม่สามารถทำรายการได้','กรุณาลองใหม่อีกครั้ง');
          } else {
            this.showAlertErr('เกิดข้อผิดพลาด','กรุณาลองใหม่อีกครั้ง');
          }
        });
      } 
     });
  }

  showAlert(_title, _subTitle, WashingID, dormID, washing, data) {
    let alert = this.alertCtrl.create({
      title: _title,
      subTitle: _subTitle,
      buttons:[
        {
          text: 'ตกลง',
          handler: () => {
            //this.presentLoadingCircles();
            console.log('OK clicked');
            washing.function = 'pay';
            console.log(washing);

            // washing
            this.msgService.washing(washing).subscribe(resp=>{
              //alert(resp.status)
              console.log(resp);
              if(resp.status == '1') {
                this.washingRef$ = this.afDatabase.object(`washingMachine/${dormID}/machine/${WashingID}`);
                this.washingRef.washingStatus = 'washing';
                this.washingRef$.update(this.washingRef);

                setTimeout(() => {
                  //this.startTimer(WashingID, dormID);
                }, 3000)
    
                setTimeout(() => {
                  this.startTimer(WashingID, dormID);
                }, 1000)
                this.getWashingList(data);
                this.getProfile(data);
                //this.ionViewDidLoad();
              } else if(resp.status == '01') {
                  this.showAlertErr('ยอดเงินของคุณไม่เพียงพอ','กรุณาลองใหม่อีกครั้ง');
              } else if(resp.status == '02') {
                this.showAlertErr('ไม่พบผู้ใช้','กรุณาลองใหม่อีกครั้ง');
              } else if(resp.status == '03') {
                this.showAlertErr('ไม่สามารถทำรายการได้','กรุณาลองใหม่อีกครั้ง');
              } else {
                this.showAlertErr('เครื่องซักผ้าถูกจองอยู่','กรุณารอคิวสักครู่');
              }
            });
            //this.navCtrl.push('HomePage');
          }
        },
        {
          text: 'ยกเลิก',
          handler: () => {
            console.log('cancel clicked');
          }
        }
      ]
    });
    alert.present();
  }

  // จอง  
  openMenu(name, dorm, washingkey) {
    console.log(dorm)
    let dorm_name:string;
    let dorm_id:string;
    if(dorm ==1){
      dorm_name = this.dorm1_name;
      dorm_id = this.dorm1_id;
    }else if (dorm ==2){
      dorm_name = this.dorm2_name;
      dorm_id = this.dorm2_id;
    }else if (dorm ==3){
      dorm_name = this.dorm3_name;
      dorm_id = this.dorm3_id;
    }else if (dorm ==4){
      dorm_name = this.dorm4_name;
      dorm_id = this.dorm4_id;
    }
 
    let actionSheet = this.actionSheetCtrl.create({
      title: 'เมนู',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: `จองเครื่อง ${name}, ${dorm_name}`,
          handler: () => {
            this.showBooking(`ต้องการจองคิวหรือไม่`,`เครื่อง ${name}, ${dorm_name}`, washingkey);
            console.log('ok');
          }
        },
        {
          text: 'ยกเลิก',
          role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  showBooking(_title, _subTitle, _washingkey) {
    let alert = this.alertCtrl.create({
      title: _title,
      subTitle: _subTitle,
      buttons: [
        {
          text: 'ตกลง',
          handler: () => {
            this.afAuth.authState.take(1).subscribe(data => {
              if(data && data.email && data.uid) {

                this.booking.token = data.uid;
                this.booking.idWashing = _washingkey;

                this.msgService.bookingQueue(this.booking).subscribe(resp=>{
                  if(resp.status == '1') {
                      this.showAlertErr('จองคิวสำเร็จ','');
                      this.getQueueList(data);
                  } else if(resp.status == '01') {
                    this.showAlertErr('ไม่สามารถจองคิวได้','เนื่องจากมีผู้ใช้จองคิวเครื่องซักผ้าเครื่องนี้แล้ว');
                  } else {
                    this.showAlertErr('ไม่สามารถทำรายการได้','กรุณาลองใหม่อีกครั้ง');
                  }
                });
              } 
          });
            console.log('ok clicked');
          }
        }
      ]
    });
    alert.present();
  }

  showAlertErr(_title, _subTitle) {
    let alert = this.alertCtrl.create({
      title: _title,
      subTitle: _subTitle,
      buttons: ['ตกลง']
    });
    alert.present();
  }

  ////////////////////////////////

  ngOnInit() {
    this.initTimer();
  }

  hasFinished() {
      return this.timer.hasFinished;
  }

  initTimer() {
      if(!this.timeInSeconds) { this.timeInSeconds = 0; }

      this.timer = <ITimer>{
          seconds: this.timeInSeconds,
          runTimer: false,
          hasStarted: false,
          hasFinished: false,
          secondsRemaining: this.timeInSeconds
      };

      this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
  }

  startTimer(WashingID, dormID) {
      this.timer.hasStarted = true;
      this.timer.runTimer = true;
      this.timerTick(WashingID, dormID);
  }


  timerTick(WashingID, dormID) {
      setTimeout(() => {
          if (!this.timer.runTimer) { return; }
          this.timer.secondsRemaining--;
          this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);

          this.washingRef2$ = this.afDatabase.object(`washingMachine/${dormID}/machine/${WashingID}`);
          this.washingRef2.timeLeft = this.timer.displayTime;
          this.washingRef2$.update(this.washingRef2);

          console.log(this.timer.secondsRemaining);

          if (this.timer.secondsRemaining > 0) {
              this.timerTick(WashingID, dormID);
          }
          else {
              this.timer.hasFinished = true;
              
              this.afAuth.authState.take(1).subscribe(data => {
                if(data && data.email && data.uid) {
                  //var flagHistory = false;
                  //alert('1')
                  this.msgService.updateHistory({token: data.uid, idWashing_Machine: WashingID}).subscribe(resp=>{
                    //alert(resp.status)
                    //flagHistory = true;
                    if(resp.status == '1') {
                      this.washingRef$ = this.afDatabase.object(`washingMachine/${dormID}/machine/${WashingID}`);
                      this.washingRef.washingStatus = 'free';
                      this.washingRef$.update(this.washingRef);
                      this.getWashingList(data);
                    }
                  });

                  // if(flagHistory==false) {
                  //   this.washingRef$ = this.afDatabase.object(`washingMachine/${dormID}/machine/${WashingID}`);
                  //   this.washingRef.washingStatus = 'free';
                  //   this.washingRef$.update(this.washingRef);

                  // }
                  this.timeInSeconds = 120;
                  this.timer.secondsRemaining = 120;
                  
                  
                }
              });
          }
          // Notification
          if (this.timer.secondsRemaining == 60) {

            this.localNotifications.schedule({
              text: 'เหลือเวลาอีก 1 นาทีผ้าจะซักเสร็จ',
              at: new Date(new Date().getTime()),
              led: 'FF0000',
            });
            
          } else if (this.timer.secondsRemaining == 0) {
            
            this.localNotifications.schedule({
              text: 'ผ้าซักเสร็จแล้ว',
              at: new Date(new Date().getTime()), //at: new Date(new Date().getTime()+6000),
              led: 'FF0000',
            });
          }

      }, 1000);
  }

  getSecondsAsDigitalClock(inputSeconds: number) {
      var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);
      var hoursString = '';
      var minutesString = '';
      var secondsString = '';
      hoursString = (hours < 10) ? "0" + hours : hours.toString();
      minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
      secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
      console.log(hoursString,minutesString,secondsString)
      return hoursString + ':' + minutesString + ':' + secondsString;
  }



  ////////////////////////////////

  doRefresh(refresher) {
    console.log('DOREFRESH', refresher);

      this.ionViewDidLoad();
 
      setTimeout(() => {
        refresher.complete();
      }, 1000)

      this.presentLoadingCircles();

  }

  doPulling(refresher) {
    console.log('DOPULLING', refresher.progress);
  }

  presentLoadingCircles() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'กรุณารอสักครู่',
      duration: 1000
    });

    loading.present();
  }



}


