/* global models, locale */
let utils = {};

/**
 * @description determina si un email existe o no para los usuarios registrados
 * @param {String} email el email que se debea buscar
 * @param {Callback} fn la funcion callbak para invocar cuando el resultado este listo
 **/
utils.emailExist = (email) => {
    return new Promise((resolve, reject) => {
        models.User
            .findOne({ where: { email } })
            .then(user => {
                resolve(!(!user));
            }).catch(reject);
    });
};

module.exports = utils;
