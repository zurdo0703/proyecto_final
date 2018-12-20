import { IProxy } from './iproxy';
import { AbstractProxy } from "./abstract.proxy";
import { API } from '../../config/api';

export class LikeProxy extends AbstractProxy implements IProxy {
  get(id: any) {
    return new Promise((resolve, reject) => {
      console.log('file-get');
      this.consult(`${API.file.get}/${id}`, {}, 'get')
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
      console.log('file-save');
      const consult = id === null ?
        this.consult(API.file.save, data, 'file')
        : this.consult(`${API.file.save}/${id}`, data, 'put');

      consult.subscribe(
        resolve,
        error => {
          reject(error);
        }
      );
    });
  }

  delete(id: number) {
    return new Promise((resolve, reject) => {
      console.log('file-delete');
      this.consult(API.file.delete, { id }, 'delete')
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