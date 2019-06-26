const db = require('../database');
const util = require('../util');

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if(data == null){
            channel.send(util.noAccountMessage());
            return;
        }
        const embed = new discord.RichEmbed()
                .setTimestamp()
                .setColor([224, 156, 31])
                .setAuthor("Player Info", bot.displayAvatarURL)
                .setFooter("", bot.displayAvatarURL)
                .addField("Gold", data.gold, true);
        channel.send(embed);
    });
    
}