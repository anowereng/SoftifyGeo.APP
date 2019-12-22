import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsFuelPage implements OnInit {

  constructor(public navCtrl: NavController, public authservice: AuthService) { }

    ngOnInit() {
      
  }
  logout() {
    this.authservice.logout();
  }
  
  // navigateToProfile() {
  //   this.navCtrl.navigateRoot(`app/tabs/tabcheckin`);
  //   }

}
