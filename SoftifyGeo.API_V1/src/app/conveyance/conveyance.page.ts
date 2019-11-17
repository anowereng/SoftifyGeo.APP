import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { IonicSelectableComponent } from '../../../node_modules/ionic-selectable';
import { ConveyanceService } from '../services/conveyance.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Conveyance } from '../_models/conveyance';

@Component({
  selector: 'app-conveyance',
  templateUrl: './conveyance.page.html',
  styleUrls: ['./conveyance.page.scss'],
})

export class ConveyancePage implements OnInit {
  conveyanceForm: FormGroup; conveyType: any;
  conveyTypeList: any = []; numTimesLeft = 5; items = []; id: any;
  model: Conveyance = {
    visitId: 0,
    conveyTypeId: 0,
    conveyAmount: 0
  };

  constructor(public navCtrl: NavController, public convservice: ConveyanceService,
              public loadingService: LoadingService, public toastService: ToastService,
              private router: ActivatedRoute, private formBuilder: FormBuilder, private routeRed: Router
  ) {
  }

  conveyanceSelect(event: { component: IonicSelectableComponent, value: any }) {
    console.log(event);
    this.model.visitId = event.value.Id;
  }

  ngOnInit() {
    this.id = this.router.snapshot.paramMap.get('id');
    this.ConveyanceType();

    this.conveyanceForm = this.formBuilder.group({
      conveyType: ['', [Validators.required]],
      visitId: [this.id],
      conveyAmount: ['', [Validators.required, Validators.minLength(2)]]
    });
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
    if (this.ValidationMessage) {
      this.model.conveyTypeId = this.conveyanceForm.value.conveyType.Id;
      this.model.visitId = this.id;
      this.model.conveyAmount = this.conveyanceForm.value.conveyAmount;
      if (this.conveyanceForm && this.model.visitId && this.model.conveyTypeId > 0) {
        this.model.conveyTypeId = this.conveyanceForm.value.conveyType.Id;
        this.model.visitId = this.id;
        this.model.conveyAmount = this.conveyanceForm.value.conveyAmount;
        this.convservice.postItem(this.model).subscribe(
          () => {
            this.toastService.message('Record Update Successfully');
            this.conveyanceForm.reset();
            this.routeRed.navigate(['visit-list-conveyance']);
          }, error => {
            this.toastService.message(error);
          });
      }
    } else {
      this.routeRed.navigate(['visit-list-conveyance']);
    }
  }


  ValidationMessage(): boolean {
    let flag = true;
    if (this.model.visitId === 0) {
      flag = false;
      this.toastService.message('Please reload visit list !!');
    }
    return flag;
  }
}


