import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const request = req.clone({
            setHeaders: {
                Authorization: `Bearer ${localStorage.getItem('consulagro-user-token')}`
            }
        });

        return next.handle(request);
    }
}