/* global config */

let fileUtils = require('../modules/fileUtils'),
    sharp = require('sharp');

let util = {};

/**
 * @description verifica si el usuario tiene asignado un determinado permiso
 * @param {String} permission un string con el nombre del permiso que se va a verificar
 * @param {User} user una isntancia del usuario que se va a verificar
 * @returns {boolean} devuelve true si el usuario tiene el permiso, y fal en cualquier otro caso
 * */
util.check = (url) => {
    return new Promise((resolve, reject) => {
        var result = config.validate.thumbnailUrl.exec(url);
        let display = result[1] ? {
            width: result[2],
            height: result[3]
        } : false;
        let uri = result[4] ? result[4] : false;

        if (display) {
            //solicita un thumbnail
            let thumbnailPath = `/thumbnails/${display.width}x${display.height}/${uri}`;

            if (!fileUtils.exist(thumbnailPath))
                fileUtils.createPath(thumbnailPath);

            var absolutePathOriginalImage = config.application.systemPath + '/' + config.uploads.defaultPrivateFolder + '/tmp/' + uri;
            var absolutePathThumbnail = config.application.systemPath + '/' + config.uploads.defaultPrivateFolder + thumbnailPath;

            sharp(absolutePathOriginalImage)
                .resize(parseInt(display.width), parseInt(display.height))
                .toFile(absolutePathThumbnail, (err, info) => {
                    if (!err) {
                        info.filepath = thumbnailPath;
                        resolve(info);
                    } else
                        reject(err);
                });
        } else
            //solicita la imagen sin thumbnail
            resolve({
                filepath: '/' + uri
            });
    });
};


module.exports = util;