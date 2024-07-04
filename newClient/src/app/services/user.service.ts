import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class UserService {
  apiURL: String = environment.apiURL;

  constructor(
    private http: HttpClient
  ) {
  }

  getUsers(params: any): any {
    return this.http.get(this.apiURL + '/api/v1/users', {params});
  }

  viewUser(user: string): any {
    return this.http.get(this.apiURL + '/api/v1/users/' + user);
  }

  createUser(user: any): any {
    return this.http.post(this.apiURL + '/api/v1/users', user);
  }

  editUser(user: any, uid: string): any {
    return this.http.patch(this.apiURL + '/api/v1/users/' + uid, user);
  }

  setUserPassword(userId: string, newPassword: string): any {
    return this.http.patch(this.apiURL + '/api/v1/users/' + userId + '/password', {password: newPassword});
  }

  setUserPasswordSettings(uid: string, user: any): any {
    return this.http.patch(this.apiURL + '/api/v1/users/' + uid + '/password_settings', user);
  }

  deleteUser(user: string): any {
    return this.http.delete(this.apiURL + '/api/v1/users/' + user);
  }

}
