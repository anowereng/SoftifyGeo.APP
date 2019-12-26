import { Component } from '@angular/core';
import { CheckOutService } from '../services/checkout.service';
import { ToastService } from '../services/toast.service';
import { CheckOut } from '../_models/Checkout';
import { LocationCords } from '../_models/location';
import { GPSPermissionService } from '../services/gps-permission.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabcheckout',
  templateUrl: './tabcheckout.page.html',
  styleUrls: ['./tabcheckout.page.scss'],
})
export class TabcheckoutPage {
  checkInInfo: any = {}; checkOut: CheckOut; checkOutModel: CheckOut = this.defaultData();
  locationCoords: LocationCords = {
    latitude: '',
    longitude: '',
    accuracy: '',
    timestamp: '',
    address: '',
    description: ''
  };
  constructor(
              private checkOutService: CheckOutService, private toastService: ToastService,
              private latLong: GPSPermissionService, private navCtrl: NavController
  ) { }

  ionViewDidEnter() {
    this.latLong.requestGPSPermission();
    this.locationCoords = this.latLong.getLocationCoordinates();
    this.GetLastCheckInCustomer();
  }
  defaultData(): CheckOut {
    return {
      CheckOutLatitude: '',
      CheckOutLongitude: '',
      CheckOutAddress: '',
      LocationCustId: 0,
      CheckOutDescription: ''
    };
  }

  GetLastCheckInCustomer() {
    if (navigator.onLine) {
      this.checkOutService.getLastCheckOutInfo().subscribe(result => {
        if (result[0]) {
          this.checkInInfo = result[0];
        } else {
          this.checkInInfo = { CustName: '', CustType: '', CheckInLatitude: '', CheckInlongitude: '', CheckInAddress: '' };
        }
      }, error => {
        this.toastService.message(error);
      });
    } else {
      this.toastService.showLoader('please check internet connection !!');
    }
  }

  UpdateCheckOut() {
    this.latLong.requestGPSPermission();
    this.locationCoords = this.latLong.getLocationCoordinates();
    this.checkOutModel.LocationCustId = this.checkInInfo.LocationCustId;
    this.checkOutModel.CheckOutLatitude = this.locationCoords.latitude;
    this.checkOutModel.CheckOutLongitude = this.locationCoords.longitude;
    this.checkOutModel.CheckOutAddress = this.locationCoords.address;
    if (this.checkOutModel && this.checkOutModel.LocationCustId > 0) {
      this.checkOutService.postCheckOut(this.checkOutModel).subscribe(() => {
        this.toastService.message('CheckOut Updated Successfully');
        this.navCtrl.navigateRoot('/tabs/home');
      }, error => {
        this.toastService.message(error);
      });
    }
  }
}
