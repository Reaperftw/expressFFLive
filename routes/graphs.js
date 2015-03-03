var express = require('express');
var router = express.Router();
var conn = require('./connection');
var util = require('util');
require('log-timestamp');

function getLeagueName(id, callback) {
  conn.query('SELECT * FROM leagues WHERE ID = ' + id, function (error, league) {
    if (error) {
      console.log(util.inspect(error));
      res.render('404error');
      return;
    }
    callback(league);
  });
}

router.get('/:id', function(req, res) {
  var id = req.params.id;
  console.log('');

  getLeagueName(id, function(rows) {
    res.render('graphs', {title: 'FFLive - Stats Graphs for ""' + rows[0].name + '"','id': id});
  });
});

module.exports = router;