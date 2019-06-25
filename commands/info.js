var db = require('../database')

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if(data == null){
            channel.send("You have not begun your adventure! Type `$start` to begin!");
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