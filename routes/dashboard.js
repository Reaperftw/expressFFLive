var express = require('express');
var router = express.Router();
require('log-timestamp');

//Get Dashboard
router.get('/', function(req, res) {
  console.log('');
  conn.query("");  
  res.render('dashboard', {title: 'FFLive Dashboard'});
});

module.exports = router;
