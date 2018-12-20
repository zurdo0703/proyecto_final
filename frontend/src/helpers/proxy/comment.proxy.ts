import { IProxy } from './iproxy';
import { AbstractProxy } from "./abstract.proxy";
import { API } from '../../config/api';

export class CommentProxy extends AbstractProxy implements IProxy {
  get(id: any) {
    return new Promise((resolve, reject) => {
      console.log('comment-get');
      this.consult(`${API.comment.get}/${id}`, {}, 'get')
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
      console.log('comment-save');
      const consult = id === null ?
        this.consult(API.comment.save, data, 'comment')
        : this.consult(`${API.comment.save}/${id}`, data, 'put');

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
      console.log('comment-delete');
      this.consult(API.comment.delete, { id }, 'delete')
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