import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-checkinout',
  templateUrl: 'checkinout.page.html',
  styleUrls: ['checkinout.page.scss'],
})
export class CheckInOutPage {

  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy: number;
  geoAddress: string;

  watchLocationUpdates: any;
  loading: any;
  isWatching: boolean;
  spinnerActive: boolean = false;
  // Geocoder configuration
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private toastService: ToastService,
  ) {
    this.getGeolocation();
  }


  ionViewDidEnter() {
    this.getGeolocation();
  }
  // Get current coordinates of device
  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.geoAccuracy = resp.coords.accuracy;
      this.getGeoencoder(this.geoLatitude, this.geoLongitude);
    }).catch((error) => {
      this.toastService.message('Error getting location' + JSON.stringify(error));
    });
  }

  // geocoder method to fetch address from coordinates passed as arguments
  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.geoAddress = this.generateAddress(result[0]);
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
      if (obj[val].length) {
        address += obj[val] + ', ';
      }

    }
    return address.slice(0, -2);
  }


  // Start location update watch
  watchLocation() {
    this.isWatching = true;
    this.spinnerActive = true;
    this.watchLocationUpdates = this.geolocation.watchPosition();
    this.watchLocationUpdates.subscribe((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude;
      this.getGeoencoder(this.geoLatitude, this.geoLongitude);
    });
    this.spinnerActive = false;
  }

  // Stop location update watch
  stopLocationWatch() {
    this.isWatching = false;
    this.watchLocationUpdates.unsubscribe();
  }
}


