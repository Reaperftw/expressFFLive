var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : '192.168.1.100',
    port     : 3306,
    user     : 'fflive',
    password : 'football',
    database : 'FFLive'
});

module.exports = exports = connection;
