var db = require('../database');

exports.run = function (discord, bot, args, member, channel) {
    var userObj = {
        user: member.id,
        guild: member.guild.id
    };
    db.putUserObj(userObj);
    console.log(`New user put in using values ${member.id} and ${member.guild.id}`);
}