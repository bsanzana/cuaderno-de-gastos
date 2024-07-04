import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ApplicationMethodService {
    apiURL: String = environment.apiURL;

    constructor(
        private http: HttpClient
    ) {
    }

    getApplicationMethods(params: any): any {
        return this.http.get(this.apiURL + '/api/v1/application-methods', {params});
    }

    getApplicationMethodList(): any {
        return this.http.get(this.apiURL + '/api/v1/application-methods/list');
    }

    viewApplicationMethod(pid: string): any {
        return this.http.get(this.apiURL + '/api/v1/application-methods/' + pid);
    }

    createApplicationMethod(method: any): any {
        return this.http.post(this.apiURL + '/api/v1/application-methods', method);
    }

    editApplicationMethod(method: any, pid: string): any {
        return this.http.patch(this.apiURL + '/api/v1/application-methods/' + pid, method);
    }

    deleteApplicationMethod(pid: string): any {
        return this.http.delete(this.apiURL + '/api/v1/application-methods/' + pid);
    }
}
