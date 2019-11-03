import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VisitService } from '../services/visit.service';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { FormControl } from '@angular/forms';
import { IonInfiniteScroll } from '@ionic/angular';
@Component({
  selector: 'app-checkincheckout-list',
  templateUrl: './checkincheckout-list.page.html',
  styleUrls: ['./checkincheckout-list.page.scss'],
})

export class CheckincheckoutListPage {
  pageIndex = 1;
  pageSize = 20;
  customerlist: any = []; searchTerm: string = ""; type: any = ""; searchChanged: any = ""; searching: any = false;
  searchControl: FormControl; customerFilterList: any = []; numTimesLeft = 5; items = [];

  constructor(public navCtrl: NavController, public visitService: VisitService,
              public loadingService: LoadingService, public toastService: ToastService) {
              this.searchControl = new FormControl();
              this.loadUsers();
  }

  loadUsers(infiniteScroll?) {
    console.log(this.searchTerm);
    this.visitService.loadUsers(this.pageIndex, this.pageSize, this.searchTerm)
      .subscribe(res => {
        this.customerlist = this.customerlist.concat(res);
        if (infiniteScroll) {
          infiniteScroll.target.complete();
        }
      });
  }

  loadMore(infiniteScroll) {
    this.pageIndex++;
    this.loadUsers(infiniteScroll);
    if (this.pageIndex === (this.loadUsers.length - this.pageSize)) {
      infiniteScroll.enable(false);
    }
  }

}
