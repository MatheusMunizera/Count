import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { UserPhoto, PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-gallery-tab',
  templateUrl: 'gallery-tab.page.html',
  styleUrls: ['gallery-tab.page.scss']
})
export class GalleryTabPage {

  constructor(public photoService: PhotoService, public actionSheetController: ActionSheetController) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Deletar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
         }
      }]
    });
    await actionSheet.present();
  }

  public async addNewToGallery(){
   await this.photoService.addNewToGallery();
  }
}
