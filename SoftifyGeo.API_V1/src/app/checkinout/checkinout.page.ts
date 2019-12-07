import { Component } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { ToastService } from '../services/toast.service';
import { Platform, NavController } from '@ionic/angular';


import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';


@Component({
  selector: 'app-checkinout',
  templateUrl: 'checkinout.page.html',
  styleUrls: ['checkinout.page.scss'],
})
export class CheckInOutPage {

  locationCoords: any;

  geoLatitude: number;
  geoLongitude: number;

  geoLatitude1: number;
  geoLongitude1: number;

  geoLatitude2: number;
  geoLongitude2: number;

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
    private platform: Platform,
    public navCtrl: NavController, private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy
  ) {
     this.locationCoords = {
      latitude: "",
      longitude: "",
      accuracy: "",
      timestamp: "",
      address: ""
    }
  }


    // Check if application having GPS access permission  
    checkGPSPermission() {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
        result => {
          if (result.hasPermission) {
            // If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS();
          } else {
            // If not having permission ask for permission
            this.requestGPSPermission();
          }
        },
        err => {
          alert(err);
        }
      );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        // Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              // Show alert if user click on 'No Thanks'
              alert('requestPermission Error requesting location permissions ' + error)
            }
          );
      }
    });
  }
 
  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.getLocationCoordinates();
      },
      error => alert('Error requesting location permissions ' + JSON.stringify(error))
    );
  }

   /* geocoder method to fetch address from coordinates passed as arguments   */
   getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.locationCoords.address = this.generateAddress(result[0]);
      })
      .catch((error: any) => {
        // this.toastService.message('Error getting location' + JSON.stringify(error));
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

 
  // Methos to get device accurate coordinates using device GPS
  getLocationCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.locationCoords.latitude = resp.coords.latitude;
      this.locationCoords.longitude = resp.coords.longitude;
      this.locationCoords.accuracy = resp.coords.accuracy;
      this.locationCoords.timestamp = resp.timestamp;
      this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      alert('Error getting location' + error);
    });
  }
}


