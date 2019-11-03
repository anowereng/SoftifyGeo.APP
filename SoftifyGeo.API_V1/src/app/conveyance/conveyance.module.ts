import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ConveyancePage } from './conveyance.page';
import { VisitService } from '../services/visit.service';

const routes: Routes = [
  {
    path: '',
    component: ConveyancePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ConveyancePage],
  providers: [VisitService]
})
export class ConveyancePageModule {}
