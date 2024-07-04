import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CompanyGroupService {
    apiURL: String = environment.apiURL;

    constructor(
        private http: HttpClient
    ) {
    }

    getCompanyGroups(params: any): any {
        return this.http.get(this.apiURL + '/api/v1/company-groups', {params});
    }

    getCompanyGroupList(): any {
        return this.http.get(this.apiURL + '/api/v1/company-groups/list');
    }

    viewCompanyGroup(pid: string): any {
        return this.http.get(this.apiURL + '/api/v1/company-groups/' + pid);
    }

    createCompanyGroup(group: any): any {
        return this.http.post(this.apiURL + '/api/v1/company-groups', group);
    }

    editCompanyGroup(group: any, pid: string): any {
        return this.http.patch(this.apiURL + '/api/v1/company-groups/' + pid, group);
    }

    deleteCompanyGroup(pid: string): any {
        return this.http.delete(this.apiURL + '/api/v1/company-groups/' + pid);
    }
}
