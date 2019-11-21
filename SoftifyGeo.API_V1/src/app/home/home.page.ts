import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userinfo: any;
  constructor(private router: Router, public authService: AuthService,
  ) {
    this.userinfo = this.authService.getUserInfo();
    console.log(this.userinfo);
  }

  logout() {
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
