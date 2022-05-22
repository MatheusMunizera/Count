import { Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { PhotoService } from './photo.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CountService {

  constructor(private http: HttpClient,public photoService: PhotoService, private router: Router) { }

  private readonly COUNT_API_URL = "api-count.url.python";

  private async sendBinaryImage(photoArray: Uint8Array | String){
    
    try{
        await this.http
        .post<string>(`${this.COUNT_API_URL}`,photoArray)
        .toPromise()
        .then((data) =>  data);
    }catch(e){
      console.log(e)
    }
    
  }
  
  public async getCount(){
    this.photoService.photosTemp.forEach(async (e,i) => 
    {
      console.log(i)
      await this.sendBinaryImage(e.webviewPath)
      .finally(()=>this.router.navigate([`/`]))
      .then(()=>this.photoService.savePictureStorage(e))
      .then(()=> this.photoService.deletePictureTemp(e,i))
    });
    this.photoService.photosTemp.length = 0;
  }

  

  // public async countImage(base64) : Promise<string>{
  //   const byteArray = this.base64ToBinary(base64);
  //   const imageCounted = await this.sendBinaryImage(byteArray);


  //   return "Retornar o numero sobre a imagem"
  // }

  // private base64ToBinary(base64 : string): Uint8Array   { 
  //   const array = new Uint8Array(new ArrayBuffer(base64.length));
  //   for(let i = 0; i < base64.length; i++) {
  //     array[i] = base64.charCodeAt(i);
  //   }
  //   return array;

  // }
  

  

}
