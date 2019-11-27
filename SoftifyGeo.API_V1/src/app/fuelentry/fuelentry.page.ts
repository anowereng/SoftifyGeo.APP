import { Component } from '@angular/core';
import { FuelService } from '../services/fuel.service';
import { ToastService } from '../services/toast.service';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { environment } from 'src/environments/environment';

import { AuthService } from '../services/auth.service';
import { DatePickerService } from '../services/common/datepricker.service';

@Component({
  selector: 'app-fuelentry',
  templateUrl: './fuelentry.page.html',
  styleUrls: ['./fuelentry.page.scss'],
})

export class FuelEntryPage {
  public datePickerObj: any = {};
   constructor(
     public fuelService: FuelService,
     // private formBuilder: FormBuilder,
     // private fuelForm: FormGroup,
     private toastService: ToastService,
     private authService: AuthService,
     private datpickerService: DatePickerService
   ) {
     // this.fuelForm = this.formBuilder.group({
     //   dtFuel: ['', [Validators.required]],
     //   Description: ['', [Validators.required]],
     //   FuelAmount: ['', [Validators.required]],
     // });
     this.datePickerObj = this.datpickerService.GetDatePickerObj();
   }
 
 
   public fuelModel: any = {
     dtFuel: this.datpickerService.selectedDate(),
     Description: '',
     FuelAmount: ''
   };
 
   ionViewDidEnter() {
 
   }
 
   // Get current coordinates of device
 
   ValidationMessage(): boolean {
     let flag = true;
     if (isNullOrUndefined(this.fuelModel.dtFuel)) {
       flag = false;
       this.toastService.message('please select date  !!');
     } else if (isNullOrUndefined(this.fuelModel.FuelAmount)) {
       this.toastService.message('please fill amount value !!');
     }
     return flag;
   }
 
 
 
   SaveFuel() {
     console.log(this.fuelModel);
     // if (this.fuelForm) {
     //   this.fuelService.postItem(this.fuelForm.value).pipe(finalize(() => {
     //   })).subscribe(
     //     () => {
     //       this.toastService.message('Record Saved Successfully');
     //     }, error => {
     //       console.log(error);
     //       this.toastService.message(error);
     //     });
     // }
   }
 
 
   logout() {
     this.authService.logout();
   }
 
 }

