import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),canActivate: [AuthGuardService]},
  { path: 'register', loadChildren: './auth/register/register.module#RegisterPageModule' ,canActivate: [AuthGuardService]},
  { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule' },
  { path: 'checkincheckout', loadChildren: './checkincheckout/checkincheckout.module#CheckincheckoutPageModule',canActivate: [AuthGuardService] },
  { path: 'attendance', loadChildren: './attendance/attendance.module#AttendancePageModule',canActivate: [AuthGuardService]},
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' ,canActivate: [AuthGuardService]},
  { path: 'checkincheckout-list', loadChildren: './checkincheckout-list/checkincheckout-list.module#CheckincheckoutListPageModule' ,canActivate: [AuthGuardService]},
  { path: 'customer-details', loadChildren: './customer-details/customer-details.module#CustomerDetailsPageModule' ,canActivate: [AuthGuardService]},
  { path: 'info', loadChildren: './info/info.module#InfoPageModule' ,canActivate: [AuthGuardService]},
  { path: 'conveyance', loadChildren: './conveyance/conveyance.module#ConveyancePageModule' ,canActivate: [AuthGuardService]},
  { path: 'schedule', loadChildren: './schedule/schedule.module#SchedulePageModule' ,canActivate: [AuthGuardService]},
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },  { path: 'tabcheckin', loadChildren: './tabcheckin/tabcheckin.module#TabcheckinPageModule' },
  { path: 'tabcheckout', loadChildren: './tabcheckout/tabcheckout.module#TabcheckoutPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
