import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
Generated class for the HttpClientProvider provider.

See https://angular.io/guide/dependency-injection for more info on providers
and Angular DI.
*/

//TODO
/*  const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};
*/

@Injectable()
export class HttpClientProvider {
  
  private baseURL : string = ""
  private token : string = ""
  private username : string = ""
  constructor(public http: HttpClient) {
    this.baseURL = "http://box2.tekin.fr/demo/";
  }
  
  getData(device_name : string, dateD : Date, dateF:Date):Promise<any>{
    return new Promise((resolve,reject)=>{    
      let body = {
        device_name:device_name,
        dateD:dateD,
        dateF:dateF
      }
      this.http.post(this.baseURL+"data",body,{}).subscribe((data)=>{
        // console.log(data)
        if(data){
          resolve(data)
        }else{
          reject()
        }
      })
    })
  }
  
  
}
