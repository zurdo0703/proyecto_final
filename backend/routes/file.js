/* global passport, __dirname, locale */

let express = require('express'),
    router = express.Router(),
    path = require('path'),
    thumbnail = require('../modules/thumbnail'),
    fileUtils = require('../modules/fileUtils');

/**
 * @description router para cargar todos los archivos, por defecto todos los
 *  archivos son privados y con permisos de solo lectura y seran de imposible
 *  acceso ya que su nombre sera creado al azar y sin extension, esto por
 *  razones de seguridad para que no sean cargados archivos con scripts
 *  potencialmente peligrosos, para los archivos que seran publicos se
 *  debe especificar explicitamente que son publicos y en ese caso su
 *  extension se conservara.
 * */
router.post('/upload', (req, res, next) => {
    console.log('router.file.upload');
    upload = fileUtils.upload({
        path: path.join(__dirname, '../' + config.uploads.defaultPrivateUpload),
        filenameLength: config.uploads.filenameLength
    });

    upload(req, res, err => {
        let response = new Array();

        if (!err && (!req.files || req.files.length < 1))
            err = 'no hay nada que cargar';

        if (err) {
            response.push({ command: 'message', type: "error", content: 'error al subir el archivo' });
            res.json({ status: false, response: response });
        } else {
            let files = [];
            req.files.forEach(file => {
                let fileValues = {};
                fileValues.filename = file.filename;
                fileValues.originalName = file.originalname;
                fileValues.mime = file.mimetype;
                fileValues.path = file.path
                    .replace(path.join(__dirname, '../public/files/private/'), 'private://')
                    .replace(/\\/g, '/');
                fileValues.size = file.size;
                files.push(fileValues);
            });

            models.File
                .bulkCreate(files)
                .then((files) => {
                    let names = [];
                    for (var i in files)
                        names.push(files[i].filename);

                    models.File
                        .findAll({ where: { filename: { [models.Sequelize.Op.or]: names } } })
                        .then(files => {
                            if (files) {
                                response.push({ command: 'message', type: "info", content: 'archivo subido' });
                                if (files.length > 1)
                                    response.push({ command: 'array', type: "file", content: files });
                                else
                                    response.push({ command: 'model', type: "file", content: files.pop() });

                                res.json({ status: true, response: response });
                            } else {
                                response.push({ command: 'message', type: "info", content: 'ocurrio un error inesperado al subir el archivo' });
                                res.json({ status: false, response: response });
                            }
                        });
                });
        }
    });
});

router.get('/get/:id', (req, res, next) => {
    console.log('router.file.get');
    let response = [];
    models.File
        .findOne({ where: { id: req.params.id } })
        .then(file => {
            if (file) {
                response.push({ command: 'model', type: "file", content: file });
                res.json({ status: true, response: response });
            } else {
                response.push({ command: 'message', type: "error", content: 'ocurrio un error inesperado al subir el archivo' });
                res.json({ status: false, response: response });
            }
        });
});

router.get(config.validate.thumbnailUrl, (req, res, next) => {
    console.log('router.file.private');
    let filename = false;
    let uri = req.params[3];
    let options = {
        root: config.application.systemPath,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    var result = /\/?(\w+)$/.exec(uri);

    filename = result[1] ? result[1] : false;

    if (filename)
        models.File
            .findOne({ where: { filename } })
            .then(file => {
                if (file) {
                    options.headers['Content-Type'] = file.mime;
                    options.headers['Content-Disposition'] = `inline; filename="${file.originalName}"`;
                    options.headers['maxAge'] = '15d';

                    //verifica el thumbnail, si no existe lo genera
                    thumbnail.check(req.url)
                        .then(thumbnail => {
                            let imagePath = `/${config.uploads.defaultPrivateFolder}/${thumbnail.filepath}`;
                            res.sendFile(imagePath, options, function (err) {
                                if (err) {
                                    res.locals.message = `el archivo ${req.url} no existe`;
                                    res.locals.error = {};
                                    res.locals.error.status = `el archivo ${req.url} no existe`;
                                    res.locals.error.stack = "";
                                    res.status(400);
                                    res.json('error');
                                }
                            });
                        })
                        .catch(m => {
                            res.locals.message = `el archivo ${req.url} no existe`;
                            res.locals.error = {};
                            res.locals.error.status = `el archivo ${req.url} no existe`;
                            res.locals.error.stack = "";
                            res.status(400);
                            res.json('error');
                        });
                } else {
                    res.locals.message = `el archivo ${req.url} no existe`;
                    res.locals.error = {};
                    res.locals.error.status = `el archivo ${req.url} no existe`;
                    res.locals.error.stack = "";
                    res.status(400);
                    res.json('error');
                }
            });
    else {
        res.locals.message = `el archivo ${req.url} no existe`;
        res.locals.error = {};
        res.locals.error.status = `el archivo ${req.url} no existe`;
        res.locals.error.stack = "";
        res.status(400);
        res.json('error');
    }
});

module.exports = router;