var db = require('../database');
var util = require('./../util');

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, data => {
        if(data == null){
            channel.send(util.noAccountMessage());
            return;
        }
        var woodcuttingEmbed = new discord.RichEmbed()
        .setTimestamp()
        .setColor([244, 194, 66])
        .setDescription(`Began woodcutting!`)
        .setAuthor("Task Change", bot.user.displayAvatarURL)
        .setFooter(member.displayName, member.user.avatarURL);

        data.task = "woodcutting";
        db.updateUserObj(data);
        
        channel.send(woodcuttingEmbed);
    })

}