import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { IonicSelectableComponent } from '../../../node_modules/ionic-selectable';
import { ConveyanceService } from '../services/conveyance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Conveyance } from '../_models/conveyance';
import { isUndefined } from 'util';

@Component({
  selector: 'app-conveyance',
  templateUrl: './conveyance.page.html',
  styleUrls: ['./conveyance.page.scss'],
})

export class ConveyancePage {
  conveyanceForm: FormGroup; conveyType: { id: 0; name: ' ' }; description: string;
  conveyAmount: number = 0;
  conveyTypeList: any; numTimesLeft = 5; items = []; id: any;

  model: Conveyance = {
    visitId: 0,
    conveyTypeId: 0,
    conveyAmount: 0,
    description: ''
  };

  constructor(public navCtrl: NavController, public convservice: ConveyanceService,
    public loadingService: LoadingService, public toastService: ToastService,
    private router: ActivatedRoute, private formBuilder: FormBuilder, private routeRed: Router
  ) {
    this.id = this.router.snapshot.paramMap.get('id');
    this.ConveyanceType();
    this.GetConveyanceInfo();
    this.conveyType = { id: 0, name: ' ' };
  }
  ionViewWillEnter() {
    this.ConveyanceType();
    this.GetConveyanceInfo();
  }
  reset() {
    this.model.conveyTypeId = 0;
    this.model.conveyAmount = 0;
  }

  SetAmount(response: any) {
    this.conveyType = { id: 0, name: ' ' };
    for (var i = 0; i < this.conveyTypeList.length; i++) {
      if (response.conveyTypeId === this.conveyTypeList[i].id) {
        this.conveyType = this.conveyTypeList[i];
      }
    }
  }

  ConveyanceType() {
    this.convservice.getConveyType().subscribe(
      response => {
        this.conveyTypeList = response;
      }, error => {
        this.toastService.message(error);
      });
  }
  SaveConveyance() {
    if (this.ValidationMessage()) {
      this.model.conveyTypeId = this.conveyType.id;
      this.model.visitId = this.id;
      this.model.conveyAmount = this.conveyAmount;
      this.model.description = this.description;
      if (this.model.visitId && this.model.conveyTypeId > 0) {
        this.model.conveyTypeId = this.conveyType.id;
        this.model.visitId = this.id;
        this.model.conveyAmount = this.conveyAmount;
        this.convservice.postItem(this.model).subscribe(
          () => {
            this.toastService.message('Record Update Successfully');
            this.reset();
          }, error => {
            this.toastService.message(error);
          });
        this.routeRed.navigate(['visit-list-conveyance']);
      }
    }
  }

  ValidationMessage(): boolean {
    let flag = true;
    if (this.id === 0) {
      flag = false;
      this.toastService.message(' Please reload visit list !!');
    } else if (this.conveyType.id === 0) {
      flag = false;
      this.toastService.message(' Please select conveyance type !!');
    } else if (this.conveyAmount === 0 || this.conveyAmount.toString() === '') {
      flag = false;
      this.toastService.message(' Please fill valid amount');
    }
    return flag;
  }

  GetConveyanceInfo() {
    if (this.id > 0) {
      this.convservice.getConveyData(this.id).subscribe(
        response => {
          if (response[0]) {
            this.model.conveyTypeId = response[0].conveyTypeId.toString();
            this.conveyAmount = response[0].conveyAmount;
            this.model.conveyAmount = response[0].conveyAmount;
            this.SetAmount(response[0]);
          }
        }, error => {
          this.toastService.message(error);
        });
    } else {
      this.toastService.message('visit id not found in database !!');
    }
  }

}


