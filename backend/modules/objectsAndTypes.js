/* global models, config */
let object = {};
let utils = {};


/**
 * @description Inserta un nuevo Objeto con dependencias m:1 y 1:m
 * @param {Request} req el request del usuario, lo provee el router
 * @param {Response} res el objeto del router para sacar el Response hacia el usuario
 * @param {Object} fields objeto que contiene la lista de Fields que contiene el objeto y serán leídas desde el Request para procesarlas
 * @param {String} objectName el nombre del Modelo que se va a guardar
 * @param {String} objectTypeName el nombre del tipo de objeto que se va a guardar, representa la relacion m:1, por defecto es false en caso que no exista dicha relación
 * @param {Integer} defaultState estado por defecto del objeto que será insertado, por defecto el valor es 0
 * */
object.save = (fields, values, objectName, objectTypeName = false) => {
    return new Promise((resolve, reject) => {
        let response = [];

        let objectValues = utils.assignValues(fields, values);

        if (objectTypeName)
            models[objectTypeName]
                .findOne({ where: { id: objectValues.type } })
                .then(type => {
                    if (!type) {
                        response.push({ command: 'message', type: "error", content: objectName.toLowerCase() + " no existe" });
                        reject(response);
                    } else
                        object.__saveObject(fields, objectValues, objectName)
                            .then(resolve)
                            .catch(reject);
                });
        else
            object.__saveObject(fields, objectValues, objectName)
                .then(resolve)
                .catch(reject);
    });
};

/**
 * @description Inserta un nuevo Objeto con dependencias 1:m
 * @param {Request} req el request del usuario, lo provee el router
 * @param {Response} res el objeto del router para sacar el Response hacia el usuario
 * @param {Object} fields objeto que contiene la lista de Fields que contiene el objeto y serán leidas desde el Request para procesarlas
 * @param {Object} values un objeto que tiene los valores desde el Request ya procesados y listos para ser asignados
 * @param {String} objectName el nombre del Modelo que se va a guardar
 * @param {Integer} defaultState estado por defecto del objeto que será insertado, por defecto el valor es 0
 * */
object.__saveObject = (fields, values, objectName) => {
    return new Promise((resolve, reject) => {
        let response = [];
        models[objectName]
            .create(values)
            .then(object => {
                //se almacena el objeto principal
                response.push({ command: 'message', type: "info", content: objectName.toLowerCase() + " registrado" });
                response.push({ command: 'model', type: objectName.toLowerCase(), content: object });
                resolve(response);
                return object;
            })
            .then(object => {
                if (!object) {
                    response.push({ command: 'message', type: "error", content: objectName.toLowerCase() + " error al registrar" });
                    reject(response);
                }

                let childs = utils.getChildFields(fields, values);
                let args, extras = {}, ids = [];
                if (childs)
                    childs.forEach(child => {
                        extras[child.field] = {};
                        ids = [];
                        args = values[child.field];
                        for (let i in args)
                            if (args[i].extra) {
                                ids.push(args[i][0]);
                                extras[child.field][args[i][0]] = args[i].extra;
                                delete args[i].extra;
                            } else
                                ids.push(args[i]);

                        //se asocian los  hijos (ya deben existir), se escriben los campos extra si los hay
                        models[child.model]
                            .findAll({ where: { id: { $in: ids } } })
                            .then(childObjects => {
                                for (let j in childObjects)
                                    if (extras[child.field][childObjects[j].id])
                                        childObjects[j][`${objectName}_${child.model}`] = extras[child.field][childObjects[j].id];
                                object[`set${child.as}`](childObjects);
                            });
                    });
                //esta funcion no llama el resolve
            })
            .catch(error => {
                response.push({ command: 'message', type: "error", content: objectName.toLowerCase() + " arror al registrar" + error });
                reject(response);
            });
    });
};

/**
 * @description Actualiza un Objeto con dependencias m:1 y 1:m
 * @param {Request} req el request del usuario, lo provee el router
 * @param {Response} res el objeto del router para sacar el Response hacia el usuario
 * @param {Object} fields objeto que contiene la lista de Fields que contiene el objeto y serán leídas desde el Request para procesarlas
 * @param {String} objectName el nombre del Modelo que se va a guardar
 * @param {String} objectTypeName el nombre del tipo de objeto que se va a guardar, representa la relacion m:1, por defecto es false en caso que no exista dicha relación
 * @param {Integer} defaultState estado por defecto del objeto que será insertado, por defecto el valor es 0
 * @return {void} no devuelve nada en absoluto
 * */
object.update = (fields, values, objectName, objectTypeName = false) => {
    return new Promise((resolve, reject) => {
        let response = [];

        let objectValues = utils.assignValues(fields, values);
        if (objectTypeName)
            models[objectTypeName]
                .findOne({ where: { id: objectValues.type } })
                .then(type => {
                    if (!type) {
                        response.push({ command: 'message', type: "error", content: objectTypeName.toLowerCase() + " no existe" });
                        reject(response);
                    } else
                        object.__updateObject(fields, values, objectName)
                            .then(resolve)
                            .catch(reject);
                });
        else
            object.__updateObject(fields, values, objectName)
                .then(resolve)
                .catch(reject);
    });
};

/**
 * @description Actualiza un nuevo Objeto con dependencias 1:m
 * @param {Request} req el request del usuario, lo provee el router
 * @param {Response} res el objeto del router para sacar el Response hacia el usuario
 * @param {Object} fields objeto que contiene la lista de Fields que contiene el objeto y serán leídas desde el Request para procesarlas
 * @param {String} objectName el nombre del Modelo que se va a guardar
 * @return {void} no devuelve nada en absoluto
 * */
object.__updateObject = (fields, values, objectName) => {
    return new Promise((resolve, reject) => {
        let response = [];
        models[objectName]
            .findOne({ where: { id: values.id } })
            .then(object => {
                if (!object) {
                    response.push({ command: 'message', type: 'error', content: objectName.toLowerCase() + " no existe" });
                    reject(response);
                    return;
                }

                utils.assignValues(fields, values, object);

                object.save();

                response.push({ command: 'message', type: "info", content: objectName.toLowerCase() + " actualizada" });
                response.push({ command: 'model', type: objectName.toLowerCase(), content: object });
                resolve(response);
                return object;
            })
            .then(object => {
                if (!object)
                    return;

                let childs = utils.getChildFields(fields, values);
                let args, extras = {}, ids = [];
                if (childs)
                    childs.forEach(child => {
                        extras[child.field] = {};
                        ids = [];
                        args = values[child.field];
                        for (let i in args) {
                            if (args[i].extra) {
                                ids.push(args[i][0]);
                                extras[child.field][args[i][0]] = args[i].extra;
                                delete args[i].extra;
                            } else {
                                ids.push(args[i]);
                            }
                        }

                        //se asocian los  hijos (ya deben existir), se escriben los campos extra si los hay
                        models[child.model]
                            .findAll({ where: { id: { $in: ids } } })
                            .then(childObjects => {
                                for (let j in childObjects)
                                    if (extras[child.field][childObjects[j].id])
                                        childObjects[j][`${objectName}_${child.model}`] = extras[child.field][childObjects[j].id];

                                object[`set${child.as}`](childObjects);
                            });
                    });
            })
            .catch(error => {
                response.push({ command: 'message', type: "error", content: objectTypeName.toLowerCase() + " error al actualizar" });
                response.push({ command: 'message', type: "system", content: error });
                reject(response);
            });
    });
};

/**
 * @description permite obtener un objeto en particular o una lista de objetos paginados segun la necesidad
 * @param {Request} req el request del usuario, lo provee el router
 * @param {Response} res el objeto del router para sacar el Response hacia el usuario
 * @param {String} objectName el nombre del Modelo que se va a consultar
 * @param {Array} includes la lista de includes que debe tener el objeto que se va a consultar, eso en caso que requieran que los objetos compuestos sean parte del resultado, por defecto es false y en ese caso solo se obtiene el objeto a consultar y no sus componentes complejos
 * @return {void} no devuelve nada en absoluto
 * */
object.get = (objectName, id = 'all', page = 1, includes = false, where = false, filter = false, order = false) => {
    return new Promise((resolve, reject) => {
        if (/all/i.test(id)) {
            page = page ? parseInt(page - 1) : 0;

            //se obtienen todos los registros paginados solo si se tienen permisos
            let params = {};
            params.limit = config.application.maxItemsPerPage;
            params.offset = page * config.application.maxItemsPerPage;

            if (includes && includes.all)
                params.include = includes.all;

            if (where && where.all)
                params.where = where.all;

            if (order)
                params.order = order;

            //params.logging = console.log;

            models[objectName]
                .findAll(params)
                .then(list => {
                    if (list && list.length > 0) {
                        if (filter && filter.callback) {
                            return filter.callback(list, filter.params)
                                .then(filtered => {
                                    let response = [];
                                    if (filtered.list.length > 0) {
                                        response.push({ command: 'list', type: objectName.toLowerCase(), content: filtered.list });
                                        response.push({ command: 'filter', type: objectName.toLowerCase(), content: filtered.filters });
                                        resolve(response);
                                    } else
                                        reject([{ command: 'message', type: 'error', content: "sin resultados" }]);
                                })
                                .catch(message => {
                                    reject([{ command: 'message', type: 'error', content: message }]);
                                });
                        } else
                            resolve([{ command: 'list', type: objectName.toLowerCase(), content: list }]);
                    } else
                        //ya no hay actividades en la pagina solicitada
                        reject([{ command: 'message', type: 'error', content: "sin resultados" }]);
                })
                .catch(m => {
                    reject([{ command: 'message', type: 'error', content: m }]);
                });

        } else if (/\d+/.test(id)) {
            let params = {};
            params.where = { id: id };

            if (includes && includes.id)
                params.include = includes.id;

            if (where && where.id)
                params.where = Object.assign(where.id, params.where);

            models[objectName]
                .findOne(params)
                .then(object => {
                    if (object) {
                        //la actividad existe en la base de datos
                        resolve([{ command: 'model', type: objectName.toLowerCase(), content: object }]);
                    } else
                        //la actividad no existe en la base de datos, se devuelve un mensaje de error
                        reject([{ command: 'message', type: 'error', content: objectName.toLowerCase() + " no existe" }]);
                })
                .catch(m => {
                    reject([{ command: 'message', type: 'error', content: m }]);
                });
        } else
            reject({ command: 'message', type: 'error', content: "error" });
    });
};

/**
 * @description hace el borrado de un objeto de la base de datos
 * @param {Request} req el request del usuario, lo provee el router
 * @param {Response} res el objeto del router para sacar el Response hacia el usuario
 * @param {String} objectName el nombre del Modelo que se va a consultar
 * @param {Boolean} forced indica si el borrado es lógico o real, si es true, se hace el borrado real
 * @return {void} no devuelve nada en absoluto
 * */
object.delete = (objectName, id) => {
    return new Promise((resolve, reject) => {
        let response = new Array();
        models[objectName]
            .findOne({ where: { id } })
            .then(object => {
                if (object) {
                    object.destroy({ force: true });

                    response.push({ command: 'message', type: 'info', content: objectName.toLowerCase() + " fue borrado" });
                    resolve(response);
                } else {
                    response.push({ command: 'message', type: 'error', content: objectName.toLowerCase() + " no existe" });
                    reject(response);
                }
            });
    });
};

/**
 * @description hace la asignacion de valores a un objeto con una lista de campos para buscar, hace distincion entre los diferentes tipos de campos y formatos con los que deben ser configurados dichos valores.
 * @param {Array} fields objeto que contiene la lista de Fields que contiene el objeto y serán leídas desde el Request para procesarlas
 * @param {Object} values un objeto que tiene los valores desde el Request
 * @param {Model} obj un objeto sobre el cual se requiere hacer la actualización de valores, sino se pasa se genera uno nuevo el cual es devuelto en el return
 * @return {Object|Model} devuelve el objeto con los nuevos valores, si se pasó la variable 'obj' ese objeto queda actualizado por referencia, sino el resultado es un objeto nuevo, en ambos casos el valor devuelto es el objeto actualizado
 * */
utils.assignValues = (fields, values, obj = {}) => {
    if (values) {
        let type = '';
        fields.forEach(field => {
            if (typeof field === 'string') {
                type = typeof values[field];
                if (type !== 'undefined')
                    switch (type) {
                        case 'number':
                        case 'array':
                        case 'object':
                            obj[field] = values[field];
                            break;
                        default:
                            if (values[field].length > 0)
                                obj[field] = values[field];
                            break;
                    }
            } else if (typeof field === 'object') {
                let fieldType = Object.values(field).pop();
                let fieldName = Object.keys(field).pop();
                if (values[fieldName]) {
                    switch (fieldType) {
                        case 'Date':
                            obj[fieldName] = new Date(values[fieldName]);
                            break;
                        case 'Point':
                            obj[fieldName] = { type: 'Point', coordinates: values[fieldName] };
                            break;

                    }
                }
            }
        });
    }
    return obj;
};

/**
 * @description obtiene la lista de campos que pertenecen a relaciones 1:m y que además sus valores existen en el objeto de 'values'
 * @param {Array} fields objeto que contiene la lista de Fields que contiene el objeto y serán leídas desde el Request para procesarlas
 * @param {Object} values un objeto que tiene los valores desde el Request
 * @return {void} devuelve el objeto con los nuevos valores, si se pasó la variable 'obj' ese objeto queda actualizado por referencia, sino el resultado es un objeto nuevo, en ambos casos el valor devuelto es el objeto actualizado
 * */
utils.getChildFields = (fields, values) => {
    let childs = [];
    fields.forEach(field => {
        if (typeof field === 'object') {
            let fieldType = Object.values(field)[0];
            let fieldName = Object.keys(field)[0];
            if (values[fieldName] && fieldType === 'Child') {
                childs.push({
                    field: fieldName,
                    model: field.model,
                    as: field.as
                });
            }
        }
    });
    return childs.length > 0 ? childs : false;
};

/**
 * @description limpia las llaves de un objeto de arreglo
 * @param {Object} array objeto que contiene la lista de Fields que contiene el objeto y serán leídas desde el Request para procesarlas
 * @param {RegExp} regexp un objeto que tiene los valores desde el Request
 * @return {Object} devuelve el objeto con los nuevos valores, si se pasó la variable 'obj' ese objeto queda actualizado por referencia, sino el resultado es un objeto nuevo, en ambos casos el valor devuelto es el objeto actualizado
 * */
utils.cleanArrayKeys = (array, regexp = /\d+/) => {
    let tmpKey = -1;
    let newArray = {};
    if (array)
        for (let key in array) {
            tmpKey = regexp.exec(key);
            if (tmpKey)
                newArray[tmpKey.shift()] = array[key];
        }
    return newArray;
};

module.exports = object;
module.exports.utils = utils;