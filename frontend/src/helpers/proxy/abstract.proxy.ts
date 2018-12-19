import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export abstract class AbstractProxy {
    protected headers: Object;
    constructor(private http: HttpClient) {
    }
    protected consult(url: string, data: Object = {}, method: string) {
        return this.http[method](url, data);
    }
}