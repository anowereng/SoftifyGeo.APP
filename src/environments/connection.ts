// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs/internal/Observable';
// import { SettingModel } from 'src/app/_models/settings_model';
// import { Injectable } from '@angular/core';
// import { ConnectionModel } from 'src/app/_models/connection';
// import { environment } from '../environments/environment';
// @Injectable({
//     providedIn: 'root'
// })
// export class Connection {
//     constructor(private http: HttpClient) {
//     }
//     public getConnection(): Observable<ConnectionModel> {
//         return this.http.get<ConnectionModel>(`http://softifytech.com/apps/connection.json`);
//     }
// }
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectionModel } from 'src/app/_models/connection';

@Injectable()
export class Connection {

    private readonly _connection: Observable<ConnectionModel[]>;

    constructor(private readonly http: HttpClient) {
        this._connection = this.http.get<ConnectionModel[]>('http://softifytech.com/apps/connection.json').pipe(shareReplay());
    }

    getConnection(): Observable<ConnectionModel[]> {
        return this._connection;
    }
}

// export interface ICustomer {
//   /* ICustomer interface fields defined here */
// }