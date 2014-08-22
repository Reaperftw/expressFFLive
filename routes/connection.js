var mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : 8080,
    user     : 'matt',
    password : 'password',
    database : 'FFLiveDev'
});

module.exports = exports = connection;
