import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ConveyancePage } from './conveyance.page';
import { ConveyanceService } from '../services/conveyance.service';
import { IonicSelectableModule } from 'ionic-selectable';

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
    , IonicSelectableModule
  ],
  declarations: [ConveyancePage],
  providers: [ConveyanceService]
})
export class ConveyancePageModule {}
