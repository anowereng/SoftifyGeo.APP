import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { Platform } from '@ionic/angular';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents,
  BackgroundGeolocationMode,
} from '@ionic-native/background-geolocation/ngx';
import { BackgroundGpsService } from '../services/backgroundgps.service';
import { finalize } from 'rxjs/operators';
import { Observable } from 'Rxjs/rx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userinfo: any;
  constructor(
    private router: Router, public authService: AuthService,
    private backgroundGeolocation: BackgroundGeolocation,
    private platform: Platform,
    private backgroundMode: BackgroundMode,
    private  backGpsService: BackgroundGpsService
  ) {
    this.userinfo = this.authService.getUserInfo();
    console.log(this.userinfo);
    // this.startBackground();
  }

  logout() {
    // this.backgroundMode.disable();
    // this.backgroundGeolocation.stop();
    this.authService.logout();
  }

  checkincheckout() {
    this.router.navigateByUrl('checkincheckout');
  }

  checkincheckoutList() {
    this.router.navigateByUrl('checkincheckoutList');
  }

  attendance() {
    this.router.navigateByUrl('attendance');
  }

  goProfile() {
    this.router.navigateByUrl('info');
  }

  titleCaseWord(word: string) {
    if (!word) {
      return word;
    } else {
      return word[0].toUpperCase();
    }
  }
  startBackground() {
    this.platform.ready().then(() => {
      const config: BackgroundGeolocationConfig = {
        desiredAccuracy: 0,
        stationaryRadius: 1,
        distanceFilter: 1,
        debug: true,
        stopOnTerminate: false,
        stopOnStillActivity: true,
        interval: 300000,
        fastestInterval: 10000,
        activitiesInterval: 10000,
        startOnBoot: true
      };
      this.backgroundGeolocation.configure(config).then(() => {
        this.backgroundGeolocation
          .on(BackgroundGeolocationEvents.location)
          .subscribe((location: BackgroundGeolocationResponse) => {
            // console.log(`后台定位数据：${JSON.stringify(location)} --------回传时间：${new Date()}`);
            // let backgroundGeoLocation = JSON.stringify(location);
            // this.setLocationData(location.longitude, location.latitude, new Date());
            let address = 'hello'; //this.getGeoencoder(location.longitude, location.latitude);
            Observable.interval(10000).subscribe(() => {
              this.backGpsService.postItem({
                lat: location.latitude,
                lng: location.longitude,
                address: address,
                speed: 0,
                timestamp: new Date()
              }).pipe(finalize(() => {
              })).subscribe(
                () => {
                  console.log('save data');
                  // this.backgroundGeolocation.finish();
                }, error => {
                  console.log(error.status);
                  console.log(error.error); // error message as string
                  console.log(error.headers);
                 // this.backgroundGeolocation.stop();
                  console.log('log out !!');
                  // this.backgroundGeolocation.finish(); // FOR IOS ONLY
                });
            });
          });
      });
      // start recording location
      this.backgroundGeolocation.start();
    });
  }

  // openUrl() {
  //   this.fileOpener.showOpenWithDialog('https://softifytech.com/apps/softify.apk', 'application/vnd.android.package-archive')
  // .then(() => console.log('File is opened'))
  // .catch(e => console.log('Error opening file', e));
  // }

  // openUrl2() {
  //   this.fileOpener.open('https://softifytech.com/apps/softify.apk', 'application/pdf')
  //     .then(() => console.log('File is opened'))
  //     .catch(e => console.log('Error opening file', e));
  // }
}