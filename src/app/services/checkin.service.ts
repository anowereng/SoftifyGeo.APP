import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CheckIn } from '../_models/checkin';
import { catchError, finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';
export class CheckInService {
  url = environment.url;
  constructor(private http: HttpClient) {
  }

  postItem(model: CheckIn) {
    if (this.url.length > 3) {
      return this.http.post(this.url + '/CustomerChekIn/CheckIn', model).pipe(
        catchError(e => {
          throw new Error(e);
        })
      );
    }

  }

  GetReadyForCheckIn() {
    if (this.url.length > 3) {
      return this.http.get(this.url + '/CustomerChekIn/GetReadyForCheckIn')
        .pipe(catchError(e => {
          throw new Error(e);
        }));
    }
  }

  uploadImage(formData: FormData) {
    if (this.url.length > 3) {
      return this.http.post(this.url + '/UploadImage/Upload?pagename=custcheckin', formData);
    }
  }
  SearchData(searchData: any) {
    if (this.url.length > 3) {
      return this.http.get(this.url + '/CustomerChekIn/' + '"' + searchData + '"').pipe(
        catchError(e => {
          throw new Error(e);
        })
      );
    }
  }

  GetVisitDataDay() {
    if (this.url.length > 3) {
      return this.http.get(this.url + '/CustomerChekIn/GetTotalVisitDay')
        .pipe(catchError(e => {
          throw new Error(e);
        }));
    }
  }
 



}




