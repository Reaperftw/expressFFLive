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
  }
});

module.exports = exports = connection;
