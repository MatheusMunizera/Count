import { Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountService {

  constructor(private http: HttpClient) { }

  private readonly COUNT_API_URL = "teste";

  public photoBase64 : string = null;

  public async sendImageBase64(photoBase64: string){
    //Post to Count API, that's return a base64 string with counted objects
    try{
        await this.http
        .post<string>(this.COUNT_API_URL,photoBase64)
        .toPromise()
        .then((data) =>  this.photoBase64 = data);

      
    return this.photoBase64
    }catch(e){
      console.log(e)
    }
    
  }

  

}
