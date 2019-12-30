import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class CheckincheckoutService {
  url = environment.url;
  jsonData: any;

    constructor(private http: HttpClient, private toastService: ToastService) {
        this.jsonData = [
      {"id":1,"label":"saw","name":"Prithivi" , "IsChecked":false, "CustType":"Old", "address":"  NOAPARA, SEBRANG, TEKNAF"},
      {"id":1,"label":"saw","name":"Prithivi" , "IsChecked":false , "CustType":"Old", "address":"  CHITTAGONG, SEBRANG, TEKNAF"},
      {"id":2,"label":"saw1","name":"Abimanyu" , "IsChecked":false, "CustType":"Old", "address":"  FENI, SEBRANG, TEKNAF"},
      {"id":3,"label":"saw2","name":"malliga" , "IsChecked":false, "CustType":"Old", "address":"  DHAKA, SEBRANG, TEKNAF"},
      {"id":3,"label":"saw2","name":"Gowdaman" , "IsChecked":false, "CustType":"Old", "address":"CUMILLA, SEBRANG, TEKNAF"},
      {"id":3,"label":"saw2","name":"Neethi" , "IsChecked":false, "CustType":"Old", "address":"  NOAPARA, SEBRANG, TEKNAF"},
      {"id":3,"label":"saw2","name":"abirami1" , "IsChecked":false, "CustType":"Old" , "address":"  NOAPARA, SEBRANG, TEKNAF"},
      {"id":3,"label":"saw2","name":"abirami2" , "IsChecked":false, "CustType":"Old", "address":"  NOAPARA, SEBRANG, TEKNAF"},
      {"id":3,"label":"saw2","name":"Harrish" , "IsChecked":false, "CustType":"Old", "address":"  NOAPARA, SEBRANG, TEKNAF"},
      {"id":3,"label":"saw2","name":"Lokesh" , "IsChecked":false, "CustType":"Old", "address":"  NOAPARA, SEBRANG, TEKNAF"},
      {"id":3,"label":"saw2","name":"Deepak" , "IsChecked":false, "CustType":"Old", "address":"  NOAPARA, SEBRANG, TEKNAF"},
      {"id":3,"label":"saw2","name":"malliga", "IsChecked":false, "CustType":"Old", "address":"  NOAPARA, SEBRANG, TEKNAF"},,
      {"id":3,"label":"saw2","name":"malliga", "IsChecked":false, "CustType":"Old", "address":"  NOAPARA, SEBRANG, TEKNAF"},,

      ];
    }
    
    SearchData(searchData: any) {
      console.log(searchData);
        return this.http.get(this.url + '/CustomerChekIn/'+'"'+searchData+'"').pipe(
          catchError(e => {
            throw new Error(e);
          })
        );
     }
}