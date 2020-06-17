import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: '', loadChildren: './tabs/tabs.module#TabsPageModule',pathMatch: 'full' },
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthGuardService] },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuardService] },
  { path: 'register', loadChildren: './auth/register/register.module#RegisterPageModule', canActivate: [AuthGuardService] },
  { path: 'login', loadChildren: './auth/login/login.module#LoginPageModule' },
  { path: 'checkincheckout', loadChildren: './checkincheckout/checkincheckout.module#CheckincheckoutPageModule', canActivate: [AuthGuardService] },
  { path: 'fuelentry', loadChildren: './fuelentry/fuelentry.module#FuelEntryPageModule', canActivate: [AuthGuardService] },
  { path: 'fuellist', loadChildren: './fuellist/fuellist.module#FuelListPageModule', canActivate: [AuthGuardService] },
  { path: 'attendance', loadChildren: './attendance/attendance.module#AttendancePageModule', canActivate: [AuthGuardService] },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule', canActivate: [AuthGuardService] },
  { path: 'checkincheckout-list', loadChildren: './checkincheckout-list/checkincheckout-list.module#CheckincheckoutListPageModule', canActivate: [AuthGuardService] },
  { path: 'customer-details', loadChildren: './customer-details/customer-details.module#CustomerDetailsPageModule', canActivate: [AuthGuardService] },
  // { path: 'info', loadChildren: './info/info.module#InfoPageModule', canActivate: [AuthGuardService] },
  { path: 'conveyance', loadChildren: './conveyance/conveyance.module#ConveyancePageModule', canActivate: [AuthGuardService] },
  { path: 'schedule', loadChildren: './schedule/schedule.module#SchedulePageModule', canActivate: [AuthGuardService] },
  { path: 'tabcheckin', loadChildren: './tabcheckin/tabcheckin.module#TabcheckinPageModule', canActivate: [AuthGuardService] },
  { path: 'tabcheckout', loadChildren: './tabcheckout/tabcheckout.module#TabcheckoutPageModule', canActivate: [AuthGuardService] },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule', canActivate: [AuthGuardService] },
  { path: 'tabsfuel', loadChildren: './tabsfuel/tabsfuel.module#TabsFuelPageModule', canActivate: [AuthGuardService] },
  { path: 'visit-list', loadChildren: './visit-list/visit-list.module#VisitListPageModule', canActivate: [AuthGuardService] },
  { path: 'visit-list-conveyance', loadChildren: './visit-list-conveyance/visit-list-conveyance.module#VisitListConveyancePageModule', canActivate: [AuthGuardService] },
  { path: 'conveyance/:id', loadChildren: './conveyance/conveyance.module#ConveyancePageModule', canActivate: [AuthGuardService] },
  { path: 'visit-details/:id', loadChildren: './visit-details/visit-details.module#VisitDetailsPageModule', canActivate: [AuthGuardService] },
  { path: 'checkinout', loadChildren: () => import('./checkinout/checkinout.module').then(m => m.CheckInOutPageModule), canActivate: [AuthGuardService] },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
