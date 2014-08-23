var express = require('express');
var router = express.Router();
//var mysql = require('mysql');
var conn = require('./connection');
var util = require('util');

/* GET home page. */
router.get('/', function(req, res) {

  //conn.connect();
  //console.log(util.inspect(conn));
  conn.query('SELECT * FROM leagues', function(err, lRows) {
    if (err) {  console.log(util.inspect(err));
      res.render('404error');
	  return;
    }

    var wfRows = conn.query('SELECT * FROM webFront where page="index"', function(fail, wfRows) {
      if (fail) {  console.log(util.inspect(fail));
        res.render('404error');
		return;
      }
    //return rows;
      res.render('index', {title: 'FFLive', 'leagues': lRows, 'status': wfRows[0].status, 'gameweek':wfRows[0].currGameweek});
    });
  });
});

module.exports = router;
