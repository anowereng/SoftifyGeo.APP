import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CheckincheckoutPage } from './checkincheckout.page';
import { ToastService } from '../services/toast.service';
import { CheckInService } from '../services/checkin.service';

const routes: Routes = [
  {
    path: '',
    component: CheckincheckoutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CheckincheckoutPage],
  providers: [ ToastService, CheckInService ]
})
export class CheckincheckoutPageModule {}
