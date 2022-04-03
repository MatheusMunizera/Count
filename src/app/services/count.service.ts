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

  private readonly COUNT_API_URL = "api-count.url.python";

  public modelSelected : string  = null;

  private async sendBinaryImage(photoArray: Uint8Array){
    
    try{
        await this.http
        .post<string>(`${this.COUNT_API_URL}${this.modelSelected}`,photoArray)
        .toPromise()
        .then((data) =>  data);
    }catch(e){
      console.log(e)
    }
    
  }

  public async countImage(base64) : Promise<string>{
    const byteArray = this.base64ToBinary(base64);
    const imageCounted = await this.sendBinaryImage(byteArray);


    return "Retornar o numero sobre a imagem"
  }

  private base64ToBinary(base64 : string): Uint8Array   { 
    const array = new Uint8Array(new ArrayBuffer(base64.length));
    for(let i = 0; i < base64.length; i++) {
      array[i] = base64.charCodeAt(i);
    }
    return array;

  }
  

  

}
