var db = require('../database')

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(args[0], args[1], (data) => {
        channel.send(JSON.stringify(data));
    });
    
}