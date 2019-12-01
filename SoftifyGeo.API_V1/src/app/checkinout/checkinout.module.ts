import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CheckInOutPage } from './checkinout.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckInService } from '../services/checkin.service';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
const routes: Routes = [
  {
    path: '',
    component: CheckInOutPage
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
  declarations: [CheckInOutPage], providers: [CheckInService, Camera, File]
})
export class CheckInOutPageModule {}
