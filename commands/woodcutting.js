var util = require('./../util');
const db = require('../database');

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, data => {
        if(data == null){
            channel.send(util.noAccountMessage());
            return;
        }
        util.attemptSetTask(discord, bot, member, channel, data, "woodcutting", "Axe");
    })

}