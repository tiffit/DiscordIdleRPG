var db = require('../database');

exports.run = function (discord, bot, args, member, channel) {

    var woodcuttingEmbed = new discord.RichEmbed()
    .setTimestamp()
    .setColor([244, 194, 66])
    .setDescription(`Began woodcutting!`)
    .setAuthor("Task Change", bot.user.displayAvatarURL)
    .setFooter(member.displayName, member.user.avatarURL);

    db.getUserObj(member.id, member.guild.id, data => {
        data.task = "woodcutting"
        db.updateUserObj(data);
    })

    channel.send(woodcuttingEmbed);
}