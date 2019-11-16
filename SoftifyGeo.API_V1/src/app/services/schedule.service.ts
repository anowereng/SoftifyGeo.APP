import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CheckIn } from '../_models/checkin';
import { catchError } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';
export class ScheduleService {
  url = environment.url;
  constructor(private http: HttpClient, private loadservice: LoadingService, private messageservice: ToastService) {
  }

  // http://202.86.220.142:5196/api/LocationAttendance/Uplaod

  async uploadImageData(formData: FormData) {
    this.loadservice.presentWithMessage('Uploading image...');
    this.http.post(this.url + '/LocationAttendance/Uplaod', formData)
      .pipe(finalize(() => {
        this.loadservice.dismiss();
      })
      ).subscribe(res => {
        this.messageservice.message('File upload complete.!!');
      }, error => {
        this.messageservice.message(error);
      });
  }
}




