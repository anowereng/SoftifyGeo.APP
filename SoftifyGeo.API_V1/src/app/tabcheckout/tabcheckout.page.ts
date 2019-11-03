import { Component } from '@angular/core';
import { CheckOutService } from '../services/checkout.service';
import { ToastService } from '../services/toast.service';
import { CheckOut } from '../_models/Checkout';
import { LatLongService } from '../services/latlong.service';

@Component({
  selector: 'app-tabcheckout',
  templateUrl: './tabcheckout.page.html',
  styleUrls: ['./tabcheckout.page.scss'],
})
export class TabcheckoutPage  {

  checkInInfo: any = {}; checkOut: CheckOut; checkOutModel: CheckOut = this.defaultData();
  constructor(private checkOutService: CheckOutService, private toastService: ToastService,
              private latLong: LatLongService) { }

  ionViewWillEnter() {
    this.latLong.getGeolocation();
    this.GetLastCheckInCustomer();
  }
  defaultData(): CheckOut {
    return {
      CheckOutLatitude: 0,
      CheckOutLongitude: 0,
      CheckOutAddress: '',
      LocationCustId: 0
    };
  }

  GetLastCheckInCustomer() {
    this.checkOutService.getLastCheckOutInfo().subscribe(result => {
      this.checkInInfo = result[0];
    }, error => {
      this.toastService.message(error);
    });
  }


  UpdateCheckOut() {
    this.checkOutModel.LocationCustId = this.checkInInfo.LocationCustId;
    this.checkOutModel.CheckOutLatitude = this.latLong.geoLatitude;
    this.checkOutModel.CheckOutLongitude = this.latLong.geoLongitude;
    this.checkOutModel.CheckOutAddress = this.latLong.geoAddress;
    if (this.checkOutModel && this.checkOutModel.LocationCustId > 0) {
      this.checkOutService.postCheckOut(this.checkOutModel).subscribe(() => {
        this.toastService.message('CheckOut Updated Successfully');
        this.GetLastCheckInCustomer();
      }, error => {
        this.toastService.message(error);
      });
    }
  }
}
