import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VisitService } from '../services/visit.service';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { FormControl } from '@angular/forms';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-visit-list',
  templateUrl: './visit-list.page.html',
  styleUrls: ['./visit-list.page.scss'],
})

export class VisitListPage {

  customerlist: any = []; loading: boolean= false; searchTerm: string = ""; type: any = "old";
  searchChanged: any = ""; searching: any = false;
  searchControl: FormControl; customerFilterList: any = []; numTimesLeft = 5; items = [];

  constructor(public navCtrl: NavController, public visitService: VisitService,
                              public loadingService: LoadingService, public toastService: ToastService) {
                              this.searchControl = new FormControl();
  }

  SearchData(event) {
    console.log(event.detail.value);
    console.log(this.type);
    if (event.detail.value.length > 3 && this.type) {
      this.loading = true;
      this.visitService.getAllVisitCustomer(event.detail.value, this.type).subscribe(
        response => {
          this.customerlist = response; this.loading = false;
        }, error => {
          this.toastService.message(error);
        });
    }
  }


}
