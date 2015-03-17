//Add Timestamps to the top of the file
require('log-timestamp');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io');

var conn = require('./routes/connection');

var index = require('./routes/index');
var league = require('./routes/league');
var team = require('./routes/team');
var leagueTeams = require('./routes/leagueTeams');
var graphs = require('./routes/graphs');

var app = express();

app.use(favicon(path.join(__dirname,'public','images','raspberrypi.ico')));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Request Log Middleware
app.use(function (req, res, next) {
  if (req.url.split('/')[1].valueOf() == 'stylesheets' || req.url.split('/')[1].valueOf() == 'images' || req.url.split('/')[1].valueOf() == 'javascripts') {

  }
  else {
    console.log('IP: ' + req.connection.remoteAddress + ', Page: ' + req.url);
  }
  next();
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/league/', league);
app.use('/league/:id', league);
app.use('/league/:id/:gw', league);
app.use('/team/', team);
app.use('/team/:id/', team);
app.use('/team/:id/:gw', team);
app.use('/leagueTeams/', leagueTeams);
app.use('/leagueTeams/:id', leagueTeams);
app.use('/leagueTeams/:id/:gw', leagueTeams);
app.use('/graphs', graphs);
app.use('/graphs/:id', graphs);
app.use('/dashboard', require('./routes/dashboard'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Server Settings
app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});


//Socket IO Settings + Commands
io = io.listen(server);

io.sockets.on('connection', function (socket) {

  socket.on('message', function (message) {

    ip = socket.request.connection.remoteAddress;
    url = message;
    //console.log("Client:" + ip);
    io.sockets.emit('pageview', {'connections': io.engine.clientsCount, 'ip': ip, 'url': url, 'xdomain': socket.handshake.xdomain, 'timestamp': new Date()});
    io.sockets.emit('disconnect', { 'connections': io.engine.clientsCount});
  });

  socket.on('disconnect', function () {
    //console.log("Socket disconnected");
    io.sockets.emit('disconnect', { 'connections': io.engine.clientsCount});
  });

});


/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
