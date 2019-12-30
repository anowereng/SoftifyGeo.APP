import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CheckincheckoutListPage } from './checkincheckout-list.page';
import { VisitService } from '../services/visit.service';

const routes: Routes = [
  {
    path: '',
    component: CheckincheckoutListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CheckincheckoutListPage],
  providers: [VisitService]
})
export class CheckincheckoutListPageModule {}
