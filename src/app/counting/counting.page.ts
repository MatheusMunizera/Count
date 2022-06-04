import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, Platform } from '@ionic/angular';
import { CountService } from '../services/count.service';
import { PhotoService, UserPhoto } from '../services/photo.service';

@Component({
  selector: 'app-counting',
  templateUrl: './counting.page.html',
  styleUrls: ['./counting.page.scss'],
})
export class CountingPage implements OnInit {

  constructor(public photoService: PhotoService, public countService: CountService, public actionSheetController: ActionSheetController, private router: Router) { }

  async ngOnInit() {
   
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Deletar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
         this.photoService.deletePictureTemp(photo, position);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        cssClass: 'text-primary',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
         }
      }]
    });
    await actionSheet.present(); 
  }

  public cancelCounting(): void{
    this.photoService.photosTemp.length = 0;
    this.router.navigateByUrl("/");
  }

  


}
