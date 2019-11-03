
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';
const TOKEN_KEY = 'access_token';
@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  url = environment.url;
  user = null;
  UserId: any;
  CheckStatus: any;

  constructor(private http: HttpClient, private toastService: ToastService) { }
  CheckInOutStatus() {
    this.http.get(this.url + '/LocationAttendance').subscribe(response => {
      this.CheckStatus = response;
      console.log(response);
    }, e => {
      this.toastService.message(e);
    });
  }

  postItem(model: any) {
    return this.http.post(this.url + '/LocationAttendance/AttendanceSave', model);
  }
}


