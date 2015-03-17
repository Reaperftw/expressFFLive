var express = require('express');
var router = express.Router();
var conn = require('./connection');
require('log-timestamp');
var util = require('util');
var getAllTeamData = require('./getTeamData');

function allTeams(leagueID, gw, response) {
  var teamErr = false;
  conn.query('SELECT managerID, leagueID FROM leagues_teamsGW' + gw + ' WHERE leagueID =' + leagueID, function (err10, teams) {
    if(err10) {
      console.log(util.inspect(err10));
      teamErr = true;
      callback(teamErr);
    }
    else {
      var allTeams = new Object();

      for(var row = 0; row < teams.length; row++) {
        var dataCount = 0;
        getAllTeamData(String(teams[row].managerID), gw, function (err, teamData, manID) {

          if(err) {
            console.log(util.inspect(err));
            teamErr = true;
            response(teamErr);
          }
          else {
            dataCount ++;
            allTeams[manID] = teamData;

            if(dataCount == teams.length) {
              response(teamErr, allTeams);
            }
          }
        });
      }
    }
  });
}

router.get('/:id/:gw', function(req, res) {
  var id = conn.escape(req.params.id);
  var gw = conn.escape(req.params.gw);
  conn.query('SELECT * FROM leagues WHERE ID =' + id, function(err1, name) {
    if (err1) {
      console.log(util.inspect(err1));
      res.render('404error');
    }
    else {
      allTeams(id, gw, function(err, allData) {
        //console.log(allData);
        if(err) {
          res.render('404error');
        }
        else {
          //console.log(util.inspect(allData));
          console.log('');
          res.render('leagueTeams', {title: 'FFLive - All Teams for "' + name[0].name + '" for GW:' + gw, 'allData': allData, 'gameweek':gw});
        }
      });
    }
  });
});

module.exports = router;
