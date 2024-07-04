import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable()
export class CompanyService {
    apiURL: String = environment.apiURL;

    constructor(
        private http: HttpClient
    ) {
    }

    getCompanies(params: any): any {
        return this.http.get(this.apiURL + '/api/v1/companies', {params});
    }

    getCompanyList(): any {
      return this.http.get(this.apiURL + '/api/v1/companies/list');
    }

    viewCompany(company: string): any {
        return this.http.get(this.apiURL + '/api/v1/companies/' + company);
    }

    createCompany(company: any): any {
        return this.http.post(this.apiURL + '/api/v1/companies', company);
    }

    editCompany(company: any, cid: string): any {
        return this.http.patch(this.apiURL + '/api/v1/companies/' + cid, company);
    }

    deleteCompany(company: string): any {
        return this.http.delete(this.apiURL + '/api/v1/companies/' + company);
    }
}
