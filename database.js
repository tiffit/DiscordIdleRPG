var mysql = require('mysql');

var connection;

/**
 * @desc initializes database connection.
 * @param {Object} secret Secret config that should never be pushed.
 */
exports.init = function(secret){
    console.log(`test`);
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


/**
 * @desc gets the entire user object and sends it back through callback.
 * @param {Number} userId Unique ID that is passed to identify a specific user.
 * @param {Number} guildId Unique ID that is passed to identify which guild the user is sending the message from.
 */
exports.getUserObj = (userId, guildId, callback) => {
    var query = `SELECT * FROM rpgidle.users WHERE user=${userId} AND guild=${guildId}`

    connection.query(query, (err, result, fields) => {
        if (err) throw err;
        if (callback) callback(result)
    })
}

/**
 * @desc inserts a new user in to database.
 * @param {Object} userObj Object containing userId and userGuild.
 */
exports.putUserObj = (userObj) => {
    var query = `INSERT INTO rpgidle.users (user, guild) VALUES ?`
    values = [
        [userObj.user, userObj.guild]
    ]
    connection.query(query, [values], (err, res) => {
        if (err) throw err;
        console.log(res);
    })
}