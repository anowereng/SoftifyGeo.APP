import { Component, OnInit, OnDestroy, AfterViewInit, QueryList, ViewChild } from '@angular/core';

import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
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
  backButtonSubscription;
  @ViewChild(IonRouterOutlet, {static: true}) routerOutlet: IonRouterOutlet;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private appVersion: AppVersion,
    private backgroundMode: BackgroundMode,
    private alertCtrl: AlertController,
  ) {
    this.sideMenu();
    this.initializeApp();
  }
  ngAfterViewInit() {
    // this.backButtonSubscription = this.platform.backButton.subscribe(() => {
    //   navigator['app'].exitApp();
    // });
    this.platform.backButton.subscribe(() => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      }
       else if (this.router.url === '/home' || this.router.url === 'tabs/home') {
        this.presentAlertConfirm();
       }
      else {
        navigator['app'].exitApp();
      }
    });
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
  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm!',
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            navigator['app'].exitApp();
          }
        }
      ]
    });

    await alert.present();
  }
  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
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