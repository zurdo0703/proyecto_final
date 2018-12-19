var express = require('express');
var router = express.Router();
var object = require('../modules/objectsAndTypes');
//var commandUtils = require('../modules/commandUtils');



router.get('/:id/comment/', (req, res, next) => {
  object.get('Comment', req.params.id, 1)
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});

router.post('/:id/comment/save/', passport.authenticate('bearer', { session: false }), (req, res, next) => {
  object.save([
    'texto',
  ], req.query, 'Comment')
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});

router.delete('/:id/comment/delete/', passport.authenticate('bearer', { session: false }), (req, res, next) => {
  object.delete('Comment', req.params.id)
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});






module.exports = router;
