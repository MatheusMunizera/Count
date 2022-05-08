import { Component } from '@angular/core';
import { ActionSheetController, IonRouterOutlet, Platform } from '@ionic/angular';
import { UserPhoto, PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage  {

  constructor(public photoService: PhotoService, public actionSheetController: ActionSheetController, private platform: Platform) {}

  public isMobile: boolean;
  public picture: String;

 
  public FileImage : any;

  async ngOnInit() {
    await this.photoService.loadSaved();
    this.isMobile = this.platform.is("mobile");
  }

 
  async onFileSelected(event) {
    this.FileImage = event.target.files[0];
         var reader = new FileReader();
         reader.onload = (event:any) => {
           this.picture =event.target.result;  
            this.photoService.addNewToGallery("Camera", this.picture);
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

  

  



 

 

}
