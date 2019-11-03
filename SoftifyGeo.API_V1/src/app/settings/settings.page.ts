import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { CheckincheckoutService } from '../checkincheckout/checkincheckout.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  jsonData: any;  searchTerm : any="";type : any=""; searchChanged:any="";
  constructor(public navCtrl: NavController, public data : CheckincheckoutService) { }

  ngOnInit() {
  }

//   setFilteredItems() {
//     this.jsonData = this.data.filterItems(this.searchTerm);
// }

}
