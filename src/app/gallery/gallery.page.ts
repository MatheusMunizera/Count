import { Component } from '@angular/core';
import { ActionSheetController, IonRouterOutlet, Platform } from '@ionic/angular';
import { CountService } from '../services/count.service';
import { UserPhoto, PhotoService } from '../services/photo.service';
import { TypeCamera } from '../shared/enums/type-camera.enum';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage  {

  constructor(public photoService: PhotoService, private countService: CountService, public actionSheetController: ActionSheetController, private platform: Platform) {}

  public isMobile: boolean;
  public picture: string;
  public type = TypeCamera
  public stackPhotos : Array<Array<UserPhoto>> = new Array;


 
  public FileImage : any;

  async ngOnInit() {
    await this.photoService.loadSaved();
    this.isMobile = this.platform.is("mobile");
    
  }

 
  async openCameraNativeMobile(event) {
    this.FileImage = event.target.files[0];
         var reader = new FileReader();
         reader.onload = (event:any) => {
           this.picture =event.target.result;  
            this.photoService.getPhoto(this.picture);
          }
          
          reader.readAsDataURL(this.FileImage);
      
        }
        
       
  
  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Deletar',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePictureStoraged(photo, position);
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

  

  



 

 

}
