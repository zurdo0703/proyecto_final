var util = {};

/**
 * @description obtiene la session viva
 * @param {models\User} user must be Live objets points to user
 * @param {Request} req is a obnject than represents user request from express
 * @param {Callback} callback callback to report results
 * */

util.getSessionByToken = (token) => {
    return new Promise((resolve, reject) => {
        models.User
            .findOne({ where: { token } })
            .then(user => {
                if (user) {
                    //updates session expires
                    user.save();
                    resolve(user);
                } else
                    resolve(false);
            });
    });
};

util.restoreSessionFix = (req, res, next) => {
    req.query = req.query || req.body || {};
    let qEmpty = true;
    for (var i in req.query) {
        qEmpty = false;
        break;
    }
    let bEmpty = true;
    for (var i in req.body) {
        bEmpty = false;
        break;
    }
    if (qEmpty && !bEmpty)
        req.query = req.body;

    if (req.query['_'])
        delete req.query['_'];

    res.header('X-Powered-By', config.application.xPowerBy);

    req.session = {};
    req.session.device = req.device.type;
    req.session.agent = req.device.parser.useragent;
    req.session.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Get IP - allow for proxy
    req.session.referrer = req.headers['referrer'] || ''; //  Likewise for referrer

    /*pequeña trampa pq la sesison es debil y se peirde con facilidad*/
    if (req.header('Authorization')) {
        req.session.token = req.header('Authorization').split(' ').pop();
        util.getSessionByToken(req.session.token)
            .then(user => {
                if (user)
                    req.session.user = user;

                next();
            });
    } else
        next();
};

module.exports = util;