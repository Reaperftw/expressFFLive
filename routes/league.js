var express = require('express');
var router = express.Router();
var conn = require('./connection');
var util = require('util');
require('log-timestamp');

router.get('/:id/:gw', function(req, res) {
  var id = req.params.id;
  var gw = req.params.gw;
  console.log('');
  conn.query('SELECT name, type from leagues WHERE ID =' + id, function (err, nameRows) {
    //console.log(util.inspect(nameRows));
    if (err || nameRows.length == 0) {
      console.log(util.inspect(err));
      res.render('404error');
      return;
    }
    var leagueType = nameRows[0].type;
    //var type = nameRows[0].type;
    if (leagueType === 'Classic') {
      conn.query('SELECT t.*, m.* FROM leagues_teamsGW' + gw + ' AS t, teamsGW' + gw +
      ' AS m WHERE t.managerID = m.managerID AND t.leagueID = ' + id + ' ORDER BY t.livePosition ASC', function(err1, rows) {
        if (err1) {
          console.log(util.inspect(err1));
          res.render('404error');
          return;
        }

        res.render('leagueCL', {title: 'FFLive - ' + nameRows[0].name, 'id':id, 'gameweek': gw, 'teams':rows });
      });
    }
    else if (leagueType === 'H2H') {
      conn.query('SELECT t.*, m.* FROM leagues_teamsGW' + gw + ' AS t, teamsGW' + gw +
      ' AS m WHERE t.managerID = m.managerID AND t.leagueID = ' + id + ' ORDER BY t.livePosition ASC', function(err2, rows) {

        if (err2) {
          console.log(util.inspect(err2));
          res.render('404error');
          return;
        }
        conn.query('SELECT t.home, m.gw, m.managerName, m.teamName, m.managerID FROM H2HGW' + gw +
        ' AS t, teamsGW' + gw + ' AS m WHERE t.home = m.managerID AND t.leagueID = ' + id, function(err3, homeFix) {
          if(err3) {
            console.log(util.inspect(err3));
            res.render('404error');
            return;
          }
          conn.query('SELECT t.away, m.gw, m.managerName, m.teamName, m.managerID FROM H2HGW' + gw +
          ' AS t, teamsGW' + gw + ' AS m WHERE t.away = m.managerID AND t.leagueID = ' + id, function(err4, awayFix) {
            if(err4) {
              console.log(util.inspect(err4));
              res.render('404error');
              return;
            }
            res.render('leagueH2H', {title: 'FFLive - ' + nameRows[0].name,'id':id, 'gameweek': gw, 'teams':rows, 'away':awayFix, 'home':homeFix});
          });
        });
      });
    }
    else {
      res.render('404error');
    }
  });
});




module.exports = router;
