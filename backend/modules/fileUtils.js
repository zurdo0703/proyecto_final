/* global config */

let multer = require('multer'),
    fs = require('fs'),
    random = require('randomstring');

let fileUtils = {};

/**
 * @description verifica si el usuario tiene asignado un determinado permiso
 * @param {String} permission un string con el nombre del permiso que se va a verificar
 * @param {User} user una isntancia del usuario que se va a verificar
 * @returns {boolean} devuelve true si el usuario tiene el permiso, y fal en cualquier otro caso
 * */
fileUtils.upload = (options) => {
    let storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, options.path);
        },
        filename: (req, file, callback) => {
            let newfilename = random.generate(options.filenameLength);

            while (fs.existsSync(options.path + newfilename))
                newfilename = random.generate(options.filenameLength);

            callback(null, newfilename);
        }
    });
    return multer({ storage: storage }).any();
};

fileUtils.getPublicURL = (url) => {
    let template = /^(\w+):/.exec(url);
    if (template) {
        switch (template[1]) {
            case 'public':
                path = `${config.application.host}/files/public/${url.replace(/^\w+:\/?\//, '')}`;
                break;
            case 'private':
                path = `${config.application.host}/file/private/${url.replace(/^\w+:\/?\//, '')}`;
                break;
            default:
                path = `${config.application.host}/${url}`;
                break;
        }
        return path;
    } else
        return `${config.application.host}/${url}`;
};

fileUtils.getFiles = (url) => {
    return new Promise((resolve, reject) => {
        fs.readdir(url, (err, files) => {
            let fileList = [];
            if (err)
                reject(err);
            else {
                files.forEach(file => {
                    fs.stat(`${url}/${file}`, (err, stats) => {
                        if (err)
                            reject(err);
                        else {
                            stats.filename = file;
                            stats.filePath = url;
                            fileList.push(stats);
                            if (fileList.length >= files.length)
                                resolve(fileList);
                        }
                    });
                });
            }
        });
    });
};
fileUtils.exist = (uri) => {
    var absoluteThumbnailPath = config.application.systemPath + '/' + config.uploads.defaultPrivateFolder + uri;
    return fs.existsSync(absoluteThumbnailPath);
};
fileUtils.createPath = (uri) => {
    var path = uri.split('/');
    path.pop();
    var segment = config.application.systemPath + '/' + config.uploads.defaultPrivateFolder;
    for (var i in path) {
        segment += '/' + path[i];
        try {
            fs.mkdirSync(segment, 777);
        } catch (e) {
        }
    }
};

module.exports = fileUtils;