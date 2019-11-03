import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from '@ionic/angular';
import { CheckincheckoutPage } from './checkincheckout.page';

const routes: Routes = [

  { path: '',
    component: CheckincheckoutPage,
    children:[
        { path: 'tabcheckin', loadChildren: '../tabcheckin/tabcheckin.module#TabcheckinPageModule' },
        { path: 'tabcheckout', loadChildren: '../tabcheckout/tabcheckout.module#TabcheckoutPageModule' },
        {
          path:'',
          redirectTo:'/checkincheckout/tabcheckin',
          pathMatch:'full'
        }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    
    RouterModule.forChild(routes)
  ],
  declarations: [CheckincheckoutPage]
})
export class CheckincheckoutPageModule {}
