import { Platform, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { ToastService } from './toast.service';
const TOKEN_KEY = 'access_token';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  public userId: any;
  constructor(private storage: Storage, private helper: JwtHelperService) {
    this.getUserId();
  }
  ionViewDidEnter() {
    this.getUserId();
  }
  getUserId() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        this.userId = this.helper.decodeToken(token).nameid;
        console.log('userservice' + this.userId);
      }
    });
  }
}
