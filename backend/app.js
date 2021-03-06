var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var sessionVerifier = require('./modules/session-verifier');
var logger = require('morgan');
var device = require('express-device');

require('./modules/authentication-verifier');

var allRouter = require('./routes/all');
var indexRouter = require('./routes/index');
var postRouter = require('./routes/post');
var commentRouter = require('./routes/comment');
var likeRouter = require('./routes/like');
var usersRouter = require('./routes/users');
var fileRouter = require('./routes/file');

var app = express();

config.application.systemPath = __dirname;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(device.capture({ parseUserAgent: true }));

app.use(sessionVerifier.restoreSessionFix);
app.use(allRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/file', fileRouter);
app.use('/post', postRouter);
app.use('/post', commentRouter);
app.use('/post', likeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
