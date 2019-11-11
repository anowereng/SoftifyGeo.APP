import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AttendanceService } from '../services/attendance.service';
import { ToastService } from '../services/toast.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { CameraService } from '../services/common/camera.service';
import { environment } from 'src/environments/environment';
/* Picture  */
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';

const STORAGE_KEY = 'my_images';
@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})

export class AttendancePage {
  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy: number;
  geoAddress: string;
  CheckStatus: any;
  watchLocationUpdates: any;
  loading: any;
  isWatching: boolean;
  attendence: any = {};
  data = '';
  url = environment.url;
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  images = [];
  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public attendService: AttendanceService,
    private toastService: ToastService,
    private helper: JwtHelperService,
    private router: Router,
    private loadservice: LoadingService,
    /* Camera  */
    private camera: Camera, private file: File,
    private http: HttpClient, private webview: WebView,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private storage: Storage,
    private plt: Platform,
    private loadingController: LoadingController,
    private ref: ChangeDetectorRef,
    private filePath: FilePath
  ) {

  }

  ionViewWillEnter() {
    this.getGeolocation();
    this.attendService.CheckInOutStatus();
  }

  readFile(file: any) {
    this.toastService.message('Reading...');
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      formData.append('file', imgBlob, file.name);
      this.SaveCheckInOut(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  /* c]cAMERA : EXTRA*/
  createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
  getPicture() {
    var options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    this.camera.getPicture(options).then(imagePath => {
      this.images = [];
      let newEntry = {
        name: this.createFileName(),
        path: this.file.dataDirectory + name,
        filePath: imagePath
      };
      this.images = [newEntry, ...this.images];
      this.file.resolveLocalFilesystemUrl(this.images[0].filePath)
        .then(entry => {
          (<FileEntry>entry).file(file =>
            this.readFile(file)
          );
        }).catch(err => {
          this.toastService.message('Error while reading file.');
        });
    });
  }

  SaveCheckInOut(formData: FormData) {
    this.loadservice.presentWithMessage('Saving...');
    if (isNullOrUndefined(this.geoAddress)) { this.geoAddress = ''; }
    this.attendence = {};
    this.attendence.Latitude = this.geoLatitude;
    this.attendence.Longitude = this.geoLatitude;
    this.attendence.Address = this.geoAddress;
    this.attendence.Accuracy = this.geoAccuracy;
    this.attendence.Type = this.attendService.CheckStatus;
    if (this.attendence) {
      this.attendService.postItem(this.attendence).pipe(finalize(() => {
        this.loadservice.dismiss();
      })).subscribe(
        () => {
          if (this.attendence.Type === 'CheckIn') {
            this.toastService.message('Record Saved Successfully');
            this.uploadImageData(formData);
          } else {
            this.toastService.message('Record Updated Successfully');
          }
          this.router.navigate(['home']);
        }, error => {
          console.log(error);
          this.toastService.message(error);
        });
    }
  }

  async uploadImageData(formData: FormData) {
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });
    await loading.present();
    this.http.post('http://202.86.220.142:5196/api/LocationAttendance/Uplaod?pagename=attendance', formData)
      .pipe(finalize(() => {
        loading.dismiss();
      })
      ).subscribe(res => {
        this.toastService.message('File Upload Successfully');
      }, error => {
        this.toastService.message(error);
      });
  }


  /* =========== GEO AREA========*/
  stopLocationWatch() {
    this.isWatching = false;
    this.watchLocationUpdates.unsubscribe();
  }

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.geoAccuracy = resp.coords.accuracy;
      this.getGeoencoder(this.geoLatitude, this.geoLongitude);
    }).catch((error) => {
      alert('Error getting location' + JSON.stringify(error));
    });
  }

  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.geoAddress = this.generateAddress(result[0]);
      })
      .catch((error: any) => {
        alert('Error getting location' + JSON.stringify(error));
      });
  }

  generateAddress(addressObj) {
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        address += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }

  watchLocation() {
    this.isWatching = true;
    this.watchLocationUpdates = this.geolocation.watchPosition();
    this.watchLocationUpdates.subscribe((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.getGeoencoder(this.geoLatitude, this.geoLongitude);
    });
  }

}
