import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import * as core from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { LoadingController, Platform } from '@ionic/angular';
import { TypeCamera } from '../shared/enums/type-camera.enum';
import { Capacitor } from '@capacitor/core';
import { CountService } from './count.service';



@Injectable({
  providedIn: 'root',
})
export class PhotoService {

  public photosStoraged: UserPhoto[] = [];
  public photosTemp: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private type = TypeCamera
  public toCountData = [];
  public valueOfTakes: number = 1;


  constructor(private platform: Platform, private router: Router, public loadingController: LoadingController, private countService: CountService) { }

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
    // Take a photo
    

    // if(type == "Photos"){
    //   capturedPhoto = await Camera.pickImages({
    //     quality: 100, 
    //     width: 250,     
    //     height: 250,
    //     presentationStyle: 'fullscreen',
    //     limit: this.valueOfTakes
    //   });
    // }else{
   const   capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri, // file-based data; provides best performance
        source: CameraSource[type], // automatically take a new photo with the camera
        quality: 100,
        width: 250,
        height: 250,
        presentationStyle: 'fullscreen',
      });
    // }

    await this.savePictureTemp(capturedPhoto)
  }

  public async getPhoto(type: string) {

    for (let i = 0; i < this.valueOfTakes; i++) {
      await this.openCameraOrSelectPhoto(type).then(() => this.router.navigate([`/counting`]))
    }
  }

  public async savePictureStorage(capturedPhoto) {

    if (this.photosStoraged.length == 4) {
      await this.deleteAllPicturesStoraged();
    }

    const savedImageFile = await this.setPictureCounted(capturedPhoto);
    // Add new photo to Photos array
    this.photosStoraged.unshift(savedImageFile);
    // Cache all photo data for future retrieval
    await Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photosStoraged),
    });
    
    if (!this.platform.is('hybrid')) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
          path: this.photosStoraged[0].filepath,
          directory: Directory.Data,
        });
        // Web platform only: Load the photo as base64 data
        this.photosStoraged[0].webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
  }

  public async savePictureTemp(capturedPhoto) {
    const tempImage = await this.setPictureFile(capturedPhoto);
    this.photosTemp.unshift(tempImage);
  }

 
  public async count() {
    this.photosTemp.forEach(async (e, i) => {
      let splitData = e.data.split(',');
      await this.countService.sendBinaryImage(splitData[1])
        .finally(() => this.router.navigate([`/`]))
        .then(async (data: CountImage) => { await this.savePictureStorage(data); })
        .then(() => this.deletePictureTemp(e, i))
    });
    this.photosTemp.length = 0;
  }
  async getCount() {
    const loading = await this.loadingController.create({
      message: 'Contando caixas...',
      translucent: true,
    });

    
    await loading.present();
    await this.count(),
    await loading.dismiss();
  }

  private async setPictureCounted(photoCount) {


    const byteCharacters = photoCount.image;
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray]);

    const web = URL.createObjectURL(blob)


    // Write the file to the data directory
    const fileName = 'Count-' + new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: photoCount.image,
      directory: Directory.Data,
    });
    if (this.platform.is('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        data: photoCount.image,
        value: photoCount.count
      };
    } else {
      return {
        filepath: fileName,
        webviewPath: web,
        data: photoCount.image,
        value: photoCount.count
      };
    }
  }

  // Save picture to file on device
  private async setPictureFile(photo) {
    let base64Data: string;
    if (typeof (photo) == "string") {
      base64Data = photo
    } else {
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
    if (this.platform.is('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        data: base64Data,
        value: 0
      };
    } else {
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
        data: base64Data,
        value: 0
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

  public async deletePictureTemp(photo: UserPhoto, position: number) {
    // Remove this photo from the Photos reference data array
    this.photosTemp.splice(position, 1);

    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  }

  public async deleteAllPicturesStoraged() {
    this.photosStoraged.forEach(async (e) => {

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

  public getTotalSum() {
    let sum = 0
    this.photosStoraged.forEach((e) => sum += e.value);
    return sum;
  }


}
export interface UserPhoto {
  filepath: string;
  webviewPath: string;
  data: string;
  value: number;
}

export interface CountImage {
  image: string;
  count: number;
}