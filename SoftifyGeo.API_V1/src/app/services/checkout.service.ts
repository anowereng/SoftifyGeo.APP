import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CheckOut } from '../_models/Checkout';
import { catchError } from 'rxjs/operators';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { CheckIn } from '../_models/checkin';

export class CheckOutService {
  url = environment.url;
  constructor(private http: HttpClient) {
  }
  getLastCheckOutInfo(): Observable<CheckIn> {
    return this.http.get<CheckIn>(this.url + '/CustomerChekOut')
      .pipe(catchError(e => {
        throw new Error(e);
      }));
  }

  postCheckOut(model: CheckOut) {
    console.log(model);
    return this.http.post(this.url + '/CustomerChekOut', model).pipe(
      catchError(e => {
        throw new Error(e);
      })
    );
  }
}




