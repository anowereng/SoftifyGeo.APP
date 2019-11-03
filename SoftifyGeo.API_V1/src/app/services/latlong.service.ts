import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AttendanceService } from './attendance.service';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root'
})
export class LatLongService {
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
        private toastService: ToastService
    ) { }

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


   /* geocoder method to fetch address from coordinates passed as arguments   */
  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.geoAddress = this.generateAddress(result[0]);
      })
      .catch((error: any) => {
        this.toastService.message('Error getting location' + JSON.stringify(error));
      });
  }

    /* Return Comma saperated address */
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


  /*Start location update watch */
  watchLocation() {
    this.isWatching = true;
    this.watchLocationUpdates = this.geolocation.watchPosition();
    this.watchLocationUpdates.subscribe((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
    });
    }
  //Stop location update watch
  stopLocationWatch() {
    this.isWatching = false;
    this.watchLocationUpdates.unsubscribe();
  }

}
