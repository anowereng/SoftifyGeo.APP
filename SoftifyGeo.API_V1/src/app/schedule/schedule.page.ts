import { Component, OnInit } from '@angular/core';
import { FileOpener } from '@ionic-native/file-opener/ngx';
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {

  constructor(private fileOpener: FileOpener) { }

  ngOnInit() {
  }

  open1() {
    this.fileOpener.open('https://softifytech.com/apps/softify.apk', 'application/pdf')
  .then(() => console.log('File is opened'))
  .catch(e => console.log('Error opening file', e));
  }
  open2() {
    this.fileOpener.open('https://softifytech.com/apps/softify.apk', ' application/vnd.android.package-archive')
  .then(() => console.log('File is opened'))
  .catch(e => console.log('Error opening file', e));
  }


}
