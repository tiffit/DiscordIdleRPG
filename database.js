var mysql = require('mysql');

var connection;

exports.init = function(secret){
    connection = mysql.createConnection({
    host: secret.dbaddress,
    user: secret.dbusername,
    password: secret.dbpassword
    });
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Database!");
    });
}