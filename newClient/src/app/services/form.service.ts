import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

@Injectable()
export class FormService {
    apiURL: String = environment.apiURL;

    constructor(
        private http: HttpClient
    ) {
    }

    getForms(params: any): any {
        return this.http.get(this.apiURL + '/api/v1/forms', {params});
    }

    getExportForms(params: any): any {
        return this.http.get(this.apiURL + '/api/v1/forms/exports', {params});
    }

    existForm(cid: string, sid: string, fid: string): any {
        return this.http.get(this.apiURL + '/api/v1/forms/exist/' + cid + '/' + sid + '/' + fid);
    }

    viewForm(pid: string): any {
        return this.http.get(this.apiURL + '/api/v1/forms/view/' + pid);
    }

    viewEditForm(pid: string): any {
        return this.http.get(this.apiURL + '/api/v1/forms/' + pid);
    }

    createForm(form: any): any {
        return this.http.post(this.apiURL + '/api/v1/forms', form);
    }

    editForm(form: any): any {
        return this.http.post(this.apiURL + '/api/v1/editForm', form);
    }

    deleteForm(pid: string): any {
        return this.http.delete(this.apiURL + '/api/v1/forms/' + pid);
    }

    downloadFile(params:any): any{
        return this.http.get(this.apiURL + '/api/v1/downloadFiles', { params:params ,responseType: 'blob' })
      }
}
