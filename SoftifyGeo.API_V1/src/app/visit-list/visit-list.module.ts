import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { VisitService } from '../services/visit.service';
import { VisitListPage } from './visit-list.page';

const routes: Routes = [
  {
    path: '',
    component: VisitListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VisitListPage],
  providers: [VisitService]
})
export class VisitListPageModule {}
