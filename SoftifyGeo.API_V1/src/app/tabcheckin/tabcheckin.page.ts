import { Component, OnInit } from '@angular/core';
import { CheckincheckoutService } from '../checkincheckout/checkincheckout.service';
import { NavController } from '@ionic/angular';
import { ToastService } from '../services/toast.service';
import { IonicSelectableComponent } from '../../../node_modules/ionic-selectable';
import { CheckIn } from '../_models/checkin';
import { LatLongService } from '../services/latlong.service';
import { CheckInService } from '../services/checkin.service';
@Component({
  selector: 'app-tabcheckin',
  templateUrl: './tabcheckin.page.html',
  styleUrls: ['./tabcheckin.page.scss'],
})
export class TabcheckinPage {

  checkIn: CheckIn = this.defaultData();
  searchTerm: any = ''; customerlist: any;
  IsCheckInReady: any; userId: number;
  constructor(public navCtrl: NavController, public checkInOutService: CheckincheckoutService,
              public toastService: ToastService, public latLong: LatLongService,
              public checkInService: CheckInService) {
  }

  ionViewWillEnter() {
    this.latLong.getGeolocation();
    this.GetReadyForCheckIn();
  }
  defaultData(): CheckIn {
    return {
      CustType: 'old',
      CustId: 0,
      CustName: '',
      LUserId: 0,
      CheckInLatitude: 0,
      CheckInLongitude: 0,
      CheckInAddress: ''
    };
  }

  SearchData(event) {
    console.log(event.text);
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

  SaveCheckInCustomer() {
    this.latLong.getGeolocation();
    this.checkIn.CheckInLatitude = this.latLong.geoLatitude;
    this.checkIn.CheckInLongitude = this.latLong.geoLongitude;
    this.checkIn.CheckInAddress = this.latLong.geoAddress;
    if (this.checkIn) {
      this.checkInService.postItem(this.checkIn).subscribe(
        () => {
          this.toastService.message('Record Saved Successfully');
          this.checkIn = this.defaultData(); this.searchTerm.CustId = 0; this.checkIn.CustName = '';
          this.customerlist = [];
          console.log(this.checkIn);
        }, error => {
          this.toastService.message(error);
        });
      this.GetReadyForCheckIn();
    }
  }

  GetReadyForCheckIn() {
    this.checkInService.GetReadyForCheckIn().subscribe(result => {
      this.IsCheckInReady = result;
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
    if (this.searchTerm.CustId === 0 || this.checkIn.CustName.length === 0 || this.IsCheckInReady === false) {
      flag = false;
    }
    return flag;
  }

}
