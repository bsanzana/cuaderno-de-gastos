import {Injectable} from '@angular/core';
// import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, retry } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

// import {map} from 'rxjs/operators';
// import * as JWT from 'jwt-decode';
import {environment} from '../../environments/environment';

import { jwtDecode } from "jwt-decode";


@Injectable()
export class AuthenticationService {
    baseURL: string = environment.apiURL;

    constructor(
        // private http: Http,
        private httpClient: HttpClient
    ) {
    }

    loginProducer(credentials: any): any {
        return this.httpClient.post(this.baseURL+'/api/v1/loginProducer', credentials)
    }
    login(credentials: any): any {
        let headers= new HttpHeaders()
        headers=headers.append('content-type','application/json')
        
        return this.httpClient.post(this.baseURL+'/api/v1/login', credentials, {headers:headers})
        .pipe(
        retry(0),
        catchError((error: HttpErrorResponse) => {
            // let msgError = new Error(error.error.message);
            return throwError(() => error?.error);
        })
        );
        // return this.httpClient.post(this.baseURL + '/api/v1/login', credentials).pipe(map(
        //     (response: Response) => response.json()
        // ));
    }

    isLoggedIn(): boolean {
        const token = this.getToken();

        if (token) {
            const payload: any = jwtDecode(token);
            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    }

    logout(data: any): any {

        // let options = {
        //     headers: new HttpHeaders({
        //       'Content-Type':  'application/json',
        //       'Authorization': 'Bearer ' + this.getToken()
        //     })
        // };

        // return this.httpClient.post(this.baseURL + '/api/v1/logout', data, options).pipe(map(
        //     (response: Response) => response.json()
        // ));
        return this.httpClient.post(this.baseURL+'/api/v1/logout', {})
        .pipe(
            catchError(error => {
                return throwError(error.error);
            })
        );
    }

    getCurrentUser() {
        if (this.isLoggedIn()) {
            const token = this.getToken();
            const payload: any = jwtDecode(token);
            return {
                id: payload._id,
                rut: payload.rut,
                name: payload.name,
                role: payload.role,
                phone: payload.phone,
                email: payload.email,
                active: payload.active,
                force_password_update: payload.force_password_update,
                company: payload.company
            };
        } else {
            return null;
        }
    }

    saveToken(token: any) {
        localStorage.setItem('consulagro-user-token', token);
    }

    getToken(): any {
        return localStorage.getItem('consulagro-user-token');
    }
}
