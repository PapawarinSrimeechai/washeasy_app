import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the MessageServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class MessageServiceProvider {

    private url: string="https://washeasy.me/api";

  
    constructor(private http: Http) {
      console.log('Hello MessageServiceProvider Provider');
    }
    
    private logResponse(res: Response) {
      console.log(res);
    }
  
    private extractData(res: Response) {
      return res.json();
    }
  
    private catchError(error: Response | any) {
      console.log(error);
      return Observable.throw(error.json().error || "Server error.");
    }

    private subscribeData(res: Response) {
      console.log(res);
    }
  
    /* GET */
  
    getProfile(data) {

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/GetProfile", JSON.stringify(data), {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
    }

    getNotificationNew(data) {

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/getNotificationNew", JSON.stringify(data), {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
    }

    getNotificationOld(data) {

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/getNotificationOld", JSON.stringify(data), {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
    }
    
    getNotificationNumber(data) {

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/getNotificationNumber", JSON.stringify(data), {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
    }

    updateNotificationReadFlag(data) {

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/updateNotificationReadFlag", JSON.stringify(data), {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
    }


    updateFcmToken(data) {

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/updateFcmToken", JSON.stringify(data), {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
    }

    getHistoryLaundry(data) {

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/GetHistoryLuandry", data, {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
    }

    getHistoryTopup(data) {

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/GetHistoryTopup", data, {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
    }

    getHistoryBooking(data) {

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/GetHistoryBooking", data, {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
    }

    getWashingList(data) {

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/GetWashingList", data, {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
    }

    getListWashingNearest(data) {

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/GetListWashingNearest?lat", data, {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
    }

    getQueueList(data) {

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/GetQueueList", data , {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
    }

    /* POST */
  
    register(data) {
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/Register", JSON.stringify(data), {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
    }

    topUp(data) {

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/TopUp", JSON.stringify(data), {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
      
    }

    washing(data) {

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*');

      return this.http.post(this.url+"/Washing", JSON.stringify(data), {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);

    }

    updateHistory (data) {
      
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/WashingUpdateHistory", JSON.stringify(data), {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);

    }

    bookingQueue (data) {
      
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/Queue", JSON.stringify(data), {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);

    }

    topUpRequest(data) {
      
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/topUpRequest", JSON.stringify(data), {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);

    }

    topUpByBox(data) {
      
      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/topUpByBox", JSON.stringify(data), {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);

    }

    updatePointProfile(data) {

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/updatePoint", JSON.stringify(data), {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);
    }
    
    addCoupon(data){

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/addCoupon", JSON.stringify(data), {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);

    }

    getCoupon(data){

      let headers = new Headers();
      headers.append('Accept', 'application/json');
      headers.append('Content-Type', 'applicayion/json');
      headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
      headers.append('Access-Control-Allow-Origin','https://washeasy.me/api/*'); 

      return this.http.post(this.url+"/getCoupon", JSON.stringify(data), {headers: headers})
      .do(this.logResponse)
      .map(this.extractData)
      .catch(this.catchError);

    }

}
