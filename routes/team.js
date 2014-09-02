var express = require('express');
var router = express.Router();
var conn = require('./connection');
var util = require('util');
require('log-timestamp');

router.get('/:id/:gw', function(req, res) {
  var id = req.params.id;
  var gw = req.params.gw;
  console.log('');
  conn.query('SELECT managerName, teamName, gw, liveOP, managerID FROM teamsGW' + gw +
  ' WHERE managerID = ' + id, function (err, teamInfo) {
    if (err) {
      console.log(util.inspect(err));
      res.render('404error');
      return;
    }

    conn.query('SELECT * FROM leagues_teamsGW' + gw +
    ' JOIN leagues ON leagues_teamsGW' + gw + '.leagueID = leagues.ID WHERE managerID = ' + id, function (err0, leagueInfo) {
      if (err0) {
        console.log(util.inspect(err0));
        res.render('404error');
        return;
      }

      conn.query('SELECT * FROM playersGW' + gw + ' JOIN teamsGW' + gw +
      ' ON playersGW' + gw + '.playerID = teamsGW' + gw + '.GkID ' +
      ' WHERE teamsGW' + gw + '.managerID = ' + id, function (err, gkRows) {
        if (err) {
          console.log(util.inspect(err));
          res.render('404error');
          return;
        }

        conn.query('SELECT * FROM playersGW' + gw + ' JOIN teamsGW' + gw +
        ' ON playersGW' + gw + '.playerID = teamsGW' + gw + '.DefID1 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.DefID2 ' +
        ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.DefID3 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.DefID4 ' +
        ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.DefID5 WHERE teamsGW' + gw + '.managerID = ' + id, function (err1, defRows) {
          if (err1) {
            console.log(util.inspect(err1));
            res.render('404error');
            return;
          }

          conn.query('SELECT * FROM playersGW' + gw + ' JOIN teamsGW' + gw +
          ' ON playersGW' + gw + '.playerID = teamsGW' + gw + '.MidID1 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.MidID2 ' +
          ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.MidID3 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.MidID4 ' +
          ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.MidID5 WHERE teamsGW' + gw + '.managerID = ' + id, function (err2, midRows) {
            if (err2) {
              console.log(util.inspect(err2));
              res.render('404error');
              return;
            }

            conn.query('SELECT * FROM playersGW' + gw + ' JOIN teamsGW' + gw +
            ' ON playersGW' + gw + '.playerID = teamsGW' + gw + '.ForID1 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.ForID2 ' +
            ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.ForID3 WHERE teamsGW' + gw + '.managerID = ' + id, function (err3, forRows) {
              if (err3) {
                console.log(util.inspect(err3));
                res.render('404error');
                return;
              }

              conn.query('SELECT * FROM playersGW' + gw + ' JOIN teamsGW' + gw +
              ' ON playersGW' + gw + '.playerID = teamsGW' + gw + '.BenchID1 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.BenchID2 ' +
              ' OR playersGW' + gw + '.playerID = teamsGW' + gw + '.BenchID3 OR playersGW' + gw + '.playerID = teamsGW' + gw + '.BenchID4 ' +
              ' WHERE teamsGW' + gw + '.managerID = ' + id, function (err4, benchRows) {
                if (err4) {
                  console.log(util.inspect(err4));
                  res.render('404error');
                  return;
                }

                res.render('Dev/team', {title: 'FFLive - "' + teamInfo[0].teamName + '" for GW:' + gw, 'gameweek': gw, 'teamInfo': teamInfo, 'leagueInfo': leagueInfo, 'gk': gkRows, 'defenders': defRows, 'midfield': midRows, 'forwards': forRows, 'bench': benchRows});
              });
            });
          });
        });
      });
    });
  });
});



module.exports = router;
