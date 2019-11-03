import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AttendanceService } from '../services/attendance.service';
import { ToastService } from '../services/toast.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
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
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public attendService: AttendanceService,
    private toastService: ToastService,
    private helper: JwtHelperService,
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.getGeolocation();
    this.attendService.CheckInOutStatus();
  }


  //Get current coordinates of device
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

  //geocoder method to fetch address from coordinates passed as arguments
  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.geoAddress = this.generateAddress(result[0]);
      })
      .catch((error: any) => {
        alert('Error getting location' + JSON.stringify(error));
      });
  }

  //Return Comma saperated address
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


  //Start location update watch
  watchLocation() {
    this.isWatching = true;
    this.watchLocationUpdates = this.geolocation.watchPosition();
    this.watchLocationUpdates.subscribe((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.getGeoencoder(this.geoLatitude, this.geoLongitude);
    });
  }

  //Stop location update watch
  stopLocationWatch() {
    this.isWatching = false;
    this.watchLocationUpdates.unsubscribe();
  }

  PostCheckInCheckOut() {
    var userId = 0;
    if (isNullOrUndefined(this.geoAddress))
      this.geoAddress = "";
    this.attendence = {};
    this.attendence.Latitude = this.geoLatitude;
    this.attendence.Longitude = this.geoLatitude;
    this.attendence.Address = this.geoAddress;
    this.attendence.Accuracy = this.geoAccuracy;
    this.attendence.Type = this.attendService.CheckStatus;

    if (this.attendence) {
      this.attendService.postItem(this.attendence).subscribe(
        () => {
          if (this.attendence.Type == "CheckIn")
            this.toastService.message('Record Saved Successfully');
          else
            this.toastService.message('Record Updated Successfully');
          this.router.navigate(['home']);
        }, error => {
          console.log(error);
          this.toastService.message(error);
        });
    }
  }

}
