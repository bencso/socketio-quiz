const mysql = require('mysql');

// Adatbázis beállítás
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'project',
    multipleStatements: true
});

module.exports = connection;