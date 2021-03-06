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

  loadUsers(pageindex: any, pagesize: any, searchterm: any) {
    return this.http.get(this.url + `/visit/GetVisitList?pageindex=${pageindex}&pagesize=${pagesize}&searchdata=${searchterm}`);
  }

  getAllVisitCustomer(searchtext: any, model: any) {
    // tslint:disable-next-line: max-line-length
    return this.http.get(this.url + `/visit/GetAllVisitCustomer?searchdata=${searchtext}&custtype=${model.type}&dtfrom=${model.dtFrom}&dtto=${model.dtTo}`);
  }

  getVisitDetailsByLocCustId(id: number) {
    return this.http.get(this.url + `/visit/getVisitDetailsByLocCustId?id=${id}`);
  }

}




