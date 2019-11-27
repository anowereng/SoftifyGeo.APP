import { Component, OnInit } from '@angular/core';
import { CheckincheckoutService } from '../checkincheckout/checkincheckout.service';
import { NavController } from '@ionic/angular';
import { ToastService } from '../services/toast.service';
import { IonicSelectableComponent } from '../../../node_modules/ionic-selectable';
import { CheckIn } from '../_models/checkin';
import { LatLongService } from '../services/latlong.service';
import { CheckInService } from '../services/checkin.service';
/* Picture  */
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { isUndefined } from 'util';
/*GEO */
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tabcheckin',
  templateUrl: './tabcheckin.page.html',
  styleUrls: ['./tabcheckin.page.scss'],
})
export class TabcheckinPage {

  checkIn: CheckIn = this.defaultData();
  searchTerm: any = { CustId: 0, CustName: '' }; customerlist: any; loading: boolean = false;
  IsCheckInReady: boolean; userId: number;
  images = [];
  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy: number;
  geoAddress: string;
  watchLocationUpdates: any;
  isWatching: boolean;
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  constructor(public navCtrl: NavController, public checkInOutService: CheckincheckoutService,
              public toastService: ToastService,
              public checkInService: CheckInService,
              private camera: Camera, private file: File,
              private loadservice: LoadingService, public authservice: AuthService,
              private geolocation: Geolocation,
              private nativeGeocoder: NativeGeocoder,
              private router: Router

  ) {
    this.ResetData();
    this.GetReadyForCheckIn();
    this.getGeolocation();
    this.checkIn.CheckInDescription = '';
  }


  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.checkIn.CheckInLatitude = resp.coords.latitude;
      this.checkIn.CheckInLongitude = resp.coords.longitude;
      this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      this.toastService.message('Error getting location' + JSON.stringify(error));
    });
  }

  // ionViewDidEnter() {
  //   this.checkIn.CustType = 'old';
  //   this.checkIn.CheckInLatitude = 0;
  //   this.checkIn.CheckInLongitude = 0;
  //   this.checkIn.CheckInDescription = '';
  //   this.checkIn.CustId = 0;
  //   this.checkIn.CustName = '';
  //   this.searchTerm = { CustId: 0, CustName: '' };
  //   this.checkIn.CheckInDescription = '';
  // }
  ionViewWillEnter() {
    this.ResetData();
    this.GetReadyForCheckIn();
    this.getGeolocation();
    this.checkIn.CheckInDescription = '';

  }
  defaultData(): CheckIn {
    return {
      CustType: 'old',
      CustId: 0,
      CustName: '',
      LUserId: 0,
      CheckInLatitude: 0,
      CheckInLongitude: 0,
      CheckInAddress: '',
      CheckInDescription: ''
    };
  }
  // Get current coordinates of device
  // setgeo() {
  //   this.getGeolocation();
  //   this.checkIn.CheckInLatitude = this.geoLatitude;
  //   this.checkIn.CheckInLongitude = this.geoLongitude;
  //   this.checkIn.CheckInAddress = this.geoAddress;
  // }
  location() {
    this.router.navigate(['checkincheckout/tabcheckin']);
  }

  // geocoder method to fetch address from coordinates passed as arguments
  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.checkIn.CheckInAddress = this.generateAddress(result[0]);
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

  // //Start location update watch
  // watchLocation() {
  //   this.isWatching = true;
  //   this.watchLocationUpdates = this.geolocation.watchPosition();
  //   this.watchLocationUpdates.subscribe((resp) => {
  //     this.geoLatitude = resp.coords.latitude;
  //     this.geoLongitude = resp.coords.longitude;
  //     this.getGeoencoder(this.geoLatitude, this.geoLongitude);
  //   });
  // }

  // //Stop location update watch
  // stopLocationWatch() {
  //   this.isWatching = false;
  //   this.watchLocationUpdates.unsubscribe();
  // }

  SearchData(event) {
    if (event.text.length > 3) {
      this.checkInOutService.SearchData(event.text).subscribe(
        response => {
          this.customerlist = response;
        }, error => {
          this.toastService.message(error);
        });
    }
  }

  customerSelect(event: { component: IonicSelectableComponent, value: any }) {
    event.component._searchText = '';
    this.checkIn.CustId = 0;
    this.checkIn.CustId = event.value.customerid;
    this.checkIn.CustName = event.value.CustName;
  }

  /* ======== Image Upload Area ======== */
  readFile(file: any) {
    this.toastService.message('Reading...');
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      formData.append('file', imgBlob, file.name);
      this.SaveCheckInCustomer(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  getPicture() {
    if (this.ValidationMessage()) {
      var options: CameraOptions = {
        quality: 100,
        sourceType: this.camera.PictureSourceType.CAMERA,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };
      this.camera.getPicture(options).then(imagePath => {
        this.images = [];
        let newEntry = {
          name: 'checkin',
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
    this.checkInService.uploadImage(formData).pipe(finalize(() => {
      this.loadservice.dismiss();
    })).subscribe(res => {
      this.toastService.message('File Upload Successfully');
    }, error => {
      this.toastService.message(error);
    });
    this.router.navigate(['home']);
  }


  ResetData() {
    this.checkIn.CustType = 'old';
    this.checkIn.CheckInLatitude = 0;
    this.checkIn.CheckInLongitude = 0;
    this.checkIn.CheckInDescription = '';
    this.checkIn.CustId = 0;
    this.checkIn.CustName = '';
    this.searchTerm = { CustId: 0, CustName: '' };
    this.checkIn.CheckInDescription = '';
  }
  CustTypeChange() {
    this.checkIn.CustId = 0;
    this.checkIn.CustName = '';
    this.searchTerm = { CustId: 0, CustName: '' };
  }
  /* End:  ======== Image Upload Area ======== */

  SaveCheckInCustomer(formData: FormData) {
    this.getGeolocation();
    console.log(this.checkIn);
    if (this.ValidationMessage()) {
      this.checkInService.postItem(this.checkIn).subscribe(
        () => {
          console.log(this.checkIn);
          this.toastService.message('Record Saved Successfully');
          this.uploadImageData(formData);
          this.ResetData();
        }, error => {
          this.toastService.message(error);
        });
    }
  }

  ValidationMessage(): boolean {
    let flag = true;
    if (this.IsCheckInReady === false) {
      flag = false;
      this.toastService.message('Please Check Out First !!');
    } else if (this.checkIn.CustId === 0 && this.checkIn.CustType === 'old') {
      flag = false;
      this.toastService.message('please select customer   !!');
    } else if (this.checkIn.CustName.length === 0 && this.checkIn.CustType === 'new') {
      flag = false;
      this.toastService.message('please input customer name   !!');
    } else if (this.checkIn.CustName.length <= 4 && this.checkIn.CustType === 'new') {
      flag = false;
      this.toastService.message('please use full customer name   !!');
    } else if (this.checkIn.CheckInLatitude === 0 || isUndefined(this.checkIn.CheckInLatitude)
      || this.checkIn.CheckInLatitude.toString().length === 0) {
      flag = false;
      this.toastService.message('please reload tab , latitude and longitude are empty  !!');
    } else if (this.checkIn.CheckInAddress === '') {
      flag = false;
      this.toastService.message('please reload tab , check in address are empty  !!');
    }
    return flag;
  }

  GetReadyForCheckIn() {
    this.IsCheckInReady = false;
    this.checkInService.GetReadyForCheckIn().subscribe(result => {
      this.IsCheckInReady = Boolean(result);
      if (result === false) {
        this.toastService.message('Please Check Out First !!');
      }
    }, error => {
      this.toastService.message(error);
    });
  }

  custTypeChange() {
    this.searchTerm.CustId = 0;
  }

  checkValidation(): boolean {
    let flag = true;
    if ((this.IsCheckInReady)) {
      flag = false;
    }
    return flag;
  }

}
