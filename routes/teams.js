var express = require('express');
var router = express.Router();
var mysql = require('mysql');
//var conn = require('./connection.js');

var conn = mysql.createConnection({
  host      : 'localhost',
  port      : '8080',
  user      : 'matt',
  password  : 'password',
  database  : 'FFLiveDev'
});


/* GET home page. */
router.get('/:id/:gw', function(req, res) {
  var id = req.params.id;
  var gw = req.params.gw;
  conn.query('SELECT name from leagues WHERE ID =' + id, function (err, nameRows) {
    if (err) throw err;

    conn.query('SELECT * FROM teamsGW' + gw, function(err, rows) {
      if (err) throw err;
        res.render('league', {title: 'FFLive - ' + nameRows[0].name, 'teams':rows });
    });
  });
});



module.exports = router;