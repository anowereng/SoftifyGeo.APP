import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VisitService } from '../services/visit.service';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { DatePipe } from '@angular/common';
import { DatePickerService } from '../services/common/datepricker.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-visit-list-conveyance',
  templateUrl: './visit-list-conveyance.page.html',
  styleUrls: ['./visit-list-conveyance.page.scss'],
})

export class VisitListConveyancePage {

  visitModel: any = {
    dtFrom: this.datpickerService.selectedDate(),
    dtTo: this.datpickerService.selectedDate(),
    type: 'all',
    searchTerm: ''
  };
  datePickerObj: any = {};
  customerlist: any = []; loading: boolean = false;

  customerFilterList: any = []; numTimesLeft = 5; items = [];
  // datePickerObj: any = {};
  selectedDate;
  constructor(public navCtrl: NavController, public visitService: VisitService,
              public loadingService: LoadingService, public toastService: ToastService, public datepipe: DatePipe,
              private datpickerService: DatePickerService, private router: Router, public authservice: AuthService) {

  }

  ionViewDidEnter() {
    this.datePickerObj = this.datpickerService.GetDatePickerObj();
    this.SearchData();
  }
  SearchData() {
    if (navigator.onLine) {
      if (this.visitModel) {
        this.loading = true;
        this.visitService.getAllVisitCustomer(this.visitModel.searchTerm, this.visitModel).subscribe(
          response => {
            this.customerlist = response; this.loading = false;
          }, error => {
            this.toastService.message(error);
          });
      }
    } else {
      this.toastService.showLoader('please check internet connection !!');
    }
  }

  RouteConveyance(checkoutdata, locationCustId) {
    if (checkoutdata.length > 0 && locationCustId > 0) {
      this.router.navigate(['/', 'conveyance', locationCustId]);
    } else {
      this.toastService.message('Please complete check out !!');
    }
  }

}
