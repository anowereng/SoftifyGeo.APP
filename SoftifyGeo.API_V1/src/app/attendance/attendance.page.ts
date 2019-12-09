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
import { GPSPermissionService } from '../services/gps-permission.service';
import { LocationCords } from '../_models/location';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.page.html',
  styleUrls: ['./attendance.page.scss'],
})

export class AttendancePage {
  CheckStatus: any;
  watchLocationUpdates: any;
  loading: any;
  isWatching: boolean;
  attendence: any = {};
  data = '';
  url = environment.url;
  images = [];
  locationCoords: LocationCords = {
    latitude: '',
    longitude: '',
    accuracy: '',
    timestamp: '',
    address: '',
    description: ''
  };
  constructor(
    public attendService: AttendanceService,
    private toastService: ToastService,
    private router: Router,
    private loadservice: LoadingService,
    public gpsService: GPSPermissionService,
    /* Camera  */
    private camera: Camera, private file: File,
    public authService: AuthService
  ) {
    this.attendService.CheckInOutStatus();
    this.gpsService.requestGPSPermission();
    this.locationCoords =  this.gpsService.getLocationCoordinates();
  }

  ionViewWillEnter() {
    this.attendService.CheckInOutStatus();
    this.gpsService.requestGPSPermission();
    this.locationCoords =  this.gpsService.getLocationCoordinates();
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

  getGeolocation() {
    this.gpsService.requestGPSPermission();
    this.locationCoords =  this.gpsService.getLocationCoordinates();
  }
  ValidationMessage(): boolean {
    let flag = true;
    if (this.locationCoords.longitude === '' || isNullOrUndefined(this.locationCoords.longitude)
      || this.attendence.toString().length === 0) {
      flag = false;
      this.toastService.message('please reselect menu  , latitude and longitude are empty  !!');
    }
    return flag;
  }

  getPicture() {
    if (this.ValidationMessage()) {
      this.getGeolocation();
      let options: CameraOptions = {
        quality: 100,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        targetHeight: 800, targetWidth: 800
      }
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
    if (isNullOrUndefined(this.locationCoords.address)) { this.locationCoords.address = ''; }
    this.attendence = {};
    /*gps data set */
    this.getGeolocation();
    this.attendence.CheckInLatitude = this.locationCoords.latitude;
    this.attendence.CheckInLongitude = this.locationCoords.longitude;
    this.attendence.CheckInAddress = this.locationCoords.address;
    this.attendence.Accuracy = this.locationCoords.accuracy;
      /* End: gps data set */
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