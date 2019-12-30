import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { ReactiveFormsModule } from '@angular/forms';
import { FuelService } from '../services/fuel.service';
import { FuelEntryPage } from './fuelentry.page';
import { DatePickerService } from '../services/common/datepricker.service';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
const routes: Routes = [
  {
    path: '',
    component: FuelEntryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
    , IonicSelectableModule,
    Ionic4DatepickerModule
  ],
  declarations: [FuelEntryPage], providers: [FuelService,DatePickerService, DatePipe]
})
export class FuelEntryPageModule {}
