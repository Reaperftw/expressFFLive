var express = require('express');
var router = express.Router();
var pool = require('./connection');
var util = require('util');
require('log-timestamp');
var getAllTeamData = require('./getTeamData');

function getData(leagueid, gw, callback) {
  pool.getConnection(function(connErr, conn) {
    if(connErr) {
      console.log(util.inspect(connErr));
      callback(connErr);
    }
    else {
      conn.query('SELECT * FROM leagues_teamsGW' + gw + ' WHERE leagueID = ' + leagueid, function (err, managerIDs) {
        callback(err, managerIDs);
      });
    }
    conn.release();
  });
}



router.get('/:id/:gw', function(req, res) {
  var id = req.params.id;
  var gw = req.params.gw;

  getAllTeamData(id, gw, function(err, allData) {

    if(err) {
      res.render('404error');
    }
    else {
      //console.log(util.inspect(allData));
      console.log('');
      res.render('team', {title: 'FFLive - "' + allData.teamInfo[0].teamName + '" for GW:' + gw, 'allData': allData, 'gameweek':gw});
    }
  });
});





module.exports = router;
