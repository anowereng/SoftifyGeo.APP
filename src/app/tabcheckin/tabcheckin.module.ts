import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TabcheckinPage } from './tabcheckin.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckInService } from '../services/checkin.service';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/File/ngx';
/* GPS Permission */
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GPSPermissionService } from '../services/gps-permission.service';
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
  declarations: [TabcheckinPage], providers: [CheckInService, Camera, File,
          GPSPermissionService, AndroidPermissions, LocationAccuracy, Geolocation]
})
export class TabcheckinPageModule {}
