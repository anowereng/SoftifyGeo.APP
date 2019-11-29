import { Component, OnInit } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  public app_version: string;
  constructor(private appVersion: AppVersion) { }

  ngOnInit() {
    this.appVersion.getVersionNumber().then(
      (versionNumber) => {
        this.app_version = versionNumber;
      },
      (error) => {
        console.log(error);
      });
  }
}
