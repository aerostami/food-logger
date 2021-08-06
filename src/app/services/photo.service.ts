import { Camera, CameraResultType, CameraSource, CameraPhoto } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import {Injectable} from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];
  private PHOTO_STORAGE = 'photos';
  private platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  public async addNewToGallery(id) {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    // Save the picture and add it to photo collection
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });
  }

  public async deletePicture(photo: Photo) {
    // Remove this photo from the Photos reference data array
    for(var i = this.photos.length -1; i >= 0 ; i--){
      if(this.photos[i].filepath === photo.filepath){
        this.photos.splice(i, 1);
      }
    }

    // Update photos array cache by overwriting the existing photo array
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });

    // delete photo file from filesystem
    const filename = photo.filepath
        .substr(photo.filepath.lastIndexOf('/') + 1);

    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data
    });
  }

  public async loadSaved() {
    // Retrieve cached photo array data
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];

    // Display the photo by reading into base64 format
    for (let photo of this.photos) {
      // Read each saved photo's data from the Filesystem
      const readFile = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data
      });

      // Web platform only: Load the photo as base64 data
      photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
    }
  }

  private async savePicture(cameraPhoto: CameraPhoto) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath
    };
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}

interface Photo {
  filepath: string;
  webviewPath: string;
}
