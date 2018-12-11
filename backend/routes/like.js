var express = require('express');
var router = express.Router();
var object = require('../modules/objectsAndTypes');
var commandUtils = require('../modules/commandUtils');


router.post('/:id/like/save/', passport.authenticate('bearer', { session: false }), (req, res, next) => {
  object.save([
    'accion',
  ], req.query, 'like')
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
