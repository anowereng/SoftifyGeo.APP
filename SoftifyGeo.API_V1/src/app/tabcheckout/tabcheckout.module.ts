import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TabcheckoutPage } from './tabcheckout.page';
import { CheckOutService } from '../services/checkout.service';
/* GPS Permission */
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GPSPermissionService } from '../services/gps-permission.service';
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
  declarations: [TabcheckoutPage],
  providers: [CheckOutService, GPSPermissionService,
                  AndroidPermissions, LocationAccuracy, Geolocation]
})
export class TabcheckoutPageModule {}
