import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';
import { IonicSelectableComponent } from '../../../node_modules/ionic-selectable';
import { ConveyanceService } from '../services/conveyance.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Conveyance } from '../_models/conveyance';
import { AuthService } from '../services/auth.service';

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
              private router: ActivatedRoute, private formBuilder: FormBuilder,
              public authservice: AuthService
  ) {
  }

  conveyanceSelect(event: { component: IonicSelectableComponent, value: any }) {
    // event.component._searchText = '';
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

    this.model.conveyTypeId = this.conveyanceForm.value.conveyType.Id;
    this.model.visitId = this.id;
    this.model.conveyAmount = this.conveyanceForm.value.conveyAmount;
    if (this.conveyanceForm && this.model.visitId && this.model.conveyTypeId > 0) {
      this.model.conveyTypeId = this.conveyanceForm.value.conveyType.Id;
      this.model.visitId = this.id;
      this.model.conveyAmount = this.conveyanceForm.value.conveyAmount;
      this.convservice.postItem(this.model).subscribe(
        () => {
          this.toastService.message('Record Saved Successfully');
          this.conveyanceForm.reset();
        }, error => {
          this.toastService.message(error);
        });
    }
  }
}


