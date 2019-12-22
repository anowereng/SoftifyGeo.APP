import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TabsFuelPage } from './tabsfuel.page';

const routes: Routes = [

  {
    path: '',
    component: TabsFuelPage,
    children: [
      { path: 'tabfuelentry', loadChildren: '../fuelentry/fuelentry.module#FuelEntryPageModule' },
      { path: 'tabfuellist', loadChildren: '../fuellist/fuellist.module#FuelListPageModule'},
      {
        path: '',
        redirectTo: '/tabsfuel/tabfuelentry',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsFuelPage],
  providers: []
})
export class TabsFuelPageModule { }