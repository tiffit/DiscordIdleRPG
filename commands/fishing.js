var db = require('../database');
var util = require('../util');

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, data => {
        if (data == null) {
            channel.send(util.noAccountMessage());
            return;
        }
        var fishingEmbed = new discord.RichEmbed()
            .setTimestamp()
            .setColor([244, 194, 66])
            .setDescription(`Began fishing!`)
            .setAuthor("Task Change", bot.user.displayAvatarURL)
            .setFooter(member.displayName, member.user.avatarURL);

        data.task = "fishing";
        db.updateUserObj(data);

        channel.send(fishingEmbed);
    })
}