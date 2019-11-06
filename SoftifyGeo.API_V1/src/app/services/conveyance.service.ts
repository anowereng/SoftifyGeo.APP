import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CheckIn } from '../_models/checkin';
import { catchError } from 'rxjs/operators';

export class ConveyanceService {
  url = environment.url;
  constructor(private http: HttpClient) {
  }
// [demo]
  postItem(model: CheckIn) {
    return this.http.post(this.url + '/CustomerChekIn/CheckIn', model).pipe(
      catchError(e => {
        throw new Error(e);
      })
    );
  }
  getConveyType() {
    return this.http.get(this.url + `/Conveyance/GetConveyType`).pipe(
      catchError(e => {
        throw new Error(e);
      })
    );
  }


}




