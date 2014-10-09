var express = require('express');
var router = express.Router();
var conn = require('./connection');
var util = require('util');

function allTeams(leagueID, gw, response) {
  var teamErr = false;
  conn.query('SELECT managerID, leagueID FROM leagues_teamsGW' + gw + ' WHERE leagueID =' + leagueID, function (err10, teams) {
    if(err10) {
      console.log(util.inspect(err10));
      teamErr = true;
      callback(teamErr);
    }
    else {
      //console.log(util.inspect(teams));
      var allTeams = new Object();
      //console.log(util.inspect(teams));
      for(var row = 0; row < teams.length; row++) {

        //console.log("for " + util.inspect(row));
        //console.log("for " + util.inspect(teams[row]));
        //console.log("for " + teams[row].managerID);
        var dataCount = 0;
        getAllTeamData(String(teams[row].managerID), gw, function (err, teamData, manID) {
          //console.log("In Callback " + util.inspect(teamData));
          if(err) {
            //console.log("Err");
            console.log(util.inspect(err));
            teamErr = true;
            response(teamErr);
          }
          else {
            //console.log("Else ");
            dataCount ++;
            //console.log("Else " + util.inspect(row));
            //console.log("Else " + util.inspect(teams[row]));
            //console.log("Else " + teams[row].managerID);
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

function getAllTeamData(managerID, gw, callback) {
  var globalErr = false;
  var allTeamData = new Object();
  //console.log("inFunction " + managerID + " " + gw)
  //Get Team Info
  conn.query('SELECT managerName, teamName, gw, liveOP, managerID, transfers, deductions, benchScore FROM teamsGW' + gw +
  ' WHERE managerID = ' + managerID, function (err, teamInfo) {
    if (err) {
      console.log(util.inspect(err));
      globalErr = true;
      callback(globalErr);
    }
    else {
    //Get League Info
      conn.query('SELECT * FROM leagues_teamsGW' + gw +
      ' JOIN leagues ON leagues_teamsGW' + gw + '.leagueID = leagues.ID WHERE managerID = ' + managerID, function (err0, leagueInfo) {
        if (err0) {
          console.log(util.inspect(err0));
          globalErr = true;
          callback(globalErr);
        }
        else {
        //Get Gk
          conn.query('SELECT * FROM playersGW' + gw + ' JOIN teamsGW' + gw +
          ' ON playersGW' + gw + '.playerID = teamsGW' + gw + '.GkID ' +
          ' WHERE teamsGW' + gw + '.managerID = ' + managerID, function (err1, gkRows) {
            if (err1) {
              console.log(util.inspect(err1));
              globalErr = true;
              callback(globalErr);
            }
            else {
              //Get Def
              conn.query('SELECT * FROM playersGW' + gw + ' JOIN teamsGW' + gw +
              ' ON playersGW' + gw + '.playerID = teamsGW' + gw + '.DefID1 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.DefID2 ' +
              ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.DefID3 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.DefID4 ' +
              ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.DefID5 WHERE teamsGW' + gw + '.managerID = ' + managerID, function (err2, defRows) {
                if (err2) {
                  console.log(util.inspect(err2));
                  globalErr = true;
                  callback(globalErr);
                }
                else {
                  //Get Mid
                  conn.query('SELECT * FROM playersGW' + gw + ' JOIN teamsGW' + gw +
                  ' ON playersGW' + gw + '.playerID = teamsGW' + gw + '.MidID1 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.MidID2 ' +
                  ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.MidID3 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.MidID4 ' +
                  ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.MidID5 WHERE teamsGW' + gw + '.managerID = ' + managerID, function (err3, midRows) {
                    if (err3) {
                      console.log(util.inspect(err3));
                      globalErr = true;
                      callback(globalErr);
                    }
                    else {
                      //Get For
                      conn.query('SELECT * FROM playersGW' + gw + ' JOIN teamsGW' + gw +
                      ' ON playersGW' + gw + '.playerID = teamsGW' + gw + '.ForID1 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.ForID2 ' +
                      ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.ForID3 WHERE teamsGW' + gw + '.managerID = ' + managerID, function (err4, forRows) {
                        if (err4) {
                          console.log(util.inspect(err4));
                          globalErr = true;
                          callback(globalErr);
                        }
                        else {
                          //Get Bench
                          conn.query('SELECT * FROM playersGW' + gw + ' JOIN teamsGW' + gw +
                          ' ON playersGW' + gw + '.playerID = teamsGW' + gw + '.BenchID1 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.BenchID2 ' +
                          ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.BenchID3 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.BenchID4 ' +
                          ' WHERE teamsGW' + gw + '.managerID = ' + managerID, function (err5, benchRows) {
                            if (err5) {
                              console.log(util.inspect(err5));
                              globalErr = true;
                              callback(globalErr);
                            }
                            else {
                              allTeamData.teamInfo = teamInfo;
                              allTeamData.leagueInfo = leagueInfo;
                              allTeamData.gkRows = gkRows;
                              allTeamData.defRows = defRows;
                              allTeamData.midRows = midRows;
                              allTeamData.forRows = forRows;
                              allTeamData.benchRows = benchRows;
                              callback(globalErr, allTeamData, managerID);
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
  });
}


router.get('/:id/:gw', function(req, res) {
  var id = req.params.id;
  var gw = req.params.gw;
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
          res.render('leagueTeams', {title: 'FFLive - All Teams for "' + name[0].name + '" for GW:' + gw, 'allData': allData, 'gameweek':gw});
        }
      });
    }
  });
});





module.exports = router;
