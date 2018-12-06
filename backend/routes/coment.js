var express = require('express');
var router = express.Router();
var object = require('../modules/objectsAndTypes');
var commandUtils = require('../modules/commandUtils');

router.get('/:id', (req, res, next) => {
  object.get('coment', req.params.id, 1)
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});

router.post('save/:id', passport.authenticate('bearer', { session: false }), (req, res, next) => {
  object.save([
    'texto',
  ], req.query, 'coment')
    .then(response => {


      // let commandPost = commandUtils.getCommand('model', response);
      // commandPost[0].content.user = req.session.user.id;
      // commandPost[0].content.save();
      // commandUtils.replaceCommand('model', 'post', response, commandPost[0]);



      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});







module.exports = router;
