import { Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountService {

  constructor(private http: HttpClient) { }

  
  private readonly COUNT_API_URL = "http://localhost:8080/test";

  public modelSelected : string  = null;

  public async sendBinaryImage(photoArray: string){
    
    try{
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
        });
        var tt = {"image": photoArray, "other_key": "value"};
        var returnImage;
        
        return await new Promise(resolve =>{
          this.http.post<string>(this.COUNT_API_URL, tt, {headers:headers})
          .subscribe(data => {
            resolve(JSON.parse(JSON.stringify(data)))
          })
        });        
    }catch(e){
      console.log(e)
    }
    
  }

  public async countImage(base64) : Promise<string>{
    const byteArray = this.base64ToBinary(base64);
    var returnedImage : string;
    await this.sendBinaryImage(byteArray)
              .then(data => {
                var cha = JSON.parse(JSON.stringify(data))
                returnedImage = cha.image
              });

    return returnedImage;
  }

  private base64ToBinary(base64 : string): string   { 
    // const array = new Uint8Array(new ArrayBuffer(base64.length));
    // for(let i = 0; i < base64.length; i++) {
    //   array[i] = base64.charCodeAt(i);
    // }
    return base64;

  }
  

  

}
