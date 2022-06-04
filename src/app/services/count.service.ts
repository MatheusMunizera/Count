import { Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { PhotoService } from './photo.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CountService {

  constructor(private http: HttpClient, private router: Router) { }

  private readonly COUNT_API_URL = "http://localhost:8080/test";

  public async sendBinaryImage(photoArray: Uint8Array | String) {

    var toApiObject = { "image": photoArray, "other_key": "value" };

    return await new Promise(resolve => {
      try {
        this.http.post<string>(this.COUNT_API_URL, toApiObject)
          .subscribe(data => {

            if (data)
              resolve(JSON.parse(JSON.stringify(data)))

          })
      } catch (ex) {
        console.log(ex, "Error.CountService.SendBinaryImage")
      }
    });
  }

}



