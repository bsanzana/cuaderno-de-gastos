import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class WorkService {
    apiURL: String = environment.apiURL;

    constructor(
        private http: HttpClient
    ) {
    }

    getWorks(params: any): any {
        return this.http.get(this.apiURL + '/api/v1/works', {params});
    }

    getWorkList(): any {
        return this.http.get(this.apiURL + '/api/v1/works/list');
    }

    viewWork(wid: string): any {
        return this.http.get(this.apiURL + '/api/v1/works/' + wid);
    }

    createWork(work: any): any {
        return this.http.post(this.apiURL + '/api/v1/works', work);
    }

    editWork(work: any, wid: string): any {
        return this.http.patch(this.apiURL + '/api/v1/works/' + wid, work);
    }

    deleteWork(wid: string): any {
        return this.http.delete(this.apiURL + '/api/v1/works/' + wid);
    }
}
