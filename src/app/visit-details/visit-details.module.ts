import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VisitDetailsPage } from './visit-details.page';
import { VisitService } from '../services/visit.service';

const routes: Routes = [
  {
    path: '',
    component: VisitDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VisitDetailsPage],
  providers: [VisitService]
})
export class VisitDetailsPageModule {}
