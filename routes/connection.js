var mysql = require('mysql');
require('log-timestamp');

var connection = mysql.createConnection({
    host        : '127.0.0.1',
    port        : 8080,
    user        : 'matt',
    password    : 'password',
    database    : 'FFLiveDev'
});

connection.connect(function(err) {
  if (err) {
    console.error('Error Connecting: ' + err.stack);
    return;
  }
  else {
    console.log('Connected to MySQL Server!');

    connection.query('CREATE TABLE IF NOT EXISTS dashboard (time TIMESTAMP, ip VARCHAR(100), page VARCHAR(40000), connections INT)', function (dashErr) {
      if (dashErr) {
        console.log('Error Creating Dashboard Table...');
        console.log(util.inspect(dashErr));
      }
      else {
        console.log('Dashboard Logging Ready!');
      }
    });
  }
});

module.exports = exports = connection;
