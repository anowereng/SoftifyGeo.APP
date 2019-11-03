import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabcheckoutPage } from './tabcheckout.page';
import { CheckOutService } from '../services/checkout.service';

const routes: Routes = [
  {
    path: '',
    component: TabcheckoutPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabcheckoutPage], providers: [CheckOutService]
})
export class TabcheckoutPageModule {}
