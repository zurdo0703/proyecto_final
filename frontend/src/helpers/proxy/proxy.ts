import { UserProxy } from './user.proxy';
import { Injectable } from '@angular/core';

@Injectable()
export class Proxy {
    constructor(public user: UserProxy) {
    }
}