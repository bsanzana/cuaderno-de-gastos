import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class MachineryService {
    apiURL: String = environment.apiURL;

    constructor(
        private http: HttpClient
    ) {
    }

    getMachines(params: any): any {
        return this.http.get(this.apiURL + '/api/v1/machines', {params});
    }

    getMachineList(): any {
        return this.http.get(this.apiURL + '/api/v1/machines/list');
    }

    viewMachinery(pid: string): any {
        return this.http.get(this.apiURL + '/api/v1/machines/' + pid);
    }

    createMachinery(machinery: any): any {
        return this.http.post(this.apiURL + '/api/v1/machines', machinery);
    }

    editMachinery(machinery: any, pid: string): any {
        return this.http.patch(this.apiURL + '/api/v1/machines/' + pid, machinery);
    }

    deleteMachinery(pid: string): any {
        return this.http.delete(this.apiURL + '/api/v1/machines/' + pid);
    }
}
