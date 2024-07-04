import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpecialistService {

  apiURL: String = environment.apiURL;

  constructor(
    private http: HttpClient
  ) {
  }

  getSpecialists(params: any): any {
    return this.http.get(this.apiURL + '/api/v1/specialists', {params});
  }

  viewSpecialist(user: string): any {
    return this.http.get(this.apiURL + '/api/v1/specialists/' + user);
  }

  createSpecialist(user: any): any {
    return this.http.post(this.apiURL + '/api/v1/specialists', user);
  }

  editSpecialist(user: any, uid: string): any {
    return this.http.patch(this.apiURL + '/api/v1/specialists/' + uid, user);
  }

  
}
