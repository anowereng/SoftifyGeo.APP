
import { Platform, AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { tap, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from './toast.service';
import { LoadingService } from './loading.service';
import { Connection } from 'src/environments/connection';
import { ConnectionModel } from '../_models/connection';
import { environment } from 'src/environments/environment';

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = environment.url;
  user = null;
  authenticationState = new BehaviorSubject(false);
  // public connectionUrl: any;
  public data: Array<ConnectionModel> = [];

  constructor(private http: HttpClient, private helper: JwtHelperService, private storage: Storage,
              private plt: Platform, private toastService: ToastService,
              private loadservice: LoadingService, public connection: Connection) {
    this.plt.ready().then(() => {
      this.checkToken();
      // console.log('checkToken()=>'+this.authenticationState.value);
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        let decoded = this.helper.decodeToken(token);
        let isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.user = decoded;
          this.authenticationState.next(true);
        } else {
          this.storage.remove(TOKEN_KEY);
          // this.storage.remove(TOKEN_KEY).then(() => {
          //   this.authenticationState.next(false);
          // });
        }
      }
    });

  }

  register(credentials) {
    return this.http.post(`${this.url}/login/register`, credentials).pipe(
      catchError(e => {
        this.toastService.message(e.error.msg);
        throw new Error(e);
      })
    );
  }

  login(credentials) {
    this.loadservice.present();
    return this.http.post(this.url + '/login/login', credentials)
      .pipe(
        tap(res => {
          this.storage.set(TOKEN_KEY, res['token']);
          this.user = this.helper.decodeToken(res['token']);
          this.authenticationState.next(true);
          this.loadservice.dismiss();
        }),
        catchError(e => {
          this.toastService.message(e);
          this.loadservice.dismiss();
          throw new Error(e);
        }),
      );
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  getUserInfo() {
    return this.user;
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }
  getTokenUserId() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        // console.log(this.helper.decodeToken(token))
        return this.helper.decodeToken(token);
      }
    });
  }

  seturl() {
    this.http.get<ConnectionModel>(environment.url).subscribe(response => {
      this.storage.set('url', response.url);
      this.storage.set('host', response.host);
      this.url = response.url;
      console.log(response.url);
      console.log(response.host);
    }, e => {
      console.log(e);
    });
    console.log(this.url);
  }

  geturl() {
    this.storage.get('url').then((val) => {
      this.url = val;
    });
    console.log(this.url);
  }
}
