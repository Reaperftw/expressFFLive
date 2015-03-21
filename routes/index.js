var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var conn = require('./connection');
var util = require('util');
require('log-timestamp');

function getStats (gameweek, callback) {
  var globalErr = false;
  var stats = new Object();
  //Get top Team GW
  conn.query('SELECT managerID, teamName, gw FROM teamsGW' + gameweek + ' ORDER BY gw DESC', function(err, gwScore) {
    if (err) {
      console.log(util.inspect(err));
      globalErr = true;
      callback(globalErr);
    }
    else {
      stats.topGW = gwScore[0];
      //Top OP Score
      conn.query('SELECT managerID, teamName, liveOP FROM teamsGW' + gameweek + ' ORDER BY liveOP DESC', function(err1, OPScore) {
        if (err1) {
          console.log(util.inspect(err1));
          globalErr = true;
          callback(globalErr);
        }
        else {
          stats.topOP = OPScore[0];
          //Top Player
          conn.query('SELECT webName, score, playerCount, teamID, teamName, gameweekBreakdown FROM playersGW' + gameweek + ' WHERE playerID != -1 ORDER BY score DESC', function(err2, playerScore) {
            if (err2) {
              console.log(util.inspect(err2));
              globalErr = true;
              callback(globalErr);
            }
            else {
              //Parse the Gameweek Breakdown
              playerScore[0].breakdown = JSON.parse(playerScore[0].gameweekBreakdown);
              stats.topPlayer = playerScore[0];
              //Popular Players
              conn.query('SELECT webName, score, playerCount, teamID, teamName, gameweekBreakdown FROM playersGW' + gameweek + ' ORDER BY playerCount DESC', function(err3, playerCounts) {
                if (err3) {
                  console.log(util.inspect(err3));
                  globalErr = true;
                  callback(globalErr);
                }
                else {
                  //Parse the Gameweek Breakdown
                  playerCounts[0].breakdown = JSON.parse(playerCounts[0].gameweekBreakdown);
                  stats.playerCount = playerCounts[0];
                  //Number Of Teams
                  conn.query('SELECT count(*) AS teamCount FROM teamsGW' + gameweek, function(err4, teamCount) {
                    if(err4) {
                      console.log(util.inspect(err4));
                      globalErr = true;
                      callback(globalErr);
                    }
                    else {
                      stats.totalTeams = teamCount[0].teamCount;
                      //Best Bench Score
                      conn.query('SELECT managerID, teamName, benchScore FROM teamsGW' + gameweek + ' ORDER BY benchScore DESC', function(err5, benchScore) {
                        if(err5) {
                          console.log(util.inspect(err5));
                          globalErr = true;
                          callback(globalErr);
                        }
                        else {
                          stats.topBench = benchScore[0];
                          //Transfer Activity
                          //conn.query('SELECT ')
                          callback(globalErr, stats);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
}

/* GET home page. */
router.get('/', function(req, res) {

  console.log('');
  //console.log(util.inspect(req));
  //Get league List
  conn.query('SELECT * FROM leagues', function(err, lRows) {
    if (err) {
      console.log(util.inspect(err));
      res.render('404error');
    }
    else {
    //Get status list
    conn.query('SELECT * FROM webFront where page="index"', function(fail, wfRows) {
      if (fail) {
        console.log(util.inspect(fail));
        res.render('404error');
      }
      else {
          //Get interesting stats
          getStats (wfRows[0].currGameweek, function (err, stats) {
            if(err) {
              res.render('404error');
            }
            else {
              //console.log(util.inspect(stats));
              res.render('index', {title: 'FFLive', 'leagues': lRows, 'status': wfRows[0].status, 'gameweek':wfRows[0].currGameweek, 'stats': stats});
            }
          });
        }
      });
    }
  });
});

module.exports = router;
