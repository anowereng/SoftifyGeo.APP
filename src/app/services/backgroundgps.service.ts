
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class BackgroundGpsService {

    url = environment.url;
    constructor(private http: HttpClient) { }

    postItem(model: any) {
        console.log(model);
        if (this.url.length > 3) {
            return this.http.post(this.url + '/BackgroundLocation/SaveBackground', model);
        }
    }


}


