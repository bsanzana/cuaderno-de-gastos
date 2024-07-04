import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class PlantingMethodService {
    apiURL: String = environment.apiURL;

    constructor(
        private http: HttpClient
    ) {
    }

    getPlantingMethods(params: any): any {
        return this.http.get(this.apiURL + '/api/v1/mano-de-obra', {params});
    }

    getPlantingMethodList(): any {
        return this.http.get(this.apiURL + '/api/v1/mano-de-obra/list');
    }

    viewPlantingMethod(pid: string): any {
        return this.http.get(this.apiURL + '/api/v1/mano-de-obra/' + pid);
    }

    createPlantingMethod(method: any): any {
        return this.http.post(this.apiURL + '/api/v1/mano-de-obra', method);
    }

    editPlantingMethod(method: any, pid: string): any {
        return this.http.patch(this.apiURL + '/api/v1/mano-de-obra/' + pid, method);
    }

    deletePlantingMethod(pid: string): any {
        return this.http.delete(this.apiURL + '/api/v1/mano-de-obra/' + pid);
    }
}
