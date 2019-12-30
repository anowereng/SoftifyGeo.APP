import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { VisitService } from '../services/visit.service';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { FormControl } from '@angular/forms';
import { IonInfiniteScroll } from '@ionic/angular';
import { FuelService } from '../services/fuel.service';
@Component({
  selector: 'app-fuellist',
  templateUrl: './fuellist.page.html',
  styleUrls: ['./fuellist.page.scss'],
})
export class FuelListPage {

  visitModel: any = {
    searchTerm: ''
  };
  customerlist: any = []; searchTerm: string = ""; type: any = ""; searchChanged: any = ""; searching: any = false;
  searchControl: FormControl; customerFilterList: any = []; numTimesLeft = 5; items = []; loading: boolean = false;

  constructor(public navCtrl: NavController, public fuelservice: FuelService,
              public loadingService: LoadingService, public toastService: ToastService,
  ) {
  }
  ionViewDidEnter() {
    this.searchControl = new FormControl();
    this.fuellist();
  }

  fuellist() {
    if (navigator.onLine) {
      this.loading = true;
      this.fuelservice.loadfuel(this.visitModel.searchTerm).subscribe(
        response => {
          this.customerlist = response; this.loading = false;
        }, error => {
          this.toastService.message(error);
        });
    } else {
      this.toastService.showLoader('please check internet connection !!');
    }
  }




}







