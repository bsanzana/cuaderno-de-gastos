import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SeasonService {
    apiURL: String = environment.apiURL;

    constructor(
        private http: HttpClient
    ) {
    }

    getSeasons(params: any): any {
        return this.http.get(this.apiURL + '/api/v1/seasons', {params});
    }

    getSeasonList(): any {
        return this.http.get(this.apiURL + '/api/v1/seasons/list');
    }

    viewSeason(sid: string): any {
        return this.http.get(this.apiURL + '/api/v1/seasons/' + sid);
    }

    createSeason(season: any): any {
        return this.http.post(this.apiURL + '/api/v1/seasons', season);
    }

    editSeason(season: any, sid: string): any {
        return this.http.patch(this.apiURL + '/api/v1/seasons/' + sid, season);
    }

    deleteSeason(sid: string): any {
        return this.http.delete(this.apiURL + '/api/v1/seasons/' + sid);
    }

    activeSeason(sid: string): any {
        return this.http.patch(this.apiURL + '/api/v1/seasons/' + sid + '/active', {});
    }

    getActiveSeason(): any {
        return this.http.get(this.apiURL + '/api/v1/seasons/active', {});
    }
}
