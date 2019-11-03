import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CheckIn } from '../_models/checkin';
import { catchError } from 'rxjs/operators';

export class CheckInService {
  url = environment.url;
  constructor(private http: HttpClient) {
  }

  postItem(model: CheckIn) {
    return this.http.post(this.url + '/CustomerChekIn/CheckIn', model).pipe(
      catchError(e => {
        throw new Error(e);
      })
    );
  }

  GetReadyForCheckIn() {
    return this.http.get(this.url + '/CustomerChekIn/GetReadyForCheckIn')
      .pipe(catchError(e => {
        throw new Error(e);
      }));
  }
}




