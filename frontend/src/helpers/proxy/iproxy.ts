export interface IProxy {
    get(id: any);
    save(id: number, data: Object);
    delete(id: number);
}