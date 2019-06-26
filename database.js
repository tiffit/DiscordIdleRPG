var mysql = require('mysql');

var connection;

/**
 * @desc initializes database connection.
 * @param {Object} secret Secret config that should never be pushed.
 */
exports.init = function(secret){
    connection = mysql.createConnection({
    host: secret.dbaddress,
    user: secret.dbusername,
    password: secret.dbpassword,
    database: secret.dbname
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
    var query = `SELECT * FROM users WHERE user=${userId} AND guild=${guildId}`

    connection.query(query, (err, result, fields) => {
        if (err) throw err;
        var res = result[0];
        res.inventory = JSON.parse(res.inventory);
        res.backpack = JSON.parse(res.backpack);
        res.perks = JSON.parse(res.perks);
        if (callback) callback(res)
    })
}

exports.getAllUsers = (callback) => {
    query = `SELECT * FROM users`;

    connection.query(query, (err, result, fields) => {
        if (err) throw err;
        if (callback) callback(result);
    })
}

/**
 * @desc inserts a new user in to database.
 * @param {Object} userObj Object containing userId and userGuild.
 */
exports.insertUserObj = (userObj) => {
    var query = `INSERT INTO users (user, guild, inventory, backpack, perks) VALUES ?`
    var defaultInventory = {
        equipped: {
            Axe: "axe_0"
        }
    }
    values = [
        [userObj.user, userObj.guild, JSON.stringify(defaultInventory), "{}", "{}"]
    ]
    connection.query(query, [values], (err, res) => {
        if (err) throw err;
    })
}

exports.updateUserObj = (userObj) => {
    var query = `UPDATE users SET ? WHERE user=${userObj.user} AND guild=${userObj.guild}`;
    values = {
        inventory: JSON.stringify(userObj.inventory),
        backpack: JSON.stringify(userObj.backpack),
        task: userObj.task,
        gold: userObj.gold,
        perks: JSON.stringify(userObj.perks)
    }
    connection.query(query, [values], (err, res) => {
        if (err) throw err;
    })
}