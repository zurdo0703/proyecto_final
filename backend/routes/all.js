/* global passport */

var express = require('express'),
    router = express.Router();

router.options('*', (req, res, next) => {
    res.header("Access-Control-Allow-Headers", 'Authorization, content-type');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.send();
});

router.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Headers", 'Authorization, content-type');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Vary', 'Accept-Encoding');
    next();
});

module.exports = router;