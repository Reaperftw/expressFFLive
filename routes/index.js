var express = require('express');
var router = express.Router();
var mysql = require('mysql');
//var conn = require('./connection.js');

var conn = mysql.createConnection({
  host      : '192.168.1.100',
  port      : '3306',
  user      : 'fflive',
  password  : 'football',
  database  : 'FFLive'
});


/* GET home page. */
router.get('/', function(req, res) {

  //connection.connect();
  conn.query('SELECT * FROM leagues', function(err, lRows) {
    if (err) throw err;
  //  return rows;

    var wfRows = conn.query('SELECT * FROM webFront where page="index"', function(fail, wfRows) {
      if (fail) throw fail;
    //return rows;
      res.render('index', {title: 'FFLive', 'leagues': lRows, 'status': wfRows[0].status, 'gameweek':wfRows[0].currGameweek});
    });
  });
});
  //connection.end(function (err) {
  //  if (err) throw err;
  //});



module.exports = router;
