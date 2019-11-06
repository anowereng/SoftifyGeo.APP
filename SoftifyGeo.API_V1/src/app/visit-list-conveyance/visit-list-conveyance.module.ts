import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { VisitService } from '../services/visit.service';
import { VisitListConveyancePage } from './visit-list-conveyance.page';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { DatePickerService } from '../services/common/datepricker.service';
const routes: Routes = [
  {
    path: '',
    component: VisitListConveyancePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ionic4DatepickerModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VisitListConveyancePage],
  providers: [VisitService, DatePipe, DatePickerService]
})
export class VisitListConveyancePageModule {}
