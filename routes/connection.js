var mysql = require('mysql');
require('log-timestamp');

var connection = mysql.createConnection({
    host        : '192.168.1.100',
    port        : 3306,
    user        : 'fflive',
    password    : 'football',
    database    : 'FFLive'
});

connection.connect(function(err) {
  if (err) {
    console.error('/nError Connecting: ' + err.stack);
    return;
  }

  console.log('Connected to MySQL Server!');
});

module.exports = exports = connection;
