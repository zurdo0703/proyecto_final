export class API {
    static PROTOCOL = 'http';
    static PORT = 3000;
    static HOST = 'localhost';
    static SERVER = `${API.PROTOCOL}://${API.HOST}:${API.PORT}`;

    static user = {
        get: `${API.SERVER}/users/`,
        save: `${API.SERVER}/users/save`,
        delete: `${API.SERVER}/users/delete`,
        login: `${API.SERVER}/users/login`,
        logput: `${API.SERVER}/users/logout`
    };
    static post = {
        get: `${API.SERVER}/post/`,
        save: `${API.SERVER}/post/save`,
        delete: `${API.SERVER}/post/delete`
    };
    static like = {
        save: `${API.SERVER}/post/:id/like/`,
        delete: `${API.SERVER}/post/:id/like/`
    };
    static comment = {
        save: `${API.SERVER}/post/:id/comment/`,
        delete: `${API.SERVER}/post/:id/comment/`
    };
    static file = {
        get: `${API.SERVER}/file/get/:id`,
        save: `${API.SERVER}/file/upload`
    };
}