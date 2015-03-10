//Add Timestamps to the top of the file
require('log-timestamp');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var util = require('util');

var index = require('./routes/index');
var league = require('./routes/league');
var team = require('./routes/team');
var leagueTeams = require('./routes/leagueTeams');
var graphs = require('./routes/graphs');
//var playerGraph = require('./routes/playerGraph');

var app = express();

/*
//ioServer
var ioapp = express().createServer();
var io = require('socket.io')(app);

ioapp.listen(80);

ioapp.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
*/

var io = require('socket.io').listen(3001);
/*
io.sockets.on('connection', function (socket) {
  socket.on('message', function (message) {
    console.log("Got message: " + message);
    io.sockets.emit('pageview', { 'url': message });
  });
});*/
/*
io.configure(function () {
  io.set('authorization', function (handshakeData, callback) {
    if (handshakeData.xdomain) {
      callback('Cross-domain connections are not allowed');
    } else {
      callback(null, true);
    }
  });
});
*/
io.sockets.on('connection', function (socket) {

  socket.on('message', function (message) {

    ip = socket.request.connection.remoteAddress;
    url = message;
    console.log("Client:" + ip);
    io.sockets.emit('pageview', {'connections': io.engine.clientsCount, 'ip': ip, 'url': url, 'xdomain': socket.handshake.xdomain, 'timestamp': new Date()});
  });

  socket.on('disconnect', function () {
    console.log("Socket disconnected");
    io.sockets.emit('disconnect', { 'connections': io.engine.clientsCount});
  });

});


app.use(favicon(path.join(__dirname,'public','images','raspberrypi.ico')));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon());
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

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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
