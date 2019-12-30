import { Injectable } from '@angular/core';

import { AttendanceService } from './attendance.service';
import { ToastService } from './toast.service';
import { Platform, NavController, AlertController } from '@ionic/angular';

/* location */
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { LocationCords } from '../_models/location';
import { ThrowStmt } from '@angular/compiler';
import { LoadingService } from './loading.service';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GPSPermissionService {
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

  locationCoords: LocationCords = {
    latitude: "",
    longitude: "",
    accuracy: "",
    timestamp: "",
    address: "",
    description: ''
  };

  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private toastService: ToastService,
    public navCtrl: NavController, private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private loaderservice: LoadingService,
    private alertController: AlertController
  ) {
    this.locationCoords = {
      latitude: '',
      longitude: '',
      accuracy: '',
      timestamp: '',
      address: '',
      description: ''
    };
  }

  // Methos to get device accurate coordinates using device GPS
  getLocationCoordinates(): LocationCords {

    if (navigator.onLine) {
      this.loaderservice.present();
      this.geolocation.getCurrentPosition(
        {
          maximumAge: 1000, timeout: 15000,
          enableHighAccuracy: true
        }
      ).then((resp) => {
        this.loaderservice.dismiss();
        this.locationCoords.latitude = resp.coords.latitude.toString();
        this.locationCoords.longitude = resp.coords.longitude.toString();
        this.locationCoords.accuracy = resp.coords.accuracy.toString();
        this.locationCoords.timestamp = resp.timestamp.toString();
        this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
      }, error => {
          this.loaderservice.dismiss();
          if (!navigator.onLine) {
            this.showLoader('please check internet connection !!');
          } else {
            this.showLoader('can not retriebe location !! try again');
          }
      })
        .catch((error) => {
          console.log('Error getting location' + error);
        });
    } else {
      this.showLoader('please check internet connection !!');
    }
    return this.locationCoords;
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
              console.log('requestPermission Error requesting location permissions ' + error);
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
      error => console.log('Error requesting location permissions ' + JSON.stringify(error))
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

  async showLoader(msg) {
    const alert = await this.alertController.create({
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }
}
