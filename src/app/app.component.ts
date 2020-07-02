import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { TabsPage } from './tabs/tabs.page';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  gps_update_link: string = 'http://acltrackerapi.softifytech.com/api/BackgroundLocation';

  navigate: any; rootPage: any = TabsPage;

  public app_version: string;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private appVersion: AppVersion,
    private backgroundMode: BackgroundMode
  ) {
    this.sideMenu();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.authService.authenticationState.subscribe(state => {
        if (state) {
          // this.backgroundMode.enable();
          // this.backgroundMode.on("activate").subscribe(() => {
          //   this.backgroundMode.disableWebViewOptimizations();
          // });
          this.router.navigate(['tabs/home']);
        } else {
          this.router.navigate(['login']);
        }
      });

    });
    this.appVersion.getVersionNumber().then(
      (versionNumber) => {
        this.app_version = versionNumber;
        console.log(this.app_version);
      },
      (error) => {
        console.log(error);
      });
  }

  sideMenu() {
    this.navigate =
      [
        {
          title: 'Attendance',
          url: '/attendance',
          icon: 'fingerprint'
        },
        {
          title: 'Visit',
          url: '/checkincheckout',
          icon: 'map-marked-alt'
        },
        {
          title: 'Visit List',
          url: '/visit-list',
          icon: 'route'
        },
        {
          title: 'Conveyance',
          url: '/visit-list-conveyance',
          icon: 'money-check'
        },
        {
          title: 'Schedule',
          url: '/schedule',
          icon: 'tasks'
        },
        {
          title: 'Settings',
          url: '/settings',
          icon: 'cogs'
        },

      ];
  }
  logout() {
    this.authService.logout();
  }
}