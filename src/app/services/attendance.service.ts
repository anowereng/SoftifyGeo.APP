
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';



@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  url = environment.url;
  user = null;
  UserId: any;
  CheckStatus: any;

  constructor(private http: HttpClient, private toastService: ToastService,
              ) {
  }
  CheckInOutStatus() {
    if (navigator.onLine) {
      if (this.url.length > 3) {
        this.http.get(this.url + '/LocationAttendance').subscribe(response => {
          this.CheckStatus = response;
          console.log(response);
        }, e => {
          console.log(e);
        });
      }
    }
  }

  postItem(model: any) {
    if (navigator.onLine) {
      if (this.url.length > 3) {
        return this.http.post(this.url + '/LocationAttendance/AttendanceSave', model);
      } else {
        this.toastService.message(' Please Check Internet Connection !!! ');
      }
    }
  }

  uploadImage(formData: FormData) {
    if (navigator.onLine) {
      if (this.url.length > 3) {
        return this.http.post(this.url + '/UploadImage/Upload?pagename=attendance', formData);
      }
    } else {
      this.toastService.message(' Please Check Internet Connection !!! ');
    }
  }
}


