var db = require('../database');
var taskHandler = require('./taskHandler')
exports.run = function (discord, bot, args, member, channel) {

    var woodcuttingEmbed = new discord.RichEmbed()
    .setTimestamp()
    .setColor([244, 194, 66])
    .setDescription(`Began woodcutting.`)
    .setAuthor("Status Update!", bot.user.displayAvatarURL)
    .setFooter(`Type $endtask to quit. To check the cache, $backpack`, member.user.avatarURL);

    db.getUserObj(member.id, member.guild.id, data => {
        data.task = "woodcutting"
        db.updateUserObj(data);

        
    })

    channel.send(woodcuttingEmbed);
}