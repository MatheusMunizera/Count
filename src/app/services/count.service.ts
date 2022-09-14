import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";


@Injectable({
  providedIn: "root",
})
export class CountService {
  constructor(private http: HttpClient, private router: Router, private toastController: ToastController) {}

  private readonly COUNT_API_URL = "http://localhost:8080/test";

  public async sendBinaryImage(photoArray: Uint8Array | String) {
    var toApiObject = { image: photoArray, other_key: "value" };
    
    this.router.navigate([`/`]);
    this.presentToast();
    
    try {
      return await new Promise((resolve, reject) => {
        this.http
          .post<string>(this.COUNT_API_URL, toApiObject)
          .subscribe((data) => {
            resolve(JSON.parse(JSON.stringify(data)));
          });
      });
    } catch (error) {
        console.log('Erro CountService.SendBindaryImage')
    }
    
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Serviço de contagem indisponivel no momento',
      duration: 3000,
      position: 'bottom',
      color: 'danger',
      cssClass: 'text-black'
    });
    await toast.present();
  }
}
