import { Component } from '@angular/core';
import { FuelService } from '../services/fuel.service';
import { ToastService } from '../services/toast.service';
import { isNullOrUndefined } from 'util';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { DatePickerService } from '../services/common/datepricker.service';
import { Fuel } from '../_models/fuel';

@Component({
  selector: 'app-fuelentry',
  templateUrl: './fuelentry.page.html',
  styleUrls: ['./fuelentry.page.scss'],
})

export class FuelEntryPage {
  public datePickerObj: any = {};
  constructor(
    public fuelService: FuelService,
    private toastService: ToastService,
    private authService: AuthService,
    private datpickerService: DatePickerService
  ) {
    this.datePickerObj = this.datpickerService.GetDatePickerObj();
  }

  public fuelModel: Fuel = {
    dtFuel: this.datpickerService.selectedDate(),
    Description: '',
    FuelAmount: 0
  };

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

  ResetData(): Fuel {
    return {
      dtFuel: this.datpickerService.selectedDate(),
      Description: '',
      FuelAmount: 0
    };
  }

  SaveFuel() {
    if (navigator.onLine) {
      if (!this.Validation()) {
        this.fuelService.postItem(this.fuelModel).pipe(finalize(() => {
        })).subscribe(
          () => {
            this.toastService.message('Record Saved Successfully');
            this.fuelModel = this.ResetData();
          }, error => {
            console.log(error);
            this.toastService.message(error);
          });
      }
    } else {
      this.toastService.showLoader('please check internet connection !!');
    }
  }

  Validation() {
    var flag = false;
    if (isNullOrUndefined(this.fuelModel.FuelAmount) || this.fuelModel.FuelAmount === 0) {
      this.toastService.message('please fill fuel  amount ');
      flag = true;
    } else if (isNullOrUndefined(this.fuelModel.dtFuel) || this.fuelModel.dtFuel === '') {
      this.toastService.message(' please fill fuel date !!');
      flag = true;
    }
    return flag;
  }

  logout() {
    this.authService.logout();
  }

}

