var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost:8080',
  user     : 'fflive',
  password : 'football',
  database : 'FFLiveDev'
});
