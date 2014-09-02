var express = require('express');
var router = express.Router();
var conn = require('./connection');
require('log-timestamp');


router.get('/:id/:gw', function(req, res) {
  var id = req.params.id;
  var gw = req.params.gw;
  console.log('');
  conn.query('SELECT n.*, t.*, m.* FROM fflivedev.leagues_teamsgw' + gw + ' AS t, fflivedev.teamsgw' + gw + ' AS m , fflivedev.leagues AS n WHERE t.managerID = m.managerID AND n.ID = ' + id + ' AND n.ID = t.leagueID', function (err, allTeams) {
    if (err) {
      console.log(util.inspect(err));
      res.render('404error');
      return;
    }

    res.render('allTeams', {title: 'FFLive - All Teams for ' + allTeams[0].leagueName + ' for GW:' + gw, 'teams':allTeams });
  });
});



module.exports = router;
