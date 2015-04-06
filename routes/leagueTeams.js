var express = require('express');
var router = express.Router();
var pool = require('./connection');
require('log-timestamp');
var util = require('util');
var getAllTeamData = require('./getTeamData');

function allTeams(leagueID, gw, response) {
  var teamErr = false;
  pool.getConnection(function(connErr, conn) {
    if(connErr) {
      console.log(util.inspect(connErr));
      teamErr = true;
      callback(teamErr);
    }
    else {
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
    conn.release();
  });
}

router.get('/:id/:gw', function(req, res) {
  var id = req.params.id;
  var gw = req.params.gw;
  pool.getConnection (function(connErr,conn) {
    if(connErr) {

    }
    else {
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
    }
    conn.release();
  });
});

module.exports = router;
