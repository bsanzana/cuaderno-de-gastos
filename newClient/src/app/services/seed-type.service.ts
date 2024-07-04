import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SeedTypeService {
    apiURL: String = environment.apiURL;

    constructor(
        private http: HttpClient
    ) {
    }

    getSeedTypes(params: any): any {
        return this.http.get(this.apiURL + '/api/v1/seed-types', {params});
    }

    getSeedTypeList(): any {
        return this.http.get(this.apiURL + '/api/v1/seed-types/list');
    }

    viewSeedType(pid: string): any {
        return this.http.get(this.apiURL + '/api/v1/seed-types/' + pid);
    }

    createSeedType(seedType: any): any {
        return this.http.post(this.apiURL + '/api/v1/seed-types', seedType);
    }

    editSeedType(seedType: any, pid: string): any {
        return this.http.patch(this.apiURL + '/api/v1/seed-types/' + pid, seedType);
    }

    deleteSeedType(pid: string): any {
        return this.http.delete(this.apiURL + '/api/v1/seed-types/' + pid);
    }
}
