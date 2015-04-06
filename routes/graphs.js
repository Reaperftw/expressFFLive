var express = require('express');
var router = express.Router();
var pool = require('./connection');
var util = require('util');
require('log-timestamp');

function getLeagueName(id, callback) {
  pool.getConnection(function(connErr, conn) {
    if(connErr) {
      console.log(util.inspect(connErr));
      res.render('404error');
      return;
    }
    else {
      conn.query('SELECT * FROM leagues WHERE ID = ' + id, function (error, league) {
        if (error) {
          console.log(util.inspect(error));
          res.render('404error');
          return;
        }
        callback(league);
      });
    }
    conn.release();
  });
}

router.get('/:id', function(req, res) {
  console.log('');
  var id = req.params.id;
  if(id=='players') {
    res.render('playersGraph', {title: 'FFLive - Top Player Picks'});
  }
  else {
    getLeagueName(id, function(rows) {
      res.render('graphs', {title: 'FFLive - Stats Graphs for "' + rows[0].name + '"','id': id});
    });
  }
});

module.exports = router;
