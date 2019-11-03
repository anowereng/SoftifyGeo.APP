import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CheckIn } from '../_models/checkin';
import { catchError } from 'rxjs/operators';

export class VisitService {
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

  loadUsers(  pageindex: any, pagesize: any, searchterm: any) {
    return this.http.get(this.url + `/visit/GetVisitList?pageindex=${pageindex}&pagesize=${pagesize}&searchdata=${searchterm}`);
  }

  getAllVisitCustomer(searchtext: any, custtype: string) {
    return this.http.get(this.url + `/visit/GetAllVisitCustomer?searchdata=${searchtext}&custType=${custtype}`);
  }


}




