import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TabcheckinPage } from './tabcheckin.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { ReactiveFormsModule } from "@angular/forms";
import { CheckInService } from '../services/checkin.service';
const routes: Routes = [
  {
    path: '',
    component: TabcheckinPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
    , IonicSelectableModule
  ],
  declarations: [TabcheckinPage], providers: [CheckInService]
})
export class TabcheckinPageModule {}
