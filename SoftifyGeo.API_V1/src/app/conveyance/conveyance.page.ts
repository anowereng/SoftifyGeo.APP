import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { IonicSelectableComponent } from '../../../node_modules/ionic-selectable';
import { ConveyanceService } from '../services/conveyance.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-conveyance',
  templateUrl: './conveyance.page.html',
  styleUrls: ['./conveyance.page.scss'],
})

export class ConveyancePage implements OnInit {

  conveyTypeList: any = []; numTimesLeft = 5; items = []; id: any;
  model: any = {
    conveyTypeId: 0,
    visitId: 0
  };

  constructor(public navCtrl: NavController, public convservice: ConveyanceService,
    public loadingService: LoadingService, public toastService: ToastService, private router: ActivatedRoute) {
  }

  conveyanceSelect(event: { component: IonicSelectableComponent, value: any }) {
    event.component._searchText = '';
    // this.checkIn.CustId = 0;
    // this.checkIn.CustId = event.value.customerid;
    // this.checkIn.CustName = event.value.CustName;
  }

  ngOnInit() {
    this.id = this.router.snapshot.paramMap.get('id');
    this.ConveyanceType();
  }

  ConveyanceType() {
    this.convservice.getConveyType().subscribe(
      response => {
        this.conveyTypeList = response;
      }, error => {
        this.toastService.message(error);
      });
  }


  AddConveyance() {
    console.log(this.model);
    // if (this.checkIn) {
    //   this.checkInService.postItem(this.checkIn).subscribe(
    //     () => {
    //       this.toastService.message('Record Saved Successfully');
    //       this.checkIn = this.defaultData(); this.searchTerm.CustId = 0; this.checkIn.CustName = '';
    //       this.customerlist = [];
    //       console.log(this.checkIn);
    //     }, error => {
    //       this.toastService.message(error);
    //     });
    // }
  }
}


