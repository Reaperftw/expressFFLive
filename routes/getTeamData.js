var conn = require('./connection');
require('log-timestamp');
var util = require('util');


function getAllTeamData(managerID, gw, callback) {
  var globalErr = false;
  var allTeamData = new Object();
  //Get Team Info
  conn.query('SELECT managerName, teamName, gw, liveOP, managerID, transfers, deductions, benchScore, transferIn, transferOut FROM teamsGW' + gw +
  ' WHERE managerID = ' + managerID, function (err, teamInfo) {
    if (err) {
      console.log(util.inspect(err));
      globalErr = true;
    }
    else {
    //Get League Info
      conn.query('SELECT * FROM leagues_teamsGW' + gw +
      ' JOIN leagues ON leagues_teamsGW' + gw + '.leagueID = leagues.ID WHERE managerID = ' + managerID, function (err0, leagueInfo) {
        if (err0) {
          console.log(util.inspect(err0));
          globalErr = true;
        }
        else {
        //Get Gk
          conn.query('SELECT playerID, webName, score, gameweekBreakdown, teamID, currentFixture, nextFixture, status, news, captainID, viceCaptainID' +
          ' FROM playersGW' + gw + ' JOIN teamsGW' + gw +
          ' ON playersGW' + gw + '.playerID = teamsGW' + gw + '.GkID ' +
          ' WHERE teamsGW' + gw + '.managerID = ' + managerID, function (err1, gkRows) {
            if (err1) {
              console.log(util.inspect(err1));
              globalErr = true;
            }
            else {
              for (n in gkRows) {
                gkRows[n].breakdown = JSON.parse(gkRows[n].gameweekBreakdown);
              }

              //Get Def
              conn.query('SELECT playerID, webName, score, gameweekBreakdown, teamID, currentFixture, nextFixture, status, news, captainID, viceCaptainID' +
              ' FROM playersGW' + gw + ' JOIN teamsGW' + gw +
              ' ON playersGW' + gw + '.playerID = teamsGW' + gw + '.DefID1 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.DefID2 ' +
              ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.DefID3 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.DefID4 ' +
              ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.DefID5 WHERE teamsGW' + gw + '.managerID = ' + managerID, function (err2, defRows) {
                if (err2) {
                  console.log(util.inspect(err2));
                  globalErr = true;
                }
                else {
                  for (n in defRows) {
                    defRows[n].breakdown = JSON.parse(defRows[n].gameweekBreakdown);
                  }

                  //Get Mid
                  conn.query('SELECT playerID, webName, score, gameweekBreakdown, teamID, currentFixture, nextFixture, status, news, captainID, viceCaptainID' +
                  ' FROM playersGW' + gw + ' JOIN teamsGW' + gw +
                  ' ON playersGW' + gw + '.playerID = teamsGW' + gw + '.MidID1 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.MidID2 ' +
                  ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.MidID3 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.MidID4 ' +
                  ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.MidID5 WHERE teamsGW' + gw + '.managerID = ' + managerID, function (err3, midRows) {
                    if (err3) {
                      console.log(util.inspect(err3));
                      globalErr = true;
                    }
                    else {
                      for (n in midRows) {
                        midRows[n].breakdown = JSON.parse(midRows[n].gameweekBreakdown);
                      }

                      //Get For
                      conn.query('SELECT playerID, webName, score, gameweekBreakdown, teamID, currentFixture, nextFixture, status, news, captainID, viceCaptainID' +
                      ' FROM playersGW' + gw + ' JOIN teamsGW' + gw +
                      ' ON playersGW' + gw + '.playerID = teamsGW' + gw + '.ForID1 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.ForID2 ' +
                      ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.ForID3 WHERE teamsGW' + gw + '.managerID = ' + managerID, function (err4, forRows) {
                        if (err4) {
                          console.log(util.inspect(err4));
                          globalErr = true;
                        }
                        else {
                          for (n in forRows) {
                            forRows[n].breakdown = JSON.parse(forRows[n].gameweekBreakdown);
                          }
                          //Get Bench
                          conn.query('SELECT playerID, webName, score, gameweekBreakdown, teamID, currentFixture, nextFixture, status, news, captainID, viceCaptainID, BenchID1, BenchID2, BenchID3, BenchID4' +
                          ' FROM playersGW' + gw + ' JOIN teamsGW' + gw +
                          ' ON playersGW' + gw + '.playerID = teamsGW' + gw + '.BenchID1 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.BenchID2 ' +
                          ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.BenchID3 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.BenchID4 ' +
                          ' WHERE teamsGW' + gw + '.managerID = ' + managerID, function (err5, benchRows) {
                            if (err5) {
                              console.log(util.inspect(err5));
                              globalErr = true;
                            }
                            else {
                              for (n in benchRows) {
                                benchRows[n].breakdown = JSON.parse(benchRows[n].gameweekBreakdown);
                              }
                              //GetTransfers
                              //console.log(util.inspect(teamInfo));
                              //console.log(util.inspect(teamInfo[0].transferIn));
                              var transferIn = teamInfo[0].transferIn.split(',');

                              //console.log(util.inspect(teamInfo[0].transferOut));
                              //Stops the SQL Load Failing
                              if(teamInfo[0].transferOut.valueOf() === 'NONE') {
                                  teamInfo[0].transferOut = '"NONE"'
                              }
                              conn.query('SELECT playerID, webName, score, gameweekBreakdown, teamID, currentFixture, nextFixture, status, news' +
                              ' FROM playersGW' + gw + ' WHERE playerID IN (' + teamInfo[0].transferOut + ')', function (err6, transfersOut){
                               if(err6) {
                                 console.log(util.inspect(err6));
                                 globalErr = true;
                               }
                               else {
                                 //console.log(util.inspect(transfersOut));
                                 //Parse
                                 for (n in transfersOut) {
                                   transfersOut[n].breakdown = JSON.parse(transfersOut[n].gameweekBreakdown);
                                 }

                                 //Sort the bench into order
                                 var benchTemp = new Object(), bench = new Object();
                                 //Gives them a name for position
                                 for (var n = 0; n < 4; n++) {
                                   if(benchRows[n].BenchID1 == benchRows[n].playerID) {
                                     benchTemp.bench1 = benchRows[n];
                                   }
                                   else if(benchRows[n].BenchID2 == benchRows[n].playerID) {
                                     benchTemp.bench2 = benchRows[n];
                                   }
                                   else if(benchRows[n].BenchID3 == benchRows[n].playerID) {
                                     benchTemp.bench3 = benchRows[n];
                                   }
                                   else if(benchRows[n].BenchID4 == benchRows[n].playerID) {
                                     benchTemp.bench4 = benchRows[n];
                                   }
                                 }
                                 //Finds the position and incerts in order
                                 for(var n = 1; n < 5; n++) {
                                   var id = 'bench' + n;
                                   bench[id] = benchTemp[id];
                                 }

                                 allTeamData.teamInfo = teamInfo;
                                 allTeamData.leagueInfo = leagueInfo;

                                 var rows = new Object();
                                 rows.gkRows = gkRows;
                                 rows.defRows = defRows;
                                 rows.midRows = midRows;
                                 rows.forRows = forRows;

                                 var transfers = new Object();
                                 transfers.transferIn = transferIn;
                                 transfers.transferOut= transfersOut;
                                 
                                 allTeamData.transfers = transfers;
                                 allTeamData.fieldRows = rows;


                                 allTeamData.benchRows = bench;
                                 //console.log(util.inspect(allTeamData));
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
  });
}


module.exports = exports = getAllTeamData;
