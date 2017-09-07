var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');

var config = require('config');
config.load();

var database = require('database');
database.init();

var routeIndex = require('./routes/index');
var routeLogIn = require('./routes/login');
var routeCite = require('./routes/cite');
var routeFormatted = require('./routes/formatted');
var routeProfile = require('./routes/profile');
var routeLogOut = require('./routes/logout');

var app = express();

app.set('trust proxy', true);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(config.session));

app.use('/', routeIndex);
app.use('/login', routeLogIn);
app.use('/cite', routeCite);
app.use('/formatted', routeFormatted);
app.use('/profile', routeProfile);
app.use('/logout', routeLogOut);

// Trust proxy
/*app.use(function(req, res, next) {
    req.connection.proxySecure = true;
    next();
});*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
