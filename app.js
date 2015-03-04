//Add Timestamps to the top of the file
require('log-timestamp');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var league = require('./routes/league');
var team = require('./routes/team');
var leagueTeams = require('./routes/leagueTeams');
var graphs = require('./routes/graphs');
//var playerGraph = require('./routes/playerGraph');

var app = express();

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
