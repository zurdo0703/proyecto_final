import { IProxy } from './iproxy';
import { AbstractProxy } from "./abstract.proxy";
import { API } from '../../config/api';

export class LikeProxy extends AbstractProxy implements IProxy {
  get(id: any) {
    return new Promise((resolve, reject) => {
      console.log('like-get');
      this.consult(`${API.like.get}/${id}`, {}, 'get')
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
      console.log('like-save');
      const consult = id === null ?
        this.consult(API.like.save, data, 'like')
        : this.consult(`${API.like.save}/${id}`, data, 'put');

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
      console.log('like-delete');
      this.consult(API.like.delete, { id }, 'delete')
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