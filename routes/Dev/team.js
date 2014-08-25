var express = require('express');
var router = express.Router();
var conn = require('../connection');

router.get('/:id/:gw', function(req, res) {
  var id = req.params.id;
  var gw = req.params.gw;
  //conn.query('', function (err, allTeams) {
  //  if (err) {
  //    console.log(util.inspect(err));
  //    res.render('404error');
  //    return;
  //  }

    res.render('Dev/team', {title: 'FFLive - This Team for GW:' + gw});
  //});
});



module.exports = router;
