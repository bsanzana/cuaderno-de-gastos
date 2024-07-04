import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SeedService {
    apiURL: String = environment.apiURL;

    constructor(
        private http: HttpClient
    ) {
    }

    getSeeds(params: any): any {
        return this.http.get(this.apiURL + '/api/v1/seeds', {params});
    }

    getSeedList(): any {
        return this.http.get(this.apiURL + '/api/v1/seeds/list');
    }

    viewSeed(pid: string): any {
        return this.http.get(this.apiURL + '/api/v1/seeds/' + pid);
    }

    createSeed(seed: any): any {
        return this.http.post(this.apiURL + '/api/v1/seeds', seed);
    }

    editSeed(seed: any, pid: string): any {
        return this.http.patch(this.apiURL + '/api/v1/seeds/' + pid, seed);
    }

    deleteSeed(pid: string): any {
        return this.http.delete(this.apiURL + '/api/v1/seeds/' + pid);
    }
}
