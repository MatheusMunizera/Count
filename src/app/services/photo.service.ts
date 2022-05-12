import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';
import { empty } from 'rxjs';
import { CountService } from './count.service';
import { TypeCamera } from '../shared/enums/type-camera.enum';



@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  
  public photosStoraged: UserPhoto[] = [];
  public photosTemp: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private type = TypeCamera
  public valueOfTakes : number = 1;
   
  //TODO:
  // Ajustar carregamento das imagens

  constructor(private platform: Platform, private router: Router) {}

  public async loadSaved() {
    
    // Retrieve cached photo array data
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    
    this.photosStoraged = JSON.parse(photoList.value) || [];

    // If running on the web...
    if (!this.platform.is('hybrid')) {

      // Display the photo by reading into base64 format
      for (let photo of this.photosStoraged) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });

        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
   
     
    }
  }

  private async openCameraOrSelectPhoto(type: string) { 
    console.log(type)
      // Take a photo
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri, // file-based data; provides best performance
        source: CameraSource[type], // automatically take a new photo with the camera
        quality: 100, // highest quality (0 to 100)
      });

      await this.savePictureTemp(capturedPhoto)
  }

  public async getPhoto(typeOrImage: string){

    for (let i = 0; i < this.valueOfTakes; i++) {
      if(typeOrImage !== this.type.NATIVE_CAMERA){
      await  this.openCameraOrSelectPhoto(typeOrImage).then(()=>this.router.navigate([`/counting`]))
      }else{
        await this.savePictureTemp(typeOrImage).then(()=>this.router.navigate([`/counting`]));
      }
    }
   
  }


  public async savePictureStorage(capturedPhoto: string | Photo){

    const savedImageFile = await this.setPictureFile(capturedPhoto);
    // Add new photo to Photos array
      this.photosStoraged.unshift(savedImageFile);
      // Cache all photo data for future retrieval
      Storage.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photosStoraged),
      });

  }

  public async savePictureTemp(capturedPhoto: string | Photo){
      const savedImageFile = await this.setPictureFile(capturedPhoto);
      this.photosTemp.unshift(savedImageFile);
  }
    
  

  // Save picture to file on device
  private async setPictureFile(photo) {
    let base64Data : string;
    if(typeof(photo) == "string"){
      base64Data = photo
    }else{
      // Convert photo to base64 format, required by Filesystem API to save
      base64Data = await this.readAsBase64(photo);
    }

    // Write the file to the data directory
    const fileName = 'Count-' + new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (this.platform.is('mobile')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      return {
        filepath: savedFile.uri,
        webviewPath:  photo,
        data: base64Data,
      };
    } else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
        data: base64Data,
      };
    }
  }

  // Read camera photo into base64 format based on the platform the app is running on
  private async readAsBase64(photo: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path,
      });
      

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  // Delete picture by removing it from reference data and the filesystem
  public async deletePictureStoraged(photo: UserPhoto, position: number) {
    // Remove this photo from the Photos reference data array
    this.photosStoraged.splice(position, 1);

    // Update photos array cache by overwriting the existing photo array
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photosStoraged),
    });

    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  }

  public async deletePictureTemp(photo: UserPhoto, position: number){
    // Remove this photo from the Photos reference data array
    this.photosTemp.splice(position, 1);

    // Update photos array cache by overwriting the existing photo array
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photosTemp),
    });

    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  }

  public async deleteAllPicturesStoraged(){
    this.photosStoraged.forEach(async (e)=>{
      await Filesystem.deleteFile({
        path: e.filepath.substr(e.filepath.lastIndexOf('/') + 1),
        directory: Directory.Data,
      });
    })
    
    this.photosStoraged.length = 0;
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photosStoraged)
    });
  }


  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
  data: string;
}
