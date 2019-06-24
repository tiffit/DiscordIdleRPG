var mysql = require('mysql');

var connection;

exports.init = function(config){
    connection = mysql.createConnection({
    host: config.dbaddress,
    user: config.dbusername,
    password: config.dbpassword
    });
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Database!");
    });
}