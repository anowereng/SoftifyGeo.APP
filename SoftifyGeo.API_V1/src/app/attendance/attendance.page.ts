import { Component } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { ToastService } from '../services/toast.service';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { environment } from 'src/environments/environment';
/* Picture  */
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { AuthService } from '../services/auth.service';
/*GEO */
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
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
  images = [];
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  constructor(
    public attendService: AttendanceService,
    private toastService: ToastService,
    private router: Router,
    private loadservice: LoadingService,
    /* GEO */
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    /* Camera  */
    private camera: Camera, private file: File,
    public authService: AuthService
  ) {
    this.getGeolocation();
    this.attendService.CheckInOutStatus();
  }

  ionViewWillEnter() {
    this.attendService.CheckInOutStatus();
    this.getGeolocation();
  }

  setGeoLocation() {
    this.getGeolocation();
  }
  // Get current coordinates of device
  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.geoAccuracy = resp.coords.accuracy;
      this.getGeoencoder(this.geoLatitude, this.geoLongitude);
    }).catch((error) => {
      this.toastService.message('Error getting location' + JSON.stringify(error));
    });
  }

  // geocoder method to fetch address from coordinates passed as arguments
  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.geoAddress = this.generateAddress(result[0]);
      })
      .catch((error: any) => {
        this.toastService.message('Error getting location' + JSON.stringify(error));
      });
  }

  // Return Comma saperated address
  generateAddress(addressObj) {
    let obj = [];
    let address = '';
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

  /* End : GEO  */

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


  ValidationMessage(): boolean {
    let flag = true;
    if (this.geoLongitude === 0 || isNullOrUndefined(this.geoLongitude)
      || this.attendence.toString().length === 0) {
      flag = false;
      this.toastService.message('please reselect menu  , latitude and longitude are empty  !!');
    }
    return flag;
  }

  getPicture() {
    if (this.ValidationMessage()) {
      let options: CameraOptions = {
        quality: 100,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: true,
        correctOrientation: true
      };
      this.camera.getPicture(options).then(imagePath => {
        this.images = [];
        let newEntry = {
          name: 'attendance',
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
  }

  async uploadImageData(formData: FormData) {
    this.loadservice.presentWithMessage('Uploading image...');
    this.attendService.uploadImage(formData).pipe(finalize(() => {
      this.loading.dismiss();
    })).subscribe(res => {
      this.toastService.message('File Upload Successfully');
    }, error => {
      this.toastService.message(error);
    });
  }

  CheckOut() {
    if (this.ValidationMessage()) {
      const formData = new FormData();
      this.SaveCheckInOut(formData);
    }
  }

  SaveCheckInOut(formData: FormData) {
    this.loadservice.presentWithMessage('Saving...');
    if (isNullOrUndefined(this.geoAddress)) { this.geoAddress = ''; }
    this.attendence = {};
    this.getGeolocation();
    this.attendence.CheckInLatitude = this.geoLatitude;
    this.attendence.CheckInLongitude = this.geoLongitude;
    this.attendence.CheckInAddress = this.geoAddress;
    this.attendence.Accuracy = 1;
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
        }, error => {
          console.log(error);
          this.toastService.message(error);
        });
      this.router.navigate(['home']);
    }
  }


  logout() {
    this.authService.logout();
  }

}