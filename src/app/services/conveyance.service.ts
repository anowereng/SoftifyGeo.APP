import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CheckIn } from '../_models/checkin';
import { catchError } from 'rxjs/operators';
import { Conveyance } from '../_models/conveyance';

export class ConveyanceService {
  url = environment.url;
  constructor(private http: HttpClient) {
  }
// [demo]
  postItem(model: Conveyance) {
    console.log(model);
    return this.http.post(this.url + '/Conveyance/SaveConveyance', model).pipe(
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

  getConveyData(visitid: number) {
    return this.http.get(this.url + `/Conveyance/GetConveyInfo?visitid=${visitid}`).pipe(
      catchError(e => {
        throw new Error(e);
      })
    );
  }


}




