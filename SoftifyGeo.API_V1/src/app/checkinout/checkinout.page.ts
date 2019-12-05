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
  location: any;
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
    this.onLocateUser();
  }


  ionViewDidEnter() {
    this.onLocateUser();
  }
  onLocateUser() {
    this.geolocation.getCurrentPosition()
      .then(
        (location) => {
          console.log('position gotten: long:', location.coords.longitude, ' lat:', location.coords.latitude);
          this.location = location;
          this.geoLatitude = location.coords.latitude;
          this.geoLatitude = location.coords.longitude;
        }
      )
      .catch(
        (error) => {
          this.toastService.message('Error getting location ' + error);
        }
      );
  }
}


