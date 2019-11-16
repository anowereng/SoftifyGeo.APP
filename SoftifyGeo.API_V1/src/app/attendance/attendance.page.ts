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
import { LatLongService } from '../services/latlong.service';
import { AuthService } from '../services/auth.service';

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
  constructor(
    public attendService: AttendanceService,
    private toastService: ToastService,
    private router: Router,
    private loadservice: LoadingService,
    /* Camera  */
    private camera: Camera, private file: File,
    public latLong: LatLongService,
    public authService: AuthService
  ) {
    this.latLong.watchLocation();
    this.attendService.CheckInOutStatus();
    this.watchLocation();
  }

  ionViewWillEnter() {
    this.latLong.watchLocation();
    this.attendService.CheckInOutStatus();
    this.watchLocation();
  }

  watchLocation() {
    this.attendence.geoLatitude = this.latLong.geoLatitude;
    this.attendence.geoLongitude = this.latLong.geoLongitude;
    this.attendence.geoAddress = this.latLong.geoAddress;
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


  ValidationMessage(): boolean {
    let flag = true;
    if (this.attendence.geoLongitude === 0 || isNullOrUndefined(this.attendence.geoLongitude)
      || this.attendence.geoLongitude.toString().length === 0) {
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

  SaveCheckInOut(formData: FormData) {
    this.loadservice.presentWithMessage('Saving...');
    if (isNullOrUndefined(this.geoAddress)) { this.geoAddress = ''; }
    this.attendence = {};

    this.latLong.getGeolocation();
    this.attendence.CheckInLatitude = this.latLong.geoLatitude;
    this.attendence.CheckInLongitude = this.latLong.geoLongitude;
    this.attendence.CheckInAddress = this.latLong.geoAddress;
    this.attendence.Accuracy = 1;
    this.attendence.Type = this.attendService.CheckStatus;
    if (this.attendence) {
      this.attendService.postItem(this.attendence).pipe(finalize(() => {
        this.loadservice.dismiss();
      })).subscribe(
        () => {
          if (this.attendence.Type === 'CheckIn') {
            this.loadservice.presentWithMessage('Record Saved Successfully');
            this.uploadImageData(formData);
          } else {
            this.loadservice.presentWithMessage('Record Updated Successfully');
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
