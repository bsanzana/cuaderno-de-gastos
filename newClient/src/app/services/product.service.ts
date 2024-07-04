import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class ProductService {
  apiURL: String = environment.apiURL;

  constructor(
    private http: HttpClient
  ) {
  }

  getProducts(params: any): any {
    return this.http.get(this.apiURL + '/api/v1/products', {params});
  }

  // viewUser(user: string): any {
  //   return this.http.get(this.apiURL + '/api/v1/users/' + user);
  // }

  createProduct(product: any): any {
    return this.http.post(this.apiURL + '/api/v1/products', product);
  }

  editProduct(product: any, pid: string): any {
    return this.http.patch(this.apiURL + '/api/v1/products/' + pid, product);
  }

  // setUserPassword(userId: string, newPassword: string): any {
  //   return this.http.patch(this.apiURL + '/api/v1/users/' + userId + '/password', {password: newPassword});
  // }

  // setUserPasswordSettings(uid: string, user: any): any {
  //   return this.http.patch(this.apiURL + '/api/v1/users/' + uid + '/password_settings', user);
  // }

  // deleteUser(user: string): any {
  //   return this.http.delete(this.apiURL + '/api/v1/users/' + user);
  // }

}
