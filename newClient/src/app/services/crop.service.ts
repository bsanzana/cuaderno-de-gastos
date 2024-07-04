import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CropService {
    apiURL: String = environment.apiURL;

    constructor(
        private http: HttpClient
    ) {
    }

    getCrops(params: any): any {
        return this.http.get(this.apiURL + '/api/v1/crops', {params});
    }

    getCropList(): any {
        return this.http.get(this.apiURL + '/api/v1/crops/list');
    }

    viewCrop(pid: string): any {
        return this.http.get(this.apiURL + '/api/v1/crops/' + pid);
    }

    createCrop(crop: any): any {
        return this.http.post(this.apiURL + '/api/v1/crops', crop);
    }

    editCrop(crop: any, cid: string): any {
        return this.http.patch(this.apiURL + '/api/v1/crops/' +cid, crop);
    }

    deleteCrop(pid: string): any {
        return this.http.delete(this.apiURL + '/api/v1/crops/' + pid);
    }
}
