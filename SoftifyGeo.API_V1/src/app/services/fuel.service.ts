
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';
@Injectable({
  providedIn: 'root'
})
export class FuelService {

  url = environment.url;
  constructor(private http: HttpClient) { }
   postItem(model: any) {
    console.log(model);
    return this.http.post(this.url + '/LocationFuel/FuelSave', model);
  }
   
}


