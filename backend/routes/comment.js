var express = require('express');
var router = express.Router();
var object = require('../modules/objectsAndTypes');
//var commandUtils = require('../modules/commandUtils');


router.post('/:id/comment/save/', passport.authenticate('bearer', { session: false }), (req, res, next) => {
  object.save([
    'texto',
  ], req.query, 'comment')
    .then(response => {


      

      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});







module.exports = router;
