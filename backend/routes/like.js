var express = require('express');
var router = express.Router();
var object = require('../modules/objectsAndTypes');
var commandUtils = require('../modules/commandUtils');


router.post('/:id/like/save/', passport.authenticate('bearer', { session: false }), (req, res, next) => {
  object.save([
    'accion',
  ], req.query, 'Like')
    .then(response => {

      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});

router.delete('/:id/like/delete/', passport.authenticate('bearer', { session: false }), (req, res, next) => {
  object.delete('Like', req.params.id)
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});







module.exports = router;
