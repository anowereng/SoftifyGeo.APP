import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ToastService } from '../services/toast.service';
import { IonicSelectableComponent } from '../../../node_modules/ionic-selectable';
import { CheckIn } from '../_models/checkin';
import { CheckInService } from '../services/checkin.service';
/* Picture  */
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { isUndefined } from 'util';

import { Router } from '@angular/router';
import { GPSPermissionService } from '../services/gps-permission.service';
import { LocationCords } from '../_models/location';
import { CheckOutService } from '../services/checkout.service';
import { CheckOut } from '../_models/Checkout';


@Component({
  selector: 'app-checkinout',
  templateUrl: 'checkinout.page.html',
  styleUrls: ['checkinout.page.scss'],
})

export class CheckInOutPage {

  checkIn: CheckIn = this.defaultDataCheckIn();
  checkOutModel: CheckOut = this.defaultDataCheckOut();
  searchTerm: any = { CustId: 0, CustName: '' }; customerlist: any;
  loading: boolean = false;
  IsCheckInReady: boolean; userId: number;
  checkInInfo: any = {};
  images = [];
  locationCoords: LocationCords = {
    latitude: '',
    longitude: '',
    accuracy: '',
    timestamp: '',
    address: '',
    description: ''
  };
  constructor(public navCtrl: NavController,
    public toastService: ToastService,
    public checkInService: CheckInService,
    public camera: Camera, public file: File,
    public loadservice: LoadingService, public authservice: AuthService,
    public router: Router, public gpsService: GPSPermissionService,
    public checkOutService: CheckOutService

  ) {
    this.ResetData();
    this.GetReadyForCheckIn();
    this.checkIn.CheckInDescription = '';
    this.getGeolocation();
    this.GetLastCheckInCustomer();
  }

  ionViewDidEnter() {
    this.ResetData();
    this.GetReadyForCheckIn();
    this.checkIn.CheckInDescription = '';
    this.getGeolocation();
    this.GetLastCheckInCustomer();
  }

  defaultDataCheckIn(): CheckIn {
    return {
      CustType: 'old',
      CustId: 0,
      CustName: '',
      LUserId: 0,
      CheckInLatitude: '',
      CheckInLongitude: '',
      CheckInAddress: '',
      CheckInDescription: ''
    };
  }

  defaultDataCheckOut(): CheckOut {
    return {
      CheckOutLatitude: '',
      CheckOutLongitude: '',
      CheckOutAddress: '',
      LocationCustId: 0,
      CheckOutDescription: ''
    };
  }
  getGeolocation() {
      this.gpsService.requestGPSPermission();
      this.locationCoords = this.gpsService.getLocationCoordinates();
      this.checkIn.CheckInLatitude = this.locationCoords.latitude;
      this.checkIn.CheckInLongitude = this.locationCoords.longitude;
      this.checkIn.CheckInAddress = this.locationCoords.address;
  }

  SearchData(event) {
    if (event.text.length > 3) {
      this.checkInService.SearchData(event.text).subscribe(
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
    this.router.navigate(['/home']);
  }


  ResetData() {
    this.checkIn.CustType = 'old';
    this.checkIn.CheckInLatitude = '';
    this.checkIn.CheckInLongitude = '';
    this.checkIn.CheckInDescription = '';
    this.checkIn.CustId = 0;
    this.checkIn.CustName = '';
    this.searchTerm = { CustId: 0, CustName: '' };
    this.checkIn.CheckInDescription = '';
  }

  ResetCheckOut() {
    this.checkOutModel.CheckOutAddress = '';
    this.checkOutModel.CheckOutLatitude = '';
    this.checkOutModel.CheckOutLongitude = '';
    this.checkOutModel.CheckOutDescription = '';
    this.checkOutModel.LocationCustId = 0;
  }

  CustTypeChange() {
    this.checkIn.CustId = 0;
    this.checkIn.CustName = '';
    this.searchTerm = { CustId: 0, CustName: '' };
  }
  /* End:  ======== Image Upload Area ======== */

  SaveCheckInCustomer(formData: FormData) {
    this.getGeolocation();
    this.checkIn.CheckInLatitude = this.locationCoords.latitude;
    this.checkIn.CheckInLongitude = this.locationCoords.longitude;
    this.checkIn.CheckInAddress = this.locationCoords.address;
    this.checkIn.CheckInDescription = this.locationCoords.description;

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
    // if (this.IsCheckInReady === false) {
    //   flag = false;
    //   this.toastService.message('Please Check Out First !!');
    // }
    if (this.checkIn.CustId === 0 && this.checkIn.CustType === 'old') {
      flag = false;
      this.toastService.message('please select customer   !!');
    } else if (this.checkIn.CustName.length === 0 && this.checkIn.CustType === 'new') {
      flag = false;
      this.toastService.message('please input customer name   !!');
    } else if (this.checkIn.CustName.length <= 4 && this.checkIn.CustType === 'new') {
      flag = false;
      this.toastService.message('please use full customer name   !!');
    } else if (this.checkIn.CheckInLatitude === '' || isUndefined(this.checkIn.CheckInLatitude)
      || this.checkIn.CheckInLatitude.toString().length === 0) {
      flag = false;
      this.toastService.message('please reload tab , latitude and longitude are empty  !!');
    } else if (this.checkIn.CheckInAddress === '') {
      flag = false;
      this.toastService.message('please reload tab ,  address are empty  !!');
    } else if (this.IsCheckInReady === false && this.checkOutModel.LocationCustId === 0) {
      flag = false;
      this.toastService.message('Location CustId Not found ,  address are empty  !!');
    }
    return flag;
  }

  GetReadyForCheckIn() {
    this.IsCheckInReady = false;
    this.checkInService.GetReadyForCheckIn().subscribe(result => {
      this.ResetCheckOut();
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


  GetLastCheckInCustomer() {
    if (!this.IsCheckInReady) {
      this.checkOutService.getLastCheckOutInfo().subscribe(result => {
        if (result[0]) {
          this.checkInInfo = result[0];
        } else {
          this.checkInInfo = { CustName: '', CustType: '', CheckInLatitude: '', CheckInlongitude: '', CheckInAddress: '' };
        }
      }, error => {
        this.toastService.message(error);
      });
    }
  }

  UpdateCheckOut() {
    this.checkOutModel.LocationCustId = this.checkInInfo.LocationCustId;
    this.checkOutModel.CheckOutLatitude = this.locationCoords.latitude;
    this.checkOutModel.CheckOutLongitude = this.locationCoords.longitude;
    this.checkOutModel.CheckOutAddress = this.locationCoords.address;
    this.checkOutModel.CheckOutDescription = this.locationCoords.description;
    if (this.checkOutModel && this.checkOutModel.LocationCustId > 0) {
      this.checkOutService.postCheckOut(this.checkOutModel).subscribe(() => {
        this.toastService.message('CheckOut Updated Successfully');
        this.router.navigate(['/home']);
      }, error => {
        this.toastService.message(error);
      });
    }
  }

}


