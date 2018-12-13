import { IProxy } from './iproxy';
import { AbstractProxy } from "./abstract.proxy";
import { API } from '../../config/api';

export class UserProxy extends AbstractProxy implements IProxy {
    get(id: any) {
        return new Promise((resolve, reject) => {
            console.log('user-get');
            this.consult(`${API.user.get}/${id}`, {}, 'get')
                .subscribe(
                    resolve,
                    error => {
                        reject(error);
                    }
                );
        });
    }
    save(id: number, data: Object) {
        return new Promise((resolve, reject) => {
            console.log('user-save');
            resolve();
        });
    }
    delete(id: number) {
        return new Promise((resolve, reject) => {
            console.log('user-delete');
            this.consult(API.user.delete, { id }, 'delete')
                .subscribe(
                    resolve,
                    error => {
                        reject(error);
                    }
                );
            resolve();
        });
    }
    login(params: any) {
        return new Promise((resolve, reject) => {
            console.log('user-login');
            this.consult(API.user.login, params, 'post')
                .subscribe(
                    resolve,
                    error => {
                        reject(error);
                    }
                );
        });
    }
    logout(token: string) {
        return new Promise((resolve, reject) => {
            console.log('user-logout');
            this.consult(API.user.logput, { token }, 'delete')
                .subscribe(
                    resolve,
                    error => {
                        reject(error);
                    }
                );
            resolve();
        });
    }
}