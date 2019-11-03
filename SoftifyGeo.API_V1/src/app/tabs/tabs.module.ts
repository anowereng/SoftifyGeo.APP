import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';
import { UserService } from '../services/user.service';
import { CheckInService } from '../services/checkin.service';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children:[
        { path: 'tabcheckin', loadChildren: '../tabcheckin/tabcheckin.module#TabcheckinPageModule' },
        { path: 'tabcheckout', loadChildren: '../tabcheckout/tabcheckout.module#TabcheckoutPageModule' },
    ]
  },
  {
    path:'',
    redirectTo:'/tabs/tabcheckin',
    pathMatch:'full'
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage],
  providers: []
})
export class TabsPageModule {}
