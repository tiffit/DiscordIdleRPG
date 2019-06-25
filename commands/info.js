var db = require('../database')

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        channel.send(JSON.stringify(data));
    });
    
}