import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CheckInService } from '../services/checkin.service';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';
import { LoadingService } from '../services/loading.service';
import { VisitDay } from '../_models/visitday';

@Component({
  selector: 'app-checkincheckout',
  templateUrl: './checkincheckout.page.html',
  styleUrls: ['./checkincheckout.page.scss'],
})
export class CheckincheckoutPage {

  IsCheckInReady: boolean = false; visitday: VisitDay = {
    newcust: 0,
    oldcust: 0,
    total: 0
  };

  defaultdata() {
    return {
      newcust: 0,
      oldcust: 0,
      total: 0
    };
  }

  constructor(
    public authservice: AuthService,
    private checkInService: CheckInService,
    private toastService: ToastService,
    private router: Router,
    private loadservice: LoadingService
  ) {
    this.GetReadyForCheckIn();
    this.GetVisitDay();
  }

  ionViewWillEnter() {
    this.GetReadyForCheckIn();
    this.GetVisitDay();
    this.defaultdata();
  }

  logout() {
    this.authservice.logout();
  }

  GetReadyForCheckIn() {
    this.loadservice.present();
    this.IsCheckInReady = false;
    this.checkInService.GetReadyForCheckIn().subscribe(result => {
      this.IsCheckInReady = Boolean(result);
      if (result === false) {
        this.toastService.message('Please Check Out  !!');
      }
    }, error => {
      this.toastService.message(error);
    });
    this.loadservice.dismiss();
  }

  GetVisitDay() {
    this.loadservice.present();
    this.IsCheckInReady = false;
    this.checkInService.GetVisitDataDay().subscribe(result => {
      this.visitday = result[0];
      if (result === false) {
        this.toastService.message('Please Check Out  !!');
      }
    }, error => {
      this.toastService.message(error);
    });
    this.loadservice.dismiss();
  }



  GetRouteForCheckInOut(flag) {
    if (this.IsCheckInReady === false) {
      if (flag === 'checkout') {
        this.router.navigate(['/tabcheckout']);
      } else {
        this.toastService.message('please check out ');
      }
    } else if (this.IsCheckInReady === true) {
      if (flag === 'checkin') {
        this.router.navigate(['/tabcheckin']);
      } else {
        this.toastService.message(' already check out, please check in ');
      }
    }
  }



}





