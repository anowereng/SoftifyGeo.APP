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
  constructor(public navCtrl: NavController, public checkInOutService: CheckincheckoutService,
              public toastService: ToastService, public latLong: LatLongService,
              public checkInService: CheckInService,
              private camera: Camera, private file: File,
              private loadservice: LoadingService, public authservice: AuthService
  ) {
    this.latLong.watchLocation();
    this.GetReadyForCheckIn();
    this.ResetData();
  }

  ionViewWillEnter() {
    this.latLong.watchLocation();
    this.GetReadyForCheckIn();
    this.checkIn.CheckInLatitude = this.latLong.geoLatitude;
    this.checkIn.CheckInLongitude = this.latLong.geoLongitude;
    this.checkIn.CheckInAddress = this.latLong.geoAddress;
    this.ResetData();
  }
  defaultData(): CheckIn {
    return {
      CustType: 'old',
      CustId: 0,
      CustName: '',
      LUserId: 0,
      CheckInLatitude: this.latLong.geoLatitude,
      CheckInLongitude: this.latLong.geoLongitude,
      CheckInAddress: this.latLong.geoAddress
    };
  }

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
  }


  ResetData() {
    this.checkIn = this.defaultData();
    this.checkIn.CustId = 0;
    this.checkIn.CustName = '';
    this.searchTerm = { CustId: 0, CustName: '' };
  }
  CustTypeChange() {
    this.checkIn.CustId = 0;
    this.checkIn.CustName = '';
    this.searchTerm = { CustId: 0, CustName: '' };
  }
  /* End:  ======== Image Upload Area ======== */

  SaveCheckInCustomer(formData: FormData) {
    this.latLong.getGeolocation();
    this.checkIn.CheckInLatitude = this.latLong.geoLatitude;
    this.checkIn.CheckInLongitude = this.latLong.geoLongitude;
    this.checkIn.CheckInAddress = this.latLong.geoAddress;
    if (this.checkIn) {
      this.checkInService.postItem(this.checkIn).subscribe(
        () => {
          this.toastService.message('Record Saved Successfully');
          this.uploadImageData(formData);
          this.ResetData();
          this.customerlist = [];
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
