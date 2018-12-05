var express = require('express');
var router = express.Router();
var object = require('../modules/objectsAndTypes');
var commandUtils = require('../modules/commandUtils');

router.get('/:id', (req, res, next) => {
  object.get('Post', req.params.id, 1)
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});

router.post('/save', passport.authenticate('bearer', { session: false }), (req, res, next) => {
  object.save([
    'texto', 'id_file'
  ], req.query, 'Post')
    .then(response => {
      let commandPost = commandUtils.getCommand('model', response);
      commandPost[0].content.user = req.session.user.id;
      commandPost[0].content.save();
      commandUtils.replaceCommand('model', 'post', response, commandPost[0]);

      

      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});

router.put('/save/:id', (req, res, next) => {
  let values = req.query;
  values.id = req.params.id;
  object.update([
    'texto','id_file'
  ], values, 'Post')
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});

router.delete('/delete/:id', (req, res, next) => {
  object.delete('Post', req.params.id)
    .then(response => {
      res.json({ status: true, content: response });
    })
    .catch(response => {
      res.json({ status: false, content: response });
    });
});

module.exports = router;
